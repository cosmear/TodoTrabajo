import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const adminSession = await requireAdmin(request);
  if (!adminSession) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const connection = await pool.getConnection();

  try {
    const [candRows]: any = await connection.query(
      `SELECT COUNT(*) AS total FROM users WHERE tipo_cuenta = 'candidato'`
    );
    const [compRows]: any = await connection.query(
      `SELECT COUNT(*) AS total FROM users WHERE tipo_cuenta = 'empresa'`
    );
    const [jobsRows]: any = await connection.query(
      `SELECT COUNT(*) AS total FROM job_postings`
    );
    const [appsRows]: any = await connection.query(
      `SELECT COUNT(*) AS total FROM applications`
    );
    const [pendingCandidateRows]: any = await connection.query(
      `SELECT COUNT(*) AS total
       FROM users
       WHERE tipo_cuenta = 'candidato' AND approval_status = 'pending'`
    );
    const [pendingJobRows]: any = await connection.query(
      `SELECT COUNT(*) AS total
       FROM job_postings
       WHERE approval_status = 'pending'`
    );

    const stats = {
      candidates: candRows[0].total,
      companies: compRows[0].total,
      jobs: jobsRows[0].total,
      applications: appsRows[0].total,
      pendingCandidates: pendingCandidateRows[0].total,
      pendingJobs: pendingJobRows[0].total,
    };

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
