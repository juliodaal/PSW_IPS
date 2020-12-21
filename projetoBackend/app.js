"use strict";

// imports 
const express = require("express");
const bodyParser = require("body-parser");
const requestHandlers = require("./scripts/request-handlers.js");
const options = require("./scripts/options.json").server;

// start app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

// routing
// User
app.post("/create-user", requestHandlers.createUser);
app.post("/verify-user", requestHandlers.verifyUser);
app.get("/user/:id", requestHandlers.getUser);
app.put("/user/:id", requestHandlers.updateUserName);
// app.get("/sensor/:1/sample", requestHandlers.getSamples);

// start server
app.listen(options.port, function () {
    console.log("Server running at http://localhost:" + options.port);
});