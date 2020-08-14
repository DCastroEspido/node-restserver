// ====================
// Puerto
// ====================

process.env.PORT = process.env.PORT || 3000;

// ====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

// ====================
// Base de datos
// ====================
let urlDB;

if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_DB_URI;
}
process.env.URLDB = urlDB;