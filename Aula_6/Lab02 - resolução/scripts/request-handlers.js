"use strict";
const mysql = require("mysql");
const options = require("./connectionOptions.json");

/**
 * Função para retornar a lista de pessoas da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getPeople(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "SELECT id, name, birthDate, idCountry FROM person";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"Message": "Error MySQL query to person table" });
        } else {
            res.json({"Message": "Success", "person": rows });
        }
    });
}
module.exports.getPeople = getPeople;

/**
 * Função para retornar a lista de países da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getCountries(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "SELECT id, name, shortName FROM country";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"Message": "Error MySQL query to country" });
        } else {
            res.json({"Message": "Success", "country": rows });
        }
    });
}
module.exports.getCountries = getCountries;