/**
 * submit spec for supporting bubbling in ie<9
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var Event = require('event-dom');
/*jshint quotmark:false*/
describe("submit event", function () {

    var div,
        form,
        inp = Dom.get('input', div);

    beforeEach(function () {
        div = Dom.create("<div>" +
            "<form action='http://www.g.cn' onsubmit='return false'>" +
            "<input type='submit' id='s'>" +
            "</form>" +
            "</div>");

        Dom.append(div, document.body);

        form = Dom.get("form", div);
        inp = Dom.get('input', div);
    });

    afterEach(function () {
        Dom.remove(div);
        Dom.remove(form);
    });

    it("should works and target is right", function (done) {
        var t = 0;
        Event.on(div, 'submit', function (e) {
            t = e.target;
            e.preventDefault();
        });
        inp.click();
        async.series([
            waits(100),
            runs(function () {
                expect(t).to.be(form);
                t = 0;
                Event.remove(div);
                Event.on(div, 'submit', function (e) {
                    e.preventDefault();
                });
                inp.click();
            }),
            waits(100),
            runs(function () {
                expect(t).to.be(0);
            })
        ], done);
    });

    it("should stop propagation well", function (done) {
        var ret = [];
        Event.on(div, 'submit', function (e) {
            e.preventDefault();
        });
        inp.click();
        async.series([
            waits(100),
            runs(function () {
                Event.on(form, 'submit', function (e) {
                    e.halt();
                });
                Event.on(div, 'submit', function () {
                    ret.push(1);
                });
            }),
            runs(function () {
                inp.click();
            }),
            waits(100),
            runs(function () {
                expect(ret).to.eql([]);
            })
        ], done);
    });


    it("should fire correctly", function (done) {
        var ret = [];
        Event.on(div, 'submit', function (e) {
            ret.push(1);
            e.preventDefault();
        });
        // trigger kissy internal form bind
        inp.click();
        setTimeout(function () {
            ret = [];
            Event.fire(form, 'submit');
            expect(ret).to.eql([1]);
            done();
        }, 100);
    });


    it("should delegate well", function (done) {
        Event.delegate(div, 'submit', "form", function (e) {
            expect(e.target).to.be(form);
            expect(e.currentTarget).to.be(form);
            e.preventDefault();
            done();
        });
        inp.click();
    });
});
