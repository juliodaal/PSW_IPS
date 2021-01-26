const { Router } = require("express");
const router = Router();
const indexController = require("../controllers/index.controller");

const { isAuthenticated } = require("../helpers/auth");

router.get('/', indexController.renderIndex);

router.get('/about', indexController.renderAbout);

router.get("/tasks", isAuthenticated, indexController.renderTasks);

router.get("/profile", isAuthenticated, indexController.renderProfile);

router.get("/statistics", isAuthenticated, indexController.renderStatistics);



module.exports = router;