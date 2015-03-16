'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var Signal = require('./signal');

describe('Signal', function () {
    var signal;
    var addedHandler = sinon.spy();
    var removedHandler = sinon.spy();

    beforeEach(function () {
        addedHandler.reset();
        removedHandler.reset();
        signal = new Signal(addedHandler, removedHandler);
    });

    describe('has', function () {
        it('should be defined', function () {
            assert.isFunction(signal.has);
        });
    });

    describe('add', function () {
        testAddMethod('add');
    });

    describe('addOnce', function () {
        testAddMethod('addOnce');
    });

    function testAddMethod(addMethod) {
        var listener1;
        var listener2;
        var context;
        var priority;

        beforeEach(function () {
            listener1 = function () {};
            listener2 = function () {};
            context = {test:'test'};
            priority = 1;
        });

        it('should be defined', function () {
            assert.isFunction(signal[addMethod]);
        });

        it('should call addedHandler with isNew=true', function () {
            signal[addMethod](listener1, context, priority);

            assert.ok(addedHandler.calledOnce);
            assert.deepEqual(
                addedHandler.firstCall.args[0],
                {listener: listener1, context: context, priority: priority, isNew: true}
            );
        });

        it('should NOT call addedHandler with isNew=true twice', function () {
            signal[addMethod](listener1, context, priority);
            signal[addMethod](listener1, context, priority);

            assert.ok(addedHandler.calledOnce);
            assert.deepEqual(
                addedHandler.firstCall.args[0],
                {listener: listener1, context: context, priority: priority, isNew: true}
            );
        });

        it('should call addedHandler with isNew=false', function () {
            signal[addMethod](listener1, context, priority);
            signal[addMethod](listener2, context, priority);

            assert.ok(addedHandler.calledTwice);
            assert.deepEqual(
                addedHandler.secondCall.args[0],
                {listener: listener2, context: context, priority: priority, isNew: false}
            );
        });
    }

    describe('remove', function () {
        var listener1;
        var listener2;
        var context;
        var priority;

        beforeEach(function () {
            listener1 = function () {};
            listener2 = function () {};
            context = {test:'test'};
            priority = 1;
        });

        it('should bew defined', function () {
            assert.isFunction(signal.remove);
        });

        it('should call removedHandler with isLast=true', function () {
            signal.add(listener1, context, priority);
            signal.remove(listener1, context, priority);

            assert.ok(removedHandler.calledOnce);
            assert.deepEqual(
                removedHandler.firstCall.args[0],
                {listener: listener1, context: context, isLast: true}
            );
        });

        it('should NOT call removedHandler with isLast=true twice', function () {
            signal.add(listener1, context, priority);
            signal.remove(listener1, context, priority);
            signal.remove(listener1, context, priority);

            assert.ok(removedHandler.calledOnce);
            assert.deepEqual(
                removedHandler.firstCall.args[0],
                {listener: listener1, context: context, isLast: true}
            );
        });

        it('should call removedHandler with isLast=false', function () {
            signal.add(listener1, context, priority);
            signal.add(listener2, context, priority);
            signal.remove(listener1, context, priority);

            assert.ok(removedHandler.calledOnce);
            assert.deepEqual(
                removedHandler.firstCall.args[0],
                {listener: listener1, context: context, isLast: false}
            );
        });
    });

    describe('removeAll', function () {
        testRemoveAllMethods('removeAll');
    });

    describe('dispose', function () {
        testRemoveAllMethods('dispose');
    });

    function testRemoveAllMethods(method) {
        var listener1;
        var listener2;
        var context;
        var priority;

        beforeEach(function () {
            listener1 = function () {};
            listener2 = function () {};
            context = {test:'test'};
            priority = 1;
        });

        it('should bew defined', function () {
            assert.isFunction(signal[method]);
        });

        it('should remove all handlers', function () {
            signal.add(listener1, context, priority);
            signal.add(listener2, context, priority + 1); // +1 is for proper deleting sequence
            signal.add(listener2, context, priority); // this listeners should not be added
            signal[method]();

            assert.ok(removedHandler.calledTwice);
            assert.deepEqual(
                removedHandler.firstCall.args[0],
                {listener: listener1, context: context, isLast: false}
            );
            assert.deepEqual(
                removedHandler.secondCall.args[0],
                {listener: listener2, context: context, isLast: true}
            );
        });
    }

});
