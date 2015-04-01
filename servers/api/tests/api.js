'use strict';

var mocha = require('mocha');
var supertest = require('supertest');
var config = require('../../config');
var md5 = require('MD5');
var db = require('../db');
var Q = require('q');

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

    describe('rules/', function () {
        it('new user has two rules', function (done) {
            registerUser()
                .then(function (user) {
                    return user.requestApi('rules');
                })
                .then(function (rules) {
                    if (rules.navigation.length === 2
                        && rules.dom.length === 0
                        && rules.bookmarks.length === 0) {
                        done();
                        return;
                    }

                    done(new Error('wrong rules length'));
                });
        });

        it('new user has no achievements', function (done) {
            registerUser()
                .then(function (user) {
                    return user.requestApi('achievements');
                })
                .then(function (achievements) {
                    if (achievements.length === 0) {
                        done();
                        return;
                    }

                    done(new Error('wrong achievements length'));
                });
        });
    });

    function TestUser(userData) {
        this._raw = userData;
    }

    TestUser.prototype = {
        get uid() {
            return this._raw.uid;
        },

        get id() {
            return this._raw.uid;
        },

        get salt() {
            return this._raw.salt;
        },

        requestApi: function (methodName) {
            var deferred = Q.defer();

            makeRequest()
                .get(url(methodName, this.uid, token(methodName, {
                    id: this.uid,
                    salt: this.salt
                })))
                .end(function (err, res) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    deferred.resolve(res.body[methodName]);
                });

            return deferred.promise;
        },

        dumpData: function (trackData) {
            var achievements = require('../achievements');

            return achievements.trackDump(this.uid, trackData);
        }
    };

    function registerUser() {
        var deferred = Q.defer();

        makeRequest()
            .get(url('whoami', null, md5(config.tokens.whoami)))
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                var userData = res.body.whoami;

                if (!userData.uid || !userData.salt) {
                    deferred.reject('invalid server data');
                    return;
                }

                deferred.resolve(new TestUser(userData));
            });

        return deferred.promise;
    }

    describe('difficult cases', function () {
        it('register and reach 2 achievements', function (done) {
            function onFail(err) {
                done(err);
                throw err;
            }

            var semiTrackData = {};
            var trackData = {};

            registerUser()
                .then(function (user) {
                    return user.requestApi('rules')
                        .then(function (rules) {
                            var navRules = rules.navigation;

                            navRules.forEach(function (rule) {
                                semiTrackData[rule.rule_id] = rule.hits / 2;
                                trackData[rule.rule_id] = rule.hits;
                            });

                            return user.requestApi('achievements');
                        })
                        .then(function (achievements) {
                            if (achievements.length !== 0) {
                                done(new Error('achievements.length = ' + achievements.length));
                                return;
                            }

                            return user.dumpData(semiTrackData);
                        })
                        .then(function () {
                            return user.requestApi('achievements');
                        })
                        .then(function (achievements) {
                            if (achievements.length !== 0) {
                                done(new Error('achievements.length = ' + achievements.length));
                                return;
                            }

                            return user.dumpData(semiTrackData);
                        })
                        .then(function () {
                            return user.requestApi('achievements').then(function (achievements) {
                                if (achievements.length !== 2) {
                                    done(new Error('user should have 2 achievements'));
                                    return;
                                }

                                done();
                            });
                        })
                        .fail(onFail);
                })
                .fail(onFail);
        });

        it('register and reach 1 achievement', function (done) {
            function onFail(err) {
                done(err);
                throw err;
            }

            var semiTrackData = {};
            var trackData = {};

            registerUser()
                .then(function (user) {
                    return user.requestApi('rules')
                        .then(function (rules) {
                            var navRules = rules.navigation.slice();

                            navRules.splice(0, 1).forEach(function (rule) {
                                semiTrackData[rule.rule_id] = rule.hits / 2;
                                trackData[rule.rule_id] = rule.hits;
                            });

                            return user.requestApi('achievements');
                        })
                        .then(function (achievements) {
                            if (achievements.length !== 0) {
                                done(new Error('achievements.length = ' + achievements.length));
                                return;
                            }

                            return user.dumpData(semiTrackData);
                        })
                        .then(function () {
                            return user.requestApi('achievements');
                        })
                        .then(function (achievements) {
                            if (achievements.length !== 0) {
                                done(new Error('achievements.length = ' + achievements.length));
                                return;
                            }

                            return user.dumpData(semiTrackData);
                        })
                        .then(function () {
                            return user.requestApi('achievements').then(function (achievements) {
                                if (achievements.length !== 1) {
                                    done(new Error('user should have 1 achievement'));
                                    return;
                                }

                                done();
                            });
                        })
                        .fail(onFail);
                })
                .fail(onFail);
        });
    });
};
