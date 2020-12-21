const mysql = require("mysql");
const connectionOptions = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "exemplo"
};

function createCustomer(req, res) {
    res.render("create-customer");
}

module.exports.createCustomer = createCustomer;

function postalDescription(req, res) {
    var errorMessage = {
        internalCode: "",
        postalDescription: "***Localidade Inexistente***"
        };        
    if (req.params.code) {
        let [pc4, pc3] = req.params.code.split("-").map(Number);
        if (pc4 && pc3) {
            let sql = mysql.format("SELECT id as internalCode, pcalpha as postalDescription FROM postal_code WHERE pc4=? and pc3=?;", [pc4, pc3]); // Previne SQL Injection
            let connection = mysql.createConnection(connectionOptions);
            connection.connect();
            connection.query(sql, function (err, rows, fields) {
                if (err) {
                    res.json(errorMessage);
                } else {
                    if (rows.length === 1) {
                        res.json(rows[0]);
                    } else {
                        res.json(errorMessage);
                    }
                }
            });
            connection.end();
        } else {
            res.json(errorMessage);
        }
    } else {
        res.json(errorMessage);
    }
}

module.exports.postalDescription = postalDescription;