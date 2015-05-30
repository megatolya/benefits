'use strict';

module.exports = {
    check: function (user) {
        this._checkFollowersCount(user);
    },

    _checkFollowersCount: function (user) {
        var profile = user.twitterData.specific;
        if (profile.followers_count < 10) {
            user.setAchievements([5]);
        } else if (profile.followers_count > 10) {
            user.setAchievements([6]);
        }
    }
};
