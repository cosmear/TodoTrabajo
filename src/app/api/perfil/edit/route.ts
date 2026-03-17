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
    const { 
      nombre_completo, telefono, 
      // Candidate fields
      descripcion, fecha_nacimiento, pais, provincia, ciudad, direccion,
      areas_interes, disponibilidad, remuneracion_pretendida,
      linkedin, twitter, instagram, tiktok,
      // Company specific fields
      nombre, email
    } = data;

    if (!nombre_completo && !nombre) {
        return NextResponse.json({ success: false, error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // Find user type
      const [userRows]: any = await connection.query(`SELECT tipo_cuenta FROM users WHERE id = ?`, [userId]);
      if (userRows.length === 0) return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
      const tipoCuenta = userRows[0].tipo_cuenta;

      // Update base users table
      await connection.query(
        `UPDATE users SET nombre_completo = ? WHERE id = ?`,
        [nombre_completo || nombre, userId]
      );
      
      if (tipoCuenta === 'candidato') {
          await connection.query(
            `UPDATE candidates SET 
                nombre_apellido = ?, telefono = ?, descripcion = ?, fecha_nacimiento = ?,
                pais = ?, provincia = ?, ciudad = ?, direccion = ?, areas_interes = ?,
                disponibilidad = ?, remuneracion_pretendida = ?, linkedin = ?,
                twitter = ?, instagram = ?, tiktok = ?
             WHERE user_id = ?`, 
            [
                nombre_completo, telefono || null, descripcion || '', fecha_nacimiento || null,
                pais || '', provincia || '', ciudad || '', direccion || '', areas_interes || '',
                disponibilidad || '', remuneracion_pretendida || 0, linkedin || '',
                twitter || '', instagram || '', tiktok || '', userId
            ]
          );
      } else if (tipoCuenta === 'empresa') {
          await connection.query(
            `UPDATE companies SET 
                nombre = ?, telefono = ?, descripcion = ?, email = ?,
                pais = ?, provincia = ?, ciudad = ?, direccion = ?
             WHERE user_id = ?`, 
            [
                nombre || nombre_completo, telefono || null, descripcion || '', email || '',
                pais || '', provincia || '', ciudad || '', direccion || '', userId
            ]
          );
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
