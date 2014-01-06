/*jslint browser:true, nomen:true */
/*global chrome:true, SkyLabController:true, SkyLabView:true, SkyLab:true, webkitNotifications:true, $:true, s:true, unescape:true, s_code:true, console:true */
"use strict";

var reloadOnFocus = false,
    lastFocusedWindow = -1,
    lastActiveTab = -1,
    activeTabCandidate = -1,
    tabIJustUpdated = 0,
    watchForURLChangeIntervalID = null,
    isFullScreen = false,
    badgeIconOn = "img/x1/badge_on.png",
    badgeIconOff = "img/x1/badge_off.png",
    badgeIconError = "img/x1/badge_error.png";

if (window.devicePixelRatio !== 1) {
    badgeIconOn = "img/x2/badge_on.png";
    badgeIconOff = "img/x2/badge_off.png";
    badgeIconError = "img/x2/badge_error.png";
}

function followOrRemoteInspect(url) {
    var riserver = SkyLabController.getRemoteInspectionServer(),
        deviceList = [],
        shortList = [],
        riexists = false;
    if (SkyLabView.shouldFollowThisUrl(url)) {
        // Determine if the Remote Inspection window is open. If so, send to some devices, remote inspect the active one, otherwise just follow.
        chrome.windows.getAll({}, function (windows) {
            $.each(windows, function (index, value) {
                if (value.id === SkyLabView.riwindow) {
                    riexists = true;
                }
            });
            var fullscreen = (chrome.extension.getBackgroundPage().isFullScreen) ? "true" : "false";
            if (riexists) {
                SkyLabController.setUrl(url);
                deviceList = SkyLabController.getDeviceList();
                if (deviceList.length > 1 && SkyLabController.getFollowMode() === "on") {
                    deviceList.forEach(function (device) {
                        if (device.id !== SkyLabView.ridevice) {
                            shortList.push(device.id);
                        }
                        if (shortList.length > 0) {
                            SkyLabController.followUrl(url, shortList, fullscreen);
                        }
                    });
                }
                SkyLabController.remoteInspect(SkyLabView.ridevice, SkyLabController.getRemoteInspectionServer(), fullscreen);
            } else {
                SkyLabController.followUrl(url, [], fullscreen);
            }
        });
    }
}
// Function to poll the URL bar for changes.
function watchForURLChange() {
    chrome.tabs.query({active : true, currentWindow : true }, function (tab) {
        if (tab[0] && tab[0].windowId !== chrome.windows.WINDOW_ID_NONE && tab[0].windowId !== SkyLabView.riwindow && tab[0].windowId !== SkyLabView.fbwindow) {
            lastActiveTab = tab[0].id;
            if (tab[0].url !== SkyLabController.getUrl()) {
                followOrRemoteInspect(tab[0].url);
            }
        }
    });
}

// One place to look at a tab update event and see if I should send it to the DM.
function handleTabUpdateLogic(tabId) {
    var riexists = false;
    chrome.tabs.get(tabId, function (tab) {
        // We only care about pages that have finished loading, and that are active;
        if (
            (tab.windowId !== SkyLabView.riwindow && tab.windowId !== SkyLabView.fbwindow) &&
                (tab.active === true &&
                (tab.status !== "complete" || (tab.status === "complete" && tab.id !== tabIJustUpdated))
                    )
        ) {
            activeTabCandidate = tab.id;
            chrome.windows.get(tab.windowId, function (parentWindow) {
                if (parentWindow.focused === true) {
                    lastFocusedWindow = parentWindow.id;
                    lastActiveTab = activeTabCandidate;
                    reloadOnFocus = false;
                    tabIJustUpdated = tab.id;
                    followOrRemoteInspect(tab.url);
                } else if (lastActiveTab === activeTabCandidate) {
                    reloadOnFocus = true;
                }
            });
        }
    });
}

// Used to keep my connection alive to the device manager.
function pingDeviceManager() {
    SkyLabController.pingDeviceManager();
}

function tabUpdatedListener(tabId, changedInfo, tab) {
    if (tab.windowId !== SkyLabView.riwindow && tab.windowId !== SkyLabView.fbwindow) {
        handleTabUpdateLogic(tabId);
    }
}

function tabActivatedListener(activeInfo) {
    if (activeInfo.windowId !== SkyLabView.riwindow && activeInfo.windowId !== SkyLabView.fbwindow) {
        handleTabUpdateLogic(activeInfo.tabId);
    }
}

function attachTabWatchers() {
    // This tells Chrome to send the URL to the Controller when it's been changed
    // The controller looks to see if that URL should be sent to the DM.
    if (!chrome.tabs.onUpdated.hasListener(tabUpdatedListener)) {
        chrome.tabs.onUpdated.addListener(tabUpdatedListener);
    }

    // This tells Chrome to send the URL to the Controller when a new tab has been selected
    // The controller looks to see if that URL should be sent to the DM.
    
    if (!chrome.tabs.onActivated.hasListener(tabActivatedListener)) {
        chrome.tabs.onActivated.addListener(tabActivatedListener);
    }

    if (watchForURLChangeIntervalID === null) {
        watchForURLChangeIntervalID = setInterval(watchForURLChange, 500);
    }
}

function detachTabWatchers() {
    clearInterval(watchForURLChangeIntervalID);
    watchForURLChangeIntervalID = null;
    chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
    chrome.tabs.onActivated.removeListener(tabActivatedListener);
}

function initializeExtension() {
    // Open the connection to the DM
    SkyLabController.connectToDeviceManager();
    // Set the initial URL for subsequent pairings
    chrome.tabs.query({active : true, currentWindow : true }, function (tab) {
        SkyLabController.setUrl(tab[0].url);
    });
    
    setInterval(pingDeviceManager, 20000);
      
//    attachScrollListener(); 
}

function attachScrollListener() {
    console.log("begin attachScrollListener");

    chrome.extension.onConnect.addListener(function(port) {

        console.log ("port = " + port.name);
        
        if (port.name == "scroll") {
            port.onDisconnect.addListener(function(port) {        
                console.log("inside onDisconnect handler");
            });
        
            port.onMessage.addListener(function(msg) {
                console.log("inside onMessage handler yPercScroll = " + msg.yPercScroll + " , xPercScroll = " + msg.xPercScroll);
                SkyLabController.scrollBy(msg.xPercScroll, msg.yPercScroll);
            });              
        }
        else if (port.name == "scrollToElement") {
            port.onDisconnect.addListener(function(port) {        
                console.log("inside onDisconnect handler");
            });
        
            port.onMessage.addListener(function(msg) {
                console.log("inside onMessage elementId  = " + msg.theElementId);
                SkyLabController.scrollToElement(msg.theElementId);
            });              
        }
    });
}

// Before we begin we have to prototype some methods into SkyLabView
// Generic method for how we handle toast like notifications that go away on their own.
SkyLabView.toast = function (content) {
    // Revisit toast messages when the WebKit bugs are worked out.
    // var toast = webkitNotifications.createNotification("shadow_beta_48.png", "Edge Inspect CC", content);
    // toast.show();
    return;
};

// Generic method for how we handle toast like notifications that we persist until we cancel.
SkyLabView.toastWithHandle = function () {
    SkyLabView.closeToastWithHandle();
    SkyLabView._toasthandle = webkitNotifications.createHTMLNotification('notification.html');
    SkyLabView._toasthandle.show();
    return;
};

SkyLabView.closeToastWithHandle = function () {
    if (SkyLabView._toasthandle !== "") {
        SkyLabView._toasthandle.cancel();
        SkyLabView._toasthandle = "";
    }
    return;
};

SkyLabView.openRemoteInspection = function (id, server) {
    SkyLabView.trackEvent("Open Remote Inspection");
    var riexists = false,
        newdevice = false;
    if (SkyLabView.ridevice !== id) {
        newdevice = true;
        SkyLabView.ridevice = id;
    }
    chrome.windows.getAll({}, function (windows) {
        $.each(windows, function (index, value) {
            if (value.id === SkyLabView.riwindow) {
                riexists = true;
            }
        });
        var props = {},
            deviceName = "";
		SkyLab._devices.forEach(function (device) {
            if (device.id === id) {
                deviceName = encodeURIComponent(device.name);
            }
        });
                
        if (riexists === true) {
            if (newdevice === true) {
                props = {
                    "url" : server + "client/?devicename=" + deviceName + "#" + id
                };
                chrome.windows.update(SkyLabView.riwindow, {"focused" : true}, function (updatedWindow) {
                    chrome.tabs.update(SkyLabView.ritab, props, function (updatedtab) {
                        //There's no good reason I should have to do this twice.
                        chrome.tabs.update(SkyLabView.ritab, props, function (updatedtab) {});
                    });
                });
            }
        } else {
            props = {
                "url"     : server + "client/?devicename=" + deviceName + "#" + id,
                "focused" : true,
                "type"    : "popup"
            };
            // This initiatingri flag is ghetto, but we need it to ignore the focus change from the RI window
            SkyLabView.initiatingri = true;
            chrome.tabs.query({active : true, currentWindow : true }, function (tab) {
                SkyLabView.risourcetab = tab[0].id;
            });
            chrome.windows.create(props, function (win) {
                SkyLabView.riwindow = win.id;
                $.each(win.tabs, function (index, tab) {
                    if (tab.active === true) {
                        SkyLabView.ritab = tab.id;
                    }
                });
                SkyLabView.initiatingri = false;
            });
        }
    });
};

SkyLabView.openSurvey = function () {
    var fbexists = false;
    chrome.windows.getAll({}, function (windows) {
        $.each(windows, function (index, value) {
            if (value.id === SkyLabView.fbwindow) {
                fbexists = true;
            }
        });
        if (fbexists === true) {
            chrome.windows.remove(SkyLabView.fbwindow, function () {});
        }
        var props = {
            "url"     :  SkyLabController.getSurveyLink(),
            "focused" : true,
            "type"    : "popup"
        };
        SkyLabView.initiatingsv = true;
        chrome.windows.create(props, function (win) {
            SkyLabView.fbwindow = win.id;
            SkyLabView.initiatingsv = false;
        });
    });
};

SkyLabView.setBadgeState = function (state) {
    var badgeDetails = {"text" : state};
    if (state === "+") {
        chrome.browserAction.setBadgeBackgroundColor({"color" : [0, 159, 0, 255]});
        chrome.browserAction.setBadgeText(badgeDetails);
    } else if (state === "-") {
        chrome.browserAction.setBadgeBackgroundColor({"color" : [215, 0, 23, 255]});
        chrome.browserAction.setBadgeText(badgeDetails);
    } else {
        chrome.browserAction.setBadgeBackgroundColor({"color" : [0, 0, 0, 0]});
        chrome.browserAction.setBadgeText(badgeDetails);
    }
};

SkyLabView.triggerFollowModeOn = function () {
    attachTabWatchers();
    if (SkyLabController.isDeviceManagerAlive()) {
        SkyLabView.setBadgeIcon(badgeIconOn);
        $(SkyLabController).trigger({type: "followmode.popup", mode: "on"});
    }
};

SkyLabView.triggerFollowModeOff = function () {
    detachTabWatchers();
    if (SkyLabController.isDeviceManagerAlive()) {
        SkyLabView.setBadgeIcon(badgeIconOff);
        $(SkyLabController).trigger({type: "followmode.popup", mode: "off"});
    }
};

SkyLabView.triggerDeviceDisconnected = function () {
    SkyLabView.setBadgeState("-");
    setTimeout(function () { SkyLabView.setBadgeState(""); }, 5000);
};

SkyLabView.triggerDeviceWantsToPair = function () {
    SkyLabView.setBadgeState("+");
};

SkyLabView.triggerNowPairingDismiss = function () {
    SkyLabView.closeToastWithHandle();
    SkyLabView.setBadgeState("");
};

SkyLabView.setBadgeIcon = function (icon) {
    chrome.browserAction.setIcon({"path" : icon});
};

SkyLabView.triggerDeviceListUpdated = function () {
    $(SkyLabController).trigger({type: "refresh.popup"});
};


SkyLabView.triggerDeviceManagerError = function () {
    SkyLabView.setBadgeIcon(badgeIconError);
    $(SkyLabController).trigger({type: "appstate.popup", state: "dmerror"});
};

SkyLabView.triggerDeviceManagerAuthFail = function () {
    SkyLabView.setBadgeIcon(badgeIconError);
    $(SkyLabController).trigger({type: "appstate.popup", state: "dmauthfail"});
};

SkyLabView.triggerDeviceManagerConnecting = function () {
};

SkyLabView.triggerRemoteInspect = function (devices, server) {
    SkyLabView.openRemoteInspection(devices, server);
};

SkyLabView.triggerFollowUrl = function () {
    chrome.tabs.query({active : true, currentWindow : true }, function (tab) {
        handleTabUpdateLogic(tab[0].id);
    });
};

SkyLabView.triggerPasscodeInvalid = function (devices) {
    $(SkyLabController).trigger({type: "passcode_invalid.popup", devices: devices});
};

SkyLabView.triggerShowHostInfo = function () {
    $(SkyLabController).trigger({type: "host_info.popup"});
};

SkyLabView.transferComplete = function (reqID) {
    SkyLabController.setNewScreenshotsFlag();
    $(SkyLabController).trigger({type: "transfer_complete.popup"});
};

SkyLabView.triggerFirstRunCheck = function () {
    // Check for the First Run
    if (SkyLabController.firstRun()) {
        // Do any first-run stuff here.
        var props = {
            "url" : chrome.extension.getURL("firstrun.html")
        };
        chrome.tabs.create(props);
        SkyLabController.setShowedFirstRun();
    }
};
  
SkyLabView.triggerShowNameChange = function () {
    var props = {
        'url' : 'http://adobe.com/go/edgeinspect_renamed'
    };
    chrome.tabs.create(props);
};
  
SkyLabView.triggerPreferencesUpdated = function () {
    $(SkyLabController).trigger({type: "screenshotfolder.options", folder: SkyLabController.getScreenshotFolder()});
};

SkyLabView.triggerScreenshotFolderError = function (msg) {
    $(SkyLabController).trigger({type: "screenshotfoldererror.options", message: msg});
};

SkyLabView.triggerSubscriptionHasExpiredMessage = function () {
    $(SkyLabController).trigger({type: "subscriptionexpired.popup"});
};

SkyLabView.triggerDevicesArePremium = function () {
    $(SkyLabController).trigger({type: "premiumdevices.popup"});
};

SkyLabView.triggerScreenshotsArePremium = function () {
    $(SkyLabController).trigger({type: "premiumscreenshots.popup"});
};

SkyLabView.trackEvent = function (eventDescription) {
    var s_account   = "mxskylab",
        channel     = "Shadow",
        pageName    = "Shadow: Background",
        server      = "Adobe Shadow",
        prop32      = "en-us",
        imgstr      = "http://stats.adobe.com/b/" +
                           "ss/" + encodeURIComponent(s_account) +
                           "/1/H.24--NS/" + Math.floor(Math.random() * 10000000) +
                           "?pe=lnk_o" +
                           "&ch=" + encodeURIComponent(channel) +
                           "&pageName=" + encodeURIComponent(pageName) +
                           "&pev2=" + encodeURIComponent(eventDescription) +
                           "&server=" + encodeURIComponent(server) +
                           "&c32=" + encodeURIComponent(prop32);
    $.ajax({
        url: imgstr,
        timeout: 5000
    });
};

SkyLabView.shouldFollowThisUrl = function (url) {
    var riserver = SkyLabController.getRemoteInspectionServer(),
        filter = new RegExp("^chrome|^" + riserver + "|^view-source|^file", "ig");
    return (!url.match(filter) && url !== SkyLabController.getSurveyLink());
};

SkyLabView.restoreRemoteInspectionWeAreStillDoingThat = function () {
    chrome.windows.getAll({}, function (windows) {
        $.each(windows, function (index, value) {
            if (value.id === SkyLabView.riwindow) {
                var fullscreen = (chrome.extension.getBackgroundPage().isFullScreen) ? "true" : "false";
                SkyLabController.remoteInspect(SkyLabView.ridevice, SkyLabController.getRemoteInspectionServer(), fullscreen);
            }
        });
    });
};

$(document).ready(function () {
    SkyLabController.triggerFirstRunCheck();
    initializeExtension();
});
