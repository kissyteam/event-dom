# event-dom

event registration and fire across browsers

[![modulex-event-dom](https://nodei.co/npm/modulex-event-dom.png)](https://npmjs.org/package/modulex-event-dom)
[![NPM downloads](http://img.shields.io/npm/dm/modulex-event-dom.svg)](https://npmjs.org/package/modulex-event-dom)
[![Build Status](https://secure.travis-ci.org/kissyteam/event-dom.png?branch=master)](https://travis-ci.org/kissyteam/event-dom)
[![Coverage Status](https://img.shields.io/coveralls/kissyteam/event-dom.svg)](https://coveralls.io/r/kissyteam/event-dom?branch=master)
[![Dependency Status](https://gemnasium.com/kissyteam/event-dom.png)](https://gemnasium.com/kissyteam/event-dom)
[![Bower version](https://badge.fury.io/bo/modulex-event-dom.svg)](http://badge.fury.io/bo/modulex-event-dom)
[![node version](https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square)](http://nodejs.org/download/)

[![browser support](https://ci.testling.com/kissyteam/event-dom.png)](https://ci.testling.com/kissyteam/event-dom)

## example

```javascript
modulex.use(['event-dom'],function(Event){
    Event.on(document.getElementById('t'),'click',function(){
    });
});
```