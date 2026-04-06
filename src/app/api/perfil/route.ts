import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const connection = await pool.getConnection();

    try {
      const [userRows]: any = await connection.query(
        `SELECT id, nombre_completo, email, tipo_cuenta, approval_status
         FROM users
         WHERE id = ?`,
        [userId]
      );

      if (userRows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      let user = userRows[0];
      let applications = [];
      let companyJobs: any[] = [];

      if (user.tipo_cuenta === "candidato") {
        const [candRows]: any = await connection.query(
          `SELECT * FROM candidates WHERE user_id = ?`,
          [userId]
        );
        if (candRows.length > 0) {
          user = { ...user, ...candRows[0] };
        }

        const [appRows]: any = await connection.query(
          `SELECT a.id, a.status, a.created_at, j.posicion, j.empresa, j.provincia, j.pais
           FROM applications a
           JOIN job_postings j ON a.job_id = j.id
           WHERE a.user_id = ?
           ORDER BY a.created_at DESC`,
          [userId]
        );
        applications = appRows;
      }

      if (user.tipo_cuenta === "empresa") {
        const [compRows]: any = await connection.query(
          `SELECT * FROM companies WHERE user_id = ?`,
          [userId]
        );
        if (compRows.length > 0) {
          user = { ...user, ...compRows[0] };
        }

        const [jobsRows]: any = await connection.query(
          `SELECT * FROM job_postings WHERE user_id = ? ORDER BY created_at DESC`,
          [userId]
        );

        companyJobs = jobsRows.map((job: any) => ({ ...job, applications: [] }));

        if (companyJobs.length > 0) {
          const jobIds = companyJobs.map((job: any) => job.id);
          const [applicantsRows]: any = await connection.query(
            `SELECT a.id AS application_id, a.job_id, a.status, a.created_at,
                    u.nombre_completo, u.email, c.telefono, c.cv_url
             FROM applications a
             JOIN users u ON a.user_id = u.id
             LEFT JOIN candidates c ON u.id = c.user_id
             WHERE a.job_id IN (?)
             ORDER BY a.created_at DESC`,
            [jobIds]
          );

          applicantsRows.forEach((applicant: any) => {
            const job = companyJobs.find((currentJob: any) => currentJob.id === applicant.job_id);
            if (job) {
              job.applications.push(applicant);
            }
          });
        }
      }

      return NextResponse.json({ success: true, user, applications, companyJobs });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, error: "Token invalido" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
