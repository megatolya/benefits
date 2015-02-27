var console = require('./console');

console.log('hello world from serverConnector');

var serverConnector = {
    connect: function() {
        console.log('connected!');
    }
};

module.exports = serverConnector;
