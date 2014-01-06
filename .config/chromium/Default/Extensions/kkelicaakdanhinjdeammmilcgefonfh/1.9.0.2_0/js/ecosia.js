$(function(){
	
	var disableEcoLinks = parseInt(window.localStorage['disableEcoLinks'], 10);
	
	$('#enableEcoLinks').attr('checked', !disableEcoLinks).click(function(e) {
		window.localStorage['disableEcoLinks'] = this.checked ? 0 : 1;
		
		if (this.checked) {
			chrome.extension.sendMessage({enableEcoLinks : true}, function (response) {});
		} else {
			chrome.extension.sendMessage({disableEcoLinks : true}, function (response) {});
		}
	});
	
})