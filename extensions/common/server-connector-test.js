'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var proxyQuire =  require('proxyquire');
var sessionData = require('common/session-data');
var sinonHelper = global.sinonHelper;

var sandbox = sinon.sandbox.create();

var requestStub = {
    open: sandbox.stub(),
    setRequestHeader: sandbox.stub(),
    addEventListener: sandbox.stub(),
    send: sandbox.stub()
};

var requestCreator = function () {
    return requestStub;
};

var serverConnector = proxyQuire('common/server-connector', {'specific/request': requestCreator});

describe('server-connector', function () {
    var testUid = 'uid';
    var testToken = 'token';
    var testBody = {bodyParam: 'bodyParamValue'};
    var testBodyString = JSON.stringify(testBody);
    var urlTemplate = 'http://localhost:3000/api/v1/{method}?uid={uid}&token={token}';

    after(function () {
        sandbox.restore();
    });

    describe('post', function () {
        describe('post request common logic', function () {
            checkCommonRequestLogic('post', 'POST', 'hello-test', testBodyString);
        });
    });

    describe('get', function () {
        describe('should send get request', function () {
            checkCommonRequestLogic('get', 'GET', 'hello-test', testBodyString);
        });
    });

    describe('whoami', function () {
        checkShortCutMethod('whoami', 'get');
    });

    describe('token', function () {
        checkShortCutMethod('token', 'get');
    });

    describe('rules', function () {
        checkShortCutMethod('rules', 'get');
    });

    describe('achievements', function () {
        checkShortCutMethod('achievements', 'get');
    });

    describe('dump', function () {
        checkShortCutMethod('dump', 'post');

        it('should pass body to post method', function () {
            var getStub = sandbox.stub(serverConnector, 'post');
            serverConnector.dump(testBody);
            assert.ok(getStub.calledOnce);
            assert.ok(getStub.calledWith('dump', testBody));
            getStub.restore();
        });
    });

    // todo добавить тесты на парсинг ответов, обработку ошибок,

    function checkShortCutMethod(shortCutMethod, methodToProxy) {
        it('should be defined', function () {
            assert.isFunction(serverConnector[shortCutMethod]);
        });
        it('should call ' + methodToProxy + ' method', function () {
            var getStub = sandbox.stub(serverConnector, methodToProxy);
            serverConnector[shortCutMethod]();
            assert.ok(getStub.calledOnce);
            assert.ok(getStub.calledWith(shortCutMethod));
            getStub.restore();
        });

    }
    function checkCommonRequestLogic(methodToTest, methodParam, urlParam, body) {
        before(function () {
            sandbox.stub(sessionData, 'getUID', function () {
                return testUid;
            });
            sandbox.stub(sessionData, 'getToken', function () {
                return testToken;
            });

            // test method (get/post)
            serverConnector[methodToTest]('hello-test', testBody);
        });
        after(function () {
            sandbox.restore();
            sinonHelper.resetStubsInObject(requestStub);
        });

        it('should be defined', function () {
            assert.isFunction(serverConnector.post);
        });
        it('should set content type', function () {
            assert.ok(requestStub.setRequestHeader.calledWith('Content-Type', 'application/json'));
        });
        it('should call open once', function () {
            assert.ok(requestStub.open.calledOnce);
        });
        it('should call open with right method and url', function () {
            var url = createUrl(urlParam, testUid, testToken);
            assert.ok(requestStub.open.calledWith(methodParam, url));
        });
        it('should call send once', function () {
            assert.ok(requestStub.send.calledOnce);
        });
        it('should send body', function () {
            assert.ok(requestStub.send.calledWith(body));
        });
    }

    function createUrl(method, uid, token) {
        return urlTemplate
            .replace('{uid}', uid)
            .replace('{token}', token)
            .replace('{method}', method);
    }

});
