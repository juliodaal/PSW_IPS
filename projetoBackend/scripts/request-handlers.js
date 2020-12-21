"use strict";
const mysql = require("mysql");
const options = require("./options.json").database;


/**
 * User
 * 
 * Function that creates the user and returns a message in response
 * @param {*} req 
 * @param {*} res 
 */
let createUser = (req, res) => {
    let args = Object.values(req.body);
    let query = "insert into utilizador (nome, apelido, email, pwd, tipo_from_tipo_utilizador) values (?,?,?,?,1);"
    throughBody(4,query,"Error creating the user",res,args);
}
module.exports.createUser = createUser;

/**
 * Function that verifies if a user exists in the database and returns a message in response
 * @param {*} req 
 * @param {*} res 
 */
let verifyUser = (req, res) => {
    let args = Object.values(req.body);
    let query = "select id, nome, apelido, tipo_from_tipo_utilizador from utilizador where email = ? and pwd = ?;";
    throughBody(2,query,"Wrong credentials",res,args);
}
module.exports.verifyUser = verifyUser;

/**
 * This function allows you to obtain a user
 * @param {*} req 
 * @param {*} res 
 */
let getUser = (req, res) => {
    let args = Object.values(req.params);
    let query = "select nome, apelido, email from utilizador where id = ?";
    throughBody(1,query,"User could not be obtained",res,args);
}
module.exports.getUser = getUser;

/**
 * This function allows you to update the user name
 * @param {*} req 
 * @param {*} res 
 */
let updateUserName = (req, res) => {
    let params = paramIsNumber(req);
    let args = Object.values(req.body);
    Array.prototype.push.apply(args, params);
    if(args.includes(null)){ throw handleError("Incompatible parameters",res) }  
    let query = "update utilizador set nome = ? where id = ?"; // ******* Hay que cambiarlo para que cambie todos los datos
    throughBody(2,query,"User could not be obtained",res,args);
}
module.exports.updateUserName = updateUserName;

/**
 * Function that takes the data submitted through the body request and processes them to make the sql query 
 * @param {*} req 
 * @param {*} res 
 */
let throughBody = (length,query,error,res,data) => {
    if (data.length === length) {
        let sql = mysql.format(query, data);
        sendRequest(sql,error,res);
    } else {
        throw handleError("Complete all the fields",res)
    }
}

/**
 * Function that makes the query to the database
 * @param {*} req 
 * @param {*} res 
 */
let sendRequest = (sql, errorMsg, res) => {
    let connection = mysql.createConnection(options);
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err || rows.length == 0) {
                throw handleError(errorMsg,res)
            } else {
                res.json({
                    "Message": "ok",
                    "data": rows
                });
            }
        });
}

/**
 * This function allows you to validate if the parameter is a number
 * @param {*} req 
 * @param {*} res 
 */
let paramIsNumber = (req) => {
    let params = Object.values(req.params);
    let arr = []
    params.map(param => { !Number.isInteger(parseInt(param)) && (param = null); arr.push(param)})
    return arr; 
}

let handleError = (message, res) => {
    res.json({
        "Message": message
    });
}
