import { IndexEvents } from "./indexEvents/IndexEvents.js";
import { ModalsEvent } from "./modalsEvent/ModalsEvent.js"; 
import { ChartCanvas } from "./ChartCanvas/ChartCanvas.js";

"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * Aproveitamos ainda para solicitar ao servidor o carregamento de dados de forma assincrona(ajax)
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = function(event) {
    var app = new App("divApp");
    app.loader();
    app.activateEvents();
    window.app = app;
};

/** 
* @class Guarda toda informação necessaria na execução do exercicio 
* @constructs App
* @param {string} id - id do elemento HTML que contém a informação.
* 
*/
function App(id) {
    this.id = id;
};

/**
 * handlers
 */
App.prototype.loader = function() {
    var preloader = document.querySelector('.cs-page-loading');
    preloader.classList.remove('active');
    setTimeout(() => { preloader.remove(); }, 2000);
}

/**
 * handlers
 */
App.prototype.activateEvents = function() {
    switch (window.location.pathname) {
        case "/":
            modalsEvent();
            new IndexEvents().initEvents();
            break;
        case "/about":
            modalsEvent();
            break;
        case "/tasks":
            modalsEvent();
            findProjects(navProjects,addTaskProjects);
            break;
        case "/statistics":
            modalsEvent();
            findProjects(navProjects,addTaskProjects);
            goToFindTaskDone(renderChart);
            break;
        case "/profile":
            modalsEvent();
            findProjects(navProjects,addTaskProjects);
            break;
        default:
            break;
    }
}

App.prototype.processingTaskCustom = function(event,id,method){
    switch (method) {
        case "done":
            eventDone(event,id);
            break;
        case "edit":
            eventEdit(event,id);
            break;
        case "calendar":
            eventCalendar(event,id);
            break;
        case "project":
            eventProject(event,id);
            break;
        case "delete":
            eventDelete(event,id);
            break;
    }
}

App.prototype.processingSignUp = function() {
    const iForm = document.getElementById('form-signup')
    let form = new FormData(iForm)
    let data = {
        username: form.get("username"), 
        lastname: form.get("lastname"), 
        email: form.get("email"), 
        password: form.get("password"),
        confirm_password: form.get("confirm_password")
    }
    sendHttpRequest('http://localhost:8081/signup','POST',data,createUser);
}

App.prototype.processingTask = function() {
    const iForm = document.getElementById('form-add-task')
    let form = new FormData(iForm)
    let data = {
        message: form.get("message"), 
        date: form.get("date"), 
        project: form.get("project"), 
        priority: form.get("priority")
    }
    sendHttpRequest('http://localhost:8081/task/add','POST',data,getTask);
}

App.prototype.processingAddProject = function() {
    const iForm = document.getElementById('form-add-project')
    let form = new FormData(iForm)
    let data = {
        message: form.get("project")
    }
    sendHttpRequest('http://localhost:8081/task/add/project','POST',data,getTask);
}

let findProjects = (callback,callback2) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
            let response = JSON.parse(xhr.response);
            if(response.response.message == "success"){
                let msg = response.response.data[1]
                callback(msg);
                callback2(msg);
            } else {
                showAddProject()
            }
        }
    }
    xhr.open('POST','http://localhost:8081/task/projects');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}

let showAddProject = () => {
    let navProjects = document.getElementById("nav-projects");
    let templateAddProject = `<li><a class="dropdown-item d-flex align-items-center" href="#" id="button-add-project"><i class="fe-plus-square font-size-base opacity-60 mr-2"></i>Add Project</a></li>`;
    navProjects.innerHTML = templateAddProject;
    new ModalsEvent(
        document.getElementById("button-add-project"),
        document.getElementById("modal-add-project"),
        document.getElementById("close-add-project"),
    )
}

let navProjects = (msg) => {
    let navProjects = document.getElementById("nav-projects");
    let template = `${msg.map(obj => { return `<li><a class="dropdown-item disabled" aria-disabled="true" href="#"><i class="fe-clipboard font-size-base opacity-60 mr-2"></i>` + obj.titulo + `</a></li>`; })}`;
    while (template.includes(',')) {
        template = template.replace(',', '');
    }
    let templateAddProject = `<li><a class="dropdown-item d-flex align-items-center" href="#" id="button-add-project"><i class="fe-plus-square font-size-base opacity-60 mr-2"></i>Add Project</a></li>`;
    navProjects.innerHTML = template + templateAddProject;
    new ModalsEvent(
        document.getElementById("button-add-project"),
        document.getElementById("modal-add-project"),
        document.getElementById("close-add-project"),
    )
}

let addTaskProjects = (msg) => {
    let selectInputProject = document.getElementById("select-input-project");
    let template = `<option>No Project</option> ${msg.map(obj => { return "<option>" + obj.titulo + "</option>"; })}`;
    while (template.includes(',')){
        template = template.replace(',', '');
    }
    selectInputProject.innerHTML = template;
}

let sendHttpRequest = (url,method,data,callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
            let response = JSON.parse(xhr.response);
            callback(response);
        }
    }
    xhr.open(method,url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(JSON.stringify(data));
}

/**
 * handlers
 */
let getTask = (obj) => {
    let response = obj.response;
    if(response.message == "success"){
        swal(response.message, response.data[0].message, `${response.message}`)
        .then(() => {
            window.location.replace("http://localhost:8081/tasks");
        });
    } else {
        swal(response.message, response.data[0].message, `${response.message}`)
    }
}

/**
 * handlers
 */
let createUser = (response) => {
    swal(response.message, response.data[0].message, `${response.message}`)
}

/**
 * handlers
 */
let eventEdit = (event,id) => {
    let inputTemplate = `
    <div class="form-group">
        <textarea class="form-control prepended-form-control input-task-edit" name="message" id="input-task-edit" onkeypress="app.sendData(event);" onfocus="app.disableButtonEdit(event);" onfocusout="app.editMessageTask(event,${id});" placeholder="Your Message Here..." rows="2" required=""></textarea>
    </div>
    `; 
    let description = event.target.parentNode.parentNode.previousSibling.previousSibling; 
    if(description.dataset.description == "description"){
        description.innerHTML = inputTemplate;
        let textarea = event.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1];
        textarea.focus();
        event.target.parentNode.innerHTML = `<i class="fe-check mr-2" style="font-size: 18px; margin-right: 4px;"></i>`;
    }
}

let eventCalendar = (event,id) => {
    let inputTemplate = `
    <div class="form-group mb-0 d-flex">
        <input class="form-control prepended-form-control" type="date" width="50px" name="date" id="date-input-add-task" placeholder="00-00-00" onkeypress="app.sendData(event);" onfocus="app.disableButtonCalendar(event);" onfocusout="app.editCalendarTask(event,${id});">
    </div>
    `
    let date = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[5]; 
    date.innerHTML = inputTemplate;
    let inputDate = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[1].childNodes[1];
    inputDate.focus();
    event.target.parentNode.innerHTML = `<i class="fe-check mr-2" style="font-size: 18px; margin-right: 4px;"></i>`;
    
}

let eventProject = (event,id) => {
    searchProjects(event,id,getProjects);
}
let eventDelete = (event,id) => {
    sendEditTask("delete",id,event, changeStylesDelete);
}

let eventDone = (event,id) => {
    sendEditTask("done",id,event, changeStylesDone);
}

let getProjects = (event,id,msg) => {
    let inputTemplate = `
    <div class="form-group mb-0 d-flex">
        <select class="form-control custom-select prepended-form-control" name="project" id="select-input-project" onkeypress="app.sendData(event);" onfocus="app.disableButtonProject(event);" onfocusout="app.editTitleTask(event,${id});">
            <option>No Project</option>
            ${msg.map(obj => { return "<option>" + obj.titulo + "</option>"; })}
        </select>
    </div>
    `;
    inputTemplate.replace(',', '');
    let title = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[3]; 
    title.innerHTML = inputTemplate;
    let inputTitle = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1].childNodes[1];
    inputTitle.focus();
    event.target.parentNode.innerHTML = `<i class="fe-check mr-2" style="font-size: 18px; margin-right: 4px;"></i>`;
    
}

App.prototype.disableButtonEdit = (event) => {
    let btnTaskEdit = event.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[1];
    btnTaskEdit.disabled = true;
}
App.prototype.disableButtonCalendar = (event) => {
    let btnTaskCalendar = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[3];
    btnTaskCalendar.disabled = true;
} 
App.prototype.disableButtonProject = (event) => {
    let btnTaskProject = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[5];
    btnTaskProject.disabled = true;
} 
App.prototype.editMessageTask = (event,id) => {
        sendEditTask("message",id,event, changeStylesEdit);
}
App.prototype.editCalendarTask = (event,id) => {
    sendEditTask("calendar",id,event, changeStylesCalendar);
}
App.prototype.editTitleTask = (event,id) => {
    sendEditTask("project",id,event, changeStylesProject);
}
App.prototype.sendData = (event) => {
    if(event.keyCode === 13){
        event.target.blur();
    }
}

let sendEditTask = (method, id, event, callback) => {
    let message = event.target.value;
    if(method == "message"){
        if(message && message != ''){
            let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                        if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                        let response = JSON.parse(xhr.response);
                        if(response.responseTask.message == "success"){
                            let msg = response.responseTask.data[1][0].descricao;
                            callback(event,msg);
                        } else {
                            swal(response.responseTask.message, response.responseTask.data[0].message, `${response.responseTask.message}`)
                        }
                    }
                }
                xhr.open('PUT','http://localhost:8081/task/edit');
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(JSON.stringify({id, message}));
        } 
        // else {
            // Ejecutar done
        // }
    } else if(method == "calendar"){
        if(message && message != ''){
            let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                        if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                        let response = JSON.parse(xhr.response);
                        if(response.responseTask.message == "success"){
                            let msg = response.responseTask.data[1][0].date;
                            callback(event,msg);
                        } else {
                            swal(response.responseTask.message, response.responseTask.data[0].message, `${response.responseTask.message}`)
                        }
                    }
                }
                xhr.open('PUT','http://localhost:8081/task/edit/calendar');
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(JSON.stringify({id, message}));
        } 
        // else {

        // }
    } else if(method == "project"){
        if(message && message != ''){
            let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                        if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                        let response = JSON.parse(xhr.response);
                        if(response.responseTask.message == "success"){
                            let msg = response.responseTask.data[1][0].titulo;
                            callback(event,msg);
                        } else {
                            swal(response.responseTask.message, response.responseTask.data[0].message, `${response.responseTask.message}`)
                        }
                    }
                }
                xhr.open('PUT','http://localhost:8081/task/edit/project');
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(JSON.stringify({id, message}));
        } 
        // else {

        // }
    } else if(method == "delete"){
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                let response = JSON.parse(xhr.response);
                if(response.responseTask.message == "success"){
                    callback(event);
                } else {
                    swal(response.responseTask.message, response.responseTask.data[0].message, `${response.responseTask.message}`)
                }
            }
        }
        xhr.open('DELETE','http://localhost:8081/task/edit/');
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(JSON.stringify({id}));
    } else if(method = "done") {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
                if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                let response = JSON.parse(xhr.response);
                if(response.response.message == "success"){
                    callback(event);
                } else {
                    swal(response.response.message, response.response.data[0].message, `${response.response.message}`)
                }
            }
        }
        xhr.open('PUT','http://localhost:8081/task/done');
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(JSON.stringify({id}));
    }
}

let searchProjects = (event,id,callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
            let response = JSON.parse(xhr.response);
            if(response.response.message == "success"){
                let msg = response.response.data[1]
                callback(event,id,msg);
            } else {
                swal(response.response.message, "You have to create a project first!", `${response.response.message}`)
            }
        }
    }
    xhr.open('POST','http://localhost:8081/task/projects');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}
let goToFindTaskDone = (callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
            let response = JSON.parse(xhr.response);
            if(response.response.message == "success"){
                callback(response);
            } else {
                callback(response,"error")
            }
        }
    }
    xhr.open('POST','http://localhost:8081/statistics/done');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}

let renderChart = (response,error) => {
    if(error) {
        let chart =  new ChartCanvas(30,0,5,"myChart");
        chart.renderChartCanvas();
        swal(response.response.message, "You do not have task done yet!", "info")
    } else {
        let data = response.response.data[1];
        let arrYears = [];
        data.forEach(task => {
            let year = String(task.date).substr(0,4);
            if(arrYears.length > 0){ 
                if(arrYears.indexOf(year) == -1){ arrYears.push(year); } 
            } else { 
                arrYears.push(year); 
            }
        });
        let arrObjYears = [];
        arrYears.forEach(arr => {
            arrObjYears.push({
                    year: arr,
                    months: {
                        january : { tasks: 0 , name: "January" }, 
                        february : { tasks: 0, name: "February" },
                        march : { tasks: 0, name: "March" },
                        april : { tasks: 0, name: "April" }, 
                        may : { tasks: 0, name: "May" },
                        june : { tasks: 0, name: "June" },
                        july : { tasks: 0, name: "July" },
                        august : { tasks: 0, name: "August" },
                        september : { tasks: 0, name: "September" },
                        october : { tasks: 0, name: "October" },
                        november : { tasks: 0, name: "November" },
                        december : { tasks: 0, name: "December" }
                    }
                });            
        });
        data.forEach(task => {
            let year = String(task.date).substr(0,4);
            let month = String(task.date).substr(5,2);
            arrObjYears.forEach(obj => {
                if(year == obj.year){
                    switch (month) {
                        case "01":
                            obj.months.january.tasks = obj.months.january.tasks + 1;
                        break;
                        case "02":
                            obj.months.february.tasks = obj.months.february.tasks + 1;
                        break;
                        case "03":
                            obj.months.march.tasks = obj.months.march.tasks + 1;  
                        break;
                        case "04":
                            obj.months.april.tasks = obj.months.april.tasks + 1;
                        break;
                        case "05":
                            obj.months.may.tasks = obj.months.may.tasks + 1;
                        break;
                        case "06":
                            obj.months.june.tasks = obj.months.june.tasks + 1;
                        break;
                        case "07":
                            obj.months.july.tasks = obj.months.july.tasks + 1;
                        break;
                        case "08":
                            obj.months.august.tasks = obj.months.august.tasks + 1;
                        break;
                        case "09":
                            obj.months.september.tasks = obj.months.september.tasks + 1;
                        break;
                        case "10":
                            obj.months.october.tasks = obj.months.october.tasks + 1;
                        break;
                        case "11":
                            obj.months.november.tasks = obj.months.november.tasks + 1;
                        break;
                        case "12":
                            obj.months.december.tasks = obj.months.december.tasks + 1;
                        break;
                    }
                }

            })
        });
        let chart =  new ChartCanvas(30,0,5,"myChart");
        chart.renderChartCanvas();
        arrObjYears.forEach(obj => {
            let arr = Object.values(obj.months);
            arr.forEach(ar => {
                chart.addData(ar.tasks,ar.name);
            });
        });   
    }
}

let changeStylesEdit = (event, message) => {
        let replace = document.createElement("p");
        let content = document.createTextNode(message);
        let node = event.target.parentNode.parentNode;
        let icon = document.createElement("i");
        let node2 = event.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[1];
        replace.setAttribute("id", "description-task");
        replace.setAttribute('style', 'width: 70%;');
        replace.classList.add("m-0");
        replace.classList.add("p-0");
        replace.appendChild(content);
        icon.setAttribute('style', 'font-size: 18px;');
        icon.setAttribute('style', 'margin-right: 4px;');
        icon.classList.add("fe-edit");
        icon.classList.add("mr-2");
        node2.replaceChild(icon, node2.firstChild);
        node.replaceChild(replace, event.target.parentNode);
        node2.disabled = false;
}

let changeStylesCalendar = (event, message) => {
    let d = new Date(message.substr(0,10));
    message = String(d).substr(0,10);
    let buttonParent = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[3];
    let button = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[3].childNodes[0];
    let inputCalendar = event.target
    let nodeInput = inputCalendar.parentNode.parentNode.parentNode
    let smallElement = document.createElement("small");
    let icon = document.createElement("i");
    let content = document.createTextNode(message);
    smallElement.classList.add("font-weight-medium");
    smallElement.classList.add("text-muted");
    smallElement.setAttribute('style', 'margin-right: 8px;');
    smallElement.appendChild(content);
    icon.classList.add("fe-calendar");
    icon.classList.add("mr-2");
    icon.setAttribute('style', 'margin-right: 4px;');
    icon.setAttribute('style', 'font-size: 18px;');
    button.parentNode.replaceChild(icon, button);
    nodeInput.replaceChild(smallElement, inputCalendar.parentNode.parentNode);
    buttonParent.disabled = false;
}

let changeStylesProject = (event, message) => {
    let content = document.createTextNode(message);
    let inputParent = event.target.parentNode.parentNode;
    let input = event.target.parentNode;
    let title = document.createElement("h6");
    let buttonParent = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[5];
    let icon = document.createElement("i");
    let iconChange = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[5].childNodes[0];
    icon.classList.add("fe-clipboard");
    icon.classList.add("mr-2");
    icon.setAttribute('style', 'margin-right: 4px;');
    icon.setAttribute('style', 'font-size: 18px;');
    title.classList.add("font-size-sm");
    title.classList.add("mb-0");
    title.classList.add("mr-auto");
    title.appendChild(content);
    inputParent.replaceChild(title, input);
    buttonParent.replaceChild(icon, iconChange);
    buttonParent.disabled = false;
}

let changeStylesDelete = (event) => {
    let task = event.target.parentNode.parentNode.parentNode.parentNode;
    task.style.transform = "translateX(-150%)";
    setTimeout(() => {
        task.style.display = "none";
    }, 500);
}

let changeStylesDone = (event) => {
    let task = event.target.parentNode.parentNode.parentNode;
    task.style.transform = "translateX(-150%)";
    setTimeout(() => {
        task.style.display = "none";
    }, 500);
}

/**
 * handlers
 */
let modalsEvent = () => {
    let buttonSignin = document.getElementById("button-signin");
    let buttonSignup = document.getElementById("button-signup");
    if(buttonSignin && buttonSignup){
        new ModalsEvent(
            buttonSignin,
            document.getElementById("modal-signin"), 
            document.getElementById("close-signin"));
        new ModalsEvent(
            buttonSignup, 
            document.getElementById("modal-signup"), 
            document.getElementById("close-signup"));
        new ModalsEvent(
            document.getElementById("button-change-to-signup"), 
            document.getElementById("modal-signup"), 
            document.getElementById("close-signup"),
            document.getElementById("modal-signin"));
        new ModalsEvent(
            document.getElementById("button-change-to-signin"), 
            document.getElementById("modal-signin"), 
            document.getElementById("close-signin"),
            document.getElementById("modal-signup"));
    } else if(document.getElementById("button-add-task")) {
        new ModalsEvent(
            document.getElementById("button-add-task"),
            document.getElementById("modal-add-task"),
            document.getElementById("close-add-task"),
        )
    }
}