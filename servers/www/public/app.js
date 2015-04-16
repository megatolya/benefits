'use strict';

/* global $, alert, Dropzone */

function main() {
    var fileAdded = false;

    if (Dropzone.instances.length > 0) {
        Dropzone.instances[0].on('addedfile', function (file) {
            fileAdded = true;
            $('.dropzone').addClass('dropzone_done');
        });
    }

    $('.achievement__main-info').on('submit', function () {
        if (!fileAdded) {
            alert('Картинку добавь');
            return false;
        }
    });
}

$(function () {
    setTimeout(function () {
        main();
    }, 0);
});
