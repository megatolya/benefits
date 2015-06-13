'use strict';

var facebookRuleChecker = require('../../rule-checkers/github');
var giver = require('../giver');

module.exports = {
    check: function (user, achievements) {
        giver.checkRules(user, achievements, this._ruleSatisfied.bind(this));
    },

    _ruleSatisfied: function (user, rule) {
        return facebookRuleChecker.check(user.facebookData.specific, rule);
    }
};
