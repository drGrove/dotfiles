//chrome.tabs.sendRequest(tabId, { targetScript:"content1" });

if(!localStorage.hs_opened_landing_page){
    chrome.tabs.create({
       url : "https://www.hellosign.com/gmail",
       selected: true
    });
    localStorage.hs_opened_landing_page = "true";
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	if (request.download_obj) {
		console.log('got download_obj in background script: ' + request.download_obj);
		
		var sender_id = sender.tab.id;
		var download_obj = request.download_obj;

		var identify_tabs = function(google_tabs) {
			console.log('google tabs');
			console.log(google_tabs);

			var possible_matches = [];

			for (var i = 0; i < google_tabs.length; i++) {
				if (google_tabs[i].id != sender_id) {
					possible_matches[possible_matches.length] = google_tabs[i];
				}
			}

			console.log('possible matches: ' + possible_matches.length);

			if (possible_matches.length == 1) {
				chrome.tabs.sendRequest(possible_matches[0].id,  {download_obj: download_obj});
			}
		};

		getGmailTabs(identify_tabs);
	}
});

function getGmailTabs(callback) {
	chrome.windows.getAll({ populate: true }, function(windows) {
		var google_tabs = [];
		
		for (var i = 0; i < windows.length; i++) {
			var w = windows[i];
			for (var j = 0; j < w.tabs.length; j++) {
				if (w.tabs[j].url.indexOf('://mail.google.com') != -1) {
					google_tabs[google_tabs.length] = w.tabs[j];
				}
			}
		}

		callback(google_tabs);
	});
}