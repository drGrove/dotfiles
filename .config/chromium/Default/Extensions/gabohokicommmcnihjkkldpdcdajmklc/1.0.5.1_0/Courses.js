var Course = function(el){
	var $el = $(el);
	var desc = $("p",$(el)).contents(":not(mark)").text();

	this.author = $(".author",$(el)).text();
	this.description = $.trim(desc);
	this.href = $("a", $(el)).attr("href");
	this.language = $("mark.language",$(el)).text();
	this.title = $("h3", $(el)).text();

	return this;
};

var Courses = function(){
	this._init();
};

Courses.prototype._init = function(){
	this._URL = "http://www.codecademy.com/courses/lang/all?q=";

};

Courses.prototype.search = function(query,success,fail){
	var url = this._URL + query
	var self = this;
	
	$.ajax({
		url:url,
		success:function(data, textStatus, jqXHR){
			var rCourses = self._getCourses(data);
			console.log(rCourses);
			if(success){
				success(rCourses);
			}
		},
		error:function(jqXHR, textStatus, errorThrown){

		}
	});

};

Courses.prototype._getCourses = function(oCoursesRepsonse){
	var rCourse = $(oCoursesRepsonse).filter(".course_item");
	return $.map(rCourse,function(el,i){
		return new Course(el);
	});
};