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

module.exports = (req, res) => {
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
    } else if (req.method === 'POST') {
        const item = req.body;
        const query = 'INSERT INTO test_cases (module, date, result, severity, service_provider, phone, layanan, tier, menu_category, detail, `desc`, propose) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            item.module || 'ivr',
            item.date || new Date().toISOString().split('T')[0],
            item.result || 'Passed',
            item.severity || 'Minor',
            item.serviceProvider || item.callerProvider || 'Telkomsel',
            item.phone || '',
            item.layanan || '',
            item.tier || '',
            item.menuCategory || '',
            item.detail || item.step || '',
            item.desc || '',
            item.propose || ''
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('❌ Gagal insert data:', err);
                return res.status(500).json({ error: err.message });
            }
            return res.status(200).json({ success: true, id: result.insertId });
        });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};