/*jslint browser:true */
/*global chrome:true, $:true, SkyLabController:true, s:true, ASLLocalizer:true */
'use strict';

var BG$ = chrome.extension.getBackgroundPage().$,
    SkyLabController = chrome.extension.getBackgroundPage().SkyLabController,
    SkyLabView = chrome.extension.getBackgroundPage().SkyLabView,
    riserver = SkyLabController.getRemoteInspectionServer(),
    isFocused = false,
    showingWelcome = false,
    deviceListLookup = {},
    pairingDeviceListLookup = {},
    unavailableDeviceListLookup = {},
    newDeviceListLookup = {},
    deviceList = [],
    pairingDeviceList = [],
    unavailableDeviceList = [],
    firstKeydown = false,
    submenuoverlayTimeout,
    toggleClassSuffix = '';

function flushDeviceLists() {
    $("#removedevices").children(".hl").remove();
    $("#removeconnected").children(".hl").remove();
    $("#pairingdevices").children(".hl").remove();
    $("#connecteddevices").children(".hl").remove();
}

function toggleDeviceWidgets(state) {
    if (SkyLabController.getFollowMode() === 'off') {
        state = 'off';
    }
    if (SkyLabController.getDeviceList().length === 0) {
        state = 'off';
    }
    if (state === 'off') {
        $('#screenshot').attr({'disabled':'disabled','aria-disabled':'true'}).removeAttr('tabindex').removeAttr('href');
        $('#forcerefresh').attr({'disabled':'disabled','aria-disabled':'true'}).removeAttr('tabindex').removeAttr('href');
        $('#togglechrome').attr({'disabled':'disabled','aria-disabled':'true'}).removeAttr('tabindex').removeAttr('href');
    } else {
        $('#screenshot').attr({'tabindex':'0','href':'#'}).removeAttr('disabled').removeAttr('aria-disabled');
        $('#forcerefresh').attr({'tabindex':'0','href':'#'}).removeAttr('tabindex').removeAttr('disabled').removeAttr('aria-disabled');
        $('#togglechrome').attr({'tabindex':'0','href':'#'}).removeAttr('disabled').removeAttr('aria-disabled');
    }
}

function hideWaitingAndSyncBrowsingOff() {
    $('#waitingdiv').hide();
    $('#syncbrowseoff').hide();
}

function showWaitingOrSyncBrowseOff() {
    if (SkyLabController.isDeviceManagerAlive()) {
        if (SkyLabController.getFollowMode() === "off") {
            $('#syncbrowseoff').show();
            $('#waitingdiv').hide();
        } else {
            $('#syncbrowseoff').hide();
            if (deviceList.length === 0 && pairingDeviceList.length === 0) {
                $('#waitingdiv').show();
            } else {
                $('#waitingdiv').hide();
            }
        }       
    } else {
        hideWaitingAndSyncBrowsingOff();
        $("#dmerror").show();
    }
}

function setToggleModeImage() {
    // TODO: reduce the code here.  Use "disabled" more intelligently
    if (SkyLabController.getFollowMode() === "on") {
        if (SkyLabController.isDeviceManagerAlive()) {
            $("#toggle")
                .attr({
                    'class':'toggleon' + toggleClassSuffix,
                    'title':chrome.i18n.getMessage('browsingon_tt'),
                    'aria-label':chrome.i18n.getMessage('browsingon_tt'),
                    'aria-checked':true,
                    'tabindex':'0',
                    'href':'#'
                })
                .removeAttr('aria-disabled')
                .removeAttr('disabled');
            $('#screenshotfolder')
                .attr({
                    'tabindex':'0',
                    'href':'#'
                })
                .removeAttr('disabled')
                .removeAttr('aria-disabled');
            toggleDeviceWidgets('on');
        } else {
            $("#toggle")
                .attr({
                    'class':'toggleon' + toggleClassSuffix,
                    'title':chrome.i18n.getMessage('browsingtooltipNoDM_tt'),
                    'aria-label':chrome.i18n.getMessage('browsingtooltipNoDM_tt'),
                    'aria-checked':true,
                    'disabled':'disabled',
                    'aria-disabled':true
                })
                .removeAttr('tabindex')
                .removeAttr('href');
            $('#screenshotfolder')
                .attr({
                    'disabled':'disabled',
                    'aria-disabled':true
                })
                .removeAttr('tabindex')
                .removeAttr('href');
            toggleDeviceWidgets('off');
        }
    } else {
        if (SkyLabController.isDeviceManagerAlive()) {
            $("#toggle")
                .attr({
                    'class':'toggleoff' + toggleClassSuffix, 
                    'title':chrome.i18n.getMessage('browsingoff_tt'),
                    'aria-label':chrome.i18n.getMessage('browsingoff_tt'),
                    'aria-checked':false,
                    'tabindex':'0',
                    'href':'#'
                })
                .removeAttr('disabled')
                .removeAttr('aria-disabled');
        } else {
            $("#toggle")
                .attr({
                    'class':'toggleoff' + toggleClassSuffix, 
                    'title':chrome.i18n.getMessage('browsingtooltipNoDM_tt'),
                    'aria-label':chrome.i18n.getMessage('browsingtooltipNoDM_tt'),
                    'aria-checked':false,
                    'aria-disabled':true,
                    'disabled':'disabled'
                })
                .removeAttr('tabindex')
                .removeAttr('href');
            $('#screenshotfolder')
                .attr({
                    'disabled':'disabled',
                    'aria-disabled':true
                })
                .removeAttr('tabindex')
                .removeAttr('href');
        }
        toggleDeviceWidgets('off');
    }
    showWaitingOrSyncBrowseOff();
}

function setFullScreenImage() {
    if (chrome.extension.getBackgroundPage().isFullScreen === true) {
        $('#togglechrome').attr({'title':chrome.i18n.getMessage('showchrome_tt'),'aria-label':chrome.i18n.getMessage('showchrome_tt')});
        $('#togglechrome').removeClass('fullon');
        $('#togglechrome').addClass('fulloff');
    } else {
        $('#togglechrome').removeClass('fulloff');
        $('#togglechrome').addClass('fullon');
        $('#togglechrome').attr({'title':chrome.i18n.getMessage('fullscreen_tt'),'aria-label':chrome.i18n.getMessage('fullscreen_tt')});
    }
}

function shouldShowWelcomeMessage() {
    // We want to make sure the message is persistent until
    // the user has succesfully connnected to an updated version of DM.
    return SkyLabController.shouldShowWelcomeMessage();
}

// TODO: showWelcomeMessage, showDeviceManagerError and showDeviceManagerExpired are practically identical
function showWelcomeMessage() {
    $("#welcomeDiv").show();

    flushDeviceLists();
    hideWaitingAndSyncBrowsingOff();
    $("#dmexpired").hide();
    $("#dmerror").hide();
    // hide the widgets at the bottom
    $("#screenshot").hide();
    $("#forcerefresh").hide();
    $("#togglechrome").hide();
    $("#screenshotfolder").hide();
    
    $("#machineinfoheader").hide();
    
    setToggleModeImage();
    $("#removeback").click();
}

function showDeviceManagerError() {
    flushDeviceLists();
    $("#welcomeDiv").hide();
    $("#machineinfoheader").show();
        
    // show the widgets at the bottom
    $("#screenshot").show();
    $("#forcerefresh").show();
    $("#togglechrome").show();
    $("#screenshotfolder").show();
    
    hideWaitingAndSyncBrowsingOff();
    $("#dmexpired").hide();
    $("#dmerror").show();
    setToggleModeImage();
    $("#removeback").click();
}

function showDeviceManagerAuthFail() {
    flushDeviceLists();
    $("#welcomeDiv").hide();
    $("#machineinfoheader").show();
        
    // show the widgets at the bottom
    $("#screenshot").show();
    $("#forcerefresh").show();
    $("#togglechrome").show();
    $("#screenshotfolder").show();
    
    hideWaitingAndSyncBrowsingOff();
    $("#dmexpired").hide();
    $("#dmerror").hide();
    setToggleModeImage();
    $("#removeback").click();
    showWelcomeMessage();
}

function showDeviceManagerExpired() {
    flushDeviceLists();
    $("#welcomeDiv").hide();
    $("#machineinfoheader").show();
    
    // show the widgets at the bottom
    $("#screenshot").show();
    $("#forcerefresh").show();
    $("#togglechrome").show();
    $("#screenshotfolder").show();
        
    hideWaitingAndSyncBrowsingOff();
    $("#dmerror").hide();
    $("#dmexpired").show();
    setToggleModeImage();
    $("#removeback").click();
}

function refreshDeviceList() {
    // TODO: Clone hidden divs in the dom and show them rather than building them on the fly in here.
    if (shouldShowWelcomeMessage()) {
        showWelcomeMessage();
        showingWelcome = true;
        return;
    }

    deviceList = SkyLabController.getDeviceList();
    pairingDeviceList = SkyLabController.getNowPairing();
    unavailableDeviceList = SkyLabController.getUnavailableDeviceList();
    if (deviceList.length === 0 && pairingDeviceList.length === 0 && unavailableDeviceList.length === 0) {
        toggleDeviceWidgets('off');
        $.each(deviceListLookup, function (index, value) {
            $("#" + value.id).remove();
            $("#remove" + value.id).remove();
            delete deviceListLookup[value.id];
        });
        $.each(pairingDeviceListLookup, function (index, value) {
            $("#" + value.id).remove();
            $("#remove" + value.id).remove();
            delete pairingDeviceListLookup[value.id];
        });
        $.each(unavailableDeviceListLookup, function (index, value) {
            $("#" + value.id).remove();
            $("#remove" + value.id).remove();
            delete unavailableDeviceListLookup[value.id];
        });
        if (SkyLabController.isDeviceManagerAlive()) {
            if (SkyLabController.isDeviceManagerValid()) {
                $("#dmexpired").hide();
                showWaitingOrSyncBrowseOff();
            } else {
                hideWaitingAndSyncBrowsingOff();
                $("#dmexpired").show();
            }
            $("#dmerror").hide();
            $('#screenshotfolder').attr({'disabled':false,'aria-disabled':false,'tabindex':'0','href':'#'});
        } else {
            showDeviceManagerError();
        }
    } else {
        $("#dmerror").hide();
        $("#dmexpired").hide();
        $("#devicelistfooter").show();
        if (deviceList.length !== 0) {
            hideWaitingAndSyncBrowsingOff();
            newDeviceListLookup = {};
            $.each(deviceList, function (index, value) {
                var addAfter, addAfterRemove;
                newDeviceListLookup[value.id] = value;
                if (!deviceListLookup[value.id]) {
                    // push the device list into the lookup by id
                    deviceListLookup[value.id] = value;
                    if (pairingDeviceListLookup[value.id]) {
                        delete pairingDeviceListLookup[value.id];
                    }
                    if (unavailableDeviceListLookup[value.id]) {
                        delete unavailableDeviceListLookup[value.id];
                    }
                    $("#" + value.id).remove();
                    $("#remove" + value.id).remove();
                    addAfter = "#devicelistheader";
                    $("#connecteddevices").children(".hl").each(function (domindex, domvalue) {
                        if ($(this).children(".clearrow").children(".devicename").text().trim().toUpperCase() <  value.name.toUpperCase()) {
                            addAfter = "#" + domvalue.id;
                        }
                    });
                    // Clone a hidden template in the popup, and add it after the appropriate thing.
                    $(addAfter).after(
                        $("#connectedtemplate")
                            .clone()
                            .attr({
                                'id':value.id,
                                'aria-labelledby':'devicename'+value.id
                            })
                            .bind({
                                focusin:function(e){
                                    $(this).addClass('focus');
                                },
                                focusout:function(e){
                                    $(this).removeClass('focus');
                                }
                            }));
                    $("#" + value.id + " .clearrow .devicebuttons .deviceeject").click(function (ev) {
                        SkyLabView.trackEvent("Eject Device");
                        SkyLabController.ejectDevice([value.id]);
                    }).attr({'title': chrome.i18n.getMessage("disconnect_tt"), 'aria-label': chrome.i18n.getMessage("disconnect_tt")});

                    $("#" + value.id + " .clearrow .devicebuttons .deviceinspect").click(function (ev) {
                        var fullscreen = (chrome.extension.getBackgroundPage().isFullScreen) ? "true" : "false";
                        SkyLabController.remoteInspect(value.id, riserver, fullscreen);
                    }).attr({'title': chrome.i18n.getMessage("remoteinspect_tt"), 'aria-label': chrome.i18n.getMessage("remoteinspect_tt")});
                    addAfterRemove = "#removeconnectedheader";
                    $("#removeconnected").children("div").not(".message").each(function (domindex, domvalue) {
                        if ($(this).children(".clearrow").first(".devicename").text().trim().toUpperCase() <  value.name.toUpperCase()) {
                            addAfterRemove = "#" + domvalue.id;
                        }
                    });

                    // Clone a hidden template in the popup, and add it after the appropriate thing.
                    $(addAfterRemove).after(
                        $("#removetemplate")
                            .clone()
                            .attr({
                                'id':'remove' + value.id,
                                'aria-labelledby':'devicename' + value.id
                            })
                            .bind({
                                focusin:function(e){
                                    $(this).addClass('focus');
                                },
                                focusout:function(e){
                                    $(this).removeClass('focus');
                                }
                            }));
					$("#removeconnectedheader").siblings().removeClass("first").eq(0).addClass("first");
                    $("#" + value.id + " .clearrow .devicename").attr({'id':'devicename'+value.id,'title':value.name}).append(value.name);
                    $("#remove" + value.id + " div .devicename").attr({'id':'devicename'+value.id,'title':value.name}).append(value.name);
                    $("#remove" + value.id + " div .devicebuttons a").click(function (ev) {
                        SkyLabController.ejectDevice([value.id]);
                    }).attr({'title':chrome.i18n.getMessage("disconnect_tt"),'aria-label':chrome.i18n.getMessage("disconnect_tt")});
                }
            });
            // Drop anything left in the dropped lookup
            $.each(deviceListLookup, function (index, value) {
                if (!newDeviceListLookup[value.id]) {
                    $("#" + value.id).remove();
                    $("#remove" + value.id).remove();
                    delete deviceListLookup[value.id];
                }
            });
            toggleDeviceWidgets('on');
        } else {
            // Drop everything in the device lookup, there's nothing in the list
            $.each(deviceListLookup, function (index, value) {
                $("#" + value.id).remove();
                $("#remove" + value.id).remove();
                delete deviceListLookup[value.id];
            });
            toggleDeviceWidgets('off');
        }
        if (pairingDeviceList.length !== 0) {
            hideWaitingAndSyncBrowsingOff();
            newDeviceListLookup = {};
            $.each(pairingDeviceList, function (index, value) {
                newDeviceListLookup[value.id] = value;
                if (!pairingDeviceListLookup[value.id]) {
                    // push the device list into the lookup by id					
                    pairingDeviceListLookup[value.id] = value;
                    $("#" + value.id).remove();
                    var addAfter = "#pairinglistheader";
                    $("#pairingdevices").children(".hl").each(function (domindex, domvalue) {
                        if ($(this).children(".clearrow").children("div").children(".pairingdevicename").text().trim().toUpperCase() <  value.name.toUpperCase()) {
                            addAfter = "#" + domvalue.id;
                        }
                    });
                    // Clone a hidden template in the popup, and add it after the appropriate thing.
                    $(addAfter).after(
                        $("#pairingtemplate")
                            .clone()
                            .attr({
                                'id':value.id,
                                'aria-labelledby':'pairingdevicename'+value.id
                            })
                            .bind({
                                focusin:function(e) {
                                    $(this).addClass('focus');
                                },
                                focusout:function(e) {
                                    $(this).removeClass('focus');
                                }
                            }));
                    // Set IDs for easy triggering.  If you change the layout, you need to update this.
                    // This can and should be done better.
                    $("#" + value.id + " div div .passcodefield .passcodefield").attr({"id":"passcode" + value.id,
                        "aria-label":chrome.i18n.getMessage("default_passcode"),
                        "title":chrome.i18n.getMessage("default_passcode"),
                        "placeholder":chrome.i18n.getMessage("default_passcode")});
                    $("#" + value.id + " div div .devicecheck").attr("id", "devicecheck" + value.id);
                    $("#" + value.id + " div .devicecancel").attr("id", "devicecancel" + value.id);
                    $("#" + value.id + " div div .pairingdevicename").attr({'id':'pairingdevicename'+value.id,'title':value.name}).append(value.name);
                    $("#passcode" + value.id).click(function () {
                        $("#passcode" + value.id).attr("value", "");
                    });
                    $("#passcode" + value.id).keydown(function (event) {
                        if (event.keyCode === 13 || event.keyCode === 9) {
                            // Return or Tab, Respectively
                            $("#devicecheck" + value.id).trigger("click");
                        } else if (firstKeydown === false) {
                            firstKeydown = true;
                            $("#passcode" + value.id).attr("value", "");
                        }
                    });
                    $("#passcode" + value.id).focus(function () {
                        isFocused = "#passcode" + value.id;
                    });
                    $("#devicecheck" + value.id).click(function (ev) {
                        SkyLabView.trackEvent("Authorize Device");
                        SkyLabController.pairDevice($("#passcode" + value.id).val(), value.id);
                    });
                    $("#devicecancel" + value.id).click(function (ev) {
                        SkyLabController.cancelDevice(value.id);
                    });
                    $("#devicecheck" + value.id).attr({"title": chrome.i18n.getMessage("authorize_tt"),"aria-label": chrome.i18n.getMessage("authorize_tt")});
                    $("#devicecancel" + value.id).attr({"title": chrome.i18n.getMessage("cancel_tt"),"aria-label": chrome.i18n.getMessage("cancel_tt")});
                }
            });
            // Drop anything left in the dropped lookup
            $.each(pairingDeviceListLookup, function (index, value) {
                if (!newDeviceListLookup[value.id]) {
                    $("#" + value.id).remove();
                    delete pairingDeviceListLookup[value.id];
                }
            });
        } else {
            // Drop anything in the lookup, because there's nothing in a pairing state
            $.each(pairingDeviceListLookup, function (index, value) {
                $("#" + value.id).remove();
                delete pairingDeviceListLookup[value.id];
            });
        }
        // Now that we're done mucking with the Pairing list, resolve focus
        if (!isFocused  || $("#" + isFocused).length <= 0) {
            $("input.passcodefield:first").focus();
            firstKeydown = false;
            isFocused = $("input.passcodefield:first").attr("id");
        }
        if (deviceList.length === 0 && pairingDeviceList.length === 0) {
            if (SkyLabController.isDeviceManagerValid()) {
                $("#dmexpired").hide();
                showWaitingOrSyncBrowseOff();
            } else {
                hideWaitingAndSyncBrowsingOff();
                $("#dmexpired").show();
            }
        }
        if (unavailableDeviceList.length !== 0) {
            newDeviceListLookup = {};
            $.each(unavailableDeviceList, function (index, value) {
                newDeviceListLookup[value.id] = value;
                if (!unavailableDeviceListLookup[value.id]) {
                    // push the device list into the lookup by id
                    unavailableDeviceListLookup[value.id] = value;
                    $("#remove" + value.id).remove();
                    var addAfterRemove = "#removelistheader";
                    $("#removedevices").children(".hl").each(function (domindex, domvalue) {
                        if ($(this).children(".clearrow").first(".devicename").text().trim().toUpperCase() <  value.name.toUpperCase()) {
                            addAfterRemove = "#" + domvalue.id;
                        }
                    });
                    $(addAfterRemove).after(
                        $("#unavailabletemplate")
                            .clone()
                            .attr({
                                'id':'remove' + value.id,
                                'aria-labelledby':'devicename'+value.id
                            })
                            .bind({
                                focusin:function(e) {
                                    $(this).addClass('focus')
                                },
                                focusout:function(e) {
                                    $(this).removeClass('focus')
                                }
                            }));
                    $("#remove" + value.id + " div .devicename").attr({'id':'devicename'+value.id,'title':value.name}).append(value.name);
                    $("#remove" + value.id + " div .devicebuttons a").click(function (ev) {
                        SkyLabView.trackEvent("Deauthorize Device");
                        SkyLabController.forgetDevice(value.id);
                    }).attr({'title': chrome.i18n.getMessage("deauthorize_tt"),'aria-label': chrome.i18n.getMessage("deauthorize_tt")});
                }
            });
            // Drop anything left in the dropped lookup
            $.each(unavailableDeviceListLookup, function (index, value) {
                if (!newDeviceListLookup[value.id]) {
                    $("#remove" + value.id).remove();
                    delete unavailableDeviceListLookup[value.id];
                }
            });
        } else {
            // Drop everything in the device lookup, there's nothing in the list
            $.each(unavailableDeviceListLookup, function (index, value) {
                $("#remove" + value.id).remove();
                delete unavailableDeviceListLookup[value.id];
            });
        }
    }
}

function showPasscodeInvalid(devices) {
    $.each(devices, function (key, value) {
        SkyLabView.trackEvent("Authorize Failed - Invalid Passcode");
        $("#passcode" + value).attr({'value':'','aria-invalid':true}).addClass('passcodefielderror');
    });
}


function showHostInfo() {
    var hostinfo = SkyLabController.getDeviceManagerInfo();
    $("#machinename").text(hostinfo.machinename);
    $("#hostips").text(hostinfo.hostips.join(", "));
    $("#hostips").attr("title", hostinfo.hostips.join(", "));
}


function showWelcomeMessage() {
    var i = 0,
        removeMessage = '',
        showme = SkyLabController.showWhichMessage(),
        showWhatDivForMessage = {
            dmupdate: 'dmupdatewrapper',
            survey: 'periodicsurveywrapper',
            renew: 'subscriptionexpiredwrapper',
            premiumscreenshots: 'screenshotsarepremiumwrapper',
            premiumdevices: 'seconddeviceispremiumwrapper',
            buyitnow: 'buyitnowwrapper',
            dmhandshake: 'dmhandshakewrapper',
            dmhandshakerejected: 'dmhandshakerejectedwrapper'
        };

    if (showme.length > 0) {
        $("dmupdatewrapper").hide();
        $("#periodicsurveywrapper").hide();
        $("#subscriptionexpiredwrapper").hide();
        $("#screenshotsarepremiumwrapper").hide();
        $("#seconddeviceispremiumwrapper").hide();
        $("#buyitnowwrapper").hide();
        $("#dmhandshakewrapper").hide();
        while (i < showme.length) {
            
            $('#' + showWhatDivForMessage[showme[i]]).show();
            $("#shadmessage").show();
            $('#' + showWhatDivForMessage[showme[i]] + '-remove').off('click');
            $('#' + showWhatDivForMessage[showme[i]] + '-remove').on('click', function (ev) {
                removeMessage = this.parentNode.id;
                $('#' + removeMessage).hide();
                $.each(showWhatDivForMessage, function (index, value) {
                    if (value === removeMessage) {
                        SkyLabController.stopShowingMessage(index);
                    }
                });
            });
            // This is not a good way to do this
            if (showme[i] === 'dmhandshakerejected') {
                $("#dmerror").hide();
            }
            i += 1;
        }
    }
}

function submenuoverlay_slideToggleCallback() {
    var submenuoverlay = $(this);
    if(submenuoverlay.is(':visible'))
    {
        $('#logo').attr('aria-expanded','true');
        submenuoverlay.attr('aria-hidden','false').bind({
            focusout:function(ev) {
                if(!document.activeElement
                    || ($(document.activeElement).closest('#submenuoverlay').length == 0
                            && !$(document.activeElement).is('#logo')))
                {
                    submenuoverlayTimeout = setTimeout(function(){submenuoverlay.slideUp('fast',submenuoverlay_slideToggleCallback)}, 50);
                }
            },
            focusin:function(ev) {
                clearTimeout(submenuoverlayTimeout);
            }
        }).find('a').attr('tabindex',-1).bind({
            keydown:function(ev) {
                switch(ev.keyCode) {
                    case 27:
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        submenuoverlay.slideUp('fast',submenuoverlay_slideToggleCallback);
                        $('#logo').focus();
                        break;
                    case 9:
                        ev.preventDefault();
                        ev.stopImmediatePropagation(); 
                        if (ev.shiftKey) $('#logo').focus();
                        break;
                    case 35:
                        $(this).attr('tabindex',-1).parent().siblings(':last').find('a').attr('tabindex',0).focus();
                        break;
                    case 36:
                        $(this).attr('tabindex',-1).parent().siblings(':first').find('a').attr('tabindex',0).focus();
                        break;
                    case 38:
                        if($(this).attr('tabindex',-1).parent().prev().find('a').attr('tabindex',0).focus().length==0)
                        {
                            submenuoverlay.slideUp('fast',submenuoverlay_slideToggleCallback);
                            $('#logo').focus();
                        }
                        break;
                    case 40:
                        $(this).attr('tabindex',-1).parent().next().find('a').attr('tabindex',0).focus();
                        break;
                }
            }
        }).first().attr('tabindex',0).focus();
    } else {
        $('#logo').attr('aria-expanded','false');
        submenuoverlay.attr('aria-hidden','true').unbind('focusin, focusout').find('a').attr('tabindex',-1).unbind('keydown');
    }
}

$(document).ready(function () {    
    var goUrlSuffix = '',
        ui_locale = chrome.i18n.getMessage('@@ui_locale');
    if (!ui_locale.match(/^en/)) {
        toggleClassSuffix = '_alt';
    }
    if (ui_locale.match(/^fr/)) {
        goUrlSuffix = '_fr';
    } else if (ui_locale.match(/^ja/)) {
        goUrlSuffix = '_jp';
    }
    var os = navigator.platform;
    if ( os === ('Win32' || 'Win64')) {
        $('#dmupdatelink').attr('href', 'http://www.adobe.com/go/update_edge_inspectcc_win' + goUrlSuffix);
        $('#dmupdatelink').on('click', function () {
            chrome.tabs.create({url: 'http://www.adobe.com/go/update_edge_inspectcc_win' + goUrlSuffix});
        });
    }
    if (os === ('MacIntel' || 'MacPPC')) {            
        $('#dmupdatelink').attr('href', 'http://www.adobe.com/go/update_edge_inspectcc_osx' + goUrlSuffix);
        $('#dmupdatelink').on('click', function () {
            chrome.tabs.create({url: 'http://www.adobe.com/go/update_edge_inspectcc_osx' + goUrlSuffix});
        });
    }
    $('#renewlink').attr('href', 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix);
    $('#buyitnowlink').attr('href', 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix);    
    $('#ssupgradelink').attr('href', 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix);
    $('#sdupgradelink').attr('href', 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix);
    $('#downloadisolink').attr('href', 'http://adobe.com/go/edgeinspect_ios' + goUrlSuffix);
    $('#downloadandroidlink').attr('href', 'http://adobe.com/go/edgeinspect_android' + goUrlSuffix);
    $('#downloadamazonlink').attr('href', 'http://adobe.com/go/edgeinspect_amazon' + goUrlSuffix);
    $('#getedgeinspectlink').attr('href', 'http://adobe.com/go/edgeinspect' + goUrlSuffix);
    $('#buyitnowlink').on('click', function () {
        SkyLabView.trackEvent("Purchase Nag Link Clicked");
        chrome.tabs.create({url: 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix});
    });
    $('#renewlink').on('click', function () {
        chrome.tabs.create({url: 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix});
    });
    $('#ssupgradelink').on('click', function () {
        SkyLabView.trackEvent("Upgrade Link Clicked - Screenshot");
        chrome.tabs.create({url: 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix});
    });
    $('#sdupgradelink').on('click', function () {
        SkyLabView.trackEvent("Upgrade Link Clicked - Second Device");
        chrome.tabs.create({url: 'http://adobe.com/go/edgeinspect_upgrade' + goUrlSuffix});
    });
    $('#dmreauthlink').on('click', function () {
        SkyLabView.trackEvent("Re-auth Link Clicked");
        SkyLabController.retryAuthorization();        
        $("#waitingdiv").show();
        $("#dmerror").hide();
        $("#dmhandshakerejectedwrapper").hide();
        $("#dmhandshakewrapper").show();
    });
        
    BG$(SkyLabController).on("refresh.popup", function (event) {
        refreshDeviceList();
    });
    BG$(SkyLabController).on("appstate.popup", function (event) {
        if (event.state === "dmerror") {
            showDeviceManagerError();
        }
        if (event.state === "dmexpired") {
            showDeviceManagerExpired();
        }
        if (event.state === "dmauthfail") {
            showDeviceManagerAuthFail();
        }
    });
    BG$(SkyLabController).on("passcode_invalid.popup", function (event) {
        showPasscodeInvalid(event.devices);
    });
    BG$(SkyLabController).on("host_info", function (event) {
        showHostInfo();
    });
    BG$(SkyLabController).on("followmode.popup", function (event) {
        setToggleModeImage();
    });
    BG$(SkyLabController).on("transfer_complete.popup", function (event) {
        $("#cancelscreenshotdiv").hide();
        $("#progressdiv").hide();
        $("#completedscreenshotdiv").show();
        SkyLabController.unsetNewScreenshotsFlag();
    });

    BG$(SkyLabController).on("subscriptionexpired.popup", function (event) {
        showWelcomeMessage();
    });
    

    BG$(SkyLabController).on("premiumdevices.popup", function (event) {
        showWelcomeMessage();
    });
    

    BG$(SkyLabController).on("premiumscreenshots.popup", function (event) {
        showWelcomeMessage();
    });
    
    // TODO: Does this belong in the Background page?
    $(function () {
        ASLLocalizer.localize();
        // tweak local links to refer to files in the extension
    });

    if (!showingWelcome) {
        showWaitingOrSyncBrowseOff();
    }
    
    showWelcomeMessage();

    if (SkyLabController.getNewScreenshotsFlag()) {
        // TODO: Add Screenshots Done img
        $("#completedscreenshotdiv").show();
        SkyLabController.unsetNewScreenshotsFlag();
    }

    SkyLabController.updateDeviceManagerSettings();
    setToggleModeImage();
    $("#toggle").bind({
        click:function (ev) {
                if (SkyLabController.isDeviceManagerAlive()) {
                    if (SkyLabController.getFollowMode() === "off") {
                        SkyLabView.trackEvent("Toggle Mode On");
                        SkyLabController.setFollowMode('on');
                        chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
                        var fullscreen = (chrome.extension.getBackgroundPage().isFullScreen) ? "true" : "false";
                        SkyLabController.followUrl(tab[0].url, [], fullscreen);
                    });
                } else {
                    SkyLabView.trackEvent("Toggle Mode Off");
                    SkyLabController.setFollowMode('off');
                }
            }
        },
        keydown:function (ev) {
            if (ev.keyCode === 32) {
                $(this).not(':disabled').click();
            }
        }});

    $("#welcomeaction").click(function () {
        var props = {
            "url"     :  "http://adobe.com/go/edgeinspect",
            "focused" : true,
            "type"    : "popup"
        };
        
        chrome.windows.create(props);
        
        $("#welcomeDiv").hide();
        $("#screenshot").show();
        $("#forcerefresh").show();
        $("#togglechrome").show();
        $("#screenshotfolder").show();
        $("#machineinfoheader").show();
        
        showingWelcome = false;
        refreshDeviceList();
    });

    $('#feedback').click(function (ev) {
        // Take this out to put the panel in the Feedback pane
        SkyLabView.trackEvent("Show Survey Link Clicked");
        SkyLabController.showSurvey();
    });
    
    // Handle the screenshot widget
    $('#screenshot').click(function (ev) {
        if (!$(this).attr('disabled') && SkyLabController.isFeatureEnabled('screenshot')) {
            SkyLabView.trackEvent("Screenshot Icon Clicked");
            SkyLabController.screenshot();
            $("#completedscreenshotdiv").hide();
            $("#cancelscreenshotdiv").show();
            $("#progressdiv").show();
        } else if (!SkyLabController.isFeatureEnabled('screenshot')) {
            SkyLabController.setShowScreenshotsArePremium(true);
            showWelcomeMessage();
        }
    });
    // Handle the screenshot folder widget
    $('#screenshotfolder').click(function (ev) {
        if (!$(this).attr('disabled')) {
            SkyLabView.trackEvent("Open Screenshot Folder Clicked");
            SkyLabController.openScreenshotFolder();
            SkyLabController.unsetNewScreenshotsFlag();
        }
    });
    // Handle the refresh widget
    $('#forcerefresh').click(function (ev) {
        if (!$(this).attr('disabled')) {
            SkyLabView.trackEvent("Refresh Icon Clicked");
            SkyLabController.forcerefresh();
        }
    });
    $('#togglechrome').click(function (ev) {
        if (!$(this).attr('disabled')) {
            if (chrome.extension.getBackgroundPage().isFullScreen === true) {
                SkyLabView.trackEvent("Show Chrome Icon Clicked");
                chrome.extension.getBackgroundPage().isFullScreen = false;
            } else {
                SkyLabView.trackEvent("Full Screen Icon Clicked");
                chrome.extension.getBackgroundPage().isFullScreen = true;
            }
            setFullScreenImage();
            SkyLabController.fullscreen(chrome.extension.getBackgroundPage().isFullScreen);
        }
    });
    // Handle the cancel widget
    $('#cancelscreenshot').click(function (ev) {
        $("#cancelscreenshotdiv").hide();
        $("#progressdiv").hide();
        SkyLabView.trackEvent("Cancel Screenshot Clicked");
        SkyLabController.cancelscreenshot();
    });
    $('#completedscreenshot').click(function (ev) {
        $("#completedscreenshotdiv").hide();
        $('#screenshotfolder').trigger('click');
    });
    $('#remove').click(function (ev) {
        $("#submenuoverlay").slideToggle('fast', submenuoverlay_slideToggleCallback);
        $("#mainpanel").hide();
        $("#removepanel").show();
        $('#removetopbar').attr('tabindex','-1').focus().removeAttr('tabindex');
    });
    $("#removeback").click(function (ev) {
        $("#removepanel").hide();
        $("#mainpanel").show();
        $('#topbarleft').attr('tabindex','-1').focus().removeAttr('tabindex');
    });
    $("#logo").click(function (ev) {
        $("#submenuoverlay").slideToggle('fast', submenuoverlay_slideToggleCallback);
    }).keydown(function (ev) {
        switch(ev.keyCode)
            {
                case 13:
                case 32:
                    $('#submenuoverlay').slideToggle('fast', submenuoverlay_slideToggleCallback);
                    break;
                case 27:
                case 38:
                    if($('#submenuoverlay').is(':visible'))
                    {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        $('#submenuoverlay').stop().slideUp('fast', submenuoverlay_slideToggleCallback);
                    }
                    break;
                case 40:
                    if(!$('#submenuoverlay').is(':visible'))
                    {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        $('#submenuoverlay').stop().slideDown('fast', submenuoverlay_slideToggleCallback);
                    }
                    break;
            }
    }).blur(function (ev) {
		$(this).removeClass('init');
	});
    showHostInfo();
    // TODO: Only add this if we're showing that event.
    $("#periodicsurvey").click(function (ev) {
        SkyLabView.trackEvent("Survey Reminder Link Clicked");
        SkyLabController.showSurvey();
        SkyLabController.dismissSurveyReminder();
    });
    $('#shadmessage-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});
    $('#subscriptionexpiredwrapper-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});
    $('#screenshotsarepremiumwrapper-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});
    $('#seconddeviceispremiumwrapper-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});
    $('#periodicsurveywrapper-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});
    $('#buyitnowwrapper-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});
    $('#dmupdatewrapper-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});
    $('#dmhandshakewrapper-remove').attr({'title':chrome.i18n.getMessage('remove_tt'),'aria-label':chrome.i18n.getMessage('remove_tt')});    
    $('#removebackimg').attr({'title':chrome.i18n.getMessage('disconnect_tt'),'aria-label':chrome.i18n.getMessage('disconnect_tt')});
    $('#progress').attr({'title':chrome.i18n.getMessage('progress_tt'),'aria-label':chrome.i18n.getMessage('progress_tt')});
    $('#screenshotfolder').attr({'title':chrome.i18n.getMessage('screenshotfolder_tt'),'aria-label':chrome.i18n.getMessage('screenshotfolder_tt')});
    $('#screenshot').attr({'title':chrome.i18n.getMessage('screenshot_tt'),'aria-label':chrome.i18n.getMessage('screenshot_tt')});
    $('#forcerefresh').attr({'title':chrome.i18n.getMessage('forcerefresh_tt'),'aria-label':chrome.i18n.getMessage('forcerefresh_tt')});
    $('#toggle').attr({'title':chrome.i18n.getMessage('browsingoff_tt'),'aria-label':chrome.i18n.getMessage('browsingoff_tt')});
    setToggleModeImage();
    setFullScreenImage();
});

$(window).unload(function (event) {
    BG$(SkyLabController).off(".popup");
});

setTimeout(refreshDeviceList, 100);
