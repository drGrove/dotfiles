// Listen for any changes to the URL of any tab.

var AppManager = function(oConfig){
	this._init(oConfig);
};

AppManager.prototype._init = function(oConfig){
	this._isInit = true;
	this._oConfig = oConfig || {};

	this.chrome = oConfig.chrome || chrome;
	// this.tabId = this.chrome.tabs.getCurrent(function(tab){
	// 	console.log(tab);
	// });

	this._attachEvents();
};

AppManager.prototype._attachEvents = function(){

	var chrome = this.chrome;

	chrome.tabs.onUpdated.addListener($.proxy(this._handleUpdated,this));
	chrome.tabs.onActivated.addListener($.proxy(this._handleTabFocus,this));
	chrome.runtime.onMessage.addListener($.proxy(this._handleMessageSent,this));
};

AppManager.prototype._handleMessageSent = function(request, sender, sendResponse) {
	console.log('message sent');
	console.log(request, sender, sendResponse);

	if(sendResponse){
		sendResponse({ farewell:'bye' });
	}


};

AppManager.prototype._checkTab = function(tab){
	console.log(tab);
	if(tab.url === 'http://www.codecademy.com/'){
		// this.chrome.tabs.executeScript(
		// 	tab.tabId, 
		// 	{ 
		// 		//'code':'console.log(CurrentUser);',
		// 		'file':'CurrentUser.js',
		// 		'runAt':'document_idle' 
		// 	}
		// );
		
		this.chrome.tabs.sendMessage(tab.id, { data: "CCDATA" }, $.proxy(function(response) {
			// JSON.parse does not evaluate the attacker's scripts.
			console.log(response);
			if(response.CCDATA){
				this.storage.set('current_user',response.CCDATA.current_user);
			}
		},this));
		
		//this._addScript(tab.id,'CurrentUser.js');
	
	}
	if(tab.url.indexOf("codecademy.com/forms/bugreport") > -1){
		//chrome.pageAction.show(tab.id);
		this.chrome.tabs.executeScript(tab.tabId, { 'code':'var ref = document.referrer; if(ref.indexOf("codecademy.com/courses") > -1){ document.getElementById("entry_0").value = ref; }','runAt':'document_idle' }, function(args){
			console.log("after injection",args);
		});
	}
	if(/codecademy.com\/courses\/.+\/[0-9]\/[0-9]/g.test(tab.url)){
		// chrome.tabs.executeScript(
		// 	tab.tabId, 
		// 	{ 
		// 		'code':'var plugins=document.getElementById("_exercise_plugins"); if(!plugins){var body=document.getElementsByTagName("body")[0]; var script=document.createElement("script"); script.src="' + chrome.extension.getURL("ExercisePlugins.js") + '"; script.id="_exercise_plugins"; body.appendChild(script);}',
		// 		'runAt':'document_idle' 
		// 	}
		// );
		this._addScript(tab.id,'ExercisePlugins.js');
	}
};

// Called when the url of a tab changes.
AppManager.prototype._handleTabFocus = function(activeInfo) {
	var tabId = activeInfo.tabId;
	
	this.chrome.tabs.get(tabId, $.proxy(this._checkTab,this));
};

AppManager.prototype._handleUpdated = function(tabId, changeInfo, tab){
	console.log(tabId, changeInfo, tab);
	this._checkTab(tab);
};

AppManager.prototype._addScript = function(tabId,filename){
	console.log(tabId,filename);

	var scripts = this._scripts || [];

	var id = '_ccExtension-' + filename.toLowerCase().split('.')[0] + '-' + tabId;
	this.chrome.tabs.executeScript(
		tabId,
		{
			'code':'var plugins=document.getElementById("' + id + '"); if(!plugins){var body=document.getElementsByTagName("body")[0]; var script=document.createElement("script"); script.src="' + chrome.extension.getURL(filename) + '"; script.id="' + id + '"; body.appendChild(script);}',
			'runAt':'document_idle'
		}
	);


	if(scripts.indexOf(id) < 0){
		scripts.push(id);
	}

	this._scripts = scripts;
};

AppManager.prototype.guid = function(){
	function s4() {
  		return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
	}

	function guid() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +s4() + '-' + s4() + s4() + s4();
	}

	return guid();
};
AppManager.prototype.isInit = function(){
	return !!this._isInit;
};
AppManager.prototype.storage = {
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

(function(w,d){
	w.AppManager = new AppManager({
		chrome:chrome
	})
})(window,document)