var currentResolutionID;
var iconBehavior = window.localStorage[iconBehaviorSetting] || 0;
var pollBadge = window.localStorage.pollBadge !== 'seen';

setPopup(iconBehavior);

if (pollBadge) {
	chrome.browserAction.setBadgeText({text : '?'});
	setPopup(1);
}

// add event listener for clicks on the extension icon 
chrome.browserAction.onClicked.addListener(function(TAB) {
	
	var iconBehavior = window.localStorage[iconBehaviorSetting] || 0;
	
	if (window.localStorage.pollBadge !== 'seen') {
		chrome.tabs.create( { url : 'poll.html', selected : true } );
	} else if ( iconBehavior == 1 ) {
		var rows = window.localStorage[rowStorage];

		if ( !rows ) {
			rows = defaultValues;
		} else {
			rows = JSON.parse( rows );
		}
		
		if ( !currentResolutionID || currentResolutionID >= rows.length ) {
			currentResolutionID = 0;
		}
		
		resizeWindow(rows[currentResolutionID]);
		currentResolutionID++;
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