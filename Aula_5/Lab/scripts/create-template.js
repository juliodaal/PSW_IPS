var options = require("./options").template;
var path = require("path");
var readFile = require("fs").readFile;

function createTemplate(viewName, callback, modelName) {
    modelName = modelName || options.modelName;
    var rootFolder = path.dirname(require.main.filename);
    var viewFileName = path.join(rootFolder, options.folder, viewName + options.extension);
    readFile(viewFileName, function (err, data) {
        var template = (err) ?
            new Function(modelName, 'return "";') :
            new Function(modelName, '"use strict";return `' + data + "`;");
        return callback(template);
    });
}

module.exports = createTemplate;