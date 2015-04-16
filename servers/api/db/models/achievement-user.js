'use strict';

var Achievement = require('./achievement');
var User = require('./user');

Achievement.belongsToMany(User, {through: 'AchievementUser'});
User.belongsToMany(Achievement, {through: 'AchievementUser'});
