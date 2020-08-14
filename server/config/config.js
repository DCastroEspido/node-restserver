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
    urlDB = 'mongodb+srv://app-server-user:527rb36w8WlNI4eO@cluster0.jlljn.mongodb.net/cafe';
}
process.env.URLDB = urlDB;