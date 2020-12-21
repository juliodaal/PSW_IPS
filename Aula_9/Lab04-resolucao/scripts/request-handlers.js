"use strict";
const mysql = require("mysql");
const options = require("./options.json").database;

// nível 4
function getSensors(req, res) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name FROM sensor";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"message": "Erro" });
        } else {
            res.json({"message": "ok", "data": rows });
        }
    });
}
module.exports.getSensors = getSensors;

// nível 4
function getSamples(req, res) {
    var param = req.url.split('/')[2]
    var id = parseInt(param) || 0;
    var connection = mysql.createConnection(options);
    var query = mysql.format("SELECT id, value, timestamp FROM sample WHERE sensorId=?", id);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"message": "Erro" });
        } else {
            res.json({"message": "ok", "data": rows });
        }
    });    
}
module.exports.getSamples = getSamples;