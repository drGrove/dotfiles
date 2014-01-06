/*** NEW PROFILES ***/
// .courses-authored-list > a
var AuthoredCourse = function(el){
	var $el = $(el);
	this.href = 'http://www.codecademy.com' + $el.attr('href');
	var name = $('.course-name',$el).text();
	this.name = $.trim(name);
	var stars = $('.star-count',$el).text();
	this.stars = $.trim(stars);
	this.timesTaken = $('.taken-count',$el).text();
};

// .achievement
var Badge = function(el){
	var $el = $(el);
	var classes = $el.find('.badge').attr('class');
	var topic = classes.replace('badge ','').split(' ')[0];

	this.name = $el.find('.name').text().replace(/\n  +/g,'');
	this.dateAchieved = $el.find('.created_at').text().replace(/\n  +/g,'');
	this.topic = !!topic && topic.length > 0 ? topic : 'other';

	return this;
};

// .user-groups-list > li
var Group = function(el){
	var $el = $(el);
	this.href = 'http://www.codecademy.com' + $('.group-link',$el).attr('href');
	this.icon = $('img',$el).attr('src');
	var name = $('.group-name',$el).text();
	this.name = $.trim(name);
};

// .track-progress
var Track = function(el){
	var $el = $(el);
	this.href = 'http://www.codecademy.com' + $('.track-link',$el).attr('href');
	var name = $('.track-name',$el).text();
	this.name = $.trim(name);
	var percent = $el.data('percent') * 100;
	this.percent = parseInt(percent,10);
	var progress = $('.track-progress-stats',$el).comments().find('.stat-value').text();
	this.progress = $.trim(progress);
	this.sectionsCompleted = parseInt(progress.split('/')[0],10);
};
/*** END NEW PROFILES ***/

var CodecademyUser = function (){
	this._init();
};

CodecademyUser.prototype._init = function(){
	this._URL = 'http://www.codecademy.com/';
};

CodecademyUser.prototype.search = function(username,success,fail){

	$.when(this._getUser(username), this._getBadges(username))
		.then(
			// success
			$.proxy(function(oUserResponse, oBadgeResponse){
				this.username = username;
				this._setUser(oUserResponse[0]);
				this._setBadges(oBadgeResponse[0]);

				if(success && !this._PRIVATE_USER){
					success(this);
				}

				if(this._PRIVATE_USER){
					this._empty();
					if(fail){
						fail(this);
					}
				}
			},this),
			// fail
			$.proxy(function(oUserResponse, oBadgeResponse){
				this._empty();

				if(fail){
					fail(this,oUserResponse);
				}
			},this));

	return this;
};

CodecademyUser.prototype._getUser = function(username){
	return $.ajax({
		url:'http://www.codecademy.com/' + username
	});
};

CodecademyUser.prototype._getBadges = function(username){
	return $.ajax({
		context:this,
		url:this._URL + 'users/' + username + '/achievements'
	});
};

CodecademyUser.prototype._setUser = function(oResponse){
	var $response = $(oResponse);

	var ogUrl = $response.filter('meta[property="og:url"]').attr('content');
	var reqUrl = this._URL + this.username;

	if(ogUrl === reqUrl || ogUrl.indexOf(this.username) > -1){
		// new profile
		this._newProfile($response);
		this.newProfile = true;
	}
	else{
		// private user
		this._PRIVATE_USER = true;
	}
};

CodecademyUser.prototype._newProfile = function($response){
	var $wrapper = $response.filter('#wrapper');
	var $userInfo = $('#user-info-view',$wrapper);
	var $photo = $('img',$userInfo);
	var displayName = $('.full-name',$userInfo).text();

	var $userStats = $('.user-stats',$wrapper);
	var pointsToday = $('.points-today-count',$userStats).text();
	var pointsTotal = $('.stat-count',$userStats)[0].innerText;
	var currentStreak = $('.stat-count',$userStats)[1].innerText;
	var bestStreak = $('.best-count',$userStats).text();

	this.pointsToday = parseInt(pointsToday,10);
	this.pointsTotal = parseInt(pointsTotal,10);
	this.currentStreak = parseInt(currentStreak,10);
	this.bestStreak = parseInt(bestStreak,10);
	this.displayName = $.trim(displayName);
	this.photo = $photo.attr('src');

	var $authored = $('.courses-authored-list > a',$wrapper);
	this.coursesAuthored = $.map($authored,function(el,i){
		return new AuthoredCourse(el);
	});

	var $groups = $('.user-groups li', $wrapper);
	this.groups = $.map($groups,function(el,i){
		return new Group(el);
	});

	var $tracks = $('.track-progress',$wrapper);
	this.tracks = $.map($tracks,function(el,i){
		return new Track(el);
	});

	// parsing out CCDATA.page.user
	var CCDATA = {};
	var c = $response.contents().filter(function(){ return this.nodeType === 3 && $(this).text().indexOf('CCDATA.page') > -1; })[0];
	var rLinesOfCode = $.trim(c.wholeText).split(';');
	$.each(rLinesOfCode,function(i,item){
		if(!!item){
			var kv = item.split('=');
			var k = $.trim(kv[0]);
			var v = $.trim(kv[1]);
			if(k.indexOf('user') > -1){
				CCDATA = JSON.parse(v);

			}
		}
	});

	this.CCDATA = CCDATA;
};

CodecademyUser.prototype._setBadges = function(oResponse){
	var $response = $(oResponse);

	var $achievements = $('.achievement',$response);
				
	this.badges = $.map($achievements,function(item,i){
		return new Badge(item);
	});
};

CodecademyUser.prototype._empty = function(){
	this.badges = [];
	this.courses = [];
	this.displayName = '';
	this.photo = '';
	this.tracks = '';
	this.username = ''
};