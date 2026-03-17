import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.query(
        `SELECT * FROM job_postings ORDER BY created_at DESC`
      );
      return NextResponse.json({ success: true, postulaciones: rows });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123') as any;
    } catch(err) {
      return NextResponse.json({ success: false, error: 'Token inválido o expirado' }, { status: 401 });
    }
    const userId = decoded.id;

    const data = await request.json();
    const {
      empresa, posicion, requisitos, areas,
      disponibilidad, contacto, pais, provincia,
      areas_interes, zona, direccion,
      visible_suscripcion, requiere_salario
    } = data;

    const connection = await pool.getConnection();

    try {
      const [result]: any = await connection.query(
        `INSERT INTO job_postings (
          user_id, empresa, posicion, requisitos, areas,
          disponibilidad, contacto, pais, provincia,
           areas_interes, zona, direccion,
           visible_suscripcion, requiere_salario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, empresa, posicion, requisitos || '', areas,
          disponibilidad, contacto, pais, provincia,
          areas_interes, zona, direccion,
          visible_suscripcion || false, requiere_salario || false
        ]
      );

      return NextResponse.json({ success: true, id: result.insertId });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
