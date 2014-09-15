/**
 * test tap gesture by simulating touch event for ios/android
 * @author yiminghe@gmail.com
 */

var UA = require('ua');

// TODO firefox, ie11 ??
if (!window.DeviceMotionEvent || UA.firefox || UA.ie) {
    return;
}

var Event = require('event-dom');
var ShakeType = require('event-dom/gesture/shake');
var SHAKE = ShakeType.SHAKE;

describe('shake', function () {
    beforeEach(function () {
        window.scrollTo(0, 0);
    });

    it('fires', function (done) {
        var called = 0, fn;

        Event.on(window, SHAKE, function () {
            called = 1;
        });

        window.addEventListener('x_devicemotion', fn = function (e) {
            console.log('******************************');
            console.log(e.accelerationIncludingGravity.x);
            console.log(e.accelerationIncludingGravity.z);
            console.log(e.acceleration.z);
        }, false);

        var acceleration = {
                x: 0,
                y: 0,
                z: 0
            },
            accelerationIncludingGravity = {
                x: 0,
                y: 0,
                z: -9
            };

        async.series([
            waits(30),

            runs(function () {
                acceleration.x = accelerationIncludingGravity.x = 6;
                simulateEvent(window, 'devicemotion', {
                    acceleration: acceleration,
                    accelerationIncludingGravity: accelerationIncludingGravity
                });
            }),

            waits(30),

            runs(function () {
                acceleration.x = accelerationIncludingGravity.x = 26;
                simulateEvent(window, 'devicemotion', {
                    acceleration: acceleration,
                    accelerationIncludingGravity: accelerationIncludingGravity
                });
            }),

            // buffer
            waits(350),

            runs(function () {
                expect(called).to.be(1);
                window.removeEventListener('devicemotion', fn, false);
            })], done);
    });

    it('does not fire if x is too small', function (done) {
        var called = 0, fn;

        Event.on(window, SHAKE, function () {
            called = 1;
        });

        window.addEventListener('x_devicemotion', fn = function (e) {
            console.log('******************************');
            console.log(e.accelerationIncludingGravity.x);
            console.log(e.accelerationIncludingGravity.z);
            console.log(e.acceleration.z);
        }, false);

        var acceleration = {
                x: 0,
                y: 0,
                z: 0
            },
            accelerationIncludingGravity = {
                x: 0,
                y: 0,
                z: -9
            };


        async.series([waits(30),

            runs(function () {
                acceleration.x = accelerationIncludingGravity.x = 3;
                simulateEvent(window, 'devicemotion', {
                    acceleration: acceleration,
                    accelerationIncludingGravity: accelerationIncludingGravity
                });
            }),

            waits(30),
            runs(function () {
                acceleration.x = accelerationIncludingGravity.x = 2;
                simulateEvent(window, 'devicemotion', {
                    acceleration: acceleration,
                    accelerationIncludingGravity: accelerationIncludingGravity
                });
            }),


            // buffer
            waits(350),

            runs(function () {
                expect(called).to.be(0);
                window.removeEventListener('devicemotion', fn, false);
            })], done);
    });

    it('does not fire if x is not big enough', function (done) {
        var called = 0, fn;

        Event.on(window, SHAKE, function () {
            called = 1;
        });

        window.addEventListener('x_devicemotion', fn = function (e) {
            console.log('******************************');
            console.log(e.accelerationIncludingGravity.x);
            console.log(e.accelerationIncludingGravity.z);
            console.log(e.acceleration.z);
        }, false);

        var acceleration = {
                x: 0,
                y: 0,
                z: 0
            },
            accelerationIncludingGravity = {
                x: 0,
                y: 0,
                z: -9
            };


        async.series([waits(30),

            runs(function () {
                acceleration.x = accelerationIncludingGravity.x = 9;
                simulateEvent(window, 'devicemotion', {
                    acceleration: acceleration,
                    accelerationIncludingGravity: accelerationIncludingGravity
                });
            }),

            waits(30),

            runs(function () {
                acceleration.x = accelerationIncludingGravity.x = 15;
                simulateEvent(window, 'devicemotion', {
                    acceleration: acceleration,
                    accelerationIncludingGravity: accelerationIncludingGravity
                });
            }),


            // buffer
            waits(350),

            runs(function () {
                expect(called).to.be(0);
                window.removeEventListener('devicemotion', fn, false);
            })], done);
    });
});