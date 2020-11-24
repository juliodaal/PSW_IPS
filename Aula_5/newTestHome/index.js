var server = require("./scripts/server");
var router = require("./scripts/router");
var requestHandlers = require("./scripts/request-handlers");

router.default(requestHandlers.form);
router.get("/form", requestHandlers.form);
router.post("/result", requestHandlers.result);

server.start(router);