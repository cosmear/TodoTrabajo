import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123') as any;
    } catch(err) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }
    
    // Solo empresas deberían poder acceder, pero validamos con el user_id de la oferta
    const userId = decoded.id;

    const data = await request.json();
    const { applicationId, newStatus } = data;

    if (!applicationId || !newStatus) {
       return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // Verificar que la empresa que hace la request es dueña del job posting
      const [rows]: any = await connection.query(
        `SELECT j.user_id 
         FROM applications a
         JOIN job_postings j ON a.job_id = j.id
         WHERE a.id = ?`,
        [applicationId]
      );
      
      if (rows.length === 0) {
         return NextResponse.json({ success: false, error: 'Postulación no encontrada' }, { status: 404 });
      }

      const jobOwnerId = rows[0].user_id;

      if (jobOwnerId !== userId) {
         return NextResponse.json({ success: false, error: 'No tienes permisos para modificar esta postulación' }, { status: 403 });
      }

      await connection.query(
        `UPDATE applications SET status = ? WHERE id = ?`,
        [newStatus, applicationId]
      );

      return NextResponse.json({ success: true, message: 'Estado actualizado correctamente' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
