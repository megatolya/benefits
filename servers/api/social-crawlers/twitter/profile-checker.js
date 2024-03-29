'use strict';

var twitterRuleChecker = require('../../rule-checkers/twitter');
var giver = require('../giver');

module.exports = {
    check: function (user, achievements) {
        giver.checkRules(user, achievements, this._ruleSatisfied.bind(this));
    },

    _ruleSatisfied: function (user, rule) {
        return twitterRuleChecker.check(user.twitterData.specific, rule);
    }
};
