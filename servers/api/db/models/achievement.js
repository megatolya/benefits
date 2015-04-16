'use strict';

var db = require('../db');

// TODO add pretty id and logic for it
var Achievement = db.define('Achievement', {
    url: {type: db.st.STRING},
    title: {type: db.st.STRING, allowNull: false},
    descriptor: {type: db.st.TEXT},
    image: {type: db.st.STRING}
});

module.exports = Achievement;
