require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 1. GET: Ambil data berdasarkan modul (Sudah dikembalikan pakai parameter :module)
app.get('/api/testcases/:module', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM test_cases WHERE module = ? ORDER BY id DESC`,
            [req.params.module]
        );

        const formatted = rows.map(item => ({
            id: item.id,
            module: item.module,
            date: item.date ? (typeof item.date === 'string' ? item.date : item.date.toISOString().split('T')[0]) : '',
            result: item.result,
            severity: item.severity,
            serviceProvider: item.service_provider,
            callerProvider: item.service_provider,
            phone: item.phone,
            layanan: item.layanan,
            tier: item.tier,
            menuCategory: item.menu_category,
            capability: item.capability,
            step: item.step,
            detail: item.detail,
            desc: item.description,
            propose: item.propose,
            evidence: item.evidence_data ? {
                type: item.evidence_type,
                name: item.evidence_name,
                data: item.evidence_data
            } : null
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST: Tambah Record Test Case Baru (Ditambah tanda / di awal)
app.post('/api/testcases', async (req, res) => {
    try {
        const body = req.body;
        const evidence = body.evidence || {};

        const sql = `
            INSERT INTO test_cases 
            (module, date, result, severity, service_provider, phone, layanan, tier, menu_category, capability, step, detail, description, propose, evidence_type, evidence_name, evidence_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            body.module,
            body.date || new Date().toISOString().split('T')[0],
            body.result || 'Passed',
            body.severity || 'Minor',
            body.serviceProvider || '',
            body.phone || '',
            body.layanan || '',
            body.tier || '',
            body.menuCategory || '',
            body.capability || '',
            body.step || '',
            body.detail || '',
            body.desc || '',
            body.propose || '',
            evidence.type || null,
            evidence.name || null,
            evidence.data || null
        ];

        const [result] = await db.query(sql, values);
        res.status(201).json({ message: 'Data berhasil disimpan!', insertId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. PUT: Update Record Test Case
app.put('/api/testcases/:id', async (req, res) => {
    try {
        const body = req.body;
        const evidence = body.evidence || {};

        const sql = `
            UPDATE test_cases SET
            date = ?, result = ?, severity = ?, service_provider = ?, phone = ?, 
            layanan = ?, tier = ?, menu_category = ?, capability = ?, step = ?, 
            detail = ?, description = ?, propose = ?, evidence_type = ?, evidence_name = ?, evidence_data = ?
            WHERE id = ?
        `;

        const values = [
            body.date,
            body.result,
            body.severity,
            body.serviceProvider || '',
            body.phone || '',
            body.layanan || '',
            body.tier || '',
            body.menuCategory || '',
            body.capability || '',
            body.step || '',
            body.detail || '',
            body.desc || '',
            body.propose || '',
            evidence.type || null,
            evidence.name || null,
            evidence.data || null,
            req.params.id
        ];

        await db.query(sql, values);
        res.json({ message: 'Data berhasil diperbarui!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. DELETE: Hapus Seluruh Data Modul
app.delete('/api/testcases/module/:module', async (req, res) => {
    try {
        await db.query(`DELETE FROM test_cases WHERE module = ?`, [req.params.module]);
        res.json({ message: `Seluruh data modul ${req.params.module} berhasil dihapus!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

// Fungsi otomatis buat tabel jika belum ada
async function initDB() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS test_cases (
                id INT AUTO_INCREMENT PRIMARY KEY,
                module VARCHAR(255) NOT NULL,
                date VARCHAR(50),
                result VARCHAR(50),
                severity VARCHAR(50),
                service_provider VARCHAR(255),
                phone VARCHAR(50),
                layanan VARCHAR(255),
                tier VARCHAR(50),
                menu_category VARCHAR(255),
                capability VARCHAR(255),
                step TEXT,
                detail TEXT,
                description TEXT,
                propose TEXT,
                evidence_type VARCHAR(100),
                evidence_name VARCHAR(255),
                evidence_data LONGTEXT
            )
        `);
        console.log("✅ Tabel test_cases berhasil dicek/dibuat di database Aiven!");
    } catch (err) {
        console.error("❌ Gagal membuat tabel:", err.message);
    }
}

// Panggil fungsinya sebelum app.listen
initDB();

app.listen(PORT, () => console.log(`🚀 AVINDHA MySQL Server berjalan di http://localhost:${PORT}`));
