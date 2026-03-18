const mysql = require('mysql2/promise');

async function migratePasswordReset() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todotrabajo'
  });

  try {
    console.log("Adding reset_token and reset_token_expires to users table...");
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN reset_token VARCHAR(255) NULL,
      ADD COLUMN reset_token_expires DATETIME NULL;
    `);
    console.log("Successfully added password reset columns.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Password reset columns already exist.");
    } else {
      console.error("Migration error:", err);
    }
  } finally {
    await connection.end();
    process.exit(0);
  }
}

migratePasswordReset();
