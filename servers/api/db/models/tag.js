'use strict';

var sq = require('sequelize');

module.exports = [
    'tag',
    {
        type: {type: sq.STRING},
        name: {type: sq.STRING}
    }
];
