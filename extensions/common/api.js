'use strict';

var Request = require('specific/request');

var API_URL_TEMPLATE = 'http://localhost:3000/api/{version}/{method}?uid={uid}&token={token}';
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
        .replace('{method}', method)
        // TODO брать uid и token из storage
        .replace('{uid}', '1231')
        .replace('{token}', '9990da9c91b76eaacd9addfd3dbba36f');
}

module.exports = {
    post: function (options) {
        return makeApiCall('POST', createApiUrl(options.method), options);
    },
    get: function (options) {
        return makeApiCall('GET', createApiUrl(options.method), options);
    }
};
