const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todotrabajo'
  });
  try {
     await connection.query(`ALTER TABLE users DROP COLUMN telefono;`);
     await connection.query(`ALTER TABLE users DROP COLUMN cv_url;`);
  } catch(e) { console.log(e.message); }
  
  try {
     await connection.query(`ALTER TABLE candidates ADD COLUMN user_id INT UNIQUE;`);
  } catch(e) { console.log(e.message); }

  try {
     await connection.query(`ALTER TABLE candidates ADD COLUMN cv_url VARCHAR(255);`);
  } catch(e) { console.log(e.message); }

  try {
     await connection.query(`ALTER TABLE companies ADD COLUMN user_id INT UNIQUE;`);
  } catch(e) { console.log(e.message); }

  connection.end();
  process.exit(0);
}
main();
