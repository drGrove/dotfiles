
function Database(debug) {
    
    if (!debug) {
        debug = false;
    }
    
    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }
    
    var onSuccess = function (t, result) {
        if (debug) {
            console.log('WebSQL Success, result: ', result);
        }
    };
    
    var onError = function (errt, sqlError) {
        if (debug) {
            console.log('WebSQL Error: ', sqlError);
        }
    };
    
    
    try {
        dbObject = window.openDatabase('pnm', '1.0', 'PHP Ninja Manual database', 50 * 1024 * 1024, function(db) { });
    } catch (e) {
    	return false;
    }
    
    dbObject.query = function(query, vals, succCallback, errorCallback, readOnly) {

        if (typeof vals === "string") {
            vals = [ vals ];
        }
        
        if (readOnly) {
            this.readTransaction(function (tx) {
                tx.executeSql(query, vals,
                    function(tx, result) {onSuccess(tx, result);if (succCallback) succCallback(tx, result);},
                    function(errt, sqlError) {onError(errt, sqlError);if (errorCallback) errorCallback(errt, sqlError);}
                );
            });
        } else {
            this.transaction(function (tx) {
                tx.executeSql(query, vals,
                    function(tx, result) {onSuccess(tx, result);if (succCallback) succCallback(tx, result);},
                    function(errt, sqlError) {onError(errt, sqlError);if (errorCallback) errorCallback(errt, sqlError);}
                );
            });
        }
    };
    
    dbObject.drop = function() {
        console.log('To delete Web SQL Database navigate to Google\\Chrome\\User Data\\Default\\databases and delete appropriate folder.');
        console.log('You might have to close all tabs with website/extension which database you want to delete.');
    };
    
    
    dbObject.table = {
        insert: function (table, values, succCallback) {
            if (values && (!(values instanceof Array)) && !values.length) {
                values = [values];
            }
        
            dbObject.transaction(function(tx) {

                for (var tr in values) {
                    keys = new Array();
                    vals = new Array();
                    plac = new Array(); // placeholders

                    for (var i in values[tr]) {
                        keys.push(i);
                        vals.push(values[tr][i]);
                        plac.push('?');
                    }

                    var sql = 'INSERT INTO `' + table + '` (' + keys.toString() + ') VALUES (' + plac.toString() + ')';
                    //var sql = 'INSERT INTO test_table (id,name) VALUES ("5","ahoj")';
                    if (debug) {
                        console.log('Keys:', keys.toString());
                        console.log('Values:', vals.toString());
                        console.log(sql);
                    }

                    tx.executeSql(sql, vals, function(tx, response) {
                        onSuccess(tx, response);
                        if (succCallback) {
                        	succCallback(response);
                        }
                    }, onError);
                }
            });
        },
        
        create: function (table) {
            dbObject.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS ' + table, [], null, null);
                for (var i in dbTableDefinitions) {
                    if (-1 != dbTableDefinitions[i].indexOf('TABLE ' + table) || -1 != dbTableDefinitions[i].indexOf('TABLE IF NOT EXISTS ' + table)) {
                        foundTableDef = true;
                        tx.executeSql(dbTableDefinitions[i], [ ], onSuccess, onError);
                    }
                }
                for (var i in dbTableIndexes) {
                    if (-1 != dbTableIndexes[i].indexOf('ON ' + table)) {
                        tx.executeSql(dbTableIndexes[i], [ ], onSuccess, onError);
                    }
                }
                if (!foundTableDef) {
                    console.log('Table "' + table + '" definition not found');
                }
            });
        },
    
        empty: function (table) {
            dbObject.transaction(function (t) {
                t.executeSql('DELETE FROM `' + table + '`', [ ], onSuccess, onError);
            });
        },

        drop: function (table, succCallback, errorCallback) {
            dbObject.transaction(function (t) {
                t.executeSql('DROP TABLE IF EXISTS `' + table + '`', [ ], 
                    function(tx, result) {onSuccess(tx, result);if (succCallback) succCallback(table, tx, result);},
                    function(errt, sqlError) {onError(errt, sqlError);if (errorCallback) errorCallback(table, errt, sqlError);}
                );
            });
        },

        count: function (table, callback) {
            dbObject.query('SELECT COUNT(*) AS count FROM `' + table + '`', [ ], function(t,result) {
                console.log(result);
                callback(result.rows.item(0).count);
            });
        }

        /*reset: function (table) {
            dbObject.table.drop(table,
                function(tx, result) { dbObject.table.create(table); },
                function(errt, sqlError) { dbObject.table.create(table); }
            );
            
        }*/
    };
    
    return dbObject;
    
};

/*

// empty
db.emptyTable('test_table');
*/