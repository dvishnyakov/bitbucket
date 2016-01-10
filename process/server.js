
var http = require("http");

var opts = require("optimist").argv;

http.createServer(function(req, res) {

    if (process.env.NODE_ENV == "production") {

    } else if (process.env.NODE_ENV == "development") {

    }

    res.end("The server is running!");
}).listen(opts.port);