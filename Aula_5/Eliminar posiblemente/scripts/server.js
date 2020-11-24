let createServer = require("http").createServer;
let options = require("./options").server;

function start(router, port) {
    let onRequest = function onRequest(request, response) {
    router(request, response);
}
    createServer(onRequest).listen(port || options.port);
}

module.exports.start = start;