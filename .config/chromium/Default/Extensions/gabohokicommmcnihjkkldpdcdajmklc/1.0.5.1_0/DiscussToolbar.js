var Response = function(el){
	this.$el = $(el);
	this.id = this.$el.attr("id");

	var $ctUser = $(".user-card",this.$el)
	var $username = $(".username > a",$ctUser);

	var href = $username.attr("href") || "";
	var url = "http://www.codecademy.com/users/";

	this.author = {
		displayName:$username.text(),
		img: $("img",$ctUser).attr("img"),

		username:href.replace(url,""),
	};

	//this.comments = [];
	this.colapsed = $(".show-more",this.$el).length > 0;

	this.msgHtml = $(".entry",this.$el).html();

	this.timeAgo = $(".timestamp",$ctUser).text();
};

var Comment = function(el){
	this.$el = $(el);
	this.id = this.$el.attr("id");
	var $username = $("p.username > a",self.$el);


	this.author = {
		username:$username.text(),
		displayName:$username.attr("href").replace("http://www.codecademy.com/users/","")
	};
}

var DiscussToolbar = function(){
	this._init();
	//this._addToolbar($.proxy(this._init,this));
}

DiscussToolbar.prototype._init = function(){
	jQuery.getScript("http://james.padolsey.com/demos/scrollevents/scroll-startstop.events.jquery.js");
	jQuery.getScript("http://demos.flesler.com/jquery/scrollTo/js/jquery.scrollTo-min.js");

	this._addToolbar($.proxy(this._setControls,this));

	//this._setControls();

	this._rComments = $.map($(".forum_response"),function(item,i){
		return new Response(item); 
	});

	this._rUsers = $.map(this._rComments,function(oComment,i){
		return oComment.author.displayName;
	});

};

DiscussToolbar.prototype._addToolbar = function(whenDone){
	var $destination = $("#sidebar");
	var $btn = $("a.new_question_link",$destination).css({
		'border-radius':'3px 3px 0 0'
	});

	// menu
	var $ul = $("<ul/>");

	var rIcons = [
		{
			'class':'icon-chevron-up',
			'tooltip':'Back to top'
		},
		{
			'class':'icon-chevron-left',
			'tooltip':'Previous Post'
		},
		{
			'class':'icon-chevron-right',
			'tooltip':'Next Post'
		},
		{
			'class':'icon-th-list',
			'tooltip':'Show all comments'
		},
		{
			'class':'icon-user',
			'tooltip':'Search user'
		}
	];

	var $toolBar = $("<div/>",{ 
		'id':'discussToolbar'
	})
	.css({
		'background':'-webkit-linear-gradient(top, rgba(255,255,255,1) 0%,rgba(243,243,243,1) 100%)',
		'border-radius': '0 0 3px 3px',
		'border': '1px solid #888',
		'padding': '5px',
		'width': '259px'
	});

	// input
	var $input = $("<input/>",{
		'type':'text',
	}).css({
		'border': '0',
	    'box-shadow': 'inset 0 0 10px #AAA',
		'font-size': '12px',
		'margin': '0',
	    'width': '129px'
	});

	$.each(rIcons,function(i,oIcon){
		// icon
		var $i = $("<i/>",{
			'data-original-title':oIcon.tooltip
		})
		.css({
			'margin': '0px 5px'
		})
		.addClass(oIcon.class);

		$toolBar.append($i);
	});

	$toolBar
		.append($input)
		.insertAfter($btn);

	if(whenDone){
		whenDone();
	}
};

DiscussToolbar.prototype._setControls = function(){
	var $container = $("#discussToolbar");

	this._$toTop = $("i.icon-chevron-up",$container);
	this._$prev = $("i.icon-chevron-left",$container);
	this._$next = $("i.icon-chevron-right",$container);
	this._$expand = $("i.icon-th-list",$container);
	this._$user = $("i.icon-user",$container);
	this._$input = $("input",$container);

	this._attachEvents();
};

DiscussToolbar.prototype._attachEvents = function(){
	this.DURATION = 500;

	$(window, document).on("scrollstop, scroll",$.proxy(this._getCurrentDiscussion,this));
	this._$toTop.on("click",$.proxy(this._handleToTop,this));
	this._$prev.on("click",$.proxy(this._handlePrev,this));
	this._$next.on("click",$.proxy(this._handleNext,this));
	this._$expand.on("click",$.proxy(this._handleExpandComments,this));
	this._$user.on("click",$.proxy(this._handleUserClick,this));
	this._$input.on("keyup",$.proxy(this._handleUserSearch,this));

	$("i",$("#discussToolbar")).tooltip({
		'placement':'bottom'
	});

};

DiscussToolbar.prototype._getCurrentDiscussion = function(oEvent){
	var $target = $(oEvent.currentTarget);
	var currentY = window.scrollY;

	var $sidebar = $("#sidebar");

	var $toolbar = $("#toolBar");

	if($sidebar.css("position") === 'fixed' && !toolbar){
		this._addToolbar();
	}

	var closest;

	var self = this;

	$.each(this._rComments,function(i,oComment){
		var top = oComment.$el.offset().top;
		var diff = Math.abs(currentY - top);

		if(!closest || closest > diff){
			self.currentIdx = i;

			self.$current = oComment;

			closest = diff;
		}

	});

	$("input",$("#discussToolbar")).val(self.currentIdx);
};

DiscussToolbar.prototype._handleNext = function(oEvent){
	$(oEvent.currentTarget).tooltip("hide");

	var idx = this.currentIdx;

	if(idx < this._rComments.length - 1){
		idx += 1;
	}

	var id = this._rComments[idx].id;
	var destination = $("#" + id).offset().top + 10;

	var self = this;
	$(document).scrollTo(destination,this.DURATION,{ onAfter:
		function(){
			self.$current = self._rComments[idx];
			self.currentIdx = idx;

			var $icon = $(".icon-th-list",$("#discussToolbar"));

			if(self.$current.colapsed){
				$icon.css({ "-webkit-filter":"brightness(65%)" });
			}
			else{
				$icon.css({ "-webkit-filter":"brightness(0%)" });
			}

			$("input",$("#discussToolbar")).val(idx);
		} 
	});
};

DiscussToolbar.prototype._handlePrev = function(oEvent){
	$(oEvent.currentTarget).tooltip("hide");

	var idx = this.currentIdx;

	if(idx > 0){
		idx -= 1;
	}

	var id = this._rComments[idx].id;
	var destination = $("#" + id).offset().top + 10;

	var self = this;

	$(document).scrollTo(destination,this.DURATION, { onAfter:
		function(){
			self.$current = self._rComments[idx];
			self.currentIdx = idx;

			var $icon = $(".icon-th-list",$("#discussToolbar"));

			if(self.$current.colapsed){
				$icon.css({ "-webkit-filter":"brightness(65%)" });
			}
			else{
				$icon.css({ "-webkit-filter":"brightness(0%)" });
			}

			$("input",$("#discussToolbar")).val(idx);
		}
	});
};

DiscussToolbar.prototype._handleToTop = function(oEvent){
	var self = this;
	var IDX = 0;

	this.$current = this._rComments[IDX];
	this.currentIdx = IDX;
	$(document).scrollTo(IDX,self.DURATION);
};

DiscussToolbar.prototype._handleExpandComments = function(oEvent){
	var $target = $(oEvent.currentTarget);
	var $current = this.$current;

	if($current.colapsed){

		$(".show-more",$current.$el).click();
		this.$current.colapsed = false;

		$target.css({ "-webkit-filter":"brightness(0%)" });
	}
};

DiscussToolbar.prototype._handleUserClick = function(oEvent){

};

DiscussToolbar.prototype._handleUserSearch = function(oEvent){
	console.log(oEvent);
};


$(document).ready(function(){
	new DiscussToolbar(jQuery); 

	$(window).on("scroll",function(){
		if(!$("#discussToolbar").length){
			new DiscussToolbar(jQuery);
		}
	});
})