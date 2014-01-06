var d;
window.hL = !0;
chrome.cast = chrome.cast || {};
chrome.cast.media = chrome.cast.media || {};
var aa = aa || {}, h = this, ba = function(a, b, c) {
  a = a.split(".");
  c = c || h;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var e;a.length && (e = a.shift());) {
    a.length || void 0 === b ? c = c[e] ? c[e] : c[e] = {} : c[e] = b;
  }
}, ca = function(a, b) {
  for (var c = a.split("."), e = b || h, f;f = c.shift();) {
    if (null != e[f]) {
      e = e[f];
    } else {
      return null;
    }
  }
  return e;
}, m = function() {
}, da = function(a) {
  a.F = function() {
    return a.ew ? a.ew : a.ew = new a;
  };
}, ea = function(a) {
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
}, n = function(a) {
  return void 0 !== a;
}, p = function(a) {
  return "array" == ea(a);
}, fa = function(a) {
  var b = ea(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
}, r = function(a) {
  return "string" == typeof a;
}, ga = function(a) {
  return "number" == typeof a;
}, ha = function(a) {
  return "function" == ea(a);
}, ia = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
}, la = function(a) {
  return a[ja] || (a[ja] = ++ka);
}, ja = "closure_uid_" + (1E9 * Math.random() >>> 0), ka = 0, ma = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
}, na = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, e);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
}, s = function(a, b, c) {
  s = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ma : na;
  return s.apply(null, arguments);
}, oa = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
}, t = Date.now || function() {
  return+new Date;
}, u = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.q = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.QK = function(a, c, g) {
    var k = Array.prototype.slice.call(arguments, 2);
    return b.prototype[c].apply(a, k);
  };
};
Function.prototype.bind = Function.prototype.bind || function(a, b) {
  if (1 < arguments.length) {
    var c = Array.prototype.slice.call(arguments, 1);
    c.unshift(this, a);
    return s.apply(null, c);
  }
  return s(this, a);
};
var pa = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c;
}, qa = function(a, b) {
  for (var c = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < c.length;) {
    e += c.shift() + f.shift();
  }
  return e + c.join("%s");
}, ra = function(a) {
  return/^[\s\xa0]*$/.test(a);
}, sa = function(a, b) {
  var c = String(a).toLowerCase(), e = String(b).toLowerCase();
  return c < e ? -1 : c == e ? 0 : 1;
}, za = function(a, b) {
  if (b) {
    return a.replace(ta, "&amp;").replace(ua, "&lt;").replace(va, "&gt;").replace(wa, "&quot;").replace(xa, "&#39;");
  }
  if (!ya.test(a)) {
    return a;
  }
  -1 != a.indexOf("&") && (a = a.replace(ta, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(ua, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(va, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(wa, "&quot;"));
  -1 != a.indexOf("'") && (a = a.replace(xa, "&#39;"));
  return a;
}, ta = /&/g, ua = /</g, va = />/g, wa = /"/g, xa = /'/g, ya = /[&<>"']/, Da = function(a) {
  return Aa(a, "&") ? "document" in h ? Ba(a) : Ca(a) : a;
}, Ba = function(a, b) {
  var c = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, e;
  e = b ? b.createElement("div") : document.createElement("div");
  return a.replace(Ea, function(a, b) {
    var k = c[a];
    if (k) {
      return k;
    }
    if ("#" == b.charAt(0)) {
      var l = Number("0" + b.substr(1));
      isNaN(l) || (k = String.fromCharCode(l));
    }
    k || (e.innerHTML = a + " ", k = e.firstChild.nodeValue.slice(0, -1));
    return c[a] = k;
  });
}, Ca = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if ("#" == c.charAt(0)) {
          var e = Number("0" + c.substr(1));
          if (!isNaN(e)) {
            return String.fromCharCode(e);
          }
        }
        return a;
    }
  });
}, Ea = /&([^;\s<&]+);?/g, Fa = function(a, b, c) {
  c && (a = Da(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = za(a));
  return a;
}, Ga = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"}, Ha = {"'":"\\'"}, Ia = function(a) {
  a = String(a);
  if (a.quote) {
    return a.quote();
  }
  for (var b = ['"'], c = 0;c < a.length;c++) {
    var e = a.charAt(c), f = e.charCodeAt(0), g = b, k = c + 1, l;
    if (!(l = Ga[e])) {
      if (!(31 < f && 127 > f)) {
        if (e in Ha) {
          e = Ha[e];
        } else {
          if (e in Ga) {
            e = Ha[e] = Ga[e];
          } else {
            f = e;
            l = e.charCodeAt(0);
            if (31 < l && 127 > l) {
              f = e;
            } else {
              if (256 > l) {
                if (f = "\\x", 16 > l || 256 < l) {
                  f += "0";
                }
              } else {
                f = "\\u", 4096 > l && (f += "0");
              }
              f += l.toString(16).toUpperCase();
            }
            e = Ha[e] = f;
          }
        }
      }
      l = e;
    }
    g[k] = l;
  }
  b.push('"');
  return b.join("");
}, Aa = function(a, b) {
  return-1 != a.indexOf(b);
}, Ja = function(a) {
  return Array.prototype.join.call(arguments, "");
}, Ka = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ t()).toString(36);
}, Ma = function(a, b) {
  for (var c = 0, e = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), g = Math.max(e.length, f.length), k = 0;0 == c && k < g;k++) {
    var l = e[k] || "", q = f[k] || "", x = RegExp("(\\d*)(\\D*)", "g"), D = RegExp("(\\d*)(\\D*)", "g");
    do {
      var R = x.exec(l) || ["", "", ""], N = D.exec(q) || ["", "", ""];
      if (0 == R[0].length && 0 == N[0].length) {
        break;
      }
      c = La(0 == R[1].length ? 0 : parseInt(R[1], 10), 0 == N[1].length ? 0 : parseInt(N[1], 10)) || La(0 == R[2].length, 0 == N[2].length) || La(R[2], N[2]);
    } while (0 == c);
  }
  return c;
}, La = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}, Na = function(a) {
  isFinite(a) && (a = String(a));
  return r(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
var Oa = function() {
  this.rx = t();
}, Pa = new Oa;
Oa.prototype.set = function(a) {
  this.rx = a;
};
Oa.prototype.reset = function() {
  this.set(t());
};
Oa.prototype.get = function() {
  return this.rx;
};
var Qa = function(a) {
  this.XG = a || "";
  this.ZG = Pa;
};
d = Qa.prototype;
d.$G = !0;
d.Nk = !0;
d.gH = !0;
d.fH = !0;
d.Ok = !1;
d.Lo = !1;
var Ra = function(a) {
  return 10 > a ? "0" + a : String(a);
}, Sa = function(a, b) {
  var c = (a.Zv() - b) / 1E3, e = c.toFixed(3), f = 0;
  if (1 > c) {
    f = 2;
  } else {
    for (;100 > c;) {
      f++, c *= 10;
    }
  }
  for (;0 < f--;) {
    e = " " + e;
  }
  return e;
}, Ta = function(a) {
  Qa.call(this, a);
};
u(Ta, Qa);
Ta.prototype.cw = function(a) {
  var b = [];
  b.push(this.XG, " ");
  if (this.Nk) {
    var c = new Date(a.Zv());
    b.push("[", Ra(c.getFullYear() - 2E3) + Ra(c.getMonth() + 1) + Ra(c.getDate()) + " " + Ra(c.getHours()) + ":" + Ra(c.getMinutes()) + ":" + Ra(c.getSeconds()) + "." + Ra(Math.floor(c.getMilliseconds() / 10)), "] ");
  }
  this.gH && b.push("[", Sa(a, this.ZG.get()), "s] ");
  this.fH && b.push("[", a.Cv(), "] ");
  this.Lo && b.push("[", a.Uo().name, "] ");
  b.push(a.getMessage());
  this.Ok && a.cH() && b.push("\n", a.dH());
  this.$G && b.push("\n");
  return b.join("");
};
var Ua = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, Ua) : this.stack = Error().stack || "";
  a && (this.message = String(a));
};
u(Ua, Error);
Ua.prototype.name = "CustomError";
var Va;
var Wa = function(a, b) {
  b.unshift(a);
  Ua.call(this, qa.apply(null, b));
  b.shift();
};
u(Wa, Ua);
Wa.prototype.name = "AssertionError";
var Xa = function(a, b, c, e) {
  var f = "Assertion failed";
  if (c) {
    var f = f + (": " + c), g = e
  } else {
    a && (f += ": " + a, g = b);
  }
  throw new Wa("" + f, g || []);
}, v = function(a, b, c) {
  a || Xa("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
}, Ya = function(a, b) {
  throw new Wa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}, Za = function(a, b, c) {
  ga(a) || Xa("Expected number but got %s: %s.", [ea(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
}, w = function(a, b, c) {
  r(a) || Xa("Expected string but got %s: %s.", [ea(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
}, $a = function(a, b, c) {
  ia(a) || Xa("Expected object but got %s: %s.", [ea(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
}, ab = function(a, b, c) {
  p(a) || Xa("Expected array but got %s: %s.", [ea(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
}, bb = function(a, b, c) {
  "boolean" == typeof a || Xa("Expected boolean but got %s: %s.", [ea(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
}, cb = function(a, b, c, e) {
  a instanceof b || Xa("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a;
};
var db = function(a, b, c, e, f) {
  this.reset(a, b, c, e, f);
};
db.prototype.mp = null;
db.prototype.lp = null;
var eb = 0;
d = db.prototype;
d.reset = function(a, b, c, e, f) {
  "number" == typeof f || eb++;
  this.jI = e || t();
  this.Qe = a;
  this.Cw = b;
  this.hI = c;
  delete this.mp;
  delete this.lp;
};
d.Cv = function() {
  return this.hI;
};
d.cH = function() {
  return this.mp;
};
d.RI = function(a) {
  this.mp = a;
};
d.dH = function() {
  return this.lp;
};
d.SI = function(a) {
  this.lp = a;
};
d.Uo = function() {
  return this.Qe;
};
d.Uc = function(a) {
  this.Qe = a;
};
d.getMessage = function() {
  return this.Cw;
};
d.Lv = function(a) {
  this.Cw = a;
};
d.Zv = function() {
  return this.jI;
};
var fb = function() {
  v(!0, "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear();
}, gb, hb = function() {
  gb || (gb = new fb);
  return gb;
};
fb.prototype.LI = function(a, b, c) {
  var e = (this.sp + 1) % 5E3;
  this.sp = e;
  if (this.up) {
    return e = this.de[e], e.reset(a, b, c), e;
  }
  this.up = 4999 == e;
  return this.de[e] = new db(a, b, c);
};
fb.prototype.clear = function() {
  this.de = Array(5E3);
  this.sp = -1;
  this.up = !1;
};
fb.prototype.tI = function(a) {
  var b = this.de;
  if (b[0]) {
    var c = this.sp, e = this.up ? c : -1;
    do {
      e = (e + 1) % 5E3, a(b[e]);
    } while (e != c);
  }
};
var y = Array.prototype, ib = y.indexOf ? function(a, b, c) {
  v(null != a.length);
  return y.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (r(a)) {
    return r(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
}, z = y.forEach ? function(a, b, c) {
  v(null != a.length);
  y.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var e = a.length, f = r(a) ? a.split("") : a, g = 0;g < e;g++) {
    g in f && b.call(c, f[g], g, a);
  }
}, jb = function(a, b, c) {
  for (var e = r(a) ? a.split("") : a, f = a.length - 1;0 <= f;--f) {
    f in e && b.call(c, e[f], f, a);
  }
}, kb = y.filter ? function(a, b, c) {
  v(null != a.length);
  return y.filter.call(a, b, c);
} : function(a, b, c) {
  for (var e = a.length, f = [], g = 0, k = r(a) ? a.split("") : a, l = 0;l < e;l++) {
    if (l in k) {
      var q = k[l];
      b.call(c, q, l, a) && (f[g++] = q);
    }
  }
  return f;
}, lb = y.map ? function(a, b, c) {
  v(null != a.length);
  return y.map.call(a, b, c);
} : function(a, b, c) {
  for (var e = a.length, f = Array(e), g = r(a) ? a.split("") : a, k = 0;k < e;k++) {
    k in g && (f[k] = b.call(c, g[k], k, a));
  }
  return f;
}, mb = y.some ? function(a, b, c) {
  v(null != a.length);
  return y.some.call(a, b, c);
} : function(a, b, c) {
  for (var e = a.length, f = r(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(c, f[g], g, a)) {
      return!0;
    }
  }
  return!1;
}, nb = y.every ? function(a, b, c) {
  v(null != a.length);
  return y.every.call(a, b, c);
} : function(a, b, c) {
  for (var e = a.length, f = r(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && !b.call(c, f[g], g, a)) {
      return!1;
    }
  }
  return!0;
}, ob = function(a, b, c) {
  var e = 0;
  z(a, function(a, g, k) {
    b.call(c, a, g, k) && ++e;
  }, c);
  return e;
}, A = function(a, b, c) {
  b = pb(a, b, c);
  return 0 > b ? null : r(a) ? a.charAt(b) : a[b];
}, pb = function(a, b, c) {
  for (var e = a.length, f = r(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(c, f[g], g, a)) {
      return g;
    }
  }
  return-1;
}, qb = function(a, b) {
  return 0 <= ib(a, b);
}, rb = function(a) {
  if (!p(a)) {
    for (var b = a.length - 1;0 <= b;b--) {
      delete a[b];
    }
  }
  a.length = 0;
}, tb = function(a, b) {
  var c = ib(a, b), e;
  (e = 0 <= c) && sb(a, c);
  return e;
}, sb = function(a, b) {
  v(null != a.length);
  return 1 == y.splice.call(a, b, 1).length;
}, ub = function(a, b, c) {
  b = pb(a, b, c);
  return 0 <= b ? (sb(a, b), !0) : !1;
}, vb = function(a) {
  return y.concat.apply(y, arguments);
}, wb = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), e = 0;e < b;e++) {
      c[e] = a[e];
    }
    return c;
  }
  return[];
}, yb = function(a, b, c, e) {
  v(null != a.length);
  return y.splice.apply(a, xb(arguments, 1));
}, xb = function(a, b, c) {
  v(null != a.length);
  return 2 >= arguments.length ? y.slice.call(a, b) : y.slice.call(a, b, c);
}, Ab = function(a, b) {
  v(null != a.length);
  y.sort.call(a, b || zb);
}, zb = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
var Bb = "StopIteration" in h ? h.StopIteration : Error("StopIteration"), Cb = function() {
};
Cb.prototype.next = function() {
  throw Bb;
};
Cb.prototype.Re = function() {
  return this;
};
var Db = function(a) {
  if (a instanceof Cb) {
    return a;
  }
  if ("function" == typeof a.Re) {
    return a.Re(!1);
  }
  if (fa(a)) {
    var b = 0, c = new Cb;
    c.next = function() {
      for (;;) {
        if (b >= a.length) {
          throw Bb;
        }
        if (b in a) {
          return a[b++];
        }
        b++;
      }
    };
    return c;
  }
  throw Error("Not implemented");
}, Eb = function(a, b, c) {
  if (fa(a)) {
    try {
      z(a, b, c);
    } catch (e) {
      if (e !== Bb) {
        throw e;
      }
    }
  } else {
    a = Db(a);
    try {
      for (;;) {
        b.call(c, a.next(), void 0, a);
      }
    } catch (f) {
      if (f !== Bb) {
        throw f;
      }
    }
  }
};
var Fb = function(a, b, c) {
  for (var e in a) {
    b.call(c, a[e], e, a);
  }
}, Gb = function(a, b, c) {
  for (var e in a) {
    if (b.call(c, a[e], e, a)) {
      return!0;
    }
  }
  return!1;
}, Hb = function(a) {
  var b = [], c = 0, e;
  for (e in a) {
    b[c++] = a[e];
  }
  return b;
}, Ib = function(a) {
  var b = [], c = 0, e;
  for (e in a) {
    b[c++] = e;
  }
  return b;
}, Jb = function(a, b) {
  for (var c in a) {
    if (a[c] == b) {
      return!0;
    }
  }
  return!1;
}, Kb = function(a, b, c) {
  for (var e in a) {
    if (b.call(c, a[e], e, a)) {
      return e;
    }
  }
}, Lb = function(a, b, c) {
  return(b = Kb(a, b, c)) && a[b];
}, Mb = function(a) {
  for (var b in a) {
    return!1;
  }
  return!0;
}, Nb = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c;
}, Ob = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = a[c];
  }
  return b;
}, Pb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), Qb = function(a, b) {
  for (var c, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for (c in e) {
      a[c] = e[c];
    }
    for (var g = 0;g < Pb.length;g++) {
      c = Pb[g], Object.prototype.hasOwnProperty.call(e, c) && (a[c] = e[c]);
    }
  }
};
var B = function(a, b) {
  this.P = {};
  this.Z = [];
  this.Ob = this.la = 0;
  var c = arguments.length;
  if (1 < c) {
    if (c % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var e = 0;e < c;e += 2) {
      this.set(arguments[e], arguments[e + 1]);
    }
  } else {
    a && this.xk(a);
  }
};
d = B.prototype;
d.J = function() {
  return this.la;
};
d.R = function() {
  this.cg();
  for (var a = [], b = 0;b < this.Z.length;b++) {
    a.push(this.P[this.Z[b]]);
  }
  return a;
};
d.fb = function() {
  this.cg();
  return this.Z.concat();
};
d.Ja = function(a) {
  return Rb(this.P, a);
};
d.jg = function(a) {
  for (var b = 0;b < this.Z.length;b++) {
    var c = this.Z[b];
    if (Rb(this.P, c) && this.P[c] == a) {
      return!0;
    }
  }
  return!1;
};
d.equals = function(a, b) {
  if (this === a) {
    return!0;
  }
  if (this.la != a.J()) {
    return!1;
  }
  var c = b || Sb;
  this.cg();
  for (var e, f = 0;e = this.Z[f];f++) {
    if (!c(this.get(e), a.get(e))) {
      return!1;
    }
  }
  return!0;
};
var Sb = function(a, b) {
  return a === b;
};
d = B.prototype;
d.vb = function() {
  return 0 == this.la;
};
d.clear = function() {
  this.P = {};
  this.Ob = this.la = this.Z.length = 0;
};
d.remove = function(a) {
  return Rb(this.P, a) ? (delete this.P[a], this.la--, this.Ob++, this.Z.length > 2 * this.la && this.cg(), !0) : !1;
};
d.cg = function() {
  if (this.la != this.Z.length) {
    for (var a = 0, b = 0;a < this.Z.length;) {
      var c = this.Z[a];
      Rb(this.P, c) && (this.Z[b++] = c);
      a++;
    }
    this.Z.length = b;
  }
  if (this.la != this.Z.length) {
    for (var e = {}, b = a = 0;a < this.Z.length;) {
      c = this.Z[a], Rb(e, c) || (this.Z[b++] = c, e[c] = 1), a++;
    }
    this.Z.length = b;
  }
};
d.get = function(a, b) {
  return Rb(this.P, a) ? this.P[a] : b;
};
d.set = function(a, b) {
  Rb(this.P, a) || (this.la++, this.Z.push(a), this.Ob++);
  this.P[a] = b;
};
d.xk = function(a) {
  var b;
  a instanceof B ? (b = a.fb(), a = a.R()) : (b = Ib(a), a = Hb(a));
  for (var c = 0;c < b.length;c++) {
    this.set(b[c], a[c]);
  }
};
d.clone = function() {
  return new B(this);
};
d.JG = function() {
  this.cg();
  for (var a = {}, b = 0;b < this.Z.length;b++) {
    var c = this.Z[b];
    a[c] = this.P[c];
  }
  return a;
};
d.mF = function() {
  return this.Re(!0);
};
d.AD = function() {
  return this.Re(!1);
};
d.Re = function(a) {
  this.cg();
  var b = 0, c = this.Z, e = this.P, f = this.Ob, g = this, k = new Cb;
  k.next = function() {
    for (;;) {
      if (f != g.Ob) {
        throw Error("The map has changed since the iterator was created");
      }
      if (b >= c.length) {
        throw Bb;
      }
      var k = c[b++];
      return a ? k : e[k];
    }
  };
  return k;
};
var Rb = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
var Tb = function(a) {
  if ("function" == typeof a.J) {
    a = a.J();
  } else {
    if (fa(a) || r(a)) {
      a = a.length;
    } else {
      var b = 0, c;
      for (c in a) {
        b++;
      }
      a = b;
    }
  }
  return a;
}, Ub = function(a) {
  if ("function" == typeof a.R) {
    return a.R();
  }
  if (r(a)) {
    return a.split("");
  }
  if (fa(a)) {
    for (var b = [], c = a.length, e = 0;e < c;e++) {
      b.push(a[e]);
    }
    return b;
  }
  return Hb(a);
}, Vb = function(a) {
  if ("function" == typeof a.fb) {
    return a.fb();
  }
  if ("function" != typeof a.R) {
    if (fa(a) || r(a)) {
      var b = [];
      a = a.length;
      for (var c = 0;c < a;c++) {
        b.push(c);
      }
      return b;
    }
    return Ib(a);
  }
}, Wb = function(a, b, c) {
  if ("function" == typeof a.forEach) {
    a.forEach(b, c);
  } else {
    if (fa(a) || r(a)) {
      z(a, b, c);
    } else {
      for (var e = Vb(a), f = Ub(a), g = f.length, k = 0;k < g;k++) {
        b.call(c, f[k], e && e[k], a);
      }
    }
  }
}, Xb = function(a, b, c) {
  if ("function" == typeof a.every) {
    return a.every(b, c);
  }
  if (fa(a) || r(a)) {
    return nb(a, b, c);
  }
  for (var e = Vb(a), f = Ub(a), g = f.length, k = 0;k < g;k++) {
    if (!b.call(c, f[k], e && e[k], a)) {
      return!1;
    }
  }
  return!0;
};
var Yb = function(a) {
  this.P = new B;
  a && this.xk(a);
}, Zb = function(a) {
  var b = typeof a;
  return "object" == b && a || "function" == b ? "o" + la(a) : b.substr(0, 1) + a;
};
d = Yb.prototype;
d.J = function() {
  return this.P.J();
};
d.add = function(a) {
  this.P.set(Zb(a), a);
};
d.xk = function(a) {
  a = Ub(a);
  for (var b = a.length, c = 0;c < b;c++) {
    this.add(a[c]);
  }
};
d.removeAll = function(a) {
  a = Ub(a);
  for (var b = a.length, c = 0;c < b;c++) {
    this.remove(a[c]);
  }
};
d.remove = function(a) {
  return this.P.remove(Zb(a));
};
d.clear = function() {
  this.P.clear();
};
d.vb = function() {
  return this.P.vb();
};
d.contains = function(a) {
  return this.P.Ja(Zb(a));
};
d.R = function() {
  return this.P.R();
};
d.clone = function() {
  return new Yb(this);
};
d.equals = function(a) {
  return this.J() == Tb(a) && this.xH(a);
};
d.xH = function(a) {
  var b = Tb(a);
  if (this.J() > b) {
    return!1;
  }
  !(a instanceof Yb) && 5 < b && (a = new Yb(a));
  return Xb(this, function(b) {
    var e = a;
    return "function" == typeof e.contains ? e.contains(b) : "function" == typeof e.jg ? e.jg(b) : fa(e) || r(e) ? qb(e, b) : Jb(e, b);
  });
};
d.Re = function() {
  return this.P.Re(!1);
};
var $b, ac, bc, cc, dc, ec, fc, gc, hc, ic = function() {
  return h.navigator ? h.navigator.userAgent : null;
};
cc = bc = ac = $b = !1;
var jc;
if (jc = ic()) {
  var kc = h.navigator;
  $b = 0 == jc.lastIndexOf("Opera", 0);
  ac = !$b && (Aa(jc, "MSIE") || Aa(jc, "Trident"));
  bc = !$b && Aa(jc, "WebKit");
  cc = !$b && !bc && !ac && "Gecko" == kc.product;
}
var lc = $b, C = ac, mc = cc, E = bc, nc = h.navigator, oc = nc && nc.platform || "";
dc = Aa(oc, "Mac");
ec = Aa(oc, "Win");
fc = Aa(oc, "Linux");
var pc = ic();
gc = !!pc && Aa(pc, "Android");
hc = !!pc && Aa(pc, "iPhone");
var qc = !!pc && Aa(pc, "iPad"), rc = function() {
  var a = h.document;
  return a ? a.documentMode : void 0;
}, sc;
t: {
  var tc = "", uc;
  if (lc && h.opera) {
    var vc = h.opera.version, tc = "function" == typeof vc ? vc() : vc
  } else {
    if (mc ? uc = /rv\:([^\);]+)(\)|;)/ : C ? uc = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : E && (uc = /WebKit\/(\S+)/), uc) {
      var wc = uc.exec(ic()), tc = wc ? wc[1] : ""
    }
  }
  if (C) {
    var xc = rc();
    if (xc > parseFloat(tc)) {
      sc = String(xc);
      break t;
    }
  }
  sc = tc;
}
var yc = sc, zc = {}, Ac = function(a) {
  return zc[a] || (zc[a] = 0 <= Ma(yc, a));
}, Bc = h.document, Cc = Bc && C ? rc() || ("CSS1Compat" == Bc.compatMode ? parseInt(yc, 10) : 5) : void 0;
var Dc = function(a, b, c) {
  c = c || h;
  var e = c.onerror, f = !!b;
  E && !Ac("535.3") && (f = !f);
  c.onerror = function(b, c, l, q, x) {
    e && e(b, c, l, q, x);
    a({message:b, fileName:c, Kv:l, SK:q, error:x});
    return f;
  };
}, Fc = function(a, b) {
  try {
    var c;
    var e = ca("window.location.href");
    if (r(a)) {
      c = {message:a, name:"Unknown error", lineNumber:"Not available", fileName:e, stack:"Not available"};
    } else {
      var f, g, k = !1;
      try {
        f = a.lineNumber || a.Kv || "Not available";
      } catch (l) {
        f = "Not available", k = !0;
      }
      try {
        g = a.fileName || a.filename || a.sourceURL || h.$googDebugFname || e;
      } catch (q) {
        g = "Not available", k = !0;
      }
      c = !k && a.lineNumber && a.fileName && a.stack && a.message && a.name ? a : {message:a.message || "Not available", name:a.name || "UnknownError", lineNumber:f, fileName:g, stack:a.stack || "Not available"};
    }
    return "Message: " + za(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + za(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + za(Ec(b) + "-> ");
  } catch (x) {
    return "Exception trying to expose exception! You win, we lose. " + x;
  }
}, Ec = function(a) {
  return Gc(a || arguments.callee.caller, []);
}, Gc = function(a, b) {
  var c = [];
  if (qb(b, a)) {
    c.push("[...circular reference...]");
  } else {
    if (a && 50 > b.length) {
      c.push(Hc(a) + "(");
      for (var e = a.arguments, f = 0;f < e.length;f++) {
        0 < f && c.push(", ");
        var g;
        g = e[f];
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
            g = (g = Hc(g)) ? g : "[fn]";
            break;
          default:
            g = typeof g;
        }
        40 < g.length && (g = g.substr(0, 40) + "...");
        c.push(g);
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(Gc(a.caller, b));
      } catch (k) {
        c.push("[exception trying to get caller]\n");
      }
    } else {
      a ? c.push("[...long stack...]") : c.push("[end]");
    }
  }
  return c.join("");
}, Hc = function(a) {
  if (Ic[a]) {
    return Ic[a];
  }
  a = String(a);
  if (!Ic[a]) {
    var b = /function ([^\(]+)/.exec(a);
    Ic[a] = b ? b[1] : "[Anonymous]";
  }
  return Ic[a];
}, Ic = {};
var Jc = function(a) {
  this.$f = a;
};
Jc.prototype.Ea = null;
Jc.prototype.Qe = null;
Jc.prototype.Gp = null;
Jc.prototype.Pc = null;
var Kc = function(a, b) {
  this.name = a;
  this.value = b;
};
Kc.prototype.toString = function() {
  return this.name;
};
var Lc = new Kc("SHOUT", 1200), Mc = new Kc("SEVERE", 1E3), Nc = new Kc("WARNING", 900), Oc = new Kc("INFO", 800), Pc = new Kc("CONFIG", 700), Qc = new Kc("FINE", 500), Rc = new Kc("FINER", 400), F = new Kc("FINEST", 300);
d = Jc.prototype;
d.getName = function() {
  return this.$f;
};
d.WI = function(a) {
  this.Pc || (this.Pc = []);
  this.Pc.push(a);
};
d.bJ = function(a) {
  var b = this.Pc;
  return!!b && tb(b, a);
};
d.getParent = function() {
  return this.Ea;
};
d.getChildren = function() {
  this.Gp || (this.Gp = {});
  return this.Gp;
};
d.Uc = function(a) {
  this.Qe = a;
};
d.Uo = function() {
  return this.Qe;
};
d.sw = function() {
  if (this.Qe) {
    return this.Qe;
  }
  if (this.Ea) {
    return this.Ea.sw();
  }
  Ya("Root logger has no level set.");
  return null;
};
d.zf = function(a) {
  return a.value >= this.sw().value;
};
d.log = function(a, b, c) {
  this.zf(a) && (ha(b) && (b = b()), this.XI(this.YI(a, b, c)));
};
d.YI = function(a, b, c) {
  var e = hb().LI(a, b, this.$f);
  c && (e.RI(c), e.SI(Fc(c, arguments.callee.caller)));
  return e;
};
d.w = function(a, b) {
  this.log(Mc, a, b);
};
d.e = function(a, b) {
  this.log(Nc, a, b);
};
d.info = function(a, b) {
  this.log(Oc, a, b);
};
d.config = function(a, b) {
  this.log(Pc, a, b);
};
d.ka = function(a, b) {
  this.log(Qc, a, b);
};
d.pB = function(a, b) {
  this.log(Rc, a, b);
};
d.Lg = function(a, b) {
  this.log(F, a, b);
};
d.XI = function(a) {
  var b = "log:" + a.getMessage();
  h.console && (h.console.timeStamp ? h.console.timeStamp(b) : h.console.markTimeline && h.console.markTimeline(b));
  h.msWriteProfilerMark && h.msWriteProfilerMark(b);
  for (b = this;b;) {
    b.pK(a), b = b.getParent();
  }
};
d.pK = function(a) {
  if (this.Pc) {
    for (var b = 0, c;c = this.Pc[b];b++) {
      c(a);
    }
  }
};
d.kK = function(a) {
  this.Ea = a;
};
d.eK = function(a, b) {
  this.getChildren()[a] = b;
};
var Sc = {}, Tc = null, Uc = function() {
  Tc || (Tc = new Jc(""), Sc[""] = Tc, Tc.Uc(Pc));
}, Vc = function() {
  Uc();
  return Tc;
}, G = function(a) {
  Uc();
  var b;
  if (!(b = Sc[a])) {
    b = new Jc(a);
    var c = a.lastIndexOf("."), e = a.substr(c + 1), c = G(a.substr(0, c));
    c.eK(e, b);
    b.kK(c);
    Sc[a] = b;
  }
  return b;
}, Wc = function(a) {
  return function(b) {
    (a || Vc()).w("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Kv + ")");
  };
};
var Xc = function() {
  var a = new Ta;
  a.Nk = !0;
  a.Lo = !0;
  a.Ok = !0;
  var b = "";
  hb().tI(function(c) {
    b += a.cw(c) + "\n";
  });
  return b;
}, Yc = function(a, b, c, e, f) {
  a.log(e ? e : Oc, b);
  try {
    a.log(f ? f : Qc, "--the object is " + JSON.stringify(c));
  } catch (g) {
  }
};
var Zc, $c = Hb({iL:"cv", SL:"ramp", cL:"cm"}), ad = Hb({uL:"launch_service", VK:"activity_service", UK:"activity", bL:"channel_connect_request", aL:"channel_connect_accepted"}), bd = function(a, b) {
  this.type = a;
  this.message = b;
};
G("cv.ChannelMessage");
var cd = function(a) {
  return p(a) && "cm" == a[0] && ia(a[1]) && n(a[1].type);
};
var dd = function(a, b) {
  this.id = a;
  this.name = b;
  this.isTabProjected = this.ipAddress = null;
}, ed = function() {
  this.url = this.text = null;
}, fd = function(a, b) {
  this.activityType = a;
  this.receiver = b;
  this.description = this.parameters = null;
  this.disconnectPolicy = "continue";
}, gd = function(a, b) {
  this.activityId = a;
  this.status = b;
  this.errorString = null;
  this.extraData = {};
}, hd = function(a, b) {
  this.eventSequenceId = null;
  this.activityId = a;
  this.state = b;
  this.imageUrl = this.title = this.contentId = null;
  this.timeProgress = !1;
  this.error = this.mediaTracks = this.contentInfo = this.muted = this.volume = this.duration = this.position = null;
  this.hasPause = !0;
}, id = function(a) {
  this.activityId = a;
  this.status = null;
  this.success = !1;
  this.errorString = null;
}, jd = function(a, b) {
  this.id = a;
  this.type = b;
  this.selected = this.language = this.name = null;
}, kd = function(a, b, c, e) {
  this.activityId = a;
  this.cmdId = b;
  this.method = c;
  this.requests = e;
}, ld = [2, 4];
"undefined" != typeof chrome && "undefined" != typeof chrome.runtime && "undefined" != typeof chrome.runtime.getManifest || window.postMessage({source:"CastApi", event:"Hello", fM:ld}, "*");
var md = function(a, b, c, e, f) {
  this.source = a;
  this.target = b;
  this.seq = c;
  this.type = e;
  this.message = f;
}, nd = function(a, b) {
  this.activityType = a;
  this.receivers = b;
}, od = function(a, b, c) {
  this.activityId = a;
  this.namespace = b;
  this.message = c;
};
var pd = function(a, b) {
  this.cmd_id = a;
  this.type = b;
};
pd.prototype.toJson = function() {
  return JSON.stringify(["ramp", this]);
};
var qd = function(a, b, c, e) {
  a = a[c];
  null != a && (b[e ? e : c] = a);
}, H = function(a, b, c, e) {
  a = a[b];
  if (null == a) {
    if (c) {
      throw "Mandatory property " + b + " was " + a;
    }
    return n(e) ? e : null;
  }
  return a;
}, rd = function(a) {
  v(a.seq);
  var b = a.seq, c = a.message.rampRequest, e = null;
  switch(a.type) {
    case "LoadMedia":
      e = new pd(b, "LOAD");
      qd(c, e, "src");
      qd(c, e, "title");
      qd(c, e, "autoplay");
      qd(c, e, "contentInfo", "content_info");
      qd(c, e, "imageUrl", "image_url");
      break;
    case "PlayMedia":
      e = new pd(b, "PLAY");
      qd(c, e, "position");
      break;
    case "PauseMedia":
      e = new pd(b, "STOP");
      break;
    case "SetMediaVolume":
      e = new pd(b, "VOLUME");
      qd(c, e, "volume");
      qd(c, e, "muted");
      break;
    case "SelectMediaTracks":
      e = new pd(b, "SELECT_TRACKS");
      qd(c, e, "enabledTracks", "enabled");
      qd(c, e, "disabledTracks", "disabled");
      break;
    case "MediaStatus":
      e = new pd(b, "INFO");
      break;
    case "MediaKeyResponse":
      e = new pd(c.cmdId, "KEY_RESPONSE"), qd(c, e, "tokens");
  }
  return e ? {message:e, error:null} : {message:null, error:"Unknown message type"};
}, sd = function(a, b) {
  return null != a.cmd_id && null != a.type && a.type == b;
}, td = function(a) {
  if (!a) {
    return[];
  }
  var b = [];
  z(a, function(a) {
    var e = H(a, "id", !0), f = H(a, "type", !0), e = new jd(e, f);
    e.name = H(a, "name", !1);
    e.language = H(a, "lang", !1);
    e.selected = H(a, "selected", !1);
    b.push(e);
  });
  return b;
};
var ud = function(a, b, c, e, f) {
  this.guid = a;
  this.manufacturer = b || "";
  this.model = c || "";
  this.displayName = e || "Unnamed";
  this.claimCode = f || "";
  this.accessToken = this.refreshToken = this.authCode = "";
  this.accessTokenExpiryTime = 0;
  this.channelToken = "";
  this.channelTokenExpiryTime = 0;
};
ud.prototype.KA = function() {
  return!!this.guid;
};
G("cv.CloudDevice");
var vd, wd, xd, yd, zd, Ad, Bd;
Bd = Ad = zd = yd = xd = wd = vd = !1;
var Cd = ic();
Cd && (-1 != Cd.indexOf("Firefox") ? vd = !0 : -1 != Cd.indexOf("Camino") ? wd = !0 : -1 != Cd.indexOf("iPhone") || -1 != Cd.indexOf("iPod") ? xd = !0 : -1 != Cd.indexOf("iPad") ? yd = !0 : -1 != Cd.indexOf("Chrome") ? Ad = !0 : -1 != Cd.indexOf("Android") ? zd = !0 : -1 != Cd.indexOf("Safari") && (Bd = !0));
var Dd = vd, Ed = wd, Fd = xd, Gd = yd, Hd = zd, Id = Ad, Jd = Bd;
var Kd = function(a) {
  return(a = a.exec(ic())) ? a[1] : "";
}, Ld = function() {
  if (Dd) {
    return Kd(/Firefox\/([0-9.]+)/);
  }
  if (C || lc) {
    return yc;
  }
  if (Id) {
    return Kd(/Chrome\/([0-9.]+)/);
  }
  if (Jd) {
    return Kd(/Version\/([0-9.]+)/);
  }
  if (Fd || Gd) {
    var a;
    if (a = /Version\/(\S+).*Mobile\/(\S+)/.exec(ic())) {
      return a[1] + "." + a[2];
    }
  } else {
    if (Hd) {
      return(a = Kd(/Android\s+([0-9.]+)/)) ? a : Kd(/Version\/([0-9.]+)/);
    }
    if (Ed) {
      return Kd(/Camino\/([0-9.]+)/);
    }
  }
  return "";
}();
var Md = function(a, b, c, e, f, g, k, l) {
  this.id = a;
  this.name = b;
  this.videoWidth = c;
  this.videoHeight = e;
  this.videoResolution = c + "x" + e;
  this.minVideoBitrate = f;
  this.maxVideoBitrate = g;
  this.videoQuality = k;
  this.audioBitrate = l;
}, Nd = new Md("high", "High (720p)", 1280, 720, 2E3, 2500, 56, 128), Od = [new Md("highest", "Extreme (720p high bitrate)", 1280, 720, 4E3, 5E3, 56, 128), Nd, new Md("low", "Standard (480p)", 854, 480, 750, 1500, 56, 128)], Pd = function(a) {
  return A(Od, function(b) {
    return b.id == a;
  });
};
var Qd = function() {
  this.videoBitrate = Nd.maxVideoBitrate;
  this.minVideoBitrate = Nd.minVideoBitrate;
  this.maxVideoBitrate = Nd.maxVideoBitrate;
  this.videoQuality = Nd.videoQuality;
  this.minWidth = Nd.videoWidth;
  this.minHeight = Nd.videoHeight;
  this.audioBitrate = Nd.audioBitrate;
  this.useOpus = !0;
  this.bufferedMode = "on";
  this.bufferSizeMillis = 500;
  this.maxFrameRate = 30;
  this.enablePacing = Id && 0 <= Ma(Ld, 28);
  this.enableVideoTcp = this.enableAudioTcp = !1;
  this.enableAudioNack = !0;
  this.allowAutoResize = !1;
  this.captureSurface = "tab";
  this.lowFpsMode = !1;
  this.autoFeedback = this.zoomModeEnabled = !0;
  this.preferredVideoCodec = "CAST1";
}, Rd = {"640x360":[640, 360], "854x480":[854, 480], "1280x720":[1280, 720]};
d = Qd.prototype;
d.update = function(a) {
  for (var b in this) {
    ha(this[b]) || (null != a[b] && ea(this[b]) == ea(a[b]) ? this[b] = a[b] : G("cv.MirrorTabSettings").e("Failed to load mirror settings for key [" + b + "]:" + a[b]));
  }
};
d.bC = function(a) {
  r(a) && (a = parseInt(a, 10));
  this.maxVideoBitrate = a = Math.min(5E3, Math.max(100, a));
};
d.cC = function(a) {
  r(a) && (a = parseInt(a, 10));
  this.minVideoBitrate = a = Math.min(5E3, Math.max(100, a));
};
d.eC = function(a) {
  r(a) && (a = parseInt(a, 10));
  0 < a && (this.videoQuality = a);
};
d.Fn = function(a) {
  r(a) && (a = parseInt(a, 10));
  this.audioBitrate = Math.min(128, Math.max(56, a));
};
d.$B = function(a) {
  r(a) && (a = parseInt(a, 10));
  0 <= a && (this.bufferSizeMillis = a);
};
d.OE = function() {
  return 0 == this.bufferSizeMillis ? 0 : this.enablePacing ? this.bufferSizeMillis + 100 : this.bufferSizeMillis;
};
d.dC = function(a) {
  this.enablePacing = a;
};
d.YB = function(a) {
  this.enableAudioTcp = a;
};
d.fC = function(a) {
  this.enableVideoTcp = a;
};
d.XB = function(a) {
  this.enableAudioNack = a;
};
d.ZB = function(a) {
  this.autoFeedback = a;
};
d.jK = function(a) {
  r(a) && (a = parseInt(a, 10));
  this.minWidth = Math.max(100, a);
};
d.iK = function(a) {
  r(a) && (a = parseInt(a, 10));
  this.minHeight = Math.max(100, a);
};
d.aC = function(a) {
  r(a) && (a = parseInt(a, 10));
  1 <= a && (this.maxFrameRate = a);
};
d.Ls = function(a) {
  if (a = Rd[a]) {
    this.jK(a[0]), this.iK(a[1]);
  }
};
d.vK = function() {
  return String(this.minWidth + "x" + this.minHeight);
};
d.Al = function() {
  var a = A(Od, function(a) {
    return a.videoResolution == this.vK() && a.videoQuality == this.videoQuality && a.minVideoBitrate == this.minVideoBitrate && a.maxVideoBitrate == this.maxVideoBitrate && a.audioBitrate == this.audioBitrate;
  }, this);
  return a ? a.id : "custom";
};
d.by = function(a) {
  if (a = Pd(a)) {
    this.Ls(a.videoResolution), this.videoQuality = a.videoQuality, this.minVideoBitrate = a.minVideoBitrate, this.maxVideoBitrate = a.maxVideoBitrate, this.audioBitrate = a.audioBitrate;
  }
};
var Sd = function() {
};
u(Sd, Error);
var I = function() {
  this.h = "pending";
  this.Pc = [];
  this.Xa = this.$h = void 0;
}, Td = function() {
  Ua.call(this, "Multiple attempts to set the state of this Result");
};
u(Td, Ua);
d = I.prototype;
d.X = function() {
  return this.h;
};
d.Ia = function() {
  return this.$h;
};
d.getError = function() {
  return this.Xa;
};
d.Kb = function(a, b) {
  this.pk() ? this.Pc.push({Ta:a, scope:b || null}) : a.call(b, this);
};
d.ea = function(a) {
  if (this.pk()) {
    this.$h = a, this.h = "success", this.ou();
  } else {
    if (!this.qu()) {
      throw new Td;
    }
  }
};
d.Ma = function(a) {
  if (this.pk()) {
    this.Xa = a, this.h = "error", this.ou();
  } else {
    if (!this.qu()) {
      throw new Td;
    }
  }
};
d.ou = function() {
  var a = this.Pc;
  this.Pc = [];
  for (var b = 0;b < a.length;b++) {
    var c = a[b];
    c.Ta.call(c.scope, this);
  }
};
d.pk = function() {
  return "pending" == this.h;
};
d.cancel = function() {
  return this.pk() ? (this.Ma(new Sd), !0) : !1;
};
d.qu = function() {
  return "error" == this.h && this.Xa instanceof Sd;
};
var Ud = function() {
  this.hasNetworkSoftware = this.networkDescription = this.gpu = this.cpu = this.googleUsername = null;
};
var Vd = function() {
  this.dismissClicks = this.earliestTimeToShowWarning = this.sessionsBeforeWarning = 0;
  this.castAppNotificationDismissed = !1;
};
var J = function() {
  this.a = G("cv.Settings");
  this.O = {};
  this.NA();
  this.Gm = this.Hm = this.Dm = !1;
};
da(J);
d = J.prototype;
d.NA = function() {
  this.O.tabCaptureSettings = new Qd;
  this.O.feedback = new Ud;
  this.O.userNotification = new Vd;
  this.O.siteTokens = {};
  this.O.customDomains = [];
  this.O.fixedIps = [];
  this.O.receiverUrl = "";
  this.O.flingEnabled = !1;
  this.O.customReceiverVersion = "";
  this.O.enableCustomReceiverVersion = !1;
  this.O.appEngineReceiverIds = [];
  this.O.enableCloud = !1;
  this.O.cloudDevice = {};
  this.O.v2Eanbled = !1;
  this.O.mirrorLinkProtection = !1;
};
d.uF = function() {
  this.Hm = !0;
};
d.Fe = function() {
  this.Dm ? (this.a.info("Saving settings to storage."), this.Hm ? (localStorage.settings = JSON.stringify(this.O), this.Gm && (chrome.storage.local.clear(), this.Gm = !1)) : chrome.storage.local.set(this.O, s(function() {
    chrome.runtime.lastError ? this.a.e("Failed to save settings to chrome.storage.") : this.a.info("Successfully saved settings to storage.");
  }, this))) : this.a.e("Aborting saving settings before initialization.");
};
d.TA = function(a, b) {
  return n(this.O[a]) ? ea(this.O[a]) != ea(b) ? (this.a.e("Failed to load setting due to incompatible type: " + a), !1) : ia(b) && 0 == Ib(b).length ? !1 : !0 : (this.a.e("Not loading setting with key: " + a), !1);
};
d.sn = function(a, b) {
  try {
    for (var c in b) {
      c in this.O && ("tabCaptureSettings" == c ? this.O.tabCaptureSettings.update(b[c]) : this.TA(c, b[c]) && (this.O[c] = b[c]));
    }
  } catch (e) {
  } finally {
    this.a.info("Storage initialized."), this.Dm = !0, a();
  }
};
d.tF = function(a) {
  if (this.Dm) {
    a();
  } else {
    if (this.a.info("Loading settings from storage."), this.Hm) {
      var b = localStorage.settings;
      if (b) {
        this.sn(a, JSON.parse(b));
      } else {
        try {
          chrome.storage.local.get(s(function(b) {
            var c = null;
            !chrome.runtime.lastError && 0 < Object.keys(b).length && (c = b, this.Gm = !0);
            this.sn(a, c);
          }, this));
        } catch (c) {
          this.a.info("storage.local error"), a();
        }
      }
    } else {
      try {
        chrome.storage.local.get(s(this.sn, this, a));
      } catch (e) {
        this.a.info("storage.local error"), a();
      }
    }
  }
};
d.pa = function() {
  return this.O.tabCaptureSettings;
};
d.gq = function() {
  return "";
};
d.yF = function() {
  return!1;
};
d.Qx = function() {
  return JSON.stringify({mirrorTabSettings:this.pa()});
};
d.lH = function() {
  return this.O.fixedIps;
};
d.MB = function() {
  return this.O.enableCloud;
};
d.xC = function(a) {
  this.O.feedback = a;
  this.Fe();
};
d.kj = function() {
  return this.O.userNotification;
};
d.qv = function(a) {
  this.O.userNotification = a;
  this.Fe();
};
d.zG = function() {
  return this.O.siteTokens;
};
d.IG = function(a) {
  this.O.siteTokens = a;
  this.Fe();
};
d.Ks = function() {
  return this.O.customDomains;
};
d.sC = function(a) {
  this.O.customDomains = a;
  this.Fe();
};
var K = function() {
};
d = K.prototype;
d.Mo = !1;
d.Of = function() {
  return this.Mo;
};
d.W = function() {
  this.Mo || (this.Mo = !0, this.k());
};
d.uh = function(a) {
  this.Ik(oa(Wd, a));
};
d.Ik = function(a, b) {
  this.pi || (this.pi = []);
  this.pi.push(s(a, b));
};
d.k = function() {
  if (this.pi) {
    for (;this.pi.length;) {
      this.pi.shift()();
    }
  }
};
var Wd = function(a) {
  a && "function" == typeof a.W && a.W();
};
var L = function(a, b) {
  this.type = a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.Se = !1;
  this.tv = !0;
};
L.prototype.k = function() {
};
L.prototype.W = function() {
};
L.prototype.stopPropagation = function() {
  this.Se = !0;
};
L.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.tv = !1;
};
var Xd = function(a) {
  Xd[" "](a);
  return a;
};
Xd[" "] = m;
var Yd = function(a, b) {
  try {
    return Xd(a[b]), !0;
  } catch (c) {
  }
  return!1;
};
var Zd = !C || C && 9 <= Cc, $d = C && !Ac("9");
!E || Ac("528");
mc && Ac("1.9b") || C && Ac("8") || lc && Ac("9.5") || E && Ac("528");
mc && !Ac("8") || C && Ac("9");
var ae = function(a, b) {
  L.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.fg = this.state = null;
  a && this.A(a, b);
};
u(ae, L);
d = ae.prototype;
d.A = function(a, b) {
  var c = this.type = a.type;
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var e = a.relatedTarget;
  e ? mc && (Yd(e, "nodeName") || (e = null)) : "mouseover" == c ? e = a.fromElement : "mouseout" == c && (e = a.toElement);
  this.relatedTarget = e;
  this.offsetX = E || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = E || void 0 !== a.offsetY ? a.offsetY : a.layerY;
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
  this.fg = a;
  a.defaultPrevented && this.preventDefault();
};
d.stopPropagation = function() {
  ae.q.stopPropagation.call(this);
  this.fg.stopPropagation ? this.fg.stopPropagation() : this.fg.cancelBubble = !0;
};
d.preventDefault = function() {
  ae.q.preventDefault.call(this);
  var a = this.fg;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, $d) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
d.Hv = function() {
  return this.fg;
};
d.k = function() {
};
var be = "closure_listenable_" + (1E6 * Math.random() | 0), ce = function(a) {
  try {
    return!(!a || !a[be]);
  } catch (b) {
    return!1;
  }
}, de = 0;
var ee = function(a, b, c, e, f, g) {
  this.Pb = a;
  this.proxy = b;
  this.src = c;
  this.type = e;
  this.capture = !!f;
  this.Zk = g;
  this.key = ++de;
  this.removed = this.Yk = !1;
};
ee.prototype.el = function() {
  this.removed = !0;
  this.Zk = this.src = this.proxy = this.Pb = null;
};
var fe = function(a) {
  this.src = a;
  this.Ua = {};
  this.li = 0;
};
d = fe.prototype;
d.wI = function() {
  return this.li;
};
d.add = function(a, b, c, e, f) {
  var g = this.Ua[a];
  g || (g = this.Ua[a] = [], this.li++);
  var k = ge(g, b, e, f);
  -1 < k ? (a = g[k], c || (a.Yk = !1)) : (a = new ee(b, null, this.src, a, !!e, f), a.Yk = c, g.push(a));
  return a;
};
d.remove = function(a, b, c, e) {
  if (!(a in this.Ua)) {
    return!1;
  }
  var f = this.Ua[a];
  b = ge(f, b, c, e);
  return-1 < b ? (f[b].el(), sb(f, b), 0 == f.length && (delete this.Ua[a], this.li--), !0) : !1;
};
d.xw = function(a) {
  var b = a.type;
  if (!(b in this.Ua)) {
    return!1;
  }
  var c = tb(this.Ua[b], a);
  c && (a.el(), 0 == this.Ua[b].length && (delete this.Ua[b], this.li--));
  return c;
};
d.removeAll = function(a) {
  var b = 0, c;
  for (c in this.Ua) {
    if (!a || c == a) {
      for (var e = this.Ua[c], f = 0;f < e.length;f++) {
        ++b, e[f].el();
      }
      delete this.Ua[c];
      this.li--;
    }
  }
  return b;
};
d.oi = function(a, b, c, e) {
  a = this.Ua[a];
  var f = -1;
  a && (f = ge(a, b, c, e));
  return-1 < f ? a[f] : null;
};
d.hasListener = function(a, b) {
  var c = n(a), e = n(b);
  return Gb(this.Ua, function(f) {
    for (var g = 0;g < f.length;++g) {
      if (!(c && f[g].type != a || e && f[g].capture != b)) {
        return!0;
      }
    }
    return!1;
  });
};
var ge = function(a, b, c, e) {
  for (var f = 0;f < a.length;++f) {
    var g = a[f];
    if (!g.removed && g.Pb == b && g.capture == !!c && g.Zk == e) {
      return f;
    }
  }
  return-1;
};
var he = "closure_lm_" + (1E6 * Math.random() | 0), ie = {}, je = 0, M = function(a, b, c, e, f) {
  if (p(b)) {
    for (var g = 0;g < b.length;g++) {
      M(a, b[g], c, e, f);
    }
    return null;
  }
  c = ke(c);
  return ce(a) ? a.listen(b, c, e, f) : le(a, b, c, !1, e, f);
}, le = function(a, b, c, e, f, g) {
  if (!b) {
    throw Error("Invalid event type");
  }
  var k = !!f, l = me(a);
  l || (a[he] = l = new fe(a));
  c = l.add(b, c, e, f, g);
  if (c.proxy) {
    return c;
  }
  e = ne();
  c.proxy = e;
  e.src = a;
  e.Pb = c;
  a.addEventListener ? a.addEventListener(b, e, k) : a.attachEvent(b in ie ? ie[b] : ie[b] = "on" + b, e);
  je++;
  return c;
}, ne = function() {
  var a = oe, b = Zd ? function(c) {
    return a.call(b.src, b.Pb, c);
  } : function(c) {
    c = a.call(b.src, b.Pb, c);
    if (!c) {
      return c;
    }
  };
  return b;
}, pe = function(a, b, c, e, f) {
  if (p(b)) {
    for (var g = 0;g < b.length;g++) {
      pe(a, b[g], c, e, f);
    }
    return null;
  }
  c = ke(c);
  return ce(a) ? a.Ig(b, c, e, f) : le(a, b, c, !0, e, f);
}, qe = function(a, b, c, e, f) {
  if (p(b)) {
    for (var g = 0;g < b.length;g++) {
      qe(a, b[g], c, e, f);
    }
    return null;
  }
  c = ke(c);
  if (ce(a)) {
    return a.Yc(b, c, e, f);
  }
  if (!a) {
    return!1;
  }
  if (a = me(a)) {
    if (b = a.oi(b, c, !!e, f)) {
      return re(b);
    }
  }
  return!1;
}, re = function(a) {
  if (ga(a) || !a || a.removed) {
    return!1;
  }
  var b = a.src;
  if (ce(b)) {
    return b.Yf(a);
  }
  var c = a.type, e = a.proxy;
  b.removeEventListener ? b.removeEventListener(c, e, a.capture) : b.detachEvent && b.detachEvent(c in ie ? ie[c] : ie[c] = "on" + c, e);
  je--;
  (c = me(b)) ? (c.xw(a), 0 == c.wI() && (c.src = null, b[he] = null)) : a.el();
  return!0;
}, se = function(a, b) {
  if (!a) {
    return 0;
  }
  if (ce(a)) {
    return a.cu(b);
  }
  var c = me(a);
  if (!c) {
    return 0;
  }
  var e = 0, f;
  for (f in c.Ua) {
    if (!b || f == b) {
      for (var g = wb(c.Ua[f]), k = 0;k < g.length;++k) {
        re(g[k]) && ++e;
      }
    }
  }
  return e;
}, te = function(a, b, c, e, f) {
  c = ke(c);
  e = !!e;
  return ce(a) ? a.oi(b, c, e, f) : a ? (a = me(a)) ? a.oi(b, c, e, f) : null : null;
}, ve = function(a, b, c, e) {
  var f = 1;
  if (a = me(a)) {
    if (b = a.Ua[b]) {
      for (b = wb(b), a = 0;a < b.length;a++) {
        var g = b[a];
        g && g.capture == c && !g.removed && (f &= !1 !== ue(g, e));
      }
    }
  }
  return Boolean(f);
}, ue = function(a, b) {
  var c = a.Pb, e = a.Zk || a.src;
  a.Yk && re(a);
  return c.call(e, b);
}, we = function(a, b) {
  v(ce(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return a.dispatchEvent(b);
}, oe = function(a, b) {
  if (a.removed) {
    return!0;
  }
  if (!Zd) {
    var c = b || ca("window.event"), e = new ae(c, this), f = !0;
    if (!(0 > c.keyCode || void 0 != c.returnValue)) {
      t: {
        var g = !1;
        if (0 == c.keyCode) {
          try {
            c.keyCode = -1;
            break t;
          } catch (k) {
            g = !0;
          }
        }
        if (g || void 0 == c.returnValue) {
          c.returnValue = !0;
        }
      }
      c = [];
      for (g = e.currentTarget;g;g = g.parentNode) {
        c.push(g);
      }
      for (var g = a.type, l = c.length - 1;!e.Se && 0 <= l;l--) {
        e.currentTarget = c[l], f &= ve(c[l], g, !0, e);
      }
      for (l = 0;!e.Se && l < c.length;l++) {
        e.currentTarget = c[l], f &= ve(c[l], g, !1, e);
      }
    }
    return f;
  }
  return ue(a, new ae(b, this));
}, me = function(a) {
  a = a[he];
  return a instanceof fe ? a : null;
}, xe = "__closure_events_fn_" + (1E9 * Math.random() >>> 0), ke = function(a) {
  v(a, "Listener can not be null.");
  if (ha(a)) {
    return a;
  }
  v(a.handleEvent, "An object listener must have handleEvent method.");
  return a[xe] || (a[xe] = function(b) {
    return a.handleEvent(b);
  });
};
var O = function() {
  this.Rc = new fe(this);
  this.IH = this;
};
u(O, K);
O.prototype[be] = !0;
d = O.prototype;
d.ku = null;
d.Fw = function() {
  return this.ku;
};
d.addEventListener = function(a, b, c, e) {
  M(this, a, b, c, e);
};
d.removeEventListener = function(a, b, c, e) {
  qe(this, a, b, c, e);
};
d.dispatchEvent = function(a) {
  this.rw();
  var b, c = this.Fw();
  if (c) {
    b = [];
    for (var e = 1;c;c = c.Fw()) {
      b.push(c), v(1E3 > ++e, "infinite loop");
    }
  }
  c = this.IH;
  e = a.type || a;
  if (r(a)) {
    a = new L(a, c);
  } else {
    if (a instanceof L) {
      a.target = a.target || c;
    } else {
      var f = a;
      a = new L(e, c);
      Qb(a, f);
    }
  }
  var f = !0, g;
  if (b) {
    for (var k = b.length - 1;!a.Se && 0 <= k;k--) {
      g = a.currentTarget = b[k], f = g.jl(e, !0, a) && f;
    }
  }
  a.Se || (g = a.currentTarget = c, f = g.jl(e, !0, a) && f, a.Se || (f = g.jl(e, !1, a) && f));
  if (b) {
    for (k = 0;!a.Se && k < b.length;k++) {
      g = a.currentTarget = b[k], f = g.jl(e, !1, a) && f;
    }
  }
  return f;
};
d.k = function() {
  O.q.k.call(this);
  this.cu();
  this.ku = null;
};
d.listen = function(a, b, c, e) {
  this.rw();
  return this.Rc.add(String(a), b, !1, c, e);
};
d.Ig = function(a, b, c, e) {
  return this.Rc.add(String(a), b, !0, c, e);
};
d.Yc = function(a, b, c, e) {
  return this.Rc.remove(String(a), b, c, e);
};
d.Yf = function(a) {
  return this.Rc.xw(a);
};
d.cu = function(a) {
  return this.Rc ? this.Rc.removeAll(a) : 0;
};
d.jl = function(a, b, c) {
  a = this.Rc.Ua[String(a)];
  if (!a) {
    return!0;
  }
  a = wb(a);
  for (var e = !0, f = 0;f < a.length;++f) {
    var g = a[f];
    if (g && !g.removed && g.capture == b) {
      var k = g.Pb, l = g.Zk || g.src;
      g.Yk && this.Yf(g);
      e = !1 !== k.call(l, c) && e;
    }
  }
  return e && !1 != c.tv;
};
d.oi = function(a, b, c, e) {
  return this.Rc.oi(String(a), b, c, e);
};
d.hasListener = function(a, b) {
  return this.Rc.hasListener(n(a) ? String(a) : void 0, b);
};
d.rw = function() {
  v(this.Rc, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
};
var ye = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"), Ae = function(a) {
  if (ze) {
    ze = !1;
    var b = h.location;
    if (b) {
      var c = b.href;
      if (c && (c = (c = Ae(c)[3] || null) && decodeURIComponent(c)) && c != b.hostname) {
        throw ze = !0, Error();
      }
    }
  }
  return a.match(ye);
}, ze = E, Be = function(a) {
  var b = Ae(a);
  a = b[1];
  var c = b[2], e = b[3], b = b[4], f = "";
  a && (f += a + ":");
  e && (f += "//", c && (f += c + "@"), f += e, b && (f += ":" + b));
  return f;
};
var Ce = ["video_playback", "audio_playback", "image_display", "slideshow", "mirror_tab"];
var De = function(a, b) {
  L.call(this, a);
  this.activityId = b;
};
u(De, L);
var Ee = function(a, b) {
  De.call(this, "activity_error", a);
  this.errorMessage = b;
};
u(Ee, De);
var Fe = function(a, b, c) {
  De.call(this, "update_description", a);
  this.description = b;
  this.iconUrl = c;
};
u(Fe, De);
var Ge = function() {
  this.source = this.text = this.iconUrl = null;
}, He = function(a, b) {
  O.call(this);
  this.dt = "ChromeCast";
  this.Ph = "unknown";
  this.ht = null;
  this.ia = a || Ka();
  this.Ge = null;
  this.Ee = [];
  this.h = "new";
  this.fk = null;
  this.rc = -1;
  this.ft = !1;
  this.Nd = new Ge;
  this.mediaPlayerStatus = new hd(this.ia, 2);
  this.mediaPlayerStatus.timeProgress = !0;
  this.gt = t();
  this.et = b || "stop";
  this.AC = !1;
  this.n = this.bt();
};
u(He, O);
d = He.prototype;
d.Nq = function() {
  return this.et;
};
d.cD = function() {
  return "continue" == this.et;
};
d.Ax = function(a) {
  return this.AC ? (this.ia = a, !0) : !1;
};
d.Lb = function() {
  return this.dt;
};
d.kq = function(a) {
  this.dt = a;
  return this;
};
d.Mt = function() {
  var a;
  a = this.fk ? (a = Ae(this.fk)[3] || null) && decodeURIComponent(a) : null;
  return a;
};
d.nx = function() {
  return this.fk;
};
d.Bt = function(a) {
  this.fk = a;
  return this;
};
d.isInternal = function() {
  return 0 <= Ce.indexOf(this.Ph);
};
d.Yp = function(a) {
  this.Ge = a;
  return this;
};
d.c = function() {
  return this.ia;
};
d.Ha = function() {
  return this.Ph;
};
d.ge = function(a) {
  this.Ph = a;
  this.n = this.bt();
  return this;
};
d.nD = function() {
  return this.ft;
};
d.kE = function(a) {
  this.ft = a;
  return this;
};
d.X = function() {
  return this.h;
};
d.bt = function() {
  return G("cv.Activity." + this.Ha() + "." + this.c());
};
d.kf = function() {
  return this.ht;
};
d.lE = function(a) {
  this.ht = a;
  return this;
};
d.yk = function(a, b) {
  var c = p(b) ? 0 <= b.indexOf(this.h) : this.h == b;
  c || this.n.info("Invalid state encountered in " + JSON.stringify(a) + ", was " + JSON.stringify(this.h) + "; expecting " + JSON.stringify(b));
  return c;
};
d.cq = function(a) {
  if (this.yk("initialize", "new")) {
    var b = s(function(b, e) {
      b ? (this.h = "initialized", a(!0)) : a(!1, e);
    }, this);
    this.kk(b);
  } else {
    a(!0);
  }
};
d.kk = function(a) {
  a(!0);
};
d.start = function() {
  this.yk("start", "initialized") && (this.Df(), this.h = "playing");
};
d.Df = m;
d.pause = function() {
  this.yk("pause", "playing") && (this.Io(), this.h = "paused");
};
d.Io = m;
d.stop = function() {
  this.yk("stop", ["initialized", "playing", "paused"]) && (this.zd(), this.h = "stopped", this.W());
};
d.zd = m;
d.zg = function() {
  return this.Nd;
};
d.yg = function(a, b, c) {
  if (!this.Nd.source || c >= this.Nd.source) {
    this.Nd.text = a ? Fa(a, 500) : null, this.Nd.iconUrl = b, this.Nd.source = c;
  }
  return this;
};
d.L = function() {
  return this.rc;
};
d.sg = function(a) {
  this.rc = a;
  return this;
};
d.Na = function() {
  return this.Ee;
};
d.bq = function(a) {
  var b = pb(this.Ee, function(b) {
    return b.c() == a.c();
  });
  0 <= b ? this.Ee[b] = a : this.Ee.push(a);
  return this;
};
d.dq = function() {
  if (!this.nD()) {
    var a = this.Nd.text;
    "mirror_tab" == this.Ha() && this.Mt() && (a = this.Mt() + " (Tab)");
    this.Nb(new Fe(this.c(), a, this.Nd.iconUrl));
  }
};
d.ze = function(a) {
  if ("update_description" == a.type) {
    window.document.title = a.description;
    var b = document.querySelector("link[rel=icon]");
    b && (b.href = a.iconUrl || "");
  }
};
d.Nb = function(a, b) {
  this.Ge ? this.Ge.Nb("activity", a, b || this.Ee) : Yc(this.n, "Trying to post message without activity messenger.", a, Nc);
};
d.Ze = function(a, b) {
  this.Ge ? this.Ge.Ze(a, b || this.Ee) : this.n.e("Trying to post message without activity messenger");
};
d.Jn = function(a, b, c, e, f) {
  this.Ge ? this.Ge.Jn(a, b, f || this.Ee, c, e) : (this.n.e("Trying to post message without activity messenger"), e && e("Trying to post message without activity messenger"));
};
d.Fq = function(a) {
  this.gt = a || t();
  return this;
};
d.Fy = function() {
  return this.gt;
};
d.Tx = function(a) {
  this.mediaPlayerStatus = a;
  return this;
};
d.Hg = function() {
  return "dial_non_ramp_activity" == this.Ph || "unknown" == this.Ph ? null : this.mediaPlayerStatus;
};
d.isLocal = function() {
  return 0 <= this.rc || -2 == this.rc || -4 == this.rc;
};
var Ie = function() {
  this.Wd = new B;
  this.Uf = new B;
};
d = Ie.prototype;
d.Ka = function(a) {
  return this.Wd.get(a) || null;
};
d.getAllActivities = function() {
  return this.Wd.R();
};
d.Yb = function(a) {
  return this.Uf.get(a) || [];
};
d.xt = function(a) {
  if (this.Wd.get(a.c())) {
    throw "Activity already exists";
  }
  var b = a.Na();
  this.Wd.set(a.c(), a);
  b.forEach(function(b) {
    var e = this.Yb(b.c());
    0 < e.length ? e.push(a) : this.Uf.set(b.c(), [a]);
  }, this);
};
d.Um = function() {
  this.Wd.clear();
  this.Uf.clear();
};
d.ue = function(a) {
  if (this.Wd.get(a.c())) {
    var b = a.Na();
    this.Wd.remove(a.c());
    b.forEach(function(b) {
      var e = this.Yb(b.c());
      ub(e, function(b) {
        return b.c() == a.c();
      });
      0 == e.length && this.Uf.remove(b.c());
    }, this);
  }
};
d.Ef = function(a) {
  (a = this.Ka(a)) && this.ue(a);
};
d.ak = function(a, b) {
  var c = this.Yb(a);
  this.Uf.remove(a);
  c.forEach(function(a) {
    A(a.Na(), function(a) {
      return this.Uf.Ja(a.c());
    }, this) || b && a.cD() || this.Wd.remove(a.c());
  }, this);
};
var P = function(a) {
  this.D = a;
  this.Z = {};
};
u(P, K);
var Je = [];
d = P.prototype;
d.listen = function(a, b, c, e) {
  return this.yK(a, b, c, e);
};
d.yK = function(a, b, c, e, f) {
  p(b) || (Je[0] = b, b = Je);
  for (var g = 0;g < b.length;g++) {
    var k = M(a, b[g], c || this.handleEvent, e || !1, f || this.D || this);
    if (!k) {
      break;
    }
    this.Z[k.key] = k;
  }
  return this;
};
d.Ig = function(a, b, c, e) {
  return this.Oo(a, b, c, e);
};
d.ZF = function(a, b, c, e, f) {
  return this.Oo(a, b, c, e, f);
};
d.Oo = function(a, b, c, e, f) {
  if (p(b)) {
    for (var g = 0;g < b.length;g++) {
      this.Oo(a, b[g], c, e, f);
    }
  } else {
    a = pe(a, b, c || this.handleEvent, e, f || this.D || this);
    if (!a) {
      return this;
    }
    this.Z[a.key] = a;
  }
  return this;
};
d.Yc = function(a, b, c, e, f) {
  if (p(b)) {
    for (var g = 0;g < b.length;g++) {
      this.Yc(a, b[g], c, e, f);
    }
  } else {
    if (a = te(a, b, c || this.handleEvent, e, f || this.D || this)) {
      re(a), delete this.Z[a.key];
    }
  }
  return this;
};
d.removeAll = function() {
  Fb(this.Z, re);
  this.Z = {};
};
d.k = function() {
  P.q.k.call(this);
  this.removeAll();
};
d.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
var Ke = function(a) {
  var b = new I;
  b.ea(a);
  return b;
}, Le = function(a) {
  var b = new I;
  b.Ma(a);
  return b;
}, Me = function(a, b, c) {
  a.Kb(b, c);
}, Ne = function(a, b, c) {
  Me(a, function(a) {
    "success" == a.X() && b.call(this, a.Ia(), a);
  }, c);
}, Oe = function(a, b, c) {
  Me(a, function(a) {
    "error" == a.X() && b.call(this, a.getError(), a);
  }, c);
}, Qe = function(a, b, c) {
  var e = new Pe([a]);
  Me(a, function(a) {
    "success" == a.X() ? (a = b.call(c, a), e.rF(a), Me(a, function(a) {
      "success" == a.X() ? e.ea(a.Ia()) : e.Ma(a.getError());
    })) : e.Ma(a.getError());
  });
  return e;
}, Re = function(a) {
  var b = wb(arguments), c = new Pe(b), e = function(a) {
    return "pending" != a.X();
  }, f = function() {
    "pending" == c.X() && nb(b, e) && c.ea(b);
  };
  z(b, function(a) {
    a.Kb(f, void 0);
  });
  return c;
}, Se = function(a) {
  var b = wb(arguments), c = new Pe(b), e = function(a) {
    return "success" == a.X();
  };
  Me(Re.apply(Re, b), function(a) {
    a = a.Ia();
    nb(a, e) ? c.ea(a) : c.Ma(a);
  });
  return c;
}, Pe = function(a) {
  I.call(this);
  this.FK = a;
};
u(Pe, I);
Pe.prototype.rF = function(a) {
  this.FK.push(a);
};
var Te = function(a, b) {
  O.call(this);
  this.Nc = a || 1;
  this.Xf = b || h;
  this.So = s(this.VH, this);
  this.To = t();
};
u(Te, O);
d = Te.prototype;
d.enabled = !1;
d.ga = null;
d.CA = function() {
  return this.Nc;
};
d.setInterval = function(a) {
  this.Nc = a;
  this.ga && this.enabled ? (this.stop(), this.start()) : this.ga && this.stop();
};
d.VH = function() {
  if (this.enabled) {
    var a = t() - this.To;
    0 < a && a < 0.8 * this.Nc ? this.ga = this.Xf.setTimeout(this.So, this.Nc - a) : (this.ga && (this.Xf.clearTimeout(this.ga), this.ga = null), this.Rr(), this.enabled && (this.ga = this.Xf.setTimeout(this.So, this.Nc), this.To = t()));
  }
};
d.Rr = function() {
  this.dispatchEvent("tick");
};
d.start = function() {
  this.enabled = !0;
  this.ga || (this.ga = this.Xf.setTimeout(this.So, this.Nc), this.To = t());
};
d.stop = function() {
  this.enabled = !1;
  this.ga && (this.Xf.clearTimeout(this.ga), this.ga = null);
};
d.k = function() {
  Te.q.k.call(this);
  this.stop();
  delete this.Xf;
};
var Q = function(a, b, c) {
  if (ha(a)) {
    c && (a = s(a, c));
  } else {
    if (a && "function" == typeof a.handleEvent) {
      a = s(a.handleEvent, a);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  return 2147483647 < b ? -1 : h.setTimeout(a, b || 0);
};
var Ue = function(a) {
  O.call(this);
  this.U = this.om = this.nm = null;
  this.h = a || "connecting";
  this.Xa = null;
  this.n = G("cv.Channel");
};
u(Ue, O);
d = Ue.prototype;
d.k = function() {
  Ue.q.k.call(this);
  this.disconnect();
};
d.disconnect = function(a) {
  "disconnected" != this.h ? (a ? this.n.e("Disconnect channel to " + this.U + " due to error: " + a) : this.n.info("Disconnect channel to " + this.U), this.Xa && this.n.e("Channel already has error when disconnecting: " + JSON.stringify(this.Xa)), this.Xa = a || null, this.Yj(), this.mb("disconnected")) : a && this.n.e("Reporting error on disconnected channel: " + JSON.stringify(a));
};
d.oa = function() {
  return "connected" == this.h;
};
d.LD = function() {
  return "connecting" == this.h;
};
d.MD = function() {
  return "disconnected" == this.h;
};
d.X = function() {
  return this.h;
};
d.mb = function(a) {
  var b = this.h;
  b != a && (this.h = a, this.dispatchEvent(new Ve("a", b, a)), this.nm && this.nm(b, a));
};
d.getError = function() {
  return "disconnected" == this.h ? this.Xa : null;
};
d.onMessage = function(a) {
  this.dispatchEvent(new We("b", a));
  this.om && this.om(a);
};
d.mq = function(a, b) {
  function c() {
    "connected" == e.X() ? a() : "disconnected" == e.X() && b("Channel failed to connect.");
  }
  var e = this;
  "connecting" == this.X() ? pe(this, "a", c) : c();
};
var Ve = function(a, b, c) {
  L.call(this, a);
  this.Gg = c;
};
u(Ve, L);
var We = function(a, b) {
  L.call(this, a);
  this.message = b;
};
u(We, L);
var Xe = function(a, b, c) {
  L.call(this, a);
  this.message = b;
  this.U = c || null;
};
u(Xe, L);
var Ye = function() {
  O.call(this);
  this.a = G("cv.ChannelService");
  this.Bd = new B;
  this.Li = new B;
  this.bj = new Te(18E5);
  this.r = null;
  this.gb = new P(this);
};
u(Ye, O);
d = Ye.prototype;
d.CD = function(a) {
  this.r = a;
};
d.A = function() {
  v(this.r, "Sets activityService first");
  this.bj.start();
  this.gb.listen(this.bj, "tick", this.OF);
};
d.k = function() {
  Ye.q.k.call(this);
  this.bj.stop();
  this.bj.W();
  this.gb.W();
};
d.OF = function() {
  if (!this.Bd.vb()) {
    var a = [];
    Eb(this.Bd.mF(), function(b) {
      0 < this.r.Yb(b).length || a.push(b);
    }, this);
    a.forEach(this.he, this);
  }
};
d.Cl = function(a) {
  return this.Bd.Ja(a);
};
d.he = function(a) {
  this.a.info("Remove channel to " + a);
  var b = this.Bd.get(a);
  b && (this.Bd.remove(a), b.disconnect());
  if (a = this.Li.get(a)) {
    this.a.info("existing channel removed."), a.cancel();
  }
};
d.hy = function(a) {
  v(a.U, "New channel has no peer ID");
  v(a.oa(), "New channel is not disconnected.");
  this.a.info("Created a channel to " + a.U);
  a.om = s(this.en, this, a.U);
  a.nm = s(this.rA, this, a.U);
  this.Bd.set(a.U, a);
};
d.rA = function(a, b, c) {
  "disconnected" == c && (this.a.info("Removing a disconnected channel to " + a), (b = this.Bd.get(a)) && this.he(a), this.dispatchEvent(new Xe("channel_disconnect", a)), b && b.getError() && this.dispatchEvent(new Xe("channel_error", b.getError(), a)));
};
d.Ze = function(a, b, c) {
  this.Vm(["ramp", a], b, null, c || null);
};
d.Jn = function(a, b, c, e, f) {
  -1 != $c.indexOf(a) ? (this.a.e("Attempting to post message to reserved namespace: " + a), f && f("Reserved namespace: " + a)) : this.Vm([a, b], c, e, f);
};
d.Nb = function(a, b, c, e) {
  this.Vm(["cv", new bd(a, b)], c, null, e || null);
};
d.Vm = function(a, b, c, e) {
  0 != b.length && (this.PD(a, b), b.forEach(function(b) {
    var g = this.qo(b);
    Ne(g, function(b) {
      b.send(a);
      c && c();
    }, this);
    Oe(g, function(a) {
      e ? e(String(a)) : this.dispatchEvent(new Xe("channel_error", String(a), b.c()));
    }, this);
  }, this));
};
d.PD = function(a, b) {
  if (this.a.zf(F)) {
    var c = "";
    b.forEach(function(a) {
      c += " " + a.c();
    });
    this.a.Lg("Posting message to" + c + ": " + JSON.stringify(a));
  }
};
d.qo = function(a) {
  var b = a.c(), c = this.Bd.get(b);
  if (c) {
    return v(c.oa(), "Channel to " + c.U + " is not connected."), Ke(c);
  }
  if ((c = this.Li.get(b)) && "pending" == c.X()) {
    return this.a.info("Channel to " + b + " in creation..."), c;
  }
  this.a.info("Creating channel to " + b);
  c = this.qf(a);
  a = Qe(c, function(a) {
    a = a.Ia();
    this.hy(a);
    return Ke(a);
  }, this);
  this.Li.set(b, a);
  a.Kb(function() {
    this.Li.remove(b);
  }, this);
  return a;
};
d.en = function(a, b) {
  if (b) {
    if (this.a.Lg("Received message from " + a + ": " + JSON.stringify(b)), p(b) && "ramp" == b[0] && ia(b[1]) && n(b[1].cmd_id) && n(b[1].type)) {
      this.dispatchEvent(new Xe("ramp", b[1], a));
    } else {
      if (p(b) && "cv" == b[0] && ia(b[1]) && n(b[1].type) && 0 <= ad.indexOf(b[1].type)) {
        var c = b[1], e = this.CB(c.type);
        e && this.dispatchEvent(new Xe(e, c.message, a));
      } else {
        p(b) && 2 == b.length && r(b[0]) && -1 == $c.indexOf(b[0]) && (ia(b[1]) || r(b[1]) || null === b[1]) ? this.dispatchEvent(new Xe("custom_message", b, a)) : cd(b) || Yc(this.a, "Unrecognized channel message", b, Nc);
      }
    }
  }
};
d.CB = function(a) {
  switch(a) {
    case "launch_service":
      return "launch_service";
    case "activity_service":
      return "activity_service";
    case "activity":
      return "activity";
    default:
      return null;
  }
};
var Ze = function(a, b) {
  O.call(this);
  this.a = G("cv.ActivityService");
  this.Cc = a;
  this.M = b;
  this.gb = new P(this);
};
u(Ze, O);
var $e = function(a, b) {
  L.call(this, a);
  this.activityId = b;
};
u($e, L);
d = Ze.prototype;
d.A = function() {
  this.gb.listen(this.Cc, "activity", this.zH);
  this.gb.listen(this.Cc, "activity_service", this.AH);
  this.gb.listen(this.Cc, "channel_disconnect", this.yH);
  this.gb.listen(this.Cc, "custom_message", this.mw);
};
d.mw = m;
d.of = function() {
  return this.gb;
};
d.k = function() {
  Ze.q.k.call(this);
  this.gb.W();
};
d.td = function() {
  return A(this.getAllActivities(), function(a) {
    return "mirror_tab" == a.Ha();
  });
};
d.Ka = function(a) {
  return this.M.Ka(a);
};
d.Yb = function(a) {
  return this.M.Yb(a);
};
d.getAllActivities = function() {
  return this.M.getAllActivities();
};
d.zH = function(a) {
  v("activity" == a.type, "Got event type " + a.type + "; expect activity");
  var b = a.message, c = this.M.Ka(b.activityId);
  c ? c.ze(b) : Yc(this.a, "Received a remote message for unknown activity: " + b.activityId, a);
};
d.AH = function(a) {
  v("activity_service" == a.type, "Got event type " + a.type + "; expect activity_service");
  var b = a.message;
  "remove_activity" == b.type ? this.aB(b.activityId) : "leave_activity" == b.type ? this.bB(b.activityId, a.U) : Yc(this.a, "Received unknown activity service message.", b);
};
d.aB = function(a) {
  this.M.Ka(a) ? (this.a.info("Peer informs activity removal: " + a), this.rm(a), this.M.Ka(a).stop(), this.M.Ef(a), this.dispatchEvent(new $e("remove_activity", a))) : this.a.info("Activity does not exist: " + a);
};
d.bB = m;
d.yH = function(a) {
  v("channel_disconnect" == a.type);
  a = a.message;
  this.a.info("Handle peer " + a + " disconnection.");
  this.ms(a);
};
d.ms = m;
d.rm = m;
d.vq = function(a) {
  this.a.info("Inform peer to remove activity " + a.c() + " " + a.Lb() + " " + a.Ha());
  this.Cc.Nb("activity_service", new $e("remove_activity", a.c()), a.Na());
};
d.xy = function(a) {
  this.a.info("Inform peer to leave activity " + a.c() + " " + a.Lb() + " " + a.Ha());
  this.Cc.Nb("activity_service", new $e("leave_activity", a.c()), a.Na());
};
var af = function(a, b, c) {
  this.Oh = a;
  this.Nc = b;
  this.D = c;
  this.Sh = s(this.fG, this);
};
u(af, K);
d = af.prototype;
d.hl = !1;
d.cp = 0;
d.ga = null;
d.Qu = function() {
  this.ga || this.cp ? this.hl = !0 : this.di();
};
d.stop = function() {
  this.ga && (h.clearTimeout(this.ga), this.ga = null, this.hl = !1);
};
d.pause = function() {
  this.cp++;
};
d.k = function() {
  af.q.k.call(this);
  this.stop();
};
d.fG = function() {
  this.ga = null;
  this.hl && !this.cp && (this.hl = !1, this.di());
};
d.di = function() {
  this.ga = Q(this.Sh, this.Nc);
  this.Oh.call(this.D);
};
var bf = function(a, b, c) {
  De.call(this, a, b);
  this.state = c || null;
};
u(bf, De);
var cf = function(a, b, c, e) {
  He.call(this, c, e);
  this.ge(a);
  this.ci = b;
  new af(function() {
    this.Nb(new bf("timeupdate", this.ia, this.ci));
  }, 1E3, this);
};
u(cf, He);
var df = function() {
  this.mediaUrl = "";
  this.currentTime = null;
  this.duration = 0;
  this.paused = !0;
  this.muted = !1;
  this.volume = 1;
};
d = cf.prototype;
d.kf = function() {
  return this.ci;
};
d.Df = function() {
  this.play();
};
d.Io = function() {
  this.ci.paused = !0;
  this.Nb(new bf("pause", this.ia));
};
d.zd = function() {
  this.pause();
};
d.play = function() {
  this.ci.paused = !1;
  this.Nb(new bf("play", this.ia));
};
d.ze = function(a) {
  cf.q.ze.call(this, a);
  a.state && (this.ci = a.state);
  this.dispatchEvent(a);
};
var ef = function(a, b, c) {
  P.call(this, this);
  this.a = G("cv.PcStatsCollector");
  this.jB = a;
  this.oB = b;
  this.kB = c;
  this.Ej = new Te(2E3);
  this.pn = [];
  this.Gj = 0;
  this.listen(this.Ej, "tick", this.rB);
};
u(ef, P);
ef.prototype.start = function() {
  this.Ej.start();
};
ef.prototype.stop = function() {
  this.Ej.stop();
};
ef.prototype.k = function() {
  this.Ej.W();
};
ef.prototype.ll = function() {
  0 != this.Gj && (this.oB(this.pn), this.Gj = 0, this.pn = []);
};
var ff = {googLocalCertificateId:!0, googRemoteCertificateId:!0, googDerBase64:!0, googFingerprint:!0};
ef.prototype.DI = function(a) {
  if (!a) {
    return null;
  }
  !a.names && n(a.local) && (a = a.local);
  if (!a.names) {
    return null;
  }
  var b = !1, c = {};
  c.timestamp = a.timestamp;
  a.names().forEach(function(e) {
    ff[e] && (b = !0);
    c[e] = a.stat(e);
  });
  return b ? null : c;
};
ef.prototype.tJ = function(a) {
  var b = [];
  a.result().forEach(function(a) {
    (a = this.DI(a)) && b.push(a);
  }, this);
  this.pn.push(b);
  this.Gj++;
  10 == this.Gj && this.ll();
};
ef.prototype.rB = function() {
  var a = this.jB();
  if (a && n(a.getStats)) {
    if (this.kB) {
      if (!a.getLocalStreams() || 0 == a.getLocalStreams().length) {
        return;
      }
    } else {
      if (n(a.getRemoteStreams)) {
        if (!a.getRemoteStreams() || 0 == a.getRemoteStreams().length) {
          return;
        }
      } else {
        if (!a.sJ || 0 == a.sJ.length) {
          return;
        }
      }
    }
    a.getStats(s(this.tJ, this));
  }
};
var gf = function(a) {
  this.lg = 0;
  this.op = a || 100;
  this.sd = [];
};
d = gf.prototype;
d.add = function(a) {
  var b = this.sd[this.lg];
  this.sd[this.lg] = a;
  this.lg = (this.lg + 1) % this.op;
  return b;
};
d.get = function(a) {
  a = this.Vw(a);
  return this.sd[a];
};
d.set = function(a, b) {
  a = this.Vw(a);
  this.sd[a] = b;
};
d.J = function() {
  return this.sd.length;
};
d.vb = function() {
  return 0 == this.sd.length;
};
d.clear = function() {
  this.lg = this.sd.length = 0;
};
d.R = function() {
  return this.Yo(this.J());
};
d.Yo = function(a) {
  var b = this.J(), c = [];
  for (a = this.J() - a;a < b;a++) {
    c.push(this.get(a));
  }
  return c;
};
d.fb = function() {
  for (var a = [], b = this.J(), c = 0;c < b;c++) {
    a[c] = c;
  }
  return a;
};
d.Ja = function(a) {
  return a < this.J();
};
d.jg = function(a) {
  for (var b = this.J(), c = 0;c < b;c++) {
    if (this.get(c) == a) {
      return!0;
    }
  }
  return!1;
};
d.Vw = function(a) {
  if (a >= this.sd.length) {
    throw Error("Out of bounds exception");
  }
  return this.sd.length < this.op ? a : (this.lg + Number(a)) % this.op;
};
var hf = function() {
  this.a = G("cv.PcStatsStore");
  this.lh = new gf(900);
  this.kh = new gf(900);
  this.xh = null;
};
da(hf);
hf.prototype.HF = function(a) {
  a.forEach(function(a) {
    this.lh.add(a);
  }, this);
  this.xh && this.xh();
};
hf.prototype.az = function(a) {
  a.forEach(function(a) {
    this.kh.add(a);
  }, this);
  this.xh && this.xh();
};
hf.prototype.reset = function() {
  this.lh.clear();
  this.kh.clear();
};
var jf = function(a, b) {
  this.senderStats = a;
  this.receiverStats = b;
};
hf.prototype.getStats = function() {
  return new jf(this.lh.R(), this.kh.R());
};
hf.prototype.uH = function(a) {
  return this.lh.J() < a || this.kh.J() < a ? null : new jf(this.lh.Yo(a), this.kh.Yo(a));
};
hf.prototype.yv = function(a) {
  this.xh = a;
};
var kf = ["VP8", "CAST1"];
var lf = function(a) {
  this.lb = a;
};
d = lf.prototype;
d.PE = function() {
  return this.lb;
};
d.Fn = function(a) {
  this.lb = this.lb.replace(/(m=audio.*\r\n)/g, "$1b=AS:" + a + "\r\n");
};
d.LE = function() {
  this.lb = this.lb.replace(/a=group:BUNDLE\saudio\svideo.*\r\n/, "");
};
d.Bu = function(a, b, c) {
  for (var e = this.lb, f = e.replace(/[\s\S]*m=audio\s\d+\sRTP\/SAVPF((\s\d+)+)[\s\S]*/, "$1").replace(/(^\s+)|(\s+$)/g, "").split(" "), g = [], k = 0, l = f.length;k < l;++k) {
    -1 != e.search(RegExp("a=rtpmap:" + f[k] + "\\s+opus", "i")) ? g.push(f[k]) : e = e.replace(RegExp("a=rtpmap:" + f[k] + ".*\\r\\n"), "");
  }
  e = e.replace(/(m=audio\s\d+\sRTP\/SAVPF\s).*/, "$1" + g.join(" "));
  g.length && (a && (e = e.replace(RegExp("(a=fmtp:" + g[0] + ".*)\\r\\n", "i"), "$1; " + (c ? "sprop-stereo" : "stereo") + "=1\r\n")), b && (e = e.replace(RegExp("(a=fmtp:" + g[0] + ".*)\\r\\n", "i"), "$1\r\na=rtcp-fb:" + g[0] + " nack\r\n")));
  this.lb = e;
};
d.NE = function() {
  var a = this.lb;
  kf.forEach(function(b) {
    var c = a, e = mf(c, b);
    if (e) {
      b = "a=rtcp-fb:" + e + " ccm fir";
      var f = "a=rtcp-fb:" + e + " nack", g = "a=rtcp-fb:" + e + " goog-remb", e = RegExp("(a=rtpmap:" + e + ".*)\\r\\n", "i");
      -1 == c.search(b) && (c = c.replace(e, "$1\r\n" + b + "\r\n"));
      -1 == c.search(f) && (c = c.replace(e, "$1\r\n" + f + "\r\n"));
      -1 == c.search(g) && (c = c.replace(e, "$1\r\n" + g + "\r\n"));
    }
    a = c;
  });
  this.lb = a;
};
d.ME = function() {
  for (var a = this.lb, b = nf(a), c = [], e = 0, f = b.length;e < f;++e) {
    var g = !1;
    kf.forEach(function(f) {
      -1 != a.search(RegExp("a=rtpmap:" + b[e] + "\\s+" + f, "i")) && (c.push(b[e]), g = !0);
    });
    g || (a = a.replace(RegExp("a=rtpmap:" + b[e] + ".*\\r\\n"), ""));
  }
  this.lb = a = a.replace(/(m=video\s\d+\sRTP\/SAVPF\s).*/, "$1" + c.join(" "));
};
d.QE = function(a) {
  var b = this.lb;
  if ((a = b.match(RegExp("a=rtpmap:(\\d+)\\s" + a, "i"))) && 2 == a.length) {
    a = a[1];
    var c = nf(b), e = c.indexOf(a);
    -1 != e && (c.splice(e, 1), c.unshift(a), this.lb = b = b.replace(/(m=video\s\d+\sRTP\/SAVPF\s).*/, "$1" + c.join(" ")));
  }
};
d.Cu = function(a, b, c, e) {
  var f = this.lb, g = null;
  kf.forEach(function(e) {
    e = mf(f, e);
    g || (g = e);
    var l = f;
    e && (l = l.replace(RegExp("(a=rtpmap:" + e + ".*)\\r\\n", "i"), "$1\r\na=fmtp:" + e + " x-google-min-bitrate=" + a + "; x-google-max-bitrate=" + b + "; x-google-max-quantization=" + c + "\r\n"));
    f = l;
  });
  e && g && (f = f.replace(RegExp("(a=rtpmap:" + g + ".*)\\r\\n", "i"), "$1\r\na=x-google-buffer-latency:" + e + "\r\n"));
  this.lb = f;
};
var nf = function(a) {
  return a.replace(/[\s\S]*m=video\s\d+\sRTP\/SAVPF((\s\d+)+)[\s\S]*/, "$1").replace(/(^\s+)|(\s+$)/g, "").split(" ");
}, mf = function(a, b) {
  for (var c = nf(a), e = 0, f = c.length;e < f;++e) {
    if (-1 != a.search(RegExp("a=rtpmap:" + c[e] + "\\s+" + b, "i"))) {
      return c[e];
    }
  }
  return "";
};
var of = {mandatory:{OfferToReceiveAudio:!0, OfferToReceiveVideo:!0}}, pf = {mandatory:{IceRestart:!0, OfferToReceiveAudio:!0, OfferToReceiveVideo:!0}}, qf = function(a, b, c) {
  O.call(this);
  v(n(webkitRTCPeerConnection), "webkitRTCPeerConnection is not available.  Do you need to set flags?");
  this.a = G("cv.PeerConnection");
  this.Zc = a;
  this.vr = b;
  this.Dr = of;
  this.C = c || new Qd;
  this.eb = this.eA();
  this.wy = !1;
  this.te = null;
  this.fA();
};
u(qf, O);
d = qf.prototype;
d.fA = function() {
  var a = s(function(a) {
    this.Zc ? hf.F().HF(a) : this.vr(JSON.stringify({type:"stats", stats:a}));
  }, this);
  this.te = new ef(s(function() {
    return this.eb;
  }, this), a, this.Zc);
};
d.cc = !1;
d.oe = m;
d.tr = m;
d.KI = function(a) {
  this.oe = a;
};
d.tE = function(a) {
  this.tr = a;
};
d.vF = function() {
  return this.cc;
};
d.uB = function() {
  return{iceServers:[{url:"stun:stun.l.google.com:19302"}]};
};
d.eA = function() {
  var a = this.uB(), b = new webkitRTCPeerConnection(a);
  b.onicecandidate = s(this.wB, this);
  b.oniceconnectionstatechange = s(this.xB, this);
  b.NK = s(this.yB, this);
  b.onopen = s(this.zB, this);
  b.onaddstream = s(this.AB, this);
  b.onremovestream = s(this.BB, this);
  this.a.info("Created webkitRTCPeerConnnection with config: " + JSON.stringify(a));
  return b;
};
d.start = function(a) {
  this.cc || (this.cc = !0, this.Zc && this.RH(), a && this.te && this.te.start());
};
d.stop = function() {
  this.cc = !1;
  this.eb.close();
  this.te && this.te.stop();
};
d.addStream = function(a) {
  this.eb.addStream(a);
};
d.removeStream = function(a) {
  this.cc && this.eb.removeStream(a);
};
d.k = function() {
  this.stop();
  this.eb = null;
  this.te && this.te.W();
  qf.q.k.call(this);
};
d.RH = function() {
  v(this.Zc, "Must be initiator to create an offer!");
  this.a.info("Sending offer to peer.");
  this.eb.createOffer(s(this.Jm, this), this.oe, this.Dr);
};
d.bz = function() {
  this.eb.createAnswer(s(this.Jm, this), this.oe, this.Dr);
};
d.Jm = function(a) {
  var b = new lf(a.sdp);
  this.Zc ? (b.LE(), "off" != this.C.bufferedMode && b.ME(), this.C.useOpus && b.Bu(!0, this.C.enableAudioNack, !0)) : (this.C.useOpus && (this.C.audioBitrate && b.Fn(this.C.audioBitrate), b.Bu(!0, this.C.enableAudioNack, !1)), this.C.preferredVideoCodec && b.QE(this.C.preferredVideoCodec), "off" != this.C.bufferedMode ? b.Cu(this.C.minVideoBitrate, this.C.maxVideoBitrate, this.C.videoQuality, this.C.OE()) : b.Cu(this.C.minVideoBitrate, this.C.maxVideoBitrate, this.C.videoQuality), b.NE());
  a.sdp = b.PE();
  this.eb.setLocalDescription(a, m, this.oe);
  this.Fr(a);
};
d.Fr = function(a) {
  a = JSON.stringify(a);
  this.a.info("===>: " + a);
  this.vr(a);
};
d.NF = function(a) {
  var b = JSON.parse(a);
  "stats" != b.type && this.a.ka("<===: " + a);
  if ("offer" === b.type) {
    v(!this.Zc, "Must not be initiator to answer an offer!"), this.cc || this.start(), this.eb.setRemoteDescription(new RTCSessionDescription(b), m, this.oe), this.bz();
  } else {
    if ("answer" === b.type && this.cc) {
      v(this.Zc, "Must be initiator to receive an answer!"), this.eb.setRemoteDescription(new RTCSessionDescription(b), m, this.oe);
    } else {
      if ("candidate" === b.type && this.cc) {
        a = new RTCIceCandidate({sdpMLineIndex:b.label, sdpMid:b.id, candidate:b.candidate});
        try {
          this.cz(a, this.Zc) && (this.a.info("Adding candidate " + JSON.stringify(a)), this.eb.addIceCandidate(a));
        } catch (c) {
          this.a.w("Error calling addIceCandidate; messages out of order?", c);
        }
      } else {
        "stats" === b.type && hf.F().az(b.stats);
      }
    }
  }
};
d.cz = function(a, b) {
  if (b) {
    if (this.C.enableAudioTcp && -1 != a.sdpMid.indexOf("audio") && -1 != a.candidate.indexOf("udp") || this.C.enableVideoTcp && -1 != a.sdpMid.indexOf("video") && -1 != a.candidate.indexOf("udp")) {
      return!1;
    }
  } else {
    if (this.C.enableAudioTcp && -1 != a.sdpMid.indexOf("audio") && -1 != a.candidate.indexOf("tcp") && -1 != a.candidate.indexOf("0 typ host") || this.C.enableVideoTcp && -1 != a.sdpMid.indexOf("video") && -1 != a.candidate.indexOf("tcp") && -1 != a.candidate.indexOf("0 typ host")) {
      return!1;
    }
  }
  return!0;
};
d.wB = function(a) {
  a.candidate ? this.Fr({type:"candidate", label:a.candidate.sdpMLineIndex, id:a.candidate.sdpMid, candidate:a.candidate.candidate}) : this.a.info("End of candidates.");
};
d.xB = function() {
  if (this.eb) {
    var a = this.eb.iceConnectionState;
    this.a.info("New ICE connection state: " + a + ".");
    "connected" == a ? this.dispatchEvent(new L("iceconnected")) : this.Zc && "disconnected" == a && (this.a.e("Ice connection state is bad."), this.wy ? (this.a.info("Restarting ICE."), this.eb.createOffer(s(this.Jm, this), this.oe, pf)) : this.tr());
  }
};
d.yB = function(a) {
  this.a.info("Session connecting.");
  this.dispatchEvent(a);
};
d.zB = function(a) {
  this.a.info("Session opened.");
  this.dispatchEvent(a);
};
d.AB = function(a) {
  this.a.info("Stream added.");
  this.dispatchEvent(a);
};
d.BB = function(a) {
  this.a.info("Stream removed.");
  this.dispatchEvent(a);
};
d.getStats = function(a) {
  this.eb.getStats(a);
};
var rf = function(a, b, c) {
  He.call(this, c);
  this.ge("mirror_tab");
  this.Oc = b;
  this.zoomFactor = 1;
  this.nc = new qf(a, s(this.PH, this), this.Oc);
  this.mediaPlayerStatus.hasPause = !1;
};
u(rf, He);
rf.prototype.Rs = function() {
  return-2 == this.L();
};
rf.prototype.ek = function() {
  return 0 <= this.L();
};
rf.prototype.stream = null;
rf.prototype.url = null;
var sf = function(a, b, c) {
  De.call(this, a, b);
  this.zoomFactor = c;
};
u(sf, De);
var tf = function(a, b) {
  De.call(this, "webrtc", b);
  this.message = a;
};
u(tf, De);
d = rf.prototype;
d.Zi = function() {
  return this.url;
};
d.kk = function(a) {
  this.nc.KI(s(this.II, this));
  a(!0);
};
d.Io = function() {
  this.n.info("Pausing tab mirroring...");
  this.Gn("pause");
};
d.zd = function() {
  this.n.info("Stopping tab mirroring...");
  this.nc && (this.nc.stop(), this.nc = null);
};
d.Gn = function(a, b) {
  this.dispatchEvent(this.Qw(a, b));
};
d.nF = function(a) {
  this.Nb(this.Qw(a));
};
d.Qw = function(a, b) {
  return new sf(a, this.ia, this.zoomFactor, b);
};
d.PH = function(a) {
  this.Nb(new tf(a, this.ia));
};
d.II = function(a) {
  this.n.e("PeerConnection error: " + a);
  this.dispatchEvent(new Ee(this.ia, a));
  this.stop();
};
d.ze = function(a) {
  rf.q.ze.call(this, a);
  "webrtc" == a.type && this.nc && this.nc.NF(a.message);
};
var uf = function(a) {
  return lb(a, function(a) {
    a = a.toString(16);
    return 1 < a.length ? a : "0" + a;
  }).join("");
};
var vf = null, wf = null, xf = null, yf = function() {
  if (!vf) {
    vf = {};
    wf = {};
    xf = {};
    for (var a = 0;65 > a;a++) {
      vf[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a), wf[vf[a]] = a, xf[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a);
    }
  }
};
var zf = function() {
};
var Af = function() {
  this.za = [];
  this.Xo = [];
  this.HH = [];
  this.cl = [];
  this.cl[0] = 128;
  for (var a = 1;64 > a;++a) {
    this.cl[a] = 0;
  }
  this.reset();
};
u(Af, zf);
Af.prototype.reset = function() {
  this.za[0] = 1732584193;
  this.za[1] = 4023233417;
  this.za[2] = 2562383102;
  this.za[3] = 271733878;
  this.za[4] = 3285377520;
  this.$o = this.ki = 0;
};
Af.prototype.dl = function(a, b) {
  b || (b = 0);
  var c = this.HH;
  if (r(a)) {
    for (var e = 0;16 > e;e++) {
      c[e] = a.charCodeAt(b) << 24 | a.charCodeAt(b + 1) << 16 | a.charCodeAt(b + 2) << 8 | a.charCodeAt(b + 3), b += 4;
    }
  } else {
    for (e = 0;16 > e;e++) {
      c[e] = a[b] << 24 | a[b + 1] << 16 | a[b + 2] << 8 | a[b + 3], b += 4;
    }
  }
  for (e = 16;80 > e;e++) {
    var f = c[e - 3] ^ c[e - 8] ^ c[e - 14] ^ c[e - 16];
    c[e] = (f << 1 | f >>> 31) & 4294967295;
  }
  for (var g = this.za[0], k = this.za[1], l = this.za[2], q = this.za[3], x = this.za[4], D, e = 0;80 > e;e++) {
    40 > e ? 20 > e ? (f = q ^ k & (l ^ q), D = 1518500249) : (f = k ^ l ^ q, D = 1859775393) : 60 > e ? (f = k & l | q & (k | l), D = 2400959708) : (f = k ^ l ^ q, D = 3395469782), f = (g << 5 | g >>> 27) + f + x + D + c[e] & 4294967295, x = q, q = l, l = (k << 30 | k >>> 2) & 4294967295, k = g, g = f;
  }
  this.za[0] = this.za[0] + g & 4294967295;
  this.za[1] = this.za[1] + k & 4294967295;
  this.za[2] = this.za[2] + l & 4294967295;
  this.za[3] = this.za[3] + q & 4294967295;
  this.za[4] = this.za[4] + x & 4294967295;
};
Af.prototype.update = function(a, b) {
  n(b) || (b = a.length);
  for (var c = b - 64, e = 0, f = this.Xo, g = this.ki;e < b;) {
    if (0 == g) {
      for (;e <= c;) {
        this.dl(a, e), e += 64;
      }
    }
    if (r(a)) {
      for (;e < b;) {
        if (f[g] = a.charCodeAt(e), ++g, ++e, 64 == g) {
          this.dl(f);
          g = 0;
          break;
        }
      }
    } else {
      for (;e < b;) {
        if (f[g] = a[e], ++g, ++e, 64 == g) {
          this.dl(f);
          g = 0;
          break;
        }
      }
    }
  }
  this.ki = g;
  this.$o += b;
};
Af.prototype.eo = function() {
  var a = [], b = 8 * this.$o;
  56 > this.ki ? this.update(this.cl, 56 - this.ki) : this.update(this.cl, 64 - (this.ki - 56));
  for (var c = 63;56 <= c;c--) {
    this.Xo[c] = b & 255, b /= 256;
  }
  this.dl(this.Xo);
  for (c = b = 0;5 > c;c++) {
    for (var e = 24;0 <= e;e -= 8) {
      a[b] = this.za[c] >> e & 255, ++b;
    }
  }
  return a;
};
var Bf = !mc && !C || C && C && 9 <= Cc || mc && Ac("1.9.1"), Cf = C && !Ac("9");
var Ef = function(a) {
  return a ? new Df(9 == a.nodeType ? a : a.ownerDocument || a.document) : Va || (Va = new Df);
}, Ff = function(a, b) {
  return r(b) ? a.getElementById(b) : b;
}, Hf = function(a, b, c, e) {
  function f(c) {
    c && b.appendChild(r(c) ? a.createTextNode(c) : c);
  }
  for (;e < c.length;e++) {
    var g = c[e];
    !fa(g) || ia(g) && 0 < g.nodeType ? f(g) : z(Gf(g) ? wb(g) : g, f);
  }
}, If = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null;
}, Jf = function(a) {
  return Bf && void 0 != a.children ? a.children : kb(a.childNodes, function(a) {
    return 1 == a.nodeType;
  });
}, Kf = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1}, Lf = {IMG:" ", BR:"\n"}, Nf = function(a) {
  if (Cf && "innerText" in a) {
    a = a.innerText.replace(/(\r\n|\r|\n)/g, "\n");
  } else {
    var b = [];
    Mf(a, b, !0);
    a = b.join("");
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  Cf || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a;
}, Mf = function(a, b, c) {
  if (!(a.nodeName in Kf)) {
    if (3 == a.nodeType) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
    } else {
      if (a.nodeName in Lf) {
        b.push(Lf[a.nodeName]);
      } else {
        for (a = a.firstChild;a;) {
          Mf(a, b, c), a = a.nextSibling;
        }
      }
    }
  }
}, Gf = function(a) {
  if (a && "number" == typeof a.length) {
    if (ia(a)) {
      return "function" == typeof a.item || "string" == typeof a.item;
    }
    if (ha(a)) {
      return "function" == typeof a.item;
    }
  }
  return!1;
}, Df = function(a) {
  this.Te = a || h.document || document;
};
d = Df.prototype;
d.dF = function(a) {
  return Ff(this.Te, a);
};
d.createElement = function(a) {
  return this.Te.createElement(a);
};
d.createTextNode = function(a) {
  return this.Te.createTextNode(String(a));
};
d.S = function() {
  var a = this.Te;
  return a.parentWindow || a.defaultView;
};
d.appendChild = function(a, b) {
  a.appendChild(b);
};
d.append = function(a, b) {
  Hf(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1);
};
d.canHaveChildren = function(a) {
  if (1 != a.nodeType) {
    return!1;
  }
  switch(a.tagName) {
    case "APPLET":
    ;
    case "AREA":
    ;
    case "BASE":
    ;
    case "BR":
    ;
    case "COL":
    ;
    case "COMMAND":
    ;
    case "EMBED":
    ;
    case "FRAME":
    ;
    case "HR":
    ;
    case "IMG":
    ;
    case "INPUT":
    ;
    case "IFRAME":
    ;
    case "ISINDEX":
    ;
    case "KEYGEN":
    ;
    case "LINK":
    ;
    case "NOFRAMES":
    ;
    case "NOSCRIPT":
    ;
    case "META":
    ;
    case "OBJECT":
    ;
    case "PARAM":
    ;
    case "SCRIPT":
    ;
    case "SOURCE":
    ;
    case "STYLE":
    ;
    case "TRACK":
    ;
    case "WBR":
      return!1;
  }
  return!0;
};
d.removeNode = If;
d.getChildren = Jf;
d.isElement = function(a) {
  return ia(a) && 1 == a.nodeType;
};
d.contains = function(a, b) {
  if (a.contains && 1 == b.nodeType) {
    return a == b || a.contains(b);
  }
  if ("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16);
  }
  for (;b && a != b;) {
    b = b.parentNode;
  }
  return b == a;
};
var Of = function(a, b, c) {
  this.Oh = a;
  this.Nc = b || 0;
  this.D = c;
  this.Sh = s(this.di, this);
};
u(Of, K);
d = Of.prototype;
d.ia = 0;
d.k = function() {
  Of.q.k.call(this);
  this.stop();
  delete this.Oh;
  delete this.D;
};
d.start = function(a) {
  this.stop();
  this.ia = Q(this.Sh, n(a) ? a : this.Nc);
};
d.stop = function() {
  this.Ic() && h.clearTimeout(this.ia);
  this.ia = 0;
};
d.Qu = function() {
  this.stop();
  this.di();
};
d.Ic = function() {
  return 0 != this.ia;
};
d.di = function() {
  this.ia = 0;
  this.Oh && this.Oh.call(this.D);
};
var Pf = function(a) {
  a = String(a);
  if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
    try {
      return eval("(" + a + ")");
    } catch (b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
}, Qf = function(a) {
  return eval("(" + a + ")");
}, Sf = function(a, b) {
  return(new Rf(b)).ce(a);
}, Rf = function(a) {
  this.pl = a;
};
Rf.prototype.ce = function(a) {
  var b = [];
  this.Bp(a, b);
  return b.join("");
};
Rf.prototype.Bp = function(a, b) {
  switch(typeof a) {
    case "string":
      this.Lw(a, b);
      break;
    case "number":
      this.iJ(a, b);
      break;
    case "boolean":
      b.push(a);
      break;
    case "undefined":
      b.push("null");
      break;
    case "object":
      if (null == a) {
        b.push("null");
        break;
      }
      if (p(a)) {
        this.hJ(a, b);
        break;
      }
      this.jJ(a, b);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof a);;
  }
};
var Tf = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, Uf = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
Rf.prototype.Lw = function(a, b) {
  b.push('"', a.replace(Uf, function(a) {
    if (a in Tf) {
      return Tf[a];
    }
    var b = a.charCodeAt(0), f = "\\u";
    16 > b ? f += "000" : 256 > b ? f += "00" : 4096 > b && (f += "0");
    return Tf[a] = f + b.toString(16);
  }), '"');
};
Rf.prototype.iJ = function(a, b) {
  b.push(isFinite(a) && !isNaN(a) ? a : "null");
};
Rf.prototype.hJ = function(a, b) {
  var c = a.length;
  b.push("[");
  for (var e = "", f = 0;f < c;f++) {
    b.push(e), e = a[f], this.Bp(this.pl ? this.pl.call(a, String(f), e) : e, b), e = ",";
  }
  b.push("]");
};
Rf.prototype.jJ = function(a, b) {
  b.push("{");
  var c = "", e;
  for (e in a) {
    if (Object.prototype.hasOwnProperty.call(a, e)) {
      var f = a[e];
      "function" != typeof f && (b.push(c), this.Lw(e, b), b.push(":"), this.Bp(this.pl ? this.pl.call(a, e, f) : f, b), c = ",");
    }
  }
  b.push("}");
};
var Vf = function(a, b) {
  var c = G(a);
  b && c && c.Uc(b);
  return c;
}, S = function(a, b, c, e) {
  a && a.log(b, c, e);
}, T = function(a, b, c) {
  a && a.w(b, c);
}, Wf = function(a, b, c) {
  a && a.e(b, c);
}, U = function(a, b, c) {
  a && a.info(b, c);
}, V = function(a, b, c) {
  a && a.ka(b, c);
};
var Xf = function() {
  this.Zj = {};
};
u(Xf, K);
d = Xf.prototype;
d.n = Vf("goog.messaging.AbstractChannel");
d.connect = function(a) {
  a && a();
};
d.oa = function() {
  return!0;
};
d.ig = function(a, b, c) {
  this.Zj[a] = {Ta:b, Xu:!!c};
};
d.xF = function(a, b) {
  var c = this.dI(a, b);
  if (c) {
    var e = this.cI(a, b, c.Xu);
    null != e && c.Ta(e);
  }
};
d.dI = function(a, b) {
  var c = this.Zj[a];
  if (c) {
    return c;
  }
  if (this.pt) {
    return{Ta:oa(this.pt, a), Xu:ia(b)};
  }
  Wf(this.n, 'Unknown service name "' + a + '"');
  return null;
};
d.cI = function(a, b, c) {
  if (c && r(b)) {
    try {
      return Pf(b);
    } catch (e) {
      return Wf(this.n, "Expected JSON payload for " + a + ', was "' + b + '"'), null;
    }
  } else {
    if (!c && !r(b)) {
      return Sf(b);
    }
  }
  return b;
};
d.k = function() {
  Xf.q.k.call(this);
  delete this.n;
  delete this.Zj;
  delete this.pt;
};
var W = function(a, b) {
  var c;
  a instanceof W ? (this.Sb = n(b) ? b : a.jE(), this.Fd(a.jd()), this.rk(a.ko()), this.Ie(a.Dc()), this.Uh(a.ik()), this.Je(a.Wf()), this.Pf(a.El().clone()), this.qk(a.jo())) : a && (c = Ae(String(a))) ? (this.Sb = !!b, this.Fd(c[1] || "", !0), this.rk(c[2] || "", !0), this.Ie(c[3] || "", !0), this.Uh(c[4]), this.Je(c[5] || "", !0), this.Pf(c[6] || "", !0), this.qk(c[7] || "", !0)) : (this.Sb = !!b, this.uc = new Yf(null, null, this.Sb));
};
d = W.prototype;
d.og = "";
d.Ap = "";
d.yp = "";
d.nl = null;
d.mc = "";
d.zp = "";
d.xK = !1;
d.Sb = !1;
d.toString = function() {
  var a = [], b = this.jd();
  b && a.push(Zf(b, $f), ":");
  if (b = this.Dc()) {
    a.push("//");
    var c = this.ko();
    c && a.push(Zf(c, $f), "@");
    a.push(encodeURIComponent(String(b)));
    b = this.ik();
    null != b && a.push(":", String(b));
  }
  if (b = this.Wf()) {
    this.xo() && "/" != b.charAt(0) && a.push("/"), a.push(Zf(b, "/" == b.charAt(0) ? ag : bg));
  }
  (b = this.RG()) && a.push("?", b);
  (b = this.jo()) && a.push("#", Zf(b, cg));
  return a.join("");
};
d.resolve = function(a) {
  var b = this.clone(), c = a.tu();
  c ? b.Fd(a.jd()) : c = a.CE();
  c ? b.rk(a.ko()) : c = a.xo();
  c ? b.Ie(a.Dc()) : c = a.AE();
  var e = a.Wf();
  if (c) {
    b.Uh(a.ik());
  } else {
    if (c = a.su()) {
      if ("/" != e.charAt(0)) {
        if (this.xo() && !this.su()) {
          e = "/" + e;
        } else {
          var f = b.Wf().lastIndexOf("/");
          -1 != f && (e = b.Wf().substr(0, f + 1) + e);
        }
      }
      f = e;
      if (".." == f || "." == f) {
        e = "";
      } else {
        if (Aa(f, "./") || Aa(f, "/.")) {
          for (var e = 0 == f.lastIndexOf("/", 0), f = f.split("/"), g = [], k = 0;k < f.length;) {
            var l = f[k++];
            "." == l ? e && k == f.length && g.push("") : ".." == l ? ((1 < g.length || 1 == g.length && "" != g[0]) && g.pop(), e && k == f.length && g.push("")) : (g.push(l), e = !0);
          }
          e = g.join("/");
        } else {
          e = f;
        }
      }
    }
  }
  c ? b.Je(e) : c = a.BE();
  c ? b.Pf(a.yE()) : c = a.zE();
  c && b.qk(a.jo());
  return b;
};
d.clone = function() {
  return new W(this);
};
d.jd = function() {
  return this.og;
};
d.Fd = function(a, b) {
  this.Qc();
  if (this.og = b ? dg(a) : a) {
    this.og = this.og.replace(/:$/, "");
  }
  return this;
};
d.tu = function() {
  return!!this.og;
};
d.ko = function() {
  return this.Ap;
};
d.rk = function(a, b) {
  this.Qc();
  this.Ap = b ? dg(a) : a;
  return this;
};
d.CE = function() {
  return!!this.Ap;
};
d.Dc = function() {
  return this.yp;
};
d.Ie = function(a, b) {
  this.Qc();
  this.yp = b ? dg(a) : a;
  return this;
};
d.xo = function() {
  return!!this.yp;
};
d.ik = function() {
  return this.nl;
};
d.Uh = function(a) {
  this.Qc();
  if (a) {
    a = Number(a);
    if (isNaN(a) || 0 > a) {
      throw Error("Bad port number " + a);
    }
    this.nl = a;
  } else {
    this.nl = null;
  }
  return this;
};
d.AE = function() {
  return null != this.nl;
};
d.Wf = function() {
  return this.mc;
};
d.Je = function(a, b) {
  this.Qc();
  this.mc = b ? dg(a) : a;
  return this;
};
d.su = function() {
  return!!this.mc;
};
d.BE = function() {
  return "" !== this.uc.toString();
};
d.Pf = function(a, b) {
  this.Qc();
  a instanceof Yf ? (this.uc = a, this.uc.hp(this.Sb)) : (b || (a = Zf(a, eg)), this.uc = new Yf(a, null, this.Sb));
  return this;
};
d.RG = function() {
  return this.uc.toString();
};
d.yE = function() {
  return this.uc.Jv();
};
d.El = function() {
  return this.uc;
};
d.ca = function(a, b) {
  this.Qc();
  this.uc.set(a, b);
  return this;
};
d.pj = function(a, b) {
  this.Qc();
  p(b) || (b = [String(b)]);
  this.uc.Ko(a, b);
  return this;
};
d.jo = function() {
  return this.zp;
};
d.qk = function(a, b) {
  this.Qc();
  this.zp = b ? dg(a) : a;
  return this;
};
d.zE = function() {
  return!!this.zp;
};
d.Lf = function() {
  this.Qc();
  this.ca("zx", Ka());
  return this;
};
d.Qc = function() {
  if (this.xK) {
    throw Error("Tried to modify a read-only Uri");
  }
};
d.hp = function(a) {
  this.Sb = a;
  this.uc && this.uc.hp(a);
  return this;
};
d.jE = function() {
  return this.Sb;
};
var fg = function(a, b) {
  return a instanceof W ? a.clone() : new W(a, b);
}, gg = function(a, b, c, e, f, g, k, l) {
  l = new W(null, l);
  a && l.Fd(a);
  b && l.rk(b);
  c && l.Ie(c);
  e && l.Uh(e);
  f && l.Je(f);
  g && l.Pf(g);
  k && l.qk(k);
  return l;
}, dg = function(a) {
  return a ? decodeURIComponent(a) : "";
}, Zf = function(a, b) {
  return r(a) ? encodeURI(a).replace(b, hg) : null;
}, hg = function(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
}, $f = /[#\/\?@]/g, bg = /[\#\?:]/g, ag = /[\#\?]/g, eg = /[\#\?@]/g, cg = /#/g, Yf = function(a, b, c) {
  this.Zd = a || null;
  this.Sb = !!c;
};
Yf.prototype.qd = function() {
  if (!this.wa && (this.wa = new B, this.la = 0, this.Zd)) {
    for (var a = this.Zd.split("&"), b = 0;b < a.length;b++) {
      var c = a[b].indexOf("="), e = null, f = null;
      0 <= c ? (e = a[b].substring(0, c), f = a[b].substring(c + 1)) : e = a[b];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = this.Ne(e);
      this.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "");
    }
  }
};
var ig = function(a, b, c) {
  b = Vb(a);
  if ("undefined" == typeof b) {
    throw Error("Keys are undefined");
  }
  c = new Yf(null, null, c);
  a = Ub(a);
  for (var e = 0;e < b.length;e++) {
    var f = b[e], g = a[e];
    p(g) ? c.Ko(f, g) : c.add(f, g);
  }
  return c;
};
d = Yf.prototype;
d.wa = null;
d.la = null;
d.J = function() {
  this.qd();
  return this.la;
};
d.add = function(a, b) {
  this.qd();
  this.dg();
  a = this.Ne(a);
  var c = this.wa.get(a);
  c || this.wa.set(a, c = []);
  c.push(b);
  this.la++;
  return this;
};
d.remove = function(a) {
  this.qd();
  a = this.Ne(a);
  return this.wa.Ja(a) ? (this.dg(), this.la -= this.wa.get(a).length, this.wa.remove(a)) : !1;
};
d.clear = function() {
  this.dg();
  this.wa = null;
  this.la = 0;
};
d.vb = function() {
  this.qd();
  return 0 == this.la;
};
d.Ja = function(a) {
  this.qd();
  a = this.Ne(a);
  return this.wa.Ja(a);
};
d.jg = function(a) {
  var b = this.R();
  return qb(b, a);
};
d.fb = function() {
  this.qd();
  for (var a = this.wa.R(), b = this.wa.fb(), c = [], e = 0;e < b.length;e++) {
    for (var f = a[e], g = 0;g < f.length;g++) {
      c.push(b[e]);
    }
  }
  return c;
};
d.R = function(a) {
  this.qd();
  var b = [];
  if (r(a)) {
    this.Ja(a) && (b = vb(b, this.wa.get(this.Ne(a))));
  } else {
    a = this.wa.R();
    for (var c = 0;c < a.length;c++) {
      b = vb(b, a[c]);
    }
  }
  return b;
};
d.set = function(a, b) {
  this.qd();
  this.dg();
  a = this.Ne(a);
  this.Ja(a) && (this.la -= this.wa.get(a).length);
  this.wa.set(a, [b]);
  this.la++;
  return this;
};
d.get = function(a, b) {
  var c = a ? this.R(a) : [];
  return 0 < c.length ? String(c[0]) : b;
};
d.Ko = function(a, b) {
  this.remove(a);
  0 < b.length && (this.dg(), this.wa.set(this.Ne(a), wb(b)), this.la += b.length);
};
d.toString = function() {
  if (this.Zd) {
    return this.Zd;
  }
  if (!this.wa) {
    return "";
  }
  for (var a = [], b = this.wa.fb(), c = 0;c < b.length;c++) {
    for (var e = b[c], f = encodeURIComponent(String(e)), e = this.R(e), g = 0;g < e.length;g++) {
      var k = f;
      "" !== e[g] && (k += "=" + encodeURIComponent(String(e[g])));
      a.push(k);
    }
  }
  return this.Zd = a.join("&");
};
d.Jv = function() {
  return dg(this.toString());
};
d.dg = function() {
  this.Zd = null;
};
d.clone = function() {
  var a = new Yf;
  a.Zd = this.Zd;
  this.wa && (a.wa = this.wa.clone(), a.la = this.la);
  return a;
};
d.Ne = function(a) {
  a = String(a);
  this.Sb && (a = a.toLowerCase());
  return a;
};
d.hp = function(a) {
  a && !this.Sb && (this.qd(), this.dg(), Wb(this.wa, function(a, c) {
    var e = c.toLowerCase();
    c != e && (this.remove(c), this.Ko(e, a));
  }, this));
  this.Sb = a;
};
d.extend = function(a) {
  for (var b = 0;b < arguments.length;b++) {
    Wb(arguments[b], function(a, b) {
      this.add(b, a);
    }, this);
  }
};
var lg = function(a, b) {
  var c = a;
  b && (c = s(a, b));
  ha(h.setImmediate) ? h.setImmediate(c) : (jg || (jg = kg()), jg(c));
}, jg, kg = function() {
  var a = h.MessageChannel;
  "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && (a = function() {
    var a = document.createElement("iframe");
    a.style.display = "none";
    a.src = "";
    document.documentElement.appendChild(a);
    var b = a.contentWindow, a = b.document;
    a.open();
    a.write("");
    a.close();
    var c = "callImmediate" + Math.random(), e = b.location.protocol + "//" + b.location.host, a = s(function(a) {
      if (a.origin == e || a.data == c) {
        this.port1.onmessage();
      }
    }, this);
    b.addEventListener("message", a, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      b.postMessage(c, e);
    }};
  });
  if ("undefined" !== typeof a) {
    var b = new a, c = {}, e = c;
    b.port1.onmessage = function() {
      c = c.next;
      var a = c.kx;
      c.kx = null;
      a();
    };
    return function(a) {
      e.next = {kx:a};
      e = e.next;
      b.port2.postMessage(0);
    };
  }
  return "undefined" !== typeof document && "onreadystatechange" in document.createElement("script") ? function(a) {
    var b = document.createElement("script");
    b.onreadystatechange = function() {
      b.onreadystatechange = null;
      b.parentNode.removeChild(b);
      b = null;
      a();
      a = null;
    };
    document.documentElement.appendChild(b);
  } : function(a) {
    h.setTimeout(a, 0);
  };
};
var mg = function(a) {
  lg(function() {
    throw a;
  });
}, rg = function(a, b) {
  ng || (lg(og), ng = !0);
  pg.push(new qg(a, b));
}, ng = !1, pg = [], og = function() {
  for (;pg.length;) {
    var a = pg;
    pg = [];
    for (var b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        c.sK.call(c.scope);
      } catch (e) {
        mg(e);
      }
    }
  }
  ng = !1;
}, qg = function(a, b) {
  this.sK = a;
  this.scope = b;
};
var sg = function(a) {
  a.prototype.then = a.prototype.then;
  a.prototype.$goog_labs_Thenable = !0;
}, tg = function(a) {
  if (!a) {
    return!1;
  }
  try {
    return!!a.$goog_labs_Thenable;
  } catch (b) {
    return!1;
  }
};
var ug = function(a, b) {
  this.h = 0;
  this.Jc = void 0;
  this.Ub = this.Ea = null;
  this.vk = this.mo = !1;
  this.oo = [];
  this.Yt(Error("created"));
  this.Qt = 0;
  try {
    var c = this;
    a.call(b, function(a) {
      c.bg(2, a);
    }, function(a) {
      c.bg(3, a);
    });
  } catch (e) {
    this.bg(3, e);
  }
};
ug.prototype.then = function(a, b, c) {
  this.Yt(Error("then"));
  return this.YJ(ha(a) ? a : null, ha(b) ? b : null, c);
};
sg(ug);
d = ug.prototype;
d.cancel = function(a) {
  0 == this.h && rg(function() {
    var b = new vg(a);
    this.Eu(b);
  }, this);
};
d.Eu = function(a) {
  0 == this.h && (this.Ea ? this.Ea.JE(this, a) : this.bg(3, a));
};
d.JE = function(a, b) {
  if (this.Ub) {
    for (var c = 0, e = -1, f = 0, g;g = this.Ub[f];f++) {
      if (g = g.Ck) {
        if (c++, g == a && (e = f), 0 <= e && 1 < c) {
          break;
        }
      }
    }
    0 <= e && (0 == this.h && 1 == c ? this.Eu(b) : (c = this.Ub.splice(e, 1)[0], this.nu(c, 3, b)));
  }
};
d.BH = function(a) {
  this.Ub && this.Ub.length || 2 != this.h && 3 != this.h || this.uu();
  this.Ub || (this.Ub = []);
  this.Ub.push(a);
};
d.YJ = function(a, b, c) {
  var e = {Ck:null, iw:null, jw:null};
  e.Ck = new ug(function(f, g) {
    e.iw = a ? function(b) {
      try {
        var e = a.call(c, b);
        f(e);
      } catch (q) {
        g(q);
      }
    } : f;
    e.jw = b ? function(a) {
      try {
        var e = b.call(c, a);
        !n(e) && a instanceof vg ? g(a) : f(e);
      } catch (q) {
        g(q);
      }
    } : g;
  });
  e.Ck.Ea = this;
  this.BH(e);
  return e.Ck;
};
d.Fu = function(a) {
  v(1 == this.h);
  this.h = 0;
  this.bg(2, a);
};
d.Gu = function(a) {
  v(1 == this.h);
  this.h = 0;
  this.bg(3, a);
};
d.bg = function(a, b) {
  if (0 == this.h) {
    if (this == b) {
      a = 3, b = new TypeError("Promise cannot resolve to itself");
    } else {
      if (tg(b)) {
        this.h = 1;
        b.then(this.Fu, this.Gu, this);
        return;
      }
      if (ia(b)) {
        try {
          var c = b.then;
          if (ha(c)) {
            this.TE(b, c);
            return;
          }
        } catch (e) {
          a = 3, b = e;
        }
      }
    }
    this.Jc = b;
    this.h = a;
    this.uu();
    3 != a || b instanceof vg || wg(this, b);
  }
};
d.TE = function(a, b) {
  this.h = 1;
  var c = this, e = !1, f = function(a) {
    e || (e = !0, c.Fu(a));
  }, g = function(a) {
    e || (e = !0, c.Gu(a));
  };
  try {
    b.call(a, f, g);
  } catch (k) {
    g(k);
  }
};
d.uu = function() {
  this.mo || (this.mo = !0, rg(this.SJ, this));
};
d.SJ = function() {
  for (;this.Ub && this.Ub.length;) {
    var a = this.Ub;
    this.Ub = [];
    for (var b = 0;b < a.length;b++) {
      this.Qt++, this.nu(a[b], this.h, this.Jc);
    }
  }
  this.mo = !1;
};
d.nu = function(a, b, c) {
  2 == b ? a.iw(c) : (this.BJ(), a.jw(c));
};
d.Yt = function(a) {
  if (a.stack) {
    var b = a.stack.split("\n", 4)[3];
    a = a.message;
    a += Array(11 - a.length).join(" ");
    this.oo.push(a + b);
  }
};
d.HJ = function(a) {
  if (a && a.stack && this.oo.length) {
    for (var b = ["Promise trace:"], c = this;c;c = c.Ea) {
      for (var e = this.Qt;0 <= e;e--) {
        b.push(c.oo[e]);
      }
      b.push("Value: [" + (3 == c.h ? "REJECTED" : "FULFILLED") + "] <" + String(c.Jc) + ">");
    }
    a.stack += "\n\n" + b.join("\n");
  }
};
d.BJ = function() {
  var a;
  for (a = this;a && a.vk;a = a.Ea) {
    a.vk = !1;
  }
};
var wg = function(a, b) {
  a.vk = !0;
  rg(function() {
    a.vk && (a.HJ(b), xg.call(null, b));
  });
}, xg = mg, vg = function(a) {
  Ua.call(this, a);
};
u(vg, Ua);
vg.prototype.name = "cancel";
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
var yg = function(a, b) {
  this.kd = [];
  this.Au = a;
  this.fu = b || null;
  this.ai = this.av = !1;
  this.Jc = void 0;
  this.Co = this.hu = this.uo = !1;
  this.Ek = 0;
  this.Ea = null;
  this.Dk = 0;
  this.Jo = null;
  if (Error.captureStackTrace) {
    var c = {stack:""};
    Error.captureStackTrace(c, yg);
    "string" == typeof c.stack && (this.Jo = c.stack.replace(/^[^\n]*\n/, ""));
  }
};
d = yg.prototype;
d.cancel = function(a) {
  if (this.sc()) {
    this.Jc instanceof yg && this.Jc.cancel();
  } else {
    if (this.Ea) {
      var b = this.Ea;
      delete this.Ea;
      a ? b.cancel(a) : b.qG();
    }
    this.Au ? this.Au.call(this.fu, this) : this.Co = !0;
    this.sc() || this.gv(new zg(this));
  }
};
d.qG = function() {
  this.Dk--;
  0 >= this.Dk && this.cancel();
};
d.Ju = function(a, b) {
  this.uo = !1;
  this.vp(a, b);
};
d.vp = function(a, b) {
  this.av = !0;
  this.Jc = b;
  this.ai = !a;
  this.Qv();
};
d.Pw = function() {
  if (this.sc()) {
    if (!this.Co) {
      throw new Ag(this);
    }
    this.Co = !1;
  }
};
d.Ta = function(a) {
  this.Pw();
  this.Ow(a);
  this.vp(!0, a);
};
d.gv = function(a) {
  this.Pw();
  this.Ow(a);
  this.wu(a);
  this.vp(!1, a);
};
d.wu = function(a) {
  this.Jo && ia(a) && a.stack && /^[^\n]+(\n   [^\n]+)+/.test(a.stack) && (a.stack = a.stack + "\nDEFERRED OPERATION:\n" + this.Jo);
};
d.Ow = function(a) {
  v(!(a instanceof yg), "An execution sequence may not be initiated with a blocking Deferred.");
};
d.Lj = function(a, b) {
  return this.Gk(a, null, b);
};
d.Gk = function(a, b, c) {
  v(!this.hu, "Blocking Deferreds can not be re-used");
  this.kd.push([a, b, c]);
  this.sc() && this.Qv();
  return this;
};
d.then = function(a, b, c) {
  var e, f, g = new ug(function(a, b) {
    e = a;
    f = b;
  });
  this.Gk(e, function(a) {
    a instanceof zg ? g.cancel() : f(a);
  });
  return g.then(a, b, c);
};
sg(yg);
d = yg.prototype;
d.$H = function(a) {
  this.Gk(a.Ta, a.gv, a);
  return this;
};
d.Kf = function(a) {
  return this.Lj(s(a.IJ, a));
};
d.IJ = function(a) {
  var b = new yg;
  this.$H(b);
  a && (b.Ea = this, this.Dk++);
  return b;
};
d.sc = function() {
  return this.av;
};
d.XE = function(a) {
  return a instanceof Error;
};
d.Ku = function() {
  return mb(this.kd, function(a) {
    return ha(a[1]);
  });
};
d.Qv = function() {
  if (this.Ek && this.sc() && this.Ku()) {
    var a = this.Ek, b = Bg[a];
    b && (b.YE(), delete Bg[a]);
    this.Ek = 0;
  }
  this.Ea && (this.Ea.Dk--, delete this.Ea);
  for (var a = this.Jc, c = b = !1;this.kd.length && !this.uo;) {
    var e = this.kd.shift(), f = e[0], g = e[1], e = e[2];
    if (f = this.ai ? g : f) {
      try {
        var k = f.call(e || this.fu, a);
        n(k) && (this.ai = this.ai && (k == a || this.XE(k)), this.Jc = a = k);
        tg(a) && (this.uo = c = !0);
      } catch (l) {
        a = l, this.ai = !0, this.wu(a), this.Ku() || (b = !0);
      }
    }
  }
  this.Jc = a;
  c && (k = s(this.Ju, this, !0), c = s(this.Ju, this, !1), a instanceof yg ? (a.Gk(k, c), a.hu = !0) : a.then(k, c));
  b && (b = ++Cg, Bg[b] = new Dg(b, a), this.Ek = b);
};
var Ag = function() {
  Ua.call(this);
};
u(Ag, Ua);
Ag.prototype.message = "Deferred has already fired";
Ag.prototype.name = "AlreadyCalledError";
var zg = function() {
  Ua.call(this);
};
u(zg, Ua);
zg.prototype.message = "Deferred was canceled";
zg.prototype.name = "CanceledError";
var Dg = function(a, b) {
  this.ia = a;
  this.Xa = b;
  this.uf = h.setTimeout(s(this.NG, this), 0);
};
Dg.prototype.NG = function() {
  v(Bg[this.ia], "Cannot throw an error that is not scheduled.");
  delete Bg[this.ia];
  throw this.Xa;
};
Dg.prototype.YE = function() {
  h.clearTimeout(this.uf);
};
var Bg = {}, Cg = 0;
var Eg = {1:"NativeMessagingTransport", 2:"FrameElementMethodTransport", 3:"IframeRelayTransport", 4:"IframePollingTransport", 5:"FlashTransport", 6:"NixTransport", 7:"DirectTransport"}, Fg = ["pu", "lru", "pru", "lpu", "ppu"], Gg = {}, Ig = function(a, b) {
  for (var c = b || Hg, e = c.length, f = "";0 < a--;) {
    f += c.charAt(Math.floor(Math.random() * e));
  }
  return f;
}, Hg = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", X = Vf("goog.net.xpc");
var Jg = function(a) {
  this.Za = a || Ef();
};
u(Jg, K);
Jg.prototype.Ue = 0;
Jg.prototype.S = function() {
  return this.Za.S();
};
Jg.prototype.getName = function() {
  return Eg[this.Ue] || "";
};
var Kg = function(a, b) {
  this.Za = b || Ef();
  this.g = a;
  this.t = new P(this);
  this.uh(this.t);
  this.Hc = new Te(100, this.S());
  this.uh(this.Hc);
  this.ib = new yg;
  this.jb = new yg;
  this.$a = new yg;
  this.yn = Ig(10);
  this.Md = null;
  this.sh = {};
  this.RB = this.g.name;
  this.g.Kj(this.g.name + "_" + this.g.Eb());
  this.Pa = !1;
  this.$a.Kf(this.ib);
  this.$a.Kf(this.jb);
  this.$a.Lj(this.Qj, this);
  this.$a.Ta(!0);
  this.t.listen(this.Hc, "tick", this.Bh);
  U(X, "DirectTransport created. role=" + this.g.Eb());
};
u(Kg, Jg);
var Lg = {}, Og = function(a) {
  var b = new Mg(a.channelName, a.service, a.payload);
  a = b.ho;
  var c = b.service, b = b.payload;
  V(X, "messageReceived: channel=" + a + ", service=" + c + ", payload=" + b);
  var e = Gg[a];
  if (e) {
    return e.qc(c, b), !0;
  }
  var e = Ng(b)[0], f;
  for (f in Gg) {
    var g = Gg[f];
    if (1 == g.Eb() && !g.oa() && "tp" == c && "SETUP" == e) {
      return g.Kj(a), g.qc(c, b), !0;
    }
  }
  U(X, "channel name mismatch; message ignored.");
  return!1;
};
d = Kg.prototype;
d.Ue = 7;
d.Sk = function(a) {
  a = Ng(a);
  var b = a[1];
  switch(a[0]) {
    case "SETUP_ACK":
      this.ib.sc() || this.ib.Ta(!0);
      break;
    case "SETUP":
      this.Mk(), null != this.Md && this.Md != b && (U(X, "Sending SETUP and changing peer ID to: " + b), this.Nh()), this.Md = b;
  }
};
d.Nh = function() {
  var a;
  a = "SETUP," + this.yn;
  this.send("tp", a);
};
d.Mk = function() {
  this.send("tp", "SETUP_ACK");
  this.jb.sc() || this.jb.Ta(!0);
};
d.connect = function() {
  var a = this.S();
  if (a) {
    var b = la(a);
    0 == (Lg[b] || 0) && null == ca("crosswindowmessaging.channel", a) && ba("crosswindowmessaging.channel", Og, a);
    Lg[b]++;
    this.Pa = !0;
    this.Bh();
  } else {
    V(X, "connect(): no window to initialize.");
  }
};
d.Bh = function() {
  this.g.oa() ? this.Hc.stop() : (this.Hc.start(), this.Nh());
};
d.send = function(a, b) {
  if (this.g.Bk()) {
    var c = new Mg(this.RB + "_" + this.FE(), a, b);
    this.sh[la(c)] = Q(s(this.EE, this, c), 0);
  } else {
    V(X, "send(): window not ready");
  }
};
d.EE = function(a) {
  delete this.sh[la(a)];
  try {
    var b = ca("crosswindowmessaging.channel", this.g.Bk());
  } catch (c) {
    Wf(X, "Can't access other window, ignoring.", c);
    return;
  }
  if (null === b) {
    Wf(X, "Peer window had no global function.");
  } else {
    try {
      b(a.GE()), U(X, "send(): channelName=" + a.ho + " service=" + a.service + " payload=" + a.payload);
    } catch (e) {
      Wf(X, "Error performing call, ignoring.", e);
    }
  }
};
d.FE = function() {
  return 0 == this.g.Eb() ? 1 : 0;
};
d.Qj = function() {
  this.g.Kc();
};
d.k = function() {
  if (this.Pa) {
    var a = this.S(), b = la(a);
    1 == --Lg[b] && ba("crosswindowmessaging.channel", null, a);
  }
  this.sh && (Fb(this.sh, function(a) {
    h.clearTimeout(a);
  }), this.sh = null);
  this.ib && (this.ib.cancel(), delete this.ib);
  this.jb && (this.jb.cancel(), delete this.jb);
  this.$a && (this.$a.cancel(), delete this.$a);
  Kg.q.k.call(this);
};
var Ng = function(a) {
  a = a.split(",");
  a[1] = a[1] || null;
  return a;
}, Mg = function(a, b, c) {
  this.ho = a;
  this.service = b;
  this.payload = c;
};
Mg.prototype.GE = function() {
  return{channelName:this.ho, service:this.service, payload:this.payload};
};
var Pg = function(a, b) {
  this.Za = b || Ef();
  this.g = a;
  this.Vh = [];
  this.$C = s(this.iE, this);
};
u(Pg, Jg);
d = Pg.prototype;
d.Ue = 2;
d.bo = !1;
d.ga = 0;
d.connect = function() {
  0 == this.g.Eb() ? (this.hd = this.g.Lt(), this.hd.XPC_toOuter = s(this.Gt, this)) : this.Ft();
};
d.Ft = function() {
  var a = !0;
  try {
    this.hd || (this.hd = this.S().frameElement), this.hd && this.hd.XPC_toOuter && (this.In = this.hd.XPC_toOuter, this.hd.XPC_toOuter.XPC_toInner = s(this.Gt, this), a = !1, this.send("tp", "SETUP_ACK"), this.g.Kc());
  } catch (b) {
    T(X, "exception caught while attempting setup: " + b);
  }
  a && (this.Ut || (this.Ut = s(this.Ft, this)), this.S().setTimeout(this.Ut, 100));
};
d.Sk = function(a) {
  if (0 != this.g.Eb() || this.g.oa() || "SETUP_ACK" != a) {
    throw Error("Got unexpected transport message.");
  }
  this.In = this.hd.XPC_toOuter.XPC_toInner;
  this.g.Kc();
};
d.Gt = function(a, b) {
  this.bo || 0 != this.Vh.length ? (this.Vh.push({serviceName:a, payload:b}), 1 == this.Vh.length && (this.ga = this.S().setTimeout(this.$C, 1))) : this.g.qc(a, b);
};
d.iE = function() {
  for (;this.Vh.length;) {
    var a = this.Vh.shift();
    this.g.qc(a.serviceName, a.payload);
  }
};
d.send = function(a, b) {
  this.bo = !0;
  this.In(a, b);
  this.bo = !1;
};
d.k = function() {
  Pg.q.k.call(this);
  this.hd = this.In = null;
};
var Qg = function(a, b) {
  this.Za = b || Ef();
  this.g = a;
  this.Th = this.g.Ak().ppu;
  this.HD = this.g.Ak().lpu;
  this.tk = [];
}, Rg, Sg;
u(Qg, Jg);
d = Qg.prototype;
d.KD = 5;
d.Ue = 4;
d.kd = 0;
d.Qf = !1;
d.Pa = !1;
d.gu = null;
d.dk = function() {
  return "googlexpc_" + this.g.name + "_msg";
};
d.ck = function() {
  return "googlexpc_" + this.g.name + "_ack";
};
d.ju = function() {
  return!this.Of() && this.g.bu();
};
d.Zn = function() {
  try {
    if (this.ju()) {
      return this.g.Bk().frames || {};
    }
  } catch (a) {
    V(X, "error retrieving peer frames");
  }
  return{};
};
d.ao = function(a) {
  return this.Zn()[a];
};
d.connect = function() {
  this.ju() && (V(X, "transport connect called"), this.Pa || (V(X, "initializing..."), this.bI(), this.Pa = !0), this.aI());
};
d.bI = function() {
  var a = this.dk();
  this.Sf = this.$n(a);
  this.Pn = this.S().frames[a];
  a = this.ck();
  this.Rf = this.$n(a);
  this.On = this.S().frames[a];
};
d.$n = function(a) {
  S(X, F, "constructing sender frame: " + a);
  var b = document.createElement("iframe"), c = b.style;
  c.position = "absolute";
  c.top = "-10px";
  c.left = "10px";
  c.width = "1px";
  c.height = "1px";
  b.id = b.name = a;
  b.src = this.Th + "#INITIAL";
  this.S().document.body.appendChild(b);
  return b;
};
d.gD = function() {
  this.gu || 0 < this.KD-- || (S(X, F, "Inner peer reconnect triggered."), this.g.Kj(Ig(10)), S(X, F, "switching channels: " + this.g.name), this.du(), this.Pa = !1, this.gu = this.$n("googlexpc_reconnect_" + this.g.name));
};
d.hD = function() {
  S(X, F, "outerPeerReconnect called");
  for (var a = this.Zn(), b = a.length, c = 0;c < b;c++) {
    var e;
    try {
      a[c] && a[c].name && (e = a[c].name);
    } catch (f) {
    }
    if (e) {
      var g = e.split("_");
      if (3 == g.length && "googlexpc" == g[0] && "reconnect" == g[1]) {
        this.g.name = g[2];
        this.du();
        this.Pa = !1;
        break;
      }
    }
  }
};
d.du = function() {
  S(X, F, "deconstructSenderFrames called");
  this.Sf && (this.Sf.parentNode.removeChild(this.Sf), this.Pn = this.Sf = null);
  this.Rf && (this.Rf.parentNode.removeChild(this.Rf), this.On = this.Rf = null);
};
d.aI = function() {
  this.Jt(this.dk()) && this.Jt(this.ck()) ? (V(X, "foreign frames present"), this.Is = new Tg(this, this.ao(this.dk()), s(this.jD, this)), this.Hs = new Tg(this, this.ao(this.ck()), s(this.iD, this)), this.kt()) : (S(X, F, "foreign frames not (yet) present"), 1 == this.g.Eb() ? this.gD() : 0 == this.g.Eb() && this.hD(), this.S().setTimeout(s(this.connect, this), 100));
};
d.Jt = function(a) {
  S(X, F, "checking for receive frame: " + a);
  try {
    var b = this.ao(a);
    if (!b || 0 != b.location.href.indexOf(this.HD)) {
      return!1;
    }
  } catch (c) {
    return!1;
  }
  return!0;
};
d.kt = function() {
  var a = this.Zn();
  a[this.ck()] && a[this.dk()] ? (this.Ou = new Ug(this.Th, this.Pn), this.hk = new Ug(this.Th, this.On), V(X, "local frames ready"), this.S().setTimeout(s(function() {
    this.Ou.send("SETUP");
    this.Qf = !0;
    V(X, "SETUP sent");
  }, this), 100)) : (this.hv || (this.hv = s(this.kt, this)), this.S().setTimeout(this.hv, 100), V(X, "local frames not (yet) present"));
};
d.Nt = function() {
  if (this.co && this.Dt) {
    if (this.g.Kc(), this.ag) {
      V(X, "delivering queued messages (" + this.ag.length + ")");
      for (var a = 0, b;a < this.ag.length;a++) {
        b = this.ag[a], this.g.qc(b.service, b.payload);
      }
      delete this.ag;
    }
  } else {
    S(X, F, "checking if connected: ack sent:" + this.co + ", ack rcvd: " + this.Dt);
  }
};
d.jD = function(a) {
  S(X, F, "msg received: " + a);
  if ("SETUP" == a) {
    this.hk && (this.hk.send("SETUP_ACK"), S(X, F, "SETUP_ACK sent"), this.co = !0, this.Nt());
  } else {
    if (this.g.oa() || this.co) {
      var b = a.indexOf("|"), c = a.substring(0, b);
      a = a.substring(b + 1);
      b = c.indexOf(",");
      if (-1 == b) {
        var e;
        this.hk.send("ACK:" + c);
        this.eu(a);
      } else {
        e = c.substring(0, b), this.hk.send("ACK:" + e), c = c.substring(b + 1).split("/"), b = parseInt(c[0], 10), c = parseInt(c[1], 10), 1 == b && (this.to = []), this.to.push(a), b == c && (this.eu(this.to.join("")), delete this.to);
      }
    } else {
      Wf(X, "received msg, but channel is not connected");
    }
  }
};
d.iD = function(a) {
  S(X, F, "ack received: " + a);
  "SETUP_ACK" == a ? (this.Qf = !1, this.Dt = !0, this.Nt()) : this.g.oa() ? this.Qf ? parseInt(a.split(":")[1], 10) == this.kd ? (this.Qf = !1, this.Xt()) : Wf(X, "got ack with wrong sequence") : Wf(X, "got unexpected ack") : Wf(X, "received ack, but channel not connected");
};
d.Xt = function() {
  if (!this.Qf && this.tk.length) {
    var a = this.tk.shift();
    ++this.kd;
    this.Ou.send(this.kd + a);
    S(X, F, "msg sent: " + this.kd + a);
    this.Qf = !0;
  }
};
d.eu = function(a) {
  var b = a.indexOf(":"), c = a.substr(0, b);
  a = a.substring(b + 1);
  this.g.oa() ? this.g.qc(c, a) : ((this.ag || (this.ag = [])).push({service:c, payload:a}), S(X, F, "queued delivery"));
};
d.ol = 3800;
d.send = function(a, b) {
  var c = a + ":" + b;
  if (!C || b.length <= this.ol) {
    this.tk.push("|" + c);
  } else {
    for (var e = b.length, f = Math.ceil(e / this.ol), g = 0, k = 1;g < e;) {
      this.tk.push("," + k + "/" + f + "|" + c.substr(g, this.ol)), k++, g += this.ol;
    }
  }
  this.Xt();
};
d.k = function() {
  Qg.q.k.call(this);
  var a = Wg;
  tb(a, this.Is);
  tb(a, this.Hs);
  this.Is = this.Hs = null;
  If(this.Sf);
  If(this.Rf);
  this.Pn = this.On = this.Sf = this.Rf = null;
};
var Wg = [], Xg = s(function() {
  var a = Wg, b, c = !1;
  try {
    for (var e = 0;b = a[e];e++) {
      c = c || b.im();
    }
  } catch (f) {
    if (U(X, "receive_() failed: " + f), b.ab.g.sE(), !a.length) {
      return;
    }
  }
  a = t();
  c && (Rg = a);
  Sg = window.setTimeout(Xg, 1E3 > a - Rg ? 10 : 100);
}, Qg), Yg = function() {
  V(X, "starting receive-timer");
  Rg = t();
  Sg && window.clearTimeout(Sg);
  Sg = window.setTimeout(Xg, 10);
}, Ug = function(a, b) {
  this.Th = a;
  this.Rw = b;
  this.wp = 0;
};
Ug.prototype.send = function(a) {
  this.wp = ++this.wp % 2;
  a = this.Th + "#" + this.wp + encodeURIComponent(a);
  try {
    E ? this.Rw.location.href = a : this.Rw.location.replace(a);
  } catch (b) {
    T(X, "sending failed", b);
  }
  Yg();
};
var Tg = function(a, b, c) {
  this.ab = a;
  this.Bw = b;
  this.ZH = c;
  this.Aw = this.Bw.location.href.split("#")[0] + "#INITIAL";
  Wg.push(this);
  Yg();
};
Tg.prototype.im = function() {
  var a = this.Bw.location.href;
  if (a != this.Aw) {
    this.Aw = a;
    if (a = a.split("#")[1]) {
      a = a.substr(1), this.ZH(decodeURIComponent(a));
    }
    return!0;
  }
  return!1;
};
var $g = function(a, b) {
  this.Za = b || Ef();
  this.g = a;
  this.vD = this.g.Ak().pru;
  this.Wt = this.g.Ak().ifrid;
  E && Zg();
};
u($g, Jg);
if (E) {
  var ah = [], bh = 0, Zg = function() {
    bh || (bh = window.setTimeout(function() {
      ch();
    }, 1E3));
  }, ch = function(a) {
    var b = t();
    for (a = a || 3E3;ah.length && b - ah[0].timestamp >= a;) {
      var c = ah.shift().JD;
      If(c);
      S(X, F, "iframe removed");
    }
    bh = window.setTimeout(dh, 1E3);
  }, dh = function() {
    ch();
  }
}
var eh = {};
$g.prototype.Ue = 3;
$g.prototype.connect = function() {
  this.S().xpcRelay || (this.S().xpcRelay = fh);
  this.send("tp", "SETUP");
};
var fh = function(a, b) {
  var c = b.indexOf(":"), e = b.substr(0, c), f = b.substr(c + 1);
  if (C && -1 != (c = e.indexOf("|"))) {
    var g = e.substr(0, c), e = e.substr(c + 1), c = e.indexOf("+"), k = e.substr(0, c), c = parseInt(e.substr(c + 1), 10), l = eh[k];
    l || (l = eh[k] = {Hw:[], Jw:0, Gw:0});
    Aa(e, "++") && (l.Gw = c + 1);
    l.Hw[c] = f;
    l.Jw++;
    if (l.Jw != l.Gw) {
      return;
    }
    f = l.Hw.join("");
    delete eh[k];
  } else {
    var g = e
  }
  Gg[a].qc(g, decodeURIComponent(f));
};
$g.prototype.Sk = function(a) {
  "SETUP" == a ? (this.send("tp", "SETUP_ACK"), this.g.Kc()) : "SETUP_ACK" == a && this.g.Kc();
};
$g.prototype.send = function(a, b) {
  var c = encodeURIComponent(b), e = c.length;
  if (C && 1800 < e) {
    for (var f = Ka(), g = 0, k = 0;g < e;k++) {
      var l = c.substr(g, 1800), g = g + 1800;
      this.ll(a, l, f + (g >= e ? "++" : "+") + k);
    }
  } else {
    this.ll(a, c);
  }
};
$g.prototype.ll = function(a, b, c) {
  if (C) {
    var e = this.S().document.createElement("div");
    e.innerHTML = '<iframe onload="this.xpcOnload()"></iframe>';
    e = e.childNodes[0];
    e.xpcOnload = gh;
  } else {
    e = this.S().document.createElement("iframe"), E ? ah.push({timestamp:t(), JD:e}) : M(e, "load", gh);
  }
  var f = e.style;
  f.visibility = "hidden";
  f.width = e.style.height = "0px";
  f.position = "absolute";
  f = this.vD;
  f += "#" + this.g.name;
  this.Wt && (f += "," + this.Wt);
  f += "|" + a;
  c && (f += "|" + c);
  f += ":" + b;
  e.src = f;
  this.S().document.body.appendChild(e);
  S(X, F, "msg sent: " + f);
};
var gh = function() {
  S(X, F, "iframe-load");
  If(this);
};
$g.prototype.k = function() {
  $g.q.k.call(this);
  E && ch(0);
};
var hh = function(a, b, c, e, f) {
  this.Za = c || Ef();
  this.g = a;
  this.yb = f || 2;
  v(1 <= this.yb);
  v(2 >= this.yb);
  this.Ds = b || "*";
  this.t = new P(this);
  this.Hc = new Te(100, this.S());
  this.Nj = !!e;
  this.ib = new yg;
  this.jb = new yg;
  this.$a = new yg;
  this.yn = Ig(10);
  this.Md = null;
  this.Nj ? 1 == this.g.Eb() ? this.$a.Kf(this.ib) : this.$a.Kf(this.jb) : (this.$a.Kf(this.ib), 2 == this.yb && this.$a.Kf(this.jb));
  this.$a.Lj(this.Qj, this);
  this.$a.Ta(!0);
  this.t.listen(this.Hc, "tick", this.Bh);
  U(X, "NativeMessagingTransport created.  protocolVersion=" + this.yb + ", oneSidedHandshake=" + this.Nj + ", role=" + this.g.Eb());
};
u(hh, Jg);
hh.prototype.Td = null;
hh.prototype.Pa = !1;
hh.prototype.Ue = 1;
var ih = {};
hh.prototype.Vk = function(a) {
  return null == this.Td || this.Td == a;
};
var kh = function(a) {
  var b = a.Hv().data;
  if (!r(b)) {
    return!1;
  }
  var c = b.indexOf("|"), e = b.indexOf(":");
  if (-1 == c || -1 == e) {
    return!1;
  }
  var f = b.substring(0, c), c = b.substring(c + 1, e), b = b.substring(e + 1);
  V(X, "messageReceived: channel=" + f + ", service=" + c + ", payload=" + b);
  if (e = Gg[f]) {
    return e.qc(c, b, a.Hv().origin), !0;
  }
  a = jh(b)[0];
  for (var g in Gg) {
    if (e = Gg[g], 1 == e.Eb() && !e.oa() && "tp" == c && ("SETUP" == a || "SETUP_NTPV2" == a)) {
      return e.Kj(f), e.qc(c, b), !0;
    }
  }
  U(X, 'channel name mismatch; message ignored"');
  return!1;
};
d = hh.prototype;
d.Sk = function(a) {
  var b = jh(a);
  a = b[1];
  switch(b[0]) {
    case "SETUP_ACK":
      this.Qk(1);
      this.ib.sc() || this.ib.Ta(!0);
      break;
    case "SETUP_ACK_NTPV2":
      2 == this.yb && (this.Qk(2), this.ib.sc() || this.ib.Ta(!0));
      break;
    case "SETUP":
      this.Qk(1);
      this.Mk(1);
      break;
    case "SETUP_NTPV2":
      2 == this.yb && (b = this.Td, this.Qk(2), this.Mk(2), 1 != b && null == this.Md || this.Md == a || (U(X, "Sending SETUP and changing peer ID to: " + a), this.Nh()), this.Md = a);
  }
};
d.Nh = function() {
  v(!(1 == this.yb && 2 == this.Td));
  if (2 == this.yb && this.Vk(2)) {
    var a;
    a = "SETUP_NTPV2," + this.yn;
    this.send("tp", a);
  }
  this.Vk(1) && this.send("tp", "SETUP");
};
d.Mk = function(a) {
  v(1 != this.yb || 2 != a, "Shouldn't try to send a v2 setup ack in v1 mode.");
  if (2 == this.yb && this.Vk(2) && 2 == a) {
    this.send("tp", "SETUP_ACK_NTPV2");
  } else {
    if (this.Vk(1) && 1 == a) {
      this.send("tp", "SETUP_ACK");
    } else {
      return;
    }
  }
  this.jb.sc() || this.jb.Ta(!0);
};
d.Qk = function(a) {
  a > this.Td && (this.Td = a);
  1 == this.Td && (this.jb.sc() || this.Nj || this.jb.Ta(!0), this.Md = null);
};
d.connect = function() {
  var a = this.S(), b = la(a), c = ih[b];
  ga(c) || (c = 0);
  0 == c && M(a.postMessage ? a : a.document, "message", kh, !1, hh);
  ih[b] = c + 1;
  this.Pa = !0;
  this.Bh();
};
d.Bh = function() {
  var a = 0 == this.g.Eb();
  this.Nj && a || this.g.oa() || this.Of() ? this.Hc.stop() : (this.Hc.start(), this.Nh());
};
d.send = function(a, b) {
  var c = this.g.Bk();
  c ? (this.send = function(a, b) {
    var g = this, k = this.g.name;
    this.Sj = Q(function() {
      g.Sj = 0;
      try {
        var l = c.postMessage ? c : c.document;
        l.postMessage ? (l.postMessage(k + "|" + a + ":" + b, g.Ds), V(X, "send(): service=" + a + " payload=" + b + " to hostname=" + g.Ds)) : Wf(X, "Peer window had no postMessage function.");
      } catch (q) {
        Wf(X, "Error performing postMessage, ignoring.", q);
      }
    }, 0);
  }, this.send(a, b)) : V(X, "send(): window not ready");
};
d.Qj = function() {
  this.g.Kc(1 == this.yb || 1 == this.Td ? 200 : void 0);
};
d.k = function() {
  if (this.Pa) {
    var a = this.S(), b = la(a), c = ih[b];
    ih[b] = c - 1;
    1 == c && qe(a.postMessage ? a : a.document, "message", kh, !1, hh);
  }
  this.Sj && (h.clearTimeout(this.Sj), this.Sj = 0);
  Wd(this.t);
  delete this.t;
  Wd(this.Hc);
  delete this.Hc;
  this.ib.cancel();
  delete this.ib;
  this.jb.cancel();
  delete this.jb;
  this.$a.cancel();
  delete this.$a;
  delete this.send;
  hh.q.k.call(this);
};
var jh = function(a) {
  a = a.split(",");
  a[1] = a[1] || null;
  return a;
};
var lh = function(a, b) {
  this.Za = b || Ef();
  this.g = a;
  this.ut = a.at || "";
  this.At = a.rat || "";
  var c = this.S();
  if (!c.nix_setup_complete) {
    try {
      c.execScript("Class GCXPC____NIXVBS_wrapper\n Private m_Transport\nPrivate m_Auth\nPublic Sub SetTransport(transport)\nIf isEmpty(m_Transport) Then\nSet m_Transport = transport\nEnd If\nEnd Sub\nPublic Sub SetAuth(auth)\nIf isEmpty(m_Auth) Then\nm_Auth = auth\nEnd If\nEnd Sub\nPublic Function GetAuthToken()\n GetAuthToken = m_Auth\nEnd Function\nPublic Sub SendMessage(service, payload)\n Call m_Transport.GCXPC____NIXJS_handle_message(service, payload)\nEnd Sub\nPublic Sub CreateChannel(channel)\n Call m_Transport.GCXPC____NIXJS_create_channel(channel)\nEnd Sub\nPublic Sub GCXPC____NIXVBS_container()\n End Sub\nEnd Class\n Function GCXPC____NIXVBS_get_wrapper(transport, auth)\nDim wrap\nSet wrap = New GCXPC____NIXVBS_wrapper\nwrap.SetTransport transport\nwrap.SetAuth auth\nSet GCXPC____NIXVBS_get_wrapper = wrap\nEnd Function", 
      "vbscript"), c.nix_setup_complete = !0;
    } catch (e) {
      T(X, "exception caught while attempting global setup: " + e);
    }
  }
  this.GCXPC____NIXJS_handle_message = this.yD;
  this.GCXPC____NIXJS_create_channel = this.xD;
};
u(lh, Jg);
d = lh.prototype;
d.Ue = 6;
d.Zf = !1;
d.Rd = null;
d.connect = function() {
  0 == this.g.Eb() ? this.Tt() : this.Et();
};
d.Tt = function() {
  if (!this.Zf) {
    var a = this.g.Lt();
    try {
      a.contentWindow.opener = (0,this.S().GCXPC____NIXVBS_get_wrapper)(this, this.ut), this.Zf = !0;
    } catch (b) {
      T(X, "exception caught while attempting setup: " + b);
    }
    this.Zf || this.S().setTimeout(s(this.Tt, this), 100);
  }
};
d.Et = function() {
  if (!this.Zf) {
    try {
      var a = this.S().opener;
      if (a && "GCXPC____NIXVBS_container" in a) {
        this.Rd = a;
        if (this.Rd.GetAuthToken() != this.At) {
          T(X, "Invalid auth token from other party");
          return;
        }
        this.Rd.CreateChannel((0,this.S().GCXPC____NIXVBS_get_wrapper)(this, this.ut));
        this.Zf = !0;
        this.g.Kc();
      }
    } catch (b) {
      T(X, "exception caught while attempting setup: " + b);
      return;
    }
    this.Zf || this.S().setTimeout(s(this.Et, this), 100);
  }
};
d.xD = function(a) {
  "unknown" == typeof a && "GCXPC____NIXVBS_container" in a || T(X, "Invalid NIX channel given to createChannel_");
  this.Rd = a;
  this.Rd.GetAuthToken() != this.At ? T(X, "Invalid auth token from other party") : this.g.Kc();
};
d.yD = function(a, b) {
  this.S().setTimeout(s(function() {
    this.g.qc(a, b);
  }, this), 1);
};
d.send = function(a, b) {
  "unknown" !== typeof this.Rd && T(X, "NIX channel not connected");
  this.Rd.SendMessage(a, b);
};
d.k = function() {
  lh.q.k.call(this);
  this.Rd = null;
};
var nh = function(a, b) {
  this.Zj = {};
  for (var c = 0, e;e = Fg[c];c++) {
    if (e in a && !/^https?:\/\//.test(a[e])) {
      throw Error("URI " + a[e] + " is invalid for field " + e);
    }
  }
  this.$ = a;
  this.name = this.$.cn || Ig(10);
  this.Za = b || Ef();
  this.lk = [];
  this.bk = new P(this);
  a.lpu = a.lpu || Be(this.Za.S().location.href) + "/robots.txt";
  a.ppu = a.ppu || Be(a.pu || "") + "/robots.txt";
  Gg[this.name] = this;
  te(window, "unload", mh) || pe(window, "unload", mh);
  U(X, "CrossPageChannel created: " + this.name);
};
u(nh, Xf);
var oh = /^%*tp$/, ph = /^%+tp$/;
d = nh.prototype;
d.Xd = null;
d.Lc = null;
d.ab = null;
d.h = 1;
d.oa = function() {
  return 2 == this.h;
};
d.od = null;
d.Rh = null;
d.Ak = function() {
  return this.$;
};
d.Lt = function() {
  return this.Rh;
};
d.Nu = function(a) {
  this.od = a;
};
d.Bk = function() {
  return this.od;
};
d.bu = function() {
  try {
    return!!this.od && !Boolean(this.od.closed);
  } catch (a) {
    return!1;
  }
};
d.VF = function() {
  var a;
  if (ha(document.postMessage) || ha(window.postMessage) || C && window.postMessage) {
    a = 1;
  } else {
    if (mc) {
      a = 2;
    } else {
      if (C && this.$.pru) {
        a = 3;
      } else {
        var b;
        if (b = C) {
          b = !1;
          try {
            a = window.opener, window.opener = {}, b = Yd(window, "opener"), window.opener = a;
          } catch (c) {
          }
        }
        a = b ? 6 : 4;
      }
    }
  }
  return a;
};
d.cF = function() {
  if (!this.ab) {
    this.$.tp || (this.$.tp = this.VF());
    switch(this.$.tp) {
      case 1:
        this.ab = new hh(this, this.$.ph, this.Za, !!this.$.osh, this.$.nativeProtocolVersion || 2);
        break;
      case 6:
        this.ab = new lh(this, this.Za);
        break;
      case 2:
        this.ab = new Pg(this, this.Za);
        break;
      case 3:
        this.ab = new $g(this, this.Za);
        break;
      case 4:
        this.ab = new Qg(this, this.Za);
        break;
      case 7:
        var a;
        if (a = this.od) {
          try {
            a = window.document.domain == this.od.document.domain;
          } catch (b) {
            a = !1;
          }
        }
        a ? this.ab = new Kg(this, this.Za) : U(X, "DirectTransport not supported for this window, peer window in different security context or not set yet.");
    }
    if (this.ab) {
      U(X, "Transport created: " + this.ab.getName());
    } else {
      throw Error("CrossPageChannel: No suitable transport found!");
    }
  }
};
d.FG = function() {
  var a = {};
  a.cn = this.name;
  a.tp = this.$.tp;
  a.osh = this.$.osh;
  this.$.lru && (a.pru = this.$.lru);
  this.$.lpu && (a.ppu = this.$.lpu);
  this.$.ppu && (a.lpu = this.$.ppu);
  var b = this.$.role;
  b && (a.role = 1 == b ? 0 : 1);
  return a;
};
d.iG = function(a, b, c) {
  U(X, "createPeerIframe()");
  var e = this.$.ifrid;
  e || (e = this.$.ifrid = "xpcpeer" + Ig(4));
  var f = Ef(a).createElement("IFRAME");
  f.id = f.name = e;
  b ? b(f) : f.style.width = f.style.height = "100%";
  this.Ht();
  this.Lc = new yg(void 0, this);
  var g = this.YF(c);
  this.bk.ZF(f, "load", this.Lc.Ta, !1, this.Lc);
  mc || E ? window.setTimeout(s(function() {
    a.appendChild(f);
    f.src = g.toString();
    U(X, "peer iframe created (" + e + ")");
  }, this), 1) : (f.src = g.toString(), a.appendChild(f), U(X, "peer iframe created (" + e + ")"));
  return f;
};
d.Ht = function() {
  this.Lc && (this.Lc.cancel(), this.Lc = null);
  this.lk.length = 0;
  this.bk.removeAll();
};
d.YF = function(a) {
  var b = this.$.pu;
  r(b) && (b = this.$.pu = new W(b));
  !1 !== a && b.ca("xpc", Sf(this.FG()));
  return b;
};
d.connect = function(a) {
  this.io = a || m;
  this.Lc ? this.Lc.Lj(this.Ew) : this.Ew();
};
d.Ew = function() {
  U(X, "continueConnection_()");
  this.Lc = null;
  this.$.ifrid && (this.Rh = this.Za.dF(this.$.ifrid));
  if (this.Rh) {
    var a = this.Rh.contentWindow;
    a || (a = window.frames[this.$.ifrid]);
    this.Nu(a);
  }
  if (!this.od) {
    if (window == window.top) {
      throw Error("CrossPageChannel: Can't connect, peer window-object not set.");
    }
    this.Nu(window.parent);
  }
  this.cF();
  for (this.ab.connect();0 < this.lk.length;) {
    this.lk.shift()();
  }
};
d.close = function() {
  this.Ht();
  this.h = 3;
  Wd(this.ab);
  this.io = this.ab = null;
  Wd(this.Xd);
  this.Xd = null;
  U(X, 'Channel "' + this.name + '" closed');
};
d.Kc = function(a) {
  this.oa() || this.Xd && this.Xd.Ic() || (this.h = 2, U(X, 'Channel "' + this.name + '" connected'), Wd(this.Xd), a ? (this.Xd = new Of(this.io, a), this.Xd.start()) : (this.Xd = null, this.io()));
};
d.Qj = nh.prototype.Kc;
d.sE = function() {
  U(X, "Transport Error");
  this.close();
};
d.send = function(a, b) {
  this.oa() ? this.bu() ? (ia(b) && (b = Sf(b)), this.ab.send(this.hH(a), b)) : (T(X, "Peer has disappeared."), this.close()) : T(X, "Can't send. Channel not connected.");
};
d.qc = function(a, b, c) {
  this.Lc ? this.lk.push(s(this.qc, this, a, b, c)) : this.zF(c) ? this.Of() ? Wf(X, "CrossPageChannel::xpcDeliver(): Disposed.") : a && "tp" != a ? this.oa() ? this.xF(this.AF(a), b) : U(X, "CrossPageChannel::xpcDeliver(): Not connected.") : this.ab.Sk(b) : Wf(X, 'Message received from unapproved origin "' + c + '" - rejected.');
};
d.hH = function(a) {
  oh.test(a) && (a = "%" + a);
  return a.replace(/[%:|]/g, encodeURIComponent);
};
d.AF = function(a) {
  a = a.replace(/%[0-9a-f]{2}/gi, decodeURIComponent);
  return ph.test(a) ? a.substring(1) : a;
};
d.Eb = function() {
  var a = this.$.role;
  return ga(a) ? a : window.parent == this.od ? 1 : 0;
};
d.Kj = function(a) {
  V(X, "changing channel name to " + a);
  delete Gg[this.name];
  this.name = a;
  Gg[a] = this;
};
d.zF = function(a) {
  var b = this.$.ph;
  return ra(null == a ? "" : String(a)) || ra(null == b ? "" : String(b)) || a == this.$.ph;
};
d.k = function() {
  this.close();
  this.Rh = this.od = null;
  delete Gg[this.name];
  Wd(this.bk);
  delete this.bk;
  nh.q.k.call(this);
};
var mh = function() {
  for (var a in Gg) {
    Wd(Gg[a]);
  }
};
var qh = function() {
};
qh.prototype.hx = null;
qh.prototype.Yq = function() {
  return this.hx || (this.hx = this.$J());
};
var rh, sh = function() {
};
u(sh, qh);
sh.prototype.bx = function() {
  var a = this.mx();
  return a ? new ActiveXObject(a) : new XMLHttpRequest;
};
sh.prototype.$J = function() {
  var a = {};
  this.mx() && (a[0] = !0, a[1] = !0);
  return a;
};
sh.prototype.mx = function() {
  if (!this.ox && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for (var a = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        return new ActiveXObject(c), this.ox = c;
      } catch (e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.ox;
};
rh = new sh;
var th = function(a) {
  O.call(this);
  this.headers = new B;
  this.$i = a || null;
  this.da = !1;
  this.Pi = this.H = null;
  this.Jq = this.Qg = "";
  this.lf = 0;
  this.Wa = "";
  this.qe = this.hm = this.Ki = this.lm = !1;
  this.ad = 0;
  this.uf = null;
  this.pf = "";
  this.aj = this.Qq = !1;
};
u(th, O);
th.prototype.a = Vf("goog.net.XhrIo");
var uh = /^https?$/i, vh = ["POST", "PUT"], wh = [];
d = th.prototype;
d.Ox = function() {
  this.W();
  tb(wh, this);
};
d.Wk = function(a) {
  this.ad = Math.max(0, a);
};
d.nv = function(a) {
  this.pf = a;
};
d.ov = function() {
  return this.pf;
};
d.TJ = function(a) {
  this.Qq = a;
};
d.send = function(a, b, c, e) {
  if (this.H) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.Qg + "; newUri=" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.Qg = a;
  this.Wa = "";
  this.lf = 0;
  this.Jq = b;
  this.lm = !1;
  this.da = !0;
  this.H = this.ty();
  this.Pi = this.$i ? this.$i.Yq() : rh.Yq();
  this.H.onreadystatechange = s(this.wq, this);
  try {
    V(this.a, this.bd("Opening Xhr")), this.hm = !0, this.H.open(b, a, !0), this.hm = !1;
  } catch (f) {
    V(this.a, this.bd("Error opening Xhr: " + f.message));
    this.Xa(5, f);
    return;
  }
  a = c || "";
  var g = this.headers.clone();
  e && Wb(e, function(a, b) {
    g.set(b, a);
  });
  e = A(g.fb(), xh);
  c = h.FormData && a instanceof h.FormData;
  !qb(vh, b) || e || c || g.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  Wb(g, function(a, b) {
    this.H.setRequestHeader(b, a);
  }, this);
  this.pf && (this.H.responseType = this.pf);
  "withCredentials" in this.H && (this.H.withCredentials = this.Qq);
  try {
    this.Wq(), 0 < this.ad && (this.aj = yh(this.H), V(this.a, this.bd("Will abort after " + this.ad + "ms if incomplete, xhr2 " + this.aj)), this.aj ? (this.H.timeout = this.ad, this.H.ontimeout = s(this.bf, this)) : this.uf = Q(this.bf, this.ad, this)), V(this.a, this.bd("Sending request")), this.Ki = !0, this.H.send(a), this.Ki = !1;
  } catch (k) {
    V(this.a, this.bd("Send error: " + k.message)), this.Xa(5, k);
  }
};
var yh = function(a) {
  return C && Ac(9) && ga(a.timeout) && n(a.ontimeout);
}, xh = function(a) {
  return "content-type" == a.toLowerCase();
};
d = th.prototype;
d.ty = function() {
  return this.$i ? this.$i.bx() : rh.bx();
};
d.bf = function() {
  "undefined" != typeof aa && this.H && (this.Wa = "Timed out after " + this.ad + "ms, aborting", this.lf = 8, V(this.a, this.bd(this.Wa)), this.dispatchEvent("timeout"), this.abort(8));
};
d.Xa = function(a, b) {
  this.da = !1;
  this.H && (this.qe = !0, this.H.abort(), this.qe = !1);
  this.Wa = b;
  this.lf = a;
  this.er();
  this.Oi();
};
d.er = function() {
  this.lm || (this.lm = !0, this.dispatchEvent("complete"), this.dispatchEvent("error"));
};
d.abort = function(a) {
  this.H && this.da && (V(this.a, this.bd("Aborting")), this.da = !1, this.qe = !0, this.H.abort(), this.qe = !1, this.lf = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), this.Oi());
};
d.k = function() {
  this.H && (this.da && (this.da = !1, this.qe = !0, this.H.abort(), this.qe = !1), this.Oi(!0));
  th.q.k.call(this);
};
d.wq = function() {
  this.Of() || (this.hm || this.Ki || this.qe ? this.uw() : this.SH());
};
d.SH = function() {
  this.uw();
};
d.uw = function() {
  if (this.da && "undefined" != typeof aa) {
    if (this.Pi[1] && 4 == this.wd() && 2 == this.Aa()) {
      V(this.a, this.bd("Local request error detected and ignored"));
    } else {
      if (this.Ki && 4 == this.wd()) {
        Q(this.wq, 0, this);
      } else {
        if (this.dispatchEvent("readystatechange"), this.xm()) {
          V(this.a, this.bd("Request complete"));
          this.da = !1;
          try {
            this.ja() ? (this.dispatchEvent("complete"), this.dispatchEvent("success")) : (this.lf = 6, this.Wa = this.Yl() + " [" + this.Aa() + "]", this.er());
          } finally {
            this.Oi();
          }
        }
      }
    }
  }
};
d.Oi = function(a) {
  if (this.H) {
    this.Wq();
    var b = this.H, c = this.Pi[0] ? m : null;
    this.Pi = this.H = null;
    a || this.dispatchEvent("ready");
    try {
      b.onreadystatechange = c;
    } catch (e) {
      T(this.a, "Problem encountered resetting onreadystatechange: " + e.message);
    }
  }
};
d.Wq = function() {
  this.H && this.aj && (this.H.ontimeout = null);
  ga(this.uf) && (h.clearTimeout(this.uf), this.uf = null);
};
d.Ic = function() {
  return!!this.H;
};
d.xm = function() {
  return 4 == this.wd();
};
d.ja = function() {
  var a = this.Aa(), b;
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
  return b || 0 === a && !this.pI();
};
d.pI = function() {
  var a = Ae(String(this.Qg))[1] || null;
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return uh.test(a ? a.toLowerCase() : "");
};
d.wd = function() {
  return this.H ? this.H.readyState : 0;
};
d.Aa = function() {
  try {
    return 2 < this.wd() ? this.H.status : -1;
  } catch (a) {
    return Wf(this.a, "Can not get status: " + a.message), -1;
  }
};
d.Yl = function() {
  try {
    return 2 < this.wd() ? this.H.statusText : "";
  } catch (a) {
    return V(this.a, "Can not get status: " + a.message), "";
  }
};
d.Wi = function() {
  return String(this.Qg);
};
d.Xb = function() {
  try {
    return this.H ? this.H.responseText : "";
  } catch (a) {
    return V(this.a, "Can not get responseText: " + a.message), "";
  }
};
d.zr = function() {
  try {
    return this.H ? this.H.responseXML : null;
  } catch (a) {
    return V(this.a, "Can not get responseXML: " + a.message), null;
  }
};
d.pq = function(a) {
  if (this.H) {
    var b = this.H.responseText;
    a && 0 == b.indexOf(a) && (b = b.substring(a.length));
    return Pf(b);
  }
};
d.getResponseHeader = function(a) {
  return this.H && this.xm() ? this.H.getResponseHeader(a) : void 0;
};
d.getAllResponseHeaders = function() {
  return this.H && this.xm() ? this.H.getAllResponseHeaders() : "";
};
d.ui = function() {
  return this.lf;
};
d.Ve = function() {
  return r(this.Wa) ? this.Wa : String(this.Wa);
};
d.bd = function(a) {
  return a + " [" + this.Jq + " " + this.Qg + " " + this.Aa() + "]";
};
var zh = function(a) {
  Ue.call(this, a.X());
  this.Wg = a;
  this.U = a.U;
  var b = new P(this);
  b.listen(a, "b", this.Im);
  b.listen(a, "a", this.so);
  this.uh(b);
};
u(zh, Ue);
zh.prototype.Yj = function() {
  this.Wg.disconnect();
};
zh.prototype.send = function(a) {
  this.Wg.send(a);
};
zh.prototype.Im = function(a) {
  this.onMessage(a.message);
};
zh.prototype.so = function(a) {
  this.mb(a.Gg);
};
G("cv.AppEngineChannel");
new B;
var Bh = function(a, b) {
  O.call(this);
  this.sA = n(a) ? a : !0;
  this.gn = b || Ah;
  this.Bj = this.gn(this.oh);
};
u(Bh, O);
d = Bh.prototype;
d.Db = null;
d.ua = null;
d.Af = void 0;
d.hn = !1;
d.oh = 0;
d.a = Vf("goog.net.WebSocket");
var Ah = function(a) {
  return Math.min(1E3 * Math.pow(2, a), 6E4);
};
d = Bh.prototype;
d.open = function(a, b) {
  v(h.WebSocket, "This browser does not support WebSocket");
  v(!this.Cr(), "The WebSocket is already open");
  this.Ar();
  this.ua = a;
  (this.Af = b) ? (U(this.a, "Opening the WebSocket on " + this.ua + " with protocol " + this.Af), this.Db = new WebSocket(this.ua, this.Af)) : (U(this.a, "Opening the WebSocket on " + this.ua), this.Db = new WebSocket(this.ua));
  this.Db.onopen = s(this.Sz, this);
  this.Db.onclose = s(this.Fi, this);
  this.Db.onmessage = s(this.Sm, this);
  this.Db.onerror = s(this.v, this);
};
d.close = function() {
  this.Ar();
  this.Db && (U(this.a, "Closing the WebSocket."), this.hn = !0, this.Db.close(), this.Db = null);
};
d.send = function(a) {
  v(this.Cr(), "Cannot send without an open socket");
  this.Db.send(a);
};
d.Cr = function() {
  return!!this.Db && 1 == this.Db.readyState;
};
d.Sz = function() {
  U(this.a, "WebSocket opened on " + this.ua);
  this.dispatchEvent("f");
  this.oh = 0;
  this.Bj = this.gn(this.oh);
};
d.Fi = function(a) {
  U(this.a, "The WebSocket on " + this.ua + " closed.");
  this.dispatchEvent("c");
  this.Db = null;
  this.hn ? (U(this.a, "The WebSocket closed normally."), this.ua = null, this.Af = void 0) : (T(this.a, "The WebSocket disconnected unexpectedly: " + a.data), this.sA && (U(this.a, "Seconds until next reconnect attempt: " + Math.floor(this.Bj / 1E3)), this.jn = Q(s(this.open, this, this.ua, this.Af), this.Bj, this), this.oh++, this.Bj = this.gn(this.oh)));
  this.hn = !1;
};
d.Sm = function(a) {
  this.dispatchEvent(new Ch(a.data));
};
d.v = function(a) {
  a = a.data;
  T(this.a, "An error occurred: " + a);
  this.dispatchEvent(new Dh(a));
};
d.Ar = function() {
  null != this.jn && h.clearTimeout(this.jn);
  this.jn = null;
};
d.k = function() {
  Bh.q.k.call(this);
  this.close();
};
var Ch = function(a) {
  L.call(this, "e");
  this.message = a;
};
u(Ch, L);
var Dh = function(a) {
  L.call(this, "d");
  this.data = a;
};
u(Dh, L);
var Eh = function(a) {
  zh.call(this, a);
  this.a = G("cv.OrderedChannel");
  this.bh = new B;
  this.fh = [];
  this.Pm = this.Ir = 0;
  this.ga = new Te(3E3);
  M(this.ga, "tick", s(this.MA, this));
};
u(Eh, zh);
var Fh = function(a) {
  this.timestamp = t();
  this.message = a;
  this.DA = 0;
}, Gh = function(a, b) {
  this.seqNum = a;
  this.body = b;
};
d = Eh.prototype;
d.send = function(a) {
  a = new Gh(this.Ir++, a);
  Eh.q.send.call(this, a);
  this.bh.set(a.seqNum, new Fh(a));
  this.ga.start();
};
d.Im = function(a) {
  a = a.message;
  var b = a.seqNum;
  if (-1 == b) {
    this.bh.remove(a.body);
  } else {
    if (-2 == b) {
      this.Pr();
    } else {
      this.Wg.send(this.mA(b));
      var c = b - this.Pm;
      if (0 > c || void 0 !== this.fh[c]) {
        this.a.info("Duplicate message received with seq num: " + b);
      } else {
        for (this.fh[c] = a.body;void 0 !== this.fh[0];) {
          a = this.fh.shift(), this.Pm++, Eh.q.Im.call(this, new We("b", a));
        }
      }
    }
  }
};
d.Yj = function() {
  this.Wg.send(this.ZI());
  this.Pr();
};
d.Pr = function() {
  this.Ir = 0;
  this.bh.clear();
  this.Pm = 0;
  this.fh = [];
};
d.MA = function() {
  var a = this.bh.fb();
  if (0 == a.length) {
    this.ga.stop();
  } else {
    if (100 < a.length) {
      this.disconnect("Too many messages queued up in reliable channel.");
    } else {
      this.a.info("Retransmitting up to " + a.length + " messages.");
      var b = t(), c;
      for (c in a) {
        var e = this.bh.get(a[c]);
        if (10 <= e.DA++) {
          this.disconnect("Exhausted maximum retries for message.");
          break;
        }
        b - e.timestamp >= this.ga.CA() && this.Wg.send(e.message);
      }
    }
  }
};
d.mA = function(a) {
  return new Gh(-1, a);
};
d.ZI = function() {
  return new Gh(-2, {});
};
var Hh = function(a, b, c) {
  zh.call(this, a);
  v(!c || 0 < c);
  this.Wm = b || "ping";
  this.Yr = c || 5E3;
  this.mn = 2E4;
  this.a = G("cv.TimeoutChannel");
  this.oj = this.qj = this.Am = null;
  this.OA = setTimeout(s(this.RA, this), 6E3);
  this.a.info("Creating...");
  this.mq(s(this.SA, this), m);
};
u(Hh, zh);
d = Hh.prototype;
d.send = function(a) {
  Hh.q.send.call(this, a);
  t();
};
d.onMessage = function(a) {
  Hh.q.onMessage.call(this, a);
  this.Am = t();
  cd(a) && ("ping" == a[1].type ? (this.a.ka("Got ping from " + this.U), this.sr()) : "pong" == a[1].type && this.a.ka("Got pong from " + this.U));
};
d.so = function(a) {
  Hh.q.so.call(this, a);
  "connected" != a.Gg && (clearTimeout(this.oj), this.oj = null, clearTimeout(this.qj), this.qj = null);
};
d.RA = function() {
  "connecting" == this.X() && (this.a.e("failed to connect in 6 seconds"), this.disconnect("failed to connect in 6 seconds"));
};
d.fJ = function() {
  var a = s(function() {
    this.oa() && (this.Am ? t() > this.Am + this.mn ? this.disconnect("liveness timeout") : this.qj = setTimeout(a, this.mn) : this.disconnect("liveness timeout - heartbeat never received"));
  }, this);
  this.qj = setTimeout(a, this.mn);
};
d.eJ = function() {
  var a = s(function() {
    this.oa() && (this.sr(), this.oj = setTimeout(a, this.Yr));
  }, this);
  this.oj = setTimeout(a, this.Yr);
};
d.sr = function() {
  var a = {type:this.Wm};
  this.a.ka("Sending " + this.Wm + " to " + this.U);
  this.send(["cm", a]);
};
d.SA = function() {
  clearTimeout(this.OA);
  "ping" == this.Wm && this.eJ();
  this.fJ();
};
var Ih = function(a) {
  Ue.call(this);
  this.a = G("cv.WebSocketChannel");
  this.t = new P(this);
  this.Ce = new Bh(!1);
  this.ua = a;
  this.t.listen(this.Ce, "f", this.jA);
  this.t.listen(this.Ce, "e", this.iA);
  this.t.listen(this.Ce, "d", this.hA);
  this.t.listen(this.Ce, "c", this.gA);
  this.Ce.open(this.ua);
};
u(Ih, Ue);
d = Ih.prototype;
d.k = function() {
  this.t.W();
  Ih.q.k.call(this);
};
d.jA = function() {
  this.a.info("On WebSocket open: " + this.ua);
  this.mb("connected");
};
d.iA = function(a) {
  this.onMessage($a(JSON.parse(a.message)));
};
d.gA = function() {
  this.a.info("On WebSocket close: " + this.ua);
  this.disconnect();
};
d.hA = function(a) {
  this.a.e("On WebSocket error: " + this.ua + ", " + a.data);
  this.disconnect(a.data);
};
d.Yj = function() {
  this.a.info("Closing WebSocket channel");
  this.Ce.close();
};
d.send = function(a) {
  this.Ce.send(JSON.stringify(a));
};
var Jh = function(a) {
  this.appName = "ChromeCast";
  this.senderId = a;
};
var Kh = function() {
  this.Pe = this.N = 0;
  this.be = [];
};
d = Kh.prototype;
d.ok = function(a) {
  this.be[this.Pe++] = a;
};
d.Nf = function() {
  if (this.N != this.Pe) {
    var a = this.be[this.N];
    delete this.be[this.N];
    this.N++;
    return a;
  }
};
d.J = function() {
  return this.Pe - this.N;
};
d.vb = function() {
  return 0 == this.Pe - this.N;
};
d.clear = function() {
  this.Pe = this.N = this.be.length = 0;
};
d.contains = function(a) {
  return qb(this.be, a);
};
d.remove = function(a) {
  a = ib(this.be, a);
  if (0 > a) {
    return!1;
  }
  a == this.N ? this.Nf() : (sb(this.be, a), this.Pe--);
  return!0;
};
d.R = function() {
  return this.be.slice(this.N, this.Pe);
};
var Lh = function(a, b) {
  this.zu = a || 0;
  this.Me = b || 10;
  if (this.zu > this.Me) {
    throw Error("[goog.structs.Pool] Min can not be greater than max");
  }
  this.md = new Kh;
  this.Sd = new Yb;
  this.wo = 0;
  this.bp = null;
  this.uk();
};
u(Lh, K);
d = Lh.prototype;
d.wk = function() {
  var a = t();
  if (!(null != this.bp && a - this.bp < this.wo)) {
    var b = this.vI();
    b && (this.bp = a, this.Sd.add(b));
    return b;
  }
};
d.Bo = function(a) {
  return this.Sd.remove(a) ? (this.Po(a), !0) : !1;
};
d.vI = function() {
  for (var a;0 < this.Ru() && (a = this.md.Nf(), !this.Fo(a));) {
    this.uk();
  }
  !a && this.J() < this.Me && (a = this.Go());
  return a;
};
d.Po = function(a) {
  this.Sd.remove(a);
  this.Fo(a) && this.J() < this.Me ? this.md.ok(a) : this.Nn(a);
};
d.uk = function() {
  for (var a = this.md;this.J() < this.zu;) {
    a.ok(this.Go());
  }
  for (;this.J() > this.Me && 0 < this.Ru();) {
    this.Nn(a.Nf());
  }
};
d.Go = function() {
  return{};
};
d.Nn = function(a) {
  if ("function" == typeof a.W) {
    a.W();
  } else {
    for (var b in a) {
      a[b] = null;
    }
  }
};
d.Fo = function(a) {
  return "function" == typeof a.qK ? a.qK() : !0;
};
d.contains = function(a) {
  return this.md.contains(a) || this.Sd.contains(a);
};
d.J = function() {
  return this.md.J() + this.Sd.J();
};
d.oD = function() {
  return this.Sd.J();
};
d.Ru = function() {
  return this.md.J();
};
d.vb = function() {
  return this.md.vb() && this.Sd.vb();
};
d.k = function() {
  Lh.q.k.call(this);
  if (0 < this.oD()) {
    throw Error("[goog.structs.Pool] Objects not released");
  }
  delete this.Sd;
  for (var a = this.md;!a.vb();) {
    this.Nn(a.Nf());
  }
  delete this.md;
};
var Mh = function(a, b) {
  this.ni = a;
  this.$h = b;
};
Mh.prototype.getKey = function() {
  return this.ni;
};
Mh.prototype.Ia = function() {
  return this.$h;
};
Mh.prototype.clone = function() {
  return new Mh(this.ni, this.$h);
};
var Nh = function(a) {
  this.Vb = [];
  a && this.OI(a);
};
d = Nh.prototype;
d.Tu = function(a, b) {
  var c = this.Vb;
  c.push(new Mh(a, b));
  this.QI(c.length - 1);
};
d.OI = function(a) {
  var b, c;
  if (a instanceof Nh) {
    if (b = a.fb(), c = a.R(), 0 >= a.J()) {
      a = this.Vb;
      for (var e = 0;e < b.length;e++) {
        a.push(new Mh(b[e], c[e]));
      }
      return;
    }
  } else {
    b = Ib(a), c = Hb(a);
  }
  for (e = 0;e < b.length;e++) {
    this.Tu(b[e], c[e]);
  }
};
d.remove = function() {
  var a = this.Vb, b = a.length, c = a[0];
  if (!(0 >= b)) {
    return 1 == b ? rb(a) : (a[0] = a.pop(), this.MH(0)), c.Ia();
  }
};
d.MH = function(a) {
  for (var b = this.Vb, c = b.length, e = b[a];a < c >> 1;) {
    var f = this.xI(a), g = this.yI(a), f = g < c && b[g].getKey() < b[f].getKey() ? g : f;
    if (b[f].getKey() > e.getKey()) {
      break;
    }
    b[a] = b[f];
    a = f;
  }
  b[a] = e;
};
d.QI = function(a) {
  for (var b = this.Vb, c = b[a];0 < a;) {
    var e = this.NI(a);
    if (b[e].getKey() > c.getKey()) {
      b[a] = b[e], a = e;
    } else {
      break;
    }
  }
  b[a] = c;
};
d.xI = function(a) {
  return 2 * a + 1;
};
d.yI = function(a) {
  return 2 * a + 2;
};
d.NI = function(a) {
  return a - 1 >> 1;
};
d.R = function() {
  for (var a = this.Vb, b = [], c = a.length, e = 0;e < c;e++) {
    b.push(a[e].Ia());
  }
  return b;
};
d.fb = function() {
  for (var a = this.Vb, b = [], c = a.length, e = 0;e < c;e++) {
    b.push(a[e].getKey());
  }
  return b;
};
d.jg = function(a) {
  return mb(this.Vb, function(b) {
    return b.Ia() == a;
  });
};
d.Ja = function(a) {
  return mb(this.Vb, function(b) {
    return b.getKey() == a;
  });
};
d.clone = function() {
  return new Nh(this);
};
d.J = function() {
  return this.Vb.length;
};
d.vb = function() {
  return 0 == this.Vb.length;
};
d.clear = function() {
  rb(this.Vb);
};
var Oh = function() {
  Nh.call(this);
};
u(Oh, Nh);
Oh.prototype.ok = function(a, b) {
  this.Tu(a, b);
};
Oh.prototype.Nf = function() {
  return this.remove();
};
var Ph = function(a, b) {
  this.$t = void 0;
  this.nk = new Oh;
  Lh.call(this, a, b);
};
u(Ph, Lh);
d = Ph.prototype;
d.wk = function(a, b) {
  if (!a) {
    var c = Ph.q.wk.call(this);
    c && this.wo && (this.$t = h.setTimeout(s(this.Pk, this), this.wo));
    return c;
  }
  this.nk.ok(n(b) ? b : 100, a);
  this.Pk();
};
d.Pk = function() {
  for (var a = this.nk;0 < a.J();) {
    var b = this.wk();
    if (b) {
      a.Nf().apply(this, [b]);
    } else {
      break;
    }
  }
};
d.Po = function(a) {
  Ph.q.Po.call(this, a);
  this.Pk();
};
d.uk = function() {
  Ph.q.uk.call(this);
  this.Pk();
};
d.k = function() {
  Ph.q.k.call(this);
  h.clearTimeout(this.$t);
  this.nk.clear();
  this.nk = null;
};
var Qh = function(a, b, c) {
  Ph.call(this, b, c);
  this.Qo = a;
};
u(Qh, Ph);
Qh.prototype.Go = function() {
  var a = new th, b = this.Qo;
  b && Wb(b, function(b, e) {
    a.headers.set(e, b);
  });
  return a;
};
Qh.prototype.Fo = function(a) {
  return!a.Of() && !a.Ic();
};
var Rh = function(a, b, c, e, f) {
  O.call(this);
  this.lo = n(a) ? a : 1;
  this.ad = n(f) ? Math.max(0, f) : 0;
  this.Mf = new Qh(b, c, e);
  this.pc = new B;
  this.t = new P(this);
};
u(Rh, O);
var Sh = "ready complete success error abort timeout".split(" ");
d = Rh.prototype;
d.Wk = function(a) {
  this.ad = Math.max(0, a);
};
d.send = function(a, b, c, e, f, g, k, l, q) {
  if (this.pc.get(a)) {
    throw Error("[goog.net.XhrManager] ID in use");
  }
  b = new Th(b, s(this.LH, this, a), c, e, f, k, n(l) ? l : this.lo, q);
  this.pc.set(a, b);
  a = s(this.KH, this, a);
  this.Mf.wk(a, g);
  return b;
};
d.abort = function(a, b) {
  var c = this.pc.get(a);
  if (c) {
    var e = c.Ed;
    c.jH(!0);
    b && (e && (this.xv(e, c.Ao()), pe(e, "ready", function() {
      this.Mf.Bo(e);
    }, !1, this)), this.pc.remove(a));
    e && e.abort();
  }
};
d.KH = function(a, b) {
  var c = this.pc.get(a);
  c && !c.Ed ? (this.UF(b, c.Ao()), b.Wk(this.ad), b.nv(c.ov()), c.Ed = b, this.dispatchEvent(new Uh("ready", this, a, b)), this.gg(a, b), c.WF() && b.abort()) : this.Mf.Bo(b);
};
d.LH = function(a, b) {
  var c = b.target;
  switch(b.type) {
    case "ready":
      this.gg(a, c);
      break;
    case "complete":
      return this.AI(a, c, b);
    case "success":
      this.CI(a, c);
      break;
    case "timeout":
    ;
    case "error":
      this.BI(a, c);
      break;
    case "abort":
      this.zI(a, c);
  }
  return null;
};
d.gg = function(a, b) {
  var c = this.pc.get(a);
  !c || c.AG() || c.Ho() ? (c && (this.xv(b, c.Ao()), this.pc.remove(a)), this.Mf.Bo(b)) : (c.GG(), b.send(c.Zi(), c.EG(), c.BG(), c.DG()));
};
d.AI = function(a, b, c) {
  var e = this.pc.get(a);
  if (7 == b.ui() || b.ja() || e.Ho()) {
    if (this.dispatchEvent(new Uh("complete", this, a, b)), e && (e.LG(!0), e.Nv())) {
      return e.Nv().call(b, c);
    }
  }
  return null;
};
d.zI = function(a, b) {
  this.dispatchEvent(new Uh("abort", this, a, b));
};
d.CI = function(a, b) {
  this.dispatchEvent(new Uh("success", this, a, b));
};
d.BI = function(a, b) {
  this.pc.get(a).Ho() && this.dispatchEvent(new Uh("error", this, a, b));
};
d.xv = function(a, b, c) {
  this.t.Yc(a, c || Sh, b);
};
d.UF = function(a, b, c) {
  this.t.listen(a, c || Sh, b);
};
d.k = function() {
  Rh.q.k.call(this);
  this.Mf.W();
  this.Mf = null;
  this.t.W();
  this.t = null;
  var a = this.pc;
  Wb(a, function(a) {
    a.W();
  });
  a.clear();
  this.pc = null;
};
var Uh = function(a, b, c, e) {
  L.call(this, a, b);
  this.id = c;
  this.Ed = e;
};
u(Uh, L);
var Th = function(a, b, c, e, f, g, k, l) {
  this.ua = a;
  this.$F = c || "GET";
  this.XF = e;
  this.Qo = f || null;
  this.lo = n(k) ? k : 1;
  this.sv = 0;
  this.uv = this.vv = !1;
  this.zt = b;
  this.yt = g;
  this.pf = l || "";
  this.Ed = null;
};
u(Th, K);
d = Th.prototype;
d.Zi = function() {
  return this.ua;
};
d.EG = function() {
  return this.$F;
};
d.BG = function() {
  return this.XF;
};
d.DG = function() {
  return this.Qo;
};
d.GG = function() {
  this.sv++;
};
d.Ho = function() {
  return this.sv > this.lo;
};
d.LG = function(a) {
  this.vv = a;
};
d.AG = function() {
  return this.vv;
};
d.jH = function(a) {
  this.uv = a;
};
d.WF = function() {
  return this.uv;
};
d.Ao = function() {
  return this.zt;
};
d.Nv = function() {
  return this.yt;
};
d.ov = function() {
  return this.pf;
};
d.k = function() {
  Th.q.k.call(this);
  delete this.zt;
  delete this.yt;
};
var Vh = function(a, b, c, e, f, g, k) {
  this.GA = a ? a : "https://www-googleapis-staging.sandbox.google.com/deviceregistry/v1";
  this.pG = b ? b : "https://accounts.google.com/o/oauth2/token";
  this.nG = c ? c : "919648714761-l7s11uoekiqlmod1oiv9tcjj2f1ca7dm.apps.googleusercontent.com";
  this.oG = e ? e : "QVdYPt9YzQIEto4plJysXS_Z";
  this.ot = f ? f : "https://client-channel.google.com";
  this.nt = g ? g : "test";
  this.ZE = k ? k : "echo_service";
  this.GD = "AIzaSyAOZM8ZYeov685QMjXT3sC7XNizfrTEKjA";
};
var Wh = function(a) {
  O.call(this);
  this.a = G("cv.CloudXhrManager");
  this.qb = a || new Vh;
  this.hc = new Rh(0, null, 1, 10, 5E3);
  this.ZA = 0;
  this.BA = new W(this.qb.GA);
};
u(Wh, O);
var Xh = function(a, b) {
  this.response = a;
  this.Ed = b;
};
Wh.prototype.rv = function(a, b) {
  var c = b.target, e = null;
  if (c.ja()) {
    try {
      e = c.pq();
    } catch (f) {
      c.Xb() && this.a.info("Failed to parse response JSON: " + c.Xb());
    }
  }
  void 0 === e && (e = null);
  a.ea(new Xh(e, c));
};
Wh.prototype.Oz = function(a) {
  a.client_id = this.qb.nG;
  a.client_secret = this.qb.oG;
  var b = new I;
  this.hc.send(this.pv(), this.qb.pG, "POST", ig(a).Jv(), {"Content-Type":"application/x-www-form-urlencoded"}, 0, s(this.rv, this, b));
  return b;
};
Wh.prototype.pv = function() {
  return(++this.ZA % 1E3).toString();
};
Wh.prototype.km = function(a, b, c, e, f) {
  v("GET" == b || "POST" == b || "DELETE" == b);
  var g = {"Content-Type":"application/json"};
  f && (g.Authorization = "Bearer " + f);
  f = this.BA.clone();
  f.Je(f.Wf() + "/" + a);
  e && f.Pf(e);
  a = null;
  c && (a = JSON.stringify(c));
  c = new I;
  this.hc.send(this.pv(), f.toString(), b, a, g, 1, s(this.rv, this, c));
  return c;
};
var Yh = function(a) {
  this.a = G("cv.CloudAuth");
  this.$c = a;
  this.Xq = "";
  this.ih = null;
};
Yh.prototype.zm = function() {
  var a = new I;
  if (this.Xq) {
    return this.lz();
  }
  var b = chrome.identity;
  if (!b) {
    return this.a.e("chrome.identity permission required for auth."), a.Ma(), a;
  }
  b.getAuthToken({interactive:!0}, s(function(b) {
    a.ea(n(b) ? b : "");
  }, this));
  return a;
};
Yh.prototype.lz = function() {
  var a = new I;
  !this.ih || this.ih.kA() ? this.lA(this.Xq, !1).Kb(s(function(b) {
    b = b.Ia();
    b.accessToken ? (this.ih = new Zh(b.accessToken, b.nr), a.ea(this.ih.Zb())) : (this.a.info("Failed to retrieve debug access token"), a.ea(""));
  }, this)) : a.ea(this.ih.Zb());
  return a;
};
var Zh = function(a, b) {
  this.UJ = a;
  this.Dp = b ? t() + 1E3 * b : 0;
};
Zh.prototype.kA = function() {
  return this.ax() && t() > this.Dp;
};
Zh.prototype.ED = function() {
  return this.ax() && t() > this.Dp + 6E5;
};
Zh.prototype.ax = function() {
  return 0 != this.Dp;
};
Zh.prototype.Zb = function() {
  return this.UJ;
};
var $h = function() {
  this.accessToken = "";
  this.nr = 0;
  this.refreshToken = "";
};
Yh.prototype.lA = function(a, b) {
  var c = {};
  b ? Qb(c, {code:a, grant_type:"authorization_code", redirect_uri:"oob"}) : Qb(c, {refresh_token:a, grant_type:"refresh_token"});
  var e = new I;
  this.$c.Oz(c).Kb(s(function(a) {
    var b = new $h;
    "success" == a.X() && ((a = a.Ia().response) ? (a.refresh_token && (b.refreshToken = a.refresh_token), a.access_token && (b.accessToken = a.access_token, b.nr = a.expires_in), e.ea(b)) : (this.a.info("Failed to retrieve access token."), e.Ma()));
  }, this));
  return e;
};
var ai = function(a) {
  this.Te = a;
}, bi = /\s*;\s*/;
d = ai.prototype;
d.isEnabled = function() {
  return navigator.cookieEnabled;
};
d.KJ = function(a) {
  return!/[;=\s]/.test(a);
};
d.LJ = function(a) {
  return!/[;\r\n]/.test(a);
};
d.set = function(a, b, c, e, f, g) {
  if (!this.KJ(a)) {
    throw Error('Invalid cookie name "' + a + '"');
  }
  if (!this.LJ(b)) {
    throw Error('Invalid cookie value "' + b + '"');
  }
  n(c) || (c = -1);
  f = f ? ";domain=" + f : "";
  e = e ? ";path=" + e : "";
  g = g ? ";secure" : "";
  c = 0 > c ? "" : 0 == c ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(t() + 1E3 * c)).toUTCString();
  this.OJ(a + "=" + b + f + e + c + g);
};
d.get = function(a, b) {
  for (var c = a + "=", e = this.Cp(), f = 0, g;g = e[f];f++) {
    if (0 == g.lastIndexOf(c, 0)) {
      return g.substr(c.length);
    }
    if (g == a) {
      return "";
    }
  }
  return b;
};
d.remove = function(a, b, c) {
  var e = this.Ja(a);
  this.set(a, "", 0, b, c);
  return e;
};
d.fb = function() {
  return this.rl().keys;
};
d.R = function() {
  return this.rl().Ww;
};
d.vb = function() {
  return!this.Ep();
};
d.J = function() {
  return this.Ep() ? this.Cp().length : 0;
};
d.Ja = function(a) {
  return n(this.get(a));
};
d.jg = function(a) {
  for (var b = this.rl().Ww, c = 0;c < b.length;c++) {
    if (b[c] == a) {
      return!0;
    }
  }
  return!1;
};
d.clear = function() {
  for (var a = this.rl().keys, b = a.length - 1;0 <= b;b--) {
    this.remove(a[b]);
  }
};
d.OJ = function(a) {
  this.Te.cookie = a;
};
d.Ep = function() {
  return this.Te.cookie;
};
d.Cp = function() {
  return(this.Ep() || "").split(bi);
};
d.rl = function() {
  for (var a = this.Cp(), b = [], c = [], e, f, g = 0;f = a[g];g++) {
    e = f.indexOf("="), -1 == e ? (b.push(""), c.push(f)) : (b.push(f.substring(0, e)), c.push(f.substring(e + 1)));
  }
  return{keys:b, Ww:c};
};
var ci = new ai(document);
ci.yL = 3950;
var di = null;
var ei = function(a, b, c, e, f) {
  a = new W(a);
  var g = a.Dc();
  if ("client-channel.google.com" == g) {
    var k;
    if (!di) {
      try {
        k = !!h.chrome.loadTimes().wasFetchedViaSpdy;
      } catch (l) {
        k = !1;
      }
      k ? di = "0" : (k = parseInt(ci.get("llbcs", "-1"), 10), isNaN(k) && (k = -1), k = ((k + 1) % 30).toString(), ci.set("llbcs", k, -1, "/", void 0, !1), di = k);
    }
    (k = di) && a.Ie(k + "." + g);
  }
  this.ah = a;
  this.Hi = e || null;
  this.Yv = b;
  this.bH = f || null;
  this.vH = c;
};
d = ei.prototype;
d.Xw = function() {
  return this.ah.toString();
};
d.df = function() {
  return this.Yv;
};
d.ef = function() {
  return this.Hi;
};
d.Oq = function() {
  return this.vH;
};
d.Yw = function() {
  var a = this.Yv, b = this.bH, c = new fi;
  c.kJ(a);
  null != b && c.lJ(b);
  return c;
};
d.IE = function(a) {
  var b = new ai(document), c = window.__OVERRIDE_SID;
  null == c && (c = b.get("SID"));
  if (c) {
    var e = 0 == a.indexOf("https:") || 0 == a.indexOf("chrome-extension:"), c = e ? window.__SAPISID : window.__APISID;
    null == c && (c = b.get(e ? "SAPISID" : "APISID"));
    c ? (b = e ? "SAPISIDHASH" : "APISIDHASH", e = new Af, e.reset(), e.update([c, a].join(" ")), a = uf(e.eo()), a = {scheme:b, hash:a.toLowerCase()}) : a = null;
  } else {
    a = null;
  }
  return a;
};
var gi = function(a, b) {
  this.uI = new Rf(a);
  this.ed = b ? Qf : Pf;
};
gi.prototype.stringify = function(a) {
  return this.uI.ce(a);
};
gi.prototype.parse = function(a) {
  return this.ed(a);
};
var hi = function(a, b, c, e, f) {
  this.g = a;
  this.j = b;
  this.cd = c;
  this.zb = e;
  this.Ng = f || 1;
  this.bf = 45E3;
  this.t = new P(this);
  this.Vj = new Te;
  this.Vj.setInterval(250);
};
d = hi.prototype;
d.Ab = null;
d.jc = !1;
d.Vf = null;
d.Yn = null;
d.Cj = null;
d.Eh = null;
d.wc = null;
d.Bb = null;
d.If = null;
d.Ca = null;
d.vh = 0;
d.oc = null;
d.xf = null;
d.Wa = null;
d.qa = -1;
d.xs = !0;
d.Be = !1;
d.Ff = 0;
d.Ij = null;
var ii = function(a, b) {
  switch(a) {
    case 0:
      return "Non-200 return code (" + b + ")";
    case 1:
      return "XMLHTTP failure (no data)";
    case 2:
      return "HttpConnection timeout";
    default:
      return "Unknown error";
  }
}, ji = {}, ki = {};
d = hi.prototype;
d.xc = function(a) {
  this.Ab = a;
};
d.setTimeout = function(a) {
  this.bf = a;
};
d.mt = function(a) {
  this.Ff = a;
};
d.lt = function(a, b, c) {
  this.Eh = 1;
  this.wc = a.clone().Lf();
  this.If = b;
  this.Mr = c;
  this.Xv(null);
};
d.qn = function(a, b, c, e) {
  this.Eh = 1;
  this.wc = a.clone().Lf();
  this.If = null;
  this.Mr = b;
  e && (this.xs = !1);
  this.Xv(c);
};
d.Xv = function(a) {
  this.Cj = t();
  this.nf();
  this.Bb = this.wc.clone();
  this.Bb.pj("t", this.Ng);
  this.vh = 0;
  this.Ca = this.g.En(this.g.Rj() ? a : null);
  0 < this.Ff && (this.Ij = new af(s(this.ys, this, this.Ca), this.Ff));
  this.t.listen(this.Ca, "readystatechange", this.KB);
  a = this.Ab ? Ob(this.Ab) : {};
  this.If ? (this.xf = "POST", a["Content-Type"] = "application/x-www-form-urlencoded", this.Ca.send(this.Bb, this.xf, this.If, a)) : (this.xf = "GET", this.xs && !E && (a.Connection = "close"), this.Ca.send(this.Bb, this.xf, null, a));
  this.g.$b(1);
  this.j.LB(this.xf, this.Bb, this.zb, this.Ng, this.If);
};
d.KB = function(a) {
  a = a.target;
  var b = this.Ij;
  b && 3 == a.wd() ? (this.j.debug("Throttling readystatechange."), b.Qu()) : this.ys(a);
};
d.ys = function(a) {
  try {
    a == this.Ca ? this.RC() : this.j.e("Called back with an unexpected xmlhttp");
  } catch (b) {
    this.j.debug("Failed call to OnXmlHttpReadyStateChanged_"), this.Ca && this.Ca.Xb() ? this.j.Ld(b, "ResponseText: " + this.Ca.Xb()) : this.j.Ld(b, "No response text");
  } finally {
  }
};
d.RC = function() {
  var a = this.Ca.wd(), b = this.Ca.ui(), c = this.Ca.Aa();
  if (C && !(C && 10 <= Cc) || E && !Ac("420+")) {
    if (4 > a) {
      return;
    }
  } else {
    if (3 > a || 3 == a && !lc && !this.Ca.Xb()) {
      return;
    }
  }
  this.Be || 4 != a || 7 == b || (8 == b || 0 >= c ? this.g.$b(3) : this.g.$b(2));
  this.ij();
  this.qa = b = this.Ca.Aa();
  (c = this.Ca.Xb()) || this.j.debug("No response text for uri " + this.Bb + " status " + b);
  this.jc = 200 == b;
  this.j.FA(this.xf, this.Bb, this.zb, this.Ng, a, b);
  this.jc ? (4 == a && this.Sc(), this.Mr ? (this.Xr(a, c), lc && this.jc && 3 == a && this.EA()) : (this.j.qh(this.zb, c, null), this.fn(c)), this.jc && !this.Be && (4 == a ? this.g.Dj(this) : (this.jc = !1, this.nf()))) : (400 == b && 0 < c.indexOf("Unknown SID") ? (this.Wa = 3, Y(13), this.j.e("XMLHTTP Unknown SID (" + this.zb + ")")) : (this.Wa = 0, Y(14), this.j.e("XMLHTTP Bad status " + b + " (" + this.zb + ")")), this.Sc(), this.gj());
};
d.Xr = function(a, b) {
  for (var c = !0;!this.Be && this.vh < b.length;) {
    var e = this.qD(b);
    if (e == ki) {
      4 == a && (this.Wa = 4, Y(15), c = !1);
      this.j.qh(this.zb, null, "[Incomplete Response]");
      break;
    } else {
      if (e == ji) {
        this.Wa = 4;
        Y(16);
        this.j.qh(this.zb, b, "[Invalid Chunk]");
        c = !1;
        break;
      } else {
        this.j.qh(this.zb, e, null), this.fn(e);
      }
    }
  }
  4 == a && 0 == b.length && (this.Wa = 1, Y(17), c = !1);
  this.jc = this.jc && c;
  c || (this.j.qh(this.zb, b, "[Invalid Chunked Response]"), this.Sc(), this.gj());
};
d.yG = function() {
  var a = this.Ca.wd(), b = this.Ca.Xb();
  this.vh < b.length && (this.ij(), this.Xr(a, b), this.jc && 4 != a && this.nf());
};
d.EA = function() {
  this.t.listen(this.Vj, "tick", this.yG);
  this.Vj.start();
};
d.qD = function(a) {
  var b = this.vh, c = a.indexOf("\n", b);
  if (-1 == c) {
    return ki;
  }
  b = Number(a.substring(b, c));
  if (isNaN(b)) {
    return ji;
  }
  c += 1;
  if (c + b > a.length) {
    return ki;
  }
  a = a.substr(c, b);
  this.vh = c + b;
  return a;
};
d.Cs = function(a, b) {
  this.Eh = 3;
  this.wc = a.clone().Lf();
  this.fI(b);
};
d.fI = function(a) {
  this.Cj = t();
  this.nf();
  var b = a ? window.location.hostname : "";
  this.Bb = this.wc.clone();
  this.Bb.ca("DOMAIN", b);
  this.Bb.ca("t", this.Ng);
  try {
    this.oc = new ActiveXObject("htmlfile");
  } catch (c) {
    this.j.w("ActiveX blocked");
    this.Sc();
    this.Wa = 7;
    Y(22);
    this.gj();
    return;
  }
  var e = "<html><body>";
  a && (e += '<script>document.domain="' + b + '"\x3c/script>');
  e += "</body></html>";
  this.oc.open();
  this.oc.write(e);
  this.oc.close();
  this.oc.parentWindow.m = s(this.SB, this);
  this.oc.parentWindow.d = s(this.As, this, !0);
  this.oc.parentWindow.rpcClose = s(this.As, this, !1);
  a = this.oc.createElement("div");
  this.oc.parentWindow.document.body.appendChild(a);
  a.innerHTML = '<iframe src="' + this.Bb + '"></iframe>';
  this.j.TB("GET", this.Bb, this.zb, this.Ng);
  this.g.$b(1);
};
d.SB = function(a) {
  li(s(this.EK, this, a), 0);
};
d.EK = function(a) {
  this.Be || (this.j.wE(this.zb, a), this.ij(), this.fn(a), this.nf());
};
d.As = function(a) {
  li(s(this.DK, this, a), 0);
};
d.DK = function(a) {
  this.Be || (this.j.yC(this.zb, a), this.Sc(), this.jc = a, this.g.Dj(this), this.g.$b(4));
};
d.MC = function(a) {
  this.Eh = 2;
  this.wc = a.clone().Lf();
  this.eI();
};
d.eI = function() {
  (new Image).src = this.wc;
  this.Cj = t();
  this.nf();
};
d.cancel = function() {
  this.Be = !0;
  this.Sc();
};
d.nf = function() {
  this.Yn = t() + this.bf;
  this.tt(this.bf);
};
d.tt = function(a) {
  if (null != this.Vf) {
    throw Error("WatchDog timer not null");
  }
  this.Vf = li(s(this.AJ, this), a);
};
d.ij = function() {
  this.Vf && (h.clearTimeout(this.Vf), this.Vf = null);
};
d.AJ = function() {
  this.Vf = null;
  var a = t();
  0 <= a - this.Yn ? this.bD() : (this.j.e("WatchDog timer called too early"), this.tt(this.Yn - a));
};
d.bD = function() {
  this.jc && this.j.w("Received watchdog timeout even though request loaded successfully");
  this.j.kC(this.Bb);
  2 != this.Eh && this.g.$b(3);
  this.Sc();
  this.Wa = 2;
  Y(18);
  this.gj();
};
d.gj = function() {
  this.g.yu() || this.Be || this.g.Dj(this);
};
d.Sc = function() {
  this.ij();
  Wd(this.Ij);
  this.Ij = null;
  this.Vj.stop();
  this.t.removeAll();
  if (this.Ca) {
    var a = this.Ca;
    this.Ca = null;
    a.abort();
    a.W();
  }
  this.oc && (this.oc = null);
};
d.js = function() {
  return this.jc;
};
d.Ve = function() {
  return this.Wa;
};
d.Gc = function() {
  return this.qa;
};
d.jf = function() {
  return this.cd;
};
d.SC = function() {
  return this.zb;
};
d.xn = function() {
  return this.If;
};
d.wn = function() {
  return this.Cj;
};
d.fn = function(a) {
  try {
    this.g.vt(this, a), this.g.$b(4);
  } catch (b) {
    this.j.Ld(b, "Error in httprequest callback");
  }
};
var mi = function() {
  this.a = Vf("goog.net.BrowserChannel");
};
d = mi.prototype;
d.dw = function() {
  return this.a;
};
d.LB = function(a, b, c, e, f) {
  this.info("XMLHTTP REQ (" + c + ") [attempt " + e + "]: " + a + "\n" + b + "\n" + this.BK(f));
};
d.FA = function(a, b, c, e, f, g) {
  this.info("XMLHTTP RESP (" + c + ") [ attempt " + e + "]: " + a + "\n" + b + "\n" + f + " " + g);
};
d.qh = function(a, b, c) {
  this.info("XMLHTTP TEXT (" + a + "): " + this.qx(b) + (c ? " " + c : ""));
};
d.TB = function(a, b, c, e) {
  this.info("TRIDENT REQ (" + c + ") [ attempt " + e + "]: " + a + "\n" + b);
};
d.wE = function(a, b) {
  this.info("TRIDENT TEXT (" + a + "): " + this.qx(b));
};
d.yC = function(a, b) {
  this.info("TRIDENT TEXT (" + a + "): " + b ? "success" : "failure");
};
d.kC = function(a) {
  this.info("TIMEOUT: " + a);
};
d.debug = function(a) {
  this.info(a);
};
d.Ld = function(a, b) {
  this.w((b || "Exception") + a);
};
d.info = function(a) {
  U(this.a, a);
};
d.e = function(a) {
  Wf(this.a, a);
};
d.w = function(a) {
  T(this.a, a);
};
d.qx = function(a) {
  if (!a || "y2f%" == a) {
    return a;
  }
  try {
    var b = Qf(a);
    if (b) {
      for (var c = 0;c < b.length;c++) {
        p(b[c]) && this.AK(b[c]);
      }
    }
    return Sf(b);
  } catch (e) {
    return this.debug("Exception parsing expected JS array - probably was not JS"), a;
  }
};
d.AK = function(a) {
  if (!(2 > a.length || (a = a[1], !p(a) || 1 > a.length))) {
    var b = a[0];
    if ("noop" != b && "stop" != b) {
      for (b = 1;b < a.length;b++) {
        a[b] = "";
      }
    }
  }
};
d.BK = function(a) {
  if (!a) {
    return null;
  }
  var b = "";
  a = a.split("&");
  for (var c = 0;c < a.length;c++) {
    var e = a[c].split("=");
    if (1 < e.length) {
      var f = e[0], e = e[1], g = f.split("_"), b = 2 <= g.length && "type" == g[1] ? b + (f + "=" + e + "&") : b + (f + "=redacted&")
    }
  }
  return b;
};
var oi = function(a, b, c, e, f) {
  (new mi).debug("TestLoadImageWithRetries: " + f);
  if (0 == e) {
    c(!1);
  } else {
    var g = f || 0;
    e--;
    ni(a, b, function(f) {
      f ? c(!0) : h.setTimeout(function() {
        oi(a, b, c, e, g);
      }, g);
    });
  }
}, ni = function(a, b, c) {
  var e = new mi;
  e.debug("TestLoadImage: loading " + a);
  var f = new Image;
  f.onload = function() {
    try {
      e.debug("TestLoadImage: loaded"), pi(f), c(!0);
    } catch (a) {
      e.Ld(a);
    }
  };
  f.onerror = function() {
    try {
      e.debug("TestLoadImage: error"), pi(f), c(!1);
    } catch (a) {
      e.Ld(a);
    }
  };
  f.onabort = function() {
    try {
      e.debug("TestLoadImage: abort"), pi(f), c(!1);
    } catch (a) {
      e.Ld(a);
    }
  };
  f.ontimeout = function() {
    try {
      e.debug("TestLoadImage: timeout"), pi(f), c(!1);
    } catch (a) {
      e.Ld(a);
    }
  };
  h.setTimeout(function() {
    if (f.ontimeout) {
      f.ontimeout();
    }
  }, b);
  f.src = a;
}, pi = function(a) {
  a.onload = null;
  a.onerror = null;
  a.onabort = null;
  a.ontimeout = null;
};
var qi = function(a, b) {
  this.g = a;
  this.j = b;
  this.ed = new gi(null, !0);
};
d = qi.prototype;
d.Ab = null;
d.tb = null;
d.Oj = !1;
d.hh = null;
d.Mj = null;
d.An = null;
d.mc = null;
d.h = null;
d.qa = -1;
d.Fc = null;
d.th = null;
d.xc = function(a) {
  this.Ab = a;
};
d.mu = function(a) {
  this.ed = a;
};
d.connect = function(a) {
  this.mc = a;
  a = this.g.zs(this.mc);
  Y(3);
  this.hh = t();
  var b = this.g.UB();
  null != b ? (this.Fc = this.g.gh(b[0]), (this.th = b[1]) ? (this.h = 1, this.ts()) : (this.h = 2, this.un())) : (a.pj("MODE", "init"), this.tb = new hi(this, this.j, void 0, void 0, void 0), this.tb.xc(this.Ab), this.tb.qn(a, !1, null, !0), this.h = 0);
};
d.ts = function() {
  var a = this.g.Wn(this.th, "/mail/images/cleardot.gif");
  a.Lf();
  oi(a.toString(), 5E3, s(this.QD, this), 3, 2E3);
  this.$b(1);
};
d.QD = function(a) {
  a ? (this.h = 2, this.un()) : (Y(4), this.g.aD(this));
  a && this.$b(2);
};
d.un = function() {
  this.j.debug("TestConnection: starting stage 2");
  var a = this.g.rC();
  null != a ? (this.j.debug("TestConnection: skipping stage 2, precomputed result is " + a ? "Buffered" : "Unbuffered"), Y(5), a ? (Y(11), this.g.yh(this, !1)) : (Y(12), this.g.yh(this, !0))) : (this.tb = new hi(this, this.j, void 0, void 0, void 0), this.tb.xc(this.Ab), a = this.g.ks(this.Fc, this.mc), Y(5), !C || C && 10 <= Cc ? (a.pj("TYPE", "xmlhttp"), this.tb.qn(a, !1, this.Fc, !1)) : (a.pj("TYPE", "html"), this.tb.Cs(a, Boolean(this.Fc))));
};
d.En = function(a) {
  return this.g.En(a);
};
d.abort = function() {
  this.tb && (this.tb.cancel(), this.tb = null);
  this.qa = -1;
};
d.yu = function() {
  return!1;
};
d.vt = function(a, b) {
  this.qa = a.Gc();
  if (0 == this.h) {
    if (this.j.debug("TestConnection: Got data for stage 1"), b) {
      try {
        var c = this.ed.parse(b);
      } catch (e) {
        this.j.Ld(e);
        this.g.Bn(this, 4);
        return;
      }
      this.Fc = this.g.gh(c[0]);
      this.th = c[1];
    } else {
      this.j.debug("TestConnection: Null responseText"), this.g.Bn(this, 4);
    }
  } else {
    2 == this.h && (this.Oj ? (Y(7), this.An = t()) : "11111" == b ? (Y(6), this.Oj = !0, this.Mj = t(), this.QB() && (this.qa = 200, this.tb.cancel(), this.j.debug("Test connection succeeded; using streaming connection"), Y(12), this.g.yh(this, !0))) : (Y(8), this.Mj = this.An = t(), this.Oj = !1));
  }
};
d.Dj = function() {
  this.qa = this.tb.Gc();
  if (!this.tb.js()) {
    this.j.debug("TestConnection: request failed, in state " + this.h), 0 == this.h ? Y(9) : 2 == this.h && Y(10), this.g.Bn(this, this.tb.Ve());
  } else {
    if (0 == this.h) {
      this.j.debug("TestConnection: request complete for initial check"), this.th ? (this.h = 1, this.ts()) : (this.h = 2, this.un());
    } else {
      if (2 == this.h) {
        this.j.debug("TestConnection: request complete for stage 2");
        var a = !1;
        (a = !C || C && 10 <= Cc ? this.Oj : 200 > this.An - this.Mj ? !1 : !0) ? (this.j.debug("Test connection succeeded; using streaming connection"), Y(12), this.g.yh(this, !0)) : (this.j.debug("Test connection failed; not using streaming"), Y(11), this.g.yh(this, !1));
      }
    }
  }
};
d.Gc = function() {
  return this.qa;
};
d.Rj = function() {
  return this.g.Rj();
};
d.Ic = function() {
  return this.g.Ic();
};
d.QB = function() {
  var a = this.Mj - this.hh;
  return!C || C && 10 <= Cc || 500 > a;
};
d.$b = function(a) {
  this.g.$b(a);
};
var ri = function(a, b, c) {
  this.Ps = a || null;
  this.h = 1;
  this.ub = [];
  this.fd = [];
  this.j = new mi;
  this.ed = new gi(null, !0);
  this.YC = b || null;
  this.ZC = null != c ? c : null;
}, si = function(a, b) {
  this.qw = a;
  this.map = b;
};
d = ri.prototype;
d.Ab = null;
d.Xh = null;
d.Cb = null;
d.Da = null;
d.mc = null;
d.Uj = null;
d.ws = null;
d.Fc = null;
d.PG = !0;
d.Fh = 0;
d.KC = 0;
d.fK = !1;
d.D = null;
d.Qd = null;
d.gd = null;
d.Oe = null;
d.Ud = null;
d.Ln = null;
d.mE = !0;
d.Fj = -1;
d.Lu = -1;
d.qa = -1;
d.Gf = 0;
d.Jf = 0;
d.Su = 5E3;
d.Uu = 1E4;
d.gK = 2;
d.qt = 2E4;
d.Ff = 0;
d.Fp = !1;
d.Cf = 8;
var ti = new O, ui = function(a, b) {
  L.call(this, "statevent", a);
  this.stat = b;
};
u(ui, L);
var vi = function(a, b) {
  L.call(this, "timingevent", a);
  this.size = b;
};
u(vi, L);
var wi = function(a) {
  L.call(this, "serverreachability", a);
};
u(wi, L);
d = ri.prototype;
d.connect = function(a, b, c, e, f) {
  this.j.debug("connect()");
  Y(0);
  this.mc = b;
  this.Xh = c || {};
  e && n(f) && (this.Xh.OSID = e, this.Xh.OAID = f);
  this.lF(a);
};
d.disconnect = function() {
  this.j.debug("disconnect()");
  this.Ss();
  if (3 == this.h) {
    var a = this.Fh++, b = this.Uj.clone();
    b.ca("SID", this.cd);
    b.ca("RID", a);
    b.ca("TYPE", "terminate");
    this.zh(b);
    (new hi(this, this.j, this.cd, a, void 0)).MC(b);
  }
  this.Fi();
};
d.jf = function() {
  return this.cd;
};
d.lF = function(a) {
  this.j.debug("connectTest_()");
  this.zn() && (this.Ud = new qi(this, this.j), this.Ud.xc(this.Ab), this.Ud.mu(this.ed), this.Ud.connect(a));
};
d.nE = function() {
  this.j.debug("connectChannel_()");
  this.SE(1, 0);
  this.Uj = this.zs(this.mc);
  this.Cn();
};
d.Ss = function() {
  this.Ud && (this.Ud.abort(), this.Ud = null);
  this.Da && (this.Da.cancel(), this.Da = null);
  this.gd && (h.clearTimeout(this.gd), this.gd = null);
  this.Hj();
  this.Cb && (this.Cb.cancel(), this.Cb = null);
  this.Qd && (h.clearTimeout(this.Qd), this.Qd = null);
};
d.xc = function(a) {
  this.Ab = a;
};
d.mt = function(a) {
  this.Ff = a;
};
d.hz = function(a) {
  this.D = a;
};
d.yJ = function() {
  return!this.Ln;
};
d.rj = function(a, b) {
  if (0 == this.h) {
    throw Error("Invalid operation: sending map when state is closed");
  }
  1E3 == this.ub.length && this.j.w("Already have 1000 queued maps upon queueing " + Sf(a));
  this.ub.push(new si(this.KC++, a, b));
  2 != this.h && 3 != this.h || this.Cn();
};
d.tC = function() {
  return this.fK ? 0 : this.gK;
};
d.kD = function() {
  return 3;
};
d.yu = function() {
  return 0 == this.h;
};
d.X = function() {
  return this.h;
};
d.Gc = function() {
  return this.qa;
};
d.mu = function(a) {
  this.ed = a;
};
d.Cn = function() {
  this.Cb || this.Qd || (this.Qd = li(s(this.Xs, this), 0), this.Gf = 0);
};
d.jC = function(a) {
  if (this.Cb || this.Qd) {
    return this.j.w("Request already in progress"), !1;
  }
  if (1 == this.h || this.Gf >= this.tC()) {
    return!1;
  }
  this.j.debug("Going to retry POST");
  this.Qd = li(s(this.Xs, this, a), this.Os(this.Gf));
  this.Gf++;
  return!0;
};
d.Xs = function(a) {
  this.Qd = null;
  this.mJ(a);
};
d.mJ = function(a) {
  this.j.debug("startForwardChannel_");
  this.zn() && (1 == this.h ? a ? this.j.w("Not supposed to retry the open") : (this.vC(), this.h = 2) : 3 == this.h && (a ? this.Ys(a) : 0 == this.ub.length ? this.j.debug("startForwardChannel_ returned: nothing to send") : this.Cb ? this.j.w("startForwardChannel_ returned: connection already in progress") : (this.Ys(), this.j.debug("startForwardChannel_ finished, sent request"))));
};
d.vC = function() {
  this.j.debug("open_()");
  this.Fh = Math.floor(1E5 * Math.random());
  var a = this.Fh++, b = new hi(this, this.j, "", a, void 0);
  b.xc(this.Ab);
  var c = this.Un(), e = this.Uj.clone();
  e.ca("RID", a);
  this.Ps && e.ca("CVER", this.Ps);
  this.zh(e);
  b.lt(e, c, !0);
  this.Cb = b;
};
d.Ys = function(a) {
  var b;
  a ? 6 < this.Cf ? (this.TC(), b = this.Fh - 1, a = this.Un()) : (b = a.SC(), a = a.xn()) : (b = this.Fh++, a = this.Un());
  var c = this.Uj.clone();
  c.ca("SID", this.cd);
  c.ca("RID", b);
  c.ca("AID", this.Fj);
  this.zh(c);
  b = new hi(this, this.j, this.cd, b, this.Gf + 1);
  b.xc(this.Ab);
  b.setTimeout(Math.round(0.5 * this.qt) + Math.round(0.5 * this.qt * Math.random()));
  this.Cb = b;
  b.lt(c, a, !0);
};
d.zh = function(a) {
  if (this.D) {
    var b = this.D.bG(this);
    b && Wb(b, function(b, e) {
      a.ca(e, b);
    });
  }
};
d.Un = function() {
  var a = Math.min(this.ub.length, 1E3), b = ["count=" + a], c;
  6 < this.Cf && 0 < a ? (c = this.ub[0].qw, b.push("ofs=" + c)) : c = 0;
  for (var e = 0;e < a;e++) {
    var f = this.ub[e].qw, g = this.ub[e].map, f = 6 >= this.Cf ? e : f - c;
    try {
      Wb(g, function(a, c) {
        b.push("req" + f + "_" + c + "=" + encodeURIComponent(a));
      });
    } catch (k) {
      b.push("req" + f + "_type=" + encodeURIComponent("_badmap"));
    }
  }
  this.fd = this.fd.concat(this.ub.splice(0, a));
  return b.join("&");
};
d.TC = function() {
  this.ub = this.fd.concat(this.ub);
  this.fd.length = 0;
};
d.ss = function() {
  this.Da || this.gd || (this.Ns = 1, this.gd = li(s(this.It, this), 0), this.Jf = 0);
};
d.vn = function() {
  if (this.Da || this.gd) {
    return this.j.w("Request already in progress"), !1;
  }
  if (this.Jf >= this.kD()) {
    return!1;
  }
  this.j.debug("Going to retry GET");
  this.Ns++;
  this.gd = li(s(this.It, this), this.Os(this.Jf));
  this.Jf++;
  return!0;
};
d.It = function() {
  this.gd = null;
  this.dJ();
};
d.dJ = function() {
  if (this.zn()) {
    this.j.debug("Creating new HttpRequest");
    this.Da = new hi(this, this.j, this.cd, "rpc", this.Ns);
    this.Da.xc(this.Ab);
    this.Da.mt(this.Ff);
    var a = this.ws.clone();
    a.ca("RID", "rpc");
    a.ca("SID", this.cd);
    a.ca("CI", this.Ln ? "0" : "1");
    a.ca("AID", this.Fj);
    this.zh(a);
    !C || C && 10 <= Cc ? (a.ca("TYPE", "xmlhttp"), this.Da.qn(a, !0, this.Fc, !1)) : (a.ca("TYPE", "html"), this.Da.Cs(a, Boolean(this.Fc)));
    this.j.debug("New Request created");
  }
};
d.zn = function() {
  if (this.D) {
    var a = this.D.ND(this);
    if (0 != a) {
      return this.j.debug("Handler returned error code from okToMakeRequest"), this.Qb(a), !1;
    }
  }
  return!0;
};
d.yh = function(a, b) {
  this.j.debug("Test Connection Finished");
  this.Ln = this.mE && b;
  this.qa = a.Gc();
  this.nE();
};
d.Bn = function(a) {
  this.j.debug("Test Connection Failed");
  this.qa = a.Gc();
  this.Qb(2);
};
d.aD = function() {
  this.j.debug("Test Connection Blocked");
  this.qa = this.Ud.Gc();
  this.Qb(9);
};
d.vt = function(a, b) {
  if (0 != this.h && (this.Da == a || this.Cb == a)) {
    if (this.qa = a.Gc(), this.Cb == a && 3 == this.h) {
      if (7 < this.Cf) {
        var c;
        try {
          c = this.ed.parse(b);
        } catch (e) {
          c = null;
        }
        p(c) && 3 == c.length ? this.lC(c) : (this.j.debug("Bad POST response data returned"), this.Qb(11));
      } else {
        "y2f%" != b && (this.j.debug("Bad data returned - missing/invald magic cookie"), this.Qb(11));
      }
    } else {
      this.Da == a && this.Hj(), ra(b) || (c = this.ed.parse(b), v(p(c)), this.mC(c));
    }
  }
};
d.lC = function(a) {
  if (0 == a[0]) {
    this.$E();
  } else {
    this.Lu = a[1];
    var b = this.Lu - this.Fj;
    0 < b && (a = a[2], this.j.debug(a + " bytes (in " + b + " arrays) are outstanding on the BackChannel"), this.bF(a) && !this.Oe && (this.Oe = li(s(this.aF, this), 6E3)));
  }
};
d.$E = function() {
  this.j.debug("Server claims our backchannel is missing.");
  if (this.gd) {
    this.j.debug("But we are currently starting the request.");
  } else {
    if (this.Da) {
      if (this.Da.wn() + 3E3 < this.Cb.wn()) {
        this.Hj(), this.Da.cancel(), this.Da = null;
      } else {
        return;
      }
    } else {
      this.j.e("We do not have a BackChannel established");
    }
    this.vn();
    Y(19);
  }
};
d.bF = function(a) {
  return 37500 > a && !this.yJ() && 0 == this.Jf;
};
d.gh = function(a) {
  return this.PG ? this.D ? this.D.gh(a) : a : null;
};
d.aF = function() {
  null != this.Oe && (this.Oe = null, this.Da.cancel(), this.Da = null, this.vn(), Y(20));
};
d.Hj = function() {
  null != this.Oe && (h.clearTimeout(this.Oe), this.Oe = null);
};
d.Dj = function(a) {
  this.j.debug("Request complete");
  var b;
  if (this.Da == a) {
    this.Hj(), this.Da = null, b = 2;
  } else {
    if (this.Cb == a) {
      this.Cb = null, b = 1;
    } else {
      return;
    }
  }
  this.qa = a.Gc();
  if (0 != this.h) {
    if (a.js()) {
      1 == b ? (b = t() - a.wn(), ti.dispatchEvent(new vi(ti, a.xn() ? a.xn().length : 0, b, this.Gf)), this.Cn(), this.wb(), this.fd.length = 0) : this.ss();
    } else {
      var c = a.Ve();
      if (3 == c || 7 == c || 0 == c && 0 < this.qa) {
        this.j.debug("Not retrying due to error type");
      } else {
        this.j.debug("Maybe retrying, last error: " + ii(c, this.qa));
        if (1 == b && this.jC(a) || 2 == b && this.vn()) {
          return;
        }
        this.j.debug("Exceeded max number of retries");
      }
      this.j.debug("Error: HTTP request failed");
      switch(c) {
        case 1:
          this.Qb(5);
          break;
        case 4:
          this.Qb(10);
          break;
        case 3:
          this.Qb(6);
          break;
        case 7:
          this.Qb(12);
          break;
        default:
          this.Qb(2);
      }
    }
  }
};
d.Os = function(a) {
  var b = this.Su + Math.floor(Math.random() * this.Uu);
  this.Ic() || (this.j.debug("Inactive channel"), b *= 2);
  return b * a;
};
d.ri = function(a, b) {
  this.Su = a;
  this.Uu = b;
};
d.mC = function(a) {
  for (var b = this.D && this.D.Sn ? [] : null, c = 0;c < a.length;c++) {
    var e = a[c];
    this.Fj = e[0];
    e = e[1];
    2 == this.h ? "c" == e[0] ? (this.cd = e[1], this.Fc = this.gh(e[2]), e = e[3], this.Cf = null != e ? e : 6, this.h = 3, this.D && this.D.se(this), this.ws = this.ks(this.Fc, this.mc), this.ss()) : "stop" == e[0] && this.Qb(7) : 3 == this.h && ("stop" == e[0] ? (b && 0 != b.length && (this.D.Sn(this, b), b.length = 0), this.Qb(7)) : "noop" != e[0] && (b ? b.push(e) : this.D && this.D.He(this, e)), this.Jf = 0);
  }
  b && 0 != b.length && this.D.Sn(this, b);
};
d.SE = function(a) {
  if (!qb(arguments, this.h)) {
    throw Error("Unexpected channel state: " + this.h);
  }
};
d.Qb = function(a) {
  this.j.info("Error code " + a);
  if (2 == a || 9 == a) {
    var b = null;
    this.D && (b = this.D.eD(this));
    var c = s(this.fD, this);
    b || (b = new W("//www.google.com/images/cleardot.gif"), b.Lf());
    ni(b.toString(), 1E4, c);
  } else {
    Y(2);
  }
  this.v(a);
};
d.fD = function(a) {
  a ? (this.j.info("Successfully pinged google.com"), Y(2)) : (this.j.info("Failed to ping google.com"), Y(1), this.v(8));
};
d.wb = function() {
};
d.v = function(a) {
  this.j.debug("HttpChannel: error - " + a);
  this.h = 0;
  this.D && this.D.Ad(this, a);
  this.Fi();
  this.Ss();
};
d.Fi = function() {
  this.h = 0;
  this.qa = -1;
  if (this.D) {
    if (0 == this.fd.length && 0 == this.ub.length) {
      this.D.Xc(this);
    } else {
      this.j.debug("Number of undelivered maps, pending: " + this.fd.length + ", outgoing: " + this.ub.length);
      var a = wb(this.fd), b = wb(this.ub);
      this.fd.length = 0;
      this.ub.length = 0;
      this.D.Xc(this, a, b);
    }
  }
};
d.zs = function(a) {
  a = this.Wn(null, a);
  this.j.debug("GetForwardChannelUri: " + a);
  return a;
};
d.UB = function() {
  return this.YC;
};
d.rC = function() {
  return this.ZC;
};
d.ks = function(a, b) {
  var c = this.Wn(this.Rj() ? a : null, b);
  this.j.debug("GetBackChannelUri: " + c);
  return c;
};
d.Wn = function(a, b, c) {
  var e = fg(b);
  if ("" != e.Dc()) {
    a && e.Ie(a + "." + e.Dc()), e.Uh(c || e.ik());
  } else {
    var f = window.location, e = gg(f.protocol, null, a ? a + "." + f.hostname : f.hostname, c || f.port, b)
  }
  this.Xh && Wb(this.Xh, function(a, b) {
    e.ca(b, a);
  });
  e.ca("VER", this.Cf);
  this.zh(e);
  return e;
};
d.En = function(a) {
  if (a && !this.Fp) {
    throw Error("Can't create secondary domain capable XhrIo object.");
  }
  a = new th;
  a.TJ(this.Fp);
  return a;
};
d.Ic = function() {
  return!!this.D && this.D.Ic(this);
};
var li = function(a, b) {
  if (!ha(a)) {
    throw Error("Fn must not be null and must be a function");
  }
  return h.setTimeout(function() {
    a();
  }, b);
};
ri.prototype.$b = function(a) {
  ti.dispatchEvent(new wi(ti, a));
};
var Y = function(a) {
  ti.dispatchEvent(new ui(ti, a));
};
ri.prototype.Rj = function() {
  return this.Fp || !(!C || C && 10 <= Cc);
};
var xi = function() {
};
d = xi.prototype;
d.Sn = null;
d.ND = function() {
  return 0;
};
d.se = function() {
};
d.He = function() {
};
d.Ad = function() {
};
d.Xc = function() {
};
d.bG = function() {
  return{};
};
d.eD = function() {
  return null;
};
d.Ic = function() {
  return!0;
};
d.gh = function(a) {
  return a;
};
var yi = function() {
};
var zi = function(a, b, c) {
  this.sG = a;
  this.$f = b.name || null;
  this.rG = b.Ya || null;
  this.iv = b.PK;
  this.vc = {};
  for (a = 0;a < c.length;a++) {
    b = c[a], this.vc[b.Gb()] = b;
  }
};
d = zi.prototype;
d.getName = function() {
  return this.$f;
};
d.no = function() {
  return this.rG;
};
d.Yd = function() {
  return this.iv ? this.iv.ta() : null;
};
d.Mh = function() {
  var a = Hb(this.vc);
  Ab(a, function(a, c) {
    return a.Gb() - c.Gb();
  });
  return a;
};
d.cG = function() {
  return this.vc;
};
d.Mn = function(a) {
  return Lb(this.vc, function(b) {
    return b.getName() == a;
  }) || null;
};
d.KG = function(a) {
  v(!/[^0-9]/.test(a));
  return this.vc[parseInt(a, 10)] || null;
};
d.Uv = function() {
  return new this.sG;
};
var Ai = function(a, b, c) {
  this.Ea = a;
  v(!/[^0-9]/.test(b));
  this.kF = b;
  this.$f = c.name;
  this.jF = !!c.OK;
  this.Lk = c.B;
  this.vo = c.type;
  this.Eo = !1;
  switch(this.Lk) {
    case 3:
    ;
    case 4:
    ;
    case 6:
    ;
    case 16:
    ;
    case 18:
      this.Eo = !0;
  }
  this.Do = c.defaultValue;
};
d = Ai.prototype;
d.Gb = function() {
  return this.kF;
};
d.Yd = function() {
  return this.Ea.ta();
};
d.getName = function() {
  return this.$f;
};
d.CG = function() {
  if (void 0 === this.Do) {
    var a = this.vo;
    this.Do = a === Boolean ? !1 : a === Number ? 0 : a === String ? this.Eo ? "0" : "" : new a;
  }
  return this.Do;
};
d.Mc = function() {
  return this.Lk;
};
d.hi = function() {
  return this.vo;
};
d.OH = function() {
  return this.Eo;
};
d.mv = function() {
  v(this.Yh(), "Expected message or group");
  return this.vo.ta();
};
d.Yh = function() {
  return 11 == this.Lk || 10 == this.Lk;
};
d.Rb = function() {
  return this.jF;
};
var Z = function() {
  this.Hb = {};
  this.vc = this.ta().cG();
  this.kb = this.ev = null;
};
d = Z.prototype;
d.MG = function(a, b) {
  v(!this.vc[a], "Field is not unknown in this message");
  v(1 <= a, "Tag is not valid");
  v(null !== b, "Value cannot be null");
  this.Hb[a] = b;
  this.kb && delete this.kb[a];
};
d.cv = function(a, b) {
  var c = b || this, e;
  for (e in this.Hb) {
    var f = Number(e);
    this.vc[f] || a.call(c, f, this.Hb[e]);
  }
};
d.ta = function() {
  var a = this.constructor, b;
  if (!(b = a.yw)) {
    var c;
    b = a.XH;
    var e = [], f;
    for (f in b) {
      b.hasOwnProperty(f) && (v(!/[^0-9]/.test(f), "Keys must be numeric"), 0 == f ? c = b[0] : e.push(new Ai(a, f, b[f])));
    }
    v(c);
    c = new zi(a, c, e);
    b = a.yw = c;
  }
  return b;
};
d.nd = function(a) {
  v(a.Yd() == this.ta(), "The current message does not contain the given field");
  return this.bb(a.Gb());
};
d.eF = function(a) {
  v(a.Yd() == this.ta(), "The current message does not contain the given field");
  return this.VG(a.Gb());
};
d.Qn = function(a) {
  v(a.Yd() == this.ta(), "The current message does not contain the given field");
  return this.WG(a.Gb());
};
d.get = function(a, b) {
  v(a.Yd() == this.ta(), "The current message does not contain the given field");
  return this.aa(a.Gb(), b);
};
d.set = function(a, b) {
  v(a.Yd() == this.ta(), "The current message does not contain the given field");
  this.K(a.Gb(), b);
};
d.add = function(a, b) {
  v(a.Yd() == this.ta(), "The current message does not contain the given field");
  this.UG(a.Gb(), b);
};
d.clear = function(a) {
  v(a.Yd() == this.ta(), "The current message does not contain the given field");
  this.Tv(a.Gb());
};
d.equals = function(a) {
  if (!a || this.constructor != a.constructor) {
    return!1;
  }
  for (var b = this.ta().Mh(), c = 0;c < b.length;c++) {
    var e = b[c];
    if (this.nd(e) != a.nd(e)) {
      return!1;
    }
    if (this.nd(e)) {
      var f = e.Yh(), g = this.eg(e), k = a.eg(e);
      if (e.Rb()) {
        if (g.length != k.length) {
          return!1;
        }
        for (e = 0;e < g.length;e++) {
          var l = g[e], q = k[e];
          if (f ? !l.equals(q) : l != q) {
            return!1;
          }
        }
      } else {
        if (f ? !g.equals(k) : g != k) {
          return!1;
        }
      }
    }
  }
  return!0;
};
d.lj = function(a) {
  v(this.constructor == a.constructor, "The source message must have the same type.");
  this != a && (this.Hb = {}, this.kb && (this.kb = {}), this.xu(a));
};
d.xu = function(a) {
  v(this.constructor == a.constructor, "The source message must have the same type.");
  for (var b = this.ta().Mh(), c = 0;c < b.length;c++) {
    var e = b[c];
    if (a.nd(e)) {
      this.kb && delete this.kb[e.Gb()];
      var f = e.Yh();
      if (e.Rb()) {
        for (var g = a.eF(e), k = 0;k < g.length;k++) {
          this.add(e, f ? g[k].clone() : g[k]);
        }
      } else {
        g = a.eg(e), f ? (f = this.eg(e)) ? f.xu(g) : this.set(e, g.clone()) : this.set(e, g);
      }
    }
  }
};
d.clone = function() {
  var a = new this.constructor;
  a.lj(this);
  return a;
};
d.$d = function(a) {
  v(this.vc[a], "No field found for the given tag");
  return this.vc[a];
};
d.bb = function(a) {
  v(this.vc[a], "No field found for the given tag");
  return null != this.Hb[a];
};
d.eg = function(a) {
  var b = a.Gb(), c = this.Hb[b];
  return null == c ? null : this.ev ? b in this.kb ? this.kb[b] : (a = this.ev.RK(this, a, c), this.kb[b] = a) : c;
};
d.aa = function(a, b) {
  var c = this.$d(a), e = this.eg(c);
  if (c.Rb()) {
    return v(p(e)), c = b || 0, v(0 <= c && c < e.length, "Given index is out of bounds"), e[c];
  }
  v(!p(e));
  return e;
};
d.sl = function(a, b) {
  return this.bb(a) ? this.aa(a, b) : this.$d(a).CG();
};
d.VG = function(a) {
  v(this.$d(a).Rb(), "Cannot call fieldArray on a non-repeated field");
  a = this.$d(a);
  a = this.eg(a);
  v(null == a || p(a));
  return a || [];
};
d.WG = function(a) {
  return this.$d(a).Rb() ? (this.bb(a) && v(p(this.Hb[a])), this.bb(a) ? this.Hb[a].length : 0) : this.bb(a) ? 1 : 0;
};
d.K = function(a, b) {
  var c = this.$d(a);
  v(!c.Rb(), "Cannot call set on a repeated field");
  this.Gv(c, b);
  this.Hb[a] = b;
  this.kb && (this.kb[a] = b);
};
d.UG = function(a, b) {
  var c = this.$d(a);
  v(c.Rb(), "Cannot call add on a non-repeated field");
  this.Gv(c, b);
  this.Hb[a] || (this.Hb[a] = []);
  this.Hb[a].push(b);
  this.kb && delete this.kb[a];
};
d.Gv = function(a, b) {
  14 == a.Mc() ? Za(b) : v(b.constructor == a.hi());
};
d.Tv = function(a) {
  v(this.$d(a), "Unknown field");
  delete this.Hb[a];
  this.kb && delete this.kb[a];
};
var $ = function(a, b) {
  a.XH = b;
  a.ta = function() {
    return a.yw || (new a).ta();
  };
};
var fi = function() {
  Z.apply(this);
};
u(fi, Z);
d = fi.prototype;
d.ef = function() {
  return this.aa(1);
};
d.Sv = function() {
  return this.sl(1);
};
d.ym = function(a) {
  this.K(1, a);
};
d.Ji = function() {
  return this.bb(1);
};
d.df = function() {
  return this.aa(2);
};
d.kJ = function(a) {
  this.K(2, a);
};
d.qz = function() {
  return this.sl(3);
};
d.rz = function(a) {
  this.K(3, a);
};
d.br = function() {
  return this.aa(4);
};
d.lJ = function(a) {
  this.K(4, a);
};
d.gz = function() {
  return this.bb(4);
};
var Bi = function() {
  Z.apply(this);
};
u(Bi, Z);
d = Bi.prototype;
d.le = function() {
  return this.aa(1);
};
d.mz = function(a) {
  this.K(1, a);
};
d.jd = function() {
  return this.aa(2);
};
d.Fd = function(a) {
  this.K(2, a);
};
d.tu = function() {
  return this.bb(2);
};
d.Zb = function() {
  return this.aa(3);
};
d.zo = function(a) {
  this.K(3, a);
};
d.TG = function() {
  return this.bb(3);
};
d.ef = function() {
  return this.aa(4);
};
d.Sv = function() {
  return this.sl(4);
};
d.ym = function(a) {
  this.K(4, a);
};
d.Ji = function() {
  return this.bb(4);
};
$(fi, {0:{name:"BrowserChannelConfig", Ya:"buzz.channel.proto.BrowserChannelConfig"}, 1:{name:"authuser", B:4, type:Number}, 2:{name:"client_type", B:9, type:String}, 3:{name:"init_delay_ms", B:5, type:Number}, 4:{name:"service_override", B:9, type:String}});
$(Bi, {0:{name:"AuthenticationParameters", Ya:"buzz.channel.proto.AuthenticationParameters"}, 1:{name:"origin", B:9, type:String}, 2:{name:"scheme", B:5, type:Number}, 3:{name:"token", B:9, type:String}, 4:{name:"authuser", B:13, type:Number}});
var Ci = function() {
  Z.apply(this);
};
u(Ci, Z);
Ci.prototype.Qm = function(a) {
  this.K(2, a);
};
Ci.prototype.getData = function() {
  return this.aa(3);
};
Ci.prototype.setData = function(a) {
  this.K(3, a);
};
Ci.prototype.clearData = function() {
  this.Tv(3);
};
var Di = function() {
  Z.apply(this);
};
u(Di, Z);
Di.prototype.Jp = function(a) {
  this.K(1, a);
};
Di.prototype.Kp = function(a) {
  this.K(2, a);
};
var Ei = function() {
  Z.apply(this);
};
u(Ei, Z);
Ei.prototype.setVersion = function(a) {
  this.K(1, a);
};
var Fi = function() {
  Z.apply(this);
};
u(Fi, Z);
Fi.prototype.setVersion = function(a) {
  this.K(1, a);
};
Fi.prototype.RJ = function(a) {
  this.K(2, a);
};
Fi.prototype.QJ = function(a) {
  this.K(3, a);
};
Fi.prototype.NJ = function(a) {
  this.K(4, a);
};
var Gi = function() {
  Z.apply(this);
};
u(Gi, Z);
Gi.prototype.cj = function() {
  return this.aa(1);
};
Gi.prototype.lK = function(a) {
  this.K(1, a);
};
Gi.prototype.mm = function() {
  return this.aa(2);
};
Gi.prototype.mK = function(a) {
  this.K(2, a);
};
var Hi = function() {
  Z.apply(this);
};
u(Hi, Z);
d = Hi.prototype;
d.getHeader = function() {
  return this.aa(1);
};
d.xr = function(a) {
  this.K(1, a);
};
d.Iz = function(a) {
  this.K(2, a);
};
d.Jz = function(a) {
  this.K(3, a);
};
d.Fz = function(a) {
  this.K(4, a);
};
var Ii = function() {
  Z.apply(this);
};
u(Ii, Z);
d = Ii.prototype;
d.yr = function(a) {
  this.K(1, a);
};
d.Hz = function(a) {
  this.K(2, a);
};
d.Gz = function(a) {
  this.K(3, a);
};
d.Kz = function(a) {
  this.K(4, a);
};
d.Qm = function(a) {
  this.K(5, a);
};
var Ji = function() {
  Z.apply(this);
};
u(Ji, Z);
var Ki = function() {
  Z.apply(this);
};
u(Ki, Z);
Ki.prototype.jf = function() {
  return this.aa(1);
};
Ki.prototype.$k = function(a) {
  this.K(1, a);
};
var Li = function() {
  Z.apply(this);
};
u(Li, Z);
Li.prototype.jf = function() {
  return this.aa(1);
};
Li.prototype.$k = function(a) {
  this.K(1, a);
};
Li.prototype.getMessage = function() {
  return this.aa(2);
};
Li.prototype.Lv = function(a) {
  this.K(2, a);
};
var Mi = function() {
  Z.apply(this);
};
u(Mi, Z);
d = Mi.prototype;
d.jf = function() {
  return this.aa(1);
};
d.$k = function(a) {
  this.K(1, a);
};
d.Tq = function() {
  return this.aa(2);
};
d.ny = function() {
  return this.sl(3);
};
d.Aa = function() {
  return this.aa(4);
};
d.Uq = function() {
  return this.bb(4);
};
var Ni = function() {
  Z.apply(this);
};
u(Ni, Z);
d = Ni.prototype;
d.getHeader = function() {
  return this.aa(1);
};
d.xr = function(a) {
  this.K(1, a);
};
d.uz = function() {
  return this.aa(2);
};
d.Az = function() {
  return this.bb(2);
};
d.tz = function() {
  return this.aa(3);
};
d.zz = function() {
  return this.bb(3);
};
d.wz = function() {
  return this.aa(4);
};
d.Bz = function() {
  return this.bb(4);
};
var Oi = function() {
  Z.apply(this);
};
u(Oi, Z);
Oi.prototype.yr = function(a) {
  this.K(1, a);
};
Oi.prototype.vz = function() {
  return this.aa(4);
};
Oi.prototype.Qm = function(a) {
  this.K(5, a);
};
var Pi = function() {
  Z.apply(this);
};
u(Pi, Z);
Pi.prototype.Aq = function() {
  return this.aa(1);
};
Pi.prototype.zg = function() {
  return this.aa(2);
};
Pi.prototype.yg = function(a) {
  this.K(2, a);
};
var Qi = function() {
  Z.apply(this);
};
u(Qi, Z);
Qi.prototype.Aa = function() {
  return this.aa(1);
};
Qi.prototype.Uq = function() {
  return this.bb(1);
};
Qi.prototype.Jy = function() {
  return this.aa(2);
};
Qi.prototype.Ky = function() {
  return this.bb(2);
};
$(Ci, {0:{name:"LcsMessage", Ya:"buzz.channel.LcsMessage"}, 1:{name:"session", B:9, type:String}, 2:{name:"message_id", B:9, type:String}, 3:{name:"data", B:9, type:String}});
$(Di, {0:{name:"Version", Ya:"buzz.channel.Version"}, 1:{name:"major_version", B:5, type:Number}, 2:{name:"minor_version", B:5, type:Number}});
$(Ei, {0:{name:"ProtocolVersion", Ya:"buzz.channel.ProtocolVersion"}, 1:{name:"version", B:11, type:Di}});
$(Fi, {0:{name:"ClientVersion", Ya:"buzz.channel.ClientVersion"}, 1:{name:"version", B:11, type:Di}, 2:{name:"platform", B:9, type:String}, 3:{name:"language", B:9, type:String}, 4:{name:"application_info", B:9, type:String}});
$(Gi, {0:{name:"SessionId", Ya:"buzz.channel.SessionId"}, 1:{name:"service_name", B:9, type:String}, 2:{name:"session_name", B:9, type:String}});
$(Hi, {0:{name:"ClientToServerMessage", Ya:"buzz.channel.ClientToServerMessage"}, 1:{name:"header", B:11, type:Ii}, 2:{name:"init_endpoint_message", B:11, type:Ji}, 3:{name:"init_session_message", B:11, type:Ki}, 4:{name:"client_data_message", B:11, type:Li}, 5:{name:"send_on_disconnect_message", B:11, type:Li}});
$(Ii, {0:{name:"ClientHeader", Ya:"buzz.channel.ClientHeader"}, 1:{name:"protocol_version", B:11, type:Ei}, 2:{name:"client_version", B:11, type:Fi}, 3:{name:"client_time_ms", B:3, type:Number}, 4:{name:"max_known_server_time_ms", B:3, type:Number}, 5:{name:"message_id", B:9, type:String}});
$(Ji, {0:{name:"InitEndpointMessage", Ya:"buzz.channel.InitEndpointMessage"}});
$(Ki, {0:{name:"InitSessionMessage", Ya:"buzz.channel.InitSessionMessage"}, 1:{name:"session_id", B:11, type:Gi}});
$(Li, {0:{name:"DataMessage", Ya:"buzz.channel.DataMessage"}, 1:{name:"session_id", B:11, type:Gi}, 2:{name:"message", B:9, type:String}});
$(Mi, {0:{name:"SessionStatusMessage", Ya:"buzz.channel.SessionStatusMessage"}, 1:{name:"session_id", B:11, type:Gi}, 2:{name:"address", B:9, type:String}, 3:{name:"is_broadcast_to_user", B:8, type:Boolean}, 4:{name:"status", B:11, type:Pi}});
$(Ni, {0:{name:"ServerToClientMessage", Ya:"buzz.channel.ServerToClientMessage"}, 1:{name:"header", B:11, type:Oi}, 2:{name:"server_data_message", B:11, type:Li}, 3:{name:"channel_status_message", B:11, type:Qi}, 4:{name:"session_status_message", B:11, type:Mi}});
$(Oi, {0:{name:"ServerHeader", Ya:"buzz.channel.ServerHeader"}, 1:{name:"protocol_version", B:11, type:Ei}, 4:{name:"server_time_ms", B:3, type:Number}, 5:{name:"message_id", B:9, type:String}});
$(Pi, {0:{name:"StatusP", Ya:"buzz.channel.StatusP"}, 1:{name:"code", B:5, type:Number}, 2:{name:"description", B:9, type:String}});
$(Qi, {0:{name:"ChannelStatusMessage", Ya:"buzz.channel.ChannelStatusMessage"}, 1:{name:"status", B:11, type:Pi}, 2:{name:"jid_resource", B:9, type:String}});
var Si = function(a, b) {
  var c = Array.prototype.slice.call(arguments), e = c.shift();
  if ("undefined" == typeof e) {
    throw Error("[goog.string.format] Template required");
  }
  return e.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, e, l, q, x, D, R) {
    if ("%" == x) {
      return "%";
    }
    var N = c.shift();
    if ("undefined" == typeof N) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = N;
    return Ri[x].apply(null, arguments);
  });
}, Ri = {s:function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + Array(c - a.length + 1).join(" ") : Array(c - a.length + 1).join(" ") + a;
}, f:function(a, b, c, e, f) {
  e = a.toString();
  isNaN(f) || "" == f || (e = a.toFixed(f));
  var g;
  g = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (e = g + e);
  if (isNaN(c) || e.length >= c) {
    return e;
  }
  e = isNaN(f) ? Math.abs(a).toString() : Math.abs(a).toFixed(f);
  a = c - e.length - g.length;
  return e = 0 <= b.indexOf("-", 0) ? g + e + Array(a + 1).join(" ") : g + Array(a + 1).join(0 <= b.indexOf("0", 0) ? "0" : " ") + e;
}, d:function(a, b, c, e, f, g, k, l) {
  return Ri.f(parseInt(a, 10), b, c, e, 0, g, k, l);
}};
Ri.i = Ri.d;
Ri.u = Ri.d;
var Ti = function(a) {
  this.a = G(a);
};
d = Ti.prototype;
d.log = function(a, b, c) {
  this.zK(arguments);
};
d.w = function(a, b) {
  this.tl(Mc, arguments);
};
d.e = function(a, b) {
  this.tl(Nc, arguments);
};
d.info = function(a, b) {
  this.tl(Oc, arguments);
};
d.ka = function(a, b) {
  this.tl(Qc, arguments);
};
d.zf = function(a) {
  return this.a.zf(a);
};
d.Uc = function(a) {
  this.a.Uc(a);
};
d.zK = function(a) {
  if (this.a.zf(a[0])) {
    var b = Array.prototype.slice.call(a);
    a = b.shift();
    b = Si.apply(null, b);
    this.a.log(a, b);
  }
};
d.tl = function(a, b) {
  if (this.a.zf(a)) {
    var c = Si.apply(null, b);
    this.a.log(a, c);
  }
};
var Ui = function() {
};
Ui.prototype.kv = function(a, b) {
  return a.Yh() ? this.ce(b) : b;
};
Ui.prototype.mr = function(a, b) {
  var c = a.Uv();
  this.ex(c, b);
  v(c instanceof Z);
  return c;
};
Ui.prototype.Ov = function(a, b) {
  if (a.Yh()) {
    return b instanceof Z ? b : this.mr(a.mv(), b);
  }
  if (14 == a.Mc() || !a.OH()) {
    return b;
  }
  var c = a.hi();
  if (c === String) {
    if (ga(b)) {
      return String(b);
    }
  } else {
    if (c === Number && r(b) && /^-?[0-9]+$/.test(b)) {
      return Number(b);
    }
  }
  return b;
};
var Vi = function(a) {
  this.Wu = a;
};
u(Vi, Ui);
Vi.prototype.ce = function(a) {
  for (var b = a.ta().Mh(), c = {}, e = 0;e < b.length;e++) {
    var f = b[e], g = 1 == this.Wu ? f.getName() : f.Gb();
    if (a.nd(f)) {
      if (f.Rb()) {
        var k = [];
        c[g] = k;
        for (g = 0;g < a.Qn(f);g++) {
          k.push(this.kv(f, a.get(f, g)));
        }
      } else {
        c[g] = this.kv(f, a.get(f));
      }
    }
  }
  a.cv(function(a, b) {
    c[a] = b;
  });
  return c;
};
Vi.prototype.ex = function(a, b) {
  var c = a.ta(), e;
  for (e in b) {
    var f, g = b[e], k = !/[^0-9]/.test(e);
    k ? f = c.KG(e) : (v(1 == this.Wu), f = c.Mn(e));
    if (f) {
      if (f.Rb()) {
        for (v(p(g)), k = 0;k < g.length;k++) {
          a.add(f, this.Ov(f, g[k]));
        }
      } else {
        v(!p(g)), a.set(f, this.Ov(f, g));
      }
    } else {
      k ? a.MG(Number(e), g) : v(f);
    }
  }
};
var Wi = function(a, b) {
  this.zk = !!a;
  this.ww = !!b;
};
u(Wi, Ui);
d = Wi.prototype;
d.ex = function(a, b) {
  a.ta();
  var c = new Xi;
  return c.parse(a, b.toString(), this.zk) ? null : c.getError();
};
d.ce = function(a) {
  var b = new Yi;
  this.gp(a, b);
  return b.toString();
};
d.gp = function(a, b) {
  var c = a.ta().Mh();
  z(c, function(c) {
    this.wH(a, c, b);
  }, this);
  a.cv(function(a, c) {
    this.Vo(a, c, b);
  }, this);
};
d.Vo = function(a, b, c) {
  if (null != b) {
    if (p(b)) {
      z(b, function(b) {
        this.Vo(a, b, c);
      }, this);
    } else {
      if (ia(b)) {
        c.append(a);
        c.append(" {");
        c.al();
        c.Pv();
        if (b instanceof Z) {
          this.gp(b, c);
        } else {
          for (var e in b) {
            var f = Na(e);
            v(isFinite(f) && 0 == f % 1);
            this.Vo(f, b[e], c);
          }
        }
        c.Mv();
        c.append("}");
      } else {
        r(b) && (b = Ia(b)), c.append(a), c.append(": "), c.append(b.toString());
      }
      c.al();
    }
  }
};
d.nH = function(a, b, c) {
  switch(b.Mc()) {
    case 1:
    ;
    case 2:
    ;
    case 3:
    ;
    case 4:
    ;
    case 5:
    ;
    case 13:
    ;
    case 6:
    ;
    case 7:
    ;
    case 8:
    ;
    case 15:
    ;
    case 16:
    ;
    case 17:
    ;
    case 18:
      c.append(a);
      break;
    case 12:
    ;
    case 9:
      a = Ia(a.toString());
      c.append(a);
      break;
    case 14:
      if (!this.ww) {
        var e = !1;
        Fb(b.hi(), function(b, g) {
          b == a && (c.append(g), e = !0);
        });
      }
      e && !this.ww || c.append(a.toString());
      break;
    case 10:
    ;
    case 11:
      this.gp(a, c);
  }
};
d.wH = function(a, b, c) {
  if (a.nd(b)) {
    for (var e = a.Qn(b), f = 0;f < e;++f) {
      c.append(b.getName());
      11 == b.Mc() || 10 == b.Mc() ? (c.append(" {"), c.al(), c.Pv()) : c.append(": ");
      this.nH(a.get(b, f), b, c);
      if (11 == b.Mc() || 10 == b.Mc()) {
        c.Mv(), c.append("}");
      }
      c.al();
    }
  }
};
var Yi = function() {
  this.ng = 0;
  this.de = [];
  this.rp = !0;
};
d = Yi.prototype;
d.toString = function() {
  return this.de.join("");
};
d.Pv = function() {
  this.ng += 2;
};
d.Mv = function() {
  this.ng -= 2;
  v(0 <= this.ng);
};
d.append = function(a) {
  if (this.rp) {
    for (var b = 0;b < this.ng;++b) {
      this.de.push(" ");
    }
    this.rp = !1;
  }
  this.de.push(a.toString());
};
d.al = function() {
  this.de.push("\n");
  this.rp = !0;
};
var $i = function(a, b) {
  this.mI = !!b;
  this.nI = a;
  this.mi = 0;
  this.qp = a;
  this.kp = {type:Zi, value:null};
};
$i.prototype.getCurrent = function() {
  return this.kp;
};
var Zi = /---end---/, aj = /^-?[a-zA-Z][a-zA-Z0-9_]*/, bj = /^(0x[0-9a-f]+)|(([-])?[0-9][0-9]*(\.?[0-9]+)?([f])?)/, cj = /^"([^"\\]|\\.)*"/, dj = /^\s/, ej = {nL:Zi, rL:aj, EL:bj, lL:/^#.*/, FL:/^{/, eL:/^}/, HL:/^</, gL:/^>/, GL:/^\[/, fL:/^\]/, WL:cj, jL:/^:/, kL:/^,/, VL:/^;/, eM:dj};
$i.prototype.next = function() {
  for (;this.zJ();) {
    if (this.getCurrent().type != dj || !this.mI) {
      return!0;
    }
  }
  this.kp = {type:Zi, value:null};
  return!1;
};
$i.prototype.zJ = function() {
  if (this.mi >= this.nI.length) {
    return!1;
  }
  var a = this.qp, b = null;
  Fb(ej, function(c) {
    if (!b && c != Zi) {
      var e = c.exec(a);
      e && 0 == e.index && (b = {type:c, value:e[0]});
    }
  });
  b && (this.kp = b, this.mi += b.value.length, this.qp = this.qp.substring(b.value.length));
  return!!b;
};
var Xi = function() {
  this.rd = this.Xa = null;
  this.zk = !1;
};
d = Xi.prototype;
d.parse = function(a, b, c) {
  this.Xa = null;
  this.zk = !!c;
  this.rd = new $i(b, !0);
  this.rd.next();
  return this.Uk(a, "");
};
d.getError = function() {
  return this.Xa;
};
d.ob = function(a) {
  this.Xa = a;
};
d.Uk = function(a, b) {
  for (;!this.fp(">") && !this.fp("}") && !this.Xk(Zi);) {
    if (!this.NH(a)) {
      return!1;
    }
  }
  if (b) {
    if (!this.Zh(b)) {
      return!1;
    }
  } else {
    this.Xk(Zi) || this.ob("Expected END token");
  }
  return!0;
};
d.Iu = function(a, b) {
  var c = this.MI(b);
  if (null === c) {
    return!1;
  }
  b.Rb() ? a.add(b, c) : a.set(b, c);
  return!0;
};
var fj = function(a) {
  a = Aa(a, ".") ? parseFloat(a) : Na(a);
  v(!isNaN(a));
  v(isFinite(a));
  return a;
};
d = Xi.prototype;
d.MI = function(a) {
  switch(a.Mc()) {
    case 1:
    ;
    case 2:
      if (a = this.Hk()) {
        if (a = /^-?inf(?:inity)?f?$/i.test(a) ? Infinity * (0 == a.lastIndexOf("-", 0) ? -1 : 1) : /^nanf?$/i.test(a) ? NaN : null, null != a) {
          return a;
        }
      }
    ;
    case 5:
    ;
    case 13:
    ;
    case 7:
    ;
    case 15:
    ;
    case 17:
      var b = this.ap();
      return b ? fj(b) : null;
    case 3:
    ;
    case 4:
    ;
    case 6:
    ;
    case 16:
    ;
    case 18:
      return(b = this.ap()) ? a.hi() == Number ? fj(b) : b : null;
    case 8:
      a = this.Hk();
      if (!a) {
        return null;
      }
      switch(a) {
        case "true":
          return!0;
        case "false":
          return!1;
        default:
          return this.ob("Unknown type for bool: " + a), null;
      }
    ;
    case 14:
      if (this.Xk(bj)) {
        return(b = this.ap()) ? fj(b) : null;
      }
      b = this.Hk();
      if (!b) {
        return null;
      }
      a = a.hi()[b];
      return null == a ? (this.ob("Unknown enum value: " + b), null) : a;
    case 12:
    ;
    case 9:
      return this.QG();
  }
};
d.UE = function(a, b) {
  var c = "";
  if (this.Wb("<")) {
    c = ">";
  } else {
    if (!this.Zh("{")) {
      return!1;
    }
    c = "}";
  }
  var e = b.mv().Uv();
  if (!this.Uk(e, c)) {
    return!1;
  }
  b.Rb() ? a.add(b, e) : a.set(b, e);
  return!0;
};
d.VE = function() {
  this.Wb(":");
  if (this.Wb("[")) {
    for (;;) {
      this.rd.next();
      if (this.Wb("]")) {
        break;
      }
      if (!this.Zh(",")) {
        return!1;
      }
    }
    return!0;
  }
  if (this.Wb("<")) {
    return this.Uk(null, ">");
  }
  if (this.Wb("{")) {
    return this.Uk(null, "}");
  }
  this.rd.next();
  return!0;
};
d.NH = function(a) {
  var b = this.Hk();
  if (!b) {
    return this.ob("Missing field name"), !1;
  }
  var c = null;
  a && (c = a.ta().Mn(b.toString()));
  if (null == c) {
    if (this.zk) {
      return this.VE();
    }
    this.ob("Unknown field: " + b);
    return!1;
  }
  if (11 == c.Mc() || 10 == c.Mc()) {
    if (this.Wb(":"), !this.UE(a, c)) {
      return!1;
    }
  } else {
    if (!this.Zh(":")) {
      return!1;
    }
    if (c.Rb() && this.Wb("[")) {
      for (;;) {
        if (!this.Iu(a, c)) {
          return!1;
        }
        if (this.Wb("]")) {
          break;
        }
        if (!this.Zh(",")) {
          return!1;
        }
      }
    } else {
      if (!this.Iu(a, c)) {
        return!1;
      }
    }
  }
  this.Wb(",") || this.Wb(";");
  return!0;
};
d.Wb = function(a) {
  return this.fp(a) ? (this.rd.next(), !0) : !1;
};
d.Hp = function(a) {
  if (!this.Xk(a)) {
    return this.ob("Expected token type: " + a), null;
  }
  a = this.rd.getCurrent().value;
  this.rd.next();
  return a;
};
d.Hk = function() {
  return this.Hp(aj);
};
d.ap = function() {
  return this.Hp(bj);
};
d.QG = function() {
  var a = this.Hp(cj);
  return a ? Pf(a).toString() : null;
};
d.Zh = function(a) {
  return this.Wb(a) ? !0 : (this.ob('Expected token "' + a + '"'), !1);
};
d.fp = function(a) {
  return this.rd.getCurrent().value == a;
};
d.Xk = function(a) {
  return this.rd.getCurrent().type == a;
};
var gj = new Vi, hj = new Wi, ij = function(a) {
  a = gj.ce(a);
  return Sf(a);
};
try {
  var jj = window.JSON.parse;
} catch (kj) {
  jj = Pf;
}
Z.prototype.toString = function() {
  return hj.ce(this);
};
var lj = function(a) {
  this.n = a;
};
lj.prototype.re = function(a) {
  var b = a.ta(), c = this.uD()[b.getName()];
  v(c, "no validator specification for %s", b.no());
  for (var e = b.Mh(), f = 0;f < e.length;++f) {
    v(e[f].getName() in c, "field %s unspecified in %s", e[f].getName(), b.no());
  }
  for (var g in c) {
    var e = c[g], k = b.Mn(g);
    v(k instanceof Ai, "no field descriptor for %s in %s", g, b.no());
    for (f = 0;f < e.length;++f) {
      if (!e[f](k, a)) {
        return!1;
      }
      for (var l = 0;l < a.Qn(k);++l) {
        var q = a.get(k, l);
        if (q instanceof Z && !this.re(q)) {
          return this.n.w("field %s (index %d) failed validation in %s", g, l, a), !1;
        }
      }
    }
  }
  return!0;
};
lj.prototype.required = function(a, b) {
  var c = b.nd(a);
  c || this.n.w("required field %s missing from %s", a.getName(), b);
  return c;
};
lj.prototype.jG = function(a, b, c) {
  var e = !c.nd(b) || c.get(b) >= a;
  e || this.n.w("%s must be greater than or equal to %d; was %d", b.getName(), a, c.get(b));
  return e;
};
lj.prototype.lG = function(a, b) {
  var c = !b.nd(a) || "" != b.get(a);
  c || this.n.w("%s must be non-empty", a.getName());
  return c;
};
var mj = function(a) {
  this.n = a;
  a = function() {
    return!0;
  };
  var b = s(this.required, this), c = s(this.jG, this, 0), e = s(this.lG, this);
  this.mG = {Version:{major_version:[b, c], minor_version:[b, c]}, ProtocolVersion:{version:[b]}, ClientVersion:{version:[b], platform:[b], language:[b, e], application_info:[b, e]}, ClientToServerMessage:{header:[b], init_endpoint_message:[a], init_session_message:[a], client_data_message:[a], send_on_disconnect_message:[a]}, ClientHeader:{protocol_version:[b], client_version:[b], client_time_ms:[b], max_known_server_time_ms:[b], message_id:[a]}, SessionId:{service_name:[b, e], session_name:[a]}, 
  InitEndpointMessage:{}, InitSessionMessage:{session_id:[b]}, SessionStatusMessage:{session_id:[b], address:[a, e], is_broadcast_to_user:[a], status:[a]}, DataMessage:{session_id:[b], message:[b, e]}, ServerToClientMessage:{header:[b], server_data_message:[a], channel_status_message:[a], session_status_message:[a]}, ServerHeader:{protocol_version:[b], server_time_ms:[b, c], message_id:[a, e]}, StatusP:{code:[b], description:[a]}, ChannelStatusMessage:{status:[b], jid_resource:[a]}};
};
u(mj, lj);
mj.prototype.uD = function() {
  return this.mG;
};
mj.prototype.Ez = function(a) {
  return this.re(a);
};
mj.prototype.Cz = function(a) {
  return this.re(a) ? !0 : !1;
};
var nj = function() {
  var a;
  return ec ? (a = /Windows NT ([0-9.]+)/, (a = a.exec(ic())) ? a[1] : "0") : dc ? (a = /10[_.][0-9_.]+/, (a = a.exec(ic())) ? a[0].replace(/_/g, ".") : "10") : gc ? (a = /Android\s+([^\);]+)(\)|;)/, (a = a.exec(ic())) ? a[1] : "") : hc || qc ? (a = /(?:iPhone|CPU)\s+OS\s+(\S+)/, (a = a.exec(ic())) ? a[1].replace(/_/g, ".") : "") : "";
}();
var oj = new Ei, pj = new Di;
pj.Jp(3);
pj.Kp(2);
oj.setVersion(pj);
var qj = new Di;
qj.Jp(3);
qj.Kp(2);
var rj = new Di;
rj.Jp(3);
rj.Kp(2);
var sj = function(a, b, c) {
  var e = new Fi;
  e.setVersion(rj);
  e.RJ(a);
  e.QJ(b);
  e.NJ(c);
  return e;
}, tj = function(a, b) {
  var c = new Gi;
  c.lK(a);
  null != b && c.mK(b);
  return c;
};
var uj = {APISIDHASH:1, SAPISIDHASH:2, OAuth:3}, vj = {1:"APISIDHASH", 2:"SAPISIDHASH", 3:"OAuth"};
var xj = function(a, b, c, e) {
  this.g = a;
  this.Ml = b;
  this.zi = e;
  a = Math.floor(1048576 * Math.random());
  this.Dd = c ? a + "_" + wj++ : null;
  this.tf = !1;
}, wj = 0;
xj.prototype.open = function() {
  v(!this.tf);
  this.tf = !0;
  this.g.bm(this);
};
xj.prototype.send = function(a) {
  v(this.tf);
  this.g.RE(this, a);
};
xj.prototype.my = function(a) {
  v(null == this.Dd);
  this.Dd = a;
};
var yj = function(a, b) {
  this.Cg = b;
  v(16 >= this.Cg.df().length);
  this.Ii = [];
  this.Ag = new B;
  this.Bi = new B;
  this.Y = null;
  this.a = new Ti("HangingGetChannel");
  this.rq = new mj(this.a);
  this.Wl = a;
  this.tf = !1;
  this.V = new Bi;
  this.V.mz(Be(self.location.href));
  this.V.Fd(2);
  var c = b.ef();
  null != c && this.V.ym(c);
  this.sy = this.Zl = 0;
  this.Zg = !1;
};
d = yj.prototype;
d.wt = function(a) {
  this.V.Fd(3);
  this.V.zo(a);
  this.Tm();
};
d.open = function() {
  v(!this.Zg);
  v(null == this.Y);
  this.V.Ji() && this.V.ef();
  this.Y = this.Cg.Qr(this);
  this.Tm();
  this.Y.start();
  this.a.info("Started a browser channel.");
};
d.close = function() {
  v(!this.Zg);
  null != this.Y && this.Y.close();
};
d.W = function() {
  this.close();
  this.Zg = !0;
};
d.Of = function() {
  return this.Zg;
};
d.Tm = function() {
  if (3 != this.V.jd()) {
    var a = this.Cg.IE(this.V.le());
    if (null != a) {
      var b = a.scheme, a = a.hash;
      a != this.V.Zb() && (b = v(uj[b], "unknown auth scheme: " + b), this.V.Fd(b), this.V.zo(a));
    } else {
      this.V.zo("");
    }
  }
  this.Y && this.Y.yo(this.V);
};
d.se = function() {
  this.Wo(new Ji);
};
d.yz = function(a) {
  var b = a.Aa().Aq();
  if (1 == b) {
    this.fr(!0);
    for (var c = this.Ag.R(), b = 0;b < c.length;++b) {
      this.bm(c[b]);
    }
    c = this.Bi.R();
    for (b = 0;b < c.length;++b) {
      this.bm(c[b]);
    }
    b = {};
    a.Ky() && (b.MK = a.Jy());
    this.Wl.Ly(this, b);
  } else {
    this.a.e("Received non-SUCCESS status %s from server", b);
  }
};
d.xz = function(a) {
  var b = a.jf(), c = b.mm();
  if (null == c) {
    this.a.e("Ignoring session-ready message without a session name");
  } else {
    var e = this.lq(b);
    if (null == e && this.Cg.Oq()) {
      for (var f = 0;f < this.Ii.length;++f) {
        var g = this.Ii[f], k = b.cj();
        if (g.Ml == k) {
          e = g;
          e.my(c);
          this.Ii.splice(f, 1);
          a.ny() ? this.Bi.Ja(k) ? this.a.e("Duplicate session for the same broadcast service (%s): this is not supported and will be ignored", k) : this.Bi.set(k, e) : this.Ag.set(e.Dd, e);
          break;
        }
      }
    }
    null == e ? this.a.e("Received address for unknown session: %s, %s", b, a.toString()) : a.Uq() && 1 != a.Aa().Aq() ? (this.a.e("Failed to initialize session with service %s: %s", b.cj(), a.Aa().zg()), e.zi.py ? e.zi.py(e, {LK:!1, description:a.Aa().zg()}) : this.a.info("onSessionError() not implemented by handler")) : (this.a.info("Address %s assigned for session %s with service %s", a.Tq(), b.mm(), b.cj()), e.zi.oy(e, a.Tq()));
  }
};
d.He = function(a) {
  for (var b = 0;b < a.length;b++) {
    var c = a[b].p, e = this.sz(c);
    if (null == e) {
      this.a.w("Cannot deserialize s2c message: %s", c);
    } else {
      if (this.a.ka("Received server message: %s", e), this.rq.Cz(e)) {
        if (c = e.getHeader(), this.Zl = Math.max(this.Zl, c.vz()), e.zz() && this.yz(e.tz()), e.Bz() && (c = e.wz(), v(null != c), this.xz(c)), e.Az()) {
          var c = e.uz(), f = c.jf(), g = this.lq(f);
          null == g ? this.a.info("Received message for unknown session: %s, %s", f, e) : g.zi.im(g, c.getMessage());
        }
      } else {
        this.a.w("Received invalid server message: %s", e);
      }
    }
  }
};
d.Ad = function(a) {
  this.a.info("Error %s", a);
  this.Tm();
  this.Wl.onError(this, new yi(a));
};
d.Xc = function() {
  this.fr(!1);
  this.Wl.rJ(this);
};
d.fr = function(a) {
  this.tf = a;
};
d.GF = function(a, b) {
  v(!this.Zg);
  v(this.tf);
  var c = this.Cg.Oq(), e = new xj(this, a, !c, b);
  c ? this.Ii.push(e) : this.Ag.set(e.Dd, e);
  return e;
};
d.vj = function() {
  null != this.Y ? (this.a.info("Asking browser channel to reconnect now!"), this.Y.vj()) : this.a.info("Not asking browser channel to reconnect now because it does not exist yet!");
};
d.lq = function(a) {
  var b = this.Ag.get(a.mm(), null);
  null == b && (b = this.Bi.get(a.cj(), null));
  return b;
};
d.bm = function(a) {
  var b = a.Ml;
  a = a.Dd;
  var c = new Ki;
  c.$k(tj(b, a));
  this.Wo(c);
};
d.RE = function(a, b) {
  v(null != a.Dd);
  v(this.Ag.Ja(a.Dd));
  var c = a.Ml, e = a.Dd, f = new Li;
  f.$k(tj(c, e));
  f.Lv(b);
  this.Wo(f);
};
d.Wo = function(a) {
  var b = "c" + ++this.sy, c = t(), e = this.Zl, f = new Ii;
  f.yr(oj);
  f.Gz(c);
  f.Kz(e);
  f.Qm(b);
  f.Hz(sj(nj, "JS", "lcsclient"));
  b = new Hi;
  b.xr(f);
  a instanceof Ji ? b.Iz(a) : a instanceof Ki ? b.Jz(a) : a instanceof Li && b.Fz(a);
  this.rq.Ez(b) ? (a = {}, f = ij(b), a.p = f, this.Y.rj(a)) : this.a.w("Attempted to send invalid client message: %s", b.toString());
};
d.sz = function(a) {
  var b;
  t: {
    var c = Ni.ta();
    b = this.a;
    var e;
    try {
      e = jj(a);
    } catch (f) {
      b && b.info("Exception parsing json (%s): %s", a, f);
      b = null;
      break t;
    }
    a = gj.mr(c, e);
    null == a ? (b && b.e("Incoming msg is unparseable: %s", e), b = null) : b = a;
  }
  return b;
};
var zj = function(a, b, c) {
  v(0 < c);
  v(0 < b);
  this.pp = b;
  this.qI = c;
  this.rI = a;
  v(0 < this.pp);
  this.reset();
};
zj.prototype.reset = function() {
  this.mg = this.pp;
  this.Iw = !1;
};
zj.prototype.Ei = function() {
  var a = 0;
  if (this.Iw) {
    var a = Math.ceil(this.rI() * this.mg), b = this.pp * this.qI;
    this.mg <= b && (this.mg *= 2, this.mg > b && (this.mg = b));
  }
  this.Iw = !0;
  return a;
};
var Aj = function(a, b, c) {
  this.yb = "1";
  this.wc = a;
  c.Ji() && (this.Hi = c.ef());
  v(null != c.df());
  this.Ec = c;
  this.D = b;
  this.Cd = this.h = 0;
  this.a = new Ti("BrowserChannelImpl");
  this.Ci = new zj(Math.random, 1E4, 180);
  this.Ni = new zj(Math.random, 6E4, 30);
  this.Ni.Ei();
  this.V = new Bi;
  this.Tl = 5;
  this.qa = -1;
  this.Dg = !1;
};
u(Aj, xi);
d = Aj.prototype;
d.hf = function(a) {
  a != this.h && (this.h = a, this.Cd++);
};
d.yo = function(a) {
  var b = !this.V || this.V.Zb() !== a.Zb();
  this.V = a.clone();
  this.Hi && this.V.ym(this.Hi);
  a = {};
  Bj(this.V, {}, a);
  this.Y && this.Y.xc(a);
  this.Dg && b && (this.Dg = !1, this.vj());
};
d.start = function() {
  v(0 == this.h);
  this.hf(1);
  this.open(!1);
};
d.open = function(a) {
  if (1 != this.h) {
    this.a.info("Not opening since not closed (state = %s)", this.h);
  } else {
    this.hf(2);
    a = (a ? this.Ni : this.Ci).Ei() + this.Ec.qz();
    this.Ec.rz(0);
    var b = this.Cd;
    Q(function() {
      this.rr(b);
    }, a, this);
  }
};
d.vj = function() {
  switch(this.h) {
    case 1:
    ;
    case 2:
      0 < this.Tl ? (this.a.info("Opening immediately in response to user request"), this.Tl--, this.Dg = !1, this.rr(this.Cd)) : this.a.info("Ignoring immediate connect request open because budget exhausted");
      break;
    default:
      this.a.info("Ignoring request to open immediately because already open(ing)");
  }
};
d.rr = function(a) {
  v(this.Ec.df());
  if (this.Cd != a) {
    this.a.info("Not opening since state has changed (%s vs. %s)", a, this.Cd);
  } else {
    v(null == this.Y);
    this.hf(3);
    a = this.wc + "/cbp";
    var b = this.wc + "/bind";
    this.Y = new ri(this.yb);
    this.Y.hz(this);
    var c = {};
    c.ctype = this.Ec.df();
    this.Ec.gz() && (c.service = this.Ec.br());
    var e = {};
    Bj(this.V, c, e);
    this.Y.xc(e);
    this.Dg ? (this.a.info("Skipping connect because waiting for auth change."), this.Ad(this.Y, 2), this.Xc(this.Y)) : this.Y.connect(a, b, c);
  }
};
var Bj = function(a, b, c) {
  a.Ji() && (b.authuser = a.ef());
  if (a.TG()) {
    b = a.jd();
    var e = v(vj[b], "Unknown auth scheme: " + b);
    c.Authorization = e + " " + a.Zb();
    3 != b && (c["X-Origin"] = a.le(), c["X-Goog-AuthUser"] = a.Sv());
  }
};
d = Aj.prototype;
d.close = function() {
  this.hf(1);
  null != this.Y && this.Y.disconnect();
};
d.rj = function(a) {
  null != this.Y && this.Y.rj(a);
};
d.se = function(a) {
  v(a == this.Y);
  this.hf(4);
  this.Ni.reset();
  this.Ni.Ei();
  var b = this.Cd;
  Q(function() {
    this.Cd != b ? this.a.info("Not resetting delay generator because state changed (%d vs. %d)", b, this.Cd) : (this.Ci.reset(), this.Tl = 5);
  }, 3E5, this);
  this.D.se();
};
d.He = function(a, b) {
  v(a == this.Y);
  this.D.He(b);
};
d.Ad = function(a, b) {
  v(a == this.Y);
  this.qa = a.Gc();
  this.D.Ad(b);
};
d.Xc = function(a) {
  v(a == this.Y);
  a = this.h;
  this.hf(1);
  if (4 == a || 3 == a) {
    a = !1;
    switch(this.qa) {
      case 401:
        this.Dg = !0;
        break;
      case 403:
        a = !0;
    }
    this.open(a);
  }
  this.qa = -1;
  this.Y = null;
  this.D.Xc();
};
var Cj = function(a, b, c, e, f) {
  ei.call(this, a, b, c, e, f);
};
u(Cj, ei);
Cj.prototype.Qr = function(a) {
  return new Aj(this.Xw(), a, this.Yw());
};
var Dj = function(a, b, c) {
  this.eG = a;
  this.Tk = b;
  this.dG = c;
  this.Ci = new zj(Math.random, 5E3, 128);
  this.sb = null;
};
Dj.prototype.$r = function() {
  this.sb = new nh(this.eG);
  this.sb.iG(Ff(document, this.Tk));
  Q(this.hG, this.Ci.Ei() + 5E3, this);
  this.sb.connect(s(function() {
    v(this.sb.oa());
    this.dG(this.sb);
  }, this));
};
Dj.prototype.hG = function() {
  if (!this.sb.oa()) {
    this.sb.close();
    for (var a = Jf(Ff(document, this.Tk)), b = 0;b < a.length;++b) {
      If(a[b]);
    }
    this.$r();
  }
};
var Ej = function(a, b, c, e) {
  this.$g = a;
  this.Pz = b;
  this.Ec = e;
  this.D = c;
  this.V = null;
};
d = Ej.prototype;
d.pF = function() {
  return null != this.V && 3 == this.V.jd();
};
d.onConnect = function() {
  this.dw().info("Cross-iframe rpc mechanism ready; opening browser channel");
  this.V && this.yo(this.V);
  this.bl("s", []);
};
d.WA = function() {
  var a = new W(this.$g), b = ij(this.Ec);
  a.ca("cfg", b);
  a.ca("ctype", this.Ec.df());
  (b = this.Ec.br()) && a.ca("service", b);
  this.pF() && a.ca("oauth_token", this.V.Zb());
  return a.toString();
};
d.JI = function() {
  this.ig("cha", s(this.He, this));
  this.ig("co", s(this.se, this));
  this.ig("cc", s(this.Xc, this));
  this.ig("ce", s(this.Ad, this));
};
d.close = function() {
};
d.yo = function(a) {
  this.V = a;
  a = gj.ce(this.V);
  this.bl("uap", a);
};
d.rj = function(a) {
  this.bl("sm", a);
};
d.vj = function() {
  this.bl("tcn", []);
};
d.se = function() {
  this.D.se();
};
d.He = function(a) {
  this.D.He(a);
};
d.Xc = function() {
  this.D.Xc();
};
d.Ad = function(a) {
  this.D.Ad(a);
};
var Fj = function(a, b, c, e) {
  Ej.call(this, a, b, c, e);
  this.sb = null;
  this.a = new Ti("XpcBrowserChannelClient");
};
u(Fj, Ej);
d = Fj.prototype;
d.XA = function(a) {
  this.sb = a;
  this.JI();
  this.onConnect();
};
d.start = function() {
  v(!this.sb);
  this.a.info("Attempting to connect cross-page channel");
  var a = this.WA(), b = {};
  b.pu = a;
  b.ppu = this.$g + "xpc_blank";
  b.lpu = this.$g + "xpc_blank";
  b.pru = this.$g + "xpc_relay";
  b.lru = this.$g + "xpc_relay";
  this.YA = new Dj(b, this.Pz, s(this.XA, this));
  this.YA.$r();
};
d.ig = function(a, b) {
  this.sb.ig(a, b, !0);
};
d.bl = function(a, b) {
  this.sb && this.sb.oa() && this.sb.send(a, b || []);
};
d.dw = function() {
  return this.a;
};
var Gj = function(a, b, c, e, f, g) {
  ei.call(this, a, b, c, f, g);
  this.Tk = e;
};
u(Gj, ei);
Gj.prototype.Qr = function(a) {
  return new Fj(this.Xw(), this.Tk, a, this.Yw());
};
var Hj = function(a, b) {
  v(b instanceof ei);
  return new yj(a, b);
};
var Ij = function(a, b) {
  Ue.call(this);
  this.U = b;
  this.n = G("cv.CloudChannel");
  this.Ac = a;
  this.Tf = this.Pd = null;
  this.Ac.HE(this.U, this);
};
u(Ij, Ue);
d = Ij.prototype;
d.wrap = function() {
  return new Eh(this);
};
d.Zt = function() {
  if (this.Tf) {
    return this.Tf;
  }
  var a = new I;
  !this.Pd || this.Pd.ED() ? (this.Tf = a, this.Ac.FD(this.U).Kb(s(function(a) {
    a = a.Ia();
    this.Hn(a);
    a ? this.Tf.ea(null) : this.Tf.Ma();
    this.Tf = null;
  }, this))) : a.ea(null);
  return a;
};
d.Hn = function(a) {
  this.Ac.oa() ? this.Pd && this.Pd.Zb() == a.Zb() || (a && (this.Pd = a), this.mb("connected")) : this.mb("disconnected");
};
d.Yj = function() {
  this.Ac.mH(this.U);
};
d.send = function(a) {
  "connected" == this.X() && this.Pd ? this.Zt().Kb(s(function() {
    this.Pd ? this.Ac.sendMessage(this.Pd.Zb(), a) : this.n.info("Error getting token for send.");
  }, this)) : (this.n.info("Not sending message since disconnected or no reply token."), this.n.ka("  the message is: " + a));
};
var Jj = function(a, b, c, e, f) {
  this.n = G("cv.CloudLcsChannel");
  this.Jb = a;
  this.qb = b;
  this.Fg = c;
  this.$s = e;
  this.Es = f ? f : m;
  this.Od = null;
  this.Ch = new B;
  this.g = null;
  this.$j = "";
  this.ct = new Te(354E4);
  M(this.ct, "tick", s(this.PC, this));
};
d = Jj.prototype;
d.Ly = function(a) {
  this.n.info("Channel opened.");
  this.$j || (this.n.info("Opening new session."), a.GF(this.qb.ZE, this).open());
};
d.rJ = function() {
  this.n.info("Channel closed.");
  this.Vt();
};
d.onError = function(a, b) {
  this.n.e("Channel error: " + b);
  this.Vt();
};
d.im = function(a, b) {
  this.n.ka("Received payload: " + b + ".");
  this.FF(b);
};
d.oy = function(a, b) {
  this.$j = b;
  this.Od.ea(null);
};
d.FD = function(a) {
  return this.Fg.connect(a, this.$j);
};
d.yy = function(a) {
  if (null != this.Od) {
    return this.Od;
  }
  this.Od = new I;
  var b = null, b = a ? new Gj(this.qb.ot + "/client-channel/client/client-js", this.qb.nt, !0, "lcsclient", void 0, void 0) : new Cj(this.qb.ot + "/client-channel/channel", this.qb.nt, !0, void 0, void 0);
  this.g = Hj(this, b);
  this.$s(s(function(a) {
    this.n.info("Opened browser channel.");
    this.g.wt(a);
    this.ct.start();
    this.g.open();
  }, this));
  return this.Od;
};
d.zy = function(a, b) {
  var c = new Ij(this, a);
  c.Zt();
  return b ? c : c.wrap();
};
d.HE = function(a, b) {
  this.Ch.set(a, b);
};
d.mH = function(a) {
  this.Ch.remove(a);
};
d.oa = function() {
  return!!this.Od && "success" == this.Od.X();
};
d.sendMessage = function(a, b) {
  if (this.Jb) {
    if (a) {
      var c = {from:this.Jb, body:b};
      this.n.ka("Sending message: " + JSON.stringify(c));
      this.Fg.vE(a, this.qb.GD, JSON.stringify(c));
    } else {
      this.n.info("Failed to send message due to channel token not set.");
    }
  } else {
    this.n.info("Dropping sent message for disabled channel");
  }
};
d.Vt = function() {
  this.$j = "";
  this.Od = this.g = null;
  for (var a = this.Ch.R(), b = 0;b < a.length;b++) {
    a[b].disconnect();
  }
  this.Ch.clear();
};
d.FF = function(a) {
  if (this.Jb) {
    try {
      var b = JSON.parse(a), c = b.authToken, e = JSON.parse(b.message), f = e.from, g = this.Ch.get(f);
      this.Es != m && (g ? c && g.Hn(new Zh(c)) : (this.n.info("Creating new logical channel for receiver."), g = new Ij(this, f), g.Hn(c ? new Zh(c) : null), this.Es(g.wrap())));
      e.body && (this.n.ka("Received message: " + JSON.stringify(e.body)), g.onMessage(e.body));
    } catch (k) {
      this.n.e("Error handling message: " + a);
    }
  } else {
    this.n.info("Dropping received message for disabled channel");
  }
};
d.PC = function() {
  this.$s(s(function(a) {
    this.g.wt(a);
  }, this));
};
var Kj = function(a, b) {
  this.a = G("cv.CloudRegistry");
  this.$c = a;
  this.Yg = b || new Yh(this.$c);
};
d = Kj.prototype;
d.Sq = function(a, b) {
  return ra(a) ? Ja("devices", "/", b) : Ja("devices", "/", a, "/", b);
};
d.sB = function(a) {
  Qe(this.Yg.zm(), s(function(a) {
    return this.$c.km("devices", "GET", {}, null, a.Ia());
  }, this)).Kb(s(this.uG, this, a));
};
d.uG = function(a, b) {
  var c = b.Ia(), e = c.response;
  if (200 != c.Ed.Aa() && 304 != c.Ed.Aa() || !e) {
    this.a.info("Failed to get cloud device list."), a([], !1);
  } else {
    var c = 0, e = e.resources, f = [];
    for (c in e) {
      var g, k = e[c], l = g = null, q = null, x = null, D = null;
      g = k.guid || null;
      var D = k.claimCode || null, R = k.properties;
      R && (l = R.manufacturer, q = R.model);
      (k = k.settings) && (x = k.displayName);
      g = new ud(g, l, q, x, D);
      g.KA() ? f.push(g) : this.a.info("Invalid cloud device retrieved");
    }
    a(f, !0);
  }
};
d.connect = function(a, b) {
  var c = new I, e = {};
  b && (e.lcsInfo = {lcsAddress:b});
  Qe(this.Yg.zm(), s(function(b) {
    return this.$c.km(this.Sq(a, "connect"), "POST", e, null, b.Ia());
  }, this)).Kb(s(function(a) {
    (a = a.Ia().response) && a.token && a.token.authToken && a.token.expirationSecs ? c.ea(new Zh(a.token.authToken, a.token.expirationSecs)) : c.ea(null);
  }, this));
  return c;
};
d.vE = function(a, b, c) {
  var e = new I;
  if (!a) {
    return e.Ma(), this.a.e("Send failed since device channel token was not set"), e;
  }
  a = {authToken:a, message:c};
  var f = new Yf;
  f.set("key", b);
  this.$c.km(this.Sq("", "send"), "POST", a, f).Kb(s(function(a) {
    a = a.Ia().Ed.Aa();
    204 != a && 200 != a ? (this.a.e("Send of message (" + c + ") failed with status: " + a), e.Ma()) : e.ea(null);
  }, this));
  return e;
};
var Lj = function(a, b, c, e, f, g, k) {
  this.action = a;
  this.activityType = b;
  this.activityId = c;
  this.initParams = e;
  this.senderId = f;
  this.receiverId = g;
  this.disconnectPolicy = k || "stop";
};
var Mj = function() {
  this.a = G("cv.Retry");
  this.Wr = this.jh = 0;
  this.Vr = 1;
  this.mh = 0;
  this.$m = void 0;
  this.xj = this.wb = this.Xm = null;
  this.zj = 0;
  this.Aj = !1;
  this.an = this.nh = null;
};
u(Mj, K);
d = Mj.prototype;
d.start = function(a, b, c) {
  if (this.vw()) {
    throw Error("Cannot call Retry.start more than once.");
  }
  if (!this.jh) {
    throw Error("Cannot use AsyncRetry without setting a nonzero retry delay.");
  }
  this.Xm = a;
  this.TH = b || null;
  this.xj = c || null;
  Q(s(this.Bv, this), 0);
};
d.Bv = function() {
  this.nh = null;
  if (this.mh && this.zj >= this.mh) {
    this.abort(this.$m);
  } else {
    if (!this.Aj) {
      this.an = new Nj(this, this.zj);
      this.zj++;
      try {
        this.Xm(this.an);
      } finally {
        this.Aj || (this.nh = Q(s(this.Bv, this), this.jh)), this.SG();
      }
    }
  }
};
d.SG = function() {
  var a = this.jh * this.Vr;
  this.Wr && (a = Math.min(a, this.Wr));
  this.jh = a;
};
d.xl = function(a, b) {
  this.mh = a;
  this.$m = b;
  return this;
};
d.ri = function(a) {
  v(0 < a);
  this.jh = a;
  return this;
};
d.Qp = function(a) {
  v(1 <= a);
  this.Vr = a;
  return this;
};
d.FI = function(a) {
  if (!this.vw()) {
    throw Error("Not started yet.");
  }
  this.Uw(this.TH, a);
};
d.abort = function(a) {
  this.Uw(this.xj, a);
};
d.EI = function(a) {
  a === this.an && this.mh && (this.zj < this.mh || this.abort(this.$m));
};
d.Uw = function(a, b) {
  null != this.nh && (h.clearTimeout(this.nh), this.nh = null);
  this.Aj || (this.Aj = !0, a && a(b));
};
d.k = function() {
  Mj.q.k.call(this);
  this.abort();
};
d.vw = function() {
  return null != this.Xm;
};
var Nj = function(a, b) {
  this.mi = b;
  this.gg = a;
  this.kg = !1;
};
Nj.prototype.qg = function() {
  this.kg || (this.kg = !0, this.gg.EI(this));
};
Nj.prototype.ul = function(a) {
  this.kg || (this.kg = !0, this.gg.FI(a));
};
Nj.prototype.abort = function(a) {
  this.kg || (this.kg = !0, this.gg.abort(a));
};
Nj.prototype.am = function() {
  return this.mi;
};
var Oj = function() {
  return null != ic() && -1 != ic().indexOf("CrOS");
};
var Pj = function(a) {
  this.ia = a || "sender-" + Ka();
};
Pj.prototype.c = function() {
  return this.ia;
};
Pj.prototype.xd = function() {
  return this.ia;
};
var Qj = function() {
  this.a = G("cv.Setup");
  this.Pa = !1;
};
u(Qj, K);
Qj.prototype.A = function() {
  this.Pa ? this.a.info("Already been set up. Skipping.") : (this.vB(), this.Pa = !0);
};
var Rj = function(a) {
  return function() {
    a.A();
    a.OG();
  };
};
var Sj = function(a) {
  if ("undefined" != typeof DOMParser) {
    return(new DOMParser).parseFromString(a, "application/xml");
  }
  if ("undefined" != typeof ActiveXObject) {
    var b = new ActiveXObject("MSXML2.DOMDocument");
    if (b) {
      b.resolveExternals = !1;
      b.validateOnParse = !1;
      try {
        b.setProperty("ProhibitDTD", !0), b.setProperty("MaxXMLSize", 2048), b.setProperty("MaxElementDepth", 256);
      } catch (c) {
      }
    }
    b.loadXML(a);
    return b;
  }
  throw Error("Your browser does not support loading xml documents");
};
var Uj = function(a) {
  this.ah = a;
  this.Ob = Tj[1];
  this.a = G("cv.SetupApi");
  this.t = new P(this);
  this.uA();
};
u(Uj, K);
var Tj = ["3", "4"];
d = Uj.prototype;
d.setVersion = function(a) {
  qb(Tj, a) ? this.Ob = a : this.a.w("Unsupported version: " + a);
};
d.wl = function(a) {
  this.ah.Ie(a);
};
d.RF = function(a) {
  var b = this.ah.clone();
  b.Je(a);
  return b;
};
d.OB = function(a, b) {
  if ("scan_ssid" in a) {
    var c = a.scan_ssid;
    if (0 != c && 1 != c) {
      return this.a.w("connectWifi called with invalid scan_ssid = " + c.toString()), function() {
      };
    }
  }
  return this.Kd("/setup/connect_wifi", "POST", b, a);
};
d.qi = function(a, b, c) {
  if ((b || c) && 0 < Ma("4", this.Ob)) {
    return this.a.w("eurekaInfo with optional parameters is not supportedon " + this.Ob), function() {
    };
  }
  var e = b && qb(b, "sign"), f = [];
  if (b) {
    for (var g = ["sign", "detail"], k = 0;k < b.length;++k) {
      if (!qb(g, b[k])) {
        return this.a.w("Invalid options value: " + b[k]), function() {
        };
      }
    }
    f.push("options=" + b.join(","));
  }
  c && f.push("nonce=" + c);
  return this.Kd("/setup/eureka_info", "GET", a, null, 0 < f.length ? new Yf(f.join("&")) : null, e ? 4E4 : null, e ? 2 : null);
};
d.yA = function(a, b) {
  var c = ["now", "fdr", "ota", "idle"];
  0 >= Ma("4", this.Ob) && c.push("set recovery");
  return qb(c, a) ? this.Kd("/setup/reboot", "POST", b, {params:a}) : (this.a.w("Invalid params value: " + a), function() {
  });
};
d.wD = function(a) {
  return 0 < Ma("4", this.Ob) ? (this.a.w("saveWifi is not supported on version " + this.Ob), function() {
  }) : this.Kd("/setup/save_wifi", "POST", a, void 0, void 0, 2E4, 2);
};
d.ky = function(a) {
  return this.Kd("/setup/scan_results", "GET", a);
};
d.oA = function(a) {
  return this.Kd("/setup/scan_wifi", "POST", a, void 0, void 0, void 0, 1);
};
d.vy = function(a, b) {
  return this.Kd("/setup/set_eureka_info", "POST", b, a);
};
d.VB = function(a) {
  return this.Kd("/setup/supported_timezones", "GET", a, null, null, 2E4, 2);
};
d.k = function() {
  Fb(this.jk, function(a) {
    a.W();
  });
  this.t.W();
  Uj.q.k.call(this);
};
d.uA = function() {
  this.jk = {};
  this.vJ = 1;
};
d.hK = function(a) {
  if (!this.jk[a]) {
    var b = new Rh;
    b.Wk(a);
    this.jk[a] = b;
  }
  return this.jk[a];
};
d.Ev = function(a, b, c, e, f, g, k) {
  var l = "" + this.vJ++;
  k = k || 4;
  var q = this.hK(g || 1E4);
  q.send(l, a, b, c, e, void 0, f, k - 1);
  return s(function() {
    q.abort(l, !0);
  }, this);
};
d.Kd = function(a, b, c, e, f, g, k) {
  var l = function(a) {
    var e = null;
    a.target.ja() && "GET" == b && (e = a.target.Xb(), e = JSON.parse(e));
    c(e, a.target);
  }, q = this.ah.clone();
  q.Je(a);
  f && q.Pf(f);
  if ("GET" == b) {
    return this.Ev(q.toString(), b, null, null, l, g, k);
  }
  if ("POST" == b) {
    return this.Ev(q.toString(), b, JSON.stringify(e), {"Content-Type":"application/json"}, l, g, k);
  }
};
var Vj = [[0xfa8fca300000, 0xfa8fca3fffff], [0xfa8fca500000, 0xfa8fca9fffff], [111971074048, 111971139583]], Wj = ["Eureka Dongle", "Chromekey"], Xj = function(a) {
  if (!(a && "WiFi" in a && "BSSID" in a.WiFi)) {
    return!1;
  }
  var b = function(a) {
    a = a.replace(/:/g, "").toLowerCase();
    return 12 != a.length ? -1 : parseInt(a, 16);
  }(a.WiFi.BSSID);
  return!!A(Vj, function(a) {
    return b >= a[0] && b <= a[1];
  });
}, Yj = function(a) {
  return a && a.wpa_auth ? 1 != a.wpa_auth : !1;
}, Zj = function(a) {
  return 21 == a || 31 == a || 11 == a;
}, bk = function(a, b) {
  ak(a.deviceDescriptionUrl, "device_description", b);
}, ck = function(a) {
  var b = Sj(a);
  if (!b) {
    return null;
  }
  var c = b.querySelector("root > device > manufacturer");
  a = b.querySelector("root > device > modelName");
  if (!c || !a) {
    return null;
  }
  c = Nf(c);
  a = Nf(a);
  a = "Google Inc." == c && qb(Wj, a);
  var e = b.querySelector("root > URLBase"), c = b.querySelector("root > device > friendlyName"), b = b.querySelector("root > device > UDN");
  if (!e || !c || !b) {
    return null;
  }
  e = Nf(e);
  e = fg(e).Dc();
  c = Nf(c);
  b = Nf(b);
  return{name:c, ipAddress:e, udn:b, isChromecast:a};
}, dk = function(a, b, c) {
  ak(a + (pa(a, "/") ? "ChromeCast" : "/ChromeCast"), "app_info", function(a) {
    (a = a.target) && a.ja() ? b() : c();
  });
}, ak = function(a, b, c) {
  b = new th;
  b.nv("text");
  b.Wk(7E3);
  pe(b, ["complete", "timeout"], c);
  b.send(new W(a), "GET");
};
var ek = function(a) {
  O.call(this);
  this.ud = a;
  this.a = G("cv.DongleDialMonitor");
  this.da = !1;
  this.ic = 0;
  this.Bf = [];
  this.eh = 0;
  this.rb = {};
  this.Om = [];
};
u(ek, O);
var fk = function(a) {
  L.call(this, "device-list-updated");
  this.Js = a;
};
u(fk, L);
d = ek.prototype;
d.start = function() {
  this.da ? this.a.info("Already started.") : (this.da = !0, this.Kr = s(this.Gd, this), this.ud.onDeviceList.addListener(this.Kr), this.Lr = s(this.v, this), this.ud.onError.addListener(this.Lr), this.refresh());
};
d.stop = function() {
  this.da ? (this.da = !1, this.ud.onDeviceList.removeListener(this.Kr), this.ud.onError.removeListener(this.Lr)) : this.a.info("Stopping, but not started.");
};
d.k = function() {
  ek.q.k.call(this);
  this.stop();
  Fb(this.rb, function(a) {
    a.Jd && clearTimeout(a.Jd);
  });
  this.rb = {};
};
d.refresh = function() {
  this.ud.discoverNow(s(function(a) {
    this.a.info("Discover now called with result " + a);
  }, this));
};
d.zl = function(a) {
  var b = Kb(this.rb, function(b) {
    return!!b.description && b.description.udn == a && 0 == b.status;
  });
  b && (tb(this.Bf, this.rb[b].description), this.bs(b));
  this.Om.push(a);
};
d.v = function(a) {
  this.a.info("Encountered dial error: " + a.code);
  this.Gd([]);
};
d.Gd = function(a) {
  this.ic++;
  this.eh = a.length;
  this.Bf = [];
  this.a.info("Got new dial device list: generation: " + this.ic + ", size: " + this.eh);
  0 == a.length ? this.Ym() : z(a, function(a) {
    this.nn(a, s(this.ln, this), s(this.uj, this));
  }, this);
  this.Om = [];
};
d.Ym = function() {
  0 < this.eh || (Ab(this.Bf, function(a, b) {
    return sa(a.name, b.name);
  }), this.a.info("Dispatch new device list generation: " + this.ic + " with " + this.Bf.length + " entries."), we(this, new fk(this.Bf)));
};
d.ln = function(a, b, c) {
  var e = this.rb[b];
  !e || e.Nm > a ? this.a.info("Description for " + b + " obsolete") : qb(this.Om, c.udn) ? (this.a.info("Ignoring invalidated description for: " + b), this.uj(a, b)) : (this.zA(b), e.description = c, e.status = 0, e.Zm != this.ic ? this.a.info("Cache entry refreshed, but the device is not part of the current generation.") : (this.a.info("Adding device to the list: " + b), --this.eh, this.Bf.push(c), this.Ym()));
};
d.uj = function(a, b) {
  var c = this.rb[b];
  !c || c.Nm > a ? this.a.info("Error for an obolete request for " + b) : (this.bs(b), c.Zm == this.ic && (this.a.info("Removing device from the current generation " + b), --this.eh, this.Ym()));
};
d.zA = function(a) {
  var b = this.rb[a];
  b && (b.Jd && clearTimeout(b.Jd), b.Jd = setTimeout(s(this.gI, this, a), 18E5));
};
d.bs = function(a) {
  var b = this.rb[a];
  b && (b.Jd && clearTimeout(b.Jd), Nb(this.rb, a));
};
d.gI = function(a) {
  var b = this.rb[a];
  b && (b.Jd = null, 0 == b.status && (this.a.info("Discarding device's cache entry as it expired " + a), Nb(this.rb, a)));
};
d.nn = function(a, b, c) {
  var e = this.JA(a);
  0 == e.status ? (v(e.description), b(this.ic, a.deviceLabel, e.description)) : 1 != e.status && (e.status = 1, e.Nm = this.ic, e = s(function(e, g, k) {
    var l = g = null;
    (k = k.target) && k.ja() && (g = ck(k.Xb()), l = k.getResponseHeader("Application-URL") || null);
    g && l ? (this.a.info("Got device description, verifying it supports ChromeCast"), dk(l, s(b, null, e, a.deviceLabel, g), s(c, null, e, a.deviceLabel))) : (this.a.info("Failed to get description or app url. Description: " + !!g + "; app url: " + !!l), c(e, a.deviceLabel));
  }, this), bk(a, s(e, null, this.ic, a.deviceLabel)));
};
d.JA = function(a) {
  this.rb[a.deviceLabel] || (this.rb[a.deviceLabel] = {status:2, configId:a.configId, Nm:this.ic, Zm:this.ic, Jd:null, description:null});
  var b = this.rb[a.deviceLabel];
  b.Zm = this.ic;
  a.configId && b.configId == a.configId || (b.configId = a.configId, b.status = 2);
  return b;
};
var gk = function(a) {
  O.call(this);
  this.G = a;
  this.dh = this.Wc = this.cm = null;
  this.Id = 0;
  this.va = {};
  this.Ra = "";
  this.Ae = void 0;
  this.Pa = !1;
  this.Xg = 0;
  this.a = G("cv.NetworkMonitor");
};
u(gk, O);
var hk = function(a) {
  L.call(this, "wifi-added");
  this.vi = a;
};
u(hk, L);
var ik = function(a) {
  L.call(this, "wifi-removed");
  this.Fl = a;
};
u(ik, L);
var kk = function(a) {
  L.call(this, "wifi-connected");
  this.vi = a;
};
u(kk, L);
var lk = function(a) {
  L.call(this, "wifi-disconnected");
  this.Fl = a;
};
u(lk, L);
var mk = function() {
  L.call(this, "no-wifi");
};
u(mk, L);
d = gk.prototype;
d.k = function() {
  gk.q.k.call(this);
  this.G.onNetworkListChanged.removeListener(this.cm);
  this.G.onNetworksChanged.removeListener(this.Wc);
  this.Id = 0;
  this.vm();
};
d.start = function() {
  this.Wc = s(this.qm, this);
  this.G.onNetworksChanged.addListener(this.Wc);
  this.cm = s(this.Ur, this);
  this.G.onNetworkListChanged.addListener(this.cm);
  this.G.getVisibleNetworks("All", s(function(a) {
    this.Pa ? this.a.info("Monitor already initialized on getVisibleNetworks callback") : this.Ur(lb(a, function(a) {
      return a.GUID;
    }));
  }, this));
};
d.gs = function() {
  this.a.info("Remember " + this.Ra);
  this.Ae = this.Ra;
};
d.ar = function() {
  this.a.info("Clear remembered");
  this.Ae = void 0;
};
d.aq = function(a) {
  void 0 != this.Ae && this.Ra != this.Ae && (this.a.info("Reconnecting " + this.Ae), this.Ra && this.G.startDisconnect(this.Ra), this.Ae && this.G.startConnect(this.Ae));
  a && this.ar();
};
d.Hl = function() {
  return this.Ra;
};
d.Cq = function() {
  return this.Pa && 0 == this.Xg;
};
d.oq = function() {
  this.Id++;
  this.a.info("Rescan loop requested; request count: " + this.Id);
  this.vm();
};
d.jr = function() {
  0 < this.Id && (this.Id--, this.a.info("Rescan canceled; request count: " + this.Id));
  this.vm();
};
d.oz = function(a) {
  this.G.getVisibleNetworks("All", function(b) {
    b = kb(b, function(a) {
      return "Connected" == a.ConnectionState || "Connecting" == a.ConnectionState;
    });
    a(lb(b, function(a) {
      return a.Type;
    }));
  });
};
d.vm = function() {
  "requestNetworkScan" in this.G && (0 < this.Id && !this.dh ? (this.a.info("Starting scan interval"), this.G.requestNetworkScan(), this.dh = setInterval(s(function() {
    this.G.requestNetworkScan();
  }, this), 1E4)) : 0 >= this.Id && this.dh && (this.a.info("Cancelling scan interval"), clearInterval(this.dh), this.dh = null));
};
d.tA = function(a) {
  return(a = this.va[a]) && a.lc || null;
};
d.vl = function(a) {
  var b = [];
  Fb(this.va, function(c) {
    c.lc && a(c.lc) && b.push(c.lc);
  });
  return b;
};
d.Ur = function(a) {
  var b = {}, c = [];
  z(a, function(a) {
    a in this.va ? b[a] = this.va[a] : c.push({network:a, type:"added"});
  }, this);
  a = c.length;
  Fb(this.va, function(a, f) {
    f in b || 4 == a.status || c.push({network:f, type:"removed"});
  }, this);
  this.a.info("Network list changed: " + Sf(c));
  a += a - c.length;
  this.va = b;
  jb(c, function(a) {
    "added" == a.type ? this.HA(a.network) : "removed" == a.type && this.IA(a.network);
  }, this);
  if (a || !this.Pa) {
    this.Pa = !0, this.Xg += a, this.a.info("New network count: " + this.Xg), this.Gr();
  }
};
d.qm = function(a) {
  z(a, function(a) {
    this.va[a] && 4 != this.va[a].status && (this.Ra && this.Ra != a ? this.va[a].status = this.eH(this.va[a].status) : this.Zr(a));
  }, this);
};
d.HA = function(a) {
  this.va[a] = {lc:null, status:1};
  this.bn(a, s(this.dn, this));
};
d.bn = function(a, b) {
  var c = null;
  this.va[a] && this.va[a].lc && this.va[a].lc.Name && (c = this.va[a].lc.Name);
  var e = s(function(c) {
    this.G.getProperties(a, s(function(a) {
      a ? (a = Ob(a), a.Name = c, b(a)) : b(null);
    }, this));
  }, this);
  c ? e(c) : this.G.getVisibleNetworks("All", s(function(c) {
    (c = A(c, function(b) {
      return b.GUID == a;
    })) ? e(c.Name) : (this.a.info("Network not found among visible networks: " + a), b(null));
  }, this));
};
d.IA = function(a) {
  this.Tr(a);
  we(this, new ik(a));
};
d.Tr = function(a) {
  this.Ra == a && (this.a.e("Network disconnected: " + this.Ra), this.Ra = "", we(this, new lk(a)), this.Lz());
};
d.Ui = function(a) {
  this.a.info("Network connected " + a + "; currently connected: " + this.Ra);
  this.Ra || (this.Ra = a, we(this, new kk(this.va[a].lc)));
};
d.Gr = function() {
  this.Cq() && (this.a.e("No Wi-Fi detected."), we(this, new mk));
};
d.eH = function(a) {
  return 1 == a ? 2 : 3;
};
d.dn = function(a) {
  if (a) {
    var b = a.GUID, c = a.ConnectionState;
    if (b && this.va[b] && c && 4 != this.va[b].status) {
      if (a.WiFi) {
        var e = this.va[b], f = !e.lc;
        e.lc = a;
        f && we(this, new hk(a));
        1 == e.status && (e.status = 0);
        2 == e.status ? this.Ra && this.Ra != b ? e.status = 3 : (this.a.info("Refetching properties for " + b), e.status = 1, this.bn(b, s(this.dn, this))) : "Connected" == c ? this.Ui(b) : "Connecting" != c && this.Tr(b);
      } else {
        this.a.info("Detected non WiFi network: " + b), this.va[b].status = 4, this.Xg--, this.Gr();
      }
    }
  }
};
d.Zr = function(a) {
  var b = this.va[a];
  4 != b.status && (1 == b.status ? b.status = 2 : (b.status = 1, this.bn(a, s(this.dn, this))));
};
d.Lz = function() {
  if (!this.Ra) {
    var a = [];
    Fb(this.va, function(b, c) {
      3 == b.status ? a.push(c) : 0 == b.status && "Connected" == b.lc.ConnectionState && (this.a.info("Found new connected network synchronously: " + c), this.Ui(c));
    }, this);
    this.Ra || (this.a.info("Refresh networks to find a connected one: " + Sf(a)), z(a, function(a) {
      this.Zr(a);
    }, this));
  }
};
var nk = function() {
  O.call(this);
  this.a = G("cv.UserActionNotifier");
};
u(nk, O);
var ok = function() {
  L.call(this, "network-selection-shown");
};
u(ok, L);
nk.prototype.LC = function() {
  this.a.info("Dispatching network-selection-shown");
  we(this, new ok);
};
var pk = function(a, b, c, e, f, g) {
  this.Xe = a;
  this.ba = b;
  this.I = c;
  this.Ex = e;
  this.Fx = f;
  this.v = g;
  this.Gl = this.l = this.da = !1;
  this.jq = !0;
  this.a = G("cv.ChromekeyAvailableNetworkScanner");
  this.fa = this.Pg = null;
};
d = pk.prototype;
d.start = function() {
  this.da || this.l || (this.a.info("Start task."), this.Pg = s(this.Zz, this), M(this.Xe, "network-selection-shown", this.Pg), this.Ll());
};
d.Bc = function(a) {
  return "flow-select-network" != a && "flow-edit-device" != a;
};
d.cancel = function() {
  this.l || (this.a.info("Cancel task"), this.l = !0, this.fa && (this.fa(), this.fa = null), this.Pg && (qe(this.Xe, "network-selection-shown", this.Pg), this.Pg = null));
};
d.Zz = function() {
  this.IK();
};
d.IK = function() {
  this.l || (this.da ? (this.a.info("Schedule rescan."), this.Gl = !0) : this.Ll());
};
d.Ll = function() {
  this.da = !0;
  this.a.info("Scan wifis");
  this.fa = this.ba.oA(s(this.nA, this));
};
d.nA = function(a, b) {
  this.l || (b.ja() || this.a.e("Scan wifi failed. Wifi list may be stale."), this.fa = this.ba.ky(s(this.jy, this)));
};
d.jy = function(a, b) {
  if (!this.l) {
    if (this.a.info("Got scan results."), this.fa = null, b.ja()) {
      var c = kb(a, function(a) {
        return this.Ex(a);
      }, this), e = lb(c, function(a) {
        return{name:a.ssid, value:a};
      }, this), c = pb(c, function(a) {
        return a.ssid == this.I.ssid;
      }, this);
      this.Fx(e, c);
      this.jq = !1;
      setTimeout(s(function() {
        this.l || (this.a.info("Allowing further scan-wifi requests."), this.da = !1, this.Gl && (this.Gl = !1, this.Ll()));
      }, this), 3E3);
    } else {
      this.a.e("Scan results request failed."), this.jq && (this.a.e("Report error on the first scan results failure."), this.cancel(), this.v());
    }
  }
};
var qk = function(a, b, c) {
  this.o = a;
  this.Di = b;
  this.xi = c;
  this.da = this.l = !1;
  this.Ti = this.Si = this.bc = null;
  this.Xl = !1;
  this.a = G("cv.NetworkWaiter");
}, rk = function(a, b, c) {
  return new qk(a, b, c);
};
qk.prototype.cancel = function() {
  this.l || (this.a.info("Task canceled"), this.l = !0, this.bc && (qe(this.o, "wifi-added", this.bc), this.bc = null), this.Si && (clearTimeout(this.Si), this.Si = null), this.Ti && (clearTimeout(this.Ti), this.Ti = null), this.Xl && (this.o.jr(), this.Xl = !1));
};
qk.prototype.Bc = function() {
  return!0;
};
qk.prototype.start = function(a, b, c) {
  if (!this.da && !this.l) {
    this.a.info("Task started");
    var e = this.o.vl(a);
    0 < e.length ? (this.a.info("Network found imediatelly."), this.cancel(), this.Di(e[0])) : (this.bc = s(this.Pl, this, a), M(this.o, "wifi-added", this.bc), this.Ti = setTimeout(s(function() {
      this.a.info("Rescan loop requested");
      this.Xl = !0;
      this.o.oq();
    }, this), b), this.Si = setTimeout(s(function() {
      this.a.e("Task timed out.");
      this.cancel();
      this.xi();
    }, this), c));
  }
};
qk.prototype.Pl = function(a, b) {
  var c = b.vi;
  !this.l && a(c) && (this.a.info("Network found."), this.cancel(), this.Di(c));
};
var sk = function(a, b, c, e) {
  this.G = a;
  this.o = b;
  this.wb = c;
  this.v = e;
  this.da = this.l = !1;
  this.Hd = "";
  this.Eg = this.Gi = this.Wc = null;
  this.a = G("cv.NetworkConnector");
}, tk = function(a, b, c, e) {
  return new sk(a, b, c, e);
};
d = sk.prototype;
d.cancel = function() {
  this.l || (this.a.info("Canceling task."), this.l = !0, this.Wc && (this.G.onNetworksChanged.removeListener(this.Wc), this.Wc = null), this.Gi && (clearTimeout(this.Gi), this.Gi = null), this.Eg && (this.Eg.cancel(), this.Eg = null));
};
d.Bc = function() {
  return!0;
};
d.start = function(a) {
  this.da || this.l || (this.da = !0, this.a.info("Starting task"), this.Eg = rk(this.o, s(this.Rx, this), s(function() {
    this.l || (this.a.e("Network waiter failed"), this.cancel(), this.v());
  }, this)), this.Eg.start(a, 0, 2E4));
};
d.Rx = function(a) {
  this.l || (this.Hd = a.GUID, this.a.info("Network to be connected found; guid: " + this.Hd), this.o.Hl() == this.Hd ? (this.a.info("Network already connected."), this.cancel(), this.wb(this.Hd)) : (this.Wc = s(this.qm, this), this.G.onNetworksChanged.addListener(this.Wc), this.G.startConnect(this.Hd, s(this.Cy, this))));
};
d.Cy = function() {
  this.l || (this.Gi = setTimeout(s(function() {
    this.a.e("Network connector timed out");
    this.cancel();
    this.v();
  }, this), 3E4));
};
d.qm = function(a) {
  this.l || (a = A(a, function(a) {
    return a == this.Hd;
  }, this)) && this.G.getProperties(a, s(this.KE, this));
};
d.KE = function(a) {
  if (!this.l) {
    var b = a && a.ConnectionState;
    this.a.info("New network connection state for guid " + this.Hd + ":" + b);
    a && "NotConnected" != b ? "Connected" == b && (this.cancel(), this.wb(this.Hd)) : (this.cancel(), this.v());
  }
};
var uk = function(a, b, c) {
  this.Du = a;
  this.Sh = b;
  this.Pu = c;
  this.l = !1;
  this.fa = null;
};
d = uk.prototype;
d.cancel = function() {
  this.l = !0;
  this.fa && (this.fa(), this.fa = null);
};
d.Bc = function(a) {
  return this.Pu ? this.Pu(a) : !0;
};
d.start = function() {
  this.l || this.Du(s(this.Zu, this));
};
d.ee = function() {
  this.l || (this.fa = this.Du(s(this.Zu, this)), v(!!this.fa));
};
d.Zu = function() {
  this.l || (this.fa = null, this.cancel(), this.Sh.apply(null, arguments));
};
var vk = function(a, b, c, e) {
  this.o = a;
  this.Ts = b;
  this.Vs = c;
  this.v = e;
  this.l = !1;
  this.ld = [];
  this.Kh = this.Lh = this.bc = this.Vd = null;
  this.Tn = !1;
};
d = vk.prototype;
d.cancel = function() {
  this.l || (this.l = !0, this.bc && (qe(this.o, "wifi-added", this.bc), this.bc = null), this.Lh && (qe(this.o, "wifi-removed", this.Lh), this.Lh = null), this.Kh && (qe(this.o, "no-wifi", this.Kh), this.Kh = null), this.Vd && (clearTimeout(this.Vd), this.Vd = null), this.o.jr());
};
d.Bc = function() {
  return!0;
};
d.start = function() {
  this.l || (this.o.Cq() ? this.Ct(null) : (this.ld = this.o.vl(Xj), Ab(this.ld, this.Ts), this.Vs(this.ld), this.bc = s(this.Pl, this), M(this.o, "wifi-added", this.bc), this.Lh = s(this.dD, this), M(this.o, "wifi-removed", this.Lh), this.Kh = s(this.Ct, this), M(this.o, "no-wifi", this.Kh), this.o.oq(), this.Xn()));
};
d.Xn = function() {
  this.l || (this.ld.length && this.Vd ? (clearTimeout(this.Vd), this.Vd = null) : this.ld.length || this.Vd || (this.Vd = setTimeout(s(function() {
    this.l || (this.cancel(), this.v(1));
  }, this), 15E3)));
};
d.Pl = function(a) {
  a = a.vi;
  if (!this.l && Xj(a)) {
    for (var b = this.ld, c, e = this.Ts || zb, f = 0, g = b.length;f < g;) {
      var k = f + g >> 1, l;
      l = e(a, b[k]);
      0 < l ? f = k + 1 : (g = k, c = !l);
    }
    c = c ? f : ~f;
    0 > c && yb(b, -(c + 1), 0, a);
    this.Yu();
    this.Xn();
  }
};
d.dD = function(a) {
  var b = a.Fl;
  this.l || (a = pb(this.ld, function(a) {
    return a && a.GUID == b;
  }), 0 <= a && (sb(this.ld, a), this.Yu(), this.Xn()));
};
d.Yu = function() {
  this.Tn || (this.Tn = !0, setTimeout(s(function() {
    this.Tn = !1;
    this.l || this.Vs(this.ld);
  }, this), 1E3));
};
d.Ct = function() {
  this.cancel();
  this.v(0);
};
var wk = function(a, b, c) {
  this.ba = a;
  this.Di = b;
  this.xi = c;
  this.l = !1;
  this.Ql = null;
  this.Kg = 0;
  this.jj = new Mj;
  this.jj.xl(25);
  this.jj.ri(7E3);
  this.fa = null;
  this.a = G("cv.ConnectedSetupStateWaiter");
};
d = wk.prototype;
d.cancel = function() {
  this.l || (this.fa && (this.fa(), this.fa = null), this.a.info("Task canceled"), this.l = !0, this.jj.abort());
};
d.Bc = function() {
  return!0;
};
d.start = function() {
  this.a.info("Task started");
  this.jj.start(s(this.qB, this), s(this.wb, this), s(this.xj, this));
};
d.qB = function(a) {
  this.l || (this.fa ? (++this.Kg, a.qg()) : this.fa = this.ba.qi(s(this.OD, this, a)));
};
d.OD = function(a, b, c) {
  if (!this.l) {
    var e = this.fa = null;
    c.ja() ? e = b.setup_state : this.a.e("Chromekey info failed.");
    if (!e || this.Ql && e == this.Ql) {
      ++this.Kg, 6 < this.Kg ? (this.a.w("Setup state not changed for " + this.Kg + " iterations. Failing."), a.abort()) : a.qg();
    } else {
      this.a.info("Setup state changed to " + e);
      this.Ql = e;
      this.Kg = 0;
      t: {
        switch(e) {
          case 60:
          ;
          case 61:
          ;
          case 62:
            c = !0;
            break t;
          default:
            c = !1;
        }
      }
      c ? (this.a.info("Chromekey connected"), a.ul(b)) : (b = this.Ux(e), 0 != b ? (this.a.w("Bad setup state"), this.cancel(), this.xi(b)) : a.qg());
    }
  }
};
d.wb = function(a) {
  this.l || this.Di($a(a));
};
d.xj = function() {
  this.l || this.xi(1);
};
d.Ux = function(a) {
  switch(a) {
    case 21:
      return 2;
    case 31:
      return 3;
    case 41:
      return 4;
    default:
      return 0;
  }
};
var xk = function(a, b, c) {
  this.G = a;
  this.o = b;
  this.v = c;
  this.cc = this.l = !1;
  this.me = this.Sg = null;
  this.iq = 0;
  this.hq = !0;
  this.a = G("cv.KeepNetworkConnectedTask");
};
d = xk.prototype;
d.cancel = function() {
  this.l || (this.a.info("Task canceled"), this.l = !0, this.Sg && (qe(this.o, "wifi-disconnected", this.Sg), this.Sg = null), this.me && (this.me.cancel(), this.me = null));
};
d.Bc = function() {
  return!1;
};
d.si = function(a) {
  this.hq = a;
};
d.start = function(a) {
  this.cc || this.l || (this.cc = !0, this.a.info("Task started for network: " + a), this.Sg = s(this.nz, this, a), M(this.o, "wifi-disconnected", this.Sg));
};
d.nz = function(a, b) {
  this.l || this.me || b.Fl != a || (this.hq ? 2 <= this.iq ? (this.a.w("Network disconnected. The max number of allowed reconnects exceeded."), this.cancel(), this.v()) : (this.me = tk(this.G, this.o, s(function() {
    ++this.iq;
    this.me = null;
  }, this), s(function(a) {
    this.l || (this.a.e("Reconnect failed for " + a), this.cancel(), this.v());
  }, this)), this.a.e("Reconnecting " + a), this.me.start(function(b) {
    return b.GUID == a;
  })) : (this.a.w("Network disconnected. Fail as reconnecting is not allowed"), this.cancel(), this.v()));
};
var yk = function(a) {
  this.ba = a;
  this.l = !1;
  this.fa = this.Fk = null;
};
yk.prototype.Bc = function(a) {
  return!a || "flow-setup-started" == a || "flow-select-device" == a || "flow-success" == a;
};
yk.prototype.cancel = function() {
  this.l || (this.l = !0, this.Fk && (clearInterval(this.Fk), this.Fk = null), this.fa && (this.fa(), this.fa = null));
};
yk.prototype.start = function() {
  this.Fk = setInterval(s(function() {
    this.fa = this.ba.qi(s(function() {
      this.fa = null;
    }, this));
  }, this), 45E3);
};
var zk = function(a, b, c) {
  this.Fa = a;
  this.wb = b;
  this.v = c;
  this.l = !1;
  this.a = G("cv.CastDeviceWaiter");
  this.dj = this.pe = this.Tg = null;
};
zk.prototype.cancel = function() {
  this.l || (this.l = !0, this.a.info("CastDeviceWaiter task canceled."), this.Tg && (qe(this.Fa, "device-list-updated", this.Tg), this.Tg = null), this.pe && (clearTimeout(this.pe), this.pe = null), this.dj && (clearInterval(this.dj), this.dj = null));
};
zk.prototype.Bc = function() {
  return!0;
};
zk.prototype.start = function(a, b) {
  this.l || (this.a.info("Cast device waiter task started."), setTimeout(s(function() {
    this.l || (this.a.w("The cast device waiter task timed out."), this.cancel(), this.v());
  }, this), b), this.dj = setInterval(s(function() {
    this.l || (this.a.info("Triggering dial monitor refresh."), this.Fa.refresh());
  }, this), Math.min(b / 2 + 1, 3E4)), this.Fa.zl(a), this.Tg = s(this.Gd, this, a), M(this.Fa, "device-list-updated", this.Tg), this.Fa.refresh());
};
zk.prototype.Gd = function(a, b) {
  if (!this.l) {
    var c = A(b.Js, function(b) {
      return b.udn == a;
    });
    c && (this.cancel(), this.wb(c));
  }
};
var Ak = function(a, b, c, e, f) {
  this.G = a;
  this.o = b;
  this.Fa = c;
  this.wb = e;
  this.v = f;
  this.da = this.l = !1;
  this.mf = this.pe = this.wg = this.Ul = null;
  this.a = G("cv.ChromecastSetupNetworkVerifier");
}, Bk = [{value:2400, min:2400, max:2500}, {value:5E3, min:4900, max:5900}];
d = Ak.prototype;
d.cancel = function() {
  this.l || (this.l = !0, this.mf && (this.mf.cancel(), this.mf = null));
};
d.Bc = function() {
  return!0;
};
d.start = function(a, b, c) {
  this.l || this.da || (this.da = !0, this.a.info("Task started."), this.Ul = a, this.pe = c ? 14E4 : 3E4, this.mf = a = tk(this.G, this.o, s(this.Ui, this), s(this.ob, this, "network-connect-failed")), a.start(function(a) {
    return a.Name == b;
  }));
};
d.Ui = function(a) {
  this.l || (this.a.info("Network connected; guid: " + a), this.wg = a, this.mf = a = new uk(s(this.o.oz, this.o), s(this.pz, this), null), a.start());
};
d.pz = function(a) {
  this.l || (this.a.info("Connected network types: " + Sf(a)), qb(a, "VPN") ? this.ob("vpn-connected") : this.qA());
};
d.qA = function() {
  this.a.info("Verified that VPN not connected.");
  v(this.Ul);
  v(this.pe);
  var a;
  a = s(this.PA, this);
  var b = s(this.QA, this);
  this.mf = a = new zk(this.Fa, a, b);
  a.start(this.Ul, this.pe);
};
d.PA = function(a) {
  this.a.info("Chromecast found on the network.");
  if (this.o.Hl() != this.wg) {
    this.a.e("Network connection lost."), this.ob("network-connect-failed");
  } else {
    var b = this.Lq(), b = !!b && b.Iq && 5E3 != b.Hq;
    this.cancel();
    this.wb(a, b);
  }
};
d.QA = function() {
  this.a.w("Failed to find the Chromecast on the selected network");
  if (this.o.Hl() != this.wg) {
    this.a.e("Network connection lost."), this.ob("network-connect-failed");
  } else {
    var a = this.Lq();
    a && a.Iq && 5E3 == a.Hq ? this.ob("not-found-dual-band") : this.ob("not-found");
  }
};
d.ob = function(a) {
  this.a.info("Encountered an error: " + a);
  this.cancel();
  this.v(a);
};
d.Lq = function() {
  v(this.wg);
  var a = this.o.tA(this.wg);
  if (!(a && a.WiFi && a.WiFi.FrequencyList && a.WiFi.Frequency)) {
    return this.a.info("Frequency information not exposed"), null;
  }
  var b = function(a) {
    var b = A(Bk, function(b) {
      return a >= b.min && a <= b.max;
    });
    return b ? b.value : -1;
  }, c = function(a, c) {
    return!!A(a, function(a) {
      return(a = b(a)) && a == c;
    });
  }, e = c(a.WiFi.FrequencyList, 2400), c = c(a.WiFi.FrequencyList, 5E3);
  this.a.info("Conencted frequency: " + a.WiFi.Frequency);
  this.a.info("Found frequecy list: " + Sf(a.WiFi.FrequencyList));
  this.a.info("The network frequency status: has 2.4 GHz: " + e + "; has 5 GHZ: " + c);
  return{Hq:b(a.WiFi.Frequency), Iq:e && c};
};
var Ck = {Ip:null, kl:function() {
  Ck.Ip || (Ck.Ip = chrome.extension.getBackgroundPage().chromeKeySetupLogUtils);
  return Ck.Ip;
}, tx:null, MJ:function(a) {
  Ck.tx = a;
}, Sp:function(a) {
  Ck.kl().MJ(a);
}, Bs:function() {
  return Xc();
}, gJ:function() {
  return Ck.tx;
}, gk:function() {
  var a = chrome.extension.getViews({type:"tab"}), b = function(a, b) {
    return A(a, function(a) {
      return!!a && !!a.document && !!a.document.body && a.document.body.id == b;
    });
  }, c = b(a, "dongle-setup");
  c || (a = b(a, "options")) && (c = b(a.frames, "dongle-setup"));
  return c ? c.chromeKeySetupLogUtils.Bs() : Ck.kl().gJ() || "";
}, lx:null, PJ:function(a) {
  Ck.lx = a;
}, JJ:function() {
  return Ck.lx;
}, lv:function(a) {
  Ck.kl().PJ(a);
}, tK:function() {
  return Ck.kl().JJ();
}};
ba("chromeKeySetupLogUtils", Ck, void 0);
ba("getChromeKeySetupLogs", Ck.gk, void 0);
ba("getChromeKeySetupExternalLogsUrl", Ck.tK, void 0);
var Dk = /<[^>]*>|&[^;]+;/g, Ek = function(a, b) {
  return b ? a.replace(Dk, "") : a;
}, Fk = RegExp("[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]"), Gk = RegExp("^[^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]*[\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc]"), Hk = /^http:\/\/.*/, Ik = RegExp("[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff][^\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc]*$"), 
Jk = RegExp("[\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc][^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]*$"), Kk = /\s+/, Lk = /\d/;
var Mk = function(a) {
  this.pg = "number" == typeof a ? 0 < a ? 1 : 0 > a ? -1 : null : null == a ? null : a ? -1 : 1;
};
d = Mk.prototype;
d.cx = function(a, b) {
  for (var c = 0, e = 0, f = !1, g = Ek(a, b).split(Kk), k = 0;k < g.length;k++) {
    var l = g[k];
    Gk.test(Ek(l, void 0)) ? (c++, e++) : Hk.test(l) ? f = !0 : Fk.test(Ek(l, void 0)) ? e++ : Lk.test(l) && (f = !0);
  }
  return 0 == e ? f ? 1 : 0 : 0.4 < c / e ? -1 : 1;
};
d.wJ = function(a, b) {
  return 0 > a * b;
};
d.xJ = function(a, b, c, e) {
  return e && (this.wJ(b, this.pg) || 1 == this.pg && Jk.test(Ek(a, c)) || -1 == this.pg && Ik.test(Ek(a, c))) ? 1 == this.pg ? "\u200e" : "\u200f" : "";
};
d.Mw = function(a, b) {
  return this.aK(this.cx(a, b));
};
d.aK = function(a) {
  return-1 == (0 == a ? this.pg : a) ? "rtl" : "ltr";
};
d.WB = function(a, b, c) {
  return this.JK(null, a, b, c);
};
d.JK = function(a, b, c, e) {
  null == a && (a = this.cx(b, c));
  return this.dK(a, b, c, e);
};
d.dK = function(a, b, c, e) {
  e = e || void 0 == e;
  var f = [];
  0 != a && a != this.pg ? (f.push(-1 == a ? "\u202b" : "\u202a"), f.push(b), f.push("\u202c")) : f.push(b);
  f.push(this.xJ(b, a, c, e));
  return f.join("");
};
var Nk = function() {
};
Nk.prototype.getMessage = function(a, b) {
  return this.uK(a, b).message;
};
Nk.prototype.uK = function(a, b) {
  for (var c = [], e = {}, f = /{{(\w+?)}}/g, g = f.exec(a);null != g;) {
    b ? b[g[1]] && (e[g[1]] = b[g[1]]) : e[g[1]] = e[g[1]], g = f.exec(a);
  }
  for (var k in e) {
    k && (b && (a = a.replace(RegExp("{{" + k + "}}", "g"), e[k])), c.push(k));
  }
  return{message:a, bindings:c};
};
da(Nk);
var Yk = function(a) {
  var b = null;
  switch(a) {
    case "ok-button":
      b = Ok;
      break;
    case "cancel-button":
      b = Pk;
      break;
    case "save-button":
      b = Qk;
      break;
    case "set-up-button":
      b = Rk;
      break;
    case "continue-button":
      b = Sk;
      break;
    case "accept-button":
      b = Tk;
      break;
    case "reject-button":
      b = Uk;
      break;
    case "try-again-button":
      b = Vk;
      break;
    case "go-back-button":
      b = Wk;
      break;
    case "factory-reset-button":
      b = Xk;
  }
  return b ? Nk.F().getMessage(b) : a;
}, gl = function(a) {
  var b = null;
  switch(a) {
    case "network-settings":
      b = Zk;
      break;
    case "network-name":
      b = $k;
      break;
    case "default-network-name":
      b = al;
      break;
    case "join-other-option":
      b = bl;
      break;
    case "network-security":
      b = cl;
      break;
    case "network-password":
      b = dl;
      break;
    case "device-name":
      b = el;
      break;
    case "time-zone":
      b = fl;
  }
  return b ? Nk.F().getMessage(b) : a;
}, Ok = chrome.i18n.getMessage("1510649369757220975"), Pk = chrome.i18n.getMessage("2581331321407676861"), Qk = chrome.i18n.getMessage("2305903324116609221"), Rk = chrome.i18n.getMessage("3789857023572978851"), Sk = chrome.i18n.getMessage("3314869243569608808"), Tk = chrome.i18n.getMessage("8856112728107888349"), Uk = chrome.i18n.getMessage("7011099479208813570"), Vk = chrome.i18n.getMessage("7353352715326499943"), Wk = chrome.i18n.getMessage("6392158336204151356"), Xk = chrome.i18n.getMessage("6098003662202355499"), 
Zk = chrome.i18n.getMessage("7658849483698059550"), $k = chrome.i18n.getMessage("4300512446110878511"), al = chrome.i18n.getMessage("3056813071145570503"), bl = chrome.i18n.getMessage("1892665409887570919"), cl = chrome.i18n.getMessage("8674892226531837727"), dl = chrome.i18n.getMessage("145446834822743302"), el = chrome.i18n.getMessage("4625206607880030589"), fl = chrome.i18n.getMessage("7820166559915208245"), hl = chrome.i18n.getMessage("4840042422099634973"), il = chrome.i18n.getMessage("641484418525870522"), 
jl = chrome.i18n.getMessage("222617673884818958"), kl = chrome.i18n.getMessage("3876918464251814494"), ll = chrome.i18n.getMessage("7658112972707584352"), ml = chrome.i18n.getMessage("6940187082832386692"), nl = chrome.i18n.getMessage("7411261365841051403"), ol = chrome.i18n.getMessage("3771614655693813994"), pl = chrome.i18n.getMessage("7594287593369134847"), ql = chrome.i18n.getMessage("2400591522298944337"), rl = chrome.i18n.getMessage("4044189874405410369");
var sl = function() {
  this.a = G("cv.PinGenerator");
};
d = sl.prototype;
d.Bx = function(a) {
  a = this.nJ(a);
  if (!a) {
    return null;
  }
  a = this.pJ(a, [{action:"step", code:48, optional:!1}, {action:"step", code:48, optional:!1}, {action:"skip", code:160, optional:!0}, {action:"skip", code:2, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"return", code:48, optional:!1}]);
  return a ? (a = this.oJ(a)) ? this.qJ(a) : null : null;
};
d.nJ = function(a) {
  a = a.replace(/[\r\n]/g, "");
  a = a.replace("-----BEGIN CERTIFICATE-----", "");
  a = a.replace("-----END CERTIFICATE-----", "");
  try {
    yf();
    for (var b = wf, c = [], e = 0;e < a.length;) {
      var f = b[a.charAt(e++)], g = e < a.length ? b[a.charAt(e)] : 0;
      ++e;
      var k = e < a.length ? b[a.charAt(e)] : 0;
      ++e;
      var l = e < a.length ? b[a.charAt(e)] : 0;
      ++e;
      if (null == f || null == g || null == k || null == l) {
        throw Error();
      }
      c.push(f << 2 | g >> 4);
      64 != k && (c.push(g << 4 & 240 | k >> 2), 64 != l && c.push(k << 6 & 192 | l));
    }
    return c;
  } catch (q) {
    return this.a.w("Failed to convert the certificate from PEM to DER format"), null;
  }
};
d.iz = function(a, b) {
  if (b + 1 >= a.length) {
    return this.a.w("Length byte out of certificate bounds: at " + b + "; cert length: " + a.length), null;
  }
  if (!(a[b + 1] & 128)) {
    return{length:a[b + 1], Fm:1};
  }
  var c = a[b + 1] & 127;
  if (b + c + 1 >= a.length) {
    return this.a.w("Length info out of certificate bounds at: " + b + " length bytes count: " + c + "; certificate length: " + a.length), null;
  }
  if (2 < c) {
    return this.a.w("Block length over 16 bits not allowed; at " + b), null;
  }
  for (var e = 0, f = 2;f <= c + 1;f++) {
    e = e << 8 | a[b + f];
  }
  return{length:e, Fm:c + 1};
};
d.pJ = function(a, b) {
  var c = 0, e = -1;
  if (65535 < a.length) {
    return this.a.w("Certificate too long: " + a.length), null;
  }
  for (;b.length;) {
    var f = b.shift();
    e++;
    this.a.info("step: " + e + ", start: " + c);
    if (a[c] != f.code) {
      if (f.optional) {
        this.a.e("Skipping instruction " + f.code + " at step " + e);
        continue;
      }
      this.a.w("Expected certificate byte cert[" + c + "] to be " + f.code + ", but found " + a[c] + " at step " + e + " instead.");
      return null;
    }
    var g = this.iz(a, c);
    if (!g) {
      return this.a.w("Invalid certificate block length at step " + e), null;
    }
    var k = c + g.length + g.Fm;
    if (k >= a.length) {
      return this.a.w("The certificate data block at " + c + " does not fit the certificate size."), null;
    }
    switch(f.action) {
      case "step":
        c += g.Fm + 1;
        continue;
      case "skip":
        c = k + 1;
        continue;
      case "return":
        return xb(a, c, k + 1);
      default:
        return this.a.w("Invalid certificate parsing intstruction: " + f.action), null;
    }
  }
  this.a.w("Incomplete certificate parsing instructions");
  return null;
};
d.oJ = function(a) {
  var b = new Af;
  b.update(a);
  return b.eo();
};
d.Zw = function(a) {
  for (var b = a.length, c = 0, e = 0;e < b - 1;e++) {
    c += a[e];
  }
  c = (a[b - 1] + 16 * c) % 24;
  a = 65 + c;
  73 <= a && a++;
  79 <= a && a++;
  return String.fromCharCode(a);
};
d.$w = function(a) {
  return String.fromCharCode(50 + a[a.length - 1] % 8);
};
d.ql = function(a, b, c, e) {
  for (var f = [], g = 0;g < e;g++) {
    f[g] = a[b + g] ^ a[c + g];
  }
  return f;
};
d.qJ = function(a) {
  var b = [];
  b[0] = this.Zw(this.ql(a, 0, 16, 4));
  b[1] = this.$w(this.ql(a, 4, 16, 4));
  b[2] = this.Zw(this.ql(a, 8, 16, 4));
  b[3] = this.$w(this.ql(a, 12, 16, 4));
  return b;
};
var tl = {id:"generic", priority:2, iconClass:"error-icon-default", title:hl, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, ul = {id:"no-wifi", priority:1, iconClass:"error-icon-network", title:il, feedbackLink:{show:!1}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, vl = {id:"no-chromecasts", priority:2, 
iconClass:"error-icon-default", title:jl, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, wl = {id:"no-chromecasts-setup-one-exists", priority:2, iconClass:"error-icon-default", title:kl, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, xl = {id:"invalid-chromecast", priority:1, iconClass:"error-icon-default", 
title:hl, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, yl = {id:"chromecast-disconnected", priority:1, iconClass:"error-icon-default", title:ll, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, zl = {id:"chromecast-name-too-long", priority:3, iconClass:"error-icon-default", title:ml, feedbackLink:{show:!1}, 
okButton:{show:!0, type:"ok-button", next:"pop-previous-state"}, cancelButton:{show:!1, type:null, next:null}}, Al = {id:"chromecast-connection-failed", priority:2, iconClass:"error-icon-network", title:nl, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"pop-previous-state"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, Bl = {id:"chromecast-unreachable", priority:1, iconClass:"error-icon-default", title:hl, feedbackLink:{show:!0}, okButton:{show:!0, 
type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, Cl = {id:"chromecast-save-failed", priority:1, iconClass:"error-icon-default", title:hl, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, Dl = {id:"connect-to-setup-network", priority:1, iconClass:"error-icon-default", title:ol, feedbackLink:{show:!1}, okButton:{show:!0, type:"try-again-button", next:"verify-setup"}, 
cancelButton:{show:!0, type:"go-back-button", next:"retry-setup"}}, El = {id:"vpn-connected", priority:1, iconClass:"error-icon-default", title:pl, feedbackLink:{show:!1}, okButton:{show:!0, type:"try-again-button", next:"verify-setup"}, cancelButton:{show:!1, type:null, next:null}}, Fl = {id:"success-dual-band-warning", priority:1, iconClass:"error-icon-none", title:ql, feedbackLink:{show:!1}, okButton:{show:!0, type:"ok-button", next:"succeeed-setup"}, cancelButton:{show:!1, type:null, next:null}}, 
Gl = {id:"setup-chromecast-not-found-on-dual-band", priority:1, iconClass:"error-icon-default", title:hl, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, Hl = {id:"setup-chromecast-not-found", priority:1, iconClass:"error-icon-default", title:rl, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"retry-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}};
"undefined" != typeof angular && angular.module("dongleSetup", ["ngSanitize", "chrome_i18n"]);
var Il = function(a) {
  G("cv").Uc(Qc);
  this.b = a;
  this.Op = Oj() ? "ChromeOS" : ec ? "Windows" : dc ? "Mac" : fc ? "Linux" : "Other";
  this.ba = new Uj(new W("http://192.168.255.249:8008"));
  this.G = chrome.networkingPrivate || null;
  this.ud = chrome.dial || null;
  this.ug = Ck;
  this.I = null;
  this.a = G("cv.DongleSetupFlowCtrl");
  this.We = this.Ga = null;
  this.xx(this.b);
  this.ti();
  this.ug.Sp(null);
  (this.o = this.wx()) && this.o.start();
  (this.Fa = this.vx()) && this.Fa.start();
  this.Xe = new nk;
  this.Up = chrome && chrome.i18n ? chrome.i18n.getMessage("@@bidi_dir") : "ltr";
  this.$e = new Mk("rtl" == this.Up);
  this.La = [];
  this.xb = 0;
  this.yx() && this.Pp();
  M(window, "beforeunload", s(this.Sc, this));
};
ba("dongle.DongleSetupFlowCtrl", Il, void 0);
Il.$inject = ["$scope"];
d = Il.prototype;
d.v = function(a) {
  this.a.e("Encountered an error: " + a.id);
  "flow-error" == this.b.flowId && this.b.error.priority <= a.priority || (this.Ga && this.Ga.si(!1), this.b.error = a, this.ma("flow-error"));
};
d.Vp = function(a) {
  var b = function(a, b) {
    for (var f = 0;f < b.length;++f) {
      if (!(b[f] in a)) {
        return!1;
      }
    }
    return!0;
  };
  return a && b(a, ["public_key", "ssdp_udn", "name", "hotspot_bssid", "sign"]) && b(a.sign, ["certificate", "nonce", "signed_data"]) ? {certificate:a.sign.certificate, deviceSerial:a.ssdp_udn, nonce:a.sign.nonce, publicKey:a.public_key, signedData:a.sign.signed_data, deviceSsid:a.name, deviceBssid:a.hotspot_bssid} : (this.a.w("Missing required fields."), null);
};
d.zx = function() {
  v(!!this.o);
  var a = new vk(this.o, function(a, c) {
    return sa(a.Name, c.Name) || sa(a.GUID, c.GUID);
  }, this.ha(function(a) {
    this.b.deviceList = a;
    if (1 == a.length) {
      this.b.device = a[0];
    } else {
      var c = this.b.device && this.b.device.GUID;
      this.b.device = A(this.b.deviceList, function(a) {
        return a.GUID == c;
      });
    }
  }), this.ha(function(a) {
    switch(a) {
      case 0:
        this.v(ul);
        break;
      case 1:
        a = this.b.castDeviceList && A(this.b.castDeviceList, function(a) {
          return a.isChromecast;
        }) ? wl : vl;
        this.v(a);
        break;
      default:
        this.a.e("Unknown hotspot scanner error"), this.v(tl);
    }
  }));
  this.La.push(a);
  Jl(s(a.start, a));
};
d.yl = function() {
  this.Fa && this.Fa.refresh();
};
d.as = function(a) {
  var b = this.Mq();
  if (Mb(b)) {
    this.Bl(a);
  } else {
    var c = this.ha(function(b, c) {
      c.ja() ? this.Bl(a) : (this.a.w("Saving non network settings failed"), this.v(Cl));
    }), b = new uk(s(this.ba.vy, this.ba, b), c, null);
    this.La.push(b);
    b.ee();
  }
};
d.Hx = function(a) {
  var b = new uk(s(this.ba.wD, this.ba), this.ha(function(b, e) {
    e.ja() ? this.as(a) : this.v(Cl);
  }), null);
  this.La.push(b);
  b.ee();
};
d.Tp = function() {
  this.a.info("Verifying Chromecast visible on the selected network.");
  var a = s(function(a, b) {
    this.ba.wl(a.ipAddress);
    this.Hx(b);
  }, this), b = this.ha(function(a) {
    switch(a) {
      case "network-connect-failed":
        this.v(Dl);
        break;
      case "vpn-connected":
        this.v(El);
        break;
      case "not-found":
        this.v(Hl);
        break;
      case "not-found-dual-band":
        this.v(Gl);
        break;
      default:
        this.a.w("Unknown setup network verifier error"), this.v(tl);
    }
  }), c = 2 == this.xb, e = "uuid:" + this.I.ssdp_udn, f = this.rg().ssid;
  v(this.G);
  v(this.o);
  v(this.Fa);
  a = new Ak(this.G, this.o, this.Fa, a, b);
  this.La.push(a);
  a.start(e, f, c);
};
d.Rp = function() {
  var a = this.rg();
  this.b.customNetworkSecurity = a.wpa_auth;
  this.b.networkName = a.ssid;
  this.b.selectCustomNetwork = !0;
  this.b.disableConfirmPasswordButton = !0;
  this.ma("flow-invalid-password");
};
d.PB = function(a, b) {
  var c = this.ha(function(a) {
    3 == a ? (this.Ga && this.Ga.si(!1), this.Rp()) : this.v(Al);
  }), e = s(function(a) {
    this.I = a;
    this.Ga && (this.Ga.cancel(), this.Ga = null);
    this.Tp();
  }, this), f = 400 == b.Aa();
  2 != this.xb || f ? b.ja() ? (c = new wk(this.ba, e, c), this.La.push(c), c.start()) : (this.a.w("connectWifi failed with status: " + b.Aa()), this.ha(function() {
    this.v(f ? Al : Bl);
  })()) : e(this.I);
};
d.vs = function(a, b, c) {
  var e = {ssid:a.ssid, wpa_auth:a.wpa_auth};
  this.b.selectCustomNetwork && (e.scan_ssid = 1);
  !c && b ? this.v(xl) : (c && (e.enc_passwd = c), "wpa_cipher" in a && (e.wpa_cipher = a.wpa_cipher), "wpa_id" in a && (e.wpa_id = a.wpa_id), a = new uk(s(this.ba.OB, this.ba, e), s(this.PB, this), null), this.La.push(a), a.ee(), this.Fa.zl("uuid:" + this.I.ssdp_udn));
};
d.Qs = function() {
  this.ma("flow-setup-started");
  var a = this.rg();
  if (this.us(a)) {
    if (this.Ga && this.Ga.si(!0), Yj(a)) {
      var b = this.b.networkPassword, c = this.Vp(this.I);
      if (c) {
        var e;
        t: {
          switch(a.wpa_auth) {
            case 2:
            ;
            case 3:
              e = !!b && 5 <= b.length && 64 >= b.length && !b.match(/[^\x20-\x7E]/);
              break t;
            case 5:
            ;
            case 7:
              e = b ? 64 == b.length ? !b.match(/[^0-9A-Fa-f]/) : 8 <= b.length && 63 >= b.length && !b.match(/[^\x20-\x7E]/) : !1;
              break t;
            default:
              e = !0;
          }
        }
        e ? (a = new uk(s(this.G.verifyAndEncryptData, this.G, c, b), s(this.vs, this, a, !0), null), this.La.push(a), a.start()) : this.Rp();
      } else {
        this.v(xl);
      }
    } else {
      this.vs(a, !1, null);
    }
  } else {
    this.as(!1);
  }
};
d.Mq = function() {
  var a = {};
  this.b.friendlyName && this.b.friendlyName != this.I.name && (a.name = this.b.friendlyName);
  this.b.timezone && this.b.timezone != this.I.timezone && (a.timezone = this.b.timezone);
  if (this.b.showOptInOptions) {
    var b = this.b.optIn;
    b.stats != this.I.opt_in.crash && (a.opt_in = a.opt_in || {}, a.opt_in.crash = b.stats);
    b.stats != this.I.opt_in.stats && (a.opt_in = a.opt_in || {}, a.opt_in.stats = b.stats);
    "device_id" in this.I.opt_in && b.deviceId != this.I.opt_in.device_id && (a.opt_in = a.opt_in || {}, a.opt_in.device_id = b.deviceId);
  }
  return a;
};
d.us = function(a) {
  return a ? 60 != this.I.setup_state ? !0 : Yj(a) ? !!this.b.networkPassword : a.ssid != this.I.ssid : !1;
};
d.lu = function() {
  24 < this.b.friendlyName.length ? this.v(zl) : (this.b.connecting = !0, this.Qs());
};
d.$D = function() {
  this.ma(this.b.previousFlowId);
  this.Qs();
};
d.hC = function(a) {
  v(!!this.G);
  var b = !1, c = new pk(this.Xe, this.ba, this.I, function(a) {
    var b;
    if (b = a) {
      a = a.wpa_auth, b = 0 != a && 4 != a && 6 != a && 8 != a;
    }
    return b;
  }, this.ha(function(c, f) {
    b || (this.ma(a), b = !0);
    this.b.networkOptions = c;
    if (!this.b.selectCustomNetwork) {
      var g = this.b.network;
      if (g) {
        var k = A(c, function(a) {
          return a.value.ssid == g.ssid;
        }, this), g = k && k.value
      } else {
        0 <= f && (g = c[f].value);
      }
      this.b.network = g;
      this.b.networkName = g && g.ssid;
    }
  }), this.ha(function() {
    this.v(Bl);
  }));
  this.La.push(c);
  c.start();
};
d.iC = function(a) {
  var b = this.ha(function(b, e) {
    e.ja() ? (z(b, function(a) {
      a.display_string = this.$e.WB(a.display_string);
    }, this), this.b.supportedTimezones = b, this.b.timezone = a) : (this.b.supportedTimezones = [], this.b.timezone = null);
  }), b = new uk(s(this.ba.VB, this.ba), b, function(a) {
    return "flow-edit-device" != a;
  });
  this.La.push(b);
  b.ee();
};
d.ma = function(a) {
  a == this.b.flowId ? this.a.e("Updating flow to current state.") : (this.a.info("Flow updated to " + a), this.La = kb(this.La, function(b) {
    var c = b.Bc(a);
    c && b.cancel();
    return!c;
  }), "flow-setup-started" != a && (!this.b.flowId && a ? this.$p(!0) : !a && this.b.flowId && this.$p(!1), this.b.previousFlowId = this.b.flowId, this.b.flowId = a, a || (this.xb = 0, this.ti(), this.Ga && (this.Ga.cancel(), this.Ga = null), this.o && this.o.aq(!0), this.Np(this.b), this.I = null, this.b.connecting = !1, this.yl()), "flow-select-device" == a && (this.ti(), this.Ga && (this.Ga.cancel(), this.Ga = null), this.b.device = null, this.b.deviceToSetup = "", this.o && this.o.aq(!1), this.zx()), 
  "flow-error" == a && (this.b.connecting = !1)));
};
d.cE = function() {
  return this.I ? !this.us(this.rg()) && Mb(this.Mq()) : !0;
};
d.ZD = function(a) {
  this.b.network = a.value;
  this.b.networkName = a.name;
  this.b.showNetworkOptions = !1;
  this.b.selectCustomNetwork = !1;
  this.b.networkPassword = "";
};
d.YD = function() {
  this.b.network = null;
  this.b.networkName = null;
  this.b.customNetworkSecurity = 1;
  this.b.selectCustomNetwork = !0;
  this.b.showNetworkOptions = !1;
  this.b.networkPassword = "";
};
d.rg = function() {
  return this.b.selectCustomNetwork ? this.b.networkName ? {ssid:this.b.networkName, wpa_auth:this.b.customNetworkSecurity} : null : this.b.network;
};
d.dE = function() {
  return!this.b.selectCustomNetwork && this.b.network && this.I && this.I.connected && this.b.network.ssid == this.I.ssid && 60 == this.I.setup_state;
};
d.bE = function() {
  return!Yj(this.b.selectCustomNetwork ? {ssid:"", wpa_auth:this.b.customNetworkSecurity} : this.b.network);
};
d.RD = function(a, b) {
  var c;
  a ? (c = (a.signal_level || 0) + 120, 100 < c && (c = 100), 0 > c && (c = 0), c = Math.ceil(c / 25), c = {"background-position":"0 " + -(b + 25 * c) + "px"}) : c = {display:"none"};
  return c;
};
d.fE = function(a) {
  this.b.showNetworkOptions = !this.b.showNetworkOptions;
  this.b.showNetworkOptions && this.Xe.LC();
  a.stopPropagation();
};
d.SD = function(a) {
  return a ? this.$e.Mw(a) : this.Up;
};
d.xx = function(a) {
  "ChromeOS" == this.Op ? (a.allowAdd = !0, a.allowEdit = !0) : (a.allowAdd = !1, a.allowEdit = !1);
  a.onAddDevice = s(this.Pp, this);
  a.onEditDevice = s(this.WD, this);
  a.onSetup = s(this.aE, this);
  a.onCancel = s(this.UD, this);
  a.onContinue = s(this.Zp, this);
  a.onFactoryReset = s(this.XD, this);
  a.onNetworkOK = s(this.lu, this);
  a.onPasswordConfirmed = s(this.$D, this);
  a.updateFlow = s(this.ma, this);
  a.updateFlowAfterError = s(this.gE, this);
  a.onSave = s(this.lu, this);
  a.onDeviceSelected = s(this.VD, this);
  a.shouldHidePasswordField = s(this.dE, this);
  a.shouldDisablePasswordField = s(this.bE, this);
  a.networkNeedsPassword = Yj;
  a.shouldDisableSaveButton = s(this.cE, this);
  a.toggleNetworkOptions = s(this.fE, this);
  a.onNetworkSelected = s(this.ZD, this);
  a.onJoinOtherNetwork = s(this.YD, this);
  a.getNetworkIconStyle = s(this.RD, this);
  a.getNetwork = s(this.rg, this);
  a.startSetup = s(this.Wp, this);
  a.getButtonLabel = Yk;
  a.getDirection = s(this.SD, this);
  a.getInputLabel = gl;
  a.os = this.Op;
  a.networkingApiSupported = !!this.G;
  a.flowId = null;
  a.castDeviceList = [];
  a.activeNetworkName = null;
  a.customNetworkSupportedSecurity = [{value:1, name:"None"}, {value:2, name:"WEP"}, {value:3, name:"WEP Shared"}, {value:5, name:"WPA PSK"}, {value:7, name:"WPA2 PSK"}];
  this.Np(a);
};
d.Np = function(a) {
  a.device = null;
  a.deviceList = [];
  a.networkOptions = [];
  a.network = null;
  a.networkName = null;
  a.networkPassword = "";
  a.showNetworkPassword = !1;
  a.disableConfirmPasswordButton = !0;
  a.friendlyName = "";
  a.castDeviceList && 1 == a.castDeviceList.length || (a.castDevice = null);
  a.connecting = !1;
  a.error = {};
  a.deviceToSetup = "";
  a.nameAfterFactoryReset = null;
  a.showNetworkOptions = !1;
  a.selectCustomNetwork = !1;
  a.customNetworkSecurity = 1;
  a.timezone = null;
  a.supportedTimezones = [];
  a.showOptInOptions = !1;
  a.optIn = {stats:!0, deviceId:!1};
  a.pin = [];
};
d.wx = function() {
  if (!this.G) {
    return this.a.e("Failed to create a network monitor: networking api not available."), null;
  }
  var a = new gk(this.G);
  M(a, "wifi-connected", this.ha(function(a) {
    this.yl();
    this.b.activeNetworkName = a.vi.Name;
  }));
  M(a, "wifi-disconnected", this.ha(function() {
    this.b.activeNetworkName = null;
    this.b.castDeviceList = [];
    this.ti();
  }));
  return a;
};
d.vx = function() {
  if (!this.ud) {
    return null;
  }
  var a = new ek(this.ud);
  M(a, "device-list-updated", this.ha(function(a) {
    a = a.Js;
    var c = null;
    if (1 == a.length) {
      c = a[0];
    } else {
      if (this.b.castDevice) {
        var e = this.b.castDevice.udn, c = A(a, function(a) {
          return a.udn == e;
        })
      }
    }
    this.b.castDeviceList = a;
    this.b.castDevice = c;
  }));
  return a;
};
d.Pp = function() {
  this.G ? (this.xb = 1, this.ma("flow-select-device")) : this.ma("flow-network-api-unavailable");
};
d.Mp = function(a, b, c) {
  c.ja() ? (this.I = b, (b = this.Vp(b)) ? b.nonce != a ? (this.a.w("Invalid nonce value received."), this.ha(function() {
    this.v(xl);
  })()) : (a = new uk(s(this.G.verifyDestination, this.G, b), s(this.iy, this), null), this.La.push(a), a.start()) : this.ha(function() {
    this.v(xl);
  })()) : (this.a.w("eurekaInfo failed."), this.ha(function() {
    this.v(Bl);
  })());
};
d.iy = function(a) {
  if (a) {
    if (this.ba.setVersion(this.I.version.toString()), this.Dx(), 2 != this.xb && (a = new yk(this.ba), this.La.push(a), a.start()), Zj(this.I.setup_state)) {
      var b = this.Cx().Bx(this.I.sign.certificate);
      b ? this.ha(function() {
        this.b.pin = b;
        this.ma("flow-confirm-pin");
      })() : this.ha(function() {
        this.v(tl);
      })();
    } else {
      this.a.info("WPA already configured. Skip pin."), this.ha(this.Wp)();
    }
  } else {
    this.I = null, this.ha(function() {
      this.v(xl);
    })();
  }
};
d.Wp = function() {
  this.ma("flow-connect-to-device");
  var a = null, a = 1 == this.xb ? "flow-select-network" : "flow-edit-device";
  this.Ga && this.Ga.si(!1);
  this.b.pin = [];
  this.b.connecting = !1;
  this.b.timezone = null;
  this.b.supportedTimezones = [];
  this.b.selectCustomNetwork = null;
  this.b.network = null;
  this.b.networkPassword = "";
  this.b.showNetworkPassword = !1;
  this.b.showOptInOptions = "flow-edit-device" == a;
  this.I.opt_in && (this.b.optIn = {stats:this.I.opt_in.crash && this.I.opt_in.stats, deviceId:this.I.opt_in.device_id});
  this.b.friendlyName = 1 != this.xb ? this.I.name : "";
  "flow-edit-device" == a && this.iC(this.I.timezone);
  this.hC(a);
};
d.WD = function() {
  if (this.G) {
    v(!!this.o);
    this.b.deviceToSetup = this.b.castDevice.name;
    this.ma("flow-connect-to-device");
    this.ba.wl(this.b.castDevice.ipAddress);
    this.o.gs();
    var a = this.Lp(), b = s(function(a, b, c) {
      c.ja() && 61 == b.setup_state ? (this.We = b.hotspot_bssid, this.xb = 3, this.ha(function() {
        this.ma("flow-setup-notice");
      })()) : (this.xb = 2, this.Mp(a, b, c));
    }, this, a), c = s(function(b) {
      return this.ba.qi(b, ["sign"], a);
    }, this), b = new uk(c, b, null);
    this.La.push(b);
    b.ee();
  } else {
    this.ma("flow-network-api-unavailable");
  }
};
d.aE = function() {
  v(!!this.o);
  this.b.deviceToSetup = this.b.device.Name;
  this.We = this.b.device.WiFi.BSSID;
  this.o.gs();
  this.ma("flow-setup-notice");
};
d.UD = function() {
  this.ma(null);
};
d.Zp = function() {
  this.ma("flow-connect-to-device");
  this.We || this.a.e("Hotspot BSSID is not set");
  if (Xj({WiFi:{BSSID:this.We}})) {
    var a = s(function(a) {
      this.a.info("Hotspot connected.");
      this.ba.wl("192.168.255.249");
      v(!!this.G);
      v(!!this.o);
      var b = this.ha(s(this.v, this, yl));
      this.Ga = new xk(this.G, this.o, b);
      this.Ga.start(a);
      var c = this.Lp();
      a = s(function(a) {
        return this.ba.qi(a, ["sign"], c);
      }, this);
      a = new uk(a, s(this.Mp, this, c), null);
      this.La.push(a);
      a.ee();
    }, this), b = this.ha(s(this.v, this, yl)), c = s(function(a) {
      return a && a.WiFi && !sa(a.WiFi.BSSID, this.We || "");
    }, this);
    v(!!this.G);
    v(!!this.o);
    a = tk(this.G, this.o, a, b);
    this.La.push(a);
    a.start(c);
  } else {
    this.a.w("Trying to connect to non-Chromekey network."), this.v(xl);
  }
};
d.XD = function() {
  v(!!this.o);
  if (this.wA("Are you sure your Chromecast needs a fresh start? This will erase all settings from your Chromecast.")) {
    this.b.nameAfterFactoryReset = null;
    this.ma("flow-factory-reset");
    var a = "uuid:" + this.I.ssdp_udn, b = this.ha(function(b) {
      this.Fa.zl(a);
      this.yl();
      this.b.nameAfterFactoryReset = b.Name;
    }), c = this.ha(function() {
      this.v(tl);
    }), e = [], f = this.I.hotspot_bssid, g = function(a) {
      return!qb(e, a.Name) && !sa(f, a.WiFi.BSSID);
    }, k = this.o.vl(g);
    z(k, function(a) {
      e.push(a.Name);
    });
    k = s(function(a, e) {
      v(!!this.o);
      if (e.ja()) {
        var f = new qk(this.o, b, c);
        this.La.push(f);
        f.start(g, 6E4, 18E4);
      } else {
        c();
      }
    }, this);
    k = new uk(s(this.ba.yA, this.ba, "fdr"), k, null);
    this.La.push(k);
    k.ee();
  }
};
d.gE = function(a) {
  this.b.error = {};
  if ("flow-error" != this.b.flowId) {
    this.a.w("Trying to invoke error action " + a + " from non-error flow " + this.b.flowId), this.v(tl);
  } else {
    var b = this.b.previousFlowId;
    if ("verify-setup" != a && "retry-setup" != a || "flow-edit-device" != !b || "flow-select-network" != !b) {
      switch(a) {
        case "pop-previous-state":
          this.ma(b);
          break;
        case "verify-setup":
          this.b.connecting = !0;
          this.ma(b);
          this.Tp();
          break;
        case "retry-setup":
          this.We = this.I.hotspot_bssid;
          2 == this.xb && (this.xb = 3);
          this.Zp();
          break;
        case "reinit-setup":
          this.ma(1 == this.xb ? "flow-select-device" : null);
          break;
        case "cancel-setup":
          this.ma(null);
          break;
        case "succeeed-setup":
          this.Bl(!1);
          break;
        default:
          this.a.w("Invalid error action found: " + a), this.v(tl);
      }
    } else {
      this.a.w("Trying to perform error action " + a + " with wrong pre-error flow: " + b), this.v(tl);
    }
  }
};
d.VD = function(a, b, c) {
  this.b[c] = this.b[b][a];
};
d.Bl = function(a) {
  this.o && this.o.ar();
  a ? this.v(Fl) : (1 == this.xb && chrome.tabs.getCurrent(function(a) {
    v(!!a);
    chrome.windows.update(a.windowId, {focused:!0}, function() {
      chrome.tabs.update(a.id, {url:"https://cast.google.com/chromecast/setup?np=fi", active:!0});
    });
  }), this.ma(null));
};
d.yx = function() {
  var a = function(a) {
    return a && a.location && a.location.href ? "true" == (new W(a.location.href)).El().get("showFlow") : !1;
  };
  return this.o && (a(window) || a(window.parent));
};
d.Sc = function() {
  this.ma(null);
  this.o && (se(this.o), this.o.W());
  this.Fa && (se(this.Fa), this.Fa.W());
  this.Xe.W();
  this.ug.Sp(this.ug.Bs());
  this.b = null;
};
d.Dx = function() {
  var a = null;
  this.I && (a = this.ba.RF("/setup/get_log_report").toString());
  this.ug.lv(a);
};
d.$p = function(a) {
  var b = window;
  b && b.parent && b.parent.notifyChromekeySetupActive && b.parent.notifyChromekeySetupActive(a);
};
d.ti = function() {
  this.ug.lv(null);
};
d.wA = function(a) {
  return confirm(a);
};
d.ha = function(a) {
  var b = this, c = this.b;
  return function() {
    var e = arguments;
    c.$apply(function() {
      a.apply(b, e);
    });
  };
};
d.Cx = function() {
  this.px || (this.px = new sl);
  return this.px;
};
d.Lp = function() {
  return Ka();
};
var Jl = function(a) {
  setTimeout(a, 0);
};
var Kl = function(a, b, c, e) {
  this.source = a;
  this.target = b;
  this.type = c;
  this.content = e;
  this.windowUrl = null;
};
var Ll = function() {
  this.Tb = [];
  this.tc = {};
};
u(Ll, K);
d = Ll.prototype;
d.ni = 1;
d.gl = 0;
d.Sw = function(a, b, c) {
  var e = this.tc[a];
  e || (e = this.tc[a] = []);
  var f = this.ni;
  this.Tb[f] = a;
  this.Tb[f + 1] = b;
  this.Tb[f + 2] = c;
  this.ni = f + 3;
  e.push(f);
  return f;
};
d.Tw = function(a, b, c) {
  if (a = this.tc[a]) {
    var e = this.Tb;
    if (a = A(a, function(a) {
      return e[a + 1] == b && e[a + 2] == c;
    })) {
      return this.ii(a);
    }
  }
  return!1;
};
d.ii = function(a) {
  if (0 != this.gl) {
    return this.Wh || (this.Wh = []), this.Wh.push(a), !1;
  }
  var b = this.Tb[a];
  if (b) {
    var c = this.tc[b];
    c && tb(c, a);
    delete this.Tb[a];
    delete this.Tb[a + 1];
    delete this.Tb[a + 2];
  }
  return!!b;
};
d.Km = function(a, b) {
  var c = this.tc[a];
  if (c) {
    this.gl++;
    for (var e = xb(arguments, 1), f = 0, g = c.length;f < g;f++) {
      var k = c[f];
      this.Tb[k + 1].apply(this.Tb[k + 2], e);
    }
    this.gl--;
    if (this.Wh && 0 == this.gl) {
      for (;c = this.Wh.pop();) {
        this.ii(c);
      }
    }
    return 0 != f;
  }
  return!1;
};
d.clear = function(a) {
  if (a) {
    var b = this.tc[a];
    b && (z(b, this.ii, this), delete this.tc[a]);
  } else {
    this.Tb.length = 0, this.tc = {};
  }
};
d.J = function(a) {
  if (a) {
    var b = this.tc[a];
    return b ? b.length : 0;
  }
  a = 0;
  for (b in this.tc) {
    a += this.J(b);
  }
  return a;
};
d.k = function() {
  Ll.q.k.call(this);
  delete this.Tb;
  delete this.tc;
  delete this.Wh;
};
var Ml = function(a) {
  this.De = a;
  this.fc = new Ll;
  this.a = G("cv.Messenger-" + a);
};
u(Ml, K);
d = Ml.prototype;
d.A = function() {
  chrome.extension.onMessage.addListener(s(this.Sm, this));
};
d.Or = function(a, b, c, e) {
  v("background" == this.De, "Only background page can talk to tab");
  chrome.tabs.sendMessage(a, JSON.stringify(new Kl(this.De, "content", b, c)), e || m);
};
d.uJ = function(a, b, c, e) {
  this.a.ka("Sending message to " + a + ": " + JSON.stringify(c));
  chrome.extension.sendMessage(JSON.stringify(new Kl(this.De, a, b, c)), e || m);
};
d.it = function(a, b, c, e) {
  v("background" == this.De, "Only background page can talk to other extension pages");
  v("background" != a, "background page can NOT send message to itself");
  this.uJ(a, b, c, e);
};
d.Sm = function(a, b) {
  v(r(a), "Expect a string. Got " + JSON.stringify(a));
  var c = JSON.parse(a);
  if (this.De == c.target && this.De != c.source && ("background" == this.De || "background" == c.source)) {
    var e;
    b.tab ? (e = b.tab, c.windowUrl && e.url != c.windowUrl && (e.url = c.windowUrl, e.title = "", e.favIconUrl = "")) : e = {id:-1};
    this.a.pB("Getting message from tab " + e.id + ": " + JSON.stringify(c));
    this.fc.Km(c.type, e, c.content);
  }
};
d.listen = function(a, b, c) {
  return this.fc.Sw(a, b, c);
};
d.Yc = function(a, b, c) {
  return this.fc.Tw(a, b, c);
};
d.Yf = function(a) {
  return this.fc.ii(a);
};
d.k = function() {
  Ml.q.k.call(this);
  this.fc.W();
};
var Nl = function() {
  this.Pb = s(this.Gd, this);
  this.qr = s(this.es, this);
  this.rh = !1;
  this.dd = 0;
  this.a = G("cv2.DeviceService");
};
u(Nl, K);
d = Nl.prototype;
d.gF = function(a) {
  this.Dw = a;
};
d.iF = function(a) {
  this.Ug = a;
};
d.hF = function(a) {
  this.Jk = a;
};
d.A = function() {
  v(this.Dw);
  v(this.Ug);
  v(this.Jk);
  this.start();
};
d.start = function() {
  this.rh ? this.a.info("Already started.") : (this.a.info("Starting..."), this.rh = this.Df());
};
d.stop = function() {
  this.rh ? (this.zd(), this.rh = !1) : this.a.info("Was not started.");
};
d.k = function() {
  this.stop();
};
d.discoverNow = function() {
  this.rh ? this.ls() : this.a.info("Not started. Ignoring discover().");
};
d.rn = function() {
};
d.Gd = function(a) {
  this.a.info("onDeviceList: " + JSON.stringify(a));
  0 == a.length ? this.wr() : (this.dd += a.length, z(a, s(function(a) {
    this.rn(a, s(this.ln, this), s(this.uj, this));
  }, this)));
};
d.ln = function(a) {
  0 != this.dd && (this.Dw(a), this.dd--, 0 == this.dd && this.Ug());
};
d.uj = function(a) {
  0 != this.dd && (this.a.e("Unable to process device: " + a), this.dd--, 0 == this.dd && this.Ug());
};
d.es = function() {
};
d.wr = function() {
  this.Nw();
  this.dd = 0;
  this.Jk();
};
var Ol = function() {
  L.call(this, "receiver_list");
};
u(Ol, L);
var Pl = function(a) {
  L.call(this, "remove_receiver");
  this.receiver = a;
};
u(Pl, L);
var Ql = function(a) {
  O.call(this);
  this.Kk = a;
  this.t = new P(this);
  this.pb = new B;
  this.ff = new Yb;
  this.Kk.gF(s(this.fF, this));
  this.Kk.iF(s(this.Ug, this));
  this.Kk.hF(s(this.Jk, this));
};
u(Ql, O);
d = Ql.prototype;
d.a = G("cv2.DiscoveryService");
d.Tc = function() {
  var a = kb(this.pb.R(), function(a) {
    return!a.fo();
  });
  a.sort(function(a, c) {
    return a.c() < c.c() ? -1 : a.c() == c.c() ? 0 : 1;
  });
  return a;
};
d.refresh = function() {
  this.Kk.discoverNow();
};
d.register = function(a) {
  this.pb.Ja(a.c()) || (this.a.info("Registering receiver with id " + a.c()), this.pb.set(a.c(), a), this.wf());
};
d.ir = function(a) {
  for (var b = this.pb.fb(), c = 0, e = b.length;c < e;c++) {
    var f = this.pb.get(b[c]);
    f && a(f) && (this.pb.remove(b[c]), this.ds(f));
  }
  this.wf();
};
d.xg = function(a) {
  return(a = this.pb.get(a, null)) && a.fo() ? null : a;
};
d.QF = function(a) {
  return kb(this.Tc(), function(b) {
    return "available" == b.Bm(a);
  });
};
d.zq = function() {
  this.wf();
};
d.fF = function(a) {
  var b = !1;
  this.ff.add(a.c());
  var c = this.pb.get(a.c());
  c ? c.equals(a) || (this.a.info("Merging with existing receiver " + c.c()), c.lj(a), b = !0) : (this.a.info("Adding new receiver " + a.c()), this.pb.set(a.c(), a), b = !0);
  b && this.wf();
};
d.Ug = function() {
  this.a.info("onDevicesFinished");
  this.hs(this.ff) && this.wf();
  this.ff.clear();
};
d.Jk = function() {
  this.ff.clear();
  this.hs(this.ff) && this.wf();
};
d.hs = function(a) {
  for (var b = !1, c = this.pb.fb(), e = 0, f = c.length;e < f;e++) {
    if (!a.contains(c[e])) {
      var g = this.pb.get(c[e]);
      g.Rg() || (g.fs(!0), this.a.info("Removing receiver " + c[e] + " from map."), this.pb.remove(c[e]), this.ds(g), b = !0);
    }
  }
  return b;
};
d.wf = function() {
  this.dispatchEvent(new Ol(this.Tc()));
};
d.ds = function(a) {
  this.dispatchEvent(new Pl(a));
};
d.k = function() {
  this.ff.clear();
  this.pb.clear();
  this.pb = null;
  this.t.W();
  Ql.q.k.call(this);
};
var Rl = function(a, b) {
  this.type = a;
  this.message = b;
}, Tl = function(a, b, c, e, f, g, k, l, q) {
  this.id = a;
  this.receiver = new Sl(b.id, Da(b.name));
  this.iconUrl = c || null;
  this.title = e || "";
  this.isInLaunch = f;
  this.mediaPlayerStatus = g || null;
  this.tabId = k || null;
  this.isLocal = l;
  this.isMirror = q;
}, Sl = function(a, b) {
  this.id = a;
  this.name = b;
}, Ul = function(a, b, c, e, f, g, k) {
  this.id = a;
  this.title = b;
  this.message = c;
  this.defaultActionText = e;
  this.optActionText = f || "";
  this.severity = g || "fatal";
  this.activityId = k || null;
}, Vl = function(a, b) {
  this.receiver = new Sl(a.id, Da(a.name));
  this.activity = b;
}, Wl = function(a, b, c, e) {
  this.captureSurface = a || "tab";
  this.lowFpsMode = b || !1;
  this.castAppNotificationDismissed = c || !1;
  this.mirrorQualityId = e || Nd.id;
}, Xl = function(a, b, c, e, f) {
  this.receiverActs = a || [];
  this.issue = b;
  this.isAppInTab = f || !1;
  this.castOfCurrentTab = c;
  this.settings = e || new Wl("tab");
}, Yl = function() {
  this.timeProgress = !1;
  this.muted = null;
  this.hasPause = !0;
};
var Zl = function(a, b, c, e, f) {
  this.jv = a;
  this.ei = b;
  this.gi = c;
  this.ua = e;
  this.fi = this.hg = !1;
  if (!(a = f)) {
    for (b = a = 0;b < c.length;++b) {
      a = 31 * a + c.charCodeAt(b), a %= 4294967296;
    }
    a = "receiver.v2." + a;
  }
  this.ia = a;
}, $l = function(a) {
  var b = A(a.serviceData, function(a) {
    return 0 == a.lastIndexOf("id=", 0);
  }), c = a.serviceName.indexOf("._googlecast.");
  if (!b || -1 == c) {
    return null;
  }
  var e = a.serviceHostPort.substring(a.serviceHostPort.indexOf(":") + 1), c = a.serviceName.substring(0, c), b = b.substring(3);
  return new Zl(a.ipAddress, c, b, "casts://" + a.ipAddress + ":" + e);
};
d = Zl.prototype;
d.isLocal = function() {
  return!0;
};
d.Wv = function() {
  return!0;
};
d.c = function() {
  return this.ia;
};
d.mk = function() {
  return this.gi;
};
d.Zi = function() {
  return this.ua;
};
d.xd = function() {
  return this.ei;
};
d.fo = function() {
  return this.hg;
};
d.Rg = function() {
  return this.fi;
};
d.wm = function() {
  return!1;
};
d.equals = function(a) {
  return a instanceof Zl ? this.gi == a.gi && this.ei == a.ei && this.hg == a.hg && this.ua == a.ua && this.fi == a.fi : !1;
};
d.lj = function(a) {
  a instanceof Zl && (this.gi = a.gi, this.ia = a.ia, this.ei = a.ei, this.hg = a.hg, this.ua = a.ua, this.jv = a.jv, this.fi = a.fi);
};
d.fs = function(a) {
  this.hg = a;
};
var am = function() {
  Nl.call(this);
  this.a = G("cv2.MdnsService");
};
u(am, Nl);
d = am.prototype;
d.Df = function() {
  if (chrome.mdns) {
    return chrome.mdns.onServiceList.addListener(this.Pb, {serviceType:"_googlecast._tcp.local"}), !0;
  }
  this.a.e("MDNS API not available, aborting start...");
  return!1;
};
d.zd = function() {
  chrome.mdns.onServiceList.removeListener(this.Pb);
};
d.ls = function() {
};
d.Nw = function() {
};
d.rn = function(a, b, c) {
  (a = $l(a)) ? b(a) : c("Invalid MDNS service");
};
chrome.cast.sk = {St:"video_out", Rt:"audio_out", cM:"video_in", YK:"audio_in"};
chrome.cast.hb = {pm:"cancel", TIMEOUT:"timeout", XK:"api_not_initialized", Jg:"invalid_parameter", pL:"extension_not_compatible", oL:"extension_missing", ry:"receiver_unavailable", dm:"session_error", Pq:"channel_error", wL:"load_media_failed"};
chrome.cast.fv = {CF:"available", DF:"unavailable"};
chrome.cast.Ot = {rD:"cast", mL:"dial", WJ:"custom"};
chrome.cast.ZL = {dL:"chrome", sL:"ios", WK:"android"};
chrome.cast.Xi = function(a, b) {
  this.code = a;
  this.description = b || null;
  this.details = null;
};
chrome.cast.YL = function(a) {
  this.platform = a;
  this.packageId = this.url = null;
};
chrome.cast.tL = function(a) {
  this.url = a;
  this.width = this.height = null;
};
chrome.cast.Pt = function() {
  this.level = 0;
  this.muted = !1;
};
var bm = {STOP_MEDIA:"STOP", MEDIA_SET_VOLUME:"SET_VOLUME", MEDIA_GET_STATUS:"GET_STATUS"};
var cm = function(a, b, c) {
  this.sessionId = a;
  this.namespaceName = b;
  this.message = c;
};
chrome.cast.media.AL = {LL:"play", JL:"pause", NEXT:"next", PL:"previous", UL:"seek", dM:"volume"};
chrome.cast.media.ml = {CJ:"generic", DJ:"movie", FJ:"tv_show", EJ:"music_track"};
chrome.cast.media.XJ = {IDLE:"IDLE", OL:"PLAYING", KL:"PAUSED", $K:"BUFFERING"};
chrome.cast.media.TL = {NL:"PLAYBACK_START", ML:"PLAYBACK_PAUSE"};
chrome.cast.media.kr = {VJ:"buffered", vL:"live", IL:"other"};
chrome.cast.media.QL = function() {
  this.customData = null;
};
chrome.cast.media.RL = function() {
  this.customData = null;
};
chrome.cast.media.XL = function() {
  this.customData = this.resumeState = this.currentTime = null;
};
chrome.cast.media.aM = function() {
  this.customData = null;
};
chrome.cast.media.oK = function() {
  this.volume = null;
};
chrome.cast.media.xL = function(a) {
  this.type = "LOAD";
  this.sessionId = this.requestId = null;
  this.media = a;
  this.autoplay = !0;
  this.customData = this.currentTime = null;
};
chrome.cast.media.qL = function() {
  this.type = chrome.cast.media.ml.CJ;
  this.releaseYear = this.images = this.subtitle = this.title = null;
};
chrome.cast.media.CL = function() {
  this.type = chrome.cast.media.ml.DJ;
  this.releaseYear = this.images = this.subtitle = this.studio = this.title = null;
};
chrome.cast.media.bM = function() {
  this.type = chrome.cast.media.ml.FJ;
  this.releaseYear = this.images = this.episodeNumber = this.seasonNumber = this.episodeTitle = this.seriesTitle = null;
};
chrome.cast.media.DL = function() {
  this.type = chrome.cast.media.ml.EJ;
  this.releaseYear = this.images = this.discNumber = this.trackNumber = this.artistName = this.songName = this.albumName = null;
};
chrome.cast.media.BL = function(a, b) {
  this.contentId = a;
  this.streamType = chrome.cast.media.kr.VJ;
  this.contentType = b;
  this.customData = this.duration = this.metadata = null;
};
chrome.cast.media.zL = function(a, b) {
  this.sessionId = a;
  this.mediaSessionId = b;
  this.media = null;
  this.playbackRate = 1;
  this.playerState = chrome.cast.media.XJ.IDLE;
  this.currentTime = 0;
  this.supportedMediaCommands = [];
  this.volume = new chrome.cast.Pt;
  this.customData = null;
};
chrome.cast.ZK = function(a, b, c) {
  this.sessionRequest = a;
  this.sessionListener = b;
  this.receiverListener = c;
};
chrome.cast.$L = function(a, b) {
  this.appId = a;
  this.capabilities = b || [chrome.cast.sk.St, chrome.cast.sk.Rt];
  this.customReceiverList = this.dialAppName = null;
};
chrome.cast.oK = function(a) {
  this.volume = a;
  this.expectedVolume = null;
};
chrome.cast.sD = function(a, b, c, e, f) {
  this.label = a;
  this.friendlyName = b;
  this.receiverType = c;
  this.capabilities = e || null;
  this.volume = f || null;
};
chrome.cast.tD = function(a, b, c, e, f) {
  this.sessionId = a;
  this.appId = b;
  this.displayName = c;
  this.statusText = null;
  this.appImages = e;
  this.receiver = f;
  this.senderApps = [];
  this.namespaces = [];
  this.customData = null;
  this.media = [];
};
var dm = function(a) {
  return "urn:x-cast:com.google.cast." + a;
}, em = dm("tp.connection"), fm = dm("tp.heartbeat"), gm = dm("receiver"), hm = dm("media"), im = function(a) {
  switch(a) {
    case em:
    ;
    case fm:
    ;
    case gm:
    ;
    case hm:
      return!0;
    default:
      return!1;
  }
};
var jm = function() {
  this.type = "GET_STATUS";
  this.requestId = null;
};
var km = function(a, b) {
  var c;
  if (b.applications && 1 == b.applications.length) {
    c = b.applications[0];
    var e = new chrome.cast.tD(c.sessionId, c.appId, c.displayName, c.appImages, new chrome.cast.sD(a.c(), a.xd(), chrome.cast.Ot.rD, [chrome.cast.sk.St, chrome.cast.sk.Rt], new chrome.cast.Pt));
    e.senderApps = c.senderApps;
    e.namespaces = c.namespaces;
    c = e;
  } else {
    c = null;
  }
  return c;
}, lm = function(a, b) {
  if (a.statusText != b.statusText) {
    return!0;
  }
  for (var c = a.namespaces || [], e = b.namespaces || [], f = 0;f < c.length;f++) {
    if (0 > e.indexOf(c[f])) {
      return!0;
    }
  }
  return JSON.stringify(a.customData) != JSON.stringify(b.customData);
};
var mm = function(a) {
  return!!a && null != a.sessionId && null != a.namespaceName && !im(a.namespaceName);
}, nm = function(a) {
  return a ? null != a.appId ? a.customReceiverList ? !A(a.customReceiverList, function(a) {
    return!(0 == a.label.lastIndexOf("custom", 0) && a.receiverType == chrome.cast.Ot.WJ && null != a.friendlyName && null === a.capabilities);
  }) : !0 : !1 : !1;
};
var om = function(a, b, c, e) {
  this.type = a;
  this.message = b;
  this.seqNum = c || null;
  this.clientId = e || null;
  this.appOrigin = null;
};
var pm = function(a) {
  this.type = "LAUNCH";
  this.requestId = null;
  this.appId = a;
};
var qm = function() {
  this.type = "CONNECT";
  this.origin = {};
};
var rm = function(a, b) {
  L.call(this, "cast_channel_message");
  this.message = a;
  this.receiverId = b;
};
u(rm, L);
var sm = function(a, b) {
  L.call(this, "cast_channel_error");
  this.error = a;
  this.receiverId = b;
};
u(sm, L);
var tm = function(a) {
  O.call(this);
  this.Jb = a;
  this.a = G("cv2.CastChannelService");
  this.ej = new B;
  this.Mi = new B;
  this.wh = new B;
};
u(tm, O);
d = tm.prototype;
d.A = function() {
  chrome.cast.channel.onMessage.addListener(s(this.en, this));
  chrome.cast.channel.onError.addListener(s(this.Gh, this));
};
d.Il = function(a, b, c, e, f) {
  var g = f || "receiver-0";
  a = this.qo(a);
  return Qe(a, function(a) {
    return this.iI(a.Ia(), b, c, e, g);
  }, this);
};
d.gG = function(a, b) {
  var c = this.ej.get(a);
  if (c) {
    var e = this.wh.get(c.channelId);
    e && e.remove(b.destinationId + "#" + b.sourceId);
    e = {namespace_:em, data:JSON.stringify({type:"CLOSE"}), sourceId:b.destinationId, destinationId:b.sourceId};
    chrome.cast.channel.send(c, e, m);
  }
};
d.en = function(a, b) {
  this.a.info("Got message " + JSON.stringify(b) + " from " + JSON.stringify(a));
  var c = this.Mi.get(a.channelId);
  if (c) {
    if (im(b.namespace_)) {
      var e = JSON.parse(b.data);
      if ("CLOSE" == e.type) {
        this.Xz(a, b);
        return;
      }
      if ("PING" == e.type) {
        c = {namespace_:fm, data:JSON.stringify({type:"PONG"}), sourceId:b.destinationId, destinationId:b.sourceId};
        chrome.cast.channel.send(a, c, m);
        return;
      }
    }
    this.dispatchEvent(new rm(b, c));
  } else {
    this.a.e("This message is from unknown receiver.");
  }
};
d.Xz = function(a, b) {
  var c = this.wh.get(a.url);
  if (c) {
    var e = b.destinationId + "#" + b.sourceId;
    this.a.info("Removing virtual connection " + e);
    c.remove(e);
  }
};
d.Gh = function(a) {
  this.a.info("Channel error: " + JSON.stringify(a));
  var b = this.Mi.get(a.channelId);
  b && (this.Mi.remove(a.channelId), this.ej.remove(b), this.wh.remove(a.channelId), chrome.cast.channel.close(a, m), this.dispatchEvent(new sm(a.errorState, b)));
};
d.qo = function(a) {
  var b = this.ej.get(a.c());
  if (b && "open" == b.readyState) {
    return Ke(b);
  }
  var c = new I;
  this.a.ka("Connect to " + a.c());
  chrome.cast.channel.open(a.Zi(), s(function(b) {
    this.a.ka("Open-channel result: " + JSON.stringify(b));
    "open" == b.readyState ? (this.ej.set(a.c(), b), this.Mi.set(b.channelId, a.c()), c.ea(b)) : c.Ma(b.errorState);
  }, this));
  return c;
};
d.iI = function(a, b, c, e, f) {
  this.a.info("Channel is sending " + JSON.stringify(c));
  this.vA(a, e, f);
  b = {namespace_:b, data:r(c) ? c : JSON.stringify(c), sourceId:e, destinationId:f};
  this.a.ka("Send " + JSON.stringify(b) + " to " + JSON.stringify(a));
  var g = new I;
  chrome.cast.channel.send(a, b, s(function(a) {
    a.errorState ? g.Ma("Failed to send message") : g.ea(!0);
  }, this));
  return g;
};
d.vA = function(a, b, c) {
  var e = this.wh.get(a.channelId), f = b + "#" + c;
  e && e.contains(f) || (b = {namespace_:em, data:JSON.stringify(new qm), sourceId:b, destinationId:c}, this.a.info("Sending virtual connection request" + JSON.stringify(b)), e ? e.add(f) : (e = new Yb, e.add(f), this.wh.set(a.channelId, e)), chrome.cast.channel.send(a, b, m));
};
var um = function(a, b) {
  this.Zo = a;
  this.WH = b;
  this.ji = t();
  this.rc = this.zw = null;
};
d = um.prototype;
d.cA = function(a) {
  this.zw = a;
};
d.qF = function() {
  return this.zw;
};
d.tm = function() {
  this.ji = t();
};
d.Iv = function() {
  return this.ji;
};
d.Ba = function() {
  return this.Zo;
};
d.le = function() {
  return this.WH;
};
d.L = function() {
  return this.rc;
};
d.sg = function(a) {
  this.rc = a;
};
var vm = function() {
  this.a = G("cv2.CastClientRecord");
  this.xa = [];
};
d = vm.prototype;
d.A = function() {
};
d.Nl = function(a, b) {
  if (this.yj(a)) {
    return this.a.info("Client already exists."), null;
  }
  var c = new um(a, b);
  this.xa.push(c);
  return c;
};
d.Em = function(a) {
  return ub(this.xa, function(b) {
    return b.Ba() == a;
  });
};
d.xe = function(a) {
  return A(this.xa, function(b) {
    return b.Ba() == a;
  });
};
d.yj = function(a) {
  return!!this.xe(a);
};
d.ip = function() {
  return this.xa;
};
d.lI = function(a) {
  return!!this.Vu(a);
};
d.Vu = function(a) {
  return A(this.xa, function(b) {
    return b.L() == a;
  });
};
var wm = function(a) {
  L.call(this, "new_session");
  this.sessionId = a;
};
u(wm, L);
var xm = function(a, b, c) {
  this.mj = a;
  this.receiverId = b;
  this.session = c;
}, ym = function() {
  this.a = G("cv2.SessionRecords");
  this.kc = [];
};
d = ym.prototype;
d.qq = function(a, b, c) {
  var e = this.Jl(b);
  if (e) {
    if (e.sessionId != c.sessionId) {
      return this.a.e("Only support one session per receiver"), !1;
    }
    if (A(this.kc, function(e) {
      return e.mj == a && e.receiverId == b && e.session.sessionId == c.sessionId;
    })) {
      return this.a.info("Skipping duplicate record"), !1;
    }
  }
  this.kc.push(new xm(a, b, c));
  return!0;
};
d.Hu = function(a) {
  this.kc = kb(this.kc, function(b) {
    return b.receiverId != a;
  });
};
d.EF = function(a, b) {
  this.kc = kb(this.kc, function(c) {
    return c.mj != a || c.session.sessionId != b;
  });
};
d.Yi = function(a) {
  var b = new Yb;
  this.kc.forEach(function(c) {
    c.session.sessionId == a && b.add(c.mj);
  });
  return b.R();
};
d.Jl = function(a) {
  var b = A(this.kc, function(b) {
    return b.receiverId == a;
  });
  return b ? b.session : null;
};
d.kz = function(a, b) {
  var c = A(this.kc, function(c) {
    return c.mj == a && c.session.sessionId == b;
  });
  return c ? c.receiverId : null;
};
d.WE = function(a) {
  var b = A(this.kc, function(b) {
    return b.session.sessionId == a;
  });
  return b ? b.session : null;
};
d.Gy = function(a, b) {
  var c = A(this.kc, function(c) {
    return c.session.appId == a && c.receiverId == b;
  }, this);
  return c ? c.session : null;
};
var zm = function() {
  this.yf = new B;
  this.a = G("cv.TabMessenger");
  this.fc = new Ll;
};
d = zm.prototype;
d.A = function() {
  chrome.runtime.onConnectExternal.addListener(s(this.CK, this));
};
d.nB = function(a) {
  this.a.ka("Sending to api: " + JSON.stringify(a));
  var b = this.yf.get(a.clientId);
  b ? b.postMessage(a) : this.a.e("Trying to send message without existing port for clientId " + a.clientId);
};
d.CK = function(a) {
  this.a.ka("App connecting: " + JSON.stringify({clientId:a.name, sender:a.sender}));
  this.yf.get(a.name) && this.a.info("Replacing existing port for client ID:" + a.name);
  this.yf.set(a.name, a);
  a.onMessage.addListener(s(this.VA, this));
  a.onDisconnect.addListener(s(this.UA, this, a.name));
};
d.VA = function(a) {
  this.a.info("API message: " + JSON.stringify(a));
  var b = this.yf.get(a.clientId);
  b ? this.fc.Km(a.type, b.sender, a) : this.a.e("Got message without existing port for clientId " + a.clientId);
};
d.UA = function(a) {
  this.a.info("Client disconnected " + a);
  var b = new om("client_disconnect", null);
  b.clientId = a;
  var c = this.yf.get(a);
  c && (this.yf.remove(a), this.fc.Km(b.type, c.sender, b));
};
d.listen = function(a, b, c) {
  return this.fc.Sw(a, b, c);
};
d.Yc = function(a, b, c) {
  return this.fc.Tw(a, b, c);
};
d.Yf = function(a) {
  return this.fc.ii(a);
};
var Am = function(a, b, c, e) {
  O.call(this);
  this.Q = a;
  this.Jb = b;
  this.a = G("cv2.CastService");
  this.dr = 1E3 * Math.floor(1E5 * Math.random());
  this.na = new vm;
  this.nb = new ym;
  this.Og = new B;
  this.T = c;
  this.fm = e;
  this.ra = new tm(this.Jb);
  this.je = null;
  this.t = new P(this);
};
u(Am, O);
d = Am.prototype;
d.cr = function() {
  var a = this.dr++;
  0 == a && (a = this.dr++);
  return a;
};
d.A = function() {
  this.Q.listen("extension_version", this.FC, this);
  this.Q.listen("request_session", this.JC, this);
  this.Q.listen("client_init", this.EC, this);
  this.Q.listen("v2_message", this.BC, this);
  this.Q.listen("app_message", this.CC, this);
  this.Q.listen("client_disconnect", this.DC, this);
  this.na.A();
  this.ra.A();
  this.t.listen(this.ra, "cast_channel_message", this.HC);
  this.t.listen(this.ra, "cast_channel_error", this.Gh);
  this.t.listen(this.T, "receiver_list", this.GC);
  this.t.listen(this.T, "remove_receiver", this.IC);
};
d.k = function() {
  Am.q.k.call(this);
  this.t.W();
};
d.GC = function() {
  this.na.ip().forEach(function(a) {
    this.Mm(a);
  }, this);
  this.JH();
};
d.IC = function() {
};
d.JH = function() {
  this.T.Tc().forEach(function(a) {
    this.qH(a);
  }, this);
};
d.qH = function(a) {
  this.a.info("Query receiver status: " + JSON.stringify(a));
  var b = new jm;
  b.requestId = this.cr();
  b = this.ra.Il(a, gm, b, this.Jb);
  Oe(b, function() {
    this.a.info("Failed to connect to receiver: " + a.c());
  }, this);
};
d.Gh = function(a) {
  this.nb.Hu(a.receiverId);
};
d.HC = function(a) {
  var b = a.receiverId;
  a = a.message;
  this.a.info("Receive message " + JSON.stringify(a) + " from " + JSON.stringify(b));
  im(a.namespace_) ? this.FB(b, a) : this.EB(b, a);
};
d.FB = function(a, b) {
  if (this.Tz(a, b)) {
    var c = JSON.parse(b.data);
    switch(c.type) {
      case "RECEIVER_STATUS":
        this.Wz(a, b);
        break;
      case "MEDIA_STATUS":
        this.Vz(a, b);
        break;
      case "LAUNCH_ERROR":
      ;
      case "INVALID_REQUEST":
      ;
      case "LOAD_CANCELLED":
      ;
      case "LOAD_FAILED":
      ;
      case "INVALID_PLAYER_STATE":
        this.Uz(a, b);
      default:
        this.a.e("Unknown Cast protocol message" + JSON.stringify(c));
    }
  } else {
    this.a.info("Invalid destination: " + JSON.stringify(b));
  }
};
d.Tz = function(a, b) {
  if ("*" == b.destinationId || b.destinationId == this.Jb || this.na.yj(b.destinationId)) {
    return!0;
  }
  this.ra.gG(a, b);
  return!1;
};
d.EB = function(a, b) {
  if (b.sourceId && "*" != b.sourceId && "receiver-0" != b.sourceId) {
    var c = [];
    if ("*" == b.destinationId) {
      c = this.nb.Yi(b.sourceId);
    } else {
      c = this.na.xe(b.destinationId);
      if (!c) {
        this.a.e("App message received for unknown destination id " + b.destinationId + ".  Ignoring.");
        return;
      }
      c = [c.Ba()];
    }
    var e = new cm(b.sourceId, b.namespace_, b.data);
    c.forEach(function(a) {
      this.Qa(new om("app_message", e, null, a));
    }, this);
  } else {
    this.a.e("App message received from illegal source id " + b.sourceId + ".  Ignoring.");
  }
};
d.Vz = function(a, b) {
  var c = JSON.parse(b.data);
  if (c) {
    var e = b.sourceId;
    c.status && c.status.forEach(function(a) {
      a.sessionId = e;
    });
    ga(c.requestId) && !this.Hr(c.requestId, c) && (this.a.info("Sending media status to clients..."), this.nb.Yi(e).forEach(function(a) {
      this.Qa(new om("v2_message", c, null, a));
    }, this));
  }
};
d.Uz = function(a, b) {
  var c = JSON.parse(b.data);
  if (c) {
    var e = String(c.requestId);
    if (e) {
      var f = this.Og.get(e);
      f && (f.Ma(new chrome.cast.Xi(chrome.cast.hb.dm, c.reason || c.type)), this.Og.remove(e));
    }
  }
};
d.Wz = function(a, b) {
  var c = JSON.parse(b.data);
  if (c && (!ga(c.requestId) || !this.Hr(c.requestId, c.status))) {
    var e = this.T.xg(a), f = c.status && km(e, c.status);
    if (f && f.sessionId && "00000000-0000-0000-0000-000000000000" != f.appId) {
      (g = this.nb.WE(f.sessionId)) && lm(g, f) ? (c = this.nb.Yi(f.sessionId), c.forEach(function(a) {
        this.Qa(new om("update_session", f, null, a));
      }, this)) : g || (this.nb.qq(this.Jb, a, f), this.dispatchEvent(new wm(f.sessionId)));
    } else {
      var g = this.nb.Jl(a);
      g && (c = this.nb.Yi(g.sessionId), c.forEach(function(a) {
        this.Qa(new om("remove_session", g.sessionId, null, a));
      }, this), this.nb.Hu(a));
    }
  }
};
d.FC = function(a, b) {
  this.Vc(b, a);
  var c = chrome.runtime.getManifest().version;
  this.Qa(new om("extension_version", c, b.seqNum, b.clientId));
};
d.Vc = function(a, b) {
  var c = w(a.clientId), e = this.na.xe(c);
  e && e.le() && e.le() != a.appOrigin && (this.a.e("Exiting client has different origin"), this.na.Em(a.clientId), e = null);
  e || (this.na.Nl(c, a.appOrigin), e = this.na.xe(c), b && b.tab && e.sg(b.tab.id));
  e.tm();
  return e;
};
d.Rq = function(a, b) {
  var c = this.nb.kz(a, b);
  return c ? this.T.xg(c) : (this.a.e("No receiver found"), null);
};
d.BC = function(a, b) {
  this.Ri(b);
  var c = this.Vc(b, a), e = b.message.sessionId;
  if (e) {
    var f = this.Rq(w(b.clientId), e);
    if (f) {
      switch(b.message.type) {
        case "STOP":
          this.$y(b, f);
          break;
        case "LOAD":
          var g = b.message, k;
          (k = !g || !r(g.sessionId) || null == g.media || null != g.autoplay && "boolean" != typeof g.autoplay || null != g.currentTime && !ga(g.currentTime)) || (g = g.media, k = !(g && r(g.contentId) && !(1E3 < g.contentId.length) && Jb(chrome.cast.media.kr, g.streamType) && r(g.contentType) && (null == g.duration || ga(g.duration))));
          if (k) {
            this.ec(c, b, chrome.cast.hb.Jg, "");
            break;
          }
        ;
        case "PAUSE":
        ;
        case "PLAY":
        ;
        case "SEEK":
        ;
        case "STOP_MEDIA":
        ;
        case "MEDIA_SET_VOLUME":
        ;
        case "MEDIA_GET_STATUS":
          this.Zy(b, f, e);
          break;
        default:
          this.a.e("Unknown request : " + JSON.stringify(b));
      }
    } else {
      this.ec(c, b, chrome.cast.hb.dm, "No receiver for this session");
    }
  } else {
    this.ec(c, b, chrome.cast.hb.Jg, "Missing session ID"), this.a.e("No session ID");
  }
};
d.$y = function(a, b) {
  var c = a.message;
  if (c.sessionId) {
    var e = s(function() {
      this.nb.EF(w(a.clientId), w(c.sessionId));
      this.Qa(new om("STOP_SESSION_SUCCESS", null, a.seqNum, a.clientId));
    }, this);
    this.Vg(!0, a, c, b, e, gm, w(a.clientId));
  } else {
    this.ec(this.Vc(a), a, chrome.cast.hb.Jg, "session ID is missing");
  }
};
d.Zy = function(a, b, c) {
  var e = a.message.type, f = 2E3;
  "LOAD" == e && (f = 5E3);
  e in bm && (a.message.type = bm[e]);
  e = s(function(b) {
    this.Qa(new om("v2_message", b, a.seqNum, a.clientId));
  }, this);
  this.Vg(!0, a, $a(a.message), b, e, hm, w(a.clientId), c, f);
};
d.CC = function(a, b) {
  this.Ri(b);
  var c = this.Vc(b, a);
  if (mm(b.message)) {
    var e = this.Rq(w(b.clientId), b.message.sessionId);
    e ? (e = this.ra.Il(e, b.message.namespaceName, b.message.message, c.Ba(), b.message.sessionId), Ne(e, function() {
      this.Qa(new om("app_message_success", {}, b.seqNum, b.clientId));
    }, this), Oe(e, function() {
      this.a.info("No channel to receiver.");
      this.ec(c, b, chrome.cast.hb.Pq, "Channel to receiver not available");
    }, this)) : (this.ec(c, b, chrome.cast.hb.dm, "No receiver for this session"), this.a.e("No receiver for app message"));
  } else {
    this.ec(c, b, chrome.cast.hb.Jg, "");
  }
};
d.DC = function(a, b) {
  w(b.clientId);
  this.na.Em(b.clientId);
};
d.Ri = function(a) {
  "log_message" != a.type && Yc(this.a, "App request: " + a.type, a);
};
d.ec = function(a, b, c, e) {
  a = new chrome.cast.Xi(c);
  a.description = e;
  this.Qa(new om("error", a, b.seqNum, b.clientId));
};
d.EC = function(a, b) {
  this.a.info("Set session request" + JSON.stringify(b));
  var c = b.message, e = this.Vc(b, a);
  e.cA(c);
  if (a.tab && this.fm.bA(a.tab.id)) {
    this.fm.dA();
    var f = w(this.fm.aA());
    this.T.xg(f) ? (this.a.info("Auto transition from mirroring to flinging"), c = new om("request_session", c), c.clientId = e.Ba(), c.appOrigin = e.le(), this.Ol(c, f)) : this.Mm(e);
  } else {
    this.Mm(e);
  }
};
d.Mm = function(a) {
  var b = 0 < this.T.Tc().length ? chrome.cast.fv.CF : chrome.cast.fv.DF;
  this.Qa(new om("receiver_availability", b, null, a.Ba()));
};
d.mD = function() {
  var a = [], b = this.T.Tc();
  this.a.info("there are " + b.length + " receivers");
  b.forEach(function(b) {
    var e = new Sl(b.c(), b.xd());
    b = this.nb.Jl(b.c());
    var f = null;
    b && (f = new Tl(b.sessionId, e, b.appImages && 0 < b.appImages.length ? b.appImages[0].url : null, b.statusText || b.displayName, !1, null, 0, !1, !1), this.a.info("Popup activity : " + JSON.stringify(f)));
    a.push(new Vl(e, f));
  }, this);
  return a;
};
d.isAppInTab = function(a) {
  return this.na.lI(a);
};
d.hB = function(a) {
  if (this.je) {
    this.je.ea(a), this.je = null;
  } else {
    if ("cast_this_tab" == a.type) {
      var b = s(function(b) {
        if (b && (b = this.na.Vu(b.id))) {
          var e = a.message, f = new om("request_session", b.qF());
          f.clientId = b.Ba();
          f.appOrigin = b.le();
          this.Ol(f, e);
        }
      }, this);
      Bm(b);
    }
  }
};
d.JC = function(a, b) {
  this.a.info("Request session" + JSON.stringify(b));
  var c = b.message, e = this.Vc(b, a);
  nm(c) ? 0 == this.T.Tc().length ? this.ec(e, b, chrome.cast.hb.ry, "") : a.tab ? (c = s(function(c) {
    c ? chrome.browserAction.openPopup(s(function(a) {
      var c = new I;
      this.je = c;
      Ne(c, function(a) {
        "cast_this_tab" == a.type ? this.Ol(b, a.message) : (this.a.info("User did not select device to cast."), this.ec(e, b, chrome.cast.hb.pm, "Canceled by user"));
      }, this);
      this.Gq(c, b, chrome.cast.hb.pm);
      a.addEventListener("unload", s(function() {
        this.a.info("Popup window closed.");
        this.je && (this.a.info("User closed popup; cancelling request session"), this.je.Ma(new chrome.cast.Xi(chrome.cast.hb.pm, "User closed popup")), this.je = null);
      }, this), !1);
    }, this)) : this.a.info("Discard session request from inactive tab: " + JSON.stringify(a));
  }, this), Cm(a.tab, c)) : this.a.e("only handle tab request now") : this.ec(e, b, chrome.cast.hb.Jg, "");
};
d.Ol = function(a, b) {
  var c = this.T.xg(b);
  if (c) {
    this.a.info("The device is: " + JSON.stringify(c));
    var e = this.Vc(a), f = this.nb.Gy(a.message.appId, c.c());
    f ? this.Hy(a, f, c, e) : this.Iy(a, c, e);
  } else {
    this.a.info("NO device found");
  }
};
d.Iy = function(a, b, c) {
  var e = new pm(a.message.appId), f = s(function(c) {
    c = km(b, c);
    v(c);
    this.tw(!1, a, b, c);
  }, this);
  this.Vg(!0, a, e, b, f, gm, c.Ba(), "receiver-0", 8E3);
};
d.Hy = function(a, b, c, e) {
  var f = s(this.tw, this, !0, a, c, b);
  this.Vg(!1, a, new qm, c, f, em, e.Ba(), b.sessionId);
};
d.tw = function(a, b, c, e) {
  if (b.clientId) {
    this.a.info("onNewSession_ " + a);
    var f = e.namespaces.some(function(a) {
      return a == hm || a.name == hm;
    });
    a && f ? (this.a.info("found media namespace"), a = s(this.Er, this, b, c, e), this.Vg(!0, b, {type:"GET_STATUS"}, c, a, hm, b.clientId, e.sessionId)) : (this.a.info("did not find media namespace"), this.Er(b, c, e, null));
  } else {
    this.a.e("Missing client ID.");
  }
};
d.Er = function(a, b, c, e) {
  a.clientId ? (this.nb.qq(a.clientId, b.c(), c), this.a.info("Dispatching CastServiceNewSessionEvent"), this.dispatchEvent(new wm(c.sessionId)), e && (c.media = e.status), this.Qa(new om("new_session", c, a.seqNum, a.clientId))) : this.a.e("Missing client ID.");
};
d.Qa = function(a) {
  Yc(this.a, "Sending message to client " + a.clientId + ":" + a.type, a);
  this.Q.nB(a);
};
d.Vg = function(a, b, c, e, f, g, k, l, q) {
  this.Vc(b);
  a && (c.requestId = this.cr());
  var x = this.ra.Il(e, g, c, k, l);
  a && (x = new I, this.Og.set(c.requestId, x));
  Q(function() {
    x.cancel();
  }, q || 2E3);
  Ne(x, f);
  this.Gq(x, b, chrome.cast.hb.Pq);
};
d.Gq = function(a, b, c) {
  var e = this.Vc(b);
  Oe(a, function(a) {
    var g;
    a instanceof Sd ? (g = chrome.cast.hb.TIMEOUT, a = "Timeout at extension") : a instanceof chrome.cast.Xi ? (g = a.code, a = a.description) : g = c;
    this.ec(e, b, g, a);
  }, this);
};
d.Hr = function(a, b) {
  var c = String(a), e = this.Og.get(c);
  e && (e.ea(b), this.Og.remove(c));
  return!!e;
};
var Dm = G("cv.TabUtils"), Em = null, Fm = function(a) {
  a != chrome.windows.WINDOW_ID_NONE && (Dm.info("Newly focused window ID: " + a), Em = a);
}, Gm = function() {
  chrome.windows.getLastFocused(function(a) {
    Em || (Em = a.id);
  });
  chrome.windows.onFocusChanged.addListener(Fm);
}, Bm = function(a) {
  Em ? chrome.tabs.query({active:!0, windowId:Em}, function(b) {
    b && 1 == b.length ? a(b[0]) : a(null);
  }) : a(null);
}, Cm = function(a, b) {
  a.active || b(!1);
  chrome.windows.get(a.windowId, function(a) {
    b(a.focused);
  });
}, Im = function(a, b) {
  chrome.windows.getLastFocused(function(c) {
    chrome.tabs.query({active:!0, windowId:c.id}, function(e) {
      Hm(e[0], function(e) {
        if (e && e.width && e.height && 0 != e.width && 0 != e.height) {
          var g = c.width / e.width;
          5.1 < g || 0.24 > g ? (Dm.info("Invalid computed zoom level: " + g), b(!1)) : (e = Math.round(c.width / a + (c.height - e.height * g)), Dm.info("Win resizing: width = " + c.width + ", height = " + c.height + ", newHeight = " + e + ", zoomLevel = " + g), chrome.windows.update(c.id, {height:e}), b(!0));
        } else {
          Dm.info("Failed to get inner tab dimension"), b(!1);
        }
      });
    });
  });
}, Hm = function(a, b) {
  if (a.url && 0 != a.url.lastIndexOf("chrome://", 0)) {
    try {
      chrome.tabs.executeScript(a.id, {code:'chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {  if (request.type == "get_window_size") {   sendResponse({width: window.innerWidth, height: window.innerHeight});  }});'}, function() {
        try {
          chrome.tabs.sendRequest(a.id, {type:"get_window_size"}, function(a) {
            b(a);
          });
        } catch (c) {
          b(null);
        }
      });
    } catch (c) {
      b(null);
    }
  } else {
    b(null);
  }
}, Km = function(a, b) {
  chrome.tabs.get(a, function(a) {
    Jm(a, b);
  });
}, Jm = function(a, b) {
  if (a) {
    var c = a.id;
    chrome.windows.update(a.windowId, {focused:!0}, function() {
      chrome.tabs.update(c, {active:!0}, b);
    });
  } else {
    b(null);
  }
}, Lm = function(a) {
  if (Ae(a)[1]) {
    return Be(a);
  }
  Dm.e("Got a URL without scheme: " + a);
  return Be("http://" + a);
};
var Mm = function(a, b) {
  v(a || b, "Must specify one of localData or registryData");
  this.ya = a || null;
  this.Va = b || null;
  this.bw = new B;
};
d = Mm.prototype;
d.dc = function() {
  return this.ya;
};
d.Vq = function() {
  return this.Va;
};
d.equals = function(a) {
  if (!(a instanceof Mm)) {
    return!1;
  }
  if (this.ya) {
    if (!this.ya.equals(a.ya)) {
      return!1;
    }
  } else {
    if (a.ya) {
      return!1;
    }
  }
  if (this.Va) {
    if (!this.Va.equals(a.Va)) {
      return!1;
    }
  } else {
    if (a.Va) {
      return!1;
    }
  }
  return!0;
};
d.lj = function(a) {
  a instanceof Mm && (this.ya = a.ya, this.Va = a.Va);
};
d.fo = function() {
  return(!this.ya || this.ya.ae) && (!this.Va || this.Va.ae);
};
d.fs = function(a) {
  this.ya && (this.ya.ae = a);
  this.Va && (this.Va.ae = a);
};
d.c = function() {
  return this.ya ? this.ya.id : this.Va.id;
};
d.mk = function() {
  return!this.ya || this.ya.ae ? this.Va.id : this.ya.we;
};
d.xd = function() {
  return this.ya && !this.ya.ae ? this.ya.friendlyName : this.Va && !this.Va.ae ? this.Va.friendlyName : "";
};
d.Bm = function(a) {
  return this.bw.get(a, "unknown");
};
d.rf = function(a, b) {
  v("available" == b || "unavailable" == b);
  this.bw.set(a, b);
};
d.TD = function() {
  return "available" == this.Bm("ChromeCast");
};
d.Rg = function() {
  return null != this.ya && this.ya.Rg;
};
d.isLocal = function() {
  return null != this.dc();
};
d.Wv = function() {
  return!1;
};
var Nm = function(a, b, c, e, f, g, k) {
  this.id = a;
  this.vf = b;
  this.friendlyName = c;
  this.we = e;
  this.ipAddress = f;
  this.gc = g;
  this.configId = k || null;
  this.Rg = this.ae = !1;
  this.re();
};
Nm.prototype.a = G("cv.Receiver.LocalData");
Nm.prototype.equals = function(a) {
  return a ? this.id == a.id && this.vf == a.vf && this.friendlyName == a.friendlyName && this.ipAddress == a.ipAddress && this.gc == a.gc : !1;
};
Nm.prototype.re = function() {
  v(this.id, "id not set");
  v(this.we, "uniqueId not set");
  v(this.ipAddress, "ipAddress not set");
  v(this.gc, "appUrl not set");
};
var Om = function(a, b) {
  this.id = a;
  this.friendlyName = b;
  this.ae = !1;
  this.receiverType = "appEngine";
};
Om.prototype.equals = function(a) {
  return a ? this.id == a.id && this.friendlyName == a.friendlyName : !1;
};
Mm.prototype.wm = function() {
  return null != this.Va && "cloud" == this.Va.receiverType;
};
var Pm = function(a, b) {
  var c = new Om(a, b + " (Cloud)");
  c.receiverType = "cloud";
  c = new Mm(null, c);
  c.rf("ChromeCast", "available");
  return c;
};
Mm.prototype.cK = function() {
  var a = new dd(this.c(), this.xd());
  this.dc() && (a.ipAddress = this.dc().ipAddress);
  return a;
};
Mm.prototype.eE = function() {
  return new Sl(this.c(), this.xd());
};
var Qm = function(a, b, c) {
  Ye.call(this);
  this.a = G("cv.sender.ChannelService");
  this.ly = b;
  this.Dl = c || null;
  this.sf = null;
  this.T = a;
};
u(Qm, Ye);
d = Qm.prototype;
d.A = function() {
  Qm.q.A.call(this);
  this.gb.listen(this.T, "remove_receiver", this.DD);
};
d.DD = function(a) {
  this.he(a.receiver.c());
};
d.qf = function(a) {
  this.a.info("Attempting to create a channel to " + a.c());
  if (!(a instanceof Mm)) {
    return Le("Sender-to-sender connection is not supported");
  }
  var b;
  a.dc() ? (this.a.info("Creating local channel..."), b = this.ly.qf(a)) : b = this.By(a);
  Q(function() {
    "pending" == b.X() && (this.a.info("Channel creation timeout"), b.cancel());
  }, 8E3, this);
  return Qe(b, function(a) {
    return this.Dy(a.Ia());
  }, this);
};
d.By = function(a) {
  if (!a.Vq()) {
    return Le("No registry data: " + a.c());
  }
  if (a.wm()) {
    return null != this.sf ? (this.a.info("Creating Cloud LCS channel..."), this.sf.qf(a)) : Le("No proper cloud channel factory exists");
  }
  this.a.info("Creating AppEngine channel...");
  return this.Dl.qf(a);
};
d.Dz = function(a) {
  v(null == this.sf);
  this.sf = a;
};
d.Dy = function(a) {
  if (a.oa()) {
    return Ke(a);
  }
  if (a.MD()) {
    return Le(a.getError() || "New channel to " + a.U + "was disconnected already.");
  }
  var b = new I;
  pe(a, "a", function(c) {
    "pending" == b.X() && ("connected" == c.Gg ? b.ea(a) : b.Ma(a.getError() || "Error creating channel to " + a.U));
  }, void 0, this);
  Q(function() {
    a.LD() && a.disconnect("Channel is not connected in 3 seconds");
  }, 3E3, this);
  return b;
};
var Rm = function() {
  this.LF = this.Kl = null;
  this.bv = [];
}, Sm = function() {
  this.imageUrl = this.description = null;
}, Tm = function() {
  this.name = "unknown";
  this.state = "error";
  this.JF = null;
  this.IF = !0;
  this.Rk = this.serviceData = this.KF = null;
  this.extraData = {};
}, Vm = function(a, b) {
  v(a.dc(), "Receiver must be available via LAN to support DIAL.");
  this.Oa = a;
  var c;
  (c = b) || (Um || (Um = new Rh(3, null, 1, 10, 2E3)), c = Um);
  this.hc = c;
  this.a = G("cv.DialClient");
}, Um = null, Wm = 999;
d = Vm.prototype;
d.launchApp = function(a, b, c) {
  var e = (++Wm).toString();
  this.hc.send(e, this.np(a), "POST", c, null, 0, this.Kw("launchApp", "POST", b));
  return e;
};
d.lr = function(a, b) {
  var c = (++Wm).toString();
  this.hc.send(c, this.np(a), "DELETE", null, null, 0, this.Kw("stopApp", "DELETE", b), 0);
  return c;
};
d.nq = function(a) {
  var b = (++Wm).toString();
  this.hc.send(b, this.Oa.dc().gc, "GET", null, null, 0, s(this.Dv, this, a));
  return b;
};
d.Sl = function(a, b) {
  var c = (++Wm).toString();
  this.hc.send(c, this.np(a), "GET", null, null, 0, s(this.Dv, this, b));
  return c;
};
d.Dv = function(a, b) {
  var c = b.target;
  this.sj("GetAppInfo", "GET", c);
  if (c.ja()) {
    var e = c.zr();
    e || (e = Sj(c.Xb()));
    if (e) {
      var f = e.getElementsByTagName("service");
      if (f && 1 == f.length) {
        for (var e = new Tm, g = 0, k = f[0].childNodes.length;g < k;g++) {
          var l = f[0].childNodes[g];
          if ("state" == l.nodeName) {
            e.state = l.textContent;
          } else {
            if ("name" == l.nodeName) {
              e.name = l.textContent;
            } else {
              if ("link" == l.nodeName) {
                e.KF = l.getAttribute("href");
              } else {
                if ("options" == l.nodeName) {
                  e.IF = "true" == l.getAttribute("allowStop");
                } else {
                  if ("servicedata" == l.nodeName && "urn:chrome.google.com:cast" == l.namespaceURI) {
                    for (var q = e, x = new Rm, D = 0, R = l.childNodes.length;D < R;D++) {
                      var N = l.childNodes[D];
                      if ("connectionSvcURL" == N.nodeName) {
                        x.Kl = N.textContent;
                      } else {
                        if ("applicationContext" == N.nodeName) {
                          x.LF = N.textContent;
                        } else {
                          if ("protocols" == N.nodeName) {
                            for (var Vg = 0;Vg < N.childNodes.length;Vg++) {
                              var jk = N.childNodes[Vg];
                              "protocol" == jk.nodeName && x.bv.push(jk.textContent);
                            }
                          }
                        }
                      }
                    }
                    q.serviceData = x;
                  } else {
                    if ("activity-status" == l.nodeName && "urn:chrome.google.com:cast" == l.namespaceURI) {
                      q = e;
                      x = new Sm;
                      D = 0;
                      for (R = l.childNodes.length;D < R;D++) {
                        N = l.childNodes[D], "description" == N.nodeName ? x.description = N.textContent : "image" == N.nodeName && (x.imageUrl = N.getAttribute("src"));
                      }
                      q.Rk = x;
                    } else {
                      e.extraData[l.nodeName] = l.textContent;
                    }
                  }
                }
              }
            }
          }
        }
        if ("unknown" == e.name) {
          a(c, null, "GET response missing name value");
        } else {
          if ("error" == e.state) {
            a(c, null, "GET response missing state value");
          } else {
            if ((f = /installable=(.+)/.exec(e.state)) && f[1]) {
              e.state = "installable", e.JF = f[1];
            } else {
              if ("running" != e.state && "stopped" != e.state) {
                a(c, null, "GET response has invalid state value");
                return;
              }
            }
            a(c, e, null);
          }
        }
      } else {
        a(c, null, "Invalid GET response (invalid service)");
      }
    } else {
      a(c, null, "Empty response");
    }
  } else {
    a(c, null, "Request to " + c.Wi() + " failed");
  }
};
d.np = function(a) {
  var b = this.Oa.dc().gc;
  "/" != b.charAt(b.length - 1) && (b += "/");
  return b + a;
};
d.abort = function(a) {
  this.hc.abort(a);
};
d.sj = function(a, b, c) {
  b = "[" + a + "]: " + b + " " + c.Wi() + " => " + c.Aa() + " (" + c.Yl() + ")";
  c.ja() ? (this.a.info(b), (c = c.Xb()) && 0 < c.length && this.a.ka("[" + a + "]: " + c)) : (b += ", error = " + c.ui() + " (" + c.Ve() + ")", this.a.info(b));
};
d.Kw = function(a, b, c) {
  return s(function(e) {
    e = e.target;
    this.sj(a, b, e);
    c(e);
  }, this);
};
var Ym = function(a, b) {
  this.Me = a || null;
  this.ye = !!b;
  this.P = new B;
  this.N = new Xm("", void 0);
  this.N.next = this.N.Ib = this.N;
};
d = Ym.prototype;
d.lw = function(a) {
  (a = this.P.get(a)) && this.ye && (a.remove(), this.Vv(a));
  return a;
};
d.get = function(a, b) {
  var c = this.lw(a);
  return c ? c.value : b;
};
d.set = function(a, b) {
  var c = this.lw(a);
  c ? c.value = b : (c = new Xm(a, b), this.P.set(a, c), this.Vv(c));
};
d.aJ = function() {
  return this.N.Ib.value;
};
d.shift = function() {
  return this.Rv(this.N.next);
};
d.pop = function() {
  return this.Rv(this.N.Ib);
};
d.remove = function(a) {
  return(a = this.P.get(a)) ? (this.removeNode(a), !0) : !1;
};
d.removeNode = function(a) {
  a.remove();
  this.P.remove(a.key);
};
d.J = function() {
  return this.P.J();
};
d.vb = function() {
  return this.P.vb();
};
d.fb = function() {
  return this.map(function(a, b) {
    return b;
  });
};
d.R = function() {
  return this.map(function(a) {
    return a;
  });
};
d.contains = function(a) {
  return this.some(function(b) {
    return b == a;
  });
};
d.Ja = function(a) {
  return this.P.Ja(a);
};
d.clear = function() {
  this.Av(0);
};
d.forEach = function(a, b) {
  for (var c = this.N.next;c != this.N;c = c.next) {
    a.call(b, c.value, c.key, this);
  }
};
d.map = function(a, b) {
  for (var c = [], e = this.N.next;e != this.N;e = e.next) {
    c.push(a.call(b, e.value, e.key, this));
  }
  return c;
};
d.some = function(a, b) {
  for (var c = this.N.next;c != this.N;c = c.next) {
    if (a.call(b, c.value, c.key, this)) {
      return!0;
    }
  }
  return!1;
};
d.every = function(a, b) {
  for (var c = this.N.next;c != this.N;c = c.next) {
    if (!a.call(b, c.value, c.key, this)) {
      return!1;
    }
  }
  return!0;
};
d.Vv = function(a) {
  this.ye ? (a.next = this.N.next, a.Ib = this.N, this.N.next = a, a.next.Ib = a) : (a.Ib = this.N.Ib, a.next = this.N, this.N.Ib = a, a.Ib.next = a);
  null != this.Me && this.Av(this.Me);
};
d.Av = function(a) {
  for (var b = this.P.J();b > a;b--) {
    this.removeNode(this.ye ? this.N.Ib : this.N.next);
  }
};
d.Rv = function(a) {
  this.N != a && this.removeNode(a);
  return a.value;
};
var Xm = function(a, b) {
  this.key = a;
  this.value = b;
};
Xm.prototype.remove = function() {
  this.Ib.next = this.next;
  this.next.Ib = this.Ib;
  delete this.Ib;
  delete this.next;
};
var Zm = chrome.i18n.getMessage("8879729374562274188"), $m = chrome.i18n.getMessage("9217039427324387516"), an = chrome.i18n.getMessage("872641383564597641"), bn = chrome.i18n.getMessage("7864119253243497594"), cn = chrome.i18n.getMessage("1104234694810969409"), dn = chrome.i18n.getMessage("2884726392788153618"), en = chrome.i18n.getMessage("4687947362658561907"), fn = chrome.i18n.getMessage("2942203478948533213"), gn = chrome.i18n.getMessage("8847227464712783239"), hn = chrome.i18n.getMessage("7661531377295243900"), 
jn = chrome.i18n.getMessage("2480373522051304868"), kn = chrome.i18n.getMessage("3268013795447421317"), ln = chrome.i18n.getMessage("8119187687393606810"), mn = chrome.i18n.getMessage("5453859777568475949"), nn = chrome.i18n.getMessage("6181212922679547742"), on = chrome.i18n.getMessage("3051639087648999069"), pn = chrome.i18n.getMessage("4223394109936547558");
chrome.i18n.getMessage("8288732448265345962");
chrome.i18n.getMessage("1318160328466758792");
var qn = chrome.i18n.getMessage("5849296180435940955");
var rn = function(a, b) {
  this.title = a;
  this.message = b;
}, sn = {};
sn.activity_error = new rn(Zm, $m);
sn.channel_error = new rn(an, bn);
sn.launch_failure = new rn(cn, dn);
sn.device_offline = new rn(en, fn);
sn.bad_device = new rn(gn, hn);
sn.session_quality_network = new rn(jn, kn);
sn.session_quality_encoding = new rn(ln, mn);
sn.unsupported_plugin_detected = new rn(nn, on);
var tn = function(a, b) {
  this.displayText = a;
  this.Ta = b;
}, un = new tn(pn), vn = function(a) {
  return new tn(qn, function() {
    window.open(a);
  });
}, wn = function(a, b, c, e, f, g, k) {
  this.id = Ka();
  this.timestamp = (new Date).getTime();
  this.type = a;
  this.title = b;
  this.message = c;
  this.defaultAction = e;
  this.optAction = f;
  this.severity = g || "fatal";
  this.activityId = k || null;
};
wn.prototype.jt = function() {
  return new Ul(this.id, this.title, this.message, this.defaultAction.displayText, this.optAction ? this.optAction.displayText : null, this.rK(this.severity), this.activityId);
};
wn.prototype.rK = function(a) {
  return "fatal" == a ? "fatal" : "warning";
};
var xn = function() {
  O.call(this);
  this.pd = new Ym;
};
u(xn, O);
da(xn);
var yn = function(a, b, c, e, f, g, k) {
  a = new wn(a, e || sn[a].title, f || sn[a].message, b, c, g || "fatal", k);
  xn.F().addIssue(a);
  return a.id;
};
d = xn.prototype;
d.k = function() {
  xn.q.k.call(this);
  this.pd.clear();
};
d.Ih = function() {
  return 0 < this.pd.J();
};
d.addIssue = function(a) {
  this.pd.set(a.id, a);
  this.dispatchEvent("new_issue");
};
d.Ms = function(a, b) {
  var c = this.pd.get(a);
  if (c) {
    var e = null;
    b ? e = c.defaultAction.Ta : c.optAction && (e = c.optAction.Ta);
    e && e();
    this.pd.remove(a);
    this.Ro();
  }
};
d.sI = function() {
  this.Ih() && (this.pd.clear(), this.Ro());
};
d.gC = function(a) {
  if (this.Ih() && a) {
    var b = [];
    this.pd.R().forEach(function(c) {
      c.activityId == a && b.push(c.id);
    }, this);
    b.forEach(function(a) {
      this.pd.remove(a);
    }, this);
    b.length && this.Ro();
  }
};
d.Ro = function() {
  this.dispatchEvent("remove_issue");
};
d.Rn = function() {
  return this.pd.aJ() || null;
};
var zn = function() {
  Ie.call(this);
  this.Qh = new B;
  this.Le = new B;
};
u(zn, Ie);
d = zn.prototype;
d.Vi = function(a) {
  return this.Qh.get(a) || null;
};
d.ie = function(a) {
  return this.Le.get(a) || [];
};
d.jm = function(a) {
  return kb(this.getAllActivities(), function(b) {
    return b.nx() && b.nx() == a;
  });
};
d.xt = function(a) {
  this.gr(-1, a);
};
d.gr = function(a, b) {
  zn.q.xt.call(this, b);
  this.Qh.set(b.c(), a);
  var c = this.Le.get(a);
  c ? c.push(b) : this.Le.set(a, [b]);
};
d.ak = function(a) {
  var b = this.Yb(a);
  zn.q.ak.call(this, a);
  b.forEach(function(a) {
    this.Ka(a.c()) || this.ue(a);
  }, this);
};
d.ue = function(a) {
  var b = a.c(), c = this.Vi(b);
  this.Qh.remove(b);
  var e = this.Le.get(c);
  ub(e, function(a) {
    return a.c() == b;
  });
  0 == e.length && this.Le.remove(c);
  zn.q.ue.call(this, a);
};
d.Ef = function(a) {
  this.Ka(a) && this.ue(this.Ka(a));
};
d.Um = function() {
  zn.q.Um.call(this);
  this.Qh.clear();
  this.Le.clear();
};
d.YG = function(a) {
  this.ie(a).forEach(function(a) {
    this.Qh.remove(a.c());
    zn.q.ue.call(this, a);
  }, this);
  this.Le.remove(a);
};
var An = function(a, b, c, e) {
  v(n(chrome.tabCapture), "chrome.tabCapture not available. Did you set the flag?");
  rf.call(this, !0, b, e);
  this.sg(a);
  this.au = s(this.uE, this);
  this.hh = null;
  this.Q = c;
  this.po = new Te(5E3);
  this.uh(this.po);
  this.t = new P(this);
  this.uh(this.t);
  this.Dn = !1;
  this.Pj = null;
};
u(An, rf);
var Bn = new B, Cn = function(a) {
  var b = Bn.get(a);
  b && (Bn.remove(a), b.ended || b.stop());
}, Dn = function(a, b) {
  Cn(a);
  Bn.set(a, b);
};
d = An.prototype;
d.kf = function() {
  return{tab_id:this.L(), settings:this.Oc};
};
d.Mu = function() {
  var a = {audio:!0, video:!0, audioConstraints:{mandatory:{googEchoCancellation:!1, googAutoGainControl:!1, googNoiseSuppression:!1, googHighpassFilter:!1}}, videoConstraints:{mandatory:{minWidth:this.Oc.minWidth, minHeight:this.Oc.minHeight, maxWidth:this.Oc.minWidth, maxHeight:this.Oc.minHeight, maxFrameRate:this.Oc.lowFpsMode ? 1 : this.Oc.maxFrameRate}}};
  this.Oc.enablePacing && (a.videoConstraints.mandatory.googLeakyBucket = !0);
  return a;
};
d.pD = function() {
  var a = {audio:!1, video:{mandatory:{chromeMediaSource:"screen", maxWidth:1920, maxHeight:1080, googLeakyBucket:!0}}}, b = Oj() && 0 <= Ma(Ld, "30.0.1584.0"), c = ec && 0 <= Ma(Ld, 31);
  if (b || c) {
    a.audio = {mandatory:{chromeMediaSource:"system"}};
  }
  return a;
};
d.kk = function(a) {
  An.q.kk.call(this, m);
  M(this.nc, "iceconnected", s(this.oE, this));
  this.nc.tE(s(this.pE, this));
  Cn(this.L());
  this.Rs() ? this.qE(a) : this.rE(a);
};
d.qE = function(a) {
  v(this.Rs());
  this.n.info("Starting desktop capture");
  navigator.webkitGetUserMedia(this.pD(), s(this.rt, this, a), s(function() {
    this.n.e("Failed to capture desktop");
    a(!1, "Failed to capture desktop");
  }, this));
};
d.rE = function(a) {
  v(this.ek());
  this.n.info("Starting capture on tab id " + this.L());
  this.n.info("  media constraints: " + JSON.stringify(this.Mu()));
  Km(this.L(), s(function() {
    chrome.tabCapture.capture(this.Mu(), s(this.rt, this, a));
  }, this));
};
d.Df = function() {
  this.nc.vF() ? this.n.info("Tab mirroring already started.") : (this.n.info("Starting tab mirroring..."), v(this.stream, "Expecting non-null stream"), this.hh = Date.now(), this.nc.start(this.ek()), this.Gn("start"), this.ek() && this.wF());
};
d.wF = function() {
  v(this.ek());
  chrome.tabCapture.onStatusChanged.addListener(this.au);
  this.Ik(s(chrome.tabCapture.onStatusChanged.removeListener, chrome.tabCapture.onStatusChanged, this.au));
  var a = this.Q.listen("full_screen_video_status", this.DE, this);
  this.Ik(s(this.Q.Yf, this.Q, a));
  a = this.Q.listen("unsupported_plugin_detected", this.Gs, this);
  this.Ik(s(this.Q.Yf, this.Q, a));
  this.t.listen(this.po, "tick", this.xE);
  this.po.start();
  this.Fs();
};
d.rt = function(a, b) {
  var c = chrome.extension.lastError;
  c ? (c = JSON.stringify(c), this.n.e("Error: " + c), -1 != c.indexOf("permission") && (c = "Please enable the Tab Capture API in flags and manifest.", this.n.e(c)), a(!1, c)) : b ? "stopped" == this.X() ? (b.stop(), a(!1, "The activity was stopped.")) : (b.onended = s(function() {
    this.n.info("Get stream ended event.");
    this.dispatchEvent(new De("activity_request_stop", this.c()));
  }, this), Dn(this.L(), b), this.stream = b, this.url = window.webkitURL.createObjectURL(this.stream), this.n.info("Got stream with URL"), this.nc.addStream(this.stream), a(!0)) : (this.n.e("Failed to get stream."), a(!1, "Failed to get stream."));
};
d.zd = function() {
  An.q.zd.call(this);
  this.stream && (this.n.info("Stopping local stream..."), this.stream.stop(), Cn(this.L()));
  this.stream = null;
  this.Gn("stop");
  xn.F().gC(this.c());
};
d.Ix = function() {
  this.hh = null;
};
d.ze = function(a) {
  An.q.ze.call(this, a);
  "performance" == a.type && this.n.info("Remote performance event: " + JSON.stringify(a.message));
};
d.uE = function(a) {
  this.n.info("Got flash video full screen status update");
  this.$u(a.fullscreen);
};
d.DE = function(a, b) {
  a.id == this.L() && (this.n.info("Got video tab full screen status update"), this.$u(bb(b)));
};
d.SF = function() {
  if ("stopped" != this.X()) {
    try {
      this.Gs({id:this.L()}, !1), this.Fs();
    } catch (a) {
      this.n.e("Inject content script failed");
    }
  }
};
d.Fs = function() {
  chrome.tabs.get(this.L(), s(function(a) {
    if (a.url && 0 != a.url.lastIndexOf("chrome://", 0)) {
      try {
        chrome.tabs.executeScript(this.L(), {file:"mirror_content_script.js"});
      } catch (b) {
        this.n.info("Failed to inject content script");
      }
    }
  }, this));
};
d.$u = function(a) {
  "new" != this.X() && "initialized" != this.X() && "stopped" != this.X() && (this.zoomFactor = 1, a && this.Oc.zoomModeEnabled && (this.zoomFactor = Math.max(1, 16 / 9 / (window.screen.width / window.screen.height))), this.n.info("sending ZOOM message, zoom=" + this.zoomFactor), this.nF("zoom"));
};
d.Gs = function(a, b) {
  if (a.id == this.L()) {
    this.n.ka("Unsupported plugin: " + b);
    var c = bb(b);
    c && !this.Dn ? this.Pj = yn("unsupported_plugin_detected", un, vn("http://support.google.com/chromecast/go/nativeplugins"), void 0, void 0, "warning", this.c()) : !c && this.Dn && this.Pj && (xn.F().Ms(this.Pj, !0), this.Pj = null);
    this.Dn = c;
  }
};
d.xE = function() {
  this.Q.Or(this.L(), "detect_unsupported_plugin", {});
};
d.pE = function() {
  this.HK();
};
d.HK = function() {
  yn("channel_error", un);
  this.dispatchEvent(new De("activity_request_stop", this.c()));
};
d.oE = function() {
  Ma(Ld, 31);
};
var En = function(a, b) {
  L.call(this, "media_status");
  this.cmdId = a;
  this.status = b;
};
u(En, L);
var Fn = function(a) {
  L.call(this, "media_key_request");
  this.zv = a;
};
u(Fn, L);
var Gn = function(a, b, c) {
  L.call(this, "custom_message");
  this.activityId = a;
  this.namespace = b;
  this.message = c;
};
u(Gn, L);
var Hn = function(a) {
  Ze.call(this, a, new zn);
  this.a = G("cv.sender.ActivityService");
};
u(Hn, Ze);
d = Hn.prototype;
d.A = function() {
  Hn.q.A.call(this);
  this.gb.listen(this.Cc, "ramp", this.ID);
  this.gb.listen(this.Cc, "channel_error", this.Gh);
};
d.ms = function(a) {
  var b = this.M.Yb(a);
  b.forEach(function(a) {
    v(1 == a.Na().length, "Expect activity " + a.c() + " has exactly one peer.");
    this.rm(a.c());
    a.stop();
  }, this);
  this.M.ak(a);
  b.forEach(function(a) {
    this.dispatchEvent(new $e("remove_activity", a.c()));
  }, this);
};
d.rm = function(a) {
  this.of().Yc(this.M.Ka(a), "activity_error", this.Qi);
};
d.ru = function() {
  return mb(this.getAllActivities(), function(a) {
    return a.isLocal();
  });
};
d.sH = function() {
  return mb(this.getAllActivities(), function(a) {
    return!a.isInternal() && a.isLocal();
  });
};
d.yi = function(a) {
  var b = this.M.Yb(a);
  return 0 < b.length ? (v(1 == b.length, "receiver " + a + " has more than one activities"), b[0]) : null;
};
d.dA = function() {
  var a = this.td();
  a && this.stopActivityById(a.c());
};
d.bA = function(a) {
  return!!this.Hh(a);
};
d.aA = function() {
  var a = this.td();
  return a ? a.Na()[0].mk() : null;
};
d.Hh = function(a) {
  return(a = A(this.M.ie(a), function(a) {
    return "mirror_tab" == a.Ha();
  })) && cb(a, An);
};
d.Ey = function() {
  return kb(this.getAllActivities(), function(a) {
    return!a.isInternal();
  });
};
d.xq = function(a) {
  this.M.Ef(a);
  this.dispatchEvent(new $e("remove_activity", a));
};
d.ie = function(a) {
  return this.M.ie(a);
};
d.jm = function(a) {
  return this.M.jm(a);
};
d.Vi = function(a) {
  return this.M.Vi(a);
};
d.Xp = function(a, b) {
  this.a.info("Add new activity: " + b.c());
  this.M.gr(a, b);
  this.of().Ig(b, "activity_error", this.Qi);
  this.of().Ig(b, "activity_request_stop", function(a) {
    this.stopActivityById(a.activityId);
  });
  this.dispatchEvent(new $e("new_activity", b.c()));
};
d.Qi = function(a) {
  v("activity_error" == a.type);
  this.a.info("Handle activity error: " + a.errorMessage);
  this.M.Vi(a.activityId);
  var b = this.M.Ka(a.activityId);
  this.vq(b);
  this.M.Ef(a.activityId);
  yn("activity_error", un);
};
d.tG = function(a) {
  this.a.info("Handling tab closing: " + a);
  a = this.M.ie(a).slice(0);
  a.forEach(function(a) {
    this.M.ue(a);
  }, this);
  return this.LA(a);
};
d.xG = function(a, b) {
  var c = this.M.Ka(a);
  if (!c) {
    return this.a.info("Trying to leave a non-existing activity: " + a), Le("non-existing activity");
  }
  this.a.info("Leaving activity: " + a);
  this.M.Ef(a);
  return this.cs(c, b);
};
d.stopActivityById = function(a, b) {
  var c = this.M.Ka(a);
  if (!c) {
    return this.a.info("Trying to stop a non-existing activity: " + a), Le("non-existing activity");
  }
  this.a.info("Stopping activity: " + a);
  this.M.Ef(a);
  return this.em(c, b);
};
d.Gx = function(a, b) {
  var c = this.M.Yb(a);
  this.M.ak(a);
  return this.kn(c, b);
};
d.Jx = function(a, b) {
  var c = this.M.ie(a);
  this.M.YG(a);
  return this.kn(c, b);
};
d.stopAllActivities = function(a) {
  this.a.info("Stopping ALL activities");
  var b = this.M.getAllActivities();
  this.M.Um();
  return this.kn(b, a);
};
d.qy = function(a) {
  var b = a.Na()[0];
  v(b.isLocal(), "not a local receiver");
  var b = new Vm(b), c = new I;
  b.lr(a.Lb(), function(b) {
    b.ja() ? c.ea(null) : c.Ma("Failed to stop " + a.Lb());
  });
  return c;
};
d.em = function(a, b) {
  this.a.info("Stopping activity: " + a.Ha() + " " + a.c());
  var c = new I;
  a.stop();
  this.of().Yc(a, "activity_error", this.Qi);
  var e = a.Na()[0];
  a.isInternal() ? (this.vq(a), c.ea(null)) : e.isLocal() ? c = this.qy(a) : c.ea(null);
  b || this.Cc.he(e.c());
  this.dispatchEvent(new $e("remove_activity", a.c()));
  return c;
};
d.cs = function(a, b) {
  if (!a.isInternal()) {
    return Le();
  }
  if ("mirror_tab" == a.Ha()) {
    return this.em(a, b);
  }
  this.a.info("Leaving activity: " + a.Ha() + " " + a.c());
  this.of().Yc(a, "activity_error", this.Qi);
  var c = a.Na()[0];
  this.xy(a);
  b || this.Cc.he(c.c());
  this.dispatchEvent(new $e("leave_activity", a.c()));
  return Ke(null);
};
d.kn = function(a, b) {
  if (0 == a.length) {
    return Ke(null);
  }
  var c = [];
  a.forEach(function(a) {
    c.push(this.em(a, b));
  }, this);
  return 1 == c.length ? c[0] : Se.apply(null, c);
};
d.LA = function(a, b) {
  if (0 == a.length) {
    return Ke(null);
  }
  var c = [];
  a.forEach(function(a) {
    c.push(this.cs(a, b));
  }, this);
  return 1 == c.length ? c[0] : Se.apply(null, c);
};
d.ID = function(a) {
  var b, c, e;
  v("ramp" == a.type);
  Yc(this.a, "Received a RAMP message from receiver " + a.U, a.message);
  var f = this.yq(a);
  if (f) {
    if ("dial_non_ramp_activity" == f.Ha() && (this.a.info("Update activity to RAMP: " + f.c()), f.ge("dial_ramp_activity")), a = a.message, sd(a, "KEY_REQUEST")) {
      (b = sd(a, "KEY_REQUEST") && null != a.method && null != a.requests ? new kd(f.c(), a.cmd_id, a.method, a.requests) : null) ? this.dispatchEvent(new Fn(b)) : this.a.e("Invalid key request message");
    } else {
      if (null == a.cmd_id || null == a.type || "RESPONSE" != a.type && "STATUS" != a.type || null == a.status) {
        c = b = null, e = "Invalid RAMP message: " + JSON.stringify(a);
      } else {
        try {
          var g = a.status, k = new hd("", H(g, "state", !0));
          k.eventSequenceId = H(g, "event_sequence", !0);
          k.contentId = H(g, "content_id", !1);
          k.title = H(g, "title", !1);
          k.imageUrl = H(g, "image_url", !1);
          k.timeProgress = H(g, "time_progress", !0);
          k.position = H(g, "current_time", !0);
          k.duration = H(g, "duration", !1);
          k.volume = H(g, "volume", !0);
          k.muted = H(g, "muted", !0);
          k.contentInfo = H(g, "content_info", !1);
          k.mediaTracks = td(H(g, "tracks", !1, []));
          k.hasPause = H(g, "has_pause", !1);
          var l = H(g, "error", !1);
          k.error = l ? {domain:H(l, "domain", !0), code:H(l, "code", !0), error_info:H(l, "error_info", !1)} : null;
          b = a.cmd_id;
          c = k;
          e = null;
        } catch (q) {
          c = b = null, e = "Invalid RAMP message " + JSON.stringify(a) + ": " + q;
        }
      }
      e ? this.a.e(e) : (c.activityId = f.c(), f.Tx(c), c.title && f.yg(c.title, c.imageUrl, 3), this.dispatchEvent(new En(b, c)));
    }
  }
};
d.mw = function(a) {
  v("custom_message" == a.type);
  Yc(this.a, "Received a custom message from receiver " + a.U, a.message);
  var b = this.yq(a);
  if (b) {
    var c = w(a.message[0]);
    this.dispatchEvent(new Gn(b.c(), c, a.message[1]));
  }
};
d.yq = function(a) {
  if (!a.U) {
    return Yc(this.a, "Received a message without a peer", a.message), null;
  }
  var b = this.yi(a.U);
  b || this.a.e("Cannot find activity for peerId: " + a.U);
  return b;
};
d.Gh = function(a) {
  a.U ? (a = this.M.Yb(a.U), 0 != a.length && "mirror_tab" == a[0].Ha() && yn("channel_error", un)) : this.a.e("Got channel error event without peer ID");
};
var In = function(a, b) {
  P.call(this, this);
  this.a = G("cv.SessionAnalyzer");
  this.r = a;
  this.nj = b || hf.F();
  this.Lm = 0;
  this.Sa = null;
  var c = J.F().kj();
  this.Sa = c ? c : new Vd;
};
u(In, P);
d = In.prototype;
d.A = function() {
  this.listen(this.r, "new_activity", this.HG);
};
d.HG = function(a) {
  "mirror_tab" == this.r.Ka(a.activityId).Ha() && this.sF();
};
d.sF = function() {
  0 < this.Sa.sessionsBeforeWarning && (this.Sa.sessionsBeforeWarning--, J.F().qv(this.Sa));
  0 == this.Sa.sessionsBeforeWarning ? (this.Sa.earliestTimeToShowWarning = Date.now(), this.nj.yv(s(this.aG, this))) : this.nj.yv(null);
};
d.aG = function() {
  if (null == this.nj || Date.now() < this.Sa.earliestTimeToShowWarning || 0 < this.Sa.sessionsBeforeWarning) {
    return!1;
  }
  var a = this.nj.uH(2);
  if (a) {
    var b = this.gw(a.senderStats), c = this.gw(a.receiverStats);
    if (b && c && b > this.Lm && c > this.Lm) {
      return this.Lm = Math.max(b, c), a = this.tH(a.senderStats, a.receiverStats), this.rH(a), !0;
    }
  }
  return!1;
};
d.gw = function(a) {
  a = a[a.length - 1][0];
  return a ? (a = a.timestamp) ? (new Date(a)).getTime() : null : null;
};
d.rH = function(a) {
  a.packetsLost > 0.03 * a.packetsSent ? this.ux("session_quality_network", "Packet loss rate is higher than the threshold of 3%") : a.frameRateSent < 0.9 * a.frameRateInput && this.ux("session_quality_encoding", "Frame rate encoding/sending rate is too low");
};
var Jn = function() {
  this.packetsSent = this.packetsLost = this.frameRateSent = this.frameRateInput = null;
};
d = In.prototype;
d.tH = function(a, b) {
  var c = new Jn;
  c.frameRateInput = this.fx(a, "googFrameRateInput", 2);
  c.frameRateSent = this.fx(a, "googFrameRateSent", 2);
  c.packetsLost = this.gx(b, "packetsLost", 4);
  c.packetsSent = this.gx(a, "packetsSent", 4);
  return c;
};
d.gx = function(a, b, c) {
  return this.jx(a, b, c, !0);
};
d.fx = function(a, b, c) {
  return this.jx(a, b, c, !1);
};
d.jx = function(a, b, c, e) {
  for (var f = 0, g = 0, k = a.length - 1;g < c && 0 <= k;) {
    var l = a[k];
    if (l) {
      for (var q = 0;q < l.length;q++) {
        if (l[q][b]) {
          g++;
          var x = l[q][b], D = Number(x), f = f + (0 == D && ra(x) ? NaN : D);
          if (!e) {
            break;
          }
        }
      }
      k--;
    }
  }
  return g >= c ? e ? f : 1 * f / g : null;
};
d.VC = function() {
  this.Sa.dismissClicks++;
  switch(this.Sa.dismissClicks) {
    case 1:
      this.Sa.sessionsBeforeWarning = 1;
      break;
    case 2:
      this.Sa.sessionsBeforeWarning = 10;
      this.Sa.earliestTimeToShowWarning = Date.now() + 7776E6;
      break;
    default:
      this.Sa.sessionsBeforeWarning = Number.POSITIVE_INFINITY, this.Sa.earliestTimeToShowWarning = Date.now() + 7776E6;
  }
  J.F().qv(this.Sa);
};
d.ux = function(a) {
  var b;
  "session_quality_network" == a ? b = "http://support.google.com/chromecast/go/networkingissues" : "session_quality_encoding" == a ? b = "http://support.google.com/chromecast/go/limitedperformance" : Ya("Invalid issue type: " + a);
  var c = Date.now() + 3E4;
  this.Sa.earliestTimeToShowWarning = Math.max(this.Sa.earliestTimeToShowWarning, c);
  (c = this.r.td()) && b && yn(a, new tn("Dismiss", s(function() {
    this.VC();
  }, this)), vn(b), void 0, void 0, "warning", c.c());
};
var Kn = function(a) {
  this.Jb = a;
  this.a = G("cv.sender.WebSocketChannelFactory");
};
Kn.prototype.qf = function(a) {
  this.a.info("Creating local web socket channel...");
  var b = new I, c = function(a) {
    "pending" == b.X() && b.ea(a);
  }, e = function(a) {
    "pending" == b.X() && b.Ma(a || "Create channel failed.");
  }, f = s(function(a, b, c) {
    c && c.serviceData && c.serviceData.Kl ? a.ul(c.serviceData.Kl) : a.qg("Could not get connection service URL");
  }, this), g = s(function(a) {
    this.a.info("Requesting channel creation at " + a);
    var b = k, c = JSON.stringify({channel:0, senderId:new Jh(this.Jb)}), e = new th;
    wh.push(e);
    b && e.listen("complete", b);
    e.Ig("ready", e.Ox);
    e.send(a, "POST", c, {"Content-Type":"application/json"});
  }, this), k = s(function(b) {
    b = b.target;
    if (b.ja()) {
      b = b.pq();
      this.a.info("Ready to create websocket channel with " + JSON.stringify(b));
      this.a.info("The ID of this sender: " + this.Jb);
      var f = new Ih(b.URL);
      f.U = a.c();
      b.pingInterval && 0 < b.pingInterval ? f = new Hh(f, "pong", 1E3 * b.pingInterval) : this.a.info("Created a channel without ping to receiver: " + a.c());
      f.mq(oa(c, f), e);
    } else {
      this.a.info("XHR error getting websocket URL: " + b.Ve()), e("Failed to get websocket connection URL.");
    }
  }, this), l = new Vm(a), q = new Mj;
  q.xl(16);
  q.ri(500);
  q.Qp(1);
  q.start(function(a) {
    l.nq(oa(f, a));
  }, g, e);
  return b;
};
var Ln = function(a) {
  this.a = G("cv.sender.CloudChannelFactory");
  this.Ac = a;
};
Ln.prototype.qf = function(a) {
  v(null != a.Vq());
  var b = new I;
  this.Ac.yy().Kb(s(function() {
    this.a.info("Opening cloud channel to id: " + a.c());
    var c = this.Ac.zy(a.c());
    pe(c, "a", s(function(a) {
      this.a.info("New state: " + a.Gg);
      "connected" == a.Gg ? b.ea(c) : b.Ma(c.getError() || "Error creating CloudChannel");
    }, this));
  }, this));
  return b;
};
var Mn = function(a, b, c) {
  this.a = G("cv.CloudDiscovery");
  this.qb = new Vh;
  this.$c = new Wh(this.qb);
  this.Yg = new Yh(this.$c);
  this.Fg = new Kj(this.$c, this.Yg);
  this.Ac = new Jj(c, this.qb, this.Fg, s(function(a) {
    this.Yg.zm().Kb(function(b) {
      a(b.Ia());
    });
  }, this));
  this.sf = new Ln(this.Ac);
  this.T = a;
  this.ne = 0;
  b.Dz(this.sf);
};
u(Mn, K);
Mn.prototype.A = function() {
  this.refresh();
};
Mn.prototype.refresh = function(a) {
  !a && 1E4 > t() - this.ne || (this.ne = t(), this.a.info("Starting a device list from cloud."), this.Fg.sB(s(this.Gd, this)));
};
Mn.prototype.Gd = function(a, b) {
  if (b) {
    var c = 0, e = [];
    for (c in a) {
      e.push(a[c].guid);
    }
    this.T.ir(function(a) {
      return a.wm() && -1 == e.indexOf(a.c());
    });
    for (c in a) {
      this.T.register(Pm(a[c].guid, a[c].displayName));
    }
  } else {
    this.a.info("Cloud device list error.");
  }
};
var Nn = function(a) {
  P.call(this, this);
  this.a = G("cv.BrowserIconManager");
  this.r = a;
  this.cb = xn.F();
  this.tj = null;
};
u(Nn, P);
Nn.prototype.A = function() {
  this.listen(this.r, "new_activity", this.Ke);
  this.listen(this.r, "leave_activity", this.Ke);
  this.listen(this.r, "remove_activity", this.Ke);
  this.listen(this.cb, "new_issue", this.Ke);
  this.listen(this.cb, "remove_issue", this.Ke);
};
Nn.prototype.Ke = function() {
  var a = this.DB();
  this.tj != a && (this.a.info("Set icon to " + a), this.tj = a, chrome.browserAction.setIcon({path:{38:this.tj, 19:this.tj}}));
};
Nn.prototype.DB = function() {
  if (this.cb.Ih()) {
    var a = this.cb.Rn();
    if ("fatal" == a.severity) {
      return "data/icon38_issue.png";
    }
    if ("warning" == a.severity) {
      return "data/icon38_warning.png";
    }
  }
  return this.r.ru() ? "data/icon38_on.png" : "data/icon38_off.png";
};
var On = function() {
  this.configId = this.ez = this.vf = this.um = this.Cm = this.gc = this.ipAddress = this.friendlyName = this.deviceLabel = this.we = null;
};
On.prototype.re = function() {
  return this.deviceLabel ? this.we ? this.friendlyName ? this.ipAddress ? this.gc ? this.Cm ? this.um ? null : "Missing expireTimeMillis" : "Missing fetchTimeMillis" : "Missing appUrl" : "Missing ipAddress" : "Missing friendlyName" : "Missing uniqueId" : "Missing deviceLabel";
};
On.prototype.toString = function() {
  return JSON.stringify(this, function(a, b) {
    return r(b) && 0 == b.indexOf("uuid:") ? "***" : b;
  });
};
var Qn = function(a) {
  this.ye = new B;
  this.yd = new Yb;
  a || (Pn || (Pn = new Rh(3, null, 1, 10, 2E3)), a = Pn);
  this.hc = a;
  this.a = G("cv.DeviceDescriptionService");
}, Pn = null;
d = Qn.prototype;
d.hr = function(a, b) {
  var c = this.TI(a);
  c ? b(c, null) : this.yd.contains(a.deviceLabel) ? b(null, "Duplicate request for device " + a.deviceLabel) : this.UI(a, b);
};
d.GJ = function() {
  this.yd.R().forEach(s(function(a) {
    this.hc.abort(a, !0);
  }, this));
};
d.TI = function(a) {
  var b = this.ye.get(a.deviceLabel);
  return b ? b.configId != a.configId || t() >= b.um ? (this.a.ka("Removing invalid entry " + b.toString()), this.ye.remove(a.deviceLabel), null) : b : null;
};
d.UI = function(a, b) {
  this.yd.add(a.deviceLabel);
  this.hc.send(a.deviceLabel, a.deviceDescriptionUrl, "GET", null, null, 0, s(this.oI, this, a, b));
};
d.oI = function(a, b, c) {
  this.yd.remove(a.deviceLabel);
  c = c.target;
  this.sj("fetchDeviceDescription", "GET", c);
  if (c.ja()) {
    var e = c.zr();
    e ? (c = this.pA(c, a, e)) ? (this.a.ka("Got device description " + c.toString()), null != c.configId && (this.a.info("Caching device description for " + c.deviceLabel), this.ye.set(a.deviceLabel, c)), b(c, null)) : b(null, "Invalid device description") : b(null, "Invalid or empty response");
  } else {
    b(null, "Request to " + c.Wi() + " failed");
  }
};
d.pA = function(a, b, c) {
  var e = new On;
  e.Cm = t();
  e.um = e.Cm + 18E5;
  e.deviceLabel = b.deviceLabel;
  e.configId = b.configId;
  e.gc = a.getResponseHeader("Application-URL") || null;
  e.ipAddress = fg(e.gc).Dc();
  e.vf = Rn(c, "deviceType");
  e.ez = Rn(c, "modelName");
  e.friendlyName = Rn(c, "friendlyName");
  if (a = e.friendlyName) {
    a = Fa(a, 200), a = za(a);
  }
  e.friendlyName = a;
  e.we = Rn(c, "UDN");
  a = e.re();
  this.a.info("Device description: " + Sn(c));
  return a ? (this.a.e("Device description failed to validate (" + a + "): " + JSON.stringify(e)), null) : e;
};
var Rn = function(a, b) {
  var c = a.getElementsByTagName(b);
  return c && 0 != c.length ? c[0].textContent : null;
}, Sn = function(a) {
  var b = function(a) {
    for (var b = 0, f = a.length;b < f;b++) {
      a[b].textContent = "***";
    }
  };
  b(a.getElementsByTagName("UDN"));
  b(a.getElementsByTagName("serialNumber"));
  return(new XMLSerializer).serializeToString(a);
};
Qn.prototype.sj = function(a, b, c) {
  a = "[" + a + "]: " + b + " " + c.Wi() + " => " + c.Aa() + " (" + c.Yl() + ")";
  c.ja() ? this.a.info(a) : (a += ", error = " + c.ui() + " (" + c.Ve() + ")", this.a.e(a));
};
var Tn = function(a) {
  Nl.call(this);
  this.hj = a || new Qn;
  this.a = G("cv.DialService");
};
u(Tn, Nl);
d = Tn.prototype;
d.Df = function() {
  if (chrome.dial) {
    return chrome.dial.onDeviceList.addListener(this.Pb), chrome.dial.onError.addListener(this.qr), !0;
  }
  this.a.e("Dial API not available, aborting start...");
  return!1;
};
d.zd = function() {
  chrome.dial.onDeviceList.removeListener(this.Pb);
  chrome.dial.onError.removeListener(this.qr);
};
d.ls = function() {
  chrome.dial.discoverNow(s(function(a) {
    this.a.info("chrome.dial.discoverNow = " + a);
  }, this));
};
d.Nw = function() {
  this.hj.GJ();
};
d.rn = function(a, b, c) {
  this.hj.hr(a, function(e, f) {
    if (f) {
      c(f);
    } else {
      var g = new Nm("local:" + a.deviceLabel, e.vf, e.friendlyName, e.we, e.ipAddress, e.gc), g = new Mm(g, null);
      b(g);
    }
  });
};
d.es = function(a) {
  this.a.e("DIAL error: " + a.code);
  switch(a.code) {
    case "no_listeners":
    ;
    case "no_valid_network_interfaces":
    ;
    case "network_disconnected":
    ;
    case "cellular_network":
    ;
    case "socket_error":
    ;
    case "unknown":
      this.wr();
      break;
    default:
      this.a.e("Unhandled DIAL error: " + a.code);
  }
};
var Un = function(a, b) {
  this.a = G("cv.FixedIpDialService");
  this.wj = new Te(3E4);
  this.gb = new P(this);
  this.T = a;
  this.hj = b || new Qn;
};
u(Un, K);
d = Un.prototype;
d.A = function() {
  this.a.Lg("Initializing fixed IP discovery.");
  this.gb.listen(this.wj, "tick", s(this.$A, this));
  this.wj.start();
  this.wj.Rr();
};
d.k = function() {
  this.gb.W();
  this.wj.W();
};
d.$A = function() {
  var a = J.F().lH(), b;
  for (b in a) {
    this.kH(a[b]);
  }
};
d.kH = function(a) {
  v(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(a));
  var b = {};
  b.deviceLabel = "debug:" + a;
  b.deviceDescriptionUrl = "http://" + a + ":8008/ssdp/device-desc.xml";
  this.a.info("Discovering DIAL device by IP (label=" + b.deviceLabel + " url=" + b.deviceDescriptionUrl + " config=" + b.configId + ")");
  this.nn(b, a);
};
d.nn = function(a, b) {
  this.hj.hr(a, s(function(c, e) {
    if (e) {
      this.a.e("Unable to fetch description for " + JSON.stringify(a) + ": " + e), this.Yy(b);
    } else {
      var f = new Nm(a.deviceLabel, c.vf, c.friendlyName, c.we, c.ipAddress, c.gc);
      f.Rg = !0;
      this.T.register(new Mm(f, null));
    }
  }, this));
};
d.Yy = function(a) {
  this.T.ir(function(b) {
    return b.isLocal() && !b.Wv() ? b.dc().ipAddress == a : !1;
  });
};
var Vn = function(a) {
  P.call(this);
  this.sm = [];
  this.T = a;
  this.yd = new Yb;
  this.a = G("cv.ReceiverAppRegistry");
  this.listen(this.T, "receiver_list", this.Mg);
};
u(Vn, P);
d = Vn.prototype;
d.A = function() {
  this.fw("ChromeCast");
};
d.fw = function(a) {
  A(this.sm, function(b) {
    return b == a;
  }) || (this.sm.push(a), this.dx());
};
d.Mg = function() {
  this.dx();
};
d.dx = function() {
  this.T.Tc().forEach(s(this.oH, this));
};
d.oH = function(a) {
  if (a.dc()) {
    var b = null;
    this.sm.forEach(s(function(c) {
      var e = a.c() + ":" + c;
      this.yd.contains(e) || "unknown" != a.Bm(c) || (this.a.info("Querying " + a.c() + " for " + c), b || (b = new Vm(a)), this.yd.add(e), b.Sl(c, s(this.fz, this, a, c)));
    }, this));
  }
};
d.fz = function(a, b, c, e, f) {
  this.yd.remove(a.c() + ":" + b);
  if (404 == c.Aa()) {
    a.rf(b, "unavailable"), this.T.zq(b, a);
  } else {
    if (f) {
      this.a.e("Unable to get application info for app " + b + " on receiver " + a.c() + ": " + f);
    } else {
      if ("Netflix" == b) {
        this.Sx(a, e);
      } else {
        switch(e.state) {
          case "running":
          ;
          case "stopped":
            a.rf(b, "available");
            break;
          default:
            a.rf(b, "unavailable");
        }
      }
      this.T.zq(b, a);
    }
  }
};
d.Sx = function(a, b) {
  v("Netflix" == b.name);
  !n(b.extraData.capabilities) || "websocket" != b.extraData.capabilities || "running" != b.state && "stopped" != b.state ? a.rf("Netflix", "unavailable") : a.rf("Netflix", "available");
};
var Wn = function(a, b, c, e, f) {
  this.a = G("cv.sender.LaunchService");
  this.Ye = a;
  this.ra = b;
  this.r = c;
  this.T = e;
  this.vd = new B;
  this.t = new P(this);
  this.t.listen(this.ra, "launch_service", this.Ay);
  this.Q = f;
};
d = Wn.prototype;
d.fq = function(a) {
  var b = !1;
  Eb(this.vd.AD(), function(c) {
    c.Oa.c() == a.c() && (b = !0);
  }, this);
  return b;
};
d.Zs = function() {
  return this.vd.R().map(function(a) {
    return a.sa;
  });
};
d.Ay = function(a) {
  v("launch_service" == a.type);
  a = a.message;
  var b = this.vd.get(a.activityId);
  if (b) {
    this.vd.remove(a.activityId);
    var c = b.sa;
    switch(a.action) {
      case "join_succeeded":
        c.Ax(a.initParams.actualActivityId);
      case "launch_succeeded":
        this.a.info("Activity launch succeeded: " + c.c() + " for activity type " + c.Ha());
        c.Yp(this.ra);
        this.r.Xp(c.L(), c);
        c.start();
        c.dq();
        try {
          var e = void 0;
          a.initParams && (e = a.initParams.joinableState);
          b.wb(c.c(), e);
        } catch (f) {
          this.a.e(f.message);
        }
        c.Ze(new pd(1E3, "INFO"), [b.Oa]);
        break;
      case "launch_failed":
        this.a.info("Activity launch failed: " + c.c());
        b.fe("Receiver failed to launch.");
        break;
      case "join_failed":
        this.a.info("Activity join failed: " + c.c());
        b.fe("Activity failed to join. Does this activity support joining?");
        break;
      default:
        this.a.e("Did not recognize launch service action");
    }
  } else {
    this.a.e("Get launch response for unknown activity " + JSON.stringify({action:a.action, activityId:a.activityId}));
  }
};
d.Nx = function(a, b) {
  var c = this.r.yi(b), c = null != c && c.isInternal() && a.isInternal(), c = this.r.Gx(b, c);
  if ("mirror_tab" == a.Ha()) {
    var e = this.r.td();
    if (e) {
      return Se(c, this.r.stopActivityById(e.c()));
    }
  }
  !a.isInternal() && this.ra.Cl(b) && (this.a.e("before launch non-cv activity; still have channel"), this.ra.he(b));
  return c;
};
d.Kx = function(a, b) {
  var c = null, c = b.disconnectPolicy, e = null;
  switch(b.activityType) {
    case "mirror_tab":
      c = new An(a.id, J.F().pa(), this.Q);
      break;
    case "video_playback":
      e = "video_playback";
    case "audio_playback":
      var f = b.parameters || new df;
      f.mediaUrl = f.mediaUrl || f.videoUrl;
      c = new cf(e || "audio_playback", f, void 0, c);
      break;
    case "slideshow":
      return null;
    case "unknown":
      return null;
    default:
      c = new He(void 0, c), c.kq(b.activityType).lE(b.parameters).ge("dial_non_ramp_activity");
  }
  c.sg(a.id);
  a.url && c.Bt(Lm(a.url));
  c.kE(a.incognito || !1);
  b.description && c.yg(b.description.text || null, b.description.url || null, 1);
  return c;
};
d.Ai = function(a, b, c, e) {
  this.sx(a, b, c, e, !1);
};
d.join = function(a, b, c, e) {
  this.sx(a, b, c, e, !0);
};
d.sx = function(a, b, c, e, f) {
  var g = b.receiver.id, k = this.T.xg(g);
  if (k) {
    if (Yc(this.a, "Got launch request " + JSON.stringify({activityType:b.activityType, receiver:b.receiver, tab:a.id}), b), this.fq(k)) {
      c = "There is an activity being launched to the same receiver.", this.a.info(c), e(c);
    } else {
      var l = this.Kx(a, b);
      if (l) {
        l.bq(k);
        var q = s(function(a) {
          this.vd.remove(l.c());
          l.stop();
          this.ra.he(g);
          try {
            e(a);
          } catch (b) {
            this.a.e(b.message);
          }
          f || yn("launch_failure", un, void 0, "Unable to cast to " + k.xd() + ".");
        }, this);
        a = chrome.runtime.getManifest().receiverVersion;
        var x = new Xn(this.ra, l, this.Ye, k, a, c, q);
        f && x.Mx();
        this.vd.set(l.c(), x);
        var D = Ke(null);
        f || (D = this.Nx(l, g));
        var R = s(function() {
          var a = f ? 5E3 : 1E4;
          Q(s(this.Lx, this, l.c()), a);
          x.start();
        }, this);
        l.cq(s(function(a, b) {
          a ? Me(D, function() {
            R();
          }, this) : q(b || "Activity failed to initialize.");
        }, this));
      } else {
        e("Unsupported activity: " + JSON.stringify(b));
      }
    }
  } else {
    c = "Receiver does not exist: " + g, this.a.e(c), yn("device_offline", un), e(c);
  }
};
d.Lx = function(a) {
  var b = this.vd.get(a);
  b && (this.a.info("Launch timeout: " + a), this.vd.remove(a), this.ra.Cl(b.Oa.c()) && this.ra.Nb("launch_service", new Lj("cancel", b.sa.Ha(), a, b.sa.kf(), b.$l.c(), b.Oa.c()), [b.Oa]), b.fe("Launch timeout"));
};
var Xn = function(a, b, c, e, f, g, k) {
  this.a = G("cv.sender.ActivityLaunchRequest_");
  this.ra = a;
  this.sa = b;
  this.$l = c;
  this.Oa = e;
  this.wb = g;
  this.fe = k;
  this.cf = this.Oa.isLocal() ? new Vm(this.Oa) : null;
  this.Bq = f;
  this.Eq = "launch";
};
d = Xn.prototype;
d.Mx = function() {
  this.Eq = "join";
};
d.start = function() {
  this.Oa.dc() ? J.F().yF() && J.F().gq() ? this.mb(0) : this.mb(1) : this.mb(4);
};
d.mb = function(a) {
  switch(a) {
    case 0:
      this.DH();
      break;
    case 1:
      this.CH();
      break;
    case 3:
      this.FH();
      break;
    case 4:
      this.sa.isInternal() ? this.EH() : this.GH();
  }
};
d.GH = function() {
  this.ra.dispatchEvent(new Xe("launch_service", new Lj("launch_succeeded", this.sa.Ha(), this.sa.c(), this.sa.kf(), this.$l.c(), this.Oa.c(), this.sa.Nq())));
};
d.CH = function() {
  this.cf && (this.a.info("Checking state of receiver app..."), this.cf.Sl(this.sa.Lb(), s(function(a, b, c) {
    c ? this.fe(c) : "running" == b.state ? this.sa.isInternal() ? this.mb(4) : (this.cf.lr(this.sa.Lb(), m), Q(function() {
      this.mb(3);
    }, 1500, this)) : this.mb(3);
  }, this)));
};
d.FH = function() {
  this.a.info("Sending request to launch receiver app with version: " + this.Bq);
  var a = "";
  if (this.sa.isInternal()) {
    a = "v=" + encodeURIComponent(this.Bq) + "&id=" + encodeURIComponent(this.Oa.c()), a += "&idle=" + encodeURIComponent("windowclose");
  } else {
    var b = this.sa.kf();
    null != b && ("string" == typeof b ? a = b : "object" == typeof b ? a = JSON.stringify(b) : Ya("Don't know how to serialize " + b));
  }
  this.cf && this.cf.launchApp(this.sa.Lb(), s(function(a) {
    a.ja() ? this.mb(4) : this.fe("error launching receiver app");
  }, this), a);
};
d.DH = function() {
  if (this.sa.isInternal()) {
    var a = new W(J.F().gq());
    this.a.info("Flinging receiver URL: " + a);
    a.ca("id", this.Oa.c());
    this.cf.launchApp("Fling", s(function(a) {
      a.ja() ? this.mb(4) : this.fe("error launching receiver app");
    }, this), a.toString());
  } else {
    this.a.e("Fling URL is not supported for external apps");
  }
};
d.EH = function() {
  v(this.sa.isInternal());
  this.a.info("Launching activity " + this.sa.c() + " on " + this.Oa.c());
  this.ra.Cl(this.Oa.c()) ? this.a.info("Has channel to receiver") : this.a.info("No channel to receiver. Ready to create.");
  this.ra.Nb("launch_service", new Lj(this.Eq, this.sa.Ha(), this.sa.c(), this.sa.kf(), this.$l.c(), this.Oa.c(), this.sa.Nq()), [this.Oa], this.fe);
};
var Yn = function(a, b, c, e) {
  O.call(this);
  this.a = G("cv.RampDiscoveryService");
  this.r = a;
  this.yc = b;
  this.ra = e;
  this.Rz = c;
  this.Jr = this.ne = null;
};
u(Yn, O);
d = Yn.prototype;
d.A = function() {
};
d.HI = function() {
  this.a.info("Discovering DIAL/RAMP activity now...");
  this.ne = t();
  this.Rz.Tc().forEach(this.tB, this);
};
d.GI = function() {
  var a = [];
  this.r.Ey().forEach(function(b) {
    b.Fy() < this.ne && a.push(b.c());
  }, this);
  a.forEach(function(a) {
    this.a.info("Removing activity " + a);
    this.r.xq(a);
  }, this);
};
d.tB = function(a) {
  a.dc() && (this.uq(a) ? this.a.Lg("Skipping " + a.c()) : (new Vm(a)).nq(s(this.jz, this, a)));
};
d.jz = function(a, b, c) {
  c && "running" == c.state && "00000000-0000-0000-0000-000000000000" != c.name && (this.uq(a) ? this.a.Lg("Skipping " + a.c()) : (b = this.r.yi(a.c())) && b.Lb() == c.name ? (b.Fq(), Zn(b, c)) : (b && (this.a.info("Removing existing activity " + b.Lb() + " on receiver " + a.c()), this.r.xq(b.c())), this.a.info("Found new activity " + c.name + " on receiver " + a.c()), b = new He(void 0, "continue"), b.kq(c.name).sg(-3).ge("dial_non_ramp_activity").Yp(this.ra).bq(a).Fq(), Zn(b, c), "ChromeCast" == 
  c.name && (b.ge("dial_ramp_activity"), b.Hg().hasPause = !1), this.r.Xp(-3, b), b.cq(m), b.Ze(new pd(1E3, "INFO"))));
};
var Zn = function(a, b) {
  b.Rk && a.yg(b.Rk.description, b.Rk.imageUrl, 2);
  b.serviceData && -1 < b.serviceData.bv.indexOf("ramp") && a.ge("dial_ramp_activity");
};
Yn.prototype.uq = function(a) {
  var b = this.r.yi(a.c());
  return b && b.isInternal() ? !0 : this.yc.fq(a);
};
Yn.prototype.refresh = function() {
  this.ne && 5E3 > t() - this.ne || (this.HI(), h.clearTimeout(this.Jr), this.Jr = Q(function() {
    this.GI();
  }, 5E3, this));
};
var $n = function() {
  this.kw = s(this.QH, this);
  this.fl = new Ta;
  this.fl.Nk = !1;
  this.hw = this.fl.Ok = !1;
  this.$v = "";
  this.aH = {};
};
$n.prototype.jp = function() {
  return this.fl;
};
$n.prototype.Dq = function(a) {
  if (a != this.hw) {
    var b = Vc();
    a ? b.WI(this.kw) : b.bJ(this.kw);
    this.hw = a;
  }
};
$n.prototype.QH = function(a) {
  if (!this.aH[a.Cv()]) {
    var b = this.fl.cw(a), c = ao;
    if (c) {
      switch(a.Uo()) {
        case Lc:
          bo(c, "info", b);
          break;
        case Mc:
          bo(c, "error", b);
          break;
        case Nc:
          bo(c, "warn", b);
          break;
        default:
          bo(c, "debug", b);
      }
    } else {
      window.opera ? window.opera.postError(b) : this.$v += b;
    }
  }
};
var ao = window.console, co = function(a) {
  ao = a;
}, bo = function(a, b, c) {
  if (a[b]) {
    a[b](c);
  } else {
    a.log(c);
  }
};
var eo = function() {
  this.Kn = new B;
  this.Ws = new B;
  this.Jh = new B;
  this.C = J.F();
};
d = eo.prototype;
d.A = function() {
  var a = this.C.zG();
  a && this.Jh.xk(a);
};
d.Kt = function(a, b) {
  return a + " : " + b;
};
d.lD = function(a) {
  var b = Ka();
  this.Jh.set(a, b);
  this.C.IG(this.Jh.JG());
};
d.zD = function(a, b) {
  v(b.mk());
  this.Jh.Ja(a) || this.lD(a);
  var c = this.Jh.get(a), e = new Af;
  e.update(b.mk());
  e.update(c);
  c = e.eo();
  if (!fa(c)) {
    throw Error("encodeByteArray takes an array as a parameter");
  }
  yf();
  for (var e = xf, f = [], g = 0;g < c.length;g += 3) {
    var k = c[g], l = g + 1 < c.length, q = l ? c[g + 1] : 0, x = g + 2 < c.length, D = x ? c[g + 2] : 0, R = k >> 2, k = (k & 3) << 4 | q >> 4, q = (q & 15) << 2 | D >> 6, D = D & 63;
    x || (D = 64, l || (q = 64));
    f.push(e[R], e[k], e[q], e[D]);
  }
  c = "uuid:" + f.join("");
  this.Kn.set(this.Kt(a, b.c()), c);
  this.Ws.set(c, b.c());
};
d.iu = function(a, b) {
  var c = this.Kt(a, b.c());
  this.Kn.Ja(c) || this.zD(a, b);
  return this.Kn.get(c);
};
d.VI = function(a, b) {
  return b.map(function(b) {
    var e = b.cK();
    e.id = this.iu(a, b);
    return e;
  }, this);
};
d.nw = function(a) {
  return this.Ws.get(a, null);
};
var fo = function(a, b, c) {
  this.rc = a;
  this.Zo = b;
  this.iH = Lm(c);
  this.No = new Yb;
  this.dp = new Yb;
  this.ep = new Yb;
  this.il = null;
  this.ji = t();
};
d = fo.prototype;
d.tm = function() {
  this.ji = t();
};
d.Iv = function() {
  return this.ji;
};
d.hE = function(a) {
  this.il = a;
};
d.TF = function(a) {
  a && this.il && (a = A(a, function(a) {
    return a.id == this.il;
  }, this)) && (a.isTabProjected = !0, this.il = null);
};
d.L = function() {
  return this.rc;
};
d.Ba = function() {
  return this.Zo;
};
d.ro = function() {
  return this.iH;
};
d.pH = function(a) {
  this.No.add(a);
};
d.KK = function(a) {
  this.No.remove(a);
};
d.ZJ = function() {
  return this.No.R();
};
d.Zq = function(a) {
  this.dp.add(a);
};
d.Fv = function(a) {
  this.dp.remove(a);
};
d.fj = function(a) {
  return this.dp.contains(a);
};
d.Yz = function(a) {
  this.ep.add(a);
};
d.$z = function(a) {
  this.ep.remove(a);
};
d.YH = function(a) {
  return this.ep.contains(a);
};
d.Br = function() {
  return-4 == this.rc;
};
var go = function() {
  this.a = G("cv.CastClientRecord");
  this.xa = [];
};
d = go.prototype;
d.A = function() {
  chrome.tabs.onRemoved.addListener(s(function(a) {
    this.GK(a);
  }, this));
};
d.GK = function(a) {
  this.Sr(a) && (this.a.info("Removing clients in tab " + a), this.xa = kb(this.xa, function(b) {
    return b.L() != a;
  }));
};
d.AA = function(a, b) {
  this.xa = kb(this.xa, function(c) {
    return c.L() != a || c.Iv() > b;
  });
};
d.xA = function(a) {
  return kb(this.xa, function(b) {
    return b.L() == a;
  });
};
d.Nl = function(a, b, c) {
  if (-4 == a) {
    var e = this.lB(b);
    if (e) {
      return e;
    }
  }
  if (this.yj(a, b)) {
    return this.a.info("Client already exists."), null;
  }
  if (50 <= this.mB(a)) {
    return this.a.info("Exceeds max number of clients allowed per tab"), null;
  }
  e = new fo(a, b, c);
  this.xa.push(e);
  return e;
};
d.Em = function(a, b) {
  return ub(this.xa, function(c) {
    return c.L() == a && c.Ba() == b;
  });
};
d.xe = function(a, b) {
  return A(this.xa, function(c) {
    return c.L() == a && c.Ba() == b;
  });
};
d.lB = function(a) {
  return A(this.xa, function(b) {
    return b.Br() && b.Ba() == a;
  });
};
d.yj = function(a, b) {
  return!!this.xe(a, b);
};
d.Sr = function(a) {
  return!!A(this.xa, function(b) {
    return b.L() == a;
  });
};
d.kI = function(a, b) {
  return!!A(this.xa, function(c) {
    return c.L() == a && c.ro() == b;
  });
};
d.mB = function(a) {
  return ob(this.xa, function(b) {
    return b.L() == a;
  });
};
d.ip = function() {
  return this.xa;
};
d.wv = function(a) {
  return A(this.xa, function(b) {
    return b.fj(a);
  });
};
d.dz = function(a, b) {
  return A(this.xa, function(c) {
    return c.YH(a) && c.fj(b);
  });
};
var ho = function(a, b, c, e, f) {
  this.cb = xn.F();
  this.r = a;
  this.T = b;
  this.yc = c;
  this.Q = e;
  this.cy = f;
  this.a = G("cv.CastService");
  this.t = new P(this);
  this.na = new go;
  this.Bg = new eo;
};
d = ho.prototype;
d.Nr = m;
d.A = function() {
  this.Q.listen("v1_app_request", s(this.Us, this));
  this.Q.listen("page_unload", s(this.oC, this));
  this.t.listen(this.T, "receiver_list", this.Mg);
  this.t.listen(this.r, "media_status", this.Wj);
  this.t.listen(this.r, "media_key_request", this.pC);
  this.t.listen(this.r, "remove_activity", this.qC);
  this.t.listen(this.r, "custom_message", this.nC);
  this.Bg.A();
  this.na.A();
};
d.isAppInTab = function(a) {
  return this.na.Sr(a);
};
d.UC = function(a, b) {
  return this.na.kI(a, b);
};
d.Mg = function() {
  this.na.ip().forEach(function(a) {
    this.UH(a);
  }, this);
};
d.UH = function(a) {
  a.ZJ().forEach(function(b) {
    this.aw(a, b);
  }, this);
};
d.aw = function(a, b, c) {
  var e = this.T.QF(0 <= Ce.indexOf(b) ? "ChromeCast" : b), e = this.PF(a, e);
  a.TF(e);
  this.Qa(a, new md("CastApi", a.Ba(), null != c ? c : null, "ReceiverListUpdateEvent", new nd(b, e)));
};
d.PF = function(a, b) {
  return b ? this.Bg.VI(a.ro(), b) : [];
};
d.My = function(a, b) {
  this.T.refresh();
  var c = b.message;
  a.pH(c);
  this.cy.fw(0 <= Ce.indexOf(c) ? "ChromeCast" : c);
  this.aw(a, c, b.seq);
};
d.Vy = function(a, b) {
  a.KK(b.message);
};
d.Wy = function(a, b) {
  var c = s(function(c) {
    this.bi(a, b, "CustomMessageResultEvent", c);
  }, this), e = oa(c, null), f = b.message, g = this.r.Ka(f.activityId);
  g ? g.L() != a.L() ? c("Cannot send message to activity " + f.activityId + " from this tab.") : g.Jn(f.namespace, f.message, e, c) : c("No such activity: " + f.activityId);
};
d.Ny = function(a, b) {
  var c = ab(b.message);
  w(b.source);
  var e = w(c[0]), c = w(c[1]);
  -1 != $c.indexOf(e) ? this.a.e("Attempting to add listener for reserved namespace.") : a.fj(c) ? a.Yz(e) : this.a.e("Attempting to add custom message listener for activity " + c + " not owned by this client.");
};
d.Uy = function(a, b) {
  var c = ab(b.message);
  w(b.source);
  var e = w(c[0]);
  w(c[1]);
  -1 != $c.indexOf(e) ? this.a.e("Attempting to remove listener for reserved namespace.") : a.$z(e);
};
d.nC = function(a) {
  v("custom_message" == a.type);
  var b = this.na.dz(a.namespace, a.activityId);
  b ? this.Qa(b, new md("CastApi", b.Ba(), null, "CustomMessageEvent", new od(a.activityId, a.namespace, a.message))) : this.a.e("Unexpected custom message for activity " + a.activityId + " and namespace " + a.namespace);
};
d.Ty = function(a, b) {
  var c = b.source;
  Yc(this.a, "Registering client: " + JSON.stringify({tabId:a.id, clientId:c}), a.url);
  var e = this.na.Nl(a.id, c, a.url);
  e && (this.uy(e), a.url && (c = Lm(a.url), this.r.jm(c).forEach(function(a) {
    e.Zq(a.c());
  }, this)));
};
d.uy = function(a) {
  var b = this.r.Hh(a.L());
  b && 1 == b.Na().length && a.hE(this.Bg.iu(a.ro(), b.Na()[0]));
};
d.oC = function(a) {
  this.a.info("Page-unload event from tab " + a.id);
  var b = t();
  this.na.xA(a.id).forEach(function(a) {
    this.Qa(a, new md("CastApi", a.Ba(), null, "ping", {}));
  }, this);
  Q(function() {
    this.na.AA(a.id, b);
  }, 3E3, this);
};
d.Us = function(a, b) {
  this.Ri(b);
  var c = b.source;
  v("CastApi" != c);
  v("CastApi" == b.target);
  if ("RegisterClient" == b.type) {
    this.Ty(a, b);
  } else {
    if (c = this.na.xe(a.id, c)) {
      switch(c.tm(), b.type) {
        case "AddReceiverListener":
          this.My(c, b);
          break;
        case "RemoveReceiverListener":
          this.Vy(c, b);
          break;
        case "LaunchActivity":
          this.Qy(c, b, a);
          break;
        case "JoinActivity":
          this.Py(c, b, a);
          break;
        case "LeaveActivity":
          this.Ry(c, b);
          break;
        case "StopActivity":
          this.Xy(c, b);
          break;
        case "GetActivityStatus":
          this.Oy(c, b);
          break;
        case "AddMediaStatusListener":
          break;
        case "RemoveMediaStatusListener":
          break;
        case "SendCustomMessage":
          this.Wy(c, b);
          break;
        case "AddCustomMessageListener":
          this.Ny(c, b);
          break;
        case "RemoveCustomMessageListener":
          this.Uy(c, b);
          break;
        case "LoadMedia":
        ;
        case "PlayMedia":
        ;
        case "PauseMedia":
        ;
        case "SetMediaVolume":
        ;
        case "SelectMediaTracks":
        ;
        case "MediaStatus":
        ;
        case "MediaKeyResponse":
          this.Sy(c, b);
          break;
        case "LogMessage":
          break;
        case "pong":
          break;
        default:
          Yc(this.a, "Unknown request : " + b.type, b, Nc);
      }
    } else {
      this.a.e("No registered client exists for request " + b.type + " from tab " + a.id);
    }
  }
};
d.Ri = function(a) {
  "LogMessage" != a.type && Yc(this.a, "App request: " + a.type, a);
};
d.pw = function(a, b, c, e) {
  a.Zq(c);
  c = new gd(c, "running");
  n(e) && (c.extraData.joinableState = e);
  this.bi(a, b, "ActivityStatusEvent", c);
};
d.ow = function(a, b, c) {
  var e = new gd(null, "error");
  e.errorString = c;
  this.bi(a, b, "ActivityStatusEvent", e);
};
d.Qy = function(a, b, c) {
  var e = b.message, f = s(this.pw, this, a, b);
  a = s(this.ow, this, a, b);
  e.receiver.id = this.Bg.nw(e.receiver.id);
  this.yc.Ai(c, e, f, a);
};
d.Py = function(a, b, c) {
  var e = b.message, f = s(this.pw, this, a, b);
  a = s(this.ow, this, a, b);
  e.receiver.id = this.Bg.nw(e.receiver.id);
  this.yc.join(c, e, f, a);
};
d.Rm = function(a, b, c, e, f) {
  c = new gd(b.message, c);
  c.errorString = e || null;
  f && (c.extraData = f);
  this.bi(a, b, "ActivityStatusEvent", c);
};
d.Oy = function(a, b) {
  var c = this.r.Ka(b.message);
  if (c) {
    var e = c.Na()[0];
    e.isLocal() ? (new Vm(e)).Sl(c.Lb(), s(this.Qz, this, a, b)) : this.a.info("Getting the status of non-local activity is not supported");
  } else {
    this.Rm(a, b, "error", "Activity does not exist");
  }
};
d.Qz = function(a, b, c, e, f) {
  f ? this.Rm(a, b, "error", f, null) : this.Rm(a, b, e.state, null, e.extraData);
};
d.Ry = function(a, b) {
  var c = b.message;
  a.Fv(c);
  this.r.xG(c);
};
d.Xy = function(a, b) {
  var c = b.message;
  a.Fv(c);
  this.r.stopActivityById(c);
};
d.Qa = function(a, b) {
  v(-1 != a.L());
  Yc(this.a, "Sending message to app @tab " + a.L() + ":" + b.type, b);
  a.Br() ? this.Nr(a.Ba(), "event_to_v1_app", b) : this.Q.Or(a.L(), "event_to_v1_app", b);
};
d.bi = function(a, b, c, e) {
  b = new md("CastApi", a.Ba(), Za(b.seq), c, e);
  this.Qa(a, b);
};
d.Sy = function(a, b) {
  v(b.message.activityId);
  v(b.message.rampRequest);
  var c = b.message.activityId, e = this.r.Ka(c);
  if (e && a.fj(c)) {
    var f = rd(b);
    f.message ? e.Ze(f.message) : this.dv(a, c, b, "Invalid RAMP request: " + f.error);
  } else {
    this.dv(a, c, b, "Unknown activity id");
  }
};
d.Wj = function(a) {
  v("media_status" == a.type);
  var b = this.na.wv(a.status.activityId);
  if (b) {
    var c = a.status, e = new id(a.status.activityId);
    e.success = !0;
    e.status = c;
    e.errorString = null;
    this.Qa(b, new md("CastApi", b.Ba(), a.cmdId, "MediaResultEvent", e));
  }
};
d.pC = function(a) {
  v("media_key_request" == a.type);
  var b = this.na.wv(a.zv.activityId);
  b && this.Qa(b, new md("CastApi", b.Ba(), null, "MediaKeyRequest", a.zv));
};
d.qC = function(a) {
  this.Wj(new En(0, new hd(a.activityId, 1)));
};
d.dv = function(a, b, c, e) {
  b = new id(b);
  b.success = !1;
  b.status = null;
  b.errorString = e;
  this.bi(a, c, "MediaResultEvent", b);
};
var io = function(a) {
  this.a = G("cv.CastExtensionIo");
  this.is = a;
};
io.prototype.A = function() {
  chrome.runtime.onMessageExternal.addListener(s(this.$I, this));
  this.is.Nr = s(this.cJ, this);
};
io.prototype.cJ = function(a, b, c) {
  this.a.ka("Sending extension message to " + a);
  chrome.runtime.sendMessage(a, c);
};
io.prototype.$I = function(a, b, c) {
  c(!0);
  a.target && (c = {id:-4, url:"chrome-extension://" + b.id}, a.source = b.id, this.is.Us(c, a));
};
var jo = function(a, b) {
  var c = [];
  a.forEach(function(a) {
    var f = A(b, function(b) {
      return b.receiver.id == a.c();
    });
    (f || a.TD()) && c.push(new Vl(a.eE(), f));
  });
  return c;
}, lo = function(a, b) {
  var c = [];
  a.forEach(function(a) {
    (a = ko(a, b)) && c.push(a);
  });
  return c;
}, ko = function(a, b) {
  if (a && a.Na() && 1 == a.Na().length) {
    var c = a.zg().text;
    c || (c = "ChromeCast" == a.Lb() ? "No title" : a.Lb());
    var e = a.Na()[0], f = null;
    a.Hg() && (f = new Yl, f.timeProgress = a.Hg().timeProgress, f.muted = a.Hg().muted, f.hasPause = a.Hg().hasPause);
    return new Tl(a.c(), new Sl(e.c(), e.xd()), a.zg().iconUrl, c, b, f, a.L(), a.isLocal(), "mirror_tab" == a.Ha());
  }
  return null;
}, mo = function(a) {
  var b = a.pa();
  return new Wl(b.captureSurface, b.lowFpsMode, a.kj().castAppNotificationDismissed, b.Al());
};
var no = function(a, b, c, e, f, g, k, l, q, x) {
  this.cb = xn.F();
  this.r = a;
  this.Mb = b;
  this.wi = q;
  this.zc = x;
  this.Kq = k;
  this.yc = c;
  this.Q = e;
  this.tg = f;
  this.af = g;
  this.vg = l;
  this.a = G("cv.PopupMenuService");
  this.t = new P(this);
  this.ke = !1;
};
d = no.prototype;
d.A = function() {
  this.Q.listen("popup_menu_request", s(this.WC, this));
  this.t.listen(this.r, "media_status", this.Wj);
  this.t.listen(this.r, "new_activity", this.ac);
  this.t.listen(this.r, "leave_activity", this.ac);
  this.t.listen(this.r, "remove_activity", this.ac);
  this.t.listen(this.Mb, "receiver_list", this.Mg);
  this.t.listen(this.cb, "new_issue", this.st);
  this.t.listen(this.cb, "remove_issue", this.st);
  this.zc && this.t.listen(this.zc, "new_session", this.XC);
};
d.XC = function() {
  this.ke = !1;
  this.ac();
};
d.Mg = function() {
  this.ac();
};
d.st = function() {
  this.ac();
};
d.WC = function(a, b) {
  if (-1 == a.id) {
    if (this.ke = !1, this.a.info("Popup request: " + b.type), this.a.ka("  the request is " + JSON.stringify(b)), "launch_desktop_mirror" == b.type || "update_settings" == b.type) {
      this.ur(b, !1);
    } else {
      var c = s(function(a) {
        a ? this.ur(b, this.or(a.id)) : this.a.e("Failed to get active tab in topmost window");
      }, this);
      Bm(c);
    }
  }
};
d.or = function(a) {
  if (!this.zc) {
    return!1;
  }
  if (this.zc.isAppInTab(a)) {
    return!0;
  }
  this.af.isAppInTab(a);
  return!1;
};
d.ur = function(a, b) {
  switch(a.type) {
    case "init":
      this.dB(b);
      break;
    case "act_on_issue":
      this.cB(a.message);
      break;
    case "stop_activity":
      this.gB(a.message);
      break;
    case "play_media":
    ;
    case "pause_media":
    ;
    case "set_mute":
      this.fB(a);
      break;
    case "cast_this_tab":
      b ? this.zc.hB(a) : this.sq(a.message);
      break;
    case "launch_desktop_mirror":
      this.eB(a.message);
      break;
    case "update_settings":
      this.iB(a.message);
      break;
    default:
      this.a.info("Unknown request: " + JSON.stringify(a));
  }
};
d.iB = function(a) {
  var b = J.F(), c = b.pa();
  c.captureSurface = a.captureSurface;
  c.lowFpsMode = a.lowFpsMode;
  b.kj().castAppNotificationDismissed || (b.kj().castAppNotificationDismissed = a.castAppNotificationDismissed);
  this.MF(a.mirrorQualityId, c);
  J.F().Fe();
};
d.MF = function(a, b) {
  if (Pd(a) && a != b.Al()) {
    this.a.ka("Changing mirror quality to " + a);
    this.ay();
    b.by(a);
    var c = this.r.td();
    if (c) {
      var e = c.Na()[0].c(), f = c.L();
      this.r.stopActivityById(c.c());
      Km(f, s(function(a) {
        a && this.sq(e, a);
      }, this));
    }
  }
};
d.oF = function(a) {
  var b = s(function() {
    this.pr() && (a ? this.wi.refresh() : (this.Mb.refresh(), this.vg.refresh()), this.Kq && this.Kq.refresh(), Q(b, 1E4, this));
  }, this);
  b();
};
d.dB = function(a) {
  var b = J.F().pa();
  b.captureSurface = "tab";
  b.lowFpsMode = !1;
  J.F().Fe();
  this.tg.Ke();
  this.ac();
  this.oF(a);
};
d.pr = function() {
  var a = chrome.extension.getViews({type:"popup"});
  return!!a && 0 < a.length;
};
d.ay = function() {
  var a = chrome.extension.getViews({type:"popup"});
  a && 0 < a.length && a[0].close();
};
d.ac = function() {
  if (this.pr()) {
    if (this.ke) {
      this.a.info("Still casting");
    } else {
      var a = s(function(a) {
        a ? this.or(a.id) ? (this.a.info("sendV2PopupMenuModel"), this.Nz(a)) : (this.a.info("sendV1PopupMenuModel"), this.Mz(a)) : this.a.e("Failed to get active tab in topmost window");
      }, this);
      Bm(a);
    }
  } else {
    this.a.info("Popup is closed");
  }
};
d.Nz = function(a) {
  var b = null;
  this.cb.Ih() && (b = this.cb.Rn().jt());
  var c = mo(J.F()), e = this.zc.mD(), f = this.r.Hh(a.id);
  a = this.zc.isAppInTab(a.id);
  b = new Xl(e, b, ko(f, !1), c, a);
  this.Q.it("popup", "event_to_popup", new Rl("model_update", b));
};
d.Mz = function(a) {
  var b = null;
  this.cb.Ih() && (b = this.cb.Rn().jt());
  var c = lo(this.yc.Zs(), !0), e = this.Mb.Tc(), f = lo(this.r.getAllActivities(), !1), c = jo(e, f.concat(c)), e = mo(J.F()), f = this.r.Hh(a.id);
  a = a.url ? this.af.UC(a.id, Lm(a.url)) : !1;
  b = new Xl(c, b, ko(f, !1), e, a);
  this.Q.it("popup", "event_to_popup", new Rl("model_update", b));
};
d.cB = function(a) {
  this.cb.Ms(a.id, a.isDefaultAction);
  this.cb.sI();
};
d.gB = function(a) {
  this.r.Ka(a) ? this.r.stopActivityById(a) : (this.a.e("Popup menu has non-existing activity " + a), this.ac());
};
d.fB = function(a) {
  var b = {}, c = null;
  switch(a.type) {
    case "play_media":
      c = "PlayMedia";
      b = {};
      break;
    case "pause_media":
      c = "PauseMedia";
      b = {};
      break;
    case "set_mute":
      c = "SetMediaVolume", b = {muted:a.message.data.muted};
  }
  var e = v(a.message.activityId);
  (a = this.r.Ka(e)) ? (b = new md("", "", 1, w(c), {activityId:e, rampRequest:b}), b = rd(b), b.message ? a.Ze(b.message) : this.a.e("Invalid RAMP request: " + b.error)) : this.a.e("Activity ID " + e + " does not exist.");
};
d.eB = function(a) {
  this.ke = !0;
  var b = s(function() {
    this.ke = !1;
    this.ac();
  }, this);
  a = new fd("mirror_tab", new dd(a, ""));
  a.disconnectPolicy = "stop";
  a.description = new ed;
  a.description.text = "Capturing desktop";
  a.description.url = "data/screen100.png";
  this.yc.Ai({id:-2}, a, b, b);
};
d.sq = function(a, b) {
  var c = s(function(b) {
    if (b) {
      this.ke = !0;
      var c = s(function() {
        this.ke = !1;
        this.ac();
      }, this), g = new fd("mirror_tab", new dd(a, ""));
      g.disconnectPolicy = "stop";
      g.description = new ed;
      g.description.text = b.title;
      g.description.url = b.favIconUrl;
      this.yc.Ai(b, g, c, c);
    } else {
      this.a.e("Failed to get active tab in topmost window");
    }
  }, this);
  b ? c(b) : J.F().pa().allowAutoResize ? Im(16 / 9, function() {
    Bm(c);
  }) : Bm(c);
};
d.Wj = function(a) {
  v("media_status" == a.type);
  this.ac();
};
var oo = function(a, b) {
  this.a = G("cv.TabEventsHandlers");
  this.r = a;
  this.yc = b;
};
d = oo.prototype;
d.A = function() {
  "object" == typeof chrome.tabs.onReplaced && chrome.tabs.onReplaced.addListener(s(this.vG, this));
  chrome.tabs.onRemoved.addListener(s(function(a) {
    this.r.tG(a);
  }, this));
  chrome.tabs.onUpdated.addListener(s(this.wG, this));
};
d.wG = function(a, b, c) {
  "complete" == b.status ? (this.ix(c), this.bK(c)) : b.favIconUrl && "complete" == c.status && this.ix(c, !0);
};
d.ix = function(a, b) {
  var c = this.r.Hh(a.id);
  c && (c.yg(a.title, a.favIconUrl, 4), c.Bt(a.url ? Lm(a.url) : null), c.dq(), b || c.SF());
};
d.vG = function(a, b) {
  this.a.info("Tab replaced detected.");
  var c = !1, e = "", f = null;
  this.r.ie(b).forEach(function(a) {
    "mirror_tab" == a.Ha() && (f = a, c = !0, e = a.Na()[0].c());
  }, this);
  f && f.Ix();
  this.r.Jx(b, c);
  if (c) {
    this.a.info("Restarting mirroring.");
    var g = s(function() {
      this.a.e("Launch tab mirroring failed after tab replace.");
    }, this), k = new fd("mirror_tab", new dd(e, ""));
    k.disconnectPolicy = "stop";
    chrome.tabs.get(a, s(function(a) {
      a && (k.description = new ed, k.description.text = a.title, k.description.url = a.favIconUrl, this.yc.Ai(a, k, m, g));
    }, this));
  }
};
d.bK = function(a) {
  var b = new W(a.url);
  b && ("http" == b.jd() || "https" == b.jd()) && b.Dc() && mb(J.F().Ks(), function(c) {
    if (pa(b.Dc(), c)) {
      return this.kG(a), !0;
    }
  }, this);
};
d.kG = function(a) {
  this.a.info("Injecting api_content_script into " + a.id);
  chrome.tabs.executeScript(a.id, {file:"api_content_script.js"}, m);
};
var po = function() {
  Qj.call(this);
  n(Pf) && (Pf = JSON.parse);
  n(Qf) && (Qf = JSON.parse);
  this.Ye = new Pj;
  this.cb = xn.F();
  this.Q = new Ml("background");
  this.NB = new Kn(this.Ye.c());
  this.Dl = null;
  this.ns = new Tn;
  this.Mb = new Ql(this.ns);
  this.Hf = new Qm(this.Mb, this.NB, this.Dl);
  this.Fb = new Hn(this.Hf);
  this.Jj = !1;
  this.tg = new Nn(this.Fb);
  this.IB = new In(this.Fb);
  this.tn = J.F().MB() ? new Mn(this.Mb, this.Hf, this.Ye.c()) : null;
  this.qs = new Vn(this.Mb);
  this.Ah = new Wn(this.Ye, this.Hf, this.Fb, this.Mb, this.Q);
  this.JB = new oo(this.Fb, this.Ah);
  this.t = new P;
  this.af = new ho(this.Fb, this.Mb, this.Ah, this.Q, this.qs);
  this.vg = new Yn(this.Fb, this.Ah, this.Mb, this.Hf);
  this.GB = new no(this.Fb, this.Mb, this.Ah, this.Q, this.tg, this.af, this.tn, this.vg, this.Jj ? this.wi : null, this.Jj ? this.zc : null);
  new Un(this.Mb);
  this.HB = new io(this.af);
};
u(po, Qj);
da(po);
d = po.prototype;
d.vu = function() {
  this.Fb.ru() || 0 < this.Ah.Zs().length ? (this.Fb.sH() && this.vg.refresh(), Q(this.vu, 9E5, this)) : chrome.runtime.reload();
};
d.BF = function() {
  var a = null, a = new $n;
  a.jp().Lo = !0;
  a.jp().Ok = !0;
  a.jp().Nk = !0;
  G("cv").Uc(Oc);
  G("goog").Uc(Oc);
  Dc(Wc(G("browser")));
  a.Dq(!0);
};
d.vB = function() {
  Gm();
  this.qs.A();
  this.Q.A();
  this.BD();
  this.Hf.CD(this.Fb);
  this.Hf.A();
  this.Fb.A();
  this.tg.A();
  this.IB.A();
  this.JB.A();
  this.af.A();
  this.Jj && (this.rs.A(), this.ps.A(), this.zc.A());
  this.HB.A();
};
d.OG = function() {
  this.BF();
  this.ns.A();
  this.vg.A();
  this.GB.A();
  this.tn && this.tn.A();
  this.tg.Ke();
  chrome.runtime.onUpdateAvailable.addListener(s(this.vu, this));
};
d.k = function() {
  po.q.k.call(this);
};
d.of = function() {
  return this.t;
};
d.Tj = function() {
  return this.Fb;
};
d.Vl = function() {
  return J.F();
};
d.gk = function() {
  return Xc();
};
d.tq = function() {
  return JSON.stringify(hf.F().getStats());
};
po.prototype.getWebRtcStats = po.prototype.tq;
po.prototype.Px = function() {
  hf.F().reset();
};
po.prototype.BD = function() {
};
var qo = function() {
};
da(qo);
qo.prototype.A = function() {
  chrome.runtime.onInstalled.addListener(s(this.wK, this));
};
qo.prototype.wK = function(a) {
  "install" == a.reason && chrome.storage.sync.get("blockChromekeySetupAutoLaunchOnInstall", function(a) {
    a && a.blockChromekeySetupAutoLaunchOnInstall || (chrome.storage.sync.set({blockChromekeySetupAutoLaunchOnInstall:!0}, function() {
      chrome.runtime.lastError && G("cv.InitialSetupHandler").e("Failed to set blockChromekeySetupAutoLaunchOnInstall: " + chrome.runtime.lastError.message);
    }), Oj() && chrome.tabs.create({url:chrome.extension.getURL("options.html?showFlow=true")}));
  });
};
document.addEventListener("DOMContentLoaded", function() {
  "background" == document.body.id && (qo.F().A(), J.F().uF(), J.F().tF(function() {
    Zc = po.F();
    ba("backgroundSetup", Zc, void 0);
    Rj(Zc)();
  }));
}, !1);
window.addEventListener("beforeunload", function() {
  "background" == document.body.id && po.F().W();
}, !1);
var ro = ro || {};
ro.A = function() {
  ro.isInited = !0;
  document.TK = ro.nK;
  chrome.extension.onMessage.addListener(so);
  to();
};
ro.nK = function() {
  var a = document.webkitFullscreenElement, a = {source:"content", target:"background", type:"full_screen_video_status", content:!(!a || "VIDEO" != a.tagName && !a.querySelector("VIDEO"))};
  chrome.extension.sendMessage(JSON.stringify(a));
};
var uo = function(a) {
  if (a.querySelector('object[type="application/x-silverlight"]') || a.querySelector('object[type="application/x-silverlight-2"]') || a.querySelector('embed[type="video/quicktime"]')) {
    return!0;
  }
  a = a.getElementsByTagName("iframe");
  for (var b = 0;b < a.length;b++) {
    var c = a[b], e = c.contentDocument;
    e || (e = c.contentWindow.document);
    try {
      if (uo(e)) {
        return!0;
      }
    } catch (f) {
    }
  }
  return!1;
}, to = function() {
  chrome.extension.sendMessage(JSON.stringify({source:"content", target:"background", type:"unsupported_plugin_detected", content:uo(document)}));
}, so = function(a) {
  if ("string" != typeof a) {
    throw "Expecting string from extension. But get: " + JSON.stringify(a);
  }
  a = JSON.parse(a);
  "background" == a.source && "content" == a.target && "detect_unsupported_plugin" == a.type && to();
};
ro.isInited || ro.A();
if ("undefined" != typeof angular) {
  var vo = angular.module("chrome_i18n", []);
  chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().default_locale && vo.directive("angularMessage", function() {
    return{restrict:"E", transclude:"element", replace:!0, controller:["$scope", function(a) {
      this.$e = this.xp = null;
      a.dirForText = s(function(a) {
        this.xp || (this.xp = chrome.i18n.getMessage("@@bidi_dir") || "ltr");
        this.$e || (this.$e = new Mk("rtl" == this.xp));
        return this.$e.Mw(a || "");
      }, this);
    }], compile:function(a, b) {
      var c = b.key, e = null, f = document.createElement("amr");
      c && !c.match(/^\d+$/) && (c = chrome.i18n.getMessage(c), null == c && f.setAttribute("id", "missing"));
      if (c) {
        var g = chrome.i18n.getMessage(c + "_ph"), e = [];
        if (null != g) {
          for (e = g.split("\ue000"), g = 0;g < e.length;++g) {
            e[g] = e[g].replace(/^{{(.*)}}$/, '<amrp dir="{{dirForText($1)}}">{{$1}}</amrp>');
          }
        }
        e = chrome.i18n.getMessage(c, e);
      } else {
        f.setAttribute("r", "nokey");
      }
      e ? f.innerHTML = e : (f.setAttribute("tl", "false"), f.innerHTML = a.html());
      a.replaceWith(f);
    }};
  });
}
;chrome.i18n.getMessage("4014224501758376361", ["{{receiverName}}"]);
chrome.i18n.getMessage("6046507125919556913");
chrome.i18n.getMessage("1189144544819350763");
chrome.i18n.getMessage("3430817026795535765");
var wo = chrome.i18n.getMessage("4089994756445820175"), xo = chrome.i18n.getMessage("780135806192376347"), yo = chrome.i18n.getMessage("2438859709710567679"), zo = chrome.i18n.getMessage("2076488708707463944"), Ao = chrome.i18n.getMessage("3996247341169314250"), Bo = chrome.i18n.getMessage("7053128562708856478"), Co = chrome.i18n.getMessage("8500110749168055241"), Do = chrome.i18n.getMessage("3844709005265884931"), Eo = chrome.i18n.getMessage("4224760847878375792"), Fo = chrome.i18n.getMessage("4584454172263179470"), 
Go = chrome.i18n.getMessage("5823878688587296398"), Ho = chrome.i18n.getMessage("7008828272760191653"), Io = chrome.i18n.getMessage("2377419936291389581"), Jo = chrome.i18n.getMessage("4324962226715124466"), Ko = chrome.i18n.getMessage("6039331491778328245"), Lo = chrome.i18n.getMessage("8887833628383960193"), Mo = chrome.i18n.getMessage("6118473811359442709"), No = chrome.i18n.getMessage("4272010402571776761"), Oo = chrome.i18n.getMessage("482442943064110817"), Po = chrome.i18n.getMessage("5745355507138230213"), 
Qo = chrome.i18n.getMessage("7029426286291560071"), Ro = chrome.i18n.getMessage("8189622236075700665"), So = chrome.i18n.getMessage("6018881802001125637"), To = chrome.i18n.getMessage("4865676252029097872"), Uo = chrome.i18n.getMessage("6988652234001902672"), Vo = chrome.i18n.getMessage("6295154563386647404", ["{{attemptNumber}}"]);
var Wo = function(a, b, c) {
  a.timeOfStartCall = (new Date).getTime();
  var e = c || h;
  e.GOOGLE_FEEDBACK_START_ARGUMENTS = arguments;
  var f = a.serverUri || "//www.google.com/tools/feedback", g = e.GOOGLE_FEEDBACK_START;
  g ? g.apply(e, arguments) : (e = e.document, g = e.createElement("script"), g.src = f + "/load.js", e.body.appendChild(g));
};
ba("userfeedback.api.startFeedback", Wo, void 0);
"undefined" != typeof angular && angular.module("feedbackController", ["chrome_i18n"]);
var Xo = function(a, b) {
  chrome.extension.getBackgroundPage() && chrome.extension.getBackgroundPage().backgroundSetup || window.close();
  this.b = a;
  this.b.top = a;
  this.gf = chrome.extension.getBackgroundPage().backgroundSetup;
  var c = new $n;
  Vc().Uc(Qc);
  co(chrome.extension.getBackgroundPage().console);
  c.Dq(!0);
  this.a = G("cv.Feedback");
  this.ve = null;
  this.gm = [];
  this.gy();
  this.ey();
  this.fy();
  b.location.hash && -1 < b.location.hash.indexOf("requestMirroringSessionFeedback") ? (a.requestMirroringSessionFeedback = !0, a.feedbackType = "MirroringQuality") : (c = window.location.href ? (new W(window.location.href)).El().get("feedbackType") : null) && this.dy(c) && (a.feedbackType = c);
  a.showSendConfirmation = !1;
  a.closeWindow = function() {
    window.close();
  };
};
ba("FeedbackCtrl", Xo, void 0);
Xo.$inject = ["$scope", "$window"];
Xo.prototype.dy = function(a) {
  return!!A(this.gm, function(b) {
    return b.value == a;
  });
};
Xo.prototype.ey = function() {
  this.gm = [{value:"Bug", desc:wo}, {value:"FeatureRequest", desc:xo}, {value:"MirroringQuality", desc:yo}, {value:"Discovery", desc:zo}, {value:"Other", desc:Ao}];
  this.b.feedbackTypes = this.gm;
};
var Yo = function(a, b) {
  this.id = a;
  this.desc = b;
  this.text = 0 == a ? b : a + " (" + b + ")";
};
d = Xo.prototype;
d.Vn = function(a) {
  for (var b = [], c = 1;c < arguments.length;c++) {
    b.push(new Yo(c, arguments[c]));
  }
  b.push(new Yo(0, arguments[0]));
  return b;
};
d.gy = function() {
  this.b.videoSmoothnessRatings = this.Vn(Go, Bo, Co, Do, Eo, Fo);
  this.b.videoQualityRatings = this.Vn(Go, Ho, Io, Jo, Ko, Lo);
  this.b.audioQualityRatings = this.Vn(Go, Mo, No, Oo, Po, Qo);
};
d.fy = function() {
  this.b.feedbackType = "Bug";
  this.b.sendFeedback = s(this.QC, this);
  this.b.cancel = s(this.OC, this);
  this.b.attachLogsClick = s(this.NC, this);
};
d.OC = function() {
  this.b.feedbackDescription && !confirm(Ro) || window.close();
};
d.QC = function() {
  var a = this.b.feedbackType, b = "";
  null == this.ve && (this.ve = new Ud);
  var c = !1, e = !1;
  "MirroringQuality" == a ? (this.b.cpu && (b += "\nProcessor: " + this.b.cpu, this.ve.cpu = this.b.cpu, c = !0), this.b.gpu && (b += "\nGraphics: " + this.b.gpu, this.ve.gpu = this.b.gpu, c = !0), this.b.videoSmoothness && (b += "\nVideo Smoothness: " + this.b.videoSmoothness, e = !0), this.b.videoQuality && (b += "\nVideo Quality: " + this.b.videoQuality, e = !0), this.b.audioQuality && (b += "\nAudio: " + this.b.audioQuality, e = !0), this.b.projectedContentUrl && (b += "\nProjected Content/URL: " + 
  this.b.projectedContentUrl), this.b.comments && (b += "\nComments: " + this.b.comments, e = !0)) : "Discovery" == a && (this.b.visibleInSetup && (b += "\nChromecast Visible In Setup: " + this.b.visibleInSetup, e = !0), this.b.hasNetworkSoftware && (b += "\nUsing VPN/proxy/firewall/NAS Software: " + this.b.hasNetworkSoftware, this.ve.hasNetworkSoftware = this.b.hasNetworkSoftware, c = !0), this.b.networkDescription && (b += "\nNetwork Description: " + this.b.networkDescription, this.ve.networkDescription = 
  this.b.networkDescription, c = !0), this.b.comments && (b += "\nComments: " + this.b.comments, e = !0));
  this.b.feedbackDescription && (e = !0, b += this.b.feedbackDescription);
  c && this.gf.Vl().xC(this.ve);
  e && this.wC("Type: " + a + "\n\n" + b);
};
d.wC = function(a) {
  this.b.showSendConfirmation = !0;
  this.b.sendDialogText = So;
  this.b.feedbackSent = !1;
  var b = s(function() {
    this.a.info("Feedback submission succeeded.");
    this.gf.Px();
    this.b.sendDialogText = Uo;
    this.b.feedbackSent = !0;
    this.b.$apply();
  }, this), c = s(function() {
    this.a.info("Feedback submission failed.");
    this.b.sendDialogText = To;
    this.b.feedbackSent = !0;
    this.b.$apply();
  }, this), e = this.gf.tq(), f = this.gf.Vl().Qx(), g = s(function(a, b, c) {
    this.a.info("feedback send callback: " + JSON.stringify({attempt:a.am(), isSuccess:b, info:c}));
    b ? a.ul() : (this.b.sendDialogText = Nk.F().getMessage(Vo, {attemptNumber:a.am()}), this.b.$apply(), a.qg());
  }, this), k = s(function(b) {
    this.a.info("attempt sending feedback: " + b.am());
    b = oa(g, b);
    var c = this.b.logs || "", k = this.b.externalLogs || "", l = chrome.runtime.getManifest();
    Wo({productId:85561, bucket:l.feedbackBucket, flow:"submit", serverUri:"https://www.google.com/tools/feedback", allowNonLoggedInFeedback:!0, locale:"en", report:{description:a}, callback:b}, {version:l.version, description:l.description, settings:f || "", logs:c || "NA", external_logs:k || "NA", "webRTC stats":e || "NA"});
  }, this), l = new Mj;
  l.xl(4);
  l.ri(1E4);
  l.Qp(2);
  l.start(k, b, c);
};
d.NC = function() {
  if (this.b.attachLogs) {
    var a = null;
    Oj() && (a = chrome.extension.getBackgroundPage().getChromeKeySetupLogs);
    this.b.logs = a ? ">>> Background Page Logs <<<\n" + this.gf.gk() + "\n\n\n\n>>> ChromeKey Setup Page Logs <<<\n" + a() : this.gf.gk();
  } else {
    this.b.logs = "";
  }
};
"undefined" != typeof angular && angular.module("optionsController", ["chrome_i18n"]);
var $o = function(a) {
  chrome.extension.getBackgroundPage() && chrome.extension.getBackgroundPage().backgroundSetup || window.close();
  a.Rl = function(b, c) {
    a.$watch(b, function(a, b) {
      JSON.stringify(b) != JSON.stringify(a) && c(a);
    });
  };
  a.model = a;
  this.C = this.Vx();
  this.a = G("cv.OptionsCtrl");
  this.b = a;
  this.b.showSavedMessage = !1;
  this.b.stopCasting = s(this.$x, this);
  this.b.isChromekeySetupActive = !1;
  this.Zx();
  this.Wx();
  this.Xx();
  this.Yx();
  Zo = s(function(a) {
    this.b.isChromekeySetupActive = a;
    this.b.$apply();
  }, this);
};
ba("OptionsCtrl", $o, void 0);
$o.$inject = ["$scope"];
var Zo = null;
ba("notifyChromekeySetupActive", function(a) {
  Zo && Zo(a);
}, void 0);
d = $o.prototype;
d.Dh = function() {
  return chrome.extension.getBackgroundPage().backgroundSetup;
};
d.Vx = function() {
  return this.Dh().Vl();
};
d.Xx = function() {
  this.b.qualityLevels = Od;
  this.b.isMirroring = !!this.Dh().Tj().td();
  this.b.Rl("quality", s(function(a) {
    this.b.qualityLevels.forEach(s(function(b) {
      "custom" != a && b.id == a && (this.b.videoResolution = b.videoResolution, this.b.maxVideoBitrate = b.maxVideoBitrate, this.b.minVideoBitrate = b.minVideoBitrate, this.b.videoQuality = b.videoQuality, this.b.audioBitrate = b.audioBitrate);
    }, this));
    this.Xj("quality");
  }, this));
  this.uC(!0);
};
d.Xj = function() {
  this.b.showStopCasting = !!this.Dh().Tj().td();
  this.zC();
};
d.$x = function() {
  this.b.showStopCasting = !1;
  var a = this.Dh().Tj().td();
  a && this.Dh().Tj().stopActivityById(a.c());
};
d.uC = function(a) {
  var b = this.b.quality || null;
  this.b.quality = this.C.pa().Al();
  "custom" == this.b.quality && (this.b.quality = Nd.id);
  a || (null == b || b == this.b.quality) && "custom" != this.b.quality || this.Xj("quality");
};
d.Zx = function() {
  this.b.zoomMode = this.C.pa().zoomModeEnabled ? "on" : "off";
  this.b.Rl("zoomMode", s(function() {
    this.Xj("zoomMode");
  }, this));
};
d.Wx = function() {
  this.b.allowAutoResize = this.C.pa().allowAutoResize;
  this.b.Rl("allowAutoResize", s(function() {
    this.Xj("allowAutoResize");
  }, this));
};
d.zC = function() {
  n(this.b.videoResolution) && this.C.pa().Ls(this.b.videoResolution);
  n(this.b.minVideoBitrate) && this.C.pa().cC(this.b.minVideoBitrate);
  n(this.b.maxVideoBitrate) && this.C.pa().bC(this.b.maxVideoBitrate);
  n(this.b.videoQuality) && this.C.pa().eC(this.b.videoQuality);
  n(this.b.audioBitrate) && this.C.pa().Fn(this.b.audioBitrate);
  n(this.b.bufferSizeMillis) && this.C.pa().$B(this.b.bufferSizeMillis);
  n(this.b.maxFrameRate) && this.C.pa().aC(this.b.maxFrameRate);
  n(this.b.zoomMode) && (this.C.pa().zoomModeEnabled = "on" == this.b.zoomMode);
  n(this.b.allowAutoResize) && (this.C.pa().allowAutoResize = this.b.allowAutoResize ? !0 : !1);
  n(this.b.enablePacing) && this.C.pa().dC(this.b.enablePacing ? !0 : !1);
  n(this.b.enableAudioTcp) && this.C.pa().YB(this.b.enableAudioTcp ? !0 : !1);
  n(this.b.enableVideoTcp) && this.C.pa().fC(this.b.enableVideoTcp ? !0 : !1);
  n(this.b.enableAudioNack) && this.C.pa().XB(this.b.enableAudioNack ? !0 : !1);
  n(this.b.autoFeedback) && this.C.pa().ZB(this.b.autoFeedback ? !0 : !1);
  this.C.Fe();
  this.b.showSavedMessage = !0;
};
d.Yx = function() {
  this.b.customDomains = this.C.Ks();
  this.b.$watch("customDomains", s(function(a) {
    this.C.sC(a);
  }, this), !0);
  this.b.addCustomDomain = s(function() {
    var a = this.b.newCustomDomain;
    a && -1 == this.b.customDomains.indexOf(a) && this.b.customDomains.push(a);
    this.b.newCustomDomain = "";
  }, this);
  this.b.deleteCustomDomain = s(function(a) {
    tb(this.b.customDomains, a);
  }, this);
};

