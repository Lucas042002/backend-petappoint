require('dotenv').config()
const express = require("express");
const cors = require("cors");

const app = express();
var configuracion = {
    hostname: "127.0.0.1",
    port: process.env.APP_PORT,
};
app.listen(process.env.APP_PORT);
app.use(cors());
app.use('/api', require('./routes/index.js'));