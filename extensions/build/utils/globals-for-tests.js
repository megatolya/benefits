'use strict';

global.window = {
    localStorage: {
        setItem: function () {},
        getItem: function () {}
    },
    setTimeout: setTimeout.bind(undefined),
    setInterval: setInterval.bind(undefined),
    clearInterval: clearInterval.bind(undefined),
    clearTimeout: clearTimeout.bind(undefined),
    location: {}
};

global.sinonHelper = require('./sinon-helper');
