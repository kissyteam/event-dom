/**
 * test tap hold by simulating touch event for ios/android
 * @author yiminghe@gmail.com
 */

var Event = require('event-dom');
var TapGesture = require('event-dom/gesture/tap');
var TAP = TapGesture.TAP;
var TAP_HOLD = TapGesture.TAP_HOLD;
var SINGLE_TAP = TapGesture.SINGLE_TAP;
var DOUBLE_TAP = TapGesture.DOUBLE_TAP;
var step = 10;

describe('tapHold', function () {
    var t, delay = 1500;

    beforeEach(function () {
        window.scrollTo(0, 0);
        t = $('<div style="border:1px solid red;' +
            'width:100px;' +
            'height:100px;"></div>').prependTo('body');
    });

    afterEach(function () {
        t.remove();
    });

    it('fires and tap does not fire', function (done) {
        var called = 0;
        var tapCalled = 0;

        Event.on(t[0], 'tapHold', function (e) {
            expect(e.pageX).to.be(10);
            expect(e.pageY).to.be(10);
            called = 1;
        });

        Event.on(t[0], [TAP, SINGLE_TAP, DOUBLE_TAP], function (e) {
            tapCalled = e.type;
        });

        var touches = [
            {
                pageX: 10,
                pageY: 10
            }
        ];

        simulateEvent(t[0], 'touchstart', {
            touches: touches,
            changedTouches: touches,
            targetTouches: touches
        });

        async.series([waits(delay),

            runs(function () {

                simulateEvent(t[0], 'touchend', {
                    touches: [],
                    changedTouches: touches,
                    targetTouches: []
                });

            }),

            waits(30),

            runs(function () {
                expect(called).to.be(1);
                expect(tapCalled).to.be(0);
            })], done);
    });

    it('does not fire when touches number > 1', function (done) {
        var called = 0;

        Event.on(t[0], TAP_HOLD, function () {
            called = 1;
        });

        var touches = [
            {
                pageX: 10,
                pageY: 10
            },
            {
                pageX: 15,
                pageY: 15
            }
        ];

        simulateEvent(t[0], 'touchstart', {
            touches: touches,
            changedTouches: touches,
            targetTouches: touches
        });

        async.series([
            waits(30),

            runs(function () {

                simulateEvent(t[0], 'touchend', {
                    touches: [],
                    changedTouches: touches,
                    targetTouches: []
                });

            }),

            waits(30),

            runs(function () {
                expect(called).to.be(0);
            })
        ], done);
    });

    it('does not fire when touchmove occurs', function (done) {
        var called = 0;

        Event.on(t[0], TAP_HOLD, function () {
            called = 1;
        });

        var touches = [
            {
                pageX: 10,
                pageY: 10
            }
        ];

        simulateEvent(t[0], 'touchstart', {
            touches: touches,
            changedTouches: touches,
            targetTouches: touches
        });

        function move() {
            touches[0].pageX = touches[0].pageY = 10 + (Math.random() * 20);
            simulateEvent(t[0], 'touchmove', {
                touches: touches,
                changedTouches: touches,
                targetTouches: touches
            });
        }

        var tasks = [];

        for (var i = 0; i < step; i++) {

            tasks.push(waits(30));

            tasks.push(runs(move));

        }


        tasks.push(waits(30));

        tasks.push(runs(function () {
            simulateEvent(t[0], 'touchend', {
                touches: [],
                changedTouches: touches,
                targetTouches: []
            });
        }));

        tasks.push(waits(30));

        tasks.push(runs(function () {
            expect(called).to.be(0);
        }));

        async.series(tasks, done);
    });

    it('does not fire when duration < 1000', function () {
        var called = 0;

        Event.on(t[0], TAP_HOLD, function () {
            called = 1;
        });

        var touches = [
            {
                pageX: 10,
                pageY: 10
            }
        ];

        simulateEvent(t[0], 'touchstart', {
            touches: touches,
            changedTouches: touches,
            targetTouches: touches
        });

        async.series([waits(30),

            runs(function () {
                simulateEvent(t[0], 'touchend', {
                    touches: [],
                    changedTouches: touches,
                    targetTouches: []
                });
            }),

            waits(30),

            runs(function () {
                expect(called).to.be(0);
            })], done);
    });
});

