var e;
window.Nc = !0;
var chrome = chrome || {};
var aa = aa || {}, k = this, ba = function(a, b) {
  for(var c = a.split("."), d = b || k, f;f = c.shift();) {
    if(null != d[f]) {
      d = d[f]
    }else {
      return null
    }
  }
  return d
}, ca = function() {
}, da = function(a) {
  a.ia = function() {
    return a.fb ? a.fb : a.fb = new a
  }
}, l = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
}, ea = function(a) {
  var b = l(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}, m = function(a) {
  return"string" == typeof a
}, fa = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
}, ga = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
}, n = function(a, b, c) {
  n = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? fa : ga;
  return n.apply(null, arguments)
}, ha = Date.now || function() {
  return+new Date
}, q = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.zc = b.prototype;
  a.prototype = new c
};
Function.prototype.bind = Function.prototype.bind || function(a, b) {
  if(1 < arguments.length) {
    var c = Array.prototype.slice.call(arguments, 1);
    c.unshift(this, a);
    return n.apply(null, c)
  }
  return n(this, a)
};
if("undefined" != typeof angular) {
  var ia = angular.module("chrome_i18n", []);
  chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().default_locale && ia.directive("angularMessage", function() {
    return{restrict:"E", transclude:"element", replace:!0, compile:function(a, b) {
      var c = b.key, d = null, f = document.createElement("amr");
      c && !c.match(/^\d+$/) && (c = chrome.i18n.getMessage(c), null == c && f.setAttribute("id", "missing"));
      if(c) {
        var d = chrome.i18n.getMessage(c + "_ph"), g = [];
        null != d && (g = d.split("\ue000"));
        d = chrome.i18n.getMessage(c, g)
      }else {
        f.setAttribute("r", "nokey")
      }
      d ? f.innerHTML = d : (f.setAttribute("tl", "false"), f.innerHTML = a.html());
      a.replaceWith(f)
    }}
  })
}
;var r = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, r) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
q(r, Error);
r.prototype.name = "CustomError";
var ja = function(a, b) {
  for(var c = a.split("%s"), d = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < c.length;) {
    d += c.shift() + f.shift()
  }
  return d + c.join("%s")
}, pa = function(a, b) {
  if(b) {
    return a.replace(ka, "&amp;").replace(la, "&lt;").replace(ma, "&gt;").replace(na, "&quot;")
  }
  if(!oa.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(ka, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(la, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(ma, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(na, "&quot;"));
  return a
}, ka = /&/g, la = /</g, ma = />/g, na = /\"/g, oa = /[&<>\"]/, ra = function(a, b) {
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), g = Math.max(d.length, f.length), h = 0;0 == c && h < g;h++) {
    var p = d[h] || "", db = f[h] || "", qa = RegExp("(\\d*)(\\D*)", "g"), Wb = RegExp("(\\d*)(\\D*)", "g");
    do {
      var w = qa.exec(p) || ["", "", ""], x = Wb.exec(db) || ["", "", ""];
      if(0 == w[0].length && 0 == x[0].length) {
        break
      }
      c = ((0 == w[1].length ? 0 : parseInt(w[1], 10)) < (0 == x[1].length ? 0 : parseInt(x[1], 10)) ? -1 : (0 == w[1].length ? 0 : parseInt(w[1], 10)) > (0 == x[1].length ? 0 : parseInt(x[1], 10)) ? 1 : 0) || ((0 == w[2].length) < (0 == x[2].length) ? -1 : (0 == w[2].length) > (0 == x[2].length) ? 1 : 0) || (w[2] < x[2] ? -1 : w[2] > x[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
};
var sa = function(a, b) {
  b.unshift(a);
  r.call(this, ja.apply(null, b));
  b.shift()
};
q(sa, r);
sa.prototype.name = "AssertionError";
var s = function(a, b, c) {
  if(!a) {
    var d = Array.prototype.slice.call(arguments, 2), f = "Assertion failed";
    if(b) {
      var f = f + (": " + b), g = d
    }
    throw new sa("" + f, g || []);
  }
  return a
}, ta = function(a, b) {
  throw new sa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
};
var t = Array.prototype, ua = t.indexOf ? function(a, b, c) {
  s(null != a.length);
  return t.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(m(a)) {
    return m(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, va = t.forEach ? function(a, b, c) {
  s(null != a.length);
  t.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = m(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && b.call(c, f[g], g, a)
  }
}, wa = function(a, b, c) {
  var d = 0;
  va(a, function(a, g, h) {
    b.call(c, a, g, h) && ++d
  }, c);
  return d
}, u = function(a, b, c) {
  t: {
    for(var d = a.length, f = m(a) ? a.split("") : a, g = 0;g < d;g++) {
      if(g in f && b.call(c, f[g], g, a)) {
        b = g;
        break t
      }
    }
    b = -1
  }
  return 0 > b ? null : m(a) ? a.charAt(b) : a[b]
}, ya = function(a, b) {
  var c = ua(a, b), d;
  (d = 0 <= c) && xa(a, c);
  return d
}, xa = function(a, b) {
  s(null != a.length);
  return 1 == t.splice.call(a, b, 1).length
}, za = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}, Aa = function(a, b, c) {
  s(null != a.length);
  return 2 >= arguments.length ? t.slice.call(a, b) : t.slice.call(a, b, c)
}, Ca = function(a, b) {
  s(null != a.length);
  t.sort.call(a, b || Ba)
}, Ba = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
var v = {constant:function(a) {
  return function() {
    return a
  }
}};
v.Oc = v.constant(!1);
v.Tc = v.constant(!0);
v.Sc = v.constant(null);
v.identity = function(a) {
  return a
};
v.error = function(a) {
  return function() {
    throw Error(a);
  }
};
v.Yc = function(a) {
  return function() {
    throw a;
  }
};
v.$c = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b))
  }
};
v.bd = function(a) {
  return function() {
    return arguments[a]
  }
};
v.dd = function(a, b) {
  return v.Mc(a, v.constant(b))
};
v.Xc = function(a, b) {
  var c = arguments, d = c.length;
  return function() {
    var a;
    d && (a = c[d - 1].apply(this, arguments));
    for(var b = d - 2;0 <= b;b--) {
      a = c[b].call(this, a)
    }
    return a
  }
};
v.Mc = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a, f = 0;f < c;f++) {
      a = b[f].apply(this, arguments)
    }
    return a
  }
};
v.Uc = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a = 0;a < c;a++) {
      if(!b[a].apply(this, arguments)) {
        return!1
      }
    }
    return!0
  }
};
v.cd = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a = 0;a < c;a++) {
      if(b[a].apply(this, arguments)) {
        return!0
      }
    }
    return!1
  }
};
v.ad = function(a) {
  return function() {
    return!a.apply(this, arguments)
  }
};
v.create = function(a, b) {
  var c = function() {
  };
  c.prototype = a.prototype;
  c = new c;
  a.apply(c, Array.prototype.slice.call(arguments, 1));
  return c
};
v.Cc = !0;
v.Wc = function(a) {
  var b = !1, c;
  return function() {
    if(!v.Cc) {
      return a()
    }
    b || (c = a(), b = !0);
    return c
  }
};
var Da = "StopIteration" in k ? k.StopIteration : Error("StopIteration"), Ea = function() {
};
Ea.prototype.next = function() {
  throw Da;
};
Ea.prototype.Dc = function() {
  return this
};
var Fa = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}, Ga = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}, Ha = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), Ia = function(a, b) {
  for(var c, d, f = 1;f < arguments.length;f++) {
    d = arguments[f];
    for(c in d) {
      a[c] = d[c]
    }
    for(var g = 0;g < Ha.length;g++) {
      c = Ha[g], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
var Ja = function(a, b) {
  this.i = {};
  this.e = [];
  this.G = this.u = 0;
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.Nb(a)
  }
};
e = Ja.prototype;
e.aa = function() {
  this.T();
  for(var a = [], b = 0;b < this.e.length;b++) {
    a.push(this.i[this.e[b]])
  }
  return a
};
e.P = function() {
  this.T();
  return this.e.concat()
};
e.clear = function() {
  this.i = {};
  this.G = this.u = this.e.length = 0
};
e.remove = function(a) {
  return Object.prototype.hasOwnProperty.call(this.i, a) ? (delete this.i[a], this.u--, this.G++, this.e.length > 2 * this.u && this.T(), !0) : !1
};
e.T = function() {
  if(this.u != this.e.length) {
    for(var a = 0, b = 0;a < this.e.length;) {
      var c = this.e[a];
      Object.prototype.hasOwnProperty.call(this.i, c) && (this.e[b++] = c);
      a++
    }
    this.e.length = b
  }
  if(this.u != this.e.length) {
    for(var d = {}, b = a = 0;a < this.e.length;) {
      c = this.e[a], Object.prototype.hasOwnProperty.call(d, c) || (this.e[b++] = c, d[c] = 1), a++
    }
    this.e.length = b
  }
};
e.get = function(a, b) {
  return Object.prototype.hasOwnProperty.call(this.i, a) ? this.i[a] : b
};
e.set = function(a, b) {
  Object.prototype.hasOwnProperty.call(this.i, a) || (this.u++, this.e.push(a), this.G++);
  this.i[a] = b
};
e.Nb = function(a) {
  var b;
  a instanceof Ja ? (b = a.P(), a = a.aa()) : (b = Ga(a), a = Fa(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
e.clone = function() {
  return new Ja(this)
};
e.Dc = function(a) {
  this.T();
  var b = 0, c = this.e, d = this.i, f = this.G, g = this, h = new Ea;
  h.next = function() {
    for(;;) {
      if(f != g.G) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw Da;
      }
      var h = c[b++];
      return a ? h : d[h]
    }
  };
  return h
};
var Ka = function(a) {
  if("function" == typeof a.aa) {
    return a.aa()
  }
  if(m(a)) {
    return a.split("")
  }
  if(ea(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return Fa(a)
}, La = function(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ea(a) || m(a)) {
      va(a, b, c)
    }else {
      var d;
      if("function" == typeof a.P) {
        d = a.P()
      }else {
        if("function" != typeof a.aa) {
          if(ea(a) || m(a)) {
            d = [];
            for(var f = a.length, g = 0;g < f;g++) {
              d.push(g)
            }
          }else {
            d = Ga(a)
          }
        }else {
          d = void 0
        }
      }
      for(var f = Ka(a), g = f.length, h = 0;h < g;h++) {
        b.call(c, f[h], d && d[h], a)
      }
    }
  }
};
var y, Ma, Na, Oa, z = function() {
  return k.navigator ? k.navigator.userAgent : null
};
Oa = Na = Ma = y = !1;
var A;
if(A = z()) {
  var Pa = k.navigator;
  y = 0 == A.lastIndexOf("Opera", 0);
  Ma = !y && (-1 != A.indexOf("MSIE") || -1 != A.indexOf("Trident"));
  Na = !y && -1 != A.indexOf("WebKit");
  Oa = !y && !Na && !Ma && "Gecko" == Pa.product
}
var Qa = y, B = Ma, C = Oa, D = Na, Ra = function() {
  var a = k.document;
  return a ? a.documentMode : void 0
}, Sa;
t: {
  var Ta = "", E;
  if(Qa && k.opera) {
    var Ua = k.opera.version, Ta = "function" == typeof Ua ? Ua() : Ua
  }else {
    if(C ? E = /rv\:([^\);]+)(\)|;)/ : B ? E = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : D && (E = /WebKit\/(\S+)/), E) {
      var Va = E.exec(z()), Ta = Va ? Va[1] : ""
    }
  }
  if(B) {
    var Wa = Ra();
    if(Wa > parseFloat(Ta)) {
      Sa = String(Wa);
      break t
    }
  }
  Sa = Ta
}
var Xa = Sa, Ya = {}, F = function(a) {
  return Ya[a] || (Ya[a] = 0 <= ra(Xa, a))
}, Za = k.document, $a = Za && B ? Ra() || ("CSS1Compat" == Za.compatMode ? parseInt(Xa, 10) : 5) : void 0;
var bb = function(a, b) {
  try {
    var c;
    var d = ba("window.location.href");
    if(m(a)) {
      c = {message:a, name:"Unknown error", lineNumber:"Not available", fileName:d, stack:"Not available"}
    }else {
      var f, g, h = !1;
      try {
        f = a.lineNumber || a.Zc || "Not available"
      }catch(p) {
        f = "Not available", h = !0
      }
      try {
        g = a.fileName || a.filename || a.sourceURL || k.$googDebugFname || d
      }catch(db) {
        g = "Not available", h = !0
      }
      c = !h && a.lineNumber && a.fileName && a.stack && a.message && a.name ? a : {message:a.message || "Not available", name:a.name || "UnknownError", lineNumber:f, fileName:g, stack:a.stack || "Not available"}
    }
    return"Message: " + pa(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + pa(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + pa(ab(b) + "-> ")
  }catch(qa) {
    return"Exception trying to expose exception! You win, we lose. " + qa
  }
}, ab = function(a) {
  return cb(a || arguments.callee.caller, [])
}, cb = function(a, b) {
  var c = [];
  if(0 <= ua(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(eb(a) + "(");
      for(var d = a.arguments, f = 0;f < d.length;f++) {
        0 < f && c.push(", ");
        var g;
        g = d[f];
        switch(typeof g) {
          case "object":
            g = g ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            g = String(g);
            break;
          case "boolean":
            g = g ? "true" : "false";
            break;
          case "function":
            g = (g = eb(g)) ? g : "[fn]";
            break;
          default:
            g = typeof g
        }
        40 < g.length && (g = g.substr(0, 40) + "...");
        c.push(g)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(cb(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}, eb = function(a) {
  if(G[a]) {
    return G[a]
  }
  a = String(a);
  if(!G[a]) {
    var b = /function ([^\(]+)/.exec(a);
    G[a] = b ? b[1] : "[Anonymous]"
  }
  return G[a]
}, G = {};
var H = function(a, b, c, d, f) {
  this.reset(a, b, c, d, f)
};
H.prototype.qa = null;
H.prototype.pa = null;
var fb = 0;
e = H.prototype;
e.reset = function(a, b, c, d, f) {
  "number" == typeof f || fb++;
  this.ec = d || ha();
  this.q = a;
  this.cc = b;
  this.bc = c;
  delete this.qa;
  delete this.pa
};
e.Oa = function() {
  return this.bc
};
e.Sb = function() {
  return this.qa
};
e.pc = function(a) {
  this.qa = a
};
e.Tb = function() {
  return this.pa
};
e.qc = function(a) {
  this.pa = a
};
e.la = function() {
  return this.q
};
e.K = function(a) {
  this.q = a
};
e.getMessage = function() {
  return this.cc
};
e.Qa = function() {
  return this.ec
};
var gb = function() {
  s(!0, "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear()
}, hb;
gb.prototype.nc = function(a, b, c) {
  var d = (this.bb + 1) % 5E3;
  this.bb = d;
  if(this.cb) {
    return d = this.ab[d], d.reset(a, b, c), d
  }
  this.cb = 4999 == d;
  return this.ab[d] = new H(a, b, c)
};
gb.prototype.clear = function() {
  this.ab = Array(5E3);
  this.bb = -1;
  this.cb = !1
};
var I = function(a) {
  this.oc = a
};
I.prototype.$ = null;
I.prototype.q = null;
I.prototype.ta = null;
I.prototype.v = null;
var J = function(a, b) {
  this.name = a;
  this.value = b
};
J.prototype.toString = function() {
  return this.name
};
var ib = new J("SHOUT", 1200), jb = new J("SEVERE", 1E3), kb = new J("WARNING", 900), lb = new J("INFO", 800), mb = new J("CONFIG", 700), nb = new J("FINE", 500), ob = new J("FINER", 400);
e = I.prototype;
e.oa = function(a) {
  this.v || (this.v = []);
  this.v.push(a)
};
e.ra = function(a) {
  var b = this.v;
  return!!b && ya(b, a)
};
e.getParent = function() {
  return this.$
};
e.getChildren = function() {
  this.ta || (this.ta = {});
  return this.ta
};
e.K = function(a) {
  this.q = a
};
e.la = function() {
  return this.q
};
e.Za = function() {
  if(this.q) {
    return this.q
  }
  if(this.$) {
    return this.$.Za()
  }
  ta("Root logger has no level set.");
  return null
};
e.vc = function(a) {
  return a.value >= this.Za().value
};
e.log = function(a, b, c) {
  this.vc(a) && this.sc(this.tc(a, b, c))
};
e.tc = function(a, b, c) {
  hb || (hb = new gb);
  var d = hb.nc(a, b, this.oc);
  c && (d.pc(c), d.qc(bb(c, arguments.callee.caller)));
  return d
};
e.mc = function(a, b) {
  this.log(jb, a, b)
};
e.ja = function(a, b) {
  this.log(kb, a, b)
};
I.prototype.info = function(a, b) {
  this.log(lb, a, b)
};
e = I.prototype;
e.f = function(a, b) {
  this.log(nb, a, b)
};
e.Xb = function(a, b) {
  this.log(ob, a, b)
};
e.sc = function(a) {
  var b = "log:" + a.getMessage();
  k.console && (k.console.timeStamp ? k.console.timeStamp(b) : k.console.markTimeline && k.console.markTimeline(b));
  k.msWriteProfilerMark && k.msWriteProfilerMark(b);
  for(b = this;b;) {
    b.Ec(a), b = b.getParent()
  }
};
e.Ec = function(a) {
  if(this.v) {
    for(var b = 0, c;c = this.v[b];b++) {
      c(a)
    }
  }
};
e.Bc = function(a) {
  this.$ = a
};
e.Ac = function(a, b) {
  this.getChildren()[a] = b
};
var pb = {}, K = null, qb = function() {
  K || (K = new I(""), pb[""] = K, K.K(mb))
}, rb = function() {
  qb();
  return K
}, L = function(a) {
  qb();
  var b;
  if(!(b = pb[a])) {
    b = new I(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = L(a.substr(0, c));
    c.Ac(d, b);
    b.Bc(c);
    pb[a] = b
  }
  return b
};
L("cv.CloudDevice");
var sb, tb, ub, vb, wb, xb, yb;
yb = xb = wb = vb = ub = tb = sb = !1;
var M = z();
M && (-1 != M.indexOf("Firefox") ? sb = !0 : -1 != M.indexOf("Camino") ? tb = !0 : -1 != M.indexOf("iPhone") || -1 != M.indexOf("iPod") ? ub = !0 : -1 != M.indexOf("iPad") ? vb = !0 : -1 != M.indexOf("Chrome") ? xb = !0 : -1 != M.indexOf("Android") ? wb = !0 : -1 != M.indexOf("Safari") && (yb = !0));
var zb = sb, Ab = tb, Bb = ub, Cb = vb, Db = wb, Eb = xb, Fb = yb;
var N = function(a) {
  return(a = a.exec(z())) ? a[1] : ""
}, Gb = function() {
  if(zb) {
    return N(/Firefox\/([0-9.]+)/)
  }
  if(B || Qa) {
    return Xa
  }
  if(Eb) {
    return N(/Chrome\/([0-9.]+)/)
  }
  if(Fb) {
    return N(/Version\/([0-9.]+)/)
  }
  if(Bb || Cb) {
    var a = /Version\/(\S+).*Mobile\/(\S+)/.exec(z());
    if(a) {
      return a[1] + "." + a[2]
    }
  }else {
    if(Db) {
      return(a = N(/Android\s+([0-9.]+)/)) ? a : N(/Version\/([0-9.]+)/)
    }
    if(Ab) {
      return N(/Camino\/([0-9.]+)/)
    }
  }
  return""
}();
var Hb = function(a, b, c, d, f, g, h, p) {
  this.id = a;
  this.name = b;
  this.videoWidth = c;
  this.videoHeight = d;
  this.videoResolution = c + "x" + d;
  this.minVideoBitrate = f;
  this.maxVideoBitrate = g;
  this.videoQuality = h;
  this.audioBitrate = p
}, Ib = new Hb("high", "High (720p)", 1280, 720, 2E3, 2500, 56, 128), Jb = [new Hb("highest", "Extreme (720p high bitrate)", 1280, 720, 4E3, 5E3, 56, 128), Ib, new Hb("low", "Standard (480p)", 854, 480, 750, 1500, 56, 128)];
var Kb = function(a, b) {
  this.volume = a;
  this.muted = b
}, Lb = [2, 4];
"undefined" != typeof chrome && "undefined" != typeof chrome.runtime || window.postMessage({source:"CastApi", event:"Hello", Vc:Lb}, "*");
var Mb = function(a, b, c, d, f) {
  this.source = a;
  this.target = b;
  this.seq = c;
  this.type = d;
  this.message = f
};
var Nb = function(a, b) {
  this.id = a;
  this.isDefaultAction = b
}, Ob = function(a, b, c, d) {
  this.captureSurface = a || "tab";
  this.lowFpsMode = b || !1;
  this.castAppNotificationDismissed = c || !1;
  this.mirrorQualityId = d || Ib.id
}, Pb = function(a, b, c, d, f) {
  this.receiverActs = a || [];
  this.issue = b;
  this.isAppInTab = f || !1;
  this.castOfCurrentTab = c;
  this.settings = d || new Ob("tab")
};
var O = function() {
};
O.prototype.Fc = !1;
O.prototype.ac = function() {
  return this.Fc
};
var Qb = function() {
  this.h = [];
  this.l = {}
};
q(Qb, O);
e = Qb.prototype;
e.Wa = 1;
e.X = 0;
e.wc = function(a, b, c) {
  var d = this.l[a];
  d || (d = this.l[a] = []);
  var f = this.Wa;
  this.h[f] = a;
  this.h[f + 1] = b;
  this.h[f + 2] = c;
  this.Wa = f + 3;
  d.push(f);
  return f
};
e.xc = function(a, b, c) {
  if(a = this.l[a]) {
    var d = this.h;
    if(a = u(a, function(a) {
      return d[a + 1] == b && d[a + 2] == c
    })) {
      return this.V(a)
    }
  }
  return!1
};
e.V = function(a) {
  if(0 != this.X) {
    return this.W || (this.W = []), this.W.push(a), !1
  }
  var b = this.h[a];
  if(b) {
    var c = this.l[b];
    c && ya(c, a);
    delete this.h[a];
    delete this.h[a + 1];
    delete this.h[a + 2]
  }
  return!!b
};
e.Yb = function(a, b) {
  var c = this.l[a];
  if(c) {
    this.X++;
    for(var d = Aa(arguments, 1), f = 0, g = c.length;f < g;f++) {
      var h = c[f];
      this.h[h + 1].apply(this.h[h + 2], d)
    }
    this.X--;
    if(this.W && 0 == this.X) {
      for(;c = this.W.pop();) {
        this.V(c)
      }
    }
    return 0 != f
  }
  return!1
};
e.clear = function(a) {
  if(a) {
    var b = this.l[a];
    b && (va(b, this.V, this), delete this.l[a])
  }else {
    this.h.length = 0, this.l = {}
  }
};
var Rb = function(a, b, c, d) {
  this.source = a;
  this.target = b;
  this.type = c;
  this.content = d;
  this.windowUrl = null
};
var Sb = function(a) {
  this.H = a;
  this.U = new Qb;
  this.d = L("cv.Messenger-" + a)
};
q(Sb, O);
e = Sb.prototype;
e.ea = function() {
  chrome.extension.onMessage.addListener(n(this.Jc, this))
};
e.rc = function(a, b, c, d) {
  this.d.f("Sending message to " + a + ": " + JSON.stringify(c));
  chrome.extension.sendMessage(JSON.stringify(new Rb(this.H, a, b, c)), d || ca)
};
e.ic = function(a, b, c) {
  s("background" != this.H, "background page can NOT send message to itself");
  this.rc("background", a, b, c)
};
e.Jc = function(a, b) {
  s(m(a), "Expect a string. Got " + JSON.stringify(a));
  var c = JSON.parse(a);
  if(this.H == c.target && this.H != c.source && ("background" == this.H || "background" == c.source)) {
    var d;
    b.tab ? (d = b.tab, c.windowUrl && d.url != c.windowUrl && (d.url = c.windowUrl, d.title = "", d.favIconUrl = "")) : d = {id:-1};
    this.d.Xb("Getting message from tab " + d.id + ": " + JSON.stringify(c));
    this.U.Yb(c.type, d, c.content)
  }
};
e.listen = function(a, b, c) {
  return this.U.wc(a, b, c)
};
e.gb = function(a, b, c) {
  return this.U.xc(a, b, c)
};
e.ka = function(a) {
  return this.U.V(a)
};
var Tb = function() {
  this.Lc = Math.floor(1E10 * Math.random())
};
Tb.prototype.hc = function() {
  return++this.Lc
};
var Ub = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"), Vb = D, Xb = function(a, b) {
  if(Vb) {
    Vb = !1;
    var c = k.location;
    if(c) {
      var d = c.href;
      if(d && (d = (d = Xb(3, d)) && decodeURIComponent(d)) && d != c.hostname) {
        throw Vb = !0, Error();
      }
    }
  }
  return b.match(Ub)[a] || null
};
L("cv.TabUtils");
var Zb = function(a, b) {
  chrome.tabs.get(a, function(a) {
    Yb(a, b)
  })
}, Yb = function(a, b) {
  if(a) {
    var c = a.id;
    chrome.windows.update(a.windowId, {focused:!0}, function() {
      chrome.tabs.update(c, {active:!0}, b)
    })
  }else {
    b(null)
  }
}, $b = function(a, b, c) {
  chrome.tabs.query({url:a}, function(a) {
    a && 0 < a.length ? Yb(a[0], c) : chrome.tabs.create({url:b}, c)
  })
};
var P = function() {
};
P.prototype.getMessage = function(a, b) {
  return this.Hc(a, b).message
};
P.prototype.Hc = function(a, b) {
  for(var c = [], d = {}, f = /{{(\w+?)}}/g, g = f.exec(a);null != g;) {
    b ? b[g[1]] && (d[g[1]] = b[g[1]]) : d[g[1]] = d[g[1]], g = f.exec(a)
  }
  for(var h in d) {
    h && (b && (a = a.replace(RegExp("{{" + h + "}}", "g"), d[h])), c.push(h))
  }
  return{message:a, bindings:c}
};
da(P);
var ac = function() {
  this.lb = ha()
}, bc = new ac;
ac.prototype.set = function(a) {
  this.lb = a
};
ac.prototype.reset = function() {
  this.set(ha())
};
ac.prototype.get = function() {
  return this.lb
};
var cc = function(a) {
  this.Ob = a || "";
  this.Pb = bc
};
e = cc.prototype;
e.Qb = !0;
e.Ma = !0;
e.Vb = !0;
e.Ub = !0;
e.Na = !1;
e.Wb = !1;
var Q = function(a) {
  return 10 > a ? "0" + a : String(a)
}, dc = function(a, b) {
  var c = (a.Qa() - b) / 1E3, d = c.toFixed(3), f = 0;
  if(1 > c) {
    f = 2
  }else {
    for(;100 > c;) {
      f++, c *= 10
    }
  }
  for(;0 < f--;) {
    d = " " + d
  }
  return d
}, ec = function(a) {
  cc.call(this, a)
};
q(ec, cc);
ec.prototype.fc = function(a) {
  var b = [];
  b.push(this.Ob, " ");
  if(this.Ma) {
    var c = new Date(a.Qa());
    b.push("[", Q(c.getFullYear() - 2E3) + Q(c.getMonth() + 1) + Q(c.getDate()) + " " + Q(c.getHours()) + ":" + Q(c.getMinutes()) + ":" + Q(c.getSeconds()) + "." + Q(Math.floor(c.getMilliseconds() / 10)), "] ")
  }
  this.Vb && b.push("[", dc(a, this.Pb.get()), "s] ");
  this.Ub && b.push("[", a.Oa(), "] ");
  this.Wb && b.push("[", a.la().name, "] ");
  b.push(a.getMessage());
  this.Na && a.Sb() && b.push("\n", a.Tb());
  this.Qb && b.push("\n");
  return b.join("")
};
var fc = function() {
  this.Ta = n(this.$b, this);
  this.ma = new ec;
  this.ma.Ma = !1;
  this.Sa = this.ma.Na = !1;
  this.Ra = "";
  this.Rb = {}
};
fc.prototype.ob = function(a) {
  if(a != this.Sa) {
    var b = rb();
    a ? b.oa(this.Ta) : b.ra(this.Ta);
    this.Sa = a
  }
};
fc.prototype.$b = function(a) {
  if(!this.Rb[a.Oa()]) {
    var b = this.ma.fc(a), c = gc;
    if(c) {
      switch(a.la()) {
        case ib:
          hc(c, "info", b);
          break;
        case jb:
          hc(c, "error", b);
          break;
        case kb:
          hc(c, "warn", b);
          break;
        default:
          hc(c, "debug", b)
      }
    }else {
      window.opera ? window.opera.postError(b) : this.Ra += b
    }
  }
};
var gc = window.console, hc = function(a, b, c) {
  if(a[b]) {
    a[b](c)
  }else {
    a.log(c)
  }
};
!C && !B || B && B && 9 <= $a || C && F("1.9.1");
B && F("9");
var R = function(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
};
R.prototype.r = !1;
R.prototype.defaultPrevented = !1;
R.prototype.Pa = !0;
R.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.Pa = !1
};
var ic = function(a) {
  ic[" "](a);
  return a
};
ic[" "] = ca;
var jc = !B || B && 9 <= $a, kc = B && !F("9");
!D || F("528");
C && F("1.9b") || B && F("8") || Qa && F("9.5") || D && F("528");
C && !F("8") || B && F("9");
var S = function(a, b) {
  a && this.ea(a, b)
};
q(S, R);
S.prototype.target = null;
e = S.prototype;
e.relatedTarget = null;
e.offsetX = 0;
e.offsetY = 0;
e.clientX = 0;
e.clientY = 0;
e.screenX = 0;
e.screenY = 0;
e.button = 0;
e.keyCode = 0;
e.charCode = 0;
e.ctrlKey = !1;
e.altKey = !1;
e.shiftKey = !1;
e.metaKey = !1;
e.$a = null;
e.ea = function(a, b) {
  var c = this.type = a.type;
  R.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(C) {
      var f;
      t: {
        try {
          ic(d.nodeName);
          f = !0;
          break t
        }catch(g) {
        }
        f = !1
      }
      f || (d = null)
    }
  }else {
    "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement)
  }
  this.relatedTarget = d;
  this.offsetX = D || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = D || void 0 !== a.offsetY ? a.offsetY : a.layerY;
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
  this.$a = a;
  a.defaultPrevented && this.preventDefault();
  delete this.r
};
e.preventDefault = function() {
  S.zc.preventDefault.call(this);
  var a = this.$a;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, kc) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
var lc = "closure_listenable_" + (1E6 * Math.random() | 0), mc = function(a) {
  try {
    return!(!a || !a[lc])
  }catch(b) {
    return!1
  }
}, nc = 0;
var oc = function(a, b, c, d, f, g) {
  this.p = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!f;
  this.S = g;
  this.key = ++nc;
  this.removed = this.R = !1
};
oc.prototype.na = function() {
  this.removed = !0;
  this.S = this.src = this.proxy = this.p = null
};
var pc = function(a) {
  this.src = a;
  this.g = {};
  this.Y = 0
};
e = pc.prototype;
e.gc = function() {
  return this.Y
};
e.add = function(a, b, c, d, f) {
  var g = this.g[a];
  g || (g = this.g[a] = [], this.Y++);
  var h = qc(g, b, d, f);
  -1 < h ? (a = g[h], c || (a.R = !1)) : (a = new oc(b, null, this.src, a, !!d, f), a.R = c, g.push(a));
  return a
};
e.remove = function(a, b, c, d) {
  if(!(a in this.g)) {
    return!1
  }
  var f = this.g[a];
  b = qc(f, b, c, d);
  return-1 < b ? (f[b].na(), xa(f, b), 0 == f.length && (delete this.g[a], this.Y--), !0) : !1
};
e.Ya = function(a) {
  var b = a.type;
  if(!(b in this.g)) {
    return!1
  }
  var c = ya(this.g[b], a);
  c && (a.na(), 0 == this.g[b].length && (delete this.g[b], this.Y--));
  return c
};
e.sa = function(a, b, c, d) {
  a = this.g[a];
  var f = -1;
  a && (f = qc(a, b, c, d));
  return-1 < f ? a[f] : null
};
var qc = function(a, b, c, d) {
  for(var f = 0;f < a.length;++f) {
    var g = a[f];
    if(!g.removed && g.p == b && g.capture == !!c && g.S == d) {
      return f
    }
  }
  return-1
};
var rc = "closure_lm_" + (1E6 * Math.random() | 0), T = {}, sc = 0, tc = function(a, b, c, d, f) {
  if("array" == l(b)) {
    for(var g = 0;g < b.length;g++) {
      tc(a, b[g], c, d, f)
    }
    return null
  }
  c = uc(c);
  return mc(a) ? a.listen(b, c, d, f) : vc(a, b, c, !1, d, f)
}, vc = function(a, b, c, d, f, g) {
  if(!b) {
    throw Error("Invalid event type");
  }
  var h = !!f, p = wc(a);
  p || (a[rc] = p = new pc(a));
  c = p.add(b, c, d, f, g);
  if(c.proxy) {
    return c
  }
  d = xc();
  c.proxy = d;
  d.src = a;
  d.p = c;
  a.addEventListener ? a.addEventListener(b, d, h) : a.attachEvent(b in T ? T[b] : T[b] = "on" + b, d);
  sc++;
  return c
}, xc = function() {
  var a = yc, b = jc ? function(c) {
    return a.call(b.src, b.p, c)
  } : function(c) {
    c = a.call(b.src, b.p, c);
    if(!c) {
      return c
    }
  };
  return b
}, zc = function(a, b, c, d, f) {
  if("array" == l(b)) {
    for(var g = 0;g < b.length;g++) {
      zc(a, b[g], c, d, f)
    }
    return null
  }
  c = uc(c);
  return mc(a) ? a.Ic(b, c, d, f) : vc(a, b, c, !0, d, f)
}, Ac = function(a, b, c, d, f) {
  if("array" == l(b)) {
    for(var g = 0;g < b.length;g++) {
      Ac(a, b[g], c, d, f)
    }
    return null
  }
  c = uc(c);
  if(mc(a)) {
    return a.gb(b, c, d, f)
  }
  if(!a) {
    return!1
  }
  if(a = wc(a)) {
    if(b = a.sa(b, c, !!d, f)) {
      return Bc(b)
    }
  }
  return!1
}, Bc = function(a) {
  if("number" == typeof a || !a || a.removed) {
    return!1
  }
  var b = a.src;
  if(mc(b)) {
    return b.ka(a)
  }
  var c = a.type, d = a.proxy;
  b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(c in T ? T[c] : T[c] = "on" + c, d);
  sc--;
  (c = wc(b)) ? (c.Ya(a), 0 == c.gc() && (c.src = null, b[rc] = null)) : a.na();
  return!0
}, Dc = function(a, b, c, d) {
  var f = 1;
  if(a = wc(a)) {
    if(b = a.g[b]) {
      for(b = za(b), a = 0;a < b.length;a++) {
        var g = b[a];
        g && g.capture == c && !g.removed && (f &= !1 !== Cc(g, d))
      }
    }
  }
  return Boolean(f)
}, Cc = function(a, b) {
  var c = a.p, d = a.S || a.src;
  a.R && Bc(a);
  return c.call(d, b)
}, yc = function(a, b) {
  if(a.removed) {
    return!0
  }
  if(!jc) {
    var c = b || ba("window.event"), d = new S(c, this), f = !0;
    if(!(0 > c.keyCode || void 0 != c.returnValue)) {
      t: {
        var g = !1;
        if(0 == c.keyCode) {
          try {
            c.keyCode = -1;
            break t
          }catch(h) {
            g = !0
          }
        }
        if(g || void 0 == c.returnValue) {
          c.returnValue = !0
        }
      }
      c = [];
      for(g = d.currentTarget;g;g = g.parentNode) {
        c.push(g)
      }
      for(var g = a.type, p = c.length - 1;!d.r && 0 <= p;p--) {
        d.currentTarget = c[p], f &= Dc(c[p], g, !0, d)
      }
      for(p = 0;!d.r && p < c.length;p++) {
        d.currentTarget = c[p], f &= Dc(c[p], g, !1, d)
      }
    }
    return f
  }
  return Cc(a, new S(b, this))
}, wc = function(a) {
  a = a[rc];
  return a instanceof pc ? a : null
}, Ec = "__closure_events_fn_" + (1E9 * Math.random() >>> 0), uc = function(a) {
  s(a, "Listener can not be null.");
  if("function" == l(a)) {
    return a
  }
  s(a.handleEvent, "An object listener must have handleEvent method.");
  return a[Ec] || (a[Ec] = function(b) {
    return a.handleEvent(b)
  })
};
var U = function() {
  this.o = new pc(this);
  this.Zb = this
};
q(U, O);
U.prototype[lc] = !0;
e = U.prototype;
e.Kc = null;
e.Xa = function() {
  return this.Kc
};
e.addEventListener = function(a, b, c, d) {
  tc(this, a, b, c, d)
};
e.removeEventListener = function(a, b, c, d) {
  Ac(this, a, b, c, d)
};
e.dispatchEvent = function(a) {
  this.Ua();
  var b, c = this.Xa();
  if(c) {
    b = [];
    for(var d = 1;c;c = c.Xa()) {
      b.push(c), s(1E3 > ++d, "infinite loop")
    }
  }
  c = this.Zb;
  d = a.type || a;
  if(m(a)) {
    a = new R(a, c)
  }else {
    if(a instanceof R) {
      a.target = a.target || c
    }else {
      var f = a;
      a = new R(d, c);
      Ia(a, f)
    }
  }
  var f = !0, g;
  if(b) {
    for(var h = b.length - 1;!a.r && 0 <= h;h--) {
      g = a.currentTarget = b[h], f = g.Z(d, !0, a) && f
    }
  }
  a.r || (g = a.currentTarget = c, f = g.Z(d, !0, a) && f, a.r || (f = g.Z(d, !1, a) && f));
  if(b) {
    for(h = 0;!a.r && h < b.length;h++) {
      g = a.currentTarget = b[h], f = g.Z(d, !1, a) && f
    }
  }
  return f
};
e.listen = function(a, b, c, d) {
  this.Ua();
  return this.o.add(String(a), b, !1, c, d)
};
e.Ic = function(a, b, c, d) {
  return this.o.add(String(a), b, !0, c, d)
};
e.gb = function(a, b, c, d) {
  return this.o.remove(String(a), b, c, d)
};
e.ka = function(a) {
  return this.o.Ya(a)
};
e.Z = function(a, b, c) {
  a = this.o.g[String(a)];
  if(!a) {
    return!0
  }
  a = za(a);
  for(var d = !0, f = 0;f < a.length;++f) {
    var g = a[f];
    if(g && !g.removed && g.capture == b) {
      var h = g.p, p = g.S || g.src;
      g.R && this.ka(g);
      d = !1 !== h.call(p, c) && d
    }
  }
  return d && !1 != c.Pa
};
e.sa = function(a, b, c, d) {
  return this.o.sa(String(a), b, c, d)
};
e.Ua = function() {
  s(this.o, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
};
var V = {m:!0};
V.Rc = I;
V.Pc = J;
V.Qc = H;
V.Gc = function(a, b) {
  if(V.m) {
    var c = L(a);
    b && c && c.K(b);
    return c
  }
  return null
};
V.oa = function(a, b) {
  V.m && a && a.oa(b)
};
V.ra = function(a, b) {
  return V.m && a ? a.ra(b) : !1
};
V.log = function(a, b, c, d) {
  V.m && a && a.log(b, c, d)
};
V.error = function(a, b, c) {
  V.m && a && a.mc(b, c)
};
V.ja = function(a, b, c) {
  V.m && a && a.ja(b, c)
};
V.info = function(a, b, c) {
  V.m && a && a.info(b, c)
};
V.f = function(a, b, c) {
  V.m && a && a.f(b, c)
};
var Fc = function(a, b, c) {
  if("function" == l(a)) {
    c && (a = n(a, c))
  }else {
    if(a && "function" == typeof a.handleEvent) {
      a = n(a.handleEvent, a)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  return 2147483647 < b ? -1 : k.setTimeout(a, b || 0)
};
var Gc = function() {
};
Gc.prototype.hb = null;
Gc.prototype.Ba = function() {
  return this.hb || (this.hb = this.yc())
};
var Hc, W = function() {
};
q(W, Gc);
W.prototype.eb = function() {
  var a = this.ib();
  return a ? new ActiveXObject(a) : new XMLHttpRequest
};
W.prototype.yc = function() {
  var a = {};
  this.ib() && (a[0] = !0, a[1] = !0);
  return a
};
W.prototype.ib = function() {
  if(!this.jb && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var a = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        return new ActiveXObject(c), this.jb = c
      }catch(d) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.jb
};
Hc = new W;
var X = function(a) {
  U.call(this);
  this.headers = new Ja;
  this.M = a || null;
  this.s = !1;
  this.J = this.c = null;
  this.A = this.xa = this.L = "";
  this.D = this.da = this.I = this.fa = !1;
  this.t = 0;
  this.N = null;
  this.C = "";
  this.O = this.ub = !1
};
q(X, U);
X.prototype.d = V.Gc("goog.net.XhrIo");
var Ic = /^https?$/i, Jc = ["POST", "PUT"];
X.prototype.lc = function(a) {
  this.t = Math.max(0, a)
};
X.prototype.kc = function(a) {
  this.C = a
};
X.prototype.send = function(a, b, c, d) {
  if(this.c) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.L + "; newUri=" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.L = a;
  this.A = "";
  this.xa = b;
  this.fa = !1;
  this.s = !0;
  this.c = this.vb();
  this.J = this.M ? this.M.Ba() : Hc.Ba();
  this.c.onreadystatechange = n(this.wa, this);
  try {
    V.f(this.d, this.j("Opening Xhr")), this.da = !0, this.c.open(b, a, !0), this.da = !1
  }catch(f) {
    V.f(this.d, this.j("Error opening Xhr: " + f.message));
    this.Aa(5, f);
    return
  }
  a = c || "";
  var g = this.headers.clone();
  d && La(d, function(a, b) {
    g.set(b, a)
  });
  d = u(g.P(), Kc);
  c = k.FormData && a instanceof k.FormData;
  !(0 <= ua(Jc, b)) || d || c || g.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  La(g, function(a, b) {
    this.c.setRequestHeader(b, a)
  }, this);
  this.C && (this.c.responseType = this.C);
  "withCredentials" in this.c && (this.c.withCredentials = this.ub);
  try {
    this.za(), 0 < this.t && (this.O = B && F(9) && "number" == typeof this.c.timeout && void 0 !== this.c.ontimeout, V.f(this.d, this.j("Will abort after " + this.t + "ms if incomplete, xhr2 " + this.O)), this.O ? (this.c.timeout = this.t, this.c.ontimeout = n(this.Ca, this)) : this.N = Fc(this.Ca, this.t, this)), V.f(this.d, this.j("Sending request")), this.I = !0, this.c.send(a), this.I = !1
  }catch(h) {
    V.f(this.d, this.j("Send error: " + h.message)), this.Aa(5, h)
  }
};
var Kc = function(a) {
  return"content-type" == a.toLowerCase()
};
e = X.prototype;
e.vb = function() {
  return this.M ? this.M.eb() : Hc.eb()
};
e.Ca = function() {
  "undefined" != typeof aa && this.c && (this.A = "Timed out after " + this.t + "ms, aborting", V.f(this.d, this.j(this.A)), this.dispatchEvent("timeout"), this.abort(8))
};
e.Aa = function(a, b) {
  this.s = !1;
  this.c && (this.D = !0, this.c.abort(), this.D = !1);
  this.A = b;
  this.Ha();
  this.ga()
};
e.Ha = function() {
  this.fa || (this.fa = !0, this.dispatchEvent("complete"), this.dispatchEvent("error"))
};
e.abort = function() {
  this.c && this.s && (V.f(this.d, this.j("Aborting")), this.s = !1, this.D = !0, this.c.abort(), this.D = !1, this.dispatchEvent("complete"), this.dispatchEvent("abort"), this.ga())
};
e.wa = function() {
  this.ac() || (this.da || this.I || this.D ? this.Va() : this.dc())
};
e.dc = function() {
  this.Va()
};
e.Va = function() {
  if(this.s && "undefined" != typeof aa) {
    if(this.J[1] && 4 == this.F() && 2 == this.Q()) {
      V.f(this.d, this.j("Local request error detected and ignored"))
    }else {
      if(this.I && 4 == this.F()) {
        Fc(this.wa, 0, this)
      }else {
        if(this.dispatchEvent("readystatechange"), this.Hb()) {
          V.f(this.d, this.j("Request complete"));
          this.s = !1;
          try {
            this.Ja() ? (this.dispatchEvent("complete"), this.dispatchEvent("success")) : (this.A = this.Gb() + " [" + this.Q() + "]", this.Ha())
          }finally {
            this.ga()
          }
        }
      }
    }
  }
};
e.ga = function(a) {
  if(this.c) {
    this.za();
    var b = this.c, c = this.J[0] ? ca : null;
    this.J = this.c = null;
    a || this.dispatchEvent("ready");
    try {
      b.onreadystatechange = c
    }catch(d) {
      V.error(this.d, "Problem encountered resetting onreadystatechange: " + d.message)
    }
  }
};
e.za = function() {
  this.c && this.O && (this.c.ontimeout = null);
  "number" == typeof this.N && (k.clearTimeout(this.N), this.N = null)
};
e.Hb = function() {
  return 4 == this.F()
};
e.Ja = function() {
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
        b = !1
    }
  }
  return b || 0 === a && !this.uc()
};
e.uc = function() {
  var a = Xb(1, String(this.L));
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return Ic.test(a ? a.toLowerCase() : "")
};
e.F = function() {
  return this.c ? this.c.readyState : 0
};
e.Q = function() {
  try {
    return 2 < this.F() ? this.c.status : -1
  }catch(a) {
    return V.ja(this.d, "Can not get status: " + a.message), -1
  }
};
e.Gb = function() {
  try {
    return 2 < this.F() ? this.c.statusText : ""
  }catch(a) {
    return V.f(this.d, "Can not get status: " + a.message), ""
  }
};
e.jc = function() {
  try {
    if(!this.c) {
      return null
    }
    if("response" in this.c) {
      return this.c.response
    }
    switch(this.C) {
      case "":
      ;
      case "text":
        return this.c.responseText;
      case "arraybuffer":
        if("mozResponseArrayBuffer" in this.c) {
          return this.c.mozResponseArrayBuffer
        }
    }
    V.error(this.d, "Response type " + this.C + " is not supported on this browser");
    return null
  }catch(a) {
    return V.f(this.d, "Can not get response: " + a.message), null
  }
};
e.j = function(a) {
  return a + " [" + this.xa + " " + this.L + " " + this.Q() + "]"
};
var Lc = function() {
};
da(Lc);
Lc.ia();
var Mc = chrome.i18n.getMessage("4014224501758376361", ["{{receiverName}}"]), Nc = chrome.i18n.getMessage("6046507125919556913"), Oc = chrome.i18n.getMessage("1189144544819350763"), Pc = chrome.i18n.getMessage("3430817026795535765");
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
chrome.i18n.getMessage("8879729374562274188");
chrome.i18n.getMessage("9217039427324387516");
chrome.i18n.getMessage("872641383564597641");
chrome.i18n.getMessage("7864119253243497594");
chrome.i18n.getMessage("1104234694810969409");
chrome.i18n.getMessage("2884726392788153618");
chrome.i18n.getMessage("4687947362658561907");
chrome.i18n.getMessage("2942203478948533213");
chrome.i18n.getMessage("8847227464712783239");
chrome.i18n.getMessage("7661531377295243900");
chrome.i18n.getMessage("2480373522051304868");
chrome.i18n.getMessage("3268013795447421317");
chrome.i18n.getMessage("8119187687393606810");
chrome.i18n.getMessage("5453859777568475949");
chrome.i18n.getMessage("6181212922679547742");
chrome.i18n.getMessage("3051639087648999069");
chrome.i18n.getMessage("4223394109936547558");
chrome.i18n.getMessage("8288732448265345962");
chrome.i18n.getMessage("1318160328466758792");
chrome.i18n.getMessage("5849296180435940955");
angular.module("popupMenu", ["ngSanitize", "chrome_i18n"]);
var Qc = function(a) {
  var b = new fc;
  rb().K(nb);
  b.ob(!0);
  this.d = L("cv.PopupMenu");
  this.b = new Pb([], null, null, null, !1);
  this.a = a;
  this.mb = new Tb;
  this.ca = new Sb("popup");
  this.w = null;
  a.init = !0;
  a.onClickLearnCastEnabledPage = n(this.va, this, "http://support.google.com/chromecast/go/castenabledpage");
  this.rb();
  this.tb();
  this.pb();
  this.sb();
  this.qb();
  this.ua();
  this.ba();
  this.ca.ea();
  this.ca.listen("event_to_popup", this.nb, this);
  this.n("init", {})
}, Y = ["PopupMenuCtrl"], Z = k;
Y[0] in Z || !Z.execScript || Z.execScript("var " + Y[0]);
for(var $;Y.length && ($ = Y.shift());) {
  Y.length || void 0 === Qc ? Z = Z[$] ? Z[$] : Z[$] = {} : Z[$] = Qc
}
Qc.$inject = ["$scope"];
e = Qc.prototype;
e.k = function(a) {
  this.a.component = a
};
e.ba = function() {
  this.b.issue && "fatal" == this.b.issue.severity ? this.k("issue_notifier") : this.w ? this.k("waiting") : this.a.selectedActivity ? this.k("activity_control") : this.b.isAppInTab && !this.b.settings.castAppNotificationDismissed ? this.k("cast_app_notification") : this.k("receiver_picker")
};
e.rb = function() {
  this.a.dismissCastAppNotification = n(function() {
    this.b.settings.castAppNotificationDismissed = !0;
    this.ha();
    this.ba()
  }, this)
};
e.tb = function() {
  this.Da();
  this.a.onClickReceiver = n(this.Ib, this);
  this.a.onClickDeviceMissing = n(this.va, this, "http://support.google.com/chromecast/go/nodevices");
  this.a.sendFeedback = n(this.Jb, this);
  this.a.showOptions = n(this.Lb, this);
  this.a.showHelp = n(this.Kb, this);
  this.a.disableProjectScreen = (1920 < window.screen.width * window.devicePixelRatio || 1080 < window.screen.height * window.devicePixelRatio) && !(0 <= ra(Gb, 29))
};
e.va = function(a) {
  $b("http://support.google.com/chromecast/go*", a, function() {
    window.close()
  })
};
e.pb = function() {
  this.B();
  this.a.changeDevice = n(function() {
    this.k("receiver_picker")
  }, this);
  this.a.showOriginalTab = n(this.Eb, this);
  this.a.castThisTab = n(function() {
    this.a.disableCastButton || this.Bb()
  }, this);
  this.a.playOrPause = n(function() {
    this.a.disableMediaControl || this.Db()
  }, this);
  this.a.muteOrUmute = n(function() {
    this.a.disableMediaControl || this.Cb()
  }, this);
  this.a.stopActivity = n(this.Fb, this)
};
e.sb = function() {
  this.Ga();
  this.a.actOnIssueWithOptAct = n(this.La, this, !1);
  this.a.actOnIssueWithDefaultAct = n(this.La, this, !0)
};
e.qb = function() {
  this.Fa();
  this.a.sharedState = this.a.sharedState || {};
  this.a.sharedState.selectingCaptureSurface = !1;
  this.a.updateSettings = n(this.ha, this);
  this.a.toggleAudioIfTab = n(this.Mb, this)
};
e.Mb = function() {
  "tab" == this.b.settings.captureSurface && (this.a.settings.lowFpsMode = !this.a.settings.lowFpsMode, this.ha(), this.a.sharedState.selectingCaptureSurface = !1)
};
e.ha = function() {
  this.b.settings.captureSurface = this.a.settings.captureSurface;
  this.b.settings.lowFpsMode = this.a.settings.lowFpsMode;
  this.b.settings.mirrorQualityId = this.a.settings.mirrorQualityId;
  this.Ia();
  this.n("update_settings", this.b.settings)
};
e.Fa = function() {
  this.a.settings = this.b.settings
};
e.ua = function() {
  this.a.waitingTitle = this.w ? P.ia().getMessage(Mc, {receiverName:this.w.receiver.name}) : ""
};
e.Da = function() {
  Ca(this.b.receiverActs, function(a, b) {
    return a.receiver.name.localeCompare(b.receiver.name)
  });
  this.a.receiverActs = this.b.receiverActs;
  this.Ia()
};
e.Ia = function() {
  this.a.receiverListTitle = "tab" == this.b.settings.captureSurface ? this.b.settings.lowFpsMode ? Oc : P.ia().getMessage(Nc, this.a) : Pc
};
e.B = function() {
  this.a.selectedActivity && (this.a.disableCastButton = this.b.castOfCurrentTab && this.a.selectedActivity.id == this.b.castOfCurrentTab.id, this.Ab())
};
e.Ab = function() {
  s(null != this.a.selectedActivity);
  this.a.sharedState = this.a.sharedState || {};
  this.a.sharedState.selectingMirrorQuality = !1;
  this.a.mirrorQualities = Jb;
  var a = this.a.selectedActivity;
  this.a.showMirrorQualityToggle = "mirror_tab" == a.activityType && a.isLocal && 0 < a.tabId;
  (a = a.mediaPlayerStatus) ? (this.a.disableMediaControl = !1, a && (this.a.hasPause = null != a.hasPause ? a.hasPause : !0, this.a.playPauseImg = a.timeProgress ? "/data/pause.png" : "/data/play.png", this.a.muteUnmuteImg = a.muted ? "/data/mute.png" : "/data/unmute.png")) : (this.a.disableMediaControl = !0, this.a.playPauseImg = "/data/play.png", this.a.muteUnmuteImg = "/data/mute.png")
};
e.Eb = function() {
  var a = this.a.selectedActivity;
  !a || !a.tabId || 0 > a.tabId || Zb(a.tabId, function(a) {
    a && window.close()
  })
};
e.Ga = function() {
  this.b.issue && (null == this.b.issue.activityId || this.a.selectedActivity && this.b.issue.activityId == this.a.selectedActivity.id) ? (this.a.issueTitle = this.b.issue.title, this.a.issueMessage = this.b.issue.message, this.a.issueOptActText = this.b.issue.optActionText, this.a.issueDefaultActText = this.b.issue.defaultActionText, this.a.showIssueOptActButton = 0 < this.b.issue.optActionText.length) : (this.a.issueTitle = "", this.a.issueMessage = "", this.a.issueOptActText = "", this.a.issueDefaultActText = 
  "", this.a.showIssueOptActButton = !1)
};
e.n = function(a, b) {
  var c = new Mb("popup", "CastApi", this.mb.hc(), a, b);
  this.ca.ic("popup_menu_request", c);
  return c
};
e.La = function(a) {
  this.b.issue && (a = new Nb(this.b.issue.id, a), this.d.info("Act on issue " + JSON.stringify(this.b.issue)), this.n("act_on_issue", a))
};
e.Bb = function() {
  this.a.selectedActivity && this.Ea(this.a.selectedActivity.receiver, "tab")
};
e.Ka = function(a, b) {
  return{activityId:a, rampRequest:b}
};
e.Db = function() {
  var a = this.a.selectedActivity;
  a && a.mediaPlayerStatus && (this.n(a.mediaPlayerStatus.timeProgress ? "PauseMedia" : "PlayMedia", this.Ka(a.id, {})), a.mediaPlayerStatus.timeProgress = !a.mediaPlayerStatus.timeProgress, this.B())
};
e.Cb = function() {
  var a = this.a.selectedActivity;
  a && a.mediaPlayerStatus && (this.n("SetMediaVolume", this.Ka(a.id, new Kb(void 0, !a.mediaPlayerStatus.muted))), a.mediaPlayerStatus.muted = !a.mediaPlayerStatus.muted, this.B())
};
e.Fb = function() {
  this.a.selectedActivity && (this.d.info("Stop activity " + JSON.stringify(this.a.selectedActivity)), this.n("stop_activity", this.a.selectedActivity.id), this.a.selectedActivity = null, this.k("receiver_picker"))
};
e.Ib = function(a) {
  this.w ? this.d.info("There is an activity in launch; cannot launch another activity") : a.activity ? (this.a.selectedActivity = a.activity, this.ya(), this.B(), this.k("activity_control")) : this.Ea(a.receiver, this.b.settings.captureSurface)
};
e.Ea = function(a, b) {
  this.d.info("Project " + b);
  this.a.waitingTitle = "Casting to " + a.name;
  this.k("waiting");
  this.n("tab" == b ? "launch_tab_mirror" : "launch_desktop_mirror", a.id)
};
e.Jb = function() {
  this.kb("feedback.html")
};
e.Lb = function() {
  this.kb("options.html")
};
e.Kb = function() {
  $b("http://support.google.com/chromecast/go/castfromchrome*", "http://support.google.com/chromecast/go/castfromchrome", function() {
    window.close()
  })
};
e.kb = function(a) {
  a = chrome.extension.getURL(a);
  $b(a + "*", a, function() {
    window.close()
  })
};
e.nb = function(a, b) {
  if("model_update" == b.type) {
    this.b = b.message;
    this.wb();
    var c = u(this.b.receiverActs, function(a) {
      return a.activity && a.activity.isInLaunch
    });
    this.w = c ? c.activity : null;
    this.a.$apply(n(function() {
      this.a.init = !1;
      this.ya();
      this.B();
      this.Ga();
      this.Da();
      this.ua();
      this.ba();
      this.Fa();
      this.a.isAppInTab = this.b.isAppInTab
    }, this))
  }
};
e.wb = function() {
  this.zb();
  this.a.selectedActivity || (this.b.castOfCurrentTab ? this.a.selectedActivity = this.b.castOfCurrentTab : 1 == this.yb() && (this.a.selectedActivity = this.xb()))
};
e.zb = function() {
  this.a.selectedActivity && (u(this.b.receiverActs, n(function(a) {
    return a.activity && a.activity.id == this.a.selectedActivity.id
  }, this)) || (this.a.selectedActivity = null))
};
e.yb = function() {
  return wa(this.b.receiverActs, function(a) {
    return a.activity && a.activity.isLocal
  })
};
e.xb = function() {
  var a = u(this.b.receiverActs, function(a) {
    return a.activity && a.activity.isLocal
  });
  return a ? a.activity : null
};
e.ya = function() {
  if(this.a.selectedActivity) {
    if(this.a.selectedActivity.iconUrl) {
      var a = this.a.selectedActivity.iconUrl;
      this.a.selectedActivity.iconUrl = "data/default_activity.png";
      "data/default_activity.png" != a && Rc(a, n(function(a) {
        a && (this.a.selectedActivity.iconUrl = a, this.a.$apply())
      }, this))
    }else {
      this.a.selectedActivity.iconUrl = "data/default_activity.png"
    }
  }
};
var Rc = function(a, b) {
  var c = new X;
  c.kc("blob");
  c.lc(1500);
  zc(c, ["complete", "timeout"], function() {
    if(c.Ja()) {
      var a = window.webkitURL.createObjectURL(c.jc());
      b(a)
    }else {
      b(null)
    }
  });
  c.send(a, "GET")
};

