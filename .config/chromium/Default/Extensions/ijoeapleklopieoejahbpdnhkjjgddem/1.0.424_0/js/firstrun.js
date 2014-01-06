/*jslint browser:true */
/*global chrome:true, $:true, SkyLabController:true, s:true, ASLLocalizer:true */
'use strict';

$(document).ready(function () {
    // loadOmniture();
    var ui_locale = chrome.i18n.getMessage('@@ui_locale');
    if (ui_locale.match(/^fr/)) {
        $("#connecting").attr('class', 'connecting_fr');
    } else if (ui_locale.match(/^ja/)) {
        $("#connecting").attr('class', 'connecting_ja');
    } else {
        $("#connecting").attr('class', 'connecting_en');
    }
    $(function () {
        ASLLocalizer.localize();
        // tweak local links to refer to files in the extension
    });
});

// OMNITURE SUPPORT

/* Set Report Suite ID */
var s_account = "mxskylab";

function loadOmniture() {
    /* *** *** *** OMNITURE SUPORT *** *** *** */
    var s_code, scJsHost, Head, Script;
    /* Reference Omniture JS library on Production */
    scJsHost = "http://wwwimages.adobe.com";
    
    Head = document.getElementsByTagName('head')[0];
    
    Script = document.createElement('script');
    Script.src = scJsHost + "/uber/js/omniture_s_code_rm.js";
    Script.onload = function () {
        s.channel = "Shadow";
        s.pageName = "Shadow: Popup";
        s.server = "Adobe Shadow";
        s.prop32 = "en-us";
        s_code = s.t();
    };
    Head.appendChild(Script);
    /* *** *** *** END OMNITURE SUPPORT *** *** *** */
}