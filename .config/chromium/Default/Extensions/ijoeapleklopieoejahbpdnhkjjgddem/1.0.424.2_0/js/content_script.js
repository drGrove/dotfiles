 //window.onscroll = scroll;

 document.addEventListener('scroll', function(evt) {
    var pageScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    var yPercentageScrolled =   (window.pageYOffset/pageScrollHeight) * 100;
 
    var pageScrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    var xPercentageScrolled = (window.pageXOffset/pageScrollWidth) * 100;

    console.log("yPercentageScrolled:" + yPercentageScrolled + ", xPercentageScrolled:" + xPercentageScrolled);
  
    var port = chrome.extension.connect({name: "scroll"});
    port.postMessage({yPercScroll: yPercentageScrolled, xPercScroll:xPercentageScrolled});
 });

 $(document).ready(function () {
  		console.log("jquery is included");
 
 		//register the keyboard handler
 		//window.addEventListener("keydown", onKeyUp, false);
  });

  /*document.addEventListener('click', function (evt) {
 		console.log("click handlder called");
 });*/

  function isThisPlatform (operationSystem) {
    return navigator.userAgent.toLowerCase().indexOf(operationSystem) > -1;
  }


$(document).click (function (evt) {
    var isMac = isThisPlatform('mac');    
	
  if ((isMac && evt.metaKey) || (!isMac && evt.ctrlKey)) {
 		var elementId =  evt.target.id;
		if (elementId.length == 0) {		
			var aParentElement = evt.target.parentElement;
			while (aParentElement != null) {
				parentElementId = aParentElement.id;
				if (parentElementId.length > 0) {
					elementId = parentElementId;
					break;
				} 
				aParentElement = aParentElement.parentElement; 		
			}
		}	
		console.log("elementId = " + elementId);
		evt.stopPropagation();
    evt.preventDefault();

    	if (elementId.length > 0) {
    	var port = chrome.extension.connect({name: "scrollToElement"});
 			port.postMessage({theElementId: elementId});
    	}
    	return false;
	}
});

$(document).dblclick (function (evt){
  var elementDblClicked = evt.target;
  var elementNodeType = elementDblClicked.nodeType;
  var anchorTextElement;
  
  if (elementNodeType == 1) {
      for (var i=0; i < elementDblClicked.childNodes.length; i++) {
          var aChildElement = elementDblClicked.childNodes[i];
          if (aChildElement.nodeType == 3) {
              anchorTextElement = aChildElement;
              break;
          }
      }   
  }
  else if (elementNodeType == 3) {
      anchorTextElement = aChildElement;
  }

  if (anchorTextElement != null) {
      var port = chrome.extension.connect({name: "scrollToText"});
      port.postMessage({anchorTextElement: anchorTextElement.nodeValue});
   }
});