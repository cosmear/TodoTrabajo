import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
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
          empresa, posicion, requisitos, areas,
          disponibilidad, contacto, pais, provincia,
           areas_interes, zona, direccion,
           visible_suscripcion, requiere_salario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          empresa, posicion, requisitos || '', areas,
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
