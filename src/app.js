require('dotenv').config()
const express = require("express");
const cors = require("cors");

const app = express();
var configuracion = {
    hostname: "127.0.0.1",
    port: process.env.APP_PORT,
};
app.listen(configuracion,  ()=> {
    console.log("Conectando al servidor http://localhost:",process.env.APP_PORT);
});
app.use(cors());
app.use('/api', require('./routes/index.js'));