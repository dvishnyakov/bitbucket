var log = require('../lib/log')(module);

module.exports = function(server) {
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function(socket) {

        socket.on('comment', function (data, cb) {
            socket.broadcast.emit('comment', data);
            cb && cb();
        });

    });
};