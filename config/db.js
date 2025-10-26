const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

if (!global.dbPool) {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  (async () => {
    try {
      const conn = await db.getConnection();
      console.log("✅ MySQL connected successfully to", process.env.DB_HOST);
      conn.release();
    } catch (err) {
      console.error("❌ MySQL connection error:", err.message);
    }
  })();

  global.dbPool = db;
} else {
  db = global.dbPool;
}

module.exports = db;



// const mysql = require("mysql2/promise");
// require("dotenv").config();

// let db;

// if (!global.dbPool) {
//   db = mysql.createPool({
//     host: process.env.DB_HOST,       // must be internal host
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   });

//   (async () => {
//     try {
//       const conn = await db.getConnection();
//       console.log("✅ MySQL connected successfully to", process.env.DB_HOST);
//       conn.release();
//     } catch (err) {
//       console.error("❌ MySQL connection error:", err.message);
//     }
//   })();

//   global.dbPool = db;
// } else {
//   db = global.dbPool;
// }

// module.exports = db;
