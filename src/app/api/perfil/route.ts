import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // Check Authorization Header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    const { id: userId } = decoded;

    const connection = await pool.getConnection();

    try {
      // Get User basic info
      const [userRows]: any = await connection.query(
        `SELECT id, nombre_completo, email, tipo_cuenta, telefono, cv_url FROM users WHERE id = ?`,
        [userId]
      );

      if (userRows.length === 0) {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
      }

      const user = userRows[0];
      let applications = [];
      let companyJobs: any[] = [];

      // If it's a candidato, fetch jobs they applied to
      if (user.tipo_cuenta === 'candidato') {
        const [appRows]: any = await connection.query(
          `SELECT a.id, a.status, a.created_at, j.posicion, j.empresa, j.provincia, j.pais
           FROM applications a 
           JOIN job_postings j ON a.job_id = j.id
           WHERE a.user_id = ?
           ORDER BY a.created_at DESC`,
          [userId]
        );
        applications = appRows;
      }

      // If it's an empresa, fetch their created job postings and applicants
      if (user.tipo_cuenta === 'empresa') {
        // Fetch jobs created by this user
        const [jobsRows]: any = await connection.query(
          `SELECT * FROM job_postings WHERE user_id = ? ORDER BY created_at DESC`,
          [userId]
        );
        
        // Ensure there's an applications array for each job
        companyJobs = jobsRows.map((job: any) => ({ ...job, applications: [] }));

        if (companyJobs.length > 0) {
          const jobIds = companyJobs.map((j: any) => j.id);
          
          // Fetch candidates for these jobs joining with users table to get name and email
          const [applicantsRows]: any = await connection.query(
            `SELECT a.id as application_id, a.job_id, a.status, a.created_at, 
                    u.nombre_completo, u.email, u.telefono, u.cv_url
             FROM applications a
             JOIN users u ON a.user_id = u.id
             WHERE a.job_id IN (?)
             ORDER BY a.created_at DESC`,
            [jobIds]
          );

          // Group applicants by job_id
          applicantsRows.forEach((applicant: any) => {
             const job = companyJobs.find((j: any) => j.id === applicant.job_id);
             if (job) {
                job.applications.push(applicant);
             }
          });
        }
      }

      return NextResponse.json({ success: true, user, applications, companyJobs });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
       return NextResponse.json({ success: false, error: 'Token Inválido' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
