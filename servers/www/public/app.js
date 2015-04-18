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

    [
        'holders',
        'creators',
        'children',
        'parents'
    ].forEach(function (name) {
        var selector = '.form-%name'.replace('%name', name);
        var form = $(selector);
        var suggest = $(selector + ' .suggest');

        form.on('submit', function () {
            var vals = suggest.val();
            $.post(form.attr('action'), {
                data: JSON.stringify(vals || [])
            });
            return false;
        });

        var data = [];
        suggest.find('option').map(function () {
            data.push({
                id: $(this).attr('value'),
                text: $(this).html(),
                name: $(this).html()
            });
        });

        suggest.select2({
            data: data,
            ajax: {
                url: suggest.data('suggest'),
                dataType: 'json',
                data: function (params) {
                    return {
                        q: params.term
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data.users
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 1,
            templateResult: function  (val) {
                return val.name || val.text;
            },
            templateSelection: function (val) {
                return val.name || val.text;
            }
        });
        suggest.val(data.map(function (val) {
            return val.id;
        }));
        suggest.trigger('change');
    });
}

$(function () {
    setTimeout(function () {
        main();
    }, 0);
});
