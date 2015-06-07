'use strict';

var sq = require('sequelize');
var models = require('../models');

module.exports = [
    'certificate',
    {
        id: {type: sq.INTEGER, primaryKey: true, autoIncrement: true},
        used: {type: sq.INTEGER},
        uses: {type: sq.INTEGER},
        referer: {type: sq.STRING}
    },
    {
        classMethods: {},
        defaultScope: {},
        scopes: {}
    }
];
