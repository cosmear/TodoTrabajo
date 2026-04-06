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

    if (session.tipoCuenta !== "empresa") {
      return NextResponse.json(
        {
          success: false,
          error: "Solo los usuarios empresa pueden registrar una empresa",
        },
        { status: 403 }
      );
    }

    const userId = session.id;
    const data = await request.json();
    const { nombre, descripcion, telefono, email, pais, provincia, ciudad, direccion } = data;

    const connection = await pool.getConnection();

    try {
      await connection.query(`DELETE FROM companies WHERE user_id = ?`, [userId]);

      const [result]: any = await connection.query(
        `INSERT INTO companies (
          user_id, nombre, descripcion, telefono, email,
          pais, provincia, ciudad, direccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, nombre, descripcion, telefono, email, pais, provincia, ciudad, direccion]
      );

      return NextResponse.json({ success: true, id: result.insertId });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, error: "El email ya esta registrado." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
