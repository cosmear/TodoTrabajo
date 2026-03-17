import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
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

    const data = await request.json();
    const {
      nombre, descripcion, telefono, email,
      pais, provincia, ciudad, direccion
    } = data;

    const connection = await pool.getConnection();

    try {
      const [result]: any = await connection.query(
        `INSERT INTO companies (
          user_id, nombre, descripcion, telefono, email,
          pais, provincia, ciudad, direccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, nombre, descripcion, telefono, email,
          pais, provincia, ciudad, direccion
        ]
      );

      return NextResponse.json({ success: true, id: result.insertId });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: 'El email ya está registrado.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
