$(document).ready(function (ev) {
  $("#qunit").click(function (ev) {
    $(location).attr("href", chrome.extension.getURL("UnitTests/unittest.html"));
  });
  $("#jasmine").click(function (ev) {
    $(location).attr("href", chrome.extension.getURL("UnitTests/SpecRunner.html"));
  });
  $("#resetfirstrun").click(function(ev) {
    localStorage.removeItem("runbefore");
    $("#status").text("Reset the first run flag");
  });
  var hostinfo = chrome.extension.getBackgroundPage().SkyLabController.getDeviceManagerInfo();
  $("#shadowrev").text(hostinfo.build);
  $("#saveoptions").click(function (ev) {
    localStorage["protocol"] = document.getElementById("protocol").value;
    localStorage["host"] = document.getElementById("host").value;
    localStorage["port"] = document.getElementById("port").value;
  });
    $("#extensionid").text(chrome.extension.getURL("UnitTests/driver.html"));
    $("#localStorage").append('protocol : '  + localStorage.getItem('protocol') + '<br />' +
                            'host : '      + localStorage.getItem('host') + '<br />' +
                            'port : '      + localStorage.getItem('port') + '<br />' +
                            'runbefore : ' + localStorage.getItem('runbefore') + '<br />' +
                            'uuid : '      + localStorage.getItem('uuid') + '<br />' +
                            'dmversion : ' + localStorage.getItem('dmmsgversion') + '<br />' +
                            'dmconnections: '           + localStorage.getItem('dmconnections') + '<br />' + 
                            'surveyreminderdismissed: ' + localStorage.getItem('surveyreminderdismissed') + '<br />' +
                            '<br />');
    });
