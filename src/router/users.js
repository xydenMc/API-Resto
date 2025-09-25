const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id_user, fullname, username, email, role FROM users' + ' ORDER BY id_user ASC');
        res.json({ count: rows.length, data: rows });
    } catch (e) {
        console.error('GET /users Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const q = `SELECT id_user, fullname, username, email, role from users WHERE id_user = $1`;
        const { rows } = await pool.query(q, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        res.json(rows[0]);
    } catch (e) {
        console.error('GET /users/:id Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
})
router.post('/', async (req, res) => {
    const { fullname, username, email, password, role = 'user' } = req.body;
    
    console.log('Received data:', req.body); // ← DEBUG
    
    // Validasi data wajib
    if (!fullname || !username || !email || !password) {
        console.log('Validation failed: Missing fields'); // ← DEBUG
        return res.status(400).json({ error: 'Data user tidak lengkap' });
    }

    try {
        const q = `
            INSERT INTO users (fullname, username, email, password, role) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id_user, fullname, username, email, role
        `;
        const values = [fullname, username, email, password, role];
        
        console.log('SQL Query:', q); // ← DEBUG
        console.log('Values:', values); // ← DEBUG
        
        const { rows } = await pool.query(q, values);
        console.log('Insert result:', rows); // ← DEBUG
        
        res.status(201).json(rows[0]);
    } catch (e) {
        console.error('POST /users Error Details:', e); // ← DETAILED ERROR
        
        if (e.code === '23505') {
            return res.status(400).json({ error: 'Username atau email sudah digunakan' });
        }
        
        res.status(500).json({ error: 'Gagal membuat user: ' + e.message });
    }
});
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    try {
        const q = `UPDATE users SET username = $1, email = $2, password = $3 WHERE id_user = $4 RETURNING *`;
        const { rows } = await pool.query(q, [username, email, password, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        res.json(rows[0]);
    } catch (e) {
        console.error('PUT /users/:id Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
});
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const q = `DELETE FROM users WHERE id_user = $1 RETURNING *`;
        const { rows } = await pool.query(q, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        res.status(204).send(); // No content
    } catch (e) {
        console.error('DELETE /users/:id Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
})

module.exports = router;