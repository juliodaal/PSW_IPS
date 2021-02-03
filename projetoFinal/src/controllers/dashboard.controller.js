const requestHandlers = require("../database/request-handlers");
const dashboardController = {};

dashboardController.renderDaskboard = async (req,res) => {
    let response;
    switch (req.user.tipo_from_tipo_utilizador) {
        case 1:
            response = await requestHandlers.getDataDashboard(req);
            res.render("dashboard", { titleDocument: "Dashboard" , box: response.data, currentUser: req.user });
            break;
        case 2:
            res.render("workerDashboard", { titleDocument: "Dashboard", currentUser: req.user });
            break;
        case 3:
            response = await requestHandlers.getDataClientDashboard(req);
            responseWorker = await requestHandlers.getDataWorkerDashboard(req);
            res.render("adminDashboard", { titleDocument: "Dashboard" , box: response.data, worker: responseWorker.data, addBox: true, currentUser: req.user});
            break;
        default:
            res.render("index", { currentUser: req.user });
            break;
    }
}

dashboardController.renderCreateClient = async (req,res) => {
    res.render("createClient", { titleDocument: "Create Client", currentUser: req.user });
}

dashboardController.renderCreateWorker = async (req,res) => {
    res.render("createWorker", { titleDocument: "Create Worker", currentUser: req.user });
}

dashboardController.renderCreateBox = async (req,res) => {
    res.render("createBox", { titleDocument: "Create Box", user: req.params, currentUser: req.user });
}

dashboardController.createBox = async (req,res) => {
    let response = await requestHandlers.createBox(req.body,req.params.id);
    dashboardController.renderDaskboardById({params: {id: req.params.id}},res);
}

dashboardController.renderEditBox = async (req,res) => {
    let response = await requestHandlers.findBox(req.params.id);
    res.render("editBox", { titleDocument: "Edit Box", box: response.data[0], currentUser: req.user});
}

dashboardController.editBox = async (req,res) => {
    let response = await requestHandlers.editBox(req.body,req.params.id);
    res.redirect("/dashboard");
}
dashboardController.deleteBox = async (req,res) => {
    let response = await requestHandlers.deleteBox(req.params.id);
    res.redirect("/dashboard");
}

dashboardController.renderDeleteTypeBox = async (req,res) => {
    res.render("deleteTypeBox", { titleDocument: "Delete Type Box", user: req.params, currentUser: req.user });
}

dashboardController.deleteTypeBox = async (req,res) => {
    let response = await requestHandlers.deleteTypeBox(req.body,req.params.id);
    dashboardController.renderDaskboardById({params: {id: req.params.id}},res);
}

dashboardController.renderBoxType = async (req,res) => {
    res.render("boxType", { titleDocument: "Box Type" , user: req.params, currentUser: req.user});
}

dashboardController.createBoxType = async (req,res) => {
    let response = await requestHandlers.createBoxType(req.body,req.params.id);
    dashboardController.renderDaskboardById({params: {id: req.params.id}},res);
}

dashboardController.findTypesBox = async (req,res) => {
    let response = await requestHandlers.findTypesBox(req.params.id);
    res.json({
        response
    });
}

dashboardController.createClient = async (req,res) => {
    let response = await requestHandlers.createClient(req.body);
    res.redirect("/dashboard");
}

dashboardController.createWorker = async (req,res) => {
    let response = await requestHandlers.createWorker(req.body);
    res.redirect("/dashboard");
}

dashboardController.renderDaskboardById = async (req,res) => {
    let response = await requestHandlers.getDataDashboardById(req.params.id);
    res.render("dashboard", { titleDocument: "Dashboard" , box: response.data, addBox: true, user: req.params, currentUser: req.user});
}
dashboardController.renderBoxStatistics = async (req,res) => {
    // let response = await requestHandlers.getDataDashboardById(req.params.id);
    res.render("boxStatistics", { titleDocument: "Box Statistics", currentUser: req.user }); //, box: response.data
}

dashboardController.renderClientStatistics = async (req,res) => {
    res.render("clientStatistics", { titleDocument: "Client Statistics", currentUser: req.user, user: req.params}); //, box: response.data
}

dashboardController.getClientStatistics = async (req,res) => {
    let response = await requestHandlers.getClientStatistics(req.params.id);
    res.json({ response });
}

dashboardController.renderEditClient = async (req,res) => {
    let response = await requestHandlers.getClientById(req.params.id);
    res.render("editClient", { titleDocument: "Client Statistics", client: response.data[0], currentUser: req.user }); //, box: response.data
}

dashboardController.renderEditWorker = async (req,res) => {
    let response = await requestHandlers.getWorkerById(req.params.id);
    res.render("editClient", { titleDocument: "Worker Statistics", client: response.data[0], currentUser: req.user }); //, box: response.data
}

dashboardController.editClient = async (req,res) => {
    let response = await requestHandlers.editClient(req.body,req.params.id);
    res.redirect("/dashboard");
    // response.message == "success"
    // ? res.render("adminDashboard", { titleDocument: "Dashboard", success: true, message:"Cliente Editado com Sucesso."}) 
    // : res.render("adminDashboard", { titleDocument: "Dashboard", error: true, message:"Erro ao Editar ao Cliente." })
}

dashboardController.renderDeleteClient = async (req,res) => {
    let response = await requestHandlers.deleteClient(req.params.id);
    res.redirect("/dashboard");
    // response.message == "success"
    // ? res.render("adminDashboard", { titleDocument: "Dashboard", success: true, message:"Cliente Apagado com Sucesso."}) 
    // : res.render("adminDashboard", { titleDocument: "Dashboard", error: true, message:"Erro ao Apagar ao Cliente." })
}

dashboardController.deleteWorker = async (req,res) => {
    let response = await requestHandlers.deleteWorker(req.params.id);
    res.redirect("/dashboard");
    // response.message == "success"
    // ? res.render("adminDashboard", { titleDocument: "Dashboard", success: true, message:"Cliente Apagado com Sucesso."}) 
    // : res.render("adminDashboard", { titleDocument: "Dashboard", error: true, message:"Erro ao Apagar ao Cliente." })
}

module.exports = dashboardController;