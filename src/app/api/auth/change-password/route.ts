import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'todotrabajosecret2024'); // Match your current jwt secret default
    } catch {
      return NextResponse.json({ success: false, error: "Token inválido o expirado" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Faltan datos requeridos.' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.query(
        `SELECT id, password_hash FROM users WHERE id = ?`,
        [decoded.id]
      );

      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado.' }, { status: 404 });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!isMatch) {
         return NextResponse.json({ success: false, error: 'La contraseña actual es incorrecta.' }, { status: 400 });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await connection.query(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [newPasswordHash, user.id]
      );

      return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente.' });

    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
