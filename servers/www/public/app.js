'use strict';

/* global $, alert, Dropzone, i18n */

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
            alert(i18n.get('messages.addImage'));
            return false;
        }
    });

    $('.achievement__name, .achievement__desc').on('input', function () {
        var $this = $(this);
        var data = {};

        data[$this.data('name')] = $this.html();
        $.post(window.location.pathname, data);
    });
}

$(function () {
    setTimeout(function () {
        main();
    }, 0);
});
