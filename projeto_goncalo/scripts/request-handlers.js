"use strict";
const mysql = require("mysql");
const options = require("./options.json").database;

// nível 4
/*var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'passwd'
  },
  function(username, password, done) {
    // ...
  }
));*/

/* Função para retornar a lista de pessoas da BD.
 * @param {*} req 
 * @param {*} res 
 */

function getUser(username) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "select id, name, password from user where name = ?;";
    let sql = mysql.format(query, [username]);
    return new Promise((resolve,reject) => {
      connection.query(sql, function (err, rows) {
        if (err) {
            reject({"message": "Erro" });
          } else {
            resolve({"message": "ok", "data": rows });
          }
      });
    });
}
module.exports.getUser = getUser;


function getUserPass(obj) {
  let { id, password } = obj;
  var connection = mysql.createConnection(options);
  connection.connect();
  var query = "select id, name from user where id = ? and password = ?;";
  let sql = mysql.format(query, [id, password]);
  return new Promise((resolve,reject) => {
    connection.query(sql, function (err, rows) {
      if (err) {
          reject({"message": "error" });
        } else {
          resolve({"message": "ok", "data": rows });
        }
    });
  });
}
module.exports.getUserPass = getUserPass;


function createUserAnime(req,res) {
  if(req.user == undefined){
    res.redirect("/");
  } else {
    let { id } = req.params;
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "insert into user_anime(id_utilizador, id_anime) VALUES (?,?);";
    let sql = mysql.format(query, [req.user.id, id]);
    connection.query(sql, function (err, rows) {
      if (err) {
          res.json({"message": "Erro" });
        } else {
          res.redirect("/index");
        }
    });
  }
}
module.exports.createUserAnime = createUserAnime;


function getAnimes(req,res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "select id,name_anime,resumo,image from anime;";
    let sql = mysql.format(query, [1]);
    connection.query(sql, function (err, rows) {
      console.log(err);
      if (err) {
          res.json({"message": "Erro" });
        } else {
          res.json({"message": "success", "data": rows });
        }
    });
}
module.exports.getAnimes = getAnimes;

function getUserById(id) {
  var connection = mysql.createConnection(options);
  connection.connect();
  var query = "select id, name from user where id = ?";
  let sql = mysql.format(query, [id]);
  return new Promise((resolve,reject) => {
    connection.query(sql, function (err, rows) {
      if (err) {
          reject({"message": "error" });
        } else {
          resolve({"message": "ok", "data": rows });
        }
    });
  });
}
module.exports.getUserById = getUserById;

function getIndex(req,res) {
  var connection = mysql.createConnection(options);
  connection.connect();
  var query = "select a.name_anime,a.image from user u join user_anime ua on u.id=ua.id_utilizador join anime a on ua.id_anime=a.id where u.id = ?;";
  let sql = mysql.format(query, [req.user.id]);
  connection.query(sql, function (err, rows) {
    if (err) {
         res.json({"message": "Erro" });
      } else {
          res.render("index", { animes: rows, user:req.user });
      }
  });
}
module.exports.getIndex = getIndex;

/* Função para retornar a lista de pessoas da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getAnimes(req, res) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name, categoria, resumo, image FROM anime";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"Message": "Erro" });
        } else {
            res.json({"Message": "ok", "anime": rows });
        }
    });
}
module.exports.getAnimes = getAnimes;
/* Função que permite criar ou editar uma pessoa, consoante o pedido enviado pelo cliente.
 * 
 * @param {Object} request pedido do cliente
 * @param {Object} response resposta do servidor
 */

function createUsers(req, res) {
  if(req.body.password != req.body.repeatPassword) {
    res.render("index");
  }else {
    let {username, password} = req.body;
    var connection = mysql.createConnection(options);
    connection.connect();
    let sql = mysql.format("insert into user (name, password) VALUES (?, ?);", [username, password]);
    connection.query(sql,function (err, rows, fields) {
      if (err) {
          res.sendStatus(404);
      } else {
          res.render("index");
      }
  });
  connection.end();
  }
}
 module.exports.createUsers = createUsers;

function createUpdateUser(req, res) {
    var connection = mysql.createConnection(options);
    var username = req.body.username;
    var sql;
    if (req.method === "PUT") {
        sql = mysql.format("UPDATE user SET name = ?, password = ?  WHERE id = ?", [username, password, req.params.id]);
    } else {
        if (req.method === "POST") {
            sql = mysql.format("INSERT INTO user(username, password) VALUES (?,?,?)", [username, password, id_nime]);
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
module.exports.createUpdateUser = createUpdateUser;

/* Função que permite remover uma pessoa
 * 
 * @param {Object} request pedido do cliente
 * @param {Object} response resposta do servidor
 */
function removeUser(req, res) {
    var connection = mysql.createConnection(options);
    var sql = mysql.format("DELETE FROM user WHERE id = ?", [req.params.id]);
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
module.exports.removeUser = removeUser;

function getAnimesBD(req, res) {
  var connection = mysql.createConnection(options);
  connection.connect(function(err){
      if(!err) {
          // console.log("Database is connected ... \n\n");  
      } else {
          console.log("Error connecting database ... \n\n");  
      }
  });

  
  var sql = "SELECT name_animes, image FROM anime";
  connection.query(sql, function (err, animes) {
      if (err) {
          console.log("erro: " + err.message);
          res.json({"Message": "Error MySQL query to anime table" });
      } else {
          // console.log({"Message": "Success", "anime": animes });
          res.render('index');
      }
  });
  connection.end();
}
module.exports.getAnimesBD = getAnimesBD;
/*
function getSensors(req, res) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name FROM sensor";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"message": "Erro" });
        } else {
            res.json({"message": "ok", "data": rows });
        }
    });
}
module.exports.getSensors = getSensors;

// nível 4
function getSamples(req, res) {
    var param = req.url.split('/')[2]
    var id = parseInt(param) || 0;
    var connection = mysql.createConnection(options);
    var query = mysql.format("SELECT id, value, timestamp FROM sample WHERE sensorId=?", id);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"message": "Erro" });
        } else {
            res.json({"message": "ok", "data": rows });
        }
    });    
}
module.exports.getSamples = getSamples;*/