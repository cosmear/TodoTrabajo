import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
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

    // Await params if Next.js > 14 layout changes apply, matching typical Next.js 15 pattern
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de usuario requerido' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (decoded.id.toString() === id) {
      return NextResponse.json({ success: false, error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [result]: any = await connection.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Usuario eliminado correctamente' });
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
