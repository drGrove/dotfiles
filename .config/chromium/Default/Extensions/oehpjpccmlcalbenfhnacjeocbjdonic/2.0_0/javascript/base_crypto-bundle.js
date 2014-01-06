//third_party/javascript/jsbn/crypto_min.js
/*
 * @license
 * Copyright (c) 2003-2005 Tom Wu
 * All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
 *
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * In addition, the following condition applies:
 *
 * All redistributions must retain an intact copy of this copyright notice
 * and disclaimer.
 */
(function(C){function e(a,b,c){this.array=[];null!=a&&("number"==typeof a?this.fromNumber(a,b,c):null==b&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function k(){return new e(null)}function S(a,b){var c=J[a.charCodeAt(b)];return null==c?-1:c}function B(a){var b=k();b.fromInt(a);return b}function K(a){var b=1,c;if(0!=(c=a>>>16)){a=c,b+=16;}if(0!=(c=a>>8)){a=c,b+=8;}if(0!=(c=a>>4)){a=c,b+=4;}if(0!=(c=a>>2)){a=c,b+=2;}0!=a>>1&&(b+=1);return b}function D(a){this.m=a}function E(a){this.m=
a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<l-15)-1;this.mt2=2*a.t}function Y(a,b){return a&b}function M(a,b){return a|b}function T(a,b){return a^b}function U(a,b){return a&~b}function H(){}function V(a){return a}function G(a){this.r2=k();this.q3=k();e.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}function N(){this.j=this.i=0;this.S=[]}function W(a){x[o++]^=a&255;x[o++]^=a>>8&255;x[o++]^=a>>16&255;x[o++]^=a>>24&255;o>=O&&(o-=O)}function P(){}function y(a,
b){return new e(a,b)}function z(){this.n=null;this.e=0;this.coeff=this.dmq1=this.dmp1=this.q=this.p=this.d=null}function q(a,b){this.x=b;this.q=a}function n(a,b,c,d){this.curve=a;this.x=b;this.y=c;this.z=null==d?e.ONE:d;this.zinv=null}function p(a,b,c){this.q=a;this.a=this.fromBigInteger(b);this.b=this.fromBigInteger(c);this.infinity=new n(this,null,null)}function v(a,b,c,d){this.curve=a;this.g=b;this.n=c;this.h=d}function m(a){return new e(a,16)}var I,l,s,t,X,Q,R;e.am1=function(a,b,c,d,g,h){for(var f=
this.array,c=c.array;0<=--h;){var e=b*f[a++]+c[d]+g,g=Math.floor(e/67108864);c[d++]=e&67108863}return g};e.am2=function(a,b,c,d,g,h){for(var f=this.array,c=c.array,e=b&32767,b=b>>15;0<=--h;){var j=f[a]&32767,l=f[a++]>>15,k=b*j+l*e,j=e*j+((k&32767)<<15)+c[d]+(g&1073741823),g=(j>>>30)+(k>>>15)+b*l+(g>>>30);c[d++]=j&1073741823}return g};e.am3=function(a,b,c,d,g,h){for(var f=this.array,c=c.array,e=b&16383,b=b>>14;0<=--h;){var j=f[a]&16383,l=f[a++]>>14,k=b*j+l*e,j=e*j+((k&16383)<<14)+c[d]+g,g=(j>>28)+
(k>>14)+b*l;c[d++]=j&268435455}return g};e.am4=function(a,b,c,d,g,h){for(var f=this.array,c=c.array,e=b&8191,b=b>>13;0<=--h;){var j=f[a]&8191,l=f[a++]>>13,k=b*j+l*e,j=e*j+((k&8191)<<13)+c[d]+g,g=(j>>26)+(k>>13)+b*l;c[d++]=j&67108863}return g};e.setupEngine=function(a,b){e.prototype.am=a;l=I=b;s=(1<<I)-1;t=1<<I;X=Math.pow(2,52);Q=52-I;R=2*I-52};var J=[],A,w;A=48;for(w=0;9>=w;++w) {J[A++]=w;}A=97;for(w=10;36>w;++w) {J[A++]=w;}A=65;for(w=10;36>w;++w) {J[A++]=w;}D.prototype.convert=function(a){return 0>a.s||0<=
a.compareTo(this.m)?a.mod(this.m):a};D.prototype.revert=function(a){return a};D.prototype.reduce=function(a){a.divRemTo(this.m,null,a)};D.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};D.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};E.prototype.convert=function(a){var b=k();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);0>a.s&&0<b.compareTo(e.ZERO)&&this.m.subTo(b,b);return b};E.prototype.revert=function(a){var b=k();a.copyTo(b);this.reduce(b);return b};E.prototype.reduce=
function(a){for(var b=a.array;a.t<=this.mt2;) {b[a.t++]=0;}for(var c=0;c<this.m.t;++c){var d=b[c]&32767,g=d*this.mpl+((d*this.mph+(b[c]>>15)*this.mpl&this.um)<<15)&s,d=c+this.m.t;for(b[d]+=this.m.am(0,g,a,c,0,this.m.t);b[d]>=t;) {b[d]-=t,b[++d]++}}a.clamp();a.drShiftTo(this.m.t,a);0<=a.compareTo(this.m)&&a.subTo(this.m,a)};E.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};E.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};e.prototype.copyTo=function(a){for(var b=this.array,
c=a.array,d=this.t-1;0<=d;--d) {c[d]=b[d];}a.t=this.t;a.s=this.s};e.prototype.fromInt=function(a){var b=this.array;this.t=1;this.s=0>a?-1:0;0<a?b[0]=a:-1>a?b[0]=a+DV:this.t=0};e.prototype.fromString=function(a,b){var c=this.array,d;if(16==b){d=4;}else if(8==b){d=3;}else if(256==b){d=8;}else if(2==b){d=1;}else if(32==b){d=5;}else if(4==b){d=2;}else{this.fromRadix(a,b);return}this.s=this.t=0;for(var g=a.length,h=!1,f=0;0<=--g;){var i=8==d?a[g]&255:S(a,g);0>i?"-"==a.charAt(g)&&(h=!0):(h=!1,0==f?c[this.t++]=i:f+d>l?
(c[this.t-1]|=(i&(1<<l-f)-1)<<f,c[this.t++]=i>>l-f):c[this.t-1]|=i<<f,f+=d,f>=l&&(f-=l))}if(8==d&&0!=(a[0]&128)){this.s=-1,0<f&&(c[this.t-1]|=(1<<l-f)-1<<f);}this.clamp();h&&e.ZERO.subTo(this,this)};e.prototype.clamp=function(){for(var a=this.array,b=this.s&s;0<this.t&&a[this.t-1]==b;) {--this.t}};e.prototype.dlShiftTo=function(a,b){var c=this.array,d=b.array,g;for(g=this.t-1;0<=g;--g) {d[g+a]=c[g];}for(g=a-1;0<=g;--g) {d[g]=0;}b.t=this.t+a;b.s=this.s};e.prototype.drShiftTo=function(a,b){for(var c=this.array,
d=b.array,g=a;g<this.t;++g) {d[g-a]=c[g];}b.t=Math.max(this.t-a,0);b.s=this.s};e.prototype.lShiftTo=function(a,b){var c=this.array,d=b.array,g=a%l,h=l-g,f=(1<<h)-1,e=Math.floor(a/l),j=this.s<<g&s,k;for(k=this.t-1;0<=k;--k) {d[k+e+1]=c[k]>>h|j,j=(c[k]&f)<<g;}for(k=e-1;0<=k;--k) {d[k]=0;}d[e]=j;b.t=this.t+e+1;b.s=this.s;b.clamp()};e.prototype.rShiftTo=function(a,b){var c=this.array,d=b.array;b.s=this.s;var g=Math.floor(a/l);if(g>=this.t){b.t=0;}else{var h=a%l,f=l-h,e=(1<<h)-1;d[0]=c[g]>>h;for(var j=g+1;j<this.t;++j) {d[j-
g-1]|=(c[j]&e)<<f,d[j-g]=c[j]>>h;}0<h&&(d[this.t-g-1]|=(this.s&e)<<f);b.t=this.t-g;b.clamp()}};e.prototype.subTo=function(a,b){for(var c=this.array,d=b.array,g=a.array,h=0,f=0,e=Math.min(a.t,this.t);h<e;) {f+=c[h]-g[h],d[h++]=f&s,f>>=l;}if(a.t<this.t){for(f-=a.s;h<this.t;) {f+=c[h],d[h++]=f&s,f>>=l;}f+=this.s}else{for(f+=this.s;h<a.t;) {f-=g[h],d[h++]=f&s,f>>=l;}f-=a.s}b.s=0>f?-1:0;-1>f?d[h++]=t+f:0<f&&(d[h++]=f);b.t=h;b.clamp()};e.prototype.multiplyTo=function(a,b){var c=b.array,d=this.abs(),g=a.abs(),h=g.array,
f=d.t;for(b.t=f+g.t;0<=--f;) {c[f]=0;}for(f=0;f<g.t;++f) {c[f+d.t]=d.am(0,h[f],b,f,0,d.t);}b.s=0;b.clamp();this.s!=a.s&&e.ZERO.subTo(b,b)};e.prototype.squareTo=function(a){for(var b=this.abs(),c=b.array,d=a.array,g=a.t=2*b.t;0<=--g;) {d[g]=0;}for(g=0;g<b.t-1;++g){var h=b.am(g,c[g],a,2*g,0,1);if((d[g+b.t]+=b.am(g+1,2*c[g],a,2*g+1,h,b.t-g-1))>=t){d[g+b.t]-=t,d[g+b.t+1]=1}}0<a.t&&(d[a.t-1]+=b.am(g,c[g],a,2*g,0,1));a.s=0;a.clamp()};e.prototype.divRemTo=function(a,b,c){var d=a.abs();if(!(0>=d.t)){var g=this.abs();
if(g.t<d.t){null!=b&&b.fromInt(0),null!=c&&this.copyTo(c);}else{null==c&&(c=k());var h=k(),f=this.s,a=a.s,i=l-K(d.array[d.t-1]);0<i?(d.lShiftTo(i,h),g.lShiftTo(i,c)):(d.copyTo(h),g.copyTo(c));var d=h.t,j=h.array,g=j[d-1];if(0!=g){var m=g*(1<<Q)+(1<d?j[d-2]>>R:0),o=X/m,m=(1<<Q)/m,q=1<<R,F=c.t,n=F-d,r=null==b?k():b;h.dlShiftTo(n,r);var p=c.array;0<=c.compareTo(r)&&(p[c.t++]=1,c.subTo(r,c));e.ONE.dlShiftTo(d,r);for(r.subTo(h,h);h.t<d;) {j[h.t++]=0;}for(;0<=--n;) {
  if(j=p[--F]==g?s:Math.floor(p[F]*o+(p[F-1]+
  q)*m),(p[F]+=h.am(0,j,c,n,0,d))<j){h.dlShiftTo(n,r);for(c.subTo(r,c);p[F]<--j;) {c.subTo(r,c)}}
}null!=b&&(c.drShiftTo(d,b),f!=a&&e.ZERO.subTo(b,b));c.t=d;c.clamp();0<i&&c.rShiftTo(i,c);0>f&&e.ZERO.subTo(c,c)}}}};e.prototype.invDigit=function(){if(1>this.t) {
  return 0;
}var a=this.array[0];if(0==(a&1)) {
  return 0;
}var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%t)%t;return 0<b?t-b:-b};e.prototype.isEven=function(){var a=this.array;return 0==(0<this.t?a[0]&1:this.s)};
e.prototype.exp=function(a,b){if(4294967295<a||1>a) {
  return e.ONE;
}var c=k(),d=k(),g=b.convert(this),h=K(a)-1;for(g.copyTo(c);0<=--h;) {
  if(b.sqrTo(c,d),0<(a&1<<h)){b.mulTo(d,g,c);} else {
    var f=c,c=d,d=f;
  }
}return b.revert(c)};e.prototype.toString=function(a){var b=this.array;if(0>this.s) {
  return"-"+this.negate().toString(a);
}if(16==a){a=4;}else if(8==a){a=3;}else if(2==a){a=1;}else if(32==a){a=5;}else if(4==a){a=2;} else {
  return this.toRadix(a);
}var c=(1<<a)-1,d,g=!1,h="",f=this.t,e=l-f*l%a;if(0<f--){if(e<l&&0<(d=b[f]>>e)){g=
!0,h="0123456789abcdefghijklmnopqrstuvwxyz".charAt(d);}for(;0<=f;) {e<a?(d=(b[f]&(1<<e)-1)<<a-e,d|=b[--f]>>(e+=l-a)):(d=b[f]>>(e-=a)&c,0>=e&&(e+=l,--f)),0<d&&(g=!0),g&&(h+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(d))}}return g?h:"0"};e.prototype.negate=function(){var a=k();e.ZERO.subTo(this,a);return a};e.prototype.abs=function(){return 0>this.s?this.negate():this};e.prototype.compareTo=function(a){var b=this.array,c=a.array,d=this.s-a.s;if(0!=d) {
  return d;
}var g=this.t,d=g-a.t;if(0!=d) {
  return d;
}for(;0<=
--g;) {
  if(0!=(d=b[g]-c[g])) {
    return d;
  }
}return 0};e.prototype.bitLength=function(){var a=this.array;return 0>=this.t?0:l*(this.t-1)+K(a[this.t-1]^this.s&s)};e.prototype.mod=function(a){var b=k();this.abs().divRemTo(a,null,b);0>this.s&&0<b.compareTo(e.ZERO)&&a.subTo(b,b);return b};e.prototype.modPowInt=function(a,b){var c;c=256>a||b.isEven()?new D(b):new E(b);return this.exp(a,c)};e.ZERO=B(0);e.ONE=B(1);H.prototype.convert=V;H.prototype.revert=V;H.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c)};H.prototype.sqrTo=
function(a,b){a.squareTo(b)};G.prototype.convert=function(a){if(0>a.s||a.t>2*this.m.t) {
  return a.mod(this.m);
}if(0>a.compareTo(this.m)) {
  return a;
}var b=k();a.copyTo(b);this.reduce(b);return b};G.prototype.revert=function(a){return a};G.prototype.reduce=function(a){a.drShiftTo(this.m.t-1,this.r2);if(a.t>this.m.t+1){a.t=this.m.t+1,a.clamp();}this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);0>a.compareTo(this.r2);) {a.dAddOffset(1,this.m.t+1);}for(a.subTo(this.r2,
a);0<=a.compareTo(this.m);) {a.subTo(this.m,a)}};G.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};G.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};var u=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,
457,461,463,467,479,487,491,499,503,509],Z=67108864/u[u.length-1];e.prototype.chunkSize=function(a){return Math.floor(Math.LN2*l/Math.log(a))};e.prototype.toRadix=function(a){null==a&&(a=10);if(0==this.signum()||2>a||36<a) {
  return"0";
}var b=this.chunkSize(a),b=Math.pow(a,b),c=B(b),d=k(),g=k(),e="";for(this.divRemTo(c,d,g);0<d.signum();) {e=(b+g.intValue()).toString(a).substr(1)+e,d.divRemTo(c,d,g);}return g.intValue().toString(a)+e};e.prototype.fromRadix=function(a,b){this.fromInt(0);null==b&&(b=10);for(var c=
this.chunkSize(b),d=Math.pow(b,c),g=!1,h=0,f=0,i=0;i<a.length;++i){var j=S(a,i);0>j?"-"==a.charAt(i)&&0==this.signum()&&(g=!0):(f=b*f+j,++h>=c&&(this.dMultiply(d),this.dAddOffset(f,0),f=h=0))}0<h&&(this.dMultiply(Math.pow(b,h)),this.dAddOffset(f,0));g&&e.ZERO.subTo(this,this)};e.prototype.fromNumber=function(a,b,c){if("number"==typeof b) {
  if(2>a){this.fromInt(1);}else{this.fromNumber(a,c);this.testBit(a-1)||this.bitwiseTo(e.ONE.shiftLeft(a-1),M,this);for(this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);) {this.dAddOffset(2,
  0),this.bitLength()>a&&this.subTo(e.ONE.shiftLeft(a-1),this)}}
} else{var c=[],d=a&7;c.length=(a>>3)+1;b.nextBytes(c);c[0]=0<d?c[0]&(1<<d)-1:0;this.fromString(c,256)}};e.prototype.bitwiseTo=function(a,b,c){var d=this.array,g=a.array,e=c.array,f,i,j=Math.min(a.t,this.t);for(f=0;f<j;++f) {e[f]=b(d[f],g[f]);}if(a.t<this.t){i=a.s&s;for(f=j;f<this.t;++f) {e[f]=b(d[f],i);}c.t=this.t}else{i=this.s&s;for(f=j;f<a.t;++f) {e[f]=b(i,g[f]);}c.t=a.t}c.s=b(this.s,a.s);c.clamp()};e.prototype.changeBit=function(a,b){var c=e.ONE.shiftLeft(a);
this.bitwiseTo(c,b,c);return c};e.prototype.addTo=function(a,b){for(var c=this.array,d=a.array,g=b.array,e=0,f=0,i=Math.min(a.t,this.t);e<i;) {f+=c[e]+d[e],g[e++]=f&s,f>>=l;}if(a.t<this.t){for(f+=a.s;e<this.t;) {f+=c[e],g[e++]=f&s,f>>=l;}f+=this.s}else{for(f+=this.s;e<a.t;) {f+=d[e],g[e++]=f&s,f>>=l;}f+=a.s}b.s=0>f?-1:0;0<f?g[e++]=f:-1>f&&(g[e++]=t+f);b.t=e;b.clamp()};e.prototype.dMultiply=function(a){this.array[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()};e.prototype.dAddOffset=function(a,
b){for(var c=this.array;this.t<=b;) {c[this.t++]=0;}for(c[b]+=a;c[b]>=t;) {c[b]-=t,++b>=this.t&&(c[this.t++]=0),++c[b]}};e.prototype.multiplyLowerTo=function(a,b,c){var d=c.array,g=a.array,e=Math.min(this.t+a.t,b);c.s=0;for(c.t=e;0<e;) {d[--e]=0;}var f;for(f=c.t-this.t;e<f;++e) {d[e+this.t]=this.am(0,g[e],c,e,0,this.t);}for(f=Math.min(a.t,b);e<f;++e) {this.am(0,g[e],c,e,0,b-e);}c.clamp()};e.prototype.multiplyUpperTo=function(a,b,c){var d=c.array,g=a.array;--b;var e=c.t=this.t+a.t-b;for(c.s=0;0<=--e;) {d[e]=0;}for(e=
Math.max(b-this.t,0);e<a.t;++e) {d[this.t+e-b]=this.am(b-e,g[e],c,0,0,this.t+e-b);}c.clamp();c.drShiftTo(1,c)};e.prototype.modInt=function(a){var b=this.array;if(0>=a) {
  return 0;
}var c=t%a,d=0>this.s?a-1:0;if(0<this.t) {
  if(0==c){d=b[0]%a;} else {
    for(var e=this.t-1;0<=e;--e) {d=(c*d+b[e])%a;}
  }
}return d};e.prototype.millerRabin=function(a){var b=this.subtract(e.ONE),c=b.getLowestSetBit();if(0>=c) {
  return!1;
}var d=b.shiftRight(c),a=a+1>>1;if(a>u.length){a=u.length;}for(var g=k(),h=0;h<a;++h){g.fromInt(u[h]);var f=g.modPow(d,
this);if(0!=f.compareTo(e.ONE)&&0!=f.compareTo(b)){for(var i=1;i++<c&&0!=f.compareTo(b);) {
  if(f=f.modPowInt(2,this),0==f.compareTo(e.ONE)) {
    return!1;
  }
}if(0!=f.compareTo(b)) {
  return!1}
}}return!0};e.prototype.clone=function(){var a=k();this.copyTo(a);return a};e.prototype.intValue=function(){var a=this.array;if(0>this.s){if(1==this.t) {
  return a[0]-t;
}if(0==this.t) {
  return-1}
}else{if(1==this.t) {
  return a[0];
}if(0==this.t) {
  return 0}
}return(a[1]&(1<<32-l)-1)<<l|a[0]};e.prototype.byteValue=function(){var a=this.array;return 0==
this.t?this.s:a[0]<<24>>24};e.prototype.shortValue=function(){var a=this.array;return 0==this.t?this.s:a[0]<<16>>16};e.prototype.signum=function(){var a=this.array;return 0>this.s?-1:0>=this.t||1==this.t&&0>=a[0]?0:1};e.prototype.toByteArray=function(){var a=this.array,b=this.t,c=[];c[0]=this.s;var d=l-b*l%8,e,h=0;if(0<b--){if(d<l&&(e=a[b]>>d)!=(this.s&s)>>d){c[h++]=e|this.s<<l-d;}for(;0<=b;) {
  if(8>d?(e=(a[b]&(1<<d)-1)<<8-d,e|=a[--b]>>(d+=l-8)):(e=a[b]>>(d-=8)&255,0>=d&&(d+=l,--b)),0!=(e&128)&&(e|=-256),
  0==h&&(this.s&128)!=(e&128)&&++h,0<h||e!=this.s){c[h++]=e}}
}return c};e.prototype.equals=function(a){return 0==this.compareTo(a)};e.prototype.min=function(a){return 0>this.compareTo(a)?this:a};e.prototype.max=function(a){return 0<this.compareTo(a)?this:a};e.prototype.and=function(a){var b=k();this.bitwiseTo(a,Y,b);return b};e.prototype.or=function(a){var b=k();this.bitwiseTo(a,M,b);return b};e.prototype.xor=function(a){var b=k();this.bitwiseTo(a,T,b);return b};e.prototype.andNot=function(a){var b=k();
this.bitwiseTo(a,U,b);return b};e.prototype.not=function(){for(var a=this.array,b=k(),c=b.array,d=0;d<this.t;++d) {c[d]=s&~a[d];}b.t=this.t;b.s=~this.s;return b};e.prototype.shiftLeft=function(a){var b=k();0>a?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b};e.prototype.shiftRight=function(a){var b=k();0>a?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b};e.prototype.getLowestSetBit=function(){for(var a=this.array,b=0;b<this.t;++b) {
  if(0!=a[b]){var c=b*l;a=a[b];0==a?a=-1:(b=0,0==(a&65535)&&(a>>=16,b+=16),
  0==(a&255)&&(a>>=8,b+=8),0==(a&15)&&(a>>=4,b+=4),0==(a&3)&&(a>>=2,b+=2),0==(a&1)&&++b,a=b);return c+a}
}return 0>this.s?this.t*l:-1};e.prototype.bitCount=function(){for(var a=0,b=this.s&s,c=0;c<this.t;++c){for(var d=this_array[c]^b,e=0;0!=d;) {d&=d-1,++e;}a+=e}return a};e.prototype.testBit=function(a){var b=this.array,c=Math.floor(a/l);return c>=this.t?0!=this.s:0!=(b[c]&1<<a%l)};e.prototype.setBit=function(a){return this.changeBit(a,M)};e.prototype.clearBit=function(a){return this.changeBit(a,U)};e.prototype.flipBit=
function(a){return this.changeBit(a,T)};e.prototype.add=function(a){var b=k();this.addTo(a,b);return b};e.prototype.subtract=function(a){var b=k();this.subTo(a,b);return b};e.prototype.multiply=function(a){var b=k();this.multiplyTo(a,b);return b};e.prototype.divide=function(a){var b=k();this.divRemTo(a,b,null);return b};e.prototype.remainder=function(a){var b=k();this.divRemTo(a,null,b);return b};e.prototype.divideAndRemainder=function(a){var b=k(),c=k();this.divRemTo(a,b,c);return[b,c]};e.prototype.modPow=
function(a,b){var c=a.array,d=a.bitLength(),e,h=B(1),f;if(0>=d) {
  return h;
}e=18>d?1:48>d?3:144>d?4:768>d?5:6;f=8>d?new D(b):b.isEven()?new G(b):new E(b);var i=[],j=3,m=e-1,p=(1<<e)-1;i[1]=f.convert(this);if(1<e){d=k();for(f.sqrTo(i[1],d);j<=p;) {i[j]=k(),f.mulTo(d,i[j-2],i[j]),j+=2}}for(var n=a.t-1,o,q=!0,r=k(),d=K(c[n])-1;0<=n;){d>=m?o=c[n]>>d-m&p:(o=(c[n]&(1<<d+1)-1)<<m-d,0<n&&(o|=c[n-1]>>l+d-m));for(j=e;0==(o&1);) {o>>=1,--j;}if(0>(d-=j)){d+=l,--n;}if(q){i[o].copyTo(h),q=!1;}else{for(;1<j;) {f.sqrTo(h,r),f.sqrTo(r,
h),j-=2;}0<j?f.sqrTo(h,r):(j=h,h=r,r=j);f.mulTo(r,i[o],h)}for(;0<=n&&0==(c[n]&1<<d);) {f.sqrTo(h,r),j=h,h=r,r=j,0>--d&&(d=l-1,--n)}}return f.revert(h)};e.prototype.modInverse=function(a){var b=a.isEven();if(this.isEven()&&b||0==a.signum()) {
  return e.ZERO;
}for(var c=a.clone(),d=this.clone(),g=B(1),h=B(0),f=B(0),i=B(1);0!=c.signum();){for(;c.isEven();){c.rShiftTo(1,c);if(b){if(!g.isEven()||!h.isEven()){g.addTo(this,g),h.subTo(a,h);}g.rShiftTo(1,g)} else {h.isEven()||h.subTo(a,h);}h.rShiftTo(1,h)}for(;d.isEven();){d.rShiftTo(1,
d);if(b){if(!f.isEven()||!i.isEven()){f.addTo(this,f),i.subTo(a,i);}f.rShiftTo(1,f)} else {i.isEven()||i.subTo(a,i);}i.rShiftTo(1,i)}0<=c.compareTo(d)?(c.subTo(d,c),b&&g.subTo(f,g),h.subTo(i,h)):(d.subTo(c,d),b&&f.subTo(g,f),i.subTo(h,i))}if(0!=d.compareTo(e.ONE)) {
  return e.ZERO;
}if(0<=i.compareTo(a)) {
  return i.subtract(a);
}if(0>i.signum()){i.addTo(a,i);} else {
  return i;
}return 0>i.signum()?i.add(a):i};e.prototype.pow=function(a){return this.exp(a,new H)};e.prototype.gcd=function(a){var b=0>this.s?this.negate():
this.clone(),a=0>a.s?a.negate():a.clone();if(0>b.compareTo(a)) {
  var c=b,b=a,a=c;
}var c=b.getLowestSetBit(),d=a.getLowestSetBit();if(0>d) {
  return b;
}c<d&&(d=c);0<d&&(b.rShiftTo(d,b),a.rShiftTo(d,a));for(;0<b.signum();) {0<(c=b.getLowestSetBit())&&b.rShiftTo(c,b),0<(c=a.getLowestSetBit())&&a.rShiftTo(c,a),0<=b.compareTo(a)?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));}0<d&&a.lShiftTo(d,a);return a};e.prototype.isProbablePrime=function(a){var b,c=this.abs(),d=c.array;if(1==c.t&&d[0]<=u[u.length-
1]){for(b=0;b<u.length;++b) {
  if(d[0]==u[b]) {
    return!0;
  }
}return!1}if(c.isEven()) {
  return!1;
}for(b=1;b<u.length;){for(var d=u[b],e=b+1;e<u.length&&d<Z;) {d*=u[e++];}for(d=c.modInt(d);b<e;) {
  if(0==d%u[b++]) {
    return!1}
  }
}return c.millerRabin(a)};N.prototype.init=function(a){var b,c,d;for(b=0;256>b;++b) {this.S[b]=b;}for(b=c=0;256>b;++b) {c=c+this.S[b]+a[b%a.length]&255,d=this.S[b],this.S[b]=this.S[c],this.S[c]=d;}this.j=this.i=0};N.prototype.next=function(){var a;this.i=this.i+1&255;this.j=this.j+this.S[this.i]&255;a=this.S[this.i];
this.S[this.i]=this.S[this.j];this.S[this.j]=a;return this.S[a+this.S[this.i]&255]};var O=256,L,x,o;if(null==x){x=[];for(o=0;o<O;) {A=Math.floor(65536*Math.random()),x[o++]=A>>>8,x[o++]=A&255;}o=0;W(1122926989487)}P.prototype.nextBytes=function(a){var b;for(b=0;b<a.length;++b){var c=a,d=b,e;if(null==L){W(1122926989487);L=new N;L.init(x);for(o=0;o<x.length;++o) {x[o]=0;}o=0}e=L.next();c[d]=e}};z.prototype.doPublic=function(a){return a.modPowInt(this.e,this.n)};z.prototype.setPublic=function(a,b){null!=a&&
null!=b&&0<a.length&&0<b.length?(this.n=y(a,16),this.e=parseInt(b,16)):alert("Invalid RSA public key")};z.prototype.encrypt=function(a){var b;b=this.n.bitLength()+7>>3;if(b<a.length+11){alert("Message too long for RSA"),b=null;}else{for(var c=[],d=a.length-1;0<=d&&0<b;) {c[--b]=a.charCodeAt(d--);}c[--b]=0;a=new P;for(d=[];2<b;){for(d[0]=0;0==d[0];) {a.nextBytes(d);}c[--b]=d[0]}c[--b]=2;c[--b]=0;b=new e(c)}if(null==b) {
  return null;
}b=this.doPublic(b);if(null==b) {
  return null;
}b=b.toString(16);return 0==(b.length&
1)?b:"0"+b};z.prototype.doPrivate=function(a){if(null==this.p||null==this.q) {
  return a.modPow(this.d,this.n);
}for(var b=a.mod(this.p).modPow(this.dmp1,this.p),a=a.mod(this.q).modPow(this.dmq1,this.q);0>b.compareTo(a);) {b=b.add(this.p);}return b.subtract(a).multiply(this.coeff).mod(this.p).multiply(this.q).add(a)};z.prototype.setPrivate=function(a,b,c){null!=a&&null!=b&&0<a.length&&0<b.length?(this.n=y(a,16),this.e=parseInt(b,16),this.d=y(c,16)):alert("Invalid RSA private key")};z.prototype.setPrivateEx=
function(a,b,c,d,e,h,f,i){null!=a&&null!=b&&0<a.length&&0<b.length?(this.n=y(a,16),this.e=parseInt(b,16),this.d=y(c,16),this.p=y(d,16),this.q=y(e,16),this.dmp1=y(h,16),this.dmq1=y(f,16),this.coeff=y(i,16)):alert("Invalid RSA private key")};z.prototype.generate=function(a,b){var c=new P,d=a>>1;this.e=parseInt(b,16);for(var g=new e(b,16);;){for(;!(this.p=new e(a-d,1,c),0==this.p.subtract(e.ONE).gcd(g).compareTo(e.ONE)&&this.p.isProbablePrime(10));) {
  ;
}for(;!(this.q=new e(d,1,c),0==this.q.subtract(e.ONE).gcd(g).compareTo(e.ONE)&&
this.q.isProbablePrime(10));) {
  ;
}if(0>=this.p.compareTo(this.q)){var h=this.p;this.p=this.q;this.q=h}var h=this.p.subtract(e.ONE),f=this.q.subtract(e.ONE),i=h.multiply(f);if(0==i.gcd(g).compareTo(e.ONE)){this.n=this.p.multiply(this.q);this.d=g.modInverse(i);this.dmp1=this.d.mod(h);this.dmq1=this.d.mod(f);this.coeff=this.q.modInverse(this.p);break}}};z.prototype.decrypt=function(a){var b=this.doPrivate(y(a,16));if(null==b){a=null;} else {
  a:{for(var a=this.n.bitLength()+7>>3,b=b.toByteArray(),c=0;c<b.length&&
  0==b[c];) {++c;}if(b.length-c!=a-1||2!=b[c]){a=null;}else{for(++c;0!=b[c];) {
    if(++c>=b.length){a=null;break a}
  }for(a="";++c<b.length;) {a+=String.fromCharCode(b[c])}}}
}return a};q.prototype.equals=function(a){return a==this?!0:this.q.equals(a.q)&&this.x.equals(a.x)};q.prototype.toBigInteger=function(){return this.x};q.prototype.negate=function(){return new q(this.q,this.x.negate().mod(this.q))};q.prototype.add=function(a){return new q(this.q,this.x.add(a.toBigInteger()).mod(this.q))};q.prototype.subtract=function(a){return new q(this.q,
this.x.subtract(a.toBigInteger()).mod(this.q))};q.prototype.multiply=function(a){return new q(this.q,this.x.multiply(a.toBigInteger()).mod(this.q))};q.prototype.square=function(){return new q(this.q,this.x.square().mod(this.q))};q.prototype.divide=function(a){return new q(this.q,this.x.multiply(a.toBigInteger().modInverse(this.q)).mod(this.q))};n.prototype.getX=function(){if(null==this.zinv){this.zinv=this.z.modInverse(this.curve.q);}return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))};
n.prototype.getY=function(){if(null==this.zinv){this.zinv=this.z.modInverse(this.curve.q);}return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))};n.prototype.equals=function(a){return a==this?!0:this.isInfinity()?a.isInfinity():a.isInfinity()?this.isInfinity():!a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q).equals(e.ZERO)?!1:a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q).equals(e.ZERO)};
n.prototype.isInfinity=function(){return null==this.x&&null==this.y?!0:this.z.equals(e.ZERO)&&!this.y.toBigInteger().equals(e.ZERO)};n.prototype.negate=function(){return new n(this.curve,this.x,this.y.negate(),this.z)};n.prototype.add=function(a){if(this.isInfinity()) {
  return a;
}if(a.isInfinity()) {
  return this;
}var b=a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q),c=a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q);
if(e.ZERO.equals(c)) {
  return e.ZERO.equals(b)?this.twice():this.curve.getInfinity();
}var d=new e("3"),g=this.x.toBigInteger(),h=this.y.toBigInteger();a.x.toBigInteger();a.y.toBigInteger();var f=c.square(),i=f.multiply(c),g=g.multiply(f),f=b.square().multiply(this.z),c=f.subtract(g.shiftLeft(1)).multiply(a.z).subtract(i).multiply(c).mod(this.curve.q),b=g.multiply(d).multiply(b).subtract(h.multiply(i)).subtract(f.multiply(b)).multiply(a.z).add(b.multiply(i)).mod(this.curve.q),a=i.multiply(this.z).multiply(a.z).mod(this.curve.q);
return new n(this.curve,this.curve.fromBigInteger(c),this.curve.fromBigInteger(b),a)};n.prototype.twice=function(){if(this.isInfinity()) {
  return this;
}if(0==this.y.toBigInteger().signum()) {
  return this.curve.getInfinity();
}var a=new e("3"),b=this.x.toBigInteger(),c=this.y.toBigInteger(),d=c.multiply(this.z),g=d.multiply(c).mod(this.curve.q),c=this.curve.a.toBigInteger(),h=b.square().multiply(a);e.ZERO.equals(c)||(h=h.add(this.z.square().multiply(c)));h=h.mod(this.curve.q);c=h.square().subtract(b.shiftLeft(3).multiply(g)).shiftLeft(1).multiply(d).mod(this.curve.q);
a=h.multiply(a).multiply(b).subtract(g.shiftLeft(1)).shiftLeft(2).multiply(g).subtract(h.square().multiply(h)).mod(this.curve.q);d=d.square().multiply(d).shiftLeft(3).mod(this.curve.q);return new n(this.curve,this.curve.fromBigInteger(c),this.curve.fromBigInteger(a),d)};n.prototype.multiply=function(a){if(this.isInfinity()) {
  return this;
}if(0==a.signum()) {
  return this.curve.getInfinity();
}var b=a.multiply(new e("3")),c=this.negate(),d=this,g;for(g=b.bitLength()-2;0<g;--g){var d=d.twice(),h=b.testBit(g),
f=a.testBit(g);h!=f&&(d=d.add(h?this:c))}return d};n.prototype.multiplyTwo=function(a,b,c){var d;d=a.bitLength()>c.bitLength()?a.bitLength()-1:c.bitLength()-1;for(var e=this.curve.getInfinity(),h=this.add(b);0<=d;) {e=e.twice(),a.testBit(d)?e=c.testBit(d)?e.add(h):e.add(this):c.testBit(d)&&(e=e.add(b)),--d;}return e};p.prototype.getQ=function(){return this.q};p.prototype.getA=function(){return this.a};p.prototype.getB=function(){return this.b};p.prototype.equals=function(a){return a==this?!0:this.q.equals(a.q)&&
this.a.equals(a.a)&&this.b.equals(a.b)};p.prototype.getInfinity=function(){return this.infinity};p.prototype.fromBigInteger=function(a){return new q(this.q,a)};p.prototype.decodePointHex=function(a){switch(parseInt(a.substr(0,2),16)){case 0:return this.infinity;case 2:case 3:return null;case 4:case 6:case 7:var b=(a.length-2)/2,c=a.substr(2,b),a=a.substr(b+2,b);return new n(this,this.fromBigInteger(new e(c,16)),this.fromBigInteger(new e(a,16)));default:return null}};v.prototype.getCurve=function(){return this.curve};
v.prototype.getG=function(){return this.g};v.prototype.getN=function(){return this.n};v.prototype.getH=function(){return this.h};C.BigInteger=e;C.RSAKey=z;C.ECFieldElementFp=q;C.ECPointFp=n;C.ECCurveFp=p;C.X9ECParameters=v;C.getSECCurveByName=function(a){if("secp128r1"==a){var b=m("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF"),c=m("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC"),d=m("E87579C11079F43DD824993C2CEE5ED3"),a=m("FFFFFFFE0000000075A30D1B9038A115"),g=e.ONE,b=new p(b,c,d),c=b.decodePointHex("04161FF7528B899B2D0C28607CA52C5B86CF5AC8395BAFEB13C02DA292DDED7A83");
return new v(b,c,a,g)}if("secp160k1"==a) {
  return b=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73"),c=e.ZERO,d=m("7"),a=m("0100000000000000000001B8FA16DFAB9ACA16B6B3"),g=e.ONE,b=new p(b,c,d),c=b.decodePointHex("043B4C382CE37AA192A4019E763036F4F5DD4D7EBB938CF935318FDCED6BC28286531733C3F03C4FEE"),new v(b,c,a,g);
}if("secp160r1"==a) {
  return b=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF"),c=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC"),d=m("1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45"),a=m("0100000000000000000001F4C8F927AED3CA752257"),
  g=e.ONE,b=new p(b,c,d),c=b.decodePointHex("044A96B5688EF573284664698968C38BB913CBFC8223A628553168947D59DCC912042351377AC5FB32"),new v(b,c,a,g);
}if("secp192k1"==a) {
  return b=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37"),c=e.ZERO,d=m("3"),a=m("FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D"),g=e.ONE,b=new p(b,c,d),c=b.decodePointHex("04DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D"),new v(b,c,a,g);
}if("secp192r1"==a) {
  return b=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF"),
  c=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC"),d=m("64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1"),a=m("FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831"),g=e.ONE,b=new p(b,c,d),c=b.decodePointHex("04188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF101207192B95FFC8DA78631011ED6B24CDD573F977A11E794811"),new v(b,c,a,g);
}if("secp224r1"==a) {
  return b=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001"),c=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE"),d=m("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4"),
  a=m("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D"),g=e.ONE,b=new p(b,c,d),c=b.decodePointHex("04B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34"),new v(b,c,a,g);
}"secp256r1"==a?(b=m("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF"),c=m("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC"),d=m("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B"),a=m("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551"),
g=e.ONE,b=new p(b,c,d),c=b.decodePointHex("046B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C2964FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5"),a=new v(b,c,a,g)):a=null;return a}})(this);
