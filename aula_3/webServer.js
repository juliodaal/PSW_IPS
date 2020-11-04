let http = require("http")
let server = http.createServer()

const processRequest = (req,resp) => {
    resp.writeHead(200, { "Content-Type" : "text/plain; charset=utf-8" })
    resp.write("Olá Mundo")
    resp.end()
}

server.on("request",processRequest)

server.listen(4000)

// Segunda opción 

// require("http")
//     .createServer(function (request, response) {
//         response.writeHead(200, 
//                 {"Content-Type" : "text/plain; charset=utf-8"})
//         response.end("Olá Mundo 2")
//     })
//     .listen(4000)