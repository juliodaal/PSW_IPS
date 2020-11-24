var createTemplate = require("./create-template");

function sendTemplate(response, model) {
    return function (template) {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.end(template(model));
    };
}

function calculator(request, response) {
    createTemplate("calculator", sendTemplate(response));
}

function result(request, response) {
    var calculate = function calculate(number1, operator, number2) {
        switch (operator) {
            case "+":
                return number1 + number2;
            case "-":
                return number1 - number2;
            case "*":
                return number1 * number2;
            case "/":
                return number1 / number2;
            default:
                return NaN;
        }
    };
    var number1 = parseFloat(request.body.number1);
    var operator = request.body.operator;
    var number2 = parseFloat(request.body.number2);
    var model = {
        number1: number1,
        operator: operator,
        number2: number2,
        result: calculate(number1, operator, number2)
    };
    createTemplate("result", sendTemplate(response, model));
}

module.exports.calculator = calculator;
module.exports.result = result;