var fs = require('fs');

fs.open(__filename, 'r', function(err, file) {
    console.log('IO!');
});

setImmediate(function() {
    console.log('immediate');
});

precess.nextTick(function() {
    console.log('nextTick');
});