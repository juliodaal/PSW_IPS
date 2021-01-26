"use strict";
const mysql = require("mysql");
// const passport = require("passport");
const options = require("./options.json").database;
const bcrypt = require("bcryptjs");

function Exception(message, type) {
    this.type = type;
    this.message = message;
}

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let createUser = (body) => {
    let args = Object.values(body);
    let query = "insert into utilizador (nome, apelido, email, pwd, tipo_from_tipo_utilizador) values (?,?,?,?,1);";
    return packingRequest(args,query,"User already exists", "User created with success");
}

module.exports.createUser = createUser;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getUser = (body) => {
    let args = Object.values(body); // Cambiar la query de abajo
    let query = "select id from utilizador where email = ?;";
    return packingRequest(args,query,"Incorrect Data", "User exists");
}

module.exports.getUser = getUser;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */
let getUserById = (body) => {
    let args = Object.values(body); // Cambiar la query de abajo
    let query = "select id,nome,apelido,email,tipo_from_tipo_utilizador from utilizador where id = ?;";
    return packingRequest(args,query,"User do not exists", "User exists");
}

module.exports.getUserById = getUserById;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getUserPass = (body) => {
    let args = Object.values(body);
    let query = "select id,nome,apelido,email,tipo_from_tipo_utilizador from utilizador where id = ? and pwd = ?;";
    return packingRequest(args,query,"Incorrect Data", "User exists");
}

module.exports.getUserPass = getUserPass;


/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let createNewTask = async (req,body) => {
    // let args = Object.values(body); // Cambiar la query de abajo
    let { message, date, project, priority } = body;
    let query = "insert into tarefa (titulo,descricao,date,expirado,feita) values (?,?,STR_TO_DATE(?,'%Y-%m-%d'),0,0);";
    let responseTask = await packingRequest([project,message,date],query,"Error in creating the task","Task Created");
    if(responseTask.message != "error"){
        let idTask = responseTask.data[1].insertId;
        let idUser = req.user.id;
        query = "insert into utilizador_tarefa (id_utilizador, id_tarefa) values (?,?);"
        let responseUserTask = await packingRequest([idUser,idTask],query,"Error associating the task with the user","Task associated successfully to the user");
        return responseUserTask;
    } else {
        return responseTask;
    }
}

module.exports.createNewTask = createNewTask; 

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let createProject = async (req,body) => {
    // let args = Object.values(body); // Cambiar la query de abajo
    let { message} = body;
    let query = "insert into projeto (titulo,descricao) values (?,?);";
    let responseTask = await packingRequest([message,"descricao"],query,"Error in creating the project","Project Created");
    if(responseTask.message != "error"){
        let idProject = responseTask.data[1].insertId;
        let idUser = req.user.id;
        query = "insert into utilizador_projeto (id_utilizador, id_projeto) values (?,?);"
        let responseUserTask = await packingRequest([idUser,idProject],query,"Error associating the project with the user","Project associated successfully to the user");
            return responseUserTask;
    } else {
        return responseTask;
    }
}

module.exports.createProject = createProject;

 /**
 * 
 * Function
 * @param {*} params 
 * */ 
let allTasks = (params) => {
    let args = Object.values(params);
    let query = "select t.id,t.titulo,t.descricao,t.date from utilizador u join utilizador_tarefa ut on u.id=ut.id_utilizador join tarefa t on ut.id_tarefa=t.id where ut.id_utilizador = ? and t.feita = 0;";
    return packingRequest(args,query,"Error finding the tasks","Tasks Found");
}
module.exports.allTasks = allTasks;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let deleteTask = (body) => {
    let query = "delete from tarefa where id = ?;";
    return packingRequest([body.id],query,"Error finding the tasks", "Task deleted successfully");
}
module.exports.deleteTask = deleteTask;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let doneStatistics = (req) => {
    let query = "select t.id, t.date from utilizador u join utilizador_tarefa ut on u.id=ut.id_utilizador join tarefa t on ut.id_tarefa=t.id where ut.id_utilizador = ? and t.feita = 1;";
    return packingRequest([req.user.id],query,"Error finding the tasks", "Tasks founds successfully");
}
module.exports.doneStatistics = doneStatistics;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let deleteTaskUser = (req,body) => {
    let args = [ body.id, req.user.id ];
    let query = "delete from utilizador_tarefa where id_tarefa = ? and id_utilizador = ?;";
    return packingRequest(args,query,"Error finding the tasks", "Task deleted successfully");
}
module.exports.deleteTaskUser = deleteTaskUser;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let getTask = (params) => {
    let args = Object.values(params);
    let query = "select * from utilizador where id = ?;";
    return packingRequest(args,query,"Error finding the task");
}
module.exports.getTask = getTask;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let doneTask = (req,body) => {
    let args = [ 1, body.id, req.user.id ];
    let query = "update utilizador u join utilizador_tarefa ut on u.id=ut.id_utilizador join tarefa t on ut.id_tarefa=t.id set t.feita = ? where t.id = ? and u.id = ?;";
    return packingRequest(args,query,"Error updating the task","Task updated successfully");
}
module.exports.doneTask = doneTask;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let updateTaskMessage = (req,body) => {
    let args = [ body.message, body.id, req.user.id ]
    let query = "update utilizador u join utilizador_tarefa ut on u.id=ut.id_utilizador join tarefa t on ut.id_tarefa=t.id set t.descricao = ? where t.id = ? and u.id = ?;";
    return packingRequest(args,query,"Error updating the task","Task updated successfully");
}

module.exports.updateTaskMessage = updateTaskMessage;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let updateTaskCalendar = (req,body) => {
    let args = [ body.message, body.id, req.user.id ];
    let query = "update utilizador u join utilizador_tarefa ut on u.id=ut.id_utilizador join tarefa t on ut.id_tarefa=t.id set t.date = STR_TO_DATE(?,'%Y-%m-%d') where t.id = ? and u.id = ?;";
    return packingRequest(args,query,"Error updating the task","Task updated successfully");
}

module.exports.updateTaskCalendar = updateTaskCalendar;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let getProject = (id) => {
    let query = "select p.titulo from utilizador u join utilizador_projeto up on u.id=up.id_utilizador join projeto p on up.id_projeto=p.id where u.id = ?;";
    return packingRequest([id],query,"Error getting the task","Task obtained successfully");
}

module.exports.getProject = getProject;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let getProjectById = (idTask,idUser) => {
    let query = "select t.titulo from utilizador u join utilizador_tarefa ut on u.id=ut.id_utilizador join tarefa t on  ut.id_tarefa=t.id where t.id = ? and u.id = ?;";
    return packingRequest([idTask,idUser],query,"Error getting the task","Task obtained successfully");
}

module.exports.getProjectById = getProjectById;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let editProject = (req,body) => {
    let args = [ body.message, body.id, req.user.id ];
    let query = "update utilizador u join utilizador_tarefa ut on u.id=ut.id_utilizador join tarefa t on ut.id_tarefa=t.id set t.titulo = ? where t.id = ? and u.id = ?;";
    return packingRequest(args,query,"Error updating the task","Task updated successfully");
}

module.exports.editProject = editProject;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let getMessage = (id) => {
    let query = "select descricao from tarefa where id = ?;";
    return packingRequest([id],query,"Error getting the task","Task obtained successfully");
}

module.exports.getMessage = getMessage;

/**
 * 
 * Function
 * @param {*} params 
 * */ 
let getCalendar = (id) => {
    let query = "select date from tarefa where id = ?;";
    return packingRequest([id],query,"Error getting the task","Task obtained successfully");
}

module.exports.getCalendar = getCalendar;

/**
 * 
 * 
 * @param {*} body 
 * @param {String} query 
 * @param {String} errorMessage 
 * */ 
let packingRequest = async (args,query,errorMessage,successMessage) => {
    try {
        if (isExistArguments(args)) {
            return await sendRequest(query, args, errorMessage,successMessage);
        } else {
            throw new Exception("Complete all the fields", 1);
        }
    } catch (e) {
        return handleError(e);
    }
};

/**
 * Function that makes the query to the database
 * @param {String} sql 
 * @param {String} errorMsg 
 * @param {*} res 
 * @param {Boolean} verification
 * */
let sendRequest = (query, data, errorMessage,successMessage) => {
    let success = [];
    success.push({ message: successMessage })
    try {
        let sql = mysql.format(query, data);
        let connection = mysql.createConnection(options);
        connection.connect(); // Hace verificacion asincrona de conexion.
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, rows, fields) {
                if (err || rows.length == 0) {
                    reject(new Exception(errorMessage, 2));
                } else {
                    success.push(rows)
                    resolve({ message: "success", data: success });
                }
            });
        });
    } catch (e) {
        return handleError(e);
    }
};

let isExistArguments = (args) => {
    for (const arg of args) {
        if (arg === undefined || arg === '') { return false }
    }
    return true;
};

let encrypPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

let matchPassword = async (password, passwordBD) => {
    return await bcrypt.compare(password, passwordBD);
};

let handleError = message => {
    return { message: "error", data: [message] };
};