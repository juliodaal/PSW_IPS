"use strict";

window.onload = function (event) {
    var info = new Information("divInformation");
    info.getSensor();
    window.info = info;
};

function Information(id) {
    this.id = id;
    this.sensors=[];
};

function Sensor(id, name) {
    this.id = id;
    this.name = name;
};

Information.prototype.showHome = function () {
    document.getElementById("headerTitle").textContent="Home";
    clearChart();
    replaceChilds(this.id,document.createElement("div"));
};

Information.prototype.showSensors = function () {
    document.getElementById("headerTitle").textContent="Sensors";
    clearChart();
    var table = document.createElement("table");
    table.id="tableSensor";
    table.appendChild(tableLine(new Sensor(),true));

    function eventHandler(event) {
        window.info.showSamples();
        var id = window.info.sensors[event.currentTarget.id - 1].id;
        start(id);
    }
    
    for(var i=0;i<this.sensors.length;i++){
        table.appendChild(tableLine(this.sensors[i],false,eventHandler));
    }
    var divTable = document.createElement("div");
    divTable.setAttribute("id", "divTable");
    divTable.appendChild(table);
    
    replaceChilds(this.id,divTable);
};

Information.prototype.showSamples = function () {
    document.getElementById("headerTitle").textContent="Samples";
    replaceChilds(this.id,document.createElement('div'));
    clearChart();
}

function replaceChilds(id, newSon) {
    var no = document.getElementById(id);
    while(no.hasChildNodes()){
        no.removeChild(no.lastChild);
    }
    if(newSon!==undefined) no.appendChild(newSon);
};

function createSvg(fatherNode, cssClass, id){
    var svg = document.createElement("svg");
    svg.id = id;
    svg.className = cssClass;
    fatherNode.appendChild(svg);
}

function clearChart() {
    replaceChilds("svg1");
    replaceChilds("svg2");
    replaceChilds("svg3");
}

function createButton(fatherNode, eventHandler, value, id){
    var button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.setAttribute('id', id);
    button.addEventListener("click", eventHandler);
    fatherNode.appendChild(button);
}

function createCellCheckbox(){
    var td=document.createElement("td");
    var check = document.createElement("input");
    check.type="checkbox";
    td.appendChild(check);
    return td;
}

function tableLine(object, headerFormat, eventHandler) {
    var tr = document.createElement("tr");
    if (!headerFormat) tr.appendChild(createCellCheckbox());
    else tr.appendChild(document.createElement("th"));
    var tableCell = null;
    for (var property in object) {
        if ((object[property] instanceof Function)) 
            continue;
        if(headerFormat){
            tableCell = document.createElement("th");
            tableCell.textContent=property[0].toUpperCase() + property.substr(1,property.length-1);
        } else {
            tableCell = document.createElement("td");
            tableCell.textContent=object[property];
        }
        tr.appendChild(tableCell); 
    }
    if(eventHandler!==undefined) createButton(tr, eventHandler, "samples", object.id);
    return tr;
};

Information.prototype.getSensor = function (){
    // nível 5
    var sensors = this.sensors;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8081/sensor", true);
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            response.data.forEach(function(current){
                sensors.push(current);
            });
        }
    };
    xhr.send();
};