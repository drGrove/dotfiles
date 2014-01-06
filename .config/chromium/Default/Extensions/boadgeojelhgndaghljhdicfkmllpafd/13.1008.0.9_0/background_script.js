var d;
window.DH = !0;
var chrome = chrome || {};
var aa = aa || {}, h = this, ba = function(a, b, c) {
  a = a.split(".");
  c = c || h;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for(var e;a.length && (e = a.shift());) {
    a.length || void 0 === b ? c = c[e] ? c[e] : c[e] = {} : c[e] = b
  }
}, ca = function(a, b) {
  for(var c = a.split("."), e = b || h, f;f = c.shift();) {
    if(null != e[f]) {
      e = e[f]
    }else {
      return null
    }
  }
  return e
}, m = function() {
}, da = function(a) {
  a.I = function() {
    return a.eu ? a.eu : a.eu = new a
  }
}, n = function(a) {
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
}, p = function(a) {
  return void 0 !== a
}, q = function(a) {
  return"array" == n(a)
}, ea = function(a) {
  var b = n(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}, s = function(a) {
  return"string" == typeof a
}, fa = function(a) {
  return"number" == typeof a
}, ga = function(a) {
  return"function" == n(a)
}, ha = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
}, ia = "closure_uid_" + (1E9 * Math.random() >>> 0), ja = 0, ka = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
}, la = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, e);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
}, t = function(a, b, c) {
  t = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ka : la;
  return t.apply(null, arguments)
}, ma = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b)
  }
}, u = Date.now || function() {
  return+new Date
}, v = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.q = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
Function.prototype.bind = Function.prototype.bind || function(a, b) {
  if(1 < arguments.length) {
    var c = Array.prototype.slice.call(arguments, 1);
    c.unshift(this, a);
    return t.apply(null, c)
  }
  return t(this, a)
};
var na = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
}, oa = function(a, b) {
  for(var c = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < c.length;) {
    e += c.shift() + f.shift()
  }
  return e + c.join("%s")
}, pa = function(a) {
  return/^[\s\xa0]*$/.test(a)
}, qa = function(a, b) {
  var c = String(a).toLowerCase(), e = String(b).toLowerCase();
  return c < e ? -1 : c == e ? 0 : 1
}, wa = function(a, b) {
  if(b) {
    return a.replace(ra, "&amp;").replace(sa, "&lt;").replace(ta, "&gt;").replace(ua, "&quot;")
  }
  if(!va.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(ra, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(sa, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(ta, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(ua, "&quot;"));
  return a
}, ra = /&/g, sa = /</g, ta = />/g, ua = /\"/g, va = /[&<>\"]/, za = function(a) {
  return-1 != a.indexOf("&") ? "document" in h ? xa(a) : ya(a) : a
}, xa = function(a) {
  var b = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, c = document.createElement("div");
  return a.replace(Aa, function(a, f) {
    var g = b[a];
    if(g) {
      return g
    }
    if("#" == f.charAt(0)) {
      var k = Number("0" + f.substr(1));
      isNaN(k) || (g = String.fromCharCode(k))
    }
    g || (c.innerHTML = a + " ", g = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = g
  })
}, ya = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var e = Number("0" + c.substr(1));
          if(!isNaN(e)) {
            return String.fromCharCode(e)
          }
        }
        return a
    }
  })
}, Aa = /&([^;\s<&]+);?/g, Ba = function(a, b, c) {
  c && (a = za(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = wa(a));
  return a
}, Ca = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"}, Da = {"'":"\\'"}, Ea = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var e = a.charAt(c), f = e.charCodeAt(0), g = b, k = c + 1, l;
    if(!(l = Ca[e])) {
      if(!(31 < f && 127 > f)) {
        if(e in Da) {
          e = Da[e]
        }else {
          if(e in Ca) {
            e = Da[e] = Ca[e]
          }else {
            f = e;
            l = e.charCodeAt(0);
            if(31 < l && 127 > l) {
              f = e
            }else {
              if(256 > l) {
                if(f = "\\x", 16 > l || 256 < l) {
                  f += "0"
                }
              }else {
                f = "\\u", 4096 > l && (f += "0")
              }
              f += l.toString(16).toUpperCase()
            }
            e = Da[e] = f
          }
        }
      }
      l = e
    }
    g[k] = l
  }
  b.push('"');
  return b.join("")
}, Fa = function(a) {
  return Array.prototype.join.call(arguments, "")
}, Ga = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ u()).toString(36)
}, Ha = function(a, b) {
  for(var c = 0, e = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), g = Math.max(e.length, f.length), k = 0;0 == c && k < g;k++) {
    var l = e[k] || "", r = f[k] || "", A = RegExp("(\\d*)(\\D*)", "g"), C = RegExp("(\\d*)(\\D*)", "g");
    do {
      var L = A.exec(l) || ["", "", ""], J = C.exec(r) || ["", "", ""];
      if(0 == L[0].length && 0 == J[0].length) {
        break
      }
      c = ((0 == L[1].length ? 0 : parseInt(L[1], 10)) < (0 == J[1].length ? 0 : parseInt(J[1], 10)) ? -1 : (0 == L[1].length ? 0 : parseInt(L[1], 10)) > (0 == J[1].length ? 0 : parseInt(J[1], 10)) ? 1 : 0) || ((0 == L[2].length) < (0 == J[2].length) ? -1 : (0 == L[2].length) > (0 == J[2].length) ? 1 : 0) || (L[2] < J[2] ? -1 : L[2] > J[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
};
var Ia = function() {
  this.gv = u()
}, Ja = new Ia;
Ia.prototype.set = function(a) {
  this.gv = a
};
Ia.prototype.reset = function() {
  this.set(u())
};
Ia.prototype.get = function() {
  return this.gv
};
var Ka = function(a) {
  this.XD = a || "";
  this.ZD = Ja
};
d = Ka.prototype;
d.$D = !0;
d.Fj = !0;
d.fE = !0;
d.eE = !0;
d.Gj = !1;
d.gn = !1;
var La = function(a) {
  return 10 > a ? "0" + a : String(a)
}, Ma = function(a, b) {
  var c = (a.Qt() - b) / 1E3, e = c.toFixed(3), f = 0;
  if(1 > c) {
    f = 2
  }else {
    for(;100 > c;) {
      f++, c *= 10
    }
  }
  for(;0 < f--;) {
    e = " " + e
  }
  return e
}, Na = function(a) {
  Ka.call(this, a)
};
v(Na, Ka);
Na.prototype.au = function(a) {
  var b = [];
  b.push(this.XD, " ");
  if(this.Fj) {
    var c = new Date(a.Qt());
    b.push("[", La(c.getFullYear() - 2E3) + La(c.getMonth() + 1) + La(c.getDate()) + " " + La(c.getHours()) + ":" + La(c.getMinutes()) + ":" + La(c.getSeconds()) + "." + La(Math.floor(c.getMilliseconds() / 10)), "] ")
  }
  this.fE && b.push("[", Ma(a, this.ZD.get()), "s] ");
  this.eE && b.push("[", a.Bt(), "] ");
  this.gn && b.push("[", a.rn().name, "] ");
  b.push(a.getMessage());
  this.Gj && a.bE() && b.push("\n", a.cE());
  this.$D && b.push("\n");
  return b.join("")
};
var Oa = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, Oa) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
v(Oa, Error);
Oa.prototype.name = "CustomError";
var Pa;
var Qa = function(a, b) {
  b.unshift(a);
  Oa.call(this, oa.apply(null, b));
  b.shift()
};
v(Qa, Oa);
Qa.prototype.name = "AssertionError";
var Ra = function(a, b, c, e) {
  var f = "Assertion failed";
  if(c) {
    var f = f + (": " + c), g = e
  }else {
    a && (f += ": " + a, g = b)
  }
  throw new Qa("" + f, g || []);
}, w = function(a, b, c) {
  a || Ra("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
}, Sa = function(a, b) {
  throw new Qa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}, Ta = function(a, b, c) {
  fa(a) || Ra("Expected number but got %s: %s.", [n(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
}, Ua = function(a, b, c) {
  s(a) || Ra("Expected string but got %s: %s.", [n(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
}, Va = function(a, b, c) {
  ha(a) || Ra("Expected object but got %s: %s.", [n(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
}, Wa = function(a, b, c) {
  q(a) || Ra("Expected array but got %s: %s.", [n(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
}, Xa = function(a, b, c) {
  "boolean" == typeof a || Ra("Expected boolean but got %s: %s.", [n(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
}, Ya = function(a, b, c, e) {
  a instanceof b || Ra("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
var Za = function(a, b, c, e, f) {
  this.reset(a, b, c, e, f)
};
Za.prototype.Hn = null;
Za.prototype.Gn = null;
var $a = 0;
d = Za.prototype;
d.reset = function(a, b, c, e, f) {
  "number" == typeof f || $a++;
  this.ZE = e || u();
  this.De = a;
  this.vu = b;
  this.YE = c;
  delete this.Hn;
  delete this.Gn
};
d.Bt = function() {
  return this.YE
};
d.bE = function() {
  return this.Hn
};
d.MF = function(a) {
  this.Hn = a
};
d.cE = function() {
  return this.Gn
};
d.NF = function(a) {
  this.Gn = a
};
d.rn = function() {
  return this.De
};
d.tc = function(a) {
  this.De = a
};
d.getMessage = function() {
  return this.vu
};
d.It = function(a) {
  this.vu = a
};
d.Qt = function() {
  return this.ZE
};
var ab = function() {
  w(!0, "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear()
}, bb, cb = function() {
  bb || (bb = new ab);
  return bb
};
ab.prototype.HF = function(a, b, c) {
  var e = (this.Pn + 1) % 5E3;
  this.Pn = e;
  if(this.Qn) {
    return e = this.Od[e], e.reset(a, b, c), e
  }
  this.Qn = 4999 == e;
  return this.Od[e] = new Za(a, b, c)
};
ab.prototype.clear = function() {
  this.Od = Array(5E3);
  this.Pn = -1;
  this.Qn = !1
};
ab.prototype.kF = function(a) {
  var b = this.Od;
  if(b[0]) {
    var c = this.Pn, e = this.Qn ? c : -1;
    do {
      e = (e + 1) % 5E3, a(b[e])
    }while(e != c)
  }
};
var x = Array.prototype, db = x.indexOf ? function(a, b, c) {
  w(null != a.length);
  return x.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(s(a)) {
    return s(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, y = x.forEach ? function(a, b, c) {
  w(null != a.length);
  x.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var e = a.length, f = s(a) ? a.split("") : a, g = 0;g < e;g++) {
    g in f && b.call(c, f[g], g, a)
  }
}, eb = function(a, b, c) {
  for(var e = s(a) ? a.split("") : a, f = a.length - 1;0 <= f;--f) {
    f in e && b.call(c, e[f], f, a)
  }
}, fb = x.filter ? function(a, b, c) {
  w(null != a.length);
  return x.filter.call(a, b, c)
} : function(a, b, c) {
  for(var e = a.length, f = [], g = 0, k = s(a) ? a.split("") : a, l = 0;l < e;l++) {
    if(l in k) {
      var r = k[l];
      b.call(c, r, l, a) && (f[g++] = r)
    }
  }
  return f
}, gb = x.map ? function(a, b, c) {
  w(null != a.length);
  return x.map.call(a, b, c)
} : function(a, b, c) {
  for(var e = a.length, f = Array(e), g = s(a) ? a.split("") : a, k = 0;k < e;k++) {
    k in g && (f[k] = b.call(c, g[k], k, a))
  }
  return f
}, hb = x.some ? function(a, b, c) {
  w(null != a.length);
  return x.some.call(a, b, c)
} : function(a, b, c) {
  for(var e = a.length, f = s(a) ? a.split("") : a, g = 0;g < e;g++) {
    if(g in f && b.call(c, f[g], g, a)) {
      return!0
    }
  }
  return!1
}, ib = x.every ? function(a, b, c) {
  w(null != a.length);
  return x.every.call(a, b, c)
} : function(a, b, c) {
  for(var e = a.length, f = s(a) ? a.split("") : a, g = 0;g < e;g++) {
    if(g in f && !b.call(c, f[g], g, a)) {
      return!1
    }
  }
  return!0
}, jb = function(a, b, c) {
  var e = 0;
  y(a, function(a, g, k) {
    b.call(c, a, g, k) && ++e
  }, c);
  return e
}, z = function(a, b, c) {
  b = kb(a, b, c);
  return 0 > b ? null : s(a) ? a.charAt(b) : a[b]
}, kb = function(a, b, c) {
  for(var e = a.length, f = s(a) ? a.split("") : a, g = 0;g < e;g++) {
    if(g in f && b.call(c, f[g], g, a)) {
      return g
    }
  }
  return-1
}, B = function(a, b) {
  return 0 <= db(a, b)
}, lb = function(a) {
  if(!q(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
}, nb = function(a, b) {
  var c = db(a, b), e;
  (e = 0 <= c) && mb(a, c);
  return e
}, mb = function(a, b) {
  w(null != a.length);
  return 1 == x.splice.call(a, b, 1).length
}, ob = function(a, b, c) {
  b = kb(a, b, c);
  return 0 <= b ? (mb(a, b), !0) : !1
}, pb = function(a) {
  return x.concat.apply(x, arguments)
}, qb = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), e = 0;e < b;e++) {
      c[e] = a[e]
    }
    return c
  }
  return[]
}, sb = function(a, b, c, e) {
  w(null != a.length);
  return x.splice.apply(a, rb(arguments, 1))
}, rb = function(a, b, c) {
  w(null != a.length);
  return 2 >= arguments.length ? x.slice.call(a, b) : x.slice.call(a, b, c)
}, ub = function(a, b) {
  w(null != a.length);
  x.sort.call(a, b || tb)
}, tb = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
var D = {constant:function(a) {
  return function() {
    return a
  }
}};
D.JH = D.constant(!1);
D.XH = D.constant(!0);
D.PH = D.constant(null);
D.identity = function(a) {
  return a
};
D.error = function(a) {
  return function() {
    throw Error(a);
  }
};
D.Rd = function(a) {
  return function() {
    throw a;
  }
};
D.cI = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b))
  }
};
D.eI = function(a) {
  return function() {
    return arguments[a]
  }
};
D.gI = function(a, b) {
  return D.kH(a, D.constant(b))
};
D.bI = function(a, b) {
  var c = arguments, e = c.length;
  return function() {
    var a;
    e && (a = c[e - 1].apply(this, arguments));
    for(var b = e - 2;0 <= b;b--) {
      a = c[b].call(this, a)
    }
    return a
  }
};
D.kH = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a, f = 0;f < c;f++) {
      a = b[f].apply(this, arguments)
    }
    return a
  }
};
D.ZH = function(a) {
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
D.fI = function(a) {
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
D.dI = function(a) {
  return function() {
    return!a.apply(this, arguments)
  }
};
D.create = function(a, b) {
  var c = function() {
  };
  c.prototype = a.prototype;
  c = new c;
  a.apply(c, Array.prototype.slice.call(arguments, 1));
  return c
};
D.SG = !0;
D.aI = function(a) {
  var b = !1, c;
  return function() {
    if(!D.SG) {
      return a()
    }
    b || (c = a(), b = !0);
    return c
  }
};
var vb = "StopIteration" in h ? h.StopIteration : Error("StopIteration"), wb = function() {
};
wb.prototype.next = function() {
  throw vb;
};
wb.prototype.Ee = function() {
  return this
};
var xb = function(a) {
  if(a instanceof wb) {
    return a
  }
  if("function" == typeof a.Ee) {
    return a.Ee(!1)
  }
  if(ea(a)) {
    var b = 0, c = new wb;
    c.next = function() {
      for(;;) {
        if(b >= a.length) {
          throw vb;
        }
        if(b in a) {
          return a[b++]
        }
        b++
      }
    };
    return c
  }
  throw Error("Not implemented");
}, yb = function(a, b, c) {
  if(ea(a)) {
    try {
      y(a, b, c)
    }catch(e) {
      if(e !== vb) {
        throw e;
      }
    }
  }else {
    a = xb(a);
    try {
      for(;;) {
        b.call(c, a.next(), void 0, a)
      }
    }catch(f) {
      if(f !== vb) {
        throw f;
      }
    }
  }
};
var zb = function(a, b, c) {
  for(var e in a) {
    b.call(c, a[e], e, a)
  }
}, Ab = function(a) {
  var b = [], c = 0, e;
  for(e in a) {
    b[c++] = a[e]
  }
  return b
}, Bb = function(a) {
  var b = [], c = 0, e;
  for(e in a) {
    b[c++] = e
  }
  return b
}, Cb = function(a, b, c) {
  for(var e in a) {
    if(b.call(c, a[e], e, a)) {
      return e
    }
  }
}, Db = function(a, b, c) {
  return(b = Cb(a, b, c)) && a[b]
}, Eb = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
}, Fb = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
}, Gb = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
}, Hb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), Ib = function(a, b) {
  for(var c, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for(c in e) {
      a[c] = e[c]
    }
    for(var g = 0;g < Hb.length;g++) {
      c = Hb[g], Object.prototype.hasOwnProperty.call(e, c) && (a[c] = e[c])
    }
  }
};
var E = function(a, b) {
  this.O = {};
  this.W = [];
  this.Gb = this.ia = 0;
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var e = 0;e < c;e += 2) {
      this.set(arguments[e], arguments[e + 1])
    }
  }else {
    a && this.uj(a)
  }
};
d = E.prototype;
d.K = function() {
  return this.ia
};
d.U = function() {
  this.Hf();
  for(var a = [], b = 0;b < this.W.length;b++) {
    a.push(this.O[this.W[b]])
  }
  return a
};
d.Ua = function() {
  this.Hf();
  return this.W.concat()
};
d.Aa = function(a) {
  return Jb(this.O, a)
};
d.Of = function(a) {
  for(var b = 0;b < this.W.length;b++) {
    var c = this.W[b];
    if(Jb(this.O, c) && this.O[c] == a) {
      return!0
    }
  }
  return!1
};
d.equals = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.ia != a.K()) {
    return!1
  }
  var c = b || Kb;
  this.Hf();
  for(var e, f = 0;e = this.W[f];f++) {
    if(!c(this.get(e), a.get(e))) {
      return!1
    }
  }
  return!0
};
var Kb = function(a, b) {
  return a === b
};
d = E.prototype;
d.nb = function() {
  return 0 == this.ia
};
d.clear = function() {
  this.O = {};
  this.Gb = this.ia = this.W.length = 0
};
d.remove = function(a) {
  return Jb(this.O, a) ? (delete this.O[a], this.ia--, this.Gb++, this.W.length > 2 * this.ia && this.Hf(), !0) : !1
};
d.Hf = function() {
  if(this.ia != this.W.length) {
    for(var a = 0, b = 0;a < this.W.length;) {
      var c = this.W[a];
      Jb(this.O, c) && (this.W[b++] = c);
      a++
    }
    this.W.length = b
  }
  if(this.ia != this.W.length) {
    for(var e = {}, b = a = 0;a < this.W.length;) {
      c = this.W[a], Jb(e, c) || (this.W[b++] = c, e[c] = 1), a++
    }
    this.W.length = b
  }
};
d.get = function(a, b) {
  return Jb(this.O, a) ? this.O[a] : b
};
d.set = function(a, b) {
  Jb(this.O, a) || (this.ia++, this.W.push(a), this.Gb++);
  this.O[a] = b
};
d.uj = function(a) {
  var b;
  a instanceof E ? (b = a.Ua(), a = a.U()) : (b = Bb(a), a = Ab(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
d.clone = function() {
  return new E(this)
};
d.xD = function() {
  this.Hf();
  for(var a = {}, b = 0;b < this.W.length;b++) {
    var c = this.W[b];
    a[c] = this.O[c]
  }
  return a
};
d.OB = function() {
  return this.Ee(!0)
};
d.fB = function() {
  return this.Ee(!1)
};
d.Ee = function(a) {
  this.Hf();
  var b = 0, c = this.W, e = this.O, f = this.Gb, g = this, k = new wb;
  k.next = function() {
    for(;;) {
      if(f != g.Gb) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw vb;
      }
      var k = c[b++];
      return a ? k : e[k]
    }
  };
  return k
};
var Jb = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
};
var Lb = function(a) {
  if("function" == typeof a.K) {
    a = a.K()
  }else {
    if(ea(a) || s(a)) {
      a = a.length
    }else {
      var b = 0, c;
      for(c in a) {
        b++
      }
      a = b
    }
  }
  return a
}, Mb = function(a) {
  if("function" == typeof a.U) {
    return a.U()
  }
  if(s(a)) {
    return a.split("")
  }
  if(ea(a)) {
    for(var b = [], c = a.length, e = 0;e < c;e++) {
      b.push(a[e])
    }
    return b
  }
  return Ab(a)
}, Nb = function(a) {
  if("function" == typeof a.Ua) {
    return a.Ua()
  }
  if("function" != typeof a.U) {
    if(ea(a) || s(a)) {
      var b = [];
      a = a.length;
      for(var c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return Bb(a)
  }
}, Ob = function(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ea(a) || s(a)) {
      y(a, b, c)
    }else {
      for(var e = Nb(a), f = Mb(a), g = f.length, k = 0;k < g;k++) {
        b.call(c, f[k], e && e[k], a)
      }
    }
  }
}, Pb = function(a, b, c) {
  if("function" == typeof a.every) {
    return a.every(b, c)
  }
  if(ea(a) || s(a)) {
    return ib(a, b, c)
  }
  for(var e = Nb(a), f = Mb(a), g = f.length, k = 0;k < g;k++) {
    if(!b.call(c, f[k], e && e[k], a)) {
      return!1
    }
  }
  return!0
};
var Qb = function(a) {
  this.O = new E;
  a && this.uj(a)
}, Rb = function(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + (a[ia] || (a[ia] = ++ja)) : b.substr(0, 1) + a
};
d = Qb.prototype;
d.K = function() {
  return this.O.K()
};
d.add = function(a) {
  this.O.set(Rb(a), a)
};
d.uj = function(a) {
  a = Mb(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
d.removeAll = function(a) {
  a = Mb(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
d.remove = function(a) {
  return this.O.remove(Rb(a))
};
d.clear = function() {
  this.O.clear()
};
d.nb = function() {
  return this.O.nb()
};
d.contains = function(a) {
  return this.O.Aa(Rb(a))
};
d.U = function() {
  return this.O.U()
};
d.clone = function() {
  return new Qb(this)
};
d.equals = function(a) {
  return this.K() == Lb(a) && this.AE(a)
};
d.AE = function(a) {
  var b = Lb(a);
  if(this.K() > b) {
    return!1
  }
  !(a instanceof Qb) && 5 < b && (a = new Qb(a));
  return Pb(this, function(b) {
    if("function" == typeof a.contains) {
      b = a.contains(b)
    }else {
      if("function" == typeof a.Of) {
        b = a.Of(b)
      }else {
        if(ea(a) || s(a)) {
          b = B(a, b)
        }else {
          t: {
            var e = a, f;
            for(f in e) {
              if(e[f] == b) {
                b = !0;
                break t
              }
            }
            b = !1
          }
        }
      }
    }
    return b
  })
};
d.Ee = function() {
  return this.O.Ee(!1)
};
var Sb, Tb, Ub, Vb, Wb, Xb, Yb, Zb, $b, ac = function() {
  return h.navigator ? h.navigator.userAgent : null
};
Vb = Ub = Tb = Sb = !1;
var bc;
if(bc = ac()) {
  var cc = h.navigator;
  Sb = 0 == bc.lastIndexOf("Opera", 0);
  Tb = !Sb && (-1 != bc.indexOf("MSIE") || -1 != bc.indexOf("Trident"));
  Ub = !Sb && -1 != bc.indexOf("WebKit");
  Vb = !Sb && !Ub && !Tb && "Gecko" == cc.product
}
var dc = Sb, F = Tb, ec = Vb, G = Ub, fc = h.navigator, gc = fc && fc.platform || "";
Wb = -1 != gc.indexOf("Mac");
Xb = -1 != gc.indexOf("Win");
Yb = -1 != gc.indexOf("Linux");
var hc = ac();
Zb = !!hc && -1 != hc.indexOf("Android");
$b = !!hc && -1 != hc.indexOf("iPhone");
var ic = !!hc && -1 != hc.indexOf("iPad"), jc = function() {
  var a = h.document;
  return a ? a.documentMode : void 0
}, kc;
t: {
  var lc = "", mc;
  if(dc && h.opera) {
    var nc = h.opera.version, lc = "function" == typeof nc ? nc() : nc
  }else {
    if(ec ? mc = /rv\:([^\);]+)(\)|;)/ : F ? mc = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : G && (mc = /WebKit\/(\S+)/), mc) {
      var oc = mc.exec(ac()), lc = oc ? oc[1] : ""
    }
  }
  if(F) {
    var pc = jc();
    if(pc > parseFloat(lc)) {
      kc = String(pc);
      break t
    }
  }
  kc = lc
}
var qc = kc, rc = {}, sc = function(a) {
  return rc[a] || (rc[a] = 0 <= Ha(qc, a))
}, tc = h.document, uc = tc && F ? jc() || ("CSS1Compat" == tc.compatMode ? parseInt(qc, 10) : 5) : void 0;
var vc = function(a, b, c) {
  c = c || h;
  var e = c.onerror, f = !!b;
  G && !sc("535.3") && (f = !f);
  c.onerror = function(b, c, l, r, A) {
    e && e(b, c, l, r, A);
    a({message:b, fileName:c, Gt:l, tH:r, error:A});
    return f
  }
}, xc = function(a, b) {
  try {
    var c;
    var e = ca("window.location.href");
    if(s(a)) {
      c = {message:a, name:"Unknown error", lineNumber:"Not available", fileName:e, stack:"Not available"}
    }else {
      var f, g, k = !1;
      try {
        f = a.lineNumber || a.Gt || "Not available"
      }catch(l) {
        f = "Not available", k = !0
      }
      try {
        g = a.fileName || a.filename || a.sourceURL || h.$googDebugFname || e
      }catch(r) {
        g = "Not available", k = !0
      }
      c = !k && a.lineNumber && a.fileName && a.stack && a.message && a.name ? a : {message:a.message || "Not available", name:a.name || "UnknownError", lineNumber:f, fileName:g, stack:a.stack || "Not available"}
    }
    return"Message: " + wa(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + wa(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + wa(wc(b) + "-> ")
  }catch(A) {
    return"Exception trying to expose exception! You win, we lose. " + A
  }
}, wc = function(a) {
  return yc(a || arguments.callee.caller, [])
}, yc = function(a, b) {
  var c = [];
  if(B(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(zc(a) + "(");
      for(var e = a.arguments, f = 0;f < e.length;f++) {
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
            g = (g = zc(g)) ? g : "[fn]";
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
        c.push(yc(a.caller, b))
      }catch(k) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}, zc = function(a) {
  if(Ac[a]) {
    return Ac[a]
  }
  a = String(a);
  if(!Ac[a]) {
    var b = /function ([^\(]+)/.exec(a);
    Ac[a] = b ? b[1] : "[Anonymous]"
  }
  return Ac[a]
}, Ac = {};
var Bc = function(a) {
  this.Gf = a
};
Bc.prototype.ob = null;
Bc.prototype.De = null;
Bc.prototype.$n = null;
Bc.prototype.qc = null;
var Cc = function(a, b) {
  this.name = a;
  this.value = b
};
Cc.prototype.toString = function() {
  return this.name
};
var Dc = new Cc("SHOUT", 1200), Ec = new Cc("SEVERE", 1E3), Fc = new Cc("WARNING", 900), Gc = new Cc("INFO", 800), Hc = new Cc("CONFIG", 700), Ic = new Cc("FINE", 500), Jc = new Cc("FINER", 400), Kc = new Cc("FINEST", 300);
d = Bc.prototype;
d.getName = function() {
  return this.Gf
};
d.Jn = function(a) {
  this.qc || (this.qc = []);
  this.qc.push(a)
};
d.Ln = function(a) {
  var b = this.qc;
  return!!b && nb(b, a)
};
d.getParent = function() {
  return this.ob
};
d.getChildren = function() {
  this.$n || (this.$n = {});
  return this.$n
};
d.tc = function(a) {
  this.De = a
};
d.rn = function() {
  return this.De
};
d.uu = function() {
  if(this.De) {
    return this.De
  }
  if(this.ob) {
    return this.ob.uu()
  }
  Sa("Root logger has no level set.");
  return null
};
d.mf = function(a) {
  return a.value >= this.uu().value
};
d.log = function(a, b, c) {
  this.mf(a) && this.SF(this.TF(a, b, c))
};
d.TF = function(a, b, c) {
  var e = cb().HF(a, b, this.Gf);
  c && (e.MF(c), e.NF(xc(c, arguments.callee.caller)));
  return e
};
d.t = function(a, b) {
  this.log(Ec, a, b)
};
d.e = function(a, b) {
  this.log(Fc, a, b)
};
Bc.prototype.info = function(a, b) {
  this.log(Gc, a, b)
};
d = Bc.prototype;
d.w = function(a, b) {
  this.log(Ic, a, b)
};
d.nz = function(a, b) {
  this.log(Jc, a, b)
};
d.ig = function(a, b) {
  this.log(Kc, a, b)
};
d.SF = function(a) {
  var b = "log:" + a.getMessage();
  h.console && (h.console.timeStamp ? h.console.timeStamp(b) : h.console.markTimeline && h.console.markTimeline(b));
  h.msWriteProfilerMark && h.msWriteProfilerMark(b);
  for(b = this;b;) {
    b.TG(a), b = b.getParent()
  }
};
d.TG = function(a) {
  if(this.qc) {
    for(var b = 0, c;c = this.qc[b];b++) {
      c(a)
    }
  }
};
d.OG = function(a) {
  this.ob = a
};
d.IG = function(a, b) {
  this.getChildren()[a] = b
};
var Lc = {}, Mc = null, Nc = function() {
  Mc || (Mc = new Bc(""), Lc[""] = Mc, Mc.tc(Hc))
}, Oc = function() {
  Nc();
  return Mc
}, H = function(a) {
  Nc();
  var b;
  if(!(b = Lc[a])) {
    b = new Bc(a);
    var c = a.lastIndexOf("."), e = a.substr(c + 1), c = H(a.substr(0, c));
    c.IG(e, b);
    b.OG(c);
    Lc[a] = b
  }
  return b
}, Pc = function(a) {
  return function(b) {
    (a || Oc()).t("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Gt + ")")
  }
};
var Qc = function() {
  var a = new Na;
  a.Fj = !0;
  a.gn = !0;
  a.Gj = !0;
  var b = "";
  cb().kF(function(c) {
    b += a.au(c) + "\n"
  });
  return b
}, Rc = function(a, b, c, e, f) {
  a.log(e ? e : Gc, b);
  try {
    a.log(f ? f : Ic, "--the object is " + JSON.stringify(c))
  }catch(g) {
  }
};
var Sc, Tc = Ab({EH:"cv", UH:"ramp", zH:"cm"}), Uc = Ab({LH:"launch_service", wH:"activity_service", vH:"activity", yH:"channel_connect_request", xH:"channel_connect_accepted"}), Vc = function(a, b) {
  this.type = a;
  this.message = b
};
H("cv.ChannelMessage");
var Wc = function(a) {
  return q(a) && "cm" == a[0] && ha(a[1]) && p(a[1].type)
};
var Xc = function(a, b) {
  this.id = a;
  this.name = b;
  this.isTabProjected = this.ipAddress = null
}, Yc = function() {
  this.url = this.text = null
}, Zc = function(a, b) {
  this.activityType = a;
  this.receiver = b;
  this.description = this.parameters = null;
  this.disconnectPolicy = "continue"
}, $c = function(a, b) {
  this.activityId = a;
  this.status = b;
  this.errorString = null;
  this.extraData = {}
}, ad = function(a, b) {
  this.eventSequenceId = null;
  this.activityId = a;
  this.state = b;
  this.imageUrl = this.title = this.contentId = null;
  this.timeProgress = !1;
  this.error = this.mediaTracks = this.contentInfo = this.muted = this.volume = this.duration = this.position = null;
  this.hasPause = !0
}, bd = function(a) {
  this.activityId = a;
  this.status = null;
  this.success = !1;
  this.errorString = null
}, cd = function(a, b) {
  this.id = a;
  this.type = b;
  this.selected = this.language = this.name = null
}, dd = function(a, b, c, e) {
  this.activityId = a;
  this.cmdId = b;
  this.method = c;
  this.requests = e
}, ed = [2, 4];
"undefined" != typeof chrome && "undefined" != typeof chrome.runtime || window.postMessage({source:"CastApi", event:"Hello", $H:ed}, "*");
var fd = function(a, b, c, e, f) {
  this.source = a;
  this.target = b;
  this.seq = c;
  this.type = e;
  this.message = f
}, gd = function(a, b) {
  this.activityType = a;
  this.receivers = b
}, hd = function(a, b, c) {
  this.activityId = a;
  this.namespace = b;
  this.message = c
};
var id = function(a, b) {
  this.cmd_id = a;
  this.type = b
}, jd = function(a, b, c, e) {
  a = a[c];
  null != a && (b[e ? e : c] = a)
}, I = function(a, b, c, e) {
  a = a[b];
  if(null == a) {
    if(c) {
      throw"Mandatory property " + b + " was " + a;
    }
    return p(e) ? e : null
  }
  return a
}, kd = function(a) {
  w(a.seq);
  var b = a.seq, c = a.message.rampRequest, e = null;
  switch(a.type) {
    case "LoadMedia":
      e = new id(b, "LOAD");
      jd(c, e, "src");
      jd(c, e, "title");
      jd(c, e, "autoplay");
      jd(c, e, "contentInfo", "content_info");
      jd(c, e, "imageUrl", "image_url");
      break;
    case "PlayMedia":
      e = new id(b, "PLAY");
      jd(c, e, "position");
      break;
    case "PauseMedia":
      e = new id(b, "STOP");
      break;
    case "SetMediaVolume":
      e = new id(b, "VOLUME");
      jd(c, e, "volume");
      jd(c, e, "muted");
      break;
    case "SelectMediaTracks":
      e = new id(b, "SELECT_TRACKS");
      jd(c, e, "enabledTracks", "enabled");
      jd(c, e, "disabledTracks", "disabled");
      break;
    case "MediaStatus":
      e = new id(b, "INFO");
      break;
    case "MediaKeyResponse":
      e = new id(c.cmdId, "KEY_RESPONSE"), jd(c, e, "tokens")
  }
  return e ? {message:e, error:null} : {message:null, error:"Unknown message type"}
}, ld = function(a, b) {
  return null != a.cmd_id && null != a.type && a.type == b
}, md = function(a) {
  if(!a) {
    return[]
  }
  var b = [];
  y(a, function(a) {
    var e = I(a, "id", !0), f = I(a, "type", !0), e = new cd(e, f);
    e.name = I(a, "name", !1);
    e.language = I(a, "lang", !1);
    e.selected = I(a, "selected", !1);
    b.push(e)
  });
  return b
};
var nd = function(a, b, c, e, f) {
  this.guid = a;
  this.manufacturer = b || "";
  this.model = c || "";
  this.displayName = e || "Unnamed";
  this.claimCode = f || "";
  this.accessToken = this.refreshToken = this.authCode = "";
  this.accessTokenExpiryTime = 0;
  this.channelToken = "";
  this.channelTokenExpiryTime = 0
};
nd.prototype.By = function() {
  return!!this.guid
};
H("cv.CloudDevice");
var od, pd, qd, rd, sd, td, ud;
ud = td = sd = rd = qd = pd = od = !1;
var vd = ac();
vd && (-1 != vd.indexOf("Firefox") ? od = !0 : -1 != vd.indexOf("Camino") ? pd = !0 : -1 != vd.indexOf("iPhone") || -1 != vd.indexOf("iPod") ? qd = !0 : -1 != vd.indexOf("iPad") ? rd = !0 : -1 != vd.indexOf("Chrome") ? td = !0 : -1 != vd.indexOf("Android") ? sd = !0 : -1 != vd.indexOf("Safari") && (ud = !0));
var wd = od, xd = pd, yd = qd, zd = rd, Ad = sd, Bd = td, Cd = ud;
var Dd = function(a) {
  return(a = a.exec(ac())) ? a[1] : ""
}, Ed = function() {
  if(wd) {
    return Dd(/Firefox\/([0-9.]+)/)
  }
  if(F || dc) {
    return qc
  }
  if(Bd) {
    return Dd(/Chrome\/([0-9.]+)/)
  }
  if(Cd) {
    return Dd(/Version\/([0-9.]+)/)
  }
  if(yd || zd) {
    var a = /Version\/(\S+).*Mobile\/(\S+)/.exec(ac());
    if(a) {
      return a[1] + "." + a[2]
    }
  }else {
    if(Ad) {
      return(a = Dd(/Android\s+([0-9.]+)/)) ? a : Dd(/Version\/([0-9.]+)/)
    }
    if(xd) {
      return Dd(/Camino\/([0-9.]+)/)
    }
  }
  return""
}();
var Fd = function(a, b, c, e, f, g, k, l) {
  this.id = a;
  this.name = b;
  this.videoWidth = c;
  this.videoHeight = e;
  this.videoResolution = c + "x" + e;
  this.minVideoBitrate = f;
  this.maxVideoBitrate = g;
  this.videoQuality = k;
  this.audioBitrate = l
}, Gd = new Fd("high", "High (720p)", 1280, 720, 2E3, 2500, 56, 128), Hd = [new Fd("highest", "Extreme (720p high bitrate)", 1280, 720, 4E3, 5E3, 56, 128), Gd, new Fd("low", "Standard (480p)", 854, 480, 750, 1500, 56, 128)], Id = function(a) {
  return z(Hd, function(b) {
    return b.id == a
  })
};
var Jd = function() {
  this.videoBitrate = Gd.maxVideoBitrate;
  this.minVideoBitrate = Gd.minVideoBitrate;
  this.maxVideoBitrate = Gd.maxVideoBitrate;
  this.videoQuality = Gd.videoQuality;
  this.minWidth = Gd.videoWidth;
  this.minHeight = Gd.videoHeight;
  this.audioBitrate = Gd.audioBitrate;
  this.useOpus = !0;
  this.bufferedMode = "on";
  this.bufferSizeMillis = 500;
  this.maxFrameRate = 30;
  this.enablePacing = Bd && 0 <= Ha(Ed, 28);
  this.enableVideoTcp = this.enableAudioTcp = !1;
  this.enableAudioNack = !0;
  this.allowAutoResize = !1;
  this.captureSurface = "tab";
  this.lowFpsMode = !1;
  this.autoFeedback = this.zoomModeEnabled = !0;
  this.preferredVideoCodec = "CAST1"
}, Kd = {"640x360":[640, 360], "854x480":[854, 480], "1280x720":[1280, 720]};
d = Jd.prototype;
d.update = function(a) {
  for(var b in this) {
    ga(this[b]) || (null != a[b] && n(this[b]) == n(a[b]) ? this[b] = a[b] : H("cv.MirrorTabSettings").e("Failed to load mirror settings for key [" + b + "]:" + a[b]))
  }
};
d.Hz = function(a) {
  s(a) && (a = parseInt(a, 10));
  this.maxVideoBitrate = a = Math.min(5E3, Math.max(100, a))
};
d.Iz = function(a) {
  s(a) && (a = parseInt(a, 10));
  this.minVideoBitrate = a = Math.min(5E3, Math.max(100, a))
};
d.Kz = function(a) {
  s(a) && (a = parseInt(a, 10));
  0 < a && (this.videoQuality = a)
};
d.$l = function(a) {
  s(a) && (a = parseInt(a, 10));
  this.audioBitrate = Math.min(128, Math.max(56, a))
};
d.Fz = function(a) {
  s(a) && (a = parseInt(a, 10));
  0 <= a && (this.bufferSizeMillis = a)
};
d.VB = function() {
  return 0 == this.bufferSizeMillis ? 0 : this.enablePacing ? this.bufferSizeMillis + 100 : this.bufferSizeMillis
};
d.Jz = function(a) {
  this.enablePacing = a
};
d.Dz = function(a) {
  this.enableAudioTcp = a
};
d.Lz = function(a) {
  this.enableVideoTcp = a
};
d.Cz = function(a) {
  this.enableAudioNack = a
};
d.Ez = function(a) {
  this.autoFeedback = a
};
d.NG = function(a) {
  s(a) && (a = parseInt(a, 10));
  this.minWidth = Math.max(100, a)
};
d.MG = function(a) {
  s(a) && (a = parseInt(a, 10));
  this.minHeight = Math.max(100, a)
};
d.Gz = function(a) {
  s(a) && (a = parseInt(a, 10));
  1 <= a && (this.maxFrameRate = a)
};
d.Tq = function(a) {
  if(a = Kd[a]) {
    this.NG(a[0]), this.MG(a[1])
  }
};
d.ZG = function() {
  return String(this.minWidth + "x" + this.minHeight)
};
d.pk = function() {
  var a = z(Hd, function(a) {
    return a.videoResolution == this.ZG() && a.videoQuality == this.videoQuality && a.minVideoBitrate == this.minVideoBitrate && a.maxVideoBitrate == this.maxVideoBitrate && a.audioBitrate == this.audioBitrate
  }, this);
  return a ? a.id : "custom"
};
d.Kv = function(a) {
  if(a = Id(a)) {
    this.Tq(a.videoResolution), this.videoQuality = a.videoQuality, this.minVideoBitrate = a.minVideoBitrate, this.maxVideoBitrate = a.maxVideoBitrate, this.audioBitrate = a.audioBitrate
  }
};
var Ld = function() {
};
v(Ld, Error);
var K = function() {
  this.k = "pending";
  this.qc = [];
  this.Ta = this.uh = void 0
}, Md = function() {
  Oa.call(this, "Multiple attempts to set the state of this Result")
};
v(Md, Oa);
d = K.prototype;
d.T = function() {
  return this.k
};
d.Ea = function() {
  return this.uh
};
d.getError = function() {
  return this.Ta
};
d.Db = function(a, b) {
  this.vj() ? this.qc.push({Wa:a, scope:b || null}) : a.call(b, this)
};
d.la = function(a) {
  if(this.vj()) {
    this.uh = a, this.k = "success", this.Is()
  }else {
    if(!this.Ks()) {
      throw new Md;
    }
  }
};
d.cb = function(a) {
  if(this.vj()) {
    this.Ta = a, this.k = "error", this.Is()
  }else {
    if(!this.Ks()) {
      throw new Md;
    }
  }
};
d.Is = function() {
  var a = this.qc;
  this.qc = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b];
    c.Wa.call(c.scope, this)
  }
};
d.vj = function() {
  return"pending" == this.k
};
d.cancel = function() {
  return this.vj() ? (this.cb(new Ld), !0) : !1
};
d.Ks = function() {
  return"error" == this.k && this.Ta instanceof Ld
};
var Nd = function() {
  this.hasNetworkSoftware = this.networkDescription = this.gpu = this.cpu = this.googleUsername = null
};
var Od = function() {
  this.dismissClicks = this.earliestTimeToShowWarning = this.sessionsBeforeWarning = 0;
  this.castAppNotificationDismissed = !1
};
var M = function() {
  this.a = H("cv.Settings");
  this.R = {};
  this.Hy();
  this.ml = this.nl = this.il = !1
};
da(M);
d = M.prototype;
d.Hy = function() {
  this.R.tabCaptureSettings = new Jd;
  this.R.feedback = new Nd;
  this.R.userNotification = new Od;
  this.R.siteTokens = {};
  this.R.customDomains = [];
  this.R.fixedIps = [];
  this.R.receiverUrl = "";
  this.R.flingEnabled = !1;
  this.R.customReceiverVersion = "";
  this.R.enableCustomReceiverVersion = !1;
  this.R.appEngineReceiverIds = [];
  this.R.enableCloud = !1;
  this.R.cloudDevice = {}
};
d.EC = function() {
  this.nl = !0
};
d.qe = function() {
  this.il ? (this.a.info("Saving settings to storage."), this.nl ? (localStorage.settings = JSON.stringify(this.R), this.ml && (chrome.storage.local.clear(), this.ml = !1)) : chrome.storage.local.set(this.R, t(function() {
    chrome.runtime.lastError ? this.a.e("Failed to save settings to chrome.storage.") : this.a.info("Successfully saved settings to storage.")
  }, this))) : this.a.e("Aborting saving settings before initialization.")
};
d.My = function(a, b) {
  return p(this.R[a]) ? n(this.R[a]) != n(b) ? (this.a.e("Failed to load setting due to incompatible type: " + a), !1) : ha(b) && 0 == Bb(b).length ? !1 : !0 : (this.a.e("Not loading setting with key: " + a), !1)
};
d.Vl = function(a, b) {
  for(var c in b) {
    c in this.R && ("tabCaptureSettings" == c ? this.R.tabCaptureSettings.update(b[c]) : this.My(c, b[c]) && (this.R[c] = b[c]))
  }
  this.a.info("Storage initialized.");
  this.il = !0;
  a()
};
d.DC = function(a) {
  if(this.il) {
    a()
  }else {
    if(this.a.info("Loading settings from storage."), this.nl) {
      var b = localStorage.settings;
      b ? this.Vl(a, JSON.parse(b)) : chrome.storage.local.get(t(function(b) {
        var e = null;
        !chrome.runtime.lastError && 0 < Object.keys(b).length && (e = b, this.ml = !0);
        this.Vl(a, e)
      }, this))
    }else {
      chrome.storage.local.get(t(this.Vl, this, a))
    }
  }
};
d.ka = function() {
  return this.R.tabCaptureSettings
};
d.Ao = function() {
  return""
};
d.yC = function() {
  return!1
};
d.Fv = function() {
  return JSON.stringify({mirrorTabSettings:this.ka()})
};
d.sE = function() {
  return this.R.fixedIps
};
d.qz = function() {
  return this.R.enableCloud
};
d.gA = function(a) {
  this.R.feedback = a;
  this.qe()
};
d.ui = function() {
  return this.R.userNotification
};
d.ot = function(a) {
  this.R.userNotification = a;
  this.qe()
};
d.rD = function() {
  return this.R.siteTokens
};
d.wD = function(a) {
  this.R.siteTokens = a;
  this.qe()
};
d.Uq = function() {
  return this.R.customDomains
};
d.Tz = function(a) {
  this.R.customDomains = a;
  this.qe()
};
var N = function() {
};
d = N.prototype;
d.kn = !1;
d.uf = function() {
  return this.kn
};
d.V = function() {
  this.kn || (this.kn = !0, this.j())
};
d.Em = function(a) {
  this.Ej(ma(Pd, a))
};
d.Ej = function(a, b) {
  this.Eh || (this.Eh = []);
  this.Eh.push(t(a, b))
};
d.j = function() {
  if(this.Eh) {
    for(;this.Eh.length;) {
      this.Eh.shift()()
    }
  }
};
var Pd = function(a) {
  a && "function" == typeof a.V && a.V()
};
var O = function(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
};
d = O.prototype;
d.j = function() {
};
d.V = function() {
};
d.Pd = !1;
d.defaultPrevented = !1;
d.Ft = !0;
d.stopPropagation = function() {
  this.Pd = !0
};
d.preventDefault = function() {
  this.defaultPrevented = !0;
  this.Ft = !1
};
var Qd = function(a) {
  Qd[" "](a);
  return a
};
Qd[" "] = m;
var Rd = function(a, b) {
  try {
    return Qd(a[b]), !0
  }catch(c) {
  }
  return!1
};
var Sd = !F || F && 9 <= uc, Td = F && !sc("9");
!G || sc("528");
ec && sc("1.9b") || F && sc("8") || dc && sc("9.5") || G && sc("528");
ec && !sc("8") || F && sc("9");
var Ud = function(a, b) {
  a && this.D(a, b)
};
v(Ud, O);
Ud.prototype.target = null;
d = Ud.prototype;
d.relatedTarget = null;
d.offsetX = 0;
d.offsetY = 0;
d.clientX = 0;
d.clientY = 0;
d.screenX = 0;
d.screenY = 0;
d.button = 0;
d.keyCode = 0;
d.charCode = 0;
d.ctrlKey = !1;
d.altKey = !1;
d.shiftKey = !1;
d.metaKey = !1;
d.Mf = null;
d.D = function(a, b) {
  var c = this.type = a.type;
  O.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var e = a.relatedTarget;
  e ? ec && (Rd(e, "nodeName") || (e = null)) : "mouseover" == c ? e = a.fromElement : "mouseout" == c && (e = a.toElement);
  this.relatedTarget = e;
  this.offsetX = G || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = G || void 0 !== a.offsetY ? a.offsetY : a.layerY;
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
  this.Mf = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Pd
};
d.stopPropagation = function() {
  Ud.q.stopPropagation.call(this);
  this.Mf.stopPropagation ? this.Mf.stopPropagation() : this.Mf.cancelBubble = !0
};
d.preventDefault = function() {
  Ud.q.preventDefault.call(this);
  var a = this.Mf;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, Td) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
d.bt = function() {
  return this.Mf
};
d.j = function() {
};
var Vd = "closure_listenable_" + (1E6 * Math.random() | 0), Wd = function(a) {
  try {
    return!(!a || !a[Vd])
  }catch(b) {
    return!1
  }
}, Xd = 0;
var Yd = function(a, b, c, e, f, g) {
  this.Ce = a;
  this.proxy = b;
  this.src = c;
  this.type = e;
  this.capture = !!f;
  this.Rj = g;
  this.key = ++Xd;
  this.removed = this.Pj = !1
};
Yd.prototype.Xj = function() {
  this.removed = !0;
  this.Rj = this.src = this.proxy = this.Ce = null
};
var Zd = function(a) {
  this.src = a;
  this.Ma = {};
  this.zh = 0
};
d = Zd.prototype;
d.qF = function() {
  return this.zh
};
d.add = function(a, b, c, e, f) {
  var g = this.Ma[a];
  g || (g = this.Ma[a] = [], this.zh++);
  var k = $d(g, b, e, f);
  -1 < k ? (a = g[k], c || (a.Pj = !1)) : (a = new Yd(b, null, this.src, a, !!e, f), a.Pj = c, g.push(a));
  return a
};
d.remove = function(a, b, c, e) {
  if(!(a in this.Ma)) {
    return!1
  }
  var f = this.Ma[a];
  b = $d(f, b, c, e);
  return-1 < b ? (f[b].Xj(), mb(f, b), 0 == f.length && (delete this.Ma[a], this.zh--), !0) : !1
};
d.ru = function(a) {
  var b = a.type;
  if(!(b in this.Ma)) {
    return!1
  }
  var c = nb(this.Ma[b], a);
  c && (a.Xj(), 0 == this.Ma[b].length && (delete this.Ma[b], this.zh--));
  return c
};
d.removeAll = function(a) {
  var b = 0, c;
  for(c in this.Ma) {
    if(!a || c == a) {
      for(var e = this.Ma[c], f = 0;f < e.length;f++) {
        ++b, e[f].Xj()
      }
      delete this.Ma[c];
      this.zh--
    }
  }
  return b
};
d.Ch = function(a, b, c, e) {
  a = this.Ma[a];
  var f = -1;
  a && (f = $d(a, b, c, e));
  return-1 < f ? a[f] : null
};
var $d = function(a, b, c, e) {
  for(var f = 0;f < a.length;++f) {
    var g = a[f];
    if(!g.removed && g.Ce == b && g.capture == !!c && g.Rj == e) {
      return f
    }
  }
  return-1
};
var ae = "closure_lm_" + (1E6 * Math.random() | 0), be = {}, ce = 0, P = function(a, b, c, e, f) {
  if(q(b)) {
    for(var g = 0;g < b.length;g++) {
      P(a, b[g], c, e, f)
    }
    return null
  }
  c = de(c);
  return Wd(a) ? a.listen(b, c, e, f) : ee(a, b, c, !1, e, f)
}, ee = function(a, b, c, e, f, g) {
  if(!b) {
    throw Error("Invalid event type");
  }
  var k = !!f, l = fe(a);
  l || (a[ae] = l = new Zd(a));
  c = l.add(b, c, e, f, g);
  if(c.proxy) {
    return c
  }
  e = ge();
  c.proxy = e;
  e.src = a;
  e.Ce = c;
  a.addEventListener ? a.addEventListener(b, e, k) : a.attachEvent(b in be ? be[b] : be[b] = "on" + b, e);
  ce++;
  return c
}, ge = function() {
  var a = he, b = Sd ? function(c) {
    return a.call(b.src, b.Ce, c)
  } : function(c) {
    c = a.call(b.src, b.Ce, c);
    if(!c) {
      return c
    }
  };
  return b
}, ie = function(a, b, c, e, f) {
  if(q(b)) {
    for(var g = 0;g < b.length;g++) {
      ie(a, b[g], c, e, f)
    }
    return null
  }
  c = de(c);
  return Wd(a) ? a.Wd(b, c, e, f) : ee(a, b, c, !0, e, f)
}, je = function(a, b, c, e, f) {
  if(q(b)) {
    for(var g = 0;g < b.length;g++) {
      je(a, b[g], c, e, f)
    }
    return null
  }
  c = de(c);
  if(Wd(a)) {
    return a.cd(b, c, e, f)
  }
  if(!a) {
    return!1
  }
  if(a = fe(a)) {
    if(b = a.Ch(b, c, !!e, f)) {
      return ke(b)
    }
  }
  return!1
}, ke = function(a) {
  if(fa(a) || !a || a.removed) {
    return!1
  }
  var b = a.src;
  if(Wd(b)) {
    return b.oh(a)
  }
  var c = a.type, e = a.proxy;
  b.removeEventListener ? b.removeEventListener(c, e, a.capture) : b.detachEvent && b.detachEvent(c in be ? be[c] : be[c] = "on" + c, e);
  ce--;
  (c = fe(b)) ? (c.ru(a), 0 == c.qF() && (c.src = null, b[ae] = null)) : a.Xj();
  return!0
}, le = function(a, b) {
  if(!a) {
    return 0
  }
  if(Wd(a)) {
    return a.is(b)
  }
  var c = fe(a);
  if(!c) {
    return 0
  }
  var e = 0, f;
  for(f in c.Ma) {
    if(!b || f == b) {
      for(var g = qb(c.Ma[f]), k = 0;k < g.length;++k) {
        ke(g[k]) && ++e
      }
    }
  }
  return e
}, me = function(a, b, c, e, f) {
  c = de(c);
  e = !!e;
  return Wd(a) ? a.Ch(b, c, e, f) : a ? (a = fe(a)) ? a.Ch(b, c, e, f) : null : null
}, oe = function(a, b, c, e) {
  var f = 1;
  if(a = fe(a)) {
    if(b = a.Ma[b]) {
      for(b = qb(b), a = 0;a < b.length;a++) {
        var g = b[a];
        g && g.capture == c && !g.removed && (f &= !1 !== ne(g, e))
      }
    }
  }
  return Boolean(f)
}, ne = function(a, b) {
  var c = a.Ce, e = a.Rj || a.src;
  a.Pj && ke(a);
  return c.call(e, b)
}, pe = function(a, b) {
  w(Wd(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return a.dispatchEvent(b)
}, he = function(a, b) {
  if(a.removed) {
    return!0
  }
  if(!Sd) {
    var c = b || ca("window.event"), e = new Ud(c, this), f = !0;
    if(!(0 > c.keyCode || void 0 != c.returnValue)) {
      t: {
        var g = !1;
        if(0 == c.keyCode) {
          try {
            c.keyCode = -1;
            break t
          }catch(k) {
            g = !0
          }
        }
        if(g || void 0 == c.returnValue) {
          c.returnValue = !0
        }
      }
      c = [];
      for(g = e.currentTarget;g;g = g.parentNode) {
        c.push(g)
      }
      for(var g = a.type, l = c.length - 1;!e.Pd && 0 <= l;l--) {
        e.currentTarget = c[l], f &= oe(c[l], g, !0, e)
      }
      for(l = 0;!e.Pd && l < c.length;l++) {
        e.currentTarget = c[l], f &= oe(c[l], g, !1, e)
      }
    }
    return f
  }
  return ne(a, new Ud(b, this))
}, fe = function(a) {
  a = a[ae];
  return a instanceof Zd ? a : null
}, qe = "__closure_events_fn_" + (1E9 * Math.random() >>> 0), de = function(a) {
  w(a, "Listener can not be null.");
  if(ga(a)) {
    return a
  }
  w(a.handleEvent, "An object listener must have handleEvent method.");
  return a[qe] || (a[qe] = function(b) {
    return a.handleEvent(b)
  })
};
var Q = function() {
  this.Wc = new Zd(this);
  this.HE = this
};
v(Q, N);
Q.prototype[Vd] = !0;
d = Q.prototype;
d.ss = null;
d.xu = function() {
  return this.ss
};
d.addEventListener = function(a, b, c, e) {
  P(this, a, b, c, e)
};
d.removeEventListener = function(a, b, c, e) {
  je(this, a, b, c, e)
};
d.dispatchEvent = function(a) {
  this.lu();
  var b, c = this.xu();
  if(c) {
    b = [];
    for(var e = 1;c;c = c.xu()) {
      b.push(c), w(1E3 > ++e, "infinite loop")
    }
  }
  c = this.HE;
  e = a.type || a;
  if(s(a)) {
    a = new O(a, c)
  }else {
    if(a instanceof O) {
      a.target = a.target || c
    }else {
      var f = a;
      a = new O(e, c);
      Ib(a, f)
    }
  }
  var f = !0, g;
  if(b) {
    for(var k = b.length - 1;!a.Pd && 0 <= k;k--) {
      g = a.currentTarget = b[k], f = g.ak(e, !0, a) && f
    }
  }
  a.Pd || (g = a.currentTarget = c, f = g.ak(e, !0, a) && f, a.Pd || (f = g.ak(e, !1, a) && f));
  if(b) {
    for(k = 0;!a.Pd && k < b.length;k++) {
      g = a.currentTarget = b[k], f = g.ak(e, !1, a) && f
    }
  }
  return f
};
d.j = function() {
  Q.q.j.call(this);
  this.is();
  this.ss = null
};
d.listen = function(a, b, c, e) {
  this.lu();
  return this.Wc.add(String(a), b, !1, c, e)
};
d.Wd = function(a, b, c, e) {
  return this.Wc.add(String(a), b, !0, c, e)
};
d.cd = function(a, b, c, e) {
  return this.Wc.remove(String(a), b, c, e)
};
d.oh = function(a) {
  return this.Wc.ru(a)
};
d.is = function(a) {
  return this.Wc ? this.Wc.removeAll(a) : 0
};
d.ak = function(a, b, c) {
  a = this.Wc.Ma[String(a)];
  if(!a) {
    return!0
  }
  a = qb(a);
  for(var e = !0, f = 0;f < a.length;++f) {
    var g = a[f];
    if(g && !g.removed && g.capture == b) {
      var k = g.Ce, l = g.Rj || g.src;
      g.Pj && this.oh(g);
      e = !1 !== k.call(l, c) && e
    }
  }
  return e && !1 != c.Ft
};
d.Ch = function(a, b, c, e) {
  return this.Wc.Ch(String(a), b, c, e)
};
d.lu = function() {
  w(this.Wc, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
};
var re = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"), te = function(a) {
  if(se) {
    se = !1;
    var b = h.location;
    if(b) {
      var c = b.href;
      if(c && (c = (c = te(c)[3] || null) && decodeURIComponent(c)) && c != b.hostname) {
        throw se = !0, Error();
      }
    }
  }
  return a.match(re)
}, se = G, ue = function(a) {
  var b = te(a);
  a = b[1];
  var c = b[2], e = b[3], b = b[4], f = "";
  a && (f += a + ":");
  e && (f += "//", c && (f += c + "@"), f += e, b && (f += ":" + b));
  return f
};
var ve = ["video_playback", "audio_playback", "image_display", "slideshow", "mirror_tab"];
var we = function(a, b) {
  O.call(this, a);
  this.activityId = b
};
v(we, O);
var xe = function(a, b) {
  we.call(this, "activity_error", a);
  this.errorMessage = b
};
v(xe, we);
var ye = function(a, b, c) {
  we.call(this, "update_description", a);
  this.description = b;
  this.iconUrl = c
};
v(ye, we);
var ze = function() {
  this.source = this.text = this.iconUrl = null
}, Ae = function(a, b) {
  Q.call(this);
  this.Cr = "ChromeCast";
  this.jh = "unknown";
  this.Gr = null;
  this.La = a || Ga();
  this.se = null;
  this.re = [];
  this.k = "new";
  this.nj = null;
  this.Dd = -1;
  this.Er = !1;
  this.vd = new ze;
  this.mediaPlayerStatus = new ad(this.La, 2);
  this.mediaPlayerStatus.timeProgress = !0;
  this.Fr = u();
  this.Dr = b || "stop";
  this.zA = !1;
  this.J = this.Br()
};
v(Ae, Q);
d = Ae.prototype;
d.kp = function() {
  return this.Dr
};
d.OA = function() {
  return"continue" == this.Dr
};
d.pv = function(a) {
  return this.zA ? (this.La = a, !0) : !1
};
d.Eb = function() {
  return this.Cr
};
d.Fo = function(a) {
  this.Cr = a;
  return this
};
d.ds = function() {
  var a;
  a = this.nj ? (a = te(this.nj)[3] || null) && decodeURIComponent(a) : null;
  return a
};
d.cv = function() {
  return this.nj
};
d.Ir = function(a) {
  this.nj = a;
  return this
};
d.rb = function() {
  return 0 <= ve.indexOf(this.jh)
};
d.to = function(a) {
  this.se = a;
  return this
};
d.c = function() {
  return this.La
};
d.za = function() {
  return this.jh
};
d.Ud = function(a) {
  this.jh = a;
  this.J = this.Br();
  return this
};
d.WA = function() {
  return this.Er
};
d.KB = function(a) {
  this.Er = a;
  return this
};
d.T = function() {
  return this.k
};
d.Br = function() {
  return H("cv.Activity." + this.za() + "." + this.c())
};
d.We = function() {
  return this.Gr
};
d.LB = function(a) {
  this.Gr = a;
  return this
};
d.Bj = function(a, b) {
  var c = q(b) ? 0 <= b.indexOf(this.k) : this.k == b;
  c || this.J.info("Invalid state encountered in " + JSON.stringify(a) + ", was " + JSON.stringify(this.k) + "; expecting " + JSON.stringify(b));
  return c
};
d.yo = function(a) {
  if(this.Bj("initialize", "new")) {
    var b = t(function(b, e) {
      b ? (this.k = "initialized", a(!0)) : a(!1, e)
    }, this);
    this.pj(b)
  }else {
    a(!0)
  }
};
d.pj = function(a) {
  a(!0)
};
d.start = function() {
  this.Bj("start", "initialized") && (this.hn(), this.k = "playing")
};
d.hn = m;
d.pause = function() {
  this.Bj("pause", "playing") && (this.fn(), this.k = "paused")
};
d.fn = m;
d.stop = function() {
  this.Bj("stop", ["initialized", "playing", "paused"]) && (this.Xg(), this.k = "stopped", this.V())
};
d.Xg = m;
d.bg = function() {
  return this.vd
};
d.$f = function(a, b, c) {
  if(!this.vd.source || c >= this.vd.source) {
    this.vd.text = a ? Ba(a, 500) : null, this.vd.iconUrl = b, this.vd.source = c
  }
  return this
};
d.Q = function() {
  return this.Dd
};
d.tk = function(a) {
  this.Dd = a;
  return this
};
d.Ja = function() {
  return this.re
};
d.xo = function(a) {
  var b = kb(this.re, function(b) {
    return b.c() == a.c()
  });
  0 <= b ? this.re[b] = a : this.re.push(a);
  return this
};
d.wo = function() {
  if(!this.WA()) {
    var a = this.vd.text;
    "mirror_tab" == this.za() && this.ds() && (a = this.ds() + " (Tab)");
    this.Fb(new ye(this.c(), a, this.vd.iconUrl))
  }
};
d.ke = function(a) {
  if("update_description" == a.type) {
    window.document.title = a.description;
    var b = document.querySelector("link[rel=icon]");
    b && (b.href = a.iconUrl || "")
  }
};
d.Fb = function(a, b) {
  this.se ? this.se.Fb("activity", a, b || this.re) : Rc(this.J, "Trying to post message without activity messenger.", a, Fc)
};
d.Ke = function(a, b) {
  this.se ? this.se.Ke(a, b || this.re) : this.J.e("Trying to post message without activity messenger")
};
d.mm = function(a, b, c, e, f) {
  this.se ? this.se.mm(a, b, f || this.re, c, e) : (this.J.e("Trying to post message without activity messenger"), e && e("Trying to post message without activity messenger"))
};
d.cp = function(a) {
  this.Fr = a || u();
  return this
};
d.qw = function() {
  return this.Fr
};
d.Sv = function(a) {
  this.mediaPlayerStatus = a;
  return this
};
d.Go = function() {
  return"dial_non_ramp_activity" == this.jh || "unknown" == this.jh ? null : this.mediaPlayerStatus
};
Ae.prototype.isLocal = function() {
  return 0 <= this.Dd || -2 == this.Dd || -4 == this.Dd
};
var Be = function() {
  this.Fd = new E;
  this.Ef = new E
};
Be.prototype.Ba = function(a) {
  return this.Fd.get(a) || null
};
Be.prototype.getAllActivities = function() {
  return this.Fd.U()
};
d = Be.prototype;
d.Qb = function(a) {
  return this.Ef.get(a) || []
};
d.Tr = function(a) {
  if(this.Fd.get(a.c())) {
    throw"Activity already exists";
  }
  var b = a.Ja();
  this.Fd.set(a.c(), a);
  b.forEach(function(b) {
    var e = this.Qb(b.c());
    0 < e.length ? e.push(a) : this.Ef.set(b.c(), [a])
  }, this)
};
d.zl = function() {
  this.Fd.clear();
  this.Ef.clear()
};
d.he = function(a) {
  if(this.Fd.get(a.c())) {
    var b = a.Ja();
    this.Fd.remove(a.c());
    b.forEach(function(b) {
      var e = this.Qb(b.c());
      ob(e, function(b) {
        return b.c() == a.c()
      });
      0 == e.length && this.Ef.remove(b.c())
    }, this)
  }
};
d.nf = function(a) {
  (a = this.Ba(a)) && this.he(a)
};
d.hj = function(a, b) {
  var c = this.Qb(a);
  this.Ef.remove(a);
  c.forEach(function(a) {
    z(a.Ja(), function(a) {
      return this.Ef.Aa(a.c())
    }, this) || b && a.OA() || this.Fd.remove(a.c())
  }, this)
};
var R = function(a) {
  this.C = a;
  this.W = {}
};
v(R, N);
var Ce = [];
d = R.prototype;
d.listen = function(a, b, c, e, f) {
  q(b) || (Ce[0] = b, b = Ce);
  for(var g = 0;g < b.length;g++) {
    var k = P(a, b[g], c || this.handleEvent, e || !1, f || this.C || this);
    if(!k) {
      break
    }
    this.W[k.key] = k
  }
  return this
};
d.Wd = function(a, b, c, e, f) {
  if(q(b)) {
    for(var g = 0;g < b.length;g++) {
      this.Wd(a, b[g], c, e, f)
    }
  }else {
    a = ie(a, b, c || this.handleEvent, e, f || this.C || this);
    if(!a) {
      return this
    }
    this.W[a.key] = a
  }
  return this
};
d.cd = function(a, b, c, e, f) {
  if(q(b)) {
    for(var g = 0;g < b.length;g++) {
      this.cd(a, b[g], c, e, f)
    }
  }else {
    if(a = me(a, b, c || this.handleEvent, e, f || this.C || this)) {
      ke(a), delete this.W[a.key]
    }
  }
  return this
};
d.removeAll = function() {
  zb(this.W, ke);
  this.W = {}
};
d.j = function() {
  R.q.j.call(this);
  this.removeAll()
};
d.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
var De = function(a) {
  var b = new K;
  b.la(a);
  return b
}, Ee = function(a) {
  var b = new K;
  b.cb(a);
  return b
}, Fe = function(a, b, c) {
  a.Db(b, c)
}, Ge = function(a, b, c) {
  Fe(a, function(a) {
    "success" == a.T() && b.call(this, a.Ea(), a)
  }, c)
}, He = function(a, b, c) {
  Fe(a, function(a) {
    "error" == a.T() && b.call(this, a.getError(), a)
  }, c)
}, Je = function(a, b, c) {
  var e = new Ie([a]);
  Fe(a, function(a) {
    "success" == a.T() ? (a = b.call(c, a), e.AC(a), Fe(a, function(a) {
      "success" == a.T() ? e.la(a.Ea()) : e.cb(a.getError())
    })) : e.cb(a.getError())
  });
  return e
}, Ke = function(a) {
  var b = qb(arguments), c = new Ie(b), e = function(a) {
    return"pending" != a.T()
  }, f = function() {
    "pending" == c.T() && ib(b, e) && c.la(b)
  };
  y(b, function(a) {
    a.Db(f, void 0)
  });
  return c
}, Le = function(a) {
  var b = qb(arguments), c = new Ie(b), e = function(a) {
    return"success" == a.T()
  };
  Fe(Ke.apply(Ke, b), function(a) {
    a = a.Ea();
    ib(a, e) ? c.la(a) : c.cb(a)
  });
  return c
}, Ie = function(a) {
  K.call(this);
  this.hH = a
};
v(Ie, K);
Ie.prototype.AC = function(a) {
  this.hH.push(a)
};
var Me = function(a, b) {
  Q.call(this);
  this.oc = a || 1;
  this.Df = b || h;
  this.mn = t(this.SE, this);
  this.on = u()
};
v(Me, Q);
d = Me.prototype;
d.enabled = !1;
d.ea = null;
d.ry = function() {
  return this.oc
};
d.setInterval = function(a) {
  this.oc = a;
  this.ea && this.enabled ? (this.stop(), this.start()) : this.ea && this.stop()
};
d.SE = function() {
  if(this.enabled) {
    var a = u() - this.on;
    0 < a && a < 0.8 * this.oc ? this.ea = this.Df.setTimeout(this.mn, this.oc - a) : (this.ea && (this.Df.clearTimeout(this.ea), this.ea = null), this.iq(), this.enabled && (this.ea = this.Df.setTimeout(this.mn, this.oc), this.on = u()))
  }
};
d.iq = function() {
  this.dispatchEvent("tick")
};
d.start = function() {
  this.enabled = !0;
  this.ea || (this.ea = this.Df.setTimeout(this.mn, this.oc), this.on = u())
};
d.stop = function() {
  this.enabled = !1;
  this.ea && (this.Df.clearTimeout(this.ea), this.ea = null)
};
d.j = function() {
  Me.q.j.call(this);
  this.stop();
  delete this.Df
};
var S = function(a, b, c) {
  if(ga(a)) {
    c && (a = t(a, c))
  }else {
    if(a && "function" == typeof a.handleEvent) {
      a = t(a.handleEvent, a)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  return 2147483647 < b ? -1 : h.setTimeout(a, b || 0)
};
var Ne = function(a) {
  Q.call(this);
  this.S = this.hl = this.gl = null;
  this.k = a || "connecting";
  this.Ta = null;
  this.a = H("cv.Channel")
};
v(Ne, Q);
d = Ne.prototype;
d.j = function() {
  Ne.q.j.call(this);
  this.disconnect()
};
d.disconnect = function(a) {
  "disconnected" != this.k ? (a ? this.a.e("Disconnect channel to " + this.S + " due to error: " + a) : this.a.info("Disconnect channel to " + this.S), this.Ta && this.a.e("Channel already has error when disconnecting: " + JSON.stringify(this.Ta)), this.Ta = a || null, this.pi(), this.bb("disconnected")) : a && this.a.e("Reporting error on disconnected channel: " + JSON.stringify(a))
};
d.qa = function() {
  return"connected" == this.k
};
d.xB = function() {
  return"connecting" == this.k
};
d.yB = function() {
  return"disconnected" == this.k
};
d.T = function() {
  return this.k
};
d.bb = function(a) {
  var b = this.k;
  b != a && (this.k = a, this.dispatchEvent(new Oe("a", b, a)), this.gl && this.gl(b, a))
};
d.getError = function() {
  return"disconnected" == this.k ? this.Ta : null
};
d.onMessage = function(a) {
  this.dispatchEvent(new Pe("b", a));
  this.hl && this.hl(a)
};
d.Ko = function(a, b) {
  function c() {
    "connected" == e.T() ? a() : "disconnected" == e.T() && b("Channel failed to connect.")
  }
  var e = this;
  "connecting" == this.T() ? ie(this, "a", c) : c()
};
var Oe = function(a, b, c) {
  O.call(this, a);
  this.hg = c
};
v(Oe, O);
var Pe = function(a, b) {
  O.call(this, a);
  this.message = b
};
v(Pe, O);
var Qe = function(a, b, c) {
  O.call(this, a);
  this.message = b;
  this.S = c || null
};
v(Qe, O);
var Re = function() {
  Q.call(this);
  this.a = H("cv.ChannelService");
  this.dd = new E;
  this.Zh = new E;
  this.ji = new Me(18E5);
  this.l = null;
  this.Va = new R(this)
};
v(Re, Q);
d = Re.prototype;
d.IA = function(a) {
  this.l = a
};
d.D = function() {
  w(this.l, "Sets activityService first");
  this.ji.start();
  this.Va.listen(this.ji, "tick", this.zC)
};
d.j = function() {
  Re.q.j.call(this);
  this.ji.stop();
  this.ji.V();
  this.Va.V()
};
d.zC = function() {
  if(!this.dd.nb()) {
    var a = [];
    yb(this.dd.OB(), function(b) {
      0 < this.l.Qb(b).length || a.push(b)
    }, this);
    a.forEach(this.Vd, this)
  }
};
d.sk = function(a) {
  return this.dd.Aa(a)
};
d.Vd = function(a) {
  this.a.info("Remove channel to " + a);
  var b = this.dd.get(a);
  b && (this.dd.remove(a), b.disconnect());
  if(a = this.Zh.get(a)) {
    this.a.info("existing channel removed."), a.cancel()
  }
};
d.Zv = function(a) {
  w(a.S, "New channel has no peer ID");
  w(a.qa(), "New channel is not disconnected.");
  this.a.info("Created a channel to " + a.S);
  a.hl = t(this.$x, this, a.S);
  a.gl = t(this.ay, this, a.S);
  this.dd.set(a.S, a)
};
d.ay = function(a, b, c) {
  "disconnected" == c && (this.a.info("Removing a disconnected channel to " + a), (b = this.dd.get(a)) && this.Vd(a), this.dispatchEvent(new Qe("channel_disconnect", a)), b && b.getError() && this.dispatchEvent(new Qe("channel_error", b.getError(), a)))
};
d.Ke = function(a, b, c) {
  this.Cl(["ramp", a], b, null, c || null)
};
d.mm = function(a, b, c, e, f) {
  -1 != Tc.indexOf(a) ? (this.a.e("Attempting to post message to reserved namespace: " + a), f && f("Reserved namespace: " + a)) : this.Cl([a, b], c, e, f)
};
d.Fb = function(a, b, c, e) {
  this.Cl(["cv", new Vc(a, b)], c, null, e || null)
};
d.Cl = function(a, b, c, e) {
  0 != b.length && (this.XB(a, b), b.forEach(function(b) {
    var g = this.UB(b);
    Ge(g, function(b) {
      b.send(a);
      c && c()
    }, this);
    He(g, function(a) {
      e ? e(String(a)) : this.dispatchEvent(new Qe("channel_error", String(a), b.c()))
    }, this)
  }, this))
};
d.XB = function(a, b) {
  if(this.a.mf(Kc)) {
    var c = "";
    b.forEach(function(a) {
      c += " " + a.c()
    });
    this.a.ig("Posting message to" + c + ": " + JSON.stringify(a))
  }
};
d.UB = function(a) {
  var b = a.c(), c = this.dd.get(b);
  if(c) {
    return w(c.qa(), "Channel to " + c.S + " is not connected."), De(c)
  }
  if((c = this.Zh.get(b)) && "pending" == c.T()) {
    return this.a.info("Channel to " + b + " in creation..."), c
  }
  this.a.info("Creating channel to " + b);
  c = this.Ze(a);
  a = Je(c, function(a) {
    a = a.Ea();
    this.Zv(a);
    return De(a)
  }, this);
  this.Zh.set(b, a);
  a.Db(function() {
    this.Zh.remove(b)
  }, this);
  return a
};
d.$x = function(a, b) {
  if(b) {
    if(this.a.ig("Received message from " + a + ": " + JSON.stringify(b)), q(b) && "ramp" == b[0] && ha(b[1]) && p(b[1].cmd_id) && p(b[1].type)) {
      this.dispatchEvent(new Qe("ramp", b[1], a))
    }else {
      if(q(b) && "cv" == b[0] && ha(b[1]) && p(b[1].type) && 0 <= Uc.indexOf(b[1].type)) {
        var c = b[1], e = this.sz(c.type);
        e && this.dispatchEvent(new Qe(e, c.message, a))
      }else {
        q(b) && 2 == b.length && s(b[0]) && -1 == Tc.indexOf(b[0]) && (ha(b[1]) || s(b[1]) || null === b[1]) ? this.dispatchEvent(new Qe("custom_message", b, a)) : Wc(b) || Rc(this.a, "Unrecognized channel message", b, Fc)
      }
    }
  }
};
d.sz = function(a) {
  switch(a) {
    case "launch_service":
      return"launch_service";
    case "activity_service":
      return"activity_service";
    case "activity":
      return"activity";
    default:
      return null
  }
};
var Se = function(a, b) {
  Q.call(this);
  this.a = H("cv.ActivityService");
  this.ec = a;
  this.M = b;
  this.Va = new R(this)
};
v(Se, Q);
var Te = function(a, b) {
  O.call(this, a);
  this.activityId = b
};
v(Te, O);
d = Se.prototype;
d.D = function() {
  this.Va.listen(this.ec, "activity", this.CE);
  this.Va.listen(this.ec, "activity_service", this.DE);
  this.Va.listen(this.ec, "channel_disconnect", this.BE);
  this.Va.listen(this.ec, "custom_message", this.gu)
};
d.gu = m;
d.Xe = function() {
  return this.Va
};
d.j = function() {
  Se.q.j.call(this);
  this.Va.V()
};
d.Ie = function() {
  return z(this.getAllActivities(), function(a) {
    return"mirror_tab" == a.za()
  })
};
d.Ba = function(a) {
  return this.M.Ba(a)
};
d.Qb = function(a) {
  return this.M.Qb(a)
};
Se.prototype.getAllActivities = function() {
  return this.M.getAllActivities()
};
d = Se.prototype;
d.CE = function(a) {
  w("activity" == a.type, "Got event type " + a.type + "; expect activity");
  var b = a.message, c = this.M.Ba(b.activityId);
  c ? c.ke(b) : Rc(this.a, "Received a remote message for unknown activity: " + b.activityId, a)
};
d.DE = function(a) {
  w("activity_service" == a.type, "Got event type " + a.type + "; expect activity_service");
  var b = a.message;
  "remove_activity" == b.type ? this.Uy(b.activityId) : "leave_activity" == b.type ? this.Vy(b.activityId, a.S) : Rc(this.a, "Received unknown activity service message.", b)
};
d.Uy = function(a) {
  this.M.Ba(a) ? (this.a.info("Peer informs activity removal: " + a), this.Zk(a), this.M.Ba(a).stop(), this.M.nf(a), this.dispatchEvent(new Te("remove_activity", a))) : this.a.info("Activity does not exist: " + a)
};
d.Vy = m;
d.BE = function(a) {
  w("channel_disconnect" == a.type);
  a = a.message;
  this.a.info("Handle peer " + a + " disconnection.");
  this.Gq(a)
};
d.Gq = m;
d.Zk = m;
d.So = function(a) {
  this.a.info("Inform peer to remove activity " + a.c() + " " + a.Eb() + " " + a.za());
  this.ec.Fb("activity_service", new Te("remove_activity", a.c()), a.Ja())
};
d.kw = function(a) {
  this.a.info("Inform peer to leave activity " + a.c() + " " + a.Eb() + " " + a.za());
  this.ec.Fb("activity_service", new Te("leave_activity", a.c()), a.Ja())
};
var Ue = function(a, b, c) {
  this.ed = a;
  this.oc = b;
  this.C = c;
  this.gh = t(this.UC, this)
};
v(Ue, N);
d = Ue.prototype;
d.Yj = !1;
d.zn = 0;
d.ea = null;
d.Ms = function() {
  this.ea || this.zn ? this.Yj = !0 : this.vh()
};
d.stop = function() {
  this.ea && (h.clearTimeout(this.ea), this.ea = null, this.Yj = !1)
};
d.pause = function() {
  this.zn++
};
d.j = function() {
  Ue.q.j.call(this);
  this.stop()
};
d.UC = function() {
  this.ea = null;
  this.Yj && !this.zn && (this.Yj = !1, this.vh())
};
d.vh = function() {
  this.ea = S(this.gh, this.oc);
  this.ed.call(this.C)
};
var Ve = function(a, b, c) {
  we.call(this, a, b);
  this.state = c || null
};
v(Ve, we);
var We = function(a, b, c, e) {
  Ae.call(this, c, e);
  this.Ud(a);
  this.wh = b;
  new Ue(function() {
    this.Fb(new Ve("timeupdate", this.La, this.wh))
  }, 1E3, this)
};
v(We, Ae);
var Xe = function() {
  this.mediaUrl = "";
  this.currentTime = null;
  this.duration = 0;
  this.paused = !0;
  this.muted = !1;
  this.volume = 1
};
d = We.prototype;
d.We = function() {
  return this.wh
};
d.hn = function() {
  this.play()
};
d.fn = function() {
  this.wh.paused = !0;
  this.Fb(new Ve("pause", this.La))
};
d.Xg = function() {
  this.pause()
};
d.play = function() {
  this.wh.paused = !1;
  this.Fb(new Ve("play", this.La))
};
d.ke = function(a) {
  We.q.ke.call(this, a);
  a.state && (this.wh = a.state);
  this.dispatchEvent(a)
};
var Ye = function(a, b, c) {
  R.call(this, this);
  this.a = H("cv.PcStatsCollector");
  this.Wy = a;
  this.Yy = b;
  this.Xy = c;
  this.Mi = new Me(2E3);
  this.Tl = [];
  this.Oi = 0;
  this.listen(this.Mi, "tick", this.$y)
};
v(Ye, R);
d = Ye.prototype;
d.start = function() {
  this.Mi.start()
};
d.stop = function() {
  this.Mi.stop()
};
d.j = function() {
  this.Mi.V()
};
d.ck = function() {
  0 != this.Oi && (this.Yy(this.Tl), this.Oi = 0, this.Tl = [])
};
d.wF = function(a) {
  if(!a) {
    return{}
  }
  !a.names && p(a.local) && (a = a.local);
  if(!a.names) {
    return{}
  }
  var b = {};
  b.timestamp = a.timestamp;
  a.names().forEach(function(c) {
    b[c] = a.stat(c)
  });
  return b
};
d.lG = function(a) {
  var b = [];
  a.result().forEach(function(a) {
    b.push(this.wF(a))
  }, this);
  this.Tl.push(b);
  this.Oi++;
  10 == this.Oi && this.ck()
};
d.$y = function() {
  var a = this.Wy();
  if(a && p(a.getStats)) {
    if(this.Xy) {
      if(!a.getLocalStreams() || 0 == a.getLocalStreams().length) {
        return
      }
    }else {
      if(p(a.getRemoteStreams)) {
        if(!a.getRemoteStreams() || 0 == a.getRemoteStreams().length) {
          return
        }
      }else {
        if(!a.kG || 0 == a.kG.length) {
          return
        }
      }
    }
    a.getStats(t(this.lG, this))
  }
};
var Ze = function(a) {
  this.Qf = 0;
  this.Kn = a || 100;
  this.Xc = []
};
d = Ze.prototype;
d.add = function(a) {
  var b = this.Xc[this.Qf];
  this.Xc[this.Qf] = a;
  this.Qf = (this.Qf + 1) % this.Kn;
  return b
};
d.get = function(a) {
  a = this.Nu(a);
  return this.Xc[a]
};
d.set = function(a, b) {
  a = this.Nu(a);
  this.Xc[a] = b
};
d.K = function() {
  return this.Xc.length
};
d.nb = function() {
  return 0 == this.Xc.length
};
d.clear = function() {
  this.Qf = this.Xc.length = 0
};
d.U = function() {
  return this.un(this.K())
};
d.un = function(a) {
  var b = this.K(), c = [];
  for(a = this.K() - a;a < b;a++) {
    c.push(this.get(a))
  }
  return c
};
d.Ua = function() {
  for(var a = [], b = this.K(), c = 0;c < b;c++) {
    a[c] = c
  }
  return a
};
d.Aa = function(a) {
  return a < this.K()
};
d.Of = function(a) {
  for(var b = this.K(), c = 0;c < b;c++) {
    if(this.get(c) == a) {
      return!0
    }
  }
  return!1
};
d.Nu = function(a) {
  if(a >= this.Xc.length) {
    throw Error("Out of bounds exception");
  }
  return this.Xc.length < this.Kn ? a : (this.Qf + Number(a)) % this.Kn
};
var $e = function() {
  this.a = H("cv.PcStatsStore");
  this.Mg = new Ze(900);
  this.Lg = new Ze(900);
  this.Vg = null
};
da($e);
$e.prototype.MC = function(a) {
  a.forEach(function(a) {
    this.Mg.add(a)
  }, this);
  this.Vg && this.Vg()
};
$e.prototype.tw = function(a) {
  a.forEach(function(a) {
    this.Lg.add(a)
  }, this);
  this.Vg && this.Vg()
};
$e.prototype.reset = function() {
  this.Mg.clear();
  this.Lg.clear()
};
var af = function(a, b) {
  this.senderStats = a;
  this.receiverStats = b
};
$e.prototype.getStats = function() {
  return new af(this.Mg.U(), this.Lg.U())
};
$e.prototype.xE = function(a) {
  return this.Mg.K() < a || this.Lg.K() < a ? null : new af(this.Mg.un(a), this.Lg.un(a))
};
$e.prototype.tt = function(a) {
  this.Vg = a
};
var bf = ["VP8", "CAST1"];
var cf = function(a) {
  this.ab = a
};
d = cf.prototype;
d.WB = function() {
  return this.ab
};
d.$l = function(a) {
  this.ab = this.ab.replace(/(m=audio.*\r\n)/g, "$1b=AS:" + a + "\r\n")
};
d.RB = function() {
  this.ab = this.ab.replace(/a=group:BUNDLE\saudio\svideo.*\r\n/, "")
};
d.Bs = function(a, b, c) {
  for(var e = this.ab, f = e.replace(/[\s\S]*m=audio\s\d+\sRTP\/SAVPF((\s\d+)+)[\s\S]*/, "$1").replace(/(^\s+)|(\s+$)/g, "").split(" "), g = [], k = 0, l = f.length;k < l;++k) {
    -1 != e.search(RegExp("a=rtpmap:" + f[k] + "\\s+opus", "i")) ? g.push(f[k]) : e = e.replace(RegExp("a=rtpmap:" + f[k] + ".*\\r\\n"), "")
  }
  e = e.replace(/(m=audio\s\d+\sRTP\/SAVPF\s).*/, "$1" + g.join(" "));
  g.length && (a && (e = e.replace(RegExp("(a=fmtp:" + g[0] + ".*)\\r\\n", "i"), "$1; " + (c ? "sprop-stereo" : "stereo") + "=1\r\n")), b && (e = e.replace(RegExp("(a=fmtp:" + g[0] + ".*)\\r\\n", "i"), "$1\r\na=rtcp-fb:" + g[0] + " nack\r\n")));
  this.ab = e
};
d.TB = function() {
  var a = this.ab;
  bf.forEach(function(b) {
    var c = a, e = df(c, b);
    if(e) {
      b = "a=rtcp-fb:" + e + " ccm fir";
      var f = "a=rtcp-fb:" + e + " nack", g = "a=rtcp-fb:" + e + " goog-remb", e = RegExp("(a=rtpmap:" + e + ".*)\\r\\n", "i");
      -1 == c.search(b) && (c = c.replace(e, "$1\r\n" + b + "\r\n"));
      -1 == c.search(f) && (c = c.replace(e, "$1\r\n" + f + "\r\n"));
      -1 == c.search(g) && (c = c.replace(e, "$1\r\n" + g + "\r\n"))
    }
    a = c
  });
  this.ab = a
};
d.SB = function() {
  for(var a = this.ab, b = ef(a), c = [], e = 0, f = b.length;e < f;++e) {
    var g = !1;
    bf.forEach(function(f) {
      -1 != a.search(RegExp("a=rtpmap:" + b[e] + "\\s+" + f, "i")) && (c.push(b[e]), g = !0)
    });
    g || (a = a.replace(RegExp("a=rtpmap:" + b[e] + ".*\\r\\n"), ""))
  }
  this.ab = a = a.replace(/(m=video\s\d+\sRTP\/SAVPF\s).*/, "$1" + c.join(" "))
};
d.YB = function(a) {
  var b = this.ab;
  if((a = b.match(RegExp("a=rtpmap:(\\d+)\\s" + a, "i"))) && 2 == a.length) {
    a = a[1];
    var c = ef(b), e = c.indexOf(a);
    -1 != e && (c.splice(e, 1), c.unshift(a), this.ab = b = b.replace(/(m=video\s\d+\sRTP\/SAVPF\s).*/, "$1" + c.join(" ")))
  }
};
d.Cs = function(a, b, c, e) {
  var f = this.ab, g = null;
  bf.forEach(function(e) {
    e = df(f, e);
    g || (g = e);
    var l = f;
    e && (l = l.replace(RegExp("(a=rtpmap:" + e + ".*)\\r\\n", "i"), "$1\r\na=fmtp:" + e + " x-google-min-bitrate=" + a + "; x-google-max-bitrate=" + b + "; x-google-max-quantization=" + c + "\r\n"));
    f = l
  });
  e && g && (f = f.replace(RegExp("(a=rtpmap:" + g + ".*)\\r\\n", "i"), "$1\r\na=x-google-buffer-latency:" + e + "\r\n"));
  this.ab = f
};
var ef = function(a) {
  return a.replace(/[\s\S]*m=video\s\d+\sRTP\/SAVPF((\s\d+)+)[\s\S]*/, "$1").replace(/(^\s+)|(\s+$)/g, "").split(" ")
}, df = function(a, b) {
  for(var c = ef(a), e = 0, f = c.length;e < f;++e) {
    if(-1 != a.search(RegExp("a=rtpmap:" + c[e] + "\\s+" + b, "i"))) {
      return c[e]
    }
  }
  return""
};
var ff = {mandatory:{OfferToReceiveAudio:!0, OfferToReceiveVideo:!0}}, gf = {mandatory:{IceRestart:!0, OfferToReceiveAudio:!0, OfferToReceiveVideo:!0}}, hf = function(a, b, c) {
  Q.call(this);
  w(p(webkitRTCPeerConnection), "webkitRTCPeerConnection is not available.  Do you need to set flags?");
  this.a = H("cv.PeerConnection");
  this.vc = a;
  this.Op = b;
  this.Zp = ff;
  this.A = c || new Jd;
  this.ub = this.Lx();
  this.jw = !1;
  this.de = null;
  this.Mx()
};
v(hf, Q);
d = hf.prototype;
d.Mx = function() {
  var a = t(function(a) {
    this.vc ? $e.I().MC(a) : this.Op(JSON.stringify({type:"stats", stats:a}))
  }, this);
  this.de = new Ye(t(function() {
    return this.ub
  }, this), a, this.vc)
};
d.gc = !1;
d.$d = m;
d.Np = m;
d.GF = function(a) {
  this.$d = a
};
d.JB = function(a) {
  this.Np = a
};
d.cD = function() {
  return this.gc
};
d.fz = function() {
  return{iceServers:[{url:"stun:stun.l.google.com:19302"}]}
};
d.Lx = function() {
  var a = this.fz(), b = new webkitRTCPeerConnection(a);
  b.onicecandidate = t(this.gz, this);
  b.oniceconnectionstatechange = t(this.hz, this);
  b.oH = t(this.iz, this);
  b.onopen = t(this.jz, this);
  b.onaddstream = t(this.kz, this);
  b.onremovestream = t(this.lz, this);
  this.a.info("Created webkitRTCPeerConnnection with config: " + JSON.stringify(a));
  return b
};
d.start = function(a) {
  this.gc || (this.gc = !0, this.vc && this.PE(), a && this.de && this.de.start())
};
d.stop = function() {
  this.gc = !1;
  this.ub.close();
  this.de && this.de.stop()
};
d.addStream = function(a) {
  this.ub.addStream(a)
};
d.j = function() {
  this.stop();
  this.ub = null;
  this.de && this.de.V();
  hf.q.j.call(this)
};
d.PE = function() {
  w(this.vc, "Must be initiator to create an offer!");
  this.a.info("Sending offer to peer.");
  this.ub.createOffer(t(this.pl, this), this.$d, this.Zp)
};
d.uw = function() {
  this.ub.createAnswer(t(this.pl, this), this.$d, this.Zp)
};
d.pl = function(a) {
  var b = new cf(a.sdp);
  this.vc ? (b.RB(), "off" != this.A.bufferedMode && b.SB(), this.A.useOpus && b.Bs(!0, this.A.enableAudioNack, !0)) : (this.A.useOpus && (this.A.audioBitrate && b.$l(this.A.audioBitrate), b.Bs(!0, this.A.enableAudioNack, !1)), this.A.pH && b.YB(this.A.preferredVideoCodec), "off" != this.A.bufferedMode ? b.Cs(this.A.minVideoBitrate, this.A.maxVideoBitrate, this.A.videoQuality, this.A.VB()) : b.Cs(this.A.minVideoBitrate, this.A.maxVideoBitrate, this.A.videoQuality), b.TB());
  a.sdp = b.WB();
  this.ub.setLocalDescription(a, m, this.$d);
  this.$p(a)
};
d.$p = function(a) {
  a = JSON.stringify(a);
  this.a.info("===>: " + a);
  this.Op(a)
};
d.QC = function(a) {
  var b = JSON.parse(a);
  "stats" != b.type && this.a.w("<===: " + a);
  if("offer" === b.type) {
    w(!this.vc, "Must not be initiator to answer an offer!"), this.gc || this.start(), this.ub.setRemoteDescription(new RTCSessionDescription(b), m, this.$d), this.uw()
  }else {
    if("answer" === b.type && this.gc) {
      w(this.vc, "Must be initiator to receive an answer!"), this.ub.setRemoteDescription(new RTCSessionDescription(b), m, this.$d)
    }else {
      if("candidate" === b.type && this.gc) {
        a = new RTCIceCandidate({sdpMLineIndex:b.label, sdpMid:b.id, candidate:b.candidate});
        try {
          this.vw(a, this.vc) && (this.a.info("Adding candidate " + JSON.stringify(a)), this.ub.addIceCandidate(a))
        }catch(c) {
          this.a.t("Error calling addIceCandidate; messages out of order?", c)
        }
      }else {
        "stats" === b.type && $e.I().tw(b.stats)
      }
    }
  }
};
d.vw = function(a, b) {
  if(b) {
    if(this.A.enableAudioTcp && -1 != a.sdpMid.indexOf("audio") && -1 != a.candidate.indexOf("udp") || this.A.enableVideoTcp && -1 != a.sdpMid.indexOf("video") && -1 != a.candidate.indexOf("udp")) {
      return!1
    }
  }else {
    if(this.A.enableAudioTcp && -1 != a.sdpMid.indexOf("audio") && -1 != a.candidate.indexOf("tcp") && -1 != a.candidate.indexOf("0 typ host") || this.A.enableVideoTcp && -1 != a.sdpMid.indexOf("video") && -1 != a.candidate.indexOf("tcp") && -1 != a.candidate.indexOf("0 typ host")) {
      return!1
    }
  }
  return!0
};
d.gz = function(a) {
  a.candidate ? this.$p({type:"candidate", label:a.candidate.sdpMLineIndex, id:a.candidate.sdpMid, candidate:a.candidate.candidate}) : this.a.info("End of candidates.")
};
d.hz = function() {
  if(this.ub) {
    var a = this.ub.iceConnectionState;
    this.a.info("New ICE connection state: " + a + ".");
    this.vc && "disconnected" == a && (this.a.e("Ice connection state is bad."), this.jw ? (this.a.info("Restarting ICE."), this.ub.createOffer(t(this.pl, this), this.$d, gf)) : this.Np())
  }
};
d.iz = function(a) {
  this.a.info("Session connecting.");
  this.dispatchEvent(a)
};
d.jz = function(a) {
  this.a.info("Session opened.");
  this.dispatchEvent(a)
};
d.kz = function(a) {
  this.a.info("Stream added.");
  this.dispatchEvent(a)
};
d.lz = function(a) {
  this.a.info("Stream removed.");
  this.dispatchEvent(a)
};
var jf = function(a, b, c) {
  Ae.call(this, c);
  this.Ud("mirror_tab");
  this.pc = b;
  this.zoomFactor = 1;
  this.kc = new hf(a, t(this.OE, this), this.pc);
  this.mediaPlayerStatus.hasPause = !1
};
v(jf, Ae);
jf.prototype.nr = function() {
  return-2 == this.Q()
};
jf.prototype.kj = function() {
  return 0 <= this.Q()
};
jf.prototype.stream = null;
jf.prototype.url = null;
var kf = function(a, b, c) {
  we.call(this, a, b);
  this.zoomFactor = c
};
v(kf, we);
var lf = function(a, b) {
  we.call(this, "webrtc", b);
  this.message = a
};
v(lf, we);
d = jf.prototype;
d.Ht = function() {
  return this.url
};
d.pj = function(a) {
  this.kc.GF(t(this.FF, this));
  a(!0)
};
d.fn = function() {
  this.J.info("Pausing tab mirroring...");
  this.km("pause")
};
d.Xg = function() {
  this.J.info("Stopping tab mirroring...");
  this.kc && (this.kc.stop(), this.kc = null)
};
d.km = function(a, b) {
  this.dispatchEvent(this.Ju(a, b))
};
d.KC = function(a) {
  this.Fb(this.Ju(a))
};
d.Ju = function(a, b) {
  return new kf(a, this.La, this.zoomFactor, b)
};
d.OE = function(a) {
  this.Fb(new lf(a, this.La))
};
d.FF = function(a) {
  this.J.e("PeerConnection error: " + a);
  this.dispatchEvent(new xe(this.La, a));
  this.stop()
};
d.ke = function(a) {
  jf.q.ke.call(this, a);
  "webrtc" == a.type && this.kc && this.kc.QC(a.message)
};
var mf = function(a) {
  return gb(a, function(a) {
    a = a.toString(16);
    return 1 < a.length ? a : "0" + a
  }).join("")
};
var nf = null, of = null, pf = null, qf = function() {
  if(!nf) {
    nf = {};
    of = {};
    pf = {};
    for(var a = 0;65 > a;a++) {
      nf[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a), of[nf[a]] = a, pf[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)
    }
  }
};
var rf = function() {
};
var sf = function() {
  this.ta = [];
  this.tn = [];
  this.GE = [];
  this.Tj = [];
  this.Tj[0] = 128;
  for(var a = 1;64 > a;++a) {
    this.Tj[a] = 0
  }
  this.reset()
};
v(sf, rf);
sf.prototype.reset = function() {
  this.ta[0] = 1732584193;
  this.ta[1] = 4023233417;
  this.ta[2] = 2562383102;
  this.ta[3] = 271733878;
  this.ta[4] = 3285377520;
  this.wn = this.yh = 0
};
sf.prototype.Vj = function(a, b) {
  b || (b = 0);
  var c = this.GE;
  if(s(a)) {
    for(var e = 0;16 > e;e++) {
      c[e] = a.charCodeAt(b) << 24 | a.charCodeAt(b + 1) << 16 | a.charCodeAt(b + 2) << 8 | a.charCodeAt(b + 3), b += 4
    }
  }else {
    for(e = 0;16 > e;e++) {
      c[e] = a[b] << 24 | a[b + 1] << 16 | a[b + 2] << 8 | a[b + 3], b += 4
    }
  }
  for(e = 16;80 > e;e++) {
    var f = c[e - 3] ^ c[e - 8] ^ c[e - 14] ^ c[e - 16];
    c[e] = (f << 1 | f >>> 31) & 4294967295
  }
  for(var g = this.ta[0], k = this.ta[1], l = this.ta[2], r = this.ta[3], A = this.ta[4], C, e = 0;80 > e;e++) {
    40 > e ? 20 > e ? (f = r ^ k & (l ^ r), C = 1518500249) : (f = k ^ l ^ r, C = 1859775393) : 60 > e ? (f = k & l | r & (k | l), C = 2400959708) : (f = k ^ l ^ r, C = 3395469782), f = (g << 5 | g >>> 27) + f + A + C + c[e] & 4294967295, A = r, r = l, l = (k << 30 | k >>> 2) & 4294967295, k = g, g = f
  }
  this.ta[0] = this.ta[0] + g & 4294967295;
  this.ta[1] = this.ta[1] + k & 4294967295;
  this.ta[2] = this.ta[2] + l & 4294967295;
  this.ta[3] = this.ta[3] + r & 4294967295;
  this.ta[4] = this.ta[4] + A & 4294967295
};
sf.prototype.update = function(a, b) {
  p(b) || (b = a.length);
  for(var c = b - 64, e = 0, f = this.tn, g = this.yh;e < b;) {
    if(0 == g) {
      for(;e <= c;) {
        this.Vj(a, e), e += 64
      }
    }
    if(s(a)) {
      for(;e < b;) {
        if(f[g] = a.charCodeAt(e), ++g, ++e, 64 == g) {
          this.Vj(f);
          g = 0;
          break
        }
      }
    }else {
      for(;e < b;) {
        if(f[g] = a[e], ++g, ++e, 64 == g) {
          this.Vj(f);
          g = 0;
          break
        }
      }
    }
  }
  this.yh = g;
  this.wn += b
};
sf.prototype.Hm = function() {
  var a = [], b = 8 * this.wn;
  56 > this.yh ? this.update(this.Tj, 56 - this.yh) : this.update(this.Tj, 64 - (this.yh - 56));
  for(var c = 63;56 <= c;c--) {
    this.tn[c] = b & 255, b /= 256
  }
  this.Vj(this.tn);
  for(c = b = 0;5 > c;c++) {
    for(var e = 24;0 <= e;e -= 8) {
      a[b] = this.ta[c] >> e & 255, ++b
    }
  }
  return a
};
var tf = !ec && !F || F && F && 9 <= uc || ec && sc("1.9.1"), uf = F && !sc("9");
var wf = function(a) {
  return a ? new vf(9 == a.nodeType ? a : a.ownerDocument || a.document) : Pa || (Pa = new vf)
}, yf = function(a, b, c, e) {
  function f(c) {
    c && b.appendChild(s(c) ? a.createTextNode(c) : c)
  }
  for(;e < c.length;e++) {
    var g = c[e];
    !ea(g) || ha(g) && 0 < g.nodeType ? f(g) : y(xf(g) ? qb(g) : g, f)
  }
}, zf = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
}, Af = function(a) {
  return tf && void 0 != a.children ? a.children : fb(a.childNodes, function(a) {
    return 1 == a.nodeType
  })
}, Bf = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1}, Cf = {IMG:" ", BR:"\n"}, Ef = function(a) {
  if(uf && "innerText" in a) {
    a = a.innerText.replace(/(\r\n|\r|\n)/g, "\n")
  }else {
    var b = [];
    Df(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  uf || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
}, Df = function(a, b, c) {
  if(!(a.nodeName in Bf)) {
    if(3 == a.nodeType) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in Cf) {
        b.push(Cf[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          Df(a, b, c), a = a.nextSibling
        }
      }
    }
  }
}, xf = function(a) {
  if(a && "number" == typeof a.length) {
    if(ha(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(ga(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
}, vf = function(a) {
  this.Qd = a || h.document || document
};
d = vf.prototype;
d.mC = function(a) {
  return s(a) ? this.Qd.getElementById(a) : a
};
d.createElement = function(a) {
  return this.Qd.createElement(a)
};
d.createTextNode = function(a) {
  return this.Qd.createTextNode(String(a))
};
d.Z = function() {
  return this.Qd.parentWindow || this.Qd.defaultView
};
d.appendChild = function(a, b) {
  a.appendChild(b)
};
d.append = function(a, b) {
  yf(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
};
d.removeNode = zf;
d.getChildren = Af;
d.contains = function(a, b) {
  if(a.contains && 1 == b.nodeType) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
var Ff = function(a, b, c) {
  this.ed = a;
  this.oc = b || 0;
  this.C = c;
  this.gh = t(this.vh, this)
};
v(Ff, N);
d = Ff.prototype;
d.La = 0;
d.j = function() {
  Ff.q.j.call(this);
  this.stop();
  delete this.ed;
  delete this.C
};
d.start = function(a) {
  this.stop();
  this.La = S(this.gh, p(a) ? a : this.oc)
};
d.stop = function() {
  this.lc() && h.clearTimeout(this.La);
  this.La = 0
};
d.Ms = function() {
  this.stop();
  this.vh()
};
d.lc = function() {
  return 0 != this.La
};
d.vh = function() {
  this.La = 0;
  this.ed && this.ed.call(this.C)
};
var Gf = function(a) {
  a = String(a);
  if(/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
}, Hf = function(a) {
  return eval("(" + a + ")")
}, Jf = function(a, b) {
  return(new If(b)).Nd(a)
}, If = function(a) {
  this.ek = a
};
If.prototype.Nd = function(a) {
  var b = [];
  this.Vn(a, b);
  return b.join("")
};
If.prototype.Vn = function(a, b) {
  switch(typeof a) {
    case "string":
      this.Bu(a, b);
      break;
    case "number":
      this.cG(a, b);
      break;
    case "boolean":
      b.push(a);
      break;
    case "undefined":
      b.push("null");
      break;
    case "object":
      if(null == a) {
        b.push("null");
        break
      }
      if(q(a)) {
        this.bG(a, b);
        break
      }
      this.dG(a, b);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof a);
  }
};
var Kf = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, Lf = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
If.prototype.Bu = function(a, b) {
  b.push('"', a.replace(Lf, function(a) {
    if(a in Kf) {
      return Kf[a]
    }
    var b = a.charCodeAt(0), f = "\\u";
    16 > b ? f += "000" : 256 > b ? f += "00" : 4096 > b && (f += "0");
    return Kf[a] = f + b.toString(16)
  }), '"')
};
If.prototype.cG = function(a, b) {
  b.push(isFinite(a) && !isNaN(a) ? a : "null")
};
If.prototype.bG = function(a, b) {
  var c = a.length;
  b.push("[");
  for(var e = "", f = 0;f < c;f++) {
    b.push(e), e = a[f], this.Vn(this.ek ? this.ek.call(a, String(f), e) : e, b), e = ","
  }
  b.push("]")
};
If.prototype.dG = function(a, b) {
  b.push("{");
  var c = "", e;
  for(e in a) {
    if(Object.prototype.hasOwnProperty.call(a, e)) {
      var f = a[e];
      "function" != typeof f && (b.push(c), this.Bu(e, b), b.push(":"), this.Vn(this.ek ? this.ek.call(a, e, f) : f, b), c = ",")
    }
  }
  b.push("}")
};
var T = {Ed:!0};
T.NH = Bc;
T.Qa = Cc;
T.MH = Za;
T.td = function(a, b) {
  if(T.Ed) {
    var c = H(a);
    b && c && c.tc(b);
    return c
  }
  return null
};
T.Jn = function(a, b) {
  T.Ed && a && a.Jn(b)
};
T.Ln = function(a, b) {
  return T.Ed && a ? a.Ln(b) : !1
};
T.log = function(a, b, c, e) {
  T.Ed && a && a.log(b, c, e)
};
T.error = function(a, b, c) {
  T.Ed && a && a.t(b, c)
};
T.e = function(a, b, c) {
  T.Ed && a && a.e(b, c)
};
T.info = function(a, b, c) {
  T.Ed && a && a.info(b, c)
};
T.w = function(a, b, c) {
  T.Ed && a && a.w(b, c)
};
var Mf = function() {
  this.Vi = {}
};
v(Mf, N);
d = Mf.prototype;
d.J = T.td("goog.messaging.AbstractChannel");
d.connect = function(a) {
  a && a()
};
d.qa = function() {
  return!0
};
d.Nf = function(a, b, c) {
  this.Vi[a] = {Wa:b, Yr:!!c}
};
d.KA = function(a, b) {
  var c = this.aF(a, b);
  if(c) {
    var e = this.$E(a, b, c.Yr);
    null != e && c.Wa(e)
  }
};
d.aF = function(a, b) {
  var c = this.Vi[a];
  if(c) {
    return c
  }
  if(this.gr) {
    return{Wa:ma(this.gr, a), Yr:ha(b)}
  }
  T.e(this.J, 'Unknown service name "' + a + '"');
  return null
};
d.$E = function(a, b, c) {
  if(c && s(b)) {
    try {
      return Gf(b)
    }catch(e) {
      return T.e(this.J, "Expected JSON payload for " + a + ', was "' + b + '"'), null
    }
  }else {
    if(!c && !s(b)) {
      return Jf(b)
    }
  }
  return b
};
d.j = function() {
  Mf.q.j.call(this);
  delete this.J;
  delete this.Vi;
  delete this.gr
};
var U = function(a, b) {
  var c;
  a instanceof U ? (this.Jb = p(b) ? b : a.NB(), this.ee(a.zd()), this.Um(a.vs()), this.Bf(a.zc()), this.rj(a.Fm()), this.Cf(a.Mm()), this.kh(a.uk().clone()), this.Tm(a.us())) : a && (c = te(String(a))) ? (this.Jb = !!b, this.ee(c[1] || "", !0), this.Um(c[2] || "", !0), this.Bf(c[3] || "", !0), this.rj(c[4]), this.Cf(c[5] || "", !0), this.kh(c[6] || "", !0), this.Tm(c[7] || "", !0)) : (this.Jb = !!b, this.Uc = new Nf(null, null, this.Jb))
};
d = U.prototype;
d.Dh = "";
d.Ou = "";
d.Tn = "";
d.Un = null;
d.jc = "";
d.Mu = "";
d.aH = !1;
d.Jb = !1;
d.toString = function() {
  var a = [], b = this.zd();
  b && a.push(Of(b, Pf), ":");
  if(b = this.zc()) {
    a.push("//");
    var c = this.vs();
    c && a.push(Of(c, Pf), "@");
    a.push(encodeURIComponent(String(b)));
    b = this.Fm();
    null != b && a.push(":", String(b))
  }
  if(b = this.Mm()) {
    this.tE() && "/" != b.charAt(0) && a.push("/"), a.push(Of(b, "/" == b.charAt(0) ? Qf : Rf))
  }
  (b = this.rE()) && a.push("?", b);
  (b = this.us()) && a.push("#", Of(b, Sf));
  return a.join("")
};
d.clone = function() {
  return new U(this)
};
d.zd = function() {
  return this.Dh
};
d.ee = function(a, b) {
  this.rc();
  if(this.Dh = b ? a ? decodeURIComponent(a) : "" : a) {
    this.Dh = this.Dh.replace(/:$/, "")
  }
  return this
};
d.vs = function() {
  return this.Ou
};
d.Um = function(a, b) {
  this.rc();
  this.Ou = b ? a ? decodeURIComponent(a) : "" : a;
  return this
};
d.zc = function() {
  return this.Tn
};
d.Bf = function(a, b) {
  this.rc();
  this.Tn = b ? a ? decodeURIComponent(a) : "" : a;
  return this
};
d.tE = function() {
  return!!this.Tn
};
d.Fm = function() {
  return this.Un
};
d.rj = function(a) {
  this.rc();
  if(a) {
    a = Number(a);
    if(isNaN(a) || 0 > a) {
      throw Error("Bad port number " + a);
    }
    this.Un = a
  }else {
    this.Un = null
  }
  return this
};
d.Mm = function() {
  return this.jc
};
d.Cf = function(a, b) {
  this.rc();
  this.jc = b ? a ? decodeURIComponent(a) : "" : a;
  return this
};
d.kh = function(a, b) {
  this.rc();
  a instanceof Nf ? (this.Uc = a, this.Uc.Bn(this.Jb)) : (b || (a = Of(a, Tf)), this.Uc = new Nf(a, null, this.Jb));
  return this
};
d.rE = function() {
  return this.Uc.toString()
};
d.uk = function() {
  return this.Uc
};
d.ba = function(a, b) {
  this.rc();
  this.Uc.set(a, b);
  return this
};
d.wi = function(a, b) {
  this.rc();
  q(b) || (b = [String(b)]);
  this.Uc.en(a, b);
  return this
};
d.us = function() {
  return this.Mu
};
d.Tm = function(a, b) {
  this.rc();
  this.Mu = b ? a ? decodeURIComponent(a) : "" : a;
  return this
};
d.tf = function() {
  this.rc();
  this.ba("zx", Ga());
  return this
};
d.rc = function() {
  if(this.aH) {
    throw Error("Tried to modify a read-only Uri");
  }
};
d.Bn = function(a) {
  this.Jb = a;
  this.Uc && this.Uc.Bn(a);
  return this
};
d.NB = function() {
  return this.Jb
};
var Uf = function(a, b) {
  return a instanceof U ? a.clone() : new U(a, b)
}, Vf = function(a, b, c, e, f, g, k, l) {
  l = new U(null, l);
  a && l.ee(a);
  b && l.Um(b);
  c && l.Bf(c);
  e && l.rj(e);
  f && l.Cf(f);
  g && l.kh(g);
  k && l.Tm(k);
  return l
}, Of = function(a, b) {
  return s(a) ? encodeURI(a).replace(b, Wf) : null
}, Wf = function(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}, Pf = /[#\/\?@]/g, Rf = /[\#\?:]/g, Qf = /[\#\?]/g, Tf = /[\#\?@]/g, Sf = /#/g, Nf = function(a, b, c) {
  this.Jd = a || null;
  this.Jb = !!c
};
Nf.prototype.Tc = function() {
  if(!this.pa && (this.pa = new E, this.ia = 0, this.Jd)) {
    for(var a = this.Jd.split("&"), b = 0;b < a.length;b++) {
      var c = a[b].indexOf("="), e = null, f = null;
      0 <= c ? (e = a[b].substring(0, c), f = a[b].substring(c + 1)) : e = a[b];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = this.ze(e);
      this.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
    }
  }
};
var Xf = function(a, b, c) {
  b = Nb(a);
  if("undefined" == typeof b) {
    throw Error("Keys are undefined");
  }
  c = new Nf(null, null, c);
  a = Mb(a);
  for(var e = 0;e < b.length;e++) {
    var f = b[e], g = a[e];
    q(g) ? c.en(f, g) : c.add(f, g)
  }
  return c
};
d = Nf.prototype;
d.pa = null;
d.ia = null;
d.K = function() {
  this.Tc();
  return this.ia
};
d.add = function(a, b) {
  this.Tc();
  this.Jf();
  a = this.ze(a);
  var c = this.pa.get(a);
  c || this.pa.set(a, c = []);
  c.push(b);
  this.ia++;
  return this
};
d.remove = function(a) {
  this.Tc();
  a = this.ze(a);
  return this.pa.Aa(a) ? (this.Jf(), this.ia -= this.pa.get(a).length, this.pa.remove(a)) : !1
};
d.clear = function() {
  this.Jf();
  this.pa = null;
  this.ia = 0
};
d.nb = function() {
  this.Tc();
  return 0 == this.ia
};
d.Aa = function(a) {
  this.Tc();
  a = this.ze(a);
  return this.pa.Aa(a)
};
d.Of = function(a) {
  var b = this.U();
  return B(b, a)
};
d.Ua = function() {
  this.Tc();
  for(var a = this.pa.U(), b = this.pa.Ua(), c = [], e = 0;e < b.length;e++) {
    for(var f = a[e], g = 0;g < f.length;g++) {
      c.push(b[e])
    }
  }
  return c
};
d.U = function(a) {
  this.Tc();
  var b = [];
  if(s(a)) {
    this.Aa(a) && (b = pb(b, this.pa.get(this.ze(a))))
  }else {
    a = this.pa.U();
    for(var c = 0;c < a.length;c++) {
      b = pb(b, a[c])
    }
  }
  return b
};
d.set = function(a, b) {
  this.Tc();
  this.Jf();
  a = this.ze(a);
  this.Aa(a) && (this.ia -= this.pa.get(a).length);
  this.pa.set(a, [b]);
  this.ia++;
  return this
};
d.get = function(a, b) {
  var c = a ? this.U(a) : [];
  return 0 < c.length ? String(c[0]) : b
};
d.en = function(a, b) {
  this.remove(a);
  0 < b.length && (this.Jf(), this.pa.set(this.ze(a), qb(b)), this.ia += b.length)
};
d.toString = function() {
  if(this.Jd) {
    return this.Jd
  }
  if(!this.pa) {
    return""
  }
  for(var a = [], b = this.pa.Ua(), c = 0;c < b.length;c++) {
    for(var e = b[c], f = encodeURIComponent(String(e)), e = this.U(e), g = 0;g < e.length;g++) {
      var k = f;
      "" !== e[g] && (k += "=" + encodeURIComponent(String(e[g])));
      a.push(k)
    }
  }
  return this.Jd = a.join("&")
};
d.hE = function() {
  return this.toString() ? decodeURIComponent(this.toString()) : ""
};
d.Jf = function() {
  this.Jd = null
};
d.clone = function() {
  var a = new Nf;
  a.Jd = this.Jd;
  this.pa && (a.pa = this.pa.clone(), a.ia = this.ia);
  return a
};
d.ze = function(a) {
  a = String(a);
  this.Jb && (a = a.toLowerCase());
  return a
};
d.Bn = function(a) {
  a && !this.Jb && (this.Tc(), this.Jf(), Ob(this.pa, function(a, c) {
    var e = c.toLowerCase();
    c != e && (this.remove(c), this.en(e, a))
  }, this));
  this.Jb = a
};
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
var Yf = function(a, b) {
  this.Kc = [];
  this.Rs = a;
  this.ls = b || null;
  this.sh = this.et = !1;
  this.If = void 0;
  this.Zm = this.ps = this.Qm = !1;
  this.Cj = 0;
  this.ob = null;
  this.zj = 0;
  this.dn = null;
  if(Error.captureStackTrace) {
    var c = {stack:""};
    Error.captureStackTrace(c, Yf);
    "string" == typeof c.stack && (this.dn = c.stack.replace(/^[^\n]*\n/, ""))
  }
};
d = Yf.prototype;
d.cancel = function(a) {
  if(this.Sc()) {
    this.If instanceof Yf && this.If.cancel()
  }else {
    if(this.ob) {
      var b = this.ob;
      delete this.ob;
      a ? b.cancel(a) : b.JD()
    }
    this.Rs ? this.Rs.call(this.ls, this) : this.Zm = !0;
    this.Sc() || this.pt(new Zf(this))
  }
};
d.JD = function() {
  this.zj--;
  0 >= this.zj && this.cancel()
};
d.Os = function(a, b) {
  this.Qm = !1;
  this.Rn(a, b)
};
d.Rn = function(a, b) {
  this.et = !0;
  this.If = b;
  this.sh = !a;
  this.Vt()
};
d.Iu = function() {
  if(this.Sc()) {
    if(!this.Zm) {
      throw new $f(this);
    }
    this.Zm = !1
  }
};
d.Wa = function(a) {
  this.Iu();
  this.Hu(a);
  this.Rn(!0, a)
};
d.pt = function(a) {
  this.Iu();
  this.Hu(a);
  this.zs(a);
  this.Rn(!1, a)
};
d.zs = function(a) {
  this.dn && ha(a) && a.stack && /^[^\n]+(\n   [^\n]+)+/.test(a.stack) && (a.stack = a.stack + "\nDEFERRED OPERATION:\n" + this.dn)
};
d.Hu = function(a) {
  w(!(a instanceof Yf), "An execution sequence may not be initiated with a blocking Deferred.")
};
d.lm = function(a, b) {
  return this.Sm(a, null, b)
};
d.Sm = function(a, b, c) {
  w(!this.ps, "Blocking Deferreds can not be re-used");
  this.Kc.push([a, b, c]);
  this.Sc() && this.Vt();
  return this
};
d.fF = function(a) {
  this.Sm(a.Wa, a.pt, a);
  return this
};
d.fj = function(a) {
  return this.lm(t(a.CG, a))
};
d.CG = function(a) {
  var b = new Yf;
  this.fF(b);
  a && (b.ob = this, this.zj++);
  return b
};
d.Sc = function() {
  return this.et
};
d.oC = function(a) {
  return a instanceof Error
};
d.Qs = function() {
  return hb(this.Kc, function(a) {
    return ga(a[1])
  })
};
d.Vt = function() {
  this.Cj && this.Sc() && this.Qs() && (h.clearTimeout(this.Cj), delete this.Cj);
  this.ob && (this.ob.zj--, delete this.ob);
  for(var a = this.If, b = !1, c = !1;this.Kc.length && !this.Qm;) {
    var e = this.Kc.shift(), f = e[0], g = e[1], e = e[2];
    if(f = this.sh ? g : f) {
      try {
        var k = f.call(e || this.ls, a);
        p(k) && (this.sh = this.sh && (k == a || this.oC(k)), this.If = a = k);
        a instanceof Yf && (this.Qm = c = !0)
      }catch(l) {
        a = l, this.sh = !0, this.zs(a), this.Qs() || (b = !0)
      }
    }
  }
  this.If = a;
  c && (a.Sm(t(this.Os, this, !0), t(this.Os, this, !1)), a.ps = !0);
  b && (this.Cj = h.setTimeout(D.Rd(a), 0))
};
var $f = function() {
  Oa.call(this)
};
v($f, Oa);
$f.prototype.message = "Deferred has already fired";
$f.prototype.name = "AlreadyCalledError";
var Zf = function() {
  Oa.call(this)
};
v(Zf, Oa);
Zf.prototype.message = "Deferred was canceled";
Zf.prototype.name = "CanceledError";
var ag = {1:"NativeMessagingTransport", 2:"FrameElementMethodTransport", 3:"IframeRelayTransport", 4:"IframePollingTransport", 5:"FlashTransport", 6:"NixTransport"}, bg = ["pu", "lru", "pru", "lpu", "ppu"], cg = {}, eg = function(a, b) {
  for(var c = b || dg, e = c.length, f = "";0 < a--;) {
    f += c.charAt(Math.floor(Math.random() * e))
  }
  return f
}, dg = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", V = T.td("goog.net.xpc");
var fg = function(a) {
  this.lb = a || wf()
};
v(fg, N);
fg.prototype.Tf = 0;
fg.prototype.Z = function() {
  return this.lb.Z()
};
fg.prototype.getName = function() {
  return ag[this.Tf] || ""
};
var hg = function(a, b) {
  this.lb = b || wf();
  this.g = a;
  this.lh = [];
  this.EA = t(this.FB, this)
};
v(hg, fg);
d = hg.prototype;
d.Tf = 2;
d.Gm = !1;
d.ea = 0;
d.connect = function() {
  0 == this.g.Hc() ? (this.Nc = this.g.Zr(), this.Nc.XPC_toOuter = t(this.Xr, this)) : this.Wr()
};
d.Wr = function() {
  var a = !0;
  try {
    this.Nc || (this.Nc = this.Z().frameElement), this.Nc && this.Nc.XPC_toOuter && (this.jm = this.Nc.XPC_toOuter, this.Nc.XPC_toOuter.XPC_toInner = t(this.Xr, this), a = !1, this.send("tp", "SETUP_ACK"), this.g.Lc())
  }catch(b) {
    T.error(V, "exception caught while attempting setup: " + b)
  }
  a && (this.fs || (this.fs = t(this.Wr, this)), this.Z().setTimeout(this.fs, 100))
};
d.Dm = function(a) {
  if(0 != this.g.Hc() || this.g.qa() || "SETUP_ACK" != a) {
    throw Error("Got unexpected transport message.");
  }
  this.jm = this.Nc.XPC_toOuter.XPC_toInner;
  this.g.Lc()
};
d.Xr = function(a, b) {
  this.Gm || 0 != this.lh.length ? (this.lh.push({serviceName:a, payload:b}), 1 == this.lh.length && (this.ea = this.Z().setTimeout(this.EA, 1))) : this.g.Ic(a, b)
};
d.FB = function() {
  for(;this.lh.length;) {
    var a = this.lh.shift();
    this.g.Ic(a.serviceName, a.payload)
  }
};
d.send = function(a, b) {
  this.Gm = !0;
  this.jm(a, b);
  this.Gm = !1
};
d.j = function() {
  hg.q.j.call(this);
  this.Nc = this.jm = null
};
var ig = function(a, b) {
  this.lb = b || wf();
  this.g = a;
  this.ah = this.g.xj().ppu;
  this.SA = this.g.xj().lpu;
  this.oj = []
}, jg, kg;
v(ig, fg);
d = ig.prototype;
d.XA = 5;
d.Tf = 4;
d.Kc = 0;
d.rf = !1;
d.Sa = !1;
d.gs = null;
d.cj = function() {
  return"googlexpc_" + this.g.name + "_msg"
};
d.bj = function() {
  return"googlexpc_" + this.g.name + "_ack"
};
d.$r = function() {
  return!this.uf() && this.g.js()
};
d.nm = function() {
  try {
    if(this.$r()) {
      return this.g.pr().frames || {}
    }
  }catch(a) {
    T.w(V, "error retrieving peer frames")
  }
  return{}
};
d.qm = function(a) {
  return this.nm()[a]
};
d.connect = function() {
  this.$r() && (T.w(V, "transport connect called"), this.Sa || (T.w(V, "initializing..."), this.bD(), this.Sa = !0), this.aD())
};
d.bD = function() {
  var a = this.cj();
  this.yf = this.ym(a);
  this.im = this.Z().frames[a];
  a = this.bj();
  this.xf = this.ym(a);
  this.hm = this.Z().frames[a]
};
d.ym = function(a) {
  T.log(V, T.Qa.Xa, "constructing sender frame: " + a);
  var b = document.createElement("iframe"), c = b.style;
  c.position = "absolute";
  c.top = "-10px";
  c.left = "10px";
  c.width = "1px";
  c.height = "1px";
  b.id = b.name = a;
  b.src = this.ah + "#INITIAL";
  this.Z().document.body.appendChild(b);
  return b
};
d.Yz = function() {
  this.gs || 0 < this.XA-- || (T.log(V, T.Qa.Xa, "Inner peer reconnect triggered."), this.g.name = eg(10), T.log(V, T.Qa.Xa, "switching channels: " + this.g.name), this.as(), this.Sa = !1, this.gs = this.ym("googlexpc_reconnect_" + this.g.name))
};
d.cA = function() {
  T.log(V, T.Qa.Xa, "outerPeerReconnect called");
  for(var a = this.nm(), b = a.length, c = 0;c < b;c++) {
    var e;
    try {
      a[c] && a[c].name && (e = a[c].name)
    }catch(f) {
    }
    if(e) {
      var g = e.split("_");
      if(3 == g.length && "googlexpc" == g[0] && "reconnect" == g[1]) {
        this.g.name = g[2];
        this.as();
        this.Sa = !1;
        break
      }
    }
  }
};
d.as = function() {
  T.log(V, T.Qa.Xa, "deconstructSenderFrames called");
  this.yf && (this.yf.parentNode.removeChild(this.yf), this.im = this.yf = null);
  this.xf && (this.xf.parentNode.removeChild(this.xf), this.hm = this.xf = null)
};
d.aD = function() {
  this.qr(this.cj()) && this.qr(this.bj()) ? (T.w(V, "foreign frames present"), this.Mq = new lg(this, this.qm(this.cj()), t(this.eA, this)), this.Lq = new lg(this, this.qm(this.bj()), t(this.dA, this)), this.br()) : (T.log(V, T.Qa.Xa, "foreign frames not (yet) present"), 1 == this.g.Hc() ? this.Yz() : 0 == this.g.Hc() && this.cA(), this.Z().setTimeout(t(this.connect, this), 100))
};
d.qr = function(a) {
  T.log(V, T.Qa.Xa, "checking for receive frame: " + a);
  try {
    var b = this.qm(a);
    if(!b || 0 != b.location.href.indexOf(this.SA)) {
      return!1
    }
  }catch(c) {
    return!1
  }
  return!0
};
d.br = function() {
  var a = this.nm();
  a[this.bj()] && a[this.cj()] ? (this.Sr = new mg(this.ah, this.im), this.Si = new mg(this.ah, this.hm), T.w(V, "local frames ready"), this.Z().setTimeout(t(function() {
    this.Sr.send("SETUP");
    this.rf = !0;
    T.w(V, "SETUP sent")
  }, this), 100)) : (this.rs || (this.rs = t(this.br, this)), this.Z().setTimeout(this.rs, 100), T.w(V, "local frames not (yet) present"))
};
d.ar = function() {
  if(this.fm && this.Rq) {
    if(this.g.Lc(), this.zf) {
      T.w(V, "delivering queued messages (" + this.zf.length + ")");
      for(var a = 0, b;a < this.zf.length;a++) {
        b = this.zf[a], this.g.Ic(b.service, b.payload)
      }
      delete this.zf
    }
  }else {
    T.log(V, T.Qa.Xa, "checking if connected: ack sent:" + this.fm + ", ack rcvd: " + this.Rq)
  }
};
d.eA = function(a) {
  T.log(V, T.Qa.Xa, "msg received: " + a);
  if("SETUP" == a) {
    this.Si && (this.Si.send("SETUP_ACK"), T.log(V, T.Qa.Xa, "SETUP_ACK sent"), this.fm = !0, this.ar())
  }else {
    if(this.g.qa() || this.fm) {
      var b = a.indexOf("|"), c = a.substring(0, b);
      a = a.substring(b + 1);
      b = c.indexOf(",");
      if(-1 == b) {
        var e;
        this.Si.send("ACK:" + c);
        this.lr(a)
      }else {
        e = c.substring(0, b), this.Si.send("ACK:" + e), c = c.substring(b + 1).split("/"), b = parseInt(c[0], 10), c = parseInt(c[1], 10), 1 == b && (this.om = []), this.om.push(a), b == c && (this.lr(this.om.join("")), delete this.om)
      }
    }else {
      T.e(V, "received msg, but channel is not connected")
    }
  }
};
d.dA = function(a) {
  T.log(V, T.Qa.Xa, "ack received: " + a);
  "SETUP_ACK" == a ? (this.rf = !1, this.Rq = !0, this.ar()) : this.g.qa() ? this.rf ? parseInt(a.split(":")[1], 10) == this.Kc ? (this.rf = !1, this.hr()) : T.e(V, "got ack with wrong sequence") : T.e(V, "got unexpected ack") : T.e(V, "received ack, but channel not connected")
};
d.hr = function() {
  if(!this.rf && this.oj.length) {
    var a = this.oj.shift();
    ++this.Kc;
    this.Sr.send(this.Kc + a);
    T.log(V, T.Qa.Xa, "msg sent: " + this.Kc + a);
    this.rf = !0
  }
};
d.lr = function(a) {
  var b = a.indexOf(":"), c = a.substr(0, b);
  a = a.substring(b + 1);
  this.g.qa() ? this.g.Ic(c, a) : ((this.zf || (this.zf = [])).push({service:c, payload:a}), T.log(V, T.Qa.Xa, "queued delivery"))
};
d.dk = 3800;
d.send = function(a, b) {
  var c = a + ":" + b;
  if(!F || b.length <= this.dk) {
    this.oj.push("|" + c)
  }else {
    for(var e = b.length, f = Math.ceil(e / this.dk), g = 0, k = 1;g < e;) {
      this.oj.push("," + k + "/" + f + "|" + c.substr(g, this.dk)), k++, g += this.dk
    }
  }
  this.hr()
};
d.j = function() {
  ig.q.j.call(this);
  var a = ng;
  nb(a, this.Mq);
  nb(a, this.Lq);
  this.Mq = this.Lq = null;
  zf(this.yf);
  zf(this.xf);
  this.im = this.hm = this.yf = this.xf = null
};
var ng = [], og = t(function() {
  var a = ng, b, c = !1;
  try {
    for(var e = 0;b = a[e];e++) {
      c = c || b.Uk()
    }
  }catch(f) {
    if(T.info(V, "receive_() failed: " + f), b.Ya.g.QB(), !a.length) {
      return
    }
  }
  a = u();
  c && (jg = a);
  kg = window.setTimeout(og, 1E3 > a - jg ? 10 : 100)
}, ig), pg = function() {
  T.w(V, "starting receive-timer");
  jg = u();
  kg && window.clearTimeout(kg);
  kg = window.setTimeout(og, 10)
}, mg = function(a, b) {
  this.ah = a;
  this.Ku = b;
  this.Sn = 0
};
mg.prototype.send = function(a) {
  this.Sn = ++this.Sn % 2;
  a = this.ah + "#" + this.Sn + encodeURIComponent(a);
  try {
    G ? this.Ku.location.href = a : this.Ku.location.replace(a)
  }catch(b) {
    T.error(V, "sending failed", b)
  }
  pg()
};
var lg = function(a, b, c) {
  this.Ya = a;
  this.tu = b;
  this.UE = c;
  this.su = this.tu.location.href.split("#")[0] + "#INITIAL";
  ng.push(this);
  pg()
};
lg.prototype.Uk = function() {
  var a = this.tu.location.href;
  if(a != this.su) {
    this.su = a;
    if(a = a.split("#")[1]) {
      a = a.substr(1), this.UE(decodeURIComponent(a))
    }
    return!0
  }
  return!1
};
var rg = function(a, b) {
  this.lb = b || wf();
  this.g = a;
  this.MA = this.g.xj().pru;
  this.Pr = this.g.xj().ifrid;
  G && qg()
};
v(rg, fg);
if(G) {
  var sg = [], tg = 0, qg = function() {
    tg || (tg = window.setTimeout(function() {
      ug()
    }, 1E3))
  }, ug = function(a) {
    var b = u();
    for(a = a || 3E3;sg.length && b - sg[0].timestamp >= a;) {
      var c = sg.shift().UA;
      zf(c);
      T.log(V, T.Qa.Xa, "iframe removed")
    }
    tg = window.setTimeout(vg, 1E3)
  }, vg = function() {
    ug()
  }
}
var wg = {};
rg.prototype.Tf = 3;
rg.prototype.connect = function() {
  this.Z().xpcRelay || (this.Z().xpcRelay = xg);
  this.send("tp", "SETUP")
};
var xg = function(a, b) {
  var c = b.indexOf(":"), e = b.substr(0, c), f = b.substr(c + 1);
  if(F && -1 != (c = e.indexOf("|"))) {
    var g = e.substr(0, c), e = e.substr(c + 1), c = e.indexOf("+"), k = e.substr(0, c), c = parseInt(e.substr(c + 1), 10), l = wg[k];
    l || (l = wg[k] = {Du:[], Eu:0, Cu:0});
    -1 != e.indexOf("++") && (l.Cu = c + 1);
    l.Du[c] = f;
    l.Eu++;
    if(l.Eu != l.Cu) {
      return
    }
    f = l.Du.join("");
    delete wg[k]
  }else {
    var g = e
  }
  cg[a].Ic(g, decodeURIComponent(f))
};
rg.prototype.Dm = function(a) {
  "SETUP" == a ? (this.send("tp", "SETUP_ACK"), this.g.Lc()) : "SETUP_ACK" == a && this.g.Lc()
};
rg.prototype.send = function(a, b) {
  var c = encodeURIComponent(b), e = c.length;
  if(F && 1800 < e) {
    for(var f = Ga(), g = 0, k = 0;g < e;k++) {
      var l = c.substr(g, 1800), g = g + 1800;
      this.ck(a, l, f + (g >= e ? "++" : "+") + k)
    }
  }else {
    this.ck(a, c)
  }
};
rg.prototype.ck = function(a, b, c) {
  if(F) {
    var e = this.Z().document.createElement("div");
    e.innerHTML = '<iframe onload="this.xpcOnload()"></iframe>';
    e = e.childNodes[0];
    e.xpcOnload = yg
  }else {
    e = this.Z().document.createElement("iframe"), G ? sg.push({timestamp:u(), UA:e}) : P(e, "load", yg)
  }
  var f = e.style;
  f.visibility = "hidden";
  f.width = e.style.height = "0px";
  f.position = "absolute";
  f = this.MA;
  f += "#" + this.g.name;
  this.Pr && (f += "," + this.Pr);
  f += "|" + a;
  c && (f += "|" + c);
  f += ":" + b;
  e.src = f;
  this.Z().document.body.appendChild(e);
  T.log(V, T.Qa.Xa, "msg sent: " + f)
};
var yg = function() {
  T.log(V, T.Qa.Xa, "iframe-load");
  zf(this)
};
rg.prototype.j = function() {
  rg.q.j.call(this);
  G && ug(0)
};
var zg = function(a, b, c, e, f) {
  this.lb = c || wf();
  this.g = a;
  this.sb = f || 2;
  w(1 <= this.sb);
  w(2 >= this.sb);
  this.Dq = b || "*";
  this.B = new R(this);
  this.Tg = new Me(100, this.Z());
  this.Xi = !!e;
  this.rd = new Yf;
  this.sd = new Yf;
  this.ud = new Yf;
  this.Qz = eg(10);
  this.aj = null;
  this.Xi ? 1 == this.g.Hc() ? this.ud.fj(this.rd) : this.ud.fj(this.sd) : (this.ud.fj(this.rd), 2 == this.sb && this.ud.fj(this.sd));
  this.ud.lm(this.fr, this);
  this.ud.Wa(!0);
  this.B.listen(this.Tg, "tick", this.Wq);
  T.info(V, "NativeMessagingTransport created.  protocolVersion=" + this.sb + ", oneSidedHandshake=" + this.Xi + ", role=" + this.g.Hc())
};
v(zg, fg);
zg.prototype.Gd = null;
zg.prototype.Sa = !1;
zg.prototype.Tf = 1;
var Ag = {};
zg.prototype.Qj = function(a) {
  return null == this.Gd || this.Gd == a
};
var Cg = function(a) {
  var b = a.bt().data;
  if(!s(b)) {
    return!1
  }
  var c = b.indexOf("|"), e = b.indexOf(":");
  if(-1 == c || -1 == e) {
    return!1
  }
  var f = b.substring(0, c), c = b.substring(c + 1, e), b = b.substring(e + 1);
  T.w(V, "messageReceived: channel=" + f + ", service=" + c + ", payload=" + b);
  if(e = cg[f]) {
    return e.Ic(c, b, a.bt().origin), !0
  }
  a = Bg(b)[0];
  for(var g in cg) {
    if(e = cg[g], 1 == e.Hc() && !e.qa() && "tp" == c && ("SETUP" == a || "SETUP_NTPV2" == a)) {
      return T.w(V, "changing channel name to " + f), e.name = f, delete cg[g], cg[f] = e, e.Ic(c, b), !0
    }
  }
  T.info(V, 'channel name mismatch; message ignored"');
  return!1
};
d = zg.prototype;
d.Dm = function(a) {
  var b = Bg(a);
  a = b[1];
  switch(b[0]) {
    case "SETUP_ACK":
      this.Oj(1);
      this.rd.Sc() || this.rd.Wa(!0);
      break;
    case "SETUP_ACK_NTPV2":
      2 == this.sb && (this.Oj(2), this.rd.Sc() || this.rd.Wa(!0));
      break;
    case "SETUP":
      this.Oj(1);
      this.kt(1);
      break;
    case "SETUP_NTPV2":
      2 == this.sb && (b = this.Gd, this.Oj(2), this.kt(2), 1 != b && null == this.aj || this.aj == a || (T.info(V, "Sending SETUP and changing peer ID to: " + a), this.xr()), this.aj = a)
  }
};
d.xr = function() {
  w(!(1 == this.sb && 2 == this.Gd));
  if(2 == this.sb && this.Qj(2)) {
    var a;
    a = "SETUP_NTPV2," + this.Qz;
    this.send("tp", a)
  }
  this.Qj(1) && this.send("tp", "SETUP")
};
d.kt = function(a) {
  w(1 != this.sb || 2 != a, "Shouldn't try to send a v2 setup ack in v1 mode.");
  if(2 == this.sb && this.Qj(2) && 2 == a) {
    this.send("tp", "SETUP_ACK_NTPV2")
  }else {
    if(this.Qj(1) && 1 == a) {
      this.send("tp", "SETUP_ACK")
    }else {
      return
    }
  }
  this.sd.Sc() || this.sd.Wa(!0)
};
d.Oj = function(a) {
  a > this.Gd && (this.Gd = a);
  1 == this.Gd && (this.sd.Sc() || this.Xi || this.sd.Wa(!0), this.aj = null)
};
d.connect = function() {
  var a = this.Z(), b = a[ia] || (a[ia] = ++ja), c = Ag[b];
  fa(c) || (c = 0);
  0 == c && P(a.postMessage ? a : a.document, "message", Cg, !1, zg);
  Ag[b] = c + 1;
  this.Sa = !0;
  this.Wq()
};
d.Wq = function() {
  var a = 0 == this.g.Hc();
  this.Xi && a || this.g.qa() || this.uf() ? this.Tg.stop() : (this.Tg.start(), this.xr())
};
d.send = function(a, b) {
  var c = this.g.pr();
  c ? (this.send = function(a, b) {
    var g = this, k = this.g.name;
    this.Li = S(function() {
      g.Li = 0;
      try {
        var l = c.postMessage ? c : c.document;
        l.postMessage ? (l.postMessage(k + "|" + a + ":" + b, g.Dq), T.w(V, "send(): service=" + a + " payload=" + b + " to hostname=" + g.Dq)) : T.e(V, "Peer window had no postMessage function.")
      }catch(r) {
        T.e(V, "Error performing postMessage, ignoring.", r)
      }
    }, 0)
  }, this.send(a, b)) : T.w(V, "send(): window not ready")
};
d.fr = function() {
  this.g.Lc(1 == this.sb || 1 == this.Gd ? 200 : void 0)
};
d.j = function() {
  if(this.Sa) {
    var a = this.Z(), b = a[ia] || (a[ia] = ++ja), c = Ag[b];
    Ag[b] = c - 1;
    1 == c && je(a.postMessage ? a : a.document, "message", Cg, !1, zg)
  }
  this.Li && (h.clearTimeout(this.Li), this.Li = 0);
  Pd(this.B);
  delete this.B;
  Pd(this.Tg);
  delete this.Tg;
  this.rd.cancel();
  delete this.rd;
  this.sd.cancel();
  delete this.sd;
  this.ud.cancel();
  delete this.ud;
  delete this.send;
  zg.q.j.call(this)
};
var Bg = function(a) {
  a = a.split(",");
  a[1] = a[1] || null;
  return a
};
var Dg = function(a, b) {
  this.lb = b || wf();
  this.g = a;
  this.Kr = a.at || "";
  this.Qr = a.rat || "";
  var c = this.Z();
  if(!c.nix_setup_complete) {
    try {
      c.execScript("Class GCXPC____NIXVBS_wrapper\n Private m_Transport\nPrivate m_Auth\nPublic Sub SetTransport(transport)\nIf isEmpty(m_Transport) Then\nSet m_Transport = transport\nEnd If\nEnd Sub\nPublic Sub SetAuth(auth)\nIf isEmpty(m_Auth) Then\nm_Auth = auth\nEnd If\nEnd Sub\nPublic Function GetAuthToken()\n GetAuthToken = m_Auth\nEnd Function\nPublic Sub SendMessage(service, payload)\n Call m_Transport.GCXPC____NIXJS_handle_message(service, payload)\nEnd Sub\nPublic Sub CreateChannel(channel)\n Call m_Transport.GCXPC____NIXJS_create_channel(channel)\nEnd Sub\nPublic Sub GCXPC____NIXVBS_container()\n End Sub\nEnd Class\n Function GCXPC____NIXVBS_get_wrapper(transport, auth)\nDim wrap\nSet wrap = New GCXPC____NIXVBS_wrapper\nwrap.SetTransport transport\nwrap.SetAuth auth\nSet GCXPC____NIXVBS_get_wrapper = wrap\nEnd Function", 
      "vbscript"), c.nix_setup_complete = !0
    }catch(e) {
      T.error(V, "exception caught while attempting global setup: " + e)
    }
  }
  this.GCXPC____NIXJS_handle_message = this.ZA;
  this.GCXPC____NIXJS_create_channel = this.YA
};
v(Dg, fg);
d = Dg.prototype;
d.Tf = 6;
d.Ff = !1;
d.yd = null;
d.connect = function() {
  0 == this.g.Hc() ? this.hs() : this.Vr()
};
d.hs = function() {
  if(!this.Ff) {
    var a = this.g.Zr();
    try {
      a.contentWindow.opener = (0,this.Z().GCXPC____NIXVBS_get_wrapper)(this, this.Kr), this.Ff = !0
    }catch(b) {
      T.error(V, "exception caught while attempting setup: " + b)
    }
    this.Ff || this.Z().setTimeout(t(this.hs, this), 100)
  }
};
d.Vr = function() {
  if(!this.Ff) {
    try {
      var a = this.Z().opener;
      if(a && "GCXPC____NIXVBS_container" in a) {
        this.yd = a;
        if(this.yd.GetAuthToken() != this.Qr) {
          T.error(V, "Invalid auth token from other party");
          return
        }
        this.yd.CreateChannel((0,this.Z().GCXPC____NIXVBS_get_wrapper)(this, this.Kr));
        this.Ff = !0;
        this.g.Lc()
      }
    }catch(b) {
      T.error(V, "exception caught while attempting setup: " + b);
      return
    }
    this.Ff || this.Z().setTimeout(t(this.Vr, this), 100)
  }
};
d.YA = function(a) {
  "unknown" == typeof a && "GCXPC____NIXVBS_container" in a || T.error(V, "Invalid NIX channel given to createChannel_");
  this.yd = a;
  this.yd.GetAuthToken() != this.Qr ? T.error(V, "Invalid auth token from other party") : this.g.Lc()
};
d.ZA = function(a, b) {
  this.Z().setTimeout(t(function() {
    this.g.Ic(a, b)
  }, this), 1)
};
d.send = function(a, b) {
  "unknown" !== typeof this.yd && T.error(V, "NIX channel not connected");
  this.yd.SendMessage(a, b)
};
d.j = function() {
  Dg.q.j.call(this);
  this.yd = null
};
var Fg = function(a, b) {
  this.Vi = {};
  for(var c = 0, e;e = bg[c];c++) {
    if(e in a && !/^https?:\/\//.test(a[e])) {
      throw Error("URI " + a[e] + " is invalid for field " + e);
    }
  }
  this.X = a;
  this.name = this.X.cn || eg(10);
  this.lb = b || wf();
  this.dj = [];
  this.ij = new R(this);
  a.lpu = a.lpu || ue(this.lb.Z().location.href) + "/robots.txt";
  a.ppu = a.ppu || ue(a.pu || "") + "/robots.txt";
  cg[this.name] = this;
  me(window, "unload", Eg) || ie(window, "unload", Eg);
  T.info(V, "CrossPageChannel created: " + this.name)
};
v(Fg, Mf);
var Gg = /^%*tp$/, Hg = /^%+tp$/;
d = Fg.prototype;
d.Id = null;
d.mc = null;
d.Ya = null;
d.k = 1;
d.qa = function() {
  return 2 == this.k
};
d.we = null;
d.hh = null;
d.xj = function() {
  return this.X
};
d.Zr = function() {
  return this.hh
};
d.Ss = function(a) {
  this.we = a
};
d.pr = function() {
  return this.we
};
d.js = function() {
  try {
    return!!this.we && !Boolean(this.we.closed)
  }catch(a) {
    return!1
  }
};
d.pD = function() {
  var a;
  if(ga(document.postMessage) || ga(window.postMessage) || F && window.postMessage) {
    a = 1
  }else {
    if(ec) {
      a = 2
    }else {
      if(F && this.X.pru) {
        a = 3
      }else {
        var b;
        if(b = F) {
          b = !1;
          try {
            a = window.opener, window.opener = {}, b = Rd(window, "opener"), window.opener = a
          }catch(c) {
          }
        }
        a = b ? 6 : 4
      }
    }
  }
  return a
};
d.lC = function() {
  if(!this.Ya) {
    this.X.tp || (this.X.tp = this.pD());
    switch(this.X.tp) {
      case 1:
        this.Ya = new zg(this, this.X.ph, this.lb, !!this.X.osh, this.X.nativeProtocolVersion || 2);
        break;
      case 6:
        this.Ya = new Dg(this, this.lb);
        break;
      case 2:
        this.Ya = new hg(this, this.lb);
        break;
      case 3:
        this.Ya = new rg(this, this.lb);
        break;
      case 4:
        this.Ya = new ig(this, this.lb)
    }
    if(this.Ya) {
      T.info(V, "Transport created: " + this.Ya.getName())
    }else {
      throw Error("CrossPageChannel: No suitable transport found!");
    }
  }
};
d.tD = function() {
  var a = {};
  a.cn = this.name;
  a.tp = this.X.tp;
  a.osh = this.X.osh;
  this.X.lru && (a.pru = this.X.lru);
  this.X.lpu && (a.ppu = this.X.lpu);
  this.X.ppu && (a.lpu = this.X.ppu);
  var b = this.X.role;
  b && (a.role = 1 == b ? 0 : 1);
  return a
};
d.gD = function(a, b, c) {
  T.info(V, "createPeerIframe()");
  var e = this.X.ifrid;
  e || (e = this.X.ifrid = "xpcpeer" + eg(4));
  var f = wf(a).createElement("IFRAME");
  f.id = f.name = e;
  b ? b(f) : f.style.width = f.style.height = "100%";
  this.Ur();
  this.mc = new Yf(void 0, this);
  var g = this.NC(c);
  this.ij.Wd(f, "load", this.mc.Wa, !1, this.mc);
  ec || G ? window.setTimeout(t(function() {
    a.appendChild(f);
    f.src = g.toString();
    T.info(V, "peer iframe created (" + e + ")")
  }, this), 1) : (f.src = g.toString(), a.appendChild(f), T.info(V, "peer iframe created (" + e + ")"));
  return f
};
d.Ur = function() {
  this.mc && (this.mc.cancel(), this.mc = null);
  this.dj.length = 0;
  this.ij.removeAll()
};
d.NC = function(a) {
  var b = this.X.pu;
  s(b) && (b = this.X.pu = new U(b));
  !1 !== a && b.ba("xpc", Jf(this.tD()));
  return b
};
d.connect = function(a) {
  this.Jm = a || m;
  this.mc ? this.mc.lm(this.yu) : this.yu()
};
d.yu = function() {
  T.info(V, "continueConnection_()");
  this.mc = null;
  this.X.ifrid && (this.hh = this.lb.mC(this.X.ifrid));
  if(this.hh) {
    var a = this.hh.contentWindow;
    a || (a = window.frames[this.X.ifrid]);
    this.Ss(a)
  }
  if(!this.we) {
    if(window == window.top) {
      throw Error("CrossPageChannel: Can't connect, peer window-object not set.");
    }
    this.Ss(window.parent)
  }
  this.lC();
  for(this.Ya.connect();0 < this.dj.length;) {
    this.dj.shift()()
  }
};
d.close = function() {
  this.Ur();
  this.k = 3;
  Pd(this.Ya);
  this.Jm = this.Ya = null;
  Pd(this.Id);
  this.Id = null;
  T.info(V, 'Channel "' + this.name + '" closed')
};
d.Lc = function(a) {
  this.qa() || this.Id && this.Id.lc() || (this.k = 2, T.info(V, 'Channel "' + this.name + '" connected'), Pd(this.Id), a ? (this.Id = new Ff(this.Jm, a), this.Id.start()) : (this.Id = null, this.Jm()))
};
d.fr = Fg.prototype.Lc;
d.QB = function() {
  T.info(V, "Transport Error");
  this.close()
};
d.send = function(a, b) {
  this.qa() ? this.js() ? (ha(b) && (b = Jf(b)), this.Ya.send(this.mE(a), b)) : (T.error(V, "Peer has disappeared."), this.close()) : T.error(V, "Can't send. Channel not connected.")
};
d.Ic = function(a, b, c) {
  this.mc ? this.dj.push(t(this.Ic, this, a, b, c)) : this.LA(c) ? this.uf() ? T.e(V, "CrossPageChannel::xpcDeliver(): Disposed.") : a && "tp" != a ? this.qa() ? this.KA(this.NA(a), b) : T.info(V, "CrossPageChannel::xpcDeliver(): Not connected.") : this.Ya.Dm(b) : T.e(V, 'Message received from unapproved origin "' + c + '" - rejected.')
};
d.mE = function(a) {
  Gg.test(a) && (a = "%" + a);
  return a.replace(/[%:|]/g, encodeURIComponent)
};
d.NA = function(a) {
  a = a.replace(/%[0-9a-f]{2}/gi, decodeURIComponent);
  return Hg.test(a) ? a.substring(1) : a
};
d.Hc = function() {
  var a = this.X.role;
  return fa(a) ? a : window.parent == this.we ? 1 : 0
};
d.LA = function(a) {
  var b = this.X.ph;
  return pa(null == a ? "" : String(a)) || pa(null == b ? "" : String(b)) || a == this.X.ph
};
d.j = function() {
  this.close();
  this.hh = this.we = null;
  delete cg[this.name];
  Pd(this.ij);
  delete this.ij;
  Fg.q.j.call(this)
};
var Eg = function() {
  for(var a in cg) {
    Pd(cg[a])
  }
};
var Ig = function() {
};
Ig.prototype.Yu = null;
Ig.prototype.gp = function() {
  return this.Yu || (this.Yu = this.GG())
};
var Jg, Kg = function() {
};
v(Kg, Ig);
Kg.prototype.Tu = function() {
  var a = this.bv();
  return a ? new ActiveXObject(a) : new XMLHttpRequest
};
Kg.prototype.GG = function() {
  var a = {};
  this.bv() && (a[0] = !0, a[1] = !0);
  return a
};
Kg.prototype.bv = function() {
  if(!this.dv && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var a = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        return new ActiveXObject(c), this.dv = c
      }catch(e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.dv
};
Jg = new Kg;
var Lg = function(a) {
  Q.call(this);
  this.headers = new E;
  this.di = a || null;
  this.aa = !1;
  this.Wh = this.H = null;
  this.No = this.lg = "";
  this.Pe = 0;
  this.Ia = "";
  this.ae = this.Nk = this.Sh = this.Qk = !1;
  this.wc = 0;
  this.fi = null;
  this.Ue = "";
  this.gi = this.Wo = !1
};
v(Lg, Q);
Lg.prototype.a = T.td("goog.net.XhrIo");
var Mg = /^https?$/i, Ng = ["POST", "PUT"], Og = [];
d = Lg.prototype;
d.Hv = function() {
  this.V();
  nb(Og, this)
};
d.Lj = function(a) {
  this.wc = Math.max(0, a)
};
d.mt = function(a) {
  this.Ue = a
};
d.nt = function() {
  return this.Ue
};
d.DG = function(a) {
  this.Wo = a
};
d.send = function(a, b, c, e) {
  if(this.H) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.lg + "; newUri=" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.lg = a;
  this.Ia = "";
  this.Pe = 0;
  this.No = b;
  this.Qk = !1;
  this.aa = !0;
  this.H = this.Xv();
  this.Wh = this.di ? this.di.gp() : Jg.gp();
  this.H.onreadystatechange = t(this.Ho, this);
  try {
    T.w(this.a, this.Ac("Opening Xhr")), this.Nk = !0, this.H.open(b, a, !0), this.Nk = !1
  }catch(f) {
    T.w(this.a, this.Ac("Error opening Xhr: " + f.message));
    this.Ta(5, f);
    return
  }
  a = c || "";
  var g = this.headers.clone();
  e && Ob(e, function(a, b) {
    g.set(b, a)
  });
  e = z(g.Ua(), Pg);
  c = h.FormData && a instanceof h.FormData;
  !B(Ng, b) || e || c || g.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  Ob(g, function(a, b) {
    this.H.setRequestHeader(b, a)
  }, this);
  this.Ue && (this.H.responseType = this.Ue);
  "withCredentials" in this.H && (this.H.withCredentials = this.Wo);
  try {
    this.dp(), 0 < this.wc && (this.gi = F && sc(9) && fa(this.H.timeout) && p(this.H.ontimeout), T.w(this.a, this.Ac("Will abort after " + this.wc + "ms if incomplete, xhr2 " + this.gi)), this.gi ? (this.H.timeout = this.wc, this.H.ontimeout = t(this.Le, this)) : this.fi = S(this.Le, this.wc, this)), T.w(this.a, this.Ac("Sending request")), this.Sh = !0, this.H.send(a), this.Sh = !1
  }catch(k) {
    T.w(this.a, this.Ac("Send error: " + k.message)), this.Ta(5, k)
  }
};
var Pg = function(a) {
  return"content-type" == a.toLowerCase()
};
d = Lg.prototype;
d.Xv = function() {
  return this.di ? this.di.Tu() : Jg.Tu()
};
d.Le = function() {
  "undefined" != typeof aa && this.H && (this.Ia = "Timed out after " + this.wc + "ms, aborting", this.Pe = 8, T.w(this.a, this.Ac(this.Ia)), this.dispatchEvent("timeout"), this.abort(8))
};
d.Ta = function(a, b) {
  this.aa = !1;
  this.H && (this.ae = !0, this.H.abort(), this.ae = !1);
  this.Ia = b;
  this.Pe = a;
  this.mp();
  this.Uh()
};
d.mp = function() {
  this.Qk || (this.Qk = !0, this.dispatchEvent("complete"), this.dispatchEvent("error"))
};
d.abort = function(a) {
  this.H && this.aa && (T.w(this.a, this.Ac("Aborting")), this.aa = !1, this.ae = !0, this.H.abort(), this.ae = !1, this.Pe = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), this.Uh())
};
d.j = function() {
  this.H && (this.aa && (this.aa = !1, this.ae = !0, this.H.abort(), this.ae = !1), this.Uh(!0));
  Lg.q.j.call(this)
};
d.Ho = function() {
  this.uf() || (this.Nk || this.Sh || this.ae ? this.nu() : this.QE())
};
d.QE = function() {
  this.nu()
};
d.nu = function() {
  if(this.aa && "undefined" != typeof aa) {
    if(this.Wh[1] && 4 == this.Yc() && 2 == this.ua()) {
      T.w(this.a, this.Ac("Local request error detected and ignored"))
    }else {
      if(this.Sh && 4 == this.Yc()) {
        S(this.Ho, 0, this)
      }else {
        if(this.dispatchEvent("readystatechange"), this.pp()) {
          T.w(this.a, this.Ac("Request complete"));
          this.aa = !1;
          try {
            this.ga() ? (this.dispatchEvent("complete"), this.dispatchEvent("success")) : (this.Pe = 6, this.Ia = this.Ik() + " [" + this.ua() + "]", this.mp())
          }finally {
            this.Uh()
          }
        }
      }
    }
  }
};
d.Uh = function(a) {
  if(this.H) {
    this.dp();
    var b = this.H, c = this.Wh[0] ? m : null;
    this.Wh = this.H = null;
    a || this.dispatchEvent("ready");
    try {
      b.onreadystatechange = c
    }catch(e) {
      T.error(this.a, "Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
};
d.dp = function() {
  this.H && this.gi && (this.H.ontimeout = null);
  fa(this.fi) && (h.clearTimeout(this.fi), this.fi = null)
};
d.lc = function() {
  return!!this.H
};
d.pp = function() {
  return 4 == this.Yc()
};
d.ga = function() {
  var a = this.ua(), b;
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
  return b || 0 === a && !this.hF()
};
d.hF = function() {
  var a = te(String(this.lg))[1] || null;
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return Mg.test(a ? a.toLowerCase() : "")
};
d.Yc = function() {
  return this.H ? this.H.readyState : 0
};
d.ua = function() {
  try {
    return 2 < this.Yc() ? this.H.status : -1
  }catch(a) {
    return T.e(this.a, "Can not get status: " + a.message), -1
  }
};
d.Ik = function() {
  try {
    return 2 < this.Yc() ? this.H.statusText : ""
  }catch(a) {
    return T.w(this.a, "Can not get status: " + a.message), ""
  }
};
d.hi = function() {
  return String(this.lg)
};
d.Ob = function() {
  try {
    return this.H ? this.H.responseText : ""
  }catch(a) {
    return T.w(this.a, "Can not get responseText: " + a.message), ""
  }
};
d.Lp = function() {
  try {
    return this.H ? this.H.responseXML : null
  }catch(a) {
    return T.w(this.a, "Can not get responseXML: " + a.message), null
  }
};
d.Oo = function(a) {
  if(this.H) {
    var b = this.H.responseText;
    a && 0 == b.indexOf(a) && (b = b.substring(a.length));
    return Gf(b)
  }
};
d.getResponseHeader = function(a) {
  return this.H && this.pp() ? this.H.getResponseHeader(a) : void 0
};
d.Jh = function() {
  return this.Pe
};
d.Fe = function() {
  return s(this.Ia) ? this.Ia : String(this.Ia)
};
d.Ac = function(a) {
  return a + " [" + this.No + " " + this.lg + " " + this.ua() + "]"
};
var Qg = function(a) {
  Ne.call(this, a.T());
  this.ug = a;
  this.S = a.S;
  var b = new R(this);
  b.listen(a, "b", this.ll);
  b.listen(a, "a", this.Lm);
  this.Em(b)
};
v(Qg, Ne);
Qg.prototype.pi = function() {
  this.ug.disconnect()
};
Qg.prototype.send = function(a) {
  this.ug.send(a)
};
Qg.prototype.ll = function(a) {
  this.onMessage(a.message)
};
Qg.prototype.Lm = function(a) {
  this.bb(a.hg)
};
H("cv.AppEngineChannel");
new E;
var Sg = function(a, b) {
  Q.call(this);
  this.jy = p(a) ? a : !0;
  this.Ml = b || Rg;
  this.Ki = this.Ml(this.Pg)
};
v(Sg, Q);
d = Sg.prototype;
d.zb = null;
d.Pa = null;
d.jf = void 0;
d.Nl = !1;
d.Pg = 0;
d.a = T.td("goog.net.WebSocket");
var Rg = function(a) {
  return Math.min(1E3 * Math.pow(2, a), 6E4)
};
d = Sg.prototype;
d.open = function(a, b) {
  w(h.WebSocket, "This browser does not support WebSocket");
  w(!this.Yp(), "The WebSocket is already open");
  this.Wp();
  this.Pa = a;
  (this.jf = b) ? (T.info(this.a, "Opening the WebSocket on " + this.Pa + " with protocol " + this.jf), this.zb = new WebSocket(this.Pa, this.jf)) : (T.info(this.a, "Opening the WebSocket on " + this.Pa), this.zb = new WebSocket(this.Pa));
  this.zb.onopen = t(this.Fx, this);
  this.zb.onclose = t(this.Vh, this);
  this.zb.onmessage = t(this.yl, this);
  this.zb.onerror = t(this.r, this)
};
d.close = function() {
  this.Wp();
  this.zb && (T.info(this.a, "Closing the WebSocket."), this.Nl = !0, this.zb.close(), this.zb = null)
};
d.send = function(a) {
  w(this.Yp(), "Cannot send without an open socket");
  this.zb.send(a)
};
d.Yp = function() {
  return!!this.zb && 1 == this.zb.readyState
};
d.Fx = function() {
  T.info(this.a, "WebSocket opened on " + this.Pa);
  this.dispatchEvent("f");
  this.Pg = 0;
  this.Ki = this.Ml(this.Pg)
};
d.Vh = function(a) {
  T.info(this.a, "The WebSocket on " + this.Pa + " closed.");
  this.dispatchEvent("c");
  this.zb = null;
  this.Nl ? (T.info(this.a, "The WebSocket closed normally."), this.Pa = null, this.jf = void 0) : (T.error(this.a, "The WebSocket disconnected unexpectedly: " + a.data), this.jy && (T.info(this.a, "Seconds until next reconnect attempt: " + Math.floor(this.Ki / 1E3)), this.Ql = S(t(this.open, this, this.Pa, this.jf), this.Ki, this), this.Pg++, this.Ki = this.Ml(this.Pg)));
  this.Nl = !1
};
d.yl = function(a) {
  this.dispatchEvent(new Tg(a.data))
};
d.r = function(a) {
  a = a.data;
  T.error(this.a, "An error occurred: " + a);
  this.dispatchEvent(new Ug(a))
};
d.Wp = function() {
  null != this.Ql && h.clearTimeout(this.Ql);
  this.Ql = null
};
d.j = function() {
  Sg.q.j.call(this);
  this.close()
};
var Tg = function(a) {
  O.call(this, "e");
  this.message = a
};
v(Tg, O);
var Ug = function(a) {
  O.call(this, "d");
  this.data = a
};
v(Ug, O);
var Vg = function(a) {
  Qg.call(this, a);
  this.a = H("cv.OrderedChannel");
  this.Bg = new E;
  this.Gg = [];
  this.ul = this.bq = 0;
  this.ea = new Me(400);
  P(this.ea, "tick", t(this.Dy, this))
};
v(Vg, Qg);
var Wg = function(a) {
  this.timestamp = u();
  this.message = a;
  this.sy = 0
}, Xg = function(a, b) {
  this.seqNum = a;
  this.body = b
};
d = Vg.prototype;
d.send = function(a) {
  a = new Xg(this.bq++, a);
  Vg.q.send.call(this, a);
  this.Bg.set(a.seqNum, new Wg(a));
  this.ea.start()
};
d.ll = function(a) {
  a = a.message;
  var b = a.seqNum;
  if(-1 == b) {
    this.Bg.remove(a.body)
  }else {
    if(-2 == b) {
      this.gq()
    }else {
      this.ug.send(this.Px(b));
      var c = b - this.ul;
      if(0 > c || void 0 !== this.Gg[c]) {
        this.a.info("Duplicate message received with seq num: " + b)
      }else {
        for(this.Gg[c] = a.body;void 0 !== this.Gg[0];) {
          a = this.Gg.shift(), this.ul++, Vg.q.ll.call(this, new Pe("b", a))
        }
      }
    }
  }
};
d.pi = function() {
  this.ug.send(this.UF());
  this.gq()
};
d.gq = function() {
  this.bq = 0;
  this.Bg.clear();
  this.ul = 0;
  this.Gg = []
};
d.Dy = function() {
  var a = this.Bg.Ua();
  if(0 == a.length) {
    this.ea.stop()
  }else {
    if(100 < a.length) {
      this.disconnect("Too many messages queued up in reliable channel.")
    }else {
      this.a.info("Retransmitting up to " + a.length + " messages.");
      var b = u(), c;
      for(c in a) {
        var e = this.Bg.get(a[c]);
        if(25 <= e.sy++) {
          this.disconnect("Exhausted maximum retries for message.");
          break
        }
        b - e.timestamp >= this.ea.ry() && this.ug.send(e.message)
      }
    }
  }
};
d.Px = function(a) {
  return new Xg(-1, a)
};
d.UF = function() {
  return new Xg(-2, {})
};
var Yg = function(a, b, c) {
  Qg.call(this, a);
  w(!c || 0 < c);
  this.wl = b || "ping";
  this.sq = c || 5E3;
  this.Rl = 2E4;
  this.a = H("cv.TimeoutChannel");
  this.yi = this.zi = this.al = null;
  this.Fy = setTimeout(t(this.Ky, this), 6E3);
  this.a.info("Creating...");
  this.Ko(t(this.Ly, this), m)
};
v(Yg, Qg);
d = Yg.prototype;
d.send = function(a) {
  Yg.q.send.call(this, a);
  u()
};
d.onMessage = function(a) {
  Yg.q.onMessage.call(this, a);
  this.al = u();
  Wc(a) && ("ping" == a[1].type ? (this.a.w("Got ping from " + this.S), this.Dp()) : "pong" == a[1].type && this.a.w("Got pong from " + this.S))
};
d.Lm = function(a) {
  Yg.q.Lm.call(this, a);
  "connected" != a.hg && (clearTimeout(this.yi), this.yi = null, clearTimeout(this.zi), this.zi = null)
};
d.Ky = function() {
  "connecting" == this.T() && (this.a.e("failed to connect in 6 seconds"), this.disconnect("failed to connect in 6 seconds"))
};
d.$F = function() {
  var a = t(function() {
    this.qa() && (this.al ? u() > this.al + this.Rl ? this.disconnect("liveness timeout") : this.zi = setTimeout(a, this.Rl) : this.disconnect("liveness timeout - heartbeat never received"))
  }, this);
  this.zi = setTimeout(a, this.Rl)
};
d.ZF = function() {
  var a = t(function() {
    this.qa() && (this.Dp(), this.yi = setTimeout(a, this.sq))
  }, this);
  this.yi = setTimeout(a, this.sq)
};
d.Dp = function() {
  var a = {type:this.wl};
  this.a.w("Sending " + this.wl + " to " + this.S);
  this.send(["cm", a])
};
d.Ly = function() {
  clearTimeout(this.Fy);
  "ping" == this.wl && this.ZF();
  this.$F()
};
var Zg = function(a) {
  Ne.call(this);
  this.a = H("cv.WebSocketChannel");
  this.B = new R(this);
  this.oe = new Sg(!1);
  this.Pa = a;
  this.B.listen(this.oe, "f", this.Zx);
  this.B.listen(this.oe, "e", this.Yx);
  this.B.listen(this.oe, "d", this.Xx);
  this.B.listen(this.oe, "c", this.Wx);
  this.oe.open(this.Pa)
};
v(Zg, Ne);
d = Zg.prototype;
d.j = function() {
  this.B.V();
  Zg.q.j.call(this)
};
d.Zx = function() {
  this.a.info("On WebSocket open: " + this.Pa);
  this.bb("connected")
};
d.Yx = function(a) {
  this.onMessage(Va(JSON.parse(a.message)))
};
d.Wx = function() {
  this.a.info("On WebSocket close: " + this.Pa);
  this.disconnect()
};
d.Xx = function(a) {
  this.a.e("On WebSocket error: " + this.Pa + ", " + a.data);
  this.disconnect(a.data)
};
d.pi = function() {
  this.a.info("Closing WebSocket channel");
  this.oe.close()
};
d.send = function(a) {
  this.oe.send(JSON.stringify(a))
};
var $g = function(a) {
  this.appName = "ChromeCast";
  this.senderId = a
};
var ah = function() {
  this.Be = this.N = 0;
  this.Md = []
};
d = ah.prototype;
d.qj = function(a) {
  this.Md[this.Be++] = a
};
d.wf = function() {
  if(this.N != this.Be) {
    var a = this.Md[this.N];
    delete this.Md[this.N];
    this.N++;
    return a
  }
};
d.K = function() {
  return this.Be - this.N
};
d.nb = function() {
  return 0 == this.Be - this.N
};
d.clear = function() {
  this.Be = this.N = this.Md.length = 0
};
d.contains = function(a) {
  return B(this.Md, a)
};
d.remove = function(a) {
  a = db(this.Md, a);
  if(0 > a) {
    return!1
  }
  a == this.N ? this.wf() : (mb(this.Md, a), this.Be--);
  return!0
};
d.U = function() {
  return this.Md.slice(this.N, this.Be)
};
var bh = function(a, b) {
  this.As = a || 0;
  this.xe = b || 10;
  if(this.As > this.xe) {
    throw Error("[goog.structs.Pool] Min can not be greater than max");
  }
  this.Pc = new ah;
  this.Ad = new Qb;
  this.Pm = 0;
  this.yn = null;
  this.sj()
};
v(bh, N);
d = bh.prototype;
d.tj = function() {
  var a = u();
  if(!(null != this.yn && a - this.yn < this.Pm)) {
    var b = this.mF();
    b && (this.yn = a, this.Ad.add(b));
    return b
  }
};
d.Xm = function(a) {
  return this.Ad.remove(a) ? (this.jn(a), !0) : !1
};
d.mF = function() {
  for(var a;0 < this.Ps() && (a = this.Pc.wf(), !this.Ym(a));) {
    this.sj()
  }
  !a && this.K() < this.xe && (a = this.$m());
  return a
};
d.jn = function(a) {
  this.Ad.remove(a);
  this.Ym(a) && this.K() < this.xe ? this.Pc.qj(a) : this.sm(a)
};
d.sj = function() {
  for(var a = this.Pc;this.K() < this.As;) {
    a.qj(this.$m())
  }
  for(;this.K() > this.xe && 0 < this.Ps();) {
    this.sm(a.wf())
  }
};
d.$m = function() {
  return{}
};
d.sm = function(a) {
  if("function" == typeof a.V) {
    a.V()
  }else {
    for(var b in a) {
      a[b] = null
    }
  }
};
d.Ym = function(a) {
  return"function" == typeof a.UG ? a.UG() : !0
};
d.contains = function(a) {
  return this.Pc.contains(a) || this.Ad.contains(a)
};
d.K = function() {
  return this.Pc.K() + this.Ad.K()
};
d.QA = function() {
  return this.Ad.K()
};
d.Ps = function() {
  return this.Pc.K()
};
d.nb = function() {
  return this.Pc.nb() && this.Ad.nb()
};
d.j = function() {
  bh.q.j.call(this);
  if(0 < this.QA()) {
    throw Error("[goog.structs.Pool] Objects not released");
  }
  delete this.Ad;
  for(var a = this.Pc;!a.nb();) {
    this.sm(a.wf())
  }
  delete this.Pc
};
var ch = function(a, b) {
  this.Bh = a;
  this.uh = b
};
ch.prototype.getKey = function() {
  return this.Bh
};
ch.prototype.Ea = function() {
  return this.uh
};
ch.prototype.clone = function() {
  return new ch(this.Bh, this.uh)
};
var dh = function(a) {
  this.Lb = [];
  a && this.KF(a)
};
d = dh.prototype;
d.Ws = function(a, b) {
  var c = this.Lb;
  c.push(new ch(a, b));
  this.LF(c.length - 1)
};
d.KF = function(a) {
  var b, c;
  if(a instanceof dh) {
    if(b = a.Ua(), c = a.U(), 0 >= a.K()) {
      a = this.Lb;
      for(var e = 0;e < b.length;e++) {
        a.push(new ch(b[e], c[e]))
      }
      return
    }
  }else {
    b = Bb(a), c = Ab(a)
  }
  for(e = 0;e < b.length;e++) {
    this.Ws(b[e], c[e])
  }
};
d.remove = function() {
  var a = this.Lb, b = a.length, c = a[0];
  if(!(0 >= b)) {
    return 1 == b ? lb(a) : (a[0] = a.pop(), this.ME(0)), c.Ea()
  }
};
d.ME = function(a) {
  for(var b = this.Lb, c = b.length, e = b[a];a < c >> 1;) {
    var f = this.oF(a), g = this.pF(a), f = g < c && b[g].getKey() < b[f].getKey() ? g : f;
    if(b[f].getKey() > e.getKey()) {
      break
    }
    b[a] = b[f];
    a = f
  }
  b[a] = e
};
d.LF = function(a) {
  for(var b = this.Lb, c = b[a];0 < a;) {
    var e = this.JF(a);
    if(b[e].getKey() > c.getKey()) {
      b[a] = b[e], a = e
    }else {
      break
    }
  }
  b[a] = c
};
d.oF = function(a) {
  return 2 * a + 1
};
d.pF = function(a) {
  return 2 * a + 2
};
d.JF = function(a) {
  return a - 1 >> 1
};
d.U = function() {
  for(var a = this.Lb, b = [], c = a.length, e = 0;e < c;e++) {
    b.push(a[e].Ea())
  }
  return b
};
d.Ua = function() {
  for(var a = this.Lb, b = [], c = a.length, e = 0;e < c;e++) {
    b.push(a[e].getKey())
  }
  return b
};
d.Of = function(a) {
  return hb(this.Lb, function(b) {
    return b.Ea() == a
  })
};
d.Aa = function(a) {
  return hb(this.Lb, function(b) {
    return b.getKey() == a
  })
};
d.clone = function() {
  return new dh(this)
};
d.K = function() {
  return this.Lb.length
};
d.nb = function() {
  return 0 == this.Lb.length
};
d.clear = function() {
  lb(this.Lb)
};
var eh = function() {
  dh.call(this)
};
v(eh, dh);
eh.prototype.qj = function(a, b) {
  this.Ws(a, b)
};
eh.prototype.wf = function() {
  return this.remove()
};
var fh = function(a, b) {
  this.es = void 0;
  this.mj = new eh;
  bh.call(this, a, b)
};
v(fh, bh);
d = fh.prototype;
d.tj = function(a, b) {
  if(!a) {
    var c = fh.q.tj.call(this);
    c && this.Pm && (this.es = h.setTimeout(t(this.Jj, this), this.Pm));
    return c
  }
  this.mj.qj(p(b) ? b : 100, a);
  this.Jj()
};
d.Jj = function() {
  for(var a = this.mj;0 < a.K();) {
    var b = this.tj();
    if(b) {
      a.wf().apply(this, [b])
    }else {
      break
    }
  }
};
d.jn = function(a) {
  fh.q.jn.call(this, a);
  this.Jj()
};
d.sj = function() {
  fh.q.sj.call(this);
  this.Jj()
};
d.j = function() {
  fh.q.j.call(this);
  h.clearTimeout(this.es);
  this.mj.clear();
  this.mj = null
};
var gh = function(a, b, c) {
  fh.call(this, b, c);
  this.nn = a
};
v(gh, fh);
gh.prototype.$m = function() {
  var a = new Lg, b = this.nn;
  b && Ob(b, function(b, e) {
    a.headers.set(e, b)
  });
  return a
};
gh.prototype.Ym = function(a) {
  return!a.uf() && !a.lc()
};
var hh = function(a, b, c, e, f) {
  Q.call(this);
  this.Km = p(a) ? a : 1;
  this.wc = p(f) ? Math.max(0, f) : 0;
  this.vf = new gh(b, c, e);
  this.Yb = new E;
  this.B = new R(this)
};
v(hh, Q);
var ih = "ready complete success error abort timeout".split(" ");
d = hh.prototype;
d.Lj = function(a) {
  this.wc = Math.max(0, a)
};
d.send = function(a, b, c, e, f, g, k, l, r) {
  if(this.Yb.get(a)) {
    throw Error("[goog.net.XhrManager] ID in use");
  }
  b = new jh(b, t(this.JE, this, a), c, e, f, k, p(l) ? l : this.Km, r);
  this.Yb.set(a, b);
  a = t(this.IE, this, a);
  this.vf.tj(a, g);
  return b
};
d.abort = function(a, b) {
  var c = this.Yb.get(a);
  if(c) {
    var e = c.gd;
    c.kE(!0);
    b && (e && (this.st(e, c.Wm()), ie(e, "ready", function() {
      this.vf.Xm(e)
    }, !1, this)), this.Yb.remove(a));
    e && e.abort()
  }
};
d.IE = function(a, b) {
  var c = this.Yb.get(a);
  c && !c.gd ? (this.OC(b, c.Wm()), b.Lj(this.wc), b.mt(c.nt()), c.gd = b, this.dispatchEvent(new kh("ready", this, a, b)), this.Lf(a, b), c.PC() && b.abort()) : this.vf.Xm(b)
};
d.JE = function(a, b) {
  var c = b.target;
  switch(b.type) {
    case "ready":
      this.Lf(a, c);
      break;
    case "complete":
      return this.sF(a, c, b);
    case "success":
      this.uF(a, c);
      break;
    case "timeout":
    ;
    case "error":
      this.tF(a, c);
      break;
    case "abort":
      this.rF(a, c)
  }
  return null
};
d.Lf = function(a, b) {
  var c = this.Yb.get(a);
  !c || c.yD() || c.bn() ? (c && (this.st(b, c.Wm()), this.Yb.remove(a)), this.vf.Xm(b)) : (c.DD(), b.send(c.Ht(), c.CD(), c.zD(), c.BD()))
};
d.sF = function(a, b, c) {
  var e = this.Yb.get(a);
  if(7 == b.Jh() || b.ga() || e.bn()) {
    if(this.dispatchEvent(new kh("complete", this, a, b)), e && (e.GD(!0), e.Jt())) {
      return e.Jt().call(b, c)
    }
  }
  return null
};
d.rF = function(a, b) {
  this.dispatchEvent(new kh("abort", this, a, b))
};
d.uF = function(a, b) {
  this.dispatchEvent(new kh("success", this, a, b))
};
d.tF = function(a, b) {
  this.Yb.get(a).bn() && this.dispatchEvent(new kh("error", this, a, b))
};
d.st = function(a, b, c) {
  this.B.cd(a, c || ih, b)
};
d.OC = function(a, b, c) {
  this.B.listen(a, c || ih, b)
};
d.j = function() {
  hh.q.j.call(this);
  this.vf.V();
  this.vf = null;
  this.B.V();
  this.B = null;
  var a = this.Yb;
  Ob(a, function(a) {
    a.V()
  });
  a.clear();
  this.Yb = null
};
var kh = function(a, b, c, e) {
  O.call(this, a, b);
  this.id = c;
  this.gd = e
};
v(kh, O);
var jh = function(a, b, c, e, f, g, k, l) {
  this.Pa = a;
  this.hD = c || "GET";
  this.fD = e;
  this.nn = f || null;
  this.Km = p(k) ? k : 1;
  this.wt = 0;
  this.xt = this.yt = !1;
  this.Mr = b;
  this.Lr = g;
  this.Ue = l || "";
  this.gd = null
};
v(jh, N);
d = jh.prototype;
d.Ht = function() {
  return this.Pa
};
d.CD = function() {
  return this.hD
};
d.zD = function() {
  return this.fD
};
d.BD = function() {
  return this.nn
};
d.DD = function() {
  this.wt++
};
d.bn = function() {
  return this.wt > this.Km
};
d.GD = function(a) {
  this.yt = a
};
d.yD = function() {
  return this.yt
};
d.kE = function(a) {
  this.xt = a
};
d.PC = function() {
  return this.xt
};
d.Wm = function() {
  return this.Mr
};
d.Jt = function() {
  return this.Lr
};
d.nt = function() {
  return this.Ue
};
d.j = function() {
  jh.q.j.call(this);
  delete this.Mr;
  delete this.Lr
};
var lh = function(a, b, c, e, f, g, k) {
  this.uy = a ? a : "https://www-googleapis-staging.sandbox.google.com/deviceregistry/v1";
  this.lD = b ? b : "https://accounts.google.com/o/oauth2/token";
  this.jD = c ? c : "919648714761-l7s11uoekiqlmod1oiv9tcjj2f1ca7dm.apps.googleusercontent.com";
  this.kD = e ? e : "QVdYPt9YzQIEto4plJysXS_Z";
  this.Kp = f ? f : "https://client-channel.google.com";
  this.Jp = g ? g : "test";
  this.Ey = k ? k : "echo_service";
  this.Jx = "AIzaSyAOZM8ZYeov685QMjXT3sC7XNizfrTEKjA"
};
var mh = function(a) {
  Q.call(this);
  this.a = H("cv.CloudXhrManager");
  this.gb = a || new lh;
  this.Vb = new hh(0, null, 1, 10, 5E3);
  this.Ry = 0;
  this.qy = new U(this.gb.uy)
};
v(mh, Q);
var nh = function(a, b) {
  this.response = a;
  this.gd = b
};
mh.prototype.vt = function(a, b) {
  var c = b.target, e = null;
  if(c.ga()) {
    try {
      e = c.Oo()
    }catch(f) {
      c.Ob() && this.a.info("Failed to parse response JSON: " + c.Ob())
    }
  }
  void 0 === e && (e = null);
  a.la(new nh(e, c))
};
mh.prototype.Bx = function(a) {
  a.client_id = this.gb.jD;
  a.client_secret = this.gb.kD;
  var b = new K;
  this.Vb.send(this.ut(), this.gb.lD, "POST", Xf(a).hE(), {"Content-Type":"application/x-www-form-urlencoded"}, 0, t(this.vt, this, b));
  return b
};
mh.prototype.ut = function() {
  return(++this.Ry % 1E3).toString()
};
mh.prototype.Wk = function(a, b, c, e, f) {
  w("GET" == b || "POST" == b || "DELETE" == b);
  var g = {"Content-Type":"application/json"};
  f && (g.Authorization = "Bearer " + f);
  f = this.qy.clone();
  f.Cf(f.Mm() + "/" + a);
  e && f.kh(e);
  a = null;
  c && (a = JSON.stringify(c));
  c = new K;
  this.Vb.send(this.ut(), f.toString(), b, a, g, 1, t(this.vt, this, c));
  return c
};
var oh = function(a) {
  this.a = H("cv.CloudAuth");
  this.yc = a;
  this.sp = "";
  this.Ig = null
};
oh.prototype.el = function() {
  var a = new K;
  if(this.sp) {
    return this.gx()
  }
  var b = chrome.identity;
  if(!b) {
    return this.a.e("chrome.identity permission required for auth."), a.cb(), a
  }
  b.getAuthToken({interactive:!0}, t(function(b) {
    a.la(p(b) ? b : "")
  }, this));
  return a
};
oh.prototype.gx = function() {
  var a = new K;
  !this.Ig || this.Ig.Sx() ? this.Tx(this.sp, !1).Db(t(function(b) {
    b = b.Ea();
    b.accessToken ? (this.Ig = new ph(b.accessToken, b.Mp), a.la(this.Ig.xc())) : (this.a.info("Failed to retrieve debug access token"), a.la(""))
  }, this)) : a.la(this.Ig.xc());
  return a
};
var ph = function(a, b) {
  this.EG = a;
  this.Xn = b ? u() + 1E3 * b : 0
};
ph.prototype.Sx = function() {
  return this.Su() && u() > this.Xn
};
ph.prototype.gB = function() {
  return this.Su() && u() > this.Xn + 6E5
};
ph.prototype.Su = function() {
  return 0 != this.Xn
};
ph.prototype.xc = function() {
  return this.EG
};
var qh = function() {
  this.accessToken = "";
  this.Mp = 0;
  this.refreshToken = ""
};
oh.prototype.Tx = function(a, b) {
  var c = {};
  b ? Ib(c, {code:a, grant_type:"authorization_code", redirect_uri:"oob"}) : Ib(c, {refresh_token:a, grant_type:"refresh_token"});
  var e = new K;
  this.yc.Bx(c).Db(t(function(a) {
    var b = new qh;
    "success" == a.T() && ((a = a.Ea().response) ? (a.refresh_token && (b.refreshToken = a.refresh_token), a.access_token && (b.accessToken = a.access_token, b.Mp = a.expires_in), e.la(b)) : (this.a.info("Failed to retrieve access token."), e.cb()))
  }, this));
  return e
};
var rh = function(a) {
  this.Qd = a
}, sh = /\s*;\s*/;
d = rh.prototype;
d.uG = function(a) {
  return!/[;=\s]/.test(a)
};
d.vG = function(a) {
  return!/[;\r\n]/.test(a)
};
d.set = function(a, b, c, e, f, g) {
  if(!this.uG(a)) {
    throw Error('Invalid cookie name "' + a + '"');
  }
  if(!this.vG(b)) {
    throw Error('Invalid cookie value "' + b + '"');
  }
  p(c) || (c = -1);
  f = f ? ";domain=" + f : "";
  e = e ? ";path=" + e : "";
  g = g ? ";secure" : "";
  c = 0 > c ? "" : 0 == c ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(u() + 1E3 * c)).toUTCString();
  this.yG(a + "=" + b + f + e + c + g)
};
d.get = function(a, b) {
  for(var c = a + "=", e = this.Wn(), f = 0, g;g = e[f];f++) {
    if(0 == g.lastIndexOf(c, 0)) {
      return g.substr(c.length)
    }
    if(g == a) {
      return""
    }
  }
  return b
};
d.remove = function(a, b, c) {
  var e = this.Aa(a);
  this.set(a, "", 0, b, c);
  return e
};
d.Ua = function() {
  return this.gk().keys
};
d.U = function() {
  return this.gk().Pu
};
d.nb = function() {
  return!this.Yn()
};
d.K = function() {
  return this.Yn() ? this.Wn().length : 0
};
d.Aa = function(a) {
  return p(this.get(a))
};
d.Of = function(a) {
  for(var b = this.gk().Pu, c = 0;c < b.length;c++) {
    if(b[c] == a) {
      return!0
    }
  }
  return!1
};
d.clear = function() {
  for(var a = this.gk().keys, b = a.length - 1;0 <= b;b--) {
    this.remove(a[b])
  }
};
d.yG = function(a) {
  this.Qd.cookie = a
};
d.Yn = function() {
  return this.Qd.cookie
};
d.Wn = function() {
  return(this.Yn() || "").split(sh)
};
d.gk = function() {
  for(var a = this.Wn(), b = [], c = [], e, f, g = 0;f = a[g];g++) {
    e = f.indexOf("="), -1 == e ? (b.push(""), c.push(f)) : (b.push(f.substring(0, e)), c.push(f.substring(e + 1)))
  }
  return{keys:b, Pu:c}
};
var th = new rh(document);
th.OH = 3950;
var uh = null;
var vh = function(a, b, c, e, f) {
  a = new U(a);
  var g = a.zc();
  if("client-channel.google.com" == g) {
    var k;
    if(!uh) {
      try {
        k = !!h.chrome.loadTimes().wasFetchedViaSpdy
      }catch(l) {
        k = !1
      }
      k ? uh = "0" : (k = parseInt(th.get("llbcs", "-1"), 10), isNaN(k) && (k = -1), k = ((k + 1) % 30).toString(), th.set("llbcs", k, -1, "/", void 0, !1), uh = k)
    }
    (k = uh) && a.Bf(k + "." + g)
  }
  this.Ag = a;
  this.ii = e || null;
  this.St = b;
  this.Tt = f || null;
  this.zE = c
};
d = vh.prototype;
d.Fu = function() {
  return this.Ag.toString()
};
d.Oe = function() {
  return this.St
};
d.Se = function() {
  return this.ii
};
d.lp = function() {
  return this.zE
};
d.dl = function() {
  return this.Tt
};
d.Gu = function() {
  var a = this.St, b = this.Tt, c = new wh;
  c.WF(a);
  null != b && c.XF(b);
  return c
};
d.nC = function(a) {
  var b = new rh(document), c = window.__OVERRIDE_SID;
  null == c && (c = b.get("SID"));
  if(c) {
    var e = 0 == a.indexOf("https:") || 0 == a.indexOf("chrome-extension:"), c = e ? window.__SAPISID : window.__APISID;
    null == c && (c = b.get(e ? "SAPISID" : "APISID"));
    c ? (b = e ? "SAPISIDHASH" : "APISIDHASH", e = new sf, e.reset(), e.update([c, a].join(" ")), a = mf(e.Hm()), a = {scheme:b, hash:a.toLowerCase()}) : a = null
  }else {
    a = null
  }
  return a
};
var xh = function(a, b) {
  this.lF = new If(a);
  this.Gc = b ? Hf : Gf
};
xh.prototype.stringify = function(a) {
  return this.lF.Nd(a)
};
xh.prototype.parse = function(a) {
  return this.Gc(a)
};
var yh = function(a, b, c, e, f) {
  this.g = a;
  this.h = b;
  this.Cc = c;
  this.vb = e;
  this.fg = f || 1;
  this.Le = 45E3;
  this.B = new R(this);
  this.$i = new Me;
  this.$i.setInterval(250)
};
d = yh.prototype;
d.wb = null;
d.Ub = !1;
d.Af = null;
d.Cm = null;
d.Ci = null;
d.Zg = null;
d.ac = null;
d.xb = null;
d.qf = null;
d.va = null;
d.Qg = 0;
d.Xb = null;
d.df = null;
d.Ia = null;
d.Fa = -1;
d.Jq = !0;
d.me = !1;
d.of = 0;
d.Pi = null;
var zh = function(a, b) {
  switch(a) {
    case 0:
      return"Non-200 return code (" + b + ")";
    case 1:
      return"XMLHTTP failure (no data)";
    case 2:
      return"HttpConnection timeout";
    default:
      return"Unknown error"
  }
}, Ah = {}, Bh = {};
d = yh.prototype;
d.bc = function(a) {
  this.wb = a
};
d.setTimeout = function(a) {
  this.Le = a
};
d.wr = function(a) {
  this.of = a
};
d.vr = function(a, b, c) {
  this.Zg = 1;
  this.ac = a.clone().tf();
  this.qf = b;
  this.Pp = c;
  this.Pt(null)
};
d.Sl = function(a, b, c, e) {
  this.Zg = 1;
  this.ac = a.clone().tf();
  this.qf = null;
  this.Pp = b;
  e && (this.Jq = !1);
  this.Pt(c)
};
d.Pt = function(a) {
  this.Ci = u();
  this.Te();
  this.xb = this.ac.clone();
  this.xb.wi("t", this.fg);
  this.Qg = 0;
  this.va = this.g.dm(this.g.Ri() ? a : null);
  0 < this.of && (this.Pi = new Ue(t(this.Kq, this, this.va), this.of));
  this.B.listen(this.va, "readystatechange", this.wz);
  a = this.wb ? Gb(this.wb) : {};
  this.qf ? (this.df = "POST", a["Content-Type"] = "application/x-www-form-urlencoded", this.va.send(this.xb, this.df, this.qf, a)) : (this.df = "GET", this.Jq && !G && (a.Connection = "close"), this.va.send(this.xb, this.df, null, a));
  this.g.Rb(1);
  this.h.xz(this.df, this.xb, this.vb, this.fg, this.qf)
};
d.wz = function(a) {
  a = a.target;
  var b = this.Pi;
  b && 3 == a.Yc() ? (this.h.debug("Throttling readystatechange."), b.Ms()) : this.Kq(a)
};
d.Kq = function(a) {
  try {
    a == this.va ? this.sA() : this.h.e("Called back with an unexpected xmlhttp")
  }catch(b) {
    this.h.debug("Failed call to OnXmlHttpReadyStateChanged_"), this.va && this.va.Ob() ? this.h.pd(b, "ResponseText: " + this.va.Ob()) : this.h.pd(b, "No response text")
  }finally {
  }
};
d.sA = function() {
  var a = this.va.Yc(), b = this.va.Jh(), c = this.va.ua();
  if(F && !(F && 10 <= uc) || G && !sc("420+")) {
    if(4 > a) {
      return
    }
  }else {
    if(3 > a || 3 == a && !dc && !this.va.Ob()) {
      return
    }
  }
  this.me || 4 != a || 7 == b || (8 == b || 0 >= c ? this.g.Rb(3) : this.g.Rb(2));
  this.si();
  this.Fa = b = this.va.ua();
  (c = this.va.Ob()) || this.h.debug("No response text for uri " + this.xb + " status " + b);
  this.Ub = 200 == b;
  this.h.Ox(this.df, this.xb, this.vb, this.fg, a, b);
  this.Ub ? (4 == a && this.sc(), this.Pp ? (this.dq(a, c), dc && this.Ub && 3 == a && this.Nx()) : (this.h.Hg(this.vb, c, null), this.xl(c)), this.Ub && !this.me && (4 == a ? this.g.Di(this) : (this.Ub = !1, this.Te()))) : (400 == b && 0 < c.indexOf("Unknown SID") ? (this.Ia = 3, W(13), this.h.e("XMLHTTP Unknown SID (" + this.vb + ")")) : (this.Ia = 0, W(14), this.h.e("XMLHTTP Bad status " + b + " (" + this.vb + ")")), this.sc(), this.li())
};
d.dq = function(a, b) {
  for(var c = !0;!this.me && this.Qg < b.length;) {
    var e = this.RA(b);
    if(e == Bh) {
      4 == a && (this.Ia = 4, W(15), c = !1);
      this.h.Hg(this.vb, null, "[Incomplete Response]");
      break
    }else {
      if(e == Ah) {
        this.Ia = 4;
        W(16);
        this.h.Hg(this.vb, b, "[Invalid Chunk]");
        c = !1;
        break
      }else {
        this.h.Hg(this.vb, e, null), this.xl(e)
      }
    }
  }
  4 == a && 0 == b.length && (this.Ia = 1, W(17), c = !1);
  this.Ub = this.Ub && c;
  c || (this.h.Hg(this.vb, b, "[Invalid Chunked Response]"), this.sc(), this.li())
};
d.RD = function() {
  var a = this.va.Yc(), b = this.va.Ob();
  this.Qg < b.length && (this.si(), this.dq(a, b), this.Ub && 4 != a && this.Te())
};
d.Nx = function() {
  this.B.listen(this.$i, "tick", this.RD);
  this.$i.start()
};
d.RA = function(a) {
  var b = this.Qg, c = a.indexOf("\n", b);
  if(-1 == c) {
    return Bh
  }
  b = Number(a.substring(b, c));
  if(isNaN(b)) {
    return Ah
  }
  c += 1;
  if(c + b > a.length) {
    return Bh
  }
  a = a.substr(c, b);
  this.Qg = c + b;
  return a
};
d.Pq = function(a, b) {
  this.Zg = 3;
  this.ac = a.clone().tf();
  this.WE(b)
};
d.WE = function(a) {
  this.Ci = u();
  this.Te();
  var b = a ? window.location.hostname : "";
  this.xb = this.ac.clone();
  this.xb.ba("DOMAIN", b);
  this.xb.ba("t", this.fg);
  try {
    this.Xb = new ActiveXObject("htmlfile")
  }catch(c) {
    this.h.t("ActiveX blocked");
    this.sc();
    this.Ia = 7;
    W(22);
    this.li();
    return
  }
  var e = "<html><body>";
  a && (e += '<script>document.domain="' + b + '"\x3c/script>');
  e += "</body></html>";
  this.Xb.open();
  this.Xb.write(e);
  this.Xb.close();
  this.Xb.parentWindow.m = t(this.yz, this);
  this.Xb.parentWindow.d = t(this.Oq, this, !0);
  this.Xb.parentWindow.rpcClose = t(this.Oq, this, !1);
  a = this.Xb.createElement("div");
  this.Xb.parentWindow.document.body.appendChild(a);
  a.innerHTML = '<iframe src="' + this.xb + '"></iframe>';
  this.h.zz("GET", this.xb, this.vb, this.fg);
  this.g.Rb(1)
};
d.yz = function(a) {
  Ch(t(this.gH, this, a), 0)
};
d.gH = function(a) {
  this.me || (this.h.CB(this.vb, a), this.si(), this.xl(a), this.Te())
};
d.Oq = function(a) {
  Ch(t(this.fH, this, a), 0)
};
d.fH = function(a) {
  this.me || (this.h.nA(this.vb, a), this.sc(), this.Ub = a, this.g.Di(this), this.g.Rb(4))
};
d.wA = function(a) {
  this.Zg = 2;
  this.ac = a.clone().tf();
  this.VE()
};
d.VE = function() {
  (new Image).src = this.ac;
  this.Ci = u();
  this.Te()
};
d.cancel = function() {
  this.me = !0;
  this.sc()
};
d.Te = function() {
  this.Cm = u() + this.Le;
  this.Ar(this.Le)
};
d.Ar = function(a) {
  if(null != this.Af) {
    throw Error("WatchDog timer not null");
  }
  this.Af = Ch(t(this.qG, this), a)
};
d.si = function() {
  this.Af && (h.clearTimeout(this.Af), this.Af = null)
};
d.qG = function() {
  this.Af = null;
  var a = u();
  0 <= a - this.Cm ? this.AA() : (this.h.e("WatchDog timer called too early"), this.Ar(this.Cm - a))
};
d.AA = function() {
  this.Ub && this.h.t("Received watchdog timeout even though request loaded successfully");
  this.h.Pz(this.xb);
  2 != this.Zg && this.g.Rb(3);
  this.sc();
  this.Ia = 2;
  W(18);
  this.li()
};
d.li = function() {
  this.g.Fs() || this.me || this.g.Di(this)
};
d.sc = function() {
  this.si();
  Pd(this.Pi);
  this.Pi = null;
  this.$i.stop();
  this.B.removeAll();
  if(this.va) {
    var a = this.va;
    this.va = null;
    a.abort();
    a.V()
  }
  this.Xb && (this.Xb = null)
};
d.Aq = function() {
  return this.Ub
};
d.Fe = function() {
  return this.Ia
};
d.Fc = function() {
  return this.Fa
};
d.Qe = function() {
  return this.Cc
};
d.uA = function() {
  return this.vb
};
d.Xl = function() {
  return this.qf
};
d.Yl = function() {
  return this.Ci
};
d.xl = function(a) {
  try {
    this.g.Hr(this, a), this.g.Rb(4)
  }catch(b) {
    this.h.pd(b, "Error in httprequest callback")
  }
};
var Dh = function() {
  this.a = T.td("goog.net.BrowserChannel")
};
d = Dh.prototype;
d.td = function() {
  return this.a
};
d.xz = function(a, b, c, e, f) {
  this.info("XMLHTTP REQ (" + c + ") [attempt " + e + "]: " + a + "\n" + b + "\n" + this.dH(f))
};
d.Ox = function(a, b, c, e, f, g) {
  this.info("XMLHTTP RESP (" + c + ") [ attempt " + e + "]: " + a + "\n" + b + "\n" + f + " " + g)
};
d.Hg = function(a, b, c) {
  this.info("XMLHTTP TEXT (" + a + "): " + this.fv(b) + (c ? " " + c : ""))
};
d.zz = function(a, b, c, e) {
  this.info("TRIDENT REQ (" + c + ") [ attempt " + e + "]: " + a + "\n" + b)
};
d.CB = function(a, b) {
  this.info("TRIDENT TEXT (" + a + "): " + this.fv(b))
};
d.nA = function(a, b) {
  this.info("TRIDENT TEXT (" + a + "): " + b ? "success" : "failure")
};
d.Pz = function(a) {
  this.info("TIMEOUT: " + a)
};
d.debug = function(a) {
  this.info(a)
};
d.pd = function(a, b) {
  this.t((b || "Exception") + a)
};
Dh.prototype.info = function(a) {
  T.info(this.a, a)
};
d = Dh.prototype;
d.e = function(a) {
  T.e(this.a, a)
};
d.t = function(a) {
  T.error(this.a, a)
};
d.fv = function(a) {
  if(!a || "y2f%" == a) {
    return a
  }
  try {
    var b = Hf(a);
    if(b) {
      for(var c = 0;c < b.length;c++) {
        q(b[c]) && this.cH(b[c])
      }
    }
    return Jf(b)
  }catch(e) {
    return this.debug("Exception parsing expected JS array - probably was not JS"), a
  }
};
d.cH = function(a) {
  if(!(2 > a.length || (a = a[1], !q(a) || 1 > a.length))) {
    var b = a[0];
    if("noop" != b && "stop" != b) {
      for(b = 1;b < a.length;b++) {
        a[b] = ""
      }
    }
  }
};
d.dH = function(a) {
  if(!a) {
    return null
  }
  var b = "";
  a = a.split("&");
  for(var c = 0;c < a.length;c++) {
    var e = a[c].split("=");
    if(1 < e.length) {
      var f = e[0], e = e[1], g = f.split("_"), b = 2 <= g.length && "type" == g[1] ? b + (f + "=" + e + "&") : b + (f + "=redacted&")
    }
  }
  return b
};
var Fh = function(a, b, c, e, f) {
  (new Dh).debug("TestLoadImageWithRetries: " + f);
  if(0 == e) {
    c(!1)
  }else {
    var g = f || 0;
    e--;
    Eh(a, b, function(f) {
      f ? c(!0) : h.setTimeout(function() {
        Fh(a, b, c, e, g)
      }, g)
    })
  }
}, Eh = function(a, b, c) {
  var e = new Dh;
  e.debug("TestLoadImage: loading " + a);
  var f = new Image;
  f.onload = function() {
    try {
      e.debug("TestLoadImage: loaded"), Gh(f), c(!0)
    }catch(a) {
      e.pd(a)
    }
  };
  f.onerror = function() {
    try {
      e.debug("TestLoadImage: error"), Gh(f), c(!1)
    }catch(a) {
      e.pd(a)
    }
  };
  f.onabort = function() {
    try {
      e.debug("TestLoadImage: abort"), Gh(f), c(!1)
    }catch(a) {
      e.pd(a)
    }
  };
  f.ontimeout = function() {
    try {
      e.debug("TestLoadImage: timeout"), Gh(f), c(!1)
    }catch(a) {
      e.pd(a)
    }
  };
  h.setTimeout(function() {
    if(f.ontimeout) {
      f.ontimeout()
    }
  }, b);
  f.src = a
}, Gh = function(a) {
  a.onload = null;
  a.onerror = null;
  a.onabort = null;
  a.ontimeout = null
};
var Hh = function(a, b) {
  this.g = a;
  this.h = b;
  this.Gc = new xh(null, !0)
};
d = Hh.prototype;
d.wb = null;
d.kb = null;
d.Ti = !1;
d.Kg = null;
d.Qi = null;
d.bm = null;
d.jc = null;
d.k = null;
d.Fa = -1;
d.ic = null;
d.Sg = null;
d.bc = function(a) {
  this.wb = a
};
d.ns = function(a) {
  this.Gc = a
};
d.connect = function(a) {
  this.jc = a;
  a = this.g.Qq(this.jc);
  W(3);
  this.Kg = u();
  var b = this.g.Bz();
  null != b ? (this.ic = this.g.Eg(b[0]), (this.Sg = b[1]) ? (this.k = 1, this.Hq()) : (this.k = 2, this.Ul())) : (a.wi("MODE", "init"), this.kb = new yh(this, this.h, void 0, void 0, void 0), this.kb.bc(this.wb), this.kb.Sl(a, !1, null, !0), this.k = 0)
};
d.Hq = function() {
  var a = this.g.Bm(this.Sg, "/mail/images/cleardot.gif");
  a.tf();
  Fh(a.toString(), 5E3, t(this.BB, this), 3, 2E3);
  this.Rb(1)
};
d.BB = function(a) {
  a ? (this.k = 2, this.Ul()) : (W(4), this.g.PA(this));
  a && this.Rb(2)
};
d.Ul = function() {
  this.h.debug("TestConnection: starting stage 2");
  var a = this.g.Uz();
  null != a ? (this.h.debug("TestConnection: skipping stage 2, precomputed result is " + a ? "Buffered" : "Unbuffered"), W(5), a ? (W(11), this.g.Ug(this, !1)) : (W(12), this.g.Ug(this, !0))) : (this.kb = new yh(this, this.h, void 0, void 0, void 0), this.kb.bc(this.wb), a = this.g.zq(this.ic, this.jc), W(5), !F || F && 10 <= uc ? (a.wi("TYPE", "xmlhttp"), this.kb.Sl(a, !1, this.ic, !1)) : (a.wi("TYPE", "html"), this.kb.Pq(a, Boolean(this.ic))))
};
d.dm = function(a) {
  return this.g.dm(a)
};
d.abort = function() {
  this.kb && (this.kb.cancel(), this.kb = null);
  this.Fa = -1
};
d.Fs = function() {
  return!1
};
d.Hr = function(a, b) {
  this.Fa = a.Fc();
  if(0 == this.k) {
    if(this.h.debug("TestConnection: Got data for stage 1"), b) {
      try {
        var c = this.Gc.parse(b)
      }catch(e) {
        this.h.pd(e);
        this.g.cm(this, 4);
        return
      }
      this.ic = this.g.Eg(c[0]);
      this.Sg = c[1]
    }else {
      this.h.debug("TestConnection: Null responseText"), this.g.cm(this, 4)
    }
  }else {
    2 == this.k && (this.Ti ? (W(7), this.bm = u()) : "11111" == b ? (W(6), this.Ti = !0, this.Qi = u(), this.Az() && (this.Fa = 200, this.kb.cancel(), this.h.debug("Test connection succeeded; using streaming connection"), W(12), this.g.Ug(this, !0))) : (W(8), this.Qi = this.bm = u(), this.Ti = !1))
  }
};
d.Di = function() {
  this.Fa = this.kb.Fc();
  if(!this.kb.Aq()) {
    this.h.debug("TestConnection: request failed, in state " + this.k), 0 == this.k ? W(9) : 2 == this.k && W(10), this.g.cm(this, this.kb.Fe())
  }else {
    if(0 == this.k) {
      this.h.debug("TestConnection: request complete for initial check"), this.Sg ? (this.k = 1, this.Hq()) : (this.k = 2, this.Ul())
    }else {
      if(2 == this.k) {
        this.h.debug("TestConnection: request complete for stage 2");
        var a = !1;
        (a = !F || F && 10 <= uc ? this.Ti : 200 > this.bm - this.Qi ? !1 : !0) ? (this.h.debug("Test connection succeeded; using streaming connection"), W(12), this.g.Ug(this, !0)) : (this.h.debug("Test connection failed; not using streaming"), W(11), this.g.Ug(this, !1))
      }
    }
  }
};
d.Fc = function() {
  return this.Fa
};
d.Ri = function() {
  return this.g.Ri()
};
d.lc = function() {
  return this.g.lc()
};
d.Az = function() {
  var a = this.Qi - this.Kg;
  return!F || F && 10 <= uc || 500 > a
};
d.Rb = function(a) {
  this.g.Rb(a)
};
var Ih = function(a, b, c) {
  this.er = a || null;
  this.k = 1;
  this.mb = [];
  this.Jc = [];
  this.h = new Dh;
  this.Gc = new xh(null, !0);
  this.BA = b || null;
  this.CA = null != c ? c : null
}, Jh = function(a, b) {
  this.ku = a;
  this.map = b
};
d = Ih.prototype;
d.wb = null;
d.mh = null;
d.yb = null;
d.wa = null;
d.jc = null;
d.Yi = null;
d.Iq = null;
d.ic = null;
d.ID = !0;
d.$g = 0;
d.tA = 0;
d.JG = !1;
d.C = null;
d.xd = null;
d.Mc = null;
d.Ae = null;
d.Cd = null;
d.pm = null;
d.DB = !0;
d.Ji = -1;
d.Hs = -1;
d.Fa = -1;
d.pf = 0;
d.sf = 0;
d.Ts = 5E3;
d.Us = 1E4;
d.KG = 2;
d.yr = 2E4;
d.of = 0;
d.Zn = !1;
d.kf = 8;
var Kh = new Q, Lh = function(a, b) {
  O.call(this, "statevent", a);
  this.stat = b
};
v(Lh, O);
var Mh = function(a, b) {
  O.call(this, "timingevent", a);
  this.size = b
};
v(Mh, O);
var Nh = function(a) {
  O.call(this, "serverreachability", a)
};
v(Nh, O);
d = Ih.prototype;
d.connect = function(a, b, c, e, f) {
  this.h.debug("connect()");
  W(0);
  this.jc = b;
  this.mh = c || {};
  e && p(f) && (this.mh.OSID = e, this.mh.OAID = f);
  this.kC(a)
};
d.disconnect = function() {
  this.h.debug("disconnect()");
  this.jr();
  if(3 == this.k) {
    var a = this.$g++, b = this.Yi.clone();
    b.ba("SID", this.Cc);
    b.ba("RID", a);
    b.ba("TYPE", "terminate");
    this.Wg(b);
    (new yh(this, this.h, this.Cc, a, void 0)).wA(b)
  }
  this.Vh()
};
d.Qe = function() {
  return this.Cc
};
d.kC = function(a) {
  this.h.debug("connectTest_()");
  this.Zl() && (this.Cd = new Hh(this, this.h), this.Cd.bc(this.wb), this.Cd.ns(this.Gc), this.Cd.connect(a))
};
d.EB = function() {
  this.h.debug("connectChannel_()");
  this.ZB(1, 0);
  this.Yi = this.Qq(this.jc);
  this.am()
};
d.jr = function() {
  this.Cd && (this.Cd.abort(), this.Cd = null);
  this.wa && (this.wa.cancel(), this.wa = null);
  this.Mc && (h.clearTimeout(this.Mc), this.Mc = null);
  this.Ni();
  this.yb && (this.yb.cancel(), this.yb = null);
  this.xd && (h.clearTimeout(this.xd), this.xd = null)
};
d.bc = function(a) {
  this.wb = a
};
d.wr = function(a) {
  this.of = a
};
d.mx = function(a) {
  this.C = a
};
d.oG = function() {
  return!this.pm
};
d.Bi = function(a, b) {
  if(0 == this.k) {
    throw Error("Invalid operation: sending map when state is closed");
  }
  1E3 == this.mb.length && this.h.t("Already have 1000 queued maps upon queueing " + Jf(a));
  this.mb.push(new Jh(this.tA++, a, b));
  2 != this.k && 3 != this.k || this.am()
};
d.iA = function() {
  return this.JG ? 0 : this.KG
};
d.JA = function() {
  return 3
};
d.Fs = function() {
  return 0 == this.k
};
d.T = function() {
  return this.k
};
d.Fc = function() {
  return this.Fa
};
d.ns = function(a) {
  this.Gc = a
};
d.am = function() {
  this.yb || this.xd || (this.xd = Ch(t(this.sr, this), 0), this.pf = 0)
};
d.Rz = function(a) {
  if(this.yb || this.xd) {
    return this.h.t("Request already in progress"), !1
  }
  if(1 == this.k || this.pf >= this.iA()) {
    return!1
  }
  this.h.debug("Going to retry POST");
  this.xd = Ch(t(this.sr, this, a), this.cr(this.pf));
  this.pf++;
  return!0
};
d.sr = function(a) {
  this.xd = null;
  this.eG(a)
};
d.eG = function(a) {
  this.h.debug("startForwardChannel_");
  this.Zl() && (1 == this.k ? a ? this.h.t("Not supposed to retry the open") : (this.mA(), this.k = 2) : 3 == this.k && (a ? this.ur(a) : 0 == this.mb.length ? this.h.debug("startForwardChannel_ returned: nothing to send") : this.yb ? this.h.t("startForwardChannel_ returned: connection already in progress") : (this.ur(), this.h.debug("startForwardChannel_ finished, sent request"))))
};
d.mA = function() {
  this.h.debug("open_()");
  this.$g = Math.floor(1E5 * Math.random());
  var a = this.$g++, b = new yh(this, this.h, "", a, void 0);
  b.bc(this.wb);
  var c = this.vm(), e = this.Yi.clone();
  e.ba("RID", a);
  this.er && e.ba("CVER", this.er);
  this.Wg(e);
  b.vr(e, c, !0);
  this.yb = b
};
d.ur = function(a) {
  var b;
  a ? 6 < this.kf ? (this.vA(), b = this.$g - 1, a = this.vm()) : (b = a.uA(), a = a.Xl()) : (b = this.$g++, a = this.vm());
  var c = this.Yi.clone();
  c.ba("SID", this.Cc);
  c.ba("RID", b);
  c.ba("AID", this.Ji);
  this.Wg(c);
  b = new yh(this, this.h, this.Cc, b, this.pf + 1);
  b.bc(this.wb);
  b.setTimeout(Math.round(0.5 * this.yr) + Math.round(0.5 * this.yr * Math.random()));
  this.yb = b;
  b.vr(c, a, !0)
};
d.Wg = function(a) {
  if(this.C) {
    var b = this.C.WC(this);
    b && Ob(b, function(b, e) {
      a.ba(e, b)
    })
  }
};
d.vm = function() {
  var a = Math.min(this.mb.length, 1E3), b = ["count=" + a], c;
  6 < this.kf && 0 < a ? (c = this.mb[0].ku, b.push("ofs=" + c)) : c = 0;
  for(var e = 0;e < a;e++) {
    var f = this.mb[e].ku, g = this.mb[e].map, f = 6 >= this.kf ? e : f - c;
    try {
      Ob(g, function(a, c) {
        b.push("req" + f + "_" + c + "=" + encodeURIComponent(a))
      })
    }catch(k) {
      b.push("req" + f + "_type=" + encodeURIComponent("_badmap"))
    }
  }
  this.Jc = this.Jc.concat(this.mb.splice(0, a));
  return b.join("&")
};
d.vA = function() {
  this.mb = this.Jc.concat(this.mb);
  this.Jc.length = 0
};
d.Fq = function() {
  this.wa || this.Mc || (this.Vq = 1, this.Mc = Ch(t(this.Nr, this), 0), this.sf = 0)
};
d.Wl = function() {
  if(this.wa || this.Mc) {
    return this.h.t("Request already in progress"), !1
  }
  if(this.sf >= this.JA()) {
    return!1
  }
  this.h.debug("Going to retry GET");
  this.Vq++;
  this.Mc = Ch(t(this.Nr, this), this.cr(this.sf));
  this.sf++;
  return!0
};
d.Nr = function() {
  this.Mc = null;
  this.YF()
};
d.YF = function() {
  if(this.Zl()) {
    this.h.debug("Creating new HttpRequest");
    this.wa = new yh(this, this.h, this.Cc, "rpc", this.Vq);
    this.wa.bc(this.wb);
    this.wa.wr(this.of);
    var a = this.Iq.clone();
    a.ba("RID", "rpc");
    a.ba("SID", this.Cc);
    a.ba("CI", this.pm ? "0" : "1");
    a.ba("AID", this.Ji);
    this.Wg(a);
    !F || F && 10 <= uc ? (a.ba("TYPE", "xmlhttp"), this.wa.Sl(a, !0, this.ic, !1)) : (a.ba("TYPE", "html"), this.wa.Pq(a, Boolean(this.ic)));
    this.h.debug("New Request created")
  }
};
d.Zl = function() {
  if(this.C) {
    var a = this.C.dB(this);
    if(0 != a) {
      return this.h.debug("Handler returned error code from okToMakeRequest"), this.Hb(a), !1
    }
  }
  return!0
};
d.Ug = function(a, b) {
  this.h.debug("Test Connection Finished");
  this.pm = this.DB && b;
  this.Fa = a.Fc();
  this.EB()
};
d.cm = function(a) {
  this.h.debug("Test Connection Failed");
  this.Fa = a.Fc();
  this.Hb(2)
};
d.PA = function() {
  this.h.debug("Test Connection Blocked");
  this.Fa = this.Cd.Fc();
  this.Hb(9)
};
d.Hr = function(a, b) {
  if(0 != this.k && (this.wa == a || this.yb == a)) {
    if(this.Fa = a.Fc(), this.yb == a && 3 == this.k) {
      if(7 < this.kf) {
        var c;
        try {
          c = this.Gc.parse(b)
        }catch(e) {
          c = null
        }
        q(c) && 3 == c.length ? this.Vz(c) : (this.h.debug("Bad POST response data returned"), this.Hb(11))
      }else {
        "y2f%" != b && (this.h.debug("Bad data returned - missing/invald magic cookie"), this.Hb(11))
      }
    }else {
      this.wa == a && this.Ni(), pa(b) || (c = this.Gc.parse(b), w(q(c)), this.Wz(c))
    }
  }
};
d.Vz = function(a) {
  if(0 == a[0]) {
    this.cC()
  }else {
    this.Hs = a[1];
    var b = this.Hs - this.Ji;
    0 < b && (a = a[2], this.h.debug(a + " bytes (in " + b + " arrays) are outstanding on the BackChannel"), this.eC(a) && !this.Ae && (this.Ae = Ch(t(this.dC, this), 6E3)))
  }
};
d.cC = function() {
  this.h.debug("Server claims our backchannel is missing.");
  if(this.Mc) {
    this.h.debug("But we are currently starting the request.")
  }else {
    if(this.wa) {
      if(this.wa.Yl() + 3E3 < this.yb.Yl()) {
        this.Ni(), this.wa.cancel(), this.wa = null
      }else {
        return
      }
    }else {
      this.h.e("We do not have a BackChannel established")
    }
    this.Wl();
    W(19)
  }
};
d.eC = function(a) {
  return 37500 > a && !this.oG() && 0 == this.sf
};
d.Eg = function(a) {
  return this.ID ? this.C ? this.C.Eg(a) : a : null
};
d.dC = function() {
  null != this.Ae && (this.Ae = null, this.wa.cancel(), this.wa = null, this.Wl(), W(20))
};
d.Ni = function() {
  null != this.Ae && (h.clearTimeout(this.Ae), this.Ae = null)
};
d.Di = function(a) {
  this.h.debug("Request complete");
  var b;
  if(this.wa == a) {
    this.Ni(), this.wa = null, b = 2
  }else {
    if(this.yb == a) {
      this.yb = null, b = 1
    }else {
      return
    }
  }
  this.Fa = a.Fc();
  if(0 != this.k) {
    if(a.Aq()) {
      1 == b ? (b = u() - a.Yl(), Kh.dispatchEvent(new Mh(Kh, a.Xl() ? a.Xl().length : 0, b, this.pf)), this.am(), this.pb(), this.Jc.length = 0) : this.Fq()
    }else {
      var c = a.Fe();
      if(3 == c || 7 == c || 0 == c && 0 < this.Fa) {
        this.h.debug("Not retrying due to error type")
      }else {
        this.h.debug("Maybe retrying, last error: " + zh(c, this.Fa));
        if(1 == b && this.Rz(a) || 2 == b && this.Wl()) {
          return
        }
        this.h.debug("Exceeded max number of retries")
      }
      this.h.debug("Error: HTTP request failed");
      switch(c) {
        case 1:
          this.Hb(5);
          break;
        case 4:
          this.Hb(10);
          break;
        case 3:
          this.Hb(6);
          break;
        case 7:
          this.Hb(12);
          break;
        default:
          this.Hb(2)
      }
    }
  }
};
d.cr = function(a) {
  var b = this.Ts + Math.floor(Math.random() * this.Us);
  this.lc() || (this.h.debug("Inactive channel"), b *= 2);
  return b * a
};
d.Gh = function(a, b) {
  this.Ts = a;
  this.Us = b
};
d.Wz = function(a) {
  for(var b = this.C && this.C.zm ? [] : null, c = 0;c < a.length;c++) {
    var e = a[c];
    this.Ji = e[0];
    e = e[1];
    2 == this.k ? "c" == e[0] ? (this.Cc = e[1], this.ic = this.Eg(e[2]), e = e[3], this.kf = null != e ? e : 6, this.k = 3, this.C && this.C.fe(this), this.Iq = this.zq(this.ic, this.jc), this.Fq()) : "stop" == e[0] && this.Hb(7) : 3 == this.k && ("stop" == e[0] ? (b && 0 != b.length && (this.C.zm(this, b), b.length = 0), this.Hb(7)) : "noop" != e[0] && (b ? b.push(e) : this.C && this.C.te(this, e)), this.sf = 0)
  }
  b && 0 != b.length && this.C.zm(this, b)
};
d.ZB = function(a) {
  if(!B(arguments, this.k)) {
    throw Error("Unexpected channel state: " + this.k);
  }
};
d.Hb = function(a) {
  this.h.info("Error code " + a);
  if(2 == a || 9 == a) {
    var b = null;
    this.C && (b = this.C.FA(this));
    var c = t(this.GA, this);
    b || (b = new U("//www.google.com/images/cleardot.gif"), b.tf());
    Eh(b.toString(), 1E4, c)
  }else {
    W(2)
  }
  this.r(a)
};
d.GA = function(a) {
  a ? (this.h.info("Successfully pinged google.com"), W(2)) : (this.h.info("Failed to ping google.com"), W(1), this.r(8))
};
d.pb = function() {
};
d.r = function(a) {
  this.h.debug("HttpChannel: error - " + a);
  this.k = 0;
  this.C && this.C.ue(this, a);
  this.Vh();
  this.jr()
};
d.Vh = function() {
  this.k = 0;
  this.Fa = -1;
  if(this.C) {
    if(0 == this.Jc.length && 0 == this.mb.length) {
      this.C.wd(this)
    }else {
      this.h.debug("Number of undelivered maps, pending: " + this.Jc.length + ", outgoing: " + this.mb.length);
      var a = qb(this.Jc), b = qb(this.mb);
      this.Jc.length = 0;
      this.mb.length = 0;
      this.C.wd(this, a, b)
    }
  }
};
d.Qq = function(a) {
  a = this.Bm(null, a);
  this.h.debug("GetForwardChannelUri: " + a);
  return a
};
d.Bz = function() {
  return this.BA
};
d.Uz = function() {
  return this.CA
};
d.zq = function(a, b) {
  var c = this.Bm(this.Ri() ? a : null, b);
  this.h.debug("GetBackChannelUri: " + c);
  return c
};
d.Bm = function(a, b, c) {
  var e = Uf(b);
  if("" != e.zc()) {
    a && e.Bf(a + "." + e.zc()), e.rj(c || e.Fm())
  }else {
    var f = window.location, e = Vf(f.protocol, null, a ? a + "." + f.hostname : f.hostname, c || f.port, b)
  }
  this.mh && Ob(this.mh, function(a, b) {
    e.ba(b, a)
  });
  e.ba("VER", this.kf);
  this.Wg(e);
  return e
};
d.dm = function(a) {
  if(a && !this.Zn) {
    throw Error("Can't create secondary domain capable XhrIo object.");
  }
  a = new Lg;
  a.DG(this.Zn);
  return a
};
d.lc = function() {
  return!!this.C && this.C.lc(this)
};
var Ch = function(a, b) {
  if(!ga(a)) {
    throw Error("Fn must not be null and must be a function");
  }
  return h.setTimeout(function() {
    a()
  }, b)
};
Ih.prototype.Rb = function(a) {
  Kh.dispatchEvent(new Nh(Kh, a))
};
var W = function(a) {
  Kh.dispatchEvent(new Lh(Kh, a))
};
Ih.prototype.Ri = function() {
  return this.Zn || !(!F || F && 10 <= uc)
};
var Oh = function() {
};
d = Oh.prototype;
d.zm = null;
d.dB = function() {
  return 0
};
d.fe = function() {
};
d.te = function() {
};
d.ue = function() {
};
d.wd = function() {
};
d.WC = function() {
  return{}
};
d.FA = function() {
  return null
};
d.lc = function() {
  return!0
};
d.Eg = function(a) {
  return a
};
var Ph = function() {
};
var Qh = function(a, b, c) {
  this.oD = a;
  this.Gf = b.name || null;
  this.mD = b.Na || null;
  this.dt = b.rH;
  this.$b = {};
  for(a = 0;a < c.length;a++) {
    b = c[a], this.$b[b.Ab()] = b
  }
};
d = Qh.prototype;
d.getName = function() {
  return this.Gf
};
d.Nm = function() {
  return this.mD
};
d.Hd = function() {
  return this.dt ? this.dt.na() : null
};
d.eh = function() {
  var a = Ab(this.$b);
  ub(a, function(a, c) {
    return a.Ab() - c.Ab()
  });
  return a
};
d.XC = function() {
  return this.$b
};
d.tm = function(a) {
  return Db(this.$b, function(b) {
    return b.getName() == a
  }) || null
};
d.ED = function(a) {
  w(!/[^0-9]/.test(a));
  return this.$b[parseInt(a, 10)] || null
};
d.Mt = function() {
  return new this.oD
};
var Rh = function(a, b, c) {
  this.ob = a;
  w(!/[^0-9]/.test(b));
  this.xC = b;
  this.Gf = c.name;
  this.vC = !!c.qH;
  this.Ij = c.v;
  this.Rm = c.type;
  this.Zs = !1;
  switch(this.Ij) {
    case 3:
    ;
    case 4:
    ;
    case 6:
    ;
    case 16:
    ;
    case 18:
      this.Zs = !0
  }
  this.an = c.defaultValue
};
d = Rh.prototype;
d.Ab = function() {
  return this.xC
};
d.Hd = function() {
  return this.ob.na()
};
d.getName = function() {
  return this.Gf
};
d.AD = function() {
  if(void 0 === this.an) {
    var a = this.Rm;
    this.an = a === Boolean ? !1 : a === Number ? 0 : a === String ? "" : new a
  }
  return this.an
};
d.nc = function() {
  return this.Ij
};
d.xh = function() {
  return this.Rm
};
d.LE = function() {
  return this.Zs
};
d.lt = function() {
  w(this.qh(), "Expected message or group");
  return this.Rm.na()
};
d.qh = function() {
  return 11 == this.Ij || 10 == this.Ij
};
d.Ib = function() {
  return this.vC
};
var X = function() {
  this.Bb = {};
  this.$b = this.na().XC();
  this.Za = this.ct = null
};
d = X.prototype;
d.HD = function(a, b) {
  w(!this.$b[a], "Field is not unknown in this message");
  w(1 <= a, "Tag is not valid");
  w(null !== b, "Value cannot be null");
  this.Bb[a] = b;
  this.Za && delete this.Za[a]
};
d.Js = function(a, b) {
  var c = b || this, e;
  for(e in this.Bb) {
    var f = Number(e);
    this.$b[f] || a.call(c, f, this.Bb[e])
  }
};
d.na = function() {
  var a = this.constructor, b;
  if(!(b = a.qu)) {
    var c;
    b = a.TE;
    var e = [], f;
    for(f in b) {
      b.hasOwnProperty(f) && (w(!/[^0-9]/.test(f), "Keys must be numeric"), 0 == f ? c = b[0] : e.push(new Rh(a, f, b[f])))
    }
    w(c);
    c = new Qh(a, c, e);
    b = a.qu = c
  }
  return b
};
d.Qc = function(a) {
  w(a.Hd() == this.na(), "The current message does not contain the given field");
  return this.$a(a.Ab())
};
d.fC = function(a) {
  w(a.Hd() == this.na(), "The current message does not contain the given field");
  return this.TD(a.Ab())
};
d.xm = function(a) {
  w(a.Hd() == this.na(), "The current message does not contain the given field");
  return this.VD(a.Ab())
};
d.get = function(a, b) {
  w(a.Hd() == this.na(), "The current message does not contain the given field");
  return this.$(a.Ab(), b)
};
d.set = function(a, b) {
  w(a.Hd() == this.na(), "The current message does not contain the given field");
  this.L(a.Ab(), b)
};
d.add = function(a, b) {
  w(a.Hd() == this.na(), "The current message does not contain the given field");
  this.SD(a.Ab(), b)
};
d.clear = function(a) {
  w(a.Hd() == this.na(), "The current message does not contain the given field");
  this.UD(a.Ab())
};
d.equals = function(a) {
  if(!a || this.constructor != a.constructor) {
    return!1
  }
  for(var b = this.na().eh(), c = 0;c < b.length;c++) {
    var e = b[c];
    if(this.Qc(e) != a.Qc(e)) {
      return!1
    }
    if(this.Qc(e)) {
      var f = e.qh(), g = this.Kf(e), k = a.Kf(e);
      if(e.Ib()) {
        if(g.length != k.length) {
          return!1
        }
        for(e = 0;e < g.length;e++) {
          if(f ? !g[e].equals(k[e]) : g[e] != k[e]) {
            return!1
          }
        }
      }else {
        if(f ? !g.equals(k) : g != k) {
          return!1
        }
      }
    }
  }
  return!0
};
d.WG = function(a) {
  w(this.constructor == a.constructor, "The source message must have the same type.");
  this != a && (this.Bb = {}, this.Za && (this.Za = {}), this.xs(a))
};
d.xs = function(a) {
  w(this.constructor == a.constructor, "The source message must have the same type.");
  for(var b = this.na().eh(), c = 0;c < b.length;c++) {
    var e = b[c];
    if(a.Qc(e)) {
      this.Za && delete this.Za[e.Ab()];
      var f = e.qh();
      if(e.Ib()) {
        for(var g = a.fC(e), k = 0;k < g.length;k++) {
          this.add(e, f ? g[k].clone() : g[k])
        }
      }else {
        g = a.Kf(e), f ? (f = this.Kf(e)) ? f.xs(g) : this.set(e, g.clone()) : this.set(e, g)
      }
    }
  }
};
d.clone = function() {
  var a = new this.constructor;
  a.WG(this);
  return a
};
d.Kd = function(a) {
  w(this.$b[a], "No field found for the given tag");
  return this.$b[a]
};
d.$a = function(a) {
  w(this.$b[a], "No field found for the given tag");
  return null != this.Bb[a]
};
d.Kf = function(a) {
  var b = a.Ab(), c = this.Bb[b];
  return null == c ? null : this.ct ? b in this.Za ? this.Za[b] : (a = this.ct.sH(this, a, c), this.Za[b] = a) : c
};
d.$ = function(a, b) {
  var c = this.Kd(a), e = this.Kf(c);
  if(c.Ib()) {
    return w(q(e)), c = b || 0, w(0 <= c && c < e.length, "Given index is out of bounds"), e[c]
  }
  w(!q(e));
  return e
};
d.hk = function(a, b) {
  return this.$a(a) ? this.$(a, b) : this.Kd(a).AD()
};
d.TD = function(a) {
  w(this.Kd(a).Ib(), "Cannot call fieldArray on a non-repeated field");
  a = this.Kd(a);
  a = this.Kf(a);
  w(null == a || q(a));
  return a || []
};
d.VD = function(a) {
  return this.Kd(a).Ib() ? (this.$a(a) && w(q(this.Bb[a])), this.$a(a) ? this.Bb[a].length : 0) : this.$a(a) ? 1 : 0
};
d.L = function(a, b) {
  var c = this.Kd(a);
  w(!c.Ib(), "Cannot call set on a repeated field");
  this.Dt(c, b);
  this.Bb[a] = b;
  this.Za && (this.Za[a] = b)
};
d.SD = function(a, b) {
  var c = this.Kd(a);
  w(c.Ib(), "Cannot call add on a non-repeated field");
  this.Dt(c, b);
  this.Bb[a] || (this.Bb[a] = []);
  this.Bb[a].push(b);
  this.Za && delete this.Za[a]
};
d.Dt = function(a, b) {
  14 == a.nc() ? Ta(b) : w(b.constructor == a.xh())
};
d.UD = function(a) {
  w(this.Kd(a), "Unknown field");
  delete this.Bb[a];
  this.Za && delete this.Za[a]
};
var Y = function(a, b) {
  a.TE = b;
  a.na = function() {
    return a.qu || (new a).na()
  }
};
var wh = function() {
  X.apply(this)
};
v(wh, X);
d = wh.prototype;
d.Se = function() {
  return this.$(1)
};
d.bu = function() {
  return this.hk(1)
};
d.fl = function(a) {
  this.L(1, a)
};
d.ei = function() {
  return this.$a(1)
};
d.Oe = function() {
  return this.$(2)
};
d.WF = function(a) {
  this.L(2, a)
};
d.Dx = function() {
  return this.hk(3)
};
d.Ex = function(a) {
  this.L(3, a)
};
d.dl = function() {
  return this.$(4)
};
d.XF = function(a) {
  this.L(4, a)
};
d.lx = function() {
  return this.$a(4)
};
var Sh = function() {
  X.apply(this)
};
v(Sh, X);
d = Sh.prototype;
d.ws = function() {
  return this.$(1)
};
d.ex = function(a) {
  this.L(1, a)
};
d.zd = function() {
  return this.$(2)
};
d.ee = function(a) {
  this.L(2, a)
};
d.xc = function() {
  return this.$(3)
};
d.Gs = function(a) {
  this.L(3, a)
};
d.oE = function() {
  return this.$a(3)
};
d.Se = function() {
  return this.$(4)
};
d.bu = function() {
  return this.hk(4)
};
d.fl = function(a) {
  this.L(4, a)
};
d.ei = function() {
  return this.$a(4)
};
Y(wh, {0:{name:"BrowserChannelConfig", Na:"buzz.channel.proto.BrowserChannelConfig"}, 1:{name:"authuser", v:4, type:Number}, 2:{name:"client_type", v:9, type:String}, 3:{name:"init_delay_ms", v:5, type:Number}, 4:{name:"gaia_service_override", v:9, type:String}});
Y(Sh, {0:{name:"AuthenticationParameters", Na:"buzz.channel.proto.AuthenticationParameters"}, 1:{name:"origin", v:9, type:String}, 2:{name:"scheme", v:5, type:Number}, 3:{name:"token", v:9, type:String}, 4:{name:"authuser", v:13, type:Number}});
var Th = function() {
  X.apply(this)
};
v(Th, X);
Th.prototype.vl = function(a) {
  this.L(2, a)
};
var Uh = function() {
  X.apply(this)
};
v(Uh, X);
Uh.prototype.co = function(a) {
  this.L(1, a)
};
Uh.prototype.eo = function(a) {
  this.L(2, a)
};
var Vh = function() {
  X.apply(this)
};
v(Vh, X);
Vh.prototype.setVersion = function(a) {
  this.L(1, a)
};
var Wh = function() {
  X.apply(this)
};
v(Wh, X);
Wh.prototype.setVersion = function(a) {
  this.L(1, a)
};
Wh.prototype.BG = function(a) {
  this.L(2, a)
};
Wh.prototype.AG = function(a) {
  this.L(3, a)
};
Wh.prototype.xG = function(a) {
  this.L(4, a)
};
var Xh = function() {
  X.apply(this)
};
v(Xh, X);
Xh.prototype.oi = function() {
  return this.$(1)
};
Xh.prototype.PG = function(a) {
  this.L(1, a)
};
Xh.prototype.Vk = function() {
  return this.$(2)
};
Xh.prototype.QG = function(a) {
  this.L(2, a)
};
var Yh = function() {
  X.apply(this)
};
v(Yh, X);
d = Yh.prototype;
d.getHeader = function() {
  return this.$(1)
};
d.Tp = function(a) {
  this.L(1, a)
};
d.ux = function(a) {
  this.L(2, a)
};
d.vx = function(a) {
  this.L(3, a)
};
d.rx = function(a) {
  this.L(4, a)
};
var Zh = function() {
  X.apply(this)
};
v(Zh, X);
d = Zh.prototype;
d.Up = function(a) {
  this.L(1, a)
};
d.tx = function(a) {
  this.L(2, a)
};
d.sx = function(a) {
  this.L(3, a)
};
d.wx = function(a) {
  this.L(4, a)
};
d.vl = function(a) {
  this.L(5, a)
};
var $h = function() {
  X.apply(this)
};
v($h, X);
var ai = function() {
  X.apply(this)
};
v(ai, X);
ai.prototype.Qe = function() {
  return this.$(1)
};
ai.prototype.Sj = function(a) {
  this.L(1, a)
};
var bi = function() {
  X.apply(this)
};
v(bi, X);
bi.prototype.Qe = function() {
  return this.$(1)
};
bi.prototype.Sj = function(a) {
  this.L(1, a)
};
bi.prototype.getMessage = function() {
  return this.$(2)
};
bi.prototype.It = function(a) {
  this.L(2, a)
};
var ci = function() {
  X.apply(this)
};
v(ci, X);
d = ci.prototype;
d.Qe = function() {
  return this.$(1)
};
d.Sj = function(a) {
  this.L(1, a)
};
d.np = function() {
  return this.$(2)
};
d.dw = function() {
  return this.hk(3)
};
d.ua = function() {
  return this.$(4)
};
d.op = function() {
  return this.$a(4)
};
var di = function() {
  X.apply(this)
};
v(di, X);
d = di.prototype;
d.getHeader = function() {
  return this.$(1)
};
d.Tp = function(a) {
  this.L(1, a)
};
d.Ew = function() {
  return this.$(2)
};
d.Kw = function() {
  return this.$a(2)
};
d.Dw = function() {
  return this.$(3)
};
d.Jw = function() {
  return this.$a(3)
};
d.Gw = function() {
  return this.$(4)
};
d.Lw = function() {
  return this.$a(4)
};
var ei = function() {
  X.apply(this)
};
v(ei, X);
ei.prototype.Up = function(a) {
  this.L(1, a)
};
ei.prototype.Fw = function() {
  return this.$(4)
};
ei.prototype.vl = function(a) {
  this.L(5, a)
};
var fi = function() {
  X.apply(this)
};
v(fi, X);
fi.prototype.Uo = function() {
  return this.$(1)
};
fi.prototype.bg = function() {
  return this.$(2)
};
fi.prototype.$f = function(a) {
  this.L(2, a)
};
var gi = function() {
  X.apply(this)
};
v(gi, X);
gi.prototype.ua = function() {
  return this.$(1)
};
gi.prototype.op = function() {
  return this.$a(1)
};
gi.prototype.yw = function() {
  return this.$(2)
};
gi.prototype.zw = function() {
  return this.$a(2)
};
Y(Th, {0:{name:"LcsMessage", Na:"buzz.channel.LcsMessage"}, 1:{name:"session", v:9, type:String}, 2:{name:"message_id", v:9, type:String}, 3:{name:"data", v:9, type:String}});
Y(Uh, {0:{name:"Version", Na:"buzz.channel.Version"}, 1:{name:"major_version", v:5, type:Number}, 2:{name:"minor_version", v:5, type:Number}});
Y(Vh, {0:{name:"ProtocolVersion", Na:"buzz.channel.ProtocolVersion"}, 1:{name:"version", v:11, type:Uh}});
Y(Wh, {0:{name:"ClientVersion", Na:"buzz.channel.ClientVersion"}, 1:{name:"version", v:11, type:Uh}, 2:{name:"platform", v:9, type:String}, 3:{name:"language", v:9, type:String}, 4:{name:"application_info", v:9, type:String}});
Y(Xh, {0:{name:"SessionId", Na:"buzz.channel.SessionId"}, 1:{name:"service_name", v:9, type:String}, 2:{name:"session_name", v:9, type:String}});
Y(Yh, {0:{name:"ClientToServerMessage", Na:"buzz.channel.ClientToServerMessage"}, 1:{name:"header", v:11, type:Zh}, 2:{name:"init_endpoint_message", v:11, type:$h}, 3:{name:"init_session_message", v:11, type:ai}, 4:{name:"client_data_message", v:11, type:bi}, 5:{name:"send_on_disconnect_message", v:11, type:bi}});
Y(Zh, {0:{name:"ClientHeader", Na:"buzz.channel.ClientHeader"}, 1:{name:"protocol_version", v:11, type:Vh}, 2:{name:"client_version", v:11, type:Wh}, 3:{name:"client_time_ms", v:3, type:Number}, 4:{name:"max_known_server_time_ms", v:3, type:Number}, 5:{name:"message_id", v:9, type:String}});
Y($h, {0:{name:"InitEndpointMessage", Na:"buzz.channel.InitEndpointMessage"}});
Y(ai, {0:{name:"InitSessionMessage", Na:"buzz.channel.InitSessionMessage"}, 1:{name:"session_id", v:11, type:Xh}});
Y(bi, {0:{name:"DataMessage", Na:"buzz.channel.DataMessage"}, 1:{name:"session_id", v:11, type:Xh}, 2:{name:"message", v:9, type:String}});
Y(ci, {0:{name:"SessionStatusMessage", Na:"buzz.channel.SessionStatusMessage"}, 1:{name:"session_id", v:11, type:Xh}, 2:{name:"address", v:9, type:String}, 3:{name:"is_broadcast_to_user", v:8, type:Boolean}, 4:{name:"status", v:11, type:fi}});
Y(di, {0:{name:"ServerToClientMessage", Na:"buzz.channel.ServerToClientMessage"}, 1:{name:"header", v:11, type:ei}, 2:{name:"server_data_message", v:11, type:bi}, 3:{name:"channel_status_message", v:11, type:gi}, 4:{name:"session_status_message", v:11, type:ci}});
Y(ei, {0:{name:"ServerHeader", Na:"buzz.channel.ServerHeader"}, 1:{name:"protocol_version", v:11, type:Vh}, 4:{name:"server_time_ms", v:3, type:Number}, 5:{name:"message_id", v:9, type:String}});
Y(fi, {0:{name:"StatusP", Na:"buzz.channel.StatusP"}, 1:{name:"code", v:5, type:Number}, 2:{name:"description", v:9, type:String}});
Y(gi, {0:{name:"ChannelStatusMessage", Na:"buzz.channel.ChannelStatusMessage"}, 1:{name:"status", v:11, type:fi}, 2:{name:"jid_resource", v:9, type:String}});
var ii = function(a, b) {
  var c = Array.prototype.slice.call(arguments), e = c.shift();
  if("undefined" == typeof e) {
    throw Error("[goog.string.format] Template required");
  }
  return e.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, e, l, r, A, C, L) {
    if("%" == A) {
      return"%"
    }
    var J = c.shift();
    if("undefined" == typeof J) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = J;
    return hi[A].apply(null, arguments)
  })
}, hi = {s:function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + Array(c - a.length + 1).join(" ") : Array(c - a.length + 1).join(" ") + a
}, f:function(a, b, c, e, f) {
  e = a.toString();
  isNaN(f) || "" == f || (e = a.toFixed(f));
  var g;
  g = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (e = g + e);
  if(isNaN(c) || e.length >= c) {
    return e
  }
  e = isNaN(f) ? Math.abs(a).toString() : Math.abs(a).toFixed(f);
  a = c - e.length - g.length;
  return e = 0 <= b.indexOf("-", 0) ? g + e + Array(a + 1).join(" ") : g + Array(a + 1).join(0 <= b.indexOf("0", 0) ? "0" : " ") + e
}, d:function(a, b, c, e, f, g, k, l) {
  return hi.f(parseInt(a, 10), b, c, e, 0, g, k, l)
}};
hi.i = hi.d;
hi.u = hi.d;
var ji = function(a) {
  this.a = H(a)
};
ji.prototype.log = function(a, b, c) {
  this.bH(arguments)
};
ji.prototype.t = function(a, b) {
  this.ik(Ec, arguments)
};
ji.prototype.e = function(a, b) {
  this.ik(Fc, arguments)
};
ji.prototype.info = function(a, b) {
  this.ik(Gc, arguments)
};
d = ji.prototype;
d.w = function(a, b) {
  this.ik(Ic, arguments)
};
d.mf = function(a) {
  return this.a.mf(a)
};
d.tc = function(a) {
  this.a.tc(a)
};
d.bH = function(a) {
  if(this.a.mf(a[0])) {
    var b = Array.prototype.slice.call(a);
    a = b.shift();
    b = ii.apply(null, b);
    this.a.log(a, b)
  }
};
d.ik = function(a, b) {
  if(this.a.mf(a)) {
    var c = ii.apply(null, b);
    this.a.log(a, c)
  }
};
var ki = function() {
};
ki.prototype.ht = function(a, b) {
  return a.qh() ? this.Nd(b) : b
};
ki.prototype.Hp = function(a, b) {
  var c = a.Mt();
  this.Vu(c, b);
  w(c instanceof X);
  return c
};
ki.prototype.Kt = function(a, b) {
  if(a.qh()) {
    return b instanceof X ? b : this.Hp(a.lt(), b)
  }
  if(14 == a.nc() || !a.LE()) {
    return b
  }
  var c = a.xh();
  if(c === String) {
    if(fa(b)) {
      return String(b)
    }
  }else {
    if(c === Number && s(b) && /^-?[0-9]+$/.test(b)) {
      return Number(b)
    }
  }
  return b
};
var li = function(a) {
  this.Vs = a
};
v(li, ki);
li.prototype.Nd = function(a) {
  for(var b = a.na().eh(), c = {}, e = 0;e < b.length;e++) {
    var f = b[e], g = 1 == this.Vs ? f.getName() : f.Ab();
    if(a.Qc(f)) {
      if(f.Ib()) {
        var k = [];
        c[g] = k;
        for(g = 0;g < a.xm(f);g++) {
          k.push(this.ht(f, a.get(f, g)))
        }
      }else {
        c[g] = this.ht(f, a.get(f))
      }
    }
  }
  a.Js(function(a, b) {
    c[a] = b
  });
  return c
};
li.prototype.Vu = function(a, b) {
  var c = a.na(), e;
  for(e in b) {
    var f, g = b[e], k = !/[^0-9]/.test(e);
    k ? f = c.ED(e) : (w(1 == this.Vs), f = c.tm(e));
    if(f) {
      if(f.Ib()) {
        for(w(q(g)), k = 0;k < g.length;k++) {
          a.add(f, this.Kt(f, g[k]))
        }
      }else {
        w(!q(g)), a.set(f, this.Kt(f, g))
      }
    }else {
      k ? a.HD(Number(e), g) : w(f)
    }
  }
};
var mi = function(a) {
  this.wj = !!a
};
v(mi, ki);
d = mi.prototype;
d.Vu = function(a, b) {
  a.na();
  var c = new ni;
  return c.parse(a, b.toString(), this.wj) ? null : c.getError()
};
d.Nd = function(a) {
  var b = new oi;
  this.ln(a, b);
  return b.toString()
};
d.ln = function(a, b) {
  var c = a.na().eh();
  y(c, function(c) {
    this.FD(a, c, b)
  }, this);
  a.Js(function(a, c) {
    if(c) {
      b.append(a);
      "object" == n(c) ? (b.append(" {"), b.Kj(), b.gt()) : b.append(": ");
      switch(n(c)) {
        case "string":
          c = Ea(c);
          b.append(c);
          break;
        case "object":
          this.ln(c, b);
          break;
        default:
          b.append(c.toString())
      }
      "object" == n(c) ? (b.ft(), b.append("}")) : b.Kj()
    }
  }, this)
};
d.uE = function(a, b, c) {
  switch(b.nc()) {
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
      a = Ea(a.toString());
      c.append(a);
      break;
    case 14:
      var e = !1;
      zb(b.xh(), function(b, g) {
        b == a && (c.append(g), e = !0)
      });
      e || c.append(a.toString());
      break;
    case 10:
    ;
    case 11:
      this.ln(a, c)
  }
};
d.FD = function(a, b, c) {
  if(a.Qc(b)) {
    for(var e = a.xm(b), f = 0;f < e;++f) {
      c.append(b.getName());
      11 == b.nc() || 10 == b.nc() ? (c.append(" {"), c.Kj(), c.gt()) : c.append(": ");
      this.uE(a.get(b, f), b, c);
      if(11 == b.nc() || 10 == b.nc()) {
        c.ft(), c.append("}")
      }
      c.Kj()
    }
  }
};
var oi = function() {
  this.Sf = 0;
  this.Od = [];
  this.On = !0
};
d = oi.prototype;
d.toString = function() {
  return this.Od.join("")
};
d.gt = function() {
  this.Sf += 2
};
d.ft = function() {
  this.Sf -= 2;
  w(0 <= this.Sf)
};
d.append = function(a) {
  if(this.On) {
    for(var b = 0;b < this.Sf;++b) {
      this.Od.push(" ")
    }
    this.On = !1
  }
  this.Od.push(a.toString())
};
d.Kj = function() {
  this.Od.push("\n");
  this.On = !0
};
var qi = function(a, b) {
  this.bF = !!b;
  this.dF = a;
  this.Ah = 0;
  this.Nn = a;
  this.Fn = {type:pi, value:null}
};
qi.prototype.getCurrent = function() {
  return this.Fn
};
var pi = /---end---/, ri = /^-?[a-zA-Z][a-zA-Z0-9_]*/, si = /^(0x[0-9a-f]+)|(([-])?[0-9][0-9]*(\.?[0-9]+)?([f])?)/, ti = /^"([^"\\]|\\.)*"/, ui = /^\s/, vi = {IH:pi, KH:ri, QH:si, HH:/^#.*/, RH:/^{/, AH:/^}/, TH:/^</, CH:/^>/, SH:/^\[/, BH:/^\]/, WH:ti, FH:/^:/, GH:/^,/, VH:/^;/, YH:ui};
qi.prototype.next = function() {
  for(;this.pG();) {
    if(this.getCurrent().type != ui || !this.bF) {
      return!0
    }
  }
  this.Fn = {type:pi, value:null};
  return!1
};
qi.prototype.pG = function() {
  if(this.Ah >= this.dF.length) {
    return!1
  }
  var a = this.Nn, b = null;
  zb(vi, function(c) {
    if(!b && c != pi) {
      var e = c.exec(a);
      e && 0 == e.index && (b = {type:c, value:e[0]})
    }
  });
  b && (this.Fn = b, this.Ah += b.value.length, this.Nn = this.Nn.substring(b.value.length));
  return!!b
};
var ni = function() {
  this.Vc = this.Ta = null;
  this.wj = !1
};
d = ni.prototype;
d.parse = function(a, b, c) {
  this.Ta = null;
  this.wj = !!c;
  this.Vc = new qi(b, !0);
  this.Vc.next();
  return this.Mj(a, "")
};
d.getError = function() {
  return this.Ta
};
d.eb = function(a) {
  this.Ta = a
};
d.Mj = function(a, b) {
  for(;!this.An(">") && !this.An("}") && !this.Nj(pi);) {
    if(!this.KE(a)) {
      return!1
    }
  }
  if(b) {
    if(!this.rh(b)) {
      return!1
    }
  }else {
    this.Nj(pi) || this.eb("Expected END token")
  }
  return!0
};
d.Es = function(a, b) {
  var c = this.IF(b);
  if(null === c) {
    return!1
  }
  b.Ib() ? a.add(b, c) : a.set(b, c);
  return!0
};
var wi = function(a) {
  -1 != a.indexOf(".") ? a = parseFloat(a) : (isFinite(a) && (a = String(a)), a = s(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN);
  w(!isNaN(a));
  w(isFinite(a));
  return a
};
d = ni.prototype;
d.IF = function(a) {
  switch(a.nc()) {
    case 1:
    ;
    case 2:
      if(a = this.Aj()) {
        if(a = /^-?inf(?:inity)?f?$/i.test(a) ? Infinity * (0 == a.lastIndexOf("-", 0) ? -1 : 1) : /^nanf?$/i.test(a) ? NaN : null, null != a) {
          return a
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
      var b = this.xn();
      return b ? wi(b) : null;
    case 3:
    ;
    case 4:
    ;
    case 6:
    ;
    case 16:
    ;
    case 18:
      return(b = this.xn()) ? a.xh() == Number ? wi(b) : b : null;
    case 8:
      a = this.Aj();
      if(!a) {
        return null
      }
      switch(a) {
        case "true":
          return!0;
        case "false":
          return!1;
        default:
          return this.eb("Unknown type for bool: " + a), null
      }
    ;
    case 14:
      if(this.Nj(si)) {
        return this.xn()
      }
      b = this.Aj();
      if(!b) {
        return null
      }
      a = a.xh()[b];
      return null == a ? (this.eb("Unknown enum value: " + b), null) : a;
    case 12:
    ;
    case 9:
      return this.KD()
  }
};
d.aC = function(a, b) {
  var c = "";
  if(this.Mb("<")) {
    c = ">"
  }else {
    if(!this.rh("{")) {
      return!1
    }
    c = "}"
  }
  var e = b.lt().Mt();
  if(!this.Mj(e, c)) {
    return!1
  }
  b.Ib() ? a.add(b, e) : a.set(b, e);
  return!0
};
d.bC = function() {
  this.Mb(":");
  if(this.Mb("[")) {
    for(;;) {
      this.Vc.next();
      if(this.Mb("]")) {
        break
      }
      if(!this.rh(",")) {
        return!1
      }
    }
    return!0
  }
  if(this.Mb("<")) {
    return this.Mj(null, ">")
  }
  if(this.Mb("{")) {
    return this.Mj(null, "}")
  }
  this.Vc.next();
  return!0
};
d.KE = function(a) {
  var b = this.Aj();
  if(!b) {
    return this.eb("Missing field name"), !1
  }
  var c = null;
  a && (c = a.na().tm(b.toString()));
  if(null == c) {
    if(this.wj) {
      return this.bC()
    }
    this.eb("Unknown field: " + b);
    return!1
  }
  if(11 == c.nc() || 10 == c.nc()) {
    if(this.Mb(":"), !this.aC(a, c)) {
      return!1
    }
  }else {
    if(!this.rh(":")) {
      return!1
    }
    if(c.Ib() && this.Mb("[")) {
      for(;;) {
        if(!this.Es(a, c)) {
          return!1
        }
        if(this.Mb("]")) {
          break
        }
        if(!this.rh(",")) {
          return!1
        }
      }
    }else {
      if(!this.Es(a, c)) {
        return!1
      }
    }
  }
  this.Mb(",") || this.Mb(";");
  return!0
};
d.Mb = function(a) {
  return this.An(a) ? (this.Vc.next(), !0) : !1
};
d.ao = function(a) {
  if(!this.Nj(a)) {
    return this.eb("Expected token type: " + a), null
  }
  a = this.Vc.getCurrent().value;
  this.Vc.next();
  return a
};
d.Aj = function() {
  return this.ao(ri)
};
d.xn = function() {
  return this.ao(si)
};
d.KD = function() {
  var a = this.ao(ti);
  return a ? Gf(a).toString() : null
};
d.rh = function(a) {
  return this.Mb(a) ? !0 : (this.eb('Expected token "' + a + '"'), !1)
};
d.An = function(a) {
  return this.Vc.getCurrent().value == a
};
d.Nj = function(a) {
  return this.Vc.getCurrent().type == a
};
var xi = new li, yi = new mi, zi = function(a) {
  a = xi.Nd(a);
  return Jf(a)
};
try {
  var Ai = window.JSON.parse
}catch(Bi) {
  Ai = Gf
}
X.prototype.toString = function() {
  return yi.Nd(this)
};
var Ci = function(a) {
  this.J = a
};
Ci.prototype.hd = function(a) {
  var b = a.na(), c = this.bB()[b.getName()];
  w(c, "no validator specification for %s", b.Nm());
  for(var e = b.eh(), f = 0;f < e.length;++f) {
    w(e[f].getName() in c, "field %s unspecified in %s", e[f].getName(), b.Nm())
  }
  for(var g in c) {
    var e = c[g], k = b.tm(g);
    w(k instanceof Rh, "no field descriptor for %s in %s", g, b.Nm());
    for(f = 0;f < e.length;++f) {
      if(!e[f](k, a)) {
        return!1
      }
      for(var l = 0;l < a.xm(k);++l) {
        var r = a.get(k, l);
        if(r instanceof X && !this.hd(r)) {
          return this.J.t("field %s (index %d) failed validation in %s", g, l, a), !1
        }
      }
    }
  }
  return!0
};
Ci.prototype.required = function(a, b) {
  var c = b.Qc(a);
  c || this.J.t("required field %s missing from %s", a.getName(), b);
  return c
};
Ci.prototype.iE = function(a, b, c) {
  var e = !c.Qc(b) || c.get(b) >= a;
  e || this.J.t("%s must be greater than or equal to %d; was %d", b.getName(), a, c.get(b));
  return e
};
Ci.prototype.jE = function(a, b) {
  var c = !b.Qc(a) || "" != b.get(a);
  c || this.J.t("%s must be non-empty", a.getName());
  return c
};
var Di = function(a) {
  this.J = a;
  a = function() {
    return!0
  };
  var b = t(this.required, this), c = t(this.iE, this, 0), e = t(this.jE, this);
  this.lE = {Version:{major_version:[b, c], minor_version:[b, c]}, ProtocolVersion:{version:[b]}, ClientVersion:{version:[b], platform:[b], language:[b, e], application_info:[b, e]}, ClientToServerMessage:{header:[b], init_endpoint_message:[a], init_session_message:[a], client_data_message:[a], send_on_disconnect_message:[a]}, ClientHeader:{protocol_version:[b], client_version:[b], client_time_ms:[b], max_known_server_time_ms:[b], message_id:[a]}, SessionId:{service_name:[b, e], session_name:[a]}, 
  InitEndpointMessage:{}, InitSessionMessage:{session_id:[b]}, SessionStatusMessage:{session_id:[b], address:[a, e], is_broadcast_to_user:[a], status:[a]}, DataMessage:{session_id:[b], message:[b, e]}, ServerToClientMessage:{header:[b], server_data_message:[a], channel_status_message:[a], session_status_message:[a]}, ServerHeader:{protocol_version:[b], server_time_ms:[b, c], message_id:[a, e]}, StatusP:{code:[b], description:[a]}, ChannelStatusMessage:{status:[b], jid_resource:[a]}}
};
v(Di, Ci);
Di.prototype.bB = function() {
  return this.lE
};
Di.prototype.qx = function(a) {
  return this.hd(a)
};
Di.prototype.Mw = function(a) {
  return this.hd(a) ? !0 : !1
};
var Ei = function() {
  var a;
  return Xb ? (a = /Windows NT ([0-9.]+)/, (a = a.exec(ac())) ? a[1] : "0") : Wb ? (a = /10[_.][0-9_.]+/, (a = a.exec(ac())) ? a[0].replace(/_/g, ".") : "10") : Zb ? (a = /Android\s+([^\);]+)(\)|;)/, (a = a.exec(ac())) ? a[1] : "") : $b || ic ? (a = /(?:iPhone|CPU)\s+OS\s+(\S+)/, (a = a.exec(ac())) ? a[1].replace(/_/g, ".") : "") : ""
}();
var Fi = new Vh, Gi = new Uh;
Gi.co(3);
Gi.eo(2);
Fi.setVersion(Gi);
var Hi = new Uh;
Hi.co(3);
Hi.eo(2);
var Ii = new Uh;
Ii.co(3);
Ii.eo(2);
var Ji = function(a, b, c) {
  var e = new Wh;
  e.setVersion(Ii);
  e.BG(a);
  e.AG(b);
  e.xG(c);
  return e
}, Ki = function(a, b) {
  var c = new Xh;
  c.PG(a);
  null != b && c.QG(b);
  return c
};
var Li = {APISIDHASH:1, SAPISIDHASH:2, OAuth:3}, Mi = {1:"APISIDHASH", 2:"SAPISIDHASH", 3:"OAuth"};
var Oi = function(a, b, c, e) {
  this.g = a;
  this.Ak = b;
  this.Oh = e;
  a = Math.floor(1048576 * Math.random());
  this.fd = c ? a + "_" + Ni++ : null;
  this.bf = !1
}, Ni = 0;
Oi.prototype.open = function() {
  w(!this.bf);
  this.bf = !0;
  this.g.bp(this)
};
Oi.prototype.send = function(a) {
  w(this.bf);
  this.g.tC(this, a)
};
Oi.prototype.cw = function(a) {
  w(null == this.fd);
  this.fd = a
};
var Pi = function(a, b, c) {
  this.cg = b;
  w(16 >= this.cg.Oe().length);
  this.Xh = [];
  this.ag = new E;
  this.zk = new E;
  this.Dc = c || "lcsclient";
  this.ha = null;
  this.a = new ji("HangingGetChannel");
  this.Jo = new Di(this.a);
  this.Kk = a;
  this.bf = !1;
  this.da = new Sh;
  this.da.ex(ue(self.location.href));
  this.da.ee(2);
  a = b.Se();
  null != a && this.da.fl(a);
  this.bw = this.Gk = 0;
  this.wg = !1
};
d = Pi.prototype;
d.Qp = function(a) {
  this.da.ee(3);
  this.da.Gs(a);
  this.Al()
};
d.open = function() {
  w(!this.wg);
  w(null == this.ha);
  this.da.ei() && this.da.Se();
  this.ha = this.cg.kq(this);
  this.Al();
  this.ha.start();
  this.a.info("Started a browser channel.")
};
d.close = function() {
  w(!this.wg);
  null != this.ha && this.ha.close()
};
d.V = function() {
  this.close();
  this.wg = !0
};
d.uf = function() {
  return this.wg
};
d.Al = function() {
  if(3 != this.da.zd()) {
    var a = this.cg.nC(this.da.ws());
    if(null != a) {
      var b = a.scheme, a = a.hash;
      a != this.da.xc() && (b = w(Li[b], "unknown auth scheme: " + b), this.da.ee(b), this.da.Gs(a))
    }
  }
  this.ha && this.ha.Vm(this.da)
};
d.fe = function() {
  this.sn(new $h)
};
d.Iw = function(a) {
  var b = a.ua().Uo();
  if(1 == b) {
    this.wp(!0);
    for(var b = this.ag.U(), c = 0;c < b.length;++c) {
      this.bp(b[c])
    }
    b = {};
    a.zw() && (b.nH = a.yw());
    this.Kk.Aw(this, b)
  }else {
    this.a.e("Received non-SUCCESS status %s from server", b)
  }
};
d.Hw = function(a) {
  var b = a.Qe(), c = b.Vk();
  if(null == c) {
    this.a.e("Ignoring session-ready message without a session name")
  }else {
    var e = this.Eo(b);
    if(null == e && this.cg.lp()) {
      for(var f = 0;f < this.Xh.length;++f) {
        var g = this.Xh[f], k = b.oi();
        if(g.Ak == k) {
          e = g;
          e.cw(c);
          this.Xh.splice(f, 1);
          a.dw() ? this.zk.Aa(k) ? this.a.e("Duplicate session for the same broadcast service (%s): this is not supported and will be ignored", k) : this.zk.set(k, e) : this.ag.set(e.fd, e);
          break
        }
      }
    }
    null == e ? this.a.e("Received address for unknown session: %s, %s", b, a.toString()) : a.op() && 1 != a.ua().Uo() ? (this.a.e("Failed to initialize session with service %s: %s", b.oi(), a.ua().bg()), e.Oh.fw ? e.Oh.fw(e, {mH:!1, description:a.ua().bg()}) : this.a.info("onSessionError() not implemented by handler")) : (this.a.info("Address %s assigned for session %s with service %s", a.np(), b.Vk(), b.oi()), e.Oh.ew(e, a.np()))
  }
};
d.te = function(a) {
  for(var b = 0;b < a.length;b++) {
    var c = a[b].p, e = this.Cw(c);
    if(null == e) {
      this.a.t("Cannot deserialize s2c message: %s", c)
    }else {
      if(this.a.w("Received server message: %s", e), this.Jo.Mw(e)) {
        if(c = e.getHeader(), this.Gk = Math.max(this.Gk, c.Fw()), e.Jw() && this.Iw(e.Dw()), e.Lw() && (c = e.Gw(), w(null != c), this.Hw(c)), e.Kw()) {
          var c = e.Ew(), f = c.Qe(), g = this.Eo(f);
          null == g ? this.a.info("Received message for unknown session: %s, %s", f, e) : g.Oh.Uk(g, c.getMessage())
        }
      }else {
        this.a.t("Received invalid server message: %s", e)
      }
    }
  }
};
d.ue = function(a) {
  this.a.info("Error %s", a);
  this.Al();
  this.Kk.onError(this, new Ph(a))
};
d.wd = function() {
  this.wp(!1);
  this.Kk.jG(this)
};
d.wp = function(a) {
  this.bf = a
};
d.bz = function(a, b) {
  w(!this.wg);
  w(this.bf);
  var c = this.cg.lp(), e = new Oi(this, a, !c, b);
  c ? this.Xh.push(e) : this.ag.set(e.fd, e);
  return e
};
d.Eo = function(a) {
  var b = this.ag.get(a.Vk(), null);
  null == b && (b = this.zk.get(a.oi(), null));
  return b
};
d.bp = function(a) {
  var b = a.Ak;
  a = a.fd;
  var c = new ai;
  c.Sj(Ki(b, a));
  this.sn(c)
};
d.tC = function(a, b) {
  w(null != a.fd);
  w(this.ag.Aa(a.fd));
  var c = a.Ak, e = a.fd, f = new bi;
  f.Sj(Ki(c, e));
  f.It(b);
  this.sn(f)
};
d.sn = function(a) {
  var b = "c" + ++this.bw, c = u(), e = this.Gk, f = new Zh;
  f.Up(Fi);
  f.sx(c);
  f.wx(e);
  f.vl(b);
  f.tx(Ji(Ei, "JS", "lcsclient"));
  b = new Yh;
  b.Tp(f);
  a instanceof $h ? b.ux(a) : a instanceof ai ? b.vx(a) : a instanceof bi && b.rx(a);
  this.Jo.qx(b) ? (a = {}, f = zi(b), a.p = f, this.ha.Bi(a)) : this.a.t("Attempted to send invalid client message: %s", b.toString())
};
d.Cw = function(a) {
  var b;
  t: {
    var c = di.na();
    b = this.a;
    var e;
    try {
      e = Ai(a)
    }catch(f) {
      b && b.info("Exception parsing json (%s): %s", a, f);
      b = null;
      break t
    }
    a = xi.Hp(c, e);
    null == a ? (b && b.e("Incoming msg is unparseable: %s", e), b = null) : b = a
  }
  return b
};
var Qi = function(a, b, c) {
  w(0 < c);
  w(0 < b);
  this.Mn = b;
  this.iF = c;
  this.jF = a;
  w(0 < this.Mn);
  this.reset()
};
Qi.prototype.reset = function() {
  this.Rf = this.Mn;
  this.zu = !1
};
Qi.prototype.zp = function() {
  var a = 0;
  if(this.zu) {
    var a = Math.ceil(this.jF() * this.Rf), b = this.Mn * this.iF;
    this.Rf <= b && (this.Rf *= 2, this.Rf > b && (this.Rf = b))
  }
  this.zu = !0;
  return a
};
var Ri = function(a, b, c) {
  this.sb = "1";
  this.ac = a;
  c.ei() && (this.ii = c.Se());
  w(null != c.Oe());
  this.hc = c;
  this.C = b;
  this.ce = this.k = 0;
  this.a = new ji("BrowserChannelImpl");
  this.Yh = new Qi(Math.random, 1E4, 180);
  this.da = new Sh
};
v(Ri, Oh);
d = Ri.prototype;
d.$e = function(a) {
  a != this.k && (this.k = a, this.ce++)
};
d.Vm = function(a) {
  this.da = a;
  this.ii && this.da.fl(this.ii);
  a = {};
  Si(this.da, {}, a);
  this.ha && this.ha.bc(a)
};
d.start = function() {
  w(0 == this.k);
  this.$e(1);
  this.open()
};
d.open = function() {
  if(1 != this.k) {
    this.a.info("Not opening since not closed (state = %s)", this.k)
  }else {
    this.$e(2);
    var a = this.Yh.zp() + this.hc.Dx();
    this.hc.Ex(0);
    var b = this.ce;
    S(function() {
      this.Cx(b)
    }, a, this)
  }
};
d.Cx = function(a) {
  w(this.hc.Oe());
  if(this.ce != a) {
    this.a.info("Not opening since state has changed (%s vs. %s)", a, this.ce)
  }else {
    w(null == this.ha);
    this.$e(3);
    a = this.ac + "/cbp";
    var b = this.ac + "/bind";
    this.ha = new Ih(this.sb);
    this.ha.mx(this);
    var c = {};
    c.ctype = this.hc.Oe();
    this.hc.lx() && (c.service = this.hc.dl());
    var e = {};
    Si(this.da, c, e);
    this.ha.bc(e);
    this.ha.connect(a, b, c)
  }
};
var Si = function(a, b, c) {
  a.ei() && (b.authuser = a.Se());
  if(a.oE()) {
    b = a.zd();
    var e = w(Mi[b], "Unknown auth scheme: " + b);
    c.Authorization = e + " " + a.xc();
    3 != b && (c["X-Origin"] = a.ws(), c["X-Goog-AuthUser"] = a.bu())
  }
};
d = Ri.prototype;
d.close = function() {
  this.$e(1);
  null != this.ha && this.ha.disconnect()
};
d.Bi = function(a) {
  null != this.ha && this.ha.Bi(a)
};
d.fe = function(a) {
  w(a == this.ha);
  this.$e(4);
  var b = this.ce;
  S(function() {
    this.ce != b ? this.a.info("Not resetting delay generator because state changed (%d vs. %d)", b, this.ce) : this.Yh.reset()
  }, 3E5, this);
  this.C.fe()
};
d.te = function(a, b) {
  w(a == this.ha);
  this.C.te(b)
};
d.ue = function(a, b) {
  w(a == this.ha);
  this.C.ue(b)
};
d.wd = function(a) {
  w(a == this.ha);
  a = this.k;
  this.$e(1);
  4 != a && 3 != a || this.open();
  this.ha = null;
  this.C.wd()
};
var Ti = function(a, b, c, e, f) {
  vh.call(this, a, b, c, e, f)
};
v(Ti, vh);
Ti.prototype.kq = function(a) {
  return new Ri(this.Fu(), a, this.Gu())
};
var Ui = function(a, b, c) {
  this.$C = a;
  this.Dc = b;
  this.VC = c;
  this.Yh = new Qi(Math.random, 5E3, 128);
  this.ib = null
};
Ui.prototype.rq = function() {
  this.ib = new Fg(this.$C);
  this.ib.gD(s(this.Dc) ? document.getElementById(this.Dc) : this.Dc);
  S(this.eD, this.Yh.zp() + 5E3, this);
  this.ib.connect(t(function() {
    w(this.ib.qa());
    this.VC(this.ib)
  }, this))
};
Ui.prototype.eD = function() {
  if(!this.ib.qa()) {
    this.ib.close();
    for(var a = Af(s(this.Dc) ? document.getElementById(this.Dc) : this.Dc), b = 0;b < a.length;++b) {
      zf(a[b])
    }
    this.rq()
  }
};
var Vi = function(a, b, c, e) {
  this.zg = a;
  this.Ax = b;
  this.hc = e;
  this.C = c;
  this.da = null
};
d = Vi.prototype;
d.wC = function() {
  return null != this.da && 3 == this.da.zd()
};
d.onConnect = function() {
  this.td().info("Cross-iframe rpc mechanism ready; opening browser channel");
  this.da && this.Vm(this.da);
  this.vn("s", [])
};
d.Ny = function() {
  var a = new U(this.zg), b = zi(this.hc);
  a.ba("cfg", b);
  a.ba("ctype", this.hc.Oe());
  (b = this.hc.dl()) && a.ba("service", b);
  this.wC() && a.ba("oauth_token", this.da.xc());
  return a.toString()
};
d.DF = function() {
  this.Nf("cha", t(this.te, this));
  this.Nf("co", t(this.fe, this));
  this.Nf("cc", t(this.wd, this));
  this.Nf("ce", t(this.ue, this))
};
d.close = function() {
};
d.Vm = function(a) {
  this.da = a;
  a = xi.Nd(this.da);
  this.vn("uap", a)
};
d.Bi = function(a) {
  this.vn("sm", a)
};
d.fe = function() {
  this.C.fe()
};
d.te = function(a) {
  this.C.te(a)
};
d.wd = function() {
  this.C.wd()
};
d.ue = function(a) {
  this.C.ue(a)
};
var Wi = function(a, b, c, e) {
  Vi.call(this, a, b, c, e);
  this.ib = null;
  this.a = new ji("XpcBrowserChannelClient")
};
v(Wi, Vi);
d = Wi.prototype;
d.Oy = function(a) {
  this.ib = a;
  this.DF();
  this.onConnect()
};
d.start = function() {
  w(!this.ib);
  this.a.info("Attempting to connect cross-page channel");
  var a = this.Ny(), b = {};
  b.pu = a;
  b.ppu = this.zg + "xpc_blank";
  b.lpu = this.zg + "xpc_blank";
  b.pru = this.zg + "xpc_relay";
  b.lru = this.zg + "xpc_relay";
  this.Py = new Ui(b, this.Ax, t(this.Oy, this));
  this.Py.rq()
};
d.Nf = function(a, b) {
  this.ib.Nf(a, b, !0)
};
d.vn = function(a, b) {
  this.ib && this.ib.qa() && this.ib.send(a, b || [])
};
d.td = function() {
  return this.a
};
var Yi = function(a, b, c, e, f, g) {
  vh.call(this, a, b, c, f, g);
  this.Dc = e
};
v(Yi, vh);
Yi.prototype.kq = function(a) {
  return new Wi(this.Fu(), this.Dc, a, this.Gu())
};
var Zi = function(a, b) {
  w(b instanceof vh);
  return new Pi(a, b)
};
var $i = function(a, b) {
  Ne.call(this);
  this.S = b;
  this.a = H("cv.CloudChannel");
  this.dc = a;
  this.hf = this.md = null;
  this.dc.ty(this.S, this)
};
v($i, Ne);
d = $i.prototype;
d.wrap = function() {
  return new Vg(this)
};
d.Vp = function() {
  if(this.hf) {
    return this.hf
  }
  var a = new K;
  !this.md || this.md.gB() ? (this.hf = a, this.dc.hB(this.S).Db(t(function(a) {
    a = a.Ea();
    this.Pk(a);
    a ? this.hf.la(null) : this.hf.cb();
    this.hf = null
  }, this))) : a.la(null);
  return a
};
d.Pk = function(a) {
  this.dc.qa() ? this.md && this.md.xc() == a.xc() || (a && (this.md = a), this.bb("connected")) : this.bb("disconnected")
};
d.pi = function() {
  this.dc.pE(this.S)
};
d.send = function(a) {
  "connected" == this.T() && this.md ? this.Vp().Db(t(function() {
    this.md ? this.dc.sendMessage(this.md.xc(), a) : this.a.info("Error getting token for send.")
  }, this)) : (this.a.info("Not sending message since disconnected or no reply token."), this.a.w("  the message is: " + a))
};
var aj = function(a, b, c, e, f) {
  this.a = H("cv.CloudLcsChannel");
  this.Je = a;
  this.gb = b;
  this.jg = c;
  this.yp = e;
  this.Po = f ? f : m;
  this.nd = null;
  this.kg = new E;
  this.g = null;
  this.ri = "";
  this.Cp = new Me(354E4);
  P(this.Cp, "tick", t(this.Ow, this))
};
d = aj.prototype;
d.Aw = function(a) {
  this.a.info("Channel opened.");
  this.ri || (this.a.info("Opening new session."), a.bz(this.gb.Ey, this).open())
};
d.jG = function() {
  this.a.info("Channel closed.");
  this.fq()
};
d.onError = function(a, b) {
  this.a.e("Channel error: " + b);
  this.fq()
};
d.Uk = function(a, b) {
  this.a.w("Received payload: " + b + ".");
  this.Gy(b)
};
d.ew = function(a, b) {
  this.ri = b;
  this.nd.la(null)
};
d.hB = function(a) {
  return this.jg.connect(a, this.ri)
};
d.ww = function(a) {
  if(null != this.nd) {
    return this.nd
  }
  this.nd = new K;
  var b = null, b = a ? new Yi(this.gb.Kp + "/client-channel/client/client-js", this.gb.Jp, !0, "lcsclient", void 0, void 0) : new Ti(this.gb.Kp + "/client-channel/channel", this.gb.Jp, !0, void 0, void 0);
  this.g = Zi(this, b);
  this.yp(t(function(a) {
    this.a.info("Opened browser channel.");
    this.g.Qp(a);
    this.Cp.start();
    this.g.open()
  }, this));
  return this.nd
};
d.xw = function(a, b) {
  var c = new $i(this, a);
  c.Vp();
  return b ? c : c.wrap()
};
d.ty = function(a, b) {
  this.kg.set(a, b)
};
d.pE = function(a) {
  this.kg.remove(a)
};
d.qa = function() {
  return!!this.nd && "success" == this.nd.T()
};
d.sendMessage = function(a, b) {
  if(this.Je) {
    if(a) {
      var c = {from:this.Je, body:b};
      this.a.w("Sending message: " + JSON.stringify(c));
      this.jg.Vx(a, this.gb.Jx, JSON.stringify(c))
    }else {
      this.a.info("Failed to send message due to channel token not set.")
    }
  }else {
    this.a.info("Dropping sent message for disabled channel")
  }
};
d.fq = function() {
  this.ri = "";
  this.nd = this.g = null;
  for(var a = this.kg.U(), b = 0;b < a.length;b++) {
    a[b].disconnect()
  }
  this.kg.clear()
};
d.Gy = function(a) {
  if(this.Je) {
    try {
      var b = JSON.parse(a), c = b.authToken, e = JSON.parse(b.message), f = e.from, g = this.kg.get(f);
      this.Po != m && (g ? c && g.Pk(new ph(c)) : (this.a.info("Creating new logical channel for receiver."), g = new $i(this, f), g.Pk(c ? new ph(c) : null), this.Po(g.wrap())));
      e.body && (this.a.w("Received message: " + JSON.stringify(e.body)), g.onMessage(e.body))
    }catch(k) {
      this.a.e("Error handling message: " + a)
    }
  }else {
    this.a.info("Dropping received message for disabled channel")
  }
};
d.Ow = function() {
  this.yp(t(function(a) {
    this.g.Qp(a)
  }, this))
};
var bj = function(a, b) {
  this.a = H("cv.CloudRegistry");
  this.yc = a;
  this.yg = b || new oh(this.yc)
};
d = bj.prototype;
d.qp = function(a, b) {
  return pa(a) ? Fa("devices", "/", b) : Fa("devices", "/", a, "/", b)
};
d.az = function(a) {
  Je(this.yg.el(), t(function(a) {
    return this.yc.Wk("devices", "GET", {}, null, a.Ea())
  }, this)).Db(t(this.qD, this, a))
};
d.qD = function(a, b) {
  var c = b.Ea(), e = c.response;
  if(200 != c.gd.ua() && 304 != c.gd.ua() || !e) {
    this.a.info("Failed to get cloud device list."), a([], !1)
  }else {
    var c = 0, e = e.resources, f = [];
    for(c in e) {
      var g, k = e[c], l = g = null, r = null, A = null, C = null;
      g = k.guid || null;
      var C = k.claimCode || null, L = k.properties;
      L && (l = L.manufacturer, r = L.model);
      (k = k.settings) && (A = k.displayName);
      g = new nd(g, l, r, A, C);
      g.By() ? f.push(g) : this.a.info("Invalid cloud device retrieved")
    }
    a(f, !0)
  }
};
d.connect = function(a, b) {
  var c = new K, e = {};
  b && (e.lcsInfo = {lcsAddress:b});
  Je(this.yg.el(), t(function(b) {
    return this.yc.Wk(this.qp(a, "connect"), "POST", e, null, b.Ea())
  }, this)).Db(t(function(a) {
    (a = a.Ea().response) && a.token && a.token.authToken && a.token.expirationSecs ? c.la(new ph(a.token.authToken, a.token.expirationSecs)) : c.la(null)
  }, this));
  return c
};
d.Vx = function(a, b, c) {
  var e = new K;
  if(!a) {
    return e.cb(), this.a.e("Send failed since device channel token was not set"), e
  }
  a = {authToken:a, message:c};
  var f = new Nf;
  f.set("key", b);
  this.yc.Wk(this.qp("", "send"), "POST", a, f).Db(t(function(a) {
    a = a.Ea().gd.ua();
    204 != a && 200 != a ? (this.a.e("Send of message (" + c + ") failed with status: " + a), e.cb()) : e.la(null)
  }, this));
  return e
};
var cj = function(a, b, c, e, f, g, k) {
  this.action = a;
  this.activityType = b;
  this.activityId = c;
  this.initParams = e;
  this.senderId = f;
  this.receiverId = g;
  this.disconnectPolicy = k || "stop"
};
if("undefined" != typeof angular) {
  var dj = angular.module("chrome_i18n", []);
  chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().default_locale && dj.directive("angularMessage", function() {
    return{restrict:"E", transclude:"element", replace:!0, compile:function(a, b) {
      var c = b.key, e = null, f = document.createElement("amr");
      c && !c.match(/^\d+$/) && (c = chrome.i18n.getMessage(c), null == c && f.setAttribute("id", "missing"));
      if(c) {
        var e = chrome.i18n.getMessage(c + "_ph"), g = [];
        null != e && (g = e.split("\ue000"));
        e = chrome.i18n.getMessage(c, g)
      }else {
        f.setAttribute("r", "nokey")
      }
      e ? f.innerHTML = e : (f.setAttribute("tl", "false"), f.innerHTML = a.html());
      a.replaceWith(f)
    }}
  })
}
;var ej = function() {
  this.a = H("cv.Retry");
  this.qq = this.Jg = 0;
  this.pq = 1;
  this.Ng = 0;
  this.Gl = void 0;
  this.Gi = this.pb = this.El = null;
  this.Hi = 0;
  this.Ii = !1;
  this.Hl = this.Og = null
};
v(ej, N);
d = ej.prototype;
d.start = function(a, b, c) {
  if(this.ou()) {
    throw Error("Cannot call Retry.start more than once.");
  }
  if(!this.Jg) {
    throw Error("Cannot use AsyncRetry without setting a nonzero retry delay.");
  }
  this.El = a;
  this.RE = b || null;
  this.Gi = c || null;
  S(t(this.At, this), 0)
};
d.At = function() {
  this.Og = null;
  if(this.Ng && this.Hi >= this.Ng) {
    this.abort(this.Gl)
  }else {
    if(!this.Ii) {
      this.Hl = new fj(this, this.Hi);
      this.Hi++;
      try {
        this.El(this.Hl)
      }finally {
        this.Ii || (this.Og = S(t(this.At, this), this.Jg)), this.LD()
      }
    }
  }
};
d.LD = function() {
  var a = this.Jg * this.pq;
  this.qq && (a = Math.min(a, this.qq));
  this.Jg = a
};
d.nk = function(a, b) {
  this.Ng = a;
  this.Gl = b;
  return this
};
d.Gh = function(a) {
  w(0 < a);
  this.Jg = a;
  return this
};
d.no = function(a) {
  w(1 <= a);
  this.pq = a;
  return this
};
d.zF = function(a) {
  if(!this.ou()) {
    throw Error("Not started yet.");
  }
  this.Lu(this.RE, a)
};
d.abort = function(a) {
  this.Lu(this.Gi, a)
};
d.yF = function(a) {
  a === this.Hl && this.Ng && (this.Hi < this.Ng || this.abort(this.Gl))
};
d.Lu = function(a, b) {
  null != this.Og && (h.clearTimeout(this.Og), this.Og = null);
  this.Ii || (this.Ii = !0, a && a(b))
};
d.j = function() {
  ej.q.j.call(this);
  this.abort()
};
d.ou = function() {
  return null != this.El
};
var fj = function(a, b) {
  this.Ah = b;
  this.Lf = a;
  this.Pf = !1
};
fj.prototype.Rd = function() {
  this.Pf || (this.Pf = !0, this.Lf.yF(this))
};
fj.prototype.jk = function(a) {
  this.Pf || (this.Pf = !0, this.Lf.zF(a))
};
fj.prototype.abort = function(a) {
  this.Pf || (this.Pf = !0, this.Lf.abort(a))
};
fj.prototype.Mk = function() {
  return this.Ah
};
var gj = function() {
  return null != ac() && -1 != ac().indexOf("CrOS")
};
var hj = function(a) {
  this.La = a || Ga()
};
hj.prototype.c = function() {
  return this.La
};
hj.prototype.Qh = function() {
};
var ij = function() {
  this.a = H("cv.Setup");
  this.Sa = !1
};
v(ij, N);
ij.prototype.D = function() {
  this.Sa ? this.a.info("Already been set up. Skipping.") : (this.pz(), this.Sa = !0)
};
var jj = function(a) {
  return function() {
    a.D();
    a.nE()
  }
};
var kj = function(a) {
  if("undefined" != typeof DOMParser) {
    return(new DOMParser).parseFromString(a, "application/xml")
  }
  if("undefined" != typeof ActiveXObject) {
    var b = new ActiveXObject("MSXML2.DOMDocument");
    if(b) {
      b.resolveExternals = !1;
      b.validateOnParse = !1;
      try {
        b.setProperty("ProhibitDTD", !0), b.setProperty("MaxXMLSize", 2048), b.setProperty("MaxElementDepth", 256)
      }catch(c) {
      }
    }
    b.loadXML(a);
    return b
  }
  throw Error("Your browser does not support loading xml documents");
};
var mj = function(a) {
  this.Ag = a;
  this.Gb = lj[1];
  this.a = H("cv.SetupApi");
  this.B = new R(this);
  this.oy()
};
v(mj, N);
var lj = ["3", "4"];
d = mj.prototype;
d.setVersion = function(a) {
  B(lj, a) ? this.Gb = a : this.a.t("Unsupported version: " + a)
};
d.lk = function(a) {
  this.Ag.Bf(a)
};
d.JC = function(a) {
  var b = this.Ag.clone();
  b.Cf(a);
  return b
};
d.uz = function(a, b) {
  if("scan_ssid" in a) {
    var c = a.scan_ssid;
    if(0 != c && 1 != c) {
      return this.a.t("connectWifi called with invalid scan_ssid = " + c.toString()), function() {
      }
    }
  }
  return this.qd("/setup/connect_wifi", "POST", b, a)
};
d.Fh = function(a, b, c) {
  if((b || c) && 0 < Ha("4", this.Gb)) {
    return this.a.t("eurekaInfo with optional parameters is not supportedon " + this.Gb), function() {
    }
  }
  var e = b && B(b, "sign"), f = [];
  if(b) {
    for(var g = ["sign", "detail"], k = 0;k < b.length;++k) {
      if(!B(g, b[k])) {
        return this.a.t("Invalid options value: " + b[k]), function() {
        }
      }
    }
    f.push("options=" + b.join(","))
  }
  c && f.push("nonce=" + c);
  return this.qd("/setup/eureka_info", "GET", a, null, 0 < f.length ? new Nf(f.join("&")) : null, e ? 4E4 : null, e ? 2 : null)
};
d.yx = function(a, b) {
  var c = ["now", "fdr", "ota", "idle"];
  0 >= Ha("4", this.Gb) && c.push("set recovery");
  return B(c, a) ? this.qd("/setup/reboot", "POST", b, {params:a}) : (this.a.t("Invalid params value: " + a), function() {
  })
};
d.TA = function(a) {
  return 0 < Ha("4", this.Gb) ? (this.a.t("saveWifi is not supported on version " + this.Gb), function() {
  }) : this.qd("/setup/save_wifi", "POST", a, void 0, void 0, 2E4, 2)
};
d.aw = function(a) {
  return this.qd("/setup/scan_results", "GET", a)
};
d.Rx = function(a) {
  return this.qd("/setup/scan_wifi", "POST", a, void 0, void 0, void 0, 1)
};
d.iw = function(a, b) {
  return this.qd("/setup/set_eureka_info", "POST", b, a)
};
d.Oz = function(a) {
  return this.qd("/setup/supported_timezones", "GET", a, null, null, 2E4, 2)
};
d.j = function() {
  zb(this.lj, function(a) {
    a.V()
  });
  this.B.V();
  mj.q.j.call(this)
};
d.oy = function() {
  this.lj = {};
  this.nG = 1
};
d.LG = function(a) {
  if(!this.lj[a]) {
    var b = new hh;
    b.Lj(a);
    this.lj[a] = b
  }
  return this.lj[a]
};
d.Ct = function(a, b, c, e, f, g, k) {
  var l = "" + this.nG++;
  k = k || 4;
  var r = this.LG(g || 1E4);
  r.send(l, a, b, c, e, void 0, f, k - 1);
  return t(function() {
    r.abort(l, !0)
  }, this)
};
d.qd = function(a, b, c, e, f, g, k) {
  var l = function(a) {
    var e = null;
    a.target.ga() && "GET" == b && (e = a.target.Ob(), e = JSON.parse(e));
    c(e, a.target)
  }, r = this.Ag.clone();
  r.Cf(a);
  f && r.kh(f);
  if("GET" == b) {
    return this.Ct(r.toString(), b, null, null, l, g, k)
  }
  if("POST" == b) {
    return this.Ct(r.toString(), b, JSON.stringify(e), {"Content-Type":"application/json"}, l, g, k)
  }
};
var nj = [[0xfa8fca300000, 0xfa8fca3fffff], [0xfa8fca500000, 0xfa8fca9fffff], [111971074048, 111971139583]], oj = ["Eureka Dongle", "Chromekey"], pj = function(a) {
  if(!(a && "WiFi" in a && "BSSID" in a.WiFi)) {
    return!1
  }
  var b = function(a) {
    a = a.replace(/:/g, "").toLowerCase();
    return 12 != a.length ? -1 : parseInt(a, 16)
  }(a.WiFi.BSSID);
  return!!z(nj, function(a) {
    return b >= a[0] && b <= a[1]
  })
}, qj = function(a) {
  return a && a.wpa_auth ? 1 != a.wpa_auth : !1
}, sj = function(a, b) {
  rj(a.deviceDescriptionUrl, "device_description", b)
}, tj = function(a) {
  var b = kj(a);
  if(!b) {
    return null
  }
  var c = b.querySelector("root > device > manufacturer");
  a = b.querySelector("root > device > modelName");
  if(!c || !a) {
    return null
  }
  c = Ef(c);
  a = Ef(a);
  a = "Google Inc." == c && B(oj, a);
  var e = b.querySelector("root > URLBase"), c = b.querySelector("root > device > friendlyName"), b = b.querySelector("root > device > UDN");
  if(!e || !c || !b) {
    return null
  }
  e = Ef(e);
  e = Uf(e).zc();
  c = Ef(c);
  b = Ef(b);
  return{name:c, ipAddress:e, udn:b, isChromecast:a}
}, uj = function(a, b, c) {
  rj(a + (na(a, "/") ? "ChromeCast" : "/ChromeCast"), "app_info", function(a) {
    (a = a.target) && a.ga() ? b() : c()
  })
}, rj = function(a, b, c) {
  b = new Lg;
  b.mt("text");
  b.Lj(7E3);
  ie(b, ["complete", "timeout"], c);
  b.send(new U(a), "GET")
};
var vj = function(a) {
  Q.call(this);
  this.Zc = a;
  this.a = H("cv.DongleDialMonitor");
  this.aa = !1;
  this.Tb = 0;
  this.lf = [];
  this.Fg = 0;
  this.hb = {};
  this.rl = []
};
v(vj, Q);
var wj = function(a) {
  O.call(this, "device-list-updated");
  this.Sq = a
};
v(wj, O);
d = vj.prototype;
d.start = function() {
  this.aa ? this.a.info("Already started.") : (this.aa = !0, this.aq = t(this.jd, this), this.Zc.onDeviceList.addListener(this.aq), this.rg = t(this.r, this), this.Zc.onError.addListener(this.rg), this.refresh())
};
d.stop = function() {
  this.aa ? (this.aa = !1, this.Zc.onDeviceList.removeListener(this.aq), this.Zc.onError.removeListener(this.rg)) : this.a.info("Stopping, but not started.")
};
d.j = function() {
  vj.q.j.call(this);
  this.stop();
  zb(this.hb, function(a) {
    a.od && clearTimeout(a.od)
  });
  this.hb = {}
};
d.refresh = function() {
  this.Zc.discoverNow(t(function(a) {
    this.a.info("Discover now called with result " + a)
  }, this))
};
d.ok = function(a) {
  var b = Cb(this.hb, function(b) {
    return!!b.description && b.description.udn == a && 0 == b.status
  });
  b && (nb(this.lf, this.hb[b].description), this.uq(b));
  this.rl.push(a)
};
d.r = function(a) {
  this.a.info("Encountered dial error: " + a.code);
  this.jd([])
};
d.jd = function(a) {
  this.Tb++;
  this.Fg = a.length;
  this.lf = [];
  this.a.info("Got new dial device list: generation: " + this.Tb + ", size: " + this.Fg);
  0 == a.length ? this.Dl() : y(a, function(a) {
    this.Rg(a, t(this.Pl, this), t(this.Fi, this))
  }, this);
  this.rl = []
};
d.Dl = function() {
  0 < this.Fg || (ub(this.lf, function(a, b) {
    return qa(a.name, b.name)
  }), this.a.info("Dispatch new device list generation: " + this.Tb + " with " + this.lf.length + " entries."), pe(this, new wj(this.lf)))
};
d.Pl = function(a, b, c) {
  var e = this.hb[b];
  !e || e.sl > a ? this.a.info("Description for " + b + " obsolete") : B(this.rl, c.udn) ? (this.a.info("Ignoring invalidated description for: " + b), this.Fi(a, b)) : (this.my(b), e.description = c, e.status = 0, e.Fl != this.Tb ? this.a.info("Cache entry refreshed, but the device is not part of the current generation.") : (this.a.info("Adding device to the list: " + b), --this.Fg, this.lf.push(c), this.Dl()))
};
d.Fi = function(a, b) {
  var c = this.hb[b];
  !c || c.sl > a ? this.a.info("Error for an obolete request for " + b) : (this.uq(b), c.Fl == this.Tb && (this.a.info("Removing device from the current generation " + b), --this.Fg, this.Dl()))
};
d.my = function(a) {
  var b = this.hb[a];
  b && (b.od && clearTimeout(b.od), b.od = setTimeout(t(this.XE, this, a), 18E5))
};
d.uq = function(a) {
  var b = this.hb[a];
  b && (b.od && clearTimeout(b.od), Fb(this.hb, a))
};
d.XE = function(a) {
  var b = this.hb[a];
  b && (b.od = null, 0 == b.status && (this.a.info("Discarding device's cache entry as it expired " + a), Fb(this.hb, a)))
};
d.Rg = function(a, b, c) {
  var e = this.vy(a);
  0 == e.status ? (w(e.description), b(this.Tb, a.deviceLabel, e.description)) : 1 != e.status && (e.status = 1, e.sl = this.Tb, e = t(function(e, g, k) {
    var l = g = null;
    (k = k.target) && k.ga() && (g = tj(k.Ob()), l = k.getResponseHeader("Application-URL") || null);
    g && l ? (this.a.info("Got device description, verifying it supports ChromeCast"), uj(l, t(b, null, e, a.deviceLabel, g), t(c, null, e, a.deviceLabel))) : (this.a.info("Failed to get description or app url. Description: " + !!g + "; app url: " + !!l), c(e, a.deviceLabel))
  }, this), sj(a, t(e, null, this.Tb, a.deviceLabel)))
};
d.vy = function(a) {
  this.hb[a.deviceLabel] || (this.hb[a.deviceLabel] = {status:2, configId:a.configId, sl:this.Tb, Fl:this.Tb, od:null, description:null});
  var b = this.hb[a.deviceLabel];
  b.Fl = this.Tb;
  a.configId && b.configId == a.configId || (b.configId = a.configId, b.status = 2);
  return b
};
var xj = function(a) {
  Q.call(this);
  this.F = a;
  this.Dg = this.uc = this.Rk = null;
  this.ld = 0;
  this.oa = {};
  this.Ga = "";
  this.le = void 0;
  this.Sa = !1;
  this.vg = 0;
  this.a = H("cv.NetworkMonitor")
};
v(xj, Q);
var yj = function(a) {
  O.call(this, "wifi-added");
  this.Lh = a
};
v(yj, O);
var zj = function(a) {
  O.call(this, "wifi-removed");
  this.wk = a
};
v(zj, O);
var Aj = function(a) {
  O.call(this, "wifi-connected");
  this.Lh = a
};
v(Aj, O);
var Bj = function(a) {
  O.call(this, "wifi-disconnected");
  this.wk = a
};
v(Bj, O);
var Cj = function() {
  O.call(this, "no-wifi")
};
v(Cj, O);
d = xj.prototype;
d.j = function() {
  xj.q.j.call(this);
  this.F.onNetworkListChanged.removeListener(this.Rk);
  this.F.onNetworksChanged.removeListener(this.uc);
  this.ld = 0;
  this.cl()
};
d.start = function() {
  this.uc = t(this.Xk, this);
  this.F.onNetworksChanged.addListener(this.uc);
  this.Rk = t(this.mq, this);
  this.F.onNetworkListChanged.addListener(this.Rk);
  this.F.getVisibleNetworks("All", t(function(a) {
    this.Sa ? this.a.info("Monitor already initialized on getVisibleNetworks callback") : this.mq(gb(a, function(a) {
      return a.GUID
    }))
  }, this))
};
d.nq = function() {
  this.a.info("Remember " + this.Ga);
  this.le = this.Ga
};
d.rp = function() {
  this.a.info("Clear remembered");
  this.le = void 0
};
d.vo = function(a) {
  void 0 != this.le && this.Ga != this.le && (this.a.info("Reconnecting " + this.le), this.Ga && this.F.startDisconnect(this.Ga), this.le && this.F.startConnect(this.le));
  a && this.rp()
};
d.xk = function() {
  return this.Ga
};
d.Yo = function() {
  return this.Sa && 0 == this.vg
};
d.Io = function() {
  this.ld++;
  this.a.info("Rescan loop requested; request count: " + this.ld);
  this.cl()
};
d.xp = function() {
  0 < this.ld && (this.ld--, this.a.info("Rescan canceled; request count: " + this.ld));
  this.cl()
};
d.ix = function(a) {
  this.F.getVisibleNetworks("All", function(b) {
    b = fb(b, function(a) {
      return"Connected" == a.ConnectionState || "Connecting" == a.ConnectionState
    });
    a(gb(b, function(a) {
      return a.Type
    }))
  })
};
d.cl = function() {
  "requestNetworkScan" in this.F && (0 < this.ld && !this.Dg ? (this.a.info("Starting scan interval"), this.F.requestNetworkScan(), this.Dg = setInterval(t(function() {
    this.F.requestNetworkScan()
  }, this), 1E4)) : 0 >= this.ld && this.Dg && (this.a.info("Cancelling scan interval"), clearInterval(this.Dg), this.Dg = null))
};
d.by = function(a) {
  return(a = this.oa[a]) && a.Wb || null
};
d.kk = function(a) {
  var b = [];
  zb(this.oa, function(c) {
    c.Wb && a(c.Wb) && b.push(c.Wb)
  });
  return b
};
d.mq = function(a) {
  var b = {}, c = [];
  y(a, function(a) {
    a in this.oa ? b[a] = this.oa[a] : c.push({network:a, type:"added"})
  }, this);
  a = c.length;
  zb(this.oa, function(a, f) {
    f in b || 4 == a.status || c.push({network:f, type:"removed"})
  }, this);
  this.a.info("Network list changed: " + Jf(c));
  a += a - c.length;
  this.oa = b;
  eb(c, function(a) {
    "added" == a.type ? this.wy(a.network) : "removed" == a.type && this.xy(a.network)
  }, this);
  if(a || !this.Sa) {
    this.Sa = !0, this.vg += a, this.a.info("New network count: " + this.vg), this.cq()
  }
};
d.Xk = function(a) {
  y(a, function(a) {
    this.oa[a] && 4 != this.oa[a].status && (this.Ga && this.Ga != a ? this.oa[a].status = this.dE(this.oa[a].status) : this.tq(a))
  }, this)
};
d.wy = function(a) {
  this.oa[a] = {Wb:null, status:1};
  this.Il(a, t(this.Jl, this))
};
d.Il = function(a, b) {
  var c = null;
  this.oa[a] && this.oa[a].Wb && this.oa[a].Wb.Name && (c = this.oa[a].Wb.Name);
  var e = t(function(c) {
    this.F.getProperties(a, t(function(a) {
      a ? (a = Gb(a), a.Name = c, b(a)) : b(null)
    }, this))
  }, this);
  c ? e(c) : this.F.getVisibleNetworks("All", t(function(c) {
    (c = z(c, function(b) {
      return b.GUID == a
    })) ? e(c.Name) : (this.a.info("Network not found among visible networks: " + a), b(null))
  }, this))
};
d.xy = function(a) {
  this.lq(a);
  pe(this, new zj(a))
};
d.lq = function(a) {
  this.Ga == a && (this.a.e("Network disconnected: " + this.Ga), this.Ga = "", pe(this, new Bj(a)), this.zx())
};
d.ci = function(a) {
  this.a.info("Network connected " + a + "; currently connected: " + this.Ga);
  this.Ga || (this.Ga = a, pe(this, new Aj(this.oa[a].Wb)))
};
d.cq = function() {
  this.Yo() && (this.a.e("No Wi-Fi detected."), pe(this, new Cj))
};
d.dE = function(a) {
  return 1 == a ? 2 : 3
};
d.Jl = function(a) {
  if(a) {
    var b = a.GUID, c = a.ConnectionState;
    if(b && this.oa[b] && c && 4 != this.oa[b].status) {
      if(a.WiFi) {
        var e = this.oa[b], f = !e.Wb;
        e.Wb = a;
        f && pe(this, new yj(a));
        1 == e.status && (e.status = 0);
        2 == e.status ? this.Ga && this.Ga != b ? e.status = 3 : (this.a.info("Refetching properties for " + b), e.status = 1, this.Il(b, t(this.Jl, this))) : "Connected" == c ? this.ci(b) : "Connecting" != c && this.lq(b)
      }else {
        this.a.info("Detected non WiFi network: " + b), this.oa[b].status = 4, this.vg--, this.cq()
      }
    }
  }
};
d.tq = function(a) {
  var b = this.oa[a];
  4 != b.status && (1 == b.status ? b.status = 2 : (b.status = 1, this.Il(a, t(this.Jl, this))))
};
d.zx = function() {
  if(!this.Ga) {
    var a = [];
    zb(this.oa, function(b, c) {
      3 == b.status ? a.push(c) : 0 == b.status && "Connected" == b.Wb.ConnectionState && (this.a.info("Found new connected network synchronously: " + c), this.ci(c))
    }, this);
    this.Ga || (this.a.info("Refresh networks to find a connected one: " + Jf(a)), y(a, function(a) {
      this.tq(a)
    }, this))
  }
};
var Dj = function() {
  Q.call(this);
  this.a = H("cv.UserActionNotifier")
};
v(Dj, Q);
var Ej = function() {
  O.call(this, "network-selection-shown")
};
v(Ej, O);
Dj.prototype.oA = function() {
  this.a.info("Dispatching network-selection-shown");
  pe(this, new Ej)
};
var Fj = function(a, b, c, e, f, g) {
  this.He = a;
  this.Y = b;
  this.G = c;
  this.tv = e;
  this.uv = f;
  this.r = g;
  this.vk = this.n = this.aa = !1;
  this.Do = !0;
  this.a = H("cv.ChromekeyAvailableNetworkScanner");
  this.ca = this.ng = null
};
d = Fj.prototype;
d.start = function() {
  this.aa || this.n || (this.a.info("Start task."), this.ng = t(this.Gx, this), P(this.He, "network-selection-shown", this.ng), this.yk())
};
d.cc = function(a) {
  return"flow-select-network" != a && "flow-edit-device" != a
};
d.cancel = function() {
  this.n || (this.a.info("Cancel task"), this.n = !0, this.ca && (this.ca(), this.ca = null), this.ng && (je(this.He, "network-selection-shown", this.ng), this.ng = null))
};
d.Gx = function() {
  this.jH()
};
d.jH = function() {
  this.n || (this.aa ? (this.a.info("Schedule rescan."), this.vk = !0) : this.yk())
};
d.yk = function() {
  this.aa = !0;
  this.a.info("Scan wifis");
  this.ca = this.Y.Rx(t(this.Qx, this))
};
d.Qx = function(a, b) {
  this.n || (b.ga() || this.a.e("Scan wifi failed. Wifi list may be stale."), this.ca = this.Y.aw(t(this.$v, this)))
};
d.$v = function(a, b) {
  if(!this.n) {
    if(this.a.info("Got scan results."), this.ca = null, b.ga()) {
      var c = fb(a, function(a) {
        return this.tv(a)
      }, this), e = gb(c, function(a) {
        return{name:a.ssid, value:a}
      }, this), c = kb(c, function(a) {
        return a.ssid == this.G.ssid
      }, this);
      this.uv(e, c);
      this.Do = !1;
      setTimeout(t(function() {
        this.n || (this.a.info("Allowing further scan-wifi requests."), this.aa = !1, this.vk && (this.vk = !1, this.yk()))
      }, this), 3E3)
    }else {
      this.a.e("Scan results request failed."), this.Do && (this.a.e("Report error on the first scan results failure."), this.cancel(), this.r())
    }
  }
};
var Gj = function(a, b, c) {
  this.o = a;
  this.Rh = b;
  this.Mh = c;
  this.aa = this.n = !1;
  this.bi = this.ai = this.Sb = null;
  this.Lk = !1;
  this.a = H("cv.NetworkWaiter")
}, Hj = function(a, b, c) {
  return new Gj(a, b, c)
};
Gj.prototype.cancel = function() {
  this.n || (this.a.info("Task canceled"), this.n = !0, this.Sb && (je(this.o, "wifi-added", this.Sb), this.Sb = null), this.ai && (clearTimeout(this.ai), this.ai = null), this.bi && (clearTimeout(this.bi), this.bi = null), this.Lk && (this.o.xp(), this.Lk = !1))
};
Gj.prototype.cc = function() {
  return!0
};
Gj.prototype.start = function(a, b, c) {
  if(!this.aa && !this.n) {
    this.a.info("Task started");
    var e = this.o.kk(a);
    0 < e.length ? (this.a.info("Network found imediatelly."), this.cancel(), this.Rh(e[0])) : (this.Sb = t(this.Fk, this, a), P(this.o, "wifi-added", this.Sb), this.bi = setTimeout(t(function() {
      this.a.info("Rescan loop requested");
      this.Lk = !0;
      this.o.Io()
    }, this), b), this.ai = setTimeout(t(function() {
      this.a.e("Task timed out.");
      this.cancel();
      this.Mh()
    }, this), c))
  }
};
Gj.prototype.Fk = function(a, b) {
  var c = b.Lh;
  !this.n && a(c) && (this.a.info("Network found."), this.cancel(), this.Rh(c))
};
var Ij = function(a, b, c, e) {
  this.F = a;
  this.o = b;
  this.pb = c;
  this.r = e;
  this.aa = this.n = !1;
  this.kd = "";
  this.eg = this.Th = this.uc = null;
  this.a = H("cv.NetworkConnector")
}, Jj = function(a, b, c, e) {
  return new Ij(a, b, c, e)
};
d = Ij.prototype;
d.cancel = function() {
  this.n || (this.a.info("Canceling task."), this.n = !0, this.uc && (this.F.onNetworksChanged.removeListener(this.uc), this.uc = null), this.Th && (clearTimeout(this.Th), this.Th = null), this.eg && (this.eg.cancel(), this.eg = null))
};
d.cc = function() {
  return!0
};
d.start = function(a) {
  this.aa || this.n || (this.aa = !0, this.a.info("Starting task"), this.eg = Hj(this.o, t(this.Gv, this), t(function() {
    this.n || (this.a.e("Network waiter failed"), this.cancel(), this.r())
  }, this)), this.eg.start(a, 0, 2E4))
};
d.Gv = function(a) {
  this.n || (this.kd = a.GUID, this.a.info("Network to be connected found; guid: " + this.kd), this.o.xk() == this.kd ? (this.a.info("Network already connected."), this.cancel(), this.pb(this.kd)) : (this.uc = t(this.Xk, this), this.F.onNetworksChanged.addListener(this.uc), this.F.startConnect(this.kd, t(this.lw, this))))
};
d.lw = function() {
  this.n || (this.Th = setTimeout(t(function() {
    this.a.e("Network connector timed out");
    this.cancel();
    this.r()
  }, this), 3E4))
};
d.Xk = function(a) {
  this.n || (a = z(a, function(a) {
    return a == this.kd
  }, this)) && this.F.getProperties(a, t(this.MB, this))
};
d.MB = function(a) {
  if(!this.n) {
    var b = a && a.ConnectionState;
    this.a.info("New network connection state for guid " + this.kd + ":" + b);
    a && "NotConnected" != b ? "Connected" == b && (this.cancel(), this.pb(this.kd)) : (this.cancel(), this.r())
  }
};
var Kj = function(a, b, c) {
  this.Ds = a;
  this.gh = b;
  this.Ls = c;
  this.n = !1;
  this.ca = null
};
d = Kj.prototype;
d.cancel = function() {
  this.n = !0;
  this.ca && (this.ca(), this.ca = null)
};
d.cc = function(a) {
  return this.Ls ? this.Ls(a) : !0
};
d.start = function() {
  this.n || this.Ds(t(this.Ys, this))
};
d.Sd = function() {
  this.n || (this.ca = this.Ds(t(this.Ys, this)), w(!!this.ca))
};
d.Ys = function() {
  this.n || (this.ca = null, this.cancel(), this.gh.apply(null, arguments))
};
var Lj = function(a, b, c, e) {
  this.o = a;
  this.ir = b;
  this.kr = c;
  this.r = e;
  this.n = !1;
  this.Oc = [];
  this.bh = this.dh = this.Sb = this.Bd = null;
  this.um = !1
};
d = Lj.prototype;
d.cancel = function() {
  this.n || (this.n = !0, this.Sb && (je(this.o, "wifi-added", this.Sb), this.Sb = null), this.dh && (je(this.o, "wifi-removed", this.dh), this.dh = null), this.bh && (je(this.o, "no-wifi", this.bh), this.bh = null), this.Bd && (clearTimeout(this.Bd), this.Bd = null), this.o.xp())
};
d.cc = function() {
  return!0
};
d.start = function() {
  this.n || (this.o.Yo() ? this.Jr(null) : (this.Oc = this.o.kk(pj), ub(this.Oc, this.ir), this.kr(this.Oc), this.Sb = t(this.Fk, this), P(this.o, "wifi-added", this.Sb), this.dh = t(this.DA, this), P(this.o, "wifi-removed", this.dh), this.bh = t(this.Jr, this), P(this.o, "no-wifi", this.bh), this.o.Io(), this.Am()))
};
d.Am = function() {
  this.n || (this.Oc.length && this.Bd ? (clearTimeout(this.Bd), this.Bd = null) : this.Oc.length || this.Bd || (this.Bd = setTimeout(t(function() {
    this.n || (this.cancel(), this.r(1))
  }, this), 15E3)))
};
d.Fk = function(a) {
  a = a.Lh;
  if(!this.n && pj(a)) {
    for(var b = this.Oc, c, e = this.ir || tb, f = 0, g = b.length;f < g;) {
      var k = f + g >> 1, l;
      l = e(a, b[k]);
      0 < l ? f = k + 1 : (g = k, c = !l)
    }
    c = c ? f : ~f;
    0 > c && sb(b, -(c + 1), 0, a);
    this.Xs();
    this.Am()
  }
};
d.DA = function(a) {
  var b = a.wk;
  this.n || (a = kb(this.Oc, function(a) {
    return a && a.GUID == b
  }), 0 <= a && (mb(this.Oc, a), this.Xs(), this.Am()))
};
d.Xs = function() {
  this.um || (this.um = !0, setTimeout(t(function() {
    this.um = !1;
    this.n || this.kr(this.Oc)
  }, this), 1E3))
};
d.Jr = function() {
  this.cancel();
  this.r(0)
};
var Mj = function(a, b, c) {
  this.Y = a;
  this.Rh = b;
  this.Mh = c;
  this.n = !1;
  this.Dk = null;
  this.gg = 0;
  this.ti = new ej;
  this.ti.nk(25);
  this.ti.Gh(7E3);
  this.ca = null;
  this.a = H("cv.ConnectedSetupStateWaiter")
};
d = Mj.prototype;
d.cancel = function() {
  this.n || (this.ca && (this.ca(), this.ca = null), this.a.info("Task canceled"), this.n = !0, this.ti.abort())
};
d.cc = function() {
  return!0
};
d.start = function() {
  this.a.info("Task started");
  this.ti.start(t(this.Zy, this), t(this.pb, this), t(this.Gi, this))
};
d.Zy = function(a) {
  this.n || (this.ca ? (++this.gg, a.Rd()) : this.ca = this.Y.Fh(t(this.cB, this, a)))
};
d.cB = function(a, b, c) {
  if(!this.n) {
    var e = this.ca = null;
    c.ga() ? e = b.setup_state : this.a.e("Chromekey info failed.");
    if(!e || this.Dk && e == this.Dk) {
      ++this.gg, 6 < this.gg ? (this.a.t("Setup state not changed for " + this.gg + " iterations. Failing."), a.abort()) : a.Rd()
    }else {
      this.a.info("Setup state changed to " + e);
      this.Dk = e;
      this.gg = 0;
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
            c = !1
        }
      }
      c ? (this.a.info("Chromekey connected"), a.jk(b)) : (b = this.Iv(e), 0 != b ? (this.a.t("Bad setup state"), this.cancel(), this.Mh(b)) : a.Rd())
    }
  }
};
d.pb = function(a) {
  this.n || this.Rh(Va(a))
};
d.Gi = function() {
  this.n || this.Mh(1)
};
d.Iv = function(a) {
  switch(a) {
    case 21:
      return 2;
    case 31:
      return 3;
    case 41:
      return 4;
    default:
      return 0
  }
};
var Nj = function(a, b, c) {
  this.F = a;
  this.o = b;
  this.r = c;
  this.gc = this.n = !1;
  this.Yd = this.pg = null;
  this.Co = 0;
  this.Bo = !0;
  this.a = H("cv.KeepNetworkConnectedTask")
};
d = Nj.prototype;
d.cancel = function() {
  this.n || (this.a.info("Task canceled"), this.n = !0, this.pg && (je(this.o, "wifi-disconnected", this.pg), this.pg = null), this.Yd && (this.Yd.cancel(), this.Yd = null))
};
d.cc = function() {
  return!1
};
d.Hh = function(a) {
  this.Bo = a
};
d.start = function(a) {
  this.gc || this.n || (this.gc = !0, this.a.info("Task started for network: " + a), this.pg = t(this.hx, this, a), P(this.o, "wifi-disconnected", this.pg))
};
d.hx = function(a, b) {
  this.n || this.Yd || b.wk != a || (this.Bo ? 2 <= this.Co ? (this.a.t("Network disconnected. The max number of allowed reconnects exceeded."), this.cancel(), this.r()) : (this.Yd = Jj(this.F, this.o, t(function() {
    ++this.Co;
    this.Yd = null
  }, this), t(function(a) {
    this.n || (this.a.e("Reconnect failed for " + a), this.cancel(), this.r())
  }, this)), this.a.e("Reconnecting " + a), this.Yd.start(function(b) {
    return b.GUID == a
  })) : (this.a.t("Network disconnected. Fail as reconnecting is not allowed"), this.cancel(), this.r()))
};
var Oj = function(a) {
  this.Y = a;
  this.n = !1;
  this.ca = this.yj = null
};
Oj.prototype.cc = function(a) {
  return!a || "flow-setup-started" == a || "flow-select-device" == a || "flow-success" == a
};
Oj.prototype.cancel = function() {
  this.n || (this.n = !0, this.yj && (clearInterval(this.yj), this.yj = null), this.ca && (this.ca(), this.ca = null))
};
Oj.prototype.start = function() {
  this.yj = setInterval(t(function() {
    this.ca = this.Y.Fh(t(function() {
      this.ca = null
    }, this))
  }, this), 45E3)
};
var Pj = function(a, b, c) {
  this.xa = a;
  this.pb = b;
  this.r = c;
  this.n = !1;
  this.a = H("cv.CastDeviceWaiter");
  this.ni = this.be = this.sg = null
};
Pj.prototype.cancel = function() {
  this.n || (this.n = !0, this.a.info("CastDeviceWaiter task canceled."), this.sg && (je(this.xa, "device-list-updated", this.sg), this.sg = null), this.be && (clearTimeout(this.be), this.be = null), this.ni && (clearInterval(this.ni), this.ni = null))
};
Pj.prototype.cc = function() {
  return!0
};
Pj.prototype.start = function(a, b) {
  this.n || (this.a.info("Cast device waiter task started."), setTimeout(t(function() {
    this.n || (this.a.t("The cast device waiter task timed out."), this.cancel(), this.r())
  }, this), b), this.ni = setInterval(t(function() {
    this.n || (this.a.info("Triggering dial monitor refresh."), this.xa.refresh())
  }, this), Math.min(b / 2 + 1, 3E4)), this.xa.ok(a), this.sg = t(this.jd, this, a), P(this.xa, "device-list-updated", this.sg), this.xa.refresh())
};
Pj.prototype.jd = function(a, b) {
  if(!this.n) {
    var c = z(b.Sq, function(b) {
      return b.udn == a
    });
    c && (this.cancel(), this.pb(c))
  }
};
var Qj = function(a, b, c, e, f) {
  this.F = a;
  this.o = b;
  this.xa = c;
  this.pb = e;
  this.r = f;
  this.aa = this.n = !1;
  this.Ve = this.be = this.Zf = this.Hk = null;
  this.a = H("cv.ChromecastSetupNetworkVerifier")
}, Rj = [{value:2400, min:2400, max:2500}, {value:5E3, min:4900, max:5900}];
d = Qj.prototype;
d.cancel = function() {
  this.n || (this.n = !0, this.Ve && (this.Ve.cancel(), this.Ve = null))
};
d.cc = function() {
  return!0
};
d.start = function(a, b, c) {
  this.n || this.aa || (this.aa = !0, this.a.info("Task started."), this.Hk = a, this.be = c ? 14E4 : 3E4, this.Ve = a = Jj(this.F, this.o, t(this.ci, this), t(this.eb, this, "network-connect-failed")), a.start(function(a) {
    return a.Name == b
  }))
};
d.ci = function(a) {
  this.n || (this.a.info("Network connected; guid: " + a), this.Zf = a, this.Ve = a = new Kj(t(this.o.ix, this.o), t(this.jx, this), null), a.start())
};
d.jx = function(a) {
  this.n || (this.a.info("Connected network types: " + Jf(a)), B(a, "VPN") ? this.eb("vpn-connected") : this.Ux())
};
d.Ux = function() {
  this.a.info("Verified that VPN not connected.");
  w(this.Hk);
  w(this.be);
  var a;
  a = t(this.Iy, this);
  var b = t(this.Jy, this);
  this.Ve = a = new Pj(this.xa, a, b);
  a.start(this.Hk, this.be)
};
d.Iy = function(a) {
  this.a.info("Chromecast found on the network.");
  if(this.o.xk() != this.Zf) {
    this.a.e("Network connection lost."), this.eb("network-connect-failed")
  }else {
    var b = this.jp(), b = !!b && b.fp && 5E3 != b.ep;
    this.cancel();
    this.pb(a, b)
  }
};
d.Jy = function() {
  this.a.t("Failed to find the Chromecast on the selected network");
  if(this.o.xk() != this.Zf) {
    this.a.e("Network connection lost."), this.eb("network-connect-failed")
  }else {
    var a = this.jp();
    a && a.fp && 5E3 == a.ep ? this.eb("not-found-dual-band") : this.eb("not-found")
  }
};
d.eb = function(a) {
  this.a.info("Encountered an error: " + a);
  this.cancel();
  this.r(a)
};
d.jp = function() {
  w(this.Zf);
  var a = this.o.by(this.Zf);
  if(!(a && a.WiFi && a.WiFi.FrequencyList && a.WiFi.Frequency)) {
    return this.a.info("Frequency information not exposed"), null
  }
  var b = function(a) {
    var b = z(Rj, function(b) {
      return a >= b.min && a <= b.max
    });
    return b ? b.value : -1
  }, c = function(a, c) {
    return!!z(a, function(a) {
      return(a = b(a)) && a == c
    })
  }, e = c(a.WiFi.FrequencyList, 2400), c = c(a.WiFi.FrequencyList, 5E3);
  this.a.info("Conencted frequency: " + a.WiFi.Frequency);
  this.a.info("Found frequecy list: " + Jf(a.WiFi.FrequencyList));
  this.a.info("The network frequency status: has 2.4 GHz: " + e + "; has 5 GHZ: " + c);
  return{ep:b(a.WiFi.Frequency), fp:e && c}
};
var Z = {bo:null, bk:function() {
  Z.bo || (Z.bo = chrome.extension.getBackgroundPage().chromeKeySetupLogUtils);
  return Z.bo
}, iv:null, wG:function(a) {
  Z.iv = a
}, mo:function(a) {
  Z.bk().wG(a)
}, Nq:function() {
  return Qc()
}, aG:function() {
  return Z.iv
}, jj:function() {
  var a = chrome.extension.getViews({type:"tab"}), b = function(a, b) {
    return z(a, function(a) {
      return!!a && !!a.document && !!a.document.body && a.document.body.id == b
    })
  }, c = b(a, "dongle-setup");
  c || (a = b(a, "options")) && (c = b(a.frames, "dongle-setup"));
  return c ? c.chromeKeySetupLogUtils.Nq() : Z.bk().aG() || ""
}, av:null, zG:function(a) {
  Z.av = a
}, tG:function() {
  return Z.av
}, jt:function(a) {
  Z.bk().zG(a)
}, XG:function() {
  return Z.bk().tG()
}};
ba("chromeKeySetupLogUtils", Z, void 0);
ba("getChromeKeySetupLogs", Z.jj, void 0);
ba("getChromeKeySetupExternalLogsUrl", Z.XG, void 0);
var Sj = function() {
};
Sj.prototype.getMessage = function(a, b) {
  return this.YG(a, b).message
};
Sj.prototype.YG = function(a, b) {
  for(var c = [], e = {}, f = /{{(\w+?)}}/g, g = f.exec(a);null != g;) {
    b ? b[g[1]] && (e[g[1]] = b[g[1]]) : e[g[1]] = e[g[1]], g = f.exec(a)
  }
  for(var k in e) {
    k && (b && (a = a.replace(RegExp("{{" + k + "}}", "g"), e[k])), c.push(k))
  }
  return{message:a, bindings:c}
};
da(Sj);
var dk = function(a) {
  var b = null;
  switch(a) {
    case "ok-button":
      b = Tj;
      break;
    case "cancel-button":
      b = Uj;
      break;
    case "save-button":
      b = Vj;
      break;
    case "set-up-button":
      b = Wj;
      break;
    case "continue-button":
      b = Xj;
      break;
    case "accept-button":
      b = Yj;
      break;
    case "reject-button":
      b = Zj;
      break;
    case "try-again-button":
      b = ak;
      break;
    case "go-back-button":
      b = bk;
      break;
    case "factory-reset-button":
      b = ck
  }
  return b ? Sj.I().getMessage(b) : a
}, Tj = chrome.i18n.getMessage("1510649369757220975"), Uj = chrome.i18n.getMessage("2581331321407676861"), Vj = chrome.i18n.getMessage("2305903324116609221"), Wj = chrome.i18n.getMessage("3789857023572978851"), Xj = chrome.i18n.getMessage("3314869243569608808"), Yj = chrome.i18n.getMessage("8856112728107888349"), Zj = chrome.i18n.getMessage("7011099479208813570"), ak = chrome.i18n.getMessage("7353352715326499943"), bk = chrome.i18n.getMessage("6392158336204151356"), ck = chrome.i18n.getMessage("6098003662202355499");
var ek = function() {
  this.a = H("cv.PinGenerator")
};
d = ek.prototype;
d.qv = function(a) {
  a = this.fG(a);
  if(!a) {
    return null
  }
  a = this.hG(a, [{action:"step", code:48, optional:!1}, {action:"step", code:48, optional:!1}, {action:"skip", code:160, optional:!0}, {action:"skip", code:2, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"skip", code:48, optional:!1}, {action:"return", code:48, optional:!1}]);
  return a ? (a = this.gG(a)) ? this.iG(a) : null : null
};
d.fG = function(a) {
  a = a.replace(/[\r\n]/g, "");
  a = a.replace("-----BEGIN CERTIFICATE-----", "");
  a = a.replace("-----END CERTIFICATE-----", "");
  try {
    qf();
    for(var b = of, c = [], e = 0;e < a.length;) {
      var f = b[a.charAt(e++)], g = e < a.length ? b[a.charAt(e)] : 0;
      ++e;
      var k = e < a.length ? b[a.charAt(e)] : 0;
      ++e;
      var l = e < a.length ? b[a.charAt(e)] : 0;
      ++e;
      if(null == f || null == g || null == k || null == l) {
        throw Error();
      }
      c.push(f << 2 | g >> 4);
      64 != k && (c.push(g << 4 & 240 | k >> 2), 64 != l && c.push(k << 6 & 192 | l))
    }
    return c
  }catch(r) {
    return this.a.t("Failed to convert the certificate from PEM to DER format"), null
  }
};
d.Nw = function(a, b) {
  if(b + 1 >= a.length) {
    return this.a.t("Length byte out of certificate bounds: at " + b + "; cert length: " + a.length), null
  }
  if(!(a[b + 1] & 128)) {
    return{length:a[b + 1], kl:1}
  }
  var c = a[b + 1] & 127;
  if(b + c + 1 >= a.length) {
    return this.a.t("Length info out of certificate bounds at: " + b + " length bytes count: " + c + "; certificate length: " + a.length), null
  }
  if(2 < c) {
    return this.a.t("Block length over 16 bits not allowed; at " + b), null
  }
  for(var e = 0, f = 2;f <= c + 1;f++) {
    e = e << 8 | a[b + f]
  }
  return{length:e, kl:c + 1}
};
d.hG = function(a, b) {
  var c = 0, e = -1;
  if(65535 < a.length) {
    return this.a.t("Certificate too long: " + a.length), null
  }
  for(;b.length;) {
    var f = b.shift();
    e++;
    this.a.info("step: " + e + ", start: " + c);
    if(a[c] != f.code) {
      if(f.optional) {
        this.a.e("Skipping instruction " + f.code + " at step " + e);
        continue
      }
      this.a.t("Expected certificate byte cert[" + c + "] to be " + f.code + ", but found " + a[c] + " at step " + e + " instead.");
      return null
    }
    var g = this.Nw(a, c);
    if(!g) {
      return this.a.t("Invalid certificate block length at step " + e), null
    }
    var k = c + g.length + g.kl;
    if(k >= a.length) {
      return this.a.t("The certificate data block at " + c + " does not fit the certificate size."), null
    }
    switch(f.action) {
      case "step":
        c += g.kl + 1;
        continue;
      case "skip":
        c = k + 1;
        continue;
      case "return":
        return rb(a, c, k + 1);
      default:
        return this.a.t("Invalid certificate parsing intstruction: " + f.action), null
    }
  }
  this.a.t("Incomplete certificate parsing instructions");
  return null
};
d.gG = function(a) {
  var b = new sf;
  b.update(a);
  return b.Hm()
};
d.Qu = function(a) {
  for(var b = a.length, c = 0, e = 0;e < b - 1;e++) {
    c += a[e]
  }
  c = (a[b - 1] + 16 * c) % 24;
  a = 65 + c;
  73 <= a && a++;
  79 <= a && a++;
  return String.fromCharCode(a)
};
d.Ru = function(a) {
  return String.fromCharCode(50 + a[a.length - 1] % 8)
};
d.fk = function(a, b, c, e) {
  for(var f = [], g = 0;g < e;g++) {
    f[g] = a[b + g] ^ a[c + g]
  }
  return f
};
d.iG = function(a) {
  var b = [];
  b[0] = this.Qu(this.fk(a, 0, 16, 4));
  b[1] = this.Ru(this.fk(a, 4, 16, 4));
  b[2] = this.Qu(this.fk(a, 8, 16, 4));
  b[3] = this.Ru(this.fk(a, 12, 16, 4));
  return b
};
var fk = {id:"generic", priority:2, iconClass:"error-icon-default", title:"Oops. Something went wrong.", message:'<p>We\'re unable to configure your device.<br>Click "Try again" to restart setup.</p>', messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, gk = {id:"no-wifi", priority:1, iconClass:"error-icon-network", title:"Wi-Fi must be turned on", message:'<p>To set up your Chromecast, turn on your Wi-Fi on this computer and click "Try again" to continue setup.</p>', 
messageFun:null, feedbackLink:{show:!1}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, hk = {id:"no-chromecasts", priority:2, iconClass:"error-icon-default", title:"No Chromecasts found", message:"<p>Please check that your Chromecast is nearby and connected correctly.</p>", messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", 
next:"cancel-setup"}}, ik = {id:"no-chromecasts-setup-one-exists", priority:2, iconClass:"error-icon-default", title:"Couldn't find new Chromecasts to set up", message:"<p>However, it looks like there are Chromecasts that are already set up on your network and ready to go. To see the list of Chromecasts you can use, click on the Cast extension.</p>", messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, jk = 
{id:"invalid-chromecast", priority:1, iconClass:"error-icon-default", title:"Oops. Something went wrong.", message:"<p>We couldn't authenticate your Chromecast.<br>Please choose a different Chromecast.</p>", messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, kk = {id:"chromecast-disconnected", priority:1, iconClass:"error-icon-default", title:"Unable to connect to Chromecast", message:null, messageFun:function(a) {
  return"<p>We can't connect to " + a + ". Please make sure your Chromecast is powered on and nearby.</p>"
}, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, lk = {id:"chromecast-name-too-long", priority:3, iconClass:"error-icon-default", title:"Oops, your Chromecast name is too long", message:"<p>Your Chromecast name should be a maximum of 24 characters</p>", messageFun:null, feedbackLink:{show:!1}, okButton:{show:!0, type:"ok-button", next:"pop-previous-state"}, cancelButton:{show:!1, type:null, 
next:null}}, mk = {id:"chromecast-connection-failed", priority:2, iconClass:"error-icon-network", title:"Unable to connect Chromecast to the network", message:"<p>We can't connect your Chromecast to your chosen Wi-Fi network. Please check your network name and password, and ensure that your network allows new devices to join.</p>", messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"pop-previous-state"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, 
nk = {id:"chromecast-unreachable", priority:1, iconClass:"error-icon-default", title:"Oops. Something went wrong.", message:"<p>We're unable to communicate with your Chromecast.<br>You may need to try again.</p>", messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"reinit-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}}, ok = {id:"chromecast-save-failed", priority:1, iconClass:"error-icon-default", title:"Oops. Something went wrong.", 
message:'<p>We\'re unable to save your settings to your Chromecast. Please visit <a href="http://support.google.com/chromecast" target="_blank">support.google.com/chromecast</a> for help troubleshooting this issue.</p>', messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, pk = {id:"connect-to-setup-network", priority:1, iconClass:"error-icon-default", title:"Make sure your Chromecast and computer are connected to the same network", 
message:null, messageFun:function(a, b) {
  return"<p>Your computer is unable to connect to the same Wi-Fi network as your Chromecast. You can manually change your computer's Wi-Fi network to " + b + " and try again. Or, you can go back and change your Chromecast's Wi-Fi network.</p>"
}, feedbackLink:{show:!1}, okButton:{show:!0, type:"try-again-button", next:"verify-setup"}, cancelButton:{show:!0, type:"go-back-button", next:"retry-setup"}}, qk = {id:"vpn-connected", priority:1, iconClass:"error-icon-default", title:"Nearly done with Chromecast setup", message:'<p>Your computer is unable to communicate with your Chromecast when VPN is connected.</p><p>To complete setup, please disconnect from VPN, and click "Try again".</p>', messageFun:null, feedbackLink:{show:!1}, okButton:{show:!0, 
type:"try-again-button", next:"verify-setup"}, cancelButton:{show:!1, type:null, next:null}}, rk = {id:"success-dual-band-warning", priority:1, iconClass:"error-icon-none", title:"Congratulations! Setup was successful", message:'<p>However, you may have an advanced router - some of your devices may not be able to cast to your Chromecast unless you modify your router settings.</p><p>If you run into problems, please visit <a href="http://support.google.com/chromecast" target="_blank">support.google.com/chromecast</a> for help troubleshooting this issue.</p>', 
messageFun:null, feedbackLink:{show:!1}, okButton:{show:!0, type:"ok-button", next:"succeeed-setup"}, cancelButton:{show:!1, type:null, next:null}}, sk = {id:"setup-chromecast-not-found-on-dual-band", priority:1, iconClass:"error-icon-default", title:"Oops. Something went wrong.", message:'<p>We could not communicate with your Chromecast from this computer. Your Chromecast and computer may be connected to networks that are unable to talk to one another.</p><p>This may require a small change to your Wi-Fi router settings. Please visit <a href="http://support.google.com/chromecast" target="_blank">support.google.com/chromecast</a> for help troubleshooting this issue.</p>', 
messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"ok-button", next:"cancel-setup"}, cancelButton:{show:!1, type:null, next:null}}, tk = {id:"setup-chromecast-not-found", priority:1, iconClass:"error-icon-default", title:"Something went wrong. We weren't able to find your Chromecast on the network.", message:'<p>Please go back and select a different Wi-Fi network for your Chromecast, or visit <a href="http://support.google.com/chromecast" target="_blank">support.google.com/chromecast</a> for help troubleshooting this issue</p>', 
messageFun:null, feedbackLink:{show:!0}, okButton:{show:!0, type:"try-again-button", next:"retry-setup"}, cancelButton:{show:!0, type:"cancel-button", next:"cancel-setup"}};
"undefined" != typeof angular && angular.module("dongleSetup", ["ngSanitize", "chrome_i18n"]);
var uk = function(a) {
  H("cv").tc(Ic);
  this.b = a;
  this.jo = gj() ? "ChromeOS" : Xb ? "Windows" : Wb ? "Mac" : Yb ? "Linux" : "Other";
  this.Y = new mj(new U("http://192.168.255.249:8008"));
  this.F = chrome.networkingPrivate || null;
  this.Zc = chrome.dial || null;
  this.Vf = Z;
  this.G = null;
  this.a = H("cv.DongleSetupFlowCtrl");
  this.Ge = this.ya = null;
  this.mv(this.b);
  this.Ih();
  this.Vf.mo(null);
  (this.o = this.lv()) && this.o.start();
  (this.xa = this.kv()) && this.xa.start();
  this.He = new Dj;
  this.Ca = [];
  this.qb = 0;
  this.nv() && this.ko();
  P(window, "beforeunload", t(this.sc, this))
};
ba("dongle.DongleSetupFlowCtrl", uk, void 0);
uk.$inject = ["$scope"];
d = uk.prototype;
d.r = function(a) {
  this.a.e("Encountered an error: " + a.id);
  "flow-error" == this.b.flowId && this.b.error.priority <= a.priority || (this.ya && this.ya.Hh(!1), this.b.error = a, this.ja("flow-error"))
};
d.po = function(a) {
  var b = function(a, b) {
    for(var f = 0;f < b.length;++f) {
      if(!(b[f] in a)) {
        return!1
      }
    }
    return!0
  };
  return a && b(a, ["public_key", "ssdp_udn", "name", "hotspot_bssid", "sign"]) && b(a.sign, ["certificate", "nonce", "signed_data"]) ? {certificate:a.sign.certificate, deviceSerial:a.ssdp_udn, nonce:a.sign.nonce, publicKey:a.public_key, signedData:a.sign.signed_data, deviceSsid:a.name, deviceBssid:a.hotspot_bssid} : (this.a.t("Missing required fields."), null)
};
d.ov = function() {
  w(!!this.o);
  var a = new Lj(this.o, function(a, c) {
    return qa(a.Name, c.Name) || qa(a.GUID, c.GUID)
  }, this.fa(function(a) {
    this.b.deviceList = a;
    if(1 == a.length) {
      this.b.device = a[0]
    }else {
      var c = this.b.device && this.b.device.GUID;
      this.b.device = z(this.b.deviceList, function(a) {
        return a.GUID == c
      })
    }
  }), this.fa(function(a) {
    switch(a) {
      case 0:
        this.r(gk);
        break;
      case 1:
        a = this.b.castDeviceList && z(this.b.castDeviceList, function(a) {
          return a.isChromecast
        }) ? ik : hk;
        this.r(a);
        break;
      default:
        this.a.e("Unknown hotspot scanner error"), this.r(fk)
    }
  }));
  this.Ca.push(a);
  vk(t(a.start, a))
};
d.mk = function() {
  this.xa && this.xa.refresh()
};
d.Xp = function(a) {
  var b = this.ip();
  if(Eb(b)) {
    this.qk(a)
  }else {
    var c = this.fa(function(b, c) {
      c.ga() ? this.qk(a) : (this.a.t("Saving non network settings failed"), this.r(ok))
    }), b = new Kj(t(this.Y.iw, this.Y, b), c, null);
    this.Ca.push(b);
    b.Sd()
  }
};
d.vv = function(a) {
  var b = new Kj(t(this.Y.TA, this.Y), this.fa(function(b, e) {
    e.ga() ? this.Xp(a) : this.r(ok)
  }), null);
  this.Ca.push(b);
  b.Sd()
};
d.oo = function() {
  this.a.info("Verifying Chromecast visible on the selected network.");
  var a = t(function(a, b) {
    this.Y.lk(a.ipAddress);
    this.vv(b)
  }, this), b = this.fa(function(a) {
    switch(a) {
      case "network-connect-failed":
        this.r(pk);
        break;
      case "vpn-connected":
        this.r(qk);
        break;
      case "not-found":
        this.r(tk);
        break;
      case "not-found-dual-band":
        this.r(sk);
        break;
      default:
        this.a.t("Unknown setup network verifier error"), this.r(fk)
    }
  }), c = 2 == this.qb, e = "uuid:" + this.G.ssdp_udn, f = this.Uf().ssid;
  w(this.F);
  w(this.o);
  w(this.xa);
  a = new Qj(this.F, this.o, this.xa, a, b);
  this.Ca.push(a);
  a.start(e, f, c)
};
d.lo = function() {
  var a = this.Uf();
  this.b.customNetworkSecurity = a.wpa_auth;
  this.b.networkName = a.ssid;
  this.b.selectCustomNetwork = !0;
  this.b.disableConfirmPasswordButton = !0;
  this.ja("flow-invalid-password")
};
d.vz = function(a, b) {
  var c = this.fa(function(a) {
    3 == a ? (this.ya && this.ya.Hh(!1), this.lo()) : this.r(mk)
  }), e = t(function(a) {
    this.G = a;
    this.ya && (this.ya.cancel(), this.ya = null);
    this.oo()
  }, this), f = 400 == b.ua();
  2 != this.qb || f ? b.ga() ? (c = new Mj(this.Y, e, c), this.Ca.push(c), c.start()) : (this.a.t("connectWifi failed with status: " + b.ua()), this.fa(function() {
    this.r(f ? mk : nk)
  })()) : e(this.G)
};
d.Cq = function(a, b, c) {
  var e = {ssid:a.ssid, wpa_auth:a.wpa_auth};
  this.b.selectCustomNetwork && (e.scan_ssid = 1);
  !c && b ? this.r(jk) : (c && (e.enc_passwd = c), "wpa_cipher" in a && (e.wpa_cipher = a.wpa_cipher), "wpa_id" in a && (e.wpa_id = a.wpa_id), a = new Kj(t(this.Y.uz, this.Y, e), t(this.vz, this), null), this.Ca.push(a), a.Sd(), this.xa.ok("uuid:" + this.G.ssdp_udn))
};
d.Xq = function() {
  this.ja("flow-setup-started");
  var a = this.Uf();
  if(this.Bq(a)) {
    if(this.ya && this.ya.Hh(!0), qj(a)) {
      var b = this.b.networkPassword, c = this.po(this.G);
      if(c) {
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
              e = !0
          }
        }
        e ? (a = new Kj(t(this.F.verifyAndEncryptData, this.F, c, b), t(this.Cq, this, a, !0), null), this.Ca.push(a), a.start()) : this.lo()
      }else {
        this.r(jk)
      }
    }else {
      this.Cq(a, !1, null)
    }
  }else {
    this.Xp(!1)
  }
};
d.ip = function() {
  var a = {};
  this.b.friendlyName && this.b.friendlyName != this.G.name && (a.name = this.b.friendlyName);
  this.b.timezone && this.b.timezone != this.G.timezone && (a.timezone = this.b.timezone);
  if(this.b.showOptInOptions) {
    var b = this.b.optIn;
    b.stats != this.G.opt_in.crash && (a.opt_in = a.opt_in || {}, a.opt_in.crash = b.stats);
    b.stats != this.G.opt_in.stats && (a.opt_in = a.opt_in || {}, a.opt_in.stats = b.stats);
    "device_id" in this.G.opt_in && b.deviceId != this.G.opt_in.device_id && (a.opt_in = a.opt_in || {}, a.opt_in.device_id = b.deviceId)
  }
  return a
};
d.Bq = function(a) {
  return a ? 60 != this.G.setup_state ? !0 : qj(a) ? !!this.b.networkPassword : a.ssid != this.G.ssid : !1
};
d.qs = function() {
  24 < this.b.friendlyName.length ? this.r(lk) : (this.b.connecting = !0, this.Xq())
};
d.qB = function() {
  this.ja(this.b.previousFlowId);
  this.Xq()
};
d.Mz = function(a) {
  w(!!this.F);
  var b = !1, c = new Fj(this.He, this.Y, this.G, function(a) {
    return a && 0 != a.wpa_auth && 4 != a.wpa_auth && 6 != a.wpa_auth && 8 != a.wpa_auth
  }, this.fa(function(c, f) {
    b || (this.ja(a), b = !0);
    this.b.networkOptions = c;
    if(!this.b.selectCustomNetwork) {
      var g = this.b.network;
      if(g) {
        var k = z(c, function(a) {
          return a.value.ssid == g.ssid
        }, this), g = k && k.value
      }else {
        0 <= f && (g = c[f].value)
      }
      this.b.network = g;
      this.b.networkName = g && g.ssid
    }
  }), this.fa(function() {
    this.r(nk)
  }));
  this.Ca.push(c);
  c.start()
};
d.Nz = function(a) {
  var b = this.fa(function(b, e) {
    e.ga() ? (this.b.supportedTimezones = b, this.b.timezone = a) : (this.b.supportedTimezones = [], this.b.timezone = null)
  }), b = new Kj(t(this.Y.Oz, this.Y), b, function(a) {
    return"flow-edit-device" != a
  });
  this.Ca.push(b);
  b.Sd()
};
d.ja = function(a) {
  a == this.b.flowId ? this.a.e("Updating flow to current state.") : (this.a.info("Flow updated to " + a), this.Ca = fb(this.Ca, function(b) {
    var c = b.cc(a);
    c && b.cancel();
    return!c
  }), "flow-setup-started" != a && (!this.b.flowId && a ? this.uo(!0) : !a && this.b.flowId && this.uo(!1), this.b.previousFlowId = this.b.flowId, this.b.flowId = a, a || (this.qb = 0, this.Ih(), this.ya && (this.ya.cancel(), this.ya = null), this.o && this.o.vo(!0), this.io(this.b), this.G = null, this.b.connecting = !1, this.mk()), "flow-select-device" == a && (this.Ih(), this.ya && (this.ya.cancel(), this.ya = null), this.b.device = null, this.b.deviceToSetup = "", this.o && this.o.vo(!1), this.ov()), 
  "flow-error" == a && (this.b.connecting = !1)))
};
d.tB = function() {
  return this.G ? !this.Bq(this.Uf()) && Eb(this.ip()) : !0
};
d.pB = function(a) {
  this.b.network = a.value;
  this.b.networkName = a.name;
  this.b.showNetworkOptions = !1;
  this.b.selectCustomNetwork = !1;
  this.b.networkPassword = ""
};
d.oB = function() {
  this.b.network = null;
  this.b.networkName = null;
  this.b.customNetworkSecurity = 1;
  this.b.selectCustomNetwork = !0;
  this.b.showNetworkOptions = !1;
  this.b.networkPassword = ""
};
d.Uf = function() {
  return this.b.selectCustomNetwork ? this.b.networkName ? {ssid:this.b.networkName, wpa_auth:this.b.customNetworkSecurity} : null : this.b.network
};
d.uB = function() {
  return!this.b.selectCustomNetwork && this.b.network && this.G && this.G.connected && this.b.network.ssid == this.G.ssid && 60 == this.G.setup_state
};
d.sB = function() {
  return!qj(this.b.selectCustomNetwork ? {ssid:"", wpa_auth:this.b.customNetworkSecurity} : this.b.network)
};
d.jB = function(a, b) {
  var c;
  a ? (c = (a.signal_level || 0) + 120, 100 < c && (c = 100), 0 > c && (c = 0), c = Math.ceil(c / 25), c = {"background-position":"0 " + -(b + 25 * c) + "px"}) : c = {display:"none"};
  return c
};
d.vB = function(a) {
  this.b.showNetworkOptions = !this.b.showNetworkOptions;
  this.b.showNetworkOptions && this.He.oA();
  a.stopPropagation()
};
d.mv = function(a) {
  "ChromeOS" == this.jo ? (a.allowAdd = !0, a.allowEdit = !0) : (a.allowAdd = !1, a.allowEdit = !1);
  a.onAddDevice = t(this.ko, this);
  a.onEditDevice = t(this.mB, this);
  a.onSetup = t(this.rB, this);
  a.onCancel = t(this.kB, this);
  a.onContinue = t(this.ro, this);
  a.onFactoryReset = t(this.nB, this);
  a.onNetworkOK = t(this.qs, this);
  a.onPasswordConfirmed = t(this.qB, this);
  a.updateFlow = t(this.ja, this);
  a.updateFlowAfterError = t(this.wB, this);
  a.onSave = t(this.qs, this);
  a.onDeviceSelected = t(this.lB, this);
  a.shouldHidePasswordField = t(this.uB, this);
  a.shouldDisablePasswordField = t(this.sB, this);
  a.networkNeedsPassword = qj;
  a.shouldDisableSaveButton = t(this.tB, this);
  a.toggleNetworkOptions = t(this.vB, this);
  a.onNetworkSelected = t(this.pB, this);
  a.onJoinOtherNetwork = t(this.oB, this);
  a.getNetworkIconStyle = t(this.jB, this);
  a.getNetwork = t(this.Uf, this);
  a.startSetup = t(this.qo, this);
  a.getButtonLabel = dk;
  a.os = this.jo;
  a.networkingApiSupported = !!this.F;
  a.flowId = null;
  a.castDeviceList = [];
  a.activeNetworkName = null;
  a.customNetworkSupportedSecurity = [{value:1, name:"None"}, {value:2, name:"WEP"}, {value:3, name:"WEP Shared"}, {value:5, name:"WPA PSK"}, {value:7, name:"WPA2 PSK"}];
  this.io(a)
};
d.io = function(a) {
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
  a.pin = []
};
d.lv = function() {
  if(!this.F) {
    return this.a.e("Failed to create a network monitor: networking api not available."), null
  }
  var a = new xj(this.F);
  P(a, "wifi-connected", this.fa(function(a) {
    this.mk();
    this.b.activeNetworkName = a.Lh.Name
  }));
  P(a, "wifi-disconnected", this.fa(function() {
    this.b.activeNetworkName = null;
    this.b.castDeviceList = [];
    this.Ih()
  }));
  return a
};
d.kv = function() {
  if(!this.Zc) {
    return null
  }
  var a = new vj(this.Zc);
  P(a, "device-list-updated", this.fa(function(a) {
    a = a.Sq;
    var c = null;
    if(1 == a.length) {
      c = a[0]
    }else {
      if(this.b.castDevice) {
        var e = this.b.castDevice.udn, c = z(a, function(a) {
          return a.udn == e
        })
      }
    }
    this.b.castDeviceList = a;
    this.b.castDevice = c
  }));
  return a
};
d.ko = function() {
  this.F ? (this.qb = 1, this.ja("flow-select-device")) : this.ja("flow-network-api-unavailable")
};
d.ho = function(a, b, c) {
  c.ga() ? (this.G = b, (b = this.po(b)) ? b.nonce != a ? (this.a.t("Invalid nonce value received."), this.fa(function() {
    this.r(jk)
  })()) : (a = new Kj(t(this.F.verifyDestination, this.F, b), t(this.Yv, this), null), this.Ca.push(a), a.start()) : this.fa(function() {
    this.r(jk)
  })()) : (this.a.t("eurekaInfo failed."), this.fa(function() {
    this.r(nk)
  })())
};
d.Yv = function(a) {
  if(a) {
    if(this.Y.setVersion(this.G.version.toString()), this.sv(), 2 != this.qb && (a = new Oj(this.Y), this.Ca.push(a), a.start()), 21 == this.G.setup_state || 31 == this.G.setup_state || 11 == this.G.setup_state) {
      var b = this.rv().qv(this.G.sign.certificate);
      b ? this.fa(function() {
        this.b.pin = b;
        this.ja("flow-confirm-pin")
      })() : this.fa(function() {
        this.r(fk)
      })()
    }else {
      this.a.info("WPA already configured. Skip pin."), this.fa(this.qo)()
    }
  }else {
    this.G = null, this.fa(function() {
      this.r(jk)
    })()
  }
};
d.qo = function() {
  this.ja("flow-connect-to-device");
  var a = null, a = 1 == this.qb ? "flow-select-network" : "flow-edit-device";
  this.ya && this.ya.Hh(!1);
  this.b.pin = [];
  this.b.connecting = !1;
  this.b.timezone = null;
  this.b.supportedTimezones = [];
  this.b.selectCustomNetwork = null;
  this.b.network = null;
  this.b.networkPassword = "";
  this.b.showNetworkPassword = !1;
  this.b.showOptInOptions = "flow-edit-device" == a;
  this.G.opt_in && (this.b.optIn = {stats:this.G.opt_in.crash && this.G.opt_in.stats, deviceId:this.G.opt_in.device_id});
  this.b.friendlyName = 1 != this.qb ? this.G.name : "";
  "flow-edit-device" == a && this.Nz(this.G.timezone);
  this.Mz(a)
};
d.mB = function() {
  if(this.F) {
    w(!!this.o);
    this.b.deviceToSetup = this.b.castDevice.name;
    this.ja("flow-connect-to-device");
    this.Y.lk(this.b.castDevice.ipAddress);
    this.o.nq();
    var a = this.fo(), b = t(function(a, b, c) {
      c.ga() && 61 == b.setup_state ? (this.Ge = b.hotspot_bssid, this.qb = 3, this.fa(function() {
        this.ja("flow-setup-notice")
      })()) : (this.qb = 2, this.ho(a, b, c))
    }, this, a), c = t(function(b) {
      return this.Y.Fh(b, ["sign"], a)
    }, this), b = new Kj(c, b, null);
    this.Ca.push(b);
    b.Sd()
  }else {
    this.ja("flow-network-api-unavailable")
  }
};
d.rB = function() {
  w(!!this.o);
  this.b.deviceToSetup = this.b.device.Name;
  this.Ge = this.b.device.WiFi.BSSID;
  this.o.nq();
  this.ja("flow-setup-notice")
};
d.kB = function() {
  this.ja(null)
};
d.ro = function() {
  this.ja("flow-connect-to-device");
  this.Ge || this.a.e("Hotspot BSSID is not set");
  if(pj({WiFi:{BSSID:this.Ge}})) {
    var a = t(function(a) {
      this.a.info("Hotspot connected.");
      this.Y.lk("192.168.255.249");
      w(!!this.F);
      w(!!this.o);
      var b = this.fa(t(this.r, this, kk));
      this.ya = new Nj(this.F, this.o, b);
      this.ya.start(a);
      var c = this.fo();
      a = t(function(a) {
        return this.Y.Fh(a, ["sign"], c)
      }, this);
      a = new Kj(a, t(this.ho, this, c), null);
      this.Ca.push(a);
      a.Sd()
    }, this), b = this.fa(t(this.r, this, kk)), c = t(function(a) {
      return a && a.WiFi && !qa(a.WiFi.BSSID, this.Ge || "")
    }, this);
    w(!!this.F);
    w(!!this.o);
    a = Jj(this.F, this.o, a, b);
    this.Ca.push(a);
    a.start(c)
  }else {
    this.a.t("Trying to connect to non-Chromekey network."), this.r(jk)
  }
};
d.nB = function() {
  w(!!this.o);
  if(this.xx("Are you sure your Chromecast needs a fresh start? This will erase all settings from your Chromecast.")) {
    this.b.nameAfterFactoryReset = null;
    this.ja("flow-factory-reset");
    var a = "uuid:" + this.G.ssdp_udn, b = this.fa(function(b) {
      this.xa.ok(a);
      this.mk();
      this.b.nameAfterFactoryReset = b.Name
    }), c = this.fa(function() {
      this.r(fk)
    }), e = [], f = this.G.hotspot_bssid, g = function(a) {
      return!B(e, a.Name) && !qa(f, a.WiFi.BSSID)
    }, k = this.o.kk(g);
    y(k, function(a) {
      e.push(a.Name)
    });
    k = t(function(a, e) {
      w(!!this.o);
      if(e.ga()) {
        var f = new Gj(this.o, b, c);
        this.Ca.push(f);
        f.start(g, 6E4, 18E4)
      }else {
        c()
      }
    }, this);
    k = new Kj(t(this.Y.yx, this.Y, "fdr"), k, null);
    this.Ca.push(k);
    k.Sd()
  }
};
d.wB = function(a) {
  this.b.error = {};
  if("flow-error" != this.b.flowId) {
    this.a.t("Trying to invoke error action " + a + " from non-error flow " + this.b.flowId), this.r(fk)
  }else {
    var b = this.b.previousFlowId;
    if("verify-setup" != a && "retry-setup" != a || "flow-edit-device" != !b || "flow-select-network" != !b) {
      switch(a) {
        case "pop-previous-state":
          this.ja(b);
          break;
        case "verify-setup":
          this.b.connecting = !0;
          this.ja(b);
          this.oo();
          break;
        case "retry-setup":
          this.Ge = this.G.hotspot_bssid;
          2 == this.qb && (this.qb = 3);
          this.ro();
          break;
        case "reinit-setup":
          this.ja(1 == this.qb ? "flow-select-device" : null);
          break;
        case "cancel-setup":
          this.ja(null);
          break;
        case "succeeed-setup":
          this.qk(!1);
          break;
        default:
          this.a.t("Invalid error action found: " + a), this.r(fk)
      }
    }else {
      this.a.t("Trying to perform error action " + a + " with wrong pre-error flow: " + b), this.r(fk)
    }
  }
};
d.lB = function(a, b, c) {
  this.b[c] = this.b[b][a]
};
d.qk = function(a) {
  this.o && this.o.rp();
  a ? this.r(rk) : (1 == this.qb && chrome.tabs.getCurrent(function(a) {
    w(!!a);
    chrome.windows.update(a.windowId, {focused:!0}, function() {
      chrome.tabs.update(a.id, {url:"https://cast.google.com/chromecast/setup?np=fi", active:!0})
    })
  }), this.ja(null))
};
d.nv = function() {
  var a = function(a) {
    return a && a.location && a.location.href ? "true" == (new U(a.location.href)).uk().get("showFlow") : !1
  };
  return this.o && (a(window) || a(window.parent))
};
d.sc = function() {
  this.ja(null);
  this.o && (le(this.o), this.o.V());
  this.xa && (le(this.xa), this.xa.V());
  this.He.V();
  this.Vf.mo(this.Vf.Nq());
  this.b = null
};
d.sv = function() {
  var a = null;
  this.G && (a = this.Y.JC("/setup/get_log_report").toString());
  this.Vf.jt(a)
};
d.uo = function(a) {
  var b = window;
  b && b.parent && b.parent.notifyChromekeySetupActive && b.parent.notifyChromekeySetupActive(a)
};
d.Ih = function() {
  this.Vf.jt(null)
};
d.xx = function(a) {
  return confirm(a)
};
d.fa = function(a) {
  var b = this, c = this.b;
  return function() {
    var e = arguments;
    c.$apply(function() {
      a.apply(b, e)
    })
  }
};
d.rv = function() {
  this.ev || (this.ev = new ek);
  return this.ev
};
d.fo = function() {
  return Ga()
};
var vk = function(a) {
  setTimeout(a, 0)
};
var wk = function() {
  this.Kb = [];
  this.Zb = {}
};
v(wk, N);
d = wk.prototype;
d.Bh = 1;
d.Zj = 0;
d.rG = function(a, b, c) {
  var e = this.Zb[a];
  e || (e = this.Zb[a] = []);
  var f = this.Bh;
  this.Kb[f] = a;
  this.Kb[f + 1] = b;
  this.Kb[f + 2] = c;
  this.Bh = f + 3;
  e.push(f);
  return f
};
d.sG = function(a, b, c) {
  if(a = this.Zb[a]) {
    var e = this.Kb;
    if(a = z(a, function(a) {
      return e[a + 1] == b && e[a + 2] == c
    })) {
      return this.Uj(a)
    }
  }
  return!1
};
d.Uj = function(a) {
  if(0 != this.Zj) {
    return this.nh || (this.nh = []), this.nh.push(a), !1
  }
  var b = this.Kb[a];
  if(b) {
    var c = this.Zb[b];
    c && nb(c, a);
    delete this.Kb[a];
    delete this.Kb[a + 1];
    delete this.Kb[a + 2]
  }
  return!!b
};
d.oz = function(a, b) {
  var c = this.Zb[a];
  if(c) {
    this.Zj++;
    for(var e = rb(arguments, 1), f = 0, g = c.length;f < g;f++) {
      var k = c[f];
      this.Kb[k + 1].apply(this.Kb[k + 2], e)
    }
    this.Zj--;
    if(this.nh && 0 == this.Zj) {
      for(;c = this.nh.pop();) {
        this.Uj(c)
      }
    }
    return 0 != f
  }
  return!1
};
d.clear = function(a) {
  if(a) {
    var b = this.Zb[a];
    b && (y(b, this.Uj, this), delete this.Zb[a])
  }else {
    this.Kb.length = 0, this.Zb = {}
  }
};
d.K = function(a) {
  if(a) {
    var b = this.Zb[a];
    return b ? b.length : 0
  }
  a = 0;
  for(b in this.Zb) {
    a += this.K(b)
  }
  return a
};
d.j = function() {
  wk.q.j.call(this);
  delete this.Kb;
  delete this.Zb;
  delete this.nh
};
var xk = function() {
  this.configId = this.dx = this.ff = this.$k = this.ql = this.appUrl = this.ipAddress = this.friendlyName = this.deviceLabel = this.je = null
};
xk.prototype.hd = function() {
  return this.deviceLabel ? this.je ? this.friendlyName ? this.ipAddress ? this.appUrl ? this.ql ? this.$k ? null : "Missing expireTimeMillis" : "Missing fetchTimeMillis" : "Missing appUrl" : "Missing ipAddress" : "Missing friendlyName" : "Missing uniqueId" : "Missing deviceLabel"
};
xk.prototype.toString = function() {
  return JSON.stringify(this, function(a, b) {
    return s(b) && 0 == b.indexOf("uuid:") ? "***" : b
  })
};
var zk = function(a) {
  this.ie = new E;
  this.bd = new Qb;
  a || (yk || (yk = new hh(3, null, 1, 10, 2E3)), a = yk);
  this.Vb = a;
  this.a = H("cv.DeviceDescriptionService")
}, yk = null;
d = zk.prototype;
d.Fp = function(a, b) {
  var c = this.PF(a);
  c ? b(c, null) : this.bd.contains(a.deviceLabel) ? b(null, "Duplicate request for device " + a.deviceLabel) : this.QF(a, b)
};
d.cF = function() {
  this.bd.U().forEach(t(function(a) {
    this.Vb.abort(a, !0)
  }, this))
};
d.PF = function(a) {
  var b = this.ie.get(a.deviceLabel);
  return b ? b.configId != a.configId || u() >= b.$k ? (this.a.w("Removing invalid entry " + b.toString()), this.ie.remove(a.deviceLabel), null) : b : null
};
d.QF = function(a, b) {
  this.bd.add(a.deviceLabel);
  this.Vb.send(a.deviceLabel, a.deviceDescriptionUrl, "GET", null, null, 0, t(this.eF, this, a, b))
};
d.eF = function(a, b, c) {
  this.bd.remove(a.deviceLabel);
  c = c.target;
  this.xi("fetchDeviceDescription", "GET", c);
  if(c.ga()) {
    var e = c.Lp();
    e ? (c = this.Hx(c, a, e)) ? (this.a.w("Got device description " + c.toString()), null != c.configId && (this.a.info("Caching device description for " + c.deviceLabel), this.ie.set(a.deviceLabel, c)), b(c, null)) : b(null, "Invalid device description") : b(null, "Invalid or empty response")
  }else {
    b(null, "Request to " + c.hi() + " failed")
  }
};
d.Hx = function(a, b, c) {
  var e = new xk;
  e.ql = u();
  e.$k = e.ql + 18E5;
  e.deviceLabel = b.deviceLabel;
  e.configId = b.configId;
  e.appUrl = a.getResponseHeader("Application-URL") || null;
  e.ipAddress = Uf(e.appUrl).zc();
  e.ff = Ak(c, "deviceType");
  e.dx = Ak(c, "modelName");
  e.friendlyName = Ak(c, "friendlyName");
  if(a = e.friendlyName) {
    a = Ba(a, 200), a = wa(a)
  }
  e.friendlyName = a;
  e.je = Ak(c, "UDN");
  a = e.hd();
  this.a.info("Device description: " + Bk(c));
  return a ? (this.a.e("Device description failed to validate (" + a + "): " + JSON.stringify(e)), null) : e
};
var Ak = function(a, b) {
  var c = a.getElementsByTagName(b);
  return c && 0 != c.length ? c[0].textContent : null
}, Bk = function(a) {
  var b = function(a) {
    for(var b = 0, f = a.length;b < f;b++) {
      a[b].textContent = "***"
    }
  };
  b(a.getElementsByTagName("UDN"));
  b(a.getElementsByTagName("serialNumber"));
  return(new XMLSerializer).serializeToString(a)
};
zk.prototype.xi = function(a, b, c) {
  a = "[" + a + "]: " + b + " " + c.hi() + " => " + c.ua() + " (" + c.Ik() + ")";
  c.ga() ? this.a.info(a) : (a += ", error = " + c.Jh() + " (" + c.Fe() + ")", this.a.e(a))
};
var Ck = function(a, b) {
  w(a || b, "Must specify one of localData or registryData");
  this.Ra = a || null;
  this.Nb = b || null;
  this.mu = new E
};
d = Ck.prototype;
d.Ka = function() {
  return this.Ra
};
d.py = function(a) {
  w(a);
  this.Ra = a
};
d.zy = function() {
  this.Ra && (this.Ra.Ld = !0)
};
d.up = function() {
  return this.Nb
};
d.Ay = function() {
  this.Nb && (this.Nb.Ld = !0)
};
d.Kl = function() {
  return(!this.Ra || this.Ra.Ld) && (!this.Nb || this.Nb.Ld)
};
d.c = function() {
  return this.Ra ? this.Ra.id : this.Nb.id
};
d.cs = function() {
  return!this.Ra || this.Ra.Ld ? this.Nb.id : this.Ra.je
};
d.Qh = function() {
  return this.Ra && !this.Ra.Ld ? this.Ra.friendlyName : this.Nb && !this.Nb.Ld ? this.Nb.friendlyName : ""
};
d.jl = function(a) {
  return this.mu.get(a, "unknown")
};
d.af = function(a, b) {
  w("available" == b || "unavailable" == b);
  this.mu.set(a, b)
};
d.PB = function() {
  return"available" == this.jl("ChromeCast")
};
d.qg = function() {
  return null != this.Ra && this.Ra.qg
};
Ck.prototype.isLocal = function() {
  return null != this.Ka()
};
var Dk = function(a, b, c, e, f, g, k, l) {
  this.id = a;
  this.ff = b;
  this.friendlyName = c;
  this.je = e;
  this.ipAddress = f;
  this.appUrl = g;
  this.configId = k || null;
  this.Ld = !1;
  this.Bl = l || u();
  this.qg = !1;
  this.hd()
};
Dk.prototype.a = H("cv.Receiver.LocalData");
Dk.prototype.equals = function(a) {
  return this.id == a.id && this.ff == a.ff && this.friendlyName == a.friendlyName && this.ipAddress == a.ipAddress && this.appUrl == a.appUrl
};
Dk.prototype.hd = function() {
  w(this.id, "id not set");
  w(this.je, "uniqueId not set");
  w(this.ipAddress, "ipAddress not set");
  w(this.appUrl, "appUrl not set")
};
var Ek = function(a, b, c) {
  this.id = a;
  this.friendlyName = b;
  this.Ld = !1;
  this.Bl = c || u();
  this.iu = "appEngine"
};
Ek.prototype.equals = function(a) {
  return this.id == a.id && this.friendlyName == a.friendlyName
};
Ck.prototype.Ap = function() {
  return null != this.Nb && "cloud" == this.Nb.iu
};
var Fk = function(a, b) {
  var c = new Ek(a, b + " (Cloud)");
  c.iu = "cloud";
  c = new Ck(null, c);
  c.af("ChromeCast", "available");
  return c
};
Ck.prototype.ys = function() {
  var a = new Xc(this.c(), this.Qh());
  this.Ka() && (a.ipAddress = this.Ka().ipAddress);
  return a
};
var Gk = function(a) {
  this.mi = a || new zk;
  this.ed = t(this.jd, this);
  this.rg = t(this.Cy, this);
  this.Cg = !1;
  this.Ec = 0;
  this.a = H("cv.DialService")
};
v(Gk, N);
d = Gk.prototype;
d.qC = function(a) {
  this.wu = a
};
d.sC = function(a) {
  this.tg = a
};
d.rC = function(a) {
  this.Dj = a
};
d.D = function() {
  w(this.wu);
  w(this.tg);
  w(this.Dj);
  this.start()
};
d.start = function() {
  this.Cg ? this.a.info("Already started.") : (this.a.info("Starting..."), chrome.dial ? (chrome.dial.onDeviceList.addListener(this.ed), chrome.dial.onError.addListener(this.rg), this.Cg = !0) : this.a.e("Dial API not available, aborting start..."))
};
d.stop = function() {
  this.Cg ? (chrome.dial.onDeviceList.removeListener(this.ed), chrome.dial.onError.removeListener(this.rg), this.Cg = !1) : this.a.info("Was not started.")
};
d.j = function() {
  this.stop()
};
d.discoverNow = function() {
  this.Cg ? chrome.dial.discoverNow(t(function(a) {
    this.a.info("chrome.dial.discoverNow = " + a)
  }, this)) : this.a.info("Not started. Ignoring discover().")
};
d.Rg = function(a, b, c) {
  this.mi.Fp(a, function(e, f) {
    f ? c(f) : b(new Dk("local:" + a.deviceLabel, e.ff, e.friendlyName, e.je, e.ipAddress, e.appUrl))
  })
};
d.jd = function(a) {
  this.a.info("chrome.dial.onDeviceList: " + JSON.stringify(a));
  0 == a.length ? this.Rp() : (this.Ec += a.length, y(a, t(function(a) {
    this.Rg(a, t(this.Pl, this), t(this.Fi, this))
  }, this)))
};
d.Pl = function(a) {
  0 != this.Ec && (this.wu(a), this.Ec--, 0 == this.Ec && this.tg())
};
d.Fi = function(a) {
  0 != this.Ec && (this.a.e("Unable to process device: " + a), this.Ec--, 0 == this.Ec && this.tg())
};
d.Cy = function(a) {
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
      this.Rp();
      break;
    default:
      this.a.e("Unhandled DIAL error: " + a.code)
  }
};
d.Rp = function() {
  this.mi.cF();
  this.Ec = 0;
  this.Dj()
};
var Hk = function() {
};
var Ik = function(a, b) {
  Q.call(this);
  this.ne = a;
  this.xq = b;
  this.B = new R(this);
  this.fb = new E;
  this.Ye = new Qb;
  this.ne.qC(t(this.pC, this));
  this.ne.sC(t(this.tg, this));
  this.ne.rC(t(this.Dj, this))
};
v(Ik, Q);
Ik.prototype.a = H("cv.DiscoveryService");
var Jk = function() {
  O.call(this, "receiver_list")
};
v(Jk, O);
var Kk = function(a) {
  O.call(this, "remove_receiver");
  this.receiver = a
};
v(Kk, O);
d = Ik.prototype;
d.og = function() {
  var a = fb(this.fb.U(), function(a) {
    return!a.Kl()
  });
  a.sort(function(a, c) {
    return a.id < c.id ? -1 : a.id == c.id ? 0 : 1
  });
  return a
};
d.refresh = function() {
  this.ne.discoverNow()
};
d.register = function(a) {
  this.fb.Aa(a.c()) || (this.a.info("Registering receiver with id " + a.c()), this.fb.set(a.c(), a), this.ef())
};
d.Gp = function(a) {
  for(var b = this.fb.Ua(), c = 0, e = b.length;c < e;c++) {
    var f = this.fb.get(b[c]);
    f && a(f) && (this.fb.remove(b[c]), this.yq(f))
  }
  this.ef()
};
d.Av = function(a) {
  return(a = this.fb.get(a, null)) && a.Kl() ? null : a
};
d.uD = function(a) {
  var b = 0 <= ve.indexOf(a) ? "ChromeCast" : a;
  return fb(this.og(), function(a) {
    return"available" == a.jl(b)
  })
};
d.$o = function() {
  this.ef()
};
d.pC = function(a) {
  this.eH(a)
};
d.tg = function() {
  this.a.info("onDevicesFinished");
  this.Eq(this.Ye, !0, !1) && this.ef();
  this.Ye.clear()
};
d.Dj = function() {
  this.Ye.clear();
  this.Eq(this.Ye, !0, !1) && this.ef()
};
d.Eq = function(a, b, c) {
  for(var e = !1, f = this.fb.Ua(), g = 0, k = f.length;g < k;g++) {
    if(!a.contains(f[g])) {
      var l = this.fb.get(f[g]);
      b && !l.qg() && l.zy();
      c && !l.qg() && l.Ay();
      l.Kl() && (this.a.info("Removing receiver " + f[g] + " from map."), this.fb.remove(f[g]), this.yq(l), e = !0)
    }
  }
  return e
};
d.eH = function(a) {
  var b = !1;
  this.Ye.add(a.id);
  var c = this.fb.get(a.id);
  c ? c.Ka().equals(a) ? c.Ka().Bl = a.Bl : (this.a.info("Merging with existing receiver " + c.Ka().id), c.py(a), b = !0) : (c = new Ck(a, null), this.a.info("Adding new receiver " + c.Ka().id), this.fb.set(a.id, c), b = !0);
  c.Ka().hd();
  b && this.ef()
};
d.ef = function() {
  this.dispatchEvent(new Jk(this.og()))
};
d.yq = function(a) {
  this.dispatchEvent(new Kk(a))
};
d.j = function() {
  this.Ye.clear();
  this.fb.clear();
  this.fb = null;
  this.B.V();
  Ik.q.j.call(this)
};
var Lk = function(a, b, c) {
  Re.call(this);
  this.a = H("cv.sender.ChannelService");
  this.gw = b;
  this.rk = c || null;
  this.cf = null;
  this.P = a
};
v(Lk, Re);
d = Lk.prototype;
d.D = function() {
  Lk.q.D.call(this);
  this.Va.listen(this.P, "remove_receiver", this.$A)
};
d.$A = function(a) {
  this.Vd(a.receiver.c())
};
d.Ze = function(a) {
  this.a.info("Attempting to create a channel to " + a.c());
  if(!(a instanceof Ck)) {
    return Ee("Sender-to-sender connection is not supported")
  }
  var b;
  a.Ka() ? (this.a.info("Creating local channel..."), b = this.gw.Ze(a)) : b = this.rw(a);
  S(function() {
    "pending" == b.T() && (this.a.info("Channel creation timeout"), b.cancel())
  }, 8E3, this);
  return Je(b, function(a) {
    return this.sw(a.Ea())
  }, this)
};
d.rw = function(a) {
  if(!a.up()) {
    return Ee("No registry data: " + a.c())
  }
  if(a.Ap()) {
    return null != this.cf ? (this.a.info("Creating Cloud LCS channel..."), this.cf.Ze(a)) : Ee("No proper cloud channel factory exists")
  }
  this.a.info("Creating AppEngine channel...");
  return this.rk.Ze(a)
};
d.kx = function(a) {
  w(null == this.cf);
  this.cf = a
};
d.sw = function(a) {
  if(a.qa()) {
    return De(a)
  }
  if(a.yB()) {
    return Ee(a.getError() || "New channel to " + a.S + "was disconnected already.")
  }
  var b = new K;
  ie(a, "a", function(c) {
    "pending" == b.T() && ("connected" == c.hg ? b.la(a) : b.cb(a.getError() || "Error creating channel to " + a.S))
  }, void 0, this);
  S(function() {
    a.xB() && a.disconnect("Channel is not connected in 3 seconds")
  }, 3E3, this);
  return b
};
var Mk = function() {
  this.IC = this.Ck = null;
  this.$s = []
}, Nk = function() {
  this.imageUrl = this.description = null
}, Ok = function() {
  this.name = "unknown";
  this.state = "error";
  this.GC = null;
  this.FC = !0;
  this.Hj = this.serviceData = this.HC = null;
  this.extraData = {}
}, Qk = function(a, b) {
  w(a.Ka(), "Receiver must be available via LAN to support DIAL.");
  this.Da = a;
  var c;
  (c = b) || (Pk || (Pk = new hh(3, null, 1, 10, 2E3)), c = Pk);
  this.Vb = c;
  this.a = H("cv.DialClient")
}, Pk = null, Rk = 999;
d = Qk.prototype;
d.launchApp = function(a, b, c) {
  var e = (++Rk).toString();
  this.Vb.send(e, this.In(a), "POST", c, null, 0, this.Au("launchApp", "POST", b));
  return e
};
d.Bp = function(a, b) {
  var c = (++Rk).toString();
  this.Vb.send(c, this.In(a), "DELETE", null, null, 0, this.Au("stopApp", "DELETE", b), 0);
  return c
};
d.Lo = function(a) {
  var b = (++Rk).toString();
  this.Vb.send(b, this.Da.Ka().appUrl, "GET", null, null, 0, t(this.Et, this, a));
  return b
};
d.Bk = function(a, b) {
  var c = (++Rk).toString();
  this.Vb.send(c, this.In(a), "GET", null, null, 0, t(this.Et, this, b));
  return c
};
d.Et = function(a, b) {
  var c = b.target;
  this.xi("GetAppInfo", "GET", c);
  if(c.ga()) {
    var e = c.Lp();
    e || (e = kj(c.Ob()));
    if(e) {
      var f = e.getElementsByTagName("service");
      if(f && 1 == f.length) {
        for(var e = new Ok, g = 0, k = f[0].childNodes.length;g < k;g++) {
          var l = f[0].childNodes[g];
          if("state" == l.nodeName) {
            e.state = l.textContent
          }else {
            if("name" == l.nodeName) {
              e.name = l.textContent
            }else {
              if("link" == l.nodeName) {
                e.HC = l.getAttribute("href")
              }else {
                if("options" == l.nodeName) {
                  e.FC = "true" == l.getAttribute("allowStop")
                }else {
                  if("servicedata" == l.nodeName && "urn:chrome.google.com:cast" == l.namespaceURI) {
                    for(var r = e, A = new Mk, C = 0, L = l.childNodes.length;C < L;C++) {
                      var J = l.childNodes[C];
                      if("connectionSvcURL" == J.nodeName) {
                        A.Ck = J.textContent
                      }else {
                        if("applicationContext" == J.nodeName) {
                          A.IC = J.textContent
                        }else {
                          if("protocols" == J.nodeName) {
                            for(var gg = 0;gg < J.childNodes.length;gg++) {
                              var Xi = J.childNodes[gg];
                              "protocol" == Xi.nodeName && A.$s.push(Xi.textContent)
                            }
                          }
                        }
                      }
                    }
                    r.serviceData = A
                  }else {
                    if("activity-status" == l.nodeName && "urn:chrome.google.com:cast" == l.namespaceURI) {
                      r = e;
                      A = new Nk;
                      C = 0;
                      for(L = l.childNodes.length;C < L;C++) {
                        J = l.childNodes[C], "description" == J.nodeName ? A.description = J.textContent : "image" == J.nodeName && (A.imageUrl = J.getAttribute("src"))
                      }
                      r.Hj = A
                    }else {
                      e.extraData[l.nodeName] = l.textContent
                    }
                  }
                }
              }
            }
          }
        }
        if("unknown" == e.name) {
          a(c, null, "GET response missing name value")
        }else {
          if("error" == e.state) {
            a(c, null, "GET response missing state value")
          }else {
            if((f = /installable=(.+)/.exec(e.state)) && f[1]) {
              e.state = "installable", e.GC = f[1]
            }else {
              if("running" != e.state && "stopped" != e.state) {
                a(c, null, "GET response has invalid state value");
                return
              }
            }
            a(c, e, null)
          }
        }
      }else {
        a(c, null, "Invalid GET response (invalid service)")
      }
    }else {
      a(c, null, "Empty response")
    }
  }else {
    a(c, null, "Request to " + c.hi() + " failed")
  }
};
d.In = function(a) {
  var b = this.Da.Ka().appUrl;
  "/" != b.charAt(b.length - 1) && (b += "/");
  return b + a
};
d.abort = function(a) {
  this.Vb.abort(a)
};
d.xi = function(a, b, c) {
  b = "[" + a + "]: " + b + " " + c.hi() + " => " + c.ua() + " (" + c.Ik() + ")";
  c.ga() ? (this.a.info(b), (c = c.Ob()) && 0 < c.length && this.a.w("[" + a + "]: " + c)) : (b += ", error = " + c.Jh() + " (" + c.Fe() + ")", this.a.info(b))
};
d.Au = function(a, b, c) {
  return t(function(e) {
    e = e.target;
    this.xi(a, b, e);
    c(e)
  }, this)
};
var Sk = function(a, b, c, e, f, g, k, l, r) {
  this.id = a;
  this.receiver = new Xc(b.id, za(b.name));
  this.iconUrl = c || null;
  this.title = e || "";
  this.isInLaunch = f;
  this.mediaPlayerStatus = g || null;
  this.tabId = k || null;
  this.isLocal = l;
  this.activityType = r
}, Tk = function(a, b) {
  this.receiver = new Xc(a.id, za(a.name));
  this.activity = b
}, Uk = function(a, b, c, e, f, g, k) {
  this.id = a;
  this.title = b;
  this.message = c;
  this.defaultActionText = e;
  this.optActionText = f || "";
  this.severity = g || "fatal";
  this.activityId = k || null
}, Vk = function(a, b, c, e) {
  this.captureSurface = a || "tab";
  this.lowFpsMode = b || !1;
  this.castAppNotificationDismissed = c || !1;
  this.mirrorQualityId = e || Gd.id
}, Wk = function(a, b, c, e, f) {
  this.receiverActs = a || [];
  this.issue = b;
  this.isAppInTab = f || !1;
  this.castOfCurrentTab = c;
  this.settings = e || new Vk("tab")
};
var Yk = function(a, b) {
  this.xe = a || null;
  this.ie = !!b;
  this.O = new E;
  this.N = new Xk("", void 0);
  this.N.next = this.N.Cb = this.N
};
d = Yk.prototype;
d.fu = function(a) {
  (a = this.O.get(a)) && this.ie && (a.remove(), this.Ot(a));
  return a
};
d.get = function(a, b) {
  var c = this.fu(a);
  return c ? c.value : b
};
d.set = function(a, b) {
  var c = this.fu(a);
  c ? c.value = b : (c = new Xk(a, b), this.O.set(a, c), this.Ot(c))
};
d.VF = function() {
  return this.N.Cb.value
};
d.shift = function() {
  return this.Lt(this.N.next)
};
d.pop = function() {
  return this.Lt(this.N.Cb)
};
d.remove = function(a) {
  return(a = this.O.get(a)) ? (this.removeNode(a), !0) : !1
};
d.removeNode = function(a) {
  a.remove();
  this.O.remove(a.key)
};
d.K = function() {
  return this.O.K()
};
d.nb = function() {
  return this.O.nb()
};
d.Ua = function() {
  return this.map(function(a, b) {
    return b
  })
};
d.U = function() {
  return this.map(function(a) {
    return a
  })
};
d.contains = function(a) {
  return this.some(function(b) {
    return b == a
  })
};
d.Aa = function(a) {
  return this.O.Aa(a)
};
d.clear = function() {
  this.zt(0)
};
d.forEach = function(a, b) {
  for(var c = this.N.next;c != this.N;c = c.next) {
    a.call(b, c.value, c.key, this)
  }
};
d.map = function(a, b) {
  for(var c = [], e = this.N.next;e != this.N;e = e.next) {
    c.push(a.call(b, e.value, e.key, this))
  }
  return c
};
d.some = function(a, b) {
  for(var c = this.N.next;c != this.N;c = c.next) {
    if(a.call(b, c.value, c.key, this)) {
      return!0
    }
  }
  return!1
};
d.every = function(a, b) {
  for(var c = this.N.next;c != this.N;c = c.next) {
    if(!a.call(b, c.value, c.key, this)) {
      return!1
    }
  }
  return!0
};
d.Ot = function(a) {
  this.ie ? (a.next = this.N.next, a.Cb = this.N, this.N.next = a, a.next.Cb = a) : (a.Cb = this.N.Cb, a.next = this.N, this.N.Cb = a, a.Cb.next = a);
  null != this.xe && this.zt(this.xe)
};
d.zt = function(a) {
  for(var b = this.O.K();b > a;b--) {
    this.removeNode(this.ie ? this.N.Cb : this.N.next)
  }
};
d.Lt = function(a) {
  this.N != a && this.removeNode(a);
  return a.value
};
var Xk = function(a, b) {
  this.key = a;
  this.value = b
};
Xk.prototype.remove = function() {
  this.Cb.next = this.next;
  this.next.Cb = this.Cb;
  delete this.Cb;
  delete this.next
};
var Zk = chrome.i18n.getMessage("8879729374562274188"), $k = chrome.i18n.getMessage("9217039427324387516"), al = chrome.i18n.getMessage("872641383564597641"), bl = chrome.i18n.getMessage("7864119253243497594"), cl = chrome.i18n.getMessage("1104234694810969409"), dl = chrome.i18n.getMessage("2884726392788153618"), el = chrome.i18n.getMessage("4687947362658561907"), fl = chrome.i18n.getMessage("2942203478948533213"), gl = chrome.i18n.getMessage("8847227464712783239"), hl = chrome.i18n.getMessage("7661531377295243900"), 
il = chrome.i18n.getMessage("2480373522051304868"), jl = chrome.i18n.getMessage("3268013795447421317"), kl = chrome.i18n.getMessage("8119187687393606810"), ll = chrome.i18n.getMessage("5453859777568475949"), ml = chrome.i18n.getMessage("6181212922679547742"), nl = chrome.i18n.getMessage("3051639087648999069"), ol = chrome.i18n.getMessage("4223394109936547558");
chrome.i18n.getMessage("8288732448265345962");
chrome.i18n.getMessage("1318160328466758792");
var pl = chrome.i18n.getMessage("5849296180435940955");
var ql = function(a, b) {
  this.title = a;
  this.message = b
}, rl = {};
rl.activity_error = new ql(Zk, $k);
rl.channel_error = new ql(al, bl);
rl.launch_failure = new ql(cl, dl);
rl.device_offline = new ql(el, fl);
rl.bad_device = new ql(gl, hl);
rl.session_quality_network = new ql(il, jl);
rl.session_quality_encoding = new ql(kl, ll);
rl.unsupported_plugin_detected = new ql(ml, nl);
var sl = function(a, b) {
  this.displayText = a;
  this.Wa = b
}, tl = new sl(ol), ul = function(a) {
  return new sl(pl, function() {
    window.open(a)
  })
}, vl = function(a, b, c, e, f, g, k) {
  this.id = Ga();
  this.timestamp = (new Date).getTime();
  this.type = a;
  this.title = b;
  this.message = c;
  this.defaultAction = e;
  this.optAction = f;
  this.severity = g || "fatal";
  this.activityId = k || null
};
vl.prototype.lA = function() {
  return new Uk(this.id, this.title, this.message, this.defaultAction.displayText, this.optAction ? this.optAction.displayText : null, this.VG(this.severity), this.activityId)
};
vl.prototype.VG = function(a) {
  return"fatal" == a ? "fatal" : "warning"
};
var $ = function() {
  Q.call(this);
  this.Rc = new Yk
};
v($, Q);
da($);
$.addIssue = function(a, b, c, e, f, g, k) {
  a = new vl(a, e || rl[a].title, f || rl[a].message, b, c, g || "fatal", k);
  $.I().addIssue(a);
  return a.id
};
$.prototype.j = function() {
  $.q.j.call(this);
  this.Rc.clear()
};
$.prototype.ej = function() {
  return 0 < this.Rc.K()
};
$.prototype.addIssue = function(a) {
  this.Rc.set(a.id, a);
  this.dispatchEvent("new_issue")
};
d = $.prototype;
d.dr = function(a, b) {
  var c = this.Rc.get(a);
  if(c) {
    var e = null;
    b ? e = c.defaultAction.Wa : c.optAction && (e = c.optAction.Wa);
    e && e();
    this.Rc.remove(a);
    this.pn()
  }
};
d.nF = function() {
  this.ej() && (this.Rc.clear(), this.pn())
};
d.Sz = function(a) {
  if(this.ej() && a) {
    var b = [];
    this.Rc.U().forEach(function(c) {
      c.activityId == a && b.push(c.id)
    }, this);
    b.forEach(function(a) {
      this.Rc.remove(a)
    }, this);
    b.length && this.pn()
  }
};
d.pn = function() {
  this.dispatchEvent("remove_issue")
};
d.rr = function() {
  return this.Rc.VF() || null
};
var wl = H("cv.TabUtils"), xl = function(a) {
  chrome.windows.getLastFocused(function(b) {
    chrome.tabs.query({active:!0, windowId:b.id}, function(b) {
      a(b[0])
    })
  })
}, zl = function(a, b) {
  chrome.windows.getLastFocused(function(c) {
    chrome.tabs.query({active:!0, windowId:c.id}, function(e) {
      yl(e[0], function(e) {
        if(e && e.width && e.height && 0 != e.width && 0 != e.height) {
          var g = c.width / e.width;
          5.1 < g || 0.24 > g ? (wl.info("Invalid computed zoom level: " + g), b(!1)) : (e = Math.round(c.width / a + (c.height - e.height * g)), wl.info("Win resizing: width = " + c.width + ", height = " + c.height + ", newHeight = " + e + ", zoomLevel = " + g), chrome.windows.update(c.id, {height:e}), b(!0))
        }else {
          wl.info("Failed to get inner tab dimension"), b(!1)
        }
      })
    })
  })
}, yl = function(a, b) {
  if(a.url && 0 != a.url.lastIndexOf("chrome://", 0)) {
    try {
      chrome.tabs.executeScript(a.id, {code:'chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {  if (request.type == "get_window_size") {   sendResponse({width: window.innerWidth, height: window.innerHeight});  }});'}, function() {
        try {
          chrome.tabs.sendRequest(a.id, {type:"get_window_size"}, function(a) {
            b(a)
          })
        }catch(c) {
          b(null)
        }
      })
    }catch(c) {
      b(null)
    }
  }else {
    b(null)
  }
}, Bl = function(a, b) {
  chrome.tabs.get(a, function(a) {
    Al(a, b)
  })
}, Al = function(a, b) {
  if(a) {
    var c = a.id;
    chrome.windows.update(a.windowId, {focused:!0}, function() {
      chrome.tabs.update(c, {active:!0}, b)
    })
  }else {
    b(null)
  }
}, Cl = function(a) {
  if(te(a)[1]) {
    return ue(a)
  }
  wl.e("Got a URL without scheme: " + a);
  return ue("http://" + a)
};
var Dl = function() {
  Be.call(this);
  this.ih = new E;
  this.ye = new E
};
v(Dl, Be);
d = Dl.prototype;
d.ki = function(a) {
  return this.ih.get(a) || null
};
d.Xd = function(a) {
  return this.ye.get(a) || []
};
d.Yk = function(a) {
  return fb(this.getAllActivities(), function(b) {
    return b.cv() && b.cv() == a
  })
};
d.Tr = function(a) {
  this.Ep(-1, a)
};
d.Ep = function(a, b) {
  Dl.q.Tr.call(this, b);
  this.ih.set(b.c(), a);
  var c = this.ye.get(a);
  c ? c.push(b) : this.ye.set(a, [b])
};
d.hj = function(a) {
  var b = this.Qb(a);
  Dl.q.hj.call(this, a);
  b.forEach(function(a) {
    this.Ba(a.c()) || this.he(a)
  }, this)
};
d.he = function(a) {
  var b = a.c(), c = this.ki(b);
  this.ih.remove(b);
  var e = this.ye.get(c);
  ob(e, function(a) {
    return a.c() == b
  });
  0 == e.length && this.ye.remove(c);
  Dl.q.he.call(this, a)
};
d.nf = function(a) {
  this.Ba(a) && this.he(this.Ba(a))
};
d.zl = function() {
  Dl.q.zl.call(this);
  this.ih.clear();
  this.ye.clear()
};
d.YD = function(a) {
  this.Xd(a).forEach(function(a) {
    this.ih.remove(a.c());
    Dl.q.he.call(this, a)
  }, this);
  this.ye.remove(a)
};
var El = function(a, b, c, e) {
  this.source = a;
  this.target = b;
  this.type = c;
  this.content = e;
  this.windowUrl = null
};
var Fl = function(a) {
  this.pe = a;
  this.xg = new wk;
  this.a = H("cv.Messenger-" + a)
};
v(Fl, N);
d = Fl.prototype;
d.D = function() {
  chrome.extension.onMessage.addListener(t(this.yl, this))
};
d.oq = function(a, b, c, e) {
  w("background" == this.pe, "Only background page can talk to tab");
  chrome.tabs.sendMessage(a, JSON.stringify(new El(this.pe, "content", b, c)), e || m)
};
d.mG = function(a, b, c, e) {
  this.a.w("Sending message to " + a + ": " + JSON.stringify(c));
  chrome.extension.sendMessage(JSON.stringify(new El(this.pe, a, b, c)), e || m)
};
d.kA = function(a, b, c, e) {
  w("background" == this.pe, "Only background page can talk to other extension pages");
  w("background" != a, "background page can NOT send message to itself");
  this.mG(a, b, c, e)
};
d.yl = function(a, b) {
  w(s(a), "Expect a string. Got " + JSON.stringify(a));
  var c = JSON.parse(a);
  if(this.pe == c.target && this.pe != c.source && ("background" == this.pe || "background" == c.source)) {
    var e;
    b.tab ? (e = b.tab, c.windowUrl && e.url != c.windowUrl && (e.url = c.windowUrl, e.title = "", e.favIconUrl = "")) : e = {id:-1};
    this.a.nz("Getting message from tab " + e.id + ": " + JSON.stringify(c));
    this.xg.oz(c.type, e, c.content)
  }
};
d.listen = function(a, b, c) {
  return this.xg.rG(a, b, c)
};
d.cd = function(a, b, c) {
  return this.xg.sG(a, b, c)
};
d.oh = function(a) {
  return this.xg.Uj(a)
};
d.j = function() {
  Fl.q.j.call(this);
  this.xg.V()
};
var Gl = function(a, b, c, e) {
  w(p(chrome.tabCapture), "chrome.tabCapture not available. Did you set the flag?");
  jf.call(this, !0, b, e);
  this.tk(a);
  this.ms = t(this.jC, this);
  this.Kg = null;
  this.sa = c;
  this.Om = new Me(5E3);
  this.Em(this.Om);
  this.B = new R(this);
  this.Em(this.B);
  this.em = !1;
  this.Wi = null
};
v(Gl, jf);
var Hl = new E, Il = function(a) {
  var b = Hl.get(a);
  b && (Hl.remove(a), b.ended || b.stop())
}, Jl = function(a, b) {
  Il(a);
  Hl.set(a, b)
};
d = Gl.prototype;
d.We = function() {
  return{tab_id:this.Q(), settings:this.pc}
};
d.it = function() {
  var a = {audio:!0, video:!0, audioConstraints:{mandatory:{googEchoCancellation:!1, googAutoGainControl:!1, googNoiseSuppression:!1, googHighpassFilter:!1}}, videoConstraints:{mandatory:{minWidth:this.pc.minWidth, minHeight:this.pc.minHeight, maxWidth:this.pc.minWidth, maxHeight:this.pc.minHeight, maxFrameRate:this.pc.lowFpsMode ? 1 : this.pc.maxFrameRate}}};
  this.pc.enablePacing && (a.videoConstraints.mandatory.googLeakyBucket = !0);
  return a
};
d.aB = function() {
  var a = {audio:!1, video:{mandatory:{chromeMediaSource:"screen", maxWidth:1920, maxHeight:1080, googLeakyBucket:!0}}};
  gj() && 0 <= Ha(Ed, "30.0.1584.0") && (a.audio = {mandatory:{chromeMediaSource:"system"}});
  return a
};
d.pj = function(a) {
  Gl.q.pj.call(this, m);
  this.kc.JB(t(this.GB, this));
  Il(this.Q());
  this.nr() ? this.HB(a) : this.IB(a)
};
d.HB = function(a) {
  w(this.nr());
  this.J.info("Starting desktop capture");
  navigator.webkitGetUserMedia(this.aB(), t(this.Or, this, a), t(function() {
    this.J.e("Failed to capture desktop");
    a(!1, "Failed to capture desktop")
  }, this))
};
d.IB = function(a) {
  w(this.kj());
  this.J.info("Starting capture on tab id " + this.Q());
  this.J.info("  media constraints: " + JSON.stringify(this.it()));
  Bl(this.Q(), t(function() {
    chrome.tabCapture.capture(this.it(), t(this.Or, this, a))
  }, this))
};
d.hn = function() {
  this.kc.cD() ? this.J.info("Tab mirroring already started.") : (this.J.info("Starting tab mirroring..."), w(this.stream, "Expecting non-null stream"), this.Kg = Date.now(), this.kc.start(this.kj()), this.km("start"), this.kj() && this.dD())
};
d.dD = function() {
  w(this.kj());
  chrome.tabCapture.onStatusChanged.addListener(this.ms);
  this.Ej(t(chrome.tabCapture.onStatusChanged.removeListener, chrome.tabCapture.onStatusChanged, this.ms));
  var a = this.sa.listen("full_screen_video_status", this.hC, this);
  this.Ej(t(this.sa.oh, this.sa, a));
  a = this.sa.listen("unsupported_plugin_detected", this.Zq, this);
  this.Ej(t(this.sa.oh, this.sa, a));
  this.B.listen(this.Om, "tick", this.gC);
  this.Om.start();
  this.Yq()
};
d.Or = function(a, b) {
  var c = chrome.extension.lastError;
  c ? (c = JSON.stringify(c), this.J.e("Error: " + c), -1 != c.indexOf("permission") && (c = "Please enable the Tab Capture API in flags and manifest.", this.J.e(c)), a(!1, c)) : b ? "stopped" == this.T() ? (b.stop(), a(!1, "The activity was stopped.")) : (b.onended = t(function() {
    this.J.info("Get stream ended event.");
    this.dispatchEvent(new we("activity_request_stop", this.c()))
  }, this), Jl(this.Q(), b), this.stream = b, this.url = window.webkitURL.createObjectURL(this.stream), this.J.info("Got stream with URL"), this.kc.addStream(this.stream), a(!0)) : (this.J.e("Failed to get stream."), a(!1, "Failed to get stream."))
};
d.Xg = function() {
  Gl.q.Xg.call(this);
  this.stream && (this.J.info("Stopping local stream..."), this.stream.stop(), Il(this.Q()));
  this.stream = null;
  this.km("stop");
  $.I().Sz(this.c())
};
d.xv = function() {
  this.Kg = null
};
d.ke = function(a) {
  Gl.q.ke.call(this, a);
  "performance" == a.type && this.J.info("Remote performance event: " + JSON.stringify(a.message))
};
d.jC = function(a) {
  this.J.info("Got flash video full screen status update");
  this.qt(a.fullscreen)
};
d.hC = function(a, b) {
  a.id == this.Q() && (this.J.info("Got video tab full screen status update"), this.qt(Xa(b)))
};
d.BC = function() {
  if("stopped" != this.T()) {
    try {
      this.Zq({id:this.Q()}, !1), this.Yq()
    }catch(a) {
      this.J.e("Inject content script failed")
    }
  }
};
d.Yq = function() {
  chrome.tabs.get(this.Q(), t(function(a) {
    if(a.url && 0 != a.url.lastIndexOf("chrome://", 0)) {
      try {
        chrome.tabs.executeScript(this.Q(), {file:"mirror_content_script.js"})
      }catch(b) {
        this.J.info("Failed to inject content script")
      }
    }
  }, this))
};
d.qt = function(a) {
  "new" != this.T() && "initialized" != this.T() && "stopped" != this.T() && (this.zoomFactor = 1, a && this.pc.zoomModeEnabled && (this.zoomFactor = Math.max(1, 16 / 9 / (window.screen.width / window.screen.height))), this.J.info("sending ZOOM message, zoom=" + this.zoomFactor), this.KC("zoom"))
};
d.Zq = function(a, b) {
  if(a.id == this.Q()) {
    this.J.w("Unsupported plugin: " + b);
    var c = Xa(b);
    c && !this.em ? this.Wi = $.addIssue("unsupported_plugin_detected", tl, ul("http://support.google.com/chromecast/go/nativeplugins"), void 0, void 0, "warning", this.c()) : !c && this.em && this.Wi && ($.I().dr(this.Wi, !0), this.Wi = null);
    this.em = c
  }
};
d.gC = function() {
  this.sa.oq(this.Q(), "detect_unsupported_plugin", {})
};
d.GB = function() {
  $.addIssue("channel_error", tl);
  this.dispatchEvent(new we("activity_request_stop", this.c()))
};
var Kl = function(a, b) {
  O.call(this, "media_status");
  this.cmdId = a;
  this.status = b
};
v(Kl, O);
var Ll = function(a) {
  O.call(this, "media_key_request");
  this.ju = a
};
v(Ll, O);
var Ml = function(a, b, c) {
  O.call(this, "custom_message");
  this.activityId = a;
  this.namespace = b;
  this.message = c
};
v(Ml, O);
var Nl = function(a) {
  Se.call(this, a, new Dl);
  this.a = H("cv.sender.ActivityService")
};
v(Nl, Se);
d = Nl.prototype;
d.D = function() {
  Nl.q.D.call(this);
  this.Va.listen(this.ec, "ramp", this.AB);
  this.Va.listen(this.ec, "channel_error", this.zB)
};
d.Gq = function(a) {
  var b = this.M.Qb(a);
  b.forEach(function(a) {
    w(1 == a.Ja().length, "Expect activity " + a.c() + " has exactly one peer.");
    this.Zk(a.c());
    a.stop()
  }, this);
  this.M.hj(a);
  b.forEach(function(a) {
    this.dispatchEvent(new Te("remove_activity", a.c()))
  }, this)
};
d.Zk = function(a) {
  this.Xe().cd(this.M.Ba(a), "activity_error", this.$h)
};
d.ts = function() {
  return hb(this.getAllActivities(), function(a) {
    return a.isLocal()
  })
};
d.iC = function() {
  return hb(this.getAllActivities(), function(a) {
    return!a.rb() && a.isLocal()
  })
};
d.Nh = function(a) {
  var b = this.M.Qb(a);
  return 0 < b.length ? (w(1 == b.length, "receiver " + a + " has more than one activities"), b[0]) : null
};
d.gm = function(a) {
  return(a = z(this.M.Xd(a), function(a) {
    return"mirror_tab" == a.za()
  })) && Ya(a, Gl)
};
d.pw = function() {
  return fb(this.getAllActivities(), function(a) {
    return!a.rb()
  })
};
d.Xo = function(a) {
  this.M.nf(a);
  this.dispatchEvent(new Te("remove_activity", a))
};
d.Xd = function(a) {
  return this.M.Xd(a)
};
d.Yk = function(a) {
  return this.M.Yk(a)
};
d.ki = function(a) {
  return this.M.ki(a)
};
d.so = function(a, b) {
  this.a.info("Add new activity: " + b.c());
  this.M.Ep(a, b);
  this.Xe().Wd(b, "activity_error", this.$h);
  this.Xe().Wd(b, "activity_request_stop", function(a) {
    this.stopActivityById(a.activityId)
  });
  this.dispatchEvent(new Te("new_activity", b.c()))
};
d.$h = function(a) {
  w("activity_error" == a.type);
  this.a.info("Handle activity error: " + a.errorMessage);
  this.M.ki(a.activityId);
  var b = this.M.Ba(a.activityId);
  this.So(b);
  this.M.nf(a.activityId);
  $.addIssue("activity_error", tl)
};
d.RC = function(a) {
  this.a.info("Handling tab closing: " + a);
  a = this.M.Xd(a).slice(0);
  a.forEach(function(a) {
    this.M.he(a)
  }, this);
  return this.yy(a)
};
d.YC = function(a, b) {
  var c = this.M.Ba(a);
  if(!c) {
    return this.a.info("Trying to leave a non-existing activity: " + a), Ee("non-existing activity")
  }
  this.a.info("Leaving activity: " + a);
  this.M.nf(a);
  return this.vq(c, b)
};
Nl.prototype.stopActivityById = function(a, b) {
  var c = this.M.Ba(a);
  if(!c) {
    return this.a.info("Trying to stop a non-existing activity: " + a), Ee("non-existing activity")
  }
  this.a.info("Stopping activity: " + a);
  this.M.nf(a);
  return this.Tk(c, b)
};
Nl.prototype.wv = function(a, b) {
  var c = this.M.Qb(a);
  this.M.hj(a);
  return this.Ol(c, b)
};
Nl.prototype.yv = function(a, b) {
  var c = this.M.Xd(a);
  this.M.YD(a);
  return this.Ol(c, b)
};
Nl.prototype.stopAllActivities = function(a) {
  this.a.info("Stopping ALL activities");
  var b = this.M.getAllActivities();
  this.M.zl();
  return this.Ol(b, a)
};
d = Nl.prototype;
d.hw = function(a) {
  var b = a.Ja()[0];
  w(b.isLocal(), "not a local receiver");
  var b = new Qk(b), c = new K;
  b.Bp(a.Eb(), function(b) {
    b.ga() ? c.la(null) : c.cb("Failed to stop " + a.Eb())
  });
  return c
};
d.Tk = function(a, b) {
  this.a.info("Stopping activity: " + a.za() + " " + a.c());
  var c = new K;
  a.stop();
  this.Xe().cd(a, "activity_error", this.$h);
  var e = a.Ja()[0];
  a.rb() ? (this.So(a), c.la(null)) : e.isLocal() ? c = this.hw(a) : c.la(null);
  b || this.ec.Vd(e.c());
  this.dispatchEvent(new Te("remove_activity", a.c()));
  return c
};
d.vq = function(a, b) {
  if(!a.rb()) {
    return Ee()
  }
  if("mirror_tab" == a.za()) {
    return this.Tk(a, b)
  }
  this.a.info("Leaving activity: " + a.za() + " " + a.c());
  this.Xe().cd(a, "activity_error", this.$h);
  var c = a.Ja()[0];
  this.kw(a);
  b || this.ec.Vd(c.c());
  this.dispatchEvent(new Te("leave_activity", a.c()));
  return De(null)
};
d.Ol = function(a, b) {
  if(0 == a.length) {
    return De(null)
  }
  var c = [];
  a.forEach(function(a) {
    c.push(this.Tk(a, b))
  }, this);
  return 1 == c.length ? c[0] : Le.apply(null, c)
};
d.yy = function(a, b) {
  if(0 == a.length) {
    return De(null)
  }
  var c = [];
  a.forEach(function(a) {
    c.push(this.vq(a, b))
  }, this);
  return 1 == c.length ? c[0] : Le.apply(null, c)
};
d.AB = function(a) {
  w("ramp" == a.type);
  Rc(this.a, "Received a RAMP message from receiver " + a.S, a.message);
  var b = this.ap(a);
  if(b) {
    if("dial_non_ramp_activity" == b.za() && (this.a.info("Update activity to RAMP: " + b.c()), b.Ud("dial_ramp_activity")), a = a.message, ld(a, "KEY_REQUEST")) {
      (b = ld(a, "KEY_REQUEST") && null != a.method && null != a.requests ? new dd(b.c(), a.cmd_id, a.method, a.requests) : null) ? this.dispatchEvent(new Ll(b)) : this.a.e("Invalid key request message")
    }else {
      var c;
      if(null == a.cmd_id || null == a.type || "RESPONSE" != a.type && "STATUS" != a.type || null == a.status) {
        c = {cmdId:null, status:null, error:"Invalid RAMP message: " + JSON.stringify(a)}
      }else {
        try {
          var e = a.status, f = new ad("", I(e, "state", !0));
          f.eventSequenceId = I(e, "event_sequence", !0);
          f.contentId = I(e, "content_id", !1);
          f.title = I(e, "title", !1);
          f.imageUrl = I(e, "image_url", !1);
          f.timeProgress = I(e, "time_progress", !0);
          f.position = I(e, "current_time", !0);
          f.duration = I(e, "duration", !1);
          f.volume = I(e, "volume", !0);
          f.muted = I(e, "muted", !0);
          f.contentInfo = I(e, "content_info", !1);
          f.mediaTracks = md(I(e, "tracks", !1, []));
          f.hasPause = I(e, "has_pause", !1);
          var g = I(e, "error", !1);
          f.error = g ? {domain:I(g, "domain", !0), code:I(g, "code", !0)} : null;
          c = {cmdId:a.cmd_id, status:f, error:null}
        }catch(k) {
          c = {cmdId:null, status:null, error:"Invalid RAMP message " + JSON.stringify(a) + ": " + k}
        }
      }
      c.error ? this.a.e(c.error) : (c.status.activityId = b.c(), b.Sv(c.status), c.status.title && b.$f(c.status.title, c.status.imageUrl, 3), this.dispatchEvent(new Kl(c.cmdId, c.status)))
    }
  }
};
d.gu = function(a) {
  w("custom_message" == a.type);
  Rc(this.a, "Received a custom message from receiver " + a.S, a.message);
  var b = this.ap(a);
  if(b) {
    var c = Ua(a.message[0]);
    this.dispatchEvent(new Ml(b.c(), c, a.message[1]))
  }
};
d.ap = function(a) {
  if(!a.S) {
    return Rc(this.a, "Received a message without a peer", a.message), null
  }
  var b = this.Nh(a.S);
  b || this.a.e("Cannot find activity for peerId: " + a.S);
  return b
};
d.zB = function(a) {
  a.S ? (a = this.M.Qb(a.S), 0 != a.length && "mirror_tab" == a[0].za() && $.addIssue("channel_error", tl)) : this.a.e("Got channel error event without peer ID")
};
var Ol = function(a, b) {
  R.call(this, this);
  this.a = H("cv.SessionAnalyzer");
  this.l = a;
  this.vi = b || $e.I();
  this.ol = 0;
  this.Ha = null;
  var c = M.I().ui();
  this.Ha = c ? c : new Od
};
v(Ol, R);
d = Ol.prototype;
d.D = function() {
  this.listen(this.l, "new_activity", this.iD)
};
d.iD = function(a) {
  "mirror_tab" == this.l.Ba(a.activityId).za() && this.$B()
};
d.$B = function() {
  0 < this.Ha.sessionsBeforeWarning && (this.Ha.sessionsBeforeWarning--, M.I().ot(this.Ha));
  0 == this.Ha.sessionsBeforeWarning ? (this.Ha.earliestTimeToShowWarning = Date.now(), this.vi.tt(t(this.ZC, this))) : this.vi.tt(null)
};
d.ZC = function() {
  if(null == this.vi || Date.now() < this.Ha.earliestTimeToShowWarning || 0 < this.Ha.sessionsBeforeWarning) {
    return!1
  }
  var a = this.vi.xE(2);
  if(a) {
    var b = this.cu(a.senderStats), c = this.cu(a.receiverStats);
    if(b && c && b > this.ol && c > this.ol) {
      return this.ol = Math.max(b, c), a = this.wE(a.senderStats, a.receiverStats), this.vE(a), !0
    }
  }
  return!1
};
d.cu = function(a) {
  a = a[a.length - 1][0];
  return a ? (a = a.timestamp) ? (new Date(a)).getTime() : null : null
};
d.vE = function(a) {
  a.packetsLost > 0.03 * a.packetsSent ? this.jv("session_quality_network", "Packet loss rate is higher than the threshold of 3%") : a.frameRateSent < 0.9 * a.frameRateInput && this.jv("session_quality_encoding", "Frame rate encoding/sending rate is too low")
};
var Pl = function() {
  this.packetsSent = this.packetsLost = this.frameRateSent = this.frameRateInput = null
};
d = Ol.prototype;
d.wE = function(a, b) {
  var c = new Pl;
  c.frameRateInput = this.Wu(a, "googFrameRateInput", 2);
  c.frameRateSent = this.Wu(a, "googFrameRateSent", 2);
  c.packetsLost = this.Xu(b, "packetsLost", 4);
  c.packetsSent = this.Xu(a, "packetsSent", 4);
  return c
};
d.Xu = function(a, b, c) {
  return this.$u(a, b, c, !0)
};
d.Wu = function(a, b, c) {
  return this.$u(a, b, c, !1)
};
d.$u = function(a, b, c, e) {
  for(var f = 0, g = 0, k = a.length - 1;g < c && 0 <= k;) {
    var l = a[k];
    if(l) {
      for(var r = 0;r < l.length;r++) {
        if(l[r][b]) {
          g++;
          var A = l[r][b], C = Number(A), f = f + (0 == C && pa(A) ? NaN : C);
          if(!e) {
            break
          }
        }
      }
      k--
    }
  }
  return g >= c ? e ? f : 1 * f / g : null
};
d.yA = function() {
  this.Ha.dismissClicks++;
  switch(this.Ha.dismissClicks) {
    case 1:
      this.Ha.sessionsBeforeWarning = 1;
      break;
    case 2:
      this.Ha.sessionsBeforeWarning = 10;
      this.Ha.earliestTimeToShowWarning = Date.now() + 7776E6;
      break;
    default:
      this.Ha.sessionsBeforeWarning = Number.POSITIVE_INFINITY, this.Ha.earliestTimeToShowWarning = Date.now() + 7776E6
  }
  M.I().ot(this.Ha)
};
d.jv = function(a) {
  var b;
  "session_quality_network" == a ? b = "http://support.google.com/chromecast/go/networkingissues" : "session_quality_encoding" == a ? b = "http://support.google.com/chromecast/go/limitedperformance" : Sa("Invalid issue type: " + a);
  var c = Date.now() + 3E4;
  this.Ha.earliestTimeToShowWarning = Math.max(this.Ha.earliestTimeToShowWarning, c);
  (c = this.l.Ie()) && b && $.addIssue(a, new sl("Dismiss", t(function() {
    this.yA()
  }, this)), ul(b), void 0, void 0, "warning", c.c())
};
var Ql = function(a) {
  this.Je = a;
  this.a = H("cv.sender.WebSocketChannelFactory")
};
Ql.prototype.Ze = function(a) {
  this.a.info("Creating local web socket channel...");
  var b = new K, c = function(a) {
    "pending" == b.T() && b.la(a)
  }, e = function(a) {
    "pending" == b.T() && b.cb(a || "Create channel failed.")
  }, f = t(function(a, b, c) {
    c && c.serviceData && c.serviceData.Ck ? a.jk(c.serviceData.Ck) : a.Rd("Could not get connection service URL")
  }, this), g = t(function(a) {
    this.a.info("Requesting channel creation at " + a);
    var b = k, c = JSON.stringify({channel:0, senderId:new $g(this.Je)}), e = new Lg;
    Og.push(e);
    b && e.listen("complete", b);
    e.Wd("ready", e.Hv);
    e.send(a, "POST", c, {"Content-Type":"application/json"})
  }, this), k = t(function(b) {
    b = b.target;
    if(b.ga()) {
      b = b.Oo();
      this.a.info("Ready to create websocket channel with " + JSON.stringify(b));
      this.a.info("The ID of this sender: " + this.Je);
      var f = new Zg(b.URL);
      f.S = a.c();
      b.pingInterval && 0 < b.pingInterval ? f = new Yg(f, "pong", 1E3 * b.pingInterval) : this.a.info("Created a channel without ping to receiver: " + a.c());
      f.Ko(ma(c, f), e)
    }else {
      this.a.info("XHR error getting websocket URL: " + b.Fe()), e("Failed to get websocket connection URL.")
    }
  }, this), l = new Qk(a), r = new ej;
  r.nk(16);
  r.Gh(500);
  r.no(1);
  r.start(function(a) {
    l.Lo(ma(f, a))
  }, g, e);
  return b
};
var Rl = function(a) {
  this.a = H("cv.sender.CloudChannelFactory");
  this.dc = a
};
Rl.prototype.Ze = function(a) {
  w(null != a.up());
  var b = new K;
  this.dc.ww().Db(t(function() {
    this.a.info("Opening cloud channel to id: " + a.c());
    var c = this.dc.xw(a.c());
    ie(c, "a", t(function(a) {
      this.a.info("New state: " + a.hg);
      "connected" == a.hg ? b.la(c) : b.cb(c.getError() || "Error creating CloudChannel")
    }, this))
  }, this));
  return b
};
var Sl = function(a, b, c) {
  this.a = H("cv.CloudDiscovery");
  this.gb = new lh;
  this.yc = new mh(this.gb);
  this.yg = new oh(this.yc);
  this.jg = new bj(this.yc, this.yg);
  this.dc = new aj(c, this.gb, this.jg, t(function(a) {
    this.yg.el().Db(function(b) {
      a(b.Ea())
    })
  }, this));
  this.cf = new Rl(this.dc);
  this.P = a;
  this.Zd = 0;
  b.kx(this.cf)
};
v(Sl, N);
Sl.prototype.D = function() {
  this.refresh()
};
Sl.prototype.refresh = function(a) {
  !a && 1E4 > u() - this.Zd || (this.Zd = u(), this.a.info("Starting a device list from cloud."), this.jg.az(t(this.jd, this)))
};
Sl.prototype.jd = function(a, b) {
  if(b) {
    var c = 0, e = [];
    for(c in a) {
      e.push(a[c].guid)
    }
    this.P.Gp(function(a) {
      return a.Ap() && -1 == e.indexOf(a.c())
    });
    for(c in a) {
      this.P.register(Fk(a[c].guid, a[c].displayName))
    }
  }else {
    this.a.info("Cloud device list error.")
  }
};
var Tl = function(a) {
  R.call(this, this);
  this.a = H("cv.BrowserIconManager");
  this.l = a;
  this.tb = $.I();
  this.Ai = null
};
v(Tl, R);
Tl.prototype.D = function() {
  this.listen(this.l, "new_activity", this.ve);
  this.listen(this.l, "leave_activity", this.ve);
  this.listen(this.l, "remove_activity", this.ve);
  this.listen(this.tb, "new_issue", this.ve);
  this.listen(this.tb, "remove_issue", this.ve)
};
Tl.prototype.ve = function() {
  var a = this.tz();
  this.Ai != a && (this.a.info("Set icon to " + a), this.Ai = a, chrome.browserAction.setIcon({path:{38:this.Ai, 19:this.Ai}}))
};
Tl.prototype.tz = function() {
  if(this.tb.ej()) {
    var a = this.tb.rr();
    if("fatal" == a.severity) {
      return"data/icon38_issue.png"
    }
    if("warning" == a.severity) {
      return"data/icon38_warning.png"
    }
  }
  return this.l.ts() ? "data/icon38_on.png" : "data/icon38_off.png"
};
var Ul = function(a, b) {
  this.a = H("cv.FixedIpDialService");
  this.Ei = new Me(3E4);
  this.Va = new R(this);
  this.P = a;
  this.mi = b || new zk
};
v(Ul, N);
d = Ul.prototype;
d.D = function() {
  this.a.ig("Initializing fixed IP discovery.");
  this.Va.listen(this.Ei, "tick", t(this.Ty, this));
  this.Ei.start();
  this.Ei.iq()
};
d.j = function() {
  this.Va.V();
  this.Ei.V()
};
d.Ty = function() {
  var a = M.I().sE(), b;
  for(b in a) {
    this.qE(a[b])
  }
};
d.qE = function(a) {
  w(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(a));
  var b = {};
  b.deviceLabel = "debug:" + a;
  b.deviceDescriptionUrl = "http://" + a + ":8008/ssdp/device-desc.xml";
  this.a.info("Discovering DIAL device by IP (label=" + b.deviceLabel + " url=" + b.deviceDescriptionUrl + " config=" + b.configId + ")");
  this.Rg(b, a)
};
d.Rg = function(a, b) {
  this.mi.Fp(a, t(function(c, e) {
    if(e) {
      this.a.e("Unable to fetch description for " + JSON.stringify(a) + ": " + e), this.Bw(b)
    }else {
      var f = new Dk(a.deviceLabel, c.ff, c.friendlyName, c.je, c.ipAddress, c.appUrl);
      f.qg = !0;
      this.P.register(new Ck(f, null))
    }
  }, this))
};
d.Bw = function(a) {
  this.P.Gp(function(b) {
    return b.Ka() && b.Ka().ipAddress == a
  })
};
var Vl = function(a) {
  R.call(this);
  this.bl = [];
  this.P = a;
  this.bd = new Qb;
  this.a = H("cv.ReceiverAppRegistry");
  this.listen(this.P, "receiver_list", this.mg)
};
v(Vl, R);
d = Vl.prototype;
d.D = function() {
  this.Ut("ChromeCast")
};
d.Ut = function(a) {
  z(this.bl, function(b) {
    return b == a
  }) || (this.bl.push(a), this.Uu())
};
d.mg = function() {
  this.Uu()
};
d.Uu = function() {
  this.P.og().forEach(t(this.yE, this))
};
d.yE = function(a) {
  if(a.Ka()) {
    var b = null;
    this.bl.forEach(t(function(c) {
      var e = a.c() + ":" + c;
      this.bd.contains(e) || "unknown" != a.jl(c) || (this.a.info("Querying " + a.c() + " for " + c), b || (b = new Qk(a)), this.bd.add(e), b.Bk(c, t(this.cx, this, a, c)))
    }, this))
  }
};
d.cx = function(a, b, c, e, f) {
  this.bd.remove(a.c() + ":" + b);
  if(404 == c.ua()) {
    a.af(b, "unavailable"), this.P.$o(b, a)
  }else {
    if(f) {
      this.a.e("Unable to get application info for app " + b + " on receiver " + a.c() + ": " + f)
    }else {
      if("Netflix" == b) {
        this.Rv(a, e)
      }else {
        switch(e.state) {
          case "running":
          ;
          case "stopped":
            a.af(b, "available");
            break;
          default:
            a.af(b, "unavailable")
        }
      }
      this.P.$o(b, a)
    }
  }
};
d.Rv = function(a, b) {
  w("Netflix" == b.name);
  !p(b.extraData.capabilities) || "websocket" != b.extraData.capabilities || "running" != b.state && "stopped" != b.state ? a.af("Netflix", "unavailable") : a.af("Netflix", "available")
};
var Wl = function(a, b, c, e, f) {
  this.a = H("cv.sender.LaunchService");
  this.Wf = a;
  this.ra = b;
  this.l = c;
  this.P = e;
  this.$c = new E;
  this.B = new R(this);
  this.B.listen(this.ra, "launch_service", this.mw);
  this.sa = f
};
d = Wl.prototype;
d.zo = function(a) {
  var b = !1;
  yb(this.$c.fB(), function(c) {
    c.Da.c() == a.c() && (b = !0)
  }, this);
  return b
};
d.mr = function() {
  return this.$c.U().map(function(a) {
    return a.ma
  })
};
d.mw = function(a) {
  w("launch_service" == a.type);
  a = a.message;
  var b = this.$c.get(a.activityId);
  if(b) {
    this.$c.remove(a.activityId);
    var c = b.ma;
    switch(a.action) {
      case "join_succeeded":
        c.pv(a.initParams.actualActivityId);
      case "launch_succeeded":
        this.a.info("Activity launch succeeded: " + c.c() + " for activity type " + c.za());
        c.to(this.ra);
        this.l.so(c.Q(), c);
        c.start();
        c.wo();
        try {
          var e = void 0;
          a.initParams && (e = a.initParams.joinableState);
          b.pb(c.c(), e)
        }catch(f) {
          this.a.e(f.message)
        }
        c.Ke(new id(1E3, "INFO"), [b.Da]);
        break;
      case "launch_failed":
        this.a.info("Activity launch failed: " + c.c());
        b.Td("Receiver failed to launch.");
        break;
      case "join_failed":
        this.a.info("Activity join failed: " + c.c());
        b.Td("Activity failed to join. Does this activity support joining?");
        break;
      default:
        this.a.e("Did not recognize launch service action")
    }
  }else {
    this.a.e("Get launch response for unknown activity " + JSON.stringify({action:a.action, activityId:a.activityId}))
  }
};
d.Dv = function(a, b) {
  var c = this.l.Nh(b), c = this.l.wv(b, null != c && c.rb() && a.rb());
  if("mirror_tab" == a.za()) {
    var e = this.l.Ie();
    if(e) {
      return Le(c, this.l.stopActivityById(e.c()))
    }
  }
  !a.rb() && this.ra.sk(b) && (this.a.e("before launch non-cv activity; still have channel"), this.ra.Vd(b));
  return c
};
d.zv = function(a, b) {
  var c = null, c = b.disconnectPolicy, e = null;
  switch(b.activityType) {
    case "mirror_tab":
      c = new Gl(a.id, M.I().ka(), this.sa);
      break;
    case "video_playback":
      e = "video_playback";
    case "audio_playback":
      var f = b.parameters || new Xe;
      f.mediaUrl = f.mediaUrl || f.videoUrl;
      c = new We(e || "audio_playback", f, void 0, c);
      break;
    case "slideshow":
      return null;
    case "unknown":
      return null;
    default:
      c = new Ae(void 0, c), c.Fo(b.activityType).LB(b.parameters).Ud("dial_non_ramp_activity")
  }
  c.tk(a.id);
  a.url && c.Ir(Cl(a.url));
  c.KB(a.incognito || !1);
  b.description && c.$f(b.description.text || null, b.description.url || null, 1);
  return c
};
d.Ph = function(a, b, c, e) {
  this.hv(a, b, c, e, !1)
};
d.join = function(a, b, c, e) {
  this.hv(a, b, c, e, !0)
};
d.hv = function(a, b, c, e, f) {
  var g = b.receiver.id, k = this.P.Av(g);
  if(k) {
    if(Rc(this.a, "Got launch request " + JSON.stringify({activityType:b.activityType, receiver:b.receiver, tab:a.id}), b), this.zo(k)) {
      c = "There is an activity being launched to the same receiver.", this.a.info(c), e(c)
    }else {
      var l = this.zv(a, b);
      if(l) {
        l.xo(k);
        var r = t(function(a) {
          this.$c.remove(l.c());
          l.stop();
          this.ra.Vd(g);
          try {
            e(a)
          }catch(b) {
            this.a.e(b.message)
          }
          f || $.addIssue("launch_failure", tl, void 0, "Unable to cast to " + k.Qh() + ".")
        }, this);
        a = chrome.runtime.getManifest().cloudviewReceiverVersion;
        var A = new Xl(this.ra, l, this.Wf, k, a, c, r);
        f && A.Cv();
        this.$c.set(l.c(), A);
        var C = De(null);
        f || (C = this.Dv(l, g));
        var L = t(function() {
          var a = f ? 5E3 : 1E4;
          S(t(this.Bv, this, l.c()), a);
          A.start()
        }, this);
        l.yo(t(function(a, b) {
          a ? Fe(C, function() {
            L()
          }, this) : r(b || "Activity failed to initialize.")
        }, this))
      }else {
        e("Unsupported activity: " + JSON.stringify(b))
      }
    }
  }else {
    c = "Receiver does not exist: " + g, this.a.e(c), $.addIssue("device_offline", tl), e(c)
  }
};
d.Bv = function(a) {
  var b = this.$c.get(a);
  b && (this.a.info("Launch timeout: " + a), this.$c.remove(a), this.ra.sk(b.Da.c()) && this.ra.Fb("launch_service", new cj("cancel", b.ma.za(), a, b.ma.We(), b.Ok.c(), b.Da.c()), [b.Da]), b.Td("Launch timeout"))
};
var Xl = function(a, b, c, e, f, g, k) {
  this.a = H("cv.sender.ActivityLaunchRequest_");
  this.ra = a;
  this.ma = b;
  this.Ok = c;
  this.Da = e;
  this.pb = g;
  this.Td = k;
  this.Me = this.Da.isLocal() ? new Qk(this.Da) : null;
  this.Vo = f;
  this.Zo = "launch"
};
d = Xl.prototype;
d.Cv = function() {
  this.Zo = "join"
};
d.start = function() {
  this.Da.Ka() ? M.I().yC() && M.I().Ao() ? this.bb(0) : this.bb(1) : this.bb(4)
};
d.bb = function(a) {
  switch(a) {
    case 0:
      this.ND();
      break;
    case 1:
      this.MD();
      break;
    case 3:
      this.PD();
      break;
    case 4:
      this.ma.rb() ? this.OD() : this.QD()
  }
};
d.QD = function() {
  this.ra.dispatchEvent(new Qe("launch_service", new cj("launch_succeeded", this.ma.za(), this.ma.c(), this.ma.We(), this.Ok.c(), this.Da.c(), this.ma.kp())))
};
d.MD = function() {
  this.Me && (this.a.info("Checking state of receiver app..."), this.Me.Bk(this.ma.Eb(), t(function(a, b, c) {
    c ? this.Td(c) : "running" == b.state ? this.ma.rb() ? this.bb(4) : (this.Me.Bp(this.ma.Eb(), m), S(function() {
      this.bb(3)
    }, 1500, this)) : this.bb(3)
  }, this)))
};
d.PD = function() {
  this.a.info("Sending request to launch receiver app with version: " + this.Vo);
  var a = "";
  if(this.ma.rb()) {
    a = "v=" + encodeURIComponent(this.Vo) + "&id=" + encodeURIComponent(this.Da.c()), a += "&idle=" + encodeURIComponent("windowclose")
  }else {
    var b = this.ma.We();
    null != b && ("string" == typeof b ? a = b : "object" == typeof b ? a = JSON.stringify(b) : Sa("Don't know how to serialize " + b))
  }
  this.Me && this.Me.launchApp(this.ma.Eb(), t(function(a) {
    a.ga() ? this.bb(4) : this.Td("error launching receiver app")
  }, this), a)
};
d.ND = function() {
  if(this.ma.rb()) {
    var a = new U(M.I().Ao());
    this.a.info("Flinging receiver URL: " + a);
    a.ba("id", this.Da.c());
    this.Me.launchApp("Fling", t(function(a) {
      a.ga() ? this.bb(4) : this.Td("error launching receiver app")
    }, this), a.toString())
  }else {
    this.a.e("Fling URL is not supported for external apps")
  }
};
d.OD = function() {
  w(this.ma.rb());
  this.a.info("Launching activity " + this.ma.c() + " on " + this.Da.c());
  this.ra.sk(this.Da.c()) ? this.a.info("Has channel to receiver") : this.a.info("No channel to receiver. Ready to create.");
  this.ra.Fb("launch_service", new cj(this.Zo, this.ma.za(), this.ma.c(), this.ma.We(), this.Ok.c(), this.Da.c(), this.ma.kp()), [this.Da], this.Td)
};
var Yl = function(a, b, c, e) {
  Q.call(this);
  this.a = H("cv.RampDiscoveryService");
  this.l = a;
  this.Oa = b;
  this.ra = e;
  this.nx = c;
  this.Sp = this.Zd = null
};
v(Yl, Q);
d = Yl.prototype;
d.D = function() {
};
d.BF = function() {
  this.a.info("Discovering DIAL/RAMP activity now...");
  this.Zd = u();
  this.nx.og().forEach(this.mz, this)
};
d.AF = function() {
  var a = [];
  this.l.pw().forEach(function(b) {
    b.qw() < this.Zd && a.push(b.c())
  }, this);
  a.forEach(function(a) {
    this.a.info("Removing activity " + a);
    this.l.Xo(a)
  }, this)
};
d.mz = function(a) {
  a.Ka() && (this.Ro(a) ? this.a.ig("Skipping " + a.c()) : (new Qk(a)).Lo(t(this.fx, this, a)))
};
d.fx = function(a, b, c) {
  c && "running" == c.state && "00000000-0000-0000-0000-000000000000" != c.name && (this.Ro(a) ? this.a.ig("Skipping " + a.c()) : (b = this.l.Nh(a.c())) && b.Eb() == c.name ? (b.cp(), Zl(b, c)) : (b && (this.a.info("Removing existing activity " + b.Eb() + " on receiver " + a.c()), this.l.Xo(b.c())), this.a.info("Found new activity " + c.name + " on receiver " + a.c()), b = new Ae(void 0, "continue"), b.Fo(c.name).tk(-3).Ud("dial_non_ramp_activity").to(this.ra).xo(a).cp(), Zl(b, c), "ChromeCast" == 
  c.name && (b.Ud("dial_ramp_activity"), b.Go().hasPause = !1), this.l.so(-3, b), b.yo(m), b.Ke(new id(1E3, "INFO"))))
};
var Zl = function(a, b) {
  b.Hj && a.$f(b.Hj.description, b.Hj.imageUrl, 2);
  b.serviceData && -1 < b.serviceData.$s.indexOf("ramp") && a.Ud("dial_ramp_activity")
};
Yl.prototype.Ro = function(a) {
  var b = this.l.Nh(a.c());
  return b && b.rb() ? !0 : this.Oa.zo(a)
};
Yl.prototype.refresh = function() {
  this.Zd && 5E3 > u() - this.Zd || (this.BF(), h.clearTimeout(this.Sp), this.Sp = S(function() {
    this.AF()
  }, 5E3, this))
};
var $l = function() {
  this.$t = t(this.NE, this);
  this.Wj = new Na;
  this.Wj.Fj = !1;
  this.Xt = this.Wj.Gj = !1;
  this.Rt = "";
  this.aE = {}
};
$l.prototype.En = function() {
  return this.Wj
};
$l.prototype.To = function(a) {
  if(a != this.Xt) {
    var b = Oc();
    a ? b.Jn(this.$t) : b.Ln(this.$t);
    this.Xt = a
  }
};
$l.prototype.NE = function(a) {
  if(!this.aE[a.Bt()]) {
    var b = this.Wj.au(a), c = am;
    if(c) {
      switch(a.rn()) {
        case Dc:
          bm(c, "info", b);
          break;
        case Ec:
          bm(c, "error", b);
          break;
        case Fc:
          bm(c, "warn", b);
          break;
        default:
          bm(c, "debug", b)
      }
    }else {
      window.opera ? window.opera.postError(b) : this.Rt += b
    }
  }
};
var am = window.console, cm = function(a) {
  am = a
}, bm = function(a, b, c) {
  if(a[b]) {
    a[b](c)
  }else {
    a.log(c)
  }
};
var dm = function() {
  this.rm = new E;
  this.tr = new E;
  this.fh = new E;
  this.A = M.I()
};
d = dm.prototype;
d.D = function() {
  var a = this.A.rD();
  a && this.fh.uj(a)
};
d.bs = function(a, b) {
  return a + " : " + b
};
d.VA = function(a) {
  var b = Ga();
  this.fh.set(a, b);
  this.A.wD(this.fh.xD())
};
d.eB = function(a, b) {
  w(b.cs());
  this.fh.Aa(a) || this.VA(a);
  var c = this.fh.get(a), e = new sf;
  e.update(b.cs());
  e.update(c);
  c = e.Hm();
  if(!ea(c)) {
    throw Error("encodeByteArray takes an array as a parameter");
  }
  qf();
  for(var e = pf, f = [], g = 0;g < c.length;g += 3) {
    var k = c[g], l = g + 1 < c.length, r = l ? c[g + 1] : 0, A = g + 2 < c.length, C = A ? c[g + 2] : 0, L = k >> 2, k = (k & 3) << 4 | r >> 4, r = (r & 15) << 2 | C >> 6, C = C & 63;
    A || (C = 64, l || (r = 64));
    f.push(e[L], e[k], e[r], e[C])
  }
  c = "uuid:" + f.join("");
  this.rm.set(this.bs(a, b.c()), c);
  this.tr.set(c, b.c())
};
d.ks = function(a, b) {
  var c = this.bs(a, b.c());
  this.rm.Aa(c) || this.eB(a, b);
  return this.rm.get(c)
};
d.RF = function(a, b) {
  return b.map(function(b) {
    var e = b.ys();
    e.id = this.ks(a, b);
    return e
  }, this)
};
d.Wt = function(a) {
  return this.tr.get(a, null)
};
var em = function(a, b, c) {
  this.Dd = a;
  this.FE = b;
  this.EE = Cl(c);
  this.qn = new Qb;
  this.Cn = new Qb;
  this.Dn = new Qb;
  this.$j = null;
  this.hu = u()
};
d = em.prototype;
d.bx = function() {
  this.hu = u()
};
d.WD = function() {
  return this.hu
};
d.iB = function(a) {
  this.$j = a
};
d.vD = function(a) {
  a && this.$j && (a = z(a, function(a) {
    return a.id == this.$j
  }, this)) && (a.isTabProjected = !0, this.$j = null)
};
d.Q = function() {
  return this.Dd
};
d.Bc = function() {
  return this.FE
};
d.Im = function() {
  return this.EE
};
d.gE = function(a) {
  this.qn.add(a)
};
d.lH = function(a) {
  this.qn.remove(a)
};
d.FG = function() {
  return this.qn.U()
};
d.vp = function(a) {
  this.Cn.add(a)
};
d.rt = function(a) {
  this.Cn.remove(a)
};
d.qi = function(a) {
  return this.Cn.contains(a)
};
d.Ix = function(a) {
  this.Dn.add(a)
};
d.Kx = function(a) {
  this.Dn.remove(a)
};
d.gF = function(a) {
  return this.Dn.contains(a)
};
d.hq = function() {
  return-4 == this.Dd
};
var fm = function() {
  this.a = H("cv.CastClientRecord");
  this.jb = []
};
d = fm.prototype;
d.D = function() {
  chrome.tabs.onRemoved.addListener(t(function(a) {
    this.iH(a)
  }, this))
};
d.iH = function(a) {
  this.wq(a) && (this.a.info("Removing clients in tab " + a), this.jb = fb(this.jb, function(b) {
    return b.Q() != a
  }))
};
d.Sy = function(a, b) {
  this.jb = fb(this.jb, function(c) {
    return c.Q() != a || c.WD() > b
  })
};
d.Qy = function(a) {
  return fb(this.jb, function(b) {
    return b.Q() == a
  })
};
d.nw = function(a, b, c) {
  if(-4 == a) {
    var e = this.cz(b);
    if(e) {
      return e
    }
  }
  if(this.ez(a, b)) {
    return this.a.info("Client already exists."), null
  }
  if(50 <= this.dz(a)) {
    return this.a.info("Exceeds max number of clients allowed per tab"), null
  }
  e = new em(a, b, c);
  this.jb.push(e);
  return e
};
d.Ip = function(a, b) {
  return z(this.jb, function(c) {
    return c.Q() == a && c.Bc() == b
  })
};
d.cz = function(a) {
  return z(this.jb, function(b) {
    return b.hq() && b.Bc() == a
  })
};
d.ez = function(a, b) {
  return!!this.Ip(a, b)
};
d.wq = function(a) {
  return!!z(this.jb, function(b) {
    return b.Q() == a
  })
};
d.OF = function(a, b) {
  return!!z(this.jb, function(c) {
    return c.Q() == a && c.Im() == b
  })
};
d.dz = function(a) {
  return jb(this.jb, function(b) {
    return b.Q() == a
  })
};
d.CF = function() {
  return this.jb
};
d.du = function(a) {
  return z(this.jb, function(b) {
    return b.qi(a)
  })
};
d.ox = function(a, b) {
  return z(this.jb, function(c) {
    return c.gF(a) && c.qi(b)
  })
};
var gm = function(a, b, c, e, f) {
  this.tb = $.I();
  this.l = a;
  this.P = b;
  this.Oa = c;
  this.sa = e;
  this.Kh = f;
  this.a = H("cv.CastService");
  this.B = new R(this);
  this.Pb = new fm;
  this.dg = new dm
};
gm.prototype.jq = m;
gm.prototype.D = function() {
  this.sa.listen("app_request", t(this.Qo, this));
  this.sa.listen("page_unload", t(this.$z, this));
  this.B.listen(this.P, "receiver_list", this.mg);
  this.B.listen(this.l, "media_status", this.gj);
  this.B.listen(this.l, "media_key_request", this.aA);
  this.B.listen(this.l, "remove_activity", this.bA);
  this.B.listen(this.l, "custom_message", this.Zz);
  this.dg.D();
  this.Pb.D()
};
gm.prototype.isAppInTab = function(a) {
  return this.Pb.wq(a)
};
d = gm.prototype;
d.jA = function(a, b) {
  return this.Pb.OF(a, b)
};
d.mg = function() {
  this.Pb.CF().forEach(function(a) {
    this.EF(a)
  }, this)
};
d.EF = function(a) {
  a.FG().forEach(function(b) {
    this.Nt(a, b)
  }, this)
};
d.Nt = function(a, b, c) {
  var e = this.P.uD(b), e = this.sD(a, e);
  a.vD(e);
  this.gf(a, new fd("CastApi", a.Bc(), null != c ? c : null, "ReceiverListUpdateEvent", new gd(b, e)))
};
d.sD = function(a, b) {
  return b ? this.dg.RF(a.Im(), b) : []
};
d.Qw = function(a, b) {
  this.P.refresh();
  var c = b.message;
  a.gE(c);
  this.Kh.Ut(0 <= ve.indexOf(c) ? "ChromeCast" : c);
  this.Nt(a, c, b.seq)
};
d.Zw = function(a, b) {
  a.lH(b.message)
};
d.$w = function(a, b) {
  var c = t(function(c) {
    this.th(a, b, "CustomMessageResultEvent", c)
  }, this), e = ma(c, null), f = b.message, g = this.l.Ba(f.activityId);
  g ? g.Q() != a.Q() ? c("Cannot send message to activity " + f.activityId + " from this tab.") : g.mm(f.namespace, f.message, e, c) : c("No such activity: " + f.activityId)
};
d.Rw = function(a, b) {
  var c = Wa(b.message);
  Ua(b.source);
  var e = Ua(c[0]), c = Ua(c[1]);
  -1 != Tc.indexOf(e) ? this.a.e("Attempting to add listener for reserved namespace.") : a.qi(c) ? a.Ix(e) : this.a.e("Attempting to add custom message listener for activity " + c + " not owned by this client.")
};
d.Yw = function(a, b) {
  var c = Wa(b.message);
  Ua(b.source);
  var e = Ua(c[0]);
  Ua(c[1]);
  -1 != Tc.indexOf(e) ? this.a.e("Attempting to remove listener for reserved namespace.") : a.Kx(e)
};
d.Zz = function(a) {
  w("custom_message" == a.type);
  var b = this.Pb.ox(a.namespace, a.activityId);
  b ? this.gf(b, new fd("CastApi", b.Bc(), null, "CustomMessageEvent", new hd(a.activityId, a.namespace, a.message))) : this.a.e("Unexpected custom message for activity " + a.activityId + " and namespace " + a.namespace)
};
d.Xw = function(a, b) {
  var c = b.source;
  Rc(this.a, "Registering client: " + JSON.stringify({tabId:a.id, clientId:c}), a.url);
  var e = this.Pb.nw(a.id, c, a.url);
  e && (this.ow(e), a.url && (c = Cl(a.url), this.l.Yk(c).forEach(function(a) {
    e.vp(a.c())
  }, this)))
};
d.ow = function(a) {
  var b = this.l.gm(a.Q());
  b && 1 == b.Ja().length && a.iB(this.dg.ks(a.Im(), b.Ja()[0]))
};
d.$z = function(a) {
  this.a.info("Page-unload event from tab " + a.id);
  var b = u();
  this.Pb.Qy(a.id).forEach(function(a) {
    this.gf(a, new fd("CastApi", a.Bc(), null, "ping", {}))
  }, this);
  S(function() {
    this.Pb.Sy(a.id, b)
  }, 3E3, this)
};
d.Qo = function(a, b) {
  this.Pw(b);
  var c = b.source;
  w("CastApi" != c);
  w("CastApi" == b.target);
  if("RegisterClient" == b.type) {
    this.Xw(a, b)
  }else {
    if(c = this.Pb.Ip(a.id, c)) {
      switch(c.bx(), b.type) {
        case "AddReceiverListener":
          this.Qw(c, b);
          break;
        case "RemoveReceiverListener":
          this.Zw(c, b);
          break;
        case "LaunchActivity":
          this.Uw(c, b, a);
          break;
        case "JoinActivity":
          this.Tw(c, b, a);
          break;
        case "LeaveActivity":
          this.Vw(c, b);
          break;
        case "StopActivity":
          this.ax(c, b);
          break;
        case "GetActivityStatus":
          this.Sw(c, b);
          break;
        case "AddMediaStatusListener":
          break;
        case "RemoveMediaStatusListener":
          break;
        case "SendCustomMessage":
          this.$w(c, b);
          break;
        case "AddCustomMessageListener":
          this.Rw(c, b);
          break;
        case "RemoveCustomMessageListener":
          this.Yw(c, b);
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
          this.Ww(c, b);
          break;
        case "LogMessage":
          break;
        case "pong":
          break;
        default:
          Rc(this.a, "Unknown request : " + b.type, b, Fc)
      }
    }else {
      this.a.e("No registered client exists for request " + b.type + " from tab " + a.id)
    }
  }
};
d.Pw = function(a) {
  "LogMessage" != a.type && Rc(this.a, "App request: " + a.type, a)
};
d.Zt = function(a, b, c, e) {
  a.vp(c);
  c = new $c(c, "running");
  p(e) && (c.extraData.joinableState = e);
  this.th(a, b, "ActivityStatusEvent", c)
};
d.Yt = function(a, b, c) {
  var e = new $c(null, "error");
  e.errorString = c;
  this.th(a, b, "ActivityStatusEvent", e)
};
d.Uw = function(a, b, c) {
  var e = b.message, f = t(this.Zt, this, a, b);
  a = t(this.Yt, this, a, b);
  e.receiver.id = this.dg.Wt(e.receiver.id);
  this.Oa.Ph(c, e, f, a)
};
d.Tw = function(a, b, c) {
  var e = b.message, f = t(this.Zt, this, a, b);
  a = t(this.Yt, this, a, b);
  e.receiver.id = this.dg.Wt(e.receiver.id);
  this.Oa.join(c, e, f, a)
};
d.tl = function(a, b, c, e, f) {
  c = new $c(b.message, c);
  c.errorString = e || null;
  f && (c.extraData = f);
  this.th(a, b, "ActivityStatusEvent", c)
};
d.Sw = function(a, b) {
  var c = this.l.Ba(b.message);
  if(c) {
    var e = c.Ja()[0];
    e.isLocal() ? (new Qk(e)).Bk(c.Eb(), t(this.px, this, a, b)) : this.a.info("Getting the status of non-local activity is not supported")
  }else {
    this.tl(a, b, "error", "Activity does not exist")
  }
};
d.px = function(a, b, c, e, f) {
  f ? this.tl(a, b, "error", f, null) : this.tl(a, b, e.state, null, e.extraData)
};
d.Vw = function(a, b) {
  var c = b.message;
  a.rt(c);
  this.l.YC(c)
};
d.ax = function(a, b) {
  var c = b.message;
  a.rt(c);
  this.l.stopActivityById(c)
};
d.gf = function(a, b) {
  w(-1 != a.Q());
  Rc(this.a, "Sending message to app @tab " + a.Q() + ":" + b.type, b);
  a.hq() ? this.jq(a.Bc(), "event_to_app", b) : this.sa.oq(a.Q(), "event_to_app", b)
};
d.th = function(a, b, c, e) {
  b = new fd("CastApi", a.Bc(), Ta(b.seq), c, e);
  this.gf(a, b)
};
d.Ww = function(a, b) {
  w(b.message.activityId);
  w(b.message.rampRequest);
  var c = b.message.activityId, e = this.l.Ba(c);
  if(e && a.qi(c)) {
    var f = kd(b);
    f.message ? e.Ke(f.message) : this.Ns(a, c, b, "Invalid RAMP request: " + f.error)
  }else {
    this.Ns(a, c, b, "Unknown activity id")
  }
};
d.gj = function(a) {
  w("media_status" == a.type);
  var b = this.Pb.du(a.status.activityId);
  if(b) {
    var c = a.status, e = new bd(a.status.activityId);
    e.success = !0;
    e.status = c;
    e.errorString = null;
    this.gf(b, new fd("CastApi", b.Bc(), a.cmdId, "MediaResultEvent", e))
  }
};
d.aA = function(a) {
  w("media_key_request" == a.type);
  var b = this.Pb.du(a.ju.activityId);
  b && this.gf(b, new fd("CastApi", b.Bc(), null, "MediaKeyRequest", a.ju))
};
d.bA = function(a) {
  this.gj(new Kl(0, new ad(a.activityId, 1)))
};
d.Ns = function(a, b, c, e) {
  b = new bd(b);
  b.success = !1;
  b.status = null;
  b.errorString = e;
  this.th(a, c, "MediaResultEvent", b)
};
var hm = function(a) {
  this.a = H("cv.CastExtensionIo");
  this.ad = a
}, im = ["gdijeikdkaembjbdobgfkoidjkpbmlkd", "mjekoljodoiapgkggnlmbecndfpbbcch", "llohocloplkbhgcfnplnoficdkiechcn", "icljpnebmoleodmchaaajbkpoipfoahp"];
hm.prototype.D = function() {
  chrome.runtime.onMessageExternal.addListener(t(this.vF, this));
  this.ad.jq = t(this.xF, this)
};
hm.prototype.xF = function(a, b, c) {
  this.a.w("Sending extension message to " + a);
  chrome.runtime.sendMessage(a, c)
};
hm.prototype.vF = function(a, b, c) {
  -1 == im.indexOf(b.id) ? (this.a.w("Received request from invalid ID: " + b.id), c(!1)) : (c(!0), a.target && (c = {id:-4, url:"chrome-extension://" + b.id}, a.source = b.id, this.ad.Qo(c, a)))
};
var jm = function(a, b) {
  var c = [];
  a.forEach(function(a) {
    var f = z(b, function(b) {
      return b.receiver.id == a.c()
    });
    (f || a.PB()) && c.push(new Tk(a.ys(), f))
  });
  return c
}, lm = function(a, b) {
  var c = [];
  a.forEach(function(a) {
    (a = km(a, b)) && c.push(a)
  });
  return c
}, km = function(a, b) {
  if(a && a.Ja() && 1 == a.Ja().length) {
    var c = a.bg().text;
    c || (c = "ChromeCast" == a.Eb() ? "No title" : a.Eb());
    var e = a.Ja()[0];
    return new Sk(a.c(), new Xc(e.c(), e.Qh()), a.bg().iconUrl, c, b, a.Go(), a.Q(), a.isLocal(), a.za())
  }
  return null
}, mm = function(a) {
  var b = a.ka();
  return new Vk(b.captureSurface, b.lowFpsMode, a.ui().castAppNotificationDismissed, b.pk())
};
var nm = function(a, b, c, e, f, g, k, l) {
  this.tb = $.I();
  this.l = a;
  this.P = b;
  this.hp = k;
  this.Oa = c;
  this.sa = e;
  this.Xf = f;
  this.ad = g;
  this.Yf = l;
  this.a = H("cv.PopupMenuService");
  this.B = new R(this);
  this.Ne = !1
};
d = nm.prototype;
d.D = function() {
  this.sa.listen("popup_menu_request", t(this.xA, this));
  this.B.listen(this.l, "media_status", this.gj);
  this.B.listen(this.l, "new_activity", this.fc);
  this.B.listen(this.l, "leave_activity", this.fc);
  this.B.listen(this.l, "remove_activity", this.fc);
  this.B.listen(this.P, "receiver_list", this.mg);
  this.B.listen(this.tb, "new_issue", this.zr);
  this.B.listen(this.tb, "remove_issue", this.zr)
};
d.mg = function() {
  this.fc()
};
d.zr = function() {
  this.fc()
};
d.xA = function(a, b) {
  if(-1 == a.id) {
    switch(this.Ne = !1, this.a.info("Popup request: " + b.type), this.a.w("  the request is " + JSON.stringify(b)), b.type) {
      case "init":
        this.ey();
        break;
      case "act_on_issue":
        this.dy(b.message);
        break;
      case "stop_activity":
        this.hy(b.message);
        break;
      case "PlayMedia":
      ;
      case "PauseMedia":
      ;
      case "SetMediaVolume":
        this.gy(b);
        break;
      case "launch_tab_mirror":
        this.Mo(b.message);
        break;
      case "launch_desktop_mirror":
        this.fy(b.message);
        break;
      case "update_settings":
        this.iy(b.message);
        break;
      default:
        this.a.info("Unknown request: " + JSON.stringify(b))
    }
  }
};
d.iy = function(a) {
  var b = M.I(), c = b.ka();
  c.captureSurface = a.captureSurface;
  c.lowFpsMode = a.lowFpsMode;
  b.ui().castAppNotificationDismissed || (b.ui().castAppNotificationDismissed = a.castAppNotificationDismissed);
  this.LC(a.mirrorQualityId, c);
  M.I().qe()
};
d.LC = function(a, b) {
  if(Id(a) && a != b.pk()) {
    this.a.w("Changing mirror quality to " + a);
    this.Jv();
    b.Kv(a);
    var c = this.l.Ie();
    if(c) {
      var e = c.Ja()[0].c(), f = c.Q();
      this.l.stopActivityById(c.c());
      Bl(f, t(function(a) {
        a && this.Mo(e, a)
      }, this))
    }
  }
};
d.uC = function() {
  var a = t(function() {
    this.or() && (this.P.refresh(), this.hp && this.hp.refresh(), this.Yf.refresh(), S(a, 1E4, this))
  }, this);
  a()
};
d.ey = function() {
  var a = M.I().ka();
  a.captureSurface = "tab";
  a.lowFpsMode = !1;
  M.I().qe();
  this.Xf.ve();
  this.fc();
  this.uC()
};
d.or = function() {
  return 0 < chrome.extension.getViews({type:"popup"}).length
};
d.Jv = function() {
  var a = chrome.extension.getViews({type:"popup"});
  0 < a.length && a[0].close()
};
d.fc = function() {
  if(this.or() && !this.Ne) {
    var a = null;
    this.tb.ej() && (a = this.tb.rr().lA());
    var b = lm(this.Oa.mr(), !0), c = this.P.og(), e = lm(this.l.getAllActivities(), !1), f = jm(c, e.concat(b)), g = mm(M.I()), b = t(function(b) {
      var c = this.l.gm(b.id);
      b = b.url ? this.ad.jA(b.id, Cl(b.url)) : !1;
      c = new Wk(f, a, km(c, !1), g, b);
      this.sa.kA("popup", "event_to_popup", new fd("CastApi", "popup", null, "model_update", c))
    }, this);
    xl(b)
  }
};
d.dy = function(a) {
  this.tb.dr(a.id, a.isDefaultAction);
  this.tb.nF()
};
d.hy = function(a) {
  this.l.Ba(a) ? this.l.stopActivityById(a) : (this.a.e("Popup menu has non-existing activity " + a), this.fc())
};
d.gy = function(a) {
  w(a.message.activityId);
  w(a.message.rampRequest);
  var b = this.l.Ba(a.message.activityId);
  b && (a = kd(a), a.message ? b.Ke(a.message) : this.a.e("Invalid RAMP request: " + a.error))
};
d.fy = function(a) {
  this.Ne = !0;
  var b = t(function() {
    this.Ne = !1;
    this.fc()
  }, this);
  a = new Zc("mirror_tab", new Xc(a, ""));
  a.disconnectPolicy = "stop";
  a.description = new Yc;
  a.description.text = "Capturing desktop";
  a.description.url = "data/screen100.png";
  this.Oa.Ph({id:-2}, a, b, b)
};
d.Mo = function(a, b) {
  var c = t(function(b) {
    this.Ne = !0;
    var c = t(function() {
      this.Ne = !1;
      this.fc()
    }, this), g = new Zc("mirror_tab", new Xc(a, ""));
    g.disconnectPolicy = "stop";
    g.description = new Yc;
    g.description.text = b.title;
    g.description.url = b.favIconUrl;
    this.Oa.Ph(b, g, c, c)
  }, this);
  b ? c(b) : M.I().ka().allowAutoResize ? zl(16 / 9, function() {
    xl(c)
  }) : xl(c)
};
d.gj = function(a) {
  w("media_status" == a.type);
  this.fc()
};
var om = function(a, b) {
  this.a = H("cv.TabEventsHandlers");
  this.l = a;
  this.Oa = b
};
d = om.prototype;
d.D = function() {
  "object" == typeof chrome.tabs.onReplaced && chrome.tabs.onReplaced.addListener(t(this.SC, this));
  chrome.tabs.onRemoved.addListener(t(function(a) {
    this.l.RC(a)
  }, this));
  chrome.tabs.onUpdated.addListener(t(this.TC, this))
};
d.TC = function(a, b, c) {
  "complete" == b.status ? (this.Zu(c), this.HG(c)) : b.favIconUrl && "complete" == c.status && this.Zu(c, !0)
};
d.Zu = function(a, b) {
  var c = this.l.gm(a.id);
  c && (c.$f(a.title, a.favIconUrl, 4), c.Ir(a.url ? Cl(a.url) : null), c.wo(), b || c.BC())
};
d.SC = function(a, b) {
  this.a.info("Tab replaced detected.");
  var c = !1, e = "", f = null;
  this.l.Xd(b).forEach(function(a) {
    "mirror_tab" == a.za() && (f = a, c = !0, e = a.Ja()[0].c())
  }, this);
  f && f.xv();
  this.l.yv(b, c);
  if(c) {
    this.a.info("Restarting mirroring.");
    var g = t(function() {
      this.a.e("Launch tab mirroring failed after tab replace.")
    }, this), k = new Zc("mirror_tab", new Xc(e, ""));
    k.disconnectPolicy = "stop";
    chrome.tabs.get(a, t(function(a) {
      a && (k.description = new Yc, k.description.text = a.title, k.description.url = a.favIconUrl, this.Oa.Ph(a, k, m, g))
    }, this))
  }
};
d.HG = function(a) {
  var b = new U(a.url);
  b && ("http" == b.zd() || "https" == b.zd()) && b.zc() && hb(M.I().Uq(), function(c) {
    if(na(b.zc(), c)) {
      return this.nD(a), !0
    }
  }, this)
};
d.nD = function(a) {
  this.a.info("Injecting api_content_script into " + a.id);
  chrome.tabs.executeScript(a.id, {file:"api_content_script.js"}, m)
};
var pm = function() {
  ij.call(this);
  p(Gf) && (Gf = JSON.parse);
  p(Hf) && (Hf = JSON.parse);
  this.Wf = new hj;
  this.tb = $.I();
  this.sa = new Fl("background");
  this.rz = new Ql(this.Wf.c());
  this.rk = null;
  this.ne = new Gk;
  this.xq = new Hk;
  this.P = new Ik(this.ne, this.xq);
  this.ra = new Lk(this.P, this.rz, this.rk);
  this.l = new Nl(this.ra);
  this.Xf = new Tl(this.l);
  this.ly = new Ol(this.l);
  this.Ll = M.I().qz() ? new Sl(this.P, this.ra, this.Wf.c()) : null;
  this.Kh = new Vl(this.P);
  this.Oa = new Wl(this.Wf, this.ra, this.l, this.P, this.sa);
  this.ny = new om(this.l, this.Oa);
  this.B = new R;
  this.ad = new gm(this.l, this.P, this.Oa, this.sa, this.Kh);
  this.Yf = new Yl(this.l, this.Oa, this.P, this.ra);
  this.cy = new nm(this.l, this.P, this.Oa, this.sa, this.Xf, this.ad, this.Ll, this.Yf);
  new Ul(this.P);
  this.ky = new hm(this.ad)
};
v(pm, ij);
da(pm);
d = pm.prototype;
d.Rr = function() {
  this.l.ts() || 0 < this.Oa.mr().length ? (this.l.iC() && this.Yf.refresh(), S(this.Rr, 9E5, this)) : chrome.runtime.reload()
};
d.CC = function() {
  var a = null, a = new $l;
  a.En().gn = !0;
  a.En().Gj = !0;
  a.En().Fj = !0;
  H("cv").tc(Gc);
  H("goog").tc(Gc);
  vc(Pc(H("browser")));
  a.To(!0)
};
d.pz = function() {
  this.Kh.D();
  this.sa.D();
  this.HA();
  this.ra.IA(this.l);
  this.ra.D();
  this.l.D();
  this.Xf.D();
  this.ly.D();
  this.ny.D();
  this.ad.D();
  this.ky.D()
};
d.nE = function() {
  this.CC();
  this.ne.D();
  this.Yf.D();
  this.cy.D();
  this.Ll && this.Ll.D();
  this.Xf.ve();
  chrome.runtime.onUpdateAvailable.addListener(t(this.Rr, this))
};
d.j = function() {
  pm.q.j.call(this)
};
d.Xe = function() {
  return this.B
};
d.Ui = function() {
  return this.l
};
d.Jk = function() {
  return M.I()
};
d.jj = function() {
  return Qc()
};
pm.prototype.getWebRtcStats = function() {
  return JSON.stringify($e.I().getStats())
};
pm.prototype.Ev = function() {
  $e.I().reset()
};
pm.prototype.HA = function() {
};
var qm = function() {
};
da(qm);
qm.prototype.D = function() {
  chrome.runtime.onInstalled.addListener(t(this.$G, this))
};
qm.prototype.$G = function(a) {
  "install" == a.reason && chrome.storage.sync.get("blockChromekeySetupAutoLaunchOnInstall", function(a) {
    a && a.blockChromekeySetupAutoLaunchOnInstall || (chrome.storage.sync.set({blockChromekeySetupAutoLaunchOnInstall:!0}, function() {
      chrome.runtime.lastError && H("cv.InitialSetupHandler").e("Failed to set blockChromekeySetupAutoLaunchOnInstall: " + chrome.runtime.lastError.message)
    }), gj() && chrome.tabs.create({url:chrome.extension.getURL("options.html?showFlow=true")}))
  })
};
document.addEventListener("DOMContentLoaded", function() {
  "background" == document.body.id && (qm.I().D(), M.I().EC(), M.I().DC(function() {
    Sc = pm.I();
    ba("backgroundSetup", Sc, void 0);
    jj(Sc)()
  }))
}, !1);
window.addEventListener("beforeunload", function() {
  "background" == document.body.id && pm.I().V()
}, !1);
var rm = rm || {};
rm.D = function() {
  rm.isInited = !0;
  document.uH = rm.RG;
  chrome.extension.onMessage.addListener(sm);
  tm()
};
rm.RG = function() {
  var a = document.webkitFullscreenElement, a = {source:"content", target:"background", type:"full_screen_video_status", content:!(!a || "VIDEO" != a.tagName && !a.querySelector("VIDEO"))};
  chrome.extension.sendMessage(JSON.stringify(a))
};
var um = function(a) {
  if(a.querySelector('object[type="application/x-silverlight"]') || a.querySelector('object[type="application/x-silverlight-2"]') || a.querySelector('embed[type="video/quicktime"]')) {
    return!0
  }
  a = a.getElementsByTagName("iframe");
  for(var b = 0;b < a.length;b++) {
    var c = a[b], e = c.contentDocument;
    e || (e = c.contentWindow.document);
    try {
      if(um(e)) {
        return!0
      }
    }catch(f) {
    }
  }
  return!1
}, tm = function() {
  chrome.extension.sendMessage(JSON.stringify({source:"content", target:"background", type:"unsupported_plugin_detected", content:um(document)}))
}, sm = function(a) {
  if("string" != typeof a) {
    throw"Expecting string from extension. But get: " + JSON.stringify(a);
  }
  a = JSON.parse(a);
  "background" == a.source && "content" == a.target && "detect_unsupported_plugin" == a.type && tm()
};
rm.isInited || rm.D();
var vm = function(a, b, c) {
  a.timeOfStartCall = (new Date).getTime();
  var e = c || h;
  e.GOOGLE_FEEDBACK_START_ARGUMENTS = arguments;
  var f = a.serverUri || "//www.google.com/tools/feedback", g = e.GOOGLE_FEEDBACK_START;
  g ? g.apply(e, arguments) : (e = e.document, g = e.createElement("script"), g.src = f + "/load.js", e.body.appendChild(g))
};
chrome.i18n.getMessage("4014224501758376361", ["{{receiverName}}"]);
chrome.i18n.getMessage("6046507125919556913");
chrome.i18n.getMessage("1189144544819350763");
chrome.i18n.getMessage("3430817026795535765");
var wm = chrome.i18n.getMessage("4089994756445820175"), xm = chrome.i18n.getMessage("780135806192376347"), ym = chrome.i18n.getMessage("2438859709710567679"), zm = chrome.i18n.getMessage("2076488708707463944"), Am = chrome.i18n.getMessage("3996247341169314250"), Bm = chrome.i18n.getMessage("7053128562708856478"), Cm = chrome.i18n.getMessage("8500110749168055241"), Dm = chrome.i18n.getMessage("3844709005265884931"), Em = chrome.i18n.getMessage("4224760847878375792"), Fm = chrome.i18n.getMessage("4584454172263179470"), 
Gm = chrome.i18n.getMessage("5823878688587296398"), Hm = chrome.i18n.getMessage("7008828272760191653"), Im = chrome.i18n.getMessage("2377419936291389581"), Jm = chrome.i18n.getMessage("4324962226715124466"), Km = chrome.i18n.getMessage("6039331491778328245"), Lm = chrome.i18n.getMessage("8887833628383960193"), Mm = chrome.i18n.getMessage("6118473811359442709"), Nm = chrome.i18n.getMessage("4272010402571776761"), Om = chrome.i18n.getMessage("482442943064110817"), Pm = chrome.i18n.getMessage("5745355507138230213"), 
Qm = chrome.i18n.getMessage("7029426286291560071"), Rm = chrome.i18n.getMessage("8189622236075700665"), Sm = chrome.i18n.getMessage("6018881802001125637"), Tm = chrome.i18n.getMessage("4865676252029097872"), Um = chrome.i18n.getMessage("6988652234001902672"), Vm = chrome.i18n.getMessage("6295154563386647404", ["{{attemptNumber}}"]);
"undefined" != typeof angular && angular.module("feedbackController", ["chrome_i18n"]);
var Wm = function(a, b) {
  chrome.extension.getBackgroundPage() && chrome.extension.getBackgroundPage().backgroundSetup || window.close();
  this.b = a;
  this.b.top = a;
  this.Re = chrome.extension.getBackgroundPage().backgroundSetup;
  var c = new $l;
  Oc().tc(Ic);
  cm(chrome.extension.getBackgroundPage().console);
  c.To(!0);
  this.a = H("cv.Feedback");
  this.ge = null;
  this.Sk = [];
  this.Wv();
  this.Uv();
  this.Vv();
  b.location.hash && -1 < b.location.hash.indexOf("requestMirroringSessionFeedback") ? (a.requestMirroringSessionFeedback = !0, a.feedbackType = "MirroringQuality") : (c = window.location.href ? (new U(window.location.href)).uk().get("feedbackType") : null) && this.Tv(c) && (a.feedbackType = c);
  a.showSendConfirmation = !1;
  a.closeWindow = function() {
    window.close()
  }
};
ba("FeedbackCtrl", Wm, void 0);
Wm.$inject = ["$scope", "$window"];
Wm.prototype.Tv = function(a) {
  return!!z(this.Sk, function(b) {
    return b.value == a
  })
};
Wm.prototype.Uv = function() {
  this.Sk = [{value:"Bug", desc:wm}, {value:"FeatureRequest", desc:xm}, {value:"MirroringQuality", desc:ym}, {value:"Discovery", desc:zm}, {value:"Other", desc:Am}];
  this.b.feedbackTypes = this.Sk
};
var Xm = function(a, b) {
  this.id = a;
  this.desc = b;
  this.text = 0 == a ? b : a + " (" + b + ")"
};
d = Wm.prototype;
d.wm = function(a) {
  for(var b = [], c = 1;c < arguments.length;c++) {
    b.push(new Xm(c, arguments[c]))
  }
  b.push(new Xm(0, arguments[0]));
  return b
};
d.Wv = function() {
  this.b.videoSmoothnessRatings = this.wm(Gm, Bm, Cm, Dm, Em, Fm);
  this.b.videoQualityRatings = this.wm(Gm, Hm, Im, Jm, Km, Lm);
  this.b.audioQualityRatings = this.wm(Gm, Mm, Nm, Om, Pm, Qm)
};
d.Vv = function() {
  this.b.feedbackType = "Bug";
  this.b.sendFeedback = t(this.rA, this);
  this.b.cancel = t(this.qA, this);
  this.b.attachLogsClick = t(this.pA, this)
};
d.qA = function() {
  this.b.feedbackDescription && !confirm(Rm) || window.close()
};
d.rA = function() {
  var a = this.b.feedbackType, b = "";
  null == this.ge && (this.ge = new Nd);
  var c = !1, e = !1;
  "MirroringQuality" == a ? (this.b.cpu && (b += "\nProcessor: " + this.b.cpu, this.ge.cpu = this.b.cpu, c = !0), this.b.gpu && (b += "\nGraphics: " + this.b.gpu, this.ge.gpu = this.b.gpu, c = !0), this.b.videoSmoothness && (b += "\nVideo Smoothness: " + this.b.videoSmoothness, e = !0), this.b.videoQuality && (b += "\nVideo Quality: " + this.b.videoQuality, e = !0), this.b.audioQuality && (b += "\nAudio: " + this.b.audioQuality, e = !0), this.b.projectedContentUrl && (b += "\nProjected Content/URL: " + 
  this.b.projectedContentUrl), this.b.comments && (b += "\nComments: " + this.b.comments, e = !0)) : "Discovery" == a && (this.b.visibleInSetup && (b += "\nChromecast Visible In Setup: " + this.b.visibleInSetup, e = !0), this.b.hasNetworkSoftware && (b += "\nUsing VPN/proxy/firewall/NAS Software: " + this.b.hasNetworkSoftware, this.ge.hasNetworkSoftware = this.b.hasNetworkSoftware, c = !0), this.b.networkDescription && (b += "\nNetwork Description: " + this.b.networkDescription, this.ge.networkDescription = 
  this.b.networkDescription, c = !0), this.b.comments && (b += "\nComments: " + this.b.comments, e = !0));
  this.b.feedbackDescription && (e = !0, b += this.b.feedbackDescription);
  c && this.Re.Jk().gA(this.ge);
  e && this.fA("Type: " + a + "\n\n" + b)
};
d.fA = function(a) {
  this.b.showSendConfirmation = !0;
  this.b.sendDialogText = Sm;
  this.b.feedbackSent = !1;
  var b = t(function() {
    this.a.info("Feedback submission succeeded.");
    this.Re.Ev();
    this.b.sendDialogText = Um;
    this.b.feedbackSent = !0;
    this.b.$apply()
  }, this), c = t(function() {
    this.a.info("Feedback submission failed.");
    this.b.sendDialogText = Tm;
    this.b.feedbackSent = !0;
    this.b.$apply()
  }, this), e = this.Re.getWebRtcStats(), f = this.Re.Jk().Fv(), g = t(function(a, b, c) {
    this.a.info("feedback send callback: " + JSON.stringify({attempt:a.Mk(), isSuccess:b, info:c}));
    b ? a.jk() : (this.b.sendDialogText = Sj.I().getMessage(Vm, {attemptNumber:a.Mk()}), this.b.$apply(), a.Rd())
  }, this), k = t(function(b) {
    this.a.info("attempt sending feedback: " + b.Mk());
    b = ma(g, b);
    var c = this.b.logs || "", k = this.b.externalLogs || "", l = chrome.runtime.getManifest();
    vm({productId:85561, bucket:l.feedbackBucket, flow:"submit", serverUri:"https://www.google.com/tools/feedback", allowNonLoggedInFeedback:!0, locale:"en", report:{description:a}, callback:b}, {version:l.version, description:l.description, settings:f || "", logs:c || "NA", external_logs:k || "NA", "webRTC stats":e || "NA"})
  }, this), l = new ej;
  l.nk(4);
  l.Gh(1E4);
  l.no(2);
  l.start(k, b, c)
};
d.pA = function() {
  if(this.b.attachLogs) {
    var a = null;
    gj() && (a = chrome.extension.getBackgroundPage().getChromeKeySetupLogs);
    this.b.logs = a ? ">>> Background Page Logs <<<\n" + this.Re.jj() + "\n\n\n\n>>> ChromeKey Setup Page Logs <<<\n" + a() : this.Re.jj()
  }else {
    this.b.logs = ""
  }
};
"undefined" != typeof angular && angular.module("optionsController", ["chrome_i18n"]);
var Zm = function(a) {
  chrome.extension.getBackgroundPage() && chrome.extension.getBackgroundPage().backgroundSetup || window.close();
  a.Ek = function(b, c) {
    a.$watch(b, function(a, b) {
      JSON.stringify(b) != JSON.stringify(a) && c(a)
    })
  };
  a.model = a;
  this.A = this.Lv();
  this.a = H("cv.OptionsCtrl");
  this.b = a;
  this.b.showSavedMessage = !1;
  this.b.stopCasting = t(this.Qv, this);
  this.b.isChromekeySetupActive = !1;
  this.Pv();
  this.Mv();
  this.Nv();
  this.Ov();
  Ym = t(function(a) {
    this.b.isChromekeySetupActive = a;
    this.b.$apply()
  }, this)
};
ba("OptionsCtrl", Zm, void 0);
Zm.$inject = ["$scope"];
var Ym = null;
ba("notifyChromekeySetupActive", function(a) {
  Ym && Ym(a)
}, void 0);
d = Zm.prototype;
d.Yg = function() {
  return chrome.extension.getBackgroundPage().backgroundSetup
};
d.Lv = function() {
  return this.Yg().Jk()
};
d.Nv = function() {
  this.b.qualityLevels = Hd;
  this.b.isMirroring = !!this.Yg().Ui().Ie();
  this.b.Ek("quality", t(function(a) {
    this.b.qualityLevels.forEach(t(function(b) {
      "custom" != a && b.id == a && (this.b.videoResolution = b.videoResolution, this.b.maxVideoBitrate = b.maxVideoBitrate, this.b.minVideoBitrate = b.minVideoBitrate, this.b.videoQuality = b.videoQuality, this.b.audioBitrate = b.audioBitrate)
    }, this));
    this.Zi("quality")
  }, this));
  this.Xz(!0)
};
d.Zi = function() {
  this.b.showStopCasting = !!this.Yg().Ui().Ie();
  this.hA()
};
d.Qv = function() {
  this.b.showStopCasting = !1;
  var a = this.Yg().Ui().Ie();
  a && this.Yg().Ui().stopActivityById(a.c())
};
d.Xz = function(a) {
  var b = this.b.quality || null;
  this.b.quality = this.A.ka().pk();
  "custom" == this.b.quality && (this.b.quality = Gd.id);
  a || (null == b || b == this.b.quality) && "custom" != this.b.quality || this.Zi("quality")
};
d.Pv = function() {
  this.b.zoomMode = this.A.ka().zoomModeEnabled ? "on" : "off";
  this.b.Ek("zoomMode", t(function() {
    this.Zi("zoomMode")
  }, this))
};
d.Mv = function() {
  this.b.allowAutoResize = this.A.ka().allowAutoResize;
  this.b.Ek("allowAutoResize", t(function() {
    this.Zi("allowAutoResize")
  }, this))
};
d.hA = function() {
  p(this.b.videoResolution) && this.A.ka().Tq(this.b.videoResolution);
  p(this.b.minVideoBitrate) && this.A.ka().Iz(this.b.minVideoBitrate);
  p(this.b.maxVideoBitrate) && this.A.ka().Hz(this.b.maxVideoBitrate);
  p(this.b.videoQuality) && this.A.ka().Kz(this.b.videoQuality);
  p(this.b.audioBitrate) && this.A.ka().$l(this.b.audioBitrate);
  p(this.b.bufferSizeMillis) && this.A.ka().Fz(this.b.bufferSizeMillis);
  p(this.b.maxFrameRate) && this.A.ka().Gz(this.b.maxFrameRate);
  p(this.b.zoomMode) && (this.A.ka().zoomModeEnabled = "on" == this.b.zoomMode);
  p(this.b.allowAutoResize) && (this.A.ka().allowAutoResize = this.b.allowAutoResize ? !0 : !1);
  p(this.b.enablePacing) && this.A.ka().Jz(this.b.enablePacing ? !0 : !1);
  p(this.b.enableAudioTcp) && this.A.ka().Dz(this.b.enableAudioTcp ? !0 : !1);
  p(this.b.enableVideoTcp) && this.A.ka().Lz(this.b.enableVideoTcp ? !0 : !1);
  p(this.b.enableAudioNack) && this.A.ka().Cz(this.b.enableAudioNack ? !0 : !1);
  p(this.b.autoFeedback) && this.A.ka().Ez(this.b.autoFeedback ? !0 : !1);
  this.A.qe();
  this.b.showSavedMessage = !0
};
d.Ov = function() {
  this.b.customDomains = this.A.Uq();
  this.b.$watch("customDomains", t(function(a) {
    this.A.Tz(a)
  }, this), !0);
  this.b.addCustomDomain = t(function() {
    var a = this.b.newCustomDomain;
    a && -1 == this.b.customDomains.indexOf(a) && this.b.customDomains.push(a);
    this.b.newCustomDomain = ""
  }, this);
  this.b.deleteCustomDomain = t(function(a) {
    nb(this.b.customDomains, a)
  }, this)
};

