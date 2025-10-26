// 📁 vyommitra-app/backend/config/db.js

const mysql = require('mysql2/promise');  // Promise-based MySQL
require('dotenv').config();               // Load environment variables

let db;

if (!global.dbPool) {
  db = mysql.createPool({
    host: process.env.DB_HOST,                     // Railway internal host
    user: process.env.DB_USER,                     // DB username
    password: process.env.DB_PASSWORD,             // DB password
    database: process.env.DB_NAME,                 // Database name
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // DB port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // ✅ Test the connection
  (async () => {
    try {
      const conn = await db.getConnection();
      console.log('✅ MySQL connected successfully to', process.env.DB_HOST);
      conn.release();
    } catch (err) {
      console.error('❌ MySQL connection error:', err.message);
    }
  })();

  global.dbPool = db;
} else {
  db = global.dbPool;
}

module.exports = db;
