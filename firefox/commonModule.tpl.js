EXPORTED_SYMBOLS = ['%moduleName'];

var require;
var %moduleName = {
    init: function(_require) {
        require = _require;

        (function() {
%moduleSource
        })();
    },

    finalize: function() {}
};
