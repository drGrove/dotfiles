
function InstallerBackground() {

    "use strict";
    
    var progressCallback;
    var finishedCallback;
    var startedAt = 0;

    this.install = function(onChangeCallback, onFinishedCallback) {

        // make sure you drop all possibly existing WebSQL databases
        try {
            var sqliteDB = new Database();
            if (sqliteDB) {
                for (var db_lang in background.languages) {
                    sqliteDB.table.drop('ninja-php-manual-' + db_lang, function(tableName) {
                        background.log('removing SQLlite DB: ', tableName);
                    });
                }
            }
        } catch (e) { }

        progressCallback = onChangeCallback;
        finishedCallback = onFinishedCallback;
        
        startedAt = new Date().getTime();
        
        //setTimeout(function() {
        background.ga.trackEvent('install', 'start');
        background.ls.setItem('db_installation_status_' + background.getDatabaseLocale(), 'pending');
        //background.model.create(background.getTableName());
        
        //setTimeout (function() {
        background.model.drop(function() {
            //background.model.initTables();

            var bigJson = background.loadDictionary();
            var allFunctions = background.loadAllFunctionsArray();
            var stats = background.loadJsonStats();

            var totalCount = allFunctions.length;
            //var processed = 0;
            var index = 0;
            var savedCount = 0;
            //var savedCount = 0;
            var method, pclass, php_ver, json;


            function getPreparedObject(index) {
                json = bigJson[allFunctions[index]];

                method = json['name'] ? json['name'] : null;
//                pclass = json['class'] ? json['class'] : null;
                pclass = typeof json['class'] === 'undefined' ? json['name'] : json['class'];
                // php_ver = json['ver'];

                //delete json['name'];
                //delete json['class'];
                // delete json['ver'];

                var obj = {
                    'full_name': allFunctions[index].toLowerCase(),
                    'name': method,
                    'class': pclass,
                    // 'php_version': php_ver,
                    'json': JSON.stringify(json)
                };
                return obj;
            }

            function callback(response) {
                savedCount++;

                // everything is processed
                if (savedCount === totalCount) {
                    if (chrome.extension.getViews({ type: 'popup'}).length === 0) {
                        background.ga.trackEvent('install', 'finished', 'only-background');
                    }
                    background.ga.trackEvent('install', 'finished', 'duration', background.installer.timeElapsed());
                    background.setDatabaseTimestamp(stats.timestamp);
                    background.ls.setItem('db_installation_status_' + background.getDatabaseLocale(), 'finished');

                    if ($.isFunction(finishedCallback)) {
                        finishedCallback(savedCount);
                    }

                    return;
                }
                
                // update progressbar
                if (savedCount % 100 === 0) {
                    try {
                        progressCallback(savedCount);
                    } catch(err) { console.log('popup window doesn\'t exists. But it\'s ok, I can handle that.'); }
                }

                // if (max == response.insertId && response.insertId != totalCount) {
                //     // end of this loop but installation is not done
                //     // all item in this objArray, add another one
                //     setTimeout(loop, 10);
                // } else if (response.insertId == totalCount) { // installation done
                //     // check if the popup windows is still opened
                // }

                // insert next item
                background.model.insert(getPreparedObject(savedCount), callback);
            }
            background.model.insert(getPreparedObject(0), callback);

        });
        //}, 200);
    };
    
    this.timeElapsed = function() {
        return (new Date().getTime()) - startedAt;
    };
    
    this.continueInstallation = function(onChangeCallback, onFinishedCallback) {
        background.ga.trackEvent('install', 'continue');
        progressCallback = onChangeCallback;
        finishedCallback = onFinishedCallback;
    };

}
