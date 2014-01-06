

var App = function() {
    
    var currentItem = null; // SearchTerm object
    
    var elmSearch = $('#search');
    
    var docDiv = $('#doc');
    
    var containers = {
        hello:     $('#hellodiv'),
        content:   $('#contentdiv'),
        classlist: $('#classmethods'),
        notfound:  $('#notfound'),
        loading:   $('#doc > .loading')
    };
    
    //var searchDiv = $('#searchdiv');
    //var $('#searchdiv').outerHeight() = $('#searchdiv').outerHeight();
    
    var searchdiv = $('#searchdiv');

    var wrapper = $('#wrapper');
    
    var loadingData = false;
    
    var skipNextAutocomplete = false;
    
    var codeSnippetsDiv = $('#snippets');
    
    var codeSnippets = false;
    
    var sliderDiv = $('#slider');

    var enabled = true;

    
    return {
        
        isEqualToCurrentItem: function(searchTerm) {
            if (currentItem === null) {
                return false;
            } else {
                return currentItem.similar(searchTerm);
            }
        },
        
        find: function() {
            background.log('App.find(' + this.getSearch() + ')');
            if (this.getSearch().length === 0) {
                this.showContainer('hello');
                searchdiv.find('em').html('');
                Autocomplete.hide();
                return;
            }
            
//            background.log(this.getSearch());
            var searchTerm = new SearchTerm(this.getSearch());
            
            this.hideSnippets();

            if (currentItem && currentItem.equals(searchTerm) && Autocomplete.isLastSearchedTerm(searchTerm)) {
                Autocomplete.hide();
//                Autocomplete.show();
            } else {
                loadingData = true;
                // stop processing previous request
                background.model.stop();
                currentItem = null;

                App.runAutocomplete(searchTerm);
            }
        },

        showAutocomplete: function() {
            Autocomplete.show();
        },

        hideAutocomplete: function() {
            Autocomplete.hide();
        },

        isAutocompleteVisible: function() {
            return Autocomplete.isVisible();
        },

        runAutocomplete: function(searchTermInstance) {
            Autocomplete.empty();

            background.log('runAutocomplete: ', searchTermInstance.toString());

            if (!(searchTermInstance instanceof SearchTerm)) {
                throw 'Invalid argument, `searchTerm` must be instance of SearchTerm class.';
            }
            var allResults = [ ];

            background.model.findAutocomplete(searchTermInstance, function(results, lastCall, foundPositions) { // callback
                // skip duplicit search results (because of fuzzy search)
                for (var i = 0; i < results.length; i++) {
                    var found = false;
                    for (var j = 0; j < allResults.length; j++) {
                        // background.log(allResults[j].toString(), results[i].toString());
                        if (allResults[j].toString().toLowerCase() === results[i].toString().toLowerCase()) {
                            found = true;
                            break;
                        }
                    }

                    if (found) {
                        // background.log('remove duplicate', results[i].toString());
                        foundPositions.remove(i);
                        results.remove(i);
                        i--;
                        // allResults.push(results[i]);
                    }
                }
                allResults = allResults.concat(results);

                //if (results.length > 0) {
                Autocomplete.fill(results, foundPositions);

                if (!currentItem && allResults.length > 0) {
                    App.fillContent(allResults[0]);
                    
                    if (allResults.length > 2) {
                        Autocomplete.show();
                        App.updatePopupHeight();
                    }
                }

                if (App.isSkipNextAutocomplete()) {
                    App.hideAutocomplete();
                }

                if (lastCall) {
                    // if () { //  || Autocomplete.count() === 0
                    //     App.showContainer('notfound');
                    //     Autocomplete.hide();
                    // }
                    App.updatePopupHeight();

                    skipNextAutocomplete = false;
                    // add PHP versions in autocompele
                    Autocomplete.updatePHPVersions();
                }

                // if (!currentItem || Autocomplete.count() === 0) {
                if (lastCall && !currentItem) {
                    Autocomplete.hide();
                    App.showNotFound();
                }

                App.enable();

                // console.log(App.isSkipNextAutocomplete());
            });
        },
        
        getSearch: function() {
            var term = elmSearch.val();
            if (term.substr(-2) === '()') {
                term = term.substr(0, term.length - 2);
            } else if (term.substr(-1) === '(' || term.substr(-2) === ')') {
                term = term.substr(0, term.length - 1);
            }
            return term;
        },
        
        setSearch: function(searchTerm, skipAutocomplete, noFocusAndSelect) {
            if (!(searchTerm instanceof SearchTerm)) {
                searchTerm = $.trim(searchTerm).replace(' ', '');
                searchTerm = new SearchTerm(searchTerm);
            }

            this.rememberSearch(searchTerm);

            if (typeof skipAutocomplete === "undefined") {
                skipNextAutocomplete = false;
            } else {
                skipNextAutocomplete = skipAutocomplete;
            }

            // will trigger focus event
            //this.disable();
            if (elmSearch.val() !== searchTerm.getRaw()) {
                elmSearch.val(searchTerm.getRaw());
            }

            this.find();
        },
        
        rememberSearch: function(searchTerm) {
            background.ls.setItem('last_search', searchTerm.toString().replace(/[^A-Za-z-0-9_:]+/g, '')); // store last search item
        },
        
        fillContent: function(modelObject) {
            // @todo: this expects that modelObject is object from indexedDB but it doesn't handle situations where
            // first found object comes from NaCl and therefore is plain text function name - call model.findObject()?
            // currentItem = new SearchTerm(modelObject.name, modelObject.class, modelObject.php_version);
            // currentItem.setJSON(modelObject.json);
            currentItem = modelObject;
            var that = this;

            background.model.findObject(currentItem, function(result) {
                // background.log(result, currentItem.toString());
                currentItem.setJSON(result.json);

                App.stopLoading();
                if (currentItem.isOnlyClass()) {// || (currentItem.isClass() && currentItem.getMethod() === '__construct')) { // it's a class
                    // fill popup content with all class methods
                    ContentManager.fillClassContent(currentItem);
                } else { // it's a method
                    // fill popup content with function information
                    ContentManager.functionContent(currentItem);
                }
                
                if (!Autocomplete.isVisible()) {
                    background.ga.trackSearchTerm(currentItem);
                }
                that.increaseTotalSearchedTerms();
            });

        },
        
        showContainer: function(cont) {
            background.log('showContainer(', cont, ')');
            for (c in containers) {
                if (c === cont) {
                    containers[c].show();
                } else {
                    containers[c].hide();   
                }
            }
            //this.updatePopupHeight();
        },

        showNotFound: function() {
            App.showContainer('notfound');
            searchdiv.find('em').html('');
        },
        
        updatePopupHeight: function() {
            if (codeSnippets) {
                return false;
            } else if (!Autocomplete.isVisible()) {
                this.resetPopupHeight();
            }

            var htmlHeight = $('html').height();
            var autocompleteReqHeight = Autocomplete.minHeightRequired();

            if (autocompleteReqHeight > htmlHeight) {
                $('html').height(autocompleteReqHeight);
            }

        },

        resetPopupHeight: function() {
            $('html').height('auto');
        },
        
        stopLoading: function() {
            background.log('loading stopped');
            // skipNextAutocomplete = false;
            loadingData = false;
        },
        
        isSkipNextAutocomplete: function() {
            return skipNextAutocomplete;
        },
        
        increaseTotalSearchedTerms: function() {
            background.ls.setItem('terms_searched', parseInt(background.ls.getItem('terms_searched')) + 1);
        },
        
        showSnippets: function () {
            if (!codeSnippets) {
                var snippetsHeight = 403;
                codeSnippets = true;
                codeSnippetsDiv.show().height(snippetsHeight);
                $('#wrapper').height(snippetsHeight);
                
                sliderDiv.animate({
                    top : -docDiv.height() /*-containers.content.outerHeight()*/
                }, 200);

                // fix line numbers column height
                $('#snippetSlider > ul > li pre').each(function() {
                    var pre = $(this);
                    var lineNumbersUl = pre.closest('div.viewport').find('ul.line_numbers');
                    var height = pre.height() < 328 ? 328 : pre.height();
                    if (pre.outerWidth() >= 486) {
                        lineNumbersUl.height(height);
                    } else {
                        lineNumbersUl.height(height + 8);
                    }
                    //console.log(pre.width(), pre.height());
                });
            
                // $('#snippetSlider > ul').css('left', 0);
                
                //$('body, html').animate({ height: slideRange + $('#searchdiv').outerHeight() }, 200, 'linear');
            }
        },
        
        hideSnippets: function () {
            if (codeSnippets) {
                codeSnippets = false;
                sliderDiv.animate({ top:0 }, 200);
                
                //$('body, html').animate({ height: $('#searchdiv').outerHeight() + containers.content.height() }, 200);
                $('#wrapper').animate({
                    height: docDiv.height()
                }, {
                    complete: function() {
                        codeSnippetsDiv.hide();
                        $('#wrapper').height('auto');
                    } /*containers.content.outerHeight()*/
                }, 200);
            }
        },
        
        slideToggleParam: function (elm) {
            /*elm.find('p').slideToggle(100);*/
            var p = elm.find('div');
            
            if (!p.data('maxHeight')) {
                p.show();
                p.data('maxHeight', p.outerHeight());
                p.hide();
            }
            
            var properties;
            
            if (p.is(':visible')) {
                properties = { height: 0 };
            } else {
                properties = { height: p.data('maxHeight') };
                p.height(0).show();
            }
            
            var options = { duration: 100, /*
                step: function() {
                    App.updatePopupHeight();
                },*/ complete: function() {
                    if (p.height() === 0) {
                        p.hide();
                    }
                }
            };
            
            p.animate(properties, options);
            
        },

        getFunctionDefinition: function() {
            var params = [ ];
            var wrapper = $('#h1_params > p:first');
            wrapper.find('.mandatory, .optional').each(function() {
                var text = $(this).text();
                params.push(text.substring(text.indexOf(' ') + 1));
            });
            return wrapper.find('.name').text() + '(' + params.join(', ') + ')';
        },

        isMac: function() {
            return window.navigator.platform === "MacIntel";
        },

        disable: function() {
            enabled = false;
        },

        enable: function() {
            enabled = true;
        },

        isEnabled: function() {
            return enabled;
        }

    };
}();
