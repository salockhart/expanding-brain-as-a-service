'use strict';

$(function () {
    function urlParamExists(name) {
        const results = new RegExp('[\?&]' + name).exec(window.location.href);
        return results;
    }

    const isSuccess = urlParamExists('success');
    const isError = urlParamExists('error');

    if (isError) {
        $('#error-banner').removeClass('hidden');
    } else if (isSuccess) {
        $('#success-banner').removeClass('hidden');
    }
});