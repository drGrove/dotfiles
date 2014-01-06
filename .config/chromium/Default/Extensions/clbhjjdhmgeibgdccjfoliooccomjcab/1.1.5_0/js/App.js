
var App = function() {
    
    var currentItem = null; // SearchTerm object
    
    var elmSearch = $('#search');
    
    var docDiv = $('#doc');
    
    var containers = {
        hello:     $('#hellodiv'),
        content:   $('#contentdiv'),
        classlist: $('#classmethods'),
        notfound:  $('#notfound'),
        loading:   $('.loading')
    };
    
    //var searchDiv = $('#searchdiv');
    //var $('#searchdiv').outerHeight() = $('#searchdiv').outerHeight();
    
    var wrapper = $('#wrapper');
    
    var loadingData = false;
    
    var skipNextAutocomplete = false;
    
    var codeSnippetsDiv = $('#snippets');
    
    var codeSnippets = false;
    
    var sliderDiv = $('#slider');

    var slideRange = 400;
    
    //var that = this;
    
    return {
        
        isEqualToCurrentItem: function(searchTerm) {
            if (currentItem === null) {
                return false;
            } else {
                return currentItem.similar(searchTerm);
            }
        },
        
        find: function() {
            
            if (loadingData) {
                return;
            }
            
            if (this.getSearch().length === 0) {
                App.showContainer('hello');
                Autocomplete.hide();
                return;
            }
            
            var searchTerm = new SearchTerm(this.getSearch());
            
            this.hideSnippets();
            
            if (this.isEqualToCurrentItem(searchTerm) && Autocomplete.isLastSearchedTerm(searchTerm) && Autocomplete.count() > 1) {
                Autocomplete.show();
                //if (0 !== Autocomplete.count()) {
                //App.stopLoading();
                return;
                //}
            }
            
            this.rememberSearch(searchTerm);
            
            loadingData = true;
            
            background.model.findAutocomplete(searchTerm, function(result) { // callback
                // result contains nothing or just the current item
                if (result.rows.length == 0 /*|| result.rows.length == 1 */ || App.isSkipNextAutocomplete() || Autocomplete.isLastSearchedTerm(searchTerm)) {
                    Autocomplete.hide();
                    if (App.isEqualToCurrentItem(searchTerm)) {
                        App.stopLoading();
                        return;
                    }
                }
                
                if (result.rows.length > 0) {
                    Autocomplete.fill(result.rows);
                }
                /*if ( && result.rows.length > 0) {
                    Autocomplete.fill(result.rows);
                } else {
                    Autocomplete.hide();
                }*/
                
                if (result.rows.length > 0) {
                    var item = result.rows.item(0);
                    var firstFound = new SearchTerm(item.method, item.pclass);
                    
                    //console.log(App.getCurrentItem(), searchTerm);
                    if (App.isEqualToCurrentItem(searchTerm) && Autocomplete.count() > 1) {
                        //Autocomplete.show();
                        App.stopLoading();
                    } else {
                        /**
                         * Show first item on autocomplete list
                         */
                        background.model.findObject(firstFound, function(result) { // callback
                            if (result) {
                                var term = new SearchTerm(result.method, result.pclass, result.php_version);
                                term.setJSON(result.json);
                                App.fillContent(term);
                            } else {
                                App.showContainer('notfound');
                                //App.updatePopupHeight();
                                App.stopLoading();
                            }
                        });
                    }
                } else {
                    App.stopLoading();
                    App.showContainer('notfound');
                }
            });
            //}
        },
        
        getSearch: function() {
            return elmSearch.val();
        },
        
        setSearch: function(searchTerm, skipAutocomplete) {
            if (!(searchTerm instanceof SearchTerm)) {
                searchTerm = new SearchTerm(searchTerm);
            }
            
            if (typeof skipAutocomplete === "undefined") {
                skipNextAutocomplete = false;
            } else {
                skipNextAutocomplete = skipAutocomplete;
            }
            
            if (this.isEqualToCurrentItem(searchTerm) && searchTerm.equals(new SearchTerm(elmSearch.val()))) {
                if (skipNextAutocomplete) {
                    Autocomplete.hide();
                    this.stopLoading();
                }
                return;
            }
            
            // will trigger focus event
            elmSearch.val(searchTerm.toString()).select().focus();
            
        },
        
        rememberSearch: function(searchTerm) {
            localStorage.setItem('last_search', searchTerm.toString().replace(/[^A-Za-z-0-9_:]+/g, '')); // store last search item
        },
        
        fillContent: function(searchTerm) {
            
            currentItem = searchTerm;

            //background.log(searchTerm.isClass(), searchTerm.isOnlyClass(), searchTerm.toString());
            
            if (searchTerm.isOnlyClass()) { // it's a class
                // fill popup content with all class methods
                ContentManager.fillClassContent(searchTerm);
            } else { // it's a method
                // fill popup content with function information
                ContentManager.functionContent(searchTerm);
                App.stopLoading();
            }

            if (!Autocomplete.isVisible()) {
                background.ga.trackSearchTerm(searchTerm);
            }
            this.increaseTotalSearchedTerms();
            
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

            //console.log($('html').height(), Autocomplete.minHeightRequired());
            
            //background.log('updatePopupHeight( void )');
            
            /*if (containers.hello.is(':visible')) {
                wrapper.height(containers.hello.height());
                $('body, html').height(containers.hello.height());
                return;
            }
            if (containers.notfound.is(':visible')) {
                wrapper.height(containers.notfound.height());
                $('body, html').height(containers.notfound.height());
                return;
            }
            
            var thisContentDivHeight = containers.content.is(':visible') ? containers.content.outerHeight() : containers.classlist.outerHeight();
            var height = thisContentDivHeight + elmSearch.height(); //+ searchDiv.outerHeight();

            if (Autocomplete.isVisible()) {
                var autocompleteItems = Autocomplete.count();
                var autocompleteMinHeight = (Autocomplete.isVisible() ? (autocompleteItems > 10 ? 10 : autocompleteItems) : 0) * 18;

                if (autocompleteMinHeight > height) {
                    height = autocompleteMinHeight;
                }
            }
            
            //console.log(containers.content.height(), $('#searchdiv').outerHeight(), containers.content.height() + $('#searchdiv').outerHeight());
            //console.log(autocompleteMinHeight + 20, containers.content.height() + $('#searchdiv').outerHeight());
            
            if (Autocomplete.isVisible()) {
                docDiv.height(Math.max(height, autocompleteMinHeight));
            } else {
                docDiv.height(height);
            }
            wrapper.height(height < 50 ? 50 : height);
            $('body, html').height(thisContentDivHeight + $('#searchdiv').outerHeight());
            */
        },

        resetPopupHeight: function() {
            $('html').height('auto');
        },
        
        stopLoading: function() {
            background.log('loading stopped');
            skipNextAutocomplete = false;
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
                codeSnippets = true;
                codeSnippetsDiv.show().height(slideRange);
                $('#wrapper').height(slideRange);
                
                sliderDiv.animate({
                    top : -docDiv.height() /*-containers.content.outerHeight()*/
                }, 200);

                // fix line numbers column height
                $('#snippetSlider > ul > li pre').each(function() {
                    var pre = $(this);
                    var lineNumbersUl = pre.closest('div.viewport').find('ul.line_numbers');
                    var height = pre.height() < 325 ? 325 : pre.height();
                    if (pre.outerWidth() >= 386) {
                        lineNumbersUl.height(height);
                    } else {
                        lineNumbersUl.height(height + 8);
                    }
                    //console.log(pre.width(), pre.height());
                });
            
                
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
            var p = elm.find('p');
            
            if (!p.data('maxHeight')) {
                p.show();
                p.data('maxHeight', p.outerHeight());
                p.hide();
            }
            
            var properies;
            
            if (p.is(':visible')) {
                properies = { height: 0 };
            } else {
                properies = { height: p.data('maxHeight') };
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
            
            p.animate(properies, options);
            
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
        }
    };
}();
