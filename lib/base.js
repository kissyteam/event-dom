/**
 * @ignore
 * dom event facade
 * @author yiminghe@gmail.com
 */
var DomEvent = require('./base/dom-event');
var DomEventObject = require('./base/object');
var KeyCode = require('./base/key-codes');
var Special = require('./base/special-events');
var Utils = require('./base/utils');
require('./base/mouseenter');
var util = require('modulex-util');
module.exports = util.merge({
    version: '@VERSION@',
    add: DomEvent.on,
    remove: DomEvent.detach,
    KeyCode: KeyCode,
    Observable: require('./base/observable'),
    Special: Special,
    Object: DomEventObject,
    Utils: Utils
}, DomEvent);
