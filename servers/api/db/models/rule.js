'use strict';

var db = require('../db');
var Hits = require('./hits');

var Rule = db.define('Rule', {
    url: {type: db.st.STRING},
    type: {type: db.st.STRING},
    hits: {type: db.st.INTEGER}
});

Rule.hasMany(Hits);

module.exports = Rule;
