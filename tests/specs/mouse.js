/**
 * mouseenter tc
 * @author yiminghe@gmail.com
 */
var Dom = require('dom');
var Event = require('event-dom');
/*jshint quotmark:false*/
var simulate = function (target, type, relatedTarget) {
    if (typeof target === 'string') {
        target = Dom.get(target);
    }
    simulateEvent(target, type, { relatedTarget: relatedTarget });
};
var tpl = '';

$.ajax({
    url: './specs/mouse.html',
    async: false,
    success: function (d) {
        tpl = d;
    }
});

describe('mouseenter', function () {
    beforeEach(function () {
        Dom.prepend(Dom.create(tpl), 'body');
    });

    afterEach(function () {
        Dom.remove('#event-test-data');
    });

    describe('on simply works', function () {

        it('should trigger the mouseenter event on the proper element.', function (done) {
            var outer = Dom.get('#outer'),
                inner = Dom.get('#inner'),
                container = outer.parentNode;

            var outerCount = 0, innerCount = 0, type = 'mouseover';


            Event.on(outer, 'mouseenter', function (e) {
                outerCount++;
                setTimeout(function () {
                    // https://github.com/kissyteam/kissy/issues/302
                    expect(e.type).to.be('mouseover');
                }, 0);
            });

            Event.on(inner, 'mouseenter', function () {
                innerCount++;
            });

            // move mouse from the container element to the outer element once
            simulate(outer, type, container);

            // move mouse from the outer element to the inner element twice
            simulate(inner, type, outer);
            simulate(inner, type, outer);

            setTimeout(function () {
                expect(outerCount).to.eql(1);
                expect(innerCount).to.eql(2);
                done();
            }, 100);
        });

        it('should trigger the mouseleave event on the proper element.', function (done) {
            var outer = Dom.get('#outer'),
                inner = Dom.get('#inner'),
                container = outer.parentNode;

            var outerCount = 0, innerCount = 0, type = 'mouseout';

            Event.on(outer, 'mouseleave', function () {
                outerCount++;
            });
            Event.on(inner, 'mouseleave', function () {
                innerCount++;
            });

            // move mouse from the inner element to the outer element once
            simulate(inner, type, outer);

            // move mouse from the outer element to the container element
            simulate(outer, type, container);
            simulate(outer, type, outer.parentNode);

            setTimeout(function () {
                expect(outerCount).to.eql(2);
                expect(innerCount).to.eql(1);
                done();
            }, 0);
        });

        it('support multiple on for mouseenter', function (done) {
            var enter = [],
                leave = [],
                mouseTests = Dom.query('.mouse-test');

            Event.on('.mouse-test', 'mouseenter', function (e) {
                expect(e.type).to.be('mouseenter');
                enter.push(e.target.id);
            });

            Event.on('.mouse-test', 'mouseleave', function (e) {
                expect(e.type).to.be('mouseleave');
                leave.push(e.target.id);
            });

            simulate(mouseTests[0], 'mouseover', document);

            async.series([

                waits(10),

                runs(function () {
                    simulate(mouseTests[1], 'mouseover', document);
                }),

                waits(10),

                runs(function () {
                    simulate(mouseTests[0], 'mouseout', document);
                }),

                waits(10),

                runs(function () {
                    simulate(mouseTests[1], 'mouseout', document);
                }),

                waits(10),

                runs(function () {
                    expect(enter).to.eql(['mouse-test1', 'mouse-test2']);
                    expect(leave).to.eql(['mouse-test1', 'mouse-test2']);
                })
            ], done);
        });
    });

    describe('clone works', function () {
        it("can clone mouseenter", function (done) {
            var html = '<div class="t89561" id="t89561" style="width: 200px;height: 200px;border: 1px solid red;margin: 50px;">' +
                '<div class="t895612" style="width: 100px;height: 100px;border: 1px solid green;margin: 50px;">' +
                ' </div>' +
                ' </div>';

            Dom.append(Dom.create(html), document.body);

            var ret = [];

            Event.on("#t89561", 'mouseenter', function (e) {
                expect(e.type).to.be('mouseenter');
                ret.push(1);
            });

            var n;

            Dom.append(n = Dom.clone("#t89561", 1, 1, 1), document.body);

            n.id = "";

            Dom.remove(Dom.get("#t89561"));

            n.id = "t89561";

            var v = Dom.children("#t89561")[0];

            // 2012-03-31 bug : clone does not clone originalType
            // lose check
            simulate(n, 'mouseover', v);

            setTimeout(function () {
                expect(ret.length).to.be(0);

                Dom.remove('#t89561');
                done();
            }, 100);
        });
    });

    describe('delegate works', function () {

        it("should delegate mouseenter/leave properly", function (done) {
            var t = (+new Date());
            var code = "<div id='d1" + t + "' style='width:500px;height:500px;border:1px solid red;'>" +
                "<div id='d2" + t + "' class='t' style='width:300px;height:300px;margin:150px;border:1px solid green;'>" +
                "<div id='d3" + t + "' style='width:100px;height:100px;margin:150px;border:1px solid black;'>" +
                "</div>" +
                "</div>" +
                "</div>";
            Dom.append(Dom.create(code), document.body);
            var d1 = Dom.get("#d1" + t),
                d2 = Dom.get("#d2" + t),
                d3 = Dom.get("#d3" + t);

            t = "";
            var type = "";
            Event.delegate(d1, 'mouseenter', '.t', function (e) {
                type = e.type;
                t = e.target.id;
            });

            simulate(d1, 'mouseover', document);

            async.series([

                waits(100),

                runs(function () {
                    expect(t).to.be("");
                    expect(type).to.be("");
                    t = "";
                    type = "";
                    simulate(d2, 'mouseover', d1);
                }),


                waits(100),

                runs(function () {
                    expect(t).to.be(d2.id);
                    expect(type).to.be('mouseenter');
                    t = "";
                    type = "";
                    simulate(d3, 'mouseover', d2);
                }),

                waits(100),

                runs(function () {
                    expect(t).to.be("");
                    expect(type).to.be("");
                    Dom.remove(d1);
                })
            ], done);
        });
    });

    describe('fire', function () {
        it("works for mouseenter/leave", function () {

            var n = Dom.create("<div/>"), ret = 0;
            Event.on(n, 'mouseenter', function (e) {
                expect(e.type).to.be('mouseenter');
                ret = 1;
            });
            Event.fire(n, 'mouseenter', {
                relatedTarget: document
            });

            expect(ret).to.be(1);

            Event.detach(n);

        });
    });
});