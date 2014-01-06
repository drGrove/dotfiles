
if (location.search !== "?foo") {
    location.search = "?foo";
    throw new Error;  // load everything on the next page;
                      // stop execution on this page
}

var background = chrome.extension.getBackgroundPage().background;

window.SearchTerm = chrome.extension.getBackgroundPage().SearchTerm;

var installer = new PopupInstaller(function() {
    if ($('#searchdiv').is(':visible')) {
        //$('#search').focus();
        /*setTimeout(function() {
            $('#search').focus();
        }, 1000);*/
        //document.getElementById("search").focus();
    }
    
    //document.getElementById("search").focus();
    $('#search').select().focus();
    //App.find();
});
/*setTimeout(function() {
    $('body').click();
            $('#search').focus();
        }, 2000);*/

$('#search').keyup(function (e) {
    //background.log('keyreleased event');
    /**
     * Avoid jumping cursor from the beginning to the end while pressing up and down arrows
     */
    if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
        return false;
    }
    App.find();
    return true;
});

//App.find();

$('#search').focus(function() {
    //background.log('focus');
    //Model.find(new SearchTerm(App.getSearch()));
    App.find();
    return true;
});

/*setTimeout(function() {
    $('#search').click();
}, 1000);*/
//$('#search').focus();

//$('#search').blur(function() {
    //background.log('blur');
    //App.updatePopupHeight();
//});

$('#contentdiv, #classmethods').click(function() {
    Autocomplete.hide();
    //background.ga.trackSearchTerm(searchTerm);
    background.ga.trackSearchTerm(new SearchTerm(App.getSearch()));
});

$('#description').on('click', 'a.show-long-desc, a.show-short-desc', function() {
    //$(this).parent().find('p').toggle();
    var visible = $('#description').find('p:visible');
    var hidden = $('#description').find('p:hidden');

    // log GA
    background.ga.trackEvent('click', hidden.is('.long-desc') ? 'long-description' : 'short-description', App.getSearch());

    visible.hide();
    hidden.show();
});

$('#autocomplete').on('click', 'li', function() {
    App.setSearch($(this).attr('rel'), true);
    //console.log('click', 'autocomplete', $(this).text());
})

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
    background.ga.trackEvent('click', 'param', App.getSearch(), $('#params li').index($(this)));
});

// function retrun type is clickable
$('#h1_params').on('click', 'a', function() {
    App.setSearch($(this).text(), true);
})

$('#classmethods ul').on('click', 'a', function() {
    App.setSearch($(this).text(), true);
});

$('#description').on('click', 'a', function() {
    if ($(this).is('.show-long-desc') || $(this).is('.show-short-desc')) {
        return true; // pass
    } else {
        var funcName = $(this).text();
        if (funcName.substring(funcName.length - 2) == '()') {
            funcName = funcName.substring(0, funcName.length - 2);
        }
        background.log(funcName);
        App.setSearch(funcName, true);
    }
})

$('#seealsoclass a').click(function(e) {
    App.setSearch($(this).text(), true);
    e.preventDefault();
});

$('#hellodiv li:eq(1) > a').attr('href', chrome.extension.getURL('options.html'));

/**
 * when user presses F6 select content in search box
 */
$(document).keydown(function(e) {
    if (e.keyCode == 117) {
        $('#search').select();
    }
});

/**
 * moving in autocomplete using arrows
 */
$('#search').keydown(function(e) {
    //background.log('keypressed event', e.keyCode);
    if (e.keyCode === 13) { // enter
        Autocomplete.searchHighlighted();
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
    $('#copied').stop(true).css('opacity', 1).prepend($('<p/>').text(definition));
    $('#copied').show().fadeOut(3000, function() { $('#copied > p').remove(); });

    //console.log(definition);
});

$('#doc .codesnippets > a').click(function(e) {
    App.showSnippets();
    background.ga.trackEvent('click', 'snippets', $.trim($('#contentdiv h2').text()));
    e.preventDefault();
});

$('#snippets .codesnippets > a').click(function(e) {
    App.hideSnippets();
    e.preventDefault();
});

$('#snippets #snippetSlider a.right').click(function() {
    if ($('#snippetSlider > ul > li').length - 1 != Math.abs(parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth)) {
        $('#snippetSlider > ul').animate({ left: '-=388' }, 100, 'linear', function() {
            //ContentManager.updateCodeScrollbars();
            if (Math.abs(parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth) === $('#snippetSlider > ul > li').length - 1) {
                $('#snippetSlider .right').hide();
            }
            $('#snippetSlider .left').show();
        });     
    }
});

$('#snippets #snippetSlider a.left').click(function() {
    if (Math.abs(parseInt($('#snippetSlider > ul').css('left'))) / ContentManager.codeSnippetWidth > 0) {
        $('#snippetSlider > ul').animate({ left: '+=388' }, 100, 'linear', function() {
            if ((parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth) === 0) {
                $('#snippetSlider .left').hide();
            }
            $('#snippetSlider .right').show();
            //ContentManager.updateCodeScrollbars();
        });
    }
});

$('#snippets').on('click', 'a.icon.copy', function(e) {
    e.preventDefault();
    background.ga.trackEvent('click', 'copy-to-clipboard-snippet', App.getSearch(), Math.abs(parseInt($('#snippetSlider > ul').css('left')) / ContentManager.codeSnippetWidth));
    $.copy($(this).parent().find('pre').text());
    $('#copied').stop(true).css('opacity', 1).show().fadeOut(3000);
});



$('#seealso').on('click', 'a', function(e) {
    e.preventDefault();
    App.setSearch($(this).text(), true);
    $('.tipsy').remove();
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
