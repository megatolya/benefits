'use strict';

var easyimg = require('easyimage');

module.exports = {
    crop: function (from, to) {
        var IMAGE_SIZE = 100;

        return easyimg.rescrop({
            src: from,
            dst: to,
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            cropwidth: IMAGE_SIZE,
            cropheight: IMAGE_SIZE,
            x: 0,
            y: 0,
            fill: true
        });
    }
};
