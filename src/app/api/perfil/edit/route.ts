import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function PUT(request: Request) {
  try {
    // Check Auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }
    const userId = decoded.id;

    // Parse data
    const data = await request.json();
    const { nombre_completo, telefono } = data;

    if (!nombre_completo) {
        return NextResponse.json({ success: false, error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.query(
        `UPDATE users SET nombre_completo = ?, telefono = ? WHERE id = ?`,
        [nombre_completo, telefono || null, userId]
      );

      return NextResponse.json({ success: true, message: 'Perfil actualizado' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Profile edit error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
