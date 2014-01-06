
var hideTooltip = 0;
var tooltipDelay = 2000;
var $T, $wW, $wH, $vW, $vH;


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if ( request.hideTooltip == 0 || request.hideTooltip == 1 ) {
		toggleTooltip(request.hideTooltip);
		hideTooltip = request.hideTooltip;
	}
	if ( request.tooltipDelay != undefined ) {
		tooltipDelay = request.tooltipDelay;
	}
	
	if (request.getViewport) {
		sendResponse({
			width  : window.innerWidth,
			height : window.innerHeight
		});
	}
});

chrome.extension.sendMessage({hideTooltipSetting:true}, function (response) {
	if ( response.hideTooltipSetting == 1 ) {
		hideTooltip = 1;
	}
	
	if (response.tooltipDelay) {
		tooltipDelay = response.tooltipDelay;
	}
	
	toggleTooltip(response.hideTooltipSetting);
});

function toggleTooltip( hide ) {
	if ( hide == 1 ) {
		removeTooltip();
	} else {
		insertTooltip();
	}
}

function openSettings() {
	chrome.extension.sendMessage({openSettings:true}, function (response) {});
}


function insertTooltip () {

	var hide;
	var ic = chrome.extension.getURL('images/icon_19.png');
	
	var tooltip = '<div id="window-resizer-tooltip">' +
						'<a href="#" title="Edit settings"></a>' +
						'<span class="tooltipTitle">Window size: </span>' +
						'<span class="tooltipWidth" id="winWidth"></span> x <span class="tooltipHeight" id="winHeight"></span>' +
						'<br />' +
						'<span class="tooltipTitle">Viewport size: </span>' +
						'<span class="tooltipWidth" id="vpWidth"></span> x <span class="tooltipHeight" id="vpHeight"></span>' +
					'</div>';
	
	// hack to determine whether this is a regular page or a view-source page
	var isViewSource = $('.webkit-line-gutter-backdrop').size();
	
	// hack to determine whether this is a regular page or a media file (image, video, mp3, etc.)
	var BC = $('BODY').children();
	var isMediaFile	= (BC.size() == 1 && (BC[0].tagName == 'IMG' || BC[0].tagName == 'VIDEO'));
	
	
	if (!isViewSource && !isMediaFile) {
	
		$('body').append($(tooltip));
		
		$T = $('#window-resizer-tooltip');
		$wW = $('#winWidth');
		$wH = $('#winHeight');
		$vW = $('#vpWidth');
		$vH = $('#vpHeight');
		
		
		$T.find('a').css('background-image', 'url(' + ic + ')').click(function(e){
			e.preventDefault();
			openSettings();
		});
		
		$(window).resize(function(){
			if (hideTooltip != 1) {
				$T.css('display', 'block');
				clearTimeout(hide);
				
				$wW.html(window.outerWidth);
				$wH.html(window.outerHeight);
				
				$vW.html(window.innerWidth);
				$vH.html(window.innerHeight);
				
				hide = setTimeout(function(){
					$T.fadeOut(300);
				}, tooltipDelay);
			}
			else {
				$T.fadeOut(0);
			}
		});
		
		$T.mouseover(function(){
			if (hideTooltip != 1) {
				$T.fadeIn(0);
				clearTimeout(hide);
			}
		});
		
		$T.mouseout(function(){
			hide = setTimeout(function(){
				$T.fadeOut(300);
			}, tooltipDelay);
		});
	
	}

}

function removeTooltip() {
	$T = $('#window-resizer-tooltip');
	if ( $T.size() > 0 ) {
		$T.remove();
	}
}