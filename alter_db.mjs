import pool from './src/lib/db.js';

async function main() {
  const connection = await pool.getConnection();
  try {
     console.log("Adding columns...");
     await connection.query(`ALTER TABLE users ADD COLUMN telefono VARCHAR(50);`);
     console.log("Telefono added.");
  } catch(e) { console.log(e.message); }
  
  try {
     await connection.query(`ALTER TABLE users ADD COLUMN cv_url VARCHAR(255);`);
     console.log("CV url added.");
  } catch(e) { console.log(e.message); }

  connection.release();
  process.exit(0);
}
main();
