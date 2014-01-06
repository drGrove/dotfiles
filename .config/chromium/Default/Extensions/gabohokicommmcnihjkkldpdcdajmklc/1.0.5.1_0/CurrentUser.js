var CurrentUser = function(oConfig){
	this._init(oConfig);
};

CurrentUser.prototype._init = function(oConfig){
	this.chrome = chrome;

	this.$photo = $('#user-info-view');
	//#avatar-image-container


	this._attachEvents();
};

CurrentUser.prototype._attachEvents = function(){
	var chrome = this.chrome;
	
	chrome.runtime.onMessage.addListener($.proxy(function(request, sender, sendResponse) {
		// var user = new CurrentUser();
		// user._getUser();

		// console.log(window,request.data, user[request.data], user);
		var data = this._getUser();
		console.log(data);
		sendResponse({ CCDATA: data });
	},this));

}
CurrentUser.prototype._getUser = function(){
	var scripts = $('script').filter(function(){ 
		return $(this).text().indexOf('CCDATA') > -1; 
	});

	var text = $(scripts[0]).text();
	var relevantText = text.substr(text.indexOf('CCDATA.env'),text.indexOf('// userfox') - text.indexOf('CCDATA.env'));

	CCDATA = {};

	var kvps = $.trim(relevantText).split(/\n+/);
	$.each(kvps,function(i,kvp){
		var kv = $.trim(kvp).replace(';','').split('=');
		var k = $.trim(kv[0]).replace('CCDATA.','');
		var v = $.trim(kv[1]);

		if(k.indexOf('current_user') > -1){
			if(k.indexOf('.') > -1){
				rk = k.split('.');
				CCDATA[rk[0]][rk[1]] = v;
			}
			else{
				CCDATA[k] = JSON.parse(v);
			}
		}

	});

	return CCDATA;
};

(function(w,d){
	w.CurrentUser = new CurrentUser({
		chrome:chrome
	})
})(window,document)
// var CurrentUser = function(){
// 	this._init()
// };

// CurrentUser.prototype._init = function(){

// };

// CurrentUser.prototype._getUser = function(){
// 	this.CCDATA = window.CCDATA || {};
// };

// function getData(){
// 	var scripts = $('script').filter(function(){ 
// 		return $(this).text().indexOf('CCDATA') > -1; 
// 	});

// 	var text = $(scripts[0]).text();
// 	var relevantText = text.substr(text.indexOf('CCDATA.env'),text.indexOf('// userfox') - text.indexOf('CCDATA.env'));

// 	CCDATA = {};

// 	var kvps = $.trim(relevantText).split(/\n+/);
// 	$.each(kvps,function(i,kvp){
// 		var kv = $.trim(kvp).replace(';','').split('=');
// 		var k = $.trim(kv[0]).replace('CCDATA.','');
// 		var v = $.trim(kv[1]);

// 		if(k.indexOf('current_user') > -1){
// 			if(k.indexOf('.') > -1){
// 				rk = k.split('.');
// 				CCDATA[rk[0]][rk[1]] = v;
// 			}
// 			else{
// 				CCDATA[k] = JSON.parse(v);
// 			}
// 		}

// 	});

// 	return CCDATA;
// }