/**
 * hashchange spec
 * @author yiminghe@gmail.com
 */

/*jshint quotmark:false*/
var UA = require('ua');
var Event = require('event-dom');
describe("hashchange event", function () {

    function getHash() {
        // 不能 location.hash
        // http://xx.com/#yy?z=1
        // ie6 => location.hash = #yy
        // 其他浏览器 => location.hash = #yy?z=1
        var url = location.href;
        return '#' + url.replace(/^[^#]*#?(.*)$/, '$1');
    }

    it("should works", function (done) {

        location.hash = "";

        var hash;
        Event.on(window, "hashchange", function () {
            hash = getHash();
        });
        // 等待 iframe 建立成功，存储当前 hash ""

        var tasks = [
            waits(100),

            runs(function () {
                location.hash = "a";
            }),

            waits(100),

            runs(function () {
                expect(hash).to.be("#a");
            }),

            waits(100),

            runs(function () {
                location.hash = "b";
            }),

            waits(100),

            runs(function () {
                expect(hash).to.be("#b");
            }),

            waits(100),

            runs(function () {
                location.hash = "a";
            }),

            waits(100),

            runs(function () {
                expect(hash).to.be("#a");
            }),

            waits(100),

            runs(function () {
                location.hash = "b";
            }),

            waits(100),

            runs(function () {
                expect(hash).to.be("#b");
            }),

            waits(100)
        ];

        if (UA.ieMode === 8) {
            async.series(tasks, done);
            // ie8 iframe 内的历史和外层一样了
            return;
        }

        tasks = tasks.concat([
            runs(function () {
                history.back();
            }),
            waits(100),

            runs(function () {
                expect(hash).to.be("#a");
            }),

            runs(function () {
                history.back();
            }),
            waits(100),

            runs(function () {
                expect(hash).to.be("#b");
            }),

            runs(function () {
                history.back();
            }),
            waits(100),

            runs(function () {
                expect(hash).to.be("#a");
            }),

            runs(function () {
                history.back();
            }),
            waits(100),

            runs(function () {
                // non-ie 返回 ""
                // expect(hash).to.be("");
                expect(hash.replace(/^#/, "")).to.be("");
            })
        ]);

        async.series(tasks, done);
    });

    // https://github.com/kissyteam/kissy/issues/132
    it("no xss!", function (done) {
        location.hash = "x=<script>parent.HASH_XSS=1;</script>";
        setTimeout(function () {
            expect(window.HASH_XSS).to.beUndefined();
        },done);
    });

});