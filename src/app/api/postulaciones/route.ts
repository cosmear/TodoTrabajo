import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

function normalizeJobPayload(data: any) {
  return {
    empresa: (data.empresa || "").trim(),
    posicion: (data.posicion || "").trim(),
    requisitos: (data.requisitos || "").trim(),
    areas: (data.areas || "").trim(),
    disponibilidad: (data.disponibilidad || "").trim(),
    contacto: (data.contacto || "").trim(),
    pais: (data.pais || "").trim(),
    provincia: (data.provincia || "").trim(),
    areas_interes: (data.areas_interes || "").trim(),
    zona: (data.zona || "").trim(),
    direccion: (data.direccion || "").trim(),
    visible_suscripcion: Boolean(data.visible_suscripcion),
    requiere_salario: Boolean(data.requiere_salario),
  };
}

function validateJobPayload(data: ReturnType<typeof normalizeJobPayload>) {
  if (!data.empresa) return "La empresa es obligatoria";
  if (!data.posicion) return "La posicion es obligatoria";
  if (!data.areas) return "Las areas son obligatorias";
  if (!data.disponibilidad) return "La disponibilidad es obligatoria";
  if (!data.contacto) return "El contacto es obligatorio";
  if (!data.pais) return "El pais es obligatorio";
  if (!data.provincia) return "La provincia es obligatoria";
  if (!data.areas_interes) return "Las areas de interes son obligatorias";
  if (!data.zona) return "La zona es obligatoria";
  if (!data.direccion) return "La direccion es obligatoria";

  return null;
}

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
    const payload = normalizeJobPayload(await request.json());
    const validationError = validateJobPayload(payload);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

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
          payload.empresa,
          payload.posicion,
          payload.requisitos,
          payload.areas,
          payload.disponibilidad,
          payload.contacto,
          payload.pais,
          payload.provincia,
          payload.areas_interes,
          payload.zona,
          payload.direccion,
          payload.visible_suscripcion,
          payload.requiere_salario,
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

export async function PUT(request: Request) {
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
          error: "Solo los usuarios empresa pueden editar puestos",
        },
        { status: 403 }
      );
    }

    const userId = session.id;
    const data = await request.json();
    const jobId = Number(data.jobId);

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Falta el identificador de la oferta" },
        { status: 400 }
      );
    }

    const payload = normalizeJobPayload(data);
    const validationError = validateJobPayload(payload);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      const [rows]: any = await connection.query(
        `SELECT id
         FROM job_postings
         WHERE id = ? AND user_id = ?`,
        [jobId, userId]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Oferta laboral no encontrada" },
          { status: 404 }
        );
      }

      await connection.query(
        `UPDATE job_postings
         SET empresa = ?,
             posicion = ?,
             requisitos = ?,
             areas = ?,
             disponibilidad = ?,
             contacto = ?,
             pais = ?,
             provincia = ?,
             areas_interes = ?,
             zona = ?,
             direccion = ?,
             visible_suscripcion = ?,
             requiere_salario = ?,
             approval_status = 'pending'
         WHERE id = ? AND user_id = ?`,
        [
          payload.empresa,
          payload.posicion,
          payload.requisitos,
          payload.areas,
          payload.disponibilidad,
          payload.contacto,
          payload.pais,
          payload.provincia,
          payload.areas_interes,
          payload.zona,
          payload.direccion,
          payload.visible_suscripcion,
          payload.requiere_salario,
          jobId,
          userId,
        ]
      );

      return NextResponse.json({
        success: true,
        approvalStatus: "pending",
        message:
          "La oferta laboral fue actualizada y volvio a estado de aprobacion.",
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
