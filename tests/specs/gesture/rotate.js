/**
 * test rotate gesture by simulating touch event for ios/android
 * @author yiminghe@gmail.com
 */

var UA = require('ua');
var Feature = require('feature');
if (UA.phantomjs || !Feature.isTouchEventSupported()) {
    return;
}

var Event = require('event-dom');
var RotateType = require('event-dom/gesture/rotate');
var ROTATE = RotateType.ROTATE;
var ROTATE_START = RotateType.ROTATE_START;
var ROTATE_END = RotateType.ROTATE_END;
var step = 10;

describe('rotate', function () {
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
        var rotateCalled = 0,
            angle,
            rotation,
            endX = 150,
            endY = 100,
            startX = 100,
            startY = 50,
            rotateStartCalled = 0,
            rotateEndCalled = 0;

        Event.on(t[0], ROTATE_START, function (e) {
            var touches = e.touches;

            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(startX);
            expect(touches[1].pageY).to.be(startY);
            expect(e.angle).to.be(-90);
            expect(e.rotation).to.be(0);
            rotateStartCalled = 1;
        });

        Event.on(t[0], ROTATE, function (e) {
            rotateCalled = 1;
            angle = e.angle;
            rotation = e.rotation;
//                    console.log('rotate ........');
//                    console.log(angle);
//                    console.log(rotation);
        });

        Event.on(t[0], ROTATE_END, function (e) {
            var touches = e.touches;
            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(endX);
            expect(touches[1].pageY).to.be(endY);
            rotateEndCalled = 1;
        });

        var touches1 = [
            {
                pageX: startX,
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

        var tasks = [
            runs(function () {
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
                expect(rotateStartCalled).to.be(0);
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
                expect(rotateStartCalled).to.be(1);
            })
        ];

        function move(i) {
            return function () {
                touches[1].pageX = startX + (endX - startX) / step * i;

                touches[1].pageY = startY + (endY - startY) / step * i;

//                            console.log(touches[1].pageX);
//                            console.log(touches[1].pageY);
//                            console.log(touches[1].target.id);

                simulateEvent(t1[0], 'touchmove', {
                    touches: touches,
                    changedTouches: touches1,
                    targetTouches: touches1
                });
            };
        }

        for (var i = 0; i < step; i++) {
            tasks.push(waits(30));
            tasks.push(runs(move(i)));
        }

        tasks.push(waits(30));

        tasks.push(runs(function () {
            touches[1].pageX = endX;
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
            expect(rotateCalled).to.be(1);
            expect(rotateStartCalled).to.be(1);
            expect(rotateEndCalled).to.be(1);
            expect(angle).to.be(-45);
            expect(rotation).to.be(45);
        }));

        async.series(tasks, done);
    });

    it('fire resizeEnd when one touch leaves', function (done) {
        var rotateCalled,
            angle,
            rotation,
            endX = 150,
            endY = 100,
            startX = 100,
            startY = 50,
            rotateStartCalled,
            rotateEndCalled;

        Event.on(t[0], ROTATE_START, function (e) {
            var touches = e.touches;
            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(startX);
            expect(touches[1].pageY).to.be(startY);
            expect(e.angle).to.be(-90);
            expect(e.rotation).to.be(0);
            rotateStartCalled = 1;
        });

        Event.on(t[0], ROTATE, function (e) {
            rotateCalled = 1;
            angle = e.angle;
            rotation = e.rotation;
        });

        Event.on(t[0], ROTATE_END, function (e) {
            var touches = e.touches;
            expect(touches[0].pageX).to.be(100);
            expect(touches[0].pageY).to.be(150);
            expect(touches[1].pageX).to.be(endX);
            expect(touches[1].pageY).to.be(endY);
            rotateEndCalled = 1;
        });

        var touches1 = [
            {
                pageX: startX,
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

        var tasks = [
            runs(function () {
                simulateEvent(t2[0], 'touchstart', {
                    touches: touches2,
                    changedTouches: touches2,
                    targetTouches: touches2
                });
            }),

            waits(30),

            runs(function () {
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
            })];

        function move(i) {
            return function () {
                touches[1].pageX = startX + (endX - startX) / step * i;
                touches[1].pageY = startY + (endY - startY) / step * i;
                simulateEvent(t1[0], 'touchmove', {
                    touches: touches,
                    changedTouches: touches1,
                    targetTouches: touches1
                });
            };
        }

        for (var i = 0; i < step; i++) {
            tasks.push(waits(30));
            tasks.push(runs(move(i)));
        }

        tasks.push(waits(30));

        tasks.push(runs(function () {
            touches[1].pageX = endX;
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
        }));
        tasks.push(waits(30));
        tasks.push(runs(function () {
            expect(rotateCalled).to.be(1);
            expect(rotateStartCalled).to.be(1);
            expect(rotateEndCalled).to.be(1);
            expect(angle).to.be(-45);
            expect(rotation).to.be(45);
        }));
        async.series(tasks, done);
    });

    it('only fire at common ancestor node', function (done) {
        var rotateCalled = 0,
            endX = 150,
            endY = 100,
            startX = 100,
            startY = 50,
            nodes = t1.slice(),
            rotateStartCalled = 0,
            rotateEndCalled = 0;

        nodes = nodes.add(t2);
        var nodes_ = [];
        for (i = 0; i < nodes.length; i++) {
            nodes_.push(nodes[i]);
        }
        Event.on(nodes_, ROTATE_START, function () {
            rotateStartCalled++;
        });

        Event.on(nodes_, ROTATE, function () {
            rotateCalled++;
        });

        Event.on(nodes_, ROTATE_END, function () {
            rotateEndCalled++;
        });

        var touches1 = [
            {
                pageX: startX,
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

        var tasks = [

            runs(function () {
                // one touch
                simulateEvent(t2[0], 'touchstart', {
                    touches: touches2,
                    changedTouches: touches2,
                    targetTouches: touches2
                });
            }),

            waits(30),

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
            })];

        function move(i) {
            return function () {
                touches[1].pageX = startX + (endX - startX) / step * i;

                touches[1].pageY = startY + (endY - startY) / step * i;

                simulateEvent(t1[0], 'touchmove', {
                    touches: touches,
                    changedTouches: touches1,
                    targetTouches: touches1
                });
            };
        }

        for (var i = 0; i < step; i++) {
            tasks.push(waits(30));
            tasks.push(runs(move(i)));
        }

        tasks.push(waits(30));

        tasks.push(runs(function () {
            touches[1].pageX = endX;
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
            expect(rotateCalled).to.be(0);
            expect(rotateStartCalled).to.be(0);
            expect(rotateEndCalled).to.be(0);
        }));
        async.series(tasks, done);
    });
});