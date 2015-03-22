'use strict';

var storage = Object.create(null);

module.exports = {
    set: function (aKey, aValue) {
        storage[aKey] = aValue;
    },

    get: function (aKey) {
        if (storage[aKey]) {
            return storage[aKey];
        }
    }
};
