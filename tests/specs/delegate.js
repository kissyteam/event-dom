/**
 * @module  delegation-spec
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var Event = require('event-dom');
var DomEventUtils = Event.Utils;

var tpl = '';

$.ajax({
    url: './specs/delegate.html',
    async: false,
    success: function (d) {
        tpl = d;
    }
});

beforeEach(function () {
    Dom.prepend(Dom.create(tpl), 'body');
});

afterEach(function () {
    Dom.remove('#event-test-data');
});

describe('delegate', function () {
    it('should invoke correctly', function (done) {
        var ret = [];

        function test(e) {
            ret.push(e.target.id);
            ret.push(e.currentTarget.id);
            ret.push(this.id);
        }

        Event.delegate(Dom.get('#test-delegate'), 'click', '.xx', test);
        var a = Dom.get('#test-delegate-a');
        var b = Dom.get('#test-delegate-b');
        // support native dom event
        simulateEvent(a, 'click', {
            which: 1
        });
        var time = Date.now();
        async.series([
            waits(1000),
            runs(function () {
                expect(ret).to.eql([a.id,
                    'test-delegate-inner',
                    'test-delegate',
                    a.id,
                    'test-delegate-outer',
                    'test-delegate'
                ]);
            }),
            runs(function () {
                ret = [];
                // support simulated event
                Event.fire(b, 'click', {
                    which: 1
                });
            }),
            waits(10),
            runs(function () {
                expect(ret).to.eql([b.id,
                    'test-delegate-inner',
                    'test-delegate',
                    b.id,
                    'test-delegate-outer',
                    'test-delegate'
                ]);
            }),
            runs(function () {
                Event.undelegate(Dom.get('#test-delegate'), 'click', '.xx', test);
                ret = [];
                // support simulated event
                Event.fire(b, 'click', {
                    which: 1
                });
            }),
            waits(10),
            runs(function () {
                expect(ret).to.eql([]);
                var eventDesc = DomEventUtils.data(Dom.get('#test-delegate'), undefined, false);
                expect(eventDesc).to.be(undefined);
            })
        ], done);
    });

    it('should stop propagation correctly', function (done) {
        var ret = [];

        function test(e) {
            ret.push(e.target.id);
            ret.push(e.currentTarget.id);
            ret.push(this.id);
            e.stopPropagation();
        }

        Event.delegate(Dom.get('#test-delegate'), 'click', '.xx', test);
        var a = Dom.get('#test-delegate-b');
        // support native dom event
        simulateEvent(a, 'click');
        async.series([
            waits(10),
            runs(function () {
                expect(ret + '').to.be([a.id,
                    'test-delegate-inner',
                    'test-delegate'
                ] + '');
            }),
            waits(10),
            runs(function () {
                expect(ret + '').to.be([a.id,
                    'test-delegate-inner',
                    'test-delegate'
                ] + '');
            }),
            runs(function () {
                Event.undelegate(Dom.get('#test-delegate'), 'click', '.xx', test);
                ret = [];
                // support simulated event
                Event.fire(a, 'click');
            }),
            waits(10),
            runs(function () {
                expect(ret + '').to.be([] + '');
                var eventDesc = DomEventUtils.data(Dom.get('#test-delegate'), undefined, false);
                expect(eventDesc).to.be(undefined);
            })
        ], done);
    });

    it('should prevent default correctly', function (done) {
        var ret = [];

        function test(e) {
            ret.push(e.target.id);
            ret.push(e.currentTarget.id);
            ret.push(this.id);
        }

        Event.delegate(Dom.get('#test-delegate'), 'click', '.xx', test);
        var a = Dom.get('#test-delegate-b');
        // support native dom event

        Event.fire(a, 'click');

        setTimeout(function () {
            expect(ret + '').to.be([a.id,
                'test-delegate-inner',
                'test-delegate',
                a.id,
                'test-delegate-outer',
                'test-delegate'
            ] + '');
            done();
        }, 10);
    });

    it('should undelegate properly', function (done) {
        var d = Dom.create('<div><button>xxxx</button></div>');
        document.body.appendChild(d);
        var s = Dom.get('button', d);
        var ret = [];
        Event.on(d, 'click', function () {
            ret.push(9);
        });
        function t() {
            ret.push(1);
        }

        Event.delegate(d, 'click', 'button', t);

        simulateEvent(s, 'click');

        async.series([
            waits(10),
            runs(function () {
                expect(ret).to.eql([1, 9]);
                ret = [];
            }),
            runs(function () {
                Event.undelegate(d, 'click', 'button', t);
                simulateEvent(s, 'click');
            }),
            waits(10),
            runs(function () {
                expect(ret).to.eql([9]);
            }),
            runs(function () {
                ret = [];
                Event.delegate(d, 'click', 'button', t);
                Event.undelegate(d, 'click', 'button');
                simulateEvent(s, 'click');
            }),
            waits(10),
            runs(function () {
                expect(ret).to.eql([9]);
            }),
            runs(function () {
                ret = [];
                Event.delegate(d, 'click', 'button', t);
                Event.undelegate(d, 'click');
                simulateEvent(s, 'click');
            }),
            waits(10),
            runs(function () {
                expect(ret).to.eql([9]);
                Dom.remove(d);
            })
        ], done);
    });
});