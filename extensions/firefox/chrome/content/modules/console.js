'use strict';

let console = Components.utils.import('resource://gre/modules/devtools/Console.jsm', {}).console;

module.exports = {
    log: (msg) => {
        dump('>>>' + msg + '\n');
        console.log('>>>' + msg);
    }
};
