const requestHandlers = require("../database/request-handlers");
const IndexController = {};

IndexController.renderIndex = (req,res) => {
    res.render("index", { titleDocument: "Landing Page" });
};

IndexController.renderAbout = (req,res) => {
    res.render("about", { titleDocument: "About" });
};

IndexController.renderProfile = (req,res) => {
    res.render("profile", { titleDocument: "Profile", user: req.user });
};

IndexController.renderTasks = async (req,res) => {
    let response = await requestHandlers.allTasks({ id: req.user.id });
    if(response.message != "error"){
        response.data[1].forEach(obj => {
            obj.date = String(obj.date).substr(0,10);
        });;
    }
    res.render("tasks/allTasks", { titleDocument: "Tasks", data: response.data[1] });
};

IndexController.renderStatistics = async (req,res) => {
    res.render("statistics", { titleDocument: "Statistics" });
};

module.exports = IndexController;