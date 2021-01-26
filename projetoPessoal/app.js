// imports 
const express = require('express');
const bodyParser = require("body-parser");
const requestHandlers = require("./scripts/request-handlers.js");
const options = require("./scripts/options.json").server;
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

// start app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("mySecret"));
app.use(session({
    secret: "mySecret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function(username,password,done){
    // Enviar al request handler para hacer la consulta en la base de datos
    if(username === "code" && password === "123")
        return done(null,{id:1, name: "Julio"});
    done(null,false);
}));
passport.serializeUser(function(user,done){
    done(null, user.id);
});
passport.deserializeUser(function(id,done){
    done(null, {id:1, name: "Julio"});
});

app.use(express.static("www"));

app.set('view engine', 'hbs');

//Routes
app.get("/", (req,res,next)=> {
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}, (req,res) => {
    res.send('hola');
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/login", passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login"
}));

// start server
app.listen(options.port, function () {
    console.log(`Server running at http://localhost:${options.port}`);
});