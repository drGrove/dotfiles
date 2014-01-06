$(function(){

			if ( window.location.hash == '#public' ) {
				window.location.href = window.location.pathname;
			}
			

			var overrideWindowPosition = window.localStorage['overrideWindowPosition'];
			var iconBehavior         = window.localStorage[iconBehaviorSetting] || 0;
			var hideTooltip          = window.localStorage[tooltipSetting];
			var hidePopupDescription = window.localStorage[popupDescriptionSetting];
			
			
			var oldWidth = window.localStorage[popupWidthSetting];
			if ( parseInt(oldWidth) == 0 || oldWidth == undefined ) {
				oldWidth = window.localStorage[popupWidthSetting] = 250;
			}
			$('#popupWidth').val(oldWidth);
			
			
			var oldDelay = window.localStorage[tooltipDelaySetting];
			if ( oldDelay == undefined ) {
				oldDelay = window.localStorage[tooltipDelaySetting] = 2000;
			}
			$('#tooltipDelay').val(oldDelay);
			
			
			if ( overrideWindowPosition == 1 ) {
				$('#overrideWindowPosition').attr('checked', true);
			} else {
				$('#overrideWindowPosition').attr('checked', false);
			}
			
			$('#overrideWindowPosition').click(function(){
				var val = (this.checked) ? 1 : 0;
				window.localStorage['overrideWindowPosition'] = val;
			});
			
			if ( iconBehavior == 1 ) {
				$('#iconBehavior1').attr('checked', true);
			} else {
				$('#iconBehavior0').attr('checked', true);
			}
			
			$('INPUT[name="iconBehavior"]').change(function(){
				var newVal = $('INPUT[name="iconBehavior"]:checked').val();
				window.localStorage[iconBehaviorSetting] = newVal;
				
				setPopup(newVal);
			});
			
			if ( hideTooltip == 1 ) {
				$('#hideTooltip').attr('checked', true);
				$('#tooltipDelaySet').hide(0);
			}
			if ( hidePopupDescription == 1 ) {
				$('#hidePopupDescription').attr('checked', true);
			}
			
			$('#hideTooltip').click(function(){
				if (this.checked) {
					window.localStorage[tooltipSetting] = 1;
					$('#tooltipDelaySet').fadeTo(200, 0.01, function(){
						$(this).slideUp(200);
					});
				} else {
					window.localStorage[tooltipSetting] = 0;
					$('#tooltipDelaySet').css('opacity', 0.01).slideDown(200, function(){
						$(this).fadeTo(200, 1);
					});
				}
				
				
				chrome.windows.getAll({populate:true}, function(windows) {
					for ( var w in windows ) {
						for ( var t in windows[w].tabs ) {
							var tabId = windows[w].tabs[t].id;
							chrome.tabs.sendMessage(tabId, {hideTooltip : window.localStorage[tooltipSetting]});
						}
					}
				})

			});
			
			$('#hidePopupDescription').click(function(){
				if (this.checked) {
					window.localStorage[popupDescriptionSetting] = 1;
				} else {
					window.localStorage[popupDescriptionSetting] = 0;
				}
			});
			
			
			$('#tooltipDelayForm').submit(function(e){
				e.preventDefault();
				
				var newDelay = $('#tooltipDelay').val();
				if ( newDelay != parseInt(newDelay) ) {
					newDelay = 2000;
				}

				$('#tooltipDelay').val(newDelay);
				window.localStorage[tooltipDelaySetting] = newDelay;
				$('#tooltipDelaySaved').stop().fadeIn(200).delay(2000).fadeOut(300);
				
				chrome.windows.getAll({populate:true}, function(windows) {
					for ( var w in windows ) {
						for ( var t in windows[w].tabs ) {
							var tabId = windows[w].tabs[t].id;
							chrome.tabs.sendMessage(tabId, {tooltipDelay : window.localStorage[tooltipDelaySetting]});
						}
					}
				})
			});
			
			
			$('#popupWidthForm').submit(function(e){
				e.preventDefault();
				
				var newWidth = $('#popupWidth').val();
				if ( parseInt(newWidth) == 0 ) {
					newWidth = 250;
				}
				if ( parseInt(newWidth) < 155 ) {
					newWidth = 155;
				}
				$('#popupWidth').val(newWidth);
				window.localStorage[popupWidthSetting] = newWidth;
				$('#popupWidthSaved').stop().fadeIn(200).delay(2000).fadeOut(300);
			});
			
			
			$('#closeOptions, #finish').click(function(e){
				e.preventDefault();
				closeActiveTab();
			});
			
			
			$('A[rel~="external"]').click(function(){
				this.target = '_blank';
			});
		});