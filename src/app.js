var express = require('express');
var app = express();
var cors = require('cors');
import { APP_PORT } from '../config.js';


var configuracion = {
    hostname: "127.0.0.1",
    port: APP_PORT,
};
app.listen(configuracion,  ()=> {
    console.log("Conectando al servidor http://localhost:".concat(configuracion.port));
});
app.use(cors());
app.use('/api', require('./routes/index'));