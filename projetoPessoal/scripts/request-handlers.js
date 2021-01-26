"use strict";
const mysql = require("mysql");
const options = require("./options.json").database;

/**
 * User
 * 
 * Function alow you authenticate an user
 * @param {String} username 
 * @param {String} password
 */
let authenticateUser = (username, password) => {
    
}

/**
 * Function that takes the data submitted through the body request and processes them to make the sql query 
 * @param {Integer} length 
 * @param {String} query 
 * @param {String} error 
 * @param {*} res 
 * @param {Array} data 
 * @param {Boolean} verification 
 */
let throughBody = async (length,query,error,res,data,verification = false) => {
    if (data.length === length) {
        let sql = mysql.format(query, data);
        return await sendRequest(sql,error,res, verification);
    } else {
        return handleError("Complete all the fields",res)
    }
}

/**
 * Function that makes the query to the database
 * @param {String} sql 
 * @param {String} errorMsg 
 * @param {*} res 
 * @param {Boolean} verification 
 */
let sendRequest = (sql, errorMsg, res, verification = false) => {
    let connection = mysql.createConnection(options);
        connection.connect();
        return new Promise ((resolve, reject) => {
            connection.query(sql, function (err, rows, fields) {
                if (verification){
                    if (err || rows.length == 0){
                        handleError(errorMsg,res);
                    } else {
                        resolve({ "message": true});
                    }
                } else if (err || rows.length == 0) {
                    handleError(errorMsg,res);
                } else {
                    res.json({
                        "Message": "ok",
                        "data": rows
                    });
                }
            });
        });
}