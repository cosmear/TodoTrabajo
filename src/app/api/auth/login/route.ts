import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Faltan credenciales' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows]: any = await connection.query(
        `SELECT id, password_hash, tipo_cuenta, is_active FROM users WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 401 });
      }

      const user = rows[0];

      if (user.is_active === 0 || user.is_active === false) {
        return NextResponse.json({ success: false, error: 'Tu cuenta ha sido suspendida. Contacta a soporte.' }, { status: 403 });
      }

      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, tipoCuenta: user.tipo_cuenta },
        process.env.JWT_SECRET || 'supersecret123',
        { expiresIn: '30d' }
      );

      return NextResponse.json({ 
        success: true, 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          tipoCuenta: user.tipo_cuenta, 
          nombreCompleto: user.nombre_completo 
        } 
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
