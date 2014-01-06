
function InstallerBackground() {

    "use strict";
    
    var progressCallback;
    var startedAt = 0;

    this.install = function (onChangeCallback) {
        
        progressCallback = onChangeCallback;
        
        startedAt = new Date().getTime();
        
        //setTimeout(function() {
        background.ga.trackEvent('install', 'start');
        background.ls.setItem('db_installation_status_' + background.getDatabaseLocale(), 'pending');
        //background.model.create(background.getTableName());
        
        //setTimeout (function() {
        background.model.drop(function() {
            background.model.initTables();

            var bigJson = background.loadDictionary();
            var allFunctions = background.loadAllFunctionsArray();
            var stats = background.reloadJsonStats();

            var totalCount = allFunctions.length;
            //var processed = 0;
            var index = 0;
            var method, pclass, php_ver, json;

            var loop = function() {
                var objArray = [];

                var max = index + 150;
                if (max > totalCount) {
                    max = totalCount;
                }
                
                //for (var key in bigJson) {
                for (; index < max; index++) {
                    //var json = bigJson[index].json;
                    json = bigJson[allFunctions[index]];

                    method = json['name'];
                    pclass = typeof json['class'] === 'undefined' ? null : json['class'];
                    php_ver = json['ver'];

                    delete json['name'];
                    delete json['class'];
                    delete json['ver'];

                    objArray.push({
                        method: method,
                        pclass: pclass,
                        php_version: php_ver,
                        json:   JSON.stringify(json)
                    });
                    
                    /*index++;
                    if (index > 150) {
                        break;
                    }*/
                }
                background.model.insert(objArray, function(response) {
                    if (response.insertId == totalCount || max == response.insertId) {
                        
                        try {
                            progressCallback(response.insertId);
                        } catch(err) { console.log('popup window doesn\'t exists. But it\'s ok, I can handle that.'); }


                        if (max == response.insertId && response.insertId != totalCount) {
                            // end of this loop but installation is not done
                            // all item in this objArray, add another one
                            setTimeout(loop, 10);
                        } else if (response.insertId == totalCount) { // installation done
                            // check if the popup windows is still opened
                            if (chrome.extension.getViews({ type: 'popup'}).length === 0) {
                                background.ga.trackEvent('install', 'finished', 'only-background');
                            }
                            background.ga.trackEvent('install', 'finished', 'duration', background.installer.timeElapsed());
                            background.setDatabaseTimestamp(stats.timestamp);
                            background.ls.setItem('db_installation_status_' + background.getDatabaseLocale(), 'finished');
                        }
                    }

                });

            };
            //setTimeout(loop, 10);
            loop();
        });
        //}, 200);
    };
    
    this.timeElapsed = function() {
        return (new Date().getTime()) - startedAt;
    };
    
    this.continueInstallation = function (callback) {
        background.ga.trackEvent('install', 'continue');
        progressCallback = callback;
    };

}
