const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todotrabajo'
  });
  try {
     console.log("Adding columns...");
     await connection.query(`ALTER TABLE users ADD COLUMN telefono VARCHAR(50);`);
     console.log("Telefono added.");
  } catch(e) { console.log(e.message); }
  
  try {
     await connection.query(`ALTER TABLE users ADD COLUMN cv_url VARCHAR(255);`);
     console.log("CV url added.");
  } catch(e) { console.log(e.message); }

  connection.end();
  process.exit(0);
}
main();
