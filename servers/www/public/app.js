'use strict';

/* global $, alert, Dropzone */

$(function () {
    var fileAdded = false;

    setTimeout(function () {
        Dropzone.instances[0].on('addedfile', function (file) {
            fileAdded = true;
            $('.dropzone').addClass('dropzone_done');
        });
    }, 0);

    $('.achievement__main-info').on('submit', function () {
        if (!fileAdded) {
            alert('Картинку добавь');
            return false;
        }
    });
});
