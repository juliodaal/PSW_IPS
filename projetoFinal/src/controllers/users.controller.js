const usersController = {};

const passport = require("passport");
const requestHandlers = require("../database/request-handlers");

usersController.signUp = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    const errors = [];
    const {username , lastname, email, password , confirm_password } = body;
    if(password != confirm_password){
        errors.push({ message: "Passwords do not match"});
    }
    if(password.length < 4 ){
        errors.push({ message: "Passwords must be at least 4 characteres"});
    }
    if(errors.length > 0){
        res.json({
            message: "error",
            data: errors
        })
    } else {
        let response = await requestHandlers.createUser({username, lastname, email, password});
        res.json(response);
    }
};

usersController.signIn = passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/dashboard"
});

usersController.logOut = (req,res) => {
    req.logout();
    res.redirect("/");
};

module.exports = usersController;