function listenForContent(key, handler) {
	var inbox = document.createElement('div');
	inbox.id = 'hs_' + key;
	inbox.innerHTML = '';
	document.body.appendChild(inbox);

	var _handler = handler;

	setInterval(function() {
		if (inbox.innerHTML != "") {
			_handler(inbox.innerHTML);
			inbox.innerHTML = "";
		}
	}, 100);
};

function sendContent(key, val) {
	var outbox = document.getElementById('hs_' + key);

	if (outbox) {
		outbox.innerHTML = val;
	}
};


//Setup options
var hsoptions = { "test":"test"};
if (self.options) {
	hsoptions = self.options;
	hsoptions.browser = "Firefox";
}
else if (window.chrome) {
	hsoptions = {
		inpageurl: chrome.extension.getURL('in-page.js'),
		loadingspinner16: chrome.extension.getURL('loading-spinner-16.gif'),
		ajaxloader112: chrome.extension.getURL('ajax-loader-112x112.gif'),
		hellosigngmail: chrome.extension.getURL('hellosign_and_gmail.png'),
		browser: "Chrome"
	};
}
else if (window.safari) {
	hsoptions = {
		inpageurl: safari.extension.baseURI + 'in-page.js',
		loadingspinner16: safari.extension.baseURI + 'loading-spinner-16.gif',
		ajaxloader112: safari.extension.baseURI + 'ajax-loader-112x112.gif',
		hellosigngmail: safari.extension.baseURI + 'hellosign_and_gmail.png',
		browser: "Safari"
	};
}

//calculate page specific hsoptions
hsoptions.is_google = window.location.href.indexOf('mail.google.com') != -1;

if (hsoptions.is_google) {
	var inpage = document.createElement("script");
	inpage.type="text/javascript";
	inpage.src = hsoptions.inpageurl;
	(document.head || document.body || document.documentElement).appendChild(inpage);

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.hs-loading { background: url(' + hsoptions.loadingspinner16 + ') center center no-repeat; text-indent: -9999px; display: inline-block; width: 20px; height: 16px; } ';
	(document.head || document.body || document.documentElement).appendChild(style);
	
	//setup download_obj senders
	listenForContent('download_obj', function(download_obj) {
		if (hsoptions.browser == "Chrome") {
			chrome.extension.sendRequest({download_obj:download_obj});	
		}
		else if (hsoptions.browser == "Firefox") {
			self.port.emit("download_obj", download_obj);
		}
		else if (hsoptions.browser == "Safari") {
			safari.self.tab.dispatchMessage("download_obj", download_obj);
		}
	});

	//setup received_download_obj listeners
	if (hsoptions.browser == "Chrome") {
		chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
			if (request.download_obj) {
				sendContent('received_download_obj', request.download_obj);
			}
		});
	}
	else if (hsoptions.browser == "Firefox") {
		self.port.on("received_download_obj", function(download_obj) {
			sendContent('received_download_obj', download_obj);
		});
	}
	else if (hsoptions.browser == "Safari") {
		safari.self.addEventListener("message", function(msg) {
			if (msg.name == "received_download_obj") {
				sendContent('received_download_obj', msg.message);
			}
		}, false);
	}
}
else {
	//javascript here should hide hello(sign|fax) install stuff for this extension
	var elems = document.querySelectorAll('.gmail-not-installed');
	for(i in elems) {
		if (elems[i].className) {
			elems[i].className = elems[i].className.replace(/gmail-not-installed/g, '');	
		}
	}

	//load certain images from the extension folder rather than from cdn
	var imgs = document.querySelectorAll('img');
	var loader_src = 'ajax-loader-112x112.gif';
	var partner_logo_src = 'hellosign_and_gmail.png';

	for (i in imgs) {
		if (!imgs[i] || !imgs[i].src) continue;

		if (imgs[i].src.indexOf(loader_src) > 0) {
			imgs[i].src = hsoptions.ajaxloader112;
		}
		else if (imgs[i].src.indexOf(partner_logo_src) > 0) {
			imgs[i].src = hsoptions.hellosigngmail;
		}
	}
}