import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, nombreCompleto, tipoCuenta } = data;

    if (!email || !password || !nombreCompleto || !tipoCuenta) {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await pool.getConnection();

    try {
      const [result]: any = await connection.query(
        `INSERT INTO users (nombre_completo, email, password_hash, tipo_cuenta) VALUES (?, ?, ?, ?)`,
        [nombreCompleto, email, hashedPassword, tipoCuenta]
      );
      
      const token = jwt.sign(
        { id: result.insertId, email, tipoCuenta },
        process.env.JWT_SECRET || 'supersecret123',
        { expiresIn: '30d' }
      );

      return NextResponse.json({ success: true, token, user: { id: result.insertId, email, tipoCuenta, nombreCompleto } });
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
