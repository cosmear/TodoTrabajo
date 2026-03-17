import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
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
          user_id, nombre_apellido, descripcion, fecha_nacimiento, telefono, pais,
          provincia, ciudad, direccion, areas_interes, disponibilidad,
          remuneracion_pretendida, linkedin, twitter, instagram, tiktok
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, nombre_apellido, descripcion, fecha_nacimiento, telefono, pais || '',
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
