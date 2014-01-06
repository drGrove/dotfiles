
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

    var PHPVersionArray = {};


    return {
        
        /**
         * Show autocomplete
         */
        show: function() {
            elmAutocomplete.removeClass('hide');
            App.updatePopupHeight();
        },
        
        /**
         * Hide autocomplete
         */
        hide: function() {
            $('#autocomplete').removeClass('hovered');
            elmAutocomplete.addClass('hide');
            App.resetPopupHeight();
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
        fill: function(itemsArray, foundPositions) {
            // background.log(foundPositions, itemsArray, itemsArray.length);

            // if there're no items in autocomplete, hide it
            if (itemsArray.length === 0) {
                //this.hide();
                return;
            }
            
            lastSearchedTerm = new SearchTerm(App.getSearch());
            
            //var fromDB = typeof(isDbResultArray) === 'undefined' ? true : isDbResultArray; // by default fromDB is true
            activeIndex = -1;
            
            try {
                elmAutocomplete.width(elmSearch.outerWidth() - 2)
                               .css('top', elmSearch.position().top + elmSearch.outerHeight() - 1)
                               .css('left', elmSearch.position().left);
            } catch (e) { return; }

            // total number of items in autocomplete
            itemsCount += itemsArray.length;
            // performance reasons
            var fragment = doc.createDocumentFragment();
            var html = '';
            
            for (var i=0; i < itemsArray.length; i++) {
                var obj = itemsArray[i];
                
                //var isClass = utils.isClass(item.name, item.pclass);
                //var isClassMethod = utils.isClassMethod(item.name, item.pclass);
                var niceName = obj.toString();
                var term = App.getSearch();

                var liHtml = niceName;
                if (Object.prototype.toString.call(foundPositions) === '[object Array]' && foundPositions[i].length > 0) { // is array
                    for (var j=foundPositions[i].length-1; j >= 0; j--) {
                        var pos = foundPositions[i][j];
                        liHtml = liHtml.substring(0, pos) + '<span class="highlight">' + liHtml.substring(pos, pos + 1) + '</span>' + liHtml.substring(pos + 1);
                    }
                } else if (!!foundPositions && !isNaN(parseFloat(foundPositions[i])) && isFinite(foundPositions[i])) { // is numeric
                    liHtml = niceName.substring(0, foundPositions[i]) + '<span class="highlight">' + niceName.substring(foundPositions[i], term.length + foundPositions[i]) + '</span>' + niceName.substring(foundPositions[i] + term.length);
                } else {
                    liHtml = '<span class="highlight">' + liHtml.substring(0, term.length) + '</span>' + liHtml.substring(term.length);
                }
                //var method = item.name;
                
                // <li><span><span class="highlight">preg_</span>match</span></li>
                var li = doc.createElement('li'); // single line in autocomplete
                var span = doc.createElement('span'); // container for highlighted part
                var wrapper = doc.createElement('span'); // container for whole method name
                
                li.setAttribute('rel', niceName);
                
                // highlight part of the name
                
                var pos = niceName.toLowerCase().indexOf(term.toLowerCase());
                li.appendChild(doc.createTextNode(niceName.substring(0, pos)));
                
                span.className = 'highlight';
                span.appendChild(doc.createTextNode(niceName.substring(pos, pos + term.length)));
                
                // wrap whole method name into another span
                wrapper.appendChild(span);
                wrapper.appendChild(doc.createTextNode(niceName.substring(pos + term.length)));
                
                li.appendChild(wrapper);

                liHtml = '<span>' + liHtml + '</span>';

                // for class add short note
                if (obj.isOnlyClass()) {
                    liHtml += '<span class="grey"> list all methods</span>';
                }
                
                html += '<li rel="' + niceName + '">' + liHtml + '</li>';
                // add to fragment
                fragment.appendChild(li);
                
            }
            //elmAutocompleteContent.empty();
            elmAutocompleteContent.append(html);
            
            if (!App.isSkipNextAutocomplete()) {
                this.show();
            }

            this.updateHeight();

        },

        updatePHPVersions: function() {
            // loop all items in autocompelete and add their php versions
            // (for performance) reasons this is done after all items have been found
            function _update(elm, phpVersion) {
                if (phpVersion) {
                    phpVersion = (phpVersion.length > 15) ? phpVersion.substring(0, 15) + '…' : phpVersion;
                    elm.append($('<em/>', { text: phpVersion }));
                    PHPVersionArray[elm.attr('rel')] = phpVersion;
                } else {
                    PHPVersionArray[elm.attr('rel')] = '';
                }
            }

            elmAutocompleteContent.find('> li').each(function() {
                if (PHPVersionArray[$(this).attr('rel')]) {
                    _update($(this), PHPVersionArray[$(this).attr('rel')]);
                } else {
                    (function(targetLi) {
                        background.model.findObject(new SearchTerm(targetLi.attr('rel')), function(obj) {
                            objDetails = JSON.parse(obj.json);
                            // if (obj) {
                            _update(targetLi, objDetails.ver);
                            // }
                        });
                    })($(this));
                }
            });
        },

        empty: function() {
            itemsCount = 0;
            elmAutocompleteContent.empty();
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
            }

        },
        
        highlightMoveDown: function() {
            activeIndex++;
            if (this.count() <= activeIndex) {
                activeIndex = 0;
            }
        },
        
        setHighlighted: function(index) {
            activeIndex = index;
        },
        
        searchHighlighted: function() {
            var li = elmAutocomplete.find('li:eq(' + (activeIndex == -1 ? 0 : activeIndex) + ')');
            App.setSearch(li.attr('rel'), true);
        },
        
        minHeightRequired: function() {
            if (elmAutocomplete) {
                return elmAutocomplete.offset().top + elmAutocomplete.height() + 10;
            } else {
                return 0;
            }
        },

        updateHeight: function() {
            // typecase bool to int
            elmAutocomplete.height((itemsCount > 10 ? 182 : (itemsCount) * 17) + 2);
            elmAutocomplete.find('> div.scrollable').height(elmAutocomplete.height() - 2);
        }

    };
    
}();

