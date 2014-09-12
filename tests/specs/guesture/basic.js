/**
 * tc for cross platform move gesture
 * @author yiminghe@gmail.com
 */

var UA = require('ua');
var Event = require('event-dom');
var BasicGesture = require('event-dom/gesture/basic');
var Feature = require('feature');
describe('base gesture', function () {
    if (!UA.ios && UA.ieMode >= 10) {
        it('works for mouse', function (done) {
            var d = $('<div style="position:absolute;left:0;top:0;width: 100px;height: 100px"></div>');
            d.appendTo(document.body);
            var doc = $(document);
            var start = 0;
            var move = 0;
            var end = 0;

            Event.on(doc, BasicGesture.START, function (e) {
                expect(e.gestureType || 'mouse').to.be('mouse');
                start = 1;
                expect(e.touches.length).to.be(1);
                expect(e.touches[0].pageX).to.be(10);
                expect(e.touches[0].pageY).to.be(10);
                expect(e.pageX).to.be(10);
                expect(e.pageY).to.be(10);
            });

            Event.on(doc, BasicGesture.MOVE, function (e) {
                expect(e.touches.length).to.be(1);
                expect(e.gestureType || 'mouse').to.be('mouse');
                move = 1;
                expect(e.touches[0].pageX).to.be(16);
                expect(e.touches[0].pageY).to.be(16);
                expect(e.pageX).to.be(16);
                expect(e.pageY).to.be(16);
            });

            Event.on(doc, BasicGesture.END, function (e) {
                expect(e.touches.length).to.be(0);
                expect(e.changedTouches.length).to.be(1);
                expect(e.gestureType || 'mouse').to.be('mouse');
                end = 1;
                expect(e.changedTouches[0].pageX).to.be(16);
                expect(e.changedTouches[0].pageY).to.be(16);
                expect(e.pageX).to.be(16);
                expect(e.pageY).to.be(16);
            });

            async.series([
                runs(function () {
                    simulateEvent(d[0], 'mousedown', {
                        clientX: 10,
                        clientY: 10
                    });
                }),

                waits(100),
                runs(function () {
                    simulateEvent(document, 'mousemove', {
                        clientX: 16,
                        clientY: 16
                    });
                }),

                waits(100),
                runs(function () {
                    simulateEvent(document, 'mousemove', {
                        clientX: 16,
                        clientY: 16
                    });
                }),

                waits(300),
                runs(function () {
                    simulateEvent(document, 'mouseup', {
                        clientX: 16,
                        clientY: 16
                    });
                }),

                waits(300),
                runs(function () {
                    expect(start).to.be(1);
                    expect(move).to.be(1);
                    expect(end).to.be(1);
                    d.remove();
                    doc.detach();
                })], done);
        });
    }

    if (Feature.isTouchEventSupported()) {
        it('works for touch events', function (done) {
            var d = $('<div style="position:absolute;left:0;top:0;width: 100px;height: 100px"></div>');
            d.appendTo(document.body);
            var start = 0;
            var move = 0;
            var end = 0;

            Event.on(d, BasicGesture.START, function (e) {
                expect(e.gestureType).to.be('touch');
                start = 1;
                expect(e.touches.length).to.be(2);
                expect(e.touches[0].pageX).to.be(10);
                expect(e.touches[0].pageY).to.be(10);
                expect(e.touches[1].pageX).to.be(11);
                expect(e.touches[1].pageX).to.be(11);

            });
            Event.on(d, BasicGesture.MOVE, function (e) {
                expect(e.gestureType).to.be('touch');
                move = 1;
                expect(e.touches.length).to.be(2);
                expect(e.touches[0].pageX).to.be(16);
                expect(e.touches[0].pageY).to.be(16);
                expect(e.touches[1].pageX).to.be(26);
                expect(e.touches[1].pageX).to.be(26);
            });

            Event.on(d, BasicGesture.END, function (e) {
                expect(e.gestureType).to.be('touch');
                end = 1;
                expect(e.touches.length).to.be(1);
                expect(e.changedTouches.length).to.be(1);
                expect(e.changedTouches[0].pageX).to.be(16);
                expect(e.changedTouches[0].pageY).to.be(16);
                expect(e.touches[0].pageX).to.be(26);
                expect(e.touches[0].pageX).to.be(26);
            });
            async.series([runs(function () {
                simulateEvent(d[0], 'touchstart', {
                    touches: [
                        {
                            pageX: 10,
                            pageY: 10
                        },
                        {
                            pageX: 11,
                            pageY: 11
                        }
                    ],
                    changedTouches: [
                        {
                            pageX: 10,
                            pageY: 10
                        },
                        {
                            pageX: 11,
                            pageY: 11
                        }
                    ],
                    targetTouches: [
                        {
                            pageX: 10,
                            pageY: 10
                        },
                        {
                            pageX: 11,
                            pageY: 11
                        }
                    ]
                });
            }),

            waits(100),
            runs(function () {
                simulateEvent(d[0], 'touchmove', {
                    touches: [
                        {
                            pageX: 16,
                            pageY: 16
                        },
                        {
                            pageX: 26,
                            pageY: 26
                        }
                    ],
                    changedTouches: [
                        {
                            pageX: 16,
                            pageY: 16
                        },
                        {
                            pageX: 26,
                            pageY: 26
                        }
                    ],
                    targetTouches: [
                        {
                            pageX: 16,
                            pageY: 16
                        },
                        {
                            pageX: 26,
                            pageY: 26
                        }
                    ]
                });
            }),

            waits(300),
            runs(function () {
                simulateEvent(d[0], 'touchend', {
                    touches: [
                        {
                            pageX: 26,
                            pageY: 26
                        }
                    ],
                    changedTouches: [
                        {
                            pageX: 16,
                            pageY: 16
                        }
                    ],
                    targetTouches: [
                        {
                            pageX: 26,
                            pageY: 26
                        }
                    ]
                });
            }),

            waits(300),
            runs(function () {
                expect(start).to.be(1);
                expect(move).to.be(1);
                expect(end).to.be(1);
                d.remove();
            })],done);
        });
    }
});