var iconBehavior = window.localStorage[iconBehaviorSetting] || 0;

setPopup(iconBehavior);

var verNo = window.localStorage[verStorage];
verNo = (verNo) ? verNo : 0;

if ( verNo < currentVersion ) {
	chrome.browserAction.setBadgeText({text : 'NEW'});
	chrome.browserAction.setBadgeBackgroundColor({color : '#dd8127'});
}

if (verNo < 180.1) {
	// migrate presets format
	var rows = getRows();
	
	if (rows) {
		for (var i = 0, l = rows.length; i < l; i++) {
			if (rows[i].type == 'mobile') {
				rows[i].type   = 'featurephone';
				rows[i].target = 'viewport';
			} else if (!rows[i].target) {
				rows[i].target = 'window';
			}
		}
		
		window.localStorage[rowStorage] = JSON.stringify(rows);
	}
}


// add listener for shortcut keys
chrome.commands.onCommand.addListener(function(command) {
	var match = String(command).match(/presets\-(\d+)/);
	
	if (command == 'cycle-presets') {
		cyclePresets();
	}
	
	if (match) {
		var idx  = parseInt(match[1], 10) - 1,
		    rows = getRows();
		
		if (rows[idx]) {
			resizeWindow(rows[idx]);
		}
	}
});


// add event listener for clicks on the extension icon 
chrome.browserAction.onClicked.addListener(function(TAB) {
	
	var iconBehavior = window.localStorage[iconBehaviorSetting] || 0;
	
	if ( iconBehavior == 1 ) {
		cyclePresets();
	}
	
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ( request.hideTooltipSetting == true ) {
		sendResponse( { 
						hideTooltipSetting : parseInt(window.localStorage['WindowResizer.Tooltip']), 
						tooltipDelay : parseInt(window.localStorage['WindowResizer.TooltipDelay']) 
		} );
	}
	
	if ( request.openSettings == true ) {
		chrome.tabs.create({"url" : "settings.html"});
	}
	
	if (request.ecoSettings) {
		chrome.tabs.create({"url" : "ecosia.html"});
	}
	
	if (request.ecoLinks) {
		sendResponse({ecoLinks : !parseInt(window.localStorage['disableEcoLinks'], 10)});
	}
});

chrome.windows.onCreated.addListener(function (win) {
	if ( win.type == 'popup' ) {
		CTX.create();
	} else {
		CTX.remove();
	}
});

chrome.windows.onFocusChanged.addListener(function(windowId){
	if ( windowId != chrome.windows.WINDOW_ID_NONE ) {
		chrome.windows.get(windowId, function (win) {
			if ( win.type == 'popup' ) {
				CTX.create();
			} else {
				CTX.remove();
			}
		});
	}
});

var CTX = {
	_main : false,
	
	items : {},
	
	create : function() {
		if ( !this._main ) {
			try {
				this._main = chrome.contextMenus.create({
					id       : 'main',
					title    : 'Resize window',
					contexts : ['all']
				});
				
				var rows = getRows();
				var hideTitle = window.localStorage[popupDescriptionSetting];
				
				for ( var r = 0, l = rows.length; r < l; r++  ) {
					var row = rows[r];
					var title = row.width + ' x ' + row.height;
					title += (row.title && !hideTitle) ? ' - ' + row.title : '';
					
					var i = chrome.contextMenus.create({
					    id       : 'resize_' + r,
						title    : title,
						contexts : ['all'],
						parentId : this._main
					});
					
					this.items[i] = row;
				}
				
				chrome.contextMenus.create({
					id       : 'sep_1',
					type     : 'separator',
					contexts : ['all'],
					parentId : this._main
				});
				
				chrome.contextMenus.create({
					id       : 'customize',
					title    : '[Customize]',
					contexts : ['all'],
					parentId : this._main
				});
				
				chrome.contextMenus.create({
					id       : 'settings',
					title    : '[Settings]',
					contexts : ['all'],
					parentId : this._main
				});
			} catch (e) {
				
			}
		}
	},
	
	remove : function() {
		this._main = false;
		this.items = {};
		chrome.contextMenus.removeAll();
	}
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	switch (true) {
		case (info.menuItemId == 'customize') :
			chrome.tabs.create( { url : 'options.html', selected : true } );
		break;
		
		case (info.menuItemId == 'settings') :
			chrome.tabs.create( { url : 'settings.html', selected : true } );
		break;
		
		default :
			resizeWindow(CTX.items[info.menuItemId]);
		break;
	}
});