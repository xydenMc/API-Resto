// 1. IMPORT MODULES - PALING ATAS
const express = require('express');
const menusRouter = require('./router/menus');
const reservationsRouter = require('./router/reservations');
const usersRouter = require('./router/users');


// 2. INISIALISASI APP
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // ← TAMBAH BARIS INI

// 3. MIDDLEWARE
app.use(express.json());

// 4. ROUTES
app.use('/menus', menusRouter);
app.use('/reservations', reservationsRouter);
app.use('/users', usersRouter);

// 5. ROOT ENDPOINT
app.get('/', (req, res) => {
    res.json({ message: 'Restaurant API up' });
});

// 6. START SERVER - PALING BAWAH
app.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}`));  // ← TAMBAH HOST DI SINI