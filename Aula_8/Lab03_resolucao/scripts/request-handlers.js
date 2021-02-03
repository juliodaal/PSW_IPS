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
            res.json({"Message": "Erro" });
        } else {
            res.json({"Message": "ok", "person": rows });
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
            res.json({"Message": "Erro" });
        } else {
            res.json({"Message": "ok", "country": rows });
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
    var connection = mysql.createConnection(options);
    var name = req.body.name;
    var birthDate = req.body.birthDate;
    var idCountry = req.body.idCountry;
    var sql;
    if (req.method === "PUT") {
        sql = mysql.format("UPDATE person SET name = ?, birthdate = ? , idCountry = ? WHERE id = ?", [name, birthDate, idCountry, req.params.id]);
    } else {
        if (req.method === "POST") {
            sql = mysql.format("INSERT INTO person(name, birthdate, idCountry) VALUES (?,?,?)", [name, birthDate, idCountry]);
        }
    }
    connection.query(sql,function (err, rows, fields) {
                    if (err) {
                        res.sendStatus(404);
                    } else {
                        res.send(rows);
                    }
        });
    connection.end();
}
module.exports.createUpdatePerson = createUpdatePerson;

/**
 * Função que permite remover uma pessoa
 * 
 * @param {Object} request pedido do cliente
 * @param {Object} response resposta do servidor
 */
function removePerson(req, res) {
    var connection = mysql.createConnection(options);
    var sql = mysql.format("DELETE FROM Person WHERE id = ?", [req.params.id]);
    connection.query(sql,
        function (err, rows, fields) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.send();
            }
        });
    connection.end();
}
module.exports.removePerson = removePerson;