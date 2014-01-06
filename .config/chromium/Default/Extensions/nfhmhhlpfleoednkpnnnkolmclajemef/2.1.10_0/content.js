/**
 * @constructor
 */
new function() {
	var self = this;
	var isEnabled = false;
	var clientProtocol = 4;
	var fatalNotified = false;
	var options = null;
	var lastJsErrorText = null;
	var jsErrorsNum = 0;
	var startupJsErrors = [];

	function isEnabledOnServer() {
		var m = new RegExp(';\\s*phpcsls=(.*?);', 'g').exec(';' + document.cookie + ';');
		if(m) {
			var serverProtocol = m[1];
			if(serverProtocol < clientProtocol) {
				if(!fatalNotified) {
					sendToNotifications({
						'notifyDelay' : 30,
						'isEscaped' : true,
						'type' : 'ahtung',
						'subject' : 'PHP Console disabled',
						'text' : 'You\'re using old version of <a href="http://code.google.com/p/lagger" target="_blank">Lagger</a> or <a href="http://code.google.com/p/php-console/source/browse/trunk/PhpConsole/PhpConsole.php">PhpConsole class</a> on http://' + location.host + '. Please update it.'
					});
					fatalNotified = true;
				}
			}
			if(serverProtocol > clientProtocol) {
				if(!fatalNotified) {
					sendToNotifications({
						'notifyDelay' : 30,
						'type' : 'ahtung',
						'isEscaped' : true,
						'subject' : 'PHP Console disabled',
						'text' : 'You\'re using old version of <a href="https://chrome.google.com/extensions/detail/nfhmhhlpfleoednkpnnnkolmclajemef" target="_blank">PHP Console</a> extension. Please <a href="https://chrome.google.com/extensions/detail/nfhmhhlpfleoednkpnnnkolmclajemef" target="_blank">update it</a>.'
					});
					fatalNotified = true;
				}
			}
			else {
				return true;
			}
		}
	}

	function isEnabledOnClient() {
		return new RegExp(';\\s*phpcslc=' + clientProtocol + ';').exec(';' + document.cookie + ';') || false;
	}

	function setEnabledOnClient() {
		document.cookie = 'phpcslc=' + clientProtocol + '; path=/;';
		window.location = document.location;
	}

	function sendToConsole(message) {
		var text = message['subject'] + ': ' + message['text'] + (message['source'] ? ' [' + message['source'] + ']' : '');
		if(message['type'] == 'error') {
			if(typeof(message['trace']) == 'object') {
				var i = message['trace'].length, trace = {};
				while(i--) {
					var l = message['trace'][i].split(' - ');
					trace[l[0]] = l[1];
				}
				console.error(text, trace);
			}
			else {
				console.error(text);
			}
		}
		else {
			console.log(text);
		}
	}

	function sendToNotifications(message) {
		chrome.extension.sendRequest({
			'showNotification': true,
			'message' : message
		});
	}

	function onExtensionRequest(request, sender, response) {
		if(isEnabled) {
			if(request['sendMessagesToConsole']) {
				for(var i in request['messages']) {
					sendToConsole(request['messages'][i]);
				}
			}
		}
	}

	function handleJavascriptError(text, url, line) {
		if(options) {
			if(text['filename']) {
				url = text['filename'];
			}
			if(text['lineno']) {
				line = text['lineno'];
			}
			if(text['target']['chrome'] && !url && !line) {
				return; // ignore handling Chrome Extensions errors
			}
			if(text['message']) {
				text = text['message'];
			}
			else {
				// draft fix of http://code.google.com/p/chromium/issues/detail?id=8939
				if(text['target'] && text['target']['src']) {
					url = window.location.href;
					text = 'Script ' + text['target']['src'] + ' not found';
				}
			}

			if(typeof(text) != 'string' || text == 'Script error.' || !line) {
				text = '... see details in JavaScript console';
				var subject = 'JavaScript unknown error';
			}
			else {
				text = text.replace(/^Uncaught /g, '');
				var m = new RegExp('(.+): *(.+)').exec(text);
				if(m) {
					subject = 'JavaScript ' + m[1];
					text = m[2];
				}
				else {
					subject = 'JavaScript error';
				}
			}
			if(lastJsErrorText != (text + url + line) && jsErrorsNum < 10) {
				lastJsErrorText = text + url + line;
				jsErrorsNum++;
				sendToNotifications({
					'type' : 'js',
					'subject' : subject,
					'text' : text,
					'source' : url && line ? ('<a href="view-source:' + url + '" target="_blank" id="sourceLink">' + url.replace(/[\/\\]$/g, '') + ':' + line + '</a>') : ''
				});
			}
		}
		else {
			startupJsErrors.push([text, url, line]);
		}
	}

	function registerClient() {
		chrome.extension.sendRequest({
				'registerClient' : true
			}, function(response) {
				options = response['options'];
				if(!options['notifyJavaScriptErrors'] || !options['enabled']) {
					window.removeEventListener('error', handleJavascriptError, false);
				}
				else {
					for(var i in startupJsErrors) {
						handleJavascriptError(startupJsErrors[i][0], startupJsErrors[i][1], startupJsErrors[i][2])
					}
				}
			});
	}

	// construct

	if(isEnabledOnServer()) {
		if(!isEnabledOnClient()) {
			setEnabledOnClient();
		}
		isEnabled = true;
		window.addEventListener('error', handleJavascriptError, false);
		registerClient();
		chrome.extension.onRequest.addListener(onExtensionRequest);
	}
};
