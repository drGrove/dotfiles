/**
 * i18n: modified i18n support for Google Chrome allowing you to change your
 *       current locale as you want.
 *       
 * Inspired by Michael Gundlach's AdBlock
 *     https://chrome.google.com/webstore/detail/gighmmpiobklfepjocnamgkkbiglidom
 *     https://adblockforchrome.googlecode.com/svn/trunk/port.js
 * 
 * author: Martin Sikora http://www.martinsikora.com
 * licence: MIT
 * 
 */

// keep the old chrome.i18n
chrome.i18n_old = chrome.i18n;

chrome.i18n = (function() {
    
    // all messages id 3-dimensional array (locale -> key -> message)
    var messages = { };
    
    // by default locale is browser's locale
    var locale = chrome.i18n_old.getMessage('@@ui_locale');
    
    
    return {

        getLocale: function() {
            return locale;
        },

        setLocale: function(new_locale) {
            locale = new_locale;
        },

        getMessage: function(key, args) {
            
            // keep original functionality
            if (key.indexOf('@@') == 0) {
                return chrome.i18n_old.getMessage(key);
                
            // check if there are any messages for the current locale
            } else if (!messages[this.getLocale()]) {

                locales = new Array();
                
                // == Find all locales we might need to pull messages from, in order
                // 1: The user's current locale (e.g. "en_US")
                locales.push(this.getLocale());
                // 2: Perhaps a region-agnostic version of the current locale
                if (this.getLocale().length > 2) {
                    locales.push(this.getLocale().substring(0, 2));
                }
                // 3: Set default locale as defined in manifest.json (optional)
                // only if manifest.js is included
                if (chrome.manifest && chrome.manifest.default_locale) {
                    locales.push(chrome.manifest.default_locale);
                }

                // load all locale files that exist in the list
                for (var i = 0; i < locales.length; i++) {
                    this.setLocale(locales[i]);
                    var file = '/_locales/' + locales[i] + '/messages.json';
                    
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.responseText) {
                            // put parsed json among other messages
                            messages[chrome.i18n.getLocale()] = JSON.parse(xhr.responseText);
                        }
                    };
                    xhr.open('GET', chrome.extension.getURL(file), false);
                    try {
                        xhr.send();
                        break;
                    } catch(e) { }
                }
            }
            
            var messageObj = messages[this.getLocale()][key];
            if (messageObj) {
                var msg = messageObj.message;
                
                // replace placeholders with its contents
                for (var placeholder in messageObj.placeholders) {
                    msg = msg.replace(new RegExp('\\$' + placeholder + '\\$', 'ig'), messageObj.placeholders[placeholder].content);
                }
                
                // replace $X with arguments
                if (typeof args == "string") {
                    args = new Array(args);
                }
                
                for (var i in args) {
                    msg = msg.replace(new RegExp('\\$' + (parseInt(i) + 1), 'ig'), args[i]);
                }
                
                return msg;
            } else { // message not found
                // dump all loaded locales
                loadedLocales = new Array();
                for (l in messages) {
                    loadedLocales.push(l);
                }
                console.log('No message found for key "' + key + '". Loaded locales: ' + loadedLocales.toString());
                return null;
            }

        },

        /**
         * the same functionality as original getAcceptLanguages()
         */
        getAcceptLanguages: function() {
            chrome.i18n_old.getAcceptLanguages(arguments);
        }
        
    };
})();

