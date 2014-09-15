/**
 * input event spec
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var UA = require('ua');
var Event = require('event-dom');
/*jshint quotmark:false*/
describe("input event", function () {
    it("should works", function (done) {
        var newv;

        var input = Dom.create("<input/>");

        Dom.append(input, document.body);

        function handler() {
            newv = this.value;
        }

        Event.on(input, "input", handler);

        input.focus();

        async.series([

            waits(100),

            runs(function () {
                Dom.val(input, '1');
                simulateEvent(input, 'input');
            }),

            waits(100),

            runs(function () {
                expect(Dom.val(input)).to.be('1');
                expect(newv).to.be('1');
            }),

            runs(function () {
                Event.detach(input, "input", handler);
            }),

            waits(100),

            runs(function () {
                Dom.val(input, 10);
                simulateEvent(input, 'input');
            }),

            waits(100),

            runs(function () {
                expect(Dom.val(input)).to.be('10');
                expect(newv).to.be('1');
            }),

            runs(function () {
                Dom.remove(input);
            })
        ], done);
    });

    it('support bubble', function (done) {
        if (UA.ie && UA.ieMode < 9) {
            done();
            return;
        }

        var newv;

        var div = Dom.create("<div><input/></div>");

        Dom.append(div, document.body);

        var input = div.firstChild;

        function handler(e) {
            newv = e.target.value;
        }

        Event.on(div, "input", handler);

        input.focus();

        async.series([

            waits(100),

            runs(function () {
                Dom.val(input, 1);
                simulateEvent(input, 'input');
            }),

            waits(100),

            runs(function () {
                expect(Dom.val(input)).to.be('1');
                expect(newv).to.be('1');
            }),

            runs(function () {
                Event.detach(div, "input", handler);
            }),

            waits(100),

            runs(function () {
                Dom.val(input, 10);
                simulateEvent(input, 'input');
            }),

            waits(100),

            runs(function () {
                expect(Dom.val(input)).to.be('10');
                expect(newv).to.be('1');
            }),

            runs(function () {
                Dom.remove(div);
            })], done);
    });
});