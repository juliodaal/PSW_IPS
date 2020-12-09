"use strict";

// imports 
const express = require("express");
const bodyParser = require("body-parser");
const requestHandlers = require("./scripts/request-handlers.js");
const options = require("./scripts/options.json").server;


// nível 2
// start app
const app = express();


// nível 2
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

// nível 3
// routing
app.get("/sensor", requestHandlers.getSensor);
app.get("/sensor/:id/sample", requestHandlers.getSamples);


// nível 2
// start server
app.listen(options.port, function () {
    console.log(`Server running at http://localhost:${options.port}`);
});
