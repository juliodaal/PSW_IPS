const requestHandlers = require("../database/request-handlers");
const dashboardController = {};

dashboardController.renderDaskboard = async (req,res) => {
    switch (req.user.tipo_from_tipo_utilizador) {
        case 1:
            let response = await requestHandlers.getDataDashboard(req);
            res.render("dashboard", { titleDocument: "Dashboard" , box: response.data});
            break;
        case 2:
            res.render("workerDashboard", { titleDocument: "Dashboard" });
            break;
        case 3:
        
            break;
        default:
            res.render("index");
            break;
    }
}

module.exports = dashboardController;