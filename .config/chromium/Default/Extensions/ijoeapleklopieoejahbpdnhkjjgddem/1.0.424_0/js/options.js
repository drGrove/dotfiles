/*jslint browser:true */
/*global chrome:true, $:true, SkyLabController:true, s:true, ASLLocalizer:true */
'use strict';
var BG$ = chrome.extension.getBackgroundPage().$,
    SkyLabController = chrome.extension.getBackgroundPage().SkyLabController;

$(function () {
    ASLLocalizer.localize();
});
$(document).ready(function (ev) {
    var log = JSON.parse(localStorage.getItem("log")),
        hostinfo = SkyLabController.getDeviceManagerInfo();

    if (log) {
        $.each(log, function (index, value) {
            $("#logdump").val(value + "\n" + $("#logdump").val());
        });
    }
    $("#emptylog").click(function (ev) {
        localStorage.removeItem("log");
        $("#logdump").val("");
    });
    
    $("#versioninfo").append(hostinfo.build);
    $("#weinre").change(function (ev) {
        if ($("#weinre").val() === 'custom') {
            $("#customservertd").show();
            $("#customserverbuttontd").show();
            if (SkyLabController.getCustomRemoteInspectionServer()) {
                $("#customserver").val(SkyLabController.getCustomRemoteInspectionServer());
                $("#save").hide();
                $("#edit").show();
                $("#customserver").attr("disabled", "disabled");
            } else {
                $("#customserver").removeAttr("disabled");
                $("#save").show();
                $("#edit").hide();
            }
        } else {
            $("#customservertd").hide();
            $("#customserverbuttontd").hide();
            SkyLabController.unsetCustomRemoteInspectionServer();
        }
    });
    $("#save").click(function (ev) {
        var riserver = $("#customserver").val();
        if (!riserver.match(/^htt/)) {
            riserver = "http://" + riserver;
        }
        if (!riserver.match(/\/$/)) {
            riserver = riserver + "/";
        }
        SkyLabController.setCustomRemoteInspectionServer(riserver);
        $("#customserver").val(SkyLabController.getCustomRemoteInspectionServer());
        $("#save").hide();
        $("#customserver").attr("disabled", "disabled");
        $("#edit").show();
    });
    $("#customserver").keydown(function (event) {
        if (event.keyCode === 13 || event.keyCode === 9) {
            // Return or Tab, Respectively
            $("#save").trigger("click");
        }
    });
    $("#edit").click(function (ev) {
        $("#customserver").removeAttr("disabled");
        $("#save").show();
        $("#edit").hide();
    });
    if (SkyLabController.getCustomRemoteInspectionServer()) {
        $("#weinre").val("custom");
        $("#weinre").change();
    }

    $("#ssfolder").val(SkyLabController.getScreenshotFolder());

    $("#ssfolderedit").click(function (ev) {
        $("#ssfoldererror").text("");
        $("#ssfolder").removeAttr("disabled");
        $("#ssfoldersave").show();
        $("#ssfolderedit").hide();
    });
    $("#ssfoldersave").click(function (ev) {
        var ssfolder = $("#ssfolder").val();
        SkyLabController.setScreenshotFolder(ssfolder);
        $("#ssfoldersave").hide();
        $("#ssfolder").attr("disabled", "disabled");
        $("#ssfolderedit").show();
        $("#ssfolder").removeClass("error");
    });
    $("#ssfolder").keydown(function (event) {
        if (event.keyCode === 13 || event.keyCode === 9) {
            // Return or Tab, Respectively
            $("#ssfoldersave").trigger("click");
        }
    });
    BG$(SkyLabController).on("screenshotfolder.options", function (event) {
        $("#ssfolder").attr("value", event.folder);
    });

    BG$(SkyLabController).on("screenshotfoldererror.options", function (event) {
        $("#ssfolder").addClass("error");
        $("#ssfoldererror").text(event.message);
    });
//            setTimeout(loadOmniture, 1000);
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

$(window).unload(function (event) {
    BG$(SkyLabController).off(".options");
});
