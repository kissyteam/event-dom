/**
 * test doubleTap/singleTap gesture by simulating touch event for ios/android
 * @author yiminghe@gmail.com
 */

var TapType = require('event-dom/gesture/tap');
var DOUBLE_TAP = TapType.DOUBLE_TAP;
var SINGLE_TAP = TapType.SINGLE_TAP;
var step = 10;

describe('doubleTap/singleTap', function () {
    var t, delay = 500;

    beforeEach(function () {
        window.scrollTo(0, 0);
        t = $('<div style="border:1px solid red;' +
            'width:100px;' +
            'height:100px;"></div>').prependTo('body');
    });

    afterEach(function () {
        t.remove();
    });

    it('doubleTap fires,singleTap not fired', function (done) {
        var doubleCalled = 0, singleCalled = 0;

        Event.on(t[0], DOUBLE_TAP, function (e) {
            expect(e.pageX).to.be(20);
            expect(e.pageY).to.be(20);
            doubleCalled = 1;
        });

        Event.on(t[0], SINGLE_TAP, function () {
            singleCalled = 1;
        });

        var touches = [
            {
                pageX: 10,
                pageY: 10
            }
        ];

        async.series([
            runs(function () {
                simulateEvent(t[0], 'touchstart', {
                    touches: touches,
                    changedTouches: touches,
                    targetTouches: touches
                });
            }),

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
                touches[0].pageX = touches[0].pageY = 20;
                simulateEvent(t[0], 'touchstart', {
                    touches: touches,
                    changedTouches: touches,
                    targetTouches: touches
                });
            }),

            waits(30),

            runs(function () {
                simulateEvent(t[0], 'touchend', {
                    touches: [],
                    changedTouches: touches,
                    targetTouches: []
                });
            }),

            waits(delay),

            runs(function () {
                expect(doubleCalled).to.be(1);
                expect(singleCalled).to.be(0);
            })
        ], done);
    });

    it('doubleTap not fires,singleTap fired twice', function (done) {
        var doubleCalled = 0, singleCalled = 0;

        Event.on(t[0], DOUBLE_TAP, function () {
            doubleCalled++;
        });

        Event.on(t[0], SINGLE_TAP, function (e) {
            if (singleCalled) {
                expect(e.pageX).to.be(20);
                expect(e.pageY).to.be(20);
            } else {
                expect(e.pageX).to.be(10);
                expect(e.pageY).to.be(10);
            }
            singleCalled++;
        });

        var touches = [
            {
                pageX: 10,
                pageY: 10
            }
        ];

        var tasks=[];

        tasks.push(runs(function () {
            simulateEvent(t[0], 'touchstart', {
                touches: touches,
                changedTouches: touches,
                targetTouches: touches
            });
        }));

        tasks.push( waits(30));

        tasks.push(runs(function () {
            simulateEvent(t[0], 'touchend', {
                touches: [],
                changedTouches: touches,
                targetTouches: []
            });
        }));

        tasks.push(waits(delay));

        tasks.push(runs(function () {
            touches[0].pageX = touches[0].pageY = 20;
            simulateEvent(t[0], 'touchstart', {
                touches: touches,
                changedTouches: touches,
                targetTouches: touches
            });
        }));

        tasks.push(waits(30));

        tasks.push(runs(function () {

            simulateEvent(t[0], 'touchend', {
                touches: [],
                changedTouches: touches,
                targetTouches: []
            });

        }));

        tasks.push(waits(delay));

        tasks.push(runs(function () {
            expect(doubleCalled).to.be(0);
            expect(singleCalled).to.be(2);
        }));
        async.series(tasks,done);
    });

    it('does not fire when touches number > 1', function (done) {
        var called = 0;

        Event.on(t[0], [SINGLE_TAP, DOUBLE_TAP], function () {
            called++;
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

        var tasks=[];

        tasks.push(waits(30));

        tasks.push(runs(function () {
            simulateEvent(t[0], 'touchend', {
                touches: [],
                changedTouches: touches,
                targetTouches: []
            });
        }));

        tasks.push(waits(delay));

        tasks.push(runs(function () {
            expect(called).to.be(0);
        }));

        async.series(tasks,done);
    });

    it('does not fire when touchmove occurs', function (done) {
        var called = 0;

        Event.on(t[0], [SINGLE_TAP, DOUBLE_TAP], function () {
            called++;
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

        var tasks=[];

        for (var i = 0; i < step; i++) {
            tasks.push(waits(30));
            /*jshint loopfunc:true*/
            tasks.push(runs(function () {
                touches[0].pageX = touches[0].pageY = 10 + (Math.random() * 20);
                simulateEvent(t[0], 'touchmove', {
                    touches: touches,
                    changedTouches: touches,
                    targetTouches: touches
                });
            }));
        }

        tasks.push(waits(30));

        tasks.push(runs(function () {
            simulateEvent(t[0], 'touchend', {
                touches: [],
                changedTouches: touches,
                targetTouches: []
            });
        }));

        tasks.push(waits(delay));

        tasks.push( runs(function () {
            expect(called).to.be(0);
        }));

        async.series(tasks,done);
    });
});
