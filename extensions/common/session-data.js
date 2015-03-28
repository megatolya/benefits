'use strict';

var storage = require('common/storage');
var crypto = require('specific/crypto');

var sessionManagerWrapper = (function () {
    var storageKeys = {
        UID: 'extension-uid',
        SALT: 'salt'
    };

    function md5(aString) {
        return crypto.md5(aString);
    }

    return {
        /**
         * Возвращает токен.
         *
         * @param {String} aMethod - имя метода, для которого нужно получить токен.
         *
         * @returns {String}
         */
        getToken: function (aMethod) {
            if (aMethod === 'whoami') {
                return '9990da9c91b76eaacd9addfd3dbba36f';
            }

            var uid = this.getUID();
            var salt = this.getSalt();

            return md5(uid + '_' + salt + '_' + aMethod);
        },

        /**
         * Возвращает id сессии.
         *
         * @returns {String}
         */
        getUID: function () {
            return storage.get(storageKeys.UID) || '';
        },

        setUID: function (aUID) {
            storage.set(storageKeys.UID, aUID);
        },

        /**
         * Устанавливает текущую соль.
         *
         * @param {String} aSaltString
         */
        setSalt: function (aSaltString) {
            if (aSaltString) {
                storage.set(storageKeys.SALT, aSaltString);
            }
        },

        getSalt: function () {
            return storage.get(storageKeys.SALT) || '';
        }
    };
})();

module.exports = sessionManagerWrapper;
