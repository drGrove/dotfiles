
var Autocomplete = function() {
    
    //var visible = false;
    
    var activeIndex = -1;
    
    // autocomplete container
    var elmAutocomplete = $('#autocomplete');
    
    // autocomplete ul (contains list items)
    var elmAutocompleteContent = $('#autocomplete ul');

    // autocomplete scrollbar
    //var scrollbar = false;
    
    // number of items in the list
    var itemsCount = 0;
    
    // input field
    var elmSearch = $('#search');
    
    var lastSearchedTerm = false;
    
    var doc = document;


    return {
        
        /**
         * Show autocomplete
         */
        show: function() {
            elmAutocomplete.removeClass('hide');
            //elmSearch.addClass('focus');
            /*if (scrollbar) {
                elmAutocomplete.update();
            }*/
            App.updatePopupHeight();
            /*if (!elmSearch.is(':focus')) {
                elmSearch.focus();
            }*/
            //elmSearch
            //visible = true;
            //showHide();
        },
        
        /**
         * Hide autocomplete
         */
        hide: function() {
            elmAutocomplete.addClass('hide');
            //elmSearch.removeClass('focus');
            App.resetPopupHeight();
            //visible = false;
            //showHide();
        },
        
        /**
         * Check if autocomplete is visible
         */
        isVisible: function() {
            return elmAutocomplete.is(':visible');
        },
        
        /**
         * 
         */
        count: function() {
            return itemsCount;
        },
        
        /**
         * Fill autocomplte with database results
         */
        fill: function(itemsArray, isDbResultArray) {
            
            // if there're no items in autocomplete, hide it
            if (itemsArray.length === 0) {
                this.hide();
                return;
            }
            
            lastSearchedTerm = new SearchTerm(App.getSearch());
            
            var fromDB = typeof(isDbResultArray) === 'undefined' ? true : isDbResultArray; // by default fromDB is true
            activeIndex = -1;
            
            try {
                elmAutocomplete.width(elmSearch.outerWidth() - 2)
                               .css('top', elmSearch.position().top + elmSearch.outerHeight() - 1)
                               .css('left', elmSearch.position().left);
            } catch (e) { return; }

            itemsCount = itemsArray.length;
            var fragment = doc.createDocumentFragment();
            
            for (var i=0; i < itemsCount; i++) {
                var item = fromDB ? itemsArray.item(i) : itemsArray[i];
                var obj = new SearchTerm(item.method, item.pclass, item.php_version);
                
                //var isClass = utils.isClass(item.method, item.pclass);
                //var isClassMethod = utils.isClassMethod(item.method, item.pclass);
                var niceName = obj.toString();
                //var method = item.method;
                
                var li = doc.createElement('li'); // single line in autocomplete
                var span = doc.createElement('span'); // container for highlighted part
                var wrapper = doc.createElement('span'); // container for whole method name
                
                li.setAttribute('rel', niceName);
                //li.setAttribute('rev', isClass);
                
                if (obj.isClassAndMethod()) {
                    /*li.addEventListener('click', function() {
                        var text = $(this).closest('li').attr('rel');
                        App.setSearch(new SearchTerm($(this).closest('li').attr('rel')), true);
                    });*/
                } else {
                    /*li.addEventListener('click', function() {
                        App.setSearch(new SearchTerm($(this).closest('li').attr('rel')), true);
                    });*/
                }
                
                // highlight part of the name
                var term = App.getSearch();
                var pos = niceName.toLowerCase().indexOf(term.toLowerCase());
                li.appendChild(doc.createTextNode(niceName.substring(0, pos)));
                
                span.className = 'highlight';
                span.appendChild(doc.createTextNode(niceName.substring(pos, pos + term.length)));
                
                // wrap whole method name into another span
                wrapper.appendChild(span);
                wrapper.appendChild(doc.createTextNode(niceName.substring(pos + term.length)));
                
                li.appendChild(wrapper);

                // make sure we're going to display just version wih number, no text
                if (obj.getVersion()) {
                    var phpVersion = doc.createElement('em'); // single line in autocomplete
                    var phpVerText = obj.getVersion().replace('PECL ', '');
                    phpVersion.className = 'php_version';
                    phpVersion.appendChild(doc.createTextNode(phpVerText));
                    li.appendChild(phpVersion);
                }

                //console.log(obj.toString(), obj.isOnlyClass(), obj.isClassAndMethod(), obj.isClass());

                // for class add short note
                if (obj.isOnlyClass()) {
                    var spanListAll = doc.createElement('span');
                    spanListAll.className = 'grey';
                    spanListAll.appendChild(doc.createTextNode(' list all methods'));
                    
                    li.appendChild(spanListAll);
                }
                
                // add to fragment
                fragment.appendChild(li);
                
            }
            elmAutocompleteContent.empty();
            elmAutocompleteContent.append(fragment);
            
            if (!App.isSkipNextAutocomplete()) {
                this.show();
            }
            
            //elmAutocomplete.find('.viewport').height(itemsCount > 10 ? 180 : itemsCount * 18);
            elmAutocomplete.height((itemsCount > 10 ? 182 : itemsCount * 18) + 2);
            elmAutocomplete.find('> div.scrollable').height(elmAutocomplete.height() - 2);
            
            /*
            // init scroolbar
            if (scrollbar) {
                elmAutocompleteContent.css('top', 0);
                elmAutocomplete.update();
            } else {
                if (itemsCount > 10) {
                    elmAutocomplete.find('.thumb').show().css('top', 0);
                    elmAutocomplete.tinyscrollbar({size:175, wheel:72});
                    scrollbar = true;
                }
            }
            */
        },
        
        isLastSearchedTerm: function(searchTerm) {
            return lastSearchedTerm && lastSearchedTerm.similar(searchTerm);
        },
        
        /**
         * Highlight item in autocomplete
         */
        highlight: function() {
            elmAutocompleteContent.find('li').removeClass('hover');
            elmAutocompleteContent.find('li:eq(' + activeIndex + ')').addClass('hover');
        },
        
        highlightMoveUp: function() {
            activeIndex--;
            if (0 > activeIndex) {
                activeIndex = this.count() - 1;
                //elmAutocomplete.update();
                //elmAutocomplete.move((this.count() - 10) * 18);
            }
            
            /*if (-elmAutocomplete.position() > (activeIndex - 1) * 18) {
                elmAutocomplete.move(-18);
            }*/
        },
        
        highlightMoveDown: function() {
            activeIndex++;
            if (this.count() <= activeIndex) {
                activeIndex = 0;
                //elmAutocomplete.update();
            }
            
            /*if (activeIndex > 8 && Math.floor(-parseInt($('#autocomplete .overview').css('top')) / 18) + 8 < activeIndex) {
                $('#autocomplete .overview').css('top', - (activeIndex - 8) * 18);
                //elmAutocomplete.move(18);
            }*/
        },
        
        setHighlighted: function(index) {
            activeIndex = index;
        },
        
        searchHighlighted: function() {
            var li = elmAutocomplete.find('li:eq(' + (activeIndex == -1 ? 0 : activeIndex) + ')');
            App.setSearch(li.attr('rel'), true);
        },
        
        minHeightRequired: function() {
            return elmAutocomplete.offset().top + elmAutocomplete.height() + 10;
        }
    };
    
}();

