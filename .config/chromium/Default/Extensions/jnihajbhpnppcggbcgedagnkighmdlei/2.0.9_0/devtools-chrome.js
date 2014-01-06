// Generated by CoffeeScript 1.3.3
var ChromeDevTools, DevTools,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DevTools = (function() {

  function DevTools() {}

  DevTools.prototype.resourceAdded = function(resource) {
    console.log("LiveReload.resourceAdded: " + resource.url);
    return this.send('resourceAdded', {
      url: resource.url
    });
  };

  DevTools.prototype.resourceUpdated = function(resource, content) {
    console.log("LiveReload.resourceUpdated: %s - %s", resource.url, content);
    return this.send('resourceUpdated', {
      url: resource.url,
      content: content
    });
  };

  return DevTools;

})();

ChromeDevTools = (function(_super) {

  __extends(ChromeDevTools, _super);

  function ChromeDevTools() {
    return ChromeDevTools.__super__.constructor.apply(this, arguments);
  }

  ChromeDevTools.prototype.send = function(message, data) {
    return chrome.extension.sendRequest([message, data]);
  };

  return ChromeDevTools;

})(DevTools);

(function() {
  var devTools;
  devTools = new ChromeDevTools();
  chrome.devtools.inspectedWindow.onResourceAdded.addListener(function(resource) {
    return devTools.resourceAdded(resource);
  });
  return chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(function(resource, content) {
    return devTools.resourceUpdated(resource, content);
  });
})();
