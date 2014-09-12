/**
 * tc about fire function
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var Event = require('event-dom');
var DomEventObservable = Event.Observable;

describe('fire', function () {
    it('support once', function () {
        var n = Dom.create('<div/>'), ret;

        Event.on(n, 'mouseenter', {
            fn: function (e) {
                expect(e.type).to.be('mouseenter');
                ret = 1;
            },
            once: 1
        });

        Event.fire(n, 'mouseenter', {
            relatedTarget: document
        });

        expect(ret).to.be(1);

        expect(DomEventObservable.getDomEventObservablesHolder(n)).to.be(undefined);
    });

    it('can get fire return value', function () {
        var n = Dom.create('<div/>');

        Event.on(n, 'xx', function () {
            return 1;
        });

        Event.on(n, 'xx', function () {
        });

        expect(Event.fire(n, 'xx')).to.be(1);

        Event.detach(n);

        Event.on(n, 'xx', function () {
            return false;
        });

        Event.on(n, 'xx', function () {
            return 1;
        });

        Event.on(n, 'xx', function () {
        });

        expect(Event.fire(n, 'xx')).to.be(false);

        Event.detach(n);

        Event.on(n, 'xx', function () {
            return 1;
        });

        Event.on(n, 'xx', function () {
            return null;
        });

        expect(Event.fire(n, 'xx')).to.be(null);
    });

    it('can get fireHandler return value', function () {
        var n = Dom.create('<div/>');

        Event.on(n, 'xx', function () {
            return 1;
        });

        Event.on(n, 'xx', function () {
        });

        expect(Event.fireHandler(n, 'xx')).to.be(1);

        Event.detach(n);

        Event.on(n, 'xx', function () {
            return false;
        });

        Event.on(n, 'xx', function () {
            return 1;
        });

        Event.on(n, 'xx', function () {
        });

        expect(Event.fireHandler(n, 'xx')).to.be(false);

        Event.detach(n);

        Event.on(n, 'xx', function () {
            return 1;
        });

        Event.on(n, 'xx', function () {
            return null;
        });

        expect(Event.fireHandler(n, 'xx')).to.be(null);
    });

    it('bubble event remove element/fn in the middle', function () {
        var n = Dom.create('<div>' +
            '<div class="l1"><div class="l2"></div></div>' +
            '</div>'), ret = [], dfn, winFn;

        Dom.append(n, 'body');

        var l1 = Dom.get('.l1', n);

        var l2 = Dom.get('.l2', n);

        Event.on(l1, 'click', function () {
            ret.push(1);
        });

        Event.on(l2, 'click', function () {
            ret.push(2);
            Event.detach(l2);
        });

        Event.on(l2, 'click', function () {
            Dom.append(l2, n);
            ret.push(22);
        });

        Event.on(document, 'click', dfn = function () {
            ret.push(3);
        });

        Event.on(window, 'click', winFn = function () {
            ret.push(4);
        });

        Event.fire(l2, 'click');

        expect(ret).to.eql([2, 22, 1, 3, 4]);

        ret = [];

        Event.fire(l2, 'click');

        expect(ret).to.eql([3, 4]);

        Event.detach(document, 'click', dfn);

        Event.detach(window, 'click', winFn);

        Dom.remove(n);
    });

    it('fireHandler does not bubble', function () {

        var n = Dom.create('<div>' +
                '<div class="l1">' +
                '<div class="l2"></div>' +
                '</div>' +
                '</div>'),
            ret = [],
            dfn, winFn;

        Dom.append(n, 'body');

        var l1 = Dom.get('.l1', n);

        var l2 = Dom.get('.l2', n);

        Event.on(l1, 'click', function () {
            ret.push(1);
        });

        Event.on(l2, 'click', function () {
            ret.push(2);
            Event.detach(l2);
        });

        Event.on(l2, 'click', function () {
            Dom.append(l2, n);
            ret.push(22);
        });

        Event.on(document, 'click', dfn = function () {
            ret.push(3);
        });

        Event.on(window, 'click', winFn = function () {
            ret.push(4);
        });

        Event.fireHandler(l2, 'click');

        expect(ret).to.eql([2, 22]);

        ret = [];

        Event.fireHandler(l2, 'click');

        expect(ret).to.eql([]);

        Event.detach(document, 'click', dfn);

        Event.detach(window, 'click', winFn);

        Dom.remove(n);
    });

    it('can fire EventObject instance', function () {
        var event = new Event.Object({
            type: 'xx'
        });
        var node = Dom.create('<div></div>');
        var fired = 0;
        Event.on(node, 'xx', function (e) {
            fired = 1;
            expect(e.target).to.be(node);
            e.preventDefault();
            expect(e).to.be(event);
        });
        Event.fire(node, event);
        expect(fired).to.be(1);
        expect(event.isDefaultPrevented()).to.be(true);
    });

    it('will propagate', function () {
        var event = new Event.Object({
            type: 'xx'
        });
        var node2 = Dom.create('<div></div>');
        var node = Dom.create('<div></div>');
        node2.appendChild(node);
        var fired = 0;
        Event.on(node2, 'xx', function () {
            fired = 1;

        });
        Event.fire(node, event);
        expect(fired).to.be(1);
        expect(event.isPropagationStopped()).to.be(false);
    });

    it('can set EventObject instance', function () {
        var event = new Event.Object({
            type: 'xx'
        });
        event.isPropagationStopped = function () {
            return true;
        };
        var node2 = Dom.create('<div></div>');
        var node = Dom.create('<div></div>');
        node2.appendChild(node);
        var fired = 0;
        Event.on(node2, 'xx', function () {
            fired = 1;

        });
        Event.fire(node, event);
        expect(fired).to.be(0);
        expect(event.isPropagationStopped()).to.be(true);
    });
});
