const requestHandlers = require("../database/request-handlers");
const TaskController = {};

TaskController.createNewTask = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.createNewTask(req,body);
    res.json({
        response
    });
};

TaskController.createProject = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.createProject(req,body);
    res.json({
        response
    });
};

TaskController.updateTask = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.updateTaskMessage(req,body);
    if(response.message == "success"){
        let responseTask = await requestHandlers.getMessage(body.id);
        res.json({
            responseTask
        });
    } else{
        res.json({
            response
        });
    }
};

TaskController.doneTask = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.doneTask(req,body);
    res.json({
        response
    });
};

TaskController.updateTaskCalendar = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.updateTaskCalendar(req,body);
    if(response.message == "success"){
        let responseTask = await requestHandlers.getCalendar(body.id);
        res.json({
            responseTask
        });
    } else{
        res.json({
            response
        });
    }
};

TaskController.getProject = async (req,res) => {
    let response = await requestHandlers.getProject(req.user.id);
    if(response.message == "success"){
        res.json({
            response
        });
    } else{
        res.json({
            response
        });
    }
};

TaskController.editProjeto = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.editProject(req,body);
    if(response.message == "success"){
        let responseTask = await requestHandlers.getProjectById(body.id,req.user.id);
        res.json({
            responseTask
        });
    } else{
        res.json({
            responseTask
        });
    }
};

TaskController.deleteTask = async (req,res) => {
    let body = await JSON.parse(Object.keys(req.body)[0]);
    let response = await requestHandlers.deleteTaskUser(req,body);
    if(response.message == "success"){
        let responseTask = await requestHandlers.deleteTask(body);
        res.json({
            responseTask
        });
    } else{
        res.json({
            responseTask
        });
    }
};

TaskController.doneStatistics = async (req,res) => {
    let response = await requestHandlers.doneStatistics(req);
    res.json({
        response
    });
};

module.exports = TaskController;