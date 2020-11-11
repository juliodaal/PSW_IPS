let url = require("url")
let querystring = require("querystring")
let path = require("path")
let fs = require("fs")
let http = require("http")

let options = {
    "default" : {
        "folder" : "www",
        "document" : "index.html",
        "port" : 8081,
        "favicon" : ""
    },
    "extensions" : {
        "txt" : "text/plain; charset=utf-8",
        "htm" : "text/html; charset=utf-8",
        "html" : "text/html; charset=utf-8",
        "js" : "application/javascript; charset=utf-8",
        "json" : "application/json; charset=utf-8",
        "css" : "text/css; charset=utf-8",
        "gif" : "image/gif",
        "jpg" : "image/jpg",
        "png" : "image/png",
        "ico" : "image/x-icon"
    }
}

let router = (request) => {
    let pathname = querystring.unescape(url.parse(request.url).pathname)
    switch (pathname) {
        case "/": pathname += options.default.document
            break;
        case "/favicon.ico": pathname += options.default.favicon
            break;
        default:
            break;
    }
    // El __dirname indica el atrtrchivo base donde esta alojado el servidor, es la direccion actual
    return pathname ? path.join(__dirname, options.default.folder, pathname) : null
}
// Esta funcion verifica el tipo de contenido, es decir, la extension del archivo
let mimeType = (filename) => {
    let extension = path.extname(filename)
    if(extension.charAt(0) === "."){
        extension = extension.substr(1)
    }
    return options.extensions[extension]
}
// Esta funcion  nos envia mensajes solo si estamos en modo desarrollo
// NODE_ENV=production node <nomeArchivo.js> Esto hay que ejecutarlo en la consola, para establecer la varible de entorno  
let logOnDev = (message) => {
    if(process.env.NODE_ENV === "development") {
        console.log(message);
    }
}

http.createServer(function (req,res) {
    logOnDev(`Request for ${req.url} received.`)
    let filename = router(req)
    if (filename) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                logOnDev(err);
                res.writeHead(404, {"Content-Type" : "text/plain; charset=utf-8"})
                res.write("HTTP Status: 404 : NOT FOUND")
            } else {
                res.writeHead(200, { "Content-Type" : mimeType(filename) })
                res.write(data)
            }
            res.end()
        })
    }
}).listen(options.default.port)

logOnDev(`Server running at http://localhost:${options.default.port}`)