'use strict';

var sq = require('sequelize');

module.exports = [
    'hits',
    {
        id: {type: sq.INTEGER, primaryKey: true, autoIncrement: true},
        count: {type: sq.INTEGER}
    }
];
