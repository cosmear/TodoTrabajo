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
      // Find user type
      const [userRows]: any = await connection.query(`SELECT tipo_cuenta FROM users WHERE id = ?`, [userId]);
      if (userRows.length === 0) return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
      const tipoCuenta = userRows[0].tipo_cuenta;

      await connection.query(
        `UPDATE users SET nombre_completo = ? WHERE id = ?`,
        [nombre_completo, userId]
      );
      
      if (tipoCuenta === 'candidato') {
          await connection.query(`UPDATE candidates SET telefono = ?, nombre_apellido = ? WHERE user_id = ?`, [telefono || null, nombre_completo, userId]);
      } else if (tipoCuenta === 'empresa') {
          await connection.query(`UPDATE companies SET telefono = ?, nombre = ? WHERE user_id = ?`, [telefono || null, nombre_completo, userId]);
      }

      return NextResponse.json({ success: true, message: 'Perfil actualizado' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Profile edit error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
