'use strict';

var db = require('../db');
var Hits = require('./hits');

var User = db.define('User', {
    salt: {type: db.st.STRING},
    name: {type: db.st.STRING, allowNull: false},

    twitterID: {type: db.st.STRING, unique: true},
    twitterData: {type: db.st.JSON},

    facebookID: {type: db.st.STRING, unique: true},
    facebookData: {type: db.st.JSON},

    githubID: {type: db.st.STRING, unique: true},
    githubData: {type: db.st.JSON}
});

User.hasMany(Hits);

module.exports = User;
