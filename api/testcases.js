require('dotenv').config();
const mysql = require('mysql2');

// Buat koneksi database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

export default function handler(req, res) {
    // Set CORS header agar bisa diakses frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        const query = 'SELECT * FROM test_cases';
        db.query(query, (err, results) => {
            if (err) {
                console.error('❌ Gagal mengambil data:', err);
                return res.status(500).json({ error: 'Gagal mengambil data dari database' });
            }
            return res.status(200).json(results);
        });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}