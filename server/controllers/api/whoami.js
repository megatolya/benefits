var auth = require('../../auth');

module.exports = function (req, res, next) {
    auth.registerUser().then(function (userInfo) {
        res.json({
            uid: userInfo.id,
            salt: userInfo.salt
        });
    }).fail(next);
};
