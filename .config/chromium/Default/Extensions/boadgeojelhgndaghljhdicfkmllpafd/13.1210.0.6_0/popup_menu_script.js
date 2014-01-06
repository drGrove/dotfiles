var g;
window.Oc = !0;
chrome.cast = chrome.cast || {};
chrome.cast.media = chrome.cast.media || {};
var aa = aa || {}, k = this, ba = function(a, b) {
  for (var c = a.split("."), d = b || k, e;e = c.shift();) {
    if (null != d[e]) {
      d = d[e];
    } else {
      return null;
    }
  }
  return d;
}, ca = function() {
}, da = function(a) {
  a.Ga = function() {
    return a.jb ? a.jb : a.jb = new a;
  };
}, m = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
}, ea = function(a) {
  var b = m(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
}, n = function(a) {
  return "string" == typeof a;
}, fa = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
}, ga = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
}, p = function(a, b, c) {
  p = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? fa : ga;
  return p.apply(null, arguments);
}, ha = Date.now || function() {
  return+new Date;
}, q = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.fb = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.Nc = function(a, c, f) {
    var h = Array.prototype.slice.call(arguments, 2);
    return b.prototype[c].apply(a, h);
  };
};
Function.prototype.bind = Function.prototype.bind || function(a, b) {
  if (1 < arguments.length) {
    var c = Array.prototype.slice.call(arguments, 1);
    c.unshift(this, a);
    return p.apply(null, c);
  }
  return p(this, a);
};
var ia = function(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
}, pa = function(a, b) {
  if (b) {
    return a.replace(ja, "&amp;").replace(ka, "&lt;").replace(la, "&gt;").replace(ma, "&quot;").replace(na, "&#39;");
  }
  if (!oa.test(a)) {
    return a;
  }
  -1 != a.indexOf("&") && (a = a.replace(ja, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(ka, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(la, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(ma, "&quot;"));
  -1 != a.indexOf("'") && (a = a.replace(na, "&#39;"));
  return a;
}, ja = /&/g, ka = /</g, la = />/g, ma = /"/g, na = /'/g, oa = /[&<>"']/, sa = function(a, b) {
  for (var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;0 == c && h < f;h++) {
    var l = d[h] || "", gb = e[h] || "", qa = RegExp("(\\d*)(\\D*)", "g"), Yb = RegExp("(\\d*)(\\D*)", "g");
    do {
      var K = qa.exec(l) || ["", "", ""], L = Yb.exec(gb) || ["", "", ""];
      if (0 == K[0].length && 0 == L[0].length) {
        break;
      }
      c = ra(0 == K[1].length ? 0 : parseInt(K[1], 10), 0 == L[1].length ? 0 : parseInt(L[1], 10)) || ra(0 == K[2].length, 0 == L[2].length) || ra(K[2], L[2]);
    } while (0 == c);
  }
  return c;
}, ra = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
var ta = /<[^>]*>|&[^;]+;/g, ua = function(a, b) {
  return b ? a.replace(ta, "") : a;
}, va = RegExp("[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]"), wa = RegExp("^[^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]*[\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc]"), xa = /^http:\/\/.*/, ya = /\s+/, za = /\d/;
var r = function(a) {
  this.Hc = "number" == typeof a ? 0 < a ? 1 : 0 > a ? -1 : null : null == a ? null : a ? -1 : 1;
};
r.prototype.Cc = function(a, b) {
  for (var c = 0, d = 0, e = !1, f = ua(a, b).split(ya), h = 0;h < f.length;h++) {
    var l = f[h];
    wa.test(ua(l, void 0)) ? (c++, d++) : xa.test(l) ? e = !0 : va.test(ua(l, void 0)) ? d++ : za.test(l) && (e = !0);
  }
  return 0 == d ? e ? 1 : 0 : 0.4 < c / d ? -1 : 1;
};
r.prototype.mc = function(a, b) {
  return this.Dc(this.Cc(a, b));
};
r.prototype.Dc = function(a) {
  return-1 == (0 == a ? this.Hc : a) ? "rtl" : "ltr";
};
if ("undefined" != typeof angular) {
  var Aa = angular.module("chrome_i18n", []);
  chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().default_locale && Aa.directive("angularMessage", function() {
    return{restrict:"E", transclude:"element", replace:!0, controller:["$scope", function(a) {
      this.qa = this.ra = null;
      a.dirForText = p(function(a) {
        this.ra || (this.ra = chrome.i18n.getMessage("@@bidi_dir") || "ltr");
        this.qa || (this.qa = new r("rtl" == this.ra));
        return this.qa.mc(a || "");
      }, this);
    }], compile:function(a, b) {
      var c = b.key, d = null, e = document.createElement("amr");
      c && !c.match(/^\d+$/) && (c = chrome.i18n.getMessage(c), null == c && e.setAttribute("id", "missing"));
      if (c) {
        var f = chrome.i18n.getMessage(c + "_ph"), d = [];
        if (null != f) {
          for (d = f.split("\ue000"), f = 0;f < d.length;++f) {
            d[f] = d[f].replace(/^{{(.*)}}$/, '<amrp dir="{{dirForText($1)}}">{{$1}}</amrp>');
          }
        }
        d = chrome.i18n.getMessage(c, d);
      } else {
        e.setAttribute("r", "nokey");
      }
      d ? e.innerHTML = d : (e.setAttribute("tl", "false"), e.innerHTML = a.html());
      a.replaceWith(e);
    }};
  });
}
;var s = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, s) : this.stack = Error().stack || "";
  a && (this.message = String(a));
};
q(s, Error);
s.prototype.name = "CustomError";
var Ba = function(a, b) {
  b.unshift(a);
  s.call(this, ia.apply(null, b));
  b.shift();
};
q(Ba, s);
Ba.prototype.name = "AssertionError";
var t = function(a, b, c) {
  if (!a) {
    var d = Array.prototype.slice.call(arguments, 2), e = "Assertion failed";
    if (b) {
      var e = e + (": " + b), f = d
    }
    throw new Ba("" + e, f || []);
  }
  return a;
}, Ca = function(a, b) {
  throw new Ba("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
};
var u = Array.prototype, Da = u.indexOf ? function(a, b, c) {
  t(null != a.length);
  return u.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (n(a)) {
    return n(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
}, Ea = u.forEach ? function(a, b, c) {
  t(null != a.length);
  u.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = n(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a);
  }
}, Fa = function(a, b, c) {
  var d = 0;
  Ea(a, function(a, f, h) {
    b.call(c, a, f, h) && ++d;
  }, c);
  return d;
}, v = function(a, b, c) {
  t: {
    for (var d = a.length, e = n(a) ? a.split("") : a, f = 0;f < d;f++) {
      if (f in e && b.call(c, e[f], f, a)) {
        b = f;
        break t;
      }
    }
    b = -1;
  }
  return 0 > b ? null : n(a) ? a.charAt(b) : a[b];
}, Ha = function(a, b) {
  var c = Da(a, b), d;
  (d = 0 <= c) && Ga(a, c);
  return d;
}, Ga = function(a, b) {
  t(null != a.length);
  return 1 == u.splice.call(a, b, 1).length;
}, Ia = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d];
    }
    return c;
  }
  return[];
}, Ja = function(a, b, c) {
  t(null != a.length);
  return 2 >= arguments.length ? u.slice.call(a, b) : u.slice.call(a, b, c);
}, La = function(a, b) {
  t(null != a.length);
  u.sort.call(a, b || Ka);
}, Ka = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
var Ma = "StopIteration" in k ? k.StopIteration : Error("StopIteration"), Na = function() {
};
Na.prototype.next = function() {
  throw Ma;
};
Na.prototype.Fc = function() {
  return this;
};
var Oa = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return!0;
    }
  }
  return!1;
}, Pa = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
}, Qa = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = d;
  }
  return b;
}, Ra = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), Sa = function(a, b) {
  for (var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0;f < Ra.length;f++) {
      c = Ra[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
};
var w = function(a, b) {
  this.h = {};
  this.e = [];
  this.D = this.l = 0;
  var c = arguments.length;
  if (1 < c) {
    if (c % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1]);
    }
  } else {
    a && this.Pb(a);
  }
};
w.prototype.la = function() {
  return this.l;
};
w.prototype.$ = function() {
  this.F();
  for (var a = [], b = 0;b < this.e.length;b++) {
    a.push(this.h[this.e[b]]);
  }
  return a;
};
w.prototype.P = function() {
  this.F();
  return this.e.concat();
};
w.prototype.equals = function(a, b) {
  if (this === a) {
    return!0;
  }
  if (this.l != a.la()) {
    return!1;
  }
  var c = b || Ta;
  this.F();
  for (var d, e = 0;d = this.e[e];e++) {
    if (!c(this.get(d), a.get(d))) {
      return!1;
    }
  }
  return!0;
};
var Ta = function(a, b) {
  return a === b;
};
g = w.prototype;
g.clear = function() {
  this.h = {};
  this.D = this.l = this.e.length = 0;
};
g.remove = function(a) {
  return Object.prototype.hasOwnProperty.call(this.h, a) ? (delete this.h[a], this.l--, this.D++, this.e.length > 2 * this.l && this.F(), !0) : !1;
};
g.F = function() {
  if (this.l != this.e.length) {
    for (var a = 0, b = 0;a < this.e.length;) {
      var c = this.e[a];
      Object.prototype.hasOwnProperty.call(this.h, c) && (this.e[b++] = c);
      a++;
    }
    this.e.length = b;
  }
  if (this.l != this.e.length) {
    for (var d = {}, b = a = 0;a < this.e.length;) {
      c = this.e[a], Object.prototype.hasOwnProperty.call(d, c) || (this.e[b++] = c, d[c] = 1), a++;
    }
    this.e.length = b;
  }
};
g.get = function(a, b) {
  return Object.prototype.hasOwnProperty.call(this.h, a) ? this.h[a] : b;
};
g.set = function(a, b) {
  Object.prototype.hasOwnProperty.call(this.h, a) || (this.l++, this.e.push(a), this.D++);
  this.h[a] = b;
};
g.Pb = function(a) {
  var b;
  a instanceof w ? (b = a.P(), a = a.$()) : (b = Qa(a), a = Pa(a));
  for (var c = 0;c < b.length;c++) {
    this.set(b[c], a[c]);
  }
};
g.clone = function() {
  return new w(this);
};
g.Fc = function(a) {
  this.F();
  var b = 0, c = this.e, d = this.h, e = this.D, f = this, h = new Na;
  h.next = function() {
    for (;;) {
      if (e != f.D) {
        throw Error("The map has changed since the iterator was created");
      }
      if (b >= c.length) {
        throw Ma;
      }
      var h = c[b++];
      return a ? h : d[h];
    }
  };
  return h;
};
var Ua = function(a) {
  if ("function" == typeof a.$) {
    return a.$();
  }
  if (n(a)) {
    return a.split("");
  }
  if (ea(a)) {
    for (var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d]);
    }
    return b;
  }
  return Pa(a);
}, Va = function(a, b, c) {
  if ("function" == typeof a.forEach) {
    a.forEach(b, c);
  } else {
    if (ea(a) || n(a)) {
      Ea(a, b, c);
    } else {
      var d;
      if ("function" == typeof a.P) {
        d = a.P();
      } else {
        if ("function" != typeof a.$) {
          if (ea(a) || n(a)) {
            d = [];
            for (var e = a.length, f = 0;f < e;f++) {
              d.push(f);
            }
          } else {
            d = Qa(a);
          }
        } else {
          d = void 0;
        }
      }
      for (var e = Ua(a), f = e.length, h = 0;h < f;h++) {
        b.call(c, e[h], d && d[h], a);
      }
    }
  }
};
var x, Wa, Xa, Ya, y = function() {
  return k.navigator ? k.navigator.userAgent : null;
};
Ya = Xa = Wa = x = !1;
var z;
if (z = y()) {
  var Za = k.navigator;
  x = 0 == z.lastIndexOf("Opera", 0);
  Wa = !x && (-1 != z.indexOf("MSIE") || -1 != z.indexOf("Trident"));
  Xa = !x && -1 != z.indexOf("WebKit");
  Ya = !x && !Xa && !Wa && "Gecko" == Za.product;
}
var $a = x, A = Wa, B = Ya, C = Xa, ab = function() {
  var a = k.document;
  return a ? a.documentMode : void 0;
}, bb;
t: {
  var cb = "", D;
  if ($a && k.opera) {
    var db = k.opera.version, cb = "function" == typeof db ? db() : db
  } else {
    if (B ? D = /rv\:([^\);]+)(\)|;)/ : A ? D = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : C && (D = /WebKit\/(\S+)/), D) {
      var eb = D.exec(y()), cb = eb ? eb[1] : ""
    }
  }
  if (A) {
    var fb = ab();
    if (fb > parseFloat(cb)) {
      bb = String(fb);
      break t;
    }
  }
  bb = cb;
}
var hb = bb, ib = {}, E = function(a) {
  return ib[a] || (ib[a] = 0 <= sa(hb, a));
}, jb = k.document, kb = jb && A ? ab() || ("CSS1Compat" == jb.compatMode ? parseInt(hb, 10) : 5) : void 0;
var mb = function(a, b) {
  try {
    var c;
    var d = ba("window.location.href");
    if (n(a)) {
      c = {message:a, name:"Unknown error", lineNumber:"Not available", fileName:d, stack:"Not available"};
    } else {
      var e, f, h = !1;
      try {
        e = a.lineNumber || a.Pc || "Not available";
      } catch (l) {
        e = "Not available", h = !0;
      }
      try {
        f = a.fileName || a.filename || a.sourceURL || k.$googDebugFname || d;
      } catch (gb) {
        f = "Not available", h = !0;
      }
      c = !h && a.lineNumber && a.fileName && a.stack && a.message && a.name ? a : {message:a.message || "Not available", name:a.name || "UnknownError", lineNumber:e, fileName:f, stack:a.stack || "Not available"};
    }
    return "Message: " + pa(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + pa(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + pa(lb(b) + "-> ");
  } catch (qa) {
    return "Exception trying to expose exception! You win, we lose. " + qa;
  }
}, lb = function(a) {
  return nb(a || arguments.callee.caller, []);
}, nb = function(a, b) {
  var c = [];
  if (0 <= Da(b, a)) {
    c.push("[...circular reference...]");
  } else {
    if (a && 50 > b.length) {
      c.push(ob(a) + "(");
      for (var d = a.arguments, e = 0;e < d.length;e++) {
        0 < e && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = ob(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f;
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f);
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(nb(a.caller, b));
      } catch (h) {
        c.push("[exception trying to get caller]\n");
      }
    } else {
      a ? c.push("[...long stack...]") : c.push("[end]");
    }
  }
  return c.join("");
}, ob = function(a) {
  if (F[a]) {
    return F[a];
  }
  a = String(a);
  if (!F[a]) {
    var b = /function ([^\(]+)/.exec(a);
    F[a] = b ? b[1] : "[Anonymous]";
  }
  return F[a];
}, F = {};
var pb = function(a, b, c, d, e) {
  this.reset(a, b, c, d, e);
};
pb.prototype.oa = null;
pb.prototype.na = null;
var qb = 0;
g = pb.prototype;
g.reset = function(a, b, c, d, e) {
  "number" == typeof e || qb++;
  this.gc = d || ha();
  this.p = a;
  this.ec = b;
  this.dc = c;
  delete this.oa;
  delete this.na;
};
g.Qa = function() {
  return this.dc;
};
g.Ub = function() {
  return this.oa;
};
g.oc = function(a) {
  this.oa = a;
};
g.Vb = function() {
  return this.na;
};
g.pc = function(a) {
  this.na = a;
};
g.ka = function() {
  return this.p;
};
g.da = function(a) {
  this.p = a;
};
g.getMessage = function() {
  return this.ec;
};
g.Ra = function() {
  return this.gc;
};
var rb = function() {
  t(!0, "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear();
}, sb;
rb.prototype.lc = function(a, b, c) {
  var d = (this.cb + 1) % 5E3;
  this.cb = d;
  if (this.eb) {
    return d = this.bb[d], d.reset(a, b, c), d;
  }
  this.eb = 4999 == d;
  return this.bb[d] = new pb(a, b, c);
};
rb.prototype.clear = function() {
  this.bb = Array(5E3);
  this.cb = -1;
  this.eb = !1;
};
var G = function(a) {
  this.gb = a;
};
G.prototype.Z = null;
G.prototype.p = null;
G.prototype.sa = null;
G.prototype.t = null;
var H = function(a, b) {
  this.name = a;
  this.value = b;
};
H.prototype.toString = function() {
  return this.name;
};
var tb = new H("SHOUT", 1200), ub = new H("SEVERE", 1E3), vb = new H("WARNING", 900), wb = new H("INFO", 800), xb = new H("CONFIG", 700), yb = new H("FINE", 500), zb = new H("FINER", 400);
g = G.prototype;
g.getName = function() {
  return this.gb;
};
g.jc = function(a) {
  this.t || (this.t = []);
  this.t.push(a);
};
g.kc = function(a) {
  var b = this.t;
  return!!b && Ha(b, a);
};
g.getParent = function() {
  return this.Z;
};
g.getChildren = function() {
  this.sa || (this.sa = {});
  return this.sa;
};
g.da = function(a) {
  this.p = a;
};
g.ka = function() {
  return this.p;
};
g.ab = function() {
  if (this.p) {
    return this.p;
  }
  if (this.Z) {
    return this.Z.ab();
  }
  Ca("Root logger has no level set.");
  return null;
};
g.wc = function(a) {
  return a.value >= this.ab().value;
};
g.log = function(a, b, c) {
  this.wc(a) && ("function" == m(b) && (b = b()), this.tc(this.uc(a, b, c)));
};
g.uc = function(a, b, c) {
  sb || (sb = new rb);
  var d = sb.lc(a, b, this.gb);
  c && (d.oc(c), d.pc(mb(c, arguments.callee.caller)));
  return d;
};
g.Ma = function(a, b) {
  this.log(ub, a, b);
};
g.Ob = function(a, b) {
  this.log(vb, a, b);
};
g.info = function(a, b) {
  this.log(wb, a, b);
};
g.config = function(a, b) {
  this.log(xb, a, b);
};
g.Wa = function(a, b) {
  this.log(yb, a, b);
};
g.Zb = function(a, b) {
  this.log(zb, a, b);
};
g.tc = function(a) {
  var b = "log:" + a.getMessage();
  k.console && (k.console.timeStamp ? k.console.timeStamp(b) : k.console.markTimeline && k.console.markTimeline(b));
  k.msWriteProfilerMark && k.msWriteProfilerMark(b);
  for (b = this;b;) {
    b.Gc(a), b = b.getParent();
  }
};
g.Gc = function(a) {
  if (this.t) {
    for (var b = 0, c;c = this.t[b];b++) {
      c(a);
    }
  }
};
g.Ec = function(a) {
  this.Z = a;
};
g.Bc = function(a, b) {
  this.getChildren()[a] = b;
};
var Ab = {}, I = null, Bb = function() {
  I || (I = new G(""), Ab[""] = I, I.da(xb));
}, Cb = function() {
  Bb();
  return I;
}, J = function(a) {
  Bb();
  var b;
  if (!(b = Ab[a])) {
    b = new G(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = J(a.substr(0, c));
    c.Bc(d, b);
    b.Ec(c);
    Ab[a] = b;
  }
  return b;
};
var M = function() {
};
M.prototype.Ic = !1;
M.prototype.cc = function() {
  return this.Ic;
};
var Db = function() {
  this.g = [];
  this.i = {};
};
q(Db, M);
g = Db.prototype;
g.Xa = 1;
g.X = 0;
g.xc = function(a, b, c) {
  var d = this.i[a];
  d || (d = this.i[a] = []);
  var e = this.Xa;
  this.g[e] = a;
  this.g[e + 1] = b;
  this.g[e + 2] = c;
  this.Xa = e + 3;
  d.push(e);
  return e;
};
g.yc = function(a, b, c) {
  if (a = this.i[a]) {
    var d = this.g;
    if (a = v(a, function(a) {
      return d[a + 1] == b && d[a + 2] == c;
    })) {
      return this.U(a);
    }
  }
  return!1;
};
g.U = function(a) {
  if (0 != this.X) {
    return this.W || (this.W = []), this.W.push(a), !1;
  }
  var b = this.g[a];
  if (b) {
    var c = this.i[b];
    c && Ha(c, a);
    delete this.g[a];
    delete this.g[a + 1];
    delete this.g[a + 2];
  }
  return!!b;
};
g.$b = function(a, b) {
  var c = this.i[a];
  if (c) {
    this.X++;
    for (var d = Ja(arguments, 1), e = 0, f = c.length;e < f;e++) {
      var h = c[e];
      this.g[h + 1].apply(this.g[h + 2], d);
    }
    this.X--;
    if (this.W && 0 == this.X) {
      for (;c = this.W.pop();) {
        this.U(c);
      }
    }
    return 0 != e;
  }
  return!1;
};
g.clear = function(a) {
  if (a) {
    var b = this.i[a];
    b && (Ea(b, this.U, this), delete this.i[a]);
  } else {
    this.g.length = 0, this.i = {};
  }
};
g.la = function(a) {
  if (a) {
    var b = this.i[a];
    return b ? b.length : 0;
  }
  a = 0;
  for (b in this.i) {
    a += this.la(b);
  }
  return a;
};
var Eb = function(a, b, c, d) {
  this.source = a;
  this.target = b;
  this.type = c;
  this.content = d;
  this.windowUrl = null;
};
var Fb = function(a) {
  this.G = a;
  this.T = new Db;
  this.d = J("cv.Messenger-" + a);
};
q(Fb, M);
g = Fb.prototype;
g.ba = function() {
  chrome.extension.onMessage.addListener(p(this.Lc, this));
};
g.sc = function(a, b, c, d) {
  this.d.Wa("Sending message to " + a + ": " + JSON.stringify(c));
  chrome.extension.sendMessage(JSON.stringify(new Eb(this.G, a, b, c)), d || ca);
};
g.zc = function(a, b, c) {
  t("background" != this.G, "background page can NOT send message to itself");
  this.sc("background", a, b, c);
};
g.Lc = function(a, b) {
  t(n(a), "Expect a string. Got " + JSON.stringify(a));
  var c = JSON.parse(a);
  if (this.G == c.target && this.G != c.source && ("background" == this.G || "background" == c.source)) {
    var d;
    b.tab ? (d = b.tab, c.windowUrl && d.url != c.windowUrl && (d.url = c.windowUrl, d.title = "", d.favIconUrl = "")) : d = {id:-1};
    this.d.Zb("Getting message from tab " + d.id + ": " + JSON.stringify(c));
    this.T.$b(c.type, d, c.content);
  }
};
g.listen = function(a, b, c) {
  return this.T.xc(a, b, c);
};
g.ib = function(a, b, c) {
  return this.T.yc(a, b, c);
};
g.ja = function(a) {
  return this.T.U(a);
};
var Gb = function(a, b, c, d, e, f, h, l) {
  this.id = a;
  this.name = b;
  this.videoWidth = c;
  this.videoHeight = d;
  this.videoResolution = c + "x" + d;
  this.minVideoBitrate = e;
  this.maxVideoBitrate = f;
  this.videoQuality = h;
  this.audioBitrate = l;
}, Hb = new Gb("high", "High (720p)", 1280, 720, 2E3, 2500, 56, 128), Ib = [new Gb("highest", "Extreme (720p high bitrate)", 1280, 720, 4E3, 5E3, 56, 128), Hb, new Gb("low", "Standard (480p)", 854, 480, 750, 1500, 56, 128)];
var Jb = function(a, b) {
  this.type = a;
  this.message = b;
}, Kb = function(a, b) {
  this.id = a;
  this.isDefaultAction = b;
}, Lb = function(a, b, c, d) {
  this.captureSurface = a || "tab";
  this.lowFpsMode = b || !1;
  this.castAppNotificationDismissed = c || !1;
  this.mirrorQualityId = d || Hb.id;
}, Mb = function(a, b, c, d, e) {
  this.receiverActs = a || [];
  this.issue = b;
  this.isAppInTab = e || !1;
  this.castOfCurrentTab = c;
  this.settings = d || new Lb("tab");
};
var N = function(a, b) {
  this.type = a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.q = !1;
  this.Pa = !0;
};
N.prototype.stopPropagation = function() {
  this.q = !0;
};
N.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.Pa = !1;
};
var Nb = function(a) {
  Nb[" "](a);
  return a;
};
Nb[" "] = ca;
var Ob = !A || A && 9 <= kb, Pb = A && !E("9");
!C || E("528");
B && E("1.9b") || A && E("8") || $a && E("9.5") || C && E("528");
B && !E("8") || A && E("9");
var O = function(a, b) {
  N.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.I = this.state = null;
  a && this.ba(a, b);
};
q(O, N);
O.prototype.ba = function(a, b) {
  var c = this.type = a.type;
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if (d) {
    if (B) {
      var e;
      t: {
        try {
          Nb(d.nodeName);
          e = !0;
          break t;
        } catch (f) {
        }
        e = !1;
      }
      e || (d = null);
    }
  } else {
    "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement);
  }
  this.relatedTarget = d;
  this.offsetX = C || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = C || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.state = a.state;
  this.I = a;
  a.defaultPrevented && this.preventDefault();
};
O.prototype.stopPropagation = function() {
  O.fb.stopPropagation.call(this);
  this.I.stopPropagation ? this.I.stopPropagation() : this.I.cancelBubble = !0;
};
O.prototype.preventDefault = function() {
  O.fb.preventDefault.call(this);
  var a = this.I;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, Pb) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
var Qb = "closure_listenable_" + (1E6 * Math.random() | 0), Rb = function(a) {
  try {
    return!(!a || !a[Qb]);
  } catch (b) {
    return!1;
  }
}, Sb = 0;
var Tb = function(a, b, c, d, e, f) {
  this.o = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.S = f;
  this.key = ++Sb;
  this.removed = this.R = !1;
};
Tb.prototype.V = function() {
  this.removed = !0;
  this.S = this.src = this.proxy = this.o = null;
};
var Ub = function(a) {
  this.src = a;
  this.f = {};
  this.H = 0;
};
g = Ub.prototype;
g.ic = function() {
  return this.H;
};
g.add = function(a, b, c, d, e) {
  var f = this.f[a];
  f || (f = this.f[a] = [], this.H++);
  var h = Vb(f, b, d, e);
  -1 < h ? (a = f[h], c || (a.R = !1)) : (a = new Tb(b, null, this.src, a, !!d, e), a.R = c, f.push(a));
  return a;
};
g.remove = function(a, b, c, d) {
  if (!(a in this.f)) {
    return!1;
  }
  var e = this.f[a];
  b = Vb(e, b, c, d);
  return-1 < b ? (e[b].V(), Ga(e, b), 0 == e.length && (delete this.f[a], this.H--), !0) : !1;
};
g.Za = function(a) {
  var b = a.type;
  if (!(b in this.f)) {
    return!1;
  }
  var c = Ha(this.f[b], a);
  c && (a.V(), 0 == this.f[b].length && (delete this.f[b], this.H--));
  return c;
};
g.removeAll = function(a) {
  var b = 0, c;
  for (c in this.f) {
    if (!a || c == a) {
      for (var d = this.f[c], e = 0;e < d.length;e++) {
        ++b, d[e].V();
      }
      delete this.f[c];
      this.H--;
    }
  }
  return b;
};
g.pa = function(a, b, c, d) {
  a = this.f[a];
  var e = -1;
  a && (e = Vb(a, b, c, d));
  return-1 < e ? a[e] : null;
};
g.hasListener = function(a, b) {
  var c = void 0 !== a, d = void 0 !== b;
  return Oa(this.f, function(e) {
    for (var f = 0;f < e.length;++f) {
      if (!(c && e[f].type != a || d && e[f].capture != b)) {
        return!0;
      }
    }
    return!1;
  });
};
var Vb = function(a, b, c, d) {
  for (var e = 0;e < a.length;++e) {
    var f = a[e];
    if (!f.removed && f.o == b && f.capture == !!c && f.S == d) {
      return e;
    }
  }
  return-1;
};
var Wb = "closure_lm_" + (1E6 * Math.random() | 0), P = {}, Xb = 0, Zb = function(a, b, c, d, e) {
  if ("array" == m(b)) {
    for (var f = 0;f < b.length;f++) {
      Zb(a, b[f], c, d, e);
    }
    return null;
  }
  c = $b(c);
  return Rb(a) ? a.listen(b, c, d, e) : ac(a, b, c, !1, d, e);
}, ac = function(a, b, c, d, e, f) {
  if (!b) {
    throw Error("Invalid event type");
  }
  var h = !!e, l = bc(a);
  l || (a[Wb] = l = new Ub(a));
  c = l.add(b, c, d, e, f);
  if (c.proxy) {
    return c;
  }
  d = cc();
  c.proxy = d;
  d.src = a;
  d.o = c;
  a.addEventListener ? a.addEventListener(b, d, h) : a.attachEvent(b in P ? P[b] : P[b] = "on" + b, d);
  Xb++;
  return c;
}, cc = function() {
  var a = dc, b = Ob ? function(c) {
    return a.call(b.src, b.o, c);
  } : function(c) {
    c = a.call(b.src, b.o, c);
    if (!c) {
      return c;
    }
  };
  return b;
}, ec = function(a, b, c, d, e) {
  if ("array" == m(b)) {
    for (var f = 0;f < b.length;f++) {
      ec(a, b[f], c, d, e);
    }
    return null;
  }
  c = $b(c);
  return Rb(a) ? a.Kc(b, c, d, e) : ac(a, b, c, !0, d, e);
}, fc = function(a, b, c, d, e) {
  if ("array" == m(b)) {
    for (var f = 0;f < b.length;f++) {
      fc(a, b[f], c, d, e);
    }
    return null;
  }
  c = $b(c);
  if (Rb(a)) {
    return a.ib(b, c, d, e);
  }
  if (!a) {
    return!1;
  }
  if (a = bc(a)) {
    if (b = a.pa(b, c, !!d, e)) {
      return gc(b);
    }
  }
  return!1;
}, gc = function(a) {
  if ("number" == typeof a || !a || a.removed) {
    return!1;
  }
  var b = a.src;
  if (Rb(b)) {
    return b.ja(a);
  }
  var c = a.type, d = a.proxy;
  b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(c in P ? P[c] : P[c] = "on" + c, d);
  Xb--;
  (c = bc(b)) ? (c.Za(a), 0 == c.ic() && (c.src = null, b[Wb] = null)) : a.V();
  return!0;
}, ic = function(a, b, c, d) {
  var e = 1;
  if (a = bc(a)) {
    if (b = a.f[b]) {
      for (b = Ia(b), a = 0;a < b.length;a++) {
        var f = b[a];
        f && f.capture == c && !f.removed && (e &= !1 !== hc(f, d));
      }
    }
  }
  return Boolean(e);
}, hc = function(a, b) {
  var c = a.o, d = a.S || a.src;
  a.R && gc(a);
  return c.call(d, b);
}, dc = function(a, b) {
  if (a.removed) {
    return!0;
  }
  if (!Ob) {
    var c = b || ba("window.event"), d = new O(c, this), e = !0;
    if (!(0 > c.keyCode || void 0 != c.returnValue)) {
      t: {
        var f = !1;
        if (0 == c.keyCode) {
          try {
            c.keyCode = -1;
            break t;
          } catch (h) {
            f = !0;
          }
        }
        if (f || void 0 == c.returnValue) {
          c.returnValue = !0;
        }
      }
      c = [];
      for (f = d.currentTarget;f;f = f.parentNode) {
        c.push(f);
      }
      for (var f = a.type, l = c.length - 1;!d.q && 0 <= l;l--) {
        d.currentTarget = c[l], e &= ic(c[l], f, !0, d);
      }
      for (l = 0;!d.q && l < c.length;l++) {
        d.currentTarget = c[l], e &= ic(c[l], f, !1, d);
      }
    }
    return e;
  }
  return hc(a, new O(b, this));
}, bc = function(a) {
  a = a[Wb];
  return a instanceof Ub ? a : null;
}, jc = "__closure_events_fn_" + (1E9 * Math.random() >>> 0), $b = function(a) {
  t(a, "Listener can not be null.");
  if ("function" == m(a)) {
    return a;
  }
  t(a.handleEvent, "An object listener must have handleEvent method.");
  return a[jc] || (a[jc] = function(b) {
    return a.handleEvent(b);
  });
};
var Q = function() {
  this.m = new Ub(this);
  this.ac = this;
};
q(Q, M);
Q.prototype[Qb] = !0;
g = Q.prototype;
g.Mc = null;
g.$a = function() {
  return this.Mc;
};
g.addEventListener = function(a, b, c, d) {
  Zb(this, a, b, c, d);
};
g.removeEventListener = function(a, b, c, d) {
  fc(this, a, b, c, d);
};
g.dispatchEvent = function(a) {
  this.Va();
  var b, c = this.$a();
  if (c) {
    b = [];
    for (var d = 1;c;c = c.$a()) {
      b.push(c), t(1E3 > ++d, "infinite loop");
    }
  }
  c = this.ac;
  d = a.type || a;
  if (n(a)) {
    a = new N(a, c);
  } else {
    if (a instanceof N) {
      a.target = a.target || c;
    } else {
      var e = a;
      a = new N(d, c);
      Sa(a, e);
    }
  }
  var e = !0, f;
  if (b) {
    for (var h = b.length - 1;!a.q && 0 <= h;h--) {
      f = a.currentTarget = b[h], e = f.Y(d, !0, a) && e;
    }
  }
  a.q || (f = a.currentTarget = c, e = f.Y(d, !0, a) && e, a.q || (e = f.Y(d, !1, a) && e));
  if (b) {
    for (h = 0;!a.q && h < b.length;h++) {
      f = a.currentTarget = b[h], e = f.Y(d, !1, a) && e;
    }
  }
  return e;
};
g.listen = function(a, b, c, d) {
  this.Va();
  return this.m.add(String(a), b, !1, c, d);
};
g.Kc = function(a, b, c, d) {
  return this.m.add(String(a), b, !0, c, d);
};
g.ib = function(a, b, c, d) {
  return this.m.remove(String(a), b, c, d);
};
g.ja = function(a) {
  return this.m.Za(a);
};
g.Y = function(a, b, c) {
  a = this.m.f[String(a)];
  if (!a) {
    return!0;
  }
  a = Ia(a);
  for (var d = !0, e = 0;e < a.length;++e) {
    var f = a[e];
    if (f && !f.removed && f.capture == b) {
      var h = f.o, l = f.S || f.src;
      f.R && this.ja(f);
      d = !1 !== h.call(l, c) && d;
    }
  }
  return d && !1 != c.Pa;
};
g.pa = function(a, b, c, d) {
  return this.m.pa(String(a), b, c, d);
};
g.hasListener = function(a, b) {
  return this.m.hasListener(void 0 !== a ? String(a) : void 0, b);
};
g.Va = function() {
  t(this.m, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
};
var kc = function(a, b, c) {
  if ("function" == m(a)) {
    c && (a = p(a, c));
  } else {
    if (a && "function" == typeof a.handleEvent) {
      a = p(a.handleEvent, a);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  return 2147483647 < b ? -1 : k.setTimeout(a, b || 0);
};
var lc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"), mc = C, nc = function(a, b) {
  if (mc) {
    mc = !1;
    var c = k.location;
    if (c) {
      var d = c.href;
      if (d && (d = (d = nc(3, d)) && decodeURIComponent(d)) && d != c.hostname) {
        throw mc = !0, Error();
      }
    }
  }
  return b.match(lc)[a] || null;
};
var oc = J("cv.TabUtils"), pc = null, qc = function(a) {
  a != chrome.windows.WINDOW_ID_NONE && (oc.info("Newly focused window ID: " + a), pc = a);
}, rc = function() {
  chrome.windows.getLastFocused(function(a) {
    pc || (pc = a.id);
  });
  chrome.windows.onFocusChanged.addListener(qc);
}, tc = function(a, b) {
  chrome.tabs.get(a, function(a) {
    sc(a, b);
  });
}, sc = function(a, b) {
  if (a) {
    var c = a.id;
    chrome.windows.update(a.windowId, {focused:!0}, function() {
      chrome.tabs.update(c, {active:!0}, b);
    });
  } else {
    b(null);
  }
}, uc = function(a, b, c) {
  chrome.tabs.query({url:a}, function(a) {
    a && 0 < a.length ? sc(a[0], c) : chrome.tabs.create({url:b}, c);
  });
};
var R = function() {
};
R.prototype.getMessage = function(a, b) {
  return this.Jc(a, b).message;
};
R.prototype.Jc = function(a, b) {
  for (var c = [], d = {}, e = /{{(\w+?)}}/g, f = e.exec(a);null != f;) {
    b ? b[f[1]] && (d[f[1]] = b[f[1]]) : d[f[1]] = d[f[1]], f = e.exec(a);
  }
  for (var h in d) {
    h && (b && (a = a.replace(RegExp("{{" + h + "}}", "g"), d[h])), c.push(h));
  }
  return{message:a, bindings:c};
};
da(R);
var vc = function() {
  this.ob = ha();
}, wc = new vc;
vc.prototype.set = function(a) {
  this.ob = a;
};
vc.prototype.reset = function() {
  this.set(ha());
};
vc.prototype.get = function() {
  return this.ob;
};
var xc = function(a) {
  this.Qb = a || "";
  this.Rb = wc;
};
g = xc.prototype;
g.Sb = !0;
g.Na = !0;
g.Xb = !0;
g.Wb = !0;
g.Oa = !1;
g.Yb = !1;
var S = function(a) {
  return 10 > a ? "0" + a : String(a);
}, yc = function(a, b) {
  var c = (a.Ra() - b) / 1E3, d = c.toFixed(3), e = 0;
  if (1 > c) {
    e = 2;
  } else {
    for (;100 > c;) {
      e++, c *= 10;
    }
  }
  for (;0 < e--;) {
    d = " " + d;
  }
  return d;
}, zc = function(a) {
  xc.call(this, a);
};
q(zc, xc);
zc.prototype.hc = function(a) {
  var b = [];
  b.push(this.Qb, " ");
  if (this.Na) {
    var c = new Date(a.Ra());
    b.push("[", S(c.getFullYear() - 2E3) + S(c.getMonth() + 1) + S(c.getDate()) + " " + S(c.getHours()) + ":" + S(c.getMinutes()) + ":" + S(c.getSeconds()) + "." + S(Math.floor(c.getMilliseconds() / 10)), "] ");
  }
  this.Xb && b.push("[", yc(a, this.Rb.get()), "s] ");
  this.Wb && b.push("[", a.Qa(), "] ");
  this.Yb && b.push("[", a.ka().name, "] ");
  b.push(a.getMessage());
  this.Oa && a.Ub() && b.push("\n", a.Vb());
  this.Sb && b.push("\n");
  return b.join("");
};
var Ac = function() {
  this.Ua = p(this.bc, this);
  this.ma = new zc;
  this.ma.Na = !1;
  this.Ta = this.ma.Oa = !1;
  this.Sa = "";
  this.Tb = {};
};
Ac.prototype.qb = function(a) {
  if (a != this.Ta) {
    var b = Cb();
    a ? b.jc(this.Ua) : b.kc(this.Ua);
    this.Ta = a;
  }
};
Ac.prototype.bc = function(a) {
  if (!this.Tb[a.Qa()]) {
    var b = this.ma.hc(a), c = Bc;
    if (c) {
      switch(a.ka()) {
        case tb:
          Cc(c, "info", b);
          break;
        case ub:
          Cc(c, "error", b);
          break;
        case vb:
          Cc(c, "warn", b);
          break;
        default:
          Cc(c, "debug", b);
      }
    } else {
      window.opera ? window.opera.postError(b) : this.Sa += b;
    }
  }
};
var Bc = window.console, Cc = function(a, b, c) {
  if (a[b]) {
    a[b](c);
  } else {
    a.log(c);
  }
};
!B && !A || A && A && 9 <= kb || B && E("1.9.1");
A && E("9");
var T = function(a, b, c) {
  a && a.Wa(b, c);
};
var Dc = function() {
};
Dc.prototype.kb = null;
Dc.prototype.Ca = function() {
  return this.kb || (this.kb = this.Ac());
};
var Ec, U = function() {
};
q(U, Dc);
U.prototype.hb = function() {
  var a = this.lb();
  return a ? new ActiveXObject(a) : new XMLHttpRequest;
};
U.prototype.Ac = function() {
  var a = {};
  this.lb() && (a[0] = !0, a[1] = !0);
  return a;
};
U.prototype.lb = function() {
  if (!this.mb && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for (var a = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        return new ActiveXObject(c), this.mb = c;
      } catch (d) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.mb;
};
Ec = new U;
var V = function(a) {
  Q.call(this);
  this.headers = new w;
  this.M = a || null;
  this.r = !1;
  this.K = this.c = null;
  this.v = this.xa = this.L = "";
  this.B = this.ea = this.J = this.fa = !1;
  this.s = 0;
  this.N = null;
  this.A = "";
  this.O = this.wb = !1;
};
q(V, Q);
var Fc = V.prototype, Gc = J("goog.net.XhrIo");
Fc.d = Gc;
var Hc = /^https?$/i, Ic = ["POST", "PUT"];
V.prototype.rc = function(a) {
  this.s = Math.max(0, a);
};
V.prototype.qc = function(a) {
  this.A = a;
};
V.prototype.send = function(a, b, c, d) {
  if (this.c) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.L + "; newUri=" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.L = a;
  this.v = "";
  this.xa = b;
  this.fa = !1;
  this.r = !0;
  this.c = this.xb();
  this.K = this.M ? this.M.Ca() : Ec.Ca();
  this.c.onreadystatechange = p(this.va, this);
  try {
    T(this.d, this.j("Opening Xhr")), this.ea = !0, this.c.open(b, a, !0), this.ea = !1;
  } catch (e) {
    T(this.d, this.j("Error opening Xhr: " + e.message));
    this.Ba(5, e);
    return;
  }
  a = c || "";
  var f = this.headers.clone();
  d && Va(d, function(a, b) {
    f.set(b, a);
  });
  d = v(f.P(), Jc);
  c = k.FormData && a instanceof k.FormData;
  !(0 <= Da(Ic, b)) || d || c || f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  Va(f, function(a, b) {
    this.c.setRequestHeader(b, a);
  }, this);
  this.A && (this.c.responseType = this.A);
  "withCredentials" in this.c && (this.c.withCredentials = this.wb);
  try {
    this.ya(), 0 < this.s && (this.O = Kc(this.c), T(this.d, this.j("Will abort after " + this.s + "ms if incomplete, xhr2 " + this.O)), this.O ? (this.c.timeout = this.s, this.c.ontimeout = p(this.Da, this)) : this.N = kc(this.Da, this.s, this)), T(this.d, this.j("Sending request")), this.J = !0, this.c.send(a), this.J = !1;
  } catch (h) {
    T(this.d, this.j("Send error: " + h.message)), this.Ba(5, h);
  }
};
var Kc = function(a) {
  return A && E(9) && "number" == typeof a.timeout && void 0 !== a.ontimeout;
}, Jc = function(a) {
  return "content-type" == a.toLowerCase();
};
g = V.prototype;
g.xb = function() {
  return this.M ? this.M.hb() : Ec.hb();
};
g.Da = function() {
  "undefined" != typeof aa && this.c && (this.v = "Timed out after " + this.s + "ms, aborting", T(this.d, this.j(this.v)), this.dispatchEvent("timeout"), this.abort(8));
};
g.Ba = function(a, b) {
  this.r = !1;
  this.c && (this.B = !0, this.c.abort(), this.B = !1);
  this.v = b;
  this.Ha();
  this.ga();
};
g.Ha = function() {
  this.fa || (this.fa = !0, this.dispatchEvent("complete"), this.dispatchEvent("error"));
};
g.abort = function() {
  this.c && this.r && (T(this.d, this.j("Aborting")), this.r = !1, this.B = !0, this.c.abort(), this.B = !1, this.dispatchEvent("complete"), this.dispatchEvent("abort"), this.ga());
};
g.va = function() {
  this.cc() || (this.ea || this.J || this.B ? this.Ya() : this.fc());
};
g.fc = function() {
  this.Ya();
};
g.Ya = function() {
  if (this.r && "undefined" != typeof aa) {
    if (this.K[1] && 4 == this.C() && 2 == this.Q()) {
      T(this.d, this.j("Local request error detected and ignored"));
    } else {
      if (this.J && 4 == this.C()) {
        kc(this.va, 0, this);
      } else {
        if (this.dispatchEvent("readystatechange"), this.ia()) {
          T(this.d, this.j("Request complete"));
          this.r = !1;
          try {
            this.Ka() ? (this.dispatchEvent("complete"), this.dispatchEvent("success")) : (this.v = this.Nb() + " [" + this.Q() + "]", this.Ha());
          } finally {
            this.ga();
          }
        }
      }
    }
  }
};
g.ga = function(a) {
  if (this.c) {
    this.ya();
    var b = this.c, c = this.K[0] ? ca : null;
    this.K = this.c = null;
    a || this.dispatchEvent("ready");
    try {
      b.onreadystatechange = c;
    } catch (d) {
      (a = this.d) && a.Ma("Problem encountered resetting onreadystatechange: " + d.message, void 0);
    }
  }
};
g.ya = function() {
  this.c && this.O && (this.c.ontimeout = null);
  "number" == typeof this.N && (k.clearTimeout(this.N), this.N = null);
};
g.ia = function() {
  return 4 == this.C();
};
g.Ka = function() {
  var a = this.Q(), b;
  t: {
    switch(a) {
      case 200:
      ;
      case 201:
      ;
      case 202:
      ;
      case 204:
      ;
      case 206:
      ;
      case 304:
      ;
      case 1223:
        b = !0;
        break t;
      default:
        b = !1;
    }
  }
  return b || 0 === a && !this.vc();
};
g.vc = function() {
  var a = nc(1, String(this.L));
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return Hc.test(a ? a.toLowerCase() : "");
};
g.C = function() {
  return this.c ? this.c.readyState : 0;
};
g.Q = function() {
  try {
    return 2 < this.C() ? this.c.status : -1;
  } catch (a) {
    var b = this.d;
    b && b.Ob("Can not get status: " + a.message, void 0);
    return-1;
  }
};
g.Nb = function() {
  try {
    return 2 < this.C() ? this.c.statusText : "";
  } catch (a) {
    return T(this.d, "Can not get status: " + a.message), "";
  }
};
g.nc = function() {
  try {
    if (!this.c) {
      return null;
    }
    if ("response" in this.c) {
      return this.c.response;
    }
    switch(this.A) {
      case "":
      ;
      case "text":
        return this.c.responseText;
      case "arraybuffer":
        if ("mozResponseArrayBuffer" in this.c) {
          return this.c.mozResponseArrayBuffer;
        }
      ;
    }
    var a = this.d;
    a && a.Ma("Response type " + this.A + " is not supported on this browser", void 0);
    return null;
  } catch (b) {
    return T(this.d, "Can not get response: " + b.message), null;
  }
};
g.getResponseHeader = function(a) {
  return this.c && this.ia() ? this.c.getResponseHeader(a) : void 0;
};
g.getAllResponseHeaders = function() {
  return this.c && this.ia() ? this.c.getAllResponseHeaders() : "";
};
g.j = function(a) {
  return a + " [" + this.xa + " " + this.L + " " + this.Q() + "]";
};
var Lc, Mc, Nc, Oc, Pc, Qc, Rc;
Rc = Qc = Pc = Oc = Nc = Mc = Lc = !1;
var W = y();
W && (-1 != W.indexOf("Firefox") ? Lc = !0 : -1 != W.indexOf("Camino") ? Mc = !0 : -1 != W.indexOf("iPhone") || -1 != W.indexOf("iPod") ? Nc = !0 : -1 != W.indexOf("iPad") ? Oc = !0 : -1 != W.indexOf("Chrome") ? Qc = !0 : -1 != W.indexOf("Android") ? Pc = !0 : -1 != W.indexOf("Safari") && (Rc = !0));
var Sc = Lc, Tc = Mc, Uc = Nc, Vc = Oc, Wc = Pc, Xc = Qc, Yc = Rc;
var X = function(a) {
  return(a = a.exec(y())) ? a[1] : "";
}, Zc = function() {
  if (Sc) {
    return X(/Firefox\/([0-9.]+)/);
  }
  if (A || $a) {
    return hb;
  }
  if (Xc) {
    return X(/Chrome\/([0-9.]+)/);
  }
  if (Yc) {
    return X(/Version\/([0-9.]+)/);
  }
  if (Uc || Vc) {
    var a;
    if (a = /Version\/(\S+).*Mobile\/(\S+)/.exec(y())) {
      return a[1] + "." + a[2];
    }
  } else {
    if (Wc) {
      return(a = X(/Android\s+([0-9.]+)/)) ? a : X(/Version\/([0-9.]+)/);
    }
    if (Tc) {
      return X(/Camino\/([0-9.]+)/);
    }
  }
  return "";
}();
var $c = chrome.i18n.getMessage("4014224501758376361", ["{{receiverName}}"]), ad = chrome.i18n.getMessage("6046507125919556913"), bd = chrome.i18n.getMessage("1189144544819350763"), cd = chrome.i18n.getMessage("3430817026795535765");
chrome.i18n.getMessage("4089994756445820175");
chrome.i18n.getMessage("780135806192376347");
chrome.i18n.getMessage("2438859709710567679");
chrome.i18n.getMessage("2076488708707463944");
chrome.i18n.getMessage("3996247341169314250");
chrome.i18n.getMessage("7053128562708856478");
chrome.i18n.getMessage("8500110749168055241");
chrome.i18n.getMessage("3844709005265884931");
chrome.i18n.getMessage("4224760847878375792");
chrome.i18n.getMessage("4584454172263179470");
chrome.i18n.getMessage("5823878688587296398");
chrome.i18n.getMessage("7008828272760191653");
chrome.i18n.getMessage("2377419936291389581");
chrome.i18n.getMessage("4324962226715124466");
chrome.i18n.getMessage("6039331491778328245");
chrome.i18n.getMessage("8887833628383960193");
chrome.i18n.getMessage("6118473811359442709");
chrome.i18n.getMessage("4272010402571776761");
chrome.i18n.getMessage("482442943064110817");
chrome.i18n.getMessage("5745355507138230213");
chrome.i18n.getMessage("7029426286291560071");
chrome.i18n.getMessage("8189622236075700665");
chrome.i18n.getMessage("6018881802001125637");
chrome.i18n.getMessage("4865676252029097872");
chrome.i18n.getMessage("6988652234001902672");
chrome.i18n.getMessage("6295154563386647404", ["{{attemptNumber}}"]);
angular.module("popupMenu", ["ngSanitize", "chrome_i18n"]);
var dd = function(a) {
  var b = new Ac;
  Cb().da(yb);
  b.qb(!0);
  this.d = J("cv.PopupMenu");
  this.b = new Mb([], null, null, null, !1);
  this.a = a;
  this.ca = new Fb("popup");
  this.u = null;
  a.init = !0;
  a.onClickLearnCastEnabledPage = p(this.ua, this, "http://support.google.com/chromecast/go/castenabledpage");
  rc();
  this.tb();
  this.vb();
  this.rb();
  this.ub();
  this.sb();
  this.ta();
  this.aa();
  this.ca.ba();
  this.ca.listen("event_to_popup", this.pb, this);
  this.n("init", {});
}, Y = ["PopupMenuCtrl"], Z = k;
Y[0] in Z || !Z.execScript || Z.execScript("var " + Y[0]);
for (var $;Y.length && ($ = Y.shift());) {
  Y.length || void 0 === dd ? Z = Z[$] ? Z[$] : Z[$] = {} : Z[$] = dd;
}
dd.$inject = ["$scope"];
g = dd.prototype;
g.k = function(a) {
  this.a.component = a;
};
g.aa = function() {
  this.b.issue && "fatal" == this.b.issue.severity ? this.k("issue_notifier") : this.u ? this.k("waiting") : this.a.selectedActivity ? this.k("activity_control") : this.b.isAppInTab && !this.b.settings.castAppNotificationDismissed ? this.k("cast_app_notification") : this.k("receiver_picker");
};
g.tb = function() {
  this.a.dismissCastAppNotification = p(function() {
    this.b.settings.castAppNotificationDismissed = !0;
    this.ha();
    this.aa();
  }, this);
};
g.vb = function() {
  this.za();
  this.a.onClickReceiver = p(this.Ib, this);
  this.a.onClickDeviceMissing = p(this.ua, this, "http://support.google.com/chromecast/go/nodevices");
  this.a.sendFeedback = p(this.Jb, this);
  this.a.showOptions = p(this.Lb, this);
  this.a.showHelp = p(this.Kb, this);
  this.a.disableProjectScreen = (1920 < window.screen.width * window.devicePixelRatio || 1080 < window.screen.height * window.devicePixelRatio) && !(0 <= sa(Zc, 29));
};
g.ua = function(a) {
  uc("http://support.google.com/chromecast/go*", a, function() {
    window.close();
  });
};
g.rb = function() {
  this.w();
  this.a.changeDevice = p(function() {
    this.k("receiver_picker");
  }, this);
  this.a.showOriginalTab = p(this.Gb, this);
  this.a.castThisTab = p(function() {
    this.a.disableCastButton || this.Db();
  }, this);
  this.a.playOrPause = p(function() {
    this.a.disableMediaControl || this.Fb();
  }, this);
  this.a.muteOrUmute = p(function() {
    this.a.disableMediaControl || this.Eb();
  }, this);
  this.a.stopActivity = p(this.Hb, this);
};
g.ub = function() {
  this.Fa();
  this.a.actOnIssueWithOptAct = p(this.La, this, !1);
  this.a.actOnIssueWithDefaultAct = p(this.La, this, !0);
};
g.sb = function() {
  this.Ea();
  this.a.sharedState = this.a.sharedState || {};
  this.a.sharedState.selectingCaptureSurface = !1;
  this.a.updateSettings = p(this.ha, this);
  this.a.toggleAudioIfTab = p(this.Mb, this);
};
g.Mb = function() {
  "tab" == this.b.settings.captureSurface && (this.a.settings.lowFpsMode = !this.a.settings.lowFpsMode, this.ha(), this.a.sharedState.selectingCaptureSurface = !1);
};
g.ha = function() {
  this.b.settings.captureSurface = this.a.settings.captureSurface;
  this.b.settings.lowFpsMode = this.a.settings.lowFpsMode;
  this.b.settings.mirrorQualityId = this.a.settings.mirrorQualityId;
  this.Ia();
  this.n("update_settings", this.b.settings);
};
g.Ea = function() {
  this.a.settings = this.b.settings;
};
g.ta = function() {
  this.a.waitingTitle = this.u ? R.Ga().getMessage($c, {receiverName:this.u.receiver.name}) : "";
};
g.za = function() {
  La(this.b.receiverActs, function(a, b) {
    return a.receiver.name.localeCompare(b.receiver.name);
  });
  this.a.receiverActs = this.b.receiverActs;
  this.Ia();
};
g.Ia = function() {
  this.a.receiverListTitle = "tab" == this.b.settings.captureSurface ? this.b.settings.lowFpsMode ? bd : R.Ga().getMessage(ad, this.a) : cd;
};
g.w = function() {
  this.a.selectedActivity && (this.a.disableCastButton = this.b.castOfCurrentTab && this.a.selectedActivity.id == this.b.castOfCurrentTab.id, this.Cb());
};
g.Cb = function() {
  t(null != this.a.selectedActivity);
  this.a.sharedState = this.a.sharedState || {};
  this.a.sharedState.selectingMirrorQuality = !1;
  this.a.mirrorQualities = Ib;
  var a = this.a.selectedActivity;
  this.a.showMirrorQualityToggle = a.isMirror && a.isLocal && 0 < a.tabId;
  (a = a.mediaPlayerStatus) ? (this.a.disableMediaControl = !1, a && (this.a.hasPause = null != a.hasPause ? a.hasPause : !0, this.a.playPauseImg = a.timeProgress ? "/data/pause.png" : "/data/play.png", this.a.muteUnmuteImg = a.muted ? "/data/mute.png" : "/data/unmute.png")) : (this.a.disableMediaControl = !0, this.a.playPauseImg = "/data/play.png", this.a.muteUnmuteImg = "/data/mute.png");
};
g.Gb = function() {
  var a = this.a.selectedActivity;
  !a || !a.tabId || 0 > a.tabId || tc(a.tabId, function(a) {
    a && window.close();
  });
};
g.Fa = function() {
  this.b.issue && (null == this.b.issue.activityId || this.a.selectedActivity && this.b.issue.activityId == this.a.selectedActivity.id) ? (this.a.issueTitle = this.b.issue.title, this.a.issueMessage = this.b.issue.message, this.a.issueOptActText = this.b.issue.optActionText, this.a.issueDefaultActText = this.b.issue.defaultActionText, this.a.showIssueOptActButton = 0 < this.b.issue.optActionText.length) : (this.a.issueTitle = "", this.a.issueMessage = "", this.a.issueOptActText = "", this.a.issueDefaultActText = 
  "", this.a.showIssueOptActButton = !1);
};
g.n = function(a, b) {
  var c = new Jb(a, b);
  this.ca.zc("popup_menu_request", c);
  return c;
};
g.La = function(a) {
  this.b.issue && (a = new Kb(this.b.issue.id, a), this.d.info("Act on issue " + JSON.stringify(this.b.issue)), this.n("act_on_issue", a));
};
g.Db = function() {
  this.a.selectedActivity && this.Aa(this.a.selectedActivity.receiver, "tab");
};
g.Ja = function(a, b) {
  return{activityId:a, data:b};
};
g.Fb = function() {
  var a = this.a.selectedActivity;
  a && a.mediaPlayerStatus && (this.n(a.mediaPlayerStatus.timeProgress ? "pause_media" : "play_media", this.Ja(a.id, {})), a.mediaPlayerStatus.timeProgress = !a.mediaPlayerStatus.timeProgress, this.w());
};
g.Eb = function() {
  var a = this.a.selectedActivity;
  a && a.mediaPlayerStatus && (this.n("set_mute", this.Ja(a.id, {muted:!a.mediaPlayerStatus.muted})), a.mediaPlayerStatus.muted = !a.mediaPlayerStatus.muted, this.w());
};
g.Hb = function() {
  this.a.selectedActivity && (this.d.info("Stop activity " + JSON.stringify(this.a.selectedActivity)), this.n("stop_activity", this.a.selectedActivity.id), this.a.selectedActivity = null, this.k("receiver_picker"));
};
g.Ib = function(a) {
  this.u ? this.d.info("There is an activity in launch; cannot launch another activity") : a.activity ? (this.a.selectedActivity = a.activity, this.wa(), this.w(), this.k("activity_control")) : this.Aa(a.receiver, this.b.settings.captureSurface);
};
g.Aa = function(a, b) {
  this.d.info("Project " + b);
  this.a.waitingTitle = "Casting to " + a.name;
  this.k("waiting");
  this.n("tab" == b ? "cast_this_tab" : "launch_desktop_mirror", a.id);
};
g.Jb = function() {
  this.nb("feedback.html");
};
g.Lb = function() {
  this.nb("options.html");
};
g.Kb = function() {
  uc("http://support.google.com/chromecast/go/castfromchrome*", "http://support.google.com/chromecast/go/castfromchrome", function() {
    window.close();
  });
};
g.nb = function(a) {
  a = chrome.extension.getURL(a);
  uc(a + "*", a, function() {
    window.close();
  });
};
g.pb = function(a, b) {
  if ("model_update" == b.type) {
    this.b = b.message;
    this.yb();
    var c = v(this.b.receiverActs, function(a) {
      return a.activity && a.activity.isInLaunch;
    });
    this.u = c ? c.activity : null;
    this.a.$apply(p(function() {
      this.a.init = !1;
      this.wa();
      this.w();
      this.Fa();
      this.za();
      this.ta();
      this.aa();
      this.Ea();
      this.a.isAppInTab = this.b.isAppInTab;
    }, this));
  }
};
g.yb = function() {
  this.Bb();
  this.a.selectedActivity || (this.b.castOfCurrentTab ? this.a.selectedActivity = this.b.castOfCurrentTab : 1 == this.Ab() && (this.a.selectedActivity = this.zb()));
};
g.Bb = function() {
  this.a.selectedActivity && (v(this.b.receiverActs, p(function(a) {
    return a.activity && a.activity.id == this.a.selectedActivity.id;
  }, this)) || (this.a.selectedActivity = null));
};
g.Ab = function() {
  return Fa(this.b.receiverActs, function(a) {
    return a.activity && a.activity.isLocal;
  });
};
g.zb = function() {
  var a = v(this.b.receiverActs, function(a) {
    return a.activity && a.activity.isLocal;
  });
  return a ? a.activity : null;
};
g.wa = function() {
  if (this.a.selectedActivity) {
    if (this.a.selectedActivity.iconUrl) {
      var a = this.a.selectedActivity.iconUrl;
      this.a.selectedActivity.iconUrl = "data/default_activity.png";
      "data/default_activity.png" != a && ed(a, p(function(a) {
        a && (this.a.selectedActivity.iconUrl = a, this.a.$apply());
      }, this));
    } else {
      this.a.selectedActivity.iconUrl = "data/default_activity.png";
    }
  }
};
var ed = function(a, b) {
  var c = new V;
  c.qc("blob");
  c.rc(1500);
  ec(c, ["complete", "timeout"], function() {
    if (c.Ka()) {
      var a = window.webkitURL.createObjectURL(c.nc());
      b(a);
    } else {
      b(null);
    }
  });
  c.send(a, "GET");
};

