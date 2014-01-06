
"use strict";

window.BackgroundTests = {

    run: function () {

        var background = window.background;
        var SearchTerm = chrome.extension.getBackgroundPage().SearchTerm;
        var stats;
        var DB_FETCH_TIME_LIMIT_MS = 50;

        // force QUnit to run all tests in default order
        QUnit.config.reorder = false;

        function logTime(duration) {
            return 'Result fetched in: ' + (duration / 1000) + 's - ' + (duration < 50 ? 'fast enough' : 'too slow');
        }
        
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
            testName = 'DateTimeZone';
            st = new SearchTerm(null, testName, 'some text');
            equal(st.toString(), testName, 'toString name: ' + st.toString());
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
            equal(background.getTableName(), 'dict_sp', 'Database table name: ' + background.getTableName());

            background.setLocale('en');
            equal(background.getDatabaseLocale(), 'en', 'Database locale: ' + background.getDatabaseLocale());
            equal(background.getTableName(), 'dict_en', 'Database table name: ' + background.getTableName());
        });

        test('Database timestamp', function() {
            // make sure database is properly installed before fetching data
            stats = background.reloadJsonStats();
            equal(background.getDatabaseTimestamp(), stats.timestamp, "English database is installed with timestamp: " + background.getDatabaseTimestamp());
        });

        setTimeout(function() {
            module('Database responses');
            asyncTest('Database readable', 2, function() {
                var st = new Date().getTime();
                background.model.isReadable(function(result) {
                    // test speed
                    var duration = new Date().getTime() - st;
                    ok(duration < DB_FETCH_TIME_LIMIT_MS, logTime(duration));

                    // returns true if database contains at leas one element which can be fetched
                    ok(result, 'Database is readable.');

                    start();
                });
            });

            asyncTest('Number of items in database', 2, function() {
                stats = background.reloadJsonStats();
                var st = new Date().getTime();
                background.model.count(function(count) {
                    // test speed
                    var duration = new Date().getTime() - st;
                    ok(duration < DB_FETCH_TIME_LIMIT_MS, logTime(duration));

                    // total number of items in the database
                    equal(count, stats.methods, 'Items count should be: ' + count);

                    start();
                });
            });

            var fetchCount = 1;

            function testDatabaseObject(term) {
                asyncTest('Database fetch #' + (fetchCount++) + ': single object (' + term + ')', 5, function() {
                    var st = new Date().getTime();
                    var searchTerm = new SearchTerm(term);

                    background.model.findObject(searchTerm, function(obj) {
                        console.log(obj);
                        console.log(JSON.parse(obj.json));

                        // test speed
                        var duration = new Date().getTime() - st;
                        ok(duration < DB_FETCH_TIME_LIMIT_MS, logTime(duration));

                        // it's an object
                        equal(typeof obj, 'object', "is it an object? = " + (typeof obj === 'object'));

                        // correct method name
                        if (obj.method === null) { // class
                            equal(obj.pclass, searchTerm.toString(), 'obj.pclass = ' + searchTerm.toString());
                            equal(obj.method, null, 'obj.method = null');
                        } else if (obj.pclass === null) { // method
                            equal(obj.pclass, null, 'obj.pclass = null');
                            equal(obj.method, searchTerm.toString(), 'obj.method = ' + searchTerm.toString());
                        } else { // class method
                            equal(obj.pclass, searchTerm.getClass(), 'obj.pclass = ' + searchTerm.getClass());
                            equal(obj.method, searchTerm.getMethod(), 'obj.method = ' + searchTerm.getMethod());
                        }
                        
                        // json part contains at least something
                        ok(obj.json.length > 0, 'json object length: ' + obj.json.length);

                        start();
                    });
                });
            }

            testDatabaseObject('http_response_code');

            testDatabaseObject('DateTimeZone');

            testDatabaseObject('DateTime::format');

            //testDatabaseObject('getFilename');

            asyncTest('Autocomplete #1: str_replace', 3, function() {
                background.model.findAutocomplete(new SearchTerm('str_replace'), function(response) {
                    equal(2, response.rows.length, 'items count correct: ' + response.rows.length + ' items');

                    var item;
                    item = response.rows.item(0);
                    equal(item.method, 'str_replace', 'item #1: ' + item.method);
                    item = response.rows.item(1);
                    equal(item.method, 'substr_replace', 'item #2: ' + item.method);

                    start();
                });
            });

            asyncTest('Autocomplete #2: DateTime::format', 2, function() {
                background.model.findAutocomplete(new SearchTerm('format', 'DateTime'), function(response) {
                    var item = response.rows.item(0);

                    equal('DateTime', item.pclass, 'item.pclass: ' + item.pclass);
                    equal('format', item.method, 'item.method: ' + item.method);

                    start();
                });
            });

            asyncTest('Autocomplete #3: getFilename', 1, function() {
                background.model.findAutocomplete(new SearchTerm('getFilename'), function(response) {
                    equal(4, response.rows.length, 'items count correct: ' + response.rows.length + ' items');

                    start();
                });
            });

        }, 100);
        
        
        
    }
}

var background = chrome.extension.getBackgroundPage().background;

$(document).ready(function() {
    BackgroundTests.run();
});

