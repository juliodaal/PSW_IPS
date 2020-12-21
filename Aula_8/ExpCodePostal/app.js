const express = require("express");
const requestHandlers = require("./scripts/request-handlers");
const app = express();

app.use(express.static("www"));
app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/create-customer", requestHandlers.createCustomer);
app.get("/postal-description/:code", requestHandlers.postalDescription);

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});