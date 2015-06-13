'use strict';

var debug = require('debug')('app:github-rule-checker');

function isFunction(fn) {
    return typeof fn === 'function';
}

module.exports = {
    check: function (data, rule) {
        if (!data || !rule) {
            return false;
        }
        var method = this._methods[rule.type];
        if (isFunction(method)) {
            return method.call(this, data, rule);
        }
        debug('method do not exist: ', rule.type);
        return false;
    },

    _methods: {
        compareLess: function (data, rule) {
            return data[rule.field] < rule.aim;
        },

        compareMore: function (data, rule) {
            return data[rule.field] > rule.aim;
        }
    }
};
