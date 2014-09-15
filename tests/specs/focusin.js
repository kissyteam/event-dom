/**
 * tc for focusin event
 * @author yiminghe@gmail.com
 */

/*jshint quotmark:false*/
var Dom = require('dom');
var Event = require('event-dom');
var tpl = ' <div id="test-focusin">test focusin: <input type="text" value="点击我"/>' +
        '<input id="test-focusin-input" type="text" value="另一个输入框"/></div>',
    HAPPENED = 'happened',
    FIRST = '1',
    SECOND = '2',
    SEP = '-';

describe('focusin and focusout', function () {
    beforeEach(function () {
        Dom.prepend(Dom.create(tpl), 'body');
        window.focus();
        document.body.focus();
    });

    afterEach(function () {
        Dom.remove('#test-focusin');
    });

    it('should trigger the focusin/focusout event on the proper element, ' +
        'and support bubbling with correct order.', function (done) {

        var container = Dom.get('#test-focusin'),
            input = Dom.get('input', container),
            result = [];

        // In non-IE, the simulation of focusin/focusout behavior do not correspond with IE exactly,
        // so we should ignore the orders of the event
        Event.on(container, 'focusin focusout', function () {
            result.push(HAPPENED);
        });
        Event.on(input, 'focusin focusout', function () {
            result.push(HAPPENED + "_inner");
        });

        async.series([
            runs(function () {
                result = [];
                input.focus();
            }),
            waits(10),
            runs(function () {
                // guarantee bubble
                expect(result.join(SEP)).to.eql([HAPPENED + "_inner", HAPPENED].join(SEP));
            }),
            runs(function () {
                result = [];
                input.blur();
            }),
            waits(10),
            runs(function () {
                expect(result.join(SEP)).to.eql([HAPPENED + "_inner", HAPPENED].join(SEP));
            }),
            runs(function () {
                Event.remove(container);
                result = [];
                input.focus();
            }),
            waits(10),
            runs(function () {
                expect(result.join(SEP)).to.eql([HAPPENED + "_inner"].join(SEP));
            }),
            runs(function () {
                Event.remove(input);
            })
        ], done);
    });

    it('should trigger the focusin/focusout event and focus event in order.', function (done) {
        var input = Dom.get('#test-focusin-input');
        var result = [];

        Event.on(input, 'focusin focusout', function () {
            result.push(FIRST);
        });

        Event.on(input, 'focus blur', function () {
            result.push(SECOND);
        });

        async.series([
            runs(function () {
                result = [];
                input.focus();
            }),
            waits(0),
            runs(function () {
                expect(result.join(SEP)).to.eql([FIRST, SECOND].join(SEP));
            }),
            runs(function () {
                result = [];
                input.blur();
            }),
            waits(0),
            runs(function () {

                expect(result.join(SEP)).to.eql([FIRST, SECOND].join(SEP));

            })
        ], done);
    });


    it("should delegate focus/blur properly", function (done) {
        var container = Dom.get('#test-focusin'),
            input = Dom.get('input', container),
            result = [];

        // In non-IE, the simulation of focusin/focusout behavior do not correspond with IE exactly,
        // so we should ignore the orders of the event
        Event.delegate(container, 'focusin', 'input', function (e) {
            expect(e.type).to.be('focusin');
            result.push(1);
        });

        Event.delegate(container, 'focusout', 'input', function (e) {
            expect(e.type).to.be('focusout');
            result.push(2);
        });

        async.series([
            runs(function () {
                result = [];
                input.focus();
            }),
            waits(10),
            runs(function () {
                // guarantee bubble
                expect(result).to.eql([1]);
            }),
            runs(function () {
                result = [];
                input.blur();
            }),
            waits(10),
            runs(function () {
                expect(result).to.eql([2]);
            }),
            runs(function () {
                Event.remove(container);
                result = [];
                input.focus();
            }),
            waits(10),
            runs(function () {
                expect(result).to.eql([]);
            })
        ], done);
    });

});