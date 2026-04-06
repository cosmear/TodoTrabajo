import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { ensureDefaultAdminUser, signSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, nombreCompleto, tipoCuenta } = data;

    if (!email || !password || !nombreCompleto || !tipoCuenta) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!["candidato", "empresa"].includes(tipoCuenta)) {
      return NextResponse.json(
        { success: false, error: "Tipo de cuenta invalido" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const approvalStatus = tipoCuenta === "candidato" ? "pending" : "approved";

    await ensureDefaultAdminUser();

    const connection = await pool.getConnection();

    try {
      const [result]: any = await connection.query(
        `INSERT INTO users (nombre_completo, email, password_hash, tipo_cuenta, approval_status)
         VALUES (?, ?, ?, ?, ?)`,
        [nombreCompleto, email, hashedPassword, tipoCuenta, approvalStatus]
      );

      const token = signSessionToken({
        id: result.insertId,
        email,
        tipoCuenta,
        approvalStatus,
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: result.insertId,
          email,
          tipoCuenta,
          nombreCompleto,
          approvalStatus,
        },
      });
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
