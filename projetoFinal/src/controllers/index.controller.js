const requestHandlers = require("../database/request-handlers");
const IndexController = {};

IndexController.renderIndex = (req,res) => {
    res.render("index", { titleDocument: "Landing Page" ,currentUser: req.user});
};

IndexController.renderAbout = (req,res) => {
    res.render("about", { titleDocument: "About", currentUser: req.user});
};

IndexController.renderContact = (req,res) => {
    res.render("contact", { titleDocument: "Contact", currentUser: req.user});
};

IndexController.renderProfile = (req,res) => {
    res.render("profile", { titleDocument: "Profile", user: req.user, currentUser: req.user });
};

IndexController.renderTasks = async (req,res) => {
    let response = await requestHandlers.allTasks({ id: req.user.id });
    if(response.message != "error"){
        response.data.forEach(obj => {
            obj.date = String(obj.date).substr(0,10);
        });;
    }
    res.render("tasks/allTasks", { titleDocument: "Tasks", data: response.data, currentUser: req.user });
};

IndexController.renderStatistics = async (req,res) => {
    res.render("statistics", { titleDocument: "Statistics", currentUser: req.user });
};

IndexController.renderQrCode = async (req,res) => {
    res.render("qrCode", { titleDocument: "Qr Code", currentUser: req.user });
};

module.exports = IndexController;