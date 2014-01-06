var currentVersion = 170.2; // 1.7.0.2

var rowStorage		= 'WindowResizer.Rows';
var verStorage		= 'WindowResizer.Version';
var tooltipSetting	= 'WindowResizer.Tooltip';
var tooltipDelaySetting		= 'WindowResizer.TooltipDelay';
var iconBehaviorSetting		= 'WindowResizer.iconBehavior';
var popupDescriptionSetting	= 'WindowResizer.PopupDescription';
var popupWidthSetting		= 'WindowResizer.PopupWidth';


var defaultValues = [ 
						{	
							title	: 'HVGA - iPhone, Android, Palm Pre', 
							type	: 'mobile',  
							width	: 320, 
							height	: 480 
						},
						{	
							title	: 'Old computers', 
							type	: 'desktop',  
							width	: 1024, 
							height	: 768 
						},
						{	
							title	: 'Not that old computers', 
							type	: 'desktop',  
							width	: 1280, 
							height	: 1024 
						},
						{	
							title	: 'Current computers', 
							type	: 'desktop',  
							width	: 1680, 
							height	: 1050 
						},
						{	
							title	: 'Netbook', 
							type	: 'laptop',  
							width	: 1024, 
							height	: 600 
						},
						{	
							title	: 'Laptop 15.4"', 
							type	: 'laptop',  
							width	: 1280, 
							height	: 800 
						},
						{	
							title	: 'Laptop 15.6"', 
							type	: 'laptop',  
							width	: 1366, 
							height	: 768
						},
						{	
							title	: 'Other Laptops', 
							type	: 'laptop',  
							width	: 1440, 
							height	: 900 
						}
						];

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
					'<span class="icon i_' + settings.type + '" title="Drag to rearrange list"></span>' + 
					'<strong>' + settings.width + '&nbsp;x&nbsp;' + settings.height + '</strong><span class="resDetail">' + settings.title + '</span>' +
				'</a><a href="#" class="icon i_edit" title="Edit"></a>' +
				'<a href="#" class="icon i_delete" title="Delete this resolution"></a>';
	
	newRow.html(html);
	newRow.css( 'display', 'none' );
	$('#resolutionsList').append(newRow);
	newRow.slideDown(300);

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

function getViewportSize( settings ) {

	chrome.windows.getLastFocused( function (win) {

		opt = {};
		opt.width = parseInt(settings.width);
		opt.height = parseInt(settings.height);
		chrome.windows.update( win.id, opt, function(){

			chrome.tabs.captureVisibleTab( win.id, function(url) {
				var img = new Image();
				img.src = url;
				
				img.onload = function () {

					hDiff = settings.width - img.width;
					vDiff = settings.height - img.height;
					
					var iniSett = settings;
					
					settings.width	= hDiff + parseInt(settings.width);
					settings.height	= vDiff + parseInt(settings.height);
					settings.type	= 'desktop';
					
					resizeWindow(settings);
				}
				
			});
			
		});

	});

}

function resizeWindow ( settings ) {
	if ( settings.type == 'mobile') {
		getViewportSize( settings );
	} else {
		if ( settings.pos == 3 || window.localStorage['overrideWindowPosition'] == 1 ) {
			settings.X = Math.floor((window.screen.availWidth - settings.width) / 2) + window.screen.availLeft;
			settings.Y = Math.floor((window.screen.availHeight - settings.height) / 2) + window.screen.availTop;
		}
		
		chrome.windows.getLastFocused( function (win) {
			var opt = {};
			opt.width	= parseInt(settings.width);
			opt.height	= parseInt(settings.height);
			
			if ( settings.X == parseInt(settings.X) ) {
				opt.left = parseInt(settings.X);
			}
			
			if ( settings.Y == parseInt(settings.Y) ) {
				opt.top = parseInt(settings.Y);
			}
			
			chrome.windows.update( win.id, opt );
			window.location.href.match(/popup\.html/) && window.close();
		});
	}
}

function setPopup(type) {
	if ( type == 1 ) {
		var popup = '';
	} else {
		var popup = 'popup.html';
	}
	
	//alert(popup);
	
	chrome.browserAction.setPopup({
		'popup' : popup
	});
}

