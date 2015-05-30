'use strict';

var sq = require('sequelize');

module.exports = [
    'rule',
    {
        id: {type: sq.INTEGER, primaryKey: true, autoIncrement: true},
        url: {type: sq.STRING},
        type: {type: sq.STRING},
        field: {type: sq.STRING},
        aim: {type: sq.INTEGER}
    }
];
