"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * Aproveitamos ainda para solicitar ao servidor o carregamento de dados de forma assincrona(AJAX)
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
    this.countries=[];
    this.people=[];
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
* @constructs Country
* @param {int} id - id do país
* @param {string} name - nome do país
* @param {string} shortName - nome do país abreviado
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
 * coloca a palavra "People" no div titulo e cria dinamicamente uma tabela com a informação das pessoas
 */
Information.prototype.showPerson = function () {
    document.getElementById("headerTitle").textContent="People";
    var table = document.createElement("table");
    table.appendChild(tableLine(new Person(),true));
    for(var i=0;i<this.people.length;i++){
        table.appendChild(tableLine(this.people[i],false));
    }
    replaceChilds(this.id,table);
};

/**
 * coloca a palavra "Country" no div titulo e cria dinamicamente uma tabela com a informação das pessoas
 */
Information.prototype.showCountry = function () {
    document.getElementById("headerTitle").textContent="Countries";
    var table = document.createElement("table");
    table.appendChild(tableLine(new Country(),true));
    for(var i=0;i<this.countries.length;i++){
        table.appendChild(tableLine(this.countries[i],false));
    }
    replaceChilds(this.id,table);
};

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso person através do verbo GET, usando pedidos assincronos e JSON
 */
Information.prototype.getPerson = function(){
    var people = this.people;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8081/person", true);
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            response.person.forEach(function(current){
                people.push(new Person(current.id, current.name, current.birthDate.split("T")[0], current.idCountry));
            });
        }
    };
    xhr.send();
};

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso Country através do verbo GET, usando pedidos assincronos e JSON
 */
Information.prototype.getCountry = function(){
    var countries = this.countries;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8081/Country", true);
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            response.country.forEach(function(current){
                countries.push(new Country(current.id, current.name, current.shortName));
            });
        }
    };
    xhr.send();
};

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