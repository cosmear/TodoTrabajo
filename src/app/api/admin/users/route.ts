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
    const [users]: any = await connection.query(
      `SELECT
         id,
         nombre_completo,
         email,
         tipo_cuenta,
         is_active,
         approval_status,
         created_at
       FROM users
       ORDER BY
         CASE WHEN tipo_cuenta = 'candidato' AND approval_status = 'pending' THEN 0 ELSE 1 END,
         created_at DESC`
    );

    return NextResponse.json({ success: true, users });
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
  const { userId, is_active, approval_status } = data;

  const connection = await pool.getConnection();

  try {
    if (typeof is_active !== "undefined") {
      await connection.query(`UPDATE users SET is_active = ? WHERE id = ?`, [
        is_active ? 1 : 0,
        userId,
      ]);
    }

    if (approval_status) {
      await connection.query(
        `UPDATE users
         SET approval_status = ?
         WHERE id = ? AND tipo_cuenta = 'candidato'`,
        [approval_status, userId]
      );
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } finally {
    connection.release();
  }
}
