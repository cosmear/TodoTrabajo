import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const companyId = parseInt(params.id, 10);
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "ID invalido" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      const [compRows]: any = await connection.query(
        `SELECT u.nombre_completo, u.email, u.is_active, c.nombre, c.descripcion, c.direccion, c.ciudad, c.provincia, c.pais, c.logo_url
         FROM users u
         LEFT JOIN companies c ON u.id = c.user_id
         WHERE u.id = ? AND u.tipo_cuenta = 'empresa'`,
        [companyId]
      );

      if (compRows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Empresa no encontrada" },
          { status: 404 }
        );
      }

      const company = compRows[0];
      if (!company.is_active) {
        return NextResponse.json(
          {
            success: false,
            error: "El perfil de esta empresa no esta disponible.",
          },
          { status: 404 }
        );
      }

      const [jobRows]: any = await connection.query(
        `SELECT id, posicion, disponibilidad, provincia, pais, created_at
         FROM job_postings
         WHERE user_id = ? AND is_active = 1 AND approval_status = 'approved'
         ORDER BY created_at DESC`,
        [companyId]
      );

      return NextResponse.json({
        success: true,
        company: {
          nombre: company.nombre || company.nombre_completo,
          descripcion: company.descripcion,
          direccion: company.direccion,
          ciudad: company.ciudad,
          provincia: company.provincia,
          pais: company.pais,
          email: company.email,
          logo_url: company.logo_url,
        },
        jobs: jobRows,
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
