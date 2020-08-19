// ====================
// Puerto
// ====================

process.env.PORT = process.env.PORT || 3000;

// ====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

// ====================
// Vencimiento del Token
// ====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 30

// ====================
// Seed de autenticación JWT
// ====================
process.env.JWT_SEED = process.env.JWT_SEED || 'este-es-el-seed-desarrollo'

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

// ====================
// Google Client ID
// ====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1073694397533-5bqeqtd86tldg2nd9pmm0nfko966of71.apps.googleusercontent.com'