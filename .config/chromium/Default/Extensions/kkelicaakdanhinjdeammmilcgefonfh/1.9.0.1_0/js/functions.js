var currentVersion = 190.1; // 1.9.0.1

var rowStorage		= 'WindowResizer.Rows';
var verStorage		= 'WindowResizer.Version';
var tooltipSetting	= 'WindowResizer.Tooltip';
var tooltipDelaySetting		= 'WindowResizer.TooltipDelay';
var iconBehaviorSetting		= 'WindowResizer.iconBehavior';
var popupDescriptionSetting	= 'WindowResizer.PopupDescription';
var popupWidthSetting		= 'WindowResizer.PopupWidth';


var defaultValues = [
	{
		"title"  : "HVGA (old iPhones, small Androids)",
		"width"  : 320,
		"height" : 480,
		"type"   : "featurephone",
		"target" : "viewport"
	},
	{
		"title"  : "WVGA - Low-end Windows Phone",
		"width"  : 480,
		"height" : 800,
		"type"   : "smartphone",
		"target" : "viewport"
	},
	{
		"title"  : "DVGA - iPhone",
		"width"  : 640,
		"height" : 960,
		"type"   : "smartphone",
		"target" : "viewport"
	},
	{
		"title"  : "WXGA - High-end Windows Phone",
		"width"  : 768,
		"height" : 1280,
		"type"   : "smartphone",
		"target" : "viewport"
	},
	{
		"title"  : "XGA - iPad",
		"width"  : 1024,
		"height" : 768,
		"type"   : "tablet",
		"target" : "viewport"
	},
	{
		"title"  : "WXGA - Tablet",
		"width"  : 1366,
		"height" : 768,
		"type"   : "tablet",
		"target" : "viewport"
	},
	{
		"title"  : "WXGA - Netbook",
		"width"  : 1280,
		"height" : 800,
		"type"   : "laptop",
		"target" : "window"
	},
	{
		"title"  : "WXGA - Ultrabook",
		"width"  : 1366,
		"height" : 768,
		"type"   : "laptop",
		"target" : "window"
	},
	{
		"title"  : "SXGA - Small desktop",
		"width"  : 1280,
		"height" : 1024,
		"type"   : "desktop",
		"target" : "window"
	},
	{
		"title"  : "WSXGA+ - Large desktop",
		"width"  : 1680,
		"height" : 1050,
		"type"   : "desktop",
		"target" : "window"
	}
];

var Devices = {
	icons : {
		desktop      : 'images/devices/desktop.png',
		laptop       : 'images/devices/laptop.png',
		tablet       : 'images/devices/tablet.png',
		smartphone   : 'images/devices/smartphone.png',
		featurephone : 'images/devices/featurephone.png',
	},
	
	types : ['desktop', 'laptop', 'tablet', 'smartphone', 'featurephone'],
	
	defaultType : 'desktop',
	
	getIcon : function(key) {
		if (key == 'mobile') {
			key = 'featurephone';
		}
		
		return this.icons[key];
	}
};


function getRows() {
	
	var rows = window.localStorage[rowStorage];
	
	if ( !rows ) {
		rows = defaultValues;
	} else {
		rows = JSON.parse( rows );
	}
	
	return rows;
}

function displayRows() {
	
	$('#resolutionsList').html('');
	
	var rows = getRows();
	if ( rows ) {
		for ( var r = 0; r < rows.length; r++ ) {
			rows[r].ID = r;
			addRow( rows[r] );
		}
	}
}

function addRow( settings ) {

	var newRow = $('<li class="resRow" id="row' + settings.ID + '"></li>');
	newRow.data( 'settings', settings);
	
	var html = '<a href="#" class="handle">' + 
	           rowContent(settings) +
	           '</a><a href="#" class="icon i_edit" title="Edit"></a>' +
	           '<a href="#" class="icon i_delete" title="Delete this resolution"></a>';
	
	newRow.html(html);
	newRow.css( 'display', 'none' );
	$('#resolutionsList').append(newRow);
	newRow.slideDown(300);

}

function rowContent(settings) {
	return '<span class="icon" title="Drag to rearrange list" style="background-image:url(' + Devices.getIcon(settings.type) + ')"></span>' + 
	       '<strong>' + settings.width + '&nbsp;&times;&nbsp;' + settings.height + '</strong><span class="resDetail">' + settings.title + '</span>';
}

function saveSettings() {
	var rows = [];
	$('.resRow').each(function(){
		var i = rows.length;
		rows[i] = $(this).data('settings');
	});
	
	rows = JSON.stringify(rows);
	
	window.localStorage[rowStorage] = rows;
}

function closeActiveTab() {
	chrome.windows.getCurrent( function( win ) {
		chrome.tabs.getSelected( win.id, function(tab){
			chrome.tabs.remove(tab.id);
		});
	});
}

// function getViewportSize( settings ) {

// 	chrome.windows.getLastFocused( function (win) {

// 		opt = {};
// 		opt.width = parseInt(settings.width);
// 		opt.height = parseInt(settings.height);
// 		chrome.windows.update( win.id, opt, function(){

// 			chrome.tabs.captureVisibleTab( win.id, function(url) {
// 				var img = new Image();
// 				img.src = url;
				
// 				img.onload = function () {

// 					hDiff = settings.width - img.width;
// 					vDiff = settings.height - img.height;
					
// 					var iniSett = settings;
					
// 					settings.width	= hDiff + parseInt(settings.width);
// 					settings.height	= vDiff + parseInt(settings.height);
// 					settings.type	= 'desktop';
					
// 					resizeWindow(settings);
// 				}
				
// 			});
			
// 		});

// 	});

// }

// function resizeWindow ( settings ) {
// 	if ( settings.type == 'mobile') {
// 		getViewportSize( settings );
// 	} else {
// 		if ( settings.pos == 3 || window.localStorage['overrideWindowPosition'] == 1 ) {
// 			settings.X = Math.floor((window.screen.availWidth - settings.width) / 2) + window.screen.availLeft;
// 			settings.Y = Math.floor((window.screen.availHeight - settings.height) / 2) + window.screen.availTop;
// 		}
		
// 		chrome.windows.getLastFocused( function (win) {
// 			var opt = {};
// 			opt.width	= parseInt(settings.width);
// 			opt.height	= parseInt(settings.height);
			
// 			if ( settings.X == parseInt(settings.X) ) {
// 				opt.left = parseInt(settings.X);
// 			}
			
// 			if ( settings.Y == parseInt(settings.Y) ) {
// 				opt.top = parseInt(settings.Y);
// 			}
			
// 			chrome.windows.update( win.id, opt );
// 			window.location.href.match(/popup\.html/) && window.close();
// 		});
// 	}
// }

function resizeWindow (options, ignorePopup) {
	var settings = JSON.parse(JSON.stringify(options));
	
	if ( settings.target == 'window') {
		_resizeWindow(settings, ignorePopup);
		return;
	}
	
	chrome.windows.getLastFocused(function (win) {
		chrome.tabs.captureVisibleTab(function (imgData) {
			if (!imgData) {
				$('#specialPageNotice').show();
				$('#resolutionsList').hide();
				return;
			}
			
			var img = new Image();
			
			img.onload = function () {
				settings.width  = parseInt(settings.width, 10) + parseInt(win.width, 10) - parseInt(img.width, 10);
				settings.height = parseInt(settings.height, 10) + parseInt(win.height, 10) - parseInt(img.height, 10);
				
				_resizeWindow(settings, ignorePopup);
			}
			
			img.src = imgData;
		});
	});
	
	
	// chrome.windows.getLastFocused({populate : true}, function (win) {
	// 	var tabId, t = -1;
		
	// 	do {
	// 		tabId = win.tabs[++t].id;
	// 	} while (!win.tabs[t].active);
		
	// 	chrome.tabs.sendMessage(tabId, {getViewport : true}, function (response) {
	// 		if (response) {
	// 			settings.width  = parseInt(settings.width, 10) + parseInt(win.width, 10) - parseInt(response.width, 10);
	// 			settings.height = parseInt(settings.height, 10) + parseInt(win.height, 10) - parseInt(response.height, 10);
				
	// 			_resizeWindow(settings);
	// 		} else {
	// 			alert('Viewport resizing doesn\'t work on: \n \u2022 special browser pages \n \u2022 the Chrome Webstore \n\n (or you might need to refresh the page if you\'ve just installed this extension)');
	// 		}
	// 	});
	// });
}

function _resizeWindow (settings, ignorePopup) {
	if ( settings.pos == 3 || window.localStorage['overrideWindowPosition'] == 1 ) {
		settings.X = Math.floor((window.screen.availWidth - settings.width) / 2) + window.screen.availLeft;
		settings.Y = Math.floor((window.screen.availHeight - settings.height) / 2) + window.screen.availTop;
	}
	
	chrome.windows.getLastFocused( function (win) {
		var opt = {};
		opt.width	= parseInt(settings.width, 10);
		opt.height	= parseInt(settings.height, 10);
		
		if ( settings.X == parseInt(settings.X, 10) ) {
			opt.left = parseInt(settings.X, 10);
		}
		
		if ( settings.Y == parseInt(settings.Y, 10) ) {
			opt.top = parseInt(settings.Y, 10);
		}
		
		chrome.windows.update( win.id, opt );
		!ignorePopup && String(window.location.href).match(/popup\.html/) && window.close();
	});
}

function setPopup(type) {
	if ( type == 1 ) {
		var popup = '';
	} else {
		var popup = 'popup.html';
	}
	
	chrome.browserAction.setPopup({
		'popup' : popup
	});
}

var currentResolutionID = 0;
function cyclePresets() {
	var rows = window.localStorage[rowStorage];
	
	if (!rows) {
		rows = defaultValues;
	} else {
		rows = JSON.parse(rows);
	}
	
	if (!currentResolutionID || currentResolutionID >= rows.length) {
		currentResolutionID = 0;
	}
	
	resizeWindow(rows[currentResolutionID]);
	currentResolutionID++;
}