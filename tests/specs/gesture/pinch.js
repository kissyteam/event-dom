/**
 * test pinch gesture by simulating touch event for ios/android
 * @author yiminghe@gmail.com
 */

var UA = require('ua');
var Feature = require('feature');
if (UA.phantomjs || !Feature.isTouchEventSupported()) {
    return;
}

var Event = require('event-dom');
var PinchType = require('event-dom/gesture/pinch');
var PINCH = PinchType.PINCH;
var PINCH_START = PinchType.PINCH_START;
var PINCH_END = PinchType.PINCH_END;
var step = 10;

/*jshint loopfunc:true*/
describe('pinch', function () {
    var t, t1, t2;

    beforeEach(function () {
        window.scrollTo(0, 0);
        t = $('<div>' +
            '<div id="t1" style="border:1px solid red;' +
            'width:200px;' +
            'height:100px;"></div>' +
            '<div id="t2" style="border:1px solid red;' +
            'width:200px;' +
            'height:100px;"></div>' +
            '</div>').prependTo('body');

        t1 = $('#t1');
        t2 = $('#t2');
    });

    afterEach(function () {
        t.remove();
    });

    it('fires', function (done) {
        var pinchCalled = 0,
            scale,
            distance,
            endY = 100,
            startY = 50,
            pinchStartCalled = 0,
            pinchEndCalled = 0;

        Event.on(t[0], PINCH_START, function (e) {
            var touches = e.touches;

//                    console.log('pinchStart ........');
//                    console.log(touches[0].pageX);
//                    console.log(touches[0].pageY);
//                    console.log(touches[0].target.id);
//                    console.log(touches[1].pageX);
//                    console.log(touches[1].pageY);
//                    console.log(touches[1].target.id);
//                    console.log(e.distance);

            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(100);
            expect(touches[1].pageY).to.be(startY);
            expect(e.distance).to.be(100);
            pinchStartCalled = 1;
        });

        Event.on(t[0], PINCH, function (e) {
            pinchCalled = 1;
            scale = e.scale;
            distance = e.distance;
//                    console.log('pinch ........');
//                    console.log(scale);
//                    console.log(distance);
        });

        Event.on(t[0], PINCH_END, function (e) {
            var touches = e.touches;
            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(100);
            expect(touches[1].pageY).to.be(endY);
            pinchEndCalled = 1;
        });

        var touches1 = [
            {
                pageX: 100,
                pageY: startY,
                target: t1[0]
            }
        ];

        var touches2 = [
            {
                pageX: 100,
                pageY: 150,
                target: t2[0]
            }
        ];

        var touches = touches2.concat(touches1);

        var tasks = [];

        tasks = [runs(function () {
            // one touch
            simulateEvent(t2[0], 'touchstart', {
                touches: touches2,
                changedTouches: touches2,
                targetTouches: touches2
            });
        }),

            waits(30),

            runs(function () {
                // one touch does not start
                expect(pinchStartCalled).to.be(0);
            }),

            runs(function () {
                // two touch
                simulateEvent(t1[0], 'touchstart', {
                    touches: touches,
                    changedTouches: touches1,
                    targetTouches: touches1
                });
            }),

            waits(30),

            runs(function () {
                simulateEvent(t1[0], 'touchmove', {
                    touches: touches,
                    changedTouches: touches1,
                    targetTouches: touches1
                });
            }),

            waits(30),

            runs(function () {
                // two touch start
                expect(pinchStartCalled).to.be(1);
            })];

        for (var i = 0; i < step; i++) {

            tasks.push(waits(30));
            (function (i) {
                tasks.push(runs(function () {

                    touches[1].pageY = startY + (endY - startY) / step * i;

                    simulateEvent(t1[0], 'touchmove', {
                        touches: touches,
                        changedTouches: touches1,
                        targetTouches: touches1
                    });

                }));
            })(i);
        }

        tasks = tasks.concat([
            waits(30),

            runs(function () {
                touches[1].pageY = endY;

                simulateEvent(t1[0], 'touchmove', {
                    touches: touches,
                    changedTouches: touches1,
                    targetTouches: touches1
                });
            }),

            waits(30),

            runs(function () {
                simulateEvent(t1[0], 'touchend', {
                    touches: touches2,
                    changedTouches: touches1,
                    targetTouches: []
                });
                simulateEvent(t2[0], 'touchend', {
                    touches: [],
                    changedTouches: touches2,
                    targetTouches: []
                });
            }),
            waits(30),
            runs(function () {
                expect(pinchCalled).to.be(1);
                expect(pinchStartCalled).to.be(1);
                expect(pinchEndCalled).to.be(1);
                expect(scale).to.be(0.5);
                expect(distance).to.be(50);
            })]);

        async.series(tasks, done);
    });

    it('only fire at common ancestor node', function (done) {
        var pinchCalled = 0,
            endY = 100,
            startY = 50,
            nodes = t1.slice(),
            pinchStartCalled = 0,
            pinchEndCalled = 0;

        nodes = nodes.add(t2);

        var nodes_ = [];
        for (i = 0; i < nodes.length; i++) {
            nodes_.push(nodes[i]);
        }

        Event.on(nodes_, PINCH_START, function () {
            pinchStartCalled = 1;
        });

        Event.on(nodes_, PINCH, function () {
            pinchCalled = 1;
        });

        Event.on(nodes_, PINCH_END, function () {
            pinchEndCalled = 1;
        });

        var touches1 = [
            {
                pageX: 100,
                pageY: startY,
                target: t1[0]
            }
        ];

        var touches2 = [
            {
                pageX: 100,
                pageY: 150,
                target: t2[0]
            }
        ];

        var touches = touches2.concat(touches1);

        var tasks = [];

        tasks.push(runs(function () {
            // one touch
            simulateEvent(t2[0], 'touchstart', {
                touches: touches2,
                changedTouches: touches2,
                targetTouches: touches2
            });
        }));

        tasks.push(waits(30));

        tasks.push(runs(function () {
            // two touch
            simulateEvent(t1[0], 'touchstart', {
                touches: touches,
                changedTouches: touches1,
                targetTouches: touches1
            });
        }));

        tasks.push(waits(30));

        tasks.push(runs(function () {
            simulateEvent(t1[0], 'touchmove', {
                touches: touches,
                changedTouches: touches1,
                targetTouches: touches1
            });
        }));

        for (var i = 0; i < step; i++) {

            tasks.push(waits(30));
            (function (i) {
                tasks.push(runs(function () {

                    touches[1].pageY = startY + (endY - startY) / step * i;

//                            console.log(touches[1].pageX);
//                            console.log(touches[1].pageY);
//                            console.log(touches[1].target.id);

                    simulateEvent(t1[0], 'touchmove', {
                        touches: touches,
                        changedTouches: touches1,
                        targetTouches: touches1
                    });

                }));
            })(i);
        }

        tasks.push(waits(30));

        tasks.push(runs(function () {
            touches[1].pageY = endY;

            simulateEvent(t1[0], 'touchmove', {
                touches: touches,
                changedTouches: touches1,
                targetTouches: touches1
            });
        }));

        tasks.push(waits(30));

        tasks.push(runs(function () {
            simulateEvent(t1[0], 'touchend', {
                touches: touches2,
                changedTouches: touches1,
                targetTouches: []
            });
            simulateEvent(t2[0], 'touchend', {
                touches: [],
                changedTouches: touches2,
                targetTouches: []
            });
        }));
        tasks.push(waits(30));

        tasks.push(runs(function () {
            expect(pinchCalled).to.be(0);
            expect(pinchStartCalled).to.be(0);
            expect(pinchEndCalled).to.be(0);
        }));

        async.series(tasks, done);
    });

    it('fires pinchEnd when one touch leaves', function () {

        var pinchCalled = 0,
            scale,
            distance,
            endY = 100,
            startY = 50,
            pinchStartCalled = 0,
            pinchEndCalled = 0;

        Event.on(t[0], PINCH_START, function (e) {
            var touches = e.touches;

//                    console.log('pinchStart ........');
//                    console.log(touches[0].pageX);
//                    console.log(touches[0].pageY);
//                    console.log(touches[0].target.id);
//                    console.log(touches[1].pageX);
//                    console.log(touches[1].pageY);
//                    console.log(touches[1].target.id);
//                    console.log(e.distance);

            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(100);
            expect(touches[1].pageY).to.be(startY);
            expect(e.distance).to.be(100);
            pinchStartCalled = 1;
        });

        Event.on(t[0], 'pinch', function (e) {
            pinchCalled = 1;
            scale = e.scale;
            distance = e.distance;
//                    console.log('pinch ........');
//                    console.log(scale);
//                    console.log(distance);
        });

        Event.on(t[0], PINCH_END, function (e) {
            var touches = e.touches;
            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(100);
            expect(touches[1].pageY).to.be(endY);
            pinchEndCalled = 1;
        });

        var touches1 = [
            {
                pageX: 100,
                pageY: startY,
                target: t1[0]
            }
        ];

        var touches2 = [
            {
                pageX: 100,
                pageY: 150,
                target: t2[0]
            }
        ];

        var touches = touches2.concat(touches1);
        var tasks = [];

        runs(function () {
            // one touch
            simulateEvent(t2[0], 'touchstart', {
                touches: touches2,
                changedTouches: touches2,
                targetTouches: touches2
            });
        });

        waits(30);

        runs(function () {
            // one touch does not start
            expect(pinchStartCalled).to.be(0);
        });

        runs(function () {
            // two touch
            simulateEvent(t1[0], 'touchstart', {
                touches: touches,
                changedTouches: touches1,
                targetTouches: touches1
            });
        });

        waits(30);

        runs(function () {
            simulateEvent(t1[0], 'touchmove', {
                touches: touches,
                changedTouches: touches1,
                targetTouches: touches1
            });
        });

        waits(30);

        runs(function () {
            // two touch start
            expect(pinchStartCalled).to.be(1);
        });

        for (var i = 0; i < step; i++) {

            waits(30);
            (function (i) {
                runs(function () {

                    touches[1].pageY = startY + (endY - startY) / step * i;

//                            console.log(touches[1].pageX);
//                            console.log(touches[1].pageY);
//                            console.log(touches[1].target.id);

                    simulateEvent(t1[0], 'touchmove', {
                        touches: touches,
                        changedTouches: touches1,
                        targetTouches: touches1
                    });

                });
            })(i);
        }

        waits(30);

        runs(function () {
            touches[1].pageY = endY;

            simulateEvent(t1[0], 'touchmove', {
                touches: touches,
                changedTouches: touches1,
                targetTouches: touches1
            });
        });

        waits(30);

        runs(function () {
            simulateEvent(t1[0], 'touchend', {
                touches: touches2,
                changedTouches: touches1,
                targetTouches: []
            });
        });
        waits(30);
        runs(function () {
            expect(pinchCalled).to.be(1);
            expect(pinchStartCalled).to.be(1);
            expect(pinchEndCalled).to.be(1);
            expect(scale).to.be(0.5);
            expect(distance).to.be(50);
        });
    });
});