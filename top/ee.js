var EventEmitter = require('events').EventEmitter;

var server = new EventEmitter;

server.on('error', function(err) {
    console.log(err);
});

server.emit('error', new Error('серверная ошибка'));