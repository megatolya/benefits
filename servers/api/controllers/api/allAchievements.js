var db = require('../../db');

module.exports = function (req, res, next) {
    db.achievements.getAll().then(function (all) {
        res.json(all.map(function (achievement) {
            delete achievement.rules;
            delete achievement._id;
            delete achievement.url;
            return achievement;
        }));
    }).fail(next);
};

