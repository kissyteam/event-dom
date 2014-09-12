/**
 * test swipe gesture by simulating touch event for ios/android
 * @author yiminghe@gmail.com
 */
(function () {
    var UA = require('ua');
    var Feature = require('feature');
    if (UA.phantomjs || !Feature.isTouchEventSupported()) {
        return;
    }
    var Event = require('event-dom');
    var SwipeType = require('event-dom/gesture/swipe');
    var SWIPE = SwipeType.SWIPE;
    /*jshint loopfunc:true*/
    var step = 10;
    describe('swipe', function () {
        var t;

        beforeEach(function () {
            t = $('<div style="' +
                '-webkit-user-drag:none;' +
                '-webkit-user-select:none;' +
                '-webkit-tap-highlight-color:rgba(0,0,0,0);' +
                '-webkit-touch-callout:none;' +
                '-webkit-touch-action:none;' +

                'border:1px solid red;' +
                'width:100px;' +
                'height:100px;"></div>').prependTo('body');
        });

        afterEach(function () {
            t.remove();
        });

        function swipe(p, done) {
            var tasks = tasks || [];
            var d = p === 'pageX' ? 'left' : 'up';
            var unchangedP = p === 'pageX' ? 'pageY' : 'pageX';
            var called = 0, start = 90, end = 10;

            Event.on(t[0], SWIPE, function (e) {
                expect(e[p]).to.be(end);
                expect(e[unchangedP]).to.be(start);
                expect(e.direction).to.be(d);
                expect(e.distance).to.be(start - end);
                called = 1;
            });

            var touches = [
                {
                    pageX: start,
                    pageY: start
                }
            ];

            simulateEvent(t[0], 'touchstart', {
                touches: touches,
                changedTouches: touches,
                targetTouches: touches
            });

            for (var i = 0; i < step; i++) {
                tasks.push(waits(30));

                (function (i) {
                    tasks.push(runs(function () {
                        touches[0][p] = start - (start - end) / step * i;
                        simulateEvent(t[0], 'touchmove', {
                            touches: touches,
                            changedTouches: touches,
                            targetTouches: touches
                        });

                    }));
                })(i);
            }

            tasks.push(waits(30));

            tasks.push(runs(function () {
                touches[0][p] = end;
                simulateEvent(t[0], 'touchmove', {
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

            tasks.push(waits(30));

            tasks.push(runs(function () {
                expect(called).to.be(1);
            }));
            async.series(tasks, done);
            return tasks;
        }

        // chrome emulate bug
        if (!UA.chrome) {
            it('fires vertical', function (done) {
                swipe('pageY', done);
            });
        }

        it('fires horizontal', function (done) {
            swipe('pageX', done);
        });


        it('will not fire if max offset > 35', function (done) {
            var called = 0, start = 90, end = 10;

            Event.on(t[0], 'swipe', function () {
                called = 1;
            });

            var touches = [
                {
                    pageX: start,
                    pageY: start
                }
            ];

            simulateEvent(t[0], 'touchstart', {
                touches: touches,
                changedTouches: touches,
                targetTouches: touches
            });

            var tasks = [];

            for (var i = 0; i < step; i++) {
                tasks.push(waits(30));
                (function (i) {
                    tasks.push(runs(function () {
                        touches[0].pageX = touches[0].pageY = start - (start - end) / step * i;
                        simulateEvent(t[0], 'touchmove', {
                            touches: touches,
                            changedTouches: touches,
                            targetTouches: touches
                        });

                    }));
                })(i);
            }

            tasks.push(waits(30));
            (function () {
                tasks.push(runs(function () {
                    touches[0].pageX = end;
                    simulateEvent(t[0], 'touchmove', {
                        touches: touches,
                        changedTouches: touches,
                        targetTouches: touches
                    });

                }));
            })();

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


        it('will not fire if min distance < 50', function (done) {
            var called = 0, start = 90, end = 80;

            Event.on(t[0], 'swipe', function () {
                called = 1;
            });

            var touches = [
                {
                    pageX: start,
                    pageY: start
                }
            ];

            simulateEvent(t[0], 'touchstart', {
                touches: touches,
                changedTouches: touches,
                targetTouches: touches
            });

            var tasks = [];
            for (var i = 0; i < step; i++) {
                tasks.push(waits(30));
                (function (i) {
                    tasks.push(runs(function () {
                        touches[0].pageX = touches[0].pageY = start - (start - end) / step * i;
                        simulateEvent(t[0], 'touchmove', {
                            touches: touches,
                            changedTouches: touches,
                            targetTouches: touches
                        });

                    }));
                })(i);
            }

            tasks.push(waits(30));
            (function () {
                tasks.push(runs(function () {
                    touches[0].pageX = end;
                    simulateEvent(t[0], 'touchmove', {
                        touches: touches,
                        changedTouches: touches,
                        targetTouches: touches
                    });

                }));
            })();

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

        it('does not fire if max duration > 1000', function (done) {
            var called = 0, start = 90, end = 10;

            Event.on(t[0], SWIPE, function () {
                called = 1;
            });

            var touches = [
                {
                    pageX: start,
                    pageY: start
                }
            ];

            simulateEvent(t[0], 'touchstart', {
                touches: touches,
                changedTouches: touches,
                targetTouches: touches
            });

            var tasks = [];

            for (var i = 0; i < step; i++) {
                tasks.push(waits(30));
                (function (i) {
                    tasks.push(runs(function () {
                        touches[0].pageY = start - (start - end) / step * i;
                        simulateEvent(t[0], 'touchmove', {
                            touches: touches,
                            changedTouches: touches,
                            targetTouches: touches
                        });

                    }));
                })(i);
            }

            tasks.push(waits(30));
            (function () {
                tasks.push(runs(function () {
                    touches[0].pageY = end;
                    simulateEvent(t[0], 'touchmove', {
                        touches: touches,
                        changedTouches: touches,
                        targetTouches: touches
                    });

                }));
            })();

            tasks.push(waits(1000));

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

        it('does not fire if touches.length > 1', function () {
            var called = 0, start = 90, end = 10;

            Event.on(t[0], SWIPE, function () {
                called = 1;
            });

            var touches = [
                {
                    pageX: start,
                    pageY: start
                },
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

            var tasks = [];

            for (var i = 0; i < step; i++) {
                tasks.push(waits(30));
                (function (i) {
                    tasks.push(runs(function () {
                        touches[0].pageY = start - (start - end) / step * i;
                        simulateEvent(t[0], 'touchmove', {
                            touches: touches,
                            changedTouches: touches,
                            targetTouches: touches
                        });

                    }));
                })(i);
            }

            tasks.push(waits(30));
            (function () {
                tasks.push(runs(function () {
                    touches[0].pageY = end;
                    simulateEvent(t[0], 'touchmove', {
                        touches: touches,
                        changedTouches: touches,
                        targetTouches: touches
                    });

                }));
            })();

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
    });
})();