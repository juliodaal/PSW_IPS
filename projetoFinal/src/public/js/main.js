import { ModalsEvent } from "./modalsEvent/ModalsEvent.js"; 
import { ChartCanvas } from "./ChartCanvas/ChartCanvas.js";
import { MenuEvent } from "./MenuEvent/MenuEvent.js";

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
    modalsEvent();
    menuEvent();
    
    let userId = document.getElementById("section");
    if(userId != null){ findTypes(renderTypes,userId.dataset.user); }
    
    let myChart = document.getElementById("myChart");
    if(myChart != null){
        switch (myChart.dataset.purpose) {
            case "client":
                getDataChart(renderChart,`http://localhost:8081/statistics/client/${myChart.dataset.id}`, "Numero de Contentores");
                break;
            case "worker":
                getDataChart(renderChart,`http://localhost:8081/worker/statistics/${myChart.dataset.id}`, "Numero de Contentores Trabalhados");
                break;
            case "box":
                getDataChart(renderChartBox,`http://localhost:8081/box/statistics/${myChart.dataset.id}`, "Numero de Elementos");
                break;

            default:
                break;
        }
    }
}

let findTypes = (callback, userId) => sendHttpRequest(`http://localhost:8081/box/select/${userId}`,'GET',callback);

let getDataChart = (callback,url,lineDescription) => sendHttpRequest(url,'POST',callback,null,lineDescription);

let renderTypes = (response)=>{
    let typeInput = document.getElementById("type-input"),
    // section = document.getElementById("section"),
    content = "";
    if(response.message == "success"){
        if(response.data.length == 0){
            swal("No Type", "You have no type box!", "warning");
        } else {
            response.data.map(element =>{
                content += "<option>" + element.tipo + "</option>"
            })
            typeInput.innerHTML = content;
        }
    } else {
        swal(response.message, response.message, `${response.message}`);
    }
}


// *******************************************************************************

let sendHttpRequest = (url,method,callback,data = null,parameter = null) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
            let response = JSON.parse(xhr.response);
            callback(response.response,parameter);
        }
    }
    xhr.open(method,url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data == null ? xhr.send() : xhr.send(JSON.stringify(data))
}

// ****************************************************************************************

let renderChart = (response,lineDescription) => {
    if(response.data.length == 0){
        let chart =  new ChartCanvas(response.data.length + 5,0,1,"myChart",lineDescription);
        chart.renderChartCanvas();
        swal("No data", "You have not data to show!", 'warning');
    } else {
        response.data.map(element => { element.data = element.data.substr(0,10); });
    let chart =  new ChartCanvas(response.data.length + 5,0,1,"myChart",lineDescription);
    chart.renderChartCanvas();
    let months = [
        { id: "01", quantity: 0 , name: "January" }, 
        { id: "02", quantity: 0, name: "February" },
        { id: "03", quantity: 0, name: "March" },
        { id: "04", quantity: 0, name: "April" }, 
        { id: "05", quantity: 0, name: "May" },
        { id: "06", quantity: 0, name: "June" },
        { id: "07", quantity: 0, name: "July" },
        { id: "08", quantity: 0, name: "August" },
        { id: "09", quantity: 0, name: "September" },
        { id: "10", quantity: 0, name: "October" },
        { id: "11", quantity: 0, name: "November" },
        { id: "12", quantity: 0, name: "December" }
    ]; 
    months.forEach(obj => { response.data.forEach(res => {
            let data = res.data.substr(5,2)
            if(obj.id == data){ obj.quantity++; } }) });
    let acum = [], acumResult = [];
    months.forEach(element => {
        if(element.quantity === 0){
            acum.push({quantity : element.quantity, name : element.name})  
        } else {
            acum.push({quantity : element.quantity, name : element.name});
            acumResult = acumResult.concat(acum);
            acum = []; 
        } });
    acumResult.forEach(element => { chart.addData(element.quantity,element.name) });
    }
}

let renderChartBox = (response,lineDescription) => {
    if(response.data.length == 0){
        let chart =  new ChartCanvas(response.data.length + 5,0,5,"myChart",lineDescription);
        chart.renderChartCanvas();
        swal("No data", "You have not data to show!", 'warning');
    } else {
        response.data.map(element => { element.data = element.data.substr(0,10); });
        let quantity = response.data[0].quantity;
        for (let i = 0; i < response.data.length - 1; i++) {
            if(quantity > response.data[i + 1].quantity){
                quantity = quantity;
            } else {
                quantity = response.data[i + 1].quantity;
            }
        }
        let chart =  new ChartCanvas(quantity + 5,0,5,"myChart",lineDescription);
        chart.renderChartCanvas();
        let months = [
            { id: "01", quantity: 0 , name: "January" }, 
            { id: "02", quantity: 0, name: "February" },
            { id: "03", quantity: 0, name: "March" },
            { id: "04", quantity: 0, name: "April" }, 
            { id: "05", quantity: 0, name: "May" },
            { id: "06", quantity: 0, name: "June" },
            { id: "07", quantity: 0, name: "July" },
            { id: "08", quantity: 0, name: "August" },
            { id: "09", quantity: 0, name: "September" },
            { id: "10", quantity: 0, name: "October" },
            { id: "11", quantity: 0, name: "November" },
            { id: "12", quantity: 0, name: "December" }
        ]; 
        months.forEach(obj => { response.data.forEach(res => {
                let data = res.data.substr(5,2)
                if(obj.id == data){ obj.quantity = res.quantity; } }) });
        let acum = [], acumResult = [];
        months.forEach(element => {
            if(element.quantity === 0){
                acum.push({quantity : element.quantity, name : element.name})  
            } else {
                acum.push({quantity : element.quantity, name : element.name});
                acumResult = acumResult.concat(acum);
                acum = []; 
            } });
        acumResult.forEach(element => { chart.addData(element.quantity,element.name) });
    }
}
    
let modalsEvent = () => {
    new ModalsEvent(
        document.getElementById("button-signin"),
        document.getElementById("modal-signin"), 
        document.getElementById("close-signin"));
}

let menuEvent = () => {
    new MenuEvent(
        document.getElementById("button-menu"),
        document.getElementById("button-times-menu"),
        document.getElementById("nav-menu"));
}