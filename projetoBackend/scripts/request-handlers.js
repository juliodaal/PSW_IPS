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
    let query = "select nome, apelido, email from utilizador where id = ?;";
    throughBody(1,query,"User could not be obtained",res,args);
}
module.exports.getUser = getUser;

/**
 * This function allows you to update the user name
 * @param {*} req 
 * @param {*} res 
 */
let updateUser = (req, res) => {
    let params = paramIsNumber(req);
    let args = Object.values(req.body);
    Array.prototype.push.apply(args, params);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "update utilizador set nome = ?, apelido = ?, email = ? where id = ?;";
    throughBody(4,query,"User could not be obtained",res,args);
}
module.exports.updateUser = updateUser;

/**
 * This function will change the password
 * @param {*} req 
 * @param {*} res 
 */
let updateUserPass = (req, res) => {
    let params = paramIsNumber(req);
    let args = Object.values(req.body);
    Array.prototype.push.apply(args, params);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "update utilizador set pwd = ? where id = ?;";
    throughBody(2,query,"User could not be obtained",res,args);
}
module.exports.updateUserPass = updateUserPass;

/**
 * This function delete the user without record
 * @param {*} req 
 * @param {*} res 
 */
let deleteUser = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "delete from utilizador where id = ?;";
    throughBody(1,query,"User could not be obtained",res,args);
}
module.exports.deleteUser = deleteUser;

/**
 * This function delete the user with the record **** NOT FINISHED ****
 * @param {*} req 
 * @param {*} res 
 */
let deleteUserRecord = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "update utilizador set pwd = ? where id = ?;";
    throughBody(1,query,"User could not be obtained",res,args);
}
module.exports.deleteUserRecord = deleteUserRecord;

/**
 * 
 * BOX TYPE
 * 
 * This function create a new type of box
 * @param {*} req 
 * @param {*} res 
 */
let createBoxType = (req, res) => {
    let args = Object.values(req.body);
    let query = "insert into tipo_box (tipo, id_utilizador_form_utilizador, total_reciclado) values (?,?,0);";
    throughBody(2,query,"Error creating the type box",res,args);
}
module.exports.createBoxType = createBoxType;

/**
 * 
 * This function shows all types and total recycled by type 
 * @param {*} req 
 * @param {*} res 
 */
let showAllBoxType = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) } 
    let query = "select id, tipo, total_reciclado from tipo_box where id_utilizador_form_utilizador = ?;";
    throughBody(1,query,"Error in finding all types of boxes",res,args);
}
module.exports.showAllBoxType = showAllBoxType;

/**
 * 
 * This function update the types of boxes 
 * @param {*} req 
 * @param {*} res 
 */
let updateBoxType = (req, res) => {
    let params = paramIsNumber(req);
    let args = Object.values(req.body);
    Array.prototype.push.apply(args, params);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "update tipo_box set tipo = ?, total_reciclado = ? where id = ? and id_utilizador_form_utilizador = ?;";
    throughBody(4,query,"Error updating the boxes",res,args);
}
module.exports.updateBoxType = updateBoxType;

/**
 * 
 * This function delete one type of box
 * @param {*} req 
 * @param {*} res 
 */
let deleteBoxType = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "delete from tipo_box where id = ? and id_utilizador_form_utilizador = ?;";
    throughBody(2,query,"Error deleting the box",res,args);
}
module.exports.deleteBoxType = deleteBoxType;

/**
 * 
 * BOX
 * 
 * This function create a new box
 * @param {*} req 
 * @param {*} res 
 */
let createBox = (req, res) => {
    let args = Object.values(req.body);
    let query = "insert into box (id,id_utilizador_form_utilizador,tipo_from_tipo_box,quantidade_atual,aviso) values (?,?,?,0,0);";
    throughBody(3,query,"Error creating the box",res,args);
}
module.exports.createBox = createBox;

/**
 * 
 * This function show all boxes associated to a user
 * @param {*} req 
 * @param {*} res 
 */
let getAllBoxes = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "select b.id, tipo, quantidade_atual, aviso from box b join tipo_box tipo on b.tipo_from_tipo_box = tipo.id where b.id_utilizador_form_utilizador = ?;";
    throughBody(1,query,"Error getting the boxes",res,args);
}
module.exports.getAllBoxes = getAllBoxes;

/**
 * 
 * This function show one box associated to a user
 * @param {*} req 
 * @param {*} res 
 */
let getBox = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "select tipo, quantidade_atual, aviso from box b join tipo_box tipo on b.tipo_from_tipo_box= tipo.id where b.id = ? and b.id_utilizador_form_utilizador = ?;";
    throughBody(2,query,"Error getting the box",res,args);
}
module.exports.getBox = getBox;

/**
 * 
 * This function show ids box associated to a user
 * @param {*} req 
 * @param {*} res 
 */
let getIdsBox = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "select id from box where id_utilizador_form_utilizador = ?;";
    throughBody(1,query,"Error getting box ids",res,args);
}
module.exports.getIdsBox = getIdsBox;

/**
 * 
 * This function update the box associated to a user
 * @param {*} req 
 * @param {*} res 
 */
let updateBox = (req, res) => {
    let params = paramIsNumber(req);
    let args = Object.values(req.body);
    Array.prototype.push.apply(args, params);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "update box set quantidade_atual = ?,aviso = ? where id = ? and id_utilizador_form_utilizador = ?;";
    throughBody(4,query,"Error updating box",res,args);
}
module.exports.updateBox = updateBox;

/**
 * 
 * This function update the box associated to a user
 * @param {*} req 
 * @param {*} res 
 */
let changeTypeBox = (req, res) => {
    let params = paramIsNumber(req);
    let args = Object.values(req.body);
    Array.prototype.push.apply(args, params);
    if(args.includes(null)){ handleError("Incompatible parameters",res) }  
    let query = "update box set tipo_from_tipo_box = ? where id = ? and id_utilizador_form_utilizador = ?;";
    throughBody(3,query,"Error updating box",res,args);
}
module.exports.changeTypeBox = changeTypeBox;

/**
 * 
 * This function deleting the box associated to a user
 * @param {*} req 
 * @param {*} res 
 */
let deleteBox = (req, res) => {
    let args = paramIsNumber(req);
    if(args.includes(null)){ handleError("Incompatible parameters",res) } 
    let query = "delete from box where id = ? and id_utilizador_form_utilizador = ?;";
    throughBody(2,query,"Error deleting box",res,args);
}
module.exports.deleteBox = deleteBox;

/**
 * 
 * BOX GANHOS
 * 
 * This function create a new Winnings
 * @param {*} req 
 * @param {*} res 
 */
let createWinnings = async (req, res) => {
    let params = paramIsNumber(req);
    let query = "select id from box where id = ?;";
    let isBox = await isVerification(1,query,"Error box does not exist",res,[params[0]],true); // isBox 
    if(isBox.message === true){
        let args = Object.values(req.body);
        Array.prototype.push.apply(args, [params[0]]);
        var d = new Date();
        let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        args.push(date);
        query = "insert into box_ganhos (total_esvaziado, peso, id_box, hora_data_esvaziado) values (?,?,?,convert(?,datetime));";
        let isCreated = await isVerification(4,query,"Error creating the new winnings",res,args,true);
        if(isCreated.message === true){
            args = [0,0]; // Default Values
            Array.prototype.push.apply(args, params);
            query = "update box set quantidade_atual = ?,aviso = ? where id = ? and id_utilizador_form_utilizador = ?;";
            throughBody(4,query,"Error updating the box",res,args);
        } else {
            handleError(isBox.message,res)
        }
    } else {
        handleError(isBox.message,res)
    }
    // isBox.then(isBox => {
    //     if(isBox.message === true){
    //         let args = Object.values(req.body);
    //         Array.prototype.push.apply(args, params);
    //         var d = new Date();
    //         let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    //         args.push(date);
    //         query = "insert into box_ganhos (id_box, total_esvaziado, peso, hora_data_esvaziado) values (?,?,?,?);";
    //         return isVerification(4,query,"Error creating the new winnings",res,args,true);
    //     }  else {
    //         handleError(isBox.message,res)
    //     }
    // });
    // isBox.then(isCreated => {
    //     if(isCreated.message === true){
    //         let args = [0,0]; // Default Values
    //         query = "update box set quantidade_atual = ?,aviso = ? where id = ? and id_utilizador_form_utilizador = ?;";
    //         throughBody(4,query,"Error updating the box",res,args);
    //     } else {
    //         handleError(isBox.message,res)
    //     }
    // });
    // isBox.catch(errorMsg => { return errorMsg.message });
}
module.exports.createWinnings = createWinnings;

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

/**
 * This function allows you to validate if the parameter is a number
 * @param {*} req 
 */
let paramIsNumber = (req) => {
    let params = Object.values(req.params);
    let arr = []
    params.map(param => { !Number.isInteger(parseInt(param)) && (param = null); arr.push(param)})
    return arr; 
}

/**
 * This function allows you to make checks through database queries
 * @param {Integer} length 
 * @param {String} query
 * @param {String} error 
 * @param {*} res 
 * @param {Array} data 
 * @param {Boolean} verification 
 */
let isVerification = (length,query,error,res,data,verification) => {
    let result = throughBody(length,query,error,res,data,verification);
    if(result === null){ return { "message": "Connection Error" } }
    return result;
}

/**
 * This function catches the error and returns the message in JSON
 * @param {String} message 
 * @param {*} res
 */
let handleError = (message, res) => {
    res.json({
        "Message": message
    });
}
