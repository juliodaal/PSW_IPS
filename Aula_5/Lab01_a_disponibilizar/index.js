var server = require("./scripts/server");
var router = require("./scripts/router");
var requestHandlers = require("./scripts/request-handlers");

/**
 * @todo Configurar o router associado os verbos HTTP aos métodos que irão responder aos pedidos
 */

server.start(router);