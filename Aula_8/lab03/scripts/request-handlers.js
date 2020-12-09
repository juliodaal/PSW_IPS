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
    var query = "SELECT id, name, birthDate, idCountry FROM person";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({
                "Message": "Erro"
            });
        } else {
            res.json({
                "Message": "ok",
                "person": rows
            });
        }
    });
}
module.exports.getPeople = getPeople;

/**
 * Função para retornar a lista de pessoas da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getCountries(req, res) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name, shortName FROM country";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({
                "Message": "Erro"
            });
        } else {
            res.json({
                "Message": "ok",
                "country": rows
            });
        }
    });
}
module.exports.getCountries = getCountries;

/**
 * Função que permite criar ou editar uma pessoa, consoante o pedido enviado pelo cliente.
 * 
 * @param {Object} request pedido do cliente
 * @param {Object} response resposta do servidor
 */
function createUpdatePerson(req, res) {
    let errorMessage = {error: "***Dados Errados***"};
    let body = req.body
    let sql;
    if (body.name && body.date && body.countries) {
        if (req.params.id) {
            sql = mysql.format("UPDATE `person` SET `name` = ?, `birthDate` = ?, `idCountry` = ? WHERE id = ?", [body.name, body.date, body.countries, req.params.id]);
        } else {
            sql = mysql.format("INSERT INTO `person` (`name`, `birthDate`, `idCountry`) VALUES (?, ?, ?);", [body.name, body.date, body.countries]);
        }
        let connection = mysql.createConnection(options);
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                res.json(errorMessage);
            } else {
                res.json({
                    "Message": "ok",
                    "country": rows
                });
            }
        });
    } else {
        res.json(errorMessage);
    }
}
module.exports.createUpdatePerson = createUpdatePerson;

/**
 * Função que permite remover uma pessoa
 * 
 * @param {Object} request pedido do cliente
 * @param {Object} response resposta do servidor
 */
function removePerson(req, res) {
    let errorMessage = {error: "***Dados Errados***"};
    if (req.params.id) {
        let sql = mysql.format("DELETE FROM `person` WHERE id = ?;", [req.params.id]);
        let connection = mysql.createConnection(options);
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                res.json(errorMessage);
            } else {
                res.json({
                    "Message": "ok",
                    "country": rows
                });
            }
        });
    } else {
        res.json(errorMessage);
    }

}
module.exports.removePerson = removePerson;