"use strict";
const mysql = require("mysql");
const options = require("./options.json").database;

// nível 4
function getSensor(req, res) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name FROM sensor";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({
                "Message": "Erro"
            });
        } else {
            res.json({
                "Message": "ok",
                "sensor": rows
            });
        }
    });
}
module.exports.getSensor = getSensor;

function getSamples(req, res) {
    if (req.params.id) {
        let sql = mysql.format("select id,value,timestamp from sample where sensorId = ?;", [req.params.id]);
        let connection = mysql.createConnection(options);
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                res.json({
                    "Message": "Erro"
                });
            } else {
                res.json({
                    "Message": "ok",
                    "samples": rows
                });
            }
        });
    } else {
        res.json({
            "Message": "Erro"
        });
    }

}
module.exports.getSamples = getSamples;