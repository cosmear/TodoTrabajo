import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      nombre_apellido, descripcion, fecha_nacimiento, telefono, pais,
      provincia, ciudad, direccion, areas_interes, disponibilidad,
      remuneracion_pretendida, linkedin, twitter, instagram, tiktok,
      positions, companies
    } = data;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result]: any = await connection.query(
        `INSERT INTO candidates (
          nombre_apellido, descripcion, fecha_nacimiento, telefono, pais,
          provincia, ciudad, direccion, areas_interes, disponibilidad,
          remuneracion_pretendida, linkedin, twitter, instagram, tiktok
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombre_apellido, descripcion, fecha_nacimiento, telefono, pais || '',
          provincia, ciudad, direccion, areas_interes, disponibilidad,
          remuneracion_pretendida || 0, linkedin || '', twitter || '',
          instagram || '', tiktok || ''
        ]
      );

      const candidateId = result.insertId;

      if (positions && positions.length > 0) {
        const positionValues = positions.map((pos: string) => [candidateId, pos]);
        await connection.query(
          `INSERT INTO candidate_positions (candidate_id, position_name) VALUES ?`,
          [positionValues]
        );
      }

      if (companies && companies.length > 0) {
        const companyValues = companies.map((comp: string) => [candidateId, comp]);
        await connection.query(
          `INSERT INTO candidate_companies (candidate_id, company_name) VALUES ?`,
          [companyValues]
        );
      }

      await connection.commit();
      return NextResponse.json({ success: true, id: candidateId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
