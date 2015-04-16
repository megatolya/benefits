'use strict';

var Achievement = require('./achievement');
var Rule = require('./rule');

Achievement.belongsToMany(Rule, {through: 'AchievementRule'});
Rule.belongsToMany(Achievement, {through: 'AchievementRule'});
