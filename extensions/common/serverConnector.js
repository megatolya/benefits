'use strict';

var console = require('specific/console');
var Signal = require('common/signal');

var Request = require('specific/request');
var sessionData = require('common/sessionData');

var API_URL_TEMPLATE = 'http://localhost:3000/api/{version}/{method}?uid={uid}&token={token}';
var currentVersion = 'v1';

function makeApiCall(method, url, body) {
    return new Promise(function (resolve, reject) {
        var xhr = new Request();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('load', onApiResponse.bind(undefined, resolve, reject));
        xhr.addEventListener('error', reject);
        xhr.send(JSON.stringify(body));
    });
}

function onApiResponse(resolve, reject, event) {
    var target = event.target;
    if (!target || target.status > 400) {
        reject(target);
        return;
    }
    parseResponse(target.response)
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
        .replace('{uid}', sessionData.getUID())
        .replace('{token}', sessionData.getToken(method));
}

function handleResponse(response) {
    if (response) {
        serverConnector.updated.dispatch(response);
    }
    return response;
}

function logError(err) {
    console.log('err: ', err);
}

var serverConnector = {
    post: function (method, body) {
        var p = makeApiCall('POST', createApiUrl(method), body).then(handleResponse);
        p.catch(logError);
        return p;
    },

    get: function (method, body) {
        var p = makeApiCall('GET', createApiUrl(method), body).then(handleResponse);
        p.catch(logError);
        return p;
    },

    whoami: function () {
        return this.get('whoami');
    },

    token: function () {
        return this.get('token');
    },

    rules: function () {
        return this.get('rules');
    },

    achievements: function () {
        return this.get('achievements');
    },

    dump: function (body) {
        return this.post('dump', body);
    },

    updated: new Signal()
};

module.exports = serverConnector;
