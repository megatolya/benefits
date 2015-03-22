'use strict';

const {
    classes: Cc,
    interfaces: Ci,
    utils: Cu,
    results: Cr
} = Components;

// TODO: Сделать более обширную обертку над nsIXMLHttpRequest.
function request () {
    let xhr = Cc['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Ci.nsIXMLHttpRequest);
    xhr.mozBackgroundRequest = true;

    return xhr;
}

module.exports = request;
