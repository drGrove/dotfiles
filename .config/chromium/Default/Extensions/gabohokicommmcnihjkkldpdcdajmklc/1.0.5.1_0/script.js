Number.prototype.toMagnitude = function(){

	var n = this,
		m = ['','','','K'],
		ml = m.length,
		s = n.toString(),
		l = s.length,
		f = ml >= l && !!m[l - 1] ? s[0] + m[l - 1] : s;
		
	return f;
}

var PageManager = function (){
	this._init();
};

PageManager.prototype._init = function(){
	this.MAX_USERS = 25;
	this.$loading = $("#loading");
	this.$container = $("#container");
	this.$input = $("#username-input");
	this.$form = $("form", this.$container);
	this.$error = $(".error", this.$container);
	this.$ctUserInfo = $("#user-info");
	this.$ctUser = $("#user");
	this.$savedList = $("#saved-users");
	this.$alert = $(".alert",this.$savedList);

	this.ccUser = new CodecademyUser();

	this._initTooltips();
	this._initUI();
	this._renderSavedUsers();
	this._attachEvents();
};

PageManager.prototype._oStorage = {
	storage: window.localStorage,

	_clear:function(){
		this.storage.clear();
	},
	set: function(key,oVal){
		var sVal = JSON.stringify(oVal);
		this.storage.setItem(key,sVal);
	},
	get: function(key){
		var sVal = this.storage.getItem(key);

		return $.parseJSON(sVal);
	},
	remove: function(key){
		this.storage.removeItem(key);
	}
};

PageManager.prototype._initTooltips = function(){
	var self = this;

	$(".stats").tooltip({
		animation:true,
		placement:'bottom',
		selector:'li',
		trigger:'hover',

	});

	$("#user > header").tooltip({
		animation:true,
		content:function(){
			return $(this).attr('title');
		},
		placement:'right',
		selector:'h1[data-prop],h2[data-prop]',
		trigger:'hover'
	});

	$('#user > .lists').tooltip({
		animation:true,
		content:function(){
			return $(this).data('original-title');
		},
		placement:'left',
		selector:'*[data-original-title]',
		trigger:'hover'
	});

	$("#saved-users").tooltip({
		animation:true,
		content:function(){
			return $(this).data('original-title');
		},
		placement:'left',
		selector:'.refresh,.delete,.warning',
		trigger:'hover'
	});

	// $("#saved-users").popover({
	// 	animation:true,
	// 	content:function(){
	// 		var username = $(this).parents(".saved-user").prop("id");
	// 		var rActivity = self._oStorage.get(username).activity || [];
	// 		rActivity = _.sortBy(rActivity,function(val,i){
	// 			return val.timestamp;
	// 		}).reverse();

	// 		var rHtml = $.map(rActivity, function(oActivity,i){
	// 			return "<li><a href='" + oActivity.courseLink + "'>" + oActivity.course + "</a><span class='tiny'>" + oActivity.action + " " + oActivity.timestamp + "</span></li>";
	// 		});
	// 		var $html = rHtml.join("");

	// 		//_gaq.push(['_trackEvent', 'actvity ' + username, 'actvity']);
			
	// 		return $("<ul/>").html($html);
	// 	},
	// 	delay: { show: 500, hide: 0 },
	// 	html:true,
	// 	inside:true,
	// 	placement:'left',
	// 	selector:'.activity',
	// 	title:'Recent activity',
	// 	trigger:'hover'
	// });
};

PageManager.prototype._initUI = function(){
	var self = this;
	//draggable
	$("header",this.$ctUser).draggable({
		appendTo:"#saved-users",
		revert: "invalid",
		containment: "document",
		handle: "img",
		helper: "clone",
		start:function( event, ui ) {
			console.log(event, ui);
			console.log('start',$(event.currentTarget));
				
			$(ui.helper).css({
				'-webkit-box-shadow':'0 0 10px #AAA',
				'box-shadow':'0 0 10px #AAA',
				'z-index':99999
			});
				
		},
		activeClass: "ui-state-hover",
		hoverClass: "ui-state-active"
	});

	// droppable
	this.$savedList
		.droppable({
			accept: "#user > header",
			activeClass: "ui-state-active",
			hoverClass: "ui-state-hover",
			drop: function( event, ui ) {
				console.log(event, ui);
				
				var $user = $("#user");
				var $userList = $("ul:eq(0)", self.$savedList);
				var rUsers = self._oStorage.get("users") || [];
				var oUser = $(ui.draggable).data("user");

				if($user.hasClass("saved") || rUsers.indexOf(oUser.username) > -1){
					self.$alert
						.text("This user has already been saved.")
						.show("drop",{direction:'up'},250,function(){

						var $userLi = $("#" + oUser.username);
						self.$savedList.stop().scrollTo($userLi,150);
						$userLi.effect("highlight", { color:'#FBEED5' }, 3000);

						var t = setTimeout(function(){
							self.$alert.hide("drop",{direction:'up'},250);
						},1500);

					});
				}
				else if(rUsers.length >= self.MAX_USERS){
					self.$alert
						.text("Cannot save more than " + self.MAX_USERS + " users.")
						.show("drop",{direction:'up'},250,function(){

							var t = setTimeout(function(){
								self.$alert.hide("drop",{direction:'up'},250);
							},1500);

						});
				}
				else{
					
					rUsers.push(oUser.username);
					// cloning the item and wrapping its conetents in a li
					var $contents = ui.draggable.clone(true).contents();
					
					var $li = $("<li/>")
						.addClass("contain saved-user")
						.attr({
							id:oUser.username
						})
						.data(oUser)
						.html($contents);
					// append the list item and update the data attr
					$userList
						.append($li)
						.data("users",rUsers);

					self.$savedList
						.removeClass("empty");

					self._renderUser(oUser);

					// save user
					self._oStorage.set(oUser.username, oUser);
					$user.addClass("saved");
					$(".icon",$user).addClass("active");

					// save the order of users
					self._oStorage.set("users", rUsers);

					_gaq.push(['_trackEvent', 'saved ' + oUser.username, 'saved']);
				}
			},
			over:function( event, ui ) {
				console.log(event, ui);
				console.log('over');
			},
			tollerance:"intersect"
		});

	$("> ul",this.$savedList)
		.sortable({
			axis: "y",
			containment: "parent",
			dropOnEmpty: true,
			forceHelperSize: true,
			handle: "img",
			items:"> li",
			start:function( event, ui ) {
				console.log(event, ui);
				console.log('start',$(event.currentTarget));
					
				var $target = $(ui.item);

				$target.css({
					'-webkit-box-shadow':'0 0 10px #AAA',
					'box-shadow':'0 0 10px #AAA',
					'z-index':99999
				});

				$("div",$target).hide();
				$("hgroup",$target).show();	
					
			},
			sort: function(event, ui){
				var $target = $(ui.item);

				$("hgroup",$target).show()
				$("div",$target).hide();
			},
			stop:function(event, ui){
				var $users = $(".saved-user",self.$savedList);

				var rUsernames = $.map($users,function(item,i){
					return $(item).attr("id");
				});

				$users
					.removeAttr("style")
					.parents("ul")
						.data("users",rUsernames);

				// save the order of users
				self._oStorage.set("users", rUsernames);

				_gaq.push(['_trackEvent', 'sorted manually', 'sorted']);
			}
		});
};

PageManager.prototype._renderSavedUsers = function(){
	var self = this;

	var rUsers = self._oStorage.get("users") || [];

	if(rUsers && rUsers.length > 0){
		this.$savedList.removeClass("empty");
		var $template = $("header",this.$ctUser).clone(true);;
		var $destination = $("> ul",this.$savedList).data("users",rUsers);

		$(".info",this.$savedList).hide();

		$.each(rUsers,function(i,username){
			var oUser = self._oStorage.get(username) || {};
			var $contents = $template.clone().contents();

			var $li = $("<li/>")
				.addClass("contain saved-user")
				.attr({
					id:oUser.username || username
				})
				.data("user",oUser)
				.html($contents)
				.hide();

			$("[data-prop]",$li).each(function(i,el){
				var prop = $(el).data("prop");
				if(prop === "photo"){
					$(el).attr({
						'src':oUser[prop],
						'title':username
					})
					.data({
						'username':username
					});
				}
				else if(prop === "username"){
					var href = 'http://www.codecademy.com/users/' + username;
					$(el).html(
						$("<a/>")
							.attr({
								href:href,
								target:'_blank'
							})
							.text(username)
						);
				}
				else{
					$(el).text(oUser[prop]);
				}
			});

			setTimeout(function(){
				$destination.append($li.fadeIn());
				self._renderUser(oUser);
			},i * 250);
			
		});


	}
};

PageManager.prototype._attachEvents = function(){
	this.$container.on("click", "button", $.proxy(this._handleSubmit,this));
	this.$ctUserInfo.on("click",".lists .expandable header",$.proxy(this._handleToggleList,this));
	this.$ctUserInfo.on("click",".ribbon .user",$.proxy(this._handleRibbonClicked,this));
	this.$ctUserInfo.on("mouseenter",".ribbon .user",$.proxy(this._handleRibbonHover, this));
	this.$ctUserInfo.on("mouseleave",".ribbon .user", $.proxy(this._handleRibbonUnhover, this));
	this.$container.on("click","a",$.proxy(this._handleAnchorClick, this));
	this.$savedList.on("click",".saved-user > img", $.proxy(this._handleHoverSavedUser, this));
	this.$savedList.on("mouseleave",".saved-user", $.proxy(this._handleUnoverSavedUser, this));
	this.$savedList.on("click",".saved-user .controls a", $.proxy(this._handleUserControlClicked, this));
	this.$savedList.on("dblclick",".saved-user > img", $.proxy(function(oEvent){
		this.$loading.show();
		var username = $(oEvent.currentTarget).data('username');
		this._refreshUser(username); 
	}, this));
	this.$input
		.on("keyup",$.proxy(this._handleInputKeyup,this))
		.typeahead({
			items:15,
			source: $.proxy(function (typeahead, query) {
				this.xhr =  this.xhr || { abort:function(){} };

				this.xhr.abort();

				this.xhr = $.get('http://www.codecademy.com/users/autocomplete', { query: query }, function (data) {
					var rMatches = _.filter(data.items,function(item){ return !!item.username && item.username.indexOf(query) > -1; });//_.pluck(data.items,"username");
					var rUsernames = _.pluck(rMatches,"username");

					return typeahead.process(rUsernames);
				});
				return this.xhr;
			}, this)
		});
};

PageManager.prototype._handleToggleList = function(oEvent){
	var $target = $(oEvent.currentTarget);
	var $parent = $target.parents(".lists section");
	var $list = $target.next("ul");
	var section = $("h1",$target).text();

	if($list.is(":visible")){
		$list.slideUp(400,function(){
			$parent.removeClass("open");
		});
	}
	else{
		$parent
			.addClass("open")
			.siblings("section").removeClass("open",400);

		$("ul",".lists").slideUp();
		$list.slideDown(400,function(){
			$(".lists").stop().scrollTo($parent,750);
		});
	}

	_gaq.push(['_trackEvent', 'toggled ' + section, 'toggled']);
}

PageManager.prototype._handleSubmit = function(oEvent){
	oEvent.preventDefault();

	var username = this.$input.val().toLowerCase();
	this.$input
		.val("")
		.trigger("keyup");
	
	if(!username || username.length === 0){
		this._showError();
		this._hideUser();
		return;
	}

	$(".saved-user",this.$savedList).show();
	this.$loading.show();

	var self = this;

	this.ccUser.search(username, $.proxy(self._handleSuccess,self), $.proxy(self._handleError,self));

	_gaq.push(['_trackEvent', 'searched ' + username, 'searched']);
};

PageManager.prototype._handleInputKeyup = function(oEvent){
	var rUsers = this._oStorage.get("users") || [];
	var $target = $(oEvent.currentTarget);

	// function updateTypeahead(rUsernames){
	// 	$target.typeahead({
	// 		minLength:2,
	// 		source:rUsernames
	// 	});
	// }

	if(oEvent.which !== 13  && rUsers.length > 0){

		if(window.keyTimeout){
			window.clearTimeout(window.keyTimeout);
		}
		var self = this;
		window.keyTimeout = window.setTimeout(function(){
			var val = $target.val().toLowerCase();

			// var xhr = { abort:function(){} };

			if(val.length >= 2 && rUsers.length > 1){
				$.each(rUsers,function(i,username){
					var oUser = self._oStorage.get(username);
					if(username.toLowerCase().indexOf(val) > -1 || oUser.displayName.toLowerCase().indexOf(val) > -1){
						$("#" + username)
							.animate({'opacity':1},400);//.show();
					}
					else{
						$("#" + username)
							.animate({'opacity':0.15},400);//.hide();
					}
				});

				// xhr = $.ajax({
				// 	url:'http://www.codecademy.com/users/autocomplete?query=' + val,
				// 	success:function(e){ 
				// 		var rMatches = _.map(e.items,function(item){ return item.username; });
				// 		var rUsernames = _.reject(rMatches,function(match){
				// 			return !match || match.indexOf(val) === -1;
				// 		});

				// 		updateTypeahead(rUsernames);

				// 		console.log(rUsernames,$target.data());
				// 	}
				// });
			}
			else{
				$(".saved-user",this.$savedList)
					.animate({'opacity':1},250);

				// xhr.abort();
			}
		},500);
	}
};

PageManager.prototype._handleSuccess = function(oUser){
	var user = {};
	
	_.each(oUser,function(val,key){
		if(oUser.propertyIsEnumerable(key)){
			user[key] = val;
		}
	});

	$('header',this.$ctUser).data('user',user);

	this._showUser();

	this._renderHeader(user);

	
	console.log(user);
	//render stats
	this._renderStats(user);

	var $container = $('#drawers').empty();
	// badges
	var $list = this._renderList('badges', user.badges);
	$container.append($list);

	// courses authored
	if(user.coursesAuthored.length){
		$list = this._renderList('coursesAuthored', user.coursesAuthored);
		$container.append($list);
	}

	// groups
	if(user.groups.length){
		$list = this._renderList('groups', user.groups);
		$container.append($list);
	}

	// tracks
	$container = $('#tracks').empty();
	$.each(user.tracks, $.proxy(function(i, oTrack){
		$list = this._renderTrack(oTrack);
		$container.append($list);
	},this));
	

	this.$loading.fadeOut();
};

PageManager.prototype._renderHeader = function(oUser){
	var $container = $('header',this.$ctUser);
	
	var $ribbon = $('.ribbon',this.$ctUser).slideUp('fast');
	
	var username = oUser.username;
	
	var oStoredUser = this._oStorage.get(username);
	if(!$.isEmptyObject(oStoredUser)){
		$('.icon', $ribbon).addClass('active');
		this.$ctUser.addClass('saved');
	}
	else{
		$('.icon', $ribbon).removeClass('active');
		this.$ctUser.removeClass('saved');
	}

	$.each(oUser,function(key,val){
		if(typeof val === 'string'){
			var $el = $('[data-prop="' + key + '"]',$container);
			if(key === "photo"){
				$el.fadeOut('fast',function(){
					$(this).attr({
						'alt':oUser.displayName,
						'src':val
					}).show('drop',{ direction:'left' },400);

					setTimeout(function(){
						$ribbon.slideDown(250);
					},1000);
				});
			}
			else{
				$el.fadeOut('fast',function(){
					$(this).attr({
						'data-original-title':oUser[key],
						'title':oUser[key]
					})
					.text(val);

					if(key === 'username'){
						var href = 'http://www.codecademy.com/' + val;
						$el.html(
							$("<a/>")
								.attr({
									href:href,
									target:'_blank'
								})
								.text(val)
						);
					}
				});

				$el.show("drop", { direction:'down' }, 250);
			}
		}
	});
};

PageManager.prototype._renderList = function(list,rItems){
	//TODO: add list
	var $content = $("<ul/>");
	var classNames = [list.split(' ').join('-')];

	if(list.toLowerCase() === 'badges'){
		$content = this._renderBadges($content,rItems);
		classNames.push('expandable');
	}
	else if(list.toLowerCase() === 'coursesauthored'){
		$content = this._renderCoursesAuthored($content,rItems);
		classNames.push('expandable');
	}
	else if(list.toLowerCase() === 'groups'){
		$content = this._renderGroups($content,rItems);
		classNames.push('expandable');
	}

	// Pascal Casing
	var headerText = list.charAt(0).toUpperCase() + list.substring(1);
	headerText = $.trim(headerText.replace(/([A-Z][a-z]*)/, '$1 '));
	var $header = $("<header/>")
		.addClass("contain")
		.append(
			$("<h1/>")
				.addClass("pull-left")
				.text(headerText),
			$("<span>")
				.addClass("count pull-right")
				.text(rItems.length)
		);

	return $("<section/>")
		.addClass(classNames.join(' '))
		.append(
			$header,
			$content
		);
};

PageManager.prototype._renderBadges = function($ul, rBadges){
	$.each(rBadges,function(i,badge){
		var $li = $("<li/>")
			.append(
				badge.name,
				$("<span/>")
					.addClass("tiny")
					.text(badge.dateAchieved)
			);

		$ul.append($li);
	});

	return $ul;
};

PageManager.prototype._renderCoursesAuthored = function($ul, rCourses){
	$.each(rCourses,function(i,course){
		/* 
		 * href
		 * name
		 * stars
		 * timesTaken
		 */

		var $stars = $('<span/>')
			.addClass('right pull-right')
			.text(course.stars.split(' ').join(''))
			.prepend(
				$('<span/>')
					.addClass('icon star')
					.attr('data-original-title','Taken ' + course.timesTaken + ' times')
					.data('original-title','Taken ' + course.timesTaken + ' times')
					.text('★'));

		var $link = $('<a/>')
			.addClass('text-overflow')
			.attr({
				href:course.href,
				target:'_blank',
				title:course.name
			})
			.text(course.name);

		var $li = $('<li/>')
			.append($link)
			.append($stars);

		$ul.append($li);
	});

	return $ul;
};

PageManager.prototype._renderGroups = function($ul, rGroups){
	$.each(rGroups,function(i,group){
	/* 
	 * href
	 * icon
	 * name
	 */
		var $icon = $('<img src="' + group.icon + '" />')
			.attr({
				'alt':group.name
			});

		var $link = $('<a/>')
			.addClass('text-overflow')
			.attr({
				href:group.href,
				target:'_blank',
				title:group.name
			})
			.text(group.name);

		var $li = $('<li/>')
			.append($icon)
			.append($link);

		$ul.append($li);
	});

	return $ul;
};

PageManager.prototype._renderStats = function(oUser){
	var $container = $('.stats',this.$ctUser)
	
	$.each(oUser,function(key,val){
		if(typeof val === 'number'){
			$('[data-prop="' + key + '"]',$container)
				.text(val);
		}
	});
};

PageManager.prototype._renderTrack = function(oTrack){
	/* 
	 * href - string
	 * percent - number
	 * name - string
	 * progress - string
	 * sectionsCompleted - number
	 */
	var $percentBar = $('<div/>')
		.addClass('percent-bar')
		.css({
			'width': oTrack.percent + '%'
		});

	var $headerLink = $('<a/>')
		.attr({
			href: oTrack.href,
			title: oTrack.name
		})
		.text(oTrack.name);

	

	return $('<section/>')
		.addClass('track contain')
		.append(
			$('<h1/>')
				.addClass('pull-left text-overflow')
				.append($headerLink),
			$('<span>')
				.addClass('count pull-right')
				.attr({
			'data-original-title': oTrack.progress + ' exercises completed'
			})
			.data('original-title',oTrack.progress + ' exercises completed')
				.text(oTrack.percent + '%'),
			$('<div/>')
				.append($percentBar)
		);

};

PageManager.prototype._handleError = function(oUser){
	console.log(oUser);
	this.$loading.hide();
	this._showError();
};

PageManager.prototype._showError = function(context, err){
	var self = this;
	
	console.log(err);
	self.$error.show("shake", { distance:5, times:3 }, 75, function(){
				
		setTimeout(function(){
			self.$error.fadeOut("slow");
		}, 1500);

	});
};

PageManager.prototype._refreshUser = function(username){
	var $container = $('#' + username);

	this.ccUser.search(
		username, 
		// success
		$.proxy(function(oUser){
			this._handleSuccess(oUser);

			$("div",$container).empty();

			this._renderUser(oUser);
			this._oStorage.set(username,oUser);

			_gaq.push(['_trackEvent', 'refreshed ' + username, 'saved']);
		},this), 
		// fail
		$.proxy(function(oUser){
			this.$loading.hide();
			$target
				.removeClass("refresh")
				.addClass("warning")
				.attr("title", "Username not found");

		self._oStorage.remove(username);
		},this)
	);
};

PageManager.prototype._removeUser = function(username,callback){
	//remove user
	this._oStorage.remove(username);
	
	//update list
	var rUsers = this._oStorage.get("users");
	rUsers = _.without(rUsers,username);
	this._oStorage.set("users",rUsers)

	//update list data
	var $userItem = $("li#" + username);
	var $usersList = $userItem.parent("ul");
	rUsers = $usersList.data("users");
	rUsers = _.without(rUsers,username);
	$usersList.data("users", rUsers);

	var self = this;

	$userItem.hide("slide",{ direction:'up' },250,function(){
		$(this).remove();

		if(rUsers.length === 0){
			self.$savedList
				.addClass("empty");

			$(".info",self.$savedList).show();
		}

		if(callback){
			callback();
		}

		_gaq.push(['_trackEvent', 'removed ' + username, 'removed']);
	});
};

PageManager.prototype._showUser = function(){
	this.$ctUser.show();
	$(".info",this.$ctUserInfo).hide();
};

PageManager.prototype._renderUser = function(oUser){

	function mergeTracks(rTracks,trackName){
		var matches = _.filter(rTracks,function(track,i){
			return track.name.toLowerCase().indexOf(trackName) > -1;
		})

		var oTrack = {
			name:trackName,
			achievements: 0
		};

		_.each(matches,function(track,i){
			oTrack.achievements += parseInt(track.sectionsCompleted,10);
		});

		return oTrack;
	}
	//eventually will be the callback
	var $li = $('#' + oUser.username);

	var name = oUser.displayName || oUser.username;
	var $html = [
		'<li><a href="#" class="icon delete" title="Delete ' + name + '">&nbsp;</a></li>',
		'<li><a href="#" class="icon refresh" title="Refresh ' + name + '\'s stats">&nbsp;</a></li>'//,
		//'<li><span class="icon cog">&nbsp;</span></li>'
	].join('');

	var $controls = $("<ul/>")
		.addClass("controls")
		.html($html);

	var rTracks = ['javascript','python','ruby','web','jquery','code year','php','api'];

	var oTracks = {};

	_.each(rTracks, function(track){ 
		oTracks[track] = mergeTracks(oUser.tracks,track);
	}); 

	var $ul = $("<ul/>").addClass("trackBadges");
	
	// Top 6
	 oTracks = _.sortBy(oTracks,function(oTrack){
	 	return oTrack.achievements * -1;
	 });

	 oTracks = _.first(oTracks,6);
	// END Top

	_.each(oTracks,function(oTrack,i){
		var $li = $("<li/>").addClass('text-overflow');

		var $icon = $("<span/>")
			.attr("data-original-title",oTrack.name)
			.addClass("icon " + oTrack.name.split(" ").join("-"))
			.tooltip({
				animation:true,
				placement:'left',
				select:'.trackBadge > .icon',
				trigger:'hover'
			});

		var number = oTrack.achievements || 0;
		number = number.toMagnitude();

		$li
			.text(number)
			.prepend($icon);

		$ul.append($li);

	});

	var $ct = $("<div/>").append($ul,$controls);
	
	setTimeout(function(){
		$("hgroup",$li).fadeOut("slow",function() {
			$li.append($ct.fadeIn("slow"));
		});
	},750);
};

PageManager.prototype._hideUser = function(){
	this.$ctUser.hide();
	$(".info",this.$ctUserInfo).show();
};

PageManager.prototype._handleRibbonHover = function(oEvent){
	var $target = $(oEvent.currentTarget);
	var clickAction = $target.hasClass("active")
		? "remove"
		: "add";

	$target
		.addClass(clickAction)
		.data("action",clickAction)
		.attr({
			"title":'Click to ' + clickAction + ' user'
		});
};

PageManager.prototype._handleRibbonUnhover = function(oEvent){
	$target = $(oEvent.currentTarget);

	var clickAction = $target.hasClass("active")
		? "remove"
		: "add";

	$target
		.removeClass(clickAction)
};

PageManager.prototype._handleRibbonClicked = function(oEvent){
	var $target = $(oEvent.currentTarget);
	var $ribbon = $target.parents(".ribbon");

	var action = $target.attr("class")
		.replace("icon user ","")
		.replace("active ","");

	var $template = $("> header",this.$ctUser);

	var oUser = $template.data("user");
	var username = oUser.username;
	var rUsers = this._oStorage.get("users") || [];
	
	var $destination = $("> ul",this.$savedList);

	var self = this;
	switch(action){
		case "add":
			if(rUsers.length >= self.MAX_USERS){
				self.$alert
					.text("Cannot save more than " + self.MAX_USERS + " users.")
					.show("drop",{direction:'up'},250,function(){

						var t = setTimeout(function(){
							self.$alert.hide("drop",{direction:'up'},250);
						},1500);

					});
			}
			else{
				var $contents = $template.clone(true).contents();
						
				var $li = $("<li/>")
					.addClass("contain saved-user")
					.attr({
						id:oUser.username
					})
					.data("user",oUser)
					.html($contents)
					.hide();

				$template
					.effect( "transfer", { to: this.$savedList }, 750, function(){
						self.$ctUser.addClass("saved");
						$target
							.addClass("active")
							.removeClass(action);

						self._oStorage.set(username,oUser);

						$destination
							.append($li.fadeIn());

						self.$savedList
							.removeClass("empty")

						self._renderUser(oUser);

						rUsers.push(username);
						self._oStorage.set("users",rUsers);
						$destination.data("user",rUsers);
					});

					_gaq.push(['_trackEvent', 'saved ' + username, 'saved']);
			}
			break;
		case "remove":
			this._removeUser(username,function(){
				self.$ctUser.removeClass("saved");
				$target
					.removeClass(action)
					.removeClass("active");
			});
			break;
		default:
			break;
	}
};

PageManager.prototype._handleHoverSavedUser = function(oEvent){
	var $target = $(oEvent.currentTarget);

	if(this.hoverTimeout){
		clearTimeout(this.hoverTimeout);
	}

	this.hoverTimeout = setTimeout(function(){
		$target.siblings("div").fadeOut(100,function() {
			$target.siblings("hgroup").fadeIn();
		});
	},400);
};

PageManager.prototype._handleUnoverSavedUser = function(oEvent){
	var $target = $(oEvent.currentTarget);

	if(this.hoverTimeout){
		clearTimeout(this.hoverTimeout);
	}

	$("hgroup",$target).fadeOut(100,function() {
		$("div",$target).fadeIn();
	});	
};

PageManager.prototype._handleUserControlClicked = function(oEvent){
	oEvent.preventDefault();
	var $target = $(oEvent.currentTarget);
	var $container = $target.parents(".saved-user");
	var action = $target.attr("class").replace("icon ","");
	var username = $container
		.attr("id");

	this.$loading.show();

	$target.tooltip("destroy");

	switch(action){
		case "delete":
			this._removeUser(username,$.proxy(function(){				
				var $ctCurrentUser = $("> header",this.$ctUser);
				var currentUser = $ctCurrentUser.data("user") || undefined; 

				if(currentUser && username === currentUser.username){
					$(".icon.user",this.$ctUser).removeClass("active");
					
					self.$ctUser.removeClass("saved");
				}

				this.$loading.hide();
			},this));
			break;
		case "refresh":
			this._refreshUser(username);
			break;
		default:
			break;
	}

};

PageManager.prototype._handleAnchorClick = function(oEvent){
	var $target = $(oEvent.currentTarget);
	var href = $target.attr("href");

	if(href.indexOf("http") > -1){

		oEvent.preventDefault();
		chrome.tabs.create({ url: href });

		_gaq.push(['_trackEvent', href, 'clicked']);

	}
};

$(document).ready(function(){
	window._CC_POPUP = new PageManager();	
});