
if (location.search !== "?foo") {
    location.search = "?foo";
    throw new Error;  // load everything on the next page;
                      // stop execution on this page
}


var background = chrome.extension.getBackgroundPage().background;

window.SearchTerm = chrome.extension.getBackgroundPage().SearchTerm;

var installer = new PopupInstaller(function() {
    background.log('installer callback');
});


$('#search').keyup(function (e) {
    e.preventDefault();

    /**
     * Avoid jumping cursor from the beginning to the end while pressing up and down arrows and shift
     * (when selecting text)
     */
    // e.keyCode == 8 || d
    if (e.keyCode === 91 || e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13 || e.keyCode === 16) {
        return false;
    } else if (e.keyCode !== 37 && e.keyCode !== 39) {
        background.model.stop();
        App.setSearch($(this).val(), false, true);
    }
});


/**
 * moving in autocomplete using arrows
 */
$('#search').keydown(function(e) {
    //background.log('keypressed event', e.keyCode);
    if (e.keyCode === 13) { // enter
        if ($(this).val()) {
            Autocomplete.searchHighlighted();
        } else {
            App.setSearch('');
        }
        return false;
    } else if (e.keyCode === 38) { // key up
        Autocomplete.highlightMoveUp();
    } else if (e.keyCode === 40) { // key down
        Autocomplete.highlightMoveDown();
    }

    if (e.keyCode == 38 || e.keyCode == 40) {
        Autocomplete.highlight();
        return false;
    }
    return true;
});

$('#search').click(function(e) {
    if (Autocomplete.count() > 0) {
        App.showAutocomplete();
    }
});


$('#search').blur(function() {
    if ($('#autocomplete.hovered').length === 0) {
        Autocomplete.hide();
    }
    background.ga.trackSearchTerm(new SearchTerm(App.getSearch()));
});

$('#autocomplete').on('click', 'li', function() {
    App.enable();
    App.setSearch($(this).attr('rel'), true);
    App.hideAutocomplete();
});

$('#autocomplete').on({
    mouseover: function() {
        $(this).addClass('hovered');
    },
    mouseout: function() {
        $(this).removeClass('hovered');
    }
});
$('#autocomplete').on('mouseover', 'li', function() {
    Autocomplete.setHighlighted($('#autocomplete ul li').index($(this)));
    Autocomplete.highlight();
});

$('#autocomplete').on('mouseout', 'li', function() {
    Autocomplete.highlight();
});

$('#params, .h1div').on('click', 'li, a', function() {
    App.slideToggleParam($(this));
});

$('#params').on('click', 'li', function(e) {
    e.preventDefault();
    if ($(this).find('> div').height() == 0) {
        background.ga.trackEvent('click', 'param', App.getSearch(), $('#params li').index($(this)));
    }
});

// function retrun type is clickable
$('#h1_params').on('click', 'a', function(e) {
    e.preventDefault();
    App.setSearch($(this).text(), true);
});

$('#classmethods ul').on('click', 'a', function(e) {
    e.preventDefault();
    App.setSearch($(this).text(), true);
});

$('#seealsoclass_content').click(function(e) {
    e.preventDefault();
    App.setSearch($(this).text(), true);
});

$('#seealsoclass a').click(function(e) {
    App.enable();
    App.find();
    e.preventDefault();
});

$('#hellodiv li:eq(1) > a').attr('href', chrome.extension.getURL('options.html'));

$(document).keyup(function(e) {
    if (e.keyCode === 117) { // when user presses F6 select content in search box
        $('#search').select();
    } else if (e.keyCode === 70 && $('#search:focus').length === 0) {
        $('#search').select();
    }
});

/**
 * Track clicking on the official documentation link
 */
$('#controls .url').click(function () {
    background.ga.trackEvent('click', 'open-url', $.trim($('#contentdiv h2').text()));
});

/**
 * Track clicking on the copy to clipboard
 */
$('#controls .copy').click(function (e) {
    e.preventDefault();
    background.ga.trackEvent('click', 'copy-to-clipboard-declaration', $.trim($('#contentdiv h2').text()));

    var definition = App.getFunctionDefinition();
    $.copy(definition);

    $('#copied > p').remove();
    $('#copied').stop(true).prepend($('<p/>').text(definition)).css('opacity', 1).css('top', $('html').height() / 2);
    $('#copied').show().fadeOut(3000, function() { $('#copied > p').remove(); });

    //console.log(definition);
});

$('#doc .codesnippets > a').click(function(e) {
    App.showSnippets();
    background.ga.trackEvent('click', 'snippets', $.trim($('#h1_params > p:first > span.name').text()));
    e.preventDefault();
});

$('#snippets .codesnippets > a').click(function(e) {
    App.hideSnippets();
    e.preventDefault();
});

$('#snippets #snippetSlider a.right').click(function() {
    if ($('#snippetSlider > ul > li').length - 1 != Math.abs(parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth)) {
        $('#snippetSlider > ul').animate({ left: '-=488' }, 100, 'linear', function() {
            if (Math.abs(parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth) === $('#snippetSlider > ul > li').length - 1) {
                $('#snippetSlider .right').hide();
            }
            $('#snippetSlider .left').show();
        });     
    }
});

$('#snippets #snippetSlider a.left').click(function() {
    if (Math.abs(parseInt($('#snippetSlider > ul').css('left'))) / ContentManager.codeSnippetWidth > 0) {
        $('#snippetSlider > ul').animate({ left: '+=488' }, 100, 'linear', function() {
            if ((parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth) === 0) {
                $('#snippetSlider .left').hide();
            }
            $('#snippetSlider .right').show();
        });
    }
});

$('#snippets').on('click', 'a.icon.copy', function(e) {
    e.preventDefault();
    // get snippet number
    background.ga.trackEvent('click', 'copy-to-clipboard-snippet', App.getSearch(), Math.abs(parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth));
    $.copy($(this).parent().find('pre').text());
    $('#copied').stop(true).css('opacity', 1).css('top', $('html').height() / 2).show().fadeOut(3000);
});



$('#seealso').on('click', 'a', function(e) {
    e.preventDefault();

    App.enable();
    App.setSearch($(this).text(), true);
    $('.tipsy').remove();
    App.hideAutocomplete();
});

// update "copied to clipboard text" with platform specific info
if (App.isMac()) {
    $('#copied').html($('#copied').text() + '<br>Press ⌘ + V to paste');
} else {
    $('#copied').html($('#copied').text() + '<br>Press CTRL + V to paste.');
}

background.ga.trackPageview('/page/popup/' + background.getDatabaseLocale());

$(function() {
    installer.checkInstallation();
});
