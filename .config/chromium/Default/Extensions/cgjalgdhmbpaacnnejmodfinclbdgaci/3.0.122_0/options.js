// Generated by CoffeeScript 1.6.1
(function() {
  var initOptionsPage, optionChanged, script, settings, style;

  settings = chrome.extension.getBackgroundPage().syntaxtic.settings;

  console.log(settings);

  style = document.createElement('link');

  style.type = 'text/css';

  style.id = 'theme-style';

  style.rel = "stylesheet";

  style.href = chrome.extension.getURL("styles/" + settings.theme);

  document.head.appendChild(style);

  style = document.createElement('link');

  style.type = 'text/css';

  style.id = 'theme-style';

  style.rel = "stylesheet";

  style.href = chrome.extension.getURL("styles/shCore.css");

  document.head.appendChild(style);

  style = document.createElement('link');

  style.type = 'text/css';

  style.id = 'theme-style';

  style.rel = "stylesheet";

  style.href = chrome.extension.getURL("styles/shCore.css");

  document.head.appendChild(style);

  script = document.createElement('script');

  script.src = chrome.extension.getURL("scripts/shCore.js");

  script.type = 'text/javascript';

  document.head.appendChild(script);

  script = document.createElement('script');

  script.src = chrome.extension.getURL("scripts/shBrushCSharp.js");

  script.type = 'text/javascript';

  document.head.appendChild(script);

  optionChanged = function() {
    settings.theme = document.getElementById('themeSelect').value;
    settings.fontSize = document.getElementById('fontSizeSelect').value;
    settings.fontFamily = document.getElementById('fontFamilySelect').value;
    document.getElementById('theme-style').href = chrome.extension.getURL("styles/" + settings.theme);
    style = document.getElementById('fontOverride');
    style.innerHTML = ".syntaxhighlighter, .syntaxhighlighter code, .syntaxhighlighter div {\n    font-size: " + settings.fontSize + " !important;\n    font-family: '" + settings.fontFamily + "' !important;\n  }\n";
    return style.innerHTML += ".syntaxhighlighter select {background-color: white !important;}";
  };

  initOptionsPage = function() {
    document.getElementById('themeSelect').value = settings.theme;
    document.getElementById('fontSizeSelect').value = settings.fontSize;
    return document.getElementById('fontFamilySelect').value = settings.fontFamily;
  };

  document.addEventListener('DOMContentLoaded', function() {
    [].forEach.call(document.querySelectorAll('select'), function(el) {
      return el.addEventListener('change', optionChanged);
    });
    initOptionsPage();
    return optionChanged();
  });

}).call(this);
