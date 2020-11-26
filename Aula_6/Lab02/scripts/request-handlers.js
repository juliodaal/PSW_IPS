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
    connection.connect(function(err){
        if(!err) {
            console.log("Database is connected ... \n\n");  
        } else {
            console.log("Error connecting database ... \n\n");  
        }
    });
 
    
    var sql = "SELECT id, name, birthDate, idCountry FROM person";
    connection.query(sql, function (err, rows) {
        if (err) {
            console.log("erro: " + err.message);
            res.json({"Message": "Error MySQL query to person table" });
        } else {
            console.log({"Message": "Success", "person": rows });
            res.json({
                "Message": "Success", 
                "person": rows });
        }
    });
    connection.end();
}
module.exports.getPeople = getPeople;

/**
 * Função para retornar a lista de países da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getCountries(req, res) {
    var connection = mysql.createConnection(options);

    connection.connect(function(err){
        if(!err) {
            console.log("Database is connected ... \n\n");  
        } else {
            console.log("Error connecting database ... \n\n");  
        }
        });

        var sql = "SELECT name, shortName FROM country";
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log("erro: " + err.message);
                res.json({"Message": "Error MySQL query to country table" });
            } else {
                console.log({"Message": "Success", "country": rows });
                res.json({
                    "Message": "Success", 
                    "country": rows });
            }
        });
        connection.end();
}
module.exports.getCountries = getCountries;