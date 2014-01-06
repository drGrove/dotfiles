
function Model(db) {
    
    var that = this;
    var indexedDB = window.webkitIndexedDB;
    var stop = false;
    indexedDB.db = null;


    // default error handler
    indexedDB.onerror = function() {
        console.log('IndexedDB error: ', arguments);
    }

    var requiredVersion = 4;

    function init() {
        var request = indexedDB.open(db, requiredVersion);

        request.onerror = indexedDB.onerror;
        request.onsuccess = function(e) {
            indexedDB.db = e.target.result;
        }
        request.onupgradeneeded = function(e) {
            console.log('Upgrading IndexedDB model');
            indexedDB.db = event.target.result;

            // try catch NotFoundError?
            try {
                indexedDB.db.deleteObjectStore('methods');
            } catch (e) {} // no problem

            var objectStore = indexedDB.db.createObjectStore('methods', { keyPath: 'full_name' });

            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('class', 'class', { unique: false });

            // };
        }
    }

    init();

    function _getStore(mode) {
        if (typeof mode === 'undefined') {
            mode = 'readonly';
        }
        return indexedDB.db.transaction(['methods'], mode).objectStore('methods');
    }
    

    this.findAutocomplete = function(searchTerm, callback, errorCallback) {
        if (!(searchTerm instanceof SearchTerm)) {
            throw 'Invalid argument, `searchTerm` must be instance of SearchTerm class.';
        }

        // background.log('Model.findAutocomplete', '(', searchTerm.toString(), ')');
        
        //this.findObject(searchTerm, function(obj) {
            //callback([ obj ]);
        var store = _getStore();
        var lowercaseString = searchTerm.toString().toLowerCase();
        var lowerBoundKeyRange = webkitIDBKeyRange.lowerBound(lowercaseString);
        var cursor = store.openCursor(lowerBoundKeyRange);
        var indexedDBResults = [ ];
        var limit = 70;
        var foundCount = 0;

        cursor.onsuccess = function(e) {
            var innercursor = e.target.result;

            if (foundCount === limit) {
                callback(indexedDBResults, true);
                return;
            // starts with searched term
            } else if (innercursor && innercursor.value.full_name.indexOf(lowercaseString) === 0) {
                // cursor item starts with searched term
                // if (innercursor.value.name !== null) {
                termObj = new SearchTerm(innercursor.value.name, innercursor.value.class);
                termObj.setObject(innercursor.value);
                indexedDBResults.push(termObj);

                foundCount++;
                // }
                innercursor.continue();
            } else { // no more items found in indexedDB
                callback(indexedDBResults);
                var useFuzzySearch = false;
                var naclTerms;
                var internalIndex;
                stop = false;

                function run_fuzzy_search() {
                    useFuzzySearch = true;
                    background.nacl.sendMessage('fuzzy_search', { 'term': lowercaseString, 'max': limit - foundCount });
                }

                // function addNextItem() {
                //     if (stop) {
                //         return;
                //     }

                //     // console.log(naclTerms[internalIndex]);
                //     var foundPositions = null;
                //     if (naclTerms[internalIndex]['pos']) {
                //         foundPositions = naclTerms[internalIndex].pos;
                //     }
                //     that.findObject(new SearchTerm(naclTerms[internalIndex].name), function(result) {
                //         // @todo: check what comes as result. It seems that at some situation it returns empty array of length 1
                //         // eg. preg_r generates this error
                //         if (result) {
                //             if (stop) {
                //                 return;
                //             }
                //             var isLastCall = (foundCount + 1 === limit || internalIndex == naclTerms.length - 1);
                //             // callback([result], isLastCall, foundPositions);
                //         }

                //         internalIndex++;
                //         foundCount++;
                        
                //         if (internalIndex < naclTerms.length && foundCount < limit) {
                //             addNextItem();
                //         }
                //     });

                //     if (internalIndex == naclTerms.length - 1 && !useFuzzySearch) {
                //         run_fuzzy_search();
                //     }
                // }

                background.nacl.messageCallback = function(response) {
                    // background.log('NaCl response', response);

                    // sort contains array by item length
                    // response['contains'].sort(function(a, b) {
                    //     return a.name.length > b.name.length;
                    // });
                    
                    internalIndex = 0;

                    // this part has to be called synchronously to keep order of items
                    if (useFuzzySearch) {
                        naclTerms = response;
                        if (naclTerms) {
                            naclTerms.sort(function(a, b) {
                                aLen = a.name.length;
                                bLen = b.name.length;
                                if (aLen == bLen) {
                                    return 0;
                                } else {
                                    return aLen > bLen ? 1 : -1;
                                }
                            });
                        }
                    } else {
                        naclTerms = response['contains'];
                    }

                    foundItems = [];
                    foundPositions = [];
                    if (foundCount < limit) {
                        for (var i=0; i < naclTerms.length; i++) {
                            foundItems.push(new SearchTerm(naclTerms[i].name));
                            foundPositions.push(naclTerms[i].pos);

                            foundCount++;
                            if (foundCount === limit) {
                                break;
                            }
                        }
                    }

                    callback(foundItems, (useFuzzySearch === true), foundPositions);

                    
                    // if (naclTerms.length > 0) {
                    //     addNextItem();
                    // } else if (!useFuzzySearch) {
                    //     run_fuzzy_search();
                    // }

                    if (!useFuzzySearch) {
                        run_fuzzy_search(); // this will make call callback again
                    }


                    // for (var i=0; i < naclTerms.length && foundCount < limit; i++) {
                    //     defer.then(function() {
                    //         console.log(naclTerms[internalIndex]);
                    //         internalIndex++;
                    //         // that.findObject(new SearchTerm(naclTerms[index].name), function(result) {
                    //         //     callback([result], foundCount + 1 === limit);
                    //         //     foundCount++;
                    //     }); //);
                    // }

                    // defer.resolve(naclTerms);
                }
                background.nacl.sendMessage('standard_search', { 'term': lowercaseString, 'max': limit - foundCount });

                return;

                // @TODO: some sort of fuzzy search
                //var postfixArray = [ ];
                // var containsArray = [ ];
                // var fulltextRequest = store.openCursor();
                // var termLen = searchTerm.toString().length;
                // var termString = searchTerm.toString();
                // stop = false;

                // fulltextRequest.onsuccess = function(e) {
                //     // stop immediately
                //     if (stop) {
                //         callback(containsArray, true);
                //         stop = false;
                //         return;
                //     }

                //     var result = e.target.result;
                //     if (!result || foundCount === limit) {
                //         //if (containsArray.length > 0) {
                //         background.log('Model.findAutocomplete', '(', searchTerm.toString(), ') callback');
                //         callback(containsArray, true);
                //         //}
                //         return;
                //     }
                //     var pos = result.value.full_name.indexOf(termString);
                //     // we're not interested in 0, because it means string begins or is search term
                //     // these cases are already covered in preveious cursor range!
                //     if (pos > 0) {
                //         if (pos === result.value.full_name.length - termLen) {
                //             callback([result.value]);
                //         } else {
                //             //callback([result.value]);
                //             containsArray.push(result.value);
                //         }
                //         foundCount++;
                //     }
                    
                //     result.continue();
                // }
                // fulltextRequest.onerror = $.isFunction(errorCallback) ? errorCallback : indexedDB.onerror;
            }
        };
        cursor.onerror = $.isFunction(errorCallback) ? errorCallback : indexedDB.onerror;

        //});

    };

    this.stop = function() {
        stop = true;
    }
       
    this.findObject = function(searchTerm, callback, errorCallback, fieldName) {
        var lowercaseString;
        if (searchTerm instanceof SearchTerm) {
            lowercaseString = searchTerm.toString().toLowerCase();
            // throw 'Invalid argument, `searchTerm` must be instance of SearchTerm class.';
        } else {
            lowercaseString = searchTerm.toLowerCase();
        }
        // background.log('Model.findObject', '(', lowercaseString, ')');

        var store = _getStore();
        var request;
        // var lowercaseString = searchTerm.toString().toLowerCase();
        // fieldName = typeof fieldName === 'undefined' ? 'full_name' : fieldName;


        //is class for sure or starts with uppercase letter
        // || searchTerm.toString()[0] === searchTerm.toString()[0].toUpperCase()
        // if (searchTerm.isClass() || fieldName === 'full_name') {
        // if (fieldName === 'full_name') {
        //     request = store.get(lowercaseString);
        // } else {
        //     // request = store.index('name').get(lowercaseString);
        //     request = store.index('name').get(lowercaseString);
        // }
        //var request = store.get(lowercaseString);

        request = store.get(lowercaseString);

        //var result = [ ];
        //var cursorRequest = index.openCursor(range);
        request.onsuccess = function(e) {
            // it looks like it's a class name because we didn't find anything in datastore
            if (!!e.target.result) {
                callback(e.target.result ? e.target.result : null);
            } else if (lowercaseString.substr(-2) !== '::') {
                that.findObject(lowercaseString + '::', callback);
            } else {
                callback(null);
            }
        };
        request.onerror = typeof errorCallback === 'function' ? errorCallback : indexedDB.onerror;
    };

    
    this.findClassMethods = function(searchTerm, callback, errorCallback) {
        if (!(searchTerm instanceof SearchTerm)) {
            throw 'Invalid argument, `searchTerm` must be instance of SearchTerm class.';
        }

        var store = _getStore();
        var lowerBoundKeyRange = webkitIDBKeyRange.lowerBound(searchTerm.getClass(), false);
        var results = [ ];
        var cursor = store.index('class').openCursor(lowerBoundKeyRange);

        cursor.onsuccess = function(e) {
            var innercursor = event.target.result;
            if (innercursor && innercursor.value.class === searchTerm.getClass()) {
                // skip class::class
                if (innercursor.value.name !== null) {
                    results.push(innercursor.value);
                }
                innercursor.continue();
            } else {
                callback(results);
            }
        };
        cursor.onerror = $.isFunction(errorCallback) ? errorCallback : indexedDB.onerror;
    };
    
    this.insert = function(objects, callback, errorCallback) {
        var store = _getStore('readwrite');
        var request = store.put(objects);

        request.onsuccess = $.isFunction(callback) ? callback : function(e) {
            callback(e.target);
        };
        request.onerror = $.isFunction(errorCallback) ? errorCallback : indexedDB.onerror;
    };
    
    this.count = function(callback, errorCallback) {
        var store = _getStore('readonly');
        var request = store.count();

        request.onsuccess = function(e) {
            if (typeof callback === 'function') {
                callback(e.target.result);
            }
        };
        request.onerror = $.isFunction(errorCallback) ? errorCallback : indexedDB.onerror;
    };

    this.delete = function(keyPath, callback, errorCallback) {
        var store = _getStore('readwrite');
        var request = store.delete(keyPath);

        request.onsuccess = $.isFunction(callback) ? callback : null;
        request.onerror = $.isFunction(errorCallback) ? errorCallback : indexedDB.onerror;
    };
    
    this.drop = function(callback, errorCallback) {
        var store = _getStore('readwrite');
        var clearRequest = store.clear();

        if ($.isFunction(callback)) {
            clearRequest.onsuccess = callback;
        }
        clearRequest.onerror = $.isFunction(errorCallback) ? errorCallback : indexedDB.onerror;

    };

//    this.isReadable = function (callback) {
//        if (indexedDB.db === null) {
//            var counter = 0;
//            var interval = setTimeout(function() {
//                if (indexedDB.db === null) {
//                    counter++;
//                } else {
//                    window.clearInterval(interval);
//                    callback();
//                }
//            }, 15);
//        } else {
//            callback();
//        }
//    };
    
    this.getTable = function() {
        return db;
    };

    
}
