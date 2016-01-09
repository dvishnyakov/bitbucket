var http = require('http');

http.createServer(function (req, res) {

    var part = 0;
    setImmediate(function run() {
        heavyCalc(part++);
        if (notFinished) setImmediate(run);
    });
}).listen(1337);