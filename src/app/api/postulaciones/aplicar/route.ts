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

    const { id: userId, tipoCuenta } = session;

    if (tipoCuenta !== "candidato") {
      return NextResponse.json(
        { success: false, error: "Solo los candidatos pueden aplicar" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { jobId } = data;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Falta ID de trabajo" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      const [users]: any = await connection.query(
        `SELECT approval_status FROM users WHERE id = ?`,
        [userId]
      );

      if (users.length === 0 || users[0].approval_status !== "approved") {
        return NextResponse.json(
          {
            success: false,
            error: "Tu perfil aun esta pendiente de aprobacion del administrador.",
          },
          { status: 403 }
        );
      }

      const [jobs]: any = await connection.query(
        `SELECT id
         FROM job_postings
         WHERE id = ? AND is_active = 1 AND approval_status = 'approved'`,
        [jobId]
      );

      if (jobs.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "La oferta no esta disponible o aun no fue aprobada.",
          },
          { status: 404 }
        );
      }

      await connection.query(
        `INSERT INTO applications (user_id, job_id, status) VALUES (?, ?, 'Enviada')`,
        [userId, jobId]
      );

      return NextResponse.json({
        success: true,
        message: "Aplicacion enviada",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, error: "Ya te has postulado a este empleo." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
