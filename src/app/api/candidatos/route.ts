import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    if (session.tipoCuenta !== "candidato") {
      return NextResponse.json(
        {
          success: false,
          error: "Solo los usuarios candidatos pueden crear este perfil",
        },
        { status: 403 }
      );
    }

    const userId = session.id;
    const data = await request.json();
    const {
      nombre_apellido,
      descripcion,
      fecha_nacimiento,
      telefono,
      pais,
      provincia,
      ciudad,
      direccion,
      areas_interes,
      disponibilidad,
      remuneracion_pretendida,
      linkedin,
      twitter,
      instagram,
      tiktok,
      positions,
      companies,
    } = data;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `DELETE FROM candidate_positions
         WHERE candidate_id IN (SELECT id FROM candidates WHERE user_id = ?)`,
        [userId]
      );
      await connection.query(
        `DELETE FROM candidate_companies
         WHERE candidate_id IN (SELECT id FROM candidates WHERE user_id = ?)`,
        [userId]
      );
      await connection.query(`DELETE FROM candidates WHERE user_id = ?`, [userId]);

      const [result]: any = await connection.query(
        `INSERT INTO candidates (
          user_id, nombre_apellido, descripcion, fecha_nacimiento, telefono, pais,
          provincia, ciudad, direccion, areas_interes, disponibilidad,
          remuneracion_pretendida, linkedin, twitter, instagram, tiktok
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          nombre_apellido,
          descripcion,
          fecha_nacimiento,
          telefono,
          pais || "",
          provincia,
          ciudad,
          direccion,
          areas_interes,
          disponibilidad,
          remuneracion_pretendida || 0,
          linkedin || "",
          twitter || "",
          instagram || "",
          tiktok || "",
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

      const [userRows]: any = await connection.query(
        `SELECT approval_status FROM users WHERE id = ?`,
        [userId]
      );

      await connection.commit();
      return NextResponse.json({
        success: true,
        id: candidateId,
        approvalStatus: userRows[0]?.approval_status || "pending",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
