// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Verificar si la URI está definida
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI no está definida en el archivo .env");
        }
        
        // Conexión a MongoDB
        await mongoose.connect(uri);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
