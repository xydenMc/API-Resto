const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Validasi menus
const ALLOWED_TYPES = ['food', 'beverage'];

function validateMenuInput(body) {
    const { menu, type, description, price } = body;
    if (!menu || !type || !description || price == null) return 'Semua field wajib diisi';
    if (!ALLOWED_TYPES.includes(type)) return 'Type harus "food" atau "beverage"';
    if (price < 0) return 'Price tidak boleh negatif';
    if (typeof menu !== 'string' || menu.trim().length === 0) return 'Menu harus berupa teks yang valid';
    if (typeof description !== 'string' || description.trim().length === 0) return 'Description harus berupa teks yang valid';
    return null;
}

// GET /menus - Get all menus
router.get('/', async (req, res) => {
    const { available } = req.query;
    try {
        let q = `SELECT id_menu, menu, type, description, price, availability FROM menu`;
        
        if (available === 'true') {
            q += ` WHERE availability = TRUE`;
        }
        q += ` ORDER BY id_menu ASC`;
        
        const { rows } = await pool.query(q);
        res.json({ count: rows.length, data: rows });
    } catch (e) {
        console.error('GET /menus Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET /menus/:id - Get menu by ID
router.get('/:id', async (req, res) => {
    const menuId = req.params.id;
    try {
        const q = `SELECT id_menu, menu, type, description, price, availability FROM menu WHERE id_menu = $1`;
        const { rows } = await pool.query(q, [menuId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Menu tidak ditemukan' });
        }
        res.json(rows[0]);
    } catch (e) {
        console.error('GET /menus/:id Error:', e);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /menus - Create new menu (DENGAN VALIDASI)
router.post('/', async (req, res) => {
    // Validasi input
    const validationError = validateMenuInput(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const { menu, type, description, price, availability } = req.body;
    
    try {
        const q = `
            INSERT INTO menu (menu, type, description, price, availability) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const values = [
            menu, 
            type, 
            description, 
            price, 
            availability !== undefined ? availability : true
        ];
        
        const { rows } = await pool.query(q, values);
        res.status(201).json(rows[0]);
    } catch (e) {
        console.error('POST /menus Error:', e);
        
        if (e.code === '23505') { // Duplicate key
            await pool.query("SELECT setval('menu_id_menu_seq', (SELECT MAX(id_menu) FROM menu))");
            return res.status(400).json({ error: 'Duplicate key. Sequence sudah direset, coba lagi.' });
        }
        
        res.status(500).json({ error: 'Gagal membuat menu: ' + e.message });
    }
});

// PUT /menus/:id - Update menu (DENGAN VALIDASI)
router.put('/:id', async (req, res) => {
    const menuId = req.params.id;
    
    // Validasi input
    const validationError = validateMenuInput(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const { menu, type, description, price, availability } = req.body;

    try {
        const q = `
            UPDATE menu 
            SET menu = $1, type = $2, description = $3, price = $4, availability = $5 
            WHERE id_menu = $6 
            RETURNING *
        `;
        const values = [menu, type, description, price, availability, menuId];
        
        const { rows } = await pool.query(q, values);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Menu tidak ditemukan' });
        }
        
        res.json(rows[0]);
    } catch (e) {
        console.error('PUT /menus/:id Error:', e);
        res.status(500).json({ error: 'Gagal update menu: ' + e.message });
    }
});

module.exports = router;