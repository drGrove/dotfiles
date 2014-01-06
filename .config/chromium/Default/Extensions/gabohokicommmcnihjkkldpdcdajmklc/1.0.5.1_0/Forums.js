var Discussion = function(el){
	this.author = el.user;
	this.dateCreated = new Date(el.created_at);
	this.dateUpdated = new Date(el.updated_at);
	this.entry = el.entry;
	this.href = "http://www.codecademy.com" + el.url;
	this.htmlEntry = el.markdown_entry;
	this.numAnswers = el.num_answers;
	this.score = el.score;
	this.title = el.title;
	this.topic = el.topic;
	this.views = el.views;

	return this;
};

var Forums = function(){
	this._init();
};

Forums.prototype._init = function(){
	this._URL = "http://www.codecademy.com/forums/search?q=";
};

Forums.prototype.search = function(query,success,fail){
	var url = this._URL + query
	var self = this;
	
	$.ajax({
		url:url,
		success:function(data, textStatus, jqXHR){
			var rDiscussions = $.map(data.results,function(item,i){
				return new Discussion(item);
			});
		
			console.log(rDiscussions);
			if(success){
				success(rDiscussions);
			}
					
		},
		error:function(jqXHR, textStatus, errorThrown){

		}
	});

};

forums.prototype._getDiscussions = function(rResults){
	return $.map(rResults,function(el,i){
		return new Discussion(el);
	});
};