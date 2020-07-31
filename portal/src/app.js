//configuracion general de express

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();


//Middleware
//usar formato JSON
app.use(express.json());
//habilita post del formulario
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static("src/public"));

//settings
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//Controllers
app.use(require("./controllers/authentication"));

module.exports = app;