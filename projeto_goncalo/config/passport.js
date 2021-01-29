const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const requestHandlers = require("../scripts/request-handlers");

passport.use('local',new localStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username,password, done) => {
    let response = await requestHandlers.getUser(username);
    // console.log(response)
    // console.log(await requestHandlers.getUser(username));
    let user = response.data[0];
    // console.log(user);
    //Pedido do email à base de dados
    if(!user) { 
        return done(null, false, { message: "Not User Found" });
    } else {
        let match = await requestHandlers.getUserPass({id: user.id, password});
        //Pedir à bd a password
        if(match.message != "error"){
            return done(null, match);
        } else {
            return done(null, false, { message: "Not User Found" });
        }
    }
}));

passport.serializeUser((response, done) => {
    let user = response.data[0];
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
   let user = await requestHandlers.getUserById(id);
    if(user.message == "ok"){
        user = user.data[0];
        done(null, user);
    } else { 
        done(user.data[0].message, false);
    }
});
