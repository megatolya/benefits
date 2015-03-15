var Q = require('q');
var db = require('../db');
var uuid = require('node-uuid');

module.exports = {
    registerUser: function () {
        var deferred = Q.defer();
        var id = uuid.v4();
        var salt = uuid.v4();

        db.addUser(id, salt).then(function () {
            deferred.resolve({
                id: id,
                salt: salt
            });
        }).fail(deferred.reject);

        return deferred.promise;
    },

    generateToken: function (userId, salt, path) {
        return userId.split('-')[0] + salt.split('-')[0] + path.replace(/(\/|-)/g, '');
    }
};
