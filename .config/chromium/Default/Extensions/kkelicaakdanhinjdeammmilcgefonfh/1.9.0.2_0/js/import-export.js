$(function(){

			var _export = {
				'presets'	: window.localStorage[rowStorage] ? JSON.parse(window.localStorage[rowStorage]) : defaultValues,
				'settings'	: {
						'iconBehavior'		: window.localStorage[iconBehaviorSetting],
						'popupDescription'	: window.localStorage[popupDescriptionSetting],
						'popupWidth'		: window.localStorage[popupWidthSetting],
						'tooltip'			: window.localStorage[tooltipSetting],
						'tooltipDelay'		: window.localStorage[tooltipDelaySetting]
				}
			};
			
			$('#exportSettings').val(JSON.stringify(_export)).click(function(){
				var $this = this;
				
				setTimeout(function(){
					$this.focus();
					$this.select();
				}, 20);
			});
			
			
			$('#import').click(function(){
				var answer = confirm('Are you sure you want to import the new settings?\nThis will overwrite your current configuration!');
				var $import = $('#importSettings');
				
				if ( answer ) {
					try {
						var imported = JSON.parse($import.val());
						
						if ( imported.presets ) {
							window.localStorage[rowStorage] = JSON.stringify(imported.presets);
						}
						
						if ( imported.settings ) {
							if ( imported.settings.iconBehavior ) {
								window.localStorage[iconBehaviorSetting] = imported.settings.iconBehavior;
							}
							
							if ( imported.settings.popupDescription ) {
								window.localStorage[popupDescriptionSetting] = imported.settings.popupDescription;
							}
							
							if ( imported.settings.popupWidth ) {
								window.localStorage[popupWidthSetting] = imported.settings.popupWidth;
							}
							
							if ( imported.settings.tooltip ) {
								window.localStorage[tooltipSetting] = imported.settings.tooltip;
							}
							
							if ( imported.settings.tooltipDelay ) {
								window.localStorage[tooltipDelaySetting] = imported.settings.tooltipDelay;
							}
						}
						
						alert('The settings have been imported!');
						
					} catch( err ) {
						alert('Could not import the new settings!');
					}
				}
				
				$import.val('');
				
			});
			
			$('#closeOptions, #finish').click(function(e){
				e.preventDefault();
				closeActiveTab();
			});
			
			
			$('A[rel~="external"]').click(function(){
				this.target = '_blank';
			});
		});