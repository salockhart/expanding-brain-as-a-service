'use strict';

let typingTimer;
const doneTypingInterval = 500;

const emojis = [
    '👏',
    '💪',
    '👌',
    '👍',
    '💩',
    '🌸',
    '🦆',
    '🍝',
    '🔫',
    '🦀',
    '💯',
    '💰',
    '🚽',
    '🐴',
    '🕳️',
    '❤️',
    '🆒',
    '😂',
    '💀',
    '🍆',
    '😎',
    '🖕',
    '🇨🇦',
    '+'
];

let selectedEmoji = emojis[0];

function onKeyUp() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitPhrase, doneTypingInterval);
}

function onKeyDown() {
    clearTimeout(typingTimer);
}

function submitPhrase() {
    const value = $('#phrase').val();
    let emoji = $('#custom-emoji').val();

    if (!value) {
        return;
    }

    if (!emoji) {
        emoji = selectedEmoji;
    }

    const encodedPhrase = encodeURIComponent(value);
    const encodedEmoji = encodeURIComponent(emoji);

    $.get('https://clap-as-a-service.herokuapp.com/clap?phrase=' + encodedPhrase + '&emoji=' + encodedEmoji)
        .done(function (event) {
            $('#clap').html(event);
            if (!event) {
                $('#share-container').addClass('invisible');
            } else {
                $('#share-container').removeClass('invisible');
            }
        });
}

function handleUrlParams() {
    function urlParam(name) {
        const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results && results[1];
    }

    const urlPhrase = urlParam('phrase');
    let urlEmoji = urlParam('emoji');

    if (urlEmoji) {
        urlEmoji = decodeURIComponent(urlEmoji);
        const idx = emojis.indexOf(urlEmoji);
        if (idx !== -1) {
            onEmojiSelect({
                target: $('#sample-emoji-container button')[idx]
            })
        } else {
            onOpenCustomEmoji();
            $('#custom-emoji').val(urlEmoji);
        }
    }

    if (urlPhrase) {
        $('#phrase').val(decodeURIComponent(urlPhrase));
    }

    submitPhrase();
}

function fillEmojiSelector() {
    const emojiContainer = $('#sample-emoji-container');
    for (let i = 0; i < emojis.length; i++) {
        const button = $('<button>')
        if (i === 0) {
            button.addClass('active');
        }
        button.addClass('btn');
        button.addClass('btn-default');
        button.addClass('col-xs-2');
        button.addClass('col-sm-1');
        button.text(emojis[i]);
        button.click(onEmojiSelect);
        emojiContainer.append(button);
    }
}

function onEmojiSelect(event) {
    const target = $(event.target);
    if (target.text() === '+') {
        onOpenCustomEmoji();
    } else {
        selectedEmoji = target.text();
        submitPhrase();
        const currentActive = $('.active');
        currentActive.removeClass('active');
        target.addClass('active');
    }
}

function onOpenCustomEmoji() {
    $('#sample-emoji-container').addClass('invisible');
    $('#custom-emoji-container').removeClass('invisible');
    const emojiInput = $('#custom-emoji');
    emojiInput.val('');
    emojiInput.focus();
}

function onCloseCustomEmoji() {
    $('#sample-emoji-container').removeClass('invisible');
    $('#custom-emoji-container').addClass('invisible');
    const emojiInput = $('#custom-emoji');
    emojiInput.val('');
}

function getURLForResult() {
    const value = $('#phrase').val();
    let emoji = $('#custom-emoji').val();

    if (!value) {
        return;
    }

    if (!emoji) {
        emoji = selectedEmoji;
    }

    return window.location.origin + window.location.pathname + '?phrase=' + encodeURIComponent(value) + '&emoji=' + encodeURIComponent(emoji);
}

function onShareTwitter() {
    const baseURL = 'https://twitter.com/intent/tweet/';
    const clapResult = $('#clap').text();
    window.open(baseURL + "?text=" + encodeURIComponent(clapResult) + "&url=" + encodeURIComponent(getURLForResult()));
}

function onShareCopy() {
    const value = $('#clap');
    value.setSelectionRange(0, value.text().length);

    // copy the selection
    let succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }

    if (succeed) {
        console.log("Success");
    }
}

$(function () {
    fillEmojiSelector();
    handleUrlParams();

    const phraseInput = $('#phrase');
    phraseInput.keyup(onKeyUp);
    phraseInput.keydown(onKeyDown);

    const emojiInput = $('#custom-emoji');
    emojiInput.keyup(onKeyUp);
    emojiInput.keydown(onKeyDown);

    $('#custom-emoji-close').click(onCloseCustomEmoji);

    $('#share-container .twitter-button').click(onShareTwitter);
    $('#share-container .copy-button').click(onShareCopy);
});