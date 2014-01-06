
var ContentManager = function() {
    
    var classContainerScrollbar = false;
    
    //var codeSlidersH = [ ], codeSlidersV = [ ];
    
    //var scollbarTemplate = '<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div><div class="viewport">';
    //var slidersEnd = '</div>';
    
    function makeLinks(text) {
        return text.replace(/((\w+)\(\))/g, "<a href=\"#\">$1</a>");
    }



    return {
        
        codeSnippetWidth: 388,
        
        functionContent: function(searchTerm) {
            
            this.setHeader(searchTerm);
            //this.adjustHeaderSize();
            var i, j, k, paramsList;
            var object = searchTerm.getObject();
            
            if (object.params && object.params.length) {
                var paramString = '';
                var braces;
                var detailed_html = '';

                for (i=0; i < object.params.length; i++) {
                    paramsList = object.params[i];
                    detailed_html = '';
                    braces = 0;
                    var retHtml;

                    if (['int', 'string', 'bool', 'mixed', 'number', 'array', 'float', 'void', 'resource', 'object'].indexOf(paramsList.ret_type) === -1) {
                        retHtml = '<a href="#">' + paramsList.ret_type + '</a>';
                    } else {
                        retHtml = paramsList.ret_type;
                    }

                    paramString += '<p>' + retHtml + ' <span class="name">' + searchTerm.toString() + '</span> ( ';

                    for (j=0; j < paramsList.list.length; j++) {

                        if (paramsList.list[j]) {
                            var obj = paramsList.list[j];
                            // top parameter string
                            if (1 == obj.beh) {
                                braces++;
                                paramString += ' <span class="brace">[</span>';
                                if (j === 0) {
                                    paramString += ' ';
                                } else {
                                    paramString += '<span class="comma">,</span>&nbsp;';
                                }
                            }

                            paramString += '<span class="' + (0 == obj.beh ? 'mandatory' : 'optional') + '"><span class="return_type">' + obj['type'] + '</span> ' + obj['var'];
                            paramString += (typeof obj.def === 'undefined' ? '' : '&nbsp;=&nbsp;' + obj.def) + '</span>';

                            if (j+1 < paramsList.list.length && 0 == obj.beh && 0 == paramsList.list[j+1].beh) {
                                paramString += ', ';
                            }
                        } else {
                            paramString += '<span class="optional">void</span>';
                        }

                    }
                    //detailed_html += '<';

                    for (k=0; k < braces; k++) {
                        paramString += ' <span class="brace">]</span>';
                    }

                    paramString += '&nbsp;)</p>';

                }
                $('#h1_params').html(paramString);
                $('#h1_params').show();

                var listed = [ ];
                if (object.params.length > 0) {
                    for (i=0; i < object.params.length; i++) {
                        // detailed parametr list
                        paramsList = object.params[i];

                        for (j=0; j < paramsList.list.length; j++) {
                            var param = paramsList.list[j];
                            if (listed.indexOf(param['var']) === -1) {
                                var optional = param.beh == 1 ? 'optional' : '';
                                if (param.desc) { // if description exists
                                    detailed_html += '<li class="clickable ' + optional + '">' + param.type + ' ' + param['var'] + (optional ? ' (optional)' : '') + '<p>' + param.desc + '</p></li>';
                                } else {
                                    detailed_html += '<li class="' + optional + '">' + param.type + ' ' + param['var'] + ' (' + (optional ? 'optional, ' : '') + 'undocumented)</li>';
                                }
                                listed.push(param['var']);
                            }
                        }
                    }
                    $('#params').html(detailed_html).show();
                }

                //paramString = paramString.substring(0, paramString.length - 2);

            } else {
                $('#h1_params').empty().hide();
                $('#params').empty().hide();
            }

            // alias of ...
            if (object.desc && object.desc.substring(0, 8) == 'Alias of') {
                var aliased = object.desc.substring(9, object.desc.length - 2);
                $('#description').html('Alias of <a href="#" onclick="App.setSearch(\'' + aliased + '\'); return false;">' + aliased + '</a>.').show();
            }
            //var description = object.desc;
            // find other methods in description and make links
            if (object.desc) {
                var html = '<p class="short-desc">' + makeLinks(object.desc);
                if (object.long_desc && object.long_desc > object.desc) {
                    html += ' <a href="#" class="show-long-desc">more…</a></p><p style="display:none" class="long-desc">' 
                         + makeLinks(object.long_desc) + ' <a href="#" class="show-short-desc">…less</a></p>';
                }
                $('#description').html(html);
            }
            
            // return value description
            if (object.ret_desc) {
                $('#return').text(object.ret_desc).show();
            } else {
                $('#return').hide();
            }
            
            // PHP version
            if (searchTerm.getVersion()) {
                $('#searchdiv > em').text(searchTerm.getVersion()).show();
                $('#h1_params').attr('title', searchTerm.getVersion(true));
            } else {
                $('#searchdiv > em').hide();
                $('#h1_params').attr('title', '');
            }
            
            // Code snippets
            if (object.examples) {
                //codeSlidersH = [ ];
                $('#contentdiv .codesnippets').show();
                $('#snippetSlider ul').css('left', 0).empty();

                for (i=0; i < object.examples.length; i++) {
                    var source = $('<div/>').text(object.examples[i].source).html();
                    var title = object.examples[i].title;
                    while (title.length > 45) {
                        title = title.substring(0, title.lastIndexOf(' ') - 1) + ' …';
                    }
                    
                    //var listing = (i+1) + '/' + object.examples.length;
                    if (object.examples[i].output) {
                        source += '\n\n/** GENERATED OUTPUT\n' + object.examples[i].output + '\n*/';
                    }
                    var html = '<li><p class="header">' + title + ' ' + (i+1) + '/' + object.examples.length + '</p>';
                    html += '<div class="source"><a href="#" title="copy to clipboard" class="icon copy"></a>';
                    html += '<div class="viewport scrollable scrollableFull"><ul class="line_numbers">';

                    var rowsCount = source.split('\n').length;
                    rowsCount = rowsCount < 25 ? 25 : rowsCount;
                    for (j=0; j < rowsCount; j++) {
                        html += '<li>' + (j+1) + '</li>';
                    }
                    html += '</ul><pre class="sh_php">' + source + '</pre></div></li>';
                    $('#snippetSlider > ul').append(html);

                    /*var pre = $('#snippetSlider > ul > li:last pre');
                    var lineNumbersUl = $('#snippetSlider > ul ul.line_numbers');
                    if (pre.width() > 378) {
                        lineNumbersUl.height(pre.height() - 10);
                    } else {
                        lineNumbersUl.height(pre.height());
                    }

                    console.log(rowsCount, pre.width(), pre.height());
                    */
                    //$('#snippetSlider > ul > li pre.sh_php').each(function() {
                        //console.log($(this), $(this).height());
                    //});

                    //$('#snippetSlider div.viewport:last').html();

                    /*
                    $('#snippetSlider p.header').each(function() {
                        var header = $(this);
                        while (header.height() > 16) {
                            var text = header.find('span').text();
                            header.find('span').text(text.substring(0, text.lastIndexOf(' ')));
                        }
                    });
                    */
                    
                    //codeSlidersH.push($('#snippetSlider ul li:last > div').tinyscrollbar({ axis: 'x'}));
                }

                // copy & paste hover hint
                $('div.source a.copy').tipsy({ gravity: 'e' });

                //Kodify.beautify();
                sh_highlightDocument();
                
                if (object.examples.length === 1) {
                    $('#snippetSlider').find('.right').hide();
                } else {
                    $('#snippetSlider').find('.right').show();
                }
                $('#snippetSlider').find('.left').hide();
            } else {
                $('#contentdiv .codesnippets').hide();
            }
            
            App.showContainer('content');

            this.adjustHeaderSize();

            var seeAlsoString = '';
            if (object.seealso && object.seealso.length > 0) {
                for (i=0; i < object.seealso.length; i++) {
                    seeAlsoString += '<a href="#">' + object.seealso[i] + '</a>';
                    if (i + 1 != object.seealso.length) {
                        seeAlsoString += ', ';
                    }

                    // lazy load seealso description
                    (function(index) {
                        window.background.model.findObject(new SearchTerm(object.seealso[i]), function(response) {
                            var elm = $('#seealso_content a:eq(' + index + ')');
                            var seeAlsoObject = JSON.parse(response.json);
                            //console.log(response);
                            elm.attr('title', seeAlsoObject.desc + ' (' + response.php_version + ')');

                            var direction = 's';
                            if (elm.offset().left < 100) {
                                elm.tipsy({ gravity: 'sw' });
                            } else if (elm.offset().left > 250) {
                                elm.tipsy({ gravity: 'se' });
                            }
                            elm.tipsy({ gravity: direction });
                            
                        });
                    })(i);
                }
                //seeAlsoString = seeAlsoString.substring(0, seeAlsoString.length - 2);
                $('#seealso_content').html(seeAlsoString);
                $('#seealso').show();
            } else {
                $('#seealso').hide();
            }

            if (searchTerm.isClassAndMethod()) {
                $('#seealsoclass').show();
                $('#seealsoclass_content').text(searchTerm.getClass());
            } else {
                $('#seealsoclass').hide();
            }
            
            App.updatePopupHeight();

        },
        
        
        fillClassContent: function(searchTerm) {
            
            this.setHeader(searchTerm);
            
            App.showContainer('loading');
            
            background.model.findClassMethods(searchTerm, function(results) {
                $('#classmethods .loading').hide();
                //$('#classmethods .scrollbar').show();

                var classmethods = $('#classmethods ul');
                var itemsCount = 0;
                //var rows = result.rows;
                classmethods.empty();
                
                for (var i=0; i < results.length; i++) {
                    var item = results.item(i);
                    if (item.method == results.item(0).method) {
                        continue;
                    } else if (i*1 > 1 && item.pclass != results.item(i*1-1).pclass) {
                        break;
                    }
                    var json = JSON.parse(item.json);
                    classmethods.append('<li><a href="#" title="' + json.desc + '">' + item.pclass + '::' + item.method + '</a><span> - ' + json.desc + '</span></li>');
                    itemsCount++;
                }

                App.showContainer('classlist');
                
                var itemHeight = classmethods.find('li:first').outerHeight();
                var maxHeight = itemsCount * itemHeight + 10 > 300 ? 300 : itemsCount * itemHeight + 10;
                $('#classmethods div.scrollable').height(maxHeight);

                App.stopLoading();

                App.updatePopupHeight();

                $('#controls .copy').hide();

            });
            
        },
        
        
        setHeader: function (searchTerm) {
            var object = searchTerm.getObject();
            
            /*
            if (object['return']) {
                var ret = object['return'].type;
                if (ret === 'int' || ret === 'string' || ret === 'bool' || ret === 'mixed' || ret === 'number' || ret === 'array' || ret === 'float' || ret === 'void' || ret === 'resource' || ret === 'object') {
                    $('.h1div span').show().html(ret);
                } else {
                    $('.h1div span').show().html('<a href="#" onclick="App.setSearch(\'' + ret + '\', true);">' + ret + '</a>');
                }
            } else {
                $('.h1div span').hide();
            }
            */
            
            $('#contentdiv h2, #classmethods h2').text(' ' + searchTerm.toString()).css('font-size', 24);
            $('.h1div span, .h1div span a').css('font-size', 24);
            
            // URL to php.net
            if (object.url) {
                $('#controls .url').attr('href', 'http://www.php.net/manual/' + background.getLocale() + '/' + object.url + '.php')
                             .attr('title', 'Open PHP.net manual page for ' + searchTerm.toString() + ' in a new tab.')
                             .show().tipsy({ gravity: 'e' });
            } else {
                $('#controls .url').hide();
            }

            // copy function definition to clipboard
            $('#controls .copy').show().tipsy({ gravity: 'e' });

        },
        
        adjustHeaderSize: function() {
            var content = $('#contentdiv');
            var span = content.find('.h1div span');
            while (content.find('h2').width() + span.width() > 370) {
                content.find('h2').css('font-size', parseInt(content.find('h2').css('font-size')) - 1);
                if (span.find('> a').length == 1) {
                    span.find('> a').css('font-size', parseInt(span.find('> a').css('font-size')) - 1);
                } else {
                    span.css('font-size', parseInt(span.css('font-size')) - 1);           
                }
            }
        }/*,
        
        updateCodeScrollbars: function() {
            var index = Math.abs(parseInt($('#snippetSlider ul').css('left'))) / this.codeSnippetWidth;
            var li = $('#snippetSlider ul li:eq(' + index + ')');
            var source = li.find(' > .source');
            source.tinyscrollbar({ axis: 'x', size: 335, oScrollbar: source.find('.hscrollbar'), scroll: false });
            source.tinyscrollbar({ axis: 'y', oScrollbar: source.find('.vscrollbar'), size: source.height() - 4 });
            
            if (li.find(' > .output').length > 0) {
                li.find(' > .output').tinyscrollbar({ size: 91 });
            }
            
        }*/
        
    };
    
}();

