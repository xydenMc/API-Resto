const { Pool } = require('pg');
// sesuaikan kredensial lokal
module.exports = new Pool({
host: 'localhost',
port: 5432,
user: 'postgres',
password: 'postgres',
database: 'db_resto' // sesuai nama DB kamu
});