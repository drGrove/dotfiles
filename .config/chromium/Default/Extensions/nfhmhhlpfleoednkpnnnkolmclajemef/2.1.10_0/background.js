/**
 * @constructor
 */
function Options() {

	var self = this;
	self.versionFull = null;
	self.versionShort = null;
	self.justInstalled = false;
	self.justUpdated = false;
	self.domainsHandler = new DomainsHandler(self);

	this.defaults = {
		'enabled': true,
		'consoleDebug': true,
		'consoleErrors': true,
		'notifyDebug': true,
		'notifyErrors': true,
		'notifyJavaScriptErrors': true,
		'notifyDelay': 1
	};

	self.set = function (option, value) {
		localStorage[option] = value;
	};

	self.get = function (option) {
		var value = localStorage.getItem(option);
		if(value == 'true') {
			return true;
		}
		if(value == 'false') {
			return false;
		}
		return value;
	};

	function getVersionFull() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
		xhr.send(null);
		return JSON.parse(xhr.responseText).version;
	}

	// construct

	self.versionFull = getVersionFull();
	self.versionShort = parseFloat(new RegExp('^\\d+\\.\\d+').exec(self.versionFull)[0]);

	function getterFunc(option) {
		return function () {
			return self.get(option);
		};
	}

	function setterFunc(option) {
		return function (value) {
			self.set(option, value);
		};
	}

	this.initDefaultOptions = function (defaultOptions) {
		for(var option in defaultOptions) {
			if(self.get(option) === null) {
				self.set(option, defaultOptions[option]);
			}
			self.__defineGetter__(option, getterFunc(option));
			self.__defineSetter__(option, setterFunc(option));
		}
	};

	this.encodeToUriQuery = function (object) {
		var query = '';
		for(var k in object) {
			query = query + encodeURIComponent(k) + '=' + encodeURIComponent(object[k]) + '&';
		}
		return query.substr(0, query.length - 1);
	};

	this.initDefaultOptions(this.defaults);

	if(!self.get('version')) {
		self.justInstalled = true;
		self.set('version', self.versionShort);
	}
	else {
		if(self.get('version') != self.versionShort) {
			self.justUpdated = true;
			self.set('version', self.versionShort);
		}
	}
}

/**
 * @constructor
 */
function DomainsHandler(options) {

	var self = this;

	function quoteDomain(domain) {
		return ',' + domain + ',';
	}

	this.isDomain = function (domain) {
		return options['extDomains'].indexOf(quoteDomain(domain)) >= 0;
	};

	this.addDomain = function (domain) {
		if(!self.isDomain(domain)) {
			options['extDomains'] = options['extDomains'] + quoteDomain(domain);
		}
	};

	this.removeDomain = function (domain) {
		options['extDomains'] = options['extDomains'].replace(quoteDomain(domain), '');
	};

	this.getDomainsCount = function () {
		var count = 0;
		var i = -1;
		var domains = options['extDomains'];
		while((i = domains.indexOf(',', i + 1)) >= 0) {
			count++;
		}
		return count / 2;
	};
}

/**
 * @constructor
 */
function NotificationsHandler(options) {

	var notifies = [];
	var buttons = {};
	var current = null;
	var timeout = null;
	var firstDelay = 3000;
	var limit = 50;
	var lockTimeout = false;

	var typesIcons = {
		update: 'ok.png',
		js: 'error.png',
		error: 'error.png',
		ahtung: 'ahtung.png',
		debug: 'info.png'
	};
	var self = this;

	chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
		if(request['showNotifications']) {
			self.showNotifications(request['showNotifications']);
		}
		else if(request['showNotification']) {
			self.showNotification(request['message']);
		}
	});

	/*
	 document.getElementById('notifySource').innerHTML = '<a href="javascript:void(0);" id="sourceLink" onclick="document.getElementById(\'trace\').style.display=\'block\';">#' + message.traceCount + '&nbsp;' + htmlentities(message.source) + '</a><div id="trace" nowrap="true" style="display:none"><hr/>' + htmlentities(message.traceString).replace(/\n/g, "<hr/>").replace(/ - /g, "<br/>").replace(/ /g, '&nbsp;') + '</div>';*/

	var notificationsIds = [];

	function displayNotification(message) {
		if(typeof(message['trace']) == 'object') {
			message['traceString'] = message['trace'].reverse().join("\n");
			message['traceCount'] = message['trace'].length + 1;
		}

		var id = 'id' + Math.floor(Math.random() * 9999999999);
		var options = {
			type: 'basic',
			priority: message['type'] == 'error' ? 2 : 0,
			iconUrl: 'img/' + typesIcons[message['type']],
			title: message['subject'],
			message: (message['source'] ? '' + message['source'] + '\n\n' : '') + message['text']
		};

		if(message['links']) {
			options.buttons = [];
			buttons[id] = [];
			for(var title in message['links']) {
				options.buttons.push({title: title});
				buttons[id].push(message['links'][title]);
			}
		}

		notificationsIds.push(id);
		chrome.notifications.create(id, options, function () {
		});
	}

	function startTimeout() {
		if(notificationsIds.length) {
			timeout = setTimeout(function () {
				stopTimeout();
				closeNotification();
				startTimeout();
			}, (notifies[i].message.notifyDelay ? notifies[i].message.notifyDelay : options['notifyDelay']) * 1000);
		}
	}

	function stopTimeout() {
		if(timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	}

	function closeNotification(id) {
		if(!id) {
			id = notificationsIds.pop();
		}
		if(id) {
			chrome.notifications.clear(id, function () {
			});
		}
	}

	self.showNotifications = function (messages) {
		while(notificationsIds.length) {
			closeNotification();
		}
		for(var i in messages) {
			displayNotification(messages[i]);
		}
	};

	self.showNotification = function (message) {
		self.showNotifications([ message ]);
	};

	chrome.notifications.onClosed.addListener(function (id, byUser) {
		if(byUser) {
			while(notificationsIds.length) {
				closeNotification();
			}
		}
	});

	chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
		if(buttons[notificationId]) {
			chrome.tabs.create({
				url: buttons[notificationId][buttonIndex],
				active: true
			});
		}
	});
}

/**
 * @constructor
 */
function MessagesHandler(options, notificationsHandler) {

	var self = this;
	self.statistics = new Statistics(options, this);

	function sendMessagesToConsole(messages) {
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.sendRequest(tab.id, {
				'sendMessagesToConsole': true,
				'messages': messages
			});
		});
	}

	self.handleMessages = function (messages) {
		var consoleMessages = [];
		var notifyMessages = [];

		for(var i in messages) {
			var message = messages[i];
			if((options['consoleErrors'] && message.type == 'error') || (options['consoleDebug'] && message.type == 'debug')) {
				consoleMessages.push(messages[i]);
			}
			if((options['notifyErrors'] && message.type == 'error') || (options['notifyDebug'] && message.type == 'debug')) {
				notifyMessages.push(messages[i]);
			}
		}
		if(consoleMessages.length) {
			sendMessagesToConsole(consoleMessages);
		}
		if(notifyMessages.length) {
			notificationsHandler.showNotifications(notifyMessages);
		}
		self.statistics.handleNewMessages(consoleMessages, notifyMessages);
	};
}

/**
 * @constructor
 */
function Menu(options) {

	var rootItemsObjects = [];
	var rootItems = [];
	var isHidden = false;
	var self = this;

	function create(item, isNotRoot) {
		var id = chrome.contextMenus.create(item);
		if(!item['parentId']) {
			rootItemsObjects[id] = item;
		}
		return id;
	}

	self.show = function () {
		if(isHidden) {
			for(var i in rootItems) {
				chrome.contextMenus.update(rootItems[i], {
					'contexts': [ 'all' ]
				});
			}
			isHidden = false;
		}
	};

	self.hide = function () {
		if(!isHidden) {
			for(var i in rootItems) {
				chrome.contextMenus.update(rootItems[i], {
					'contexts': [ 'audio' ]
				});
			}
			isHidden = true;
		}
	};

	function changeOption(optionName, info, value) {
		if(optionName == 'enabled') {
			options.set(optionName, value);
		}
		else {
			if(optionName == 'notifyDelay') {
				options.set(optionName, value);
			}
			else {
				options.set(optionName, info.checked);
			}
		}
	}

	create({
		'title': 'Enable',
		'type': 'checkbox',
		'checked': options['enabled'],
		'onclick': function (info) {
			changeOption('enabled', info, true);
		}
	});

	// CONSOLE

	create({
		'title': 'Log errors in console',
		'type': 'checkbox',
		'checked': options['consoleErrors'],
		'onclick': function (info) {
			changeOption('consoleErrors', info, null);
		}});

	create({
		'title': 'Log debug in console',
		'type': 'checkbox',
		'checked': options['consoleDebug'],
		'onclick': function (info) {
			changeOption('consoleDebug', info, null);
		}});

	// NOTIFICATIONS

	create({
		'type': 'separator'
	});

	create({
		'title': 'Notify errors',
		'type': 'checkbox',
		'checked': options['notifyErrors'],
		'onclick': function (info) {
			changeOption('notifyErrors', info, null);
		}});

	create({
		'title': 'Notify debug',
		'type': 'checkbox',
		'checked': options['notifyDebug'],
		'onclick': function (info) {
			changeOption('notifyDebug', info, null);
		}});

	create({
		'title': 'Notify JavaScript errors',
		'type': 'checkbox',
		'checked': options['notifyJavaScriptErrors'],
		'onclick': function (info) {
			changeOption('notifyJavaScriptErrors', info, null);
		}});

	function openUrlInNewTabCallback(url) {
		return function () {
			chrome.tabs.create({
				'url': url
			}, function () {
			});
		}
	}

	// ABOUT

	var aboutId = create({
		'title': 'About'
	});
	var links = {
		'Homepage': 'http://code.google.com/p/php-console',
		'PhpConsole class': 'http://code.google.com/p/php-console/source/browse/trunk/PhpConsole',
		'Lagger library': 'http://code.google.com/p/lagger',
		'Author': 'http://linkedin.com/in/barbushin'
	};
	for(var title in links) {
		create({
			'title': title,
			'parentId': aboutId,
			'onclick': openUrlInNewTabCallback(links[title])
		});
	}

	self.hide();
}

/**
 * @constructor
 */
function CookiesHandler(options, messagesHandler) {

	var messagesQueue = [];
	var messagesQueueHandling = false;
	var cookieNameReg = new RegExp('^phpcsl_');

	function onCookieChanged(info) {
		if(!info.removed) {
			var cookie = info.cookie;
			if(cookieNameReg.exec(cookie.name)) {
				if(options['enabled']) {
					options.domainsHandler.addDomain(cookie.domain);
					var messages = JSON.parse(decodeURIComponent(cookie.value.replace(/\+/g, ' ')));
					for(var i in messages) {
						messagesQueue.push(messages[i]);
					}
				}
				chrome.cookies.remove({
					url: ((cookie.secure ? 'https://' : 'http://') + cookie.domain + cookie.path),
					name: cookie.name,
					storeId: cookie.storeId
				});
			}
		}
	}

	function handleWaitingQueue() {
		if(!messagesQueueHandling) {
			messagesQueueHandling = true;
			if(messagesQueue.length) {
				var messages = messagesQueue;
				messagesQueue = [];
				messagesHandler.handleMessages(messages);
			}
			messagesQueueHandling = false;
		}
	}

	chrome.cookies.onChanged.addListener(onCookieChanged);
	setInterval(handleWaitingQueue, 300);
}

/**
 * @constructor
 */
function Statistics(options, messagesHandler) {

	var self = this;
	//		var syncStartOffset = 10;
	//		var syncPeriod = 10;
	//		var syncCheckTime = 1;
	var syncStartOffset = 259200;
	var syncPeriod = 604800;
	var syncCheckTime = 1800;
	var statServerUrl = 'http://web-grant.com/php_console/statistics/';
	var statServerLogin = '10bytessent';
	var statServerPassword = '10bytesrecived';

	function time() {
		return Math.round(new Date().getTime() / 1000);
	}

	var defaults = {
		'extInstalled': time(),
		'extSynced': false,
		'extHash': generateAppUid(),
		'extDomains': '',
		'extHandledErrors': 0,
		'extHandledErrorsTimes': 0,
		'extHandledDebugs': 0,
		'extHandledDebugsTimes': 0
	};

	function generateAppUid() {
		return 'xxxxx8xxxx1xxxx4xxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
			return v.toString(16);
		});
	}

	this.handleNewMessages = function (consoleMessages, notifyMessages) {
		var errors = 0;
		var debugs = 0;
		if(consoleMessages.length) {
			for(var i in consoleMessages) {
				if(consoleMessages[i].type == 'error') {
					errors++;
					continue;
				}
				if(consoleMessages[i].type == 'debug') {
					debugs++;
				}
			}
		}
		if(notifyMessages.length) {
			for(var i in notifyMessages) {
				if(notifyMessages[i].type == 'error') {
					errors++;
					continue;
				}
				if(notifyMessages[i].type == 'debug') {
					debugs++;
				}
			}
		}
		if(errors) {
			options['extHandledErrors'] = Number(options['extHandledErrors']) + errors;
			options['extHandledErrorsTimes'] = Number(options['extHandledErrorsTimes']) + 1;
		}
		if(debugs) {
			options['extHandledDebugs'] = Number(options['extHandledDebugs']) + debugs;
			options['extHandledDebugsTimes'] = Number(options['extHandledDebugsTimes']) + 1;
		}
	};

	function getStartSyncTime() {
		return time() - syncPeriod + (Math.floor(Math.random() * syncStartOffset) + 1);
	}

	function syncStat() {
		var stat = {};
		for(var i in defaults) {
			stat[i] = options[i];
		}
		stat['extDomains'] = options.domainsHandler.getDomainsCount();
		for(var i in options.defaults) {
			stat['prop' + i.charAt(0).toUpperCase() + i.substr(1)] = options[i];
		}
		stat['version'] = options.versionFull;
		sendDataToStatServer(stat);
	}

	function submitStatDataSentToServer() {
		var vars = ['extDomains', 'extHandledErrors', 'extHandledErrorsTimes', 'extHandledDebugs', 'extHandledDebugsTimes'];
		for(var i in vars) {
			options[vars[i]] = defaults[vars[i]];
		}
		options['extSynced'] = time();
	}

	function sendDataToStatServer(data) {
		try {
			var postData = options.encodeToUriQuery(data);

			xmlReq = new XMLHttpRequest();
			xmlReq.open('POST', statServerUrl, true);
			xmlReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xmlReq.setRequestHeader('Authorization', 'Basic ' + btoa(statServerLogin + ':' + statServerPassword));
			xmlReq.onreadystatechange = function () {
				if(xmlReq.readyState == 4) {
					if(xmlReq.status == 200 && xmlReq.responseText == 'ok') {
						submitStatDataSentToServer();
					}
				}
			};
			xmlReq.send(postData);
		}
		catch (e) {
		}
	}

	// construct

	if(!options['extInstalled']) {
		options.initDefaultOptions(defaults);
		options['extSynced'] = getStartSyncTime();
	}

	setInterval(function () {
		if(time() - options['extSynced'] > syncPeriod) {
			syncStat();
		}
	}, syncCheckTime * 1000);
}

function init() {

	var options = new Options();
	var menu = new Menu(options);
	var notificationsHandler = new NotificationsHandler(options);
	var messagesHandler = new MessagesHandler(options, notificationsHandler);
	var cookiesHandler = new CookiesHandler(options, messagesHandler);

	var clients = [];

	chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
		if(request['registerClient']) {
			clients[sender.tab.id] = true;
			chrome.pageAction.show(sender.tab.id);
			sendResponse({options: options});
		}
	});

	function updateMenuStatus(tabId) {
		if(clients[tabId]) {
			menu.show();
		}
		else {
			menu.hide();
		}
	}

	chrome.tabs.onSelectionChanged.addListener(updateMenuStatus);
	chrome.tabs.onUpdated.addListener(updateMenuStatus);

	chrome.tabs.onRemoved.addListener(function (tabId) {
		if(clients[tabId]) {
			delete clients[tabId];
		}
	});

	if(options.justUpdated || options.justInstalled) {
		notificationsHandler.showNotification({
			'type': 'update',
			'isEscaped': true,
			'subject': options.justInstalled ? 'PHP Console installed' : 'PHP Console new version',
			'text': 'PHP Console v' + options.versionFull + ' installed.',
			'links': {
				'Usage Guide': 'https://code.google.com/p/php-console/#How_to_use',
				'Changelog': 'https://code.google.com/p/php-console/wiki/Changelog'
			}
		});
	}

	var viewsData = {};

	this.submitViewData = function (data) {
		var dataId = Math.random() * 100000000000000000;
		viewsData[dataId] = data;
		return dataId;
	};

	this.popViewData = function (dataId) {
		var data = viewsData[dataId];
		delete  viewsData[dataId];
		return data;
	};

}

init();
