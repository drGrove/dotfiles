
$(function () {
    
    var background = chrome.extension.getBackgroundPage().background;
    background.ga.trackPageview('/page/options/' + background.getDatabaseLocale());
    
    $('#resetButton').click(function() {
        var html = '<div><p>Delete all databases and regenerate them.</p><p class="buttons"><a href="#" class="button">Delete databases</a> <a href="#" class="button cancel">Cancel</a></p></div>';
        smartPopup.show(html);
    });

    
    for (lang in background.languages) {
        $('#language').append($('<option>', { html: background.languages[lang], value: lang, 'data-class': lang } ));
    }
    $('#language option[value="' + background.getDatabaseLocale() + '"]').prop('selected', true);
    
    
    $('#language').tzSelect({
        selectCallback: function(val) {
            background.setLocale(val);
            background.openModel();
            
            //localStorage.removeItem('last_search');
            localStorage.removeItem('last_search_json');
            background.ga.trackEvent('language', val);
            //$('#reset_button').show();
            
            //translate();
        }
    });

    // set default value
    //if (background.ls.getItem('collectUsageData') === null) {
    //    background.ls.setItem('collectUsageData', true);
    //}

    $('#collectUsageData').prop('checked', background.isCollectUsageDataEnabled());

    $('#collectUsageData').change(function() {
        var val = $(this).is(':checked');
        if (!val) {
            background.ga.trackEvent('usage-data', 'disable');
        }
        background.setCollectData(val);
        background.ls.setItem('collectUsageData', val);
        if (val) {
            background.ga.trackEvent('usage-data', 'enable');
        }
    });

//    $('input:checkbox').checkbox();
    $('input:checkbox').iButton({
        labelOn: "",
        labelOff: "",
        enableDrag: true
    });

    // cancel    
    $('body').on('click', 'a.cancel', function() {
        smartPopup.hide();
    });

    // reset
    $('body').on('click', 'a:first', function () {
        
        // drop all tables
        var tables = background.getTables();
        for (i in tables) {
            var model = new Model(tables[i]);
            try {
                model.drop();
            } catch (e) {};
        }
        
        // remove everything from localStorage
        for (language in background.languages) {
            localStorage.removeItem('db_installation_status_' + language);
            localStorage.removeItem('db_timestamp_' + language);
        }
        
        // change text and hide the button
        $('#resetText').text('Databases deleted...');
        $('#resetButton').hide();
        
        // hide the popup window
        smartPopup.hide();
        
        return false;
    });
    
});
