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

    $('.achievement__edit').one('click', function () {
        var form = $('.form-wrapper');
        form.removeClass('hide');
        $('.achievement_size_big .achievement__table').remove();
        var $this = $(this);
        $this.text(i18n.get('achievements.save'));
        $this.one('click', function () {
            var data = {};

            form.serializeArray().forEach(function (serialzedProp) {
                if (['name', 'description'].indexOf(serialzedProp.name) !== -1) {
                    data[serialzedProp.name] = serialzedProp.value;
                } else {
                    data[serialzedProp.name] = data[serialzedProp.name] || [];
                    data[serialzedProp.name].push(serialzedProp.value);
                }
            });

            $.ajax(window.location.pathname, {
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST'
            });
        });
    });

    [
        'holders',
        'creators',
        'children',
        'parents',
    ].forEach(function (name) {
        var selector = '.form-%name .suggest'.replace('%name', name);
        var suggest = $(selector);
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
