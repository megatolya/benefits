var config = require('./config');

if (config.isTestsRunning) {
    var emptyFn = function () {};
    module.exports = {
        log: emptyFn,
        dump: emptyFn,
        info: emptyFn,
        error: emptyFn
    };
    return;
}

module.exports = console;
