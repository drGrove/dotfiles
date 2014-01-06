$(function(){
			jQuery.fx.off = true;

			displayRows();
			
			var oldWidth = window.localStorage['WindowResizer.PopupWidth'];
			if ( parseInt(oldWidth) == 0 || oldWidth == undefined ) {
				oldWidth = window.localStorage['WindowResizer.PopupWidth'] = 250;
			}
			$('#resolutionsList').css('width', oldWidth + 'px');
			
			if ( window.localStorage[popupDescriptionSetting] == 1 ) {
				$('.resDetail').css('display', 'none');
				$('.handle STRONG').css('font-weight', 'normal');
			}
			
			var customize = ( $('.resRow').size() ) ? ' customize' : '';

			$('#resolutionsList').append('<li class="resRow' + customize + '"><a href="#" class="handle" id="customize"><span class="icon i_resolutions"></span>Edit resolutions</a></li>');
			$('#resolutionsList').append('<li class="resRow"><a href="#" class="handle" id="settings"><span class="icon i_settings"></span>Settings</a></li>');
			$('#resolutionsList').append('<li class="resRow"><a href="#" class="handle" id="support"><span class="icon i_bulb"></span>Support</a></li>');
			
			
			var verNo = window.localStorage[verStorage];
			verNo = (verNo) ? verNo : 0;
			
			if ( verNo < currentVersion ) {
				//$('#resolutionsList').append('<li class="resRow"><a href="#" class="handle" id="news"><span class="icon i_bulb"></span>Updated!</a></li>');
			}


			$('.resRow:not(#customize, #news)').click(function(e){
				e.preventDefault();
				
				var settings = $(this).data('settings');
				resizeWindow(settings);
			});
			
			$('#customize').click( function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'options.html', selected : true } );
			});
			
			$('#settings').click( function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'settings.html', selected : true } );
			});
			
			$('#support').click( function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'poll.html', selected : true } );
			});
			
			$('#news').click( function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'news.html', selected : true } );
			});
		});