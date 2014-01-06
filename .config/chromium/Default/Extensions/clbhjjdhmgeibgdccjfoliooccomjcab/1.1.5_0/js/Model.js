
function Model(table, db) {
    
    //var db = databaseConnection;
    
    //var table = tableName;
    
    var dbTables = [
        'CREATE TABLE IF NOT EXISTS ' + table + ' (id INTEGER PRIMARY KEY ASC AUTOINCREMENT, method, pclass, php_version, json)'
    ];
    var dbIndexes = [
        'CREATE INDEX IF NOT EXISTS method_idx ON ' + table + ' (method)',
        'CREATE INDEX IF NOT EXISTS class_idx ON ' + table + ' (pclass)',
        'CREATE INDEX IF NOT EXISTS search_idx ON ' + table + ' (method, pclass)',
    ];
    
    //var db = new Database('pnm', '1.0', 'PHP Ninja Manual database', 50 * 1024 * 1024, dbTables, dbIndexes, true);

    
    this.initTables = function () {
        for (var i in dbTables) {
            db.query(dbTables[i]);
            //background.log('creating table...');
        }
        for (var i in dbIndexes) {
            db.query(dbIndexes[i]);
            //background.log('creating index...');
        }
    };
    this.initTables();
    
    this.findAutocomplete = function(searchTerm, callback) {
        background.log('Model.find', '(', searchTerm.toString(), ')');
        
        var sql;
        var up = 'UNION SELECT method, pclass, php_version, ';
        var term = searchTerm.toString().toLowerCase();
        var lclass = searchTerm.isClass() ? searchTerm.getClass().toLowerCase() : term;
        var lmethod = searchTerm.getMethod() ? searchTerm.getMethod().toLowerCase() : term;

        var sql = 'SELECT method, pclass, php_version, ';
        var binds = [ ];


        // full name (eg. "array_slice", "in_array", "DateTime::getFilename")
        sql += '100 AS prio FROM ' + table + ' WHERE (LOWER(method) = ?) OR (LOWER(pclass) = ? AND LOWER(method) = ?) '; // simple method name (eg. strpos, array_splice)
        binds.push(term, lclass, lmethod);

        // a class name
        sql += up + '200 AS prio FROM ' + table + ' WHERE LOWER(pclass) = ? ';
        binds.push(term);

        // starting with DateTi..., str_rep...
        if (searchTerm.isClassAndMethod()) {
            sql += up + '300 AS prio FROM ' + table + ' WHERE LOWER(pclass) = ? AND LOWER(method) REGEXP ? ';
            binds.push(lclass, "^" + lmethod + ".{1,}");
        } else {
            sql += up + '300 AS prio FROM ' + table + ' WHERE LOWER(pclass) REGEXP ? OR LOWER(method) REGEXP ? ';
            binds.push("^" + lmethod + ".{1,}", "^" + lmethod + ".{1,}");
        }

        // part or end
        if (!searchTerm.isClassAndMethod()) {
            //sql += up + '400 AS prio FROM ' + table + ' WHERE LOWER(pclass) = ? AND LOWER(method) REGEXP ?';
            //binds.push(lclass, ".{1,}" + lmethod + ".{0,}");
        //} else {
            sql += up + '400 AS prio FROM ' + table + ' WHERE LOWER(method) REGEXP ? OR LOWER(pclass) REGEXP ? ';
            binds.push(".{1,}" + lmethod + ".{0,}", ".{1,}" + lmethod + ".{0,}");
        }

        // sort and limit
        sql += 'ORDER BY prio, pclass, method LIMIT 0,' + (term.length <= 3 ? '50' : '100');
        
        //background.log(sql, binds);
        //console.log(lclass, lmethod, binds);
        
        db.query(sql, binds, function(tx, result) {
            if ($.isFunction(callback)) {
                callback(result);
            }
        }, function(tx, response) { // error callback
            //console.log(response);
        });
    };
        
    this.findObject = function(searchTerm, callback) {
        //console.log(searchTerm instanceof SearchTerm);
        if (!(searchTerm instanceof SearchTerm)) {
            throw 'Invalid argument, `searchTerm` must be instance of SearchTerm class.';
        }

        background.log('Model.findObject', '(', searchTerm.toString(), ')');
        
        var sql, arr, what = "method, pclass, json, php_version";
        if (searchTerm.isOnlyClass()) {
            sql = "SELECT " + what + " FROM " + table + " WHERE pclass = ? AND method IS NULL LIMIT 0,1";
            arr = [ searchTerm.getClass() ];
        } else if (searchTerm.isClassAndMethod()) {
            sql = "SELECT " + what + " FROM " + table + " WHERE pclass = ? AND method = ? LIMIT 0,1";
            arr = [ searchTerm.getClass(), searchTerm.getMethod() ];
        } else {
            sql = "SELECT " + what + " FROM " + table + " WHERE (method = ? AND pclass IS NULL) OR (method IS NULL AND pclass = ?) LIMIT 0,1";
            arr = [ searchTerm.toString(), searchTerm.toString() ];
        }
        
        db.query(sql, arr, function(tx, result) {
            if ($.isFunction(callback)) {
                callback(result.rows.length > 0 ? result.rows.item(0) : null);
            }
        }, function(tx, response) { // error callback
            console.log(response);
        });
        
    };
    
    this.findClassMethods = function(searchTerm, callback) {
        
        background.log('Model.findClassMethods', '(', searchTerm.toString(), ')');
        var sql = "SELECT method, pclass, json FROM " + table + " WHERE pclass = ? ORDER BY method";
        
        db.query(sql, [ searchTerm.getClass() ], function(tx, result) {
            if ($.isFunction(callback)) {
                callback(result.rows);
            }
        });

    };
    
    this.insert = function(objects, callback) {
        db.table.insert(table, objects, callback);
    };
    
    this.count = function(callback, errorCallback) {
        var sql = "SELECT COUNT(*) AS count FROM " + table;
        db.query(sql, [ ],
            function(tx, result) {
                if ($.isFunction(callback)) {
                    callback(result.rows.item(0).count);
                }
            }, function(tx, result) {
                if ($.isFunction(errorCallback)) {
                    errorCallback();
                }
            }
        );
    };
    
    this.drop = function(callback, all) {
        if (typeof all !== 'undefined' && all) {
            tables = background.getTables();
        } else {
            tables = new Array(table);
        }
        
        for (t in tables) {
            db.table.drop(tables[t], function(tx, result) {
                if ($.isFunction(callback)) {
                    callback(result);
                }
            });
        }
    };

    this.isReadable = function (callback) {
        var sql = "SELECT * FROM " + table + " LIMIT 0,1";
        db.query(sql, [ ], function (tx, result) {
            if ($.isFunction(callback)) {
                callback(true);
            }
        }, null, false);
    };
    
    this.getTable = function() {
        return table;
    };
    
}
