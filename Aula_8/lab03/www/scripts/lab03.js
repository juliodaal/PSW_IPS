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
 * coloca a palavra "People" no div titulo, cria dinamicamente uma tabela com a informação das pessoas e respetivos botões de crud com event handlers
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
    divTable.appendChild(addButtons(newPerson, "New Person"));
    divTable.appendChild(addButtons(deletePerson, "Delete Person"));
    divTable.appendChild(addButtons(updatePerson, "Update Person"));

    replaceChilds(this.id,divTable);
};
function addButtons(callback, value){
    const span = document.createElement("span")
    span.setAttribute("name", "btn")
    return createButton(span, callback, value)
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
    if (!headerFormat) tr.appendChild(createCellCheckbox(object.id));
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
    return fatherNode
}

/**
 * Função genérica que tem como objetivo a criação de uma coluna com checkbox
 */
function createCellCheckbox(id){
    var td=document.createElement("td");
    var check = document.createElement("input");
    check.type="checkbox";
    check.name= "checkbox";
    check.value= id;
    td.appendChild(check);
    return td;
}

function newPerson(){
    hiddenThings()
    info.putCountries()
}
function deletePerson(){
    selectedCheck(info.removePerson)
}
function updatePerson(){
    hiddenThings()
    info.putCountries()
}
function selectedCheck(callback = false){
    const arrayChecks = document.getElementsByName("checkbox")
    let result = {result: false, id: null}
    arrayChecks.forEach(element => {
        if(element.checked){
            if(callback){return callback(element.value)} else {result = {result: true, id: element.value} } 
        }
    });
    return result
}
function hiddenThings(){
    document.getElementById("headerTitle").textContent="People";
    document.getElementById("formPerson").style.display="block";
    document.getElementById("tablePerson").style.display="none";
    const spans = document.getElementsByName("btn");
    spans.forEach(span => {
        span.style.display="none"
    });
}
Information.prototype.putCountries = function (){
    const select = document.getElementById("countries")
    this.countries.forEach(country => {
        let option = document.createElement("option")
        option.setAttribute("value", `${country.id}`)
        option.innerText = country.name
        select.appendChild(option)
    });
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
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE',`http://localhost:8081/person/${id}`);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}
/**
 * Função que insere ou atualiza o recurso pessoa com um pedido ao servidor NODE.JS através do verbo POST ou PUT, usando pedidos assincronos e JSON
 *  * @param {String} acao - controla qual a operação do CRUD queremos fazer
  */
Information.prototype.processingPerson = function (acao) {
    let flag = selectedCheck()
    const iForm = document.getElementById('formPerson')
    let form = new FormData(iForm)
    let data = {
                    name : form.get('name'), 
                    date : form.get('date'), 
                    countries : form.get('countries')
                }
    const jsonString = JSON.stringify(data)
    const xhr = new XMLHttpRequest()
    if(!flag.result){
        xhr.open('POST','http://localhost:8081/person');
    } else {
        xhr.open('PUT',`http://localhost:8081/person/${flag.id}`);
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonString)
}
