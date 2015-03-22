'use strict';

var md5 = require("blueimp-md5").md5;

module.exports = {
    md5: function (value, isBinary) {
        return md5(value);
    }
};
