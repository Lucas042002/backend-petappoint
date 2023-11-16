const { Router } = require('express');
const router = Router();
require('dotenv').config()
const moment = require('moment'); 
const mysql = require("mysql2");
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
var jsonParser = bodyParser.json();


const connection = mysql.createConnection({
    host:process.env.DB_HOST ,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    port:process.env.DB_PORT,
    database:process.env.MYSQL_DB

});

connection.connect(function (err) {
    if (err) {
        console.error('Error conectando a la DB ' + err.stack);
        return;
    }
    console.log('Conexión establecida ' + connection.threadId);
});





//Registra 
router.post("/registro",verifyToken, jsonParser, async (req, res) => {
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let email = req.body.email;
    let password = req.body.password;
    let passwordHash = await bcryptjs.hash(password, 9)
   
    let admin = req.body.admin;
    let sql1 = `select * FROM usuario WHERE email ='${email}'`;
    connection.query(sql1, (error, results, fields) => {
        if (error)
            throw error;
        else {
            if (results == "") {
                let sql2 = `insert into Usuario values ( '${nombre}','${apellido}','${email}','${passwordHash}', '${admin}')`;
                connection.query(sql2, function (error, results, fields) {
                    if (error)
                        throw error;
                    else {
                        res.json({ "id": 1 });
                    }
                });
            }
            else
                res.json({ "id": 2 });
        }
    });
});
//Inicia sesion de un usuario devolviendo un token de inicio de sesion
router.post("/iniciosesion", jsonParser, (req, res) => {
    let email = req.body.email;
    let sql1=`select * from usuario where email='${email}'`
    console.log("hola")
    connection.query(sql1, function (error, results, fields) {
        if (error)
            throw error;
        if (results == "")
            res.status(404).json({ "message": "No existe este usuario" });
        else {
            
            let hashSaved=results[0].password;
            let password = req.body.password;
            console.log("holaV2")
            let compare = bcryptjs.compareSync(password, hashSaved);
            if (compare) {
                let sql2=`select * from usuario where email='${email}' and password='${hashSaved}'`
                connection.query(sql2, function (error, results, fields) {
                    if (error)
                        throw error;
                    if (results != "") {
                        console.log("holaV3")
                        const token = jwt.sign({ id: results[0].admin }, 'secretkey');
                        return res.status(200).json({"token": token});
                    }
                });
            }
            else {
                res.status(401).json({ "message": "Contraseña equivocada" });
            }
        }
    });
});
router.get("/consultas",verifyToken ,jsonParser,(req, res) =>{
    let sql = 'select * from consulta';
    connection.query(sql, (error, results, fields) =>{
        if(error) throw error;
        else{
            res.json(results);
        }
    })
})
router.post("/consultaPorId",verifyToken ,jsonParser,(req, res) =>{
    let idConsulta =req.body.idConsulta;
    let sql = `select * from consulta where idConsulta='${idConsulta}'`;
    connection.query(sql, (error, results, fields) =>{
        if(error) throw error;
        else{
            res.status(200).json(results);
        }
    })
})
router.post("/agregarconsulta",verifyToken, jsonParser, (req, res) => {
    let tipoConsulta = req.body.tipoConsulta;
    let nombreAnimal = req.body.nombreAnimal;
    
    let aux = moment(req.body.fecha).format("YYYY-MM-DD");
    let fecha = aux.concat(" "+req.body.hora.toString()+":00");     

    let emailVet =  req.body.emailVet;
    let nombreCliente = req.body.nombreCliente;
    let rutCliente = req.body.rutCliente;
    let descripcion = req.body.descripcion;
    let telefonoCliente = req.body.telefonoCliente;
    let sql1 = `select * FROM consulta`;
    connection.query(sql1, (error, results, fields) => {
        if (error)
            throw error;
        else { 
            let sql2 = `insert into consulta values ('null','${fecha}','${nombreAnimal}','${nombreCliente}','${rutCliente}','${telefonoCliente}','${emailVet}','${tipoConsulta}','${descripcion}')`;
            connection.query(sql2, function (error, results, fields) {
                if (error)
                    throw error;
                else {
                    res.json({ "id": 1 });
                }
            });
        }
    });
});
router.put('/actualizarconsulta',verifyToken, jsonParser,(req,res)=>{
    let idConsulta =req.body.idConsulta;
    let tipoConsulta = req.body.formvalue.tipoConsulta;
    let nombreAnimal = req.body.formvalue.nombreAnimal;

    let aux = moment(req.body.formvalue.fecha).format("YYYY-MM-DD");
    console.log(req.body.formvalue.hora)
    let fecha = aux.concat(" "+req.body.formvalue.hora+":00");     

    let emailVet =  req.body.formvalue.emailVet;
    let nombreCliente = req.body.formvalue.nombreCliente;
    let rutCliente = req.body.formvalue.rutCliente;
    let descripcion = req.body.formvalue.descripcion;
    let telefonoCliente = req.body.formvalue.telefonoCliente;
    let sql = `update Consulta set fecha='${fecha}', nombreAnimal='${nombreAnimal}', nombreCliente='${nombreCliente}' ,
    rutCliente='${rutCliente}' ,telefonoCliente='${telefonoCliente}' ,emailVet='${emailVet}', 
    tipoConsulta='${tipoConsulta}',  descripcion='${descripcion}'where idConsulta='${idConsulta}'`;
    connection.query(sql, (error, results, fields) =>{
        if(error) throw error;
        else{
            if(results.affectedRows==0) res.json({id: 2});
            else res.json({id: 1});
        }
    });
});
router.delete('/eliminarconsulta',verifyToken,jsonParser ,(req, res) =>{
    const idConsulta = req.body.idConsulta;
    let sql = `delete from Consulta where idConsulta='${idConsulta}'`;
    connection.query(sql, (error, results, fields) =>{
        if(error) throw error;
        else{
            res.json({id:1})
        }
    })
});

router.get("/getall" ,jsonParser,(req, res) =>{
    let sql = 'select * from consulta';
    connection.query(sql, (error, results, fields) =>{
        if(error) throw error;
        else{
            res.json(results);
        }
    })
})
module.exports = router;

function verifyToken(req,res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unathorized Request');
    }
    const token = req.headers.authorization.split(' ')[1]
    if (token == 'null'){
        return res.status(401).send('Unathorized Request');
    }
    const data = jwt.verify(token,'secretkey');
    req.idTipo=data._id;
    next();
}