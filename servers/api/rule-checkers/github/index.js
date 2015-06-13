'use strict';

var ruleChecker = require('../rule-checker');

module.exports = {
    check: function (data, rule) {
        return ruleChecker.check(data, rule);
    }
};
