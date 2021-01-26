const { Router } = require("express");
const router = Router();

const usersController = require("../controllers/users.controller");

const { isAuthenticated } = require("../helpers/auth");

router.post("/signup", usersController.signUp);

router.post("/signin", usersController.signIn);

router.get("/logout", isAuthenticated, usersController.logOut);

module.exports = router;