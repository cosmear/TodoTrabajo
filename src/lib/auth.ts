import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";
const DEFAULT_ADMIN_EMAIL = "Todotrabajo@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "todotrabajo";
const DEFAULT_ADMIN_NAME = "Administrador Todo Trabajo";

export type SessionUser = {
  id: number;
  email: string;
  tipoCuenta: "candidato" | "empresa" | "admin";
  approvalStatus: "pending" | "approved";
};

export async function ensureDefaultAdminUser() {
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  const connection = await pool.getConnection();

  try {
    await connection.query(
      `INSERT INTO users (
        nombre_completo, email, password_hash, tipo_cuenta, is_active, approval_status
      ) VALUES (?, ?, ?, 'admin', 1, 'approved')
      ON DUPLICATE KEY UPDATE
        nombre_completo = VALUES(nombre_completo),
        password_hash = VALUES(password_hash),
        tipo_cuenta = 'admin',
        is_active = 1,
        approval_status = 'approved'`,
      [DEFAULT_ADMIN_NAME, DEFAULT_ADMIN_EMAIL, passwordHash]
    );
  } finally {
    connection.release();
  }
}

export function signSessionToken(user: SessionUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "30d" });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as SessionUser;
}

export function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}

export function getSessionFromRequest(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    return null;
  }

  try {
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function isAdminUser(userId: number) {
  const connection = await pool.getConnection();

  try {
    const [rows]: any = await connection.query(
      `SELECT tipo_cuenta FROM users WHERE id = ?`,
      [userId]
    );

    return rows.length > 0 && rows[0].tipo_cuenta === "admin";
  } finally {
    connection.release();
  }
}

export async function requireAdmin(request: Request) {
  await ensureDefaultAdminUser();

  const session = getSessionFromRequest(request);
  if (!session) {
    return null;
  }

  const isAdmin = await isAdminUser(session.id);
  return isAdmin ? session : null;
}
