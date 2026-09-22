require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal konek ke Aiven:', err);
        return;
    }
    console.log('🚀 Berhasil terhubung ke Cloud Database Aiven via .env!');
});

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Endpoint khusus untuk test koneksi database secara langsung
app.get('/api/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('❌ Tes koneksi database gagal:', err);
            return res.status(500).json({ status: 'Error', error: err.message });
        }
        res.json({ status: 'Success', message: 'Berhasil terhubung ke database Aiven!', data: results });
    });
});

// Rute API untuk mengambil data dari tabel test_cases
app.get('/api/testcases', (req, res) => {
    const query = 'SELECT * FROM test_cases'; 
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Gagal mengambil data:', err);
            return res.status(500).json({ error: 'Gagal mengambil data dari database' });
        }
        res.json(results);
    });
});

// Jalankan server pada port dari .env atau default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});