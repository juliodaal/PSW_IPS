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
app.put("/user/:id", requestHandlers.updateUser);
app.put("/user/:id/pass", requestHandlers.updateUserPass);
app.delete("/user/:id", requestHandlers.deleteUser);
app.delete("/user/:id/record", requestHandlers.deleteUserRecord);

// Box Type
app.post("/box-type", requestHandlers.createBoxType);
app.get("/box-type/:id", requestHandlers.showAllBoxType);
app.put("/box-type/:id/:userId", requestHandlers.updateBoxType);
app.delete("/box-type/:id/:userId", requestHandlers.deleteBoxType);

// Box
app.post("/box", requestHandlers.createBox);
app.get("/box/:userId", requestHandlers.getAllBoxes);
app.get("/box/:id/:userId", requestHandlers.getBox);
app.get("/box-id/:userId", requestHandlers.getIdsBox);
app.put("/box/:id/:userId", requestHandlers.updateBox);
app.put("/box/:id/:userId/changeTypeBox", requestHandlers.changeTypeBox);
app.delete("/box/:id/:userId", requestHandlers.deleteBox);

// Box Ganhos
app.post("/box-ganhos/:id/:userId",requestHandlers.createWinnings);


// start server
app.listen(options.port, function () {
    console.log("Server running at http://localhost:" + options.port);
});