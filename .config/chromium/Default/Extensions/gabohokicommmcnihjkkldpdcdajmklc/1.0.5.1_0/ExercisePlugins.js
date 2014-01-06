var ExercisePlugins = function($){
	this._init($);
};

ExercisePlugins.prototype._init = function($){
	this._addBugReport($);

	// add glossary
	// add bookmarks

	this._addTermContainer($);
	this._addGlossaryInput($);

	this.$edu = $('#edu');
	$.getScript('http://twitter.github.com/bootstrap/assets/js/bootstrap-typeahead.js',function(script, textStatus, jqXHR){
		//console.log(script, textStatus, jqXHR);
	});
	this._attachEvents($);
};

ExercisePlugins.prototype._addBugReport = function(){
	var bugReport = document.getElementById('_bug_report');

	if(!bugReport){
		var $a = $('<a/>')
			.addClass('icon-wrench')
			.attr({
				'href':'/forms/bugreport',
				'id':'_bug_report',
				'target':'_blank',
				'title':'Report a Bug'
			})
			.css({
				'background-position':'-360px -144px',
				'-webkit-filter':'contrast(0%)'
			});

		var $div = $('<div/>')
			.addClass('fl-right')
			.css({
				'padding':'14px 10px'
			})
			.append($a)
			.insertAfter('.main .user');
	}
};

ExercisePlugins.prototype._addTermContainer = function($){
	var $link = $('a[href*="glossary"]').attr('id','_glos');
	var $glossary = $link.parent('li')
		.addClass('glossary');

	$('<div/>')
		.attr({ id:'_term'})
		.css({
			'border-bottom':'2px solid #EAEAEA',
			'border-top':'2px solid #EAEAEA',
			'display': 'none',
			'float': 'left',
			'margin':'10px 0',
			'max-height':100,
			'overflow':'auto',
			'padding': '10px 0',
			'position':'absolute',
			'right':0,
			'top':0,
			'width':$('#repl').width()
		})
		.appendTo($glossary);
}

ExercisePlugins.prototype._addGlossaryInput = function($){
	var id = '_glos_input';
	var $input = $('#' + id);

	if(!$input.length){
		$input = $('<input/>')
			.attr({
	 			'id':id,
	 			'placeholder':'Glossary',
				'type':'text'
	 		})
	 		.css({
	 			'border-radius':'0',
	 			'color': '#08C',
	 			'display':'none',
	 			'font-family':'Arial',
	 			'font-size':12,
	 			'font-weight':'bold',
	 			'margin':0,
	 			'padding':'0 5px',
	 			'text-decoration': 'none',
	 			'width':'115px'
	 		});
		$('.glossary',this.$edu)
			.append($input);
	}
};

ExercisePlugins.prototype._attachEvents = function(){
	this.$edu.on('click','.glossary > a#_glos',$.proxy(this._extendGlossary,this));
	this.$edu.on('click','.glossary .typeahead li',$.proxy(this._handleTermClick,this));
};

ExercisePlugins.prototype._extendGlossary = function(oEvent){
	oEvent.preventDefault();
	var $target = $(oEvent.currentTarget);
	var isExtended = !!$target.data('extended');

	if(!isExtended){
		var glossary = new Glossary();
		var url = $(oEvent.currentTarget).attr('href');
		var language = url.replace('/glossary/','');
		var self = this;
		$(oEvent.currentTarget).data('extended',true);

		glossary.search(language,function(oResults){
		/* TODO: Add Glossary functionality
		 * ajax the glossary and use jquery auto complete to search glossary for each language
		 */
		 	self._handleSuccess(oResults);
			
		});
	}

	var $input = $('#_glos_input').show();
	$target.hide();
	
};

ExercisePlugins.prototype._handleSuccess = function(oResults){
	var rTerms = $.map(oResults,function(term,i){
		return term.term;
 	});

	var oTerms = {};
	var self = this;
	$.each(oResults,function(i,term){
		var key = term.term.split(' ').join('_').toLowerCase();
		oTerms[key] = term;
	});

	this._oTerms = oTerms;

 	//console.log(oResults,rTerms,oTerms);

 	var $input = $('#_glos_input');
 	$('.glossary > a#_glos',this.$edu).hide();

 	$('.glossary > ul',this.$edu)
 		.css({
 			position:'absolute',
 			'font-size':12,
 			margin:0,
 			padding:0,
 			'z-index':9999
 		});

 	var self = this;

 	$input
 		.data('provide','typeahead')
 		.typeahead({
 			source:rTerms,
 			updater:function(item){
 				console.log(item);
 				self._showTerm(item);
 			}
		})
 		.delay(1500)
 		.fadeIn(1500);

 	$('.glossary > span',this.$edu).hide();
};

ExercisePlugins.prototype._handleTermClick = function(oEvent){
	console.log(term);
	oEvent.preventDefault();
	var $target = $(oEvent.currentTarget);
	var term = $target.data('value');
	this._showTerm(term);
};

 ExercisePlugins.prototype._showTerm = function(term){
 	var key = term.split(' ').join('_').toLowerCase();
 	var oTerm = this._oTerms[key];
 	var $overlay = $('#overlay');

 	if($overlay.is(':hidden')){
	 	$overlay
	 		.empty()
	 		.append($('<h2/>').text(oTerm.term))
	 		.append($('<p/>').text(oTerm.definition))
	 		.append(oTerm.$example)
	 		.append($('<a/>')
	 			.attr({
	 				'href':'/docs/glossary/',
	 				'title':'See the full glossary'
	 			})
	 			.text('Full Glossary'))
	 		.append($('<a/>')
	 			.addClass('help_text')
	 			.attr({
	 				'href':'#'
	 			})
	 			.text('Close definition'))
	 		.show();

	 	$overlay
	 		.children()
	 		.wrapAll('<div class="modal-overlay" margin="90px;"></div>');
	 	
	 	$('.modal-overlay')
	 		.css({
	 			height:'auto'
	 		})
	 		.show();


	 	$('.glossary > *:not(a)',this.$edu).hide();
		$('.glossary > a',this.$edu).show();

	}
 };
 /* Glossary */

 var Term = function(el){
	var $el = $(el);
	var def = $('p',$(el)).text();
	var term = $('.page-header > h2',$el).text();

	this.id = $('.page-header > h2',$el).attr('id');
	this.term = $('.page-header > h2',$el).text();
	this.definition = $.trim(def);
	this.$example = $('pre',$(el));

	return this;
};

var Glossary = function(){
	this._init();
};

Glossary.prototype._init = function(){
	this._URL = 'http://www.codecademy.com/glossary/';
};

Glossary.prototype.search = function(language,success,fail){
	var url = this._URL + language
	var self = this;
	
	$.ajax({
		url:url,
		success:function(data, textStatus, jqXHR){
			var rTerms = self._getTerms(data);
			if(success){
				success(rTerms);
			}
		},
		error:function(jqXHR, textStatus, errorThrown){

		}
	});

};

Glossary.prototype._getTerms = function(oGlossaryRepsonse){
	var $glossary = $(oGlossaryRepsonse).find('#glossary-content');
	var rTerms = $glossary.children('div');
	return $.map(rTerms,function(el,i){
		return new Term(el);
	});
};

/* END Glossary */
(function(){ new ExercisePlugins(jQuery); })();