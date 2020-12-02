"use strict";
const express = require("express");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

// People
app.get("/person", requestHandlers.getPeople);
// Countries
app.get("/country", requestHandlers.getCountries);

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});