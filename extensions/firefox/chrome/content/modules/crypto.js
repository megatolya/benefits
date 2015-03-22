'use strict';

const {
    classes: Cc,
    interfaces: Ci,
    utils: Cu,
    results: Cr
} = Components;

const UCONV = Cc['@mozilla.org/intl/scriptableunicodeconverter']
    .createInstance(Ci.nsIScriptableUnicodeConverter);

UCONV.charset = 'UTF-8';

let crypto = {
    // TODO: Нужно отправлять флаг: binary, string, base64-encoded
    md5: function (aString, aBinary) {
        let ch = Cc['@mozilla.org/security/hash;1'].createInstance(Ci.nsICryptoHash);
        ch.init(ch.MD5);

        let stream = UCONV.convertToInputStream(aString);
        ch.updateFromStream(stream, stream.available());

        let result = ch.finish(false);

        if (!aBinary) {
            result = this._binaryToHexString(result);
        }

        return result;
    },

    _binaryToHexString: function (aBinaryData) {
        let resultString = '';

        for (let i = 0; i < aBinaryData.length; i++) {
            let char = aBinaryData.charCodeAt(i);

            resultString += ('0' + char.toString(16)).slice(-2);
        }

        return resultString;
    }
};

module.exports = {
    md5: function (aString, aBinary = false) {
        // TODO: Сделать проверку на разные типы входных данных для aString: string, bufferArray...
        return crypto.md5(aString, aBinary);
    }
};
