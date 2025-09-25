
#  🍽️ Restaurant Management API
API untuk sistem manajemen restoran yang menyediakan endpoints untuk mengelola menu, user, dan reservasi. Dibangun dengan Express.js dan PostgreSQL.

## 🛠️Teknologi yang Digunakan


Framework: Express.js

Database: PostgreSQL

Database Driver: PGAdmin

Runtime: Node.js


## 😜Authors

- Nama: [Davin loise steven alinsky herlambang](https://github.com/xydenMc)

- Kelas: XI RPL A





##  📥 Instalasi dan Setup

Prerequisites
- Node.js (v14 atau lebih tinggi)

- PostgreSQL (v12 atau lebih tinggi)

- npm atau yarn

``` sql

# Install dependencies
npm install

# Setup database
createdb restaurant_db

# Jalankan server
npm start
```
### Struktur Database
``` sql
-- Tabel menu
CREATE TABLE menu (
    id_menu SERIAL PRIMARY KEY,
    menu VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('food', 'beverage')),
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    availability BOOLEAN DEFAULT true
);

-- Tabel users
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

-- Tabel reservation
CREATE TABLE reservation (
    id_reservation SERIAL PRIMARY KEY,
    reservation_date TIMESTAMP NOT NULL,
    guest_count INTEGER NOT NULL CHECK (guest_count > 0),
    status VARCHAR(20) DEFAULT 'reserved',
    id_customer INTEGER NOT NULL
);
```

    
## 🚀API ENDPOINT
BASE URL
``` text
http://localhost:3000
```
### 📖 MENU ENDPOINT
#### GET /menus
Mendapatkan semua data menu.

Query Parameters:
- `available` (optional) - Filter berdasarkan ketersediaan: `true`/`false`
#### Contoh Request:
``` http
GET /menus?available=true
```
#### Response Success (200):
``` json
{
    "count": 2,
    "data": [
        {
            "id_menu": 1,
            "menu": "Nasi Goreng Spesial",
            "type": "food",
            "description": "Nasi goreng dengan ayam dan seafood",
            "price": 25000,
            "availability": true
        }
    ]
}
```
#### GET /menus/:id
Mendapatkan detail menu berdasarkan ID.

#### Contoh Request:
``` http
GET /menus/1
```
#### Response Success (200):
``` json
{
    "id_menu": 1,
    "menu": "Nasi Goreng Spesial",
    "type": "food",
    "description": "Nasi goreng dengan ayam dan seafood",
    "price": 25000,
    "availability": true
}
```
#### POST /menus
Membuat menu baru.

#### Request Body:
``` json
{
    "menu": "Mie Ayam Bakso",
    "type": "food",
    "description": "Mie ayam dengan bakso spesial",
    "price": 18000,
    "availability": true
}
```
#### Validasi:
- `menu` (wajib): string tidak boleh kosong

- `type` (wajib): hanya "food" atau "beverage"

- `description` (wajib): string tidak boleh kosong

- `price` (wajib): number ≥ 0

- `availability` (opsional): boolean, default true
#### Response Success (201):
``` json
{
    "id_menu": 3,
    "menu": "Mie Ayam Bakso",
    "type": "food",
    "description": "Mie ayam dengan bakso spesial",
    "price": 18000,
    "availability": true
}
```
#### Response Error (400):
``` json
{
    "error": "Type harus \"food\" atau \"beverage\""
}
```
#### PUT /menus/:id
Update data menu.

#### Request Body:
``` json
{
    "menu": "Nasi Goreng Super Spesial",
    "type": "food",
    "description": "Nasi goreng dengan seafood premium",
    "price": 35000,
    "availability": true
}
```
### DELETE /menus/:id
Menghapus menu.

#### Response Success (204): No Content
## 👥 User Endpoints
#### GET /users
Mendapatkan semua data user.

#### Response Success (200):
``` json
{
    "count": 1,
    "data": [
        {
            "id_user": 1,
            "fullname": "Admin User",
            "username": "admin",
            "email": "admin@restaurant.com",
            "role": "admin"
        }
    ]
}
```
#### POST /users
Membuat user baru.

#### Request Body:
``` json
{
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john@email.com",
    "password": "password123",
    "role": "user"
}
```
## 📅 Reservation Endpoints
#### POST /reservation
Membuat reservasi baru.

#### Request Body:
``` json
{
    "reservation_date": "2024-01-15 19:00:00",
    "guest_count": 4,
    "id_customer": 1,
    "status": "reserved"
}
```
#### Response Success (201):
``` json
{
    "success": true,
    "message": "Reservasi berhasil dibuat",
    "data": {
        "id_reservation": 1,
        "reservation_date": "2024-01-15T12:00:00.000Z",
        "guest_count": 4,
        "status": "reserved",
        "id_customer": 1
    }
}
```
## 🧪 Testing API
### Menggunakan Insomnia/Postman
1. Import Collection atau buat request manual

2. Gunakan Base URL: `http://localhost:3000`

4. Headers: `Content-Type: application/json`

#### Contoh Testing Sequence
1. **GET /menus** - Verifikasi data awal

2. **POST /menus** - Tambah menu baru

3. **GET /menus/1** - Verifikasi menu created

4. **PUT /menus/1** - Update menu

5. **DELETE /menus/1** - Hapus menu
## 🐛 Error Handling
#### API mengembalikan standard HTTP status codes:

- **200** - Success

- **201** - Created

- **400** - Bad Request (validasi error)

- **404** - Not Found

- **500** - Internal Server Error
#### Format Error Response:
``` json
{
    "error": "Pesan error detail"
}
```

## 🔧 Troubleshooting
### Common Issues
1. **Database Connection Error**

- Pastikan PostgreSQL berjalan

- Cek kredensial database di `db/pool.js`

2. **Port Already in Use**

- Ganti PORT di environment variables

- Kill process yang menggunakan port 3000

3. **Table Doesn't Exist**

- Jalankan query CREATE TABLE di database

- Pastikan nama tabel sesuai dengan kode
### Reset Database Sequence
``` sql
-- Jika terjadi duplicate key error
SELECT setval('menu_id_menu_seq', (SELECT MAX(id_menu) FROM menu));
SELECT setval('users_id_user_seq', (SELECT MAX(id_user) FROM users));
SELECT setval('reservation_id_reservation_seq', (SELECT MAX(id_reservation) FROM reservation));
```



## 📁 Project Structure
``` text
restaurant-api/
├── src/
│   ├── index.js          # Main server file
│   ├── db/
│   │   └── pool.js       # Database connection
│   └── router/
│       ├── menus.js      # Menu endpoints
│       ├── users.js      # User endpoints
│       └── reservations.js # Reservation endpoints
├── package.json
└── README.md
```

## 👨‍💻 Developer Information
**Dibuat oleh:** XI RPL Student

**Kelas: XI** Rekayasa Perangkat Lunak

**Tahun:** 2025

**Mata Pelajaran:** Rekayasa Perangkat Lunak


## 💡 Tips Penggunaan
1. Selalu gunakan `Content-Type: application/json` pada header request

2. Untuk testing, gunakan tool seperti Insomnia atau Postman

3. Simpan response error untuk debugging

4. Lakukan testing endpoint secara berurutan

Untuk pertanyaan atau issues, silakan hubungi developer.
## 🧪 HASIL TESTING API TEMAN
#### 📋 INFORMASI TESTING
- Tanggal Testing: [9/25/2025]

- Nama Tester: [Davin loise S.A.H]

- Partner Testing: [Afwan ikho R]

- Base URL Partner: http://192.168.111.143:3000
## 📊 HASIL TESTING DETAIL
#### 🔍 TEST 1: GET /menus
Request:
``` http
GET http://192.168.111.143:3000/menus
```
#### Expected Response (200):
``` json
{
	"count": 29,
	"data": [
		{
			"id_menu": 1,
			"menu": "Nasi Goreng Spesial",
			"type": "food",
			"description": "Nasi goreng dengan telur dan ayam",
			"price": "25000.00",
			"availability": true
		},
};
```
#### Actual Result:


✅ SUCCESS - Data berhasil diambil

❌ ERROR - [tidak ada eror]

Keterangan:
[ testing berjalan lancar dan data dapat ditampilkan ]        
