"use strict";
const express = require("express");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

//roteamento
app.get("/person", requestHandlers.getPeople);
app.get("/country", requestHandlers.getCountries);

app.post("/person", requestHandlers.processingPerson);
app.post("/people", (req, res) => {
    requestHandlers.processingPerson(req)
});

app.put("/people/:id", (req, res) => {
    requestHandlers.getPeople(req)
});
app.delete("/people/:id", (req, res) => {
    requestHandlers.getPeople(req)
});

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});