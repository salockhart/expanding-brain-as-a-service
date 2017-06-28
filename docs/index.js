'use strict';

let typingTimer;
const doneTypingInterval = 500;

function onKeyUp() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitMeme, doneTypingInterval);
}

function onKeyDown() {
    clearTimeout(typingTimer);
}

function submitMeme() {
    const first = $('#first').val();
    const second = $('#second').val();
    const third = $('#third').val();
    const fourth = $('#fourth').val();

    if (!first || !second || !third || !fourth) {
        return;
    }

    const encodedFirst = encodeURIComponent(first);
    const encodedSecond = encodeURIComponent(second);
    const encodedThird = encodeURIComponent(third);
    const encodedFourth = encodeURIComponent(fourth);

    $('#image').attr('src', 'https://expanding-brain-as-a-service.herokuapp.com/brain?first=' + encodedFirst + '&second=' + encodedSecond + '&third=' + encodedThird + '&fourth=' + encodedFourth);
}

function handleUrlParams() {
    function urlParam(name) {
        const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results && results[1];
    }

    const urlFirst = urlParam('first');
    const urlSecond = urlParam('second');
    const urlThird = urlParam('third');
    const urlFourth = urlParam('fourth');

    if (urlFirst) {
        $('#first').val(decodeURIComponent(urlFirst));
    }

    if (urlSecond) {
        $('#second').val(decodeURIComponent(urlSecond));
    }

    if (urlThird) {
        $('#third').val(decodeURIComponent(urlThird));
    }

    if (urlFourth) {
        $('#fourth').val(decodeURIComponent(urlFourth));
    }

    submitMeme();
}

function getURLForResult() {
    const first = $('#first').val();
    const second = $('#second').val();
    const third = $('#third').val();
    const fourth = $('#fourth').val();

    const encodedFirst = encodeURIComponent(first);
    const encodedSecond = encodeURIComponent(second);
    const encodedThird = encodeURIComponent(third);
    const encodedFourth = encodeURIComponent(fourth);

    return window.location.origin + window.location.pathname + '?first=' + encodedFirst + '&second=' + encodedSecond + '&third=' + encodedThird + '&fourth=' + encodedFourth;
}

function onShareTwitter() {
    const baseURL = 'https://twitter.com/intent/tweet/';
    const clapResult = $('#clap').text();
    window.open(baseURL + "?text=" + encodeURIComponent(clapResult) + "&url=" + encodeURIComponent(getURLForResult()));
}

$(function () {
    handleUrlParams();

    const brainInputs = $('.brain-input');
    brainInputs.keyup(onKeyUp);
    brainInputs.keydown(onKeyDown);

    $('#share-container .twitter-button').click(onShareTwitter);
});