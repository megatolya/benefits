'use strict';

var sq = require('sequelize');

module.exports = [
    'hits',
    {
        count: {type: sq.INTEGER}
    }
];
