module.exports = {
    //log: () => dump.apply(null, arguments)
    log: (msg) => {
        dump('>>>' + msg + '\n');
    }
};
