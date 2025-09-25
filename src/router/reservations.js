const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM reservation');
        res.json({ count: rows.length, data: rows });
    } catch (e) {
        console.error('GET /reservation Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
});
router.get('/:id', async (req, res) => {
    const reservationId = req.params.id;
    try {
        const q = `SELECT * FROM reservation WHERE id_reservation = $1`;
        const { rows } = await pool.query(q, [reservationId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Reservation tidak ditemukan' });
        }
        res.json(rows[0]);
    } catch (e) {
        console.error('GET /reservation/:id Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
})
router.post('/', async (req, res) => {
    const { reservation_date, guest_count, id_customer, status } = req.body;
    
    console.log('Request Body:', req.body); // ← DEBUG
    
    if (!reservation_date || !guest_count || !id_customer) {
        return res.status(400).json({ error: 'Data reservasi tidak lengkap' });
    }

    try {
        const finalStatus = status || 'reserved';
        
        console.log('SQL Values:', [reservation_date, guest_count, finalStatus, id_customer]); // ← DEBUG
        
        const { rows } = await pool.query(
            `INSERT INTO reservation (reservation_date, guest_count, status, id_customer) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`, 
            [reservation_date, guest_count, finalStatus, id_customer]
        );
        
        console.log('Insert Result:', rows); // ← DEBUG
        
        res.status(201).json({
            success: true,
            message: 'Reservasi berhasil dibuat',
            data: rows[0]
        });
    } catch (e) {
        console.error('POST /reservation Error Details:', e);
        
        // Handle specific errors
        if (e.code === '23503') { // Foreign key violation
            return res.status(400).json({ error: 'Customer tidak ditemukan' });
        }
        if (e.code === '23502') { // Not null violation
            return res.status(400).json({ error: 'Data wajib tidak boleh kosong' });
        }
        
        res.status(500).json({ error: 'Gagal membuat reservasi: ' + e.message });
    }
});
router.put('/:id', async (req, res) => {
    const reservationId = req.params.id;
    const { reservation_date, guest_count, status } = req.body;
    try {
        const q = `UPDATE reservation SET reservation_date = $1, guest_count = $2, status = $3 WHERE id_reservation = $4 RETURNING *`;
        const { rows } = await pool.query(q, [reservation_date, guest_count, status, reservationId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Reservation tidak ditemukan' });
        }
        res.json(rows[0]);
    } catch (e) {
        console.error('PUT /reservation/:id Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
})
router.delete('/:id', async (req, res) => {
    const reservationId = req.params.id;
    try {
        const q = `DELETE FROM reservation WHERE id_reservation = $1 RETURNING *`;
        const { rows } = await pool.query(q, [reservationId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Reservation tidak ditemukan' });
        }
        res.status(204).send(); // No content
    } catch (e) {
        console.error('DELETE /reservation/:id Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
})
module.exports = router;