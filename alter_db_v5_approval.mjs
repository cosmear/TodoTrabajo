import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function migrateApprovalFlow() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "todotrabajo",
  });

  try {
    console.log("Ensuring approval_status on users...");
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'approved' AFTER is_active
      `);
      console.log("approval_status added to users.");
    } catch (error) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("users.approval_status already exists.");
      } else {
        throw error;
      }
    }

    console.log("Ensuring approval_status on job_postings...");
    try {
      await connection.query(`
        ALTER TABLE job_postings
        ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' AFTER is_active
      `);
      console.log("approval_status added to job_postings.");
    } catch (error) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("job_postings.approval_status already exists.");
      } else {
        throw error;
      }
    }

    console.log("Seeding default admin user...");
    const passwordHash = await bcrypt.hash("todotrabajo", 10);
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
      ["Administrador Todo Trabajo", "Todotrabajo@gmail.com", passwordHash]
    );
    console.log("Default admin user ready.");
  } finally {
    await connection.end();
  }
}

migrateApprovalFlow()
  .then(() => {
    console.log("Migration completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration error:", error);
    process.exit(1);
  });
