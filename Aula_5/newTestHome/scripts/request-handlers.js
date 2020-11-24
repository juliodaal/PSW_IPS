var createTemplate = require("./create-template");
var path = require("path");
var fs = require("fs");
let superData = ``
function sendTemplate(response, model) {
    return function (template) {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.end(template(model));
    };
}

//resposta com o ficheiro styles
function styles(request, response) {
    var rootFolder = path.dirname(require.main.filename);
    var fileName = path.join(rootFolder, "www/styles/styles.css");
    fs.readFile(fileName, function (err, data) {
        if (err) {
            response.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.end("HTTP Status: 404 : NOT FOUND");
        } else {
            response.writeHead(200, {
                "Content-Type": "text/css; charset=utf-8"
            });
            response.end(data);
        }
    });
}

//resposta com a view formulário
function form(request, response) {
    createTemplate("form", sendTemplate(response));
}

/**
 * @todo Definir métodos que implementem a criação das respostas aos pedidos
 * Definir método de calculo dos resultados
 */
function result(request, response) {
    let inputData = request.body
    let calc = (parseFloat(inputData.tax) * parseFloat(inputData.start)) / 100
    let extrutureData = {
            "date" : inputData.date,
            "payment" : calc,
            "start" : inputData.start
    }
    let model = addLine(extrutureData)
    createTemplate("result", sendTemplate(response,model));
}

let addLine = (extrutureData) => {
    return superData += `
        <tr>
            <td>${extrutureData.date}</td>
            <td>${extrutureData.payment}</td>
            <td>${extrutureData.start}</td>
        </tr>
        `
}

module.exports.styles = styles;
module.exports.form = form;
module.exports.result = result;