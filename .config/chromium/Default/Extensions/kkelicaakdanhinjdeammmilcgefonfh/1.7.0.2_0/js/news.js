$(function(){
			
			window.localStorage[verStorage] = currentVersion;
			
			$('#closeOptions, #finish').click(function(e){
				e.preventDefault();
				closeActiveTab();
			});
			
			
			$('A[rel~="external"]').click(function(){
				this.target = '_blank';
			});
		});