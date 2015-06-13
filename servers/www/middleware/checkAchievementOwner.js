'use strict';

module.exports = function checkAchievementOwner(req, res, next) {
    var achievementId = req.params.id;
    req.getProvider('achievement').get(req.params.id).then(function (achievement) {
        if (achievement.creatorId === req.user.id) {
            next();
        } else {
            next(401);
        }
    });
};
