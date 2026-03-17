import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      nombre, descripcion, telefono, email,
      pais, provincia, ciudad, direccion
    } = data;

    const connection = await pool.getConnection();

    try {
      const [result]: any = await connection.query(
        `INSERT INTO companies (
          nombre, descripcion, telefono, email,
          pais, provincia, ciudad, direccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombre, descripcion, telefono, email,
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
