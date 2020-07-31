//leer variables de ambiente
const dotenv = require("dotenv");
//initilizando
dotenv.config();

module.exports = {
    'port': process.env.PORT || 3000,
    'db': process.env.MONGODB || "mongodb://localhost:27017/sida-app-db",
    'secret': process.env.SECRET || "1234567890abcdefghijklmnopqrstuvwxyz"
};