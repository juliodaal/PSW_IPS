"use strict";
const express = require("express");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

// People
app.get("/people", (req, res) => {
    requestHandlers.getPeople(req, res)
});
app.post("/people", (req, res) => {
    // requestHandlers.getPeople(req, res)
});
app.put("/people", (req, res) => {
    // requestHandlers.getPeople(req, res)
});
app.delete("/people", (req, res) => {
    // requestHandlers.getPeople(req, res)
});
// Countries
app.get("/countries", function (req, res) {
    requestHandlers.getCountries(req, res)
});


app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});