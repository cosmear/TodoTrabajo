import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const adminSession = await requireAdmin(request);
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const connection = await pool.getConnection();

  try {
    const [jobs]: any = await connection.query(
      `SELECT
         j.id,
         j.posicion,
         j.empresa,
         j.is_active,
         j.approval_status,
         j.created_at,
         u.email AS publisher_email
       FROM job_postings j
       JOIN users u ON j.user_id = u.id
       ORDER BY
         CASE WHEN j.approval_status = 'pending' THEN 0 ELSE 1 END,
         j.created_at DESC`
    );

    return NextResponse.json({ success: true, jobs });
  } finally {
    connection.release();
  }
}

export async function PUT(request: Request) {
  const adminSession = await requireAdmin(request);
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await request.json();
  const { jobId, is_active, approval_status } = data;

  const connection = await pool.getConnection();

  try {
    if (typeof is_active !== "undefined") {
      await connection.query(`UPDATE job_postings SET is_active = ? WHERE id = ?`, [
        is_active ? 1 : 0,
        jobId,
      ]);
    }

    if (approval_status) {
      await connection.query(
        `UPDATE job_postings SET approval_status = ? WHERE id = ?`,
        [approval_status, jobId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Job status updated",
    });
  } finally {
    connection.release();
  }
}
