/**
 * tc for edge-pan gesture
 */
(function () {
    var UA = require('ua');
    var Feature = require('feature');
    var Event = require('event-dom');
    if (UA.phantomjs || !Feature.isTouchEventSupported()) {
        return;
    }
    var EdgePanGesture = require('event-dom/gesture/edge-pan');
    var ie = UA.ieMode;
    if (ie === 9 || ie === 11) {
        return;
    }
    var win = $(window);

    var right = win.width();
    var bottom = win.height();

    describe('edge-pan gesture', function () {
        afterEach(function () {
            Event.detach(window);
        });

        describe('right direction', function () {
            it('works for right direction in boundary', function (done) {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    expect(e.direction).to.be('right');
                    start = 1;
                    expect(e.pageX).to.be(11);
                    expect(e.pageY).to.be(1);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    expect(e.direction).to.be('right');
                    move = 1;
                    expect(e.pageX).to.be(81);
                    expect(e.pageY).to.be(1);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    expect(e.direction).to.be('right');
                    end = 1;
                    expect(e.pageX).to.be(81);
                    expect(e.pageY).to.be(1);
                });

                async.series([runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ]
                    });
                }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 11,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 11,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 11,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 81,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 81,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 81,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: 81,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 81,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 81,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        expect(start).to.be(1);
                        expect(move).to.be(1);
                        expect(end).to.be(1);
                    })], done);
            });

            it('works for right direction out of boundary', function (done) {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    start = 1;
                    expect(e.pageX).to.be(11);
                    expect(e.pageY).to.be(11);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    move = 1;
                    expect(e.pageX).to.be(81);
                    expect(e.pageY).to.be(81);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    end = 1;
                    expect(e.pageX).to.be(81);
                    expect(e.pageY).to.be(81);
                });

                async.series([runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ]
                    });
                }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 61,
                                    pageY: 61
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 61,
                                    pageY: 61
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 61,
                                    pageY: 61
                                }
                            ]
                        });
                    }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 81,
                                    pageY: 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 81,
                                    pageY: 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 81,
                                    pageY: 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: 81,
                                    pageY: 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 81,
                                    pageY: 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 81,
                                    pageY: 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        expect(start).to.be(0);
                        expect(move).to.be(0);
                        expect(end).to.be(0);
                    })], done);
            });
        });

        describe('left direction', function (done) {
            it('works for left direction in boundary', function () {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    expect(e.direction).to.be('left');
                    start = 1;
                    expect(e.pageX).to.be(right - 11);
                    expect(e.pageY).to.be(1);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    expect(e.direction).to.be('left');
                    move = 1;
                    expect(e.pageX).to.be(right - 81);
                    expect(e.pageY).to.be(1);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    expect(e.direction).to.be('left');
                    end = 1;
                    expect(e.pageX).to.be(right - 81);
                    expect(e.pageY).to.be(1);
                });

                async.series([ runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: right - 1,
                                pageY: 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: right - 1,
                                pageY: 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: right - 1,
                                pageY: 1
                            }
                        ]
                    });
                }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: right - 11,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: right - 11,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: right - 11,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        expect(start).to.be(1);
                        expect(move).to.be(1);
                        expect(end).to.be(1);
                    })], done);
            });

            it('works for left direction out of boundary', function (done) {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    expect(e.direction).to.be('left');
                    start = 1;
                    expect(e.pageX).to.be(right - 11);
                    expect(e.pageY).to.be(1);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    expect(e.direction).to.be('left');
                    move = 1;
                    expect(e.pageX).to.be(right - 81);
                    expect(e.pageY).to.be(1);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    expect(e.direction).to.be('left');
                    end = 1;
                    expect(e.pageX).to.be(right - 81);
                    expect(e.pageY).to.be(1);
                });

                async.series([runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: right - 1,
                                pageY: 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: right - 1,
                                pageY: 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: right - 1,
                                pageY: 1
                            }
                        ]
                    });
                }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: right - 61,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: right - 61,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: right - 61,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: right - 81,
                                    pageY: 1
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        expect(start).to.be(0);
                        expect(move).to.be(0);
                        expect(end).to.be(0);
                    })], done);
            });
        });

        describe('down direction', function () {
            it('works for down direction in boundary', function (done) {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    expect(e.direction).to.be('down');
                    start = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(11);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    expect(e.direction).to.be('down');
                    move = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(81);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    expect(e.direction).to.be('down');
                    end = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(81);
                });

                async.series([runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ]
                    });
                }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: 11
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: 11
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: 11
                                }
                            ]
                        });
                    }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        expect(start).to.be(1);
                        expect(move).to.be(1);
                        expect(end).to.be(1);
                    })], done);
            });

            it('works for down direction out of boundary', function (done) {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    expect(e.direction).to.be('down');
                    start = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 11);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    expect(e.direction).to.be('down');
                    move = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 81);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    expect(e.direction).to.be('down');
                    end = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 81);
                });

                async.series([runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: 1,
                                pageY: 1
                            }
                        ]
                    });
                }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: 61
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: 61
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: 61
                                }
                            ]
                        });
                    }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        expect(start).to.be(0);
                        expect(move).to.be(0);
                        expect(end).to.be(0);
                    })], done);
            });
        });

        describe('up direction', function () {
            it('works for up direction in boundary', function (done) {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    expect(e.direction).to.be('up');
                    start = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 11);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    expect(e.direction).to.be('up');
                    move = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 81);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    expect(e.direction).to.be('up');
                    end = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 81);
                });

                async.series([runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: 1,
                                pageY: bottom - 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: 1,
                                pageY: bottom - 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: 1,
                                pageY: bottom - 1
                            }
                        ]
                    });
                }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 11
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 11
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 11
                                }
                            ]
                        });
                    }),

                    waits(100),
                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ]
                        });
                    }),

                    waits(300),
                    runs(function () {
                        expect(start).to.be(1);
                        expect(move).to.be(1);
                        expect(end).to.be(1);
                    })], done);
            });

            it('works for up direction out of boundary', function (done) {
                var start = 0;
                var move = 0;
                var end = 0;

                Event.on(window, EdgePanGesture.EDGE_PAN_START, function (e) {
                    expect(e.direction).to.be('down');
                    start = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 11);
                    e.preventDefault();
                });

                Event.on(window, EdgePanGesture.EDGE_PAN, function (e) {
                    expect(e.direction).to.be('down');
                    move = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 81);
                });

                Event.on(window, EdgePanGesture.EDGE_PAN_END, function (e) {
                    expect(e.direction).to.be('down');
                    end = 1;
                    expect(e.pageX).to.be(1);
                    expect(e.pageY).to.be(bottom - 81);
                });

                async.series([runs(function () {
                    simulateEvent(document, 'touchstart', {
                        touches: [
                            {
                                pageX: 1,
                                pageY: bottom - 1
                            }
                        ],
                        changedTouches: [
                            {
                                pageX: 1,
                                pageY: bottom - 1
                            }
                        ],
                        targetTouches: [
                            {
                                pageX: 1,
                                pageY: bottom - 1
                            }
                        ]
                    });
                }),

                    waits(100),

                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 61
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 61
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 61
                                }
                            ]
                        });
                    }),

                    waits(100),

                    runs(function () {
                        simulateEvent(document, 'touchmove', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ]
                        });
                    }),

                    waits(300),

                    runs(function () {
                        simulateEvent(document, 'touchend', {
                            touches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            changedTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ],
                            targetTouches: [
                                {
                                    pageX: 1,
                                    pageY: bottom - 81
                                }
                            ]
                        });
                    }),

                    waits(300),

                    runs(function () {
                        expect(start).to.be(0);
                        expect(move).to.be(0);
                        expect(end).to.be(0);
                    })], done);
            });
        });
    });
})();