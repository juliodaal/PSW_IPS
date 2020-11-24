var server = require("./scripts/server");
var router = require("./scripts/router");
var requestHandlers = require("./scripts/request-handlers");

router.default(requestHandlers.calculator);
router.get("/calculator", requestHandlers.calculator);
router.post("/result", requestHandlers.result);

server.start(router);