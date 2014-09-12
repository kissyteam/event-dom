(function () {
    function init(UA, Feature) {
        modulex.config('alias', {
            'event-dom': [
                'event-dom/base',
                Feature.isHashChangeSupported() ? '' : 'event-dom/hashchange',
                    UA.ieMode < 9 ? 'event-dom/ie' : '',
                Feature.isInputEventSupported() ? '' : 'event-dom/input',
                UA.ie ? '' : 'event-dom/focusin'
            ]
        });
    }

    if (typeof UA !== 'undefined') {
        init(UA, Feature);
    } else {
        modulex.use(['ua', 'feature'], init);
    }
})();
