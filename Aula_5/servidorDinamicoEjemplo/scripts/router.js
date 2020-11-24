var bodyParser = require("./body-parser");

var parse = require("url").parse;
var routing = {
    GET: {},
    POST: {}
};

function findHandler(request) {
    var handlers = routing[request.method]; //Verbo
    var pathname = parse(request.url).pathname; //Caminho
    return handlers[pathname];
}


function router(request, response) {
    var processRequest = function processRequest(request) {
        var handler = findHandler(request);
        if (handler) {
            handler(request, response);
        } else {
            response.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.end("HTTP Status: 404 : NOT FOUND");
        }
    }
    bodyParser(request, processRequest);
}

router.get = function (caminho, handler) {
    routing.GET[caminho] = handler;
};
router.post = function (caminho, handler) {
    routing.POST[caminho] = handler;
};
router.default = function (handler) {
    routing.GET["/"] = handler;
};

module.exports = router;