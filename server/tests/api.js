'use strict';

var mocha = require('mocha');
var supertest = require('supertest');
var config = require('../config');
var md5 = require('MD5');
var db = require('../db');

module.exports = function (app) {
    function makeRequest() {
        return supertest(app);
    }

    function url(method, uid, token) {
        return '/api/v1/' + method + ('?token={token}&uid={uid}'
            .replace('{token}', token || '')
            .replace('{uid}', uid || ''));
    }

    function token(method, user) {
        return md5(user.id + '_' + user.salt + '_' + method);
    }

    describe('/whoami', function () {
        it('new user', function (done) {
            makeRequest()
                .get(url('whoami', null, md5(config.tokens.whoami)))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, done);
        });

        it('no token', function (done) {
            makeRequest()
                .get(url('whoami', null, null))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);
        });

        it('bad token', function (done) {
            makeRequest()
                .get(url('whoami', null, md5(Math.random())))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);
        });
    });

    describe('/achievements', function () {
        it('user has vk1 achievement', function (done) {
            db.users.get('uid2').then(function (user) {
                makeRequest()
                    .get(url('achievements', user.id, token('achievements', user)))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

                        var body = res.body;

                        if (body.achievements
                            && Array.isArray(body.achievements)
                            && body.achievements.length === 1
                            && body.achievements[0].id === 'vk1') {
                            done();
                        }

                        throw new Error('Bad response');
                    });
            }).fail(function (reason) {
                throw reason;
            });
        });

        it('user has no achievements', function (done) {
            db.users.get('uid1').then(function (user) {
                makeRequest()
                    .get(url('achievements', user.id, token('achievements', user)))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

                        var body = res.body;

                        if (body.achievements
                            && Array.isArray(body.achievements)
                            && body.achievements.length === 0) {
                            done();
                        }

                        throw new Error('Bad response');
                    });
            }).fail(function (reason) {
                throw reason;
            });
        });

        it('bad token', function (done) {
            db.users.get('uid1').then(function (user) {
                makeRequest()
                    .get(url('achievements', user.id, token('achievement', user)))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(403)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

                        var body = res.body;

                        if (body.errorCode === 403) {
                            done();
                            return;
                        }

                        throw new Error('Invalid error');
                    });
            }).fail(function (reason) {
                throw reason;
            });
        });

        it('not existing user', function (done) {
            db.users.get('ololo').then(function (user) {
                throw new Error('.then called');
            }).fail(function (reason) {
                makeRequest()
                    .get(url('achievements', 'ololo', token('achievement', {
                        salt: 'ololo',
                        id: 'ololo'
                    })))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(403)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

                        var body = res.body;

                        if (body.errorCode === 403) {
                            done();
                            return;
                        }

                        throw new Error('Not a error');
                    });
            });
        });
    });
};

