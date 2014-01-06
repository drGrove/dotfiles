var Term = function(el){
	var $el = $(el);
	var def = $("p",$(el)).text();

	this.id = $(".page-header > h2",$el).attr("id");
	this.term = $(".page-header > h2",$el).text();
	this.definition = $.trim(def);
	this.$example = $("pre",$(el));

	return this;
};

var Glossary = function(){
	this._init();
};

Glossary.prototype._init = function(){
	this._URL = "http://www.codecademy.com/glossary/";

};

Glossary.prototype.search = function(language,success,fail){
	var url = this._URL + language
	var self = this;
	
	$.ajax({
		url:this._url,
		success:function(data, textStatus, jqXHR){
			var rTerms = self._getTerms(data);
			console.log(rTerms);
			if(success){
				success(rTerms);
			}
		},
		error:function(jqXHR, textStatus, errorThrown){

		}
	});

};

Glossary.prototype._getTerms = function(oGlossaryRepsonse){
	var $glossary = $(oGlossaryRepsonse).find("#glossary-content");
	var rTerms = $glossary.children("div");
	return $.map(rTerms,function(el,i){
		return new Term(el);
	});
};