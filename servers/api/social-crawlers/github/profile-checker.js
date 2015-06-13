'use strict';

var githubRuleChecker = require('../../rule-checkers/github');
var giver = require('../giver');

module.exports = {
    check: function (user, achievements) {
        giver.checkRules(user, achievements, this._ruleSatisfied.bind(this));
    },

    _ruleSatisfied: function (user, rule) {
        return githubRuleChecker.check(user.githubData.specific, rule);
    }
};
