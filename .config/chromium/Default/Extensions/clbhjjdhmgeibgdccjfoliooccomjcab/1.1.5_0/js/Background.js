
window.background = function() {

    "use strict";
    
    //var bLocalStorage = localStorage;
    
    var db = new Database(false);
    
    //set default locale
    chrome.i18n.setLocale('en');
    // Temporarily disable german language, since it's not on php manual download page any more
    if (!localStorage.getItem('locale')) {
        localStorage.setItem('locale', 'en');
    }
    
    return {
        
        //db: null, // database connection
        
        languages: {
            de: 'Deutsch',
            en: 'English',
            es: 'Español',
            fr: 'Français',
            pl: 'Polski',
            pt_BR: 'Português',
            ru: 'Русский',
            zh: '中文'
        },
        
        installer: new InstallerBackground(),
        
        ga: new GoogleAnalytics(),
        
        model: null,
        
        // http://code.google.com/p/chromium/issues/detail?id=77623
        log: console.log.bind(console),
        
        ls: localStorage,
        
        setLocale: function(locale) {
            this.ls.setItem('locale', locale);
            this.ls.removeItem('last_object_json');
            this.ls.removeItem('last_object_autocomplete');
            //this.openModel();
        },
        
        getLocale: function() {
            /**
             * Language versions temporarily disabled
             */
            return 'en';
        },
        
        getTableName: function() {
            return 'dict_' + this.getDatabaseLocale();
        },
        
        getTables: function() {
            var tables = [ ];
            var language;
            for (language in this.languages) {
                tables.push('dict_' + language);
            }
            return tables;
        },

        setCollectData: function(val) {
            this.ga.setEnabled(val);
            this.ls.setItem('collectUsageData', val);
        },

        isCollectUsageDataEnabled: function() {
            if (this.ls.getItem('collectUsageData') === null) {
                this.setCollectData(true);
                return true;
            } else {
                return this.ls.getItem('collectUsageData') === "true";
            }
        },
        
        openModel: function() {
            if (!this.model || (this.getTableName() !== this.model.getTable())) {
                this.model = new Model(this.getTableName(), db);
                //this.reloadJsonStats();
            }
        },
        
        getDatabaseLocale: function() {
            var locale = this.ls.getItem('locale');
            if (locale === 'undefined') {
                this.log('Force english language versions');
                this.ls.setItem('locale', 'en');
                return 'en';
            } else {
                return locale;
            }
        },
        
        setDatabaseLocale: function(locale) {
            this.log('Calling deprecated method setDatabaseLocale(locale)');
            this.setLocale(locale);
            //return this.ls.setItem('locale', locale);
        },

        getDatabaseTimestamp: function () {
            return this.ls.getItem('db_timestamp_' + this.getDatabaseLocale());
        },

        setDatabaseTimestamp: function (timestamp) {
            background.ls.setItem('db_timestamp_' + this.getDatabaseLocale(), timestamp);
        },
        
        loadJson: function(url) {
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
        },
    
        reloadJsonStats: function() {
            return this.loadJson('/json/' + this.getDatabaseLocale() + '/stats.json');
        },
    
        loadDictionary: function() {
            return this.loadJson('/json/' + this.getDatabaseLocale() + '/database.json');
        },

        loadAllFunctionsArray: function() {
            return this.loadJson('/json/' + this.getDatabaseLocale() + '/functions.json');
        }
    };

}();

/*
//set default locale
chrome.i18n.setLocale(background.getLocale());
if (!background.ls.getItem('locale')) {
	background.setLocale(background.getLocale());
}
*/

// open database connection
window.background.openModel();

window.background.ga.setEnabled(window.background.isCollectUsageDataEnabled());


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22811638-1']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(function() {
    $('#backgroundTestsLink').attr('href', chrome.extension.getURL('/background-tests.html'));
});

