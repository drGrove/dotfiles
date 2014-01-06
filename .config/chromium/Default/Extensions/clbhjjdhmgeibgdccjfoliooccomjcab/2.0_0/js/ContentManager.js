
var ContentManager = function() {
    
    var classContainerScrollbar = false;

    function makeLinks(text) {
        return text.replace(/((\w+::)*(\w+)\(\))/g, "<a href=\"#\">$1</a>");
    }

    function pretify(text, surround_inside_para) {
        if (typeof surround_inside_para === "undefined") {
            surround_inside_para = true;
        }
        if (typeof postfix === "undefined") {
            postfix = '';
        }

        text = text.replace(/\\n\\n/g, "\n\n");
        text = makeLinks(markdown.toHTML(text));

        return text;
    }


    return {
        
        codeSnippetWidth: 488,
        
        functionContent: function(searchTerm) {

            this.setHeader(searchTerm);
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
                    var retHtml = '';

                    if (paramsList.ret_type) {
                        if (['int', 'string', 'bool', 'boolean', 'mixed', 'number', 'array', 'float', 'void', 'resource', 'object'].indexOf(paramsList.ret_type) === -1) {
                            retHtml = '<a href="#" class="data_type">' + paramsList.ret_type + '</a>';
                        } else {
                            retHtml = '<span class="data_type">' + paramsList.ret_type + '</span>';
                        }
                    }

                    var funcName;
                    if (object.alt_names && i > 0) {
                        funcName = object.alt_names[i-1];
                    } else {
                        funcName = searchTerm.toString();
                    }

                    paramString += '<p>' + retHtml + ' <span class="name">' + funcName + '</span> (';

                    // generate nicely formated parameters string
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
                                    paramString += '<span class="comma">,</span>';
                                }
                            }

                            paramString += '<span class="' + (0 == obj.beh ? 'mandatory' : 'optional') + '" rel="' + obj['var'] + '"><span class="data_type">' + obj['type'] + '</span>&nbsp;' + obj['var'];
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
                        paramString += ' <span class="brace">] </span>';
                    }

                    paramString += ')</p>';

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
                                    var paragraph = param.desc;
                                    detailed_html += '<li class="clickable ' + optional + '" rel="' + param['var'] + '"><span>' + param.type + ' ' + param['var'] + (optional ? ' (optional)' : '') + '</span><div>' + pretify(paragraph) + '</div></li>';
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
                $('#description').html('Alias of <a href="#">' + aliased + '</a>.').show();
            }
            //var description = object.desc;
            // find other methods in description and make links
            if (object.desc) {
                var hasLongDesc = (object.long_desc && object.long_desc.length > object.desc.length);
                var shortDesc = pretify(object.desc, false);
                var html = '<div class="short-desc' + (hasLongDesc ? ' clickable' : '') + '">' + shortDesc.substr(0, shortDesc.length - 4) + (hasLongDesc ? '<span class="arrow">↓</span>' : '') + '</p></div>';
                if (hasLongDesc) {
                    var longDesc = pretify(object.long_desc, true);
                    html += '<div class="long-desc clickable">' + longDesc.substr(0, longDesc.length - 4) + '<span class="arrow">↑</span></p></div>';
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
                $('#searchdiv > em').text(searchTerm.getVersion(true)).show();
//                $('#h1_params').attr('title', searchTerm.getVersion(true));
            } else {
                $('#searchdiv > em').hide();
//                $('#h1_params').attr('title', '');
            }
            
            // Code snippets
            if (object.examples.length > 0) {
                //codeSlidersH = [ ];
                $('#contentdiv .codesnippets').show();
                $('#snippetSlider ul').css('left', 0).empty();

                for (i=0; i < object.examples.length; i++) {
                    var source = $('<div/>').text(object.examples[i].source).html();
                    var title = object.examples[i].title;
                    while (title && title.length > 65) {
                        title = title.substring(0, title.lastIndexOf(' ') - 1) + '…';
                    }
                    
                    //var listing = (i+1) + '/' + object.examples.length;
                    if (object.examples[i].output) {
                        source += '\n\n/** GENERATED OUTPUT\n' + escapeHtmlEntities(object.examples[i].output) + '\n*/';
                    }
                    var html = '<li><p class="header">' + (title ? title : '') + ' ' + (i+1) + '/' + object.examples.length + '</p>';
                    html += '<div class="source"><a href="#" title="copy to clipboard" class="icon copy"></a>';
                    html += '<div class="viewport scrollable scrollableFull"><ul class="line_numbers">';

                    var rowsCount = source.split('\n').length;
                    rowsCount = rowsCount < 25 ? 25 : rowsCount;
                    for (j=0; j < rowsCount; j++) {
                        html += '<li>' + (j+1) + '</li>';
                    }
                    html += '</ul><pre class="sh_php">' + source + '</pre></div></li>';
                    $('#snippetSlider > ul').append(html);
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

            this.adjustHeaderSize();

            var seeAlsoString = '';
            if (object.seealso && object.seealso.length > 0) {
                for (i=0; i < object.seealso.length; i++) {
                    seeAlsoString += '<a href="#">' + object.seealso[i] + '</a>';
                    if (i + 1 != object.seealso.length) {
                        seeAlsoString += ', ';
                    }

                    // lazy load seealso description
                    //setTimeout((function(index) {
                    (function(index) { 
                        window.background.model.findObject(new SearchTerm(object.seealso[i]), function(response) {
                            var elm = $('#seealso_content a:eq(' + index + ')');
                            var seeAlsoObject = JSON.parse(response.json);
                            //console.log(response);
                            elm.attr('title', seeAlsoObject.desc + ' (' + seeAlsoObject.ver + ')');

                            var direction = 's';
                            if (elm.offset().left < 100) {
                                elm.tipsy({ gravity: 'sw' });
                            } else if (elm.offset().left > 250) {
                                elm.tipsy({ gravity: 'se' });
                            }
                            elm.tipsy({ gravity: direction });
                        });
                    })(i);
                    //}), 25);
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

            App.showContainer('content');
            App.updatePopupHeight();


            /*
             * Setup events
             */
            // replicate hover state over params and method declaration
            $('#h1_params').find('span.mandatory, span.optional').hover(function() {
                $('#params li[rel="' + $(this).attr('rel') + '"]').addClass('active');
            }, function() {
                $('#params li[rel="' + $(this).attr('rel') + '"]').removeClass('active');
            });
            $('#params').find('li').hover(function() {
                $('#h1_params span[rel="' + $(this).attr('rel') + '"]').addClass('active');
            }, function() {
                $('#h1_params span[rel="' + $(this).attr('rel') + '"]').removeClass('active');
            });

            // click on param in method declaration
            $('#h1_params').find('span.mandatory, span.optional').click(function() {
                $('#params li[rel="' + $(this).attr('rel') + '"]').click();
            });

            // short-long description switcher
            if ($('#description').find('div.long-desc, div.short-desc').find('span.arrow').length === 2) {
                $('#description').find('div.long-desc, div.short-desc').find('span.arrow').click(function() {
                    //$(this).parent().find('p').toggle();
                    var visible = $('#description').find('div:visible');
                    var hidden = $('#description').find('div:hidden');

                    // log GA
                    background.ga.trackEvent('click', hidden.is('.long-desc') ? 'long-description' : 'short-description', App.getSearch());

                    visible.hide();
                    hidden.show();
                });

                // handle references to other functions
                $('#description a, #params li a').click(function(e) {
                    e.preventDefault();
                    var term = $(this).text();
                    App.setSearch(term.substr(0, term.length - 2), true);
                });
            }

        },
        
        
        fillClassContent: function(searchTerm) {
            
            this.setClassHeader(searchTerm);
            
            App.showContainer('loading');

            // find all methods for this class
            background.model.findClassMethods(searchTerm, function(results) {
                $('#classmethods .loading').hide();

                var classmethods = $('#classmethods ul');
                var itemsCount = 0;
                //var rows = result.rows;
                classmethods.empty();
                
                for (var i=0; i < results.length; i++) {
                    var item = results[i];
                    var json = JSON.parse(item.json);
                    classmethods.append('<li><a href="#" title="' + json.desc + '">' + item.class + '::' + item.name + '</a><span> - ' + json.desc + '</span></li>');
                    itemsCount++;
                }

                App.stopLoading();
                App.showContainer('classlist');
                
                var itemHeight = classmethods.find('li:first').outerHeight();
                var maxHeight = itemsCount * itemHeight + 10 > 300 ? 300 : itemsCount * itemHeight + 10;
                $('#classmethods div.scrollable').height(maxHeight);

                App.updatePopupHeight();

                $('#controls .copy').hide();

            });
            
        },
        
        
        setHeader: function (searchTerm) {
            var object = searchTerm.getObject();
            
            $('#contentdiv h2').text(' ' + searchTerm.toString()).css('font-size', 24);
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

        setClassHeader: function (searchTerm) {
            $('#classmethods h2').html('The <span>' + searchTerm.getClass() + '</span> class');
//            $('.h1div span, .h1div span a').css('font-size', 24);

            $('#controls .url').hide();
            $('#controls .copy').hide();
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
        }
        
    };
    
}();

