var b=b||{};b.b=function(){b.isInited=!0;document.c=b.a;chrome.extension.onMessage.addListener(e);g()};
b.a=function(){var a=document.webkitFullscreenElement,a={source:"content",target:"background",type:"full_screen_video_status",content:!(!a||"VIDEO"!=a.tagName&&!a.querySelector("VIDEO"))};chrome.extension.sendMessage(JSON.stringify(a))};
var h=function(a){if(a.querySelector('object[type="application/x-silverlight"]')||a.querySelector('object[type="application/x-silverlight-2"]')||a.querySelector('embed[type="video/quicktime"]'))return!0;a=a.getElementsByTagName("iframe");for(var c=0;c<a.length;c++){var f=a[c],d=f.contentDocument;d||(d=f.contentWindow.document);try{if(h(d))return!0}catch(k){}}return!1},
g=function(){chrome.extension.sendMessage(JSON.stringify({source:"content",target:"background",type:"unsupported_plugin_detected",content:h(document)}))},
e=function(a){if("string"!=typeof a)throw"Expecting string from extension. But get: "+JSON.stringify(a);a=JSON.parse(a);"background"==a.source&&"content"==a.target&&"detect_unsupported_plugin"==a.type&&g()};
b.isInited||b.b();
