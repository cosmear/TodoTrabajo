import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // Check Authorization Header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    const { id: userId, tipoCuenta } = decoded;

    if (tipoCuenta !== 'candidato') {
      return NextResponse.json({ success: false, error: 'Solo los candidatos pueden aplicar' }, { status: 403 });
    }

    const data = await request.json();
    const { jobId } = data;

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Falta ID de trabajo' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.query(
        `INSERT INTO applications (user_id, job_id, status) VALUES (?, ?, 'Enviada')`,
        [userId, jobId]
      );
      return NextResponse.json({ success: true, message: 'Aplicación enviada' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: 'Ya te has postulado a este empleo.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
