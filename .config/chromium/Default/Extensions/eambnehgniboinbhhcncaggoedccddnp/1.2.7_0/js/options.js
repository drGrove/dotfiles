bgPage = chrome.extension.getBackgroundPage();
  
  
$(document).ready(function() { 
    
    _gaq.push(['_trackEvent', 'Options', 'Options shown']);
    
    if(getPref("notify_visits") == "1"){
        $("#notify_visits input").attr('checked', true);
    }
            
    $("#notify_visits").on("click",function() {
        if($("#notify_visits input").is(':checked')){
            _gaq.push(['_trackEvent', 'Options', 'Enable icon notification']);
            setPref("notify_visits", 1);
            bgPage.background.getOverviewData();
        }else{
            _gaq.push(['_trackEvent', 'Options', 'Disable icon notification']);
            setPref("notify_visits", 0);
            chrome.browserAction.setBadgeText({
                text: ""
            }); 
        }
    });
    
    $("#notify_color").find("input").attr("value", getPref("badgeColor"));
    
    $("#graph_color_1").find("input").attr("value", getPref("graphColor1"));
    $("#graph_color_2").find("input").attr("value", getPref("graphColor2"));
    
    
    if(getPref("stats") == "true"){
        $("#anonym_stats input").attr('checked', true);
    }
    $("#anonym_stats").on("click",function() {
        if($("#anonym_stats input").is(':checked')){
            _gaq.push(['_trackEvent', 'Options', 'Enable anonymous statistics']);
            setPref("stats", "true");
        }else{
            _gaq.push(['_trackEvent', 'Options', 'Disable anonymous statistics']);
            setPref("stats", "false");
        }
    });
    
    $('.minicolors').each( function() {
        $(this).minicolors({
            control: $(this).attr('data-control') || 'hue',
            defaultValue: $(this).attr('data-default-value') || '',
            inline: $(this).hasClass('inline'),
            letterCase: $(this).hasClass('uppercase') ? 'uppercase' : 'lowercase',
            opacity: $(this).hasClass('opacity'),
            position: $(this).attr('data-position') || 'left',
            styles: $(this).attr('data-style') || '',
            swatchPosition: $(this).attr('data-swatch-position') || 'left',
            textfield: !$(this).hasClass('no-textfield'),
            theme: $(this).attr('data-theme') || 'default',
            change: function(hex, opacity) {
                if($(this).parent().parent(".graph_color").attr("id") == "graph_color_1"){
                    setPref("graphColor1", hex);
                }else if($(this).parent().parent(".graph_color").attr("id") == "graph_color_2"){
                    setPref("graphColor2", hex);
                }else if($(this).parent().parent(".graph_color").attr("id") == "notify_color"){
                    setPref("badgeColor", hex);
                    chrome.browserAction.setBadgeBackgroundColor(     {
                        color:getPref("badgeColor")
                    }); 
                }
            }
        });
                
    });
    $(".checkbox").dgStyle();
    
    (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40485848-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();