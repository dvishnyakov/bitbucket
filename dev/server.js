var http = require('http');
//var log = require('winston');

var server = http.createServer();

server.on('request', require('./request'));

server.listen(1337, '127.0.0.1');

//log.info('Server is running');