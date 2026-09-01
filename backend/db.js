// db.js
// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'avindha_db',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// Tes Koneksi Database
// (async () => {
//     try {
//         const connection = await pool.getConnection();
//         console.log('✅ Terhubung ke Database MySQL');
//         connection.release();
//     } catch (err) {
//         console.error('❌ Gagal terkoneksi ke Database MySQL:', err.message);
//     }
// })();

// module.exports = pool;


// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false }, // Wajib untuk enkripsi aman Aiven
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tes Koneksi Database
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Berhasil terhubung ke Database Aiven Cloud!');
        connection.release();
    } catch (err) {
        console.error('❌ Gagal terkoneksi ke Database Aiven:', err.message);
    }
})();

module.exports = pool;