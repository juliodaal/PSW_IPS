"use strict";
const express = require("express");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

//roteamento
app.get("/", (req,res) => { res.render("layout.html")});
app.get("/person", requestHandlers.getPeople);
app.get("/country", requestHandlers.getCountries);

app.post("/person", (req, res) => {
    requestHandlers.createUpdatePerson(req, res)
});

app.put("/person/:id", (req, res) => {
    requestHandlers.createUpdatePerson(req, res)
});

app.delete("/person/:id", (req, res) => {
    requestHandlers.removePerson(req, res)
});

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});