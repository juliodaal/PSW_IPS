const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const requestHandlers = require("../database/request-handlers");

passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email,password, done) => {
    let response = await requestHandlers.getUser({email});
    if(response.message != "error"){
        let user = response.data[1][0];
        if(!user) { 
            return done(null, false, { message: "Not User Found" });
        } else {
            let match = await requestHandlers.getUserPass({id: user.id, password});
            if(match.message != "error"){ 
                return done(null, match);
            } else {
                return done(null, false, { message: "Not User Found" });
            }
        }
    } else {
        return done(null, false, { message: "Not User Found" });
    }
}));

passport.serializeUser((response, done) => {
    let user = response.data[1][0];
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    let user = await requestHandlers.getUserById({id});
    console.log(user);
    if(user.message == "success"){
        user = user.data[1][0]; 
        done(false, user);
    } else { 
        done(user.data[0].message, false);
    }
});