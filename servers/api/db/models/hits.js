'use strict';

var db = require('../db');

var Hits = db.define('Hits', {
    hits: {type: db.st.INTEGER}
});

module.exports = Hits;
