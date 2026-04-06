import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const location = searchParams.get("location") || "";
    const category = searchParams.get("category") || "";
    const modalities = searchParams.get("modalities") || "";

    const connection = await pool.getConnection();

    try {
      let query = `SELECT * FROM job_postings WHERE is_active = 1 AND approval_status = 'approved'`;
      const params: any[] = [];

      if (keyword) {
        query += ` AND (posicion LIKE ? OR empresa LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (location) {
        query += ` AND (provincia LIKE ? OR pais LIKE ?)`;
        params.push(`%${location}%`, `%${location}%`);
      }
      if (category) {
        query += ` AND areas_interes LIKE ?`;
        params.push(`%${category}%`);
      }
      if (modalities) {
        const modArray = modalities.split(",");
        const placeholders = modArray.map(() => "?").join(",");
        query += ` AND disponibilidad IN (${placeholders})`;
        params.push(...modArray);
      }

      query += ` ORDER BY created_at DESC`;

      const [rows]: any = await connection.query(query, params);
      return NextResponse.json({ success: true, postulaciones: rows });
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

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    if (session.tipoCuenta !== "empresa") {
      return NextResponse.json(
        {
          success: false,
          error: "Solo los usuarios empresa pueden crear puestos",
        },
        { status: 403 }
      );
    }

    const userId = session.id;
    const data = await request.json();
    const {
      empresa,
      posicion,
      requisitos,
      areas,
      disponibilidad,
      contacto,
      pais,
      provincia,
      areas_interes,
      zona,
      direccion,
      visible_suscripcion,
      requiere_salario,
    } = data;

    const connection = await pool.getConnection();

    try {
      const [result]: any = await connection.query(
        `INSERT INTO job_postings (
          user_id, empresa, posicion, requisitos, areas,
          disponibilidad, contacto, pais, provincia,
          areas_interes, zona, direccion,
          visible_suscripcion, requiere_salario, approval_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          userId,
          empresa,
          posicion,
          requisitos || "",
          areas,
          disponibilidad,
          contacto,
          pais,
          provincia,
          areas_interes,
          zona,
          direccion,
          visible_suscripcion || false,
          requiere_salario || false,
        ]
      );

      return NextResponse.json({
        success: true,
        id: result.insertId,
        approvalStatus: "pending",
      });
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
