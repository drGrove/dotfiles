var g_lpws=null,g_lpws_state=0,g_lpws_timer=null,g_lpws_clientId="",g_lpws_window="undefined"!=typeof window?window:Components.classes["@mozilla.org/appshell/appShellService;1"].getService(Components.interfaces.nsIAppShellService).hiddenDOMWindow;function push_server_log(a){"undefined"!=typeof console&&console.log(a)}
function push_server_interval(a,c,d){Date.now();g_lpws_window.clearTimeout(g_lpws_timer);0==g_lpws_state?push_server_connect(a,c,d):g_lpws_timer=g_lpws_window.setTimeout(function(){push_server_interval(a,c,d)},6E4)}function push_server_disconnect(){push_server_log("push_server_disconnect!");g_lpws_window.clearTimeout(g_lpws_timer);g_lpws&&(g_lpws.onclose=g_lpws.onerror=null,delete g_lpws,g_lpws_state=0,g_lpws_clientId="")}
function push_server_connect(a,c,d){push_server_log("connecting to "+a+" chan: "+c);a=a.replace(/^http(s?):/ig,"ws$1:");g_lpws="undefined"!=typeof WebSocket?new WebSocket(a):"undefined"!=typeof MozWebSocket?new MozWebSocket(a):g_lpws_window.WebSocket(a);g_lpws_timer=g_lpws_window.setTimeout(function(){push_server_interval(a,c,d)},6E4);g_lpws.onopen=function(){g_lpws.send('{"channel":"/meta/handshake","version":"1.0","supportedConnectionTypes":["callback-polling"]}');g_lpws_state=Date.now()};g_lpws.onclose=
function(e){g_lpws_state=0;g_lpws_window.clearTimeout(g_lpws_timer);push_server_log("push_server onclose: "+e.code+" "+e.reason);g_lpws_timer=g_lpws_window.setTimeout(function(){push_server_interval(a,c,d)},5E3)};g_lpws.onmessage=function(a){try{g_lpws_state=Date.now();var b=JSON.parse(a.data)[0];"/ping"!=b.channel&&("/meta/connect"==b.channel?g_lpws.send(JSON.stringify({clientId:b.clientId,connectionType:"websocket",channel:"/meta/connect"})):"/meta/handshake"==b.channel?b.successful&&(g_lpws.send(JSON.stringify({clientId:b.clientId,
connectionType:"websocket",channel:"/meta/connect"})),g_lpws.send(JSON.stringify({clientId:b.clientId,subscription:c,channel:"/meta/subscribe"}))):"/meta/subscribe"!=b.channel&&c==b.channel&&"undefined"!=typeof b.data.av_update&&d())}catch(f){push_server_log("Caught error "+f)}}};
