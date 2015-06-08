'use strict';

var models = module.exports = {};

var db = require('./index');

models.Hits = db.define.apply(db, require('./models/hits'));

models.Tag = db.define.apply(db, require('./models/tag'));

models.User = db.define.apply(db, require('./models/user'));
models.User.hasMany(models.Hits);

models.Rule = db.define.apply(db, require('./models/rule'));
models.Rule.hasMany(models.Hits);

models.Achievement = db.define.apply(db, require('./models/achievement'));
models.Achievement.belongsTo(models.User, {as: 'creator'});

models.AchievementCert = db.define('achievementCert', {});
models.Certificate = db.define.apply(db, require('./models/certificate'));
models.Certificate.belongsTo(models.Achievement, {through: models.AchievementCert});
models.Achievement.hasMany(models.Certificate);

models.AchievementRule = db.define('achievementRule', {});
models.Achievement.belongsToMany(models.Rule, {through: models.AchievementRule});
models.Rule.belongsToMany(models.Achievement, {through: models.AchievementRule});

models.AchievementHolder = db.define('achievementHolder', {});
models.Achievement.belongsToMany(models.User, {as: 'holders', through: models.AchievementHolder});
models.User.belongsToMany(models.Achievement, {as: 'receivedAchievements', through: models.AchievementHolder});

models.AchievementChild = db.define('achievementChild', {});
models.Achievement.belongsToMany(models.Achievement, {as: 'children', through: models.AchievementChild});

models.AchievementTag = db.define('achievementTag', {});
models.Achievement.belongsToMany(models.Tag, {through: models.AchievementTag});
models.Tag.belongsToMany(models.Achievement, {through: models.AchievementTag});
