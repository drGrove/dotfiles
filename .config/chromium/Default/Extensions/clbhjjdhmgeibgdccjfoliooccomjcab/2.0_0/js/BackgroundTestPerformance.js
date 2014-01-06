
"use strict";

window.BackgroundTests = {

    run: function () {

        var background = window.background;
        var SearchTerm = chrome.extension.getBackgroundPage().SearchTerm;

        var all_functions = background.loadAllFunctionsArray();
        var total_functions = all_functions.length;
        var max = 500;
        var pointer = 0;
        var total_time = 0;

        QUnit.done(function() {
            console.log('total_time:' + (total_time / 1000) + ' ms');
        })

        var random_list = []
        module('Database Speed Test');
        for (var i=0; i < max; i++) {
            random_list[i] = all_functions[Math.floor(Math.random() * total_functions)];
        }

        for (var i=0; i < max; i++) {
            asyncTest('Random DB fetch ' + i + '/' + max + ': ' + random_list[i], 1, function() {
                var searchTerm = new SearchTerm(random_list[pointer]);
                background.model.findObject(searchTerm, function(obj) {
                    ok(true, random_list[pointer]);
                    pointer++;
                    start();
                });
            });
        }
    }
}

var background = chrome.extension.getBackgroundPage().background;

$(document).ready(function() {
    BackgroundTests.run();
});

