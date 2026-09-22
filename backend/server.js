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

// Contoh rute API untuk mengambil data dari database Aiven
app.get('/api/dashboard-data', (req, res) => {
    // Ganti 'nama_tabel_anda' dengan tabel yang sesuai dari file .sql yang sudah di-import
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