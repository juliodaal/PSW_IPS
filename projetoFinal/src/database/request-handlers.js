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
let getTypeBox = (req) => {
    let query = "select tipo, sum(b.total_reciclado) as 'quantidade' from tipo_box tb join box b on tb.id = b.tipo_from_tipo_box group by tipo;";
    return packingRequest([0],query,"Type Box do not found", "Types Box found");
}

module.exports.getTypeBox = getTypeBox;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getDataDashboard = (req) => {
    let args = [req.user.tipo_from_tipo_utilizador, req.user.id];
    let query = "select b.id,tb.tipo,b.quantidade_atual,b.aviso,b.total_reciclado from utilizador u join box b on u.id=b.id_utilizador_form_utilizador join tipo_box tb on b.tipo_from_tipo_box=tb.id where u.tipo_from_tipo_utilizador = ? and u.id = ? order by id;";
    return packingRequest(args,query,"Box do not exists", "Box found");
}

module.exports.getDataDashboard = getDataDashboard;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getDataDashboardById = (id) => {
    let args = [1,parseInt(id)];
    let query = "select b.id,tb.tipo,b.quantidade_atual,b.aviso,b.total_reciclado from utilizador u join box b on u.id=b.id_utilizador_form_utilizador join tipo_box tb on b.tipo_from_tipo_box=tb.id where u.tipo_from_tipo_utilizador = ? and u.id = ? order by id;";
    return packingRequest(args,query,"Client do not exists", "Client found");
}

module.exports.getDataDashboardById = getDataDashboardById;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let createClient = (body) => {
    let {name,lastName,email,password,company} = body;
    let query = "insert into utilizador (nome,apelido,email,pwd,company,tipo_from_tipo_utilizador) values (?,?,?,?,?,1);";
    return packingRequest([name,lastName,email,password,company],query,"Error creating the client", "Client Created");
}

module.exports.createClient = createClient;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let createWorker = (body) => {
    let {name,lastName,email,password,company} = body;
    let query = "insert into utilizador (nome,apelido,email,pwd,company,tipo_from_tipo_utilizador) values (?,?,?,?,?,2);";
    return packingRequest([name,lastName,email,password,company],query,"Error creating the worker", "Worker Created");
}

module.exports.createWorker = createWorker;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getDataClientDashboard = (req) => {
    let query = "select id,nome,apelido,company,email from utilizador where tipo_from_tipo_utilizador = ?;";
    return packingRequest([1],query,"Client do not exists", "Client found");
}

module.exports.getDataClientDashboard = getDataClientDashboard;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getDataWorkerDashboard = (req) => {
    let query = "select id,nome,apelido,company,email from utilizador where tipo_from_tipo_utilizador = ?;";
    return packingRequest([2],query,"Client do not exists", "Client found");
}

module.exports.getDataWorkerDashboard = getDataWorkerDashboard;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getClientById = (id) => {
    let query = "select id,nome,apelido,email,company from utilizador where id = ? and tipo_from_tipo_utilizador = 1;";
    return packingRequest([id],query,"Client do not exists", "Client found");
}

module.exports.getClientById = getClientById;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getClientStatistics = id => {
    let query = "select id, data from historico_cliente where id_utilizador_from_utilizador = ?;";
    return packingRequest([id],query,"Client do not exists", "Client found");
}

module.exports.getClientStatistics = getClientStatistics;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getWorkerStatistics = id => {
    let query = "select id, data from historico_trabalhador where id_utilizador_from_utilizador = ?;";
    return packingRequest([id],query,"Client do not exists", "Client found");
}

module.exports.getWorkerStatistics = getWorkerStatistics;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let getWorkerById = (id) => {
    let query = "select id,nome,apelido,email,company from utilizador where id = ? and tipo_from_tipo_utilizador = 2;";
    return packingRequest([id],query,"Worker do not exists", "Worker found");
}

module.exports.getWorkerById = getWorkerById;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let editClient = (body,id) => {
    let {name,lastName,email,company}=body
    let query = "update utilizador set nome = ?, apelido = ?, email = ?, company = ? where id = ?;";
    return packingRequest([name,lastName,email,company,id],query,"Client do not exists", "Client found");
}

module.exports.editClient = editClient;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let deleteClient = async (id) => {
    let query = "delete from box where id_utilizador_form_utilizador = ?;";
    let response = packingRequest([id],query,"Client do not exists", "Client found");
    response.then((res)=>{ 
        if(res.message == "success"){
            let query = "delete from tipo_box where id_utilizador_form_utilizador = ?;";
            return packingRequest([id],query,"Client do not exists", "Client found");
        } else {
            throw handleError("Error finding the client")
        }
    }); 
    return response.then((res) =>{
        if(res.message == "success"){
            let query = "delete from utilizador where id = ?;";
            return packingRequest([id],query,"Client do not exists", "Client found");
        } else {
            handleError("Error finding the client")
        }
    });
    
}

module.exports.deleteClient = deleteClient;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let deleteWorker = async (id) => {
    let query = "delete from utilizador where id = ? and tipo_from_tipo_utilizador = ?;";
    return packingRequest([id,2],query,"Client do not exists", "Client found");
}

module.exports.deleteWorker = deleteWorker;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let registerBoxEmptied = async (body, id) => {
    let { idBox, total, peso, date } = body
    let query = "insert into box_ganhos (id_box,total_esvaziado,peso,data) values (?,?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
    let response = packingRequest([idBox,total,peso,date],query,"Error registering box", "Box resgistered")
    .then(res => {
        if(res.message == "success"){
            let query = "insert into historico_box (id_box_from_box,quantidade_atual,data) values (?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
            return packingRequest([idBox,total,date],query,"Box not found", "Box found")
        } else {
            return {message: "error", data: []};
        }
   
    })
    .then(res => {
        if(res.message == "success"){
            let query = "insert into historico_trabalhador (id_utilizador_from_utilizador,id_box_from_box,data) values (?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
            return packingRequest([id,idBox,date],query,"Box not found", "Box found")
        } else {
            return {message: "error", data: []};
        }
    })
    .then(res => {
        if(res.message == "success"){
            let query = "select total_reciclado from box where id = ?";
            return packingRequest([idBox],query,"Box not found", "Box found")
        } else {
            return {message: "error", data: []};
        }
    })
    .then(res => {
        if(res.message == "success"){
            let query = "update box set quantidade_atual = ?, total_reciclado = ?, aviso = ? where id = ?";
            return packingRequest([0,res.data[0].total_reciclado + parseInt(total),0,idBox],query,"Box not found", "Box Updated and Registered")
        } else {
            return {message: "error", data: []};
        }
    })
    .catch(res => {
        return res;
    })
    return response;
}

module.exports.registerBoxEmptied = registerBoxEmptied;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let findTypesBox = (id) => {
    let query = "select tipo from tipo_box where id_utilizador_form_utilizador = ?;";
    return packingRequest([id],query,"Box Type not found", "Box Type found");
}

module.exports.findTypesBox = findTypesBox;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let createBoxType = (body,id) => {
    let {type} = body
    let query = "insert into tipo_box (id_utilizador_form_utilizador,tipo,total_reciclado) values (?,?,0);";
    return packingRequest([id,type],query,"Box Type not found", "Box Type found");
}

module.exports.createBoxType = createBoxType;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let createBox = (body,id) => {
    let {type,quantity} = body
    let query = "select id from tipo_box where id_utilizador_form_utilizador = ? and tipo = ?;";
    let response = packingRequest([id,type],query,"Box Type not found", "Box Type found")
    .then((res) => {
        if(res.message == "success"){
            let typeId = res.data[0].id;
            let query = "insert into box (id_utilizador_form_utilizador,tipo_from_tipo_box,quantidade_atual,total_reciclado,aviso) values (?,?,?,0,0);";
            let responseBack = packingRequest([id,typeId,quantity],query,"Box Type not found", "Box Type found");
            responseBack.then(res => {
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();
                today = yyyy + '-' + dd + '-' + mm;
                query = "insert into historico_cliente (id_utilizador_from_utilizador,id_box_from_box,data) values (?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
                packingRequest([id,res.data.insertId,today],query,"Box Type not found", "Box Type found");
            })
            return responseBack;
        }
    })
    .catch((res)=>{
        return res
    })
    return response
}

module.exports.createBox = createBox;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let findBox = (id) => {
    let query = "select b.id,tb.tipo,b.quantidade_atual,b.aviso,b.total_reciclado from utilizador u join box b on u.id=b.id_utilizador_form_utilizador join tipo_box tb on b.tipo_from_tipo_box=tb.id where b.id = ?;";
    return packingRequest([id],query,"Box Type not found", "Box Type found");
}

module.exports.findBox = findBox;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let boxStatistics = id => {
    let query = "select sum(quantidade_atual) as 'quantity',data from historico_box where id_box_from_box = ? group by data;";
    return packingRequest([id],query,"Box Type not found", "Box Type found");
}

module.exports.boxStatistics = boxStatistics;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let editBox = (body,id) => {
    let {quantity,full,recycle} = body;
    if(parseInt(full) == 1){
        let query = "update box set quantidade_atual = ?, total_reciclado = ?, aviso = ? where id = ?";
        let response = packingRequest([quantity,recycle,full,id],query,"Box not found", "Box found")
        .then(res => {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = yyyy + '-' + dd + '-' + mm;
            let query = "insert into historico_box (id_box_from_box,quantidade_atual,data) values (?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
            return packingRequest([id,quantity,today],query,"Box not found", "Box found")
        })
        .catch(res =>{
            return {message: "error", data: []};
        })
        return response;
    } else {
        let query = "update box set quantidade_atual = ?, total_reciclado = ?, aviso = ? where id = ?";
        return packingRequest([quantity,recycle,full,id],query,"Box not found", "Box found");
    }
}

module.exports.editBox = editBox;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let deleteBox = (id) => {
    let query = "delete from box where id = ?";
    return packingRequest([id],query,"Box not found", "Box found");
}

module.exports.deleteBox = deleteBox;

/**
 * 
 * Function that creates a new task
 * @param {*} body 
 * */ 
let deleteTypeBox = async (body,id) => {
    let {type} = body
    let query = "select id from tipo_box where tipo = ? and id_utilizador_form_utilizador = ?;";
    let result = packingRequest([type,id],query,"Box Type not found", "Box Type found")
    .then(res => {
        if(res.message == "success"){
            let query = "select id from box where tipo_from_tipo_box = ? and id_utilizador_form_utilizador = ?";
            return packingRequest([res.data[0].id,id],query,"Box Type not found", "Box Type found")
        } else {
            throw { message: "error", data: [] }
        }
    })
    .then(res => {
        if(res.message == "success"){
            let result;
            res.data.forEach(box => {
                let query = "delete from historico_box where id_box_from_box = ?;";
                result = packingRequest([box.id],query,"Box Historic not found", "Box Historic found")
            });
            return result;
        } else {
            throw { message: "error", data: [] }
        }
    });
    let aux  = await result;
    if(aux.message == "success"){
        let query = "select id from tipo_box where tipo = ? and id_utilizador_form_utilizador = ?;";
        let response = packingRequest([type,id],query,"Box Type not found", "Box Type found")
        .then(res => {
            if(res.message == "success"){
                let query = "delete from box where tipo_from_tipo_box = ? and id_utilizador_form_utilizador = ?;";
                return packingRequest([res.data[0].id,id],query,"Box Type not found", "Box Type found")
            } else {
                throw { message: "error", data: [] }
            }
        })
        .then(res => {
            if(res.message == "success"){
                let query = "delete from tipo_box where tipo = ? and id_utilizador_form_utilizador = ?;";
                return packingRequest([type,id],query,"Box Type not found", "Box Type found");
            } else {
                throw { message: "error", data: [] }
            }
        })
        .catch(error => {
            return error;
        })
        return response;
    } else {
        return { message: "error", data: []}
    }
}

module.exports.deleteTypeBox = deleteTypeBox;

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

let pool  = mysql.createPool({
    connectionLimit : 10,
    host            : options.host,
    user            : options.user,
    password        : options.password,
    database        : options.database
});

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
    let sql = mysql.format(query, data);
    return new Promise((resolve, reject) => {
        pool.query(sql, function (err, rows, fields) {
            if (err) {
                reject(new Exception(errorMessage, 2));
            } else {
                resolve({ message: "success", data: rows });
            }
        });
    });
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