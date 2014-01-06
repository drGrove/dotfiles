(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    
    require.define = function (filename, fn) {
        if (require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            return require(file, dirname);
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = { exports : {} };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process
            );
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};
});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();
});

require.define("/global.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var CannotConnectAlert, ExtVersion, LiveReloadGlobal, Status, TabState, TheWebSocket;

  ExtVersion = '2.0.9';

  Status = {
    unavailable: {
      buttonEnabled: false,
      buttonToolTip: 'LiveReload not available on this tab',
      buttonIcon: 'IconUnavailable.png'
    },
    disabled: {
      buttonEnabled: true,
      buttonToolTip: 'Enable LiveReload',
      buttonIcon: 'IconDisabled.png'
    },
    enabled: {
      buttonEnabled: true,
      buttonToolTip: 'LiveReload is connecting, click to disable',
      buttonIcon: 'IconEnabled.png'
    },
    active: {
      buttonEnabled: true,
      buttonToolTip: 'LiveReload is connected, click to disable',
      buttonIcon: 'IconActive.png'
    }
  };

  TabState = (function() {

    function TabState(tab) {
      this.tab = tab;
      this.enabled = false;
      this.active = false;
    }

    TabState.prototype.enable = function() {
      return this.send('enable', {
        useFallback: this.useFallback,
        scriptURI: this.bundledScriptURI(),
        host: LiveReloadGlobal.host,
        port: LiveReloadGlobal.port
      });
    };

    TabState.prototype.disable = function() {
      return this.send('disable');
    };

    TabState.prototype.updateStatus = function(status) {
      if (status.initial) {
        if (!status.enabled) {
          this.active = false;
          if (this.enabled) {
            this.enable();
          }
          return;
        }
      }
      if (status.enabled != null) {
        this.enabled = status.enabled;
      }
      if (status.active != null) {
        return this.active = status.active;
      }
    };

    TabState.prototype.status = function() {
      switch (false) {
        case !this.active:
          return Status.active;
        case !this.enabled:
          return Status.enabled;
        default:
          return Status.disabled;
      }
    };

    TabState.prototype.alert = function(message) {
      return this.send('alert', message);
    };

    return TabState;

  })();

  if (navigator.userAgent.match(/Mac OS X/)) {
    CannotConnectAlert = "Could not connect to LiveReload server. Please make sure that LiveReload 2.3 (or later) or another compatible server is running.";
  } else {
    CannotConnectAlert = "Could not connect to LiveReload server. Please make sure that a compatible LiveReload server is running. (We recommend guard-livereload, until LiveReload 2 comes to your platform.)";
  }

  TheWebSocket = typeof WebSocket !== "undefined" && WebSocket !== null ? WebSocket : MozWebSocket;

  LiveReloadGlobal = {
    _tabs: [],
    initialize: function() {
      this.host = '127.0.0.1';
      return this.port = 35729;
    },
    killZombieTabs: function() {
      var tabState;
      return this._tabs = (function() {
        var _i, _len, _ref, _results;
        _ref = this._tabs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tabState = _ref[_i];
          if (this.isAvailable(tabState.tab)) {
            _results.push(tabState);
          }
        }
        return _results;
      }).call(this);
    },
    killZombieTab: function(tab) {
      var index, tabState, _i, _len, _ref;
      _ref = this._tabs;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        tabState = _ref[index];
        if (tabState.tab === tab) {
          this._tabs.splice(index, 1);
          return;
        }
      }
    },
    findState: function(tab, create) {
      var state, tabState, _i, _len, _ref;
      if (create == null) {
        create = false;
      }
      _ref = this._tabs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tabState = _ref[_i];
        if (tabState.tab === tab) {
          return tabState;
        }
      }
      if (create) {
        state = new TabState(tab);
        this._tabs.push(state);
        return state;
      } else {
        return null;
      }
    },
    toggle: function(tab) {
      var state,
        _this = this;
      if (this.isAvailable(tab)) {
        state = this.findState(tab, true);
        if (state.enabled) {
          state.disable();
          if (!this.areAnyTabsEnabled()) {
            return this.afterDisablingLast();
          }
        } else {
          if (this.areAnyTabsEnabled()) {
            state.useFallback = this.useFallback;
            return state.enable();
          } else {
            return this.beforeEnablingFirst(function(err) {
              if (err) {
                switch (err) {
                  case 'cannot-connect':
                    return state.alert(CannotConnectAlert);
                  case 'cannot-download':
                    return state.alert("Cannot download livereload.js");
                }
              } else {
                state.useFallback = _this.useFallback;
                return state.enable();
              }
            });
          }
        }
      }
    },
    tabStatus: function(tab) {
      var _ref;
      if (!this.isAvailable(tab)) {
        return Status.unavailable;
      }
      return ((_ref = this.findState(tab)) != null ? _ref.status() : void 0) || Status.disabled;
    },
    updateStatus: function(tab, status) {
      return this.findState(tab, true).updateStatus(status);
    },
    areAnyTabsEnabled: function() {
      var tabState, _i, _len, _ref;
      _ref = this._tabs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tabState = _ref[_i];
        if (tabState.enabled) {
          return true;
        }
      }
      return false;
    },
    beforeEnablingFirst: function(callback) {
      var callbackCalled, failOnTimeout, timeout, ws,
        _this = this;
      this.useFallback = false;
      callbackCalled = false;
      failOnTimeout = function() {
        console.log("Haven't received a handshake reply in time, disconnecting.");
        return ws.close();
      };
      timeout = setTimeout(failOnTimeout, 1000);
      console.log("Connecting to ws://" + this.host + ":" + this.port + "/livereload...");
      ws = new TheWebSocket("ws://" + this.host + ":" + this.port + "/livereload");
      ws.onerror = function() {
        console.log("Web socket error.");
        if (!callbackCalled) {
          callback('cannot-connect');
        }
        return callbackCalled = true;
      };
      ws.onopen = function() {
        console.log("Web socket connected, sending handshake.");
        return ws.send(JSON.stringify({
          command: 'hello',
          protocols: ['http://livereload.com/protocols/connection-check-1']
        }));
      };
      ws.onclose = function() {
        console.log("Web socket disconnected.");
        if (!callbackCalled) {
          callback('cannot-connect');
        }
        return callbackCalled = true;
      };
      return ws.onmessage = function(event) {
        var xhr;
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = null;
        console.log("Incoming message: " + event.data);
        if (event.data.match(/^!!/)) {
          _this.useFallback = true;
          if (!callbackCalled) {
            callback(null);
          }
          callbackCalled = true;
          return ws.close();
        } else if (event.data.match(/^\{/)) {
          xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
              _this.script = xhr.responseText;
              if (!callbackCalled) {
                callback(null);
              }
              return callbackCalled = true;
            }
          };
          xhr.onerror = function(event) {
            if (!callbackCalled) {
              callback('cannot-download');
            }
            return callbackCalled = true;
          };
          xhr.open("GET", "http://" + _this.host + ":" + _this.port + "/livereload.js", true);
          return xhr.send(null);
        }
      };
    },
    afterDisablingLast: function() {},
    received: function(eventName, data) {
      var func;
      if (func = this["on " + eventName]) {
        return func.call(this, data);
      }
    },
    'on resourceAdded': function(_arg) {
      var url;
      url = _arg.url;
      return console.log("Resource added: " + url);
    },
    'on resourceUpdated': function(_arg) {
      var content, url;
      url = _arg.url, content = _arg.content;
      return console.log("Resource updated: " + url);
    }
  };

  window.TabState = TabState;

  window.LiveReloadGlobal = LiveReloadGlobal;

}).call(this);
});
require("/global.coffee");
})();
