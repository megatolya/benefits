'use strict';

var Request = require('specific/request');

var API_URL_TEMPLATE = 'api/{version}/{method}';
var currentVersion = 'v1';

function makeApiCall(method, url, options) {
    return new Promise(function (resolve, reject) {
        var xhr = new Request();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('load', onApiResponse.bind(resolve, reject));
        xhr.addEventListener('error', reject);
        xhr.send(options.body);
    });
}

function onApiResponse(resolve, reject, data) {
    parseResponse(data.responseText)
        .then(handleBasicErrors)
        .then(resolve)
        .catch(reject);
}

function parseResponse(data) {
    return new Promise(function (resolve, reject) {
        var parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            reject(e);
            return;
        }
        resolve(parsedData);
    });
}

function handleBasicErrors(data) {
    return new Promise(function (resolve, reject) {
        // TODO catch real errors
        if (data.error === 'bad error') {
            reject(data.error);
        } else {
            resolve(data);
        }
    });
}

function createApiUrl(method) {
    return API_URL_TEMPLATE
        .replace('{version}', currentVersion)
        .replace('{method}', method);
}

module.exports = {
    post: function (options) {
        return makeApiCall('POST', createApiUrl(options.method), options);
    },
    get: function (options) {
        return makeApiCall('GET', createApiUrl(options.method), options);
    }
};
