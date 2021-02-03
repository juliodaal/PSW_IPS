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
                getDataChart(renderChart,myChart.dataset.id);
                break;

            default:
                break;
        }
    }
}

let findTypes = (callback, userId) => sendHttpRequest(`http://localhost:8081/box/select/${userId}`,'GET',callback);

let getDataChart = (callback,id) => sendHttpRequest(`http://localhost:8081/statistics/client/${id}`,'POST',callback);

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

let sendHttpRequest = (url,method,callback,data = null) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
            let response = JSON.parse(xhr.response);
            callback(response.response);
        }
    }
    xhr.open(method,url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data == null ? xhr.send() : xhr.send(JSON.stringify(data))
}

// ****************************************************************************************

let renderChart = (response) => {
    response.data.map(element => {
        element.data = element.data.substr(0,10);
    });
    console.log(response.data)
    // if(error) {
    //     let chart =  new ChartCanvas(30,0,5,"myChart");
    //     chart.renderChartCanvas();
    //     swal(response.response.message, "You do not have task done yet!", "info")
    // } else {
    //     let data = response.response.data[1];
    //     let arrYears = [];
    //     data.forEach(task => {
    //         let year = String(task.date).substr(0,4);
    //         if(arrYears.length > 0){ 
    //             if(arrYears.indexOf(year) == -1){ arrYears.push(year); } 
    //         } else { 
    //             arrYears.push(year); 
    //         }
    //     });
    //     let arrObjYears = [];
    //     arrYears.forEach(arr => {
    //         arrObjYears.push({
    //                 year: arr,
    //                 months: {
    //                     january : { tasks: 0 , name: "January" }, 
    //                     february : { tasks: 0, name: "February" },
    //                     march : { tasks: 0, name: "March" },
    //                     april : { tasks: 0, name: "April" }, 
    //                     may : { tasks: 0, name: "May" },
    //                     june : { tasks: 0, name: "June" },
    //                     july : { tasks: 0, name: "July" },
    //                     august : { tasks: 0, name: "August" },
    //                     september : { tasks: 0, name: "September" },
    //                     october : { tasks: 0, name: "October" },
    //                     november : { tasks: 0, name: "November" },
    //                     december : { tasks: 0, name: "December" }
    //                 }
    //             });            
    //     });
    //     data.forEach(task => {
    //         let year = String(task.date).substr(0,4);
    //         let month = String(task.date).substr(5,2);
    //         arrObjYears.forEach(obj => {
    //             if(year == obj.year){
    //                 switch (month) {
    //                     case "01":
    //                         obj.months.january.tasks = obj.months.january.tasks + 1;
    //                     break;
    //                     case "02":
    //                         obj.months.february.tasks = obj.months.february.tasks + 1;
    //                     break;
    //                     case "03":
    //                         obj.months.march.tasks = obj.months.march.tasks + 1;  
    //                     break;
    //                     case "04":
    //                         obj.months.april.tasks = obj.months.april.tasks + 1;
    //                     break;
    //                     case "05":
    //                         obj.months.may.tasks = obj.months.may.tasks + 1;
    //                     break;
    //                     case "06":
    //                         obj.months.june.tasks = obj.months.june.tasks + 1;
    //                     break;
    //                     case "07":
    //                         obj.months.july.tasks = obj.months.july.tasks + 1;
    //                     break;
    //                     case "08":
    //                         obj.months.august.tasks = obj.months.august.tasks + 1;
    //                     break;
    //                     case "09":
    //                         obj.months.september.tasks = obj.months.september.tasks + 1;
    //                     break;
    //                     case "10":
    //                         obj.months.october.tasks = obj.months.october.tasks + 1;
    //                     break;
    //                     case "11":
    //                         obj.months.november.tasks = obj.months.november.tasks + 1;
    //                     break;
    //                     case "12":
    //                         obj.months.december.tasks = obj.months.december.tasks + 1;
    //                     break;
    //                 }
    //             }

    //         })
    //     });
    //     let chart =  new ChartCanvas(30,0,5,"myChart");
    //     chart.renderChartCanvas();
    //     arrObjYears.forEach(obj => {
    //         let arr = Object.values(obj.months);
    //         arr.forEach(ar => {
    //             chart.addData(ar.tasks,ar.name);
    //         });
    //     });   
    // }
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