"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * Aproveitamos ainda para solicitar ao servidor o carregamento de dados de forma assincrona(ajax)
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = function (event) {
    var info = new Information("divInformation");
    info.getPerson();
    info.getCountry();
    window.info = info;
};

/** 
* @class Guarda toda informação necessaria na execução do exercicio 
* @constructs Informacao
* @param {string} id - id do elemento HTML que contém a informação.
* 
* @property {string} id - id do elemento HTML que contém a informação.
* @property {country[]} countries - Array de objetos do tipo Country, para guardar todos os countries do nosso sistema
* @property {person[]} people - Array de objetos do tipo person, para guardar todas as pessoas do nosso sistema
*/
function Information(id) {
    this.id = id;
    this.people=[];
    this.countries=[];
};

/** 
* @class Estrutura com capacidade de armazenar o estado de uma entidade pessoa 
* @constructs Person
* @param {int} id - id da pessoa
* @param {int} name - nome da pessoa
* @param {Date} birthDate - data de nascimento da pessoa
* @param {int} idCountry - id do pais da pessoa
*/
function Person(id, name, birthDate, idCountry) {
    this.id = id;
    this.name = name;
    this.birthDate = birthDate;
    this.idCountry = idCountry;
};

/** 
* @class Estrutura com capacidade de armazenar o estado de uma entidade país 
* @constructs Person
* @param {int} id - id do país
* @param {int} name - nome do país
* @param {int} shortName - abreviatura
*/
function Country(id, name, shortName) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
};

/**
 * coloca a palavra "home" no div titulo e limpa o div informação
 */
Information.prototype.showHome = function () {
    document.getElementById("headerTitle").textContent="Home";
    replaceChilds(this.id,document.createElement("div"));
};

/**
 * coloca a palavra "People" no div titulo, cria dinamicamente uma tabela com a informação das pessoas e respetivos botões de crud
 */
Information.prototype.showPerson = function () {
    document.getElementById("headerTitle").textContent="People";
    document.getElementById("formPerson").style.display="none";
    var table = document.createElement("table");
    table.id="tablePerson";
    table.appendChild(tableLine(new Person(),true));
    for(var i=0;i<this.people.length;i++){
        table.appendChild(tableLine(this.people[i],false));
    }
    var divTable = document.createElement("divTable");
    divTable.setAttribute("id", "divTable");
    divTable.appendChild(table);
    function deletePersonEventHandler(){
        var table = document.getElementById("tablePerson");
        for (var i = 1, row; row = table.rows[i]; i++) {
            var checkBox = row.cells[0].firstChild;
            var idPerson = row.cells[1].firstChild.nodeValue;
            if (checkBox.checked) {
                info.removePerson(idPerson);
            }
        }
    }
    function newPersonEventHandler(){
        replaceChilds("divTable",document.createElement("div"));
        document.getElementById("formPerson").action="javascript: info.processingPerson('create');";
        document.getElementById("formPerson").style.display="block";
        for(var i=0;i<info.countries.length;i++)
            document.getElementById("countries").options[i] =new Option(info.countries[i].name, info.countries[i].id);
    }
    function updatePersonEventHandler(){
        var idPerson =0;
        for (var i = 1; i<table.rows.length; i++) {
            var checkBox = table.rows[i].cells[0].firstChild;
            if (checkBox.checked)
                idPerson = parseInt(table.rows[i].cells[1].firstChild.nodeValue);
        }
        replaceChilds("divTable",document.createElement("div"));
        document.getElementById("formPerson").action="javascript: info.processingPerson('update');";
        document.getElementById("formPerson").style.display="block";
        document.getElementById("id").value=idPerson;
        document.getElementById("name").value=info.people[info.people.findIndex(i => i.id == idPerson)].name;
        document.getElementById("date").value=info.people[info.people.findIndex(i => i.id == idPerson)].birthDate.toString().split('T')[0];
        var idCountry = info.people[info.people.findIndex(i => i.id == idPerson)].idCountry;
        for(var i=0;i<info.countries.length;i++){
            document.getElementById("countries").options[i] =new Option(info.countries[i].name, info.countries[i].id);
            if(info.countries[i].id===idCountry)
                document.getElementById("countries").selectedIndex=i;
        }
    }
    createButton(divTable, newPersonEventHandler, "New Person");
    createButton(divTable, deletePersonEventHandler, "Delete Person");
    createButton(divTable, updatePersonEventHandler, "Update Person");
    replaceChilds(this.id,divTable);
};

/**
 * Função genérica que cria um botão HTML, dá-lhe um evento e coloca-o na árvore de nós
 * @param {HTMLElement} fatherNode - nó pai do botão
 * @param {function} eventHandler - evento do botão.
 * @param {String} value - texto do botão.
 */
function createButton(fatherNode, eventHandler, value){
    var button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.addEventListener("click", eventHandler);
    fatherNode.appendChild(button);
}

/**
 * Função que substitui todos os elementos filhos de um elemento HTML por um novo elemento HTML (facilitador de DOM)
 * @param {string} id - id do elemento HTML para o qual se pretende substituir os filhos.
 * @param {HTMLElement} newSon - elemento HTML que será o novo filho.
 */
function replaceChilds(id, newSon) {
    var no = document.getElementById(id);
    while(no.hasChildNodes()){
        no.removeChild(no.lastChild);
    }
    no.appendChild(newSon);
};

/**
 * Função que recebe um qualquer objeto e retorna dinamicamente uma linha de tabela HTML com informação relativa ao estado das suas propriedades
 * @param {Object} object - objecto do qual vamos transformar o conteudo dos seus atributos em linhas
 * @param {boolean} headerFormat - controla de o formato é cabeçalho ou linha normal
 */
function tableLine(object, headerFormat) {
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
    return tr;
};
/**
 * Função genérica que tem como objetivo a criação de uma coluna com checkbox
 */
function createCellCheckbox(){
    var td=document.createElement("td");
    var check = document.createElement("input");
    check.type="checkbox";
    td.appendChild(check);
    return td;
}

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso person através do verbo GET, usando pedidos assincronos e JSON
  */
 Information.prototype.getPerson = function (){
    var people = this.people;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8081/person", true);
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            response.person.forEach(function(current){
                people.push(current);
            });
        }
    };
    xhr.send();
};
/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso país através do verbo GET, usando pedidos assincronos e JSON
  */
 Information.prototype.getCountry = function (){
    var countries = this.countries;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8081/country", true);
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            response.country.forEach(function(current){
                countries.push(current);
            });
        }
    };
    xhr.send();
};
/**
 * Função que apaga o recurso pessoa com ym pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
  */
Information.prototype.removePerson = function (id){
    var info = this;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:8081/person/"+id, true);
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            info.people.splice(info.people.findIndex(i => i.id == id),1);
            info.showPerson();
        }
    };
    xhr.send();
}
/**
 * Função que insere ou atualiza o recurso pessoa com um pedido ao servidor NODE.JS através do verbo POST ou PUT, usando pedidos assincronos e JSON
 *  * @param {String} acao - controla qual a operação do CRUD queremos fazer
  */
Information.prototype.processingPerson = function (acao) {
    var info = this;
    var id = document.getElementById("id").value;
    var name = document.getElementById("name").value;
    var birthDate = document.getElementById("date").value;
    var countryList = document.getElementById("countries");
    var idCountry = countryList.options[countryList.selectedIndex].value;
    var person = {id:id, name: name, birthDate: birthDate, idCountry: idCountry};
    var xhr = new XMLHttpRequest();
    xhr.responseType="json";
    if (acao === "create") {
        xhr.onreadystatechange = function () {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                var newPerson = new Person(xhr.response.insertId,name, birthDate, idCountry);
                info.people.push(newPerson);
                info.showPerson();
            }
        }
        xhr.open("POST", "http://localhost:8081/person", true);
    } else if (acao === "update") {
        xhr.onreadystatechange = function () {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                info.people.splice(info.people.findIndex(i => i.id == id),1);
                info.people.push(person);
                info.showPerson();
            }
        }
        xhr.open("PUT", "http://localhost:8081/person/"+id, true);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(person));
}
