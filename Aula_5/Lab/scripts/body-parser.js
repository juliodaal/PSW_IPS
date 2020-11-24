var unescape = require("querystring").unescape;

function appendBody(request, submittedData) {
    var body = {};
    if (submittedData) {
        var values = submittedData.split("&");
        values.forEach(function (current, index, array) {
            var nameValue = current.split("=").map(unescape);
            body[nameValue[0]] = nameValue[1];
        });
    }
    request.body = body;
    return request;
}

function bodyParser(request, processRequest) {
    var submittedData = ""; //Irá guardar a informação enviada no corpo da mensagem HTTP
    request.setEncoding("utf8");
    request.addListener("data", function (submittedDataChunk) {
        submittedData += submittedDataChunk;
    });
    request.addListener("end", function () {
        processRequest(appendBody(request, submittedData));
    });
}

module.exports = bodyParser;