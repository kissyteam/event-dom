/**
 * test tap gesture by simulating touch event for ios/android
 * @author yiminghe@gmail.com
 */

var Event = require('event-dom');
var TapGesture = require('event-dom/gesture/tap');
var TAP = TapGesture.TAP;
var TAP_HOLD = TapGesture.TAP_HOLD;
var step = 10;

describe('tap', function () {

    function fireTap(t, touches, tasks) {
        var offset = t.offset();

        touches = touches || [
            {
                pageX: offset.left,
                pageY: offset.top
            }
        ];

        simulateEvent(t[0], 'touchstart', {
            touches: touches,
            changedTouches: touches,
            targetTouches: touches
        });

        tasks.push(waits(30));

        tasks.push(runs(function () {
            simulateEvent(t[0], 'touchend', {
                touches: [],
                changedTouches: touches,
                targetTouches: []
            });
        }));

        tasks.push(waits(30));
    }

    var t;

    beforeEach(function () {

        t = $('<div style="border:1px solid red;' +
            'width:100px;' +
            'height:100px;"></div>').prependTo('body');

    });

    afterEach(function () {
        t.remove();
    });

    it('fires and tapHold does not fire', function () {
        var called = 0;
        var tapHoldCalled = 0;

        var offset = t.offset();

        Event.on(t[0], TAP, function (e) {
            expect(e.pageX).to.be(offset.left);
            expect(e.pageY).to.be(offset.top);
            called = 1;
        });

        Event.on(t[0], TAP_HOLD, function () {
            tapHoldCalled = 1;
        });

        var tasks = [];
        fireTap(t, 0, tasks);

        tasks.push(runs(function () {
            expect(called).to.be(1);
            expect(tapHoldCalled).to.be(0);
        }));

        async.series(tasks, done);
    });


    it('does not fire when touches number > 1', function () {
        var called = 0;

        Event.on(t[0], TAP, function () {
            called = 1;
        });
        var tasks = [];
        fireTap(t, [
            {
                pageX: 10,
                pageY: 10
            },
            {
                pageX: 15,
                pageY: 15
            }
        ], tasks);

        tasks.push(runs(function () {
            expect(called).to.be(0);
        }));

        async.series(tasks, done);
    });

    it('does not fire when touchmove occurs', function () {
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

    it('can preventDefault', function () {
        var a = $('<a href="#tap_forward">tap_forward</a>')
            .appendTo('body');

        Event.on(a[0], TAP, function (e) {
            e.preventDefault();
        });
        var tasks = [];
        fireTap(a);

        tasks.push(runs(function () {
            expect(location.hash.indexOf('tap_forward')).to.be(-1);
        }));

        async.series(tasks, done);
    });

});

