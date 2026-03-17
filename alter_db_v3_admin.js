const mysql = require('mysql2/promise');

async function migrateAdminDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todotrabajo'
  });

  try {
    console.log("Adding is_active to users table...");
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    `);
    console.log("Successfully added is_active to users.");

  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("is_active column already exists.");
    } else {
      console.error("Migration error:", err);
    }
  } finally {
    await connection.end();
    process.exit(0);
  }
}

migrateAdminDB();
