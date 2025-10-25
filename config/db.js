// // 📁 vyommitra-app/backend/config/db.js


// 📁 backend/config/db.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vyommitra',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// ✅ Optional: Test connection when the server starts
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
  }
})();

module.exports = db;

// const mysql = require('mysql2/promise');  // ✅ Use promise-based mysql2

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Mahesh@123',
//   database: 'vyommitra',
// });

// // ✅ Optional test connection block
// (async () => {
//   try {
//     const conn = await db.getConnection();
//     console.log('✅ MySQL connected');
//     conn.release(); // Always release the connection after use
//   } catch (err) {
//     console.error('❌ MySQL connection error:', err.message);
//   }
// })();

// module.exports = db;
