import mysql from 'mysql2/promise';

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'u262259906_AdminTodo',
      password: 'TodoTrabajo2026',
      database: 'u262259906_TodoTrabajo'
    });
    console.log('Connected to DB');
    const [rows, fields] = await connection.execute('SHOW TABLES');
    console.log('Tables:', rows);
    
    // Check users table
    const [users] = await connection.execute('DESCRIBE users');
    console.log('Users table schema:', users);
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
