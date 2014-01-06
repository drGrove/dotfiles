"use strict";

function logTime(duration) {
    return 'Result fetched in: ' + (duration / 1000) + 's - ' + (duration < 50 ? 'fast enough' : '');
}

window.BackgroundTests = {

    run: function () {

        var background = window.background;
        var SearchTerm = chrome.extension.getBackgroundPage().SearchTerm;
        var stats;
        var DB_FETCH_TIME_LIMIT_MS = 100;
        var DB_COUNT_TIME_LIMIT_MS = 150;

        // force QUnit to run all tests in default order
        QUnit.config.reorder = false;

        module('Internals');
        test('SearchTerm class', function() {
            var testName, st;
            // test correct behaviour with only method name
            testName = 'array_merge';
            st = new SearchTerm(testName);
            equal(st.toString(), testName, 'toString name: ' + st.toString());
            equal(st.getMethod(), testName, 'method name: ' + st.getMethod());
            equal(st.getClass(), null, 'class name: ' + st.getClass());
            ok(!st.isClass(), testName  + ' is not a class');
            ok(!st.isOnlyClass(), testName  + ' is not only a class');
            ok(!st.isClassAndMethod(), testName  + ' is not a class and a method');
            equal(st.getVersion(), null, 'no PHP version specified');

            // test correct behaviour class::method name
            testName = 'DateTime::getTimestamp';
            st = new SearchTerm(testName, null, 'PHP 5');
            equal(st.toString(), testName, 'toString name: ' + st.toString());
            equal(st.getMethod(), 'getTimestamp', 'method name: ' + st.getMethod());
            equal(st.getClass(), 'DateTime', 'class name: ' + st.getClass());
            ok(st.isClass(), testName  + ' is a class');
            ok(!st.isOnlyClass(), testName  + ' is not only a class');
            ok(st.isClassAndMethod(), testName  + ' is a class and a method');
            equal(st.getVersion(), 'PHP 5', 'since ' + st.getVersion());

            // test correct behaviour class::class name
            testName = 'DateTimeZone::';
            st = new SearchTerm(null, testName, 'some text');
            equal(st.toString(), 'DateTimeZone', 'toString name: ' + st.toString());
            equal(st.getMethod(), null, 'method name: ' + st.getMethod());
            equal(st.getClass(), 'DateTimeZone', 'class name: ' + st.getClass());
            ok(st.isClass(), testName  + ' is a class');
            ok(st.isOnlyClass(), testName  + ' is only a class');
            ok(!st.isClassAndMethod(), testName  + ' is not a class and a method');
            equal(st.getVersion(), null, 'no useful PHP version');

        });
        
        /*
        test('Function Definition Simplifier', function() {
            var expected;
            expected = $.functionDeclarationSimplifier('int strcasecmp(string $str1, string $str2 )');
            equal(expected, 'strcasecmp($str1, $str2)', expected);

            expected = $.functionDeclarationSimplifier('int strpos ( string $haystack, mixed $needle [, int $offset = 0 ] )');
            equal(expected, 'strpos($haystack, $needle, $offset)', expected);

            expected = $.functionDeclarationSimplifier('DOMNode DOMNode::insertBefore ( DOMNode $newnode [, DOMNode $refnode ] )');
            equal(expected, 'DOMNode::insertBefore($newnode, $refnode)', expected);

            expected = $.functionDeclarationSimplifier('string sprintf ( string $format [, mixed $args [, mixed $... ] ] )');
            equal(expected, 'sprintf($format, $args, $...)', expected);

            expected = $.functionDeclarationSimplifier('mixed sscanf ( string $str, string $format [, mixed &$... ] )');
            equal(expected, 'sscanf($str, $format, &$...)', expected);
        });
        */
        
        module('Database');
        test('Switching languages', function() {
            // test switching language versions
            background.setLocale('sp');
            equal(background.getDatabaseLocale(), 'sp', 'Database locale: ' + background.getDatabaseLocale());
            equal(background.getTableName(), 'ninja-php-manual-sp', 'Database table name: ' + background.getTableName());

            background.setLocale('en');
            equal(background.getDatabaseLocale(), 'en', 'Database locale: ' + background.getDatabaseLocale());
            equal(background.getTableName(), 'ninja-php-manual-en', 'Database table name: ' + background.getTableName());
        });

        test('Database timestamp', function() {
            // make sure database is properly installed before fetching data
            stats = background.loadJsonStats();
            equal(background.getDatabaseTimestamp(), stats.timestamp, "English database is installed with timestamp: " + background.getDatabaseTimestamp());
        });

        

        function testDbItems() {
            var stats = background.loadJsonStats();
            var st = new Date().getTime();

            background.model.count(function(count) {
                test('Number of items in database', 2, function() {
                    // test speed
                    var duration = new Date().getTime() - st;
                    ok(duration < DB_COUNT_TIME_LIMIT_MS, logTime(duration));

                    // total number of items in the database
                    equal(count, stats.methods, 'Items count should be: ' + count);
                });
                start();

                testDatabaseObject('http_response_code');
                testDatabaseObject('DateTimeZone');
                testDatabaseObject('DateTime::format');

                testDatabaseObjectsByClass('DateTimeZone::DateTimeZone', [ '__construct', 'getLocation', 'getName', 'getOffset', 'getTransitions', 'listAbbreviations', 'listIdentifiers' ]);

                testAutocomplete('preg_match', ['preg_match', 'preg_match_all']);
                testAutocomplete('str_replace', ['str_replace', 'substr_replace']);
                // start();

            });
        }

        /**
         * defered installer db
         */
        setTimeout(function() {
            module('Database responses');
            background.setLocale('en');

            var st = new Date().getTime();
            background.installer.install(null, function() {
                background.log('install: ' + logTime(new Date().getTime() - st));
                testDbItems();
            });
        }, 200);

            
            // asyncTest('Database readable', 1, function() {
            //     var st = new Date().getTime();
            //     background.model.isReadable(function(result) {
            //         // test speed
            //         var duration = new Date().getTime() - st;
            //         ok(duration < DB_FETCH_TIME_LIMIT_MS, logTime(duration));

            //         start();
            //     });
            // });

            // asyncTest('Insert object into IndexedDB', 2, function() {
            //     var st = new Date().getTime();
            //     var obj = {
            //         'full_name': 'str_foobar',
            //         'name': 'str_foobar',
            //         'class': null
            //     };
            //     background.model.insert(obj, function(result) {
            //         //console.log(result);
            //         // test speed
            //         var duration = new Date().getTime() - st;
            //         ok(duration < DB_FETCH_TIME_LIMIT_MS, logTime(duration));

            //         // it ok
            //         equal(result.type, 'success', 'it\'s ok');

            //         addAsyncDBDropTest();
            //         start();
            //     });
            // });


            // testDatabaseObject('http_response_code');

            // testDatabaseObject('DateTimeZone');

            // testDatabaseObject('DateTime::format');

            // //testDatabaseObject('getFilename');

            // asyncTest('Autocomplete #1: str_replace', 3, function() {
            //     background.model.findAutocomplete(new SearchTerm('str_replace'), function(response) {
            //         equal(2, response.rows.length, 'items count correct: ' + response.rows.length + ' items');

            //         var item;
            //         item = response.rows.item(0);
            //         equal(item.method, 'str_replace', 'item #1: ' + item.method);
            //         item = response.rows.item(1);
            //         equal(item.method, 'substr_replace', 'item #2: ' + item.method);

            //         start();
            //     });
            // });

            // asyncTest('Autocomplete #2: DateTime::format', 2, function() {
            //     background.model.findAutocomplete(new SearchTerm('format', 'DateTime'), function(response) {
            //         var item = response.rows.item(0);

            //         equal('DateTime', item.pclass, 'item.pclass: ' + item.pclass);
            //         equal('format', item.method, 'item.method: ' + item.method);

            //         start();
            //     });
            // });

            // asyncTest('Autocomplete #3: getFilename', 1, function() {
            //     background.model.findAutocomplete(new SearchTerm('getFilename'), function(response) {
            //         equal(4, response.rows.length, 'items count correct: ' + response.rows.length + ' items');

            //         start();
            //     });
            // });

        function testAutocomplete(term, expectedArray) {
            var responses = [ ];
            var callIndex = 0;
            var st = new Date().getTime();

            background.model.findAutocomplete(new SearchTerm(term), function(resp) {
                responses = responses.concat(resp);

                if (responses.length === expectedArray.length) {
                    test('Test Autocomplete for ' + term, function() {
                        var duration = new Date().getTime() - st;
                        //ok(duration < DB_COUNT_TIME_LIMIT_MS, logTime(duration));
                        ok(true, logTime(duration));

                        ok(responses.length === expectedArray.length, 'Items found: ' + (responses.length + '') + ', expected ' + (expectedArray.length + ''));
                        for (var i=0; i < responses.length; i++) {
                            equal(responses[i].name, expectedArray[i], 'item #1: ' + responses[i].name);
                        }
                    });
                }
                callIndex++;
            });
        }


        var fetchCount = 1;
        function testDatabaseObject(term) {
            var st = new Date().getTime();
            var searchTerm = new SearchTerm(term);

            background.model.findObject(searchTerm, function(obj) {
                test('Database fetch #' + (fetchCount++) + ': single object (' + term + ')', function() {
                    console.log(obj);
                    console.log(JSON.parse(obj.json));

                    // test speed
                    var duration = new Date().getTime() - st;
                    //ok(duration < DB_COUNT_TIME_LIMIT_MS, logTime(duration));
                    ok(true, logTime(duration));

                    // it's an object
                    equal(typeof obj, 'object', "is it an object? = " + (typeof obj === 'object'));

                    // correct method name
                    if (obj.name === null) { // class
                        equal(obj.class, searchTerm.toString(), 'obj.pclass = ' + searchTerm.toString());
                        equal(obj.name, null, 'obj.method = null');
                    } else if (obj.class === null) { // method
                        equal(obj.class, null, 'obj.pclass = null');
                        equal(obj.name, searchTerm.toString(), 'obj.method = ' + searchTerm.toString());
                    } else { // class method
                        equal(obj.class, searchTerm.getClass(), 'obj.pclass = ' + searchTerm.getClass());
                        equal(obj.name, searchTerm.getMethod(), 'obj.method = ' + searchTerm.getMethod());
                    }
                    
                    // json part contains at least something
                    ok(obj.json.length > 0, 'json object length: ' + obj.json.length);

                });
            });
        }

        function testDatabaseObjectsByClass(className, expectedArray) {
            var st = new Date().getTime();

            background.model.findClassMethods(new SearchTerm(className), function(classMethods) {
                test('Test class methods: ' + className, function() {
                    ok(classMethods.length === expectedArray.length, 'Class ' + className + ' has ' + classMethods.length + ' methods.');

                    for (var i=0; i < classMethods.length; i++) {
                        ok(expectedArray.indexOf(classMethods[i].name) !== -1, 'Found method: ' + classMethods[i].name);
                    }

                });
            });
        }
    }
}

var background = chrome.extension.getBackgroundPage().background;

$(document).ready(function() {
    background.setLocale('en');
    var st = new Date().getTime();

    background.model.drop(function() {
        console.log('drop: ' + logTime(new Date().getTime() - st));

        console.log('db drop finished');
        BackgroundTests.run();
    });
});

