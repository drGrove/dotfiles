/**
 * @fileoverview Options page.
 */

var defaultRadio;
var links;
var selectable;
var alertSound;
var desktopNotify;
var account;
var saveButton;

function init() {
  defaultRadio = document.gvoice.gcdefault;
  links = document.getElementById('gc-links');
  links.checked = localStorage['linksOff'] ? false : true;

  selectable = document.getElementById('gc-select');
  selectable.checked = localStorage['selectOff'] ? false : true;

  alertSound = document.getElementById('gc-alert');
  alertSound.checked = localStorage['alertOff'] ? false : true;

  desktopNotify = document.getElementById('gc-notify');
  desktopNotify.checked = localStorage['notifyOff'] ? false : true;

  saveButton = document.getElementById("save-button");

  var defaultValue = localStorage['default'] || '2';

  for(var i = 0; i < defaultRadio.length; i++) {
    defaultRadio[i].checked = false;
    if(defaultRadio[i].value == defaultValue) {
      defaultRadio[i].checked = true;
    }
  }

  account = document.getElementById('gc-account');
  account.value = localStorage['account'] || '0';
}

function save() {
  // If account changed then reset all the data.
  if (localStorage['account'] && localStorage['account'] != account.value) {
    localStorage.clear();
  }

  var defaultBvr = '1';
  for(var i = 0; i < defaultRadio.length; i++) {
    if(defaultRadio[i].checked) {
      defaultBvr = defaultRadio[i].value;
    }
  }

  localStorage['default'] = defaultBvr;
  localStorage['linksOff'] = links.checked ? '' : '1';
  localStorage['selectOff'] = selectable.checked ? '' : '1';
  localStorage['alertOff'] = alertSound.checked ? '' : '1';
  localStorage['notifyOff'] = desktopNotify.checked ? '' : '1';
  localStorage['account'] = account.value || '0';

  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 4000);
}

function clearData() {
  if (confirm('Clear data in extension? (includes extension settings)')) {
    localStorage.clear();
    alert('Extension data cleared. Click the extension icon to sync again.');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  init();
  document.getElementById('save-button').addEventListener('click', save);
  document.getElementById('clear-data-button').addEventListener(
      'click', clearData);
});
