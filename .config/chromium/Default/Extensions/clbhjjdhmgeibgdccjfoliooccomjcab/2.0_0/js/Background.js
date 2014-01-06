
function Background() {

    "use strict";
    
    //set default locale
    chrome.i18n.setLocale('en');
    // Temporarily disable german language, since it's not on php manual download page any more
    if (!localStorage.getItem('locale')) {
        localStorage.setItem('locale', 'en');
    }
    
    this.languages = {
        de: 'Deutsch',
        en: 'English',
        es: 'Español',
        fr: 'Français',
        pl: 'Polski',
        pt_BR: 'Português',
        ru: 'Русский',
        zh: '中文'
    };
        
    this.installer = new InstallerBackground();
        
    this.ga = new GoogleAnalytics();
        
    this.model = null;
        
    // http://code.google.com/p/chromium/issues/detail?id=77623
    this.log = console.log.bind(console);
        
    this.ls = localStorage;

    this.nacl = new NaCl($('#listener'));
        
    this.setLocale = function(locale) {
        this.ls.setItem('locale', locale);
        this.ls.removeItem('last_object_json');
        this.ls.removeItem('last_object_autocomplete');
        //this.openModel();
    };
        
    this.getLocale = function() {
        /**
         * Language versions temporarily disabled
         */
        return 'en';
    };
        
    this.getTableName = function() {
        return 'ninja-php-manual-' + this.getDatabaseLocale();
    };
        
    this.getTables = function() {
        var tables = [ ];
        var language;
        for (language in this.languages) {
            tables.push('ninja-php-manual-' + language);
        }
        return tables;
    };

    this.setCollectData = function(val) {
        this.ga.setEnabled(val);
        this.ls.setItem('collectUsageData', val);
    };

    this.isCollectUsageDataEnabled = function() {
        if (this.ls.getItem('collectUsageData') === null) {
            this.setCollectData(true);
            return true;
        } else {
            return this.ls.getItem('collectUsageData') === "true";
        }
    };
        
    this.openModel = function() {
        if (!this.model || (this.getTableName() !== this.model.getTable())) {
            this.model = new Model(this.getTableName());
            //this.reloadJsonStats();
        }
    };
        
    this.getDatabaseLocale = function() {
        var locale = this.ls.getItem('locale');
        if (locale === 'undefined') {
            this.log('Force english language versions');
            this.ls.setItem('locale', 'en');
            return 'en';
        } else {
            return locale;
        }
    };
        
        // setDatabaseLocale: function(locale) {
        //     this.log('Calling deprecated method setDatabaseLocale(locale)');
        //     this.setLocale(locale);
        //     //return this.ls.setItem('locale', locale);
        // },

    this.getDatabaseTimestamp = function () {
        return this.ls.getItem('db_timestamp_' + this.getDatabaseLocale());
    };

    this.setDatabaseTimestamp = function (timestamp) {
        background.ls.setItem('db_timestamp_' + this.getDatabaseLocale(), timestamp);
    };
        
    this.loadJson = function(url) {
        var response;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                response = JSON.parse(xhr.responseText);
            }
        };
        xhr.open("GET", chrome.extension.getURL(url), false);
        xhr.send();
        
        return response;
    };
    
    this.loadJsonStats = function() {
        return this.loadJson('/json/' + this.getDatabaseLocale() + '/stats.json');
    };

    this.loadDictionary = function() {
        return this.loadJson('/json/' + this.getDatabaseLocale() + '/database.json');
    };

    this.loadAllFunctionsArray = function() {
        return this.loadJson('/json/' + this.getDatabaseLocale() + '/functions.json');
    };

    this.initNaCl = function() {
        this.nacl.messageCallback = function(message) {
            console.log(message);
        };

//        var allFunctionsArray = [];
//        var allClassesArray = [];
        var allClassesArray = this.loadAllFunctionsArray();
//        var tmpArray = this.loadAllFunctionsArray();

//        for (var i=0; i < tmpArray.length; i++) {
//            if (tmpArray[i].indexOf('::') === -1) { // is not a class
//                allFunctionsArray.push(tmpArray[i]);
//            } else {
//                allClassesArray.push(tmpArray[i]);
//            }
//        }
//
//        this.nacl.sendMessage('init', allFunctionsArray.concat(allClassesArray));
        this.nacl.sendMessage('init', allClassesArray);
        // console.log(this.loadAllFunctionsArray());
    };
};

$(function() {
    window.background = new Background();

    window.background.openModel();

    window.background.ga.setEnabled(window.background.isCollectUsageDataEnabled());

    $('#backgroundTestsLink').attr('href', chrome.extension.getURL('/background-tests.html'));
    $('#backgroundPerformanceTestsLink').attr('href', chrome.extension.getURL('/background-performance-tests.html'));

});

/*
//set default locale
chrome.i18n.setLocale(background.getLocale());
if (!background.ls.getItem('locale')) {
	background.setLocale(background.getLocale());
}
*/

// open database connection

chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22811638-1']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

