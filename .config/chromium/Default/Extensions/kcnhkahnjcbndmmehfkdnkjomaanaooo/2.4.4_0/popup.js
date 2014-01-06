/**
 * @fileoverview Runner from popup.
 */
document.addEventListener('DOMContentLoaded', function () {
  var voicePopup = new VoicePopup();
  document.getElementById('gc-popup-close').addEventListener('click', function() {
    window.close();
  });
  document.getElementById('gc-popup-options').addEventListener('click', function() {
    chrome.tabs.create({url:chrome.extension.getURL('/options.html')});
  });
});


