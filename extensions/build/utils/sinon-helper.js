'use strict';

module.exports = {
    resetStubsInObject: function (obj) {
        Object.keys(obj).forEach(function (key) {
            var stub = obj[key];
            if (typeof stub.reset === 'function') {
                stub.reset();
            }
        });
    }
};
