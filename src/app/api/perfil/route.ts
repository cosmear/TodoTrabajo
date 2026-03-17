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
        `SELECT id, nombre_completo, email, tipo_cuenta FROM users WHERE id = ?`,
        [userId]
      );

      if (userRows.length === 0) {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
      }

      const user = userRows[0];
      let applications = [];

      // If it's a candidate, fetch jobs they applied to
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

      return NextResponse.json({ success: true, user, applications });
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
