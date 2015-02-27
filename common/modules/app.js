var serverConnector = require('./serverConnector');
var console = require('./console');

serverConnector.connected.add(function() {
    console.log('connnected from signal!!!');
});

serverConnector.connect();


