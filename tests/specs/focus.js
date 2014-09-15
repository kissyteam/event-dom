/**
 * fire focus in correct order
 * @author yiminghe@gmail.com
 */

/*jshint quotmark:false*/
var Dom = require('dom');
var Event = require('event-dom');
var UA = require('ua');
describe('focus', function () {
    it('fire is special', function (done) {
        var n = Dom.create('<input />');
        Dom.append(n, 'body');
        var ret = 0;
        Event.on(n, 'focus', function () {
            ret++;
        });
        Event.fire(n, 'focus');
        async.series([
            waits(100),
            runs(function () {
                expect(ret).to.be(1);
                expect(document.activeElement).to.be(n);
                Event.fire(n, 'focus');
            }),
            waits(100),
            runs(function () {
                expect(ret).to.be(2);
                expect(document.activeElement).to.be(n);
                Dom.remove(n);
            })
        ], done);
    });

    it('fired in correct order', function (done) {
        if (UA.ie === 10) {
            done();
            return;
        }

        window.focus();
        document.body.focus();

        var outer = Dom.create("<div class='outer'>" +
            "<div class='inner'>" +
            "<input type='input'/>" +
            "</div>" +
            "</div>");

        Dom.append(outer, 'body');

        var inner = Dom.get('.inner', outer);
        var input = Dom.get('input', inner);

        var ret = [];

        Event.on(outer, 'focusin', function () {
            ret.push('outer');
        });

        Event.on(inner, 'focusin', function () {
            ret.push('inner');
        });

        Event.on(input, 'focusin', function () {
            ret.push('input focusin');
        });

        Event.on(input, 'focus', function () {
            ret.push('input focus');
        });

        input.focus();

        async.series([
            waits(400),
            runs(function () {
                expect(document.activeElement).to.be(input);
                expect(ret).to.eql(['input focusin', 'inner', 'outer', 'input focus']);
                ret = [];
            }),
            waits(400),
            runs(function () {
                Event.fire(input, 'focus');
            }),
            runs(function () {
                expect(document.activeElement).to.be(input);
                expect(ret).to.eql(['input focusin', 'inner', 'outer', 'input focus']);
                ret = [];
                Dom.remove(outer);
            })
        ], done);
    });

    it('fired handlers in correct order', function (done) {
        var outer = Dom.create("<div class='outer'>" +
            "<div class='inner'>" +
            "<input type='input'/>" +
            "</div>" +
            "</div>");

        Dom.append(outer, 'body');

        var inner = Dom.get('.inner', outer);
        var input = Dom.get('input', inner);

        var ret = [];

        Event.on(outer, 'focusin', function () {
            ret.push('outer');
        });

        Event.on(inner, 'focusin', function () {
            ret.push('inner');
        });

        Event.on(input, 'focusin', function () {
            ret.push('input focusin');
        });

        Event.on(input, 'focus', function () {
            ret.push('input focus');
        });

        document.body.focus();

        Event.fireHandler(input, 'focus');

        async.series([
            waits(100),
            runs(function () {
                expect(document.activeElement).not.to.be(input);
                expect(ret).to.eql(['input focus']);
                ret = [];
            }),
            waits(100),
            runs(function () {
                Event.fireHandler(input, 'focus');
            }),
            runs(function () {
                expect(document.activeElement).not.to.be(input);
                expect(ret).to.eql(['input focus']);
                ret = [];
                Dom.remove(outer);
            })
        ], done);
    });
});