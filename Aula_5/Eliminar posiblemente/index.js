let server = require("./scripts/server");
let router = require("./scripts/router");
let requestHandlers = require("./scripts/request-handlers");

router.default(requestHandlers.calculator);
router.get("/calculator", requestHandlers.calculator);
router.post("/result", requestHandlers.result);

server.start(router);