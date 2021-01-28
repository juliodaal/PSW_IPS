const { Router } = require("express");
const router = Router();

const dashboardController = require("../controllers/dashboard.controller");

const { isAuthenticated } = require("../helpers/auth");



// // New Task
router.get("/dashboard", isAuthenticated, dashboardController.renderDaskboard);

// // Task Done
// router.put("/task/done", isAuthenticated, taskController.doneTask);


// // Edit Task
// router.put("/task/edit", isAuthenticated, taskController.updateTask);

// // Calendar Task
// router.put("/task/edit/calendar", isAuthenticated, taskController.updateTaskCalendar);

// // Projeto Task
// router.post("/task/projects", isAuthenticated, taskController.getProject);

// router.post("/task/add/project", isAuthenticated, taskController.createProject)

// router.put("/task/edit/project", isAuthenticated, taskController.editProjeto);

// // Delete Task
// router.delete("/task/edit/", isAuthenticated, taskController.deleteTask)

// // Statistics
// router.post("/statistics/done", isAuthenticated, taskController.doneStatistics);

module.exports = router;