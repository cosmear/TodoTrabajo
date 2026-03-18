import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) {
       return NextResponse.json({ success: false, error: 'Faltan datos.' }, { status: 400 });
    }
    if (newPassword.length < 6) {
       return NextResponse.json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      // 1. Find user by token and check expiration
      const [rows]: any = await connection.query(
        `SELECT id, reset_token_expires FROM users WHERE reset_token = ?`,
        [token]
      );

      if (rows.length === 0) {
         return NextResponse.json({ success: false, error: 'Token inválido o expirado.' }, { status: 400 });
      }

      const user = rows[0];
      const now = new Date();
      const expires = new Date(user.reset_token_expires);

      if (now > expires) {
         return NextResponse.json({ success: false, error: 'El enlace ha expirado. Solicita otro.' }, { status: 400 });
      }

      // 2. Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // 3. Update password and clear token
      await connection.query(
        `UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
        [passwordHash, user.id]
      );

      return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente.' });

    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
