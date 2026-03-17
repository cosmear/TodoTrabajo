import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');

    if (decoded.tipoCuenta !== 'admin') {
      return NextResponse.json({ success: false, error: 'Acceso denegado' }, { status: 403 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows]: any = await connection.query(
        `SELECT id, nombre_completo, email, tipo_cuenta, created_at FROM users ORDER BY created_at DESC`
      );
      return NextResponse.json({ success: true, users: rows });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ success: false, error: 'Token inválido o expirado' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
