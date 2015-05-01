'use strict';

var sq = require('sequelize');

module.exports = [
    'rule',
    {
        url: {type: sq.STRING},
        type: {type: sq.STRING},
        aim: {type: sq.INTEGER}
    }
];
