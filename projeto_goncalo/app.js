"use strict";

// imports 
const express = require("express");
const bodyParser = require("body-parser");
const requestHandlers = require("./scripts/request-handlers.js");
const options = require("./scripts/options.json").server;
const session = require("express-session"); 
const passport = require("passport");
const path = require("path");
const exphbs = require("express-handlebars");
// nível 2
// start app
const app = express();
require("./config/passport");

// nível 2
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

app.set('views', path.join(__dirname,"views"));
app.engine('.hbs', exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get('views'), "main"),//src/views/layout
    partialsDir: path.join(app.get('views'), "partials"),
    extname: ".hbs"
}));
app.set("view engine", ".hbs");

app.get("/animes", requestHandlers.getAnimesBD);
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// nível 3
// routing
app.get("/", (req,res) => { res.render("index", {user:req.user})});
app.get("/register", (req,res) => { res.render("register")});
app.post("/register", requestHandlers.createUsers);
app.get("/formulario", (req,res) => { res.render("formulario")});
app.get("/anime/save/:id", requestHandlers.createUserAnime);
app.get("/get/animes", requestHandlers.getAnimes);
app.get("/login", (req,res) => { res.render("login")});
// app.get("/sensor", requestHandlers.getSensors);
app.get("/index", (req,res,next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}, requestHandlers.getIndex);

app.get("/logout", (req,res,next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}, (req,res) => {
    req.logout();
    res.redirect("/");
});

// app.get("/login", (req,res) => {
//     res.send("fail")
// });
// app.get("/sensor/:1/sample", requestHandlers.getSamples);
app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/index',
    failureRedirect: '/login'
}));

// nível 2
// start server

app.listen(options.port, function () {
    console.log("Server running at http://localhost:" + options.port);
});