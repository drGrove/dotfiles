//Javascript Punycode converter derived from example in RFC3492.
//This implementation is created by some@domain.name and released into public domain
var punycode = new function Punycode() {
    // This object converts to and from puny-code used in IDN
    //
    // punycode.ToASCII ( domain )
    // 
    // Returns a puny coded representation of "domain".
    // It only converts the part of the domain name that
    // has non ASCII characters. I.e. it dosent matter if
    // you call it with a domain that already is in ASCII.
    //
    // punycode.ToUnicode (domain)
    //
    // Converts a puny-coded domain name to unicode.
    // It only converts the puny-coded parts of the domain name.
    // I.e. it dosent matter if you call it on a string
    // that already has been converted to unicode.
    //
    //
    this.utf16 = {
        // The utf16-class is necessary to convert from javascripts internal character representation to unicode and back.
        decode:function(input){
            var output = [], i=0, len=input.length,value,extra;
            while (i < len) {
                value = input.charCodeAt(i++);
                if ((value & 0xF800) === 0xD800) {
                    extra = input.charCodeAt(i++);
                    if ( ((value & 0xFC00) !== 0xD800) || ((extra & 0xFC00) !== 0xDC00) ) {
                        throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
                    }
                    value = ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
                }
                output.push(value);
            }
            return output;
        },
        encode:function(input){
            var output = [], i=0, len=input.length,value;
            while (i < len) {
                value = input[i++];
                if ( (value & 0xF800) === 0xD800 ) {
                    throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
                }
                if (value > 0xFFFF) {
                    value -= 0x10000;
                    output.push(String.fromCharCode(((value >>>10) & 0x3FF) | 0xD800));
                    value = 0xDC00 | (value & 0x3FF);
                }
                output.push(String.fromCharCode(value));
            }
            return output.join("");
        }
    }

    //Default parameters
    var initial_n = 0x80;
    var initial_bias = 72;
    var delimiter = "\x2D";
    var base = 36;
    var damp = 700;
    var tmin=1;
    var tmax=26;
    var skew=38;
    var maxint = 0x7FFFFFFF;

    // decode_digit(cp) returns the numeric value of a basic code 
    // point (for use in representing integers) in the range 0 to
    // base-1, or base if cp is does not represent a value.

    function decode_digit(cp) {
        return cp - 48 < 10 ? cp - 22 : cp - 65 < 26 ? cp - 65 : cp - 97 < 26 ? cp - 97 : base;
    }

    // encode_digit(d,flag) returns the basic code point whose value
    // (when used for representing integers) is d, which needs to be in
    // the range 0 to base-1. The lowercase form is used unless flag is
    // nonzero, in which case the uppercase form is used. The behavior
    // is undefined if flag is nonzero and digit d has no uppercase form. 

    function encode_digit(d, flag) {
        return d + 22 + 75 * (d < 26) - ((flag != 0) << 5);
        //  0..25 map to ASCII a..z or A..Z 
        // 26..35 map to ASCII 0..9
    }
    //** Bias adaptation function **
    function adapt(delta, numpoints, firsttime ) {
        var k;
        delta = firsttime ? Math.floor(delta / damp) : (delta >> 1);
        delta += Math.floor(delta / numpoints);

        for (k = 0; delta > (((base - tmin) * tmax) >> 1); k += base) {
                delta = Math.floor(delta / ( base - tmin ));
        }
        return Math.floor(k + (base - tmin + 1) * delta / (delta + skew));
    }

    // encode_basic(bcp,flag) forces a basic code point to lowercase if flag is zero,
    // uppercase if flag is nonzero, and returns the resulting code point.
    // The code point is unchanged if it is caseless.
    // The behavior is undefined if bcp is not a basic code point.

    function encode_basic(bcp, flag) {
        bcp -= (bcp - 97 < 26) << 5;
        return bcp + ((!flag && (bcp - 65 < 26)) << 5);
    }

    // Main decode
    this.decode=function(input,preserveCase) {
        // Dont use utf16
        var output=[];
        var case_flags=[];
        var input_length = input.length;

        var n, out, i, bias, basic, j, ic, oldi, w, k, digit, t, len;

        // Initialize the state: 

        n = initial_n;
        i = 0;
        bias = initial_bias;

        // Handle the basic code points: Let basic be the number of input code 
        // points before the last delimiter, or 0 if there is none, then
        // copy the first basic code points to the output.

        basic = input.lastIndexOf(delimiter);
        if (basic < 0) basic = 0;

        for (j = 0; j < basic; ++j) {
            if(preserveCase) case_flags[output.length] = ( input.charCodeAt(j) -65 < 26);
            if ( input.charCodeAt(j) >= 0x80) {
                throw new RangeError("Illegal input >= 0x80");
            }
            output.push( input.charCodeAt(j) );
        }

        // Main decoding loop: Start just after the last delimiter if any
        // basic code points were copied; start at the beginning otherwise. 

        for (ic = basic > 0 ? basic + 1 : 0; ic < input_length; ) {

            // ic is the index of the next character to be consumed,

            // Decode a generalized variable-length integer into delta,
            // which gets added to i. The overflow checking is easier
            // if we increase i as we go, then subtract off its starting 
            // value at the end to obtain delta.
            for (oldi = i, w = 1, k = base; ; k += base) {
                    if (ic >= input_length) {
                        throw RangeError ("punycode_bad_input(1)");
                    }
                    digit = decode_digit(input.charCodeAt(ic++));

                    if (digit >= base) {
                        throw RangeError("punycode_bad_input(2)");
                    }
                    if (digit > Math.floor((maxint - i) / w)) {
                        throw RangeError ("punycode_overflow(1)");
                    }
                    i += digit * w;
                    t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                    if (digit < t) { break; }
                    if (w > Math.floor(maxint / (base - t))) {
                        throw RangeError("punycode_overflow(2)");
                    }
                    w *= (base - t);
            }

            out = output.length + 1;
            bias = adapt(i - oldi, out, oldi === 0);

            // i was supposed to wrap around from out to 0,
            // incrementing n each time, so we'll fix that now: 
            if ( Math.floor(i / out) > maxint - n) {
                throw RangeError("punycode_overflow(3)");
            }
            n += Math.floor( i / out ) ;
            i %= out;

            // Insert n at position i of the output: 
            // Case of last character determines uppercase flag: 
            if (preserveCase) { case_flags.splice(i, 0, input.charCodeAt(ic -1) -65 < 26);}

            output.splice(i, 0, n);
            i++;
        }
        if (preserveCase) {
            for (i = 0, len = output.length; i < len; i++) {
                if (case_flags[i]) {
                    output[i] = (String.fromCharCode(output[i]).toUpperCase()).charCodeAt(0);
                }
            }
        }
        return this.utf16.encode(output);
    };

    //** Main encode function **

    this.encode = function (input,preserveCase) {
        //** Bias adaptation function **

        var n, delta, h, b, bias, j, m, q, k, t, ijv, case_flags;

        if (preserveCase) {
            // Preserve case, step1 of 2: Get a list of the unaltered string
            case_flags = this.utf16.decode(input);
        }
        // Converts the input in UTF-16 to Unicode
        input = this.utf16.decode(input.toLowerCase());

        var input_length = input.length; // Cache the length

        if (preserveCase) {
            // Preserve case, step2 of 2: Modify the list to true/false
            for (j=0; j < input_length; j++) {
                case_flags[j] = input[j] != case_flags[j];
            }
        }

        var output=[];


        // Initialize the state: 
        n = initial_n;
        delta = 0;
        bias = initial_bias;

        // Handle the basic code points: 
        for (j = 0; j < input_length; ++j) {
            if ( input[j] < 0x80) {
                output.push(
                    String.fromCharCode(
                        case_flags ? encode_basic(input[j], case_flags[j]) : input[j]
                    )
                );
            }
        }

        h = b = output.length;

        // h is the number of code points that have been handled, b is the
        // number of basic code points 

        if (b > 0) output.push(delimiter);

        // Main encoding loop: 
        //
        while (h < input_length) {
            // All non-basic code points < n have been
            // handled already. Find the next larger one: 

            for (m = maxint, j = 0; j < input_length; ++j) {
                ijv = input[j];
                if (ijv >= n && ijv < m) m = ijv;
            }

            // Increase delta enough to advance the decoder's
            // <n,i> state to <m,0>, but guard against overflow: 

            if (m - n > Math.floor((maxint - delta) / (h + 1))) {
                throw RangeError("punycode_overflow (1)");
            }
            delta += (m - n) * (h + 1);
            n = m;

            for (j = 0; j < input_length; ++j) {
                ijv = input[j];

                if (ijv < n ) {
                    if (++delta > maxint) return Error("punycode_overflow(2)");
                }

                if (ijv == n) {
                    // Represent delta as a generalized variable-length integer: 
                    for (q = delta, k = base; ; k += base) {
                        t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                        if (q < t) break;
                        output.push( String.fromCharCode(encode_digit(t + (q - t) % (base - t), 0)) );
                        q = Math.floor( (q - t) / (base - t) );
                    }
                    output.push( String.fromCharCode(encode_digit(q, preserveCase && case_flags[j] ? 1:0 )));
                    bias = adapt(delta, h + 1, h == b);
                    delta = 0;
                    ++h;
                }
            }

            ++delta, ++n;
        }
        return output.join("");
    }

    this.get_host = function(url)
    {
      var host = url;
      var idx = host.indexOf('://');
      if (idx != -1) {
        host = host.substring(idx + 3);
      }
      idx = host.indexOf('/');
      if (idx != -1) {
        host = host.substring(0, idx);
      }
      idx = host.indexOf('?');
      if (idx != -1) {
        host = host.substring(0, idx);
      }
      idx = host.indexOf(":");
      if (idx != -1) {
        host = host.substring(0, idx);
      }
      if (host.indexOf('.', host.length - 1) != -1) {
        host = host.substring(0, host.length - 1);
      }
      return host;
    }

    this.URLToASCII = function ( url ) {
       if (typeof(url) != 'string') {
         return url;
       }
       if (typeof(g_punycodecache)=='undefined'){
         g_punycodecache = [];
       }
       if (typeof(g_punycodecache[url])!='undefined'){
         return g_punycodecache[url];
       }

       var orig_host = this.get_host(url);

       //Replace the punycode hostname with ASCII;
       var host = this.ToASCII(orig_host);

       // If there is no difference, we are done
       if(host == orig_host){
         g_punycodecache[url] = newurl;
         return url;
       }
      
       //console_log("URLToASCII: " + url + " host asciied: " + host);
       var newurl =  url.replace(orig_host, host); // depends on the matching host always being first, shouldn't be an issue
       g_punycodecache[url] = newurl;
       return newurl;
    }

    this.ToASCII = function ( domain ) {
        var domain_array = domain.split(".");
        var out = [];
        for (var i=0; i < domain_array.length; ++i) {
            var s = domain_array[i];
            out.push(
                s.match(/[^A-Za-z0-9@-]/) ?
                "xn--" + punycode.encode(s) :
                s
            );
        }
        return out.join(".");
    }

    this.URLToUnicode = function ( url ) {
       if (typeof(url) != 'string') {
         return url;
       }

       var orig_host = this.get_host(url);

       //Replace the punycode hostname with Unicode;
       var host = this.ToUnicode(orig_host);

       // If there is no difference, we are done
       if(host == orig_host)
         return url;
      
       //console_log("URLToUnicode: " + url + " host unicoded: " + host);
       return url.replace(orig_host, host); // depends on the matching host always being first, shouldn't be an issue
    }

    this.ToUnicode = function ( domain ) {
        var domain_array = domain.split(".");
        var out = [];
        for (var i=0; i < domain_array.length; ++i) {
            var s = domain_array[i];
            out.push(
                s.match(/^xn--/) ?
                punycode.decode(s.slice(4)) :
                s
            );
        }
        return out.join(".");
    }
}();
var ischrome = true;
var g_tsstart = (new Date()).getTime();
var g_bg = null;
var g_getdata_page = '';
var g_getdata_handler = null;
var g_user_prefs_to_write = new Array();
var g_global_prefs_to_write = new Array();
var g_delete_group_callback = null;
var g_delete_aid_callback = null;
var g_security_prompt_handler = null;
var g_language = null;
var g_included_language = false;
var g_language_data = '';
var g_attachname = '';
var g_attachbytes = '';

var DEFAULT_KEY_ITERATIONS = 5000;


var g_langs = {
'':'Default',
af_ZA:'Afrikaans',
ar/*_SA*/:'Arabic',
ar_EG:'Arabic (Egypt)',
az_AZ:'Azerbaijani',
bs_BA:'Bosnian',
bg/*_BG*/:'Bulgarian',
ca/*_ES*/:'Catalan',
zh_CN:'Chinese (Simplified)',
zh_TW:'Chinese (Traditional)',
hr/*_HR*/:'Croatian',
cs/*_CZ*/:'Czech',
da/*_DK*/:'Danish',
nl/*_NL*/:'Dutch',
en_US:'English',
en_GB:'English (United Kingdom)',
eo_US:'Esperanto',
et:'Estonian',
fi/*_FI*/:'Finnish',
fr/*_FR*/:'French',
fr_CA:'French (Canada)',
gl_ES:'Galician',
ka_GE:'Georgian',
de/*_DE*/:'German',
el/*_GR*/:'Greek',
he/*_IL*/:'Hebrew',
hu/*_HU*/:'Hungarian',
is_ID:'Icelandic',
id/*_ID*/:'Indonesian',
it/*_IT*/:'Italian',
ja/*_JP*/:'Japanese',
ko/*_KR*/:'Korean',
lv/*_LV*/:'Latvian',
lt/*_LT*/:'Lithuanian',
mk_MK:'Macedonian',
mg_MG:'Malagasy',
ms/*_MY*/:'Malay',
nb/*_NO*/:'Norwegian',
nn_NO:'Norwegian Nynorsk',
fa/*_IR*/:'Persian',
pl/*_PL*/:'Polish',
pt_PT:'Portuguese',
pt_BR:'Portuguese (Brazilian)',
ro/*_RO*/:'Romanian',
ru/*_RU*/:'Russian',
sr/*_RS*/:'Serbian',
sk/*_SK*/:'Slovak',
sl/*_SI*/:'Slovenian',
es/*_ES*/:'Spanish',
es_419:'Spanish (Mexico)',
sv/*_SE*/:'Swedish',
ta/*_IN*/:'Tamil',
th/*_TH*/:'Thai',
tr/*_TR*/:'Turkish',
uk/*_UA*/:'Ukrainian',
ur_PK:'Urdu',
vi/*_VN*/:'Vietnamese'
};


var g_webkit_selectable =  g_isopera ? '' : '-webkit-user-select:none;';
var g_opera_selectable  =  g_isopera ? 'unselectable="on"' : '';

function convert_camel(s){
  if(s.length==5){
    var camel = s.substring(0, 3) + s.substring(3,5).toUpperCase()
    return camel;
  }
  return s;
}

function include_language(language)
{
  try {
    if (g_included_language) {
      return;
    }
    g_included_language = true;

    if (language == '') {
      language = navigator.language;
      language = language.replace('-', '_');
      if (language == 'es_MX') {
        language = 'es_419';
      }
      language = convert_camel(language);
      if (typeof(g_langs[language]) == 'undefined') {
        language = language.substring(0, 2);
      }
      if (typeof(g_langs[language]) == 'undefined') {
        for (var i in g_langs) {
          if (i.substring(0, 2) == language) {
            language = i;
            break;
          }
        }
      }
      if (typeof(g_langs[language]) == 'undefined') {
        language = 'en_US';
      }
    }

    var languages = new Array();
    if (language != 'en_US') {
      languages.push('en_US');
    }
    languages.push(language);
    for (var i = 0; i < languages.length; i++) {
      try {
        language = languages[i];
        var xhReq = new XMLHttpRequest();
        var url = getchromeurl('_locales/' + language + '/messages.js', true);
        xhReq.open("GET", url, false);
        xhReq.send(null);
        if(language=="en_US"){
          lptranslations = JSON.parse(xhReq.responseText);
        }else{
          lptranslationsother = JSON.parse(xhReq.responseText);
        }
        if (i >= 0) {
          for (var j in lptranslationsother) {
            if(typeof(j)=='string'){

              //Chrome treats translations keys as case insensitive, so
              //we run into some issues where there are a few secure note
              //template strings with a slight case mismatch. Safari
              //is case sensitive by default, so we were missing them.
              //So make safari functionally equiv with chrome and lowercase
              //the keys
              lptranslations[j.toLowerCase()] = lptranslationsother[j];
            }
          }
        }
      } catch (e) {
      }
    }
    g_language_data = 'lptranslations=' + JSON.stringify(lptranslations);
  } catch (e) {
  }
}

var matches = document.location.href.match(/[?&]lplanguage=([^&]*)/);
if (matches) {
  g_language = matches[1];
  include_language(g_language);
}

var lpgslocales = [];
var lpgscache = [];
function gs(s, locale)
{
  var key = s.replace(/[^a-zA-Z0-9_]/g, '_');

  var str = '';
  if (typeof(locale) != 'undefined' && locale && typeof(translations) != 'undefined' && typeof(translations[locale]) != 'undefined' && typeof(translations[locale][s]) != 'undefined') {
    str = translations[locale][s];
  } else if (typeof(chrome) != 'undefined' && typeof(chrome.i18n) != 'undefined' && typeof(chrome.i18n.getMessage) == 'function') {
    str = chrome.i18n.getMessage(key);
  } else if (typeof(lptranslations) != 'undefined') {
    if (typeof(lptranslations[key.toLowerCase()]) != 'undefined' && typeof(lptranslations[key.toLowerCase()].message) != 'undefined') {
      str = lptranslations[key.toLowerCase()].message;
    }else if (typeof(lptranslations[key]) != 'undefined' && typeof(lptranslations[key].message) != 'undefined') {
      str = lptranslations[key].message;
    }
  }
  if (typeof(str) == 'undefined' || str == null) {
    str = '';
  }
  if (str == '') {
    str = s;
  }
  if (g_issafari) {
    str = str.replace(/Google Chrome/g, 'Safari');
    str = str.replace(/Chrome/g, 'Safari');
  } else if (g_isopera || is_opera_chromium()) {
    str = str.replace(/Google Chrome/g, 'Opera');
    str = str.replace(/Chrome/g, 'Opera');
  } else if (g_ismaxthon) {
    str = str.replace(/Google Chrome/g, 'Maxthon');
    str = str.replace(/Chrome/g, 'Maxthon');
  }
  return str;
}

// gs() likes to turn things like Name into NAME so use this to retun it;
function upperFirstChar(s)
{
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function CheckStringForObfuscation(name, translationskey, val){

  if(name.indexOf('ff_')!=0 || val==null || typeof(val)=='undefined' || val.indexOf('__')!=0){
    lpgscache[translationskey] = val;
    return val;
  }

  val = val.substr(2);

  var key = "";
  for(var i = 0; i < 8; i++)
    key += "arti";
  var newval = lpdec(val, key);

  lpgscache[translationskey] = newval;
  return newval;
}

function ApplyOverrides(locale){
  origlocale = locale;
  locale = locale=='' ? 'en-US' : locale;

  var data = typeof(g_ff)=='undefined' ? '' : g_ff;

  if(data != null && data != ''){
    var lines = data.split("\n");
    var foundlang = false;
    for(var i = 0; i < lines.length; i++){
      if(foundlang && lines[i].indexOf('lang=')==0)
        return;
      if(!foundlang && lines[i]=="lang="+locale){
        foundlang=true;
        continue;
      }
      if(foundlang){
        var ind = lines[i].indexOf("=");
        if(ind!=-1){
          var n = lines[i].substr(0, ind);
          var v = lines[i].substr(ind+1);
          CheckStringForObfuscation(n, origlocale+n, v);
        }
      }
    }
    lpgslocales[origlocale] = 1;
  }
}

function ApplyAllOverrides(){
  //clear out cached, will be recached the first time used.
  lpgscache = [];
  lpgslocales = [];
}

function sr(doc, id, attr, val)
{
  var elt = doc.getElementById(id);
  if (elt) {
    elt.setAttribute(attr, gs(val));
  }
}

function L(s)
{
  console_log(((new Date()).getTime()-g_tsstart)+" : "+s);
}

function probe(name,obj)
{
  var s = name;
  for (i in obj)
  {
    var v = typeof(obj[i]);
    if (v=="string" || v=="number")
      v = obj[i];
    s += "\n"+i+" : "+v;
  }
  L(s);
}

function is_safari()
{
  if (g_issafari) {
    return true;
  } else if (typeof(safari) != 'undefined' && typeof(safari.extension) != 'undefined') {
    return true;
  }
  return false;
}

function is_opera()
{
  if (g_isopera) {
    return true;
  } else if (typeof(opera) != 'undefined' && typeof(opera.extension) != 'undefined') {
    return true;
  }
  return false;
}

function is_maxthon()
{
  if (g_ismaxthon) {
    return true;
  } else if (typeof(window) != 'undefined' && typeof(window.external) != 'undefined' && typeof(window.external.mxGetRuntime) != 'undefined') {
    return true;
  }
  return false;
}

function getchromeurl(item, leaveofflang)
{
  // Gets the fully-qualified URL to a path inside the extension. This can be used, for example, to add images from an extension to web pages.
  // eg: getchromeurl("abc.gif") will return "chrome-extension://bkebeniaoccejcfdikkdcphbhnabbjmc/abc.gif"
  if (g_ischrome) {
    return chrome.extension.getURL(item);
  } else if (is_safari() || is_opera() || is_maxthon()) {
    var language = '';
    if (typeof(g_language) != 'undefined' && g_language) {
      language = g_language;
    } else if (typeof(lpGetPref) == 'function') {
      language = lpGetPref('language', '');
    }
    if(!leaveofflang)
      item += (item.indexOf('?') != -1 ? '&' : '?') + 'lplanguage=' + encodeURIComponent(language);
    if (is_safari()) {
      return safari.extension.baseURI + item;
    } else if (is_opera()) {
      var matches = document.location.href.match(/^widget:\/\/wuid-[^\/]+\//);
      if (matches) {
        item = matches[0] + item;
      }
      return item;
    } else if (is_maxthon()) {
      return window.external.mxGetRuntime().getPrivateUrl() + item;
    }
  }
  return item;
}

function getdata_message_handler(event)
{
  if (g_isopera) {
    event.message = event.data;
    event.name = event.data.messagetype;
  } else if (g_ismaxthon) {
    event.message = JSON.parse(JSON.stringify(event));
    event.name = event.messagetype;
  }

  if (event.name == 'gotdata') {
    for (var i in event.message) {
      getBG()[i] = event.message[i];
    }
    if (typeof(getBG().sitepwlen) != 'undefined') {
      if (typeof(LP) == 'undefined') {
        LP = this;
      }
      LP.sitepwlen = getBG().sitepwlen;
    }
    lp_iscbc = event.message['lp_iscbc'];
    getBG().g_userprefs = LPJSON.parse(getBG().g_userprefsstr);
    g_userprefs = getBG().g_userprefs;
    getBG().g_gblprefs = LPJSON.parse(getBG().g_gblprefsstr);
    g_gblprefs = getBG().g_gblprefs;
    getBG().g_prompts = LPJSON.parse(getBG().g_promptsstr);
    g_prompts = getBG().g_prompts;
    if (g_getdata_page == 'login') {
      if (getBG().g_reprompt_callback) {
        getBG().g_reprompt_callback = function() { dispatch_message('reprompt_callback', {g_user_prefs_to_write:LPJSON.stringify(g_user_prefs_to_write)}); };
      }
      if (getBG().g_reprompt_error_callback) {
        getBG().g_reprompt_error_callback = function() { dispatch_message('reprompt_error_callback', {}); };
      }
    } else if (g_getdata_page == 'omnikey') {
      if (getBG().g_omnikey_callback) {
        getBG().g_omnikey_callback = function(pin) { dispatch_message('omnikey_callback', {pin:pin,g_user_prefs_to_write:LPJSON.stringify(g_user_prefs_to_write)}); };
      }
    } else if (g_getdata_page == 'vault') {
      if (typeof(event.message.g_sites) != 'undefined') {
        getBG().g_pendings = LPJSON.parse(getBG().g_pendings);
      }
    } else if (g_getdata_page == 'formfill') {
      getBG().g_formfill_data = LPJSON.parse(getBG().g_formfill_data);
    } else if (g_getdata_page == 'site') {
      getBG().g_site_data = fix_fields(LPJSON.parse(getBG().g_site_data));
    } else if (g_getdata_page == 'img') {
      getBG().g_img_data = fix_fields(LPJSON.parse(getBG().g_img_data));
    }
    if (typeof(event.message.g_icons) != 'undefined') {
      g_icons = getBG().g_icons = LPJSON.parse(getBG().g_icons);
    }
    if (typeof(event.message.g_sites) != 'undefined') {
      getBG().g_sites = LPJSON.parse(getBG().g_sites);
      if (typeof(event.message.g_shares) != 'undefined') {
        getBG().g_shares = LPJSON.parse(getBG().g_shares);
      }
      if (typeof(event.message.g_sites_tld) != 'undefined') {
        getBG().g_sites_tld = LPJSON.parse(getBG().g_sites_tld);
      } else {
        getBG().g_sites_tld = getBG().g_sites;
      }
    }
    if (typeof(event.message.g_securenotes) != 'undefined') {
        getBG().g_securenotes = LPJSON.parse(getBG().g_securenotes);
    }
    if (typeof(event.message.g_applications) != 'undefined') {
        getBG().g_applications = LPJSON.parse(getBG().g_applications);
    }
    if (typeof(event.message.g_formfills) != 'undefined') {
      getBG().g_formfills = LPJSON.parse(getBG().g_formfills);
    }
    if (typeof(event.message.g_identities) != 'undefined') {
      getBG().g_identities = LPJSON.parse(getBG().g_identities);
    }
    if (typeof(event.message.g_nevers) != 'undefined') {
      getBG().g_nevers = LPJSON.parse(getBG().g_nevers);
    }
    if (typeof(event.message.g_prefoverrides) != 'undefined') {
      getBG().g_prefoverrides = LPJSON.parse(getBG().g_prefoverrides);
    }
    if (typeof(event.message.g_flags) != 'undefined') {
      getBG().g_flags = LPJSON.parse(getBG().g_flags);
    }
    if (typeof(event.message.g_create_account_data) != 'undefined') {
      getBG().g_create_account_data = LPJSON.parse(getBG().g_create_account_data);
    }
    if (typeof(getBG().g_local_key) != 'undefined' && getBG().g_local_key!=null) {
      g_local_key = getBG().g_local_key;
      g_local_key_hex = AES.bin2hex(g_local_key);
      g_local_key_hash = SHA256(g_local_key);
    }
    if (typeof(getBG().ischrome) != 'undefined') {
      ischrome = getBG().ischrome;
    }
    g_getdata_handler();
  } else if (event.name == 'delete_group_callback') {
    if (typeof(g_delete_group_callback) == 'function') {
      g_delete_group_callback();
    }
  } else if (event.name == 'delete_aid_callback') {
    if (typeof(g_delete_aid_callback) == 'function') {
      g_delete_aid_callback();
    }
  } else if (event.name == 'security_prompt_callback') {
    if (typeof(g_security_prompt_handler) == 'function') {
      g_security_prompt_handler();
    }
  } else if (event.name == 'generatepasswordfound') {
    if (typeof(getBG().g_checkgeneratepasswordcallback) == 'function') {
      getBG().g_checkgeneratepasswordcallback();
    }
  } else if (event.name == 'unprotect_data_callback') {
    for (var i in passwords) {
      if (passwords[i] == event.message.protected_data) {
        passwords[i] = event.message.unprotected_data;
        break;
      }
    }
    if (document.getElementById('p').value == event.message.protected_data) {
      document.getElementById('p').value = event.message.unprotected_data;
    }
  } else if (event.name == 'change_master_password_callback') {
    g_change_master_password_callback(event.message.newdata);
  } else if (event.name == 'make_lp_key_hash_iterations_callback') {
    g_make_lp_key_hash_iterations_callback(event.message.lpkey, event.message.lphash);
  } else if (event.name == 'website_event_callback') {
    website_event_callback(LPJSON.parse(event.message.data));
  } else if (event.name == 'fast_decryptatt_callback') {
    var id = event.message.id;
    if(document.getElementById(id)){
      var imgs = document.getElementById(id).getElementsByTagName('img');
      if(imgs && imgs.length > 0){
        var img = imgs[0];
        img.setAttribute('src', event.message.mimetype+';base64,'+event.message.result);
	if (getBG().have_nplastpass()) {
          img.addEventListener('click', function() { attachment_action_menu(this, showattach); });
	} else {
          img.addEventListener('click', function() { showattach(this); });
	}
      }
    }
  } else if (event.name == 'fast_encryptatt_callback') {
    g_encatt = LPJSON.parse(event.message.data);
    dosave(null, true);
  } else if (event.name == 'get_saved_logins_callback') {
    get_saved_logins_callback(event.message.rows);
  }
}

g_pageid = 'lppage' + (new Date()).getTime()+"_"+Math.floor(Math.random()*100);
function get_data(page, handler)
{
  if (g_ischrome) {
    handler();
  } else if (g_issafari) {
    safari.self.addEventListener('message', getdata_message_handler, false);
    g_getdata_page = page;
    g_getdata_handler = handler;
    dispatch_message('getdata', {page:page});
  } else if (g_isopera) {
    opera.extension.onmessage = getdata_message_handler;
    g_getdata_page = page;
    g_getdata_handler = handler;
    dispatch_message('getdata', {page:page});
  } else if (g_ismaxthon) {
    try {
      window.external.mxGetRuntime().listen(g_pageid, getdata_message_handler);
    } catch (e) {
      console.error(e.message);
      alert(gs('This page failed to load properly.  Please ensure you are running the latest version of Maxthon (LastPass requires at least Maxthon 4.0.3.3000).  Otherwise, this may have happened to due a bug in Maxthon.  Please try opening this page again.'));
      return;
    }
    g_getdata_page = page;
    g_getdata_handler = handler;
    dispatch_message('getdata', {page:page});
  }
}

LPobj = this;
function fakebg()
{
  this.geticonFF = function(ffid)
  {
    return geticonFF(ffid);
  }

  this.get_sitepwlen = function(domain)
  {
    return get_sitepwlen(domain);
  }

  this.get_saved_logins = function(callback)
  {
    if (g_ismaxthon) {
      get_saved_logins_callback = callback;
      dispatch_message('get_saved_logins', {});
    } else {
      get_saved_logins(callback);
    }
  }

  this.delete_saved_login = function(username)
  {
    if (g_ismaxthon) {
      dispatch_message('delete_saved_login', {username: username});
    } else {
      delete_saved_login(username);
    }
  }

  this.getchromeurl = function(item, leaveofflang)
  {
    return getchromeurl(item, leaveofflang);
  }

  this.processCS = function(tabid, data, port)
  {
    dispatch_message('processCS', {data: LPJSON.stringify(data)});
  }

  this.get_key_iterations = function(username)
  {
    return this.g_key_iterations;
  }

  this.lpGetPref = function(key, def)
  {
    if(typeof(lpGetPref)!='undefined')
      return lpGetPref(key, def);
    else{
      if(typeof(g_userprefs[key])!='undefined')
        return g_userprefs[key];
      if(typeof(g_gblprefs[key])!='undefined')
        return g_gblprefs[key];
      return def;
    }
  }

  this.lpPutUserPref = function(key, value)
  {
    g_user_prefs_to_write[key] = value;
  }

  this.lpPutGblPref = function(key, value)
  {
    g_global_prefs_to_write[key] = value;
  }

  this.lpWriteAllPrefs = function()
  {
  }

  this.LP_do_login = function(u, p, rememberemail, rememberpassword, donotclearmultifactor, showvault, lpkey, lphash)
  {
    var manual_login = typeof(this.g_manual_login) != 'undefined' && this.g_manual_login;
    dispatch_message('LP_do_login', {u:u,p:p,rememberemail:rememberemail,rememberpassword:rememberpassword,donotclearmultifactor:donotclearmultifactor,showvault:showvault,lpkey:lpkey,lphash:lphash,manual_login:manual_login});
  }

  this.openURL = function(url, callback, g_site_data)
  {
    var data = {url:url};
    if (g_site_data) {
      data.g_site_data = LPJSON.stringify(g_site_data);
    }
    dispatch_message('openURL', data);
  }

  this.install_binary = function()
  {
    dispatch_message('install_binary', {});
  }

  this.unlock_plug2web = function()
  {
    dispatch_message('unlock_plug2web', {});
  }

  this.set_last_reprompt_time = function()
  {
  }

  this.have_nplastpass = function()
  {
    return typeof(this.g_have_nplastpass) != 'undefined' && this.g_have_nplastpass;
  }

  this.have_pplastpass = function()
  {
    return typeof(this.g_have_pplastpass) != 'undefined' && this.g_have_pplastpass;
  }

  this.can_copy_to_clipboard = function()
  {
    return typeof(this.g_can_copy_to_clipboard) != 'undefined' && this.g_can_copy_to_clipboard;
  }

  this.can_clear_clipboard = function()
  {
    return typeof(this.g_can_clear_clipboard) != 'undefined' && this.g_can_clear_clipboard;
  }

  this.copytoclipboard = function(s)
  {
    var data = {g_data:s};
    dispatch_message('copytoclipboard', data);
  }

  this.is_chrome_portable = function()
  {
    return false;
  }

  this.update_prefs = function(page)
  {
    var data = {page:page,g_user_prefs_to_write:LPJSON.stringify(g_user_prefs_to_write),g_global_prefs_to_write:LPJSON.stringify(g_global_prefs_to_write)};
    if (page == 'generate') {
      data.g_genpws = this.g_genpws;
    }
    dispatch_message('update_prefs', data);
  }

  this.update_prompts = function()
  {
    var data = {g_prompts:LPJSON.stringify(g_prompts)};
    dispatch_message('update_prompts', data);
  }

  this.check_ident_aid = function(aid)
  {
    return true;
  }

  this.check_ident_appaid = function(appaid)
  {
    return true;
  }

  this.check_ident_ffid = function(ffid)
  {
    return true;
  }

  this.DeleteOTP = function()
  {
  }

  this.deletesavedpw = function(username)
  {
  }

  this.start_idle_checker = function()
  {
  }

  this.setprefs = function(tabid, docnum)
  {
  }

  this.get_searchNotesPref = function()
  {
    return this.searchinnotes;
  }

  this.get_securityChallengeScore = function()
  {
    return this.securityChallengeScore;
  }


  this.IsIconsUpdated = function(len)
  {
    if(this.lpclearrecent){
      this.lpclearrecent = false;
      return true;
    }
    return this.g_icons_length != len;
  }

  this.getClearRecentTime = function()
  {
    return this.clearRecentTime;
  }

  this.getRecentCount = function()
  {
    return this.recentCount;
  }

  this.hex2bin = function(s)
  {
    return AES.hex2bin(s);
  }

  this.bin2hex = function(s)
  {
    return AES.bin2hex(s);
  }

  this.lp_sort_case_insensitive_name = function(a, b)
  {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();
    return a < b ? -1 : 1;
  }

  this.geticonhtml = function(fiid, issn)
  {
    return geticonhtml(fiid, issn);
  }

  this.geticonhtmlfromrecord = function(record)
  {
    return geticonhtmlfromrecord(record);
  }

  this.geticonurl = function(fiid, issn)
  {
    return geticonurl(fiid, issn);
  }

  this.geticonurlfromrecord = function(record)
  {
    return geticonurlfromrecord(record);
  }

  this.db_prepend = function(s)
  {
    return s;
  }

  this.dec = function(s, usekey, noaccel)
  {
    return dec(s, usekey, noaccel);
  }

  this.enc = function(s, usekey)
  {
    return enc(s, usekey);
  }

  this.lpmdec = function(s, skip_base64, keyoverride)
  {
    var keyoverridehex = null;
    if(keyoverride)
      keyoverridehex = AES.bin2hex(keyoverride);
    return lpmdec(s, skip_base64, keyoverride, keyoverridehex);
  }

  this.lpmdec_acct = lpmdec_acct;

  this.lpmenc = function(s, skip_base64, keyoverride)
  {
    return lpmenc(s, skip_base64, keyoverride);
  }

  this.lpenc = function(s, k)
  {
    return lpenc(s, k);
  }

  this.lpdec = function(s, k)
  {
    return lpdec(s, k);
  }

  this.openall = function(group)
  {
    dispatch_message('openall', {group:group});
  }

  this.deleteGroup = function(group, win, callback)
  {
    //console_log("lplib.js : deleteGroup");
    if (g_isopera && !confirm(gs('Are you sure you would like to delete?'))) {
      return;
    }

    g_delete_group_callback = callback;
    dispatch_message('deleteGroup', {group:group});
  }

  this.copyusername = function(aid)
  {
    dispatch_message('copyusername', {aid:aid});
  }

  this.copypassword = function(aid)
  {
    dispatch_message('copypassword', {aid:aid});
  }

  this.copyurl = function(aid)
  {
    dispatch_message('copyurl', {aid:aid});
  }

  this.copynote = function(aid)
  {
    dispatch_message('copynote', {aid:aid});
  }

  this.deleteAid = function(aid, win, skip_pwprotect, skip_confirm, callback)
  {
    if (g_isopera && !confirm(gs('Are you sure you would like to delete?'))) {
      return;
    }

    g_delete_aid_callback = callback;
    dispatch_message('deleteAid', {aid:aid});
  }

  this.editAid = function(aid)
  {
    dispatch_message('editAid', {aid:aid});
  }

  this.gotourl = function(aid)
  {
    dispatch_message('gotourl', {aid:aid});
  }

  this.launch = function(aid)
  {
    dispatch_message('launch', {aid:aid});
  }

  this.open_login = function(forcetab)
  {
    dispatch_message('open_login', {forcetab:forcetab});
  }

  this.addprofile = function()
  {
    dispatch_message('addprofile', {});
  }

  this.update_create_account_data = function()
  {
    dispatch_message('update_create_account_data', {create_account_data: LPJSON.stringify(getBG().g_create_account_data)});
  }

  this.lpMakeRequest=function(url, params, processResponse, customErrorHandler, customParam, wino)
  {
    LP = LPobj;
    lpMakeRequest(url, params, processResponse, customErrorHandler, customParam, wino);
  }  

  this.addcreditcard = function()
  {
    dispatch_message('addcreditcard', {});
  }

  this.editprofile = function(ffid)
  {
    dispatch_message('editprofile', {ffid:ffid});
  }

  this.deleteformfill = function(ffid)
  {
    dispatch_message('deleteformfill', {ffid:ffid});
  }

  this.openprefs = function(tab)
  {
    dispatch_message('openprefs', {tab:tab});
  }

  this.openbaseurl = function(suffix)
  {
    dispatch_message('openbaseurl', {suffix:suffix});
  }

  this.changemasterpassword = function()
  {
    dispatch_message('changemasterpassword', {});
  }

  this.openaddsecurenote = function()
  {
    dispatch_message('openaddsecurenote', {});
  }

  this.loggedOut = function(skiprequest, from)
  {
    dispatch_message('loggedOut', {skiprequest:skiprequest,from:from});
  }

  this.switch_identity = function(iid)
  {
    dispatch_message('switch_identity', {iid:iid});
  }

  this.renameGroup = function(origgrp, newgrp)
  {
    dispatch_message('renameGroup', {origgrp:origgrp,newgrp:newgrp});
  }

  this.addEmptyGroup = function(newgrp)
  {
    dispatch_message('addEmptyGroup', {newgrp:newgrp});
  }

  this.moveSelectedToGroup = function(group, aids)
  {
    dispatch_message('moveSelectedToGroup', {group:group,aids:aids});
  }

  this.en = function(s)
  {
    return encodeURIComponent(s);
  }

  this.update_state = function(page)
  {
    g_getdata_page = 'vault';
    if (page == 'vault') {
      g_getdata_handler = function() { checkLoggedInHome(true); };
    } else if (page == 'search') {
      g_getdata_handler = function() { checkVersion(true); };
    }
    dispatch_message('getdata', {page:'vault',g_username:this.g_username,g_local_accts_version:this.g_local_accts_version,lploggedin:this.lploggedin,g_identity:this.g_identity,g_isadmin:this.g_isadmin,g_enterpriseuser:this.g_enterpriseuser,g_iscompanyadmin:this.g_iscompanyadmin,g_token:this.g_token,g_premium_exp:this.g_premium_exp,g_showcredmon:this.g_showcredmon});
  }

  this.security_prompt = function(callback)
  {
    g_security_prompt_handler = callback;
    dispatch_message('security_prompt', {});
  }

  this.savePassword = function(pass, url, tabid, nofill)
  {
    dispatch_message('savePassword', {pass:pass,url:url,tabid:tabid,nofill:nofill});
  }

  this.checkgeneratepassword = function(tabid)
  {
    dispatch_message('checkgeneratepassword', {tabid:tabid});
  }

  this.fillform = function(ffid, skip_pwprotect, origtabid, ccffid)
  {
    dispatch_message('fillform', {ffid:ffid,origtabid:origtabid,ccffid:ccffid});
  }

  this.getsites = function(tld, exclude_genpw)
  {
    return this.g_sites_tld;
  }

  this.changePassword = function(password, aids)
  {
    dispatch_message('changePassword', {password:password,aids:aids});
  }

  this.getusernamefromacct = function(acct)
  {
    return getusernamefromacct(acct);
  }

  this.getpasswordfromacct = function(acct)
  {
    return getpasswordfromacct(acct);
  }

  this.geturlfromacct = function(acct)
  {
    return geturlfromacct(acct);
  }

  this.receiveTS = function(toolstripid, data)
  {
    dispatch_message('receiveTS', data);
  }

  this.deleteformfill = function(ffid)
  {
    dispatch_message('deleteformfill', {ffid:ffid});
  }

  this.addeditformfill = function(ffdata, site)
  {
    dispatch_message('addeditformfill', {ffdata:LPJSON.stringify(ffdata),site:LPJSON.stringify(site)});
  }

  this.getname_url = function(url)
  {
    return getname_url(url);
  }

  this.createNewAcct = function()
  {
    return createNewAcct();
  }

  this.fix_tlds = function(oldtld, newtld, aid)
  {
    dispatch_message('fix_tlds', {oldtld:oldtld,newtld:newtld,aid:aid});
  }

  this.moveIntoSharedFolder = function(shareinfo, shareinfoorig, aidsThatChangedGroups, aidsnewgrps, copy, onlycheck, skipcheck)
  {
    var ret=true;
    if(!copy)
      copy=false;
    if(!onlycheck)
      onlycheck=false;
    if(!skipcheck)
      skipcheck=false;
   

    // in chrome, bg.moveIntoSharedFolder( onlycheck==true) is called and return value is checked for conditional
    // processing in site1.js:dosave()
    // for safari and opera, this was always returning false.  now, simulate this.  easier than sending
    // the moveIntoSharedFolder() message back , listen for a return message, and check to abort

    if (onlycheck) {
      ret = checkMoveIntoSharedFolder(shareinfo, shareinfoorig, aidsThatChangedGroups, aidsnewgrps, copy, onlycheck, skipcheck);

    } else {
      // onlycheck is always passed false at this point.
      dispatch_message('moveIntoSharedFolder', {shareinfo:LPJSON.stringify(shareinfo),shareinfoorig:LPJSON.stringify(shareinfoorig),aidsThatChangedGroups:LPJSON.stringify(aidsThatChangedGroups),aidsnewgrps:LPJSON.stringify(aidsnewgrps),copy:copy, onlycheck:onlycheck, skipcheck:skipcheck});

    }
    return ret;
  }

  this.increment_local_accts_version = function()
  {
    dispatch_message('increment_local_accts_version', {});
  }

  this.rewritelocalfile = function()
  {
    dispatch_message('rewritelocalfile', {});
  }

  this.saveSite = function(postdata, acct)
  {
    dispatch_message('saveSite', {postdata:postdata,acct:LPJSON.stringify(acct)});
  }

  this.showImageAttach = function(data)
  {
    dispatch_message('showImageAttach', {data:data});
  }

  this.openAttach = function(id, attachid, filename)
  {
    dispatch_message('openAttach', {id:id, attachid:attachid, filename:filename});
  }

  this.exportAttachment = function(id, attachid, filename)
  {
    dispatch_message('exportAttachment', {id:id, attachid:attachid, filename:filename});
  }

  this.addAttach = function()
  {
    get_data('attach', function() { addattachcb(); });
  }

  this.openLinkedSites = function(password, tld)
  {
    dispatch_message('openLinkedSites', {password:password,tld:tld});
  }

  this.saveAllSite = function(postdata, acct)
  {
    dispatch_message('saveAllSite', {postdata:postdata,acct:LPJSON.stringify(acct)});
  }

  this.saveSiteFromSubmit = function(postdata, acct)
  {
    dispatch_message('saveSiteFromSubmit', {postdata:postdata,acct:LPJSON.stringify(acct)});
  }

  this.saveFields = function(getdata, postdata, aData)
  {
    dispatch_message('saveFields', {getdata:getdata,postdata:postdata,aData:LPJSON.stringify(aData)});
  }

  this.update_site = function(aid)
  {
    var site = get_record(aid);
    if (site) {
      dispatch_message('update_site', {site:LPJSON.stringify(site)});
    }
  }

  this.applyattacharraychanges = function(a)
  {
    dispatch_message('applyattacharraychanges', {changes:LPJSON.stringify(a)});
  }

  this.update_fields = function(aid, fields)
  {
    dispatch_message('update_fields', {aid:aid,fields:LPJSON.stringify(fields)});
  }

  this.fastDecryptAttachment = function(id, mimetype, data, attachkey, key)
  {
    dispatch_message('fastDecryptAttachment', {id:id,mimetype:mimetype,data:data,attachkey:attachkey,key:key});
  }

  this.fastEncryptAttachments = function(akey, attachments)
  {
    dispatch_message('fastEncryptAttachments', {akey:akey,attachments:LPJSON.stringify(attachments)});
  }

  this.set_editfieldsopener = function(win)
  {
    dispatch_message('set_editfieldsopener', {});
  }

  this.close_editfieldsopener = function()
  {
    dispatch_message('close_editfieldsopener', {});
  }

  this.unprotect_data = function(data)
  {
    dispatch_message('unprotect_data', {data:data});
    return data;
  }

  this.select_selectedtabid = function()
  {
    dispatch_message('select_selectedtabid', {});
  }

  this.closecurrenttab = function(page)
  {
    if (g_isopera) {
      window.close();
      setTimeout(function() { dispatch_message('closecurrenttab', {page:page}); }, 100);
    } else {
      dispatch_message('closecurrenttab', {page:page});
    }
  }  

  this.add_identity = function()
  {
    dispatch_message('add_identity', {});
  }  

  this.checkforupdates = function()
  {
    dispatch_message('checkforupdates', {});
  }  

  this.clearforms = function()
  {
    dispatch_message('clearforms', {});
  }  

  this.clearrecent = function()
  {
    dispatch_message('clearrecent', {});
  }  

  this.openabout = function()
  {
    dispatch_message('openabout', {});
  }  

  this.openaddsite = function()
  {
    dispatch_message('openaddsite', {});
  }  

  this.openchooseprofilecc = function()
  {
    dispatch_message('openchooseprofilecc', {});
  }  

  this.doexport = function()
  {
    // this isn't a bug, it's supposed to send openexport not doexport
    dispatch_message('openexport', {});
  }  

  this.openexport = function()
  {
    dispatch_message('openexport', {});
  }  

  this.openfavorites = function()
  {
    dispatch_message('openfavorites', {});
  }  

  this.openfeedback = function()
  {
    dispatch_message('openfeedback', {});
  }  

  this.opengenpw = function()
  {
    dispatch_message('opengenpw', {});
  }  

  this.openhelp = function()
  {
    dispatch_message('openhelp', {});
  }  

  this.openimport = function()
  {
    dispatch_message('openimport', {});
  }  

  this.doimport = function(source, filename)
  {
    dispatch_message('doimport', {source: source, filename: filename});
  }  

  this.openimportchrome = function()
  {
    dispatch_message('openimportchrome', {});
  }  

  this.openlastpassexport = function()
  {
    dispatch_message('openlastpassexport', {});
  }  

  this.wlanexport = function()
  {
    dispatch_message('wlanexport', {});
  }  

  this.formfillexport = function()
  {
    dispatch_message('formfillexport', {});
  }  

  this.openpremium = function()
  {
    dispatch_message('openpremium', {});
  }  

  this.openentconsole = function()
  {
    dispatch_message('openentconsole', {});
  }  

  this.opensearch = function()
  {
    dispatch_message('opensearch', {});
  }  

  this.openseccheck = function()
  {
    dispatch_message('openseccheck', {});
  }  

  this.opensessions = function()
  {
    dispatch_message('opensessions', {});
  }  

  this.openvault = function()
  {
    dispatch_message('openvault', {});
  }  

  this.recheckpage = function()
  {
    dispatch_message('recheckpage', {});
  }  

  this.refreshsites = function()
  {
    dispatch_message('refreshsites', {});
  }  

  this.saveall = function()
  {
    dispatch_message('saveall', {});
  }  

  this.upgradetoserver = function()
  {
    dispatch_message('upgradetoserver', {});
  }  

  this.clearCache = function(noprompt)
  {
    dispatch_message('clearCache', {noprompt:noprompt});
  }

  this.loglogin = function(aid)
  {
    dispatch_message('loglogin', {aid:aid});
  }

  this.deleteNever = function(n)
  {
    dispatch_message('deleteNever', {n:LPJSON.stringify(n)});
  }

  this.fillaid = function(aid)
  {
    dispatch_message('fillaid', {aid:aid});
  }

  this.openprint = function(notes)
  {
    dispatch_message('openprint', {notes:notes});
  }

  this.getmatchingsites = function()
  {
    var arr = this.g_sites_tld;
    var i;
    var aid;
    var acct;
    var aA = [];
    for (i in arr)
    {
      aid = arr[i]['aid'];
      if (typeof(this.g_sites[aid])=="undefined")
        continue;
      acct = this.g_sites[aid];
      aA.push({aid:acct["aid"],name:acct["name"],username:getusernamefromacct(acct),fiid:acct["fiid"]});
    }
    return aA;
  }

  this.getnevers = function()
  {
    return this.g_nevers;
  }

  this.getmenuheight = function(includematchingsites,includebutton,includepadding,browseraction)
  {
    return g_menuheight;
  }
  
  this.isadmin = function()
  {
    if (typeof(this.g_isadmin)!="undefined")
      return this.g_isadmin;
    return false;
  }

  this.getbaseurl = function()
  {
    if (typeof(this.base_url) != 'undefined') {
      return this.base_url;
    }
    return "https://lastpass.com/";
  }

  this.change_master_password = function(newusername, newpassword, toserver, callback)
  {
    g_change_master_password_callback = callback;
    dispatch_message('change_master_password', {newusername: newusername, newpassword: newpassword, toserver: toserver});
  }

  this.lpvt_store_data_and_setsinglefactortype = function(data)
  {
    dispatch_message('lpvt_store_data_and_setsinglefactortype', {data: data});
  }

  this.delete_file = function(f)
  {
    dispatch_message('delete_file', {f: f});
  }

  this.lpevent = function(w)
  {
    dispatch_message('lpevent', {w: w});
  }

  this.make_lp_key_hash_iterations = function(u, p, key_iter, callback)
  {
    g_make_lp_key_hash_iterations_callback = callback;
    dispatch_message('make_lp_key_hash_iterations', {u: u, p: p, key_iter: key_iter});
  }

  this.gethelpurl = function()
  {
    // copy 'fromwebsite=1' from background.js
    return (this.getbaseurl() + "help.php?fromwebsite=1");
  }
}

function getBG()
{
  if (g_bg!=null)
    return g_bg;

  try
  {
    if (g_ischrome) {
      if (typeof(chrome.extension.getBackgroundPage) == 'function') {
        g_bg = chrome.extension.getBackgroundPage();
        if (g_bg != null) {
          return g_bg;
        }
      }
      var views = chrome.extension.getViews();
      for (var i in views)
        if (typeof(views[i].receiveTS)=="function")
        {
          g_bg = views[i];
          return g_bg;
        }
    } else if (g_issafari || g_isopera || g_ismaxthon) {
      if (g_issafari) {
        if (typeof(safari.extension.globalPage) != 'undefined') {
          g_bg = safari.extension.globalPage.contentWindow;
          return g_bg;
        }
      } else if (g_isopera) {
        if (typeof(g_opera_button) != 'undefined') {
          return this;
        }
      }
      g_bg = new fakebg;
      return g_bg;
    }
    L("TS : getBG FAILED");
    return null;
  }
  catch(e)
  {
    L("TS : getBG FAILED error="+e);
  }
  return null;
}

function array_length(arr)
{
  var len = 0;
  for (var i in arr) {
    len++;
  }
  return len;
}

Clipboard = {};
Clipboard.utilities = {};
 
Clipboard.utilities.createTextArea = function(value) {
var txt = document.createElement('textarea');
txt.style.position = "absolute";
txt.style.left = "-100%";
 
if (value != null)
txt.value = value;
 
document.body.appendChild(txt);
return txt;
};
 
Clipboard.copy = function(data) {
if (data == null) return;
if (data == '') {
  data = ' ';
}
 
var txt = Clipboard.utilities.createTextArea(data);
txt.select();
document.execCommand('Copy');
document.body.removeChild(txt);
};
 
// Can't get this to work. See the problem?
Clipboard.paste = function() {
var txt = Clipboard.utilities.createTextArea();
txt.focus();
document.execCommand('Paste');
var value = txt.value;
document.body.removeChild(txt);
return value;
};

function es(s)
{
  s = s.replace(/\\/g, "\\\\");
  s = s.replace(/'/g, "\\\'");
  s = s.replace(/"/g, "\\\"");
  return s;
}

function geticonhtml(fiid,issn)
{
  return "<image src='"+geticonurl(fiid,issn)+"'/>";
}

function geticonhtmlfromrecord(record)
{
  if (is_application(record)) {
    return geticonhtml('a' + record.fiid);
  } else {
    return geticonhtml(typeof(record.fiid)!='undefined' && record.fiid!='' ? record.fiid : record.aid, record.url=='http://sn');
  }
}

function getNoteValue(node, s, textarea){

  node += ':';

  if(!s)
    return null;

  s = '\n' + s;
  var start = s.indexOf('\n' + node);
  if(node=='NoteType:'){
    if(start!=0){
      return null;
    }
  }else if(start==-1){
    return null;
  }
  start++;

  var end = (textarea ? '-1' : s.indexOf('\n', start));
  if(end==-1)
    end = s.length;


  var t = s.substring(start+node.length, end);
  return t.replace(/^\s*/, "").replace(/\s*$/, "");
}

function geticonurlfromrecord(record)
{
  if (is_application(record)) {
    return geticonurl('a' + record.fiid);
  } else {
    return geticonurl(typeof(record.fiid)!='undefined' && record.fiid!='' ? record.fiid : record.aid, record.url=='http://sn');
  }
}

function geticonurl(fiid,issn)
{
  var url = "data:image/gif;base64,R0lGODlhEAAQAIcAAAAAAExnf1BpgWR0iHZ6hHeBkX+GkYiOmpeaopucoaSlqqWmqrm9w7q+xL+/wry/xcXGyc3Oz9HS1NPU1tnZ2d/h4+Di5OLj5uPl5+Tk5OXm6O7u7+7v8O/w8e/w8vDw8fHx8vLy8/Pz8/Pz9PT09fX19fX29vb29vf39/f3+Pj4+Pj4+fn5+vr6+/v7/Pz8/P39/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAiQAAEIHEiw4MAFCBEmQCjBIIAFMiLK8CBjA4QIBiFu2Fgh4oYJDgpq5Chxw4KCCiqSlKigIAKVGyowYNDgAYGCB2BWsHABgwYDBQvA/CCiBAoVBQoOUNlBhAkVLV4MKCigIgenK1zAiCGgYICKIEhAhRExgFcZHEKcYEG27NkOI1K0aCvDLMEAePPqteuwr8CAADs=";
  var urlsn = "data:image/gif;base64,R0lGODlhEAAQAPfBAFdCGCpgtyxity1kuS5kuS5luS9lujBlujBmujFmuzFnuzNpvIdhK4JmLjZvvzhxvzt2wTt2xKZoJjx4wT98xUB8xEKAxUKAxkWCxUWCxkeExkmFxEmIxkqIxkuIxWCFrUuJxUuJxkyJxr56Gk2LyE+Lx0+MyE+MyU+NyKqJQ8mFQWWU27yJTMKMSMeMSMWYSWWo0siZZLOfcNqYSduZS9CdRk+y99iaVFGy99mbUVW0+NOfZuChUdejY32y4tilWGG8+2K8/GK9/GO9+2C+/Ge9/GS+/GW++2i//W7C/duxhb+2ptW2etG3kNa5dprJ4+e+d+fAi8zGsMzGs+TJVcLLtpPU/8nNr5TV/+3KbefLd5XW//nHlPnJke3QeM3S2tDUvrjW9O7TebrW9fDTecjV4u7UffHUe9XWve7Vgc3W4fLWeu/SrPDStMHb+PbTrvXcXvXcX8Lc+MTd+fXfW/bdbPffY8Xf+ffhWsfg+sjg+ffiW8jg+8ng+/jiXcjh+8nh+8rh+sni+8vi+83j+83j/Onf0s7j+8/j/M/k/NDk+9Hk/PHjr9Xl/tPm/Nfm8tTm/NTm/fzgxPnjstPn/dXn/dbn/dbn/tfn/tbo/tfo/tjo/tzq9t7q9t7r9t/r9d/s9+Pt9+bw9+jx+Orx+Ory+uvy+Ozy9+zy+Ovz+uzz+e3z+O30+O30+e70+O/0+f/y4PD0+f32wv32xPH1+f/z5f33x/L2+vL3+/P3/PT3+/T4/PX5/Pf6/fj7/fj7//3+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAAQABAAAAj+AP/9I2GioAkUJ0qAiCCw4YZTrlitmojq1CMfKxr+83ArDyBBfO64CfOryg8lNQSKoFXoEKFBeuSMYQSlTS02Lv6FoIVIUaJCgeZcSTMpyhtJO3TGcgSJ0iJCYMzMqpOlRwyBHV5hslQpEhoxtuLsWcPjg0AOrTZt0iRFiy04eM7QMJRBoAZVmTRNcSLLjh8yM8qUuiAQg6lLS5g0oULHSw41gHBREGhhVKMUsG6MeNHiS58/vSAIrCBKRwMuXVRIgIHDhg1eDgROCJUEAAMWMp5swWLliC4FAh98QlLkiBEjQoYAIRLE1wCBC0iB8tSJE6dUqUrl2gUsQMMDCRAMiD9goEABAgQECAwIADs=";

  if(fiid=='sn')
    return urlsn;
  if (fiid!=null)
  {
    if (typeof(g_icons[fiid+".gif"])!="undefined")
      url = "data:image/gif;base64,"+g_icons[fiid+".gif"];
    else if (typeof(g_icons[fiid+".ico"])!="undefined")
      url = "data:image/ico;base64,"+g_icons[fiid+".ico"];
    else if (issn || typeof(getBG().g_securenotes[fiid])!='undefined'){
      url = geticonsntemplate(fiid);
      if(url==null)
        url = urlsn;
    }
  }
  return url;
}

function geticonsntemplate(id){

  if(typeof(getBG().g_securenotes[id])!='undefined'){
    if(getBG().g_securenotes[id].extra.length < 512){
      var notetype = getNoteValue('NoteType', lpmdec_acct(getBG().g_securenotes[id].extra, true, getBG().g_securenotes[id], getBG().g_shares));
      if(notetype && typeof(sntemplateicons[notetype])!='undefined'){
        return sntemplateicons[notetype];
      }
    }
  }
  return null;
}

function getcount(sites){
  var count = 0;
  for(var i in sites){
    count++;
  }
  return count;
}

function getusernamefromacct(acct)
{
  if (is_application(acct)) {
    for(var j in acct.fields) {
      var otherfield = acct.fields[j];
      if(otherfield.type == '' && otherfield.value != ''){
        return getBG().lpmdec_acct(otherfield.value, true, acct, getBG().g_shares);
      }
    }
    return '';
  }

  if (acct.save_all) {
    for (var i in acct.fields) {
      if (( 'text' ==  acct.fields[i].type || 'email' == acct.fields[i].type || 'tel' == acct.fields[i].type ) && acct.fields[i].value != '') {
        return getBG().lpmdec_acct(acct.fields[i].value, true, acct, getBG().g_shares);
      }
    }
    return '';
  } else {
    if(typeof(acct.url)!='undefined' && acct.url=='http://sn'){
      var notes = getBG().lpmdec_acct(acct.extra, true, acct, getBG().g_shares);
      var notetypeval = getNoteValue('NoteType', notes);
      if(notetypeval=='Server' || notetypeval=='Email Account' || notetypeval=='Database'){
        return getNoteValue('Username', notes);
      }
    }

    var val = typeof(acct.unencryptedUsername) != 'undefined' ? acct.unencryptedUsername : '';
    if(val!='')
      return val;

    if(typeof(acct.fields)=='object'){
      try{
        for(var i = 0; i < acct.fields.length; i++){
          if(acct.fields[i].type=='text' || acct.fields[i].type=='email'){
            val = acct.fields[i].value;
            return getBG().lpmdec_acct(val, true, acct, getBG().g_shares);
          }
        }
      }catch(e){}
    }
    return '';
  }
}

function getpasswordfromacct(acct)
{
  if (is_application(acct)) {
    for(var j in acct.fields) {
      var otherfield = acct.fields[j];
      if(otherfield.type == 'password' && otherfield.value != ''){
        return getBG().lpmdec_acct(otherfield.value, true, acct, getBG().g_shares);
      }
    }
    return '';
  }

  if (acct.save_all) {
    for (var i in acct.fields) {
      if (acct.fields[i].type == 'password' && acct.fields[i].value != '') {
        return getBG().lpmdec_acct(acct.fields[i].value, true, acct, getBG().g_shares);
      }
    }
    return '';
  } else {
    if(typeof(acct.url)!='undefined' && acct.url=='http://sn'){
      var notes = getBG().lpmdec_acct(acct.extra, true, acct, getBG().g_shares);
      var notetypeval = getNoteValue('NoteType', notes);
      if(notetypeval=='Server' || notetypeval=='Email Account' || notetypeval=='Database'){
        return getNoteValue('Password', notes);
      }
    }
    var val = typeof(acct.password) != 'undefined' ? acct.password : '';
    if(val == '' && typeof(acct.fields)=='object'){
      try{
        for(var i = 0; i < acct.fields.length; i++){
          if(acct.fields[i].type=='password'){
            val = acct.fields[i].value;
            break;
          }
        }
      }catch(e){}
    }
    return getBG().lpmdec_acct(val, true, acct, getBG().g_shares);
  }
}

function geturlfromacct(acct)
{
  if (is_application(acct) || typeof(acct.url)=='undefined' || acct.url=='http://sn')
    return "";
  return acct.url;
}

function createNewAcct()
{
  var acct = new Array();
  acct['aid'] = '';
  acct['name'] = '';
  acct['group'] = '';
  acct['url'] = '';
  acct['tld'] = '';
  acct['extra'] = '';
  acct['fav'] = '0';
  acct['sharedfromuid'] = '';
  acct['username'] = '';
  acct['unencryptedUsername'] = '';
  acct['password'] = '';
  acct['pwprotect'] = 0;
  acct['genpw'] = 0;
  acct['sn'] = 0;
  acct['last_touch'] = lp_get_gmt_timestamp();
  acct['autologin'] = 0;
  acct['never_autofill'] = 0;
  acct['realm_data'] = '';
  acct['fiid'] = '';
  acct['custom_js'] = '';
  acct['submit_id'] = '';
  acct['captcha_id'] = '';
  acct['urid'] = '0';
  acct['basic_auth'] = '0';
  acct['method'] = '';
  acct['action'] = '';
  acct['individualshare'] = false;
  acct['fields'] = new Array();
  return acct;
}

// if argument to this routine is just an object and not an array, 
// diddle it so that it becomes an array
//
// this is expected to be bg.g_site_data or acct, invoked during
//   a save from the site webpage.
//
function fix_fields(site)
{
  if (typeof(site.fields) != 'undefined' && typeof(site.fields.length) == 'undefined') {
    var fields = new Array();
    for (var i in site.fields) {
      // XXX there probably should be a if (site.fields.hasOwnProperty(i)) here.
      fields[fields.length] = site.fields[i];
    }
    site.fields = fields;
  }
  return site;
}

var g_console_log = "";
function truncatelog(){
  if(g_console_log.length > 20000){
    g_console_log = g_console_log.substring(g_console_log.length-20000);
  }
}

function console_log(s)
{
  if (g_isopera) {
    window.opera.postError(s);
  } else {
    console.log(s);
    if(g_issafari){
      truncatelog();
      g_console_log += (s + "\n");
    }
  }
}

function console_warn(s)
{
  if (g_isopera) {
    window.opera.postError(s);
  } else {
    console.warn(s);
  }
}

function console_error(s)
{
  if (g_isopera) {
    window.opera.postError(s);
  } else {
    console.error(s);

    if(g_issafari){
      truncatelog();
      g_console_log += (s+"\n");
    }
  }
}

function dispatch_message(messagetype, data)
{
  if (g_issafari) {
    // case: triggered on a safari plugin reload, when the unique 
    // runtime-assigned url to the vault changes, resulting in an
    // open vault window becoming invalidated?
    //
    if (typeof(safari.self) != 'undefined' || typeof(safari.self.tab) != 'undefined') {
      if (typeof(safari.self.tab.dispatchMessage) != 'undefined') {
        safari.self.tab.dispatchMessage(messagetype, data);
      }
    }

  } else if (g_isopera) {
    data.messagetype = messagetype;
    opera.extension.postMessage(data);
  } else if (g_ismaxthon) {
    data.messagetype = messagetype;
    data.pageid = g_pageid;
    window.external.mxGetRuntime().post('lpbackground', data);
  }
}

function get_key_iterations(u){

  var hash = SHA256(u);
  var key = hash+"_key_iter";
  if(typeof(localStorage)!='undefined' && localStorage.getItem(key)!=null){
    return localStorage.getItem(key);
  }
  
  //Local iterations value not found. For iterations=1, the value wouldn't
  //be written and we could potentially lock people out if they are offline
  //and we now default to 500.
  //
  //Data is stored in db, which can only be accessed asynchronously, so
  //key off of last touch data instead
  if(typeof(localStorage)!='undefined' && (localStorage.getItem(hash+"_lt.cac")!=null || localStorage.getItem(hash+".savedtree")!=null)){
    localStorage.setItem(hash+"_key_iter", 1);
    return 1;
  }

  var val = DEFAULT_KEY_ITERATIONS;
//  localStorage.setItem(key, val);
  return val;
}

function ofja(s)
{
  //DO NOT REVERSE THIS!!!
  return ofa(es(s));
}

function ofa(s)
{
  s = s.toString();
  var len = s.length;
  var s2 = "";
  var c = 0;
  var i;
  for (i=0 ; i<len ; ++i)
  {
    c = s.charCodeAt(i);
    // ascii 48 is 0, 57 is 9, 65 is A, 90 is Z
    // 97 is a, 122 is z
    // so if a character is not [0-9a-zA-Z], replace
    // it with it's HTML entity code
    if (c<48 || (c>57 && c<65) || (c>90 && c<97) || (c>122 && c<256))
    {
      c = c.toString(16);
      if (c.length!=2)
        c = "0"+c;
      s2 += "&#x"+c+";";
    }
    else
      s2 += s.charAt(i);
  }
  return s2;
}

function of(s, doc)
{
  if(typeof(doc)=='undefined')
    doc = document;

   var div = doc.createElement('div');
   var text = doc.createTextNode(s);
   div.appendChild(text);
   return div.innerHTML; // SHOULD WE INSTEAD BE USING .textContent? -- see js/xss.js
}

//
// given a variable typed arg
// arg can be a string or arg is an object of acct data [presumed]
//
// return true if this smells like lastpass app data.
// return false if not.
//
function is_application(record)
{
  if (typeof(record) == 'string') {
    return record.indexOf('app') == 0;
  } else {
    return record && typeof(record.appaid) != 'undefined';
  }
}

function get_appaid(id)
{
  if (id.indexOf('app') == 0) {
    return id.substring(3);
  } else {
    return id;
  }
}

function get_record_id(record)
{
  if (is_application(record)) {
    return 'app' + record.appaid;
  } else {
    return record.aid;
  }
}

function get_record(id)
{
  if (is_application(id)) {
    return get_application(id);
  } else if (typeof(g_sites) != 'undefined' && typeof(g_sites[id]) != 'undefined') {
    return g_sites[id];
  } else if (typeof(g_securenotes) != 'undefined' && typeof(g_securenotes[id]) != 'undefined') {
    return g_securenotes[id];
  } else if (typeof(getBG().g_sites[id]) != 'undefined') {
    return getBG().g_sites[id];
  } else if (typeof(getBG().g_securenotes[id]) != 'undefined') {
    return getBG().g_securenotes[id];
  } else {
    return null;
  }
}

function get_application(id)
{
  if (is_application(id)) {
    id = get_appaid(id);
  }
  if (typeof(g_applications) != 'undefined' && typeof(g_applications[id]) != 'undefined') {
    return g_applications[id];
  } else {
    return getBG().g_applications[id];
  }
}

// used in omnibox and home.html to get results from a search string.
function search_results(val, searchinnotes){
  var results = new Array();

  for(var aid in getBG().g_sites){
    if (!getBG().check_ident_aid(aid)) {
      continue;
    }
    var acct = getBG().g_sites[aid];
    if(acct.url == 'http://group')
      continue;

    if(acct.url.toLowerCase().indexOf(val)!=-1 || acct.name.toLowerCase().indexOf(val)!=-1 || acct.group.toLowerCase().indexOf(val) != -1 || acct.unencryptedUsername.toLowerCase().indexOf(val) !=-1){
      results[results.length] = acct;
    }
    else if (searchinnotes && acct.extra.length>0 && acct.url!="http://group")
    {
      var sn = getBG().lpmdec_acct(acct.extra,true, acct, getBG().g_shares);
      //if (sn=="")
      //  console_error("Failed to decrypt note A");
      if (sn.toLowerCase().indexOf(val)!=-1)
        results[results.length] = acct;
    }

  }
  for(var aid in getBG().g_securenotes){
    if (!getBG().check_ident_aid(aid)) {
      continue;
    }
    var acct = getBG().g_securenotes[aid];

    if(acct.name.toLowerCase().indexOf(val)!=-1 || acct.group.toLowerCase().indexOf(val) != -1){
      results[results.length] = acct;
    }
    else if (searchinnotes && acct.extra.length>0 && acct.url!="http://group")
    {
      var sn = getBG().lpmdec_acct(acct.extra,true, acct, getBG().g_shares);
      //if (sn=="")
      //  console_error("Failed to decrypt note A");
      if (sn.toLowerCase().indexOf(val)!=-1)
        results[results.length] = acct;
    }
  }
  for(var aid in getBG().g_applications){
    if (!getBG().check_ident_appaid(aid)) {
      continue;
    }
    var acct = getBG().g_applications[aid];

    if(acct.appname.toLowerCase().indexOf(val)!=-1 || acct.name.toLowerCase().indexOf(val)!=-1 || acct.group.toLowerCase().indexOf(val) != -1 || getusernamefromacct(acct).toLowerCase().indexOf(val) !=-1){
      results[results.length] = acct;
    }
    else if (searchinnotes && acct.extra.length>0 && (typeof(acct.url)=="undefined" || acct.url!="http://group"))
    {
      var sn = getBG().lpmdec_acct(acct.extra,true, acct, getBG().g_shares);
      //if (sn=="")
      //  console_error("Failed to decrypt note A");
      if (sn.toLowerCase().indexOf(val)!=-1)
        results[results.length] = acct;
    }

  }
  return results;
}

//--------------------------------------------
//Functions needed to use comm.js
function mostRecent(){
  return window;
}
function currentWindow(){
  return window;
}
function en(a){
  return encodeURIComponent(a);
}
function lpprefsHasUserValue(name, def){
  return def;
}
function lpprefsGetBoolPref(name, def){
  return def;
}
function lpprefsGetIntPref(name, def){
  return def;
}
function lpGetAccounts(){
  get_accts();
}

//takes unix timestamps
function elapsedTime (createdAt)
{
  if(typeof(createdAt) == 'undefined' || createdAt < 31536000)
    return gs('Never');
  var ageInSeconds = lp_get_gmt_timestamp() - createdAt;
  //(new Date().getTime() - new Date(createdAt*1000).getTime()) / 1000;
  var s = function(n) { return n == 1 ? '' : 's' };

  if (ageInSeconds < 0) {
    return gs('just now');
  }

  if (ageInSeconds < 60) {
    var n = ageInSeconds;
    return n + ' ' + (n==1 ? gs('second') : gs('seconds')) + ' ' + gs('ago');
  }

  if (ageInSeconds < 60 * 60) {
    var n = Math.floor(ageInSeconds/60);
    return n + ' ' + (n==1 ? gs('minute') : gs('minutes')) + ' ' + gs('ago');
  }

  if (ageInSeconds < 60 * 60 * 24) {
    var n = Math.floor(ageInSeconds/60/60);
    return n + ' ' + (n==1 ? gs('hour') : gs('hours')) + ' ' + gs('ago');
  }

  if (ageInSeconds < 60 * 60 * 24 * 7) {
    var n = Math.floor(ageInSeconds/60/60/24);
    return n + ' ' + (n==1 ? gs('day') : gs('days')) + ' ' + gs('ago');
  }

  if (ageInSeconds < 60 * 60 * 24 * 31) {
    var n = Math.floor(ageInSeconds/60/60/24/7);
    return n + ' ' + (n==1 ? gs('week') : gs('weeks')) + ' ' + gs('ago');
  }

  if (ageInSeconds < 60 * 60 * 24 * 365) {
    var n = Math.floor(ageInSeconds/60/60/24/31);
    return n + ' ' + (n==1 ? gs('month') : gs('months')) + ' ' + gs('ago');
  }

  var n = Math.floor(ageInSeconds/60/60/24/365);
  return n + ' ' + (n==1 ? gs('year') : gs('years')) + ' ' + gs('ago');
}

function is_opera_12()
{
  try {
    if (g_isopera) {
      var matches = navigator.userAgent.match(/ Version\/([0-9.]+)/);
      if (matches && parseFloat(matches[1]) >= 12) {
        return true;
      }
    }
  } catch (e) {
  }
  return false;
}

function is_opera_chromium()
{
  if (typeof(g_isoperachromium) == 'undefined') {
    g_isoperachromium = g_ischrome && navigator.userAgent.indexOf(' OPR\/') != -1;
  }

  return g_isoperachromium;
}

function window_close(page)
{
  if (is_opera_12()) {
    getBG().closecurrenttab(page);
  } else {
    window.close();
  }
}

var dbgts  = (new Date()).getTime();
function lpdbg(type,string){
  if (typeof(g_isdebug) != 'undefined' && g_isdebug) {
    console_log(Math.floor(((new Date()).getTime()-dbgts)/1000)+" : "+type+" : "+string);
  }
}

function lplog(s){
  console_log(s);
}

function convert_object_to_array(o)
{
  var a = new Array();
  for (var i in o) {
    a[a.length] = o[i];
  }
  return a;
}

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return '';
    }

function addattachcb(result){
  var attachname = result ? g_attachname : getBG().g_attachname;
  var attachbytes = result ? g_attachbytes : getBG().g_attachbytes;
  if (result) {
    g_attachname = g_attachbytes = '';
  } else {
    getBG().g_attachname = getBG().g_attachbytes = '';
  }

  if(attachbytes==null || attachbytes.length==0)
    return;

  var type = get_mimetype_from_filename(attachname);

  var validret = check_filename_badchars(attachname);
  if (validret == FILENAME_FRAGMENT_BAD_SHELL_CHARS) {
    alert(gs('Suspicious characters found in selected filename, will not process it'));
    return;
  } else if (validret == FILENAME_FRAGMENT_BAD_CONTROL_CHARS) {
    alert(gs('Control characters found in selected filename, will not process it'));
    return;
  }

  if (result) {
    result.mimetype = type;
    result.bytes = attachbytes;
    return;
  }

  var id = createAttachId();

  attaches[attachnum] = { id: id, mimetype:type, bytes:attachbytes };

  addThumbnail(attachnum, type, attachbytes, attachname);
}

////////////////////////////////////////////////////////
// copy bits from background.js:moveIntoSharedFolder() to perform the onlycheck() function
// w/o calling out to the background.  uses the same params as bg.moveIntoSharedFolder
// for simplicity.
//
// come up with something more elegant once this is tested to work well.
//
// is only needed/used by safari/opera
//
// return true if the identified resources can move into the shared folder
// return false if the identified resources can't, or the user refuses to do so
function checkMoveIntoSharedFolder(shareinfo, shareinfoorig, aids, aidsnewgrps, copy, onlycheck, skipcheck){

  var same = typeof(shareinfo)=='object' && typeof(shareinfoorig)=='object' && shareinfo.id==shareinfoorig.id;
  if (!skipcheck && !same) {
    var confirmmsg = gs('You are moving sites to a shared folder. This will potentially make them available to others.\n\nAre you sure you would like to continue?');

    if(typeof(shareinfo)=='undefined' || !shareinfo)
      confirmmsg = gs('You are moving sites from a shared folder into your general vault. This will potentially make them unavailable to others.\n\n Do you want to continue?');
    else if(typeof(shareinfoorig)!='undefined' && shareinfoorig)
      confirmmsg = gs('You are moving sites to a different shared folder. This may change who has access to the sites.\n\n Do you want to continue?');
    if(!confirm(confirmmsg)){
      return false;
    }
  }

  for(var i in aids) {
    if(!aids.hasOwnProperty(i)) continue;

    //var acct = getacct(aids[i]);
    var acct = get_record(aids[i]);
    var skipdel = false;
    if (acct == null) {
        // occurring if problems with the confirm
        alert(gs('Error: This folder has already been moved?'));
        return false;
    }

    if(typeof(acct.individualshare) != 'undefined' && acct.individualshare) {
      if (acct.sharedfromaid!=null && acct.sharedfromaid!="" && acct.sharedfromaid!="0") {
        alert(gs('You cannot move individually shared sites into a shared folder.'));
        return false;
      }
      if(copy || skipcheck){
        skipdel = true;
      }else{
        var confirmmsg = gs('A site that has been previously shared cannot be moved to a shared folder.\n\nWould you like to make a copy?');
        if(!confirm(confirmmsg)){
          return false;
        }else{
          skipdel = true;
        }
      }
    }
  } // foreach aids

  return true;
}

function get_saved_logins(callback)
{
  getBG().g_db_transaction_tested = getBG().g_db_transaction_worked = false;
  var db = opendb();

  if (!db) db = opendb();  // one more try.

  createSavedLoginsTable(db);
  if (db) {
    db.transaction(function(tx) {
      getBG().g_db_transaction_tested = getBG().g_db_transaction_worked = true;
      tx.executeSql('SELECT * FROM LastPassSavedLogins2 order by last_login desc', [],
      function(tx, rs) {
        var rows = new Array();
        for (var i = 0; i < rs.rows.length; i++) {
          rows[i] = {username: rs.rows.item(i).username, password: rs.rows.item(i).password};
          rows[i]['protected'] = rs.rows.item(i)['protected'];
        }
        callback(rows);
      },
      function(tx, error) {
        console_log(error);
      });
    });
  }
}

function delete_saved_login(username)
{
  var db = opendb();
  createSavedLoginsTable(db);
  if(db){
    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM LastPassSavedLogins2 WHERE username=?', [username]);
    }, function(tx, rs){}, function(tx, error){console_log(error)});
  }
}

function redirect_to_url(url)
{
  if (g_ismaxthon) {
    getBG().openURL(getchromeurl(url));
    setTimeout(function() { window.close(); }, 50);
  } else {
    document.location.href = url;
  }
}


function show_password_meter(width)
{
  document.writeln('<div id="page_passwordmeterback" style="text-align:left;height:10px;border:1px solid #B5B8C8;width:' + width + 'px;background-image:url(images/passwordmeter_back.gif);margin-top:3px;">');
  document.writeln('<div id="page_passwordmeterfront" style="background-image:url(images/passwordmeter_front.gif);height:10px;width:50px;line-height:1px;font-size:1px;">');
  document.writeln('</div>');
  document.writeln('</div>');
}

function update_password_meter(u, p, doc)
{
  if(!doc)
    doc = document;

  var pwfunc = typeof(getpasswordstrength)=='function' ? getpasswordstrength : LP.getpasswordstrength;
  var strength = pwfunc(u,p);
  update_password_meter_manual(strength, doc);
}

function update_password_meter_manual(strength, doc)
{
  var maxwidth = parseInt(doc.getElementById('page_passwordmeterback').style.width);
  var w = Math.round(strength*maxwidth/100) + 'px';
  doc.getElementById('page_passwordmeterfront').style.width = w;
}

this.getpasswordstrength = function(u,p)
{
  var strength = 0;

  // username
  if (u == '' && p == '') {
    return 0;
  }
  if (p==u)
    return 1;
  if (u!="" && u.indexOf(p)!=-1)
    strength -= 15;
  if (u!="" && p.indexOf(u)!=-1)
    strength -= u.length;
  
  // length
  strength += p.length;
  if (p.length>0 && p.length<=4)
    strength += p.length;
  else if (p.length>=5 && p.length<=7)
    strength += 6;
  else if (p.length>=8 && p.length<=15)
    strength += 12;
  else if (p.length>=16)
    strength += 18;
  
  // normal char (>=1 lower?, >=1 upper?)
  if (p.match(/[a-z]/))
    strength += 1;
  if (p.match(/[A-Z]/))
    strength += 5;
    
  // numbers (>=1 ? >=3?)
  if (p.match(/\d/))
    strength += 5;
  if (p.match(/.*\d.*\d.*\d/))
    strength += 5;
  
  // special char (>=1? >=2?)
  if (p.match(/[!,@,#,$,%,^,&,*,?,_,~]/))
    strength += 5;
  if (p.match(/.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~]/))
    strength += 5;
  
  // upper and lower
  if (p.match(/(?=.*[a-z])(?=.*[A-Z])/))
    strength += 2;
    
  // letters and numbers
  if (p.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/))
    strength += 2;
    
  // letters, numbers, and special characters
  if (p.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!,@,#,$,%,^,&,*,?,_,~])/))
    strength += 2;
    
  // number of different characters
  var n   = [];
  var num = 0;
  var i,c;
  for (i=0 ; i<p.length ; ++i)
  {
    c = p.charAt(i);
    if (typeof(n[c])=="undefined")
    {
      n[c] = 1;
      ++num;
    }
  }
  if (num==1)
    return 2;

  // normalize
  strength *= 2;
  if (strength<0)
    strength = 0;
  else if (strength>100)
    strength = 100;
  
  return strength;
}


// ------------------------------------------------------------------------------------------------------------ 
// ONLY EDIT THIS AS onload.js -- onloadwff.js is copied into place
// Content script:
// - runs in the context of loaded web page
// - runs once per tab
// - "isolated world" => content script can't access JavaScript variables or functions created by the web page
// - "isolated world" => web page can't access JavaScript variables or functions in the content script
// ------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------
// Globals
// ------------------------------------------------------------------------------------------------------------
var g_port    = null;
var g_foundmanual = false;
var LP_last_form = null;
var g_docnum = null;
var lpsavedform = null;
var lpsavedformfields = new Array();
var lpsharedpasswordfills = new Array();
var g_fillaid = null;   // this is set when fill MSG has been received from BG to 
                        // populate an input field on this page.
var g_setup_hotkey_handler = false;
var curr_notification_type = '';
var lpgenpassforms = new Array();
var lpgenpasscurrentpwfields = new Array();
var g_sites = new Array();
var g_formfills = new Array();
var g_ischrome = typeof(chrome) != 'undefined' && typeof(chrome.extension) != 'undefined';
var g_issafari = typeof(safari) != 'undefined' && typeof(safari.self) != 'undefined';
var g_isopera = typeof(opera) != 'undefined' && typeof(opera.extension) != 'undefined';
var g_ismaxthon = typeof(window) != 'undefined' && typeof(window.external) != 'undefined' && typeof(window.external.mxGetRuntime) != 'undefined';
var g_isfirefox = false; //used by shared code
var g_menuopen = false;
var experimentaloverlay = g_ischrome || g_issafari;
var urlprefix = null;
var disable_check_form_fill = !experimentaloverlay;
var g_mouseX = 0, g_mouseY = 0;
var g_initiallysetupff = false;

var g_notificationmax = 200;
var g_notificationmin = 27;
var g_contextheight = 190;
var g_contextwidth = 230;
var g_iframerand = "";
var g_contextrand = "";
var g_last_launch = new Array();

var do_experimental_popupfill = false;  // set by setprefs


var g_isloggedin = false;

// magic string, change to use iframerand?
var MAGIC="__lpform_";
var MAGICIFRAME="lpformframe";
     // make this object 2 level - 1st level is form id, 
     // 2nd level is one of these keys
     // is_nonlogin     (chk_form_has_password)
     // is_login        (chk_form_is_nonlogin_form)
     // ask_generate    (chk_form_ask_generate) 
     // a given form can have more than one of these attributes be set and true
var verbose=false;
// debug
//verbose=true;
var g_frame_css_str = "";   // try to deal with websites that have CSS rules that
                            // want to override what is set below.


var ELLIPSIS_CODE="&#133;";  // HTML Code for '...'

// ------------------------------------------------------------------------------------------------------------
// Initialization
// ------------------------------------------------------------------------------------------------------------

function message_handler(event)
{
  if (g_issafari) {

    // Safari 6.1  
    // https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/MessagesandProxies/MessagesandProxies.html#//apple_ref/doc/uid/TP40009977-CH14-SW12
    // ignore if document.hidden == set and true ?
    // document.addEventHandler('visibilitychange', function() { } 

    if (event.name == 'message') {
      receiveBG(event.message);
    }
  } else if (g_isopera) {
    if (event.data.messagetype == 'message') {
      receiveBG(event.data);
    }
  } else if (g_ismaxthon) {
    receiveBG(event);
  }
}

function send_focus()
{
  if (g_issafari) {
    safari.self.tab.dispatchMessage('focus', {url:punycode.URLToASCII(document.location.href)});
  } else if (g_isopera) {
    opera.extension.postMessage({messagetype:'focus', url:punycode.URLToASCII(document.location.href)});
  } else if (g_ismaxthon) {
    window.external.mxGetRuntime().post('lpbackground', {pageid: g_pageid, messagetype:'focus', url:punycode.URLToASCII(document.location.href), topurl:lpgettopurl()});
  }
}

function onLoad()
{
  //L("CS : loaded : url="+punycode.URLToASCII(document.location.href));

  //When creating the connection, pass the url to the background in the name field (our only choice)
  //so it can determine (to the best of our ability) if this is a top level navigation.
  // CS <-> BG
  if (g_ischrome) {
    g_port = chrome.extension.connect({name:punycode.URLToASCII(document.location.href)});
    g_port.onMessage.addListener(receiveBG);
    g_port.onDisconnect.addListener(function(portarg) {receiveBG(null,portarg,1);});
 

  } else if (g_issafari) {
    safari.self.addEventListener('message', message_handler, false);
    g_docnum = Math.floor(Math.random() * 100000000);
    //safari.self.tab.dispatchMessage('connect', {name:punycode.URLToASCII(document.location.href), docnum:g_docnum, top:window==lpgettop()});
    // wait a little to give the background script a chance to register it's message listener.
    setTimeout(function(){ safari.self.tab.dispatchMessage('connect', {name:punycode.URLToASCII(document.location.href), docnum:g_docnum, top:window==lpgettop()}); }, 150); 

    if (window == lpgettop()) {
      send_focus();
      window.addEventListener('focus', function(event) { send_focus(); }, false);
    }


  } else if (g_isopera) {
    opera.extension.onmessage = message_handler;
    g_docnum = Math.floor(Math.random() * 100000000);
    opera.extension.postMessage({messagetype:'connect', name:punycode.URLToASCII(document.location.href), docnum:g_docnum, topurl:lpgettopurl()});
  } else if (g_ismaxthon) {
    window.external.mxGetRuntime().listen(g_pageid, message_handler);
    g_docnum = g_pageid;
    window.external.mxGetRuntime().post('lpbackground', {pageid: g_pageid, messagetype:'connect', name:punycode.URLToASCII(document.location.href), docnum:g_docnum, topurl:lpgettopurl()});
  }    
}


var g_lp_hotkeys = new Array('generateHk', 'recheckHk', 'searchHk', 'nextHk', 'prevHk', 'homeHk', 'submitHk', 'saveallHk', 'logoffHk', 'defaultffidHk', 'openpopoverHk');
var g_hotkey_data = new Array();
function handle_hotkey(event)
{
  var keycode = event.keyCode != 0 ? event.keyCode : event.charCode;
  if (keycode < 32) {
    return;
  }

  var modifiers = "";
  modifiers += (event.ctrlKey ? "control" : "");
  modifiers += (event.metaKey ? (modifiers!="" ? " " :"") + "meta" : "");
  modifiers += (event.altKey ? (modifiers!="" ? " " :"") + "alt" : "");
  modifiers += (event.shiftKey ? (modifiers!="" ? " " :"") + "shift" : "");
  if (modifiers == '' || modifiers == 'shift') {
    return;
  }

  var hotkeys = new Array();
  for (var i = 0; i < g_lp_hotkeys.length; i++) {
    var id = g_lp_hotkeys[i];
    if (g_hotkey_data[id + 'KeyCode'] == keycode && g_hotkey_data[id + 'Mods'] == modifiers) {
      sendBG({cmd:'runhotkey', hotkey:id});
      break;
    }
  }
}

// ------------------------------------------------------------------------------------------------------------
// CS <-> BG
// ------------------------------------------------------------------------------------------------------------

function disconnectBG()
{
  // BG will be notified in its onDisconnect function
  if (g_port)
  {
    //L("CS -> BG : DISCONNECT");
    g_port.disconnect();
    g_port = null;
  }
}

function sendBG(data)
{
  if (verbose) {
    L("CS["+g_docnum+"] -> BG : cmd="+data["cmd"]);
  }
  data['docnum'] = g_docnum;

  if (g_ischrome) {
    if (!g_port)
    {
      if (data['cmd'] != 'rebuildcontext') {
        L("CS -> BG : FAILED " + data['cmd']);
      }
      return;
    }

    g_port.postMessage(data);
  } else if (g_issafari) {
    safari.self.tab.dispatchMessage('message', data);
  } else if (g_isopera) {
    data.messagetype = 'message';
    data.topurl = lpgettopurl();
    opera.extension.postMessage(data);
  } else if (g_ismaxthon) {
    data.pageid = g_pageid;
    data.messagetype = 'message';
    data.topurl = lpgettopurl();
    window.external.mxGetRuntime().post('lpbackground', data);
  }
}

var g_form = null;
var g_fillreqdocs = new Array();
function receiveBG(data,port,disconnect)
{
  if ((g_issafari || g_isopera || g_ismaxthon) && typeof(data['docnum']) != 'undefined' && data['docnum'] != g_docnum) {
    return;
  }

  if (disconnect)
  {
    L("BG -> CS : DISCONNECT");
    g_port = null;
    return;
  }

  if (typeof(data["cmd"])=="undefined")
  {
    L("BG -> CS : INVALIDMSG");
    return;
  }

  if (verbose) {
    if (data['cmd'] != 'gotpopupfillinput' &&
        data['cmd'] != 'popupfilliconnumber') {  // too many log msgs without this filter
      L("BG -> CS ["+g_docnum+"]: "+data['cmd']);   // DEBUG
    }
  }
  
  urlprefix = data["urlprefix"];

  switch (data["cmd"])
  {
    // Test message from BG
    //case "test":
    //  L("BG -> CS : Received Test Message");
    //  break;

    case 'setdocnum':
      g_docnum = data['docnum'];

      if (verbose) {
        L('setdocnum to '+g_docnum+ ' for ' + document.baseURI);  // DEBUG
      }

      if(typeof(data['ff'])!='undefined'){
        setupffoverrides(data);
        g_initiallysetupff = true;
      }
      if (g_issafari || g_isopera) {
        eval(data['language_data']);
      } else if (g_ismaxthon) {
        include_language(data['g_language']);
      }
      sendBG({cmd:'rebuildcontextonload',url:punycode.URLToASCII(document.location.href)});
      sendBG({cmd:'getprefs', url: punycode.URLToASCII(document.location.href), username_val: get_username_val(document)});
      evalScriptsInFrame(window, document);
      break;
      
    case "rsadecrypt":
      //alert("inside onload.js : rsadecrypt case");
      //lplog("SK onload : A rc="+data['rc']+" sharekeyhex="+data['sharekeyhex']);
      g_form.eventtype.value  = data['rc'];
      g_form.eventdata4.value = data['sharekeyhex'];
      break;

    case "rsaencryptmultiple":
      //alert("inside onload.js : rsaencryptmultiple case");
      //lplog("SK onload : A rc="+data['rc']+" dataout="+data['dataout']);
      g_form.eventtype.value  = data['rc'];
      g_form.eventdata4.value = data['dataout'];
      break;
  
    case "ipcgotdata":
      if(g_ipctarget){
        g_ipctarget.setAttribute('msg', 'gotdata');
        g_ipctarget.setAttribute('g_username', data['username']);
        g_ipctarget.setAttribute('g_local_key', atob(data['key']));
        g_ipctarget.setAttribute('g_key_iterations', data['iterations']);
        var listener = g_ipctarget.ownerDocument.createEvent("HTMLEvents");
        listener.initEvent("message", true, false);
        g_ipctarget.dispatchEvent(listener);
      }
      break;

    case "plug2web":
      g_form.eventdata1.value = data['username'];
      g_form.eventdata2.value = data['key'];
      g_form.eventdata3.value = data['version'];
      g_form.eventdata4.value = data['identity'];
      g_form.eventdata5.value = data['hash'];

      //Bad hack. Cannot figure out another way to hook our forms
      //after the xhr request...weird stuff happens, but this seems to work.
      setTimeout(function(){evaluntilfindmanual()}, 500);
      break;

    case "getversion":
      g_form.eventdata1.value = data['version'];
      g_form.eventdata2.value = data['builddate'];
      g_form.eventdata3.value = data['versionpre'];
      g_form.eventdata4.value = "cr";
      break;

    case "getdebuginfo":
      g_form.eventdata1.value = data['info'];
      break;

    case "savesiteicon":
      dosavesiteicon();
      break;

    case "savesiteiframe":
      dosavesiteicon(1);
      break;
     
    case "savesiteinfo":
      //This is only useful in the iframe
      if(document.getElementById('lptabpopupsave') && g_currenttab=='savesite'){
console.error("GOT IT!!!!");
      }
      break;

    case 'fillfield':
      fillfield(data);
      break;
      
    case 'fillbest':
      fillbest(data);
      break;

    case 'run_custom_js':
      if (data['custom_js'] != '') {
        var doc = data['docid'] ? g_fillreqdocs[data['docid']] : document;
        var loc = data['loc']+''; //needs to be a string
        run_custom_js(doc, lpPrepareCustomJS(data['custom_js'], data['username'], data['password'], loc, data['onlyfill'], doc));
      }
      break;

    case 'submit':
      submit(data);
      break;

    case 'fillform':
      fillform(data);
      break;

    case 'clearforms':
      lpClearForms(null, document, 1, window);
      break;

    case 'saveall':
      saveall();
      break;

    case 'setprefs':
      lpdisableHighlightField=data['highlightFields']==0;
      lpwarninsecureforms=data['warninsecureforms'];
      lpdontfillautocompleteoff=data['dontfillautocompleteoff'];
      lpdonotoverwritefilledfields=data['donotoverwritefilledfields'];
      lpOfferGeneratePasswd = data['showGenerateNotifications'];
      lpShowFormFillNotifications = data['showFormFillNotifications'];
      lpNotificationsAfterClick = g_initiallysetupff ? data['showNotificationsAfterClick'] : 1;
      alwayschooseprofilecc = data['alwayschooseprofilecc'];
//      automaticallyFill = data['automaticallyFill'];
      var have_hotkey = false;
      for (var i = 0; i < g_lp_hotkeys.length; i++) {
        var id = g_lp_hotkeys[i];
        if (data[id + 'KeyCode'] != 0) {
          have_hotkey = true;
        }
        g_hotkey_data[id + 'KeyCode'] = data[id + 'KeyCode'];
        g_hotkey_data[id + 'Mods'] = data[id + 'Mods'];
      }
      if (have_hotkey && !g_setup_hotkey_handler) {
        g_setup_hotkey_handler = true;
        window.addEventListener('keydown', function(event) { handle_hotkey(event); }, false);
      }
      g_is_specialsite = typeof(data['specialsite'])!='undefined';
      if (g_is_specialsite) {
        verbose_log('specialsite TRUE');
      }

      do_experimental_popupfill = data['do_experimental_popupfill'];
      g_isloggedin = data['lploggedin'];
      if (typeof(data['nevers']) != 'undefined' && data['nevers'] != '') {
        g_nevers = LPJSON.parse(data['nevers']);
      }
      if(do_experimental_popupfill){
        setupIcons(document, typeof(data['specialsite'])!='undefined');

        // needed for a call to lpCheckCurrentPWField(), and
        // by looksLikeUsername().  these strings are found in fftranslation.js
        // but is not normally available to the CS
        // 
        // cut &paste first to see if it will work. 
        try {
          if (typeof(translations) == 'undefined') {
            translations = {};
          }
          if (typeof(translations['en-US']) == 'undefined') {
            translations['en-US'] = {};
          }
          translations['en-US']['ff_currpass_regexp'] = data['ff_currpass_regexp'];
          translations['en-US']['ff_username_regexp'] = data['ff_username_regexp'];
          translations['en-US']['ff_loginform_regexp'] = data['ff_loginform_regexp'];
          translations['en-US']['ff_email_regexp'] = data['ff_email_regexp'];

        } catch (e) {
        }
        
      }
      
      break;

    case 'setuuid':
      g_form.eventdata1.value = data['uuid'];
      break;

    case "recover":
      g_form.eventdata2.value = data['otp'];
      break;

    case "recheck":
      g_ctr_recheck++;
      evalScriptsInFrame(window, document, true);
      break;

    case 'loadurl':
      if (g_issafari) {
        // WTF? guessing that if bg.sendCS() picked a child frame in this tab
        // to send this message to, that setting document.location.href or
        // location.href just does not work.
        if (typeof(parent) != null && typeof(parent.document) != null ) {
          parent.document.location.href=data['url'];
        } else {
          document.location.href=data['url'];
        }
      } else {
        document.location.href = data['url'];
      }
      break;

    case 'clearfilledfields':
      clear_filled_fields(document, window);
      break;

    case 'setupmultifactor':
      g_form.eventdata3.value = data['result'];
      break;

    case 'setupsinglefactor':
      g_form.eventdata4.value = data['result'];
      break;

    case 'checkmultifactorsupport':
      g_form.eventdata4.value = data['type'];
      g_form.eventdata3.value = data['result'];
      break;

    case 'verifymultifactor':
      g_form.eventdata3.value = data['eventdata3'];
      g_form.eventdata2.value = data['eventdata2'];
      break;

    case 'multifactorauth':
      g_form.eventdata5.value = data['multifactorresponse'];
      g_form.eventdata3.value = data['result'];
      break;

    case 'multifactorreprompt':
      g_form.eventdata3.value = data['result'];
      break;

    case 'showfillnotification':
      // detach so the icon job can continue to run.
      if(do_experimental_popupfill){
        setTimeout(function() { lpshownotification('fill', data); }, 0) ;
      } else {
        lpshownotification('fill', data);
      }
      break;

    case 'showaddnotification':
      // detach so the icon job can continue to run.
      if(do_experimental_popupfill){
        setTimeout(function() { lpshownotification('add', data); }, 0 );
      } else {
        lpshownotification('add', data);
      }
      break;

    case 'showchangenotification':
      if(do_experimental_popupfill){
        setTimeout(function() { lpshownotification('change', data); }, 0 );
      } else {
        lpshownotification('change', data);
      }
      break;

    case 'showerrornotification':
      if(do_experimental_popupfill){
        setTimeout(function() { lpshownotification('error', data); }, 0 );
      } else {
        lpshownotification('error', data);
      }
      break;

    case 'showbasicauthnotification':
      if(do_experimental_popupfill){
        setTimeout(function() { lpshownotification('basicauth', data); }, 0 );
      } else {
        lpshownotification('basicauth', data);
      }
      break;

    case 'closenotification':
      lpclosenotification(data.includeerror, data.excludeother);

      break;

    case 'checkgenpwfillforms':
      checkgenpwfillforms(data);
      break;

    case 'fillcurrent':
      fillcurrent(data);
      break;

    case 'showoverlay':
      showoverlay(data);
      break;

    case 'slidedownoverlay':
      slidedownoverlay(data);
      break;

    case 'slideupoverlay':
      slideupoverlay(data);
      break;

    case 'hideoverlay':
      hideoverlay(data);
      break;

    case 'hidecontext':
      hidecontext();
      break;

    case 'checkgeneratepassword':
      if (lpCheckGeneratePassword(null, document, true, window)) {
        sendBG({cmd: 'generatepasswordfound'});
      }
      break;

    case 'populategeneratedpassword':
      try {
        if (typeof(translations) == 'undefined') {
          translations = {};
        }
        if (typeof(translations['en-US']) == 'undefined') {
          translations['en-US'] = {};
        }
        translations['en-US']['ff_currpass_regexp'] = data['ff_currpass_regexp'];
      } catch (e) {
      }

    
      g_do_pwgen=true;   // to negate the password field focus inside populategeneratedpassword()
      if (data['url'] == punycode.URLToASCII(document.location.href)) {
        populategeneratedpassword(data['url'], data['password'], data['nofill']);
      }
      g_do_pwgen=false;
      break;

    case 'gotnotificationdata':
      //if(punycode.URLToASCII(document.location.href).indexOf('overlay.html') > 0){
      //  document.body.innerHTML = data['html'];
      //}
      break;

    case 'gotimportdata':
      document.getElementById('source').value = data.source;
      document.getElementById('t').value = data.data;
      document.getElementById('b64').value = '1';
      document.getElementById('utf8').value = '1';
      document.getElementById('encryptandstore').click();
      break;

    case 'showcontext':
      if (window == lpgettop()) {
        // need a detach here?
        lpshownotification('context', data);
      }
      break;

    case 'canattach':
      g_form.eventdata2.value = 'canopensaveattach';
      g_form.eventdata1.value = 'canattach';
      break;

    case 'gotattach':
      g_form.eventdata2.value = data.mimetype;
      g_form.eventdata3.value = data.bytes;
      g_form.eventdata4.value = data.encbytes;
      g_form.eventdata1.value = 'gotattach';
      break;

    case 'lpshownotification':
      if (window == lpgettop()) {
        // need a detach here?
        lpshownotification(data.type, data.data);
      }

    case 'gotpopupfilldata': // NEW
      // currently, no-op.  received after getpopupfilldata() msg is sent
      //
      if (do_experimental_popupfill) {
      }
      break;
    case 'gotpopupfillsites': // NEW
      // called from lphighlightField()
      // received after getpopupfillsites() msg is sent
      // returns data['sites'] and data['formfills']
      //
      if (do_experimental_popupfill ) { 
        if (typeof(data['sites'])!='undefined' || typeof(data['formfills'])!='undefined' ) {

          // now, this passes sites and formfill data, and returns html fragment
          // that contains 1 table for sites, and a 2nd for formfills
          var popupfillhtml = createPopupFill(document, data);
          var autofillsites = getAutoFillArray(document, LPJSON.parse(data['sites']), true);
          
        
          var formfills;
          if(g_formfills != null && getcount(g_formfills)>0) { 
            // favor previously set g_formfills 
            formfills = g_formfills;
          } else {
            if (typeof(data['formfills'])!='undefined' && data['formfills'] != '') {
              formfills = LPJSON.parse(data['formfills']);
              g_formfills = formfills;
            }
          }

            g_autofillsites = autofillsites;  // cache/save this - needed ?
            g_popupfill_rows= getcount(autofillsites);  // for popupfill_create_iframe
            g_popupfill_rows_FF = getcount(g_formfills);  // for popupfill_create_iframe
            if (verbose) {
              L('['+g_docnum+']g_popupfill_rows = '+g_popupfill_rows+' g_popupfill_rows_FF = '+g_popupfill_rows_FF);
            }
            // note: text is generated html output from createPopupFill()
            // url is current page (to be passed along to the iframe for context)
            // rowtype is set to 'sites', also passed to the iframe
            sendBG({cmd:"savepopupfillhtml", text:popupfillhtml, url: punycode.URLToASCII(document.location.href), rowtype : 'sites' });

        } else {
          // write once?  unsure if desirable
            g_popupfill_rows= 0;
            if (verbose) {
              L('['+g_docnum+']g_popupfill_rows = '+g_popupfill_rows);
            }
            popupfillhtml="";  // stub
            //sendBG({cmd:"savepopupfillhtml", text:popupfillhtml });
            sendBG({cmd:"savepopupfillhtml", text:popupfillhtml, url: punycode.URLToASCII(document.location.href), rowtype : 'sites' });

        }
      }

      break;
    case 'closepopupfills':  // NEW
      if (do_experimental_popupfill) { 
        closepopupfills(document);
      }
      break;
    case 'gotpopupfillforms': // NEW
      // folded into getpopupfillsites/gotpopupfillsites
      break;
    case 'gotisadmin':  // response from getisadmin CS->BG msg  
      g_isadmin = data['isadmin'];
      //g_isadmin = true;  // DEBUG
      break;
    case 'gotloggedin':  // response from getloggedin CS->BG msg. 
                         // maybe better to get a (heartbeat) cfg object

      // what is data type here ???
      if (data['lploggedin'] != g_isloggedin) {
        // login state has changed. what should be done ?
        // force a recheck ?  the
        //
        if (data['lploggedin']) {
          evalScriptsInFrame(window, document, true);
        } else {
          // this is likely redundant and-necessary as the BG process 
          // should issue messages to all CS's to do this.
          if (g_dologin_clickable) {
            closepopupfills(document);
          } else {
            destroy_clickables(document);
          }
        }
      }

      g_isloggedin = data['lploggedin'];
      break;

    case 'popupfillscreateack':
      if (g_popupfill_parent) {

        g_popupfill_parent.focus();  // GROSSSSSSSSS
                    // this focus was breaking the lpfieldfocus() logic,
                    // but if user clicks on the icon, the focus has
                    // to switch to the associated INPUT field to make sense.
      } else {
        // if this occurs, it is a race condition.
        //
        // you can trigger this by clicking on the clickable button as quickly as possible.
        // in this case, deliver an electric shock to the user.
        // barring that, drop
      }
      break;

    case 'gotpopupfillinput':
      // these go to the popup iframe associated with this tab.
      // this is an ACK from the BG for a 'popupfillinputget' MSG.
      // quietly accept and drop the ACK
      break;
    case 'gotnevers': // NEW
      if (do_experimental_popupfill) {
        g_nevers = LPJSON.parse(data['g_nevers']);
      }
      break;

    case 'closeclickables':  // NEW msg to detach from closenotifications
      if (do_experimental_popupfill) { 
        // data.force is string 'true' or 'false', enforced inside
        // background.js:closeclickables() and background.js:closeallclickables()
        var doforce = (data.force === "true" ? true : false );  // cast

        if ((g_dologin_clickable && doforce) || 
            !g_dologin_clickable ) {
          destroy_clickables(document);
        } else {
          closepopupfills(document);
        }
        sendBG({cmd:'getloggedin'}); // this refreshes g_isloggedin  XXX  I wonder if this is the best way
      }
      break;

    case 'popupfillresize':
      // given new sizes, pickup on next popupfill_resize
      g_minwidth_override =parseInt(data.width);
      g_minheight_override = parseInt(data.height);
      break;

    case 'popupfilliconnumber':
      if (g_do_icon_number_hint) {
        do_icon_number_hint (parseInt(data.sitenumber), parseInt(data.formfillsnumber)); 
      }
      break;
    case 'popupfillsaveok':
      if (g_show_save_success_msg) {
        do_save_site_success_msg(document);  // where should it be placed? rely on args?
      }
      break;

    case 'gotpopupfillsave':  
    case 'gotpopupfillgenerateprefs':  
       // no-op ; with safari, these msgs are sent to the popup iframe 
       // as well as the CS.  just quietly ignore it when received here.
       break;

    case 'iframescrollenable':
       if (g_iframe_scroll_hack) {
         if (typeof(data.href) != 'undefined') {
           enableScrollOnIframe(data.href);
         }
       }
       break;

    case 'iframebodyscrollenable':
       if (g_iframe_scroll_hack) {
         if (typeof(data.href) != 'undefined') {
           enableScrollWithinIframe();
         }
       }
       break;


    default:
      L("BG -> CS : INVALIDMSG");
      return;
      break;
  }  
}

function hidecontext(){
  if(g_contextrand!="" && document.getElementById('lpiframeoverlay' + g_contextrand)){
    document.body.removeChild(document.getElementById('lpiframeoverlay' + g_contextrand));
  }
}

//Click to hide menu. this gets triggered when the mouse
//is outside of the overlay popup, and always when the overlay is not
// used.
//
// case: website may intercept the click if it occurs in another element
//    such that the click event never bubbles down here.   bah
//    if the website hides INPUTs with css changes, the DOM Mutation 
//    observer will never be able to pick it up.  double bah.
//
document.addEventListener('click', function(event){

  if ((g_isopera || g_ismaxthon) && !experimentaloverlay) {
    if (!chk_should_close_exttable(event)) {
      // for certain HTML elements inside the extended tabular display,
      // the menu should not close.  This is the tabular header and
      // search box.  only necessary for Opera and Maxthon with autofill/autologin
      return;
    }
  }

  if(g_menuopen){
    slideupoverlay();
  }

  // NB: g_popupfill_shown could get out of sync if the BG->CS message
  // popupfillscreateack does not get delivered.  so ditch the unprotected
  // variable and iterate DOM to make sure.
  if (is_your_popup_showing(document)) {
    // any click closes all popup formfill iframe[s], if shown
    // click even inside the iframe should have been serviced within the iframe first,
    // and bubbled up here
    if (do_experimental_popupfill) {
      // case: click on input field; on focus, popup is created.
      // however, the click is immediately serviced afterwards, causing immediately
      // closure.  testing this disables clicking on input field to close popup,
      // which may also be desirable.
      if (g_popupfill_parent != event.target) {
        closepopupfills(document);
      }
    }
  } else {
    //checkShouldRecheck() ;  // if recheck is necessary, do it here

    // give browser & website 500ms to redraw before
    // checking inputs and determining whether to recheck the page.
    setTimeout(function() { checkShouldRecheck(); }, 500);  
  }


//
// quirksmode says: safari, FF on Mac, chrome does not fire focus/blur events for
// checkbox/radio button elements when using mouse

  hidecontext();
}, false);


// this is done in newvault.js now
/*var g_ipctarget = null;
document.addEventListener('frameipc', function(evt){
  var data = evt.target.getAttribute('data');
  if(data=='getdata'){
    g_ipctarget = evt.target;
    sendBG({cmd:'ipcgetdata',url:evt.target.ownerpunycode.URLToASCII(document.location.href)});
  }
}, false);*/

var g_scrollthread = null;
var g_scrolloffset = 0;
var g_animatethread = null;
function smoothScroll(){
  document.getElementById('lpiframeoverlay' + g_iframerand).style.visibility='hidden';
  g_scrolloffset = 30;
  if(g_scrollthread){
    clearTimeout(g_scrollthread);
    clearTimeout(g_animatethread);
  }
  g_scrollthread = setTimeout(function(){

    if(g_scrolloffset!=30){
      smoothScroll();
      return;
    }

    document.getElementById('lpiframeoverlay' + g_iframerand).style.visibility = 'visible';
    g_animatethread = setInterval(function(){
     document.getElementById('lpiframeoverlay' + g_iframerand).style.top = (document.body.scrollTop-g_scrolloffset) + "px";
     g_scrolloffset--;
     if(g_scrolloffset<=0)
       clearTimeout(g_animatethread);
     }, 1);

  }, 400);
}

if(g_ischrome){
  //Scroll handler
  document.addEventListener('scroll', function(event){
    //if (do_experimental_popupfill && g_iframe_scroll_hack) {
    //  if (is_your_popup_showing(document) && (window.self != window.top)) {
    //    event.stopPropagation();
    //    // if inside an iframe, try to not propagate the scroll down into the parent.
    //    // doesn't seem to help
    //    return false;
    //  }
    //}
    
    if(document.getElementById('lpiframeoverlay' + g_iframerand)){
      //document.getElementById('lpiframeoverlay' + g_iframerand).style.top = document.body.scrollTop + "px";
      smoothScroll();
    }
  }, false);

  window.addEventListener('focus', function() {
    sendBG({cmd:'rebuildcontext',url:punycode.URLToASCII(document.location.href)});

    // this bit is handy for debugging but way confusing otherwise
    //if (do_experimental_popupfill) {
    //  sendBG({cmd:'recheckpage'});
    //}  
  });
}

if (g_issafari) {
  document.addEventListener('mousemove', function(e){ 
    g_mouseX = e.pageX; 
    g_mouseY = e.pageY;
  }, false);
 
  document.addEventListener('contextmenu', function(e){ 
    hidecontext();
  }, false);
}

function overlayresize(e){
  if(document.getElementById('lpiframeoverlay' + g_iframerand)){
    //var w = window.innerWidth;   // now, measure it
    var w = getWindowWidth(window);
    document.getElementById('lpiframeoverlay' + g_iframerand).style.width = w + 'px';
    document.getElementById('lpiframe' + g_iframerand).style.width = w + 'px';
  }
}


function showoverlay(data, urlextra)
{
    var body = document.body;
    if(!body)
      return;

    var id = "";
    var w = h = t = l = 0;
    var iscontext = false;
    if(urlextra.indexOf("&context")!=0){
      id = g_iframerand = Math.floor(Math.random() * 100000000);
      //var w = window.innerWidth;   // now, measure it
      w = getWindowWidth(window);
      h = g_notificationmin;
      l = 0;
      t = document.body.scrollTop;

      //If we do not insert a spacer, the iframe will overlay
      //and potentially obscure page content
      //
      //The drawback of using a spacer is that it pushes the
      //page down, but absolutely positioned elements wont move 
      var topspacer = document.createElement('div');
      topspacer.id = 'lptopspacer' + g_iframerand;
      topspacer.style.height=g_notificationmin+'px';
      body.insertBefore(topspacer, body.firstChild);

      // if the window is being shrunk/grown,
      // shrink/grow the overlay to fit the window.
      window.addEventListener('resize', overlayresize, false);
    }else{
      iscontext = true;
      hidecontext();

      id = g_contextrand = Math.floor(Math.random() * 100000000);
      w = g_contextwidth;
      h = g_contextheight;
      t = g_mouseY;
      l = g_mouseX;

      //Adjust it so it doesn't show up off screen
      var screenw = window.innerWidth;
      var screenh = window.innerHeight + document.body.scrollTop;



      if(t + g_contextheight > screenh)
        t -= ((t + g_contextheight) - screenh + 10);
      if(l + g_contextwidth > screenw)
        l -= ((l + g_contextwidth) - screenw + 20);

    }


    //Put a small div on top. Was originally used for dragging
    //(but dragging has been removed until needed)
    var div = document.createElement('div');
    div.id = 'lpiframeoverlay' + id;
    div.style.top= t + 'px';
    div.style.left= l + 'px';
    div.style.height= '1px';
    div.style.width= w + 'px';
    div.style.position= 'absolute';
    div.style.backgroundColor= 'black';
    div.style.zIndex = '1000000099';
    

    //Compensate for body margins, may need to extend bar outwards
    //costco.com and instapaper are some good sites to test on if this changes
    var bodystyle = window.getComputedStyle(body, null);
    var bodywidth = parseInt(bodystyle.width) + parseInt(bodystyle.marginLeft) + parseInt(bodystyle.marginRight);
    var tld = lp_gettld_url(punycode.URLToASCII(document.location.href));
    if (tld == 'ing.nl' && !iscontext && bodywidth > w) {
      w = bodywidth;
    }

    if(bodystyle.position=='relative'){
      //We only want to do this if they are using margin:auto, which is tougher than
      //it should be to detect
      var rect = document.body.getBoundingClientRect();


      var offset = 0;
      if(tld != 'ing.nl' && bodywidth < w && rect.left > (parseInt(bodystyle['margin-left']) + parseInt(bodystyle['padding-left']) + parseInt(bodystyle['border-left-width']))){
        offset = ((w - bodywidth)/2);
      }else if(parseInt(bodystyle['margin-left']) > 0){
        offset = parseInt(bodystyle['margin-left']);
      }
      div.style.marginLeft = -1 * offset + "px";
    }


    body.appendChild(div);
   

    var iframe = document.createElement('iframe');
    iframe.id = 'lpiframe' + id;
    iframe.src = urlprefix + 'overlay.html?' + urlextra;
    iframe.style.height= h + 'px';
    iframe.style.width= w + 'px';
    iframe.style.border= '0px';
    iframe.scrolling='no'; // VVV
    div.appendChild(iframe);
}

function slidedownoverlay(data){
  var i = document.getElementById('lpiframe' + g_iframerand);
  if(!i) return;
  var h = parseInt(i.style.height);
  g_menuopen = true;
  if(h < g_notificationmax){
    var step = g_notificationmax - h > 10 ? 10 : g_notificationmax - h;
    i.style.height = (h + step) + "px"; 
    setTimeout(function(){ slidedownoverlay(data); }, 5);
  }
}

function slideupoverlay(data){

  var i = document.getElementById('lpiframe' + g_iframerand);
  if(!i) return;
  var h = parseInt(i.style.height);
  g_menuopen = false;
  if(h > g_notificationmin){
    var step = h - g_notificationmin > 10 ? 10 : h - g_notificationmin;
    i.style.height = (h - step) + "px"; 
    setTimeout(function(){ slideupoverlay(data); }, 5);
  }
}

function hideoverlay(data)
{
  if(document.getElementById('lpiframeoverlay' + g_iframerand)){
    document.body.removeChild(document.getElementById('lpiframeoverlay' + g_iframerand));
    document.body.removeChild(document.getElementById('lptopspacer' + g_iframerand));

    // next line: unused?
    //var w = window.innerWidth;
    window.removeEventListener('resize', overlayresize, false);
  }
}


//
// background:fillcurrent() called when fillcurrentaid event is received
// background:fillcurrent() called when CS->BG fillcurrentaid  msg is received
// background.js:fillcurrent() sends BG->CS fillcurrent msg , 
// called when BG->CS fillcurrent msg is received
function fillcurrent(data)
{
  if (typeof(lpgenpasscurrentpwfields[punycode.URLToASCII(document.location.href)]) != 'undefined' && lpgenpasscurrentpwfields[punycode.URLToASCII(document.location.href)]) {
    lpgenpasscurrentpwfields[punycode.URLToASCII(document.location.href)].value = data['password'];
  }
}

function setupffoverrides(data){

  if(typeof(g_ff)=='undefined' || g_ff==null){
    g_ff = data['ff'];
    if(typeof(g_ff)=='undefined' || g_ff==null){
      return;
    }

    var overrides = LPJSON.parse(g_ff);
    for(var i in overrides){
      if(overrides.hasOwnProperty(i)){
        for(var j in overrides[i]){
          if(overrides[i].hasOwnProperty(j) && j.indexOf('ff_')==0){
            lpgscache[i+j] = overrides[i][j];
          }
        } 
      }
    }
  }
}

//
// when CS->BG setdocnum is called to register a new tab with lastpass background
// the last step is to call evalScriptsInFrame().  
// when evalScriptsInFrame() is called, if document state is loaded or complete
//   then hookAllFormSubmits() is called on it.  XXX if not loaded, then 
//   evalScriptsInFrame is called again in 100ms
//   on submit, on change events are also trapped.  [submit triggers...]
// 
//
// https://developer.mozilla.org/en-US/docs/DOM/document.forms
// https://developer.mozilla.org/en-US/docs/DOM/form.elements
// hookAllFormSubmits() is called on page -> doc.forms[x].elements[y]
//    iterates through each, if input field is type: text, email, password
//    then lpfieldfocus() is called
//    
//
// lpfieldfocus() generates CS->BG checkgenpwfillforms msg
// background: CS->BG checkgenpwfillforms msg calls
//   fromcs.js:checkgenpwfillforms() sends BG->CS checkgenpwfillforms msg
//   was constrained by showNotificationsAfterClick; modified to ignore
// called on receipt of BG->CS checkgenpwfillforms msg
// called from lpshownotification, when fired on page and if checkForLoginForm() fails
//
// calls lpCheckGeneratePassword() from sso/firefox/content/checkgenpw.js
// calls lpCheckFormFill() from sso/firefox/content/fillforms.js
//    calls populateToFillForFormFill(), which sets array 'tofill' for return,
//      and can call lp_showNotification (for type==formfill) when there are more than 2(3?) 
//        input fields XXX. the showNotification all sets up background.g_datacache[] so that
//        clicking on the autofill/autologin buttons from the notification bar will work.
//        the showNotification also calls checkgenpwfillforms again, if it appears 
//        this page is not a login form (i.e. >= 3 input fields?)  this explains why
//        the fill occurs twice in the debugger.
//    for each of the elements in the 'tofill' array, the routine
//      calls lpFillFormField() to call lpSetValue() to set the form field with
//      the correct decrypted data.  
//      lpSetValue() sets DOM field.value to the decrypted value
//      returns 
//
//   
function checkgenpwfillforms(data)
{
  setupffoverrides(data);

  var result = null;
  if(g_sites.length==0)
    g_sites = LPJSON.parse(data['sites']);
  if(g_formfills.length==0)
    g_formfills = LPJSON.parse(data['formfills']);
  if (!data['nevergenerate']) {
    // this is in sso/firefox/content/checkgenpw.js
    // arg#1 browser object
    // arg#2 document DOM element
    // arg#3 checkonly? boolean
    // arg#4 window DOM element
    // arg#5 recursion_counter, int
    //
    result = lpCheckGeneratePassword(null, document, false, window);
  }
  if (experimentaloverlay && !result && !data['neverformfill']) {
    // this is in sso/firefox/content/fillforms.js
    // arg#1 browser object
    // arg#2 document DOM element
    // arg#3 dofill? boolean
    // arg#4 checkonly? boolean
    // arg#5 formfill id to us
    // arg#6 recursion_counter, int
    // arg#7 window DOM element
    //
    lpCheckFormFill(null, document, false, false, null, 1, window);
  }

}

// loadTimes : function
// csi :       function
// JSONSchemaValidator : function
// Event :     function
// Port :      function
// Extension : function
// self :      object
// extension : object
//probe("chrome",chrome);

// id_        string
// onConnect  object
// connect    function
// getURL     function
//probe("chrome.extension",chrome.extension);

//name : string
//portId_ : number
//onMessage : object
//onDisconnect : object
//postMessage : function
//disconnect : function
//probe("CS Probing port",g_port);

// --------------------------------------------------------------------------
//This is based on our safari implementation.
function evalScriptsInFrame(win, doc, force){
  //alert("inside onload.js : evalScriptsInFrame");

  try {
    for(var i = 0; doc.frames && i < doc.frames.length; i++){
      evalScriptsInFrame(doc.frames[i], doc.frames[i].document, force);
    }
  } catch (e) {
  }

  var url = punycode.URLToASCII(doc.location.href);
  var readyState = doc.readyState;
  if(force || readyState=="loaded" || readyState == 'complete'){
    if(doc.body && typeof(doc.body._lpcrdone)=='undefined'){
      doc.body._lpcrdone = 1;
      hookAllFormSubmits(doc);
    }else if(!force){
      return;
    }
    
  }else{
    setTimeout(function(){ evalScriptsInFrame(win, doc, 0); }, 100);
    return;
  }

  var inputs = doc.getElementsByTagName('input');
  var numpass = 0;
  for(var i = 0; i < inputs.length; i++)
    if(inputs[i].type=='password')
      numpass++;

  force = (force ? 1 : 0);
  //call back into background so it can decide which, if any, accts to fill
  // by setting docid = g_fillreqdocs.length, is ensures that the
  // response from BG of fillfield message will point to
  // g_fillreqdocs[docid] with null value, causing empty document
  // in onload.js:fill()
  //
  sendBG({cmd:'fill',url:punycode.URLToASCII(doc.location.href),docid:g_fillreqdocs.length,force:force,numpass:numpass});

  setupIcons(doc, g_is_specialsite);

  g_fillreqdocs[g_fillreqdocs.length] = doc;
  if (readyState != 'complete') {
    window.addEventListener('load', function() { sendBG({cmd:'fill',url:punycode.URLToASCII(doc.location.href),docid:g_fillreqdocs.length - 1,force:force,numpass:numpass}); }, false);
  }
}

function hookAllFormSubmits(doc)
{
  //try{i.dont.exist=1;}catch(e){alert("inside onload.js : hookAllFormSubmits\n\n"+e.stack);}

  try{
    var tld = lp_gettld_url(punycode.URLToASCII(doc.location.href));

    if (tld == 'pandora.com' && typeof(WebKitMutationObserver) == 'function') {
      new WebKitMutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          for (var i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].tagName == 'SCRIPT') {
              var inputs = doc.getElementsByTagName('input');
              for (var j = 0; j < inputs.length; j++) {
                if (inputs[j].type == 'submit' && typeof(inputs[j].lpsubmitorig) == 'undefined') {
                  inputs[j].lpsubmitorig = true;
                  inputs[j].addEventListener('click', function() { handle_form_submit(this.ownerDocument, this.form); });

                  /////////////////////////////////////////
                  //
                  inputs[j].addEventListener('keyup', function(event) { handle_form_text_change(this.ownerDocument, this, this.form, event); });
                }
              }
            }
          }
        })
      }).observe(doc.documentElement, { childList: true, subtree: true });
    }

    //override submit function on the page itself, doesn't seem to work from here
    if(tld != 'acidtests.org' && doc.getElementById('hiddenlpsubmitdiv')==null && doc.forms.length > 0){
      var d = doc.createElement('script');
      d.style.display = 'none';
      d.id = 'hiddenlpsubmitdiv';
      if(doc.body)
        doc.body.appendChild(d);

      //If submit is called, store the form number in the div and create an event that will be captured 
      //by the extension
      var custom_js="for(var lastpass_iter=0; lastpass_iter < document.forms.length; lastpass_iter++){ "+
                      "var lastpass_f = document.forms[lastpass_iter]; ";
      if (g_isopera) {
        custom_js +=  "if (typeof(lastpass_f.id) != 'undefined' && lastpass_f.id == 'dl-form') { continue; } ";
      }
      custom_js +=    "if(typeof(lastpass_f.lpsubmitorig2)==\"undefined\"){ "+
                        "lastpass_f.lpsubmitorig2 = lastpass_f.submit; "+
                        "lastpass_f.submit = function(){ "+
                          "var form=this; "+
                          "var customEvent = document.createEvent(\"Event\"); "+
                          "customEvent.initEvent(\"lpCustomEvent\", true, true); "+
                          "var d = document.getElementById(\"hiddenlpsubmitdiv\"); "+
                          "for(var i = 0; i < document.forms.length; i++){ "+
                            "if(document.forms[i]==form){ "+
                              "d.innerText=i; "+
                            "} "+
                          "} "+
                          "d.dispatchEvent(customEvent); "+
                          "form.lpsubmitorig2(); "+
                        "} "+
                      "} "+
                     "}";
      run_custom_js(doc, custom_js);

      d.addEventListener('lpCustomEvent', function() {
        //The form number is written to the div, use that to pull the right form
        handle_form_submit(doc, doc.forms[parseInt(d.innerText)]);
      });
    }


    for(var lastpass_iter=0; lastpass_iter < doc.forms.length; lastpass_iter++){
      var lastpass_f = doc.forms[lastpass_iter];
      if(typeof(lastpass_f.lpsubmitorig)=="undefined"){
        if(lastpass_f.name=='lpmanualform'){
          //console_log('found manual!');
          g_foundmanual = true;
        }

          lastpass_f.lpsubmitorig = true;
          lastpass_f.addEventListener('submit', function(event) { handle_form_submit(doc, event.target); }, false);

          lastpass_f.addEventListener('keyup', function(event) { handle_form_text_change(doc, event.target, event.target.form, event); });  // NEW  check that event.target != null


        try {
          if(typeof(lastpass_f.elements)!='function' || g_issafari){
            for (var i = 0; i < lastpass_f.elements.length; i++) {
              var elt = lastpass_f.elements[i];
              if ('text' == elt.type || 'email' ==  elt.type || 'tel' ==  elt.type || 'password' == elt.type) {
                elt.addEventListener('change', lpfieldchange, false);
                if(!g_initiallysetupff){
                    elt.addEventListener('focus', lpfieldfocus, false);
                }
              }
            }
          }
        } catch (e) {
        }
      }
    }
  } catch (e) {
  }
}

//
// click handler for submit buttons (input elements of type 'submit')
//
// click handler for 'lpCustomEvent'
//
function handle_form_submit(doc, form)
{
  //alert("inside onload.js : handle_form_submit");
  try {
    if(form.name=='lpwebsiteeventform'){
      lpwebsiteevent(doc, form);
    }else if(form.name=='lpmanualform'){
      lpmanuallogin(doc, form);
    }else{
      var form_save = LP_get_form_save(form);
      if (form_save == null){
        return false;
      }

      if (typeof(doc.LPlpsaveforminfo) != 'undefined' && typeof(SAVEALLFORMSUBMITS)=='undefined') {
        lpupdatefields(doc, form_save);
      } else if (typeof(doc.LPlpsaveforminfoaddurid) != 'undefined') {
        lpaddurid(doc, form_save);
      } else {
        lpformsubmit(doc, form_save);
      }
    }
  } catch (e) {}
}


function lpupdatefields(doc, form_save)
{
  sendBG({cmd:'updatefields',url:punycode.URLToASCII(doc.location.href),formdata:form_save,aid:doc.LPlpsaveforminfo});
}

function lpaddurid(doc, form_save)
{
  sendBG({cmd:'addurid',url:punycode.URLToASCII(doc.location.href),formdata:form_save,aid:doc.LPlpsaveforminfoaddurid});
}

//
// on submit, this message calls out to fromcs.js:handleSave()
// and can return 'showchangenotification' BG->CS msg
// or 'showaddnotification' BG->CS msg back to this CS context
//
function lpformsubmit(doc, form_save)
{
  sendBG({cmd:'save',url:punycode.URLToASCII(doc.location.href),formdata:form_save});
}

function lpmanuallogin(doc, form)
{
  sendBG({cmd:'launchautologin',url:punycode.URLToASCII(doc.location.href),aid:form.aid.value});
}


function lpwebsiteevent(doc, form)
{
  //alert("inside onload.js : lpwebsiteevent");
  
  //lastpass.com check is done in background window

  sendBG({cmd:'log', msg:"Event: " + form.eventtype.value});
  if(form.eventtype.value=="keyplug2web"){
    g_form = form;
    sendBG({cmd:'plug2web',url:punycode.URLToASCII(doc.location.href),username:form.eventdata1.value});
  } else if(form.eventtype.value=="getversion"){
    g_form = form;
    sendBG({cmd:'getversion'});
  } else if(form.eventtype.value=="getdebuginfo"){
    g_form = form;
    sendBG({cmd:'getdebuginfo'});
  }else if(form.eventtype.value=="keyweb2plug"){
    sendBG({cmd:'web2plug',url:punycode.URLToASCII(doc.location.href),key:form.eventdata1.value,username:form.eventdata2.value,rsa:form.eventdata3.value});
  }else if(form.eventtype.value=="logoff"){

    //TODO - this isn't working because I do not think we override the 
    //submit for the accts page (loaded via a XHR request). Need to figure out
    //a way to do it
    sendBG({cmd:'logoff',url:punycode.URLToASCII(doc.location.href)});
  }else if(form.eventtype.value=="login"){
  
    // After login, we replace the entire document.body with a new lpwebsiteevent form and never hook it
    // So this is needed so that send_website_event works
    setTimeout(function(){evaluntilfindmanual(true);}, 1000);
    
    sendBG({cmd:'login',url:punycode.URLToASCII(doc.location.href),wxusername:form.eventdata1.value,keyhex:form.eventdata2.value,wxhash:form.eventdata3.value,wxsessid:form.eventdata5.value});
  }else if(form.eventtype.value=="rsadecrypt"){
    //alert("inside onload.js : rsadecrypt case 2");
    //lplog("SK onload form : X1 : url="+punycode.URLToASCII(doc.location.href));
    //lplog("SK onload form : X2 : sharerpublickeyhex="+form.eventdata1.value);
    //lplog("SK onload form : X3 : sharekeyenchexsig="+form.eventdata2.value);
    //lplog("SK onload form : X4 : sharekeyenchex="+form.eventdata3.value);
    g_form = form;
    sendBG({cmd:'rsadecrypt',url:punycode.URLToASCII(doc.location.href),sharerpublickeyhex:form.eventdata1.value,sharekeyenchexsig:form.eventdata2.value,sharekeyenchex:form.eventdata3.value});
  }else if(form.eventtype.value=="rsaencryptmultiple"){
    //alert("inside onload.js : rsaencryptmultiple case 2");
    //lplog("SK onload form : X1 : url="+punycode.URLToASCII(doc.location.href));
    //lplog("SK onload form : X2 : data="+form.eventdata1.value);
    g_form = form;
    sendBG({cmd:'rsaencryptmultiple',url:punycode.URLToASCII(doc.location.href),data:form.eventdata1.value});
  }else if(form.eventtype.value=="clearcache"){
    sendBG({cmd:'clearcache',url:punycode.URLToASCII(doc.location.href)});
  }else if(form.eventtype.value=="getimportdata"){
    sendBG({cmd:'getimportdata',url:punycode.URLToASCII(doc.location.href)});
  }else if(form.eventtype.value=="recover"){
//console_log("captured a recover ene");
    g_form = form;
//console_log("username: " + form.eventdata1.value);
    sendBG({cmd:'recover',url:punycode.URLToASCII(doc.location.href),username:form.eventdata1.value});
  } else if (form.eventtype.value == 'recheck') {
    evalScriptsInFrame(window, document, true);
    sendBG({cmd:'getloggedin'}); // this refreshes g_isloggedin  XXX  I wonder if this is the best way
  } else if (form.eventtype.value == 'refresh') {
    sendBG({cmd: 'refresh', url: punycode.URLToASCII(doc.location.href), from: form.eventdata1.value, type: form.eventdata2.value});
    sendBG({cmd:'getloggedin'}); // this refreshes g_isloggedin  XXX  I wonder if this is the best way
  } else if (form.eventtype.value == 'switchidentity') {
    sendBG({cmd: 'switchidentity', url: punycode.URLToASCII(doc.location.href), iid: form.eventdata1.value});
  } else if (form.eventtype.value == 'getuuid') {
    g_form = form;
    sendBG({cmd:'getuuid'});
  } else if (form.eventtype.value == 'setupmultifactor') {
    form.eventdata3.value = 'working';
    g_form = form;
    sendBG({cmd: 'setupmultifactor', type: form.eventdata1.value, username: form.eventdata2.value});
  } else if (form.eventtype.value == 'setupsinglefactor') {
    if (form.eventdata5.value != '1') {
      form.eventdata4.value = 'working';
    }
    g_form = form;
    sendBG({cmd: 'setupsinglefactor', type: form.eventdata1.value, username: form.eventdata2.value, password: form.eventdata3.value, silent: form.eventdata5.value});
  } else if (form.eventtype.value == 'checkmultifactorsupport') {
    g_form = form;
    sendBG({cmd: 'checkmultifactorsupport', type: form.eventdata1.value});
  } else if (form.eventtype.value == 'verifymultifactor') {
    form.eventdata2.value = 'working';
    g_form = form;
    sendBG({cmd: 'verifymultifactor', eventdata1: form.eventdata1.value});
  } else if (form.eventtype.value == 'multifactorauth') {
    form.eventdata3.value = 'working';
    g_form = form;
    sendBG({cmd: 'multifactorauth', type: form.eventdata1.value, username: form.eventdata2.value, challenge: form.eventdata4.value});
  } else if (form.eventtype.value == 'multifactorreprompt') {
    form.eventdata3.value = 'working';
    g_form = form;
    sendBG({cmd: 'multifactorreprompt', type: form.eventdata1.value, username: form.eventdata2.value, challenge: form.eventdata4.value});
  } else if (form.eventtype.value == 'gohome') {
    sendBG({cmd: 'gohome', email: form.eventdata1.value, sesameotp: form.eventdata2.value, cmd: form.eventdata3.value});
  } else if (form.eventtype.value == 'lpgologin') {
    sendBG({cmd:'lpgologin',url:punycode.URLToASCII(doc.location.href),data:form.eventdata1.value,session_key:form.eventdata2.value});
  } else if (form.eventtype.value == 'checkattach') {
    g_form = form;
    sendBG({cmd: 'checkattach'});
  } else if (form.eventtype.value == 'getattach') {
    g_form = form;
    sendBG({cmd: 'getattach', attachkey: form.eventdata1.value});
  } else if (form.eventtype.value == 'openattach') {
    sendBG({cmd: 'openattach', attachkey: form.eventdata1.value, data: form.eventdata2.value, mimetype: form.eventdata3.value});
  } else if (form.eventtype.value == 'saveattach') {
    sendBG({cmd: 'saveattach', attachkey: form.eventdata1.value, data: form.eventdata2.value, mimetype: form.eventdata3.value});
  }
}


function checkdomain(doc, validdomains){
  var tld = lp_gettld_url(punycode.URLToASCII(doc.location.href));
  var arr = validdomains.split(",");
  for(var i = 0; i < arr.length; i++){
    if(arr[i]==tld)
      return true;
  }
  return false;
}

//   when BG receives event fillaid, BG calls fillaid()
//   BG fillnext() is called when corresponding hotkey is issued
// background.js: fillaid() calls fill()
// background.js: fillnext() calls fill() or fillaid()
// fromcs.js:fill() sends the fillfield()
// triggered by BG->CS fillfield
// can send CS->BG fillfieldconfirm
// fillfieldconfirm eventually calls LP_setvalXXX to set 
//    form fields and calls lphighlightField to set them.
//
//
// given a field with name of data['name'], set to value data['value']/data['checked']
//   calls LP_setval() to set the field, which calls lphighlightField()
var firstfill = true;
function fillfield(data){

  var doc = data['docid'] ? g_fillreqdocs[data['docid']] : document;

  // this next case occurs on a page recheck (on receipt of recheck BG->CS msg)
  if ( g_fillreqdocs[data['docid']] == null) {
    console_log('data[docid] = '+data['docid']+' but g_fillreqdocs is null');
    doc = document;
  }

  var doconfirm = typeof(data['doconfirm'])!='undefined'?data['doconfirm']:false;
  var allowforce = typeof(data['allowforce'])!='undefined'?data['allowforce']:0;
  var aid = typeof(data['aid'])!='undefined'?data['aid']:0;
  var tabid = typeof(data['tabid'])!='undefined'?data['tabid']:0;
  var custom_js = typeof(data['custom_js'])!='undefined'?data['custom_js']:"";
  var manualfill = typeof(data['manualfill'])!='undefined'?data['manualfill']:false;
  var username = typeof(data['username']) != 'undefined' ? data['username'] : '';
  var password = typeof(data['password']) != 'undefined' ? data['password'] : '';
  var onlyfill = typeof(data['onlyfill']) != 'undefined' ? data['onlyfill'] : false;
  var automaticallyFill = typeof(data['automaticallyFill']) != 'undefined' ? parseInt(data['automaticallyFill']) : 1;
  if (data['is_launch']) {
    g_last_launch[aid] = new Date().getTime();
  }
  g_clearfilledfieldsonlogoff = data['clearfilledfieldsonlogoff'];


  //We have an issue with saving fields in wrong accounts if the first acct has no
  //fields and then we fill with a second account (with fields). They end up showing up
  //in the first account. This is REALLY bad if the first acct was in a shared folder 
  //So reset these values each time through this function, they will get set in fillbest if needed.
  if (typeof(doc) != 'undefined' && typeof(doc.LPlpsaveforminfo) != 'undefined' ) {
    delete doc.LPlpsaveforminfo;
  }
  if (typeof(doc) != 'undefined' && typeof(doc.LPlpsaveforminfoaddurid) != 'undefined' ) {
    delete doc.LPlpsaveforminfoaddurid;
  }


  // doc could be null at this point.
  // what should be done in this case?
  if (typeof(doc) != 'undefined') {
    if(!checkdomain(doc, data['domains'])){
      console_error("Not filling because tld mismatch between " + punycode.URLToASCII(doc.location.href) + " and " + data['domains']);
      return;
    }
  } else {
    verbose_log("DEBUG: no doc obj defined for docid = "+ (data['docid']!=null) ? data['docid'] : 'null');
  }

  if(firstfill){
    if (custom_js != '') {
      run_custom_js(doc, lpPrepareCustomJS(custom_js, username, password, '1', onlyfill, doc));
      run_custom_js(doc, lpPrepareCustomJS(custom_js, username, password, '2', onlyfill, doc));
    }
  }

  if(data['highlight']==0)
    lpdisableHighlightField=1;

// DEBUG
  verbose_log("filling " + data['name'] + " with " + (data['type'] == 'password' ? '<hidden>' : data['value']));
  var success = LP_setval(doc,data['name'],data['value'],data['checked'],data['aid'],data['formname'],data['type'],data['sharedsite'],data['otherfield'],automaticallyFill);
//DEBUG
  verbose_log("filling result = "+success);

  if(success)
    g_fillaid = aid;

  if(firstfill){
    firstfill = false;
  }

  //Send back a message to the background to indicate result if necessary
  if(doconfirm){
    sendBG({cmd:'fillfieldconfirm',manualfill:manualfill, url:punycode.URLToASCII(doc.location.href), result:success, aid:aid, docid:data['docid'], tabid:tabid, allowforce:allowforce, automaticallyFill:automaticallyFill,doconfirm:doconfirm});
  }
}

function fillbest(data){
  var doc = data['docid'] ? g_fillreqdocs[data['docid']] : document;

  //We have an issue with saving fields in wrong accounts if the first acct has no
  //fields and then we fill with a second account (with fields). They end up showing up
  //in the first account. This is REALLY bad if the first acct was in a shared folder 
  //So reset these values each time through this function, they will get set later if needed.
  delete doc.LPlpsaveforminfo;
  delete doc.LPlpsaveforminfoaddurid;

  var automaticallyFill = typeof(data['automaticallyFill']) != 'undefined' ? parseInt(data['automaticallyFill']) : 1;
  if (data['is_launch']) {
    g_last_launch[data['aid']] = new Date().getTime();
  }
  g_clearfilledfieldsonlogoff = data['clearfilledfieldsonlogoff'];

  if(!checkdomain(doc, data['domains'])){
    console_error("Not filling because tld mismatch between " + punycode.URLToASCII(doc.location.href) + " and " + data['domains']);
    return;
  }

  if(data['highlight']==0)
    lpdisableHighlightField=1;
  var custom_js = typeof(data['custom_js'])!='undefined'?data['custom_js']:"";
  if (custom_js != '') {
    run_custom_js(doc, lpPrepareCustomJS(custom_js, data['username'], data['password'], '3', true, doc));
  }
  LP_setval_bestmatch(doc,data['username'],data['password'],data['aid'],data['updatefields'],data['sharedsite'],data['addurid'],automaticallyFill);
}

function submit(data){
  var doc = data['docid'] ? g_fillreqdocs[data['docid']] : document;
  if (LP_last_form != null) {
    LP_doSubmit(doc,LP_last_form,data['submit_id']);

    if(doc.body && typeof(data['submit_html'])!='undefined' && data['submit_html']!=''){
      doc.body.innerHTML += data['submit_html'];
    }
    if(typeof(data['submit_js'])!='undefined' && data['submit_js']!=''){
      window.eval(data['submit_js']);
    }
  }
}

// background: fillform event calls fillform()
// background: fillformffid CS->BG MSG calls fillform()
// background: fill_default_ffid calls fillform() : hotkey
// background: cmaction1 calls fillform()  : context menu   

// background.js:fillform() generates BG->CS fillform
// triggered by BG->CS fillform msg
function fillform(data){

  var doc = data['docid'] ? g_fillreqdocs[data['docid']] : document;
  LP_to_formfill = LPJSON.parse(data['toformfill']);
  translations = LPJSON.parse(data['translations']);
  LP_form_fill();
}

function saveall()
{
  var url = "";
  if(typeof(document.location)!='undefined') // had a script killing javascript error here 
    url = punycode.URLToASCII(document.location.href); 
  sendBG({cmd: 'saveall', 'addsite': 1, 'url': url, 'formdata': LP_get_form_save_all()});
}


//------------------------------------------
//The following functions were taken from safari
//So far, the only thing that changed is that we pass doc into them
//to handle frames

function LP_truncate_text_if(str){
  if (typeof(str) == 'string' && str.length > 45000) {
    str = str.substring(0, 45000);
  }
  return str;
}
function LP_en(v){ return encodeURIComponent(v); }

function LP_getform_for_input(doc,e){
  var forms = doc.getElementsByTagName('form');
  for(var i=0;i< forms.length;i++){
    var formElements = forms[i].elements;
    for(var j=0;j< formElements.length;j++){
      var elt = formElements[j];
      if(e == elt) {
        if (LP_last_form != forms[i] && (!LP_last_form || lpIsVisible(elt))) {
          LP_last_form = forms[i];
        }
        return forms[i];
      }
    }
  }
}

/*
** passed arguments
** n is name of the field to set
** v is value to set
** c is boolean;  if this is a checkbox, what checked state to set as 
** a is the active aid
** f is formname
** t is type (input/select/textarea)
**
*/
// when should fillcache be invalidated?
var fillcache = [];
function LP_setval(doc,n,v,c,a,f,t,sharedsite,otherfield,automaticallyFill) {
  var inputs = doc.getElementsByTagName(t == 'select-one' ? 'select' : (t == 'textarea' ? 'textarea' : 'input')); 
  var found = false;
  var filled = false;
  for (var j = 1; j <= 2; j++) {
    var min = 0;
    var max = inputs.length - 1;
    if (j == 2) {
      max = -1;
      if (otherfield && !found) {
        var matches = n.match(/^(input|select|textarea)(\d+)$/);
        if (matches) {
          var eltnum = parseInt(matches[2]);
          if (inputs.length > eltnum) {
            min = max = eltnum;
          }
        }
      }
    }

    for(var i=min;i<= max;i++){
      var e = inputs[i];
      if(j == 2 || LP_getname(e)==n){
        if (j == 1 && (f != '' && (typeof(e.form) == 'undefined' || !e.form || LP_getname(e.form) != f))) {
          continue;
        }
        found = true;

        //Try to prevent chrome from filling over and over (and over) the same logins if the same fields are
        //present in the acct multiple times.
        if(e.value==v && typeof(fillcache[n+t])!='undefined'){
          if (e.type != 'radio' || e.checked == c) {
            filled = true;  // setting this prevents case where this cycles
                            // through all available logins that may 
                            // share an input field.  maybe
                            // i think fillcache should be [n+t+a] ...
            continue;
          }
        }
        fillcache[n+t]=1;

        // switch on formfield type
        if('password'==e.type || 'text'==e.type || 'email'==e.type || 'tel'==e.type || 'textarea'==e.type || 'select-one'==e.type){
          if (e.form && !lpCheckWarnInsecure(e.form, e.form.ownerDocument, false)) {
            return false;
          }
          if (t == 'password' && e.type != 'password') {
            var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));
            if(!is_watermark(e.className) && !is_watermark_password(e) && lp_gettld_url(doc.location.href) != 'imo.im') {
              return false;
            }else{
              // NB: this changes the attribute on the actual element.  I don't think this is a good idea
              e.type = 'password';
              lpdbg('onload', 'switching field from text to password from LP_setval');
            }
          }
          if (sharedsite && t == 'password') {
            lpsharedpasswordfills[lpsharedpasswordfills.length] = e;
          }
          if(automaticallyFill){
            if (typeof(a) != 'undefined' && a && typeof(g_last_launch) != 'undefined' && typeof(g_last_launch[a]) != 'undefined' && new Date().getTime() - g_last_launch[a] <= 25000) {
              e.focus();
            }
            var changed = e.value != v;

            //action tech (verizon) routers do funky stuff onkeyup and we need to make sure
            //if filled multiple times, the onkeyup is run from a clean slate each time.
            //So if there was a value in the field, temp change to blank and run change. Hopefully
            //safe and shouldn't cause other issues.
            if(e.value.length && e.type!='select-one'){
              e.value='';
              fire_onchange(e,true,true);
            }

            e.value=v;
            if (typeof(g_clearfilledfieldsonlogoff) != 'undefined' && g_clearfilledfieldsonlogoff != 0) {
              if (typeof(doc.lp_filled_fields) != 'object') {
                doc.lp_filled_fields = new Array();
              }
              doc.lp_filled_fields[doc.lp_filled_fields.length] = e;
            }
            if (changed && (e.type != 'select-one' || e.value == v)) {
              fire_onchange(e);
            }
          }
          lphighlightField(e);   // LLLL
          LP_getform_for_input(doc,e);
          filled = true;
        } else if ('radio'==e.type) {
          if(!automaticallyFill)
            continue;
          if (e.value == v) {
            var changed = e.checked != c;
            e.checked = c;
            if (changed) {
              fire_onchange(e);
            }
            filled = true;
          }
        } else if ('checkbox'==e.type) {
          if(!automaticallyFill)
            continue;
          var changed = e.checked != c;
          e.checked = c;
          if (changed) {
            fire_onchange(e);
          }
          filled = true;
        }  // if type of input
      }
    }
  }
  return filled;
}
//
// CS->BG msg fillfieldconfirm calls fillfieldsconfirm()   - note plural vs non-plural
// fromcs:fillfieldsconfirm() can send BG->CS fillbest msg
//
// BG->CS msg fillbest calls fillbest(),
// fillbest() calls LP_setval_bestmatch()
// called from LP_setval_bestmatch()
//
function LP_setvaloffset(doc, form, offset, v, t, automaticallyFill, sharedsite, a){
  var e = form.elements[offset];
  if('password'==e.type || 'text'==e.type || 'email'==e.type || 'tel'==e.type || 'textarea'==e.type || 'select-one'==e.type){
    if (e.form && !lpCheckWarnInsecure(e.form, e.form.ownerDocument, false)) {
      return false;
    }
    if (t == 'password' && e.type != 'password') {
      return false;
    }
    if (sharedsite && t == 'password') {
      lpsharedpasswordfills[lpsharedpasswordfills.length] = e;
    }
    if(automaticallyFill){
      if (typeof(a) != 'undefined' && a && typeof(g_last_launch) != 'undefined' && typeof(g_last_launch[a]) != 'undefined' && new Date().getTime() - g_last_launch[a] <= 25000) {
        e.focus();
      }
      var changed = e.value != v;
      e.value=v;
      if (typeof(g_clearfilledfieldsonlogoff) != 'undefined' && g_clearfilledfieldsonlogoff != 0) {
        if (typeof(doc.lp_filled_fields) != 'object') {
          doc.lp_filled_fields = new Array();
        }
        doc.lp_filled_fields[doc.lp_filled_fields.length] = e;
      }
      if (changed && (e.type != 'select-one' || e.value == v)) {
        fire_onchange(e);
      }
    }
    lphighlightField(e);   // LLLL
    LP_getform_for_input(doc,e);
  }
}
function LP_force(t,v,a) {
  var forms =  document.getElementsByTagName('form');
  for(var i=0;i< forms.length;i++){
    var formElements = forms[i].elements;
    for(var j=0;j<formElements.length;j++){
      var e = formElements[j];
      if(('password'==e.type && 'password'==t) || ('text'==e.type && 'text'==t) || ('email' == e.type && 'email'==t) || ('tel' == e.type && 'tel'==t)) {
        if (typeof(a) != 'undefined' && a && typeof(g_last_launch) != 'undefined' && typeof(g_last_launch[a]) != 'undefined' && new Date().getTime() - g_last_launch[a] <= 25000) {
          e.focus();
        }
        var changed = e.value != v;
        e.value=v;
        if (typeof(g_clearfilledfieldsonlogoff) != 'undefined' && g_clearfilledfieldsonlogoff != 0) {
          if (typeof(doc.lp_filled_fields) != 'object') {
            doc.lp_filled_fields = new Array();
          }
          doc.lp_filled_fields[doc.lp_filled_fields.length] = e;
        }
        if (changed) {
          fire_onchange(e);
        }
        LP_last_form = forms[i];
        return forms[i];
      }
    }
  }
}

//
// parameters:
// doc: document object
// u: string, username
// p: string, password (cleartext)
// a: the site's aid
// updatefields : from BG ; if true, set doc.LPlpsaveforminfo and send updatefields CS->BG msg
// sharedsite : from BG, if true, set lpsharedpasswordfills, used by onload.js:LP_get_field_text()
// addurid : from BG, if true, set doc.LPlpsaveforminfoaddurid and send addurid CS->BG msg
// automaticallyFill: 0 or 1, passed from BG, passed along to LP_setval()
//
// CS->BG msg fillfieldconfirm calls fillfieldsconfirm()   - note plural vs non-plural
// fromcs.js:fillfieldsconfirm() can send BG->CS fillbest msg
//
// BG->CS msg fillbest calls onload.js:fillbest(),
// onload.js:fillbest() calls LP_setval_bestmatch()
//
function LP_setval_bestmatch(doc,u,p,a,updatefields,sharedsite,addurid,automaticallyFill){
  var bestform=null;
  var bestnuminputs=0,bestnumpass=0;
  var bestuseroffset=0,bestpassoffset=0;
  var besttextname=null,bestpassname=null;
  var forms =  doc.getElementsByTagName('form');
  if(forms.length==0){
    var inputs = document.getElementsByTagName('input');
    for(var i=0; i < inputs.length; i++){
      var t = inputs[i].type;
      if((t=='text' || t=='email' || t=='tel') && (besttextname==null || bestpassname==null))
        besttextname=LP_getname(inputs[i]);
      if(t=='password' && bestpassname==null)
        bestpassname=LP_getname(inputs[i]);
    }
    if(bestpassname!=null)
      bestform='';
  }

  var loopctr;
  var loops=1;
  if (do_experimental_popupfill) { loops++; }

  for (loopctr=0;loopctr<loops;loopctr++) {
    if (do_experimental_popupfill && loopctr == 1) {
      verbose_log('retrying setval_bestmatch INPUT field detection; not ignoring hidden fields');
    }

    for(var i=0;i< forms.length;i++){
      var formElements = forms[i].elements;
      var numinputs=0,numpass=0;
      var numusername=0;
      var textoffset=0,passoffset=0;
      var textname=null,passname=null;
    
      for(var j=0;j<formElements.length;j++){
        var e = formElements[j];

        if (do_experimental_popupfill) {
          // new behavior:  (when loopctr==0)
          //   iterate through all forms {
          //     iterate through all fields of each form {
          //       IF visible, and if form has appropriate fields for username/pass then choose it
          //     }
          //   }
          //   if no good candidate form was found, fall back to old behavior: (when loopctr==1)
          //   log msg
          //   iterate through all forms {
          //     iterate through all fields of each form {
          //       if form has appropriate fields for username/pass then choose it
          //     }
          //   }
          //
          //
          if (loopctr == 0) {
            // am worried that this has unintended consequences, but this
            // is more correct.  many sites have forms with lots
            // of INPUT fields that are active but not visible
            // e.g. lankanmon.com
            if (e.tagName == 'FIELDSET') {
              continue;
            }
            if (!checkIsDisplayed(document, e,  0)) {  
              continue;
            }
          }
        } // do_experimental_popupfill

        if('text' == e.type && is_watermark(e.className)){
          //I bet this is really a password field masquerading as a text field.
          //Treat it as a password field.
          e.type = 'password';
          lpdbg('onload', 'switching field from text to password from LP_setval_bestmatch');
        }
        if('text' == e.type || 'email' == e.type || 'tel' == e.type){
          if(numinputs==0 || numpass==0){ textname=LP_getname(e); textoffset=j; }
          numinputs++;
          // pass g_is_specialsite() as param?
          if (do_experimental_popupfill && g_is_specialsite) {
            if (looksLikeUsername(e)) {
              numusername++;
            }
          }
        }
        if(e.type=='password'){
          if(numpass==0){ passname=LP_getname(e); passoffset=j; }
          numpass++;
        }
      }

      // if(numpass==1) {
      //
      // specialsite saves w/o save-all can fail numpass==1 test as
      // these webpages are on 2-stage logins and the initial stage
      // has just the one input text field.
      //
      // so try to evaluate whether a valid username field can be found.
      //
      // pass g_is_specialsite() as param?
      if(numpass==1 || (do_experimental_popupfill && g_is_specialsite)) {
        if(!bestform || (numinputs==1&&bestnuminputs!=1)  || 
           (do_experimental_popupfill && g_is_specialsite && numusername==1)) {
          bestnuminputs=numinputs;
          bestnumpass=numpass;
          bestform=forms[i];
          besttextname=textname;
          bestpassname=passname;
          besttextoffset=textoffset;
          bestpassoffset=passoffset;
          //So fix some sites (like cooksillustrated) where names are same
          if(besttextname==bestpassname) {
            besttextname=bestpassname="";
          }
        }
      }
    }
  } // loopctr

  if(bestform!=null){
    if (u!=""){
      if(besttextname!=""){
        LP_setval(doc, besttextname, u, 0, a, bestform=='' ? '' : LP_getname(bestform), '', sharedsite,null,automaticallyFill);
      }else{
        LP_setvaloffset(doc, bestform, besttextoffset, u, 'text', automaticallyFill, sharedsite, a);
      }
    }
    if(bestpassname!=""){
      LP_setval(doc, bestpassname, p, 0, a, bestform=='' ? '' : LP_getname(bestform), 'password', sharedsite,null,automaticallyFill);
    }else{
      LP_setvaloffset(doc, bestform, bestpassoffset, p, 'password', automaticallyFill, sharedsite, a);
    }
    if (updatefields) {
      doc.LPlpsaveforminfo = a;
    } else if (addurid) {
      doc.LPlpsaveforminfoaddurid = a;
    }
  }
}
function lpCheckWarnInsecure(form, doc, bAfterSubmit){
  if(form){
    if (!bAfterSubmit && (typeof(lpdontfillautocompleteoff)!='undefined' && lpdontfillautocompleteoff)) {
      if(form.getAttribute('autocomplete')=='off'){
        return null;
      }
    }
    
    if(typeof(lpwarninsecureforms)!='undefined' && lpwarninsecureforms){
      if((form.method && typeof(form.method) == 'string' && form.method.toUpperCase()=='GET') || (typeof(form.action) == 'string' && form.action.indexOf('mailto:')==0)){
          if(typeof(g_warnedUserThisPageLogin)=='undefined')
            g_warnedUserThisPageLogin = 1;
          else
            return;
          if(!confirm(gs('LastPass detected a login form that is insecure.\n\nWould you like to continue?'))){
            return null;
          }
      }
    }
  }
  return form;
}
//
// called from field event handlers (registered below)
//   on focus, icon==false / hide the background image if popupfill is off
//                           background image doesn't ever show if popupfill is on
//   on blur,  icon==true  / show the background image if popupfill is off
//                           background image doesn't ever show if popupfill is on
//
// called from LP_setval() with icon==null
// called from LP_setvaloffset
//
// hooks into popup form iframe.
//
function lphighlightField(field, icon){
  var addimg = false;
  if (do_experimental_popupfill) { 
    addimg=true;
  }
  if(typeof(lpdisableHighlightField)!='undefined' && lpdisableHighlightField) return;
  if (field.type != 'text' && field.type != 'password' && field.type != 'email' && field.type != 'tel')
    return;
        
  var addlisteners = false;
  if (typeof(icon) == 'undefined') {
    addlisteners = true;
    
    if (do_experimental_popupfill) { 
      icon = false;  // do not display icon as clickable IMG as well as background image
    } else {
      icon = true;
    }
  }
  var width_no_px = field.style.width.replace(/px/, '');
  if (width_no_px == ''){
    try{
      var style = field.ownerDocument.defaultView.getComputedStyle(field, '');
      width_no_px = style.width.replace(/px/, '');
    } catch (e) {}
  }
  if(width_no_px>0 && width_no_px < 30)
    return;
        
  var backgroundimage = field.style.backgroundImage;
  if (backgroundimage == ''){
    try{
      var style = field.ownerDocument.defaultView.getComputedStyle(field, '');
      backgroundimage = style.backgroundImage;
    } catch (e) {}
  }
  if (backgroundimage == 'none') {
    backgroundimage = '';
  }
  if (backgroundimage == '') {
    field.style.backgroundImage = icon ? 'url(data:image/gif;base64,R0lGODlhEAAQAMQAAHgAFq9RZp8BJfT09JkCJKUuSO/q6/n//vHh5YYBGvf6+tOyucB0hsuLmpUiOpIAHIgJJtzFy7pneuvT2fP49/Dw8L5/juS+x8Scpn4BHaMDJ3cAHHQAG6YDKHEAGv///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkZCN0YxMTc0MDcyMDY4MTFCRURDRjg2RUEzOUI0MjBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUyQjY0RUJGQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUyQjY0RUJFQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkE3RjExNzQwNzIwNjgxMTkyQjA4Nzg0MUEyMjBGMUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkI3RjExNzQwNzIwNjgxMUJFRENGODZFQTM5QjQyMEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAEAAQAAAFmGAnjmTZaSgqCCqbautKdMVaOEQsEDkRTAjN44IIyHi8R+DzYRSYjAcy+Ug0PojJZ/HoUh2BgGRwOCga4UK3uiwP3mSmJVFNBBQVQwWuVzASgAkQDmAVFIcShBCAGY0ZAAsHEZEREACOjgABBxQBDhUHFpeNG6UcDhgLHgCpBQClsKUeHBAeGxkctrAcvL2zub2+HsPExcYhADs=)' : '';
  } else {
    addlisteners = false;
  }
  var origwidth = field.offsetWidth;
  if (backgroundimage == '') {
    field.style.paddingRight = icon ? '18px' : '0px';
    field.style.backgroundRepeat = 'no-repeat';
    field.style.backgroundAttachment = 'scroll';
    field.style.backgroundPosition = 'center right';
  }
  field.style.border = '1px solid #c01f2f';
  if (origwidth > 0) {
    field.style.width = origwidth + 'px';
    field.style.width = (2 * origwidth - field.offsetWidth) + 'px';
  }
  if (addimg) {
    // check to see if an associated image/popup exists already
    // for this field first.
    // for hooking in when user clicks on fill notification

    if (do_experimental_popupfill) {

      // hopefully the getnevers CS->BG msg will have been sent, the response
      // BG->CS gotnevers MSG received, and g_nevers object populated by now.
      // the never rules will apply for the current site or domain

      var nevers_rules = check_nevers(document, g_nevers, document.location.href);
      var show_clickable_for_formfill=true;
      var show_clickable_for_save=true;     //user does not have any valid aids for this site
      var show_clickable_for_autofill=true; //user has at least one valid aid for this site
      var show_clickable=true;   // one never to rule them all, one never to bind them
      if (nevers_rules  != null) {
        show_clickable_for_formfill=nevers_rules.show_for_formfill;
        show_clickable_for_save = nevers_rules.show_for_save;
        show_clickable_for_autofill = nevers_rules.show_for_autofill;
        show_clickable=nevers_rules.show_for_clickable_icon;
      }

      var hasLoginOrphans= checkDocumentForLoginOrphans(document);
      // where to stick this ?
      var fillhint;
 //     if (1) {
// tweak? do not try to evaluate forms that aren't visible as the
// subsequent hint will be wrong should the form be dynamically shown later...
      if (lpIsVisible(field.form)) {
        var ai =  field;
        var formid=null;  // this is symbolic index into forms_touched{} and passed to BG
        formid = pickFormName( ai.form );

        // hack for twitter.com
        var is_signup_form  = chk_form_ask_generate(document, ai.form);
        if ((((ai.form != null && chk_form_has_password(document, ai.form)) || hasLoginOrphans ) && !is_signup_form ) || g_is_specialsite) {
          sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'sites'});
          if (g_do_icon_number_hint) {
            fillhint='sites';
          }
        } else {
          sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'formfills'});
          if (g_do_icon_number_hint) {
            fillhint='formfills';
          }
        }
      }
     
      var didcreate=false;
      if (1) {
        // checkDocumentForLoginOrphans() is necessary to 
        // evaluate password INPUT fields outside of a FORM too

        // this test no longer makes sense, now that the page is being
        // evaluated on a per-form basis, is no longer latched onto from
        // notification bar, and this is no longer the primary method
        // of icon creation.  Needs to re-use logic that is now built up in
        // doc_create_clickable_icons() to be consistent.
        // if (popupfill_shoulddofield(document, field, SHOULD_DO_ALWAYS))  {
        //
        // g_is_specialsite is set when handling setprefs 
        if (checkForLoginForm(document) || hasLoginOrphans || g_is_specialsite) {
        
          //
          // define the html fragment for the popup iframe
          //
          // use a passed doc vs document, in case this is called from a frame ??
          var tld = lp_gettld_url(punycode.URLToASCII(document.location.href));
          // calling this returns some data in a gotpopupfillsites msg.
          // this then generates an html fragment and a savepopupfillhtml msg

          //sendBG({cmd:"getpopupfillsites", tld:tld});
          // wrap within setTimeout
          setTimeout(function() { sendBG({cmd:"getpopupfillsites", tld:tld}); }, 0);

          // the savepopupfillhtml message must be saved to the backend before the 
          // create_or_move_overlay_icon() call can run
    
          // wait 50 ms to give a chance for the above messages to process .
          // may not be necessary.  does need to detach to let the notification bar
          // display asynchronously with the clickable icons

          // note: response from getpopupfillsites will set g_popupfill_rows, which
          // will be needed for checking the never rule.  How the heck do you check for this ?
          // pass it to setTimeout so that g_never will get set; hopefully.

          if (((g_popupfill_rows > 0 && show_clickable_for_autofill) ||
            (g_popupfill_rows == 0 && show_clickable_for_save)) && show_clickable) {

            // NB: field may have name but no id.  if LP_getname returns '', it 
            // will be handled in create_or_move_overlay_icon()
            var fid = LP_getname(field);  
            // cannot reliably pass field here, spec the id 
            if (g_do_icon_number_hint) {
              setTimeout(function() { create_or_move_overlay_icon(document, fid, OK_CREATE, fillhint, g_icon_numbers); }, 50);
            } else {
              setTimeout(function() { create_or_move_overlay_icon(document, fid, OK_CREATE); }, 50);
            }

            if (g_save_suggest_msg && fillhint && typeof(g_icon_numbers) != null
                && typeof(g_icon_numbers['sites']) != null && (g_icon_numbers['sites'] < 1)) {
                    // this message goes away automatically.
                    //field.addEventListener('mouseover', function() { do_save_suggest_msg(event, document); 
                    //field.addEventListener('focus', function() { 
                    field.addEventListener('click', function() { 
                       var target = event.target;
                       // do_save_suggest_msg(event, document); 
                       setTimeout(function() {  do_save_suggest_msg(target, document); }, 0);  // detach 
                       event.preventDefault();
                       event.stopPropagation();
                       return false; } , false);
            }

            if (g_clickable_input) {
              if((field.type=="password" && formHasUsernameField(field)) && !g_clickable_input_on_password ) {
                   // case: if user clicked on a password field,
                   // what should be done. force user to click
                   // on the icon to open up?
                   // clicking on this will echo the password into the
                   // iframe. 
                   
                    // if g_clickable_input_on_password is enabled, then there is logic
                    // inside conditional_create_popup() to deal with the case where
                    // current field is password field.

              } else {
                // add to all inputs, or just those that have
                // icon container defined?  the latter requires
                // the clickable icons to have been created by the
                // time this runs.  is unclear that is true.
                //
                // now, do only for sites - do not open on click for formfills
                //
                if (field.getAttribute('clickev') !== 'true' && fillhint && fillhint == 'sites' ) {
                
                    // nb: changes custom attribute on base website!  unsure if this is best
                    field.setAttribute('clickev', 'true');  // prevent double registration
                    field.addEventListener('click', function() { 
                       var target = event.target;
                       //setTimeout(function() {  do_save_suggest_msg(target, document); }, 0);  // detach
                       // if there is an associated icon container,
                       // try to open it if the input field has been clicked.
                       //
                       var icon_container_id = MAGIC+LP_getname(target,LP_GETNAME_FAVOR_ID_OVER_NAME);
                       var ic = document.getElementById(icon_container_id) ;
                       if (ic != null) {
                         if (g_clickable_input_on_password) {
                           if (!is_your_popup_showing(document)) {
                             conditional_create_popup(document, target) ;
                           }

                         } else {


                           // this is probably not the right way.
                           set_active_username_password(document, field.form);

                           popupfilltoggle(document, icon_container_id, target, NO_FORCE_GENERATE,  FORCE_SHOW_NOHITS);
                         }
                       }

                       // overzealous.  EEE
                       //if (g_defensive) {
                       //  event.preventDefault();   
                       //  event.stopPropagation();
                       //}
                       return false; } , false);
                }
              }
            }
          }
        } else {
         console_log('login form not detected, do not inline');
        }
      }

      // old code for formfills excised here

    } // if (do_experimental_popupfill)
  }
        
  if (addlisteners && origwidth > 0 && origwidth < 54) {
    field.addEventListener('focus', function(event) { lphighlightField(field, false); }, false);
    if (do_experimental_popupfill) { 
      // when the clickable icons are used, do not show the background image
      // for these small fields
      field.addEventListener('blur', function(event) { lphighlightField(field, false); }, false);
    } else {
      field.addEventListener('blur', function(event) { lphighlightField(field, true); }, false);
    }
  }

  if (do_experimental_popupfill) {
    if (g_weaseled == false) {
      //weasel(200);  // every 200 ms ?
      weasel(100);    // 200ms is too slow
    }
    g_weaseled=true;
  } // if (do_experimental_popupfill)
}

function LP_fireEvent(element,event,type){
  if(!type) type='HTMLEvents';
        
  if (document.createEventObject){
    var evt = document.createEventObject();
    return element.fireEvent('on'+event,evt);
  } else{
    var evt = document.createEvent(type);
    evt.initEvent(event, true, true );
    return !element.dispatchEvent(evt);
  }
}
function LP_doSubmit(doc,f,submit_id){

  var dc=0;
  var d = doc;
  if(submit_id!=''){
    var submitbtn = d.getElementById(submit_id);
    if (!submitbtn) {
      var submitbtns = d.getElementsByName(submit_id);
      if (submitbtns && submitbtns.length > 0)
        submitbtn = submitbtns[0];
    }
    if (!submitbtn) {
      var inputelts = d.getElementsByTagName('INPUT');
      if (inputelts) {
        for (var k = 0; k < inputelts.length; k++)
          if (inputelts[k].value == submit_id)
            submitbtn = inputelts[k];
      }
    }
    if (!submitbtn) {
      var inputelts = d.getElementsByTagName('A');
      if (inputelts) {
        for (var k = 0; k < inputelts.length; k++)
          if (inputelts[k].href == submit_id)
            submitbtn = inputelts[k];
      }
    }
    if (submitbtn) {
      LP_fireEvent(submitbtn,'click','MouseEvents');
      dc = 1;
    }
  }

  if (!dc)
    dc=LP_InputClickToSubmit(doc, f, 'submit');
  if(!dc)
    dc=LP_InputClickToSubmit(doc, f, 'image');
  if(!dc)
    dc=LP_InputClickToSubmit(doc, f, 'button');
  if(!dc) {

    var tld = lp_gettld_url(punycode.URLToASCII(doc.location.href));
    if(tld!='bankofamerica.com'){
      try{ LP_fireEvent(f,'submit'); }catch(e){}
      try { f.submit(); } catch(e) { return e.toString(); } 
    }

    // The above fireEvent doesn't always work because some fools block the
    // onSubmit of the form.  So we also try to hit 'enter' in the password
    // field if there is one after a half second...
    // THIS MAY NEED TO BE REMOVED IF WE START SEEING FORM SUBMISSION ISSUES.
    var pw_input = null;
    var inputelts = doc.getElementsByTagName("INPUT");
    if (inputelts) {
      for (var k = 0; k < inputelts.length; k++)
         if (inputelts[k].type == 'password')
           pw_input = inputelts[k];
    }
    if(pw_input) {
      //LP.log("pw_input submit by enter attempt");
      pw_input.focus();
      var evt = doc.createEvent('KeyboardEvent');
      // create a key event
      evt.initKeyboardEvent("keypress",       //  in DOMString typeArg,
                       true,             //  in boolean canBubbleArg,
                       true,             //  in boolean cancelableArg,
                       lpgettop(),
                       'Enter', 0, false, false, false, false
                       );
      // wait 500ms in an attempt to avoid double form submission issues...
//comment out until we can make this work.
//      setTimeout(function() { pw_input.dispatchEvent(evt); }, 500);
    }
  }
}

//
// case: on tmobile.com, search field is in a form but login fields are not.
// net result is that the search field is stored first, and then that field/value
// is selected as the username down the road by getusernamefromacct().  unsure
// how to deal with this.
//
function LP_get_form_save_all()
{
  var o = '';
  var forms = document.getElementsByTagName('form');
  var bad_name_array = new Array('');
  for (var i = 0; i < forms.length; i++) {
    o += LP_get_form_save(forms[i], true, bad_name_array);
  }

  //Lastly, do inputs that are not part of a form
  o += LP_get_form_save_orphans(bad_name_array) ;

  return o;
}

// carved out from LP_get_form_save_all()
//
// bad_name_array is optional, passed in from LP_get_form_save_all().
// need to init it as empty array if it is not passed in, to avoid
// errors in lp_in_array
//
// return a chunk of text to append to the formdata object
// return empty string if there are no relevant input fields
function LP_get_form_save_orphans(bad_name_array) {
  if (bad_name_array == null) {
    bad_name_array = [];
  }
  var o = '';
  var otherinputs = '';
  var tagnames = new Array('input', 'select', 'textarea');
  for (var j = 0; j < tagnames.length; j++) {
    var inputs = document.getElementsByTagName(tagnames[j]);
    for (var i = 0; i < inputs.length; i++) {
      if(inputs[i].form == null || lp_in_array(LP_getname(inputs[i]), bad_name_array)){
        var hasNonHidden = {};
        var haspassword = {};
        var altname = lp_in_array(LP_getname(inputs[i]), bad_name_array) ? tagnames[j] + i : null;
        otherinputs += LP_get_field_text('', inputs[i], hasNonHidden, haspassword, false, altname);
      }
    }
  }
  if(otherinputs!=''){
    otherinputs+='0\taction\t\taction\n';
    otherinputs+='0\tmethod\t\tmethod\n';
    o += otherinputs;
  }

  return o;
}


function LP_get_form_save(f, save_all, bad_name_array)
{
  var o = '';
  var hasNonHidden = {};
  hasNonHidden.value = 0;
  var inputs = f.elements;
  // f.elements may contain items that are not INPUTs such as LABELs, FIELDSETs, etc
  // might be useful to process the FIELDSETs
  //
  var haspassword = {};
  haspassword.value = false;
  var eltnamesdone = new Array();
  var eltidsdone = new Array();
  var dupeltnames = new Array();
  var dupeltids = new Array();
  if (save_all) {
    for(var i=0;i<inputs.length;i++){
      if (typeof(eltnamesdone[inputs[i].name]) != 'undefined') {
        dupeltnames[inputs[i].name] = true;
      }
      eltnamesdone[inputs[i].name] = true;
      if (typeof(eltidsdone[inputs[i].id]) != 'undefined') {
        dupeltids[inputs[i].id] = true;
      }
      eltidsdone[inputs[i].id] = true;
    }
  }
  for(var i=0;i<inputs.length;i++){
    if (save_all) {
      var name = LP_getname(inputs[i]);
      if ((name == '' || (typeof(dupeltnames[name]) != 'undefined' && typeof(dupeltids[name]) != 'undefined'))) {
        bad_name_array[bad_name_array.length] = name;
        continue;
      }
    }
    o += LP_get_field_text(LP_getname(f), inputs[i], hasNonHidden, haspassword, save_all);
  }
  if (haspassword.value && !lpCheckWarnInsecure(f, f.ownerDocument, true)) {
    	return null;
  }
  o+='0\taction\t'+LP_en(f.action)+'\taction\n';
  o+='0\tmethod\t'+LP_en(f.method)+'\tmethod\n';
  if(hasNonHidden.value) return o;
  return '';
}


function LP_get_field_text(formname, input, hasNonHidden, haspassword, save_all, altname){
  var o = '';
  var name = altname ? altname : LP_getname(input);
  var type = input.type;
  var el = input; 
  var val = LP_truncate_text_if(input.value);
  var seen  =  (checkIsDisplayed(document, el,  0)) ? "seen" : "notseen";

  if (save_all && val == '' && input.name && input.name != '') {
    var elts = document.getElementsByName(input.name);
    for (var j = 0; j < elts.length; j++) {
      if (LP_getname(elts[j].form) == formname && LP_getname(elts[j]) == name && elts[j].type == type && elts[j].value != '') {
        return '';
      }
    }
    // XXX NB: getElementsByName ignores inputs that match on id, not name
  }

  if (type == 'password') {
    haspassword.value = true;
  }
  if('password'==type || 'text'==type || 'email' == type || 'tel' == type || 'textarea'==type || 'hidden'==type) {
    if('hidden'!=type) hasNonHidden.value = 1;

    if (!save_all && lpsavedform == el.form) {
      for (var i = 0; i < lpsavedformfields.length; i++) {
        if (lpsavedformfields[i].name == LP_getname(el)) {
          if (lpsavedformfields[i].value != val) {
            if (val == '' || val.match(/^\*+$/))
              val = lpsavedformfields[i].value;
            else if (val.length == lpsavedformfields[i].value.length) {
              var match = true;
              for (var j = 0; j < val.length; j++) {
                if (val.charAt(j) != lpsavedformfields[i].value.charAt(j) && val.charAt(j) != '*') {
                  match = false;
                  break;
                }
              }
              if (match)
                val = lpsavedformfields[i].value;
            }
          }
          break;
        }
      }
    }

    if (type == 'password') {
      for (var i = 0; i < lpsharedpasswordfills.length; i++) {
        if (lpsharedpasswordfills[i] == el) {
          val = '';
          break;
        }
      }
    }

    // OUTPUT
    // o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type) +'\n';     
    o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type)+'\t'+seen+'\n';     

  }else if('checkbox'==type || 'radio'==type){ 
    val += input.checked ? '-1' : '-0'; 
    // OUTPUT
    // o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type) +'\n';
    o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type)+'\t'+seen+'\n';

  }else if('select-one'==type || 'dropdown'==type || 'select-multiple'==type){
    if (type == 'select-multiple') { 
      val = ''; 
      var prepend = ''; 
      for (var k = 0; k < el.options.length; k++) { 
        if (el.options[k].selected) { 
          val += prepend + LP_en(el.options[k].value); 
          prepend = '|'; 
        } 
      } 
    } else if (el.selectedIndex < 0 || el.selectedIndex >= el.options.length || typeof(el.options[el.selectedIndex])=="undefined") { 
      val = ''; 
    } else { 
      val = el.options[el.selectedIndex].value; 
    } 
    // OUTPUT
    //o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type) +'\n';
    o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type)+'\t'+seen+'\n';
  }else if('image'==type){
    val = el.src; 
    // OUTPUT
    //o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type)+'\n';
    o+=formname+'\t'+LP_en(name)+'\t'+LP_en(val)+'\t'+LP_en(type)+'\t'+seen+'\n';
  } 
  return o;
} 

function evaluntilfindmanual(force){
  //alert("inside onload.js : evaluntilfindmanual");

  if(!g_foundmanual || (typeof(force)!="undefined" && force)){
    //console_log('rerunning eval scripts ' + lpgettop());
    var doc = lpgettop().document;
    hookAllFormSubmits(doc);
    try {
      for(var i = 0; doc.frames && i < doc.frames.length; i++){
        hookAllFormSubmits(doc.frames[i].document);
      }
    } catch (e) {
    }
    lpgettop().setTimeout(function(){evaluntilfindmanual()}, 500);
  }
}

//
// form detection:
// handler for focus event on form input, inside hookAllFormSubmits.
// sends CS->BG: checkgenpwfillforms msg
//
function lpfieldfocus(evt)
{
  var target = evt ? evt.target : this;
  if (target.form && target.form.getAttribute("_lpchecked")==null) {
    target.form.setAttribute("_lpchecked", "1");
    sendBG({cmd: 'checkgenpwfillforms', url: punycode.URLToASCII(document.location.href)});
  }

  if (do_experimental_popupfill ) {
    var form_id = pickFormName(target.form);

    sendBG({cmd:"setpopupfilllastactive", active: form_id, activefieldid: LP_getname(target ,LP_GETNAME_FAVOR_ID_OVER_NAME), activefieldtype: target.type });

    // due to focus in popupfillscreateack MSG handler, need to add this
    // case: INPUT field is focused, iframe exists but associated with a different INPUT
    //     disposition: close
    // case: INPUT field is focused, iframe exists and associated with this INPUT
    //     disposition: do nothing
    // case: INPUT field is focused, iframe does not exist
    //     disposition: check if a password field, and create generate popup. (or formfill/show)
    // case: after initial page load, user has clicked on an icon, created popup iframe, and focus inside
    //     popupfillscreateack calls lpfieldfocus().  g_last_field_focused==null but g_popupfill_shown==1
    //     disposition: do not call closepopupfills, as it will be closing what was just created
    // case: iframe just created for this INPUT, and popupfillscreateack calls focus on the INPUT.
    //     g_popupfill_shown will have been just been set; g_last_field_focused if changing INPUT fields, 
    //     and will unfortunately trigger
    // case: generate password, and user clicks accept; password field is populated.  there is a focus
    //     inside populategeneratedpassword() but it should not create popup 

    g_last_field_focused = target;  // must be after checkAskGenerate
  }


// do not pop up generate on focus any more.
//
//I think this should go here -- need to check with Mike
//
//  if(do_experimental_popupfill && target.type=="password" && target.form && formLooksLikeSignup(target.form)){
//    var icon_container_id = MAGIC+LP_getname(target,LP_GETNAME_FAVOR_ID_OVER_NAME);
//    if ((!g_popupfill_shown || (target != g_popupfill_parent) ) && !g_do_pwgen) {
//      popupfilltoggle(document, icon_container_id, target, FORCE_OFFER_GENERATE, FORCE_SHOW_NOHITS); 
//    }
//  }

}

function formLooksLikeSignup(f){
  var formElements = f.elements;
  var pw = 0, text = 0;
  for(var j=0;j< formElements.length;j++){
    var elt = formElements[j];
    if(elt.type=="text" || elt.type=="email")
      text++;
    else if(elt.type=="password")
      pw++;
  }
  if(pw >= 2 || (pw==1 && text >= 3))
    return true;
  return false;
}

function lpfieldchange(evt)
{
  var target = evt ? evt.target : this;
  if (target.form) {
    lpsavedform = target.form;
    var elt = target;
    if (LP_getname(elt) != '' && ('text' == elt.type || 'email' == elt.type || 'tel' == elt.type || 'password' == elt.type)) {
      var found = false;
      for (var i = 0; i < lpsavedformfields.length; i++) {
        if (lpsavedformfields[i].formname == LP_getname(lpsavedform) && lpsavedformfields[i].name == LP_getname(elt)) {
          lpsavedformfields[i].value = elt.value;
          found = true;
          break;
        }
      }

      if (!found) {
        var fi = new Object();
        fi.name = LP_getname(elt);
        fi.type = elt.type;
        fi.value = elt.value;
        fi.formname = LP_getname(lpsavedform);
        lpsavedformfields[lpsavedformfields.length] = fi;
      }
    }
  }
}


//------------------------------------------------------
//This is meant to only be temporary implementation of the notification bar. 
//It has known deficiencies such as not scrolling, etc.
function lpshownotification(type, data)
{
//  if(type=='formfill' || type=='generate')
//    return;
  if(typeof(NONOTIFICATIONS)!='undefined')
    return;

  //If this is an xml page, then we do not want to write javascript to it.
  if(document.getElementById('xml-viewer-style')){
    return;
  }



  try{
    if(type!="context" && (document.getElementById('lastpass-notification') || document.getElementById('lpiframeoverlay' + g_iframerand))){
      //Probably need to establish importance, for now, just keep current
      //console_log("Already added");
      return;
    }
  

    var thetop = lpgettop();
    if(typeof(thetop)!='undefined' && typeof(thetop.location)!='undefined' && typeof(thetop.location.href)!='undefined' && thetop && window!=thetop){
      //console_log("Not top doc");
      return;
    }
  
    var body = document.body;
    if(!body){
      //console_log("No body");
      return;
    }
  
    if(typeof(data['docnum'])!='undefined' && g_docnum!=data['docnum']){
      //console_log("Different docnum");
      return;
    }

    //Dont show fill if we cant find a login form
    var show = true;
    if (type == 'fill') {
      if (!checkForLoginForm(document)) {
        show = false;
      } else {
        // verify that data[sites] is defined here
        var autofillarray = getAutoFillArray(document, LPJSON.parse(data['sites']));
        if (getcount(autofillarray) == 1) {
          for (var i in autofillarray) {
            show = typeof(autofillarray[i]['fields']) == 'undefined' || getcount(autofillarray[i]['fields']) == 0 || !canFindForm(autofillarray[i]['fields']) || !g_fillaid;
            break;
          }
        }
      }

      if (g_fillaid == null) {
        data['text'] = gs("Simplify your life: Use LastPass to autofill in this site's login info!");
      }
    }
    if(!show) {
      //console_log("No login form, don't show fill notification");  // DEBUG
      if (typeof(lpNotificationsAfterClick) == 'undefined' || !lpNotificationsAfterClick) {
        sendBG({cmd: 'checkgenpwfillforms', url: punycode.URLToASCII(document.location.href)});
      }
      return;
    }
  

    if(!experimentaloverlay){
      addStyle();
    }

    //Write some JS to the page that will be called when user interacts with the bar
    if ((g_isopera || g_ismaxthon) && !experimentaloverlay && type=='fill') {
      // hack for displying extended tabular output for autofill/autologin
      // for opera and maxthon only
      run_custom_js(document, showExtTableScript());
    } else {
      run_custom_js(document, showMenuScript());
    }

    var div = null;

    if(!experimentaloverlay){
      div = document.createElement('div');
      div.id = 'lastpass-notification';
      div.style.background = get_notification_bg();
      div.style.backgroundRepeat = 'repeat-x';
 //   div.style.width = '100%';
      if(g_isopera || g_ismaxthon) 
          div.unselectable = 'on'; 
  

      //Compensate for body margins, may need to extend bar outwards
      var bodystyle = window.getComputedStyle(body, null);
      div.style.marginLeft = -1 * (parseInt(bodystyle.getPropertyValue('margin-left')) + parseInt(bodystyle.getPropertyValue('padding-left')) + parseInt(bodystyle.getPropertyValue('border-left-width'))) + "px";
      div.style.marginRight = -1 * (parseInt(bodystyle.getPropertyValue('margin-right')) + parseInt(bodystyle.getPropertyValue('padding-right')) + parseInt(bodystyle.getPropertyValue('border-right-width'))) + "px";
      div.style.marginTop = -1 * (parseInt(bodystyle.getPropertyValue('margin-top')) + parseInt(bodystyle.getPropertyValue('padding-top'))+ parseInt(bodystyle.getPropertyValue('border-top-width'))) + "px";
    }
  
    var divhtml = '';
    var overlayval = 1;

    //OK, now make the bar
    // Can't do this, causes secure/insecure errors.
    //div.innerHTML = '<img src="'+chrome.extension.getURL('icon.gif')+'"/> ';
    var operahack = g_isopera ? 'float:left;' : '';
    divhtml = '<img width="16" height="16" style="width:16px;height:16px;display:inline;' + operahack + '" src="data:image/gif;base64,R0lGODdhEAAQAPQfAHEAGq9RZp8BJfT09JkCJKUuSO/q6/n//vHh5YYBGvf6+tOyucB0hsuLmpUiOpIAHIgJJtzFy7pneuvT2fP49/Dw8L5/juS+x8Scpn4BHaMDJ3cAHHQAG6YDKP///3gAFiH/C1hNUCBEYXRhWE1QRj94cDI2NkQzRERDQjk3IiB4bXBNTTpJbnN0YW5jZUlEPVJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ALAAAAAAQABAAAAWYYCeOZNlpKCoIKptq60p0xVo4RCwQORFMCM3jggjIeLxHwONhFJiMBzL5SDQ8iIln8ehSHYGAZHA4KBrhQre6LA/eZKYlUU0EFBVDBa5XMBKACRAOYBUUhxKEEIAZjRkfCwcRkREQH46OHwEHFAEOFQcWl40bpRwOGAsAH6kFH6WwpQAcEAAbGRy2sBy8vbO5vb4Aw8TFxiEAOw=="/>';

  if(typeof(data['icon'])!='undefined')
    divhtml = '<img style="display:inline;' + operahack + '" src="'+data['icon']+'"/>';
  
    var close_img_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYklEQVR42qXTvWrCUBQHcKe+QqfundPFxT0OnTJ0MtChmw/g4NgH6FtkEwoBv8BEA8EYFGswBIIEhFCrU4V26cfp+Qe5RLlKwcAPknty/7mHe1NoNBoy9+yZJWzBcN3J3j0cuGJJt9ul0WhEYRjSfD4nz/Oo0+kQ10J2eSygyL4xcb1eyyAUIV/sWhawHY/HtFqtTvJ9HyGbw4B6r9ejNE3/ZdfOQz4gnkwmtFwuM7VajRRFIcMwyLIs3GNM1HetePmA9yAIKEkSoVqtUrlcBtzv1abTKQJe9wIwGMexgGd8GQ5rvFoEvOUDFtiqKIoEXddJVdWMpml7Ndd1EfCSD3jC3mPPoVKpUKlUItM0AavAmKi3220E1PMBF+zTcRyazWYn9ft9Qsuyc3DLfm3bRs8y2BFM/mFFWQDcsE2r1SKsZjgcZgaDATWbTUxOxSmUBwiPLGEfOzGrH/uZzlIgorP8ASYfyJK1fcokAAAAAElFTkSuQmCC';
    var x3_img_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR42qXTsWrCUBTGcaFroZNTwQfo1KnQN3CQblLIkD2CFIqbaEBQsGAIJBAaCIoQI4JKoeADFDpVmuCsUyE4FJyznJ4vSEjkKgWFH4R7cv/RS8zNZjORO/bMXDZkT+xWdO/hwtV+E02n0wxeg1d2eSxQYD+TyYRc1xXiGSIblhcFPnGT4zgnjUYjRBaHgaLneWSa5r+Mx2NE7tOBvmVZ1O22Y8vlkqIoovl8ToPBANdYS+a2bSPwkg58YNBsNhNBENB2uwVcZ2a9Xg+Bt0yg1WpRrVZLNBoNPBlwnZm1220E3tOBIQKKoiRWqxWFYRhbr9eZWafTQcBIBx4NwyBZlmO+79Nut8OTAd8Ca8kc54WDTwcu2He9XqdyuXySqqqEnyx6D27YLyKlUkkEB4jNISuIAnDNFpqmUaVSIUmSYtVqlXRdx2Z88uJXOeuBuexrr8+Kx/5MZ8kR0Vn+AGczfuZVuZDxAAAAAElFTkSuQmCC';

    divhtml += '<div id="lastpass-content" style="color:white;' + g_webkit_selectable + '" ' + g_opera_selectable + '>'+data['text']+'</div>';
  
    //Floating right the rest, so work backwards. 
    if(experimentaloverlay)
      divhtml += '<img width="16" height="16" lptype="close" src="'+close_img_src+'" id="lphideoverlay" style="width:16px;height:16px;float: right; margin-right: 10px; margin-bottom: -10px;"/> ';
    else
      divhtml += '<img width="16" height="16" lptype="close" src="'+close_img_src+'" onmouseover="this.src=\''+x3_img_src+'\'" onmouseout="this.src=\''+close_img_src+'\'" style="width:16px;height:16px;float: right; margin-right: 10px; margin-bottom: -10px;" onclick="this.dispatchEvent(lpcustomEvent); document.getElementById(\'lastpass-notification\').style.display=\'none\'"/> ';

    var from = 0;
    if(type=='fill')
      divhtml += createFillMenus(data);
    else if(type=='add'){
      divhtml += createAddButtons(data);
      from = 1;
      if(div)
        div.style.background = get_notification_add_bg();
    } else if (type == 'generate') {
      divhtml += createGenerateButtons(data);
      from = 2;
    } else if (type == 'formfill') {
      divhtml += createFormFillButtons(data);
      from = 3;
    } else if (type == 'change') {
      divhtml += createChangeButtons(data);
    } else if (type == 'error') {
      divhtml += createErrorButtons(data);
      if (typeof(data['yellow']) == 'undefined' || !data['yellow']){
        if (div) 
          div.style.background = "#ff0000";
      }else{
        overlayval=2;
      }
    } else if (type == 'basicauth') {
      divhtml += createBasicAuthButtons(data);
    } else if (type == 'context') {
      divhtml = createContextMenu(data);
      overlayval = "context";
    }
  
    if(div)
      div.innerHTML = divhtml + "</div>";

    // this gets run only by Opera and Maxthon, for autologin/autofill
    if ((g_isopera || g_ismaxthon) && !experimentaloverlay && (type =='fill')) {
      run_custom_js(document, "document.addEventListener('mouseup', " +
        "function(e){ " +
          "if(typeof(closelpmenus)=='function') { " +
            "if (!chk_should_close_exttable(e)) { " +
              " return; " +
            "} " +
            "closelpmenus(); " +
          "} }, false)");
    } else {
      //Make menus disappear on mouse up
      run_custom_js(document, "document.addEventListener('mouseup', function(e){ if(typeof(closelpmenus)=='function'){closelpmenus();}}, false)");
    }
  
    if(div)
      body.insertBefore(div, body.firstChild);

    if ((g_isopera || g_ismaxthon) && !experimentaloverlay && (type =='fill')) {
      // this gets run only by Opera and Maxthon, for autologin/autofill
      initialize_sorttable();  // only needed for opera and maxthon.  has to run after
			// the HTML fragments have been added to the doc.
    }
    curr_notification_type = type;

    // XXX retrofit for popup fills
    // perhaps set up a new message and handler rather than
    // latch onto shownotification.
    //
    //   if (do_experimental_popupfill) {
    if (do_experimental_popupfill && 
      ((type == "fill" ) || 
       (type == "formfill" ))
      ) {

      var popupfillhtml=""; 
      var do_create=false;


      // case:
      // create an account page
      // has password fields, so checkForLoginForm() will appear true
      // but will also have many other fields, so checkForNonLoginForm() will also appear true.
      // 
      if ((type == "fill" ) ||
          (type == "formfill" )) {
        // evaluate password INPUT fields outside of a FORM too
        //if (checkForLoginForm(document)) {
        if (checkForLoginForm(document) || checkDocumentForLoginOrphans(document) ) {
          // data[sites] or data[formfills] gets passed along from BG from 
          //    lpshownotification
          // these are only set on certain types of notifications.
    
          // verify that data[sites] is defined here .  if not, then LPJSON.parse fails
          // with a "token unexpected" error

          // case: logout, then login again.  'fill' notification occurs
          // case: there are 2 forms on a page (e.g. facebook.com)
          //   one is a login form, the other is a non-login form. 
          //   sometimes, the LP notification bar picks up the first one and 
          //   offers site autofill/autologin choices, sometimes it picks up 
          //   the second one and offers form fill choices.  Is this random
          //     or deterministic?
          //
          if (typeof(data['sites'])!='undefined' )   {  //login form
            popupfillhtml += createPopupFill(document, data);
            var autofillsites = getAutoFillArray(document, LPJSON.parse(data['sites']));

            g_autofillsites = autofillsites;  // cache/save this - needed ?
            g_popupfill_rows= getcount(autofillsites);  // for popupfill_create_iframe
            if (verbose) {
              L('['+g_docnum+']g_popupfill_rows = '+g_popupfill_rows);
            }
            sendBG({cmd:"savepopupfillhtml", text:popupfillhtml, rowtype : 'sites' });
            do_create=true;

            // if no autofillsites, presume user has no saved aids for this site.
            //   check to see if the 'never save site' rule applies in this case.
            // if there are autofillsites, user has saved aids for this site.
            //   check to see if the 'never autofill' rule applies in this case.
              // wrapped inside setTimeout() so that the notification bar displays
              // correctly with clickable icons.
              //setTimeout(function() { doc_create_clickable_icons(data, '', SHOULD_DO_LOGIN_ONLY); }, 10);
              setTimeout(function() { doc_create_clickable_icons(data, '', SHOULD_DO_ALWAYS); }, 10);
          }
        }  // check for login
      }
     
      // case: don't send the MSG here if empty formfill notification MSG comes in and 
      // overwrites html written for previous fill notification MSG.
      //sendBG({cmd:"savepopupfillhtml", text:popupfillhtml });
      //
      // code excised here.


    } // if (do_experimental_popupfill) 


    if(experimentaloverlay){
      var extra = {document_location_href: punycode.URLToASCII(document.location.href), g_fillaid: g_fillaid, from: from, type: type};
      if (typeof(data['notificationdata']) != 'undefined') {
        extra['notificationdata'] = data['notificationdata'];
      }
      sendBG({cmd:"savenotificationhtml", text:divhtml, extra: LPJSON.stringify(extra)});
      showoverlay(data, "&"+type+"="+overlayval);
    }
  }catch(e){
    console_log("lpshownotification: " + e.message);
  }
}

function lpclosenotification(includeerror, excludeother)
{
  if((document.getElementById('lastpass-notification') || document.getElementById('lpiframeoverlay' + g_iframerand)) && (includeerror || curr_notification_type != 'error') && (!excludeother || curr_notification_type == 'error')){
    if (document.getElementById('lastpass-notification')) {
      document.body.removeChild(document.getElementById('lastpass-notification'));
    } else {
      document.body.removeChild(document.getElementById('lpiframeoverlay' + g_iframerand));
    }
    curr_notification_type = '';
  }
}

function sitesMatchTLD(sites)
{
  var tld = lp_gettld_url(punycode.URLToASCII(document.location.href));
  for(var i in sites){
    if(tld == lp_gettld_url(sites[i]['url']))
      return true;
  }
  return false;
}


//------------------------------------------------------
//Create the buttons and menus for the autofill/autologin notification bar
function createFillMenus(data)
{
  var html = "";

  var autofillsites = getAutoFillArray(document, LPJSON.parse(data['sites']));
  var autofillsitescount = getcount(autofillsites);
  var autologinsites = getAutoLoginArray(autofillsites);
  var autologinsitescount = getcount(autologinsites);

  //First create the buttons
  if(experimentaloverlay)
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"'>"+gs('Never...')+"</button>";
  else
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"' onclick='lpshowmenudiv(\"never\");return false;'>"+gs('Never...')+"</button>";
  if (autofillsitescount == 1) {
    for(var i in autofillsites){
      if(experimentaloverlay)
        html += "<button lptype='autofillsingle' aid=\""+autofillsites[i]['aid']+"\" type='button' id='lpautofill' class='lpbutton' value='"+gs('AutoFill')+"'>"+gs('AutoFill')+"</button>";
      else
        html += "<button lptype='autofillsingle' aid=\""+autofillsites[i]['aid']+"\" type='button' id='lpautofill' class='lpbutton' value='"+gs('AutoFill')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('AutoFill')+"</button>";
    }
  } else {
    if(experimentaloverlay)
      html += "<button id='lpautofill' class='lpbutton' value='"+gs('AutoFill')+" ("+ autofillsitescount + ")'>"+gs('AutoFill')+" ("+ autofillsitescount + ")</button>";
    else  {
      // onclick, calls lpshowmenudiv() in notification.js
      html += "<button id='lpautofill' class='lpbutton' value='"+gs('AutoFill')+" ("+ autofillsitescount + ")' onclick='lpshowmenudiv(\"autofill\")'>"+gs('AutoFill')+" ("+ autofillsitescount + ")</button>";
    }
  }
  if(1==autologinsitescount) {  // deal with a single autologin left -- no sense making a menu for this case.
    for(var i in autologinsites){
      if(experimentaloverlay)
        html += "<button lptype='autologinsingle' aid=\""+autologinsites[i]['aid']+"\" type='button' id='lpautologin' class='lpbutton' value='"+gs('AutoLogin')+"'>"+gs('AutoLogin')+"</button>";
      else
        html += "<button lptype='autologinsingle' aid=\""+autologinsites[i]['aid']+"\" type='button' id='lpautologin' class='lpbutton' value='"+gs('AutoLogin')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('AutoLogin')+"</button>";
    }
  } else if(autologinsitescount>0) {
    if(experimentaloverlay)
      html += "<button id='lpautologin' class='lpbutton' value='"+gs('AutoLogin')+" ("+ autologinsitescount + ")'>"+gs('AutoLogin')+" ("+ autologinsitescount + ")</button>";
    else  {
      // onclick, calls lpshowmenudiv() in notification.js
      html += "<button id='lpautologin' class='lpbutton' value='"+gs('AutoLogin')+" ("+ autologinsitescount + ")' onclick='lpshowmenudiv(\"autologin\")'>"+gs('AutoLogin')+" ("+ autologinsitescount + ")</button>";
    }
  }

  //Now create the menus. Keep them hidden until the user presses the button.
  //It is much easier to create now and hide than pass the data to the page and dynamically show when click
  if(autologinsitescount>0)
    html += createMenu('autologin', autologinsites, autologinsitescount);
  html += createMenu('autofill', autofillsites, autofillsitescount);
  var showneverautofill = g_fillaid!=null;
  html += createNeverMenu(showneverautofill);


  if(!experimentaloverlay){
    //Setup event handler for when someone clicks on a menu choice
    // currently, only used by Opera and Maxthon
    document.addEventListener('lpCustomEventMenu', function(e) {

      var lptype = e.srcElement.getAttribute('lptype');
      if(lptype=='autologin'){
        sendBG({cmd:"autologinaid", aid:e.srcElement.getAttribute('aid')});
        document.getElementById('lppopupautologin').style.display = 'none';
      }else if(lptype=='autologinsingle'){
        sendBG({cmd:"autologinaid", aid:e.srcElement.getAttribute('aid')});
        document.getElementById("lastpass-notification").style.display="none";
      }else if(lptype=='autofill'){
        sendBG({cmd:"autofillaid", aid:e.srcElement.getAttribute('aid')});
        document.getElementById('lppopupautofill').style.display = 'none';
      }else if(lptype=='autofillsingle'){
        sendBG({cmd:"autofillaid", aid:e.srcElement.getAttribute('aid')});
        document.getElementById("lastpass-notification").style.display="none";
      }else if(lptype=='neverautofill' || lptype=='neverpage' || lptype=='neverdomain'){
        sendBG({cmd:lptype, url:punycode.URLToASCII(document.location.href), aid:g_fillaid});
        document.getElementById('lppopupnever').style.display = 'none';
        document.getElementById('lastpass-notification').style.display='none';

      // VVV following events are for the extended tabular display
      }else if(lptype=='autofilltabsearchboxreset'){
        clear_searchbox('autofill');
      }else if(lptype=='autologintabsearchboxreset'){
        clear_searchbox('autologin');
      }else if(lptype=='autologintabsearchbox'){
        dofilter('autologin');
        // trying to intercept ESCAPE key here doesn't seem to work, Opera
        // seems to be eating them.
      }else if(lptype=='autofilltabsearchbox'){
        dofilter('autofill');
      }
    }, false);  // end event handler
  }
  return html;
}

//------------------------------------------------------
//Create buttons for 'Add Site' case
function createAddButtons(data)
{
  var html = "";

  if(experimentaloverlay)
    html += "<button type='button' lptype='notnow' id='lpnotnow' class='lpbutton' value='"+gs('Not Now')+"'>"+gs('Not Now')+"</button>";
  else
    html += "<button type='button' lptype='notnow' id='lpnotnow' class='lpbutton' value='"+gs('Not Now')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Not Now')+"</button>";
  if(experimentaloverlay)
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"'>"+gs('Never...')+"</button>";
  else
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"' onclick='lpshowmenudiv(\"never\");'>"+gs('Never...')+"</button>";
  if(experimentaloverlay)
    html += "<button type='button' lptype='addsite' id='lpaddsite' class='lpbutton' value='"+gs('Save Site')+"'>"+gs('Save Site')+"</button>";
  else
    html += "<button type='button' lptype='addsite' id='lpaddsite' class='lpbutton' value='"+gs('Save Site')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Save Site')+"</button>";

  html += createNeverMenu(0, 1);


  if(!experimentaloverlay){
    //Setup event handler for when someone clicks on buttons or menu choice
    document.addEventListener('lpCustomEventMenu', function(e) {
      var lptype = e.srcElement.getAttribute('lptype');
      if(lptype=='addsite'){
        sendBG({cmd:'savethesite',notificationdata:data['notificationdata']});
        document.getElementById('lastpass-notification').style.display='none';
      }else if(lptype=='notnow'){
        sendBG({cmd:'notnow',notificationdata:data['notificationdata'],tld:lp_gettld_url(punycode.URLToASCII(document.location.href))});
        document.getElementById('lastpass-notification').style.display='none';
      }else if(lptype=='close'){
        sendBG({cmd:"clearnotification"});
      }else if(lptype=='neverpage' || lptype=='neverdomain'){
        var url = LPJSON.parse(data['notificationdata'])['url'];
        sendBG({cmd:lptype, url:url, fromsave:'1', notificationdata:data['notificationdata'],tld:lp_gettld_url(punycode.URLToASCII(document.location.href))});
        document.getElementById('lppopupnever').style.display = 'none';
        document.getElementById('lastpass-notification').style.display='none';
      }
      
    }, false);
  }
  return html;
}

//------------------------------------------------------
//Create buttons for 'Change Password' case
function createChangeButtons(data)
{
  var html = "";
  if(experimentaloverlay)
    html += "<button type='button' lptype='savenewsite' id='lpsavenewsite' class='lpbutton' value='"+gs('Save New Site')+"'>"+gs('Save New Site')+"</button>";
  else
    html += "<button type='button' lptype='savenewsite' id='lpsavenewsite' class='lpbutton' value='"+gs('Save New Site')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Save New Site')+"</button>";


  if(experimentaloverlay)
    html += "<button type='button' lptype='confirm' id='lpconfirm' class='lpbutton' value='"+gs('Confirm')+"'>"+gs('Confirm')+"</button>";
  else
    html += "<button type='button' lptype='confirm' id='lpconfirm' class='lpbutton' value='"+gs('Confirm')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Confirm')+"</button>";

  if(!experimentaloverlay){
    //Setup event handler for when someone clicks on buttons or menu choice
    document.addEventListener('lpCustomEventMenu', function(e) {
      var lptype = e.srcElement.getAttribute('lptype');
      if(lptype=='savenewsite'){
        sendBG({cmd:'savethesite',notificationdata:data['notificationdata']});
        document.getElementById('lastpass-notification').style.display='none';
      } else if(lptype=='confirm'){
        sendBG({cmd:'changepw',notificationdata:data['notificationdata']});
        document.getElementById('lastpass-notification').style.display='none';
      }else if(lptype=='close'){
        sendBG({cmd:"clearnotification"});
      }
      
    }, false);
  }
  return html;
}

function createErrorButtons(data)
{
  var html = "";
  if (data['notificationdata']['multifactor_disable_url']) {
    if(experimentaloverlay)
      html += "<button type='button' lptype='disablebtn' id='lpdisablebtn' class='lpbutton' value='"+gs('Disable Multifactor Authentication')+"'>"+gs('Disable Multifactor Authentication')+"</button>";
    else
      html += "<button type='button' lptype='disablebtn' id='lpdisablebtn' class='lpbutton' value='"+gs('Disable Multifactor Authentication')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Disable Multifactor Authentication')+"</button>";
  }
  if (data['notificationdata']['showCreateAccount']) {
    if(experimentaloverlay)
      html += "<button type='button' lptype='createaccountbtn' id='lpcreateaccountbtn' class='lpbutton' value='"+gs('Create Account')+"'>"+gs('Create Account')+"</button>";
    else
      html += "<button type='button' lptype='createaccountbtn' id='lpcreateaccountbtn' class='lpbutton' value='"+gs('Create Account')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Create Account')+"</button>";
  }
  if (data['notificationdata']['custombutton'] && data['notificationdata']['customaction']) {
    if(experimentaloverlay)
      html += "<button type='button' lptype='custombtn' id='lpcustombtn' class='lpbutton' value='"+gs(data['notificationdata']['custombutton'])+"'>"+gs(data['notificationdata']['custombutton'])+"</button>";
    else
      html += "<button type='button' lptype='custombtn' id='lpcustombtn' class='lpbutton' value='"+gs(data['notificationdata']['custombutton'])+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs(data['notificationdata']['custombutton'])+"</button>";
  } else if (data['notificationdata']['showLogin']) {
    if(experimentaloverlay)
      html += "<button type='button' lptype='tryagainbtn' id='lptryagainbtn' class='lpbutton' value='"+gs('Try Again')+"'>"+gs('Try Again')+"</button>";
    else
      html += "<button type='button' lptype='tryagainbtn' id='lptryagainbtn' class='lpbutton' value='"+gs('Try Again')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Try Again')+"</button>";
  }
  if (data['notificationdata']['showFeedback']) {
    if(experimentaloverlay)
      html += "<button type='button' lptype='feedbackbtn' id='lpfeedbackbtn' class='lpbutton' value='"+gs('Feedback')+"'>"+gs('Feedback')+"</button>";
    else
      html += "<button type='button' lptype='feedbackbtn' id='lpfeedbackbtn' class='lpbutton' value='"+gs('Feedback')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Feedback')+"</button>";
  }

  if(!experimentaloverlay){
    //Setup event handler for when someone clicks on buttons or menu choice
    document.addEventListener('lpCustomEventMenu', function(e) {
      var lptype = e.srcElement.getAttribute('lptype');
      sendBG({cmd:lptype,notificationdata:data['notificationdata']});
      document.getElementById('lastpass-notification').style.display='none';
      
    }, false);
  }
  return html;
}

function createBasicAuthButtons(data)
{
  var html = "";
  if(experimentaloverlay)
    html += "<button type='button' lptype='basicauthneverbtn' id='lpbasicauthneverbtn' class='lpbutton' value='"+gs('Never Show Again')+"'>"+gs('Never Show Again')+"</button>";
  else
    html += "<button type='button' lptype='basicauthneverbtn' id='lpbasicauthneverbtn' class='lpbutton' value='"+gs('Never Show Again')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Never Show Again')+"</button>";

  var buttontext = data['needbinary'] == 1 ? gs('Install') : gs('More Information');
  if(experimentaloverlay)
    html += "<button type='button' lptype='basicauthmoreinfobtn' id='lpbasicauthmoreinfobtn' class='lpbutton' value='"+buttontext+"'>"+buttontext+"</button>";
  else
    html += "<button type='button' lptype='basicauthmoreinfobtn' id='lpbasicauthmoreinfobtn' class='lpbutton' value='"+buttontext+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+buttontext+"</button>";

  if(!experimentaloverlay){
    //Setup event handler for when someone clicks on buttons or menu choice
    document.addEventListener('lpCustomEventMenu', function(e) {
      var lptype = e.srcElement.getAttribute('lptype');
      sendBG({cmd:lptype,notificationdata:data['notificationdata']});
      document.getElementById('lastpass-notification').style.display='none';
      
    }, false);
  }
  return html;
}

function createGenerateButtons(data)
{
  var html = '';

  if(experimentaloverlay)
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"'>"+gs('Never...')+"</button>";
  else
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"' onclick='lpshowmenudiv(\"never\");'>"+gs('Never...')+"</button>";
  html += createNeverMenu(0, 2);

  if(experimentaloverlay)
    html += "<button type='button' lptype='generate' id='lpgenerate' class='lpbutton' value='"+gs('Generate')+"'>"+gs('Generate')+"</button>";
  else
    html += "<button type='button' lptype='generate' id='lpgenerate' class='lpbutton' value='"+gs('Generate')+"' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Generate')+"</button>";


  if (data['extra3']) {
    var count = getcount(g_sites);
    if (count > 0) {
      if(experimentaloverlay)
        html += "<button type='button' id='lpfillcurrent' class='lpbutton' value='"+gs('Fill Current') + " (" + count + ")'>"+gs('Fill Current') + " (" + count + ")</button>";
      else
        html += "<button type='button' id='lpfillcurrent' class='lpbutton' value='"+gs('Fill Current') + " (" + count + ")' onclick='lpshowmenudiv(\"fillcurrent\");'>"+gs('Fill Current') + " (" + count + ")</button>";
      html += createMenu('fillcurrent', g_sites, count);
    }
  }
  
  if(experimentaloverlay){
    if (data['extra2']) {
      var count = getcount(g_formfills);
      if (count > 0) {
        if (alwayschooseprofilecc) {
          if(experimentaloverlay)
            html += "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='"+gs('Fill Form') + " (" + count + ")'>"+gs('Fill Form') + " (" + count + ")</button>";
          else
            html += "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='"+gs('Fill Form') + " (" + count + ")' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Fill Form') + " (" + count + ")</button>";
        } else {
          if(experimentaloverlay)
            html += "<button type='button' id='lpfillform' class='lpbutton' value='"+gs('Fill Form') + " (" + count + ")'>"+gs('Fill Form') + " (" + count + ")</button>";
          else
            html += "<button type='button' id='lpfillform' class='lpbutton' value='"+gs('Fill Form') + " (" + count + ")' onclick='lpshowmenudiv(\"fillform\");'>"+gs('Fill Form') + " (" + count + ")</button>";
          html += createMenu('fillform', g_formfills, getcount(g_formfills));
        }
      }
    }
  }

  createGenerateFormFillListener();

  return html;
}

function createFormFillButtons(data)
{
  var html = '';
  if(experimentaloverlay)
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"'>"+gs('Never...')+"</button>";
  else
    html += "<button type='button' id='lpnever' class='lpbutton' value='"+gs('Never...')+"' onclick='lpshowmenudiv(\"never\");'>"+gs('Never...')+"</button>";
  html += createNeverMenu(0, 3);

  if (alwayschooseprofilecc) {
    if(experimentaloverlay)
      html += "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='"+gs('Fill Form') + " (" + getcount(g_formfills) + ")'>"+gs('Fill Form') + " (" + getcount(g_formfills) + ")</button>";
    else
      html += "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='"+gs('Fill Form') + " (" + getcount(g_formfills) + ")' onclick='this.dispatchEvent(lpcustomEvent);'>"+gs('Fill Form') + " (" + getcount(g_formfills) + ")</button>";
  } else {
    if(experimentaloverlay)
      html += "<button type='button' id='lpfillform' class='lpbutton' value='"+gs('Fill Form') + " (" + getcount(g_formfills) + ")'>"+gs('Fill Form') + " (" + getcount(g_formfills) + ")</button>";
    else
      html += "<button type='button' id='lpfillform' class='lpbutton' value='"+gs('Fill Form') + " (" + getcount(g_formfills) + ")' onclick='lpshowmenudiv(\"fillform\");'>"+gs('Fill Form') + " (" + getcount(g_formfills) + ")</button>";
    html += createMenu('fillform', g_formfills, getcount(g_formfills));
  }

  createGenerateFormFillListener();

  return html;
}

function createGenerateFormFillListener()
{
  if(!experimentaloverlay){
    //Setup event handler for when someone clicks on a menu choice
    document.addEventListener('lpCustomEventMenu', function(e) {
      var lptype = e.srcElement.getAttribute('lptype');
      if(lptype=='fillform'){
  return; //disable
        sendBG({cmd:"fillformffid", ffid:e.srcElement.getAttribute('ffid')});
        document.getElementById('lppopupfillform').style.display = 'none';
      }else if(lptype=='addprofile'){ return; //disable
        sendBG({cmd:"addprofile"});
        document.getElementById('lppopupfillform').style.display = 'none';
      }else if(lptype=='addcreditcard'){
        sendBG({cmd:"addcreditcard"});
        document.getElementById('lppopupfillform').style.display = 'none';
      }else if(lptype=='clearforms'){
        sendBG({cmd:"clearforms"});
        document.getElementById('lppopupfillform').style.display = 'none';
      }else if(lptype=='chooseprofilecc'){
        if(!experimentaloverlay)
          return; //disable -- handled in overlay
      }else if(lptype=='fillcurrent'){
        sendBG({cmd:"fillcurrentaid", aid:e.srcElement.getAttribute('aid')});
        document.getElementById('lppopupfillcurrent').style.display = 'none';
      }else if(lptype=='generate'){
        sendBG({cmd:"generate"});
        if (!document.getElementById('lppopupfillform') && !document.getElementById('lppopupfillcurrent')) {
          document.getElementById("lastpass-notification").style.display="none";
        }
      }else if(lptype=='neverpage' || lptype=='neverdomain'){
        var data = {cmd:lptype, url:punycode.URLToASCII(document.location.href)};
        if (document.getElementById('lpgenerate')) {
          data['fromgenerate'] = 1;
        } else {
          data['fromformfill'] = 1;
        }
        sendBG(data);
        document.getElementById('lppopupnever').style.display = 'none';
        document.getElementById('lastpass-notification').style.display='none';
      }
      
    }, false);
  }
}

//------------------------------------------------------
function getAutoLoginArray(allsites){
  var autologin = new Array();
  for(var i in allsites){
    //If no urid or can't find a matching form, then don't offer autologin
    if(typeof(allsites[i]['fields'])=='undefined' || getcount(allsites[i]['fields'])==0 || !canFindForm(allsites[i]['fields']))
      continue;
    autologin[i] = allsites[i];
  }
  return autologin;
}

//------------------------------------------------------
//Utility function that looks through forms on the page and tries
//to find one that has matching fields. Not quite as involved as
//firefox version, but seems to do the job
function canFindForm(fields){

  var forms =  document.getElementsByTagName('form');
  for(var i=0;i< forms.length;i++){
    var f = new Array();
    for(var j in fields){
      if ('text' == fields[j].type || 'password' == fields[j].type || 'email' == fields[j].type || 'tel' == fields[j].type) {
        f[fields[j].type+fields[j].name] = 0;
      }
    }
    var foundpassword = false;

    var formElements = forms[i].elements;
    var g = new Array();
    for(var j=0;j< formElements.length;j++){
      var elt = formElements[j];
      if ('text' == elt.type  || 'email' == elt.type || 'tel' == elt.type || 'password' == elt.type ) {
        if(typeof(f[elt.type+elt.name])!="undefined")
          f[elt.type+elt.name] = 1;

        if(elt.type=='password')
          foundpassword = true;

        g[elt.type+elt.name] = 0;
      }
    }

    for(var j in fields){
      if ('text' == fields[j].type  || 'password' == fields[j].type || 'email' == fields[j].type || 'tel' == fields[j].type) {
        if(typeof(g[fields[j].type+fields[j].name])!="undefined")
          g[fields[j].type+fields[j].name] = 1;
      }
    }

    if(foundpassword){
      var f_ok = true;
      for(var j in f){
        if(f[j] == 0){
          f_ok = false;
          break;
        }
      }
      var g_ok = true;
      for(var j in g){
        if(g[j] == 0){
          g_ok = false;
          break;
        }
      }
      if(f_ok || g_ok){
        return true;
      }
    }
  }
  return false;

}

//------------------------------------------------------
//Create list of matching sites menu for autofill/autologin
//
// type is one of (autologin, autofill, fillcurrent, fillform)
// arr is array of acct objects
// count is the length of arr
//
// returns an html fragment (var html)
//
function createMenu(type, arr, count){
  // html is a textbuf that will be returned
  var html = "";
  var style = "";

  var MIN_SITE_WIDTH='6em';
  var MIN_USERNAME_WIDTH='6em';
  var MIN_LAST_TOUCH_WIDTH='6em';
  var doexttable=0;
  var popupwidthoverride=0;

  // copied from above lpshownotification(); don't want it as a global
  var x3_img_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR42qXTsWrCUBTGcaFroZNTwQfo1KnQN3CQblLIkD2CFIqbaEBQsGAIJBAaCIoQI4JKoeADFDpVmuCsUyE4FJyznJ4vSEjkKgWFH4R7cv/RS8zNZjORO/bMXDZkT+xWdO/hwtV+E02n0wxeg1d2eSxQYD+TyYRc1xXiGSIblhcFPnGT4zgnjUYjRBaHgaLneWSa5r+Mx2NE7tOBvmVZ1O12Y8vlkqIoovl8ToPBANdYS+a2bSPwkg58YNBsNhNBENB2uwVcZ2a9Xg+Bt0yg1WpRrVZLNBoNPBlwnZm1220E3tOBIQKKoiRWqxWFYRhbr9eZWafTQcBIBx4NwyBZlmO+79Nut8OTAd8Ca8kc54WDTwcu2He9XqdyuXySqqqEnyx6D27YLyKlUkkEB4jNISuIAnDNFpqmUaVSIUmSYtVqlXRdx2Z88uJXOeuBuexrr8+Kx/5MZ8kR0Vn+AGczfuZVuZDxAAAAAElFTkSuQmCC';

  var has_profile = false;
  var has_cc = false;
  var totalcount = count;
  if (type == 'fillform') {
    if (count > 0) {
      totalcount++;
    }
    totalcount += 3;

    for (var i in g_formfills) {
      if (g_formfills[i].profiletype == 0) {
        has_profile = true;
      }
      if (g_formfills[i].ccnum != '') {
        has_cc = true;
      }
    }
    if (has_profile && has_cc) {
      totalcount++;
    }
  }

  // for autofill/autologin, display scrolling table
  // reserve space for a couple of rows for the search box and table headers
  // VVV should also support fillform
  //
  // g_doexttable is a global to enable the extended table look at build-time
  if (typeof(g_doexttable) == 'undefined') {
    g_doexttable=1;  
  }
  if (g_doexttable && (type == 'autofill' || type == 'autologin')) {
    doexttable=1;
    //totalcount+=3;  // allocate 3 (2?) rows for tabular:  3 is too much, reserve 2
    //totalcount+=2;
    totalcount++;   // searchbox now only occurs when max is reached, so do not reserve a row for it.
  }

  var newwidth="";
  var newwidthunit="";
  if (doexttable) {
    // from the lastpass style sheet.  this is the default, an 11pt font.
    var stylefrag="font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;";
    var baselinestr="0123ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 30 chars
    var baselinestrpixlen=300;   // investigate why this varies...

    //var size=measureText(document, baselinestr, null, stylefrag);
    var size=measureText(document, baselinestr, null, stylefrag,
       document.getElementById('lpiframeoverlay' + g_iframerand));

    // L("baselinestr measures to "+size.width+" pixels");
    // if the user has overridden this font size, how do we detect?
    // use a baselined test string, and see if measureText changes it.
    // allow 5% slop .  in this case, grow the popup window.  how big?
    // 60 ems seems reasonable, or 100%
    //
    // case: if translated column header for 'last touch' is ridiculously long, 
    //   grow the popup too.
    if (size.width > (baselinestrpixlen * 1.05)) {
      newwidth = size.width * 2;
      newwidthunit="px";
      popupwidthoverride=newwidth;
      if (newwidth > document.width) {
        newwidth="100";
        newwidthunit="%";
        popupwidthoverride=document.width;
      }
    } else {
      // yuk. this seems necessary under windows, if the
      // Last Touch string has been translated into something that expresses
      // really wide, such as Tamil or Russian/Cyrillic font
      var ltbiglen=measureText(document, gs('Last Touch').toUpperCase(), null, stylefrag,
          document.getElementById('lpiframeoverlay' + g_iframerand));
      if (ltbiglen.width > 120) {  // 120-130 seems to be the right threshold
        // 410 is the default width from the notification.js:css
	newwidth = 410 + parseInt(ltbiglen.width/2);
        newwidthunit="px";
        popupwidthoverride=newwidth;
        if (newwidth > document.width) {
          newwidth="100";
          newwidthunit="%";
          popupwidthoverride=document.width;
        }
      }
    }
  } else {
  } // doexttable

  if(experimentaloverlay){
    if(totalcount < 7)  {
        // unfortunately, if there is word-wrap, then the calculation of
        // 24 pixels per line does not work well here.
        style = " style='height:" + (totalcount*24) + "px; width:"+newwidth+newwidthunit+";'";
    } else {
        style = " style='height: 170px; overflow:auto; width:"+newwidth+newwidthunit+";'";
    }
  }else{
    if(totalcount < 12) {
      style = " style='height:" + (totalcount*24) + "px;";
    } else {
      style = " style='";
    }

    if (newwidth != "") {
      // if opera, using tabular display, and using a large font
      style = style + " width:"+newwidth+newwidthunit+";";
    }
    style = style + "'";
  }  // experimental overlay

  if (doexttable==1) {
    // type == autofill || autologin
    html += "<div " + g_opera_selectable + "id='lppopup"+type+"' class='lppopupextended' "+style+">"; 

    // if breaking it out into multiple pages, disp pgcount, arrows?
    // html += "<TABLE STYLE='overflow: none;' WIDTH='100%' ><TR ID='autofilltabfooter'> <TD ID='autofilltabsearchlabel'>Filter: <INPUT ID='autofilltabsearchbox' TYPE=\"TEXT\"><IMG ID='autofilltabsearchboxreset' SRC='images/xsmall.png' ALT='reset'></TD>\n"; 
    // html += "<TD ID='autofilltabsearchpgcount'>&nbsp; pg 1/1 &nbsp;</TD><TD><IMG ALT='left' SRC='images/left.png' ID='autofilltabsearchleft'>\n";
    // html += "<IMG ALT='right' SRC='images/right.png' ID='autofilltabsearchright'></TD></TR>\n";

    // use inline source for image here later on, rather than spec its src here.
    // I wish I had sprintf.
    // the footer comes before the header; the footer was intended to come
    // at the bottom of the iframe, but in fixed location.  could not
    // figure out how to fix the footer in place, so put it up top.
    //
    // only display the search box when there are enough entries to produce a scrollbar
    //
    if (totalcount > 8) {
      html += "<TABLE WIDTH='100%' ><TR CLASS='lppopupsearchbox' WIDTH='100%' ID='";
      html += type + "tabfooter'> <TD ID='";  
      html += type + "tabsearchlabel'>";
      html += gs(type) + " " + gs('Filter') + ": <INPUT ID='";
      if (experimentaloverlay) { // or maybe this should be, if !opera
        html += type + "tabsearchbox' TYPE=\"TEXT\"><IMG ID='";
        html += type + "tabsearchboxreset' ALT='reset'></TD>";
      } else {
        // onclick() goes to lpCustomEventHandler(), and lptype is set
        // for it's benefit.  Both are necessary for proper functioning
        html += type + "tabsearchbox' TYPE=\"TEXT\" lptype=\""+type+"tabsearchbox\" ONKEYUP=\"this.dispatchEvent(lpcustomEvent);\"><IMG ID='";
        html += type + "tabsearchboxreset' ALT='reset' SRC='"+x3_img_src +"' lptype=\""+type+"tabsearchboxreset\" ONCLICK=\"this.dispatchEvent(lpcustomEvent);\"></TD>";
      } // experimentaloverlay
    }

    // BEGIN COMPUTATION
    // try to calculate optimal column widths.
    // cases tested: 
    //     at least one long sitename
    //     at least one long username
    //     all short sitenames
    //     all short usernames
    //     all last touched of 'never'
    //     have 2-3 autofills
    //     have 2-3 autologins
    //     have no autofills
    //     have no autologins
    //     have 1 autofill
    //     have 1 autologin
    //     have many (100+) autofills
    //     have many (100+) autologins
    //     have 2 or more autofills with no autologins
    //     have 2 or more autologins with no autofills
    //     filter against white-space words inside autologin or autofill
    //     filter against white-space only
    //     column sort against each column
    //
    // repeat with minimum-font set to 18pt (per user request) or 24 pt
    // 
    // for opera: settings->advanced->fonts->minimum font 
    // for chrome: preferences->advanced->webcontent->customize->minimum font
    // for safari: settings->advanced->universal access->minimium font 
    // requires a reload after font size change
    //
    // repeat for opera, safari  because each renders differently. grr
    //
    //
    var longestcol1len=0; // site or fillform
    var longestcol2len=0; // username
    var longestcol1=null;
    var longestcol2=null;
    // comparing string length only approximates actual screen space
    // used by those strings, but is less compute intensive and should
    // be close enough.

    //if (doexttable==1) {   // true already now that this block has been moved here
    if (1) {
      for(var i in arr){
        // check i is null?
      
        // col1
        if (type == 'fillform') {
          if (typeof(arr[i].decprofilename) != 'undefined') {
            if (arr[i].decprofilename.length > longestcol1len) {
              longestcol1len = arr[i].decprofilename.length;
              longestcol1=i;
            }
          }
        } else {
          // type == autofill or type == autologin
          if (typeof(arr[i].name) != 'undefined') {
            if (arr[i].name.length > longestcol1len) {
              longestcol1len = arr[i].name.length;
              longestcol1=i;
            }
          }
        }
        // col2
        if (typeof(arr[i].useusername) != 'undefined') {
          if (arr[i].useusername.length > longestcol2len) {
            longestcol2len = arr[i].useusername.length+2;
            longestcol2=i;
          }
        }
      }
      // edge case: header for username is longer than username.
      if ((gs('USERNAME').length +2)> longestcol2len) {
            longestcol2len = gs('USERNAME').length+2;
            longestcol2=(-1);  // #define  USE_USERNAME_HDR (-1)
      }
    }
    // now convert to pixels.
    // from notification.js, this is used on a table row:
    // font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif
    // however, the user may choose a larger font within their web-browser.
    // based on google searches, this appears to be a popular feature for
    // people with older eyes.  Hopefully creating the text element will 
    // use the font that the browser is chosing to override.
    //
    var col1width=0;
    var col2width=0;
    var col3width=0;  // override later
    if (document.body) {
      var stylefrag="font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;";
      var size1;
      if (type == 'fillform') {
        if (longestcol1 != null && typeof(arr[longestcol1].decprofilename) != 'undefined') {
          //size1=measureText(document, arr[longestcol1].decprofilename, null, stylefrag);
          size1=measureText(document, ofa_pretty_print_tabular_formfill(arr[i].decprofilename) , null, stylefrag,
            document.getElementById('lpiframeoverlay' + g_iframerand));
        }
      } else {
        if (longestcol1 != null && typeof(arr[longestcol1].name) != 'undefined') {
          //size1=measureText(document, arr[longestcol1].name, null, stylefrag);
          size1=measureText(document, ofa_pretty_print_tabular_sitename(arr[i].name), null, stylefrag,
            document.getElementById('lpiframeoverlay' + g_iframerand));
        }
      }
//L("col1 width should be "+size1.width);
      
      //var size2 = measureText(document, ofa_pretty_print_tabular_username (arr[longestcol2].useusername), null, stylefrag,
      var size2;
      if (longestcol2 >= 0) {
        size2=measureText(document, ofa_pretty_print_tabular_username (arr[longestcol2].useusername), null, stylefrag,
          document.getElementById('lpiframeoverlay' + g_iframerand));
      } else {
        // longestcol2 will have been set to -1, in case the header is longer than any of the usernames
        size2=measureText(document, ofa_pretty_print_tabular_username (gs('USERNAME')+'   '), null, stylefrag,
          document.getElementById('lpiframeoverlay' + g_iframerand));
      } 
//L("col2 width should be "+size2.width);

      //var size3 = measureText(document, '59 seconds ago', null, stylefrag);
      //var size3 = measureText(document, 'LAST TOUCH  ', null, stylefrag,
      // note: gs(LAST TOUCH) as it will be replaced by internationalization
      // in which case this all gets possibly ugly, but presumably in
      // every language, the header will be the longest string
      var size3 = measureText(document, gs('Last Touch').toUpperCase()+'  ', null, stylefrag,
          document.getElementById('lpiframeoverlay' + g_iframerand));
//L("col3 width should be "+size3.width);  // constant?
      // save a computation by setting size3 to a constant
      // won't work, if the user overrides this font on their own.

      // case: if this header gets too long (i.e cyrillic or tamil) this
      // goes tits up. For simplicity on this edge case, grow the popup.
      //

      size1.width+=5;  size2.width+=5; size3.width+=5;  // compensate for borders and padding.

      // 400px is the default popup size.  if the user has changed
      // the fontsize to be larger, grow the popup.  User feedback
      // on this says suggests this is perhaps the most desired outcome.
      var tablewidth=400;
      if (popupwidthoverride) {
        tablewidth=popupwidthoverride;
      }
      var slop=20;
      if (g_isopera) {
        slop=40; // opera is sloppier, heh
      }
      
      if ((size1.width+size2.width+size3.width+slop) < tablewidth) {
         //col1width=size1.width;  don't set width/max-width, 
         // just use the min-width.  this should favors the sitename field
         // over the others in most cases.
         col2width=size2.width;  
         col3width=size3.width;
      } else {
         // the longest strings are too long to fit in the window, 
         // or the font is too big, or both.
         // if the font in use is greater than 11pt, then presume that the user
         // is willing to sacrifice looks for text, so grow the popup window.
         // (this will have been previously done)
  
         // 20 pixels for the scrollbar and column seps, approximately.
         col1width = tablewidth - size2.width - size3.width - slop;

         // case: col1width is too small or negative ?  with the typical
         // font size of 11pt Helvetica, this should not happen, because 
         // col2 and col3 widths woudl be constrained to be approx 40 ems
         // at most, and the 400px popup window will accomodate 60+ ems
         // at 11pt font.
         // however, if the user changes the minimum size font, this
         // throws all of the calculations out of the window.  hopefully
         // growing the popupwindow will fix this.
         // 

         col2width = size2.width;  // try to keep it this width
         col3width = size3.width;  // try to keep it this width
      }
      if (g_isopera) {
        col2width += 10; 
        col3width += 10; 
      }
    }
  

    html += "</TR>\n";
    html+="</TABLE>\n"; 
    html+="<TABLE id='"+type+"tab' class='sortable' width='100%'>\n"; 
    //html += "<THEAD style='width:385px;' ><TR ID='";
    /// chrome will readjust this on its own, if it ended up growing larger
    html += "<THEAD><TR ID='";
       
    if (col1width>0) {
      html += type + "tabheader'><TH style=\"width:"+col1width+"px; min-width:"+col1width+"px; max-width:"+col1width+"px;\">";
    } else {
      html += type + "tabheader'><TH style=\"min-width:"+MIN_SITE_WIDTH+";\">";
    }

    if (type == 'fillform') {
      html += gs('Form Fill Profiles').toUpperCase();
    } else {
      // autologin/autofill
      html += gs('SITE').toUpperCase();
    }
    // because gs() was capitalizing SITE & USERNAME but not 'Last Touch',
    // force all to be upper to be consistent for all.
    if (col2width>0) {
      html += "</TH><TH style=\"width:"+col2width+"px; min-width:"+MIN_USERNAME_WIDTH+"; max-width:"+col2width+"px;\">";
    } else {
      html += "</TH><TH style=\"min-width:"+MIN_USERNAME_WIDTH+";\">";
    }
    if (col3width>0) {
      //html += gs('Username').toUpperCase() + "</TH><TH style=\"width:"+col3width+"px; min-width:"+col3width+"px; max-width:"+col3width+"px;\">";
      html += gs('Username').toUpperCase() + "</TH><TH style=\"width:"+col3width+"px; min-width:"+MIN_LAST_TOUCH_WIDTH+"; max-width:"+col3width+"px;\">";
    } else {
      html += gs('Username').toUpperCase() + "</TH><TH style=\"min-width:"+MIN_LAST_TOUCH_WIDTH+";\">";
    }
    html += gs('Last Touch').toUpperCase() +"</TH></TR></THEAD>\n";
    html+="<TBODY>\n";
  } else {
    //
    html += "<div " + g_opera_selectable + "id='lppopup"+type+"' class='lppopup' "+style+"><table width='100%'>";
  }  // if extended table

  //
  // now, generate the html fragment that displays table rows, one acct or fill profile per row
  //
  for(var i in arr){

    var username = ""; // you're expected to ensure that username doesn't not have any XSS'

    if(type != 'fillform' && arr[i]['useusername']!="")
      username = " (" + ofa(arr[i]['useusername']) + ")";
    var idfield = type == 'fillform' ? 'ffid' : 'aid';

    if (doexttable==1) { // doexttable VVV
        // now prep data for display in the tabular display. 

	var touchstr="";
        if (typeof(arr[i].last_touch) != 'undefined') {
          touchstr = ofa_pretty_print_tabular_last_touch(arr[i].last_touch);
        }
        var usernamestr="";
        if (typeof(arr[i].useusername) != 'undefined') {
          usernamestr = ofa_pretty_print_tabular_username (arr[i].useusername);
        }
        var logicalstr="";
        if (type == 'fillform') {
          if (typeof(arr[i].decprofilename) != 'undefined') {
            logicalstr = ofa_pretty_print_tabular_formfill(arr[i].decprofilename);
          }
        } else {
          // type == autofill or type == autologin
          if (typeof(arr[i].name) != 'undefined') {
            logicalstr=ofa_pretty_print_tabular_sitename(arr[i].name, col1width);
          }
        }

        // logicalstr for innerHTML for col1, usernamestr for col2, and lastouchstr for col3
        
        // each row will have an id of lpauto{fill|tab}[idfield]
        // which should be unique.
        // attribute lptype and onclick handler will be set for the sole 
        // benefit of Opera; unused with the overlay.
        // NB: attribute aid or ffid (variable idfield) is used by
        // the event handler for lpCustomEventMenu()
        // for the correct rendering of the table under all browsers,
        //   the width and max-width fields are set here too.
        if(experimentaloverlay) {
          html += "<tr id='lp" + type + arr[i][idfield] + "'><td " +g_opera_selectable;
          if (col1width) {
            html += " style=\"width:"+col1width+"px; max-width:"+col1width+"px;\" >&nbsp;"+logicalstr+"</TD>";
          } else {
            html += " style=\"min-width:"+MIN_SITE_WIDTH+"; \" >&nbsp;"+logicalstr+"</TD>";
          }
          html += "<TD style=\"width:"+col2width+"px; min-width:"+MIN_USERNAME_WIDTH+"; max-width:"+col2width+"px;\">"+usernamestr+"</TD>";
        } else {
          // for opera
          html += "<tr lptype='"+type+"' id='lp" + type + arr[i][idfield] + "' ONCLICK='this.dispatchEvent(lpcustomEvent);' ";
          html += idfield + "=\""+arr[i][idfield]+"\"";  
          if (col1width) {
            html += "><td " +g_opera_selectable + " style=\"width:"+col1width+"px; min-width:"+MIN_SITE_WIDTH+"; max-width:"+col1width+"px; \" >&nbsp;"+logicalstr;
          } else {
            html += "><td " +g_opera_selectable + " style=\"min-width:"+MIN_SITE_WIDTH+"; \" >&nbsp;"+logicalstr;
          }
          html += "</TD><TD  style=\"width:"+col2width+"px; min-width:"+MIN_USERNAME_WIDTH+"; max-width:"+col2width+"px;\">"+usernamestr+"</TD>";
        }

        // sort against the raw time_t by specifying the sorttable_customkey attribute with the value of last_touch
        html +="<TD sorttable_customkey='"+ofa(arr[i].last_touch)+"' style=\"width:"+col3width+"px; min-width:"+MIN_LAST_TOUCH_WIDTH+"; \">"+touchstr+"</td></tr>";
    } else {
      //
      if(experimentaloverlay) {
        html += "<tr id='lp" + type + arr[i][idfield] + "'><td " +g_opera_selectable + ">&nbsp;"+ofa(arr[i][type == 'fillform' ? 'decprofilename' : 'name'])+username+"</td></tr>";
      } else {
        html += "<tr lptype='"+type+"' " + idfield + "=\""+arr[i][idfield]+"\" onclick='this.dispatchEvent(lpcustomEvent);'><td "+g_opera_selectable+">&nbsp;"+ofa(arr[i][type == 'fillform' ? 'decprofilename' : 'name'])+username+"</td></tr>";
      } // experimentaloverlay
    } // do exttable
  } // for i in arr

  if (doexttable==1){
     html+="</TBODY>\n"; // tbody is prob un-necessary, but be pedantic
  }

  if (type == 'fillform') {
    if (count > 0) {
      html += "<tr style='background-color: #fff;'><td><hr></td></tr>";
    }
    if(experimentaloverlay)
      html += "<tr lptype='addprofile' id='lpaddprofile'><td "+g_opera_selectable+">&nbsp;" + gs('Add Profile') + "</td></tr>";
    else
      html += "<tr lptype='addprofile' onclick='this.dispatchEvent(lpcustomEvent)'><td "+g_opera_selectable+">&nbsp;" + gs('Add Profile') + "</td></tr>";
    if(experimentaloverlay)
      html += "<tr lptype='addcreditcard' id='lpaddcreditcard'><td "+g_opera_selectable+">&nbsp;" + gs('Add Credit Card') + "</td></tr>";
    else
      html += "<tr lptype='addcreditcard' onclick='this.dispatchEvent(lpcustomEvent)'><td "+g_opera_selectable+">&nbsp;" + gs('Add Credit Card') + "</td></tr>";
    if(experimentaloverlay)
      html += "<tr lptype='clearforms' id='lpclearforms'><td "+g_opera_selectable+">&nbsp;" + gs('Clear Forms') + "</td></tr>";
    else
      html += "<tr lptype='clearforms' onclick='this.dispatchEvent(lpcustomEvent)'><td "+g_opera_selectable+">&nbsp;" + gs('Clear Forms') + "</td></tr>";
    if (has_profile && has_cc && !g_ismaxthon) {
      if(experimentaloverlay)
        html += "<tr lptype='chooseprofilecc' id='lpchooseprofilecc'><td "+g_opera_selectable+">&nbsp;" + gs('Choose Profile and Credit Card') + "</td></tr>";
      else
        html += "<tr lptype='chooseprofilecc' onclick='this.dispatchEvent(lpcustomEvent);'><td "+g_opera_selectable+">&nbsp;" + gs('Choose Profile and Credit Card') + "</td></tr>";
    }
  }
  html += "</table></div>";

  addMenuIdToPage(type);
  return html;

  // I really wish I had sprintf();

}

//------------------------------------------------------
//Create Never menu, used for both add and fill
function createNeverMenu(showneverautofill, from)
{
  var html = "";
  var style = " style='height:" + (showneverautofill ? "72" : "48") + "px'";
  from = from ? from : 0;
  html += "<div id='lppopupnever' class='lppopup' "+style+"><table width='100%'>";
  if(showneverautofill){
    if(experimentaloverlay)
      html += "<tr lptype='neverautofill' id='lpneverautofill'><td>&nbsp;"+gs('Never AutoFill')+"</td></tr>";
    else
      html += "<tr lptype='neverautofill' onclick='this.dispatchEvent(lpcustomEvent);'><td>&nbsp;"+gs('Never AutoFill')+"</td></tr>";
  }
  if(experimentaloverlay)
    html += "<tr lptype='neverpage' id='lpneverpage'><td>&nbsp;"+gs('Never For This Page')+"</td></tr>";
  else
    html += "<tr lptype='neverpage' onclick='this.dispatchEvent(lpcustomEvent);'><td>&nbsp;"+gs('Never For This Page')+"</td></tr>";
  if(experimentaloverlay)
    html += "<tr lptype='neverdomain' id='lpneverdomain'><td>&nbsp;"+gs('Never For This Domain')+"</td></tr>";
  else
    html += "<tr lptype='neverdomain' onclick='this.dispatchEvent(lpcustomEvent);'><td>&nbsp;"+gs('Never For This Domain')+"</td></tr>";
  html += "</table></div>";


  addMenuIdToPage('never');
  return html;
}

//------------------------------------------------------
//Keep a list of our precreated menus on the page, so we can easily iterate through them all
function addMenuIdToPage(type){

  //Add id to global array on page so we can iterate and hide all
  var js = "if(typeof(lpgblmenus)=='undefined'){ lpgblmenus = new Array(); } \
  lpgblmenus[lpgblmenus.length] = 'lppopup"+type+"'; \
  ";
  run_custom_js(document, js);
}

function lp_notification_exists(browser, type)
{
  return type == curr_notification_type || (type == 'autologin' && curr_notification_type == 'fill');
}

function never_gen(url, tld)
{
  return false; // this is handled in the background page
}

function never_ff(url, tld)
{
  return false; // this is handled in the background page
}

function lp_showNotification(msg, browser, aid, choices, extra, priority, extra2, extra3, updateDoNotReplace, skipDupCheck)
{
  var data = {text: gs(msg), aid: aid, extra: extra, extra2: extra2, extra3: extra3};
  if (window != lpgettop()) {
    data.extra = null;
    sendBG({cmd:'lpshownotificationtop',type:choices,data:data});
  } else {
    lpshownotification(choices, data);
  }
}

if (typeof(g_is_formfill) == 'undefined') {
  if (g_isopera || g_ismaxthon) {
    window.addEventListener('DOMContentLoaded', function() { onLoad(); }, false);
  } else if(g_ischrome){
    window.addEventListener("DOMContentLoaded", function() { onLoad(); }, false);
  } else {
    onLoad();
  }
}
 
function lpgettop()
{
  return g_isopera ? window.top : top;
}

function lpgettopurl()
{
  try {
    return punycode.URLToASCII(lpgettop().document.location.href);
  } catch (e) {
    return punycode.URLToASCII(document.location.href);
  }
}

function createContextMenu(data){
  var html = "<div id='contextmain' class='lppopup' style='display:block'><table width='"+g_contextwidth+"px' style='border:1px inset;'>";
  html += "<tr><td onclick='showcontext(0)'>"+gs('AutoFill')+" <img style='float:right' src='arrow.png'/></td>";
  if (typeof(data['can_copy']) != 'undefined' && data['can_copy']) {
    html += "<tr><td onclick='showcontext(1)'>"+gs('Copy Username')+" <img style='float:right' src='arrow.png'/></td>";
    html += "<tr><td onclick='showcontext(2)'>"+gs('Copy Password')+" <img style='float:right' src='arrow.png'/></td>";
    html += "<tr><td onclick='showcontext(5)'>"+gs('Copy URL')+" <img style='float:right' src='arrow.png'/></td>";
  }
  html += "<tr><td onclick='recheckpage()'>"+gs('Recheck Page')+"</td>";
  html += "<tr><td onclick='generate()'>"+gs('Generate Secure Password')+"</td>";
  html += "<tr><td onclick='showcontext(3)'>"+gs('Fill Forms')+" <img style='float:right' src='arrow.png'/></td>";
  html += "</tr></table></div>";

  //------------------------------------------------
  //Hidden table of sites for autofill/copy u/copy p
  html += "<div id='contextsub' class='lppopup' style='display:none;height:"+g_contextheight+"px;width:"+g_contextwidth+"px;overflow-x: hidden;'><table width='"+g_contextwidth+"px' style='border:1px inset;'>";
  var matchingsites = getAutoFillArray(document, LPJSON.parse(data['sites']));
  var matchingsitescount = getcount(matchingsites);
  if(matchingsitescount==0)
    html += "<tr><td onclick='hidecontext()'>No Matching Sites!</td></tr>";
  for(var i in matchingsites){
    var username = matchingsites[i]['useusername'];
    html += "<tr><td onclick='docontextaction(\""+ofa(matchingsites[i]['aid'])+"\")'>"+trunc2(matchingsites[i]['name'], username, g_contextwidth-40)+"</td></tr>";
  }
  html += "</tr></table></div>";



  //------------------------------------------------
  //Hidden table of formfills profiles
  html += "<div id='contextff' class='lppopup' style='display:none;height:"+g_contextheight+"px;width:"+g_contextwidth+"px;overflow-x: hidden;'><table width='"+(g_contextwidth-10)+"px' style='border:1px inset;'>";
  var formfills = LPJSON.parse(data['formfills']);
  var count = getcount(g_formfills);
  for(var i in formfills){
    html += "<tr><td onclick='showcontext(4, \""+ofa(formfills[i]['ffid'])+"\")'>"+trunc2(formfills[i]['decprofilename'], '', g_contextwidth-60)+" <img style='float:right' src='arrow.png'/></td></tr>";
  }
  html += "<tr><td onclick='addprofile();'>"+gs('Add Profile')+"</td>"; 
  html += "<tr><td onclick='addcc();'>"+gs('Add Credit Card')+"</td>"; 
  html += "<tr><td onclick='clearforms();'>"+gs('Clear Forms')+"</td>"; 
  html += "<tr><td onclick='chooseprofilecc();'>"+gs('Choose Profile and Credit Card')+"</td>"; 
  html += "</tr></table></div>";

  //------------------------------------------------
  //Hidden table of formfills profiles submenu
  html += "<div id='contextffsub' class='lppopup' style='display:none;height:"+g_contextheight+"px;'><table width='"+g_contextwidth+"px' style='border:1px inset;'>";
  html += "<tr><td onclick='ffsub(0)'>"+gs('Fill Form')+"</td>"; 
  html += "<tr><td onclick='ffsub(1)'>"+gs('Edit')+"</td>"; 
  html += "</tr></table></div>";

  return html;
}

function trunc2(s1, s2, size){

  var testdiv = document.getElementById('gettextextent');
  if(!testdiv){
    testdiv = document.createElement('span');
    testdiv.id = 'gettextextent';
    testdiv.style.cssText='display:block;position:absolute;top:-100px;left:1000px;font-size:11px;font-family:Helvetica Neue,Helvetica,Arial, sans-serif;';
    if(document.body)
      document.body.appendChild(testdiv);
  }
  var s = ofa(s1)+ (s2.length ? " ("+ofa(s2)+")" : "");
  testdiv.innerHTML = s;

  while(testdiv.offsetWidth > size){
    s1 = s1.length ? s1.substr(0, s1.length-1) : "";
    s2 = s2.length > 3 ? s2.substr(0, s2.length-3) : "";
    s = ofa(s1)+".." + (s2.length ? " ("+ofa(s2)+"..)" : "");
    testdiv.innerHTML = s;
  }

  return s;
}

//////////////////////////////////////////////////////////////////////
// here begins a chunk of code cut & pasted from overlay1.js
// for use by Opera.
// Chrome/Safari uses the overlay instead and will not use these.

var g_searchfillbox=null;
var g_searchloginbox=null;
var g_searchformfillbox=null;

// given input of autofill or autologin, returns nothing.
//
// clear the input text of corresponding text box from the popup menu
function clear_searchbox(type) {
  var box;
  if (type == 'autofill') {
     box = g_searchfillbox;
  } else if (type == 'autologin') {
     box = g_searchloginbox;
  } else {
    return;
  }
  if (box == null) {
    return;
  }
  box.value="";   // doesn't reset ?
  //unhide all table rows
  var rows = document.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++) {
      var rowid = rows[i].id;  // check if id exists
      if (rowid.indexOf('lp'+type)==0) {
        var thisrow = document.getElementById(rowid);
        if (thisrow.style.display!='table-row') {
          thisrow.style.display='table-row'; // not block
        }
      }
  }

  // the container contains the box, though it might not be apparent here.
  var container = document.getElementById(type+'footer');
  if (container != null) {
    container.className = 'lppopupsearchbox';  //try to disable the hover highlight  over the search box
  }
  box.focus();
  return;
}

function dofilter(type) {
  var box;
  if (type == 'autofill') {
     box = g_searchfillbox;
  } else if (type == 'autologin') {
     box = g_searchloginbox;
  } else if (type == 'fillform') {
     box = g_searchfillformbox;
  } else {
    return;
  }
  if (box == null) {
    return;  // none of the popup menus are visible, so just quit
  }

  // relies on each of the autofill/autologin/fillform tables to be
  // called autofilltab, autologintab, and fillformtab
  var thetable = document.getElementById(type+'tab');
  var searchstr = box.value.toLowerCase();  // chk that value exists?
  sorttable.filter(thetable, searchstr);
}

// munges the tables for autofills and autologins only, from the
// notification bar.
function initialize_sorttable() {
      sorttable.init();
      var table = document.getElementById('autofilltab');
      if (table != null) {
        sorttable.initial_sort(table.tHead.rows[0].cells[2]);
      }
      table = document.getElementById('autologintab');
      if (table != null) {
        sorttable.initial_sort(table.tHead.rows[0].cells[2]);
      }
      table = document.getElementById('fillformtab');
      if (table != null) {
        sorttable.initial_sort(table.tHead.rows[0].cells[2]);
      }
      g_searchfillbox = document.getElementById('autofilltabsearchbox');
      g_searchloginbox = document.getElementById('autologintabsearchbox');
      g_searchfillformbox = document.getElementById('fillformtabsearchbox');
      return;
}


//
// given an event
// return true if the given event should trigger a close/hide menu or
// notification bar
//
function chk_should_close_exttable(event) {

  var dont_close_on_me=[
      'autologintab', 'autologintabfooter', 'autologintabheader', 'autologintabsearchlabel',
      'autofilltab', 'autofilltabfooter', 'autofilltabheader', 'autofilltabsearchlabel',
      'fillformtab', 'fillformtabfooter', 'fillformtabheader', 'fillformtabsearchlabel',
      'sorttable_sortrevind', 'sorttable_sortfwdind'];
  var tid=null;
  var ptid=null;
  if (typeof(event.target) != 'undefined') {
    tid=event.target.id;
    if (typeof(event.target.parentElement) != 'undefined' && event.target.parentElement != null) {
      ptid=event.target.parentElement.id;
    }
  }
  var foundit=false;
  for (var x in dont_close_on_me) {
    if ((tid != null) && (tid == dont_close_on_me[x])) {
      foundit=true;
      break;
    }
    if ((ptid != null) && (ptid == dont_close_on_me[x])) {
      foundit=true;
      break;
    }
  }

  return !foundit;
}
// end code lifted from overlay1.js
//////////////////////////////////////////////////////////////////////

//
// given a time_t (intended to be acct.last_touch), return
// a string to be displayed in the autofill table.
// ofa called for the user
// if last_touch is 0, then returns a 'Never' (which elapsedTime() does
//   for you).  if last_touch is empty, assign it to be 0 so that
//   it will return a 'Never'.
//
function ofa_pretty_print_tabular_last_touch(last_touch) {
  if (last_touch == "" || last_touch == null) {
    last_touch = 0;
  }
  return ofa(elapsedTime(last_touch));
}

//
// given a username string (intended to be acct.useusername)
//   return something that is human
// readable, truncated if necessary, to fit the tabular output
// ofa called for the user
//
// returns an empty string on error.
//
// uses local constant MAX_USERNAME_STR (derived from eyeballing the output)
// uses global constant ELLIPSIS_CODE to allow browser to choose appropriate
//   display of the ellipsis html entity
//
// can't figure out how to use CSS to auto-truncate w/o scrolling
// horizontally, and auto-computing based on the actual display width
// is just too complex for this so the truncation is done this way.
//
function ofa_pretty_print_tabular_username(username) {
  var MAX_USERNAME_STR=25;  // pretty print for when the username string 
  // gets too long.  For simplicity, just hard code at 25 chars.  
  //
  var usernamestr="";
  if (username != "" && username != null) {
    if (username.length > MAX_USERNAME_STR)  {
      usernamestr = ofa(username.substring(0,MAX_USERNAME_STR-1)) + ELLIPSIS_CODE;
    } else {
      usernamestr=ofa(username);
    }
  }
  return usernamestr;
}

// there used to be heuristics here that have been happily tossed.
// now it is just a wrapper to ofa();
function ofa_pretty_print_tabular_formfill(fillname) {
  if (fillname == null) {
    fillname="";
  }
  return ofa(fillname);
}

// there used to be heuristics here that have been happily tossed.
// now it is just a wrapper to ofa();
function ofa_pretty_print_tabular_sitename(sitename, colwidth) {
  if (sitename == null) {
    sitename = ""; // shouldn't happen, but chk just in case.
  }
  var has_space=sitename.indexOf(' ');  // quicker than regex of m,\s,
                                        // and ok to skip leading space
  var retstr = ofa(sitename);
  // crap, ofa has turned . into &#x2e;
  if ((has_space < 0) && (retstr.indexOf('&#x2e;')>0)) {
    // ok to skip leading period
    retstr=retstr.replace(/&#x2e;/g, "<wbr/>&#x2e;");  // <wbr> : wordbreak elt
  }
// L("retstr is "+retstr);
  return retstr;

  // now that each cell has a width atttribute set (req'd for
  // proper Chrome rendering), the truncation code has been tossed.
  // the only case that the browser seems to have pains with now is if
  // you have a super long word or hostname, the browser won't know
  // how to split the word to wordwrap, and then the text overflows
  // (even though css:overflow-x is set hidden, grr).  This code injects
  // word breaks wherever there are periods in the sitename, to help the
  // browser out in displaying this, if no spaces were found.  maybe
  // check for other chars that should be word breaks too?
  //
}


// based on showoverlay()
// urlextra unused, but keep it around for future use
// go through all form elements, and create img/a element
// at the right end of each, and create/attach an iframe
// to each.
//
// function name is not good.  come up with something better
//
// pass doc to check for fields in a form inside frames?
//
// arg#3 : true to only manipulate login_only fields on  the active document.
//         false to manipulate all fields
//
// NB: login_only is always false now, now that the icons are being shown
// for login forms as well as non-login forms.
function doc_create_clickable_icons(data, urlextra, login_only, specialsite)
{
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  var body = document.body;
  if(!body)
    return;

  // this never check may be duplicate, depending on when this function is called.
      // hopefully the getnevers CS->BG msg will have been sent, the response
      // BG->CS gotnevers MSG received, and g_nevers object populated by now.
      // the never rules will apply for the current site or domain

      var nevers_rules = check_nevers(document, g_nevers, document.location.href);
      var show_clickable_for_formfill=true;
      var show_clickable_for_save=true;     //user does not have any valid aids for this site
      var show_clickable_for_autofill=true; //user has at least one valid aid for this site
      var show_clickable=true;
      if (nevers_rules  != null) {
        show_clickable_for_formfill=nevers_rules.show_for_formfill;
        show_clickable_for_save = nevers_rules.show_for_save;
        show_clickable_for_autofill = nevers_rules.show_for_autofill;
        show_clickable=nevers_rules.show_for_clickable_icon;  // superset of the others
      }

  // need to verify that MSG received and g_popupfillrows is set here
verbose_log('g_popupfill_rows='+g_popupfill_rows+' show_clickable_for_autofill='+show_clickable_for_autofill+' show_clickable_for_save='+show_clickable_for_save+' show_clickable_for_formfill='+show_clickable_for_formfill);


      // never_generate rule not applied, but never clickable takes precedence ATT
    
  // g_popupfill_rows wil have been set in prior response to getpopupfillsites msg
  if (((g_popupfill_rows > 0 && show_clickable_for_autofill) ||
       (g_popupfill_rows == 0 && show_clickable_for_save)  ||
       (show_clickable_for_formfill)  )&&show_clickable) {

    //
    // logic:
    // iterate through each input element
    //  vs.
    // iterate through each input element within each form element
    //
    // the former will pick up input elements that are not part of form elements
    // they may be input elements placed for webdesign purposes, but
    // probably won't be autofilled in formfills.js
    //
    // popupfill_shoulddofield() will check if an input element belongs to a
    // form or not, and reject if they don't belong to a valid form
    //
    // pass doc here?
    var inputs = document.getElementsByTagName('input'); 
    var i;
    var MAX_ICONS=1;     // this is the number of icons to display per
                         // non-login form.  icons for passwords
                         // fields are always shown.
    var forms_touched={};
    var hasLoginOrphans= checkDocumentForLoginOrphans(document);

    // hack: if set then one login form has been found, store value
    // is id of form.
    // if set then make detection of non-login forms a little looser
    // this deals with case of twitter.com that has 2 forms that
    // look like login forms 
    //
    var found_login_form=null;

    for (i in inputs) {
      if (specialsite || popupfill_shoulddofield(document, inputs[i], login_only)) {
        try {
          // q: only display for form values that will be filled in ?
          // or all fields?

          // this creates the clickable image for this input element
          // and sets up a click event handler
          // to create/destroy the tab popup
          // the event handler will create/destroy the popup

          var ai=inputs[i]; 

          var formid = pickFormName( ai.form );

          var is_login_form = (chk_form_has_password(document, ai.form) || hasLoginOrphans);
          var is_non_login_form = chk_form_is_nonlogin_form(document, ai.form);
          if(specialsite){
            if(looksLikeUsername(inputs[i])){
              is_login_form = true;
              is_non_login_form = false;
            }else{
              continue;
            }
          }

          // var is_signup_form = false;
          // no 3rd arg, this has the tighter signup logic
          var is_signup_form = chk_form_ask_generate(document, ai.form);

          // hack for twitter.com
          var loosen = false;
          if (found_login_form != null &&  formid != null && formid != found_login_form) {
            loosen = true;
            is_signup_form  = chk_form_ask_generate(document, ai.form, loosen);
          }

          // check for password-change dialog
          // if form has 3 password fields, with the last 2 being contiguous,
          // treat the first field as a site/login and the last 2 as generate/sign up fields.
          // the password change functionality will appear when the user has already 
          // logged into a site.
          //
          // if user clicks to generate a new pw on this field, subsequence call to
          // popuplategeneratepassword() will populate this new pw into password
          // fields #2 and #3.
          // 
          // solution: treat this as a signup form ?
          // 3 PW fields, shouldOfferGenerate will return true on each
          // XXX
          //

          var width_no_px = ai.style.width.replace(/px/, '');
          if (width_no_px === ''){
            try{
              var style = ai.ownerDocument.defaultView.getComputedStyle(ai, '');
              width_no_px = style.width.replace(/px/, '');
            } catch (e) {}
          }


          // if the id is numeric, the next bit may go haywire under Safari.
          // case: always create icon on fields of type 'password' on non-login forms, 
          // even if it exceeds number MAX_ICONS
          //
          // should replace: (ai.type != 'password' ) with isInputPasswordField()
 //         if (forms_touched[formid] != null && (forms_touched[formid] >= MAX_ICONS && ai.type != 'password')  && !(is_login_form && !is_signup_form)) {

          // if g_show_icon_only_on_focus is on, create the icon for all 
          // input fields, but they are created with style.display='none' by default
          // until focus or mouseover is triggered.
          //
          //if (forms_touched[formid] != null && (forms_touched[formid] >= MAX_ICONS && ai.type != 'password')  && !(is_login_form && !is_signup_form) && !g_show_icon_only_on_focus) {

          if (forms_touched[formid] != null && (forms_touched[formid] >= MAX_ICONS && !isInputFieldPassword(document, ai))  && !(is_login_form && !is_signup_form) && !g_show_icon_only_on_focus) {

            // create up to MAX_ICONS icons per non-login FORM.
            // may create more than MAX_ICONS if the associated INPUT field is of type password
            // create icons in all INPUTs per FORM
          } else {
            // case: for a given form, if is_login_form==true AND is_non_login_form==true
            //    require is_login_form==false AND is_non_login_form==true to test against never formfill rule
            //    but if is_login_form is true, always treat as login_form regardless of what
            //      is_non_login_form is
            if ((is_login_form  &&
                ((g_popupfill_rows > 0 && show_clickable_for_autofill) ||
                 (g_popupfill_rows == 0 && show_clickable_for_save))  ||

                (((is_non_login_form && !is_login_form) || is_signup_form) && show_clickable_for_formfill))&&show_clickable) {


              // do not create the icon on login form field that is smaller than 30 px wide (to
              // replicate existing lphighlightField() behavior
              var LOGIN_INPUT_MIN_WIDTH_TO_CREATE=30;  // tunables
              var NONLOGIN_INPUT_MIN_WIDTH_TO_CREATE=100;
              if ((is_login_form || is_signup_form) && (width_no_px>0 && width_no_px < LOGIN_INPUT_MIN_WIDTH_TO_CREATE )) {
                verbose_log('skipping loginform icon create on '+LP_getname(ai,LP_GETNAME_FAVOR_ID_OVER_NAME));
                continue;
              } else if  (is_non_login_form && (width_no_px>0 && width_no_px < NONLOGIN_INPUT_MIN_WIDTH_TO_CREATE )) {
                // do not create the icon on non-login form fields that are smaller than 100 px wide
                verbose_log('skipping nonloginform icon create on '+LP_getname(ai,LP_GETNAME_FAVOR_ID_OVER_NAME));
                continue;
              }

              var fillhint;
         
              // NB: this hint logic probably needs to change as
              // signup form shouldn't be considered subset of the non-login forms
              // any more.
              if (is_login_form && !is_signup_form) {

                if (1) {
                  found_login_form=formid;
                  sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'sites'});
                  if (g_do_icon_number_hint) {
                    fillhint='sites';
                  }
                }
              } else {
                if (is_login_form && is_signup_form) {
                  if (g_aspx_hack && g_found_aspx) {
                    // if it appears the page is currently in a login form state (is_login_form==true)
                    // then it is likely to trigger the is_signup_form logic here due to overlap of conditions,
                    // and that is probably not desirable.
                    //
                    sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'sites'});
                    if (g_do_icon_number_hint) {
                      fillhint='sites';
                    }
                   
                  } else {
                    verbose_log('CONFLICT: form '+formid+' is a signup form and login form; treat as a signup form and present formfill options');  // this is sometimes confusing but am not sure how to make this better yet.
                    // should the default be to act as a signup form (and present formfill /pw generation logic?)
                    // currently treat as formfill but maybe it should be site,
                    // or a sign that more heuristics are required here to guess at the right one

                    sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'formfills'});
                    if (g_do_icon_number_hint) {

                      //if (ai.type == 'password'
                      if (isInputFieldPassword(document,ai)) {
                        // tweak
                        fillhint = 'generate';
                      } else {
                        fillhint='formfills';
                      }
                    }

                    //sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'sites'});
                    //if (g_do_icon_number_hint) {
                    //  fillhint='sites';
                    //}
                  }
                } else {
                  if (!is_login_form && is_signup_form && chk_form_changepw(document, ai.form)) {
                    // special case.  if this is a change-password form
                    sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'sites'});
                    if (g_do_icon_number_hint) {
                      fillhint='sites';
                    }
                  } else {
                    sendBG({cmd:"setpopupfillhint", formid: formid, rowtype : 'formfills'});
                    if (g_do_icon_number_hint) {
                      fillhint='formfills';
                    }
                  }
                }
              }


              // XXX case: check if field is hidden; do not create if currently hidden ?
              if (checkIsDisplayed(document, ai,  0)) {  
// XXX

              // w/o reliable way to create on the fly, can't do this
              // better now with smarter recheck
              //if (1) {
                // if the icon exists on this page for this field, calling this routine is safe.
                if (g_do_icon_number_hint) {
                  create_or_move_overlay_icon(document, LP_getname(ai,LP_GETNAME_FAVOR_ID_OVER_NAME), OK_CREATE, fillhint, g_icon_numbers);  
                } else {
                  create_or_move_overlay_icon(document, LP_getname(ai,LP_GETNAME_FAVOR_ID_OVER_NAME), OK_CREATE);  
                }

                if (g_save_suggest_msg && fillhint && typeof(g_icon_numbers) != null
                    && typeof(g_icon_numbers['sites']) != null && (g_icon_numbers['sites'] < 1)) {
                    // this message goes away automatically.
                    //ai.addEventListener('mouseover', function() { do_save_suggest_msg(event, document);
                    //ai.addEventListener('focus', function() { 
                    ai.addEventListener('click', function() { 
                       var target = event.target;
                       // do_save_suggest_msg(event, document);
                       setTimeout(function() { do_save_suggest_msg(target, document); }, 0); // detach
                       event.preventDefault();
                       event.stopPropagation();
                       return false; } , false);
                }


           
        
                if (g_clickable_input) {
                  // add to all inputs, or just those that have
                  // icon container defined?  the latter requires
                  // the clickable icons to have been created by the
                  // time this runs.  is unclear that is true.
                  if((ai.type=="password" && formHasUsernameField(ai)) && !g_clickable_input_on_password ) {
                    // case: if user clicked on a password field,
                    // what should be done. force user to click
                    // on the icon to open up?
                    // clicking on this will echo the password into the
                    // iframe. 

                    // if g_clickable_input_on_password is enabled, then there is logic
                    // inside conditional_create_popup() to deal with the case where
                    // current field is password field.

                  } else {
                    //
                    // now, do only for sites - do not open on click for formfills
                    //
                    if (ai.getAttribute('clickev') !== 'true' && fillhint == 'sites') {
                        // nb: changes custom attribute on base website!  unsure if this is best
                        ai.setAttribute('clickev', 'true');
                        ai.addEventListener('click', function() { 
                           var target = event.target;
                           //setTimeout(function() {  do_save_suggest_msg(target, document); }, 0);  // detach
                           // if there is an associated icon container,
                           // try to open it if the input field has been clicked.
                           //
                           var icon_container_id = MAGIC+LP_getname(target,LP_GETNAME_FAVOR_ID_OVER_NAME);
                           var ic = document.getElementById(icon_container_id) ;
                           if (ic != null) {
                             if (g_clickable_input_on_password) {
                               if (!is_your_popup_showing(document)) {
                                 conditional_create_popup(document, target) ;
                               }
                             } else {

                               // this is probably not the right way.
                               set_active_username_password(document, ai.form);

                               popupfilltoggle(document, icon_container_id, target, NO_FORCE_GENERATE,  FORCE_SHOW_NOHITS);
                             }
                           }
                           // overzealous.  EEE
                           //if (g_defensive) {
                           //  event.preventDefault();   
                           //  event.stopPropagation();
                           //}
                           return false; } , false);
                    }
                  }
                }

                if (forms_touched[formid] == null) {
                  forms_touched[formid] = 1;
                } else {
                  forms_touched[formid] ++;
                }
              }


            }
          }
        } catch (e) {
          //alert('error: '+e.message+' stack: '+e.stack);
        }
      }
    }

    // put this here to get the polling working on non-login forms?
    if (g_weaseled == false) {
      // weasel(100);    // 200ms is too slow
      setTimeout(function() { weasel(100); }, 500);  // wait half a second before
      // kicking off this job to  give base page time to finish manipulating the page?
    }
    g_weaseled=true;

    // id = g_contextrand = Math.floor(Math.random() * 100000000);
  }
}

// given 1 arg, an INPUT element to evaluate. expected to be text input field.
// 2nd arg is optional; if present and true, ignore the element.type test.
//   this is to deal with special case where a password might be a username
//
function looksLikeUsername(input, skip_type_check){
  if (skip_type_check === null) {
    skip_type_check = false;
  }
  g_ctr_looksLikeUsername_R++;

  // allow input.type=='tel' here, to support telecomm related sites ?
  //
  if(!skip_type_check && input.type!='text' && input.type!='email')
    return false;

  //This is used by special sites (like boa) that
  //have 2 step logins. We know this url has a username field, we just
  //need to prevent it from showing up for non-username fields.
  //
  // per 2nd law of thermodynamics, this logic doesn't work on 
  // bankofamerica.com any more.
  //
  var regexp = new RegExp(lpgs('ff_username_regexp'), 'i');
  if(regexp.exec(input.name)){
    return true;
  }
  // zionsbank.com sets the placeholder text on the input field,
  // so check for that as well.
  var phtxt = input.getAttribute('placeholder');
  if (phtxt != null && phtxt.indexOf('Login')>=0) {
    return true;
  }

  var regexp2 = new RegExp(lpgs('ff_loginform_regexp'), 'i');
  if(input.form){
    var e = input.form.elements;
    for(var i = 0; i < e.length; i++){
      if(e[i].type=='submit'){
        if(e[i].name && regexp.exec(e[i].name) || regexp2.exec(e[i].name)){
          return true;
        }
      }
    }
  }

  // this seems to make it work for various login pages on bankforamerica.com
  // with their new online-id terminology.
  // put this here for now.
  regexp = new RegExp("^id$|.*-id|online.*id$");
  if(regexp.exec(input.name)){
    return true;
  }

  return false;
}

//
// click-handler on the image icons
// when clicked, show or hide the associated iframe for each
//
// events for the frames themselves are intercepted by handlers
// setup within the iframe
//
// if you create all iframes at once  vs.
// if you create iframes on demand
//
// CASE: popupfilltoggle() is associated as click handler to clickable icon.
// if user is logged in, then popup list gets created and runs tab.js,
// which calls back to the background thread to populate the list.
// 
// if user is logged out, then tab.js will try to talk to background
// thread but will be ignored.
//
// change this function name later.  it is poorly named
//
// case: sometimes g_port is null, disconnection between BG and CS.
//       when this happens, the toggle can't work.
//
// arg#1: now pass document obj
// arg#2: id of the DIV that contains the clickable image associated
//        with this event handler.  These DIVs will have id on them
//        regardless of whether the parent INPUT element does or not
// arg#3: INPUT element associated with this clickable image
// arg#4: if present and true (or 1) then pass it to BG to start popup iframe 
//        with password generation on.
// arg#5: if present and true (or 1), open an empty iframe, regardless of whether there are any
//        sites/formfills defined for a given site.
// arg#6: if present and true, bring up iframe with an initial state as spec'd
//        use POPUPTAB_XXX constants
//
// return void;
function popupfilltoggle (doc, id, parent_field, offergenerate, force_show, offersave) {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.

  if (g_port == null && g_ischrome) {
    console_log("disconnected from BG, abort"); 
    // -- if received, call closeclickables ?   may reduce confusion 
    // 
    return;
  }

  var opentosave = offersave ? true : false;
  if (g_save_suggest_msg) { 
    // close the suggestion message if present.
    setTimeout(function() { destroy_save_suggest_msg(doc, MSGDIVID, null) ; return false; }, 0);
  }


  g_keyboardNav = false;

  // seeding with the current contents of input field initiates an immediate
  // filter.  After playing with this, it seems like this may be more
  // confusing user experience than not.  So instead,
  // try setting this to '' at start, so that there is no filtering
  // until user types a key
  // var inputstr = parent_field.value;
                
  var inputstr;
  var inputtype = parent_field.type;  // could be null.
  var inputid = LP_getname(parent_field,LP_GETNAME_FAVOR_ID_OVER_NAME);
  if (g_clickable_input) {
  //if (0) {

    if (g_clickable_input_on_password) {
      var chk_username= g_popup_active_username ;
      var chk_password= g_popup_active_password ;
      if (chk_username == null) { 
        if ((typeof(parent_field.form)=='undefined') || parent_field.form == null) {
          chk_username = doc_get_orphan_username(doc);
        } else {
          chk_username = form_get_username(doc, parent_field.form);
        }
      }
      if (chk_password == null) { 
        if ((typeof(parent_field.form)=='undefined') || parent_field.form == null) {
          chk_password = doc_get_orphan_password(doc);
        } else {
          chk_password = form_get_password(doc, parent_field.form);
        }
      }

      //if (g_popup_active_username && g_popup_active_password) {
        
      if (chk_username && chk_password) {
        //var candidate_text = g_popup_active_username.value ;
        var candidate_text = chk_username.value ;
        verbose_log('PASS3 username='+candidate_text);
        if (candidate_text != null && candidate_text.length>0) {
          // now pass this to seed initial search string state
          inputstr = candidate_text;  
          sendBG({cmd:"popupfillinputsave", inputstr:inputstr, inputid:inputid, inputtype:inputtype});
        }

      } else {
        verbose_log('PASS2 pass empty string');
        // no active , do not pass text along.  or just init as '' ???
        inputstr = "";  
        sendBG({cmd:"popupfillinputsave", inputstr:inputstr, inputid:inputid, inputtype:inputtype});

      }
    } else {
      // now that clicking on the input field opens the window, 
      // setting the initial string to be '' is terribly confusing
      var candidate_text = parent_field.value ; 

      if (candidate_text != null && candidate_text.length>0) {
        // now pass this to seed initial search string state
        verbose_log('PASS1 pass parent field string '+candidate_text);
        inputstr = candidate_text;  
        sendBG({cmd:"popupfillinputsave", inputstr:inputstr, inputid:inputid, inputtype:inputtype});
      }
    }
  } else {
    inputstr = "";  
    sendBG({cmd:"popupfillinputsave", inputstr:inputstr, inputid:inputid, inputtype:inputtype});
    verbose_log('PASS0 pass empty string');
  }
  
  // validate field if (isInputPasswordField(doc, parent_field)) {}   ?

  var icon_container = doc.getElementById(id);
  // insert random number id/fid
  var seen ; 
  var pop = doc.getElementById( MAGICIFRAME+id );
  if (pop == null) {
    seen=false;
  } else { 
    seen=true;
  }
  // console_log('popupfilltoggle:seen='+seen); //DEBUG:     

  if (seen) {
    // destroy  (alternative, hide and restore later)
    pop.parentNode.removeChild(pop);
    g_popupfill_parent_last=g_popupfill_parent;
    g_popupfill_parent=null;  // GROSSSSSSSSS
    g_popupfill_ctr=0;  //mutex?          this is a boolean now.
    verbose_log('['+g_docnum+']: popupfilltoggle() set: g_popupfill_parent_last='+ g_popupfill_parent_last);
  } else {
    if ( g_popupfill_ctr >= g_popupfill_max ) {
      // close existing popups.  if (max > 1), perhaps close oldest
      // rather than old?
      closepopupfills(doc) ;
      g_popupfill_ctr = 0;  //mutex?        
    }
    g_popupfill_ctr=1;
    g_popupfill_parent=parent_field;  // GROSSSSSSSSS
    g_popupfill_parent_last=g_popupfill_parent;
    verbose_log('['+g_docnum+']: popupfilltoggle() set: g_popupfill_parent_last='+ g_popupfill_parent_last);



    // i do not like this.
    {
      var form_id = pickFormName( parent_field.form );

      // XX: change this from active field id to active form id
      //sendBG({cmd:"setpopupfilllastactive", active: field_id});
      offergenerate = offergenerate ? 1 : 0;
      sendBG({cmd:"setpopupfilllastactive", active: form_id, activefieldid: LP_getname(parent_field, LP_GETNAME_FAVOR_ID_OVER_NAME), ask_generate: offergenerate, opentosave:opentosave, activefieldtype: parent_field.type });
      //sendBG({cmd:"setpopupfilllastactive", active: form_id, offergenerate:offergenerate});
      // active is used as an index into bg.g_popupfill_hint
      // ask_generate to display generate page
    }
    


    var is_non_login_form = chk_form_is_nonlogin_form(document, parent_field.form);
    //var is_signup_form  = chk_form_ask_generate(document, parent_field.form);
    var hasLoginOrphans= checkDocumentForLoginOrphans(document);
    var is_login_form = (chk_form_has_password(document, parent_field.form) || hasLoginOrphans )

    var MAX_ROWS = 10;     // tune as desired.
    var rows = g_popupfill_rows;
    if(is_non_login_form && !is_login_form) {
      rows = g_popupfill_rows_FF;
    }
 
    var width = g_popupfill_widest + 40;  // set aside 40 for scrollbar, spacing, padding and margins
    var MIN_WIDTH = 120;  // hard-coded constants
    if (width < MIN_WIDTH) {
      width = MIN_WIDTH;
    }
    // case: always set minimum size of frame to be the width of
    // the parent input field.
    // this overrides what MAX_WIDTH may say
    if (width < g_popupfill_parent.offsetWidth) {
      width = g_popupfill_parent.offsetWidth; 
    }


    // CASE: if rows == 1, autofill it when icon is clicked
    // here rather than create a 1 row table?  
    // XXX: this only handles sites, not form fill profiles
    if (rows == 1  && !create_onerow_iframe) {
      var trigger_aid = null;
      // trigger handleFill?  this should already have been filled already

      if (g_fillaid) {
        // g_fillaid is set if a previous 'fill' MSG has been sent, will
        // this be uselessly redundant?
        trigger_aid = g_fillaid;
      } 
      if (! isEmptyObject( g_autofillsites ) ) {
        // is it safe to assume that g_autofillsites has only one object?
        trigger_aid = g_autofillsites[0].aid;
      }
      if (trigger_aid != null) {
        // if logged out then sendBG will handle it.
        sendBG({cmd:"autofillaid", aid:trigger_aid});
        verbose_log("filling only, not creating 1 row iframe");
        return;
      } else {
        verbose_log("tried to fill form with invalid acct");
      }
    }
    if ((rows==0  && !do_popup_actions) ||
        (rows==0  && force_show == NO_FORCE_NOHITS)) {
      // no matches - don't build a popup frame, as it would be empty.
      // if popup_actions are enabled (e.g. save site, generate password, etc.) 
      //   and the force_show flag is off, then it's ok to create the iframe.
      //   the force_show flag is expected to be set to true when triggered via
      //   keyboard/text events
      //   while force_show flag is false or null from click or mouse events
      verbose_log('not creating empty iframe');
    } else {

      if (g_dologin_clickable && !g_isloggedin) {
        // case: user is logged out, clicks on the icon.
        // issue login prompt.
        // if the login is successful, a recheck will be
        // initiated-that is done elsewhere, not by this function
        sendBG({cmd:"dologinaction"});
        return;
      }
    
 
      if (1) {
        sendBG({cmd:"popupregister", docnum: g_docnum} );
      }


      // create a new iframe
      var iframe_pos = calculate_iframe_pos(doc, icon_container, width);
      if (iframe_pos != null) {    // could return null on error
        var posx = iframe_pos.posx;
        var posy = iframe_pos.posy; 
  
        if (rows > MAX_ROWS) {
          rows=MAX_ROWS;
        }
        if(offergenerate){
          rows=MAX_ROWS;
        }
        if (do_popup_actions)  {
          // 4 rows required to display 4 actions
          // Save Site, Generate, Form Fill Profile, Never
          // rows += 4
          // this is no longer relevant as these rows have been replaced
          // by icon bar.
          // rows += objectSize (popup_actions_cfg); 
  
          rows += 2;  // have to reserve for the nav bar
        }
        // CREATE
        popupfill_create_iframe(doc, posx,posy,id,rows,width, g_minheight_override);
        g_popupfill_iframe_width_save=width;  // has a number only, no unit suffix
        //g_popupfill_iframe_height_save=height;  // has a number only, no unit suffix
        // this is set inside create_iframe
      } else {
        g_popupfill_ctr=0;  //think this will fix immediate closure problem
      }

      if (g_use_grey_icons) {
        change_clickable_icon_to_cancel(doc, icon_container.id);
        // displays a cancel button for the clickable button associated with
        // this iframe.
      }
    }

  }
  return;
}

//
// called from popupfilltoggle()
//
// when called, create a iframe for popup data
// frame.scrolling attrib?
// x,y have 'px' suffix, need parseInt()
// rows: number of rows passed along.  grow/shrink depending on number of elements
//     the rows var will be dependent on global var g_popupfill_rows
//     which gets set after html fragment is generated from createPopupFill();
// width: how wide to create the popup.  in pixels
//   id is the id associated with ;  if 0, just use existing size.
// minheight: if 0, use existing height.  if set, use as minimum value
//    it behaves differently than width/rows because it was glommed on later.
//
// nb: now pass document object
// returns void
//
// perhaps this should make sure the iframe doesn't exist yet.
function popupfill_create_iframe(doc, x,y,id,rows,width,minheight) {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  x = parseInt(x)+'px';  // just in case passed input doesn't have trailing px.
  y = parseInt(y)+'px';  // just in case passed input doesn't have trailing px.
  var body = doc.body;
  var pop = doc.createElement('iframe');
  pop.id= MAGICIFRAME+id; 
  //pop.src=getchromeurl("tab.html");
  pop.src=urlprefix + "popupfilltab.html";  // +urlextra ?


  if (parseInt(x) < 0) {
    // case: creating iframe within a thin login iframe off the parent webpage
    // align against left side of the iframe and force the login iframe to scroll.
    // next call to relocate should DTRT 
    x = "0px";
  }
  if (parseInt(y) < 0) {
    // case: creating iframe within a short login iframe off the parent webpage
    // align against top side of the iframe and force the login iframe to scroll.
    // next call to relocate should DTRT 
    y = "0px";
  }

  // alternate strategy:
  // pop.offsetWidth=-999em;  // create off screen, and then let the
  // subsequent relocate job put into  place.

  // this next block was after the appendchild(), try placing it
  // before the appendchild() so that the user doesn't see the iframe appear
  // in one location and then immediately shift its location.

  g_frame_css_str = 'position:absolute !important; visibility:visible !important; z-index:'+CLICKABLE_ICON_ZINDEX+' !important; border-style:solid !important; border-width:1px !important; border-color:#c2c2c2 !important; border-radius: 5px 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; box-shadow: 1px rgba(200, 200, 200, 0.5); -webkit-box-shadow: 1px 1px rgba(200, 200, 200, 0.5); -moz-box-shadow: 1px 1px rgba(200, 200, 200, 0.5);';
  pop.style.cssText = g_frame_css_str;

  body.appendChild(pop);

  // this next block must occur after the appendChild, otherwise Safari ignored it
  // and styled as width:100%/height:100% of the browser tab size
  if (1) {
    //pop.width=200+'px';  
    pop.width=parseInt(width) +'px';  
    // pop.height=100+'px';   // default, minimum height
    pop.height=26+'px';   // change for one row savesite super row  // + pad

    var HEIGHT_PER_ROW=24; // 18px per line * up to MAX_ROWS lines ?  12pt font + 4px pad = 16, 14pt font + 5px pad =19
      // use 24px with favicons
    var TITLE_HEIGHT=15; // 13px for the title bar + 2px slop
    if (typeof(rows)!='undefined' && rows > 0) {
      pop.height=rows*HEIGHT_PER_ROW +TITLE_HEIGHT +8 + 'px'; // +8 for table padding/margin
    }

// save initial iframe height
// there is no need for this now that resizes are issued from the iframe 
// for pretty much everything

    // still need it as fall back ? XYZZY
    //g_popupfill_iframe_height_save=parseInt(pop.height);

    if (parseInt(minheight)>0) {
      // in case a message to show the generate popup has been issued to CS,
      // grow height.
      // pop.height = Math.max(parseInt(pop.height), parseInt(minheight))+'px';

      // now, allow passed minheight to set
      pop.height = parseInt(minheight)+'px';
   
    } else {
      // revert to original state
      pop.height = parseInt(pop.height)+'px';
    }
  }

  // set !important to try to override the base webpage's iframe CSS rules
  var css_str = 'width: '+pop.width+' !important; height: '+pop.height+' !important; top:'+y+' !important; left:'+x+' !important; ';
  pop.style.cssText =  g_frame_css_str + css_str;

  return;
}



// #1 arg is how many ticks to elapse before the weasel pops again
// is there any way to trap on change?  seems like only with IE,
// so stuck with polling.
// 5ms == minimum delta
function weasel(t) {
  g_ctr_weasel++;  // perf ctr
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  if (typeof(t)=='undefined' || t==false || t==true || t<5) {
    t=200;  // default of 200 ms
  }
  g_weaseled=true;  // just in case.

  popupfill_resize() ;  // brute-force, but more elegant methods don't seem to work.
                        // if this is the only way, cache the location of objects

  g_weasel_id = setTimeout(function() {  weasel(t) }, t );
}

function end_weasel() {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  if (g_weasel_id != null) {
    clearTimeout(g_weasel_id);
    g_weasel_id = null;
    verbose_log("clearTimeout weasel");
    g_weaseled= false;
  }
}

//
// called as eventhandler for textInput event.
// given document (for context), the form element that was triggered, and the form that
// the element belongs to (3rd arg is probably un-necessary)
//
// TODO: check field and compare against formfill profile, per-field values
//
// was called as handler for textInput event, and payload was in event.data.
// now, called as handler for keyup event, and payload is in event.keyCode.
// 
// maybe remove 3rd arg 'form' and replace with var form=element.form
// maybe remove 2nd arg 'element' and replace with event.target.
//
function handle_form_text_change(doc, element, form, event) {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  // try {
    //if (form == null || element== null || event == null || event.data == null) {
    if (form == null || element== null || event == null || event.keyCode == null) {
      // WTF ???  should not happen.
      // alert('HFTC1');
      return;
    }

    // do not try to manipulate LastPass-related components
    if(form.name=='lpwebsiteeventform'){
      return;
    } else if(form.name=='lpmanualform'){
      return;
    }
    // verify SHOULD_DO_ALWAYS vs SHOULD_DO_LOGIN_ONLY
    if (!popupfill_shoulddofield(doc, element, SHOULD_DO_ALWAYS)) {
      return;  // skip radio buttons, etc.
    }

    // for now check username
    // if element.type==username, element.type==id

    var candidate_text = element.value ; 

    var inputid =  LP_getname(element, LP_GETNAME_FAVOR_ID_OVER_NAME);
    // pass inputid back to BG, in case user changes input fields

    if (g_clickable_input_on_password) {
      var chk_username = g_popup_active_username;
      var chk_password = g_popup_active_password;
      if (chk_username == null) {
        if ((typeof(element.form)=='undefined') || element.form == null) {
          chk_username = doc_get_orphan_username(doc);
        } else {
          chk_username = form_get_username(doc, element.form);
        }
      }
      if (chk_password == null) {
        if ((typeof(element.form)=='undefined') || element.form == null) {
          chk_password = doc_get_orphan_password(doc);
        } else {
          chk_password = form_get_password(doc,element.form);
        }
      }

      // xxx: verify form is ok.  clipped from doc_create_clickable...
      var hasLoginOrphans= checkDocumentForLoginOrphans(document);
      var is_login_form = (chk_form_has_password(document, form) || hasLoginOrphans);
      var is_non_login_form = chk_form_is_nonlogin_form(document, form);
      var is_signup_form = chk_form_ask_generate(document, form);  // skip loosen arg; KISS
      
      if (chk_username && chk_password && ((is_login_form || is_signup_form) && !is_non_login_form)) {

         if (element == chk_username) {
           // only pass into IF via BG if username is the active element
           // that user is typing into.  
           //sendBG({cmd:"popupfillinputsave", inputstr:candidate_text, inputid:inputid});
           //return;
           // don't stop here, just continue processing below, as before...
     
         } else if (element == chk_password ) {
           // if user is typing into password field, then
           // copy in the value from the userfield...
           //candidate_text = g_popup_active_username.value ; 
           candidate_text = chk_username.value ; 
           sendBG({cmd:"popupfillinputsave", inputstr:candidate_text, inputid:inputid, inputtype:'password'});
           verbose_log('KEYPASS4 username='+candidate_text);
           return;
         } else {
           // user is typing into a field that is not active username/password.
           // ignore?
           sendBG({cmd:"popupfillinputsave", inputstr:"", inputid:inputid});
           verbose_log('KEYPASS5 username=""')
           return;
         }
      } else {
        // formfill case - do not pass text along ?
        sendBG({cmd:"popupfillinputsave", inputstr:"", inputid:inputid});
           verbose_log('KEYPASS6 formfill? username=""')
        return;
      }
    }

    // if empty, do not attempt to auto-complete
    if (candidate_text == null || candidate_text.length==0) {
      // check for white-space only too?
      // edge case: if length is 0, still pass it along to popupiframe.
      sendBG({cmd:"popupfillinputsave", inputstr:"", inputid:inputid});
      verbose_log('KEYPASS7 empty username');
      return;
    }

    // a prior call of var autofillsites = getAutoFillArray(document, LPJSON.parse(data['sites']));
    // should have set g_autofillsites

    if (getcount(g_autofillsites) <= 0) {
      if (g_change_icon_on_input) {
        // do stuff below the matches test

      } else {
        return;  // error?  or force a refresh of this variable ?
      }
    }


    var matches=0;
    var lastmatch=null;
    for (var formcandidate in g_autofillsites) {
      //if (g_autofillsites[formcandidate].unencryptedUsername.indexOf(candidate_text) == 0) {
      if (g_autofillsites[formcandidate].useusername.indexOf(candidate_text) == 0) {
        matches++;
        lastmatch = g_autofillsites[formcandidate];
      }
    }
    if (matches == 1) {
      // what should happen -
      // if the user types in values, match and auto-fill
      // or leave it alone, and require user to specifically select ?

      // var do_autofill_if_matched=false;   
      // TUNABLE : if true, then if there is only 1 match, then the field
      // gets automatically filled.  if false, then the field does not
      // get auto-filled.  Still require user to click on dropdown and
      // click to fill.

      // autofill if matched
      if (do_autofill_if_matched) {
        sendBG({cmd:"autofillaid", aid:lastmatch.aid});
      } else {
        // don't autofill if matched:
        // pass it along to iframe so that one row will be displayed
        sendBG({cmd:"popupfillinputsave", inputstr:candidate_text, inputid:inputid, inputtype:element.type, issaveall:issaveall(form)});
      verbose_log('KEYPASS8 match>0 username='+candidate_text);
      }
      return;
    } else {
      // trim down size of the popup iframe?
      //
      // send msg to tab  CS->BG->tab?
      // keystroke goes to handle_form_text_change
      // if it matches more than one site, filter it down
      // pass msg to table 
      //
      // this should support arbitrary form field names, but currently is just
      // compared against the username/login name
      sendBG({cmd:"popupfillinputsave", inputstr:candidate_text, inputid:inputid, inputtype:element.type, issaveall:issaveall(form)});
      verbose_log('KEYPASS9 match>1 username='+candidate_text);

    }


    // XXX : if text has been added to this input field...
    // check other fields in this
    //
    // call chk_form_has_password() to verify there is a pw in this form?
    var is_login_form = chk_form_has_password(document, form);
    var found_input_to_password_field=false;
    if (g_change_icon_on_input) {
      // check this form.
      // if there is text input in the username
      // and then text inside an input field of type 'password'
      //
      // functionize but stick here for now.
      //
 
      var formElements = form.elements;
      if (formElements != null) {
        for(var j=0;j< formElements.length;j++){
          var elt = formElements[j];
          // verify that elt is an input ??? elt.tagName ?

          if (checkIsDisplayed(document, elt, 0) && (isInputFieldPassword(document, elt))) {
            if (elt.value != null && elt.value.length > 0) { 
              // this does not account for watermarks
              found_input_to_password_field=true;
              break;
            }
          }
        }
      }

if (false) {  // turn this off.  no longer useful as popup appears when click on input field...
      // if (matches == 0 && g_change_icon_on_input && is_login_form && found_input_to_password_field ) { 
      if (getcount(g_autofillsites) == 0 && g_change_icon_on_input && is_login_form && found_input_to_password_field ) {
        // candidate_text.length >0 by now; otherwise would have
        // exited this function by now.
        //
        // case: no matches to username, the currently active input field
        // belongs to a form that is a login form (or signup form?) .
        // 
        // if this case occurs, change the clickable icons for this form.
        //
        
        // logic
        // 1. iterate through all form elements
        // 2. find any icon containers based on this form.
        // 3. change icon.src of those containers.
        //
        for(var j=0;j< formElements.length;j++){
          var elt = formElements[j];
          var candidate_ic_id = MAGIC+LP_getname(elt,LP_GETNAME_FAVOR_ID_OVER_NAME);
          var candidate_ic = LP_getElementByIdOrName(document, candidate_ic_id) ;
          if (candidate_ic != null)  {
             // check if displayed ???
            var candidate_icon = document.getElementById(candidate_ic_id + "_icon");
            if (candidate_icon != null) {
               candidate_icon.src = icon_imgs['offersave'];
            }
            candidate_ic.setAttribute('intrinsic', 'offersave');  // for mouseover

          }
        }
      }
} // false
    } // g_change_icon_on_input ...


    // perhaps call formfills.js : lpCheckFormFill( dofill == false, checkonly == true)
    // to see if the form can/should be filled out?  checking each form element?
    //
    // if (lpCheckFormFill(null, document, false, true, null, 1, window)) {
    // }
    

  // } catch
}

function issaveall(form){
  var inputs = form.elements;
  var text = 0, password = 0, other = 0;
  for(var i = 0; i < inputs.length; i++){
    var t = inputs[i].type;
    if(t=="password")
      password++;
    else if(t=="text" || t=="tel" || t=="email")
      text++;
    else if(t=="textarea")
     other++;
  }

  //Use standard save for standard forms
  if(text==1&&password==1&&other==0){
    return false;
  }
  return true;
}

// move popups around, if necessary.
// at present, each input field can have it's own popup iframe.  perhaps 
// this should be limited to one per browser tab.
//
// now pass document obj
function relocate_popupfill_iframes(doc)  {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.

  var i;
  var iframes = doc.getElementsByTagName('iframe'); 
  for (i in iframes) {
    var afr = iframes[i]; // short-hand
    // check that id is set ?
    if ((typeof(afr.id) != 'undefined') && (afr.id != null)) {
      var iframeprefix = MAGICIFRAME;
      if (afr.id.indexOf(iframeprefix)==0 ) {
        var associated_id = afr.id.substr(iframeprefix.length);

        var icon_container = doc.getElementById(associated_id);
        if (icon_container != null) {
          var INHERIT_WIDTH = 0;
          var INHERIT_HEIGHT = 0;

          var iframe_pos = calculate_iframe_pos(doc, icon_container, g_minwidth_override>0 ? g_minwidth_override : INHERIT_WIDTH) ;
          if (iframe_pos != null) {        // error case, could return null
            var posx = iframe_pos.posx;
            var posy = iframe_pos.posy;

            // afr.style.left = parseInt(posx)+'px';
            var newleft = parseInt(posx)+'px';

            // align against the icon.
            //afr.style.top=parseInt(posy)+16+2 + 'px';  // 16 == size of icon, 2 pretty print
            // align against the input element
            //afr.style.top=parseInt(posy)+'px'; 
            var newtop = parseInt(posy)+'px';

            // in case there is a need to resize in X-dimension
            var newwidth;
            if (parseInt(g_minwidth_override)>0) {
              
              newwidth = Math.max ( parseInt(g_popupfill_iframe_width_save), parseInt(g_minwidth_override)) +'px';
              { // cut/paste here just to see if it will work.  all needs to be redone.  clean up later
                var base_width = getWindowWidth(window);
                if (parseInt(newwidth) + parseInt(newleft) > base_width) {
                  newleft = (base_width - parseInt(newwidth) - 20)+'px';  // 20 scroll bar.  wtf, base_width should have accounted for it
                  if (parseInt(newleft)<0) {
                    newleft='0px';  // crap
                  }
                }
              }

            } else {
              if (parseInt(g_popupfill_iframe_width_save)>0) {
                newwidth = parseInt(g_popupfill_iframe_width_save) + 'px';
              }
 
              // for thin parent iframes, align the lastpass popup-iframe against the left side 
              // test against: www.buran01.com
              if (parseInt(newleft)<0) {
                newleft='0px';  // crap
              }
            }

            // in case there is a need to resize in Y-dimension
            var newheight;
            if (parseInt(g_minheight_override)>0) {
              newheight = Math.max( parseInt(g_popupfill_iframe_height_save), parseInt(g_minheight_override)) +'px';
            } else {
              if (parseInt(g_popupfill_iframe_height_save)>0) {
                newheight = parseInt(g_popupfill_iframe_height_save) + 'px';
              }
              else {
                // fallback to existing height.
                // recomputation likely expensive here
                //
                // this sizing stuff needs to be re-done
                // XYZZY
                //newheight = getAbsolutePos(doc, afr).height + 'px';

                var gcs = getComputedStyle(afr);
                newheight = gcs.height;
              }
            }

            // edge case: iframe hangs off the edge of parent document
            // and the document size is hard-coded, say a child iframe
            // that contains the login form.
            // try alignment against bottom. 
            // alignment to right edge will have been computed inside
            // calculate_iframe_pos()

            // strategy #3, appears to be the winnar
            // if iframe as scrolling=no, you are screwed; overrides whatever css is set.
            // check if this is currently an iframe, or parent
            // BG cs_tops structure, or use 
            // window.self === window.top  test (triggers cross-domain violation errors in browser though)
            // logic: 
            //  1 issue new message to BG with source
            //  2 BG finds the top CS associated with the current tabid/docnum and its url
            //  3 BG issue new message to top level CS with url of iframe
            //  4 toplevel CS will iterate through iframes to find match, and set scroll on it
            //     or grow
                  
            if (g_iframe_scroll_hack && !g_frame_scrollable_set) {
              // tweak: enter this if iframe has changed size, or window has changed size?
  
              var nh = parseInt(newheight);
              var nw = parseInt(newwidth);

              //var dh = parseInt(document.height);
                // need to check that document.height works universally.
                // i have no idea if it is. nope it isn't.
                // trying to set document.body.style.overflow='scroll'
                // fails due to cross-domain security violation.
                // (same as trying to resize parent iframe from within child iframe)
              var docstyle = getComputedStyle(document.body);
              var dh = parseInt(docstyle.height);
              var dw = parseInt(docstyle.width);
              var viewport_height = window.innerHeight;
              var window_height = window.outerHeight;
              var viewport_width = window.innerWidth;
              var window_width = window.outerWidth;

              // new pup iframe bottom needs to be bigger than both viewport_height & window_height
         
              // strategy #2 : try to force scroll, if it isn't enabled.
              // iframe styling of overflow set to hidden, scrolling = no
              // will override ?
              // this can look gross.
              //if (docstyle.overflow != 'auto' && docstyle.overflow != 'scroll') {
              //  document.body.style.overflow = 'auto';
              //}

              // computing body style seems unreliable.
              //if (nh != null && nh > 0 && dh != null && dh > 0) {
              //  if (parseInt(posy)+nh > dh) {  // will this hang off bottom ?
              if ((nh != null && nh > 0 && viewport_height != null && viewport_height > 0) ||
                  (nw != null && nw > 0 && viewport_width != null && viewport_width > 0)) {

                if ((parseInt(posy)+nh > viewport_height) ||  // hangs off the bottom of the iframe.
                    (parseInt(posx)+nw > viewport_width)) {  // hangs off the side of the iframe.
                  var in_frame=false;                
                  try {
                    if (window.self != window.top) {  // is this CS in an iframe ?  (or frame)
                    in_frame=true;
                      }
                  } catch (e) {
                    // presume cross-domain error here
                    in_frame=true;
                  }
 
                  if (in_frame) {
                    verbose_log('ensuring this frame/iframe has scrolling enabled');
                    sendBG({cmd:"iframescrollenable", href:document.location.href});
                    //if (docstyle.overflow != 'auto' && docstyle.overflow != 'scroll') {
                    //  document.body.style.overflow = 'auto';
                    //}
                    g_frame_scrollable_set=true;
                  }
                }
              }
            }

            // strategy #1 : align against bottom right corner if possible, and against the top secondly.
            // faulty computation
            if (0) {  // 
              if (nh != null && nh > 0 && dh != null && dh > 0) {
                if (parseInt(posy)+nh > dh) { 
                  // if it hangs off edge...
                  newtop = dh - parseInt(newheight);
                  if (newtop<0) { 
                    // case: if the lastpass popup iframe is bigger than the
                    // parent iframe, what should be done ????
                    // size the lastpsas frame smaller and then 
                    // create scroll bars for user to scroll within ?
                    newtop = 0; 
                  }
                  newtop += 'px';
                }
              }
            }
    

            afr.style.position='absolute';  // is this necessary?
            // verify that it hasn't magically changed to relative?

            // set style IFF something has changed?
            var css_str = 'width: '+newwidth+' !important; height: '+newheight+' !important; top:'+newtop+' !important; left:'+newleft+' !important; ';
            afr.style.cssText =  g_frame_css_str + css_str;

          }
        } else {
          // if the parent icon was not found, presume that the
          // corresponding input field has been deleted (or hidden)
          // in this case, delete this popup fill ???  TODO
          // NB: if delete, then you will need to make a copy of
          // the iframes array to work against; see comment in
          // closepopupfills()

          // call closepopupfills() to do the needful.  case,
          // website creates a login form in a popup div that gets filled
          // in here, and then can close by user activity with [x] button
          closepopupfills(doc);

          // what if the original form element just gets hidden???
          // should close it too.
        }
      }
    }
  }
  return;
}

//
// destroy all clickable icons and the popupiframes.
// intended to be called when user is logged out, and
// background thread issues a closenotification msg to this CS thread
// piggyback onto closenotification for simplicity.  could use a
// separate message if you wanted to be pedantic.
//
// XXX when user logs in, closenotification is sent (in
// server.js:lpLoginResponse_win2():closeallnotification() which
// calls destroy_clickables.
// result: at login, the clickable icons are being created, and then
//   immediately destroyed
//
// now pass document object
function destroy_clickables(doc) {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  end_weasel();         // stop per 100ms  poll
  closepopupfills(doc);
  closeclickableicons(doc);

  if (g_save_suggest_msg) { 
    // close the suggestion message if present.
    setTimeout(function() { destroy_save_suggest_msg(doc, MSGDIVID, null) ; return false; }, 0);
  }

  // remove_popup_handlers(doc);
}

//
// called from destroy_clickables
// returns void
//
// now pass document object
function closeclickableicons(doc) {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.

    // now, consult g_popup_divs, which is populated with the id's of the icon containers
    // at create time.
    //
    var i;
    for (i in g_popup_divs) {
      if (g_popup_divs.hasOwnProperty(i)) {
        var ic = doc.getElementById(g_popup_divs[i]);
        if (ic != null) {
          if (g_do_icon_number_hint) {
            // remove the numeric hints as well.
            var numspan = doc.getElementById(ic.id + "_numspan" );
            if (numspan != null) {
              numspan.parentNode.removeChild(numspan);
            }
          }

          // and then try to kill it.  this diddles the
          // source page
          ic.parentNode.removeChild(ic);
        }
      }
    }
    g_popup_divs={};

  // NB: how do you un-highlight the field ?
  return;
}


// maybe use this
//function ofunderscore(s) {
// var key = s.replace(/[^a-zA-Z0-9_]/g, '_');
//}

// catch escapes to close the popup iframe
var KEY_ESCAPE = 27;   // also def'd in combobox.js
function keypress_handler(event) {
  var key = event.keyCode;
  if (key == KEY_ESCAPE) {
    closepopupfills(document);
  }
  return false;
}

var KEY_TAB=9;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_ENTER = 13;  // from combobox.js
var KEY_SHIFT = 16;
var KEY_RIGHT = 39;

// these are needed to navigate long list of sites.
// the right way is to set up new messages to pass to BG and for
// the iframe to pickup and process.
// the quick and dirty way is to reuse focusincrement/decrement messages
// pagedown to jump down X (12?) rows 
// pageup to jump down X (12?) rows
// end to scroll to bottom.
// home to scroll to top.
//
var KEY_PAGEDOWN = 34;
var KEY_PAGEUP= 33;
var KEY_END = 35;
var KEY_HOME = 36;

//
// tie to each INPUT element
//
// escape: close popups
// tab: close popups, while browser switches focus to the next HTML page element
function field_keypress_handler(event, field) {
  // is field passed correctly here?
  var key = event.keyCode;
  if (key == KEY_ESCAPE) {
    // if escape, close the popup
    closepopupfills(document);
  } else
  if (key == KEY_TAB) {
    // if tab, then focus would change to another field. 
    // in this case, close the popup as it is associated with this field
    closepopupfills(document);
  } else
  if (key == KEY_DOWN) {
    if (!is_your_popup_showing(document)) {
      // logic: keydown pressed on a field (tie this to keyup perhaps instead?)
      // given field name, compute associated icon container id
      // 2. check to see if clickable icon exists.  (if not, ignore? or create?)
      // 3. run popupfilltoggle if popup iframe doesn't exist yet.
      // 4.   popupfilltoggle will save value of input field via popupfillinputsave MSG but not
      //      trigger filtering logic itself
      // 5. on keyup, handle_form_text_change() will trigger filter logic. 
      // 
      var doc = document;
      var icon_container_id = MAGIC+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME);

                               
      // this is probably not the right way.
      set_active_username_password(document, field.form);

      popupfilltoggle(doc, icon_container_id, field, NO_FORCE_GENERATE, NO_FORCE_NOHITS); 
    }
  } else
  if (key == KEY_UP) {
  } else
  if (key == KEY_SHIFT || key == 0 ) {
    // shift keys are sent in fire_onchange() to simulate key strikes.
    // explicitly ignore them here.
    // also catch keycode of 0 per https://bugs.webkit.org/show_bug.cgi?id=16735
  } else
  //if (key == KEY_RIGHT  && event.ctrlKey) {
  if (key == KEY_RIGHT  && event.altKey) {
    // XXX ctrl-key-right never seems to occur.  bah humbug
    // alt-key-right does.  harder to remember though.
    //
    // ctrl-right arrow opens more window.
    // quick google suggests this does not conflict with other browser actions
    // except for IE, which toggles left-to-right and right-to-left key input behavior
    // (which can occur with Hebrew)

    if (g_extended_kbd_nav && is_your_popup_showing(document)) {
      sendBG({cmd:"popupfillinputmoreopen" });  // NEW MSG
    }

  } else

  if (key == KEY_ENTER) {
  } else {

    //Only pop if we are in a text field or password is the only input for this form
    if(field.type=="password" && formHasUsernameField(field)) {

      if (g_clickable_input_on_password) {
        // case:  user types into password field,
        //        user string has text previously entered.
        //        text in the userfield will be copied into the
        //        iframe.
        if (!is_your_popup_showing(document)) {
          // will set g_popup_active_username/password so that
          // the correct input gets passed into the iframe.
          conditional_create_popup(document, field) ;

        }

      } else {
        return;  
      }
    }

    var is_login_form = chk_form_has_password(document, field.form);
    if (!is_login_form) {
      return;
    }

    if (!is_your_popup_showing(document)) {
     if (!g_do_icon_number_hint) {
      // if number of matched sites are to be displayed
      // update the number but don't create it unless user explicitly hits 'down' to
      // show it.  This was Levi's suggestion.
      //
      // XXX this part wasn't checked in; half-baked
     }

 
      // logic: arbitrary text typed into input field  [filter out special/meta chars here?]
      // given field name, compute associated icon container id
      // 2. check to see if clickable icon exists.  (if not, ignore? or create?)
      // 3. run popupfilltoggle if popup iframe doesn't exist yet.
      // 4.   popupfilltoggle will save value of input field via popupfillinputsave MSG but not
      //      trigger filtering logic itself
      // 5. on keyup, handle_form_text_change() will trigger filter logic.   if immediate
      //      filter is confusing, tie this handler to keyup instead of keydown ?
      //

      if (g_clickable_input_on_password) {
        // if this is not a password field, 
        // check to see if user has typed in text into username field
        // as well as password field before
        // opening the popup.

        // only for login form.  do not do for formfills or signup forms
        // for special sites, presumably this form would have been
        // previously classified as a sites form 
        
        // cut-paste from doc_create_clickable_icons to see if this is sufficient.
        if (1) {
          //var hasLoginOrphans= checkDocumentForLoginOrphans(document);
          //var is_login_form = (chk_form_has_password(document, field.form) || hasLoginOrphans);
          //var is_non_login_form = chk_form_is_nonlogin_form(document, field.form);
          //if(specialsite){
          //  if(looksLikeUsername(inputs[i])){
          //    is_login_form = true;
          //    is_non_login_form = false;
          //  }else{
          //    continue;
          //  }
          //}
          // var is_signup_form = false;
          // no 3rd arg, this has the tighter signup logic
          //var is_signup_form = chk_form_ask_generate(document, ai.form);
          //
          // use the intrinsic instead

          var doc = document;
          var icon_container_id = MAGIC+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME);
          var ic = LP_getElementByIdOrName(document, icon_container_id) ;
          var intrinsic = ic.getAttribute('intrinsic');
          if (intrinsic != null && intrinsic == 'sites') {
            conditional_create_popup(document, field) ;
          }
        }
        // end grossness

      } else {
        var doc = document;
        var icon_container_id = MAGIC+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME);
        popupfilltoggle(doc, icon_container_id, field, NO_FORCE_GENERATE, NO_FORCE_NOHITS); 
      }

      // need this to get to initial state
      // sending this message will set focus to first row (same as hitting the down arrow
      // to create the popup).  unclear if this is desirable
      // sendBG({cmd:"popupfillinputfocusincrement", count:1 });
      g_keyboardNav = true;
    }
  }

  // trying to get up/down in the input field passed into the iframe to
  // navigate there. 
  // intercept page-up/page-down,home/end and set up new messages for them?
  // do a switch here.
  if (1) {
    if (key == KEY_UP) {
      // new msg CS->BG->tab ?
      sendBG({cmd:"popupfillinputfocusdecrement", count:1 });  // NEW MSG
      g_keyboardNav = true;

      // prevent the up from being processed by the browser and
      // change cursor position
      event.preventDefault();
      event.stopPropagation();
    }
    if (key == KEY_DOWN) {
      if (g_extended_kbd_nav && event.altKey && g_hide_navbar) {
        if (is_your_popup_showing(document)) {
          // experiment: alt-arrowdown = opens up the nav bar (and hides?)
          // but only if iframe exists and is present
          // otherwise, do not interpret the alt-arrowdown event
          sendBG({cmd:"popupfillinputshownavbar" });  // NEW MSG
        }
        
      } else {
        // new msg CS->BG->tab ?
        sendBG({cmd:"popupfillinputfocusincrement", count:1 });  // NEW MSG
        g_keyboardNav = true;
      }

      // prevent the up from being processed by the browser and
      // change cursor position
      event.preventDefault();
      event.stopPropagation();
    }
    if (key == KEY_ENTER) {

      if (g_popupfill_parent == field && g_keyboardNav) {
        // new msg CS->BG->tab ?
        sendBG({cmd:"popupfillinputfocuschoose" });  // NEW MSG

        // need this to prevent submit prior to autofill.  I hope this
        // does not break other stuff.
        event.preventDefault();
        event.stopPropagation();
      }
    } 
    if (key == KEY_PAGEUP) {
      sendBG({cmd:"popupfillinputfocusdecrement", count:12 });  // NEW MSG
      g_keyboardNav = true;

      // prevent it from being processed by the browser and
      // make the whole page scroll up/down
      event.preventDefault();
      event.stopPropagation();
    }
    if (key == KEY_PAGEDOWN) {
      sendBG({cmd:"popupfillinputfocusincrement", count:12 });  // NEW MSG
      g_keyboardNav = true;

      // prevent it from being processed by the browser and
      // make the whole page scroll up/down
      event.preventDefault();
      event.stopPropagation();
    }
    if (key == KEY_END) {
      // 2^30 should be plenty.
      sendBG({cmd:"popupfillinputfocusincrement", count:1073741824 });  // NEW MSG
      g_keyboardNav = true;
      event.preventDefault();
      event.stopPropagation();
    }
    if (key == KEY_HOME) {
      // 2^30 should be plenty.
      sendBG({cmd:"popupfillinputfocusdecrement", count:1073741824 });  // NEW MSG
      g_keyboardNav = true;
      event.preventDefault();
      event.stopPropagation();
    }


  }
  
  return false;
}

function formHasUsernameField(field){
  var form = field.form;
  if(form){
    var formElements = form.elements;
    for(var j=0;j< formElements.length;j++){
      var elt = formElements[j];
      if(elt.type=="text"||elt.type=="email")
        return true;
    }
  }
  return false;
}

//
// called from popupfill_resize()
// 
// now pass document obj
//
function relocate_popupfill_clickables(doc) {
    // now consult g_popup_divs, which is populated with the id's of the icon containers
    // at create time.  move each.


  try {
    var i;
    var removed=0;
    for (i in g_popup_divs) {
      if (g_popup_divs.hasOwnProperty(i)) {
        var cand=g_popup_divs[i].substr(MAGIC.length);
        if (cand!=null && cand.length>0) {
          var fieldname = cand;
          // the derived fieldname will be either field.name or field.id
          // so, pass to LP_getElementByIdOrName() to deal with both cases
          var field = LP_getElementByIdOrName(doc, fieldname);
          if (field == null) {
            // parent field has disappeared; delete it 
            // -folded in from closeclickableorphans()
            var ic = doc.getElementById(g_popup_divs[i]);   // find the DIV
            if (g_do_icon_number_hint) {
              var ic_num= doc.getElementById(g_popup_divs[i] + "_numspan");  // find floating num
            }
            if (ic != null) {
              ic.parentNode.removeChild(ic);
              verbose_log('relocate: deleting orphaned icon container for '+cand);
              removed++;
            }
            if (g_do_icon_number_hint) { 
              if (ic_num != null) {
                ic_num.parentNode.removeChild(ic_num);
                verbose_log('relocate: deleting orphaned icon number for '+cand);
                removed++;
              }
            }
            delete g_popup_divs[i];
          } else {
            if (g_do_icon_number_hint) {
              // what kind of field is this ?
              var ic = doc.getElementById(g_popup_divs[i]);
              if (ic != null) {
                // use somewhat odd prop name 'instrinsic' to avoid
                // potential future conflicts
    
                var intrinsic = ic.getAttribute('intrinsic');
                if (intrinsic != null && intrinsic != 'sites' && intrinsic != 'formfills') {
                  // case: unexpected value; do not display the numbers
                  intrinsic = null;
                }
                var tmpobj={}
                if (g_icon_number_overrides['sites']>0) {
                  tmpobj['sites'] =  g_icon_number_overrides['sites'] ;
                } else {
                  tmpobj['sites'] =  g_icon_numbers['sites'] ;
                }
                if (g_icon_number_overrides['formfills']>0) {
                  tmpobj['formfills'] =  g_icon_number_overrides['formfills'] ;
                } else {
                  tmpobj['formfills'] =  g_icon_numbers['formfills'] ;
                }
               
                //create_or_move_overlay_icon(doc, fieldname, NO_CREATE, intrinsic, g_icon_numbers);
                create_or_move_overlay_icon(doc, fieldname, NO_CREATE, intrinsic, tmpobj);

              } else {
                // ERROR.
              }
            } else {
              create_or_move_overlay_icon(doc, fieldname, NO_CREATE);
            }
          }
        }
      }  // hasOwnProperty
    }

    // if any orphaned icon containers had to be removed, check for
    // changes.  This is to work-around websites that have intercepted
    // the click handler that would have normally done this.  
    // e.g. iheart.com
    if (removed>0) {
      setTimeout(function() { checkShouldRecheck(); }, 500);  
    }

  } catch (e) { 
    verbose_log('relocate_popupfill_clickables caught error:' + e.message);
  }  // just in case.


// iterate through all input elements in the source webform
//  var inputs = doc.getElementsByTagName('input'); 
//  var i;
//  for (i in inputs) {
//    if (popupfill_shoulddofield(doc, inputs[i], SHOULD_DO_ALWAYS)) {
//        var ai=inputs[i];  // ai is short for active input
//        // edge case to check for: empty id or null id  XXX
//        // LP_getname returns ai.id, ai.name, or ''
//        // edge case: form has 2+ elements with no name or id.
//        var icid = MAGIC + LP_getname(ai, LP_GETNAME_FAVOR_ID_OVER_NAME);
//        var ic = doc.getElementById(icid);
//        if (ic != null) {
//          // the associated popup iframe will be moved 
//          // in relocate_popupfill_iframes()
//          // nb: have to pass ai thru LP_getname in case the INPUT field
//          //   has name defined but not id, like yelp.com
//          create_or_move_overlay_icon(doc, LP_getname(ai, LP_GETNAME_FAVOR_ID_OVER_NAME), NO_CREATE);
//        }
//     }
//  }
}

//
// called from createPopupFill()
//
// given an array of sites, sort it and then return it by
//  by last touch to retain same order as 
// the default in tabular display.  unsure if this is desirable.
//
// the original order of array here should be the same as when fromcs.js:cache_usernames()
// last manipulated it-also the same as when passed to createMenu above.  Multiple
// entries with last_touch==0 should appear in the same order that they appear in
// when passed from BG
//
//  sitesarr.sort (sort_popupfill_bylasttouch) 
//
function sort_popupfill_bylasttouch(a,b) {
    var aa;  var bb;
    if (a==null || a.last_touch==null || a.last_touch == 0)  {
      aa=2 << 29;
    } else {
      aa=a.last_touch;
    }
    if (b==null || b.last_touch==null || b.last_touch == 0)  {
      bb=2 << 29;       // biggest positive
    } else {
      bb=b.last_touch;
    }

    // reverse numeric.
    return bb-aa;
}

function scoresnumeric(a,b) {
  return (scores[b]-scores[a]);
}

// given #1 document obj, and #2 iconcontainer element of the clickable icon that
// the given iframe associated with.  #3 desired width of the iframe
// if width is 0, get width from existing size of it iframe
// returns 2 val object (posx,posy)
// relies on global 'MAGIC'
// locals: posx, posy, fieldname, field, field_pos
//
// ref: formtest1.html
function calculate_iframe_pos(doc, icon_container, frame_width) {
  if (!do_experimental_popupfill) { return null ; }  // abort if not in use.
  
  if (icon_container == null) { return null; }  // in case it was deleted in the interim

    var posx = icon_container.style.left;  // align against the left side of clickable icon
    var posy = icon_container.style.top;

    // to align against left-side of input field rather than the clickable icon
    // 1. derive name of associated input field from id.
    // 2. get absolute position of input field
    // 3. set posx against input field
    // 4. if 1 or 2 doesn't work then fall back to prev behavior of
    //    aligning against the clickable icon
    // this need the id not to have been cleansed
    {
      var fieldname = icon_container.id.substr(MAGIC.length);
      // the derived fieldname will be either field.name or field.id
      // so, pass to LP_getElementByIdOrName() to deal with both cases
      var field = LP_getElementByIdOrName(doc, fieldname);
      if (field != null) {
        var field_pos=getAbsolutePos(doc, field);  // returns numeric values
        if (field_pos != null) {
          posx = parseInt(field_pos.left) + 'px';
          posy = parseInt(field_pos.top) + parseInt(field_pos.height) + 'px';

          if (g_do_icon_number_hint) {
            //make room for the popup hint ?  quick hack
            posy = parseInt(field_pos.top) + parseInt(field_pos.height) + 4 + 'px';
          }
        }

        // case: INPUT elements float right, width small, but form element is big
        // still grows the window to the right, off the edge of the browser window
        // in this case, constrain by docking to the right side of the window rather than
        // the left side of the parent input element.  Turns out, it looks a little
        // awkward.  shrink the iframe to fit instead?

        // if no width was passed into this routine, get it from the
        // existing iframe, if possible
        if (frame_width == null || frame_width == 0) {
          var pop = doc.getElementById( MAGICIFRAME+icon_container.id );
          if (pop != null) {
            frame_width = getAbsolutePos(doc, pop).width;
          }
        }

        var base_width = getWindowWidth(window);
        if (parseInt(frame_width) + parseInt(posx) > base_width) {
           posx = (base_width - parseInt(frame_width))+'px';
           //posx = (base_width - parseInt(frame_width))+'px';
           // wtf, base_width should have accounted for scrollbar
           posx = (base_width - parseInt(frame_width)-20)+'px';

        }
      }
    }

    posx = parseInt(posx) + 'px';
    posy = parseInt(posy) + 'px';

    // posx, posy each returns numeric with 'px' suffix
    return ( {posx: posx, posy: posy} );
}

//
// convenience shorthand.
//
function verbose_log(msg) {
  // varargs
  if (verbose) {
    console_log(msg);
  }
}

function is_watermark(classname)
{
  return classname.indexOf('watermark') >= 0 && classname.indexOf('watermarkAble') == -1;
}

function checkAskGenerate() { };  // retired


//  var target = event ? event.target : this;
// pass target
function toggle_wrapper(target) {
}

//
// try to guess a form name for use as symbolic name in array indices
// given a form element,
// return a string.
// used in CS for obj forms_touched and 
//   in the BG for g_popupfill_last_active[tabid]
// returns 'none' if nothing can be found
// returns none if null was passed in; that's ok, you could have
//   a corresponding INPUT field outside of a FORM.
//
// #1 form.id
// #2 if form.id is not valid, try form.name
// #3 if form.name is not valid, try (form.action + form.className)
// #4 else use 'none'
//
// (try form.className ??  this is all because of lame, complicated webpages
// that have several poorly identified forms )
//
function pickFormName(form) {
  var form_id = "none";
  if (form != null) {
    form_id = LP_getname(form, LP_GETNAME_FAVOR_ID_OVER_NAME);
    if (form_id == null || form_id.length<=0) {
            //formid = 'none'; // edge case;  crap.  websites with multiple forms with no
                               //  name/id but different functions causes this to break.
                               // so try to fall back to form.action ?  or classname ?
                               // need separate func to pull id/name/action out of form-

      // twitter has multiple forms with no ID/no NAME, but same ACTION attributes,
      // including its login forms, one hidden, one displayed.  so, this doesn't work.
      //   form_id=form.action;
      //
      if ((form.action != null && form.action.length>=0) ||
          (form.className != null && form.className.length>=0)) {
        form_id = "FF" + form.action + form.className;
      } else {
        form_id='none';
      }
    }
  }
  return form_id;
}


//
// passed doc object
//
// find any orphan clickable icons & popup iframes (i.e. where the base webpage has
// deleted input fields on the page).  to be called from the weasel() job
//
//function closeclickableorphans(doc) {
//
//    // consult g_popup_divs, which is populated with the id's of the icon containers
//    // at create time.  check to see if each of the divs' associated parent field exists.
//    // if not, delete the icon container.
//    //
//    var i;
//    for (i in g_popup_divs) {
//      if (g_popup_divs.hasOwnProperty(i)) {
//        var cand=g_popup_divs[i].substr(MAGIC.length);
//        if (cand!=null && cand.length>0) {
//          var fieldname = cand;
//          // the derived fieldname will be either field.name or field.id
//          // so, pass to LP_getElementByIdOrName() to deal with both cases
//          var field = LP_getElementByIdOrName(doc, fieldname);
//          if (field == null) {
//            var ic = doc.getElementById(g_popup_divs[i]);
//            if (g_do_icon_number_hint) {
//              var ic_num= doc.getElementById(g_popup_divs[i] + "_numspan");  // find floating num
//            }
//            if (ic != null) {
//              ic.parentNode.removeChild(ic);
//              verbose_log('closeclickables: deleting orphaned icon container '+cand);
//            }
//            if (g_do_icon_number_hint) { 
//              if (ic_num != null) {
//                ic_num.parentNode.removeChild(ic_num);
//                verbose_log('relocate: deleting orphaned icon number for '+cand);
//              }
//            }
//            delete g_popup_divs[i];
//          }
//        }
//      }
//    }
//}


//ported from sso/firefox/lastpass.js
// probably doesn't belong here.
// needed for fire_onchange() to issue a fake shift keydown/keyup.
// window.KeyEvent is a Firefox object.  
//
// Borrowed from below, had to fix for our shit (e.g. adding LP.mostRecent())
// http://mxr.mozilla.org/seamonkey/source/testing/mochitest/tests/SimpleTest/EventUtils.js
function sendKey(aKey, aTarget) {
  try {
    keyName = "DOM_VK_" + aKey.toUpperCase();

    return send_simulated_key(aTarget, 0, KeyEvent[keyName], false);
    //return send_simulated_key(aTarget, 0, LP.mostRecent().KeyEvent[keyName], false);
  } catch(e) {
      lpdbg("error", e);
  }
  return null;
}

//ported from sso/firefox/lastpass.js
// probably doesn't belong here.
// needed for fire_onchange() to issue a fake shift keydown/keyup.
//
function send_simulated_key(aTarget, aCharCode, aKeyCode, aHasShift) {
  if (aTarget === undefined || aTarget.ownerDocument === undefined) {
    lpdbg("error", "No key target!");
    return false;
  }

  // see:
  // http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key
  var event = aTarget.ownerDocument.createEvent("KeyboardEvent");
  event.initKeyboardEvent("keydown", true, true, document.defaultView,
                     false, false, aHasShift, false,
                     aKeyCode, aKeyCode);

  if (0) {
    // orwellophile's hack for chromium
    Object.defineProperty(event, 'keyCode', { get: function() { return this.keyCodeVal; } });
    Object.defineProperty(event, 'which', { get: function() { return this.keyCodeVal; } });
    event.keyCodeVal = aKeyCode;
  }

  var accepted = aTarget.dispatchEvent(event);

  // ignore keypress logic here; firefox-specific

  // Always send keyup
  event = aTarget.ownerDocument.createEvent("KeyboardEvent");
  event.initKeyboardEvent("keyup", true, true, null,
                     false, false, aHasShift, false,
                     aKeyCode, aKeyCode);
  if (0) {
    // orwellophile's hack for chromium
    Object.defineProperty(event, 'keyCode', { get: function() { return this.keyCodeVal; } });
    Object.defineProperty(event, 'which', { get: function() { return this.keyCodeVal; } });
    event.keyCodeVal = aKeyCode;
  }

  aTarget.dispatchEvent(event);
  return accepted;
}


// probably doesn't belong here.
// http://stackoverflow.com/questions/5681146/chrome-10-keyevent-or-something-similar-to-firefoxs-keyevent
// simulate FireFox-specific KeyEvent object.
if (typeof KeyEvent == "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}


// associate with click event, DOM subtree modified event handlers
//
// dynamic webpage may result in input fields being deleted/hidden or created/shown.
// issue cmd to BG to recheck if necessary.
// updates global variable g_input_cnt
//
// may need time for webpage do it's stuff before counting... wrap this func in setTimeout?
function checkShouldRecheck() {
    if (do_experimental_popupfill) {
      // this seems very brute-force.  need a better way to deal
      // with dynamically created/mutated forms.  unfortunately DOM mutation observer
      // does not account for CSS changes
      //

      // on a click, check if the number of visible INPUTs have changed.
      // on some web pages, clicking on a link will unhide a login panel
      // or a registration panel, showing a previously hidden form
      // if the number of visible inputs has changed, fire up a recheck event.
      // not as correct as checking names/ids of the inputs, but it is faster.
      // does not run until the initial call to SetupIcon()
      if (g_input_cnt >=0) {
        // case: when user has clicked and this countInputs() runs, the base page may 
        // not have been updated yet with the new INPUTs.
        // 

        var nowseen = countInputs(document);
        //verbose_log("checkShouldRecheck() : was "+g_input_cnt+", now "+nowseen);
        if (g_input_cnt != nowseen) {

          // forms that have been evaluated based on one set of visible inputs 
          // will need to be re-evaluated now that some have appeared/disappeared.
          formcachereset(document);

          // was 100ms; try giving website more time to finish changing
          // it's stuff; for slow animation effects.
          setTimeout(function() { sendBG({cmd:'recheckpage'}); }, 200);

          g_input_cnt = nowseen;
        }
      }
    }
}


// set flag to prevent this being called more than once per document.
// not sure if necessary
var g_did_setupInputObserver=false;

function setupInputObserver() {
  if (do_experimental_popupfill) {
    // Mutation Observers are proposed for DOM4 spec.  This is
    // available in chrome 18, safari 6.0 and later.  
    if (typeof(WebKitMutationObserver)!='undefined')  {
      var observer = new WebKitMutationObserver( function(mutations) {
        g_ctr_mutation_observer++;
        var docheck=false;
        mutations.forEach(function(mutation) {
          var i;
          // check if any INPUTs have been added.  if so, force a recheck
          if (docheck == false) {
            for (i=0; i<mutation.addedNodes.length;i++) {
              if (mutation.addedNodes[i].tagName == 'INPUT') {
                docheck=true;  // local to parent func
                break;
              }
            }
          }
          if (docheck == false) {
            // check if any INPUTs have been deleted.  if so, also force a recheck
            for (i=0; i<mutation.removedNodes.length;i++) {
              if (mutation.removedNodes[i].tagName == 'INPUT') {
                docheck=true;
                break;
              }
            }
          }
        });
        var now = (new Date()).getTime();
        if (docheck) {
          if (1) {
          // TEMP DISABLE: is dropping rechecks ?
          //if ((g_last_recheck == null) || (now - g_last_recheck > 1000)) { 
            checkShouldRecheck();
            g_last_recheck = now;
          } else {
            // only allow mutation observer to trigger recheck at most once per second
            // user click might issue an immediate recheck, followed by
            // a website DOM change quickly issued afterwards.
            //
            console_log('recheck too soon, skipped');
          }
        }
      });
      if (observer != null) {
        observer.observe(document, {childList: true, subtree: true});
        g_did_setupInputObserver=true;
      }
    }
  }
  return;
}

// assign to each INPUT field of type TEXT or PASSWORD and all of
// its parent elements, on attribute change for style/class attribute
// changes.  Only way to check for CSS style changes, I think.
// I.e. entire document.
// 
function setupInputObserverPerInput() {
}



// given an DOM element that has class watermark
// return true if it should be treated as a password field.
// return false if not.
function is_watermark_password(elt) {
  if (elt == null) {
    return false;
  }

  var attr_idx; var skip_idx;
  // trained against iheart.com, scottrade.com, gunbroker.com
  var skip_fields=[ 'email', 'search', 'email_confirm', 'keywords', 'quote', 'postal', 'zip' ];
    // values of fields that do not seem to be password fields.

  var attrib=[ 'name', 'value', 'id', 'data-watermark-text' ];
    // element's attributes to check values of, if present

  for (attr_idx in attrib) {
    if (attrib.hasOwnProperty(attr_idx) && attrib[attr_idx]!= null) {
      var ea = elt.getAttribute(attrib[attr_idx]);
      if (ea != null && ea.length >0) {
        var eai = ea.toLowerCase();  // element, active, case in-sensitive
        for (skip_idx in skip_fields) {
          if (skip_fields.hasOwnProperty(skip_idx) && skip_fields[skip_idx] != null) {
            if (eai.indexOf(skip_fields[skip_idx]) >= 0) {
              return false;
            }
          }
        }
        if (eai.indexOf('password')>=0) {
          return true;
        }
      }
    }
  }

  return true;
}


//
// http://www.backalleycoder.com/2013/03/14/oft-overlooked-overflow-and-underflow-events/
// 
//function addFlowListener(element, type, fn){
//  var flow = type == 'over';
//  element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function(e){
//    if (e.type == (type + 'flow') ||
//      ((e.orient == 0 && e.horizontalOverflow == flow) || 
//      (e.orient == 1 && e.verticalOverflow == flow) || 
//      (e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow))) {
//      return fn.call(this, e);
//    }
//  }, false);
//}
//

//
// called when a child CS issues a "iframescrollenable" MSG to BG, and the
// BG issues a "iframescrollenable" MSG from BG to toplevel CS for this tab
//
// based on google searches, the enable/disable scrollbars on iframes is very
// browser-specific, and browser-version specific.  ie6 vs ie7 vs ie8 vs ie9 all
// have varying behaviors, and these are also distinct between firefox/chrome
//
// strategy:1 set scrolling attribute=auto on iframe, set overflow=auto ON iframe itself
// strategy:2 set overflow=auto INSIDE iframe
// NB: these strategies are very browser/browser-version specific.
//   both enableScrollOnIframe() and enableScrollWithinIframe() need to be
//   totally redone for to handle IE6, IE7, IE8, and IE9 separately
//   height, min-height.  ie8 cannot have height set.  no explicit method at all
//   to enable/disable scrollbars in ie7?  suggested hack for ie7 was to set height to 103%
//
function enableScrollOnIframe(href) {
  // check FRAME and IFRAME or is it enough to check against just IFRAMEs ?
  var iframes=document.getElementsByTagName('IFRAME');
  var x;
  var iframe=null;
  if (iframes != null && iframes.length > 0) {
    //for (x in iframes) {
      //if (iframes.hasOwnProperty(x)) 
    //  }

    for (x=0; x<iframes.length; x++) {
        iframe = iframes[x];
        // may trigger cross-domain violation errors here...
        // un-punycode  ??
        // case: src is relative, or does not specify protocol or method
        // straight compare will fail.

        // case: base: HTTP:80, sign-in iframe HTTPS:443
        // so ignore the prot
        var hrefnoprot = href.replace(/^(https:|http:)/, '');  

        if (iframe.src == href || iframe.src.indexOf(href)>0 || iframe.src.indexOf(hrefnoprot)>0) {
          // prefer auto over yes, so that scrollbars get turned on only if
          // really needed.

          // if this immediately causes the iframe to create a scrollbar and scroll,
          //  don't propagate this scroll event along to the base.
          // overflowchanged
          //
          //iframe.addEventListener('scroll', function(event) { 
          //     event.preventDefault();
          //     event.stopPropagation(); } );  


          iframe.setAttribute('scrolling', "auto");  
          iframe.style.overflow = "auto";
          verbose_log('enabling scroll on iframe to '+href)
        }
    }
  }
}
           
function enableScrollWithinIframe() {
  // logic: 
  // if current != top then it is an iframe
  // if iframe, then set overflow=auto on body element
  // do it only if the popup is active; this reduces collateral damage to base 
  //   website's styling (but setting overflow=auto when it was visible/none
  //   is likely to screw up the spacing within the iframe if was created
  //   as a small dialog and the elements within the iframe have height
  //   set to 100%
  //

  if (is_your_popup_showing(document) && (window.self != window.top)) {
    document.body.style.overflow='auto';
  }

  return;
}


// for websites that are ignoring fill, try
// sending keypress events rather than set value on input fields...
// no help.
//
// given document object, input element, string to inject
//
// return null on error
//
//function simulateTypedString(doc, elt, str) {
//  if (doc == null || elt == null || str == null || str.length<=0) {
//    return null; 
//  } 
//
//  if (elt.type != 'text' && elt.type != 'password') {
//    return false;  // only inject into text/password fields.  
//      // maybe textarea,email,url is ok too?
//  }
//
//  elt.focus();
//
//  try{
//  
//  var i=0; var ch="";  var keycode=0;
//  var doshift=false;
//  for (i =0; i<str.length;i++) {
//    keycode = 0;
//    doshift=false;
//    ch = str.substr(i,1);
//    // lookup code
//    // 
//    // regular expressons are expensive to do in JS
//    var regexp_num = new RegExp("^[0-9]$");
//    var regexp_lower = new RegExp("^[a-z]$");
//    var regexp_upper = new RegExp("^[A-Z]$");
//    if (regexp_num.exec(ch) || regexp_upper.exec(ch)) {
//      keycode = ch.charCodeAt(0);
//      // for these characters, the javascript code == ascii code.  
//    } else if (regexp_lower.exec(ch)) {
//      keycode = ch.charCodeAt(0) - 32;
//      doshift = true;
//    }
//    
//    if (keycode > 0) {
//      send_simulated_key(elt, null, keycode, doshift);
//      // injet a delay?
//    }
//  }
//  } catch(e) {
//    verbose_log('simulateTypedString(): '+e.message);
//  }
//  return true;
//}
var lpParseUriCache=[],lpParseUriNumber=0;
function lpParseUri(a){if("string"!=typeof a)return"";if(null!=lpParseUriCache[a])return lpParseUriCache[a];var b=null,c=null,d=a;-1!=a.indexOf("#")&&(c=a.substring(a.indexOf("#")+1),a=a.substring(0,a.indexOf("#")));-1!=a.indexOf("?")&&(b=a.substring(a.indexOf("?")+1),a=a.substring(0,a.indexOf("?")));var f=a.match(/^(.*:\/\/[^\/]+\/.*)@/);f&&(a=a.substring(0,f[1].length)+a.substring(f[1].length).replace(/@/g,"%40"));if(2047<a.length)return"";var e=lpParseUri.options,f=null;try{f=e.parser[e.strictMode?
"strict":"loose"].exec(a)}catch(g){try{f=500<a.length?e.parser[e.strictMode?"strict":"loose"].exec(a.substr(0,500)):e.parser[e.strictMode?"strict":"loose"].exec(a.substr(0,floor(a.length/2)))}catch(h){lpReportError("parseuri : failing "+a),f=e.parser[e.strictMode?"strict":"loose"].exec("http://")}}a=f;for(var j={},f=14;f--;)j[e.key[f]]=a[f]||"";j[e.q.name]={};j[e.key[12]].replace(e.q.parser,function(a,b,c){b&&(j[e.q.name][b]=c)});null!=b&&(j.query=b,null!=c&&(j.anchor=c));j.host&&(j.host=fix_url_host(j.host));
if(500<lpParseUriNumber){for(var k in lpParseUriCache){delete lpParseUriCache[k];break}lpParseUriNumber=0}lpParseUriCache[d]=j;lpParseUriNumber++;return j}
lpParseUri.options={strictMode:!1,key:"source protocol authority userInfo user password host port relative path directory file query anchor".split(" "),q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};
var lpCanUrlCache=[],lpCanUrlExNumber=0;
function lpcanonizeUrl(a,b){if("about:blank"==a)return"";if(null!=lpCanUrlCache[a])return lpCanUrlCache[a];null==b&&(b=lpParseUri(a));var c="";""!=b.port&&b.port!=get_default_port(b.protocol)&&(c=":"+b.port);if(b.host)c=b.host.toLowerCase()+c+b.path;else{if(!a)return"";c=a}-1!=c.indexOf(";")&&(c=c.substring(0,c.indexOf(";")));if(500<lpCanUrlExNumber){for(var d in lpCanUrlCache){delete lpCanUrlCache[d];break}lpCanUrlExNumber=0}lpCanUrlCache[a]=c;lpCanUrlExNumber++;return c}
function lp_gettld(a,b){("undefined"==typeof lp_all_tlds||null==lp_all_tlds)&&lp_init_tlds();if("string"!=typeof a)return"";if(""==a&&"string"==typeof b&&0==b.indexOf("file://"))return"file:";a=a.toLowerCase();a=a.replace(/\.$/,"");var c=a.split("."),d;if(a.match(/^\d+\.\d+\.\d+\.\d+$/))d=4;else if(d=2,2<=c.length){var f=c[c.length-1];"undefined"!=typeof lp_all_tlds[f]&&lp_in_array(c[c.length-2],lp_all_tlds[f])&&(d=3)}for(;c.length>d;)c.shift();return c.join(".")}
function lp_gettld_url(a){var b=lpParseUri(a);return lp_gettld(b.host,a)}function getname_url(a){a=lpParseUri(punycode.URLToUnicode(a));return("string"==typeof a.host?a.host:"").replace(/^www\./,"")}function lptrim(a){return"string"!=typeof a?a:a.replace(/^\s+|\s+$/g,"")}function lp_regexp_quote(a){return(a+"").replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g,"\\$1")}
function getname(a,b){if(b&&"undefined"!=typeof a.id&&""!=a.id)return a.id;if("undefined"!=typeof a&&null!=a){if("undefined"!=typeof a.name&&""!=a.name)return a.name;if("undefined"!=typeof a.id)return a.id}return""}
function lpIsVisible(a,b){for(;a&&"BODY"!=a.tagName;a=a.parentNode){if("undefined"!=typeof a.style&&("hidden"==a.style.visibility||"none"==a.style.display))return!1;try{var c=a.ownerDocument.defaultView.getComputedStyle(a,"");if("hidden"==c.visibility||"none"==c.display)return!1}catch(d){}if(b)break}return!0}function lp_in_array(a,b){for(var c=b.length,d=0;d<=c;d++)if("undefined"!=typeof b[d]&&b[d]==a)return lpArrayOffset=d,!0;return!1}
function strip(a){if(!a.length)return a;a=a.replace(/\s+/g," ");a=a.replace(/^\s+|\s+$/g,"");a=a.replace(/[\|]+$/g,"");var b=a.match(/\|([^\|]+)$/);b&&(a=b[1],a=a.replace(/^\s+|\s+$/g,""));return a}function lpxmlescape(a){"number"==typeof a&&(a=""+a);a=a.replace(/&/g,"&amp;");a=a.replace(/</g,"&lt;");a=a.replace(/>/g,"&gt;");return a=a.replace(/"/g,"&quot;")}
function lpxmlunescape(a){"number"==typeof a&&(a=""+a);a=a.replace(/&lt;/g,"<");a=a.replace(/&gt;/g,">");a=a.replace(/&quot;/g,'"');return a=a.replace(/&amp;/g,"&")}var lpRegExCache=[],lpRegExNumber=0;
function regexp_match_c(a,b){var c=a.toString()+"_"+b;80<c.length&&("function"==typeof fasthash?c=fasthash(c):"function"==typeof SHA256&&(c=SHA256(c)));if(null!=lpRegExCache[c])return"1"==lpRegExCache[c];var d=a.exec(b);if(2500<lpRegExNumber){for(var f in lpRegExCache){delete lpRegExCache[f];break}lpRegExNumber=0}lpRegExCache[c]=d?"1":"0";lpRegExNumber++;return d}
function fire_onchange(a,b,c){try{if(a){if(a.ownerDocument&&"function"==typeof a.ownerDocument.createEvent){var d=a.ownerDocument.createEvent("Events");d.initEvent("change",!0,!0);a.dispatchEvent(d);"undefined"!=typeof ischrome&&(ischrome&&"function"==typeof a.onkeyup)&&(c&&(d.keyCode=8),a.onkeyup(d))}else"undefined"!=typeof a.fireEvent&&a.fireEvent("onchange");("undefined"==typeof b||null==b||b)&&"function"==typeof sendKey&&sendKey("SHIFT",a);if("function"==typeof lpGetBrowserForDocument){var f=
lpGetBrowserForDocument(a.ownerDocument);f&&(f.lpfieldchanged=!0)}}}catch(e){}}function get_default_port(a){switch(a){case "http":return 80;case "https":return 443;case "ftp":return 21;default:return 0}}function get_port(a){var b=0;"undefined"!=typeof a.port&&a.port?b=a.port:"undefined"!=typeof a.protocol&&a.protocol&&(b=get_default_port(a.protocol));return b}
function compare_ports(a,b){var c=""!=a.port?a.port:get_default_port(a.protocol),d=""!=b.port?b.port:get_default_port(b.protocol);return c==d}function array_size(a){var b=a.length?--a.length:-1,c;for(c in a)b++;return b}function lpgetlocalts(){return(new Date).getTime()}function lp_get_gmt_timestamp(){var a=(new Date).getTime();return parseInt(a/1E3)}function lp_get_local_timestamp(){return lp_get_gmt_timestamp()}
function lp_init_tlds(){if("undefined"==typeof lp_all_tlds||null==lp_all_tlds)lp_all_tlds=[],lp_all_tlds.hu="2000 agrar blogspot bolt casino city co com erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news nui org priv reklam sex shop sport suli szex tm tozsde utazas video".split(" "),lp_all_tlds.nl=["752","blogspot","bv","co"],lp_all_tlds.ca="ab bc blogspot co gc mb nb nf nl ns nt nu on pe qc sk yk".split(" "),lp_all_tlds.pa="abo ac com edu gob ing med net nom org sld".split(" "),
lp_all_tlds.se="a ab ac b bd blogspot brand c com d e f fh fhsk fhv g h i k komforb kommunalforbund komvux l lanarb lanbib m mil n naturbruksgymn net o org p parti pp press r s sshn t tm u w x y z".split(" "),lp_all_tlds.ac="ac co com edu gov gv mil net or org".split(" "),lp_all_tlds.ae="ac co com gov mil name net org pro sch".split(" "),lp_all_tlds.at="ac biz co gv info or priv".split(" "),lp_all_tlds.be="ac ap blogspot co com fgov to xa".split(" "),lp_all_tlds.cn="ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hk hl hn jl js jx ln mil mo net nm nx org qh sc sd sh sn sx tj tw xj xn--55qx5d xn--io0a7i xn--od0alg xz yn zj".split(" "),
lp_all_tlds.cr="ac co ed fi go or sa".split(" "),lp_all_tlds.cy="* ac biz com ekloges gov info ltd name net org parliament press pro tm".split(" "),lp_all_tlds.fj="* ac biz com gov id info mil name net org pro school".split(" "),lp_all_tlds.fk="* ac co gov net nom org".split(" "),lp_all_tlds.gg="ac alderney co gov guernsey ind ltd net org sark sch".split(" "),lp_all_tlds.gn="ac com edu gov net org".split(" "),lp_all_tlds.gt="com edu gob ind mil net org".split(" "),lp_all_tlds.id="ac biz co go mil my net or sch web".split(" "),
lp_all_tlds.il="* ac co gov idf k12 muni net org".split(" "),lp_all_tlds.im="ac co gov net nic org".split(" "),lp_all_tlds["in"]="ac blogspot co edu ernet firm gen gov ind mil net nic org res".split(" "),lp_all_tlds.ir="ac co gov id net org sch xn--mgba3a4f16a xn--mgba3a4fra".split(" "),lp_all_tlds.is="ac com edu gov int net org".split(" "),lp_all_tlds.je="ac co gov ind jersey ltd net org sch".split(" "),lp_all_tlds.jp="ac ad aichi akita aomori blogspot chiba co ed ehime fukui fukuoka fukushima gifu go gov gr gunma hiroshima hokkaido hyogo ibaraki ishikawa iwate kagawa kagoshima kanagawa kawasaki kitakyushu kobe kochi kumamoto kyoto lg mie miyagi miyazaki nagano nagasaki nagoya nara ne net niigata oita okayama okinawa or org osaka saga saitama sapporo sendai shiga shimane shizuoka tochigi tokushima tokyo tottori toyama wakayama yamagata yamaguchi yamanashi yokohama".split(" "),
lp_all_tlds.kr="ac blogspot busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam kg mil ms ne nm or pe re sc seoul ulsan".split(" "),lp_all_tlds.mw="ac biz co com coop edu gov int museum net org".split(" "),lp_all_tlds.nz="* ac co cri geek gen govt iwi maori mil net org school".split(" "),lp_all_tlds.ru="ac adygeya altai amur amursk arkhangelsk astrakhan baikal bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia cmw com dagestan dudinka e-burg edu fareast gov grozny int irkutsk ivanovo izhevsk jamal jar joshkar-ola k-uralsk kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov kms koenig komi kostroma krasnoyarsk kuban kurgan kursk kustanai kuzbass lipetsk magadan magnitka mari mari-el marine mil mordovia mosreg msk murmansk mytis nakhodka nalchik net nkz nnov norilsk nov novosibirsk nsk omsk orenburg org oryol oskol palana penza perm pp pskov ptz pyatigorsk rnd rubtsovsk ryazan sakhalin samara saratov simbirsk smolensk snz spb stavropol stv surgut syzran tambov tatarstan test tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vdonsk vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yaroslavl yekaterinburg yuzhno-sakhalinsk zgrad".split(" "),
lp_all_tlds.rw="ac co com edu gouv gov int mil net".split(" "),lp_all_tlds.au="act asn com conf csiro edu gov id info net nsw nt org oz qld sa tas telememo vic wa".split(" "),lp_all_tlds.th="ac co go in mi net or".split(" "),lp_all_tlds.tj="ac biz co com edu go gov int mil name net nic org test web".split(" "),lp_all_tlds.tz="ac co go hotel info me mil mobi ne or sc tv".split(" "),lp_all_tlds.ug="ac co com go ne or org sc".split(" "),lp_all_tlds.uk="!bl !british-library !jet !mod !national-library-scotland !nel !nic !nls !parliament * ac co com gov icnet ltd me mil net nhs org plc police sch".split(" "),
lp_all_tlds.vn="ac biz com edu gov health info int name net org pro".split(" "),lp_all_tlds.yu=["ac","co","edu","org"],lp_all_tlds.za="* ac alt city co com edu gov law mil net ngo nom org school tm web".split(" "),lp_all_tlds.zm="* ac co gov org sch".split(" "),lp_all_tlds.zw=["*","ac","co","gov","org"],lp_all_tlds.br="adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop dpn ecn eco edu emp eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus leg lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl radio rec slg srv taxi teo tmp trd tur tv vet vlog wiki zlg".split(" "),
lp_all_tlds.ht="adult art asso com coop edu firm gouv info med net org perso pol pro rel shop".split(" "),lp_all_tlds.mv="aero biz com coop edu gov info int mil museum name net org pro".split(" "),lp_all_tlds.pl="6bone agro aid art atm augustow auto babia-gora bedzin beskidy bialowieza bialystok bielawa bieszczady biz boleslawiec bydgoszcz bytom cieszyn co com czeladz czest dlugoleka edu elblag elk gda gdansk gdynia gliwice glogow gmina gniezno gorlice gov grajewo gsm ilawa info irc jaworzno jelenia-gora jgora kalisz karpacz kartuzy kaszuby katowice kazimierz-dolny kepno ketrzyn klodzko kobierzyce kolobrzeg konin konskowola krakow kutno lapy lebork legnica lezajsk limanowa lodz lomza lowicz lubin lublin lukow mail malbork malopolska mazowsze mazury mbone med media miasta mielec mielno mil mragowo naklo net ngo nieruchomosci nom nowaruda nysa olawa olecko olkusz olsztyn opoczno opole org ostroda ostroleka ostrowiec ostrowwlkp pc pila pisz podhale podlasie polkowice pomorskie pomorze powiat poznan priv prochowice pruszkow przeworsk pulawy radom rawa-maz realestate rel rybnik rzeszow sanok sejny sex shop siedlce sklep skoczow slask slupsk sopot sos sosnowiec stalowa-wola starachowice stargard suwalki swidnica swiebodzin swinoujscie szczecin szczytno szkola targi tarnobrzeg tgory tm torun tourism travel turek turystyka tychy usenet ustka walbrzych warmia warszawa waw wegrow wielun wlocl wloclawek wodzislaw wolomin wroc wroclaw zachpomor zagan zakopane zarow zgora zgorzelec".split(" "),
lp_all_tlds.us="ak al ar as az ca co com ct dc de dni fed fl ga gu hi ia id il in is-by isa kids ks ky la land-4-sale ma md me mi mn mo ms mt nc nd ne nh nj nm nsn nv ny oh ok or pa pr ri sc sd stuff-4-sale tn tx ut va vi vt wa wi wv wy".split(" "),lp_all_tlds.fi=["aland","blogspot","iki"],lp_all_tlds.mil=["army","navy"],lp_all_tlds["do"]="art com edu gob gov mil net org sld web".split(" "),lp_all_tlds.dz="art asso com edu gov net org pol".split(" "),lp_all_tlds.co="arts com edu firm gov info int mil net nom org rec store uk web".split(" "),
lp_all_tlds.ro="arts blogspot com firm info nom nt org rec store tm www".split(" "),lp_all_tlds.ve="arts bib co com e12 edu firm gov info int mil net nom org rec store tec web".split(" "),lp_all_tlds.lv="asn com conf edu eu gov id mil net org".split(" "),lp_all_tlds.lk="assn com edu gov grp hotel int ltd net ngo org sch soc web".split(" "),lp_all_tlds.fr="aeroport assedic asso avocat avoues blogspot cci chambagri chirurgiens-dentistes com experts-comptables geometre-expert gouv greta huissier-justice medecin nom notaires pharmacien port prd presse tm veterinaire".split(" "),
lp_all_tlds.gp="asso com edu mobi net org".split(" "),lp_all_tlds.mc=["asso","tm"],lp_all_tlds.tr="!nic * av bbs bel biz com dr edu gen gov info k12 mil name net org pol tel web".split(" "),lp_all_tlds.az="biz com edu gov info int mil name net org pp pro".split(" "),lp_all_tlds.et="* biz com edu gov info name net org".split(" "),lp_all_tlds.nr="biz co com edu gov info net org".split(" "),lp_all_tlds.om="!mediaphone !nawras !nawrastelecom !omanmobile !omanpost !omantel !rakpetroleum !siemens !songfest !statecouncil * biz co com edu gov med mil museum net org pro sch".split(" "),
lp_all_tlds.pk="biz com edu fam gob gok gon gop gos gov info net org web".split(" "),lp_all_tlds.pr="ac biz com edu est gov info isla name net org pro prof".split(" "),lp_all_tlds.tt="aero biz co com coop edu gov info int jobs mobi museum name net org pro travel us".split(" "),lp_all_tlds.ua="cherkassy cherkasy chernigov chernihiv chernivtsi chernovtsy ck cn co com cr crimea cv dn dnepropetrovsk dnipropetrovsk dominic donetsk dp edu gov if in ivano-frankivsk kh kharkiv kharkov kherson khmelnitskiy khmelnytskyi kiev kirovograd km kr krym ks kv kyiv lg lt lugansk lutsk lv lviv mk mykolaiv net nikolaev od odesa odessa org pl poltava pp rivne rovno rv sb sebastopol sevastopol sm sumy te ternopil uz uzhgorod vinnica vinnytsia vn volyn yalta zaporizhzhe zaporizhzhia zhitomir zhytomyr zp zt".split(" "),
lp_all_tlds.tw="blogspot club com ebiz edu game gov gove idv mil net org xn--czrw28b xn--uc0atv xn--zf0ao64a".split(" "),lp_all_tlds.ag=["co","com","net","nom","org"],lp_all_tlds.ao="co ed gv it og pb".split(" "),lp_all_tlds.bw=["co","org"],lp_all_tlds.ck=["!www","*","co"],lp_all_tlds.ls=["co","org"],lp_all_tlds.ma="ac co gov net org press".split(" "),lp_all_tlds.af=["com","edu","gov","net","org"],lp_all_tlds.ai=["com","net","off","org"],lp_all_tlds.al="com edu gov inima mil net org soros tirana uniti upt".split(" "),
lp_all_tlds.an=["com","edu","net","org"],lp_all_tlds.ar="!congresodelalengua3 !educ !gobiernoelectronico !mecon !nacion !nic !promocion !retina !uba * com gov int mil net org".split(" "),lp_all_tlds.aw=["com"],lp_all_tlds.bb="biz com edu gov info net org store".split(" "),lp_all_tlds.bd="* com edu gov mil net org".split(" "),lp_all_tlds.bm=["com","edu","gov","net","org"],lp_all_tlds.bn=["*","com","edu","net","org"],lp_all_tlds.bo="com edu gob gov int mil net org tv".split(" "),lp_all_tlds.bs=["com",
"edu","gov","net","org"],lp_all_tlds.bt=["com","edu","gov","net","org"],lp_all_tlds.cd=["com","gov","net","org"],lp_all_tlds.ch=["blogspot","com","gov","net","org"],lp_all_tlds.cu="com edu gov inf net org".split(" "),lp_all_tlds.dm=["com","edu","gov","net","org"],lp_all_tlds.ec="com edu fin gob gov info k12 med mil net org pro".split(" "),lp_all_tlds.ee="aip com edu fie gov lib med org pri riik".split(" "),lp_all_tlds.eg="com edu eun gov mil name net org sci".split(" "),lp_all_tlds.es=["com","edu",
"gob","nom","org"],lp_all_tlds.eu=["com"],lp_all_tlds.gb=["com","net"],lp_all_tlds.ge="com edu gov mil net org pvt".split(" "),lp_all_tlds.gh=["com","edu","gov","mil","org"],lp_all_tlds.gi="com edu gov ltd mod org".split(" "),lp_all_tlds.gr="blogspot com edu gov net org".split(" "),lp_all_tlds.gu="* com edu gov mil net org".split(" "),lp_all_tlds.hk="blogspot com edu gov idv net org xn--55qx5d xn--ciqpn xn--gmq050i xn--gmqw5a xn--io0a7i xn--lcvr32d xn--mk0axi xn--mxtq1m xn--od0alg xn--od0aq3b xn--tn0ag xn--uc0atv xn--uc0ay4a xn--wcvs22d xn--zf0avx".split(" "),
lp_all_tlds.hn="com edu gob mil net org".split(" "),lp_all_tlds.hr=["com","from","iz","name"],lp_all_tlds.jm="* com edu gov net org".split(" "),lp_all_tlds.jo="com edu gov mil name net org sch".split(" "),lp_all_tlds.kh="* com edu gov mil net org per".split(" "),lp_all_tlds.kw="* com edu gov mil net org".split(" "),lp_all_tlds.ky=["com","edu","gov","net","org"],lp_all_tlds.kz="com edu gov mil net org".split(" "),lp_all_tlds.la="c com edu gov info int net org per".split(" "),lp_all_tlds.lb="com edu gov mil net org".split(" "),
lp_all_tlds.lc="co com edu gov net org".split(" "),lp_all_tlds.li=["com","gov","net","org"],lp_all_tlds.lr=["com","edu","gov","net","org"],lp_all_tlds.ly="com edu gov id med net org plc sch".split(" "),lp_all_tlds.mg="com edu gov mil nom org prd tm".split(" "),lp_all_tlds.mk="com edu gov inf name net org".split(" "),lp_all_tlds.mm="* com edu gov net org".split(" "),lp_all_tlds.mo=["com","edu","gov","net","org"],lp_all_tlds.mt="* com edu gov net org".split(" "),lp_all_tlds.mu="ac co com gov net or org".split(" "),
lp_all_tlds.mx="blogspot com edu gob gov net org".split(" "),lp_all_tlds.my="com edu gov mil name net org".split(" "),lp_all_tlds.na="ca cc co com dr in info mobi mx name net or org pro school tv us ws".split(" "),lp_all_tlds.nc=["asso","com","net","org"],lp_all_tlds.ng="ac com edu gov net org".split(" "),lp_all_tlds.ni="* com edu gob net nom org".split(" "),lp_all_tlds.no="aa aarborte aejrie afjord agdenes ah aknoluokta akrehamn al alaheadju alesund algard alstahaug alta alvdal amli amot andasuolo andebu andoy ardal aremark arendal arna aseral asker askim askoy askvoll asnes audnedaln aukra aure aurland aurskog-holand austevoll austrheim averoy badaddja bahcavuotna bahccavuotna baidar bajddar balat balestrand ballangen balsfjord bamble bardu barum batsfjord bearalvahki beardu beiarn berg bergen berlevag bievat bindal birkenes bjarkoy bjerkreim bjugn blogspot bodo bokn bomlo bremanger bronnoy bronnoysund brumunddal bryne bu budejju bygland bykle cahcesuolo co com davvenjarga davvesiida deatnu dep dielddanuorri divtasvuodna divttasvuotna donna dovre drammen drangedal drobak dyroy egersund eid eidfjord eidsberg eidskog eidsvoll eigersund elverum enebakk engerdal etne etnedal evenassi evenes evje-og-hornnes farsund fauske fedje fet fetsund fhs finnoy fitjar fjaler fjell fla flakstad flatanger flekkefjord flesberg flora floro fm folkebibl folldal forde forsand fosnes frana fredrikstad frei frogn froland frosta froya fuoisku fuossko fusa fylkesbibl fyresdal gaivuotna galsa gamvik gangaviika gaular gausdal giehtavuoatna gildeskal giske gjemnes gjerdrum gjerstad gjesdal gjovik gloppen gol gran grane granvin gratangen grimstad grong grue gulen guovdageaidnu ha habmer hadsel hagebostad halden halsa hamar hamaroy hammarfeasta hammerfest hapmir haram hareid harstad hasvik hattfjelldal haugesund hemne hemnes hemsedal herad hitra hjartdal hjelmeland hl hm hobol hof hokksund hol hole holmestrand holtalen honefoss hornindal horten hoyanger hoylandet hurdal hurum hvaler hyllestad ibestad idrett inderoy iveland ivgu jan-mayen jessheim jevnaker jolster jondal jorpeland kafjord karasjohka karasjok karlsoy karmoy kautokeino kirkenes klabu klepp kommune kongsberg kongsvinger kopervik kraanghke kragero kristiansand kristiansund krodsherad krokstadelva kvafjord kvalsund kvam kvanangen kvinesdal kvinnherad kviteseid kvitsoy laakesvuemie lahppi langevag lardal larvik lavagis lavangen leangaviika lebesby leikanger leirfjord leirvik leka leksvik lenvik lerdal lesja levanger lier lierne lillehammer lillesand lindas lindesnes loabat lodingen lom loppa lorenskog loten lund lunner luroy luster lyngdal lyngen malatvuopmi malselv malvik mandal marker marnardal masfjorden masoy matta-varjjat meland meldal melhus meloy meraker midsund midtre-gauldal mil mjondalen mo-i-rana moareke modalen modum molde mosjoen moskenes moss mosvik mr muosat museum naamesjevuemie namdalseid namsos namsskogan nannestad naroy narviika narvik naustdal navuotna nedre-eiker nesna nesodden nesoddtangen nesseby nesset nissedal nittedal nl nord-aurdal nord-fron nord-odal norddal nordkapp nordre-land nordreisa nore-og-uvdal notodden notteroy nt odda of oksnes ol omasvuotna oppdal oppegard orkanger orkdal orland orskog orsta osen oslo osoyro osteroy ostre-toten overhalla ovre-eiker oyer oygarden oystre-slidre porsanger porsangu porsgrunn priv rade radoy rahkkeravju raholt raisa rakkestad ralingen rana randaberg rauma rendalen rennebu rennesoy rindal ringebu ringerike ringsaker risor rissa rl roan rodoy rollag romsa romskog roros rost royken royrvik ruovat rygge salangen salat saltdal samnanger sandefjord sandnes sandnessjoen sandoy sarpsborg sauda sauherad sel selbu selje seljord sf siellak sigdal siljan sirdal skanit skanland skaun skedsmo skedsmokorset ski skien skierva skiptvet skjak skjervoy skodje slattum smola snaase snasa snillfjord snoasa sogndal sogne sokndal sola solund somna sondre-land songdalen sor-aurdal sor-fron sor-odal sor-varanger sorfold sorreisa sortland sorum spjelkavik spydeberg st stange stat stathelle stavanger stavern steigen steinkjer stjordal stjordalshalsen stokke stor-elvdal stord stordal storfjord strand stranda stryn sula suldal sund sunndal surnadal svalbard sveio svelvik sykkylven tana tananger time tingvoll tinn tjeldsund tjome tm tokke tolga tonsberg torsken tr trana tranby tranoy troandin trogstad tromsa tromso trondheim trysil tvedestrand tydal tynset tysfjord tysnes tysvar ullensaker ullensvang ulvik unjarga utsira va vaapste vadso vaga vagan vagsoy vaksdal valle vang vanylven vardo varggat varoy vefsn vega vegarshei vennesla verdal verran vestby vestnes vestre-slidre vestre-toten vestvagoy vevelstad vf vgs vik vikna vindafjord voagat volda voss vossevangen xn--andy-ira xn--asky-ira xn--aurskog-hland-jnb xn--avery-yua xn--bdddj-mrabd xn--bearalvhki-y4a xn--berlevg-jxa xn--bhcavuotna-s4a xn--bhccavuotna-k7a xn--bidr-5nac xn--bievt-0qa xn--bjarky-fya xn--bjddar-pta xn--blt-elab xn--bmlo-gra xn--bod-2na xn--brnny-wuac xn--brnnysund-m8ac xn--brum-voa xn--btsfjord-9za xn--davvenjrga-y4a xn--dnna-gra xn--drbak-wua xn--dyry-ira xn--eveni-0qa01ga xn--finny-yua xn--fjord-lra xn--fl-zia xn--flor-jra xn--frde-gra xn--frna-woa xn--frya-hra xn--ggaviika-8ya47h xn--gildeskl-g0a xn--givuotna-8ya xn--gjvik-wua xn--gls-elac xn--h-2fa xn--hbmer-xqa xn--hcesuolo-7ya35b xn--hgebostad-g3a xn--hmmrfeasta-s4ac xn--hnefoss-q1a xn--hobl-ira xn--holtlen-hxa xn--hpmir-xqa xn--hyanger-q1a xn--hylandet-54a xn--indery-fya xn--jlster-bya xn--jrpeland-54a xn--karmy-yua xn--kfjord-iua xn--klbu-woa xn--koluokta-7ya57h xn--krager-gya xn--kranghke-b0a xn--krdsherad-m8a xn--krehamn-dxa xn--krjohka-hwab49j xn--ksnes-uua xn--kvfjord-nxa xn--kvitsy-fya xn--kvnangen-k0a xn--l-1fa xn--laheadju-7ya xn--langevg-jxa xn--ldingen-q1a xn--leagaviika-52b xn--lesund-hua xn--lgrd-poac xn--lhppi-xqa xn--linds-pra xn--loabt-0qa xn--lrdal-sra xn--lrenskog-54a xn--lt-liac xn--lten-gra xn--lury-ira xn--mely-ira xn--merker-kua xn--mjndalen-64a xn--mlatvuopmi-s4a xn--mli-tla xn--mlselv-iua xn--moreke-jua xn--mosjen-eya xn--mot-tla xn--msy-ula0h xn--mtta-vrjjat-k7af xn--muost-0qa xn--nmesjevuemie-tcba xn--nry-yla5g xn--nttery-byae xn--nvuotna-hwa xn--oppegrd-ixa xn--ostery-fya xn--osyro-wua xn--porsgu-sta26f xn--rady-ira xn--rdal-poa xn--rde-ula xn--rdy-0nab xn--rennesy-v1a xn--rhkkervju-01af xn--rholt-mra xn--risa-5na xn--risr-ira xn--rland-uua xn--rlingen-mxa xn--rmskog-bya xn--rros-gra xn--rskog-uua xn--rst-0na xn--rsta-fra xn--ryken-vua xn--ryrvik-bya xn--s-1fa xn--sandnessjen-ogb xn--sandy-yua xn--seral-lra xn--sgne-gra xn--skierv-uta xn--skjervy-v1a xn--skjk-soa xn--sknit-yqa xn--sknland-fxa xn--slat-5na xn--slt-elab xn--smla-hra xn--smna-gra xn--snase-nra xn--sndre-land-0cb xn--snes-poa xn--snsa-roa xn--sr-aurdal-l8a xn--sr-fron-q1a xn--sr-odal-q1a xn--sr-varanger-ggb xn--srfold-bya xn--srreisa-q1a xn--srum-gra xn--stjrdal-s1a xn--stjrdalshalsen-sqb xn--stre-toten-zcb xn--tjme-hra xn--tnsberg-q1a xn--trany-yua xn--trgstad-r1a xn--trna-woa xn--troms-zua xn--tysvr-vra xn--unjrga-rta xn--vads-jra xn--vard-jra xn--vegrshei-c0a xn--vestvgy-ixa6o xn--vg-yiab xn--vgan-qoa xn--vgsy-qoa0j xn--vre-eiker-k8a xn--vrggt-xqad xn--vry-yla5g xn--yer-zna xn--ygarden-p1a xn--ystre-slidre-ujb".split(" "),
lp_all_tlds.np="* com edu gov mil net org ort".split(" "),lp_all_tlds.pe="com edu gob mil net nom org".split(" "),lp_all_tlds.pf=["com","edu","org"],lp_all_tlds.pg=["*","com","net"],lp_all_tlds.ph="com edu gov i mil net ngo org".split(" "),lp_all_tlds.ps="com edu gov net org plo sec".split(" "),lp_all_tlds.pt="blogspot com edu gov int net nome org publ".split(" "),lp_all_tlds.py="com coop edu gov mil net org".split(" "),lp_all_tlds.qc=["com"],lp_all_tlds.sa="com edu gov med net org pub sch".split(" "),
lp_all_tlds.sb=["com","edu","gov","net","org"],lp_all_tlds.sc=["com","edu","gov","net","org"],lp_all_tlds.sd="com edu gov info med net org tv".split(" "),lp_all_tlds.sg="blogspot com edu gov idn net org per".split(" "),lp_all_tlds.sh="com edu gov mil net org".split(" "),lp_all_tlds.sv="* co com edu gob org red".split(" "),lp_all_tlds.sy="com edu gov mil net org".split(" "),lp_all_tlds.tn="agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism turen".split(" "),
lp_all_tlds.uy="com edu gub mil net org".split(" "),lp_all_tlds.vi="co com edu gov k12 net org".split(" "),lp_all_tlds.ye=["*","com","net"],lp_all_tlds.pro="aca bar cpa eng jur law med".split(" "),lp_all_tlds.arpa="e164 in-addr ip6 iris uri urn".split(" "),lp_all_tlds["int"]=["eu"],lp_all_tlds.bf=["gov"],lp_all_tlds.by=["com","gov","mil","of"],lp_all_tlds.cx=["ath","gov"],lp_all_tlds.ie=["blogspot","gov"],lp_all_tlds.it="ag agrigento al alessandria alto-adige altoadige an ancona andria-barletta-trani andria-trani-barletta andriabarlettatrani andriatranibarletta ao aosta aoste ap aq aquila ar arezzo ascoli-piceno ascolipiceno asti at av avellino ba balsan bari barletta-trani-andria barlettatraniandria belluno benevento bergamo bg bi biella bl blogspot bn bo bologna bolzano bozen br brescia brindisi bs bt bz ca cagliari caltanissetta campidano-medio campidanomedio campobasso carbonia-iglesias carboniaiglesias carrara-massa carraramassa caserta catania catanzaro cb ce cesena-forli cesenaforli ch chieti ci cl cn co como cosenza cr cremona crotone cs ct cuneo cz dell-ogliastra dellogliastra edu en enna fc fe fermo ferrara fg fi firenze florence fm foggia forli-cesena forlicesena fr frosinone ge genoa genova go gorizia gov gr grosseto iglesias-carbonia iglesiascarbonia im imperia is isernia kr la-spezia laquila laspezia latina lc le lecce lecco li livorno lo lodi lt lu lucca macerata mantova massa-carrara massacarrara matera mb mc me medio-campidano mediocampidano messina mi milan milano mn mo modena monza monza-brianza monza-e-della-brianza monzabrianza monzaebrianza monzaedellabrianza ms mt na naples napoli no novara nu nuoro og ogliastra olbia-tempio olbiatempio or oristano ot pa padova padua palermo parma pavia pc pd pe perugia pesaro-urbino pesarourbino pescara pg pi piacenza pisa pistoia pn po pordenone potenza pr prato pt pu pv pz ra ragusa ravenna rc re reggio-calabria reggio-emilia reggiocalabria reggioemilia rg ri rieti rimini rm rn ro roma rome rovigo sa salerno sassari savona si siena siracusa so sondrio sp sr ss suedtirol sv ta taranto te tempio-olbia tempioolbia teramo terni tn to torino tp tr trani-andria-barletta trani-barletta-andria traniandriabarletta tranibarlettaandria trapani trentino trento treviso trieste ts turin tv ud udine urbino-pesaro urbinopesaro va varese vb vc ve venezia venice verbania vercelli verona vi vibo-valentia vibovalentia vicenza viterbo vr vs vt vv".split(" "),
lp_all_tlds.lt=["gov","mil"],lp_all_tlds.lu=["gov","mil","net","org"],lp_all_tlds.to="com edu gov mil net org".split(" "),lp_all_tlds.tp=["gov"],lp_all_tlds.tv=["better-than","dyndns","gov","on-the-web","worse-than"],lp_all_tlds.mobi=["music","weather"],lp_all_tlds.mh=["net"],lp_all_tlds.ad=["nom"],lp_all_tlds.sr=["rs"],lp_all_tlds.va=["vatican"],lp_all_tlds.aero="accident-investigation accident-prevention aerobatic aeroclub aerodrome agents air-surveillance air-traffic-control aircraft airline airport airtraffic ambulance amusement association author ballooning broker caa cargo catering certification championship charter civilaviation club conference consultant consulting control council crew design dgca educator emergency engine engineer entertainment equipment exchange express federation flight freight fuel gliding government groundhandling group hanggliding homebuilt insurance journal journalist leasing logistics magazine maintenance marketplace media microlight modelling navigation parachuting paragliding passenger-association pilot press production recreation repbody res research rotorcraft safety scientist services show skydiving software student taxi trader trading trainer union workinggroup works".split(" "),
lp_all_tlds.as=["gov"],lp_all_tlds.ba="co com edu gov mil net org rs unbi unsa".split(" "),lp_all_tlds.bg="0123456789abcdefghijklmnopqrstuvwxyz".split(""),lp_all_tlds.bh=["com","edu","gov","net","org"],lp_all_tlds.bi=["co","com","edu","or","org"],lp_all_tlds.bj=["asso","barreau","blogspot","gouv"],lp_all_tlds.bz=["com","edu","gov","net","org"],lp_all_tlds.ci="ac asso co com ed edu go gouv int md net or org presse xn--aroport-bya".split(" "),lp_all_tlds.cl=["co","gob","gov","mil"],lp_all_tlds.cm=["gov"],
lp_all_tlds.cw=["com","edu","net","org"],lp_all_tlds.er=["*"],lp_all_tlds.gy=["co","com","net"],lp_all_tlds.io=["com","github"],lp_all_tlds.iq="com edu gov mil net org".split(" "),lp_all_tlds.ke=["*"],lp_all_tlds.kg="com edu gov mil net org".split(" "),lp_all_tlds.ki="biz com edu gov info net org".split(" "),lp_all_tlds.km="ass asso com coop edu gouv gov medecin mil nom notaires org pharmaciens prd presse tm veterinaire".split(" "),lp_all_tlds.kn=["edu","gov","net","org"],lp_all_tlds.kp="com edu gov org rep tra".split(" "),
lp_all_tlds.me="ac co edu gov its net org priv".split(" "),lp_all_tlds.ml="com edu gouv gov net org presse".split(" "),lp_all_tlds.mn=["edu","gov","nyc","org"],lp_all_tlds.mr=["blogspot","gov"],lp_all_tlds.museum="academy agriculture air airguard alabama alaska amber ambulance american americana americanantiques americanart amsterdam and annefrank anthro anthropology antiques aquarium arboretum archaeological archaeology architecture art artanddesign artcenter artdeco arteducation artgallery arts artsandcrafts asmatart assassination assisi association astronomy atlanta austin australia automotive aviation axis badajoz baghdad bahn bale baltimore barcelona baseball basel baths bauern beauxarts beeldengeluid bellevue bergbau berkeley berlin bern bible bilbao bill birdart birthplace bonn boston botanical botanicalgarden botanicgarden botany brandywinevalley brasil bristol british britishcolumbia broadcast brunel brussel brussels bruxelles building burghof bus bushey cadaques california cambridge can canada capebreton carrier cartoonart casadelamoneda castle castres celtic center chattanooga cheltenham chesapeakebay chicago children childrens childrensgarden chiropractic chocolate christiansburg cincinnati cinema circus civilisation civilization civilwar clinton clock coal coastaldefence cody coldwar collection colonialwilliamsburg coloradoplateau columbia columbus communication communications community computer computerhistory contemporary contemporaryart convent copenhagen corporation corvette costume countryestate county crafts cranbrook creation cultural culturalcenter culture cyber cymru dali dallas database ddr decorativearts delaware delmenhorst denmark depot design detroit dinosaur discovery dolls donostia durham eastafrica eastcoast education educational egyptian eisenbahn elburg elvendrell embroidery encyclopedic england entomology environment environmentalconservation epilepsy essex estate ethnology exeter exhibition family farm farmequipment farmers farmstead field figueres filatelia film fineart finearts finland flanders florida force fortmissoula fortworth foundation francaise frankfurt franziskaner freemasonry freiburg fribourg frog fundacio furniture gallery garden gateway geelvinck gemological geology georgia giessen glas glass gorge grandrapids graz guernsey halloffame hamburg handson harvestcelebration hawaii health heimatunduhren hellas helsinki hembygdsforbund heritage histoire historical historicalsociety historichouses historisch historisches history historyofscience horology house humanities illustration imageandsound indian indiana indianapolis indianmarket intelligence interactive iraq iron isleofman jamison jefferson jerusalem jewelry jewish jewishart jfk journalism judaica judygarland juedisches juif karate karikatur kids koebenhavn koeln kunst kunstsammlung kunstunddesign labor labour lajolla lancashire landes lans larsson lewismiller lincoln linz living livinghistory localhistory london losangeles louvre loyalist lucerne luxembourg luzern mad madrid mallorca manchester mansion mansions manx marburg maritime maritimo maryland marylhurst media medical medizinhistorisches meeres memorial mesaverde michigan midatlantic military mill miners mining minnesota missile missoula modern moma money monmouth monticello montreal moscow motorcycle muenchen muenster mulhouse muncie museet museumcenter museumvereniging music national nationalfirearms nationalheritage nativeamerican naturalhistory naturalhistorymuseum naturalsciences nature naturhistorisches natuurwetenschappen naumburg naval nebraska neues newhampshire newjersey newmexico newport newspaper newyork niepce norfolk north nrw nuernberg nuremberg nyc nyny oceanographic oceanographique omaha online ontario openair oregon oregontrail otago oxford pacific paderborn palace paleo palmsprings panama paris pasadena pharmacy philadelphia philadelphiaarea philately phoenix photography pilots pittsburgh planetarium plantation plants plaza portal portland portlligat posts-and-telecommunications preservation presidio press project public pubol quebec railroad railway research resistance riodejaneiro rochester rockart roma russia saintlouis salem salvadordali salzburg sandiego sanfrancisco santabarbara santacruz santafe saskatchewan satx savannahga schlesisches schoenbrunn schokoladen school schweiz science science-fiction scienceandhistory scienceandindustry sciencecenter sciencecenters sciencehistory sciences sciencesnaturelles scotland seaport settlement settlers shell sherbrooke sibenik silk ski skole society sologne soundandvision southcarolina southwest space spy square stadt stalbans starnberg state stateofdelaware station steam steiermark stjohn stockholm stpetersburg stuttgart suisse surgeonshall surrey svizzera sweden sydney tank tcm technology telekommunikation television texas textile theater time timekeeping topology torino touch town transport tree trolley trust trustee uhren ulm undersea university usa usantiques usarts uscountryestate usculture usdecorativearts usgarden ushistory ushuaia uslivinghistory utah uvic valley vantaa versailles viking village virginia virtual virtuel vlaanderen volkenkunde wales wallonie war washingtondc watch-and-clock watchandclock western westfalen whaling wildlife williamsburg windmill workshop xn--9dbhblg6di xn--comunicaes-v6a2o xn--correios-e-telecomunicaes-ghc29a xn--h1aegh xn--lns-qla york yorkshire yosemite youth zoological zoology".split(" "),
lp_all_tlds.mz=["!teledata","*"],lp_all_tlds.nf="arts com firm info net other per rec store web".split(" "),lp_all_tlds.pn=["co","edu","gov","net","org"],lp_all_tlds.pw="belau co ed go ne or".split(" "),lp_all_tlds.qa="com edu gov mil name net org sch".split(" "),lp_all_tlds.re=["asso","blogspot","com","nom"],lp_all_tlds.rs="ac co edu gov in org".split(" "),lp_all_tlds.sl=["com","edu","gov","net","org"],lp_all_tlds.sn="art com edu gouv org perso univ".split(" "),lp_all_tlds.so=["com","net","org"],
lp_all_tlds.st="co com consulado edu embaixada gov mil net org principe saotome store".split(" "),lp_all_tlds.sx=["gov"],lp_all_tlds.sz=["ac","co","org"],lp_all_tlds.tl=["gov"],lp_all_tlds.tm="co com edu gov mil net nom org".split(" "),lp_all_tlds.uz=["co","com","net","org"],lp_all_tlds.vc="com edu gov mil net org".split(" "),lp_all_tlds.ws="com dyndns edu gov mypets net org".split(" "),lp_all_tlds.net="at-band-camp blogdns broke-it buyshouses cloudfront dnsalias dnsdojo does-it dontexist dynalias dynathome endofinternet from-az from-co from-la from-ny gb gets-it ham-radio-op homeftp homeip homelinux homeunix hu in-the-band is-a-chef is-a-geek isa-geek jp kicks-ass office-on-the podzone scrapper-site se selfip sells-it servebbs serveftp thruhere uk webhop za".split(" "),
lp_all_tlds.com="appspot ar betainabox blogdns blogspot br cechire cloudcontrolapp cloudcontrolled cn codespot de dnsalias dnsdojo doesntexist dontexist doomdns dreamhosters dyn-o-saur dynalias dyndns-at-home dyndns-at-work dyndns-blog dyndns-free dyndns-home dyndns-ip dyndns-mail dyndns-office dyndns-pics dyndns-remote dyndns-server dyndns-web dyndns-wiki dyndns-work elasticbeanstalk est-a-la-maison est-a-la-masion est-le-patron est-mon-blogueur eu from-ak from-al from-ar from-ca from-ct from-dc from-de from-fl from-ga from-hi from-ia from-id from-il from-in from-ks from-ky from-ma from-md from-mi from-mn from-mo from-ms from-mt from-nc from-nd from-ne from-nh from-nj from-nm from-nv from-oh from-ok from-or from-pa from-pr from-ri from-sc from-sd from-tn from-tx from-ut from-va from-vt from-wa from-wi from-wv from-wy gb getmyip googleapis googlecode gotdns gr herokuapp herokussl hobby-site homelinux homeunix hu iamallama is-a-anarchist is-a-blogger is-a-bookkeeper is-a-bulls-fan is-a-caterer is-a-chef is-a-conservative is-a-cpa is-a-cubicle-slave is-a-democrat is-a-designer is-a-doctor is-a-financialadvisor is-a-geek is-a-green is-a-guru is-a-hard-worker is-a-hunter is-a-landscaper is-a-lawyer is-a-liberal is-a-libertarian is-a-llama is-a-musician is-a-nascarfan is-a-nurse is-a-painter is-a-personaltrainer is-a-photographer is-a-player is-a-republican is-a-rockstar is-a-socialist is-a-student is-a-teacher is-a-techie is-a-therapist is-an-accountant is-an-actor is-an-actress is-an-anarchist is-an-artist is-an-engineer is-an-entertainer is-certified is-gone is-into-anime is-into-cars is-into-cartoons is-into-games is-leet is-not-certified is-slick is-uberleet is-with-theband isa-geek isa-hockeynut issmarterthanyou jpn kr likes-pie likescandy neat-url no operaunite qc rhcloud ro ru sa saves-the-whales se selfip sells-for-less sells-for-u servebbs simple-url space-to-rent teaches-yoga uk us uy writesthisblog za".split(" "),
lp_all_tlds.org="ae blogdns blogsite boldlygoingnowhere dnsalias dnsdojo doesntexist dontexist doomdns dvrdns dynalias dyndns endofinternet endoftheinternet from-me game-host gotdns hobby-site homedns homeftp homelinux homeunix is-a-bruinsfan is-a-candidate is-a-celticsfan is-a-chef is-a-geek is-a-knight is-a-linux-user is-a-patsfan is-a-soxfan is-found is-lost is-saved is-very-bad is-very-evil is-very-good is-very-nice is-very-sweet isa-geek kicks-ass misconfused podzone readmyblog selfip sellsyourhome servebbs serveftp servegame stuff-4-sale us webhop za".split(" "),
lp_all_tlds.de="blogspot com fuettertdasnetz isteingeek istmein lebtimnetz leitungsen traeumtgerade".split(" "),lp_all_tlds.biz="dyndns for-better for-more for-some for-the selfip webhop".split(" "),lp_all_tlds.info="barrel-of-knowledge barrell-of-knowledge dyndns for-our groks-the groks-this here-for-more knowsitall selfip webhop".split(" "),lp_all_tlds.cc=["ftpaccess","game-server","myphotos","scrapping"],lp_all_tlds.nu=["merseine","mine","shacknet"],lp_all_tlds.cf=["blogspot"],lp_all_tlds.cv=["blogspot"],
lp_all_tlds.cz=["blogspot"],lp_all_tlds.dk=["blogspot"],lp_all_tlds.sk=["blogspot"],lp_all_tlds.td=["blogspot"]}
function checkurlrules(a,b,c,d,f,e,g){if(0==b.length)return b;for(var h=[],j=[],k=0;k<a.length;k++)"undefined"==typeof a[k].tld&&(a[k].tld=lp_gettld_url(a[k].url),a[k].parts=lpParseUri(a[k].url),a[k].path="string"==typeof a[k].parts.path?a[k].parts.path:""),c==a[k].tld&&(""!=a[k].path&&0!=d.indexOf(a[k].path)?j[j.length]=a[k]:f==a[k].parts.host||1==a[k].exacthost&&-1!=f.indexOf("."+a[k].parts.host)||0==a[k].exacthost?h[h.length]=a[k]:j[j.length]=a[k]);if(0==h.length&&0==j.length)return b;if(0<h.length){a=
b;for(k=0;k<h.length;k++)c=applyurlrule(b,h[k],d,f,g),c.length<a.length&&(a=c);return a}for(k=0;k<j.length;k++)removeurlrule(b,j[k],e,f,g);return b}
function applyurlrule(a,b,c,d,f){var e=b.path;if(""!=e&&0!=c.indexOf(e))return a;for(var g=e.split("/").length,h=[],j=!1,k=0;k<a.length;k++){var p=a[k],l=p.pathlevelmatch,r=p.servermatch,n=p.portmatch;if("undefined"==typeof l){l=c.split("/");p=lpParseUri(p.url);p.path="undefined"!=typeof p.path?p.path:"";r=p.path.split("/");for(n=0;n<l.length&&n<r.length&&r[n]==l[n];n++);l=n;r=d==p.host;n=f==get_port(p)}if(!(""!=e&&l<g)&&(j=j||1==b.exacthost||1==b.exactport?!0:!1,(r||0==b.exacthost)&&(n||0==b.exactport)))j=
!0,h[h.length]=a[k]}return!j?a:h}function removeurlrule(a,b,c){for(var d=b.path,f=0;f<a.length;f++){var e="undefined"!=typeof a[f].id?a[f].id:a[f].aid;if("undefined"!=typeof c[e]&&(e=lpParseUri(c[e].url),e.path="undefined"!=typeof e.path?e.path:"",!(""!=d&&0!=e.path.indexOf(d))&&("0"==b.exacthost||b.parts.host==e.host)&&("0"==b.exactport||get_port(urlrules[f].parts)==get_port(e))))a.splice(f,1),f-=1}}function lpsubstring(a,b,c){var d="",f=c-b;for(c=0;c<f;++c)d+=a[c+b];return d}
function lpcreaterandomhexstring(a){for(var b="",c=0;c<a;c++)var d=get_random(0,15),b=b+"0123456789ABCDEF".substring(d,d+1);return b}
function reencryptShareeAutoPushes(a,b,c){var d=["name","group","username","password","extra"],f={},e=!0;for(m in d){var g=d[m];if(null!=b[g]){f[g]=lpdec(b[g],a);if(""!=b[g]&&(null==f[g]||""==f[g])){lpReportError("lprsa_acceptshareeautopushes : failing id="+b.id+" because we failed to decrypt : "+g+"="+b[g]);e=!1;break}var h=lpenc(f[g]);if(""!=f[g]&&(null==h||""==h)){lpReportError("lprsa_acceptshareeautopushes : failing aid="+c+" id="+b.id+" because we failed to reencrypt : "+g);e=!1;break}f[g]=h}}if(!e)return null;
for(var j in b.fields)if(d=b.fields[j],"email"==d.type||"tel"==d.type||"text"==d.type||"password"==d.type||"textarea"==d.type||"hidden"==d.type){g=d.value;d=lpdec(g,a);if(""!=g&&(null==d||""==d)){lpReportError("lprsa_acceptshareeautopushes : failing aid="+c+" id="+b.id+" because we failed to decrypt field"+j+"="+g);e=!1;break}g=lpenc(d);if(""!=d&&(null==g||""==g)){lpReportError("lprsa_acceptshareeautopushes : failing aid="+c+" id="+b.id+" because we failed to reencrypt field"+j+"="+d);e=!1;break}b.fields[j].value=
g}if(!e)return null;for(j in b.otherfields)if(d=b.otherfields[j],"email"==d.type||"tel"==d.type||"text"==d.type||"password"==d.type||"textarea"==d.type||"hidden"==d.type){g=d.value;d=lpdec(g,a);if(""!=g&&(null==d||""==d)){lpReportError("lprsa_acceptshareeautopushes : failing aid="+c+" id="+b.id+" because we failed to decrypt otherfield"+j+"="+g);e=!1;break}g=lpenc(d);if(""!=d&&(null==g||""==g)){lpReportError("lprsa_acceptshareeautopushes : failing aid="+c+" id="+b.id+" because we failed to reencrypt otherfield"+
j+"="+d);e=!1;break}b.otherfields[j].value=g}if(!e)return null;a={};for(i in b)if("fields"==i)for(j in a.numf=b.fields.length,b.fields)a["f"+j+"urid"]=b.fields[j].urid,a["f"+j+"name"]=b.fields[j].name,a["f"+j+"value"]=b.fields[j].value,a["f"+j+"type"]=b.fields[j].type;else if("otherfields"==i)for(j in a.numof=b.otherfields.length,b.otherfields)a["of"+j+"urid"]=b.otherfields[j].urid,a["of"+j+"name"]=b.otherfields[j].name,a["of"+j+"value"]=b.otherfields[j].value,a["of"+j+"type"]=b.otherfields[j].type,
a["of"+j+"formname"]=b.otherfields[j].formname;else"sharekeyhexenc"!=i&&null!=b[i]&&(a[i]="undefined"!=typeof f[i]?f[i]:b[i]);return a}
function createShareeAutoPushesResponse(a,b,c){a=a.responseXML.documentElement;var d=a.getElementsByTagName("sharerpublickeys"),f=a.getElementsByTagName("shareepublickeys"),e=a.getElementsByTagName("encfields"),g=a.getElementsByTagName("encofields");if(0>=d.length&&0>=f.length)return!1;a=b.aid;var h=b.postdata;b="undefined"==typeof b.newvalues?[]:b.newvalues;if("undefined"==typeof c||null==c)return lpReportError("SHARE : createShareeAutoPushesResponse failed for aid="+a,null),!1;for(var j={},k=e[0].getElementsByTagName("encfield"),
h=h+("&numencf="+LP.en(k.length)),e=0;e<k.length;++e){var p=k[e].getAttribute("afid"),l=k[e].getAttribute("value");j[p]=l}k={};g=g[0].getElementsByTagName("encofield");h+="&numencof="+LP.en(g.length);for(e=0;e<g.length;++e)p=g[e].getAttribute("afid"),l=g[e].getAttribute("value"),k[p]=l;h+="&numvalueenc="+LP.en(b.length);for(n=0;n<b.length;++n)e=lpenc(b[n]),h+="&valueenc"+n+"="+LP.en(e);if(0<f.length){g=f[0].getElementsByTagName("sharee");h+="&numsharees="+LP.en(g.length);for(e=0;e<g.length;++e){var r=
g[e].getAttribute("uid"),n=g[e].getAttribute("key"),l=lpcreaterandomhexstring(64),f=lp_hex2bin(l),l=lprsa_encryptdata(n,l);if(!1==l)return lpReportError("SHARE : lprsa_encryptdata failed for shareeuid="+r+" using shareepublickeyhex="+n,null),!1;var h=h+("&sharee"+e+"uid="+LP.en(r)),h=h+("&sharee"+e+"sharekeyhexenc="+LP.en(l)),l={name:c.name,grouping:c.group,username:"undefined"!=typeof g_sites?lpmdec(c.username,!0):lpdec(c.username),password:"undefined"!=typeof g_sites?lpmdec(c.password,!0):lpdec(c.password),
extra:"undefined"!=typeof g_sites?lpmdec(c.extra,!0):lpdec(c.extra)},s;for(s in l){var q=lpenc(l[s],f);if(""!=l[s]&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting aid="+a+" for shareeuid="+r,null),!1;h+="&sharee"+e+s+"="+LP.en(q)}var n=0;for(p in j){l=lpdec(j[p]);q=lpenc(l,f);if(""!=l&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting field afid="+p+" aid="+a+" for shareeuid="+r,null),!1;h+="&sharee"+e+"fafid"+n+"="+LP.en(p);h+="&sharee"+e+"fvalue"+n+"="+LP.en(q);
++n}n=0;for(p in k){l=lpdec(k[p]);q=lpenc(l,f);if(""!=l&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting otherfield afid="+p+" aid="+a+" for shareeuid="+r,null),!1;h+="&sharee"+e+"ofafid"+n+"="+LP.en(p);h+="&sharee"+e+"ofvalue"+n+"="+LP.en(q);++n}for(n=0;n<b.length;++n){l=b[n];q=lpenc(l,f);if(""!=l&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting newvalues k="+n+" aid="+a+" for shareeuid="+r,null),!1;h+="&sharee"+e+"valueenc"+n+"="+LP.en(q)}}}if(0<d.length){d=
d[0].getElementsByTagName("sharer");h+="&numsharers="+LP.en(d.length);for(e=0;e<d.length;++e){g=d[e].getAttribute("uid");r=d[e].getAttribute("key");l=lpcreaterandomhexstring(64);f=lp_hex2bin(l);l=lprsa_encryptdata(r,l);if(!1==l)return lpReportError("SHARE : lprsa_encryptdata failed for shareruid="+g+" using sharerpublickeyhex="+r,null),!1;h+="&sharer"+e+"uid="+LP.en(g);h+="&sharer"+e+"sharekeyhexenc="+LP.en(l);l={name:c.name,grouping:c.group,username:"undefined"!=typeof g_sites?lpmdec(c.username,
!0):lpdec(c.username),password:"undefined"!=typeof g_sites?lpmdec(c.password,!0):lpdec(c.password),extra:"undefined"!=typeof g_sites?lpmdec(c.extra,!0):lpdec(c.extra)};for(s in l){q=lpenc(l[s],f);if(""!=l[s]&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting aid="+a+" for shareruid="+g,null),!1;h+="&sharer"+e+s+"="+LP.en(q)}n=0;for(p in j){l=lpdec(j[p]);q=lpenc(l,f);if(""!=l&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting field afid="+p+" aid="+a+" for shareruid="+
g,null),!1;h+="&sharer"+e+"fafid"+n+"="+LP.en(p);h+="&sharer"+e+"fvalue"+n+"="+LP.en(q);++n}n=0;for(p in k){l=lpdec(k[p]);q=lpenc(l,f);if(""!=l&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting otherfield afid="+p+" aid="+a+" for shareruid="+g,null),!1;h+="&sharer"+e+"ofafid"+n+"="+LP.en(p);h+="&sharer"+e+"ofvalue"+n+"="+LP.en(q);++n}for(n=0;n<b.length;++n){l=b[n];q=lpenc(l,f);if(""!=l&&(null==q||""==q))return lpReportError("SHARE : error AES encrypting newvalues k="+n+" aid="+
a+" for shareruid="+g,null),!1;h+="&sharer"+e+"valueenc"+n+"="+LP.en(q)}}}return h}
function parseAutoPushMobile(a,b){for(var c=0;null!=a&&c<a.length;c++){var d=new lpshareeautopushinfo;d.fields=[];d.otherfields=[];var f=!0,e="id aid sharekeyhexenc name group username password extra url rurl fav never_autofill pwprotect basic_auth autologin last_touch last_modified urid last_pw_change numf numof favico nexturid method is_http manual".split(" "),g;for(g in e)if("undefined"!=typeof a[c][e[g]])d[e[g]]=a[c][e[g]];else if("id"==e[g]||"aid"==e[g]||"sharekeyhexenc"==e[g]){lpReportError("SHARE: shareeautopushes : error missing required arg="+
e[g],null);f=!1;break}else d[e[g]]=null;if(f){f=null!=d.numf?d.numf:0;for(g=0;g<f;++g)e={},e.urid=a[c]["f"+g+"urid"],e.name=a[c]["f"+g+"name"],e.value=a[c]["f"+g+"value"],e.type=a[c]["f"+g+"type"],d.fields.push(e);f=null!=d.numof?d.numof:0;for(g=0;g<f;++g)e={},e.urid=a[c]["of"+g+"urid"],e.name=a[c]["of"+g+"name"],e.value=a[c]["of"+g+"value"],e.type=a[c]["of"+g+"type"],e.formname=a[c]["of"+g+"formname"],d.otherfields.push(e);"undefined"==typeof b[d.aid]&&(b[d.aid]=[]);b[d.aid].push(d)}}}
function iso2to3(a){return{AD:"AND",AE:"ARE",AF:"AFG",AF:"AFG",AG:"ATG",AL:"ALB",AM:"ARM",AO:"AGO",AQ:"ATA",AR:"ARG",AT:"AUT",AU:"AUS",AW:"ABW",AZ:"AZE",BA:"BIH",BB:"BRB",BD:"BGD",BE:"BEL",BF:"BFA",BG:"BGR",BH:"BHR",BI:"BDI",BJ:"BEN",BM:"BMU",BN:"BRN",BO:"BOL",BR:"BRA",BS:"BHS",BT:"BTN",BW:"BWA",BY:"BLR",BZ:"BLZ",CA:"CAN",CD:"COD",CF:"CAF",CG:"COG",CH:"CHE",CI:"CIV",CL:"CHL",CM:"CMR",CN:"CHN",CO:"COL",CR:"CRI",CU:"CUB",CV:"CPV",CY:"CYP",CZ:"CZE",DE:"DEU",DJ:"DJI",DK:"DNK",DM:"DMA",DO:"DOM",DZ:"DZA",
EC:"ECU",EE:"EST",EG:"EGY",EH:"ESH",ER:"ERI",ES:"ESP",ET:"ETH",FI:"FIN",FJ:"FJI",FM:"FSM",FO:"FRO",FR:"FRA",GA:"GAB",GB:"GBR",GD:"GRD",GE:"GEO",GF:"GUF",GH:"GHA",GM:"GMB",GN:"GIN",GP:"GLP",GQ:"GNQ",GR:"GRC",GT:"GTM",GW:"GNB",GY:"GUY",HN:"HND",HR:"HRV",HT:"HTI",HU:"HUN",IC:"ESC",ID:"IDN",IE:"IRL",IL:"ISR",IN:"IND",IO:"IOT",IQ:"IRQ",IR:"IRN",IS:"ISL",IT:"ITA",JE:"JEY",JM:"JAM",JO:"JOR",JP:"JPN",KE:"KEN",KG:"KGZ",KH:"KHM",KI:"KIR",KM:"COM",KN:"KNA",KP:"PRK",KR:"KOR",KW:"KWT",KZ:"KAZ",LA:"LAO",LB:"LBN",
LC:"LCA",LI:"LIE",LK:"LKA",LR:"LBR",LS:"LSO",LT:"LTU",LU:"LUX",LV:"LVA",LY:"LBY",MA:"MAR",MC:"MCO",MD:"MDA",ME:"MNE",MG:"MDG",MK:"MKD",ML:"MLI",MM:"MMR",MN:"MNG",MO:"MAC",MQ:"MTQ",MR:"MRT",MS:"MSR",MU:"MUS",MV:"MDV",MW:"MWI",MX:"MEX",MY:"MYS",MZ:"MOZ",NA:"NAM",NE:"NER",NG:"NGA",NI:"NIC",NL:"NLD",NO:"NOR",NP:"NPL",NZ:"NZL",OM:"OMN",PA:"PAN",PE:"PER",PG:"PNG",PH:"PHL",PK:"PAK",PL:"POL",PS:"PSE",PT:"PRT",PW:"PLW",PY:"PRY",QA:"QAT",RE:"REU",RO:"ROU",RS:"SRB",RU:"RUS",RW:"RWA",SA:"SAU",SB:"SLB",SC:"SYC",
SD:"SDN",SE:"SWE",SH:"SHN",SI:"SVN",SK:"SVK",SL:"SLE",SM:"SMR",SN:"SEN",SO:"SOM",SR:"SUR",ST:"STP",SV:"SLV",SY:"SYR",SZ:"SWZ",TD:"TCD",TF:"ATF",TG:"TGO",TH:"THA",TJ:"TJK",TL:"TLS",TM:"TKM",TN:"TUN",TR:"TUR",TT:"TTO",TW:"TWN",TZ:"TZA",UA:"UKR",UG:"UGA",US:"USA",UY:"URY",UZ:"UZB",VC:"VCT",VE:"VEN",VN:"VNM",VU:"VUT",YE:"YEM",ZA:"ZAF",ZM:"ZMB",ZW:"ZWE"}[a]}
function crypto_atob(a){if(a&&17<=a.length&&"!"==a.charAt(0)){var b=a.indexOf("|");if(-1!=b)return"!"+atob(a.substring(1,b))+atob(a.substring(b+1))}return atob(a)}function crypto_btoa(a){return a&&33<=a.length&&1==a.length%16&&"!"==a.charAt(0)?"!"+btoa(a.substring(1,17))+"|"+btoa(a.substring(17)):btoa(a)}
function CompareLastPassVersions(a,b,c){var d=0,f=0,e=0,g=0,h=0,j=0,k=a.split(".");for(a=0;a<k.length;a++)0==a?d=parseInt(k[a]):1==a?f=parseInt(k[a]):2==a&&(e=parseInt(k[a]));b=b.split(".");for(a=0;a<b.length;a++)0==a?g=parseInt(b[a]):1==a?h=parseInt(b[a]):2==a&&(j=parseInt(b[a]));return d!=g?d>g?1:-1:f!=h?f>h?1:-1:c?0:e!=j?e>j?1:-1:0}function lpalert(a,b){"undefined"!=typeof LP&&"function"==typeof LP.lpgs?LP.alert(LP.lpgs(a),b):"function"==typeof alertfrombg?alertfrombg(gs(a)):alert(gs(a))}
function issharedfolder(a,b){if(!a||0==a.length||"undefined"==typeof b||null==b)return!1;var c=b;0<c.indexOf("\\")&&(c=c.substr(0,c.indexOf("\\")));for(var d in a){var f=a[d];if(!("object"!=typeof f||"undefined"==typeof f.decsharename)&&f.decsharename==c)return{id:f.id,sharekey:f.key,decsharename:f.decsharename,readonly:f.readonly,give:f.give}}return!1}function getsharekey(a,b){for(var c=0;"undefined"!=typeof a&&null!=a&&c<a.length;c++){var d=a[c];if(d.id==b)return d.key}return null}
function lpmenc_acct(a,b,c,d){return"undefined"==typeof c.sharefolderid?lpmenc(a,b):(c=issharedfolder(d,c.group))?lpmenc(a,b,c.sharekey):lpmenc(a,b)}function lpmdec_acct(a,b,c,d){return"undefined"==typeof c.sharefolderid?lpmdec(a,b):(c=issharedfolder(d,c.group))?lpmdec(a,b,c.sharekey):lpmdec(a,b)}function lpdec_acct(a,b,c){return"undefined"==typeof b.sharefolderid?lpdec(a):(b=issharedfolder(c,b.group))?lpdec(a,b.sharekey):lpdec(a)}
function lpenc_acct(a,b,c){return"undefined"==typeof b.sharefolderid?lpenc(a):(b=issharedfolder(c,b.group))?lpenc(a,b.sharekey):lpenc(a)}function checkmove(){return!0}function checkreadonly(a,b,c){return a&&"1"==a.readonly?(b||lpalert("Sorry, this shared folder is read-only.",c),!1):!0}
function checkUsernameHash(){if(null==lpusername_hash||""==lpusername_hash){var a=null;"string"==typeof g_username&&""!=g_username?a=g_username:"string"==typeof lpusername&&""!=lpusername&&(a=lpusername);null!=a&&("function"==typeof SHA256?lpusername_hash=SHA256(a):"function"==typeof lp_sha256&&(lpusername_hash=lp_sha256(a)))}}
function checkAttach(){if(!("object"==typeof LP&&"undefined"!=typeof LP.isFennec&&LP.isFennec)&&0<lp_server_attach_version){checkUsernameHash();var a=ReadFileGeneric(lpusername_hash+"_version.att",25);a||(a=0);a<lp_server_attach_version&&(a="version="+LP.en(a)+"&b64=1&chunked=1",LP.lpMakeRequest(LP.lp_base+"getattach.php",a,lpSaveAttach))}}
function lpSaveAttach(a){4==a.readyState&&200==a.status&&(a=atob(a.responseText),lp_local_attach_version=get_version(a,"LPAT"),WriteFileGeneric(lpusername_hash+"_version.att",lp_local_attach_version),parseAttachData(a,!0),!isNaN(parseInt(lp_local_attach_version))&&(isFinite(lp_local_attach_version)&&parseInt(lp_local_attach_version)<lp_server_attach_version)&&LP.mostRecent().setTimeout(function(){checkAttach()},1E3))}
function lpReadAttach(a){checkUsernameHash();a=ReadFileGeneric(lpusername_hash+"_"+a+".att");return!a?null:b64_to_utf8(a)}
function parseAttachData(a){if(a&&a.length&&0==a.indexOf("LPAT"))for(var b=a.length,c=unserialize_num(a.substring(4,8))+8;c<b;){var d=unserialize_num(a.substring(c,c+4)),f=c+4,e=unserialize_num(a.substring(f,f+4)),g=a.substring(f+4,f+4+e),f=f+(4+e),e=unserialize_num(a.substring(f,f+4)),f=a.substring(f+4,f+4+e);"delete"==f?DeleteFileGeneric(lpusername_hash+"_"+g+".att"):WriteFileGeneric(lpusername_hash+"_"+g+".att",utf8_to_b64(f));c+=4+d}}
function applyattacharraychanges(a){if("undefined"!=typeof a.add)for(var b in a.add)if(a.add.hasOwnProperty(b)){var c=[];c.id=a.add[b].id;c.parent=a.add[b].parent;c.mimetype=a.add[b].mimetype;lp_attaches.push(c)}if("undefined"!=typeof a.remove)for(b in a.remove)for(a=0;a<lp_attaches.length;a++)b==lp_attaches[a].id&&lp_attaches.splice(a,1)}
function rollbackattacharrayadds(a){if("undefined"!=typeof a.add)for(var b in a.add)if(a.add.hasOwnProperty(b))for(var c=0;c<lp_attaches.length;c++)if(lp_attaches[c].id==a.add[b].id){lp_attaches.splice(c,1);break}}function utf8_to_b64(a){return btoa(a)}function b64_to_utf8(a){return atob(a)}function is_encrypted_field(a){return"text"==a||"password"==a||"textarea"==a||"email"==a||"tel"==a||"url"==a}
function handle_pending_pushed_sites(a,b,c){"undefined"==typeof LP.ppsids_done&&(LP.ppsids_done=[]);if("object"==typeof a&&0<a.length){for(var d="cmd=uploadaccounts&username="+LP.en(lpusername),f=0,e=0;e<a.length;e++){var g=a[e].ppsid;if(!lp_in_array(g,LP.ppsids_done)){LP.ppsids_done.push(g);var g="&ppsid"+LP.en(f)+"="+LP.en(g),h=JSON.parse(atob(a[e].data)),j=!1,k;for(k in h)if("object"==typeof h[k]&&"undefined"!=typeof h[k].value&&"undefined"!=typeof h[k].encrypt){var p=k,l=p.indexOf("X");if(-1!=
l){p=p.substring(0,l)+f+p.substring(l+1);l=h[k].value;if("undefined"!=typeof h[k].decrypt&&0!=h[k].decrypt){j=!0;if(c)for(var r=0;r<c.length;r++)if(c[r].id==h[k].decrypt){j=!1;l=lpdec(l,c[r].key);break}if(j)break}h[k].encrypt&&(l=lpenc(l));g+="&"+LP.en(p)+"="+LP.en(l)}}j||(d+=g,f++)}}0<f&&LP.lpMakeRequest(LP.lp_base+"lastpass/api.php",d,b,function(){})}}
function clear_filled_fields(a,b,c){"undefined"==typeof c&&(c=1);if(10<c)return null;if(a&&"object"==typeof a.lp_filled_fields){for(var d=0;d<a.lp_filled_fields.length;d++){var f=a.lp_filled_fields[d].value;a.lp_filled_fields[d].value="";""!=f&&fire_onchange(a.lp_filled_fields[d])}a.lp_filled_fields=[]}if(b&&b.frames){a=b.frames.length;10<a&&(a=10);for(d=0;d<a;d++)b.frames[d].document&&clear_filled_fields(b.frames[d].document,b.frames[d].window,c+1)}}
function get_sitepwlen(a){return"undefined"!=typeof LP&&"undefined"!=typeof LP.sitepwlen&&"undefined"!=typeof LP.sitepwlen[a]?LP.sitepwlen[a]:"undefined"!=typeof g_sitepwlen&&"undefined"!=typeof g_sitepwlen[a]?g_sitepwlen[a]:1}
function fix_url_host(a){if("string"==typeof a){if(27<a.length&&-1!=a.indexOf("logmein.com",a.length-11)){var b=a.match(/^(.*)-[a-z]{10}(\.app).*(\.logmein\.com)$/);if(b)return b[1]+b[2]+b[3]}if(24<a.length&&-1!=a.indexOf("logme.in",a.length-8)&&(b=a.match(/^(.*)-[a-z]{10}(\.app).*(\.logme\.in)$/)))return b[1]+b[2]+b[3]}return a}function is_watermark(a){return 0<=a.indexOf("watermark")&&-1==a.indexOf("watermarkAble")};var lpffregexpnames="combineddummy phoneext gender ssn1 ssn2 ssn3 ssn birthyear birthmonth birthday birthdate city county state zip1 zip2 zip country email mobileemail housenumbername housenumber housename address1 ccphone address2 address3 mobilephone1 mobilephone2 mobilephone3 mobilephone evephone1 evephone2 evephone3 evephone phone1 phone2 phone3 phone fax1 fax2 fax3 fax title ccname ccnum1 ccnum2 ccnum3 ccnum4 cccsc ccnum ccstartmonth ccstartyear ccstart ccexpmonth ccexpyear ccexp cctype ccissuenum firstname3 firstname2 firstname middlename middleinitial lastname3 lastname2 lastname fulllastname address company username bankname addrbookname name age timezone bankacctnum bankroutingnum".split(" "),
lpffdummyregexpnames="securityanswer promocode maiden comments invoice addrbookname emailalert combineddummy".split(" "),lpffregexpparents=[];lpffregexpparents.ssn1=lpffregexpparents.ssn2=lpffregexpparents.ssn3="ssn";lpffregexpparents.birthyear=lpffregexpparents.birthmonth=lpffregexpparents.birthday="birthdate";lpffregexpparents.address1=lpffregexpparents.address2=lpffregexpparents.address3="address";
lpffregexpparents.phone1=lpffregexpparents.phone2=lpffregexpparents.phone3=lpffregexpparents.phone23="phone";lpffregexpparents.evephone1=lpffregexpparents.evephone2=lpffregexpparents.evephone3=lpffregexpparents.evephone23="evephone";lpffregexpparents.mobilephone1=lpffregexpparents.mobilephone2=lpffregexpparents.mobilephone3=lpffregexpparents.mobilephone23="mobilephone";lpffregexpparents.fax1=lpffregexpparents.fax2=lpffregexpparents.fax3=lpffregexpparents.fax23="fax";
lpffregexpparents.ccnum1=lpffregexpparents.ccnum2=lpffregexpparents.ccnum3=lpffregexpparents.ccnum4="ccnum";lpffregexpparents.ccexpmonth=lpffregexpparents.ccexpyear="ccexp";lpffregexpparents.ccstartmonth=lpffregexpparents.ccstartyear="ccstart";lpffregexpparents.firstname=lpffregexpparents.middlename=lpffregexpparents.middleinitial=lpffregexpparents.lastname=lpffregexpparents.lastname2="name";lpffregexpparents.zip1=lpffregexpparents.zip2="zip";
lpffregexpparents.lastname=lpffregexpparents.lastname2="fulllastname";var lpffregexps=[],lpfftextregexps=[],lastname2_index=-1,lastname3_index=-1;function lptofillinfo(){}var lp_formfill_tld="";
function lpCheckFormFill(d,a,f,h,e,p,t,y,u){var c="string"==typeof u?!0:!1;u="string"==typeof u?u:"";if("undefined"==typeof p||null==p)p=1;if(10<p||!d&&!t)return!1;var L=null;if("object"==typeof LP&&!LP.isFennec&&null==LP.getBrowser().selectedTab)return!1;var H=null;"object"==typeof LP&&(H=LP.isFennec?d:LP.getBrowser().selectedTab.linkedBrowser);var A=H&&H.contentDocument?H.contentDocument:null;try{if("undefined"==typeof t||null==t)t=d.contentWindow;L=d?LP.lpgetcurrenturl(d):t.location.href;"undefined"!=
typeof punycode&&"undefined"!=typeof punycode.URLToASCII&&(L=punycode.URLToASCII(L));if("undefined"!=typeof lpformfills&&0==lpformfills.length&&!c){if(H){var b=H.contentDocument;b&&(b.m_abortedFormFillChecking=!0)}return!1}var m=a.getElementsByTagName("form");if(A&&!f&&"undefined"!=typeof A.m_checkfillformresult&&A.m_checkfillformnumforms==m.length)return A.m_checkfillformresult;if(!f&&("undefined"!=typeof lpShowFormFillNotifications&&!lpShowFormFillNotifications||0==m.length)){if(H&&(b=H.contentDocument))b.m_abortedFormFillChecking=
!0;A&&(A.m_checkfillformresult=!1,A.m_checkfillformnumforms=m.length);return!1}if(!f&&!h&&"undefined"!=typeof lp_notification_exists&&(lp_notification_exists(d,"autologin")||lp_notification_exists(d,"generate")||lp_notification_exists(d,"formfill"))){if(H&&(b=H.contentDocument))b.m_abortedFormFillChecking=!0;A&&(A.m_checkfillformresult=!1,A.m_checkfillformnumforms=m.length);return!1}b=null;if(e)for(var C=0;C<lpformfills.length;C++){if(lpformfills[C].ffid==e){b=lpformfills[C];break}}else"undefined"!=
typeof lpformfills&&!c&&(b=lpformfills[0]);var Q,E;Q=0==t.location.href.indexOf("https://")?E=!0:E=!1;var G=lpParseUri(L),U=lpcanonizeUrl(L,G),B=lp_gettld(G.host,L);lp_formfill_tld=B;if(!f&&"undefined"!=typeof never_ff&&never_ff(U,B))return A&&(A.m_checkfillformresult=!1,A.m_checkfillformnumforms=m.length),!1;lpFormFillInitRegexps("en-US");var G=null,X=lpffregexps["en-US"],$=lpfftextregexps["en-US"],U=lpffregexpnames;if(e)for(C=0;C<lpformfills.length;C++){if(lpformfills[C].ffid==e){var b=lpformfills[C],
F=lpdec(b.profilelanguage);5==F.length&&(G=F);"en-US"!=G&&lpFormFillInitRegexps(G);X=lpffregexps[G];$=lpfftextregexps[G];if("undefined"!=typeof b.customfields&&0<b.customfields.length){for(var X=[],$=[],U=[],k=0;k<lpffregexps[G].length;k++)X[k]=lpffregexps[G][k],$[k]=lpfftextregexps[G][k],U[k]=lpffregexpnames[k];for(k=0;k<b.customfields.length;k++){var v=lpdec(b.customfields[k].text),n=lpdec(b.customfields[k].alttext).split(/\r\n|\r|\n/g);n.unshift(v);for(var B=F="",N=0;N<n.length;N++)v=lptrim(n[N]),
""!=v&&(F+=B+lp_regexp_quote(v),B="|");""!=F&&(X.unshift(RegExp(F,"i")),$.unshift(RegExp(F,"i")),U.unshift("customfield"+k))}}break}}else c&&(b=new lpformfillinfo,b.ffid="0",b.profiletype="",b.profilename="translation",b.profilelanguage=lpenc(u),b.firstname=lpenc("firstname"),b.firstname2=lpenc("firstname2"),b.firstname3=lpenc("firstname3"),b.middlename=lpenc("middlename"),b.lastname=lpenc("lastname"),b.lastname2=lpenc("lastname2"),b.lastname3=lpenc("lastname3"),b.email=lpenc("email"),b.mobileemail=
lpenc("mobileemail"),b.company=lpenc("company"),b.ssn=lpenc("ssn"),b.birthday=lpenc("birthday"),b.address1=lpenc("address1"),b.address2=lpenc("address2"),b.address3=lpenc("address3"),b.city=lpenc("city"),b.county=lpenc("county"),b.state=lpenc("state"),b.state_name=lpenc("state_name"),b.zip=lpenc("zip"),b.country=lpenc("country"),b.country_cc3l=lpenc("country_cc3l"),b.country_name=lpenc("country_name"),b.countryphone="countryphone",b.countryevephone="countryevephone",b.countryfaxphone="countryfaxphone",
b.countrymobphone="countrymobphone",b.phoneext=lpenc("phoneext"),b.evephoneext=lpenc("evephoneext"),b.faxphoneext=lpenc("faxphoneext"),b.mobilephoneext=lpenc("mobilephoneext"),b.phone=lpenc("phone"),b.evephone=lpenc("evephone"),b.fax=lpenc("fax"),b.mobilephone=lpenc("mobilephone"),b.ccname=lpenc("ccname"),b.ccnum=lpenc("ccnum"),b.ccstart=lpenc("ccstart"),b.ccexp=lpenc("ccexp"),b.cccsc=lpenc("cccsc"),b.ccissuenum=lpenc("ccissuenum"),b.username=lpenc("username"),b.gender=lpenc("gender"),b.title=lpenc("title"),
b.pwprotect="0",b.creditmon="0",b.customfields=[],b.timezone=lpenc("timezone"),b.bankname=lpenc("bankname"),b.bankacctnum=lpenc("bankacctnum"),b.bankroutingnum=lpenc("bankroutingnum"),b.notes=lpenc("notes"),"undefined"==typeof LP_to_formfill&&(LP_to_formfill=[]),LP_to_formfill.promocode="promocode",F=u,5==F.length&&(G=F),"en-US"!=G&&lpFormFillInitRegexps(G),X=lpffregexps[G],$=lpfftextregexps[G]);F=n=v=null;try{f&&(t.getSelection?(v=t.getSelection(),""==v.toString()?v=n=F=null:(v.getRangeAt&&(n=v.getRangeAt(0)),
a.createRange&&(F=a.createRange()))):a.selection&&(v=a.selection.createRange(),F=a.body.createTextRange(),""==v.text&&(v=n=F=null)))}catch(D){v=n=F=null}var B={value:0},H={value:0},Z={},Y={},w={},I={};Z.value=!1;Y.value=!1;w.value=!1;I.value=!1;for(C=0;C<m.length+1;C++){var j=C<m.length?m[C]:null,M;if(null!=j)M=j.elements;else{M=[];for(var z=["input","select","textarea"],k=0;k<z.length;k++)for(var x=a.getElementsByTagName(z[k]),N=0;N<x.length;N++)if("unknown"==typeof x[N].form||null==x[N].form)M[M.length]=
x[N]}if("undefined"!=typeof M){z=[];for(N=0;N<X.length;N++)z[U[N]]=0;var s=[],O=populateToFillForFormFill(M,d,{value:0},z,s,{value:!1},f,v,n,F,H,X,U,$,B,h,Z,Y,w,I,t,G);if(0==O)return A&&(A.m_checkfillformresult=!1,A.m_checkfillformnumforms=m.length),!1;if(1==O)return A&&(A.m_checkfillformresult=!0,A.m_checkfillformnumforms=m.length),!0;if(f){var r="birthday",l="birthmonth";b&&"US"==lpdec(b.country)&&(r="birthmonth",l="birthday");var g=[];"es-ES"!=G&&"es-MX"!=G&&"ca-ES"!=G&&"ja-JP"!=G?(g[g.length]=
"name name name firstname middlename lastname".split(" "),g[g.length]="firstname firstname lastname firstname middlename lastname".split(" "),g[g.length]="firstname lastname lastname firstname middlename lastname".split(" "),g[g.length]=["name","name","firstname","lastname"],g[g.length]=["name","lastname","firstname","lastname"],g[g.length]=["name","firstname","firstname","lastname"],g[g.length]="lastname lastname lastname firstname middlename lastname".split(" "),g[g.length]=["lastname","lastname",
"firstname","lastname"],g[g.length]=["firstname","firstname","firstname","lastname"],g[g.length]="firstname lastname firstname firstname middlename lastname".split(" "),g[g.length]=["firstname","name","firstname","lastname"]):(g[g.length]="name lastname lastname firstname lastname lastname2".split(" "),g[g.length]="name lastname lastname2 firstname lastname lastname2".split(" "),g[g.length]=["name","lastname","firstname","fulllastname"],g[g.length]="firstname lastname lastname firstname lastname lastname2".split(" "),
g[g.length]=["fulllastname","fulllastname","lastname","lastname2"],g[g.length]=["name","name","firstname","lastname"]);g[g.length]="address address address address1 address2 address3".split(" ");g[g.length]="address2 address2 address address1 address2 address3".split(" ");g[g.length]="address1 address3 address2 address1 address2 address3".split(" ");g[g.length]=["address","address","address1","address2"];g[g.length]=["address","address2","address1","address2"];g[g.length]=["address1","address1","address1",
"address2"];g[g.length]=["address","address1","address1","address2"];g[g.length]=["address2","address2","address1","address2"];g[g.length]=["address1","address3","address1","address2"];g[g.length]=["address","address3","address1","address2"];g[g.length]="ssn ssn ssn ssn1 ssn2 ssn3".split(" ");g[g.length]=["zip","zip","zip1","zip2"];g[g.length]=["birthmonth","birthdate","birthyear",r,l,"birthyear"];g[g.length]=["birthday","birthday","birthday",r,l,"birthyear"];g[g.length]=["birthdate","birthdate",
"birthdate",r,l,"birthyear"];g[g.length]=["birthdate","birthdate","birthyear",r,l,"birthyear"];g[g.length]=["birthday","birthday",r,l];g[g.length]=["birthdate","birthdate",r,l];for(r=1;4>=r;r++)l="evephone",2==r&&(l="phone"),3==r&&(l="fax"),4==r&&(l="mobilephone"),g[g.length]=[l,l,l,l+"1",l+"2",l+"3"],g[g.length]=[l+"1",l+"2",l,l+"1",l+"2",l+"3"],g[g.length]=[l+"1",l+"1",l+"2",l+"1",l+"2",l+"3"],g[g.length]=[l+"1",l+"1",l+"1",l+"1",l+"2",l+"3"],g[g.length]=[l+"1",l,l,l+"1",l+"2",l+"3"],g[g.length]=
[l,l,l+"2",l+"1",l+"2",l+"3"],g[g.length]=[l,l+"2",l+"3",l+"1",l+"2",l+"3"],g[g.length]=[l,l+"2",l,l+"1",l+"2",l+"3"],g[g.length]=[l,l+"3",l,l+"1",l+"2",l+"3"],g[g.length]=[l,l,l+"1",l+"23"];g[g.length]="ccnum ccnum ccnum ccnum ccnum1 ccnum2 ccnum3 ccnum4".split(" ");g[g.length]="ccnum ccnum ccnum ccnum1 amexccnum2 amexccnum3".split(" ");g[g.length]=["ccexp","ccexp","ccexpmonth","ccexpyear"];g[g.length]=["ccexp","ccexpyear","ccexpmonth","ccexpyear"];g[g.length]=["ccexpyear","ccexpyear","ccexpmonth",
"ccexpyear"];g[g.length]=["ccstart","ccstart","ccstartmonth","ccstartyear"];g[g.length]=["ccstart","ccstartyear","ccstartmonth","ccstartyear"];g[g.length]="cctype cctype cctype firstname middlename lastname".split(" ");if(Y.value||Z.value||I.value||w.value){r=!0;for(k=0;k<s.length;k++)"country"==s[k].namematch&&"country"==s[k].textmatch&&(r=!1),"state"==s[k].namematch&&"state"==s[k].textmatch&&(r=!1);if(r){r=[];l=[];for(k=0;k<s.length;k++){var V=s[k].namematch,aa=s[k].textmatch;""!=V&&(l[V]=1);""!=
aa&&(r[aa]=1)}var W=array_size(l),R=array_size(r);if(W>R)for(k=0;k<s.length;k++)s[k].namematch&&(s[k].regexpname=s[k].namematch)}}CheckForLoners(s);for(k=0;k<s.length;k++){var ba=s[k],q=ba.elt;if(lpIsVisible(q)){for(var J=ba.regexpname,r=!1,N=0;N<g.length;N++){var T=g[N];if(0==T.length%2&&J==T[0]){var P=T.length/2;if(!(k>=s.length-(P-1))&&!("cctype"==T[0]&&"firstname"==T[3]&&("select-one"==q.type||"radio"==q.type))){for(l=0;l<P&&check_size_or_maxlen(s[k+l].elt,T[P+l])&&!(1<=l&&(s[k+l].regexpname!=
T[l]||!s[k+l].last_field_filled));l++);if(!(l<P)){J=T[P];for(l=1;l<P;l++)s[k+l].regexpname=T[P+l];r=!0;break}}}}if(!r&&"cctype"==J&&"select-one"!=q.type&&"radio"!=q.type){for(var S=!1,K=0;K<s.length;K++)if(0==s[K].regexpname.indexOf("ccnum")){S=!0;break}S||(J="ccnum")}else if(!r&&"bankacctnum"==J){l=r=S=!1;for(K=0;K<s.length;K++)if(0==s[K].regexpname.indexOf("ccnum")){S=!0;break}else if(0==s[K].regexpname.indexOf("cc"))r=!0;else if(0==s[K].regexpname.indexOf("bank")&&"bankacctnum"!=s[K].regexpname){l=
!0;break}!S&&(r&&!l)&&(J="ccnum")}else if(!r&&"cccsc"==J){S=!1;for(K=0;K<s.length;K++)if(0==s[K].regexpname.indexOf("ccnum")){S=!0;break}if(!S)continue}else if(!r&&0==J.indexOf("ccnum")&&"select-one"==q.type)J="cctype";else if("address3"==J&&""==b.address3&&""!=b.city){r=!1;for(K=0;K<s.length;K++)if("city"==s[K].regexpname){r=!0;break}r||(J="city")}else if("address"==J&&"textarea"==q.type){r=!1;for(K=0;K<s.length;K++)if("city"==s[K].regexpname||"county"==s[K].regexpname||"state"==s[K].regexpname){r=
!0;break}r||(J="fulladdress")}if("undefined"!=typeof lpdonotoverwritefilledfields&&lpdonotoverwritefilledfields)if(("email"==q.type||"text"==q.type||"password"==q.type||"textarea"==q.type||"tel"==q.type||"url"==q.type)&&""!=q.value)continue;else if("select-one"==q.type&&0!=q.selectedIndex)continue;else if(("checkbox"==q.type||"radio"==q.type)&&q.checked)continue;if(0==J.indexOf("cc"))if(Q&&!E)continue;else if(!Q||!E)if(r=J,"undefined"!=typeof lpffregexpparents[J]?r=lpffregexpparents[J]:"cctype"==
J&&(r="ccnum"),b&&("undefined"!=typeof b[r]&&""!=b[r])&&(Q||(E=lpConfirmYesNo(lpgs("InsecureSite",G))?!0:!1,Q=!0),!E))continue;var ca=q.value;lpFillFormField(A,q,J,e,y,G,c,b,u);q.value!=ca&&("undefined"==typeof z[J]&&(z[J]=0),z[J]++)}}}}}if(t&&t.frames&&(!f||null==v))for(C=0;C<t.frames.length;C++)try{if(t.frames[C].document){var da=lpCheckFormFill(d,t.frames[C].document,f,h,e,p+1,t.frames[C].window,y);if(da&&!f)return A&&(A.m_checkfillformresult=da,A.m_checkfillformnumforms=m.length),da}}catch(ga){}f&&
("undefined"!=typeof lploglogins&&lploglogins&&1==p)&&lplogformfill(e,!1,"",t)}catch(fa){lpReportError("Failure with checking formfill: "+fa+" ln: "+fa.lineNumber,L)}if(!f)return A&&(A.m_checkfillformresult=!1,A.m_checkfillformnumforms=m.length),!1}function DoFillReplace(d,a){for(var f=d[0],h=0;h<d.length;h++)for(var e=0;e<a.length;e++)a[e].regexpname==d[h]&&(a[e].regexpname=f,a[e].namematch==d[h]&&(a[e].namematch=f),a[e].textmatch==d[h]&&(a[e].textmatch=f))}
function CheckForLoners(d){var a=[];a[a.length]=["birthdate","birthday","birthmonth"];for(var f="",h=0;h<d.length;h++)f+=","+d[h].regexpname;for(h=0;h<a.length;h++){for(var e=0,p=1;p<a[h].length;p++)e+=-1==f.indexOf(","+a[h][p])?0:1;1==e&&DoFillReplace(a[h],d)}}
function populateToFillForFormFill(d,a,f,h,e,p,t,y,u,c,L,H,A,b,m,C,Q,E,G,U,B,X){for(var $=d.length,F=0,k=0;k<$;k++){var v=!1,n=d[k];if(("email"==n.type||"text"==n.type||"password"==n.type||"select-one"==n.type||"textarea"==n.type||"radio"==n.type||"tel"==n.type||"url"==n.type||"checkbox"==n.type)&&!("select-one"==n.type&&!0==n.disabled)){if(100<++F)break;var N=getname(n),D=!1;if(""!=N){try{if(t&&null!=y)if(-1!=B.navigator.userAgent.indexOf("Opera")){c.setStart(n,0);c.setEnd(n,0);var Z=u.compareBoundaryPoints(Range.START_TO_START,
c),Y=u.compareBoundaryPoints(Range.END_TO_END,c);if(0<Z||0>Y)continue}else if("function"==typeof y.containsNode){if(!y.containsNode(n,!0))continue}else if(null!=c&&"undefined"!=typeof c.moveToElementText){var w=n;if("select-one"==w.type){for(var I=w.previousSibling,j=!1;I;){if(1==I.nodeType&&"SELECT"!=I.tagName){w=I;j=!0;break}I=I.previousSibling}j||(w=w.parentNode)}c.moveToElementText(w);Z=y.compareEndPoints("StartToStart",c);Y=y.compareEndPoints("EndToEnd",c);if(0<Z||0>Y)continue}}catch(M){}var z=
0,x=0;"undefined"!=typeof n.size&&(z=parseInt(n.size));"undefined"!=typeof n.maxLength&&(x=parseInt(n.maxLength));0>=z&&(0>=x&&n.style)&&(w=n.style.width,w.match(/^\d+px$/)&&(w=parseInt(w.substring(0,w.length-2)),0==w%10&&(z=w/10)));var s=!0,w=[],O=[];try{var r=n.getAttribute("autocompletetype");if("string"!=typeof r||""==r)r=n.getAttribute("autocomplete");if("string"==typeof r&&""!=r)for(var l=r.split(" "),j="",g=0;g<l.length;g++){switch(l[g]){case "given-name":j="firstname";break;case "middle-name":j=
"middlename";break;case "additional-name":j="middlename";break;case "middle-initial":j="middleinitial";break;case "additional-name-initial":j="middleinitial";break;case "surname":j="lastname";break;case "family-name":j="lastname";break;case "name-full":j="name";break;case "name":j="name";break;case "name-prefix":j="title";break;case "honorific-prefix":j="title";break;case "street-address":j="address";break;case "address-line1":j="address1";break;case "address-line2":j="address2";break;case "address-line3":j=
"address3";break;case "locality":j="city";break;case "city":j="city";break;case "administrative-area":j="state";break;case "state":j="state";break;case "province":j="state";break;case "region":j="state";break;case "postal-code":j="zip";break;case "country":j="country";break;case "country-name":j="country";break;case "email":j="email";break;case "phone-full":j="fullphone";break;case "tel":j="fullphone";break;case "phone-country-code":j="phonecc";break;case "tel-country-code":j="phonecc";break;case "phone-national":j=
"phone";break;case "tel-national":j="phone";break;case "phone-area-code":j="phone1";break;case "tel-area-code":j="phone1";break;case "phone-local":j="phone23";break;case "tel-local":j="phone23";break;case "phone-local-prefix":j="phone2";break;case "tel-local-prefix":j="phone2";break;case "phone-local-suffix":j="phone3";break;case "tel-local-suffix":j="phone3";break;case "phone-extension":j="phoneext";break;case "tel-extension":j="phoneext";break;case "fax-full":j="fullfax";break;case "fax":j="fullfax";
break;case "fax-country-code":j="faxcc";break;case "fax-national":j="fax";break;case "fax-area-code":j="fax1";break;case "fax-local":j="fax23";break;case "fax-local-prefix":j="fax2";break;case "fax-local-suffix":j="fax3";break;case "fax-extension":j="faxphoneext";break;case "cc-full-name":j="ccname";break;case "cc-name":j="ccname";break;case "cc-given-name":j="ccfirstname";break;case "cc-middle-name":j="ccmiddlename";break;case "cc-additional-name":j="ccmiddlename";break;case "cc-surname":j="cclastname";
break;case "cc-family-name":j="cclastname";break;case "cc-number":j="ccnum";break;case "cc-exp-month":j="ccexpmonth";break;case "cc-exp-year":j="ccexpyear";break;case "cc-exp":j="ccexp";break;case "cc-csc":j="cccsc";break;case "language":j="language";break;case "birthday":j="birthdate";break;case "bday":j="birthdate";break;case "birthday-month":j="birthmonth";break;case "bday-month":j="birthmonth";break;case "birthday-year":j="birthyear";break;case "bday-year":j="birthyear";break;case "birthday-day":j=
"birthday";break;case "bday-day":j="birthday";break;case "organization":j="company";break;case "org":j="company";break;case "gender":j="gender";break;case "sex":j="gender"}if(""!=j){w[0]=O[0]=j;if(!t&&(L.value++,f.value++,3<=++m.value))return!C&&("undefined"==typeof lp_notification_exists||!lp_notification_exists(a,"addconfirm"))&&lp_showNotification("FillableFormDetected",a,0,"formfill"),a?a.contentDocument.ffidindex=-1:document.ffidindex=-1,!0;break}}}catch(V){}if(0==w.length){var aa=j=!1,W="";
if(t||5>=++L.value)t&&(W=lpGetTextBeforeFormField(n));if(!t&&20<L.value)return!1;var R=2,ba=1;t||(R=ba=""!=W?2:1);if("undefined"!=typeof H&&"undefined"!=typeof H.length)for(g=0;g<H.length&&s&&!j;g++)if(null!=H[g]){var q=A[g];if(!("radio"==n.type&&"gender"!=q&&"cctype"!=q&&0!=q.indexOf("customfield"))&&!("checkbox"==n.type&&"gender"!=q&&0!=q.indexOf("customfield"))&&!("select-one"==n.type&&"state"!=q&&"country"!=q&&"cctype"!=q&&"timezone"!=q&&"city"!=q&&0!=q.indexOf("birth")&&"title"!=q&&0!=q.indexOf("ccexp")&&
0!=q.indexOf("ccstart")&&"gender"!=q&&"age"!=q&&0!=q.indexOf("customfield"))&&!("password"==n.type&&0!=q.indexOf("ccnum")&&"cccsc"!=q&&"ccissuenum"!=q&&"cctype"!=q&&"bankacctnum"!=q&&0!=q.indexOf("ssn")&&0!=q.indexOf("customfield"))&&(!("text"==n.type||"textarea"==n.type||"email"==n.type||"tel"==n.type||"url"==n.type)||!("cctype"==q||"timezone"==q||"gender"==q))&&check_size_or_maxlen(n,q,!0,z,x)&&!(0==q.indexOf("address")&&0<x&&15>x)){for(var J=!1,T=!1,P=R;P>=ba&&!(1==P&&!J&&0<O.length&&"select-one"!=
n.type);P--){var S;if(1==P)S=N;else if(2==P&&(S=W,""==S))continue;var K=1==P?H[g]:b[g];if(("undefined"==typeof h[q]||2>h[q])&&regexp_match_c(K,S)){if(2==P&&("evephone"==q||"mobilephone"==q))aa=!0;if(2==P&&"phone"==q&&aa)break;if(!t&&!D){if(!lpIsVisible(n)){s=!1;v=p.value;break}D=!0}lp_in_array(q,lpffdummyregexpnames)?"undefined"!=typeof LP_to_formfill&&"undefined"!=typeof LP_to_formfill.promocode&&RegExp(lpgs("ff_promocode_regexp",X),"i").exec(S)&&(m.value++,f.value++,q="promocode"):(m.value++,f.value++);
if(t)1==P?(w[w.length]=q,T=!0):(O[O.length]=q,J=!0);else{"undefined"==typeof h[q]&&(h[q]=0);h[q]++;if(3<=m.value)return!C&&("undefined"==typeof lp_notification_exists||!lp_notification_exists(a,"addconfirm"))&&lp_showNotification("FillableFormDetected",a,0,"formfill"),a?a.contentDocument.ffidindex=-1:document.ffidindex=-1,!0;j=!0;break}}}if(J&&T)break}}}if(t&&s){z=[];for(x=0;x<O.length;x++)lp_in_array(O[x],w)?z[z.length]=O[x]:"undefined"!=typeof lpffregexpparents[O[x]]&&lp_in_array(lpffregexpparents[O[x]],
w)&&(z[z.length]=O[x]);D=null;if(0<z.length)D=z[0];else if(0<O.length)D=O[0];else if(0<w.length){if(0==w[0].indexOf("ccnum")&&"select-one"==n.type)for(D=1;D<w.length;D++)if(0==w[D].indexOf("ccexp")){w.shift();break}D=w[0]}for(x=0;x<w.length;x++)if(0==w[x].indexOf("customfield")){D=w[x];break}if(null!=D){"name"==D&&(lp_in_array("name",z)&&lp_in_array("company",O))&&(D="company");if("ccexp"==D&&"select-one"==n.type&&lp_in_array("ccexp",O)&&lp_in_array("cctype",w)&&12!=n.options.length&&13!=n.options.length){for(v=
0;v<n.options.length&&!n.options[v].value.match(/^(?:\d{1,2}|\d{4}|\d{2}\/?(?:\d{2}|\d{4}))$/)&&!n.options[v].text.match(/^(?:\d{1,2}|\d{4}|\d{2}\/?(?:\d{2}|\d{4}))$/);v++);v==n.options.length&&(D="cctype")}"ccexp"==D&&("text"==n.type&&lp_in_array("ccexp",O)&&lp_in_array("cccsc",w)&&"undefined"!=typeof n.maxLength&&3<=n.maxLength&&4>=n.maxLength)&&(D="cccsc");v=new lptofillinfo;v.elt=n;v.regexpname=D;v.last_field_filled=p.value;z=D="";0<O.length&&(z=O[0]);0<w.length&&("state"==w[0]&&("state"!=z&&
"select-one"==n.type)&&(E.value=!0),"country"==w[0]&&("country"!=z&&"select-one"==n.type)&&(Q.value=!0),"ccexpmonth"==w[0]&&("ccexpmonth"!=z&&"ccexp"!=z&&"select-one"==n.type)&&(G.value=!0),"ccexpyear"==w[0]&&("ccexpyear"!=z&&"ccexp"!=z&&"select-one"==n.type)&&(U.value=!0),D=w[0]);v.namematch=D;v.textmatch=z;e[e.length]=v;v=!0}}}p.value=v}}return 2}
function lpClearForms(d,a,f,h){if("undefined"==typeof f||null==f)f=1;if(10<f||!d&&!h||!a)return!1;for(var e=["input","select"],p=0;p<e.length;p++)for(var t=a.getElementsByTagName(e[p]),y=0;y<t.length;y++){var u=t[y];if(!u.readOnly&&!u.disabled)if("email"==u.type||"text"==u.type||"password"==u.type||"tel"==u.type||"url"==u.type)""!=u.value&&(u.value="",fire_onchange(u));else if("select-one"==u.type)0!=u.selectedIndex&&(u.selectedIndex=0,fire_onchange(u));else if(("radio"==u.type||"checkbox"==u.type)&&
u.checked)u.checked=!1,fire_onchange(u)}if("undefined"==typeof h||null==h)h=d.contentWindow;if(h&&h.frames)for(p=0;p<h.frames.length;p++)h.frames[p].document&&lpClearForms(d,h.frames[p].document,f+1,h.frames[p].window)}var g_lastmodifiedlocalefile={},g_overrideregexps={};
function lpFormFillInitRegexps(d){var a=!1;if("function"==typeof lpLastModifiedFile){var f=lpLastModifiedFile(d+".properties");if(f&&("undefined"==typeof g_lastmodifiedlocalefile[d]||g_lastmodifiedlocalefile[d]<f))if(a=!0,g_lastmodifiedlocalefile[d]=f,g_overrideregexps[d]={},f=lpReadFile(d+".properties",null,1))for(var f=f.replace("\r",""),h=f.split("\n"),e=h.length,f=0;f<e;++f){var p=h[f];if(0==p.indexOf("ff_")){var t=p.indexOf("=");if(-1!=t){var y=p.substring(0,t),p=p.substring(t+1);g_overrideregexps[d][y]=
p}}}}if(a||"undefined"==typeof lpffregexps[d])lpffregexps[d]=[],lpfftextregexps[d]=[];if(!(0<lpffregexps[d].length)){a=!1;for(f=0;f<lpffregexpnames.length;f++)h="ff_"+lpffregexpnames[f]+"_regexp",e=lpgs(h,d,!0),e!=h&&(a=!0),"undefined"!=typeof g_overrideregexps[d]&&"undefined"!=typeof g_overrideregexps[d][h]&&(e=g_overrideregexps[d][h]),lpffregexps[d][f]=e.length?RegExp(e,"i"):null,"lastname2"==lpffregexpnames[f]&&(lastname2_index=f),"lastname3"==lpffregexpnames[f]&&(lastname3_index=f),h="ff_text_"+
lpffregexpnames[f]+"_regexp",e=lpgs(h,d,!0),"undefined"!=typeof g_overrideregexps[d]&&"undefined"!=typeof g_overrideregexps[d][h]&&(e=g_overrideregexps[d][h]),lpfftextregexps[d][f]=e.length&&e!=h?RegExp(e,"i"):lpffregexps[d][f];a||delete lpffregexps[d]}}
function lpGetTextBeforeFormField(d){var a="";try{if(""!=d.id&&"undefined"!=typeof d.ownerDocument&&null!=d.ownerDocument)for(var f=d.ownerDocument.getElementsByTagName("label"),h=0;h<f.length;h++)if(f[h].htmlFor==d.id){var e=strip(lpGetText(f[h],d,!1,!0));if(2<=e.length)return e;break}if("string"==typeof d.placeholder&&2<d.placeholder.length)return d.placeholder;var p=d.parentNode;if(p&&("DIV"==p.tagName||"SPAN"==p.tagName))p=p.parentNode;if(p&&"TD"==p.tagName){var t=strip(lpGetText(p,d,!1,!0));
if(2<=t.length)return t;var y=p.parentNode,u=strip(lpGetText(y,d,!1,!0));if(2<=u.length)return u;var t=f=-1,c=p.offsetParent;if(c)for(u=0;u<c.rows.length;u++)if(y==c.rows[u]){f=u;break}for(u=0;u<y.cells.length;u++)if("undefined"!=typeof y.cells[u]&&p==y.cells[u]){t=u;break}p=0;if(0<f&&-1!=t){for(h=u=y=0;h<=t;h++){var L=c.rows[f].cells[h],H=1;L&&"number"==typeof L.colSpan&&(H=L.colSpan);h<t?y+=H:u=y+H-1}for(var A=0,h=0;h<=u;h++){L=c.rows[f-1].cells[h];H=1;L&&"number"==typeof L.colSpan&&(H=L.colSpan);
var b=1;L&&"number"==typeof L.rowSpan&&(b=L.rowSpan);1<b&&(y+=b-1,u+=b-1);var b=A,m=A+H-1;if((y>=b&&y<=m||u>=b&&u<=m)&&L)if(e=strip(lpGetText(L,d,!1,!0)),2<=e.length){a=e;p=1;break}A+=H}}if(!p&&(-1!=f&&-1!=t)&&(L=c.rows[f].cells[0]))e=strip(lpGetText(L,d,!1,!0)),2<=e.length&&(a=e)}}catch(C){}""==a&&(a=lpGetTextBeforeFormField_orig(d));return a}
function innerHTMLParse(d,a){var f="",h=d.innerHTML,e=RegExp("<(input|select|textarea)[^>]+name=[\"']?"+lp_regexp_quote(lpxmlescape(getname(a)))+"[\"']?[^>]*>","i"),e=e.exec(h);if(!e&&(e=RegExp("<(input|select|textarea)[^>]+id=[\"']?"+lp_regexp_quote(lpxmlescape(getname(a)))+"[\"']?[^>]*>","i"),e=e.exec(h),!e))return"";for(var p=h.indexOf(e[0]),e=0,t=1001<p?p-1001:0,p=p-1;p>=t;p--){var y=h.charAt(p);if(">"==y){if(0>=e){f=f.replace(/&nbsp;/," ");f=strip(f);if(2<f.length)return f;f=""}e++}else"<"==
y?0<e&&e--:0>=e&&(f=y+f)}f=f.replace(/&nbsp;/," ");f=strip(f);2<f.length||(f="");return f}function lpGetTextBeforeFormField_orig(d){if(""==getname(d))return"";for(var a=d,f="",h=0;10>h&&a.parentNode;h++){var a=a.parentNode,f=strip(lpGetText(a,d)),e=200;try{"undefined"!=typeof lp_formfill_tld&&"lifelock.com"==lp_formfill_tld&&(e=150)}catch(p){}if(f.length>e)return innerHTMLParse(a,d);if(2<=f.length)break}return f}
function check_size_or_maxlen(d,a,f,h,e){if("ssn1"==a||"ssn2"==a||"ssn3"==a||"ccnum1"==a||"ccnum2"==a||"ccnum3"==a||"ccnum4"==a||"phone1"==a||"phone2"==a||"phone3"==a||"phone23"==a||"evephone1"==a||"evephone2"==a||"evephone3"==a||"evephone23"==a||"mobilephone1"==a||"mobilephone2"==a||"mobilephone3"==a||"mobilephone23"==a||"fax1"==a||"fax2"==a||"fax3"==a||"fax23"==a||"zip1"==a||"zip2"==a||"amexccnum2"==a||"amexccnum3"==a){if("undefined"==typeof h||"undefined"==typeof e)e=h=0,"undefined"!=typeof d.size&&
(h=parseInt(d.size)),"undefined"!=typeof d.maxLength&&(e=parseInt(d.maxLength)),0>=h&&(0>=e&&d.style)&&(d=d.style.width,d.match(/^\d+px$/)&&(d=parseInt(d.substring(0,d.length-2)),0==d%10&&(h=d/10)));"ssn2"==a?a=d=2:"ssn1"==a||"phone1"==a||"phone2"==a||"fax1"==a||"fax2"==a||"evephone1"==a||"evephone2"==a||"mobilephone1"==a||"mobilephone2"==a?a=d=3:"zip1"==a?(a=5,d=2):"phone23"==a||"fax23"==a||"evephone23"==a||"mobilephone23"==a?(a=8,d=7):"ccnum4"==a||"zip2"==a?(a=4,d=3):"amexccnum2"==a?a=d=6:"amexccnum3"==
a?a=d=5:"phone3"==a||"fax3"==a||"mobilephone3"==a||"evephone3"==a?(a=5,d=4):a=d=4;if((0>=h||h>a)&&(0>=e||e>a)||f&&0<e&&e<d)return!1}return!0}var g_allowtruncate=!0;
function lpFillFormField(d,a,f,h,e,p,t,y,u){(t="undefined"!=typeof t?t:!1)&&(g_allowtruncate=!1);try{e&&0==f.indexOf("cc")&&(h=e);e=null;if(h)for(var c=0;c<lpformfills.length;c++){if(lpformfills[c].ffid==h){e=lpformfills[c];break}}else t?t&&(e=y):e=lpformfills[0];if(e&&!a.readOnly&&!a.disabled){d&&(d.formfillffid=h);h=y=0;"undefined"!=typeof a.size&&(y=parseInt(a.size));"undefined"!=typeof a.maxLength&&(h=parseInt(a.maxLength));check_size_or_maxlen(a,f)||(f=f.replace(/\d+$/,""));var L=a.value;if(0==
f.indexOf("customfield")){var H=parseInt(f.substring(11));e.customfields.length>H&&lpSetValue(d,a,lpdec(e.customfields[H].value))}var A="select-one"==a.type&&(a.options[0].value.match(/^\d{4}$/)||1<a.options.length&&a.options[1].value.match(/^\d{4}$/));"birthmonth"==f&&"select-one"==a.type&&28<=a.options.length?f=A?"birthyear":"birthday":"birthday"==f&&"select-one"==a.type&&28>a.options.length?f="birthmonth":"birthday"==f&&"select-one"==a.type&&A?f="birthyear":"birthyear"==f&&"select-one"==a.type&&
0<a.options.length&&a.options[0].value.match(/^\d$/)&&0!=a.options[0].value?f="birthday":"birthyear"==f&&("select-one"==a.type&&35>a.options.length)&&(f=12<a.options.length?"birthday":"birthmonth");if("ccexpmonth"==f&&"select-one"==a.type&&0<a.options.length&&(a.options[a.options.length-1].value.match(/^\d{4}$/)||a.options[a.options.length-1].text.match(/^\d{4}$/)))f="ccexpyear";if("cctype"==f&&"select-one"==a.type&&100<=a.options.length)for(c=0;c<a.options.length;c++)if("US"==a.options[c].value||
"USA"==a.options[c].value){f="country";break}if(t){c={title:1,name:1,firstname:1,middlename:1,middleinitial:1,lastname:1,username:1,maiden:1,birthdate:1,birthday:1,birthmonth:1,birthyear:1,age:1,ssn:1,ssn1:1,ssn2:1,ssn3:1,company:1,addrbookname:1,address:1,address1:1,address2:1,address3:1,city:1,housenumbername:1,housenumber:1,housename:1,county:1,state:1,zip:1,zip1:1,zip2:1,country:1,phone:1,phone1:1,phone2:1,phone3:1,phone23:1,phoneext:1,fax:1,fax1:1,fax2:1,fax3:1,fax23:1,evephone:1,evephone1:1,
evephone2:1,evephone3:1,evephone23:1,mobilephone:1,mobilephone1:1,mobilephone2:1,mobilephone3:1,mobilephone23:1,ccname:1,ccnum:1,ccnum1:1,ccnum2:1,ccnum3:1,ccnum4:1,ccstart:1,ccstartmonth:1,ccstartyear:1,ccexp:1,ccexpmonth:1,ccexpyear:1,cccsc:1,ccissuenum:1,cctype:1,ccphone:1,bankname:1,bankacctnum:1,bankroutingnum:1,email:1,emailalert:1,search:1,securityanswer:1,captcha:1,combineddummy:1,comments:1,promocode:1,invoice:1,currpass:1,gender:1,timezone:1};switch(u){case "es-ES":case "es-MX":c.lastname2=
1;break;case "ja-JP":c.mobileemail=1,c.firstname="namestdfirst",c.firstname2="namefurfirst",c.firstname3="nameromfirst",c.lastname="namestdlast",c.lastname2="namefurlast",c.lastname3="nameromlast"}var b="undefined"!=typeof c[f]?1==c[f]?f:c[f]:"UNKNOWN:"+f;lpSetValue(d,a,b)}else switch(f){case "firstname":lpSetValue(d,a,lpdec(e.firstname));break;case "firstname2":lpSetValue(d,a,lpdec(e.firstname2));break;case "firstname3":lpSetValue(d,a,lpdec(e.firstname3));break;case "lastname":lpSetValue(d,a,lpdec(e.lastname));
break;case "lastname2":lpSetValue(d,a,lpdec(e.lastname2));break;case "lastname3":lpSetValue(d,a,lpdec(e.lastname3));break;case "email":lpSetValue(d,a,lpdec(e.email));break;case "mobileemail":lpSetValue(d,a,lpdec(e.mobileemail));break;case "company":lpSetValue(d,a,lpdec(e.company));break;case "address1":lpSetValue(d,a,lpdec(e.address1));break;case "address2":lpSetValue(d,a,lpdec(e.address2),!1,!1,""!=e.address1?!0:!1);break;case "address3":lpSetValue(d,a,lpdec(e.address3),!1,!1,""!=e.address1?!0:!1);
break;case "username":lpSetValue(d,a,lpdec(e.username),!0);break;case "phoneext":lpSetValue(d,a,lpdec(e.phoneext),!1,!1,""!=e.phone);break;case "bankname":lpSetValue(d,a,lpdec(e.bankname));break;case "bankacctnum":lpSetValue(d,a,lpdec(e.bankacctnum));break;case "bankroutingnum":lpSetValue(d,a,lpdec(e.bankroutingnum));break;case "county":lpSetValue(d,a,lpdec(e.county));break;case "ccname":lpSetValue(d,a,lpdec(e.ccname));break;case "ccissuenum":lpSetValue(d,a,lpdec(e.ccissuenum),!0);break;case "fullmobilephone":lpSetValue(d,
a,lpdec(e.mobilephone),!0);break;case "fullevephone":lpSetValue(d,a,lpdec(e.evephone),!0);break;case "fullphone":lpSetValue(d,a,lpdec(e.phone),!0);break;case "fullfax":lpSetValue(d,a,lpdec(e.fax),!0);break;case "securityanswer":lpSetValue(d,a,"");break;case "promocode":lpSetValue(d,a,"undefined"!=typeof LP_to_formfill&&"undefined"!=typeof LP_to_formfill.promocode?LP_to_formfill.promocode:"");break;case "maiden":lpSetValue(d,a,"");break;case "ccphone":lpSetValue(d,a,"");break;case "comments":lpSetValue(d,
a,"");break;case "invoice":lpSetValue(d,a,"");break;case "addrbookname":lpSetValue(d,a,"");break;case "emailalert":lpSetValue(d,a,"");break;case "combineddummy":lpSetValue(d,a,"");break;case "language":b=lpdec(e.profilelanguage);if("select-one"==a.type){if(""==b)break;var b=b.toLowerCase(),m=b.replace("-","_");d=!1;for(c=0;c<a.options.length;c++)if(a.options[c].value.toLowerCase()==b||a.options[c].text.toLowerCase()==b||a.options[c].value.toLowerCase()==m||a.options[c].text.toLowerCase()==m){a.selectedIndex=
c;d=!0;break}if(!d){b=b.substring(0,2);for(c=0;c<a.options.length;c++)if(0==a.options[c].value.toLowerCase().indexOf(b)||0==a.options[c].text.toLowerCase().indexOf(b)){a.selectedIndex=c;break}}}else lpSetValue(d,a,b);break;case "ccfirstname":var C=lpdec(e.ccname);if(""!=C){var Q=C.split(" ");0<Q.length&&lpSetValue(d,a,Q[0])}break;case "ccmiddlename":C=lpdec(e.ccname);""!=C&&(Q=C.split(" "),2<Q.length&&lpSetValue(d,a,Q[1]));break;case "cclastname":C=lpdec(e.ccname);""!=C&&(Q=C.split(" "),1<Q.length&&
lpSetValue(d,a,Q[Q.length-1]));break;case "evephoneext":c="";"undefined"!=typeof e.evephoneext?c=e.evephoneext:"undefined"!=typeof e.eveext&&(c=e.eveext);lpSetValue(d,a,lpdec(c),!1,!1,""!=e.evephone);break;case "faxphoneext":c="";"undefined"!=typeof e.faxphoneext?c=e.faxphoneext:"undefined"!=typeof e.faxext&&(c=e.faxext);lpSetValue(d,a,lpdec(c),!1,!1,""!=e.fax);break;case "mobilephoneext":c="";"undefined"!=typeof e.mobilephoneext?c=e.mobilephoneext:"undefined"!=typeof e.mobileext&&(c=e.mobileext);
lpSetValue(d,a,lpdec(c),!1,!1,""!=e.mobilephone);break;case "timezone":b=lpdec(e.timezone);if("select-one"==a.type){if(""==b)break;var E=b.match(/^([-+]?\d{2}):(\d{2}),(\d)$/);if(E){var G=parseInt(E[1]),U=parseInt(E[2]);parseInt(E[3]);var m=G+U/60,B="GMT\\s*"+(0>G?"-":"\\+")+"\\s*"+(10>Math.abs(G)?"0?":"")+Math.abs(G);0!=U&&(B+=":"+U);for(var X=RegExp(B),c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].text==b||a.options[c].value==m||a.options[c].text==m||X.exec(a.options[c].value)||
X.exec(a.options[c].text)){a.selectedIndex=c;break}}}else lpSetValue(d,a,b);break;case "ccnum":c=!1;if(4==h||3==h)c=!0;if(!c){var $=lpdec(e.ccnum);lpSetValue(d,a,$);break}case "cccsc":lpSetValue(d,a,lpdec(e.cccsc),!0);break;case "zip":b=lpdec(e.zip);b.match(/^\d{5}-?(?:\d{4})?$/)?0<h&&h<b.length&&(b=9==h&&10==b.length?b.substring(0,5)+b.substring(6,10):4==h?9<=b.length?b.substring(b.length-4):"":b.substring(0,5)):0<h&&h<b.length&&(b=b.replace(/[^A-Za-z0-9]/g,""));lpSetValue(d,a,b);break;case "city":b=
lpdec(e.city);if("select-one"==a.type){if(""==b)break;b=b.toLowerCase();for(c=0;c<a.options.length;c++)if(a.options[c].value.toLowerCase()==b||a.options[c].text.toLowerCase()==b){a.selectedIndex=c;break}}else lpSetValue(d,a,b);break;case "ssn":var F=lpdec(e.ssn);if(4==h){var k=F.replace(/\D/g,"");if(9==k.length)F=k.substring(5,9);else break}else 0<h&&11>h&&(F=F.replace(/-/g,""));lpSetValue(d,a,F);break;case "name":b=lpdec(e.firstname)+(""!=e.firstname&&""!=e.lastname?" ":"")+lpdec(e.lastname);lpSetValue(d,
a,b);break;case "fulllastname":b=lpdec(e.lastname)+(""!=e.lastname&&""!=e.lastname2?" ":"")+lpdec(e.lastname2);lpSetValue(d,a,b);break;case "ssn1":F=lpdec(e.ssn);k=F.replace(/\D/g,"");9==k.length&&(b=k.substring(0,3),lpSetValue(d,a,b));break;case "ssn2":F=lpdec(e.ssn);k=F.replace(/\D/g,"");9==k.length&&(b=k.substring(3,5),lpSetValue(d,a,b));break;case "ssn3":F=lpdec(e.ssn);k=F.replace(/\D/g,"");9==k.length&&(b=k.substring(5,9),lpSetValue(d,a,b));break;case "birthmonth":if(""==e.birthday)break;b=lpdec(e.birthday).substring(5,
7);if("select-one"==a.type){m=b;"0"==m.charAt(0)&&(m=m.substring(1));for(var B=lpgs("month"+m,p).toLowerCase(),v=lpgs("mon"+m,p).toLowerCase(),c=0;c<a.options.length;c++)if(-1!=a.options[c].value.toLowerCase().indexOf(B)||-1!=a.options[c].value.toLowerCase().indexOf(v)||-1!=a.options[c].text.toLowerCase().indexOf(B)||-1!=a.options[c].text.toLowerCase().indexOf(v)){a.selectedIndex=c;break}if(c==a.options.length)for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].text==
b||a.options[c].text==m){a.selectedIndex=c;break}}else lpSetValue(d,a,b);break;case "birthday":if(""==e.birthday)break;b=lpdec(e.birthday).substring(8,10);if("select-one"==a.type){m=b;"0"==m.charAt(0)&&(m=m.substring(1));for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].text==b||a.options[c].text==m){a.selectedIndex=c;break}}else lpSetValue(d,a,b);break;case "birthyear":if(""==e.birthday)break;var n=lpdec(e.birthday),b=n.substring(0,4),m=n.substring(2,4);
if("select-one"==a.type)for(c=0;c<a.options.length;c++){if(a.options[c].value==b||a.options[c].value==m||a.options[c].text==b||a.options[c].text==m){a.selectedIndex=c;break}}else 2==h&&(b=m),lpSetValue(d,a,b);break;case "birthdate":n=lpdec(e.birthday);e&&lpdec(e.country);4<=n.length&&(n=4==h?n.substring(0,4):2==h?n.substring(2,4):"US"==lpdec(e.country)?n.substring(5,7)+"/"+n.substring(8,10)+"/"+n.substring(0,4):n.substring(8,10)+"/"+n.substring(5,7)+"/"+n.substring(0,4),lpSetValue(d,a,n));break;case "address":case "fulladdress":var N=
"textarea"==a.type?"\n":" ",D=[e.address1,e.address2,e.address3];"fulladdress"==f&&(D[D.length]=e.city,D[D.length]=e.county,D[D.length]=e.state);b="";for(c=0;c<D.length;c++)""!=D[c]&&(b+=(""!=b?N:"")+lpdec(D[c]));lpSetValue(d,a,b);break;case "title":b=lpdec(e.title);if("select-one"==a.type){if(""==b)break;E=d="";for(c=0;c<a.options.length;c++)if(a.options[c].value.toLowerCase()==b||-1!=a.options[c].value.toLowerCase().indexOf(b)||a.options[c].text.toLowerCase()==b||-1!=a.options[c].text.toLowerCase().indexOf(b)){if(!(""==
d&&""==E))if(a.options[c].value.length<=d.length&&a.options[c].text.length<=E.length){if(!(a.options[c].value.length<d.length||a.options[c].text.length<E.length))continue}else continue;d=a.options[c].value;E=a.options[c].text;a.selectedIndex=c}}else b=b.substring(0,1).toUpperCase()+b.substring(1),lpSetValue(d,a,b);break;case "state":b=lpdec(e.state);if("select-one"==a.type){b=b.toLowerCase();if(""==b)break;m=lpdec(e.state_name).toLowerCase();for(c=0;c<a.options.length;c++)if(a.options[c].value.toLowerCase()==
b||a.options[c].value.toLowerCase()==m||a.options[c].text.toLowerCase()==b||a.options[c].text.toLowerCase()==m){a.selectedIndex=c;break}if(c==a.options.length){for(c=0;c<a.options.length;c++)if(-1!=a.options[c].value.toLowerCase().indexOf(m)||-1!=a.options[c].text.toLowerCase().indexOf(m)){a.selectedIndex=c;break}if(c==a.options.length){for(c=0;c<a.options.length;c++)if(-1!=a.options[c].value.toLowerCase().indexOf(b)||-1!=a.options[c].text.toLowerCase().indexOf(b)){a.selectedIndex=c;break}if(c==a.options.length&&
2==b.length){B=b.charAt(0)+"."+b.charAt(1)+".";for(c=0;c<a.options.length;c++)if(-1!=a.options[c].value.toLowerCase().indexOf(B)||-1!=a.options[c].text.toLowerCase().indexOf(B)){a.selectedIndex=c;break}}}}}else lpSetValue(d,a,b);break;case "country":b=lpdec(e.country_name);if("select-one"==a.type){var b=b.toLowerCase(),m=lpdec(e.country).toLowerCase(),B=lpdec(e.country_cc3l).toLowerCase(),v="usa"==B?"United States of America":"",Z="undefined"!=typeof e.country2?lpdec(e.country2).toLowerCase():"";
if(""==b&&""==m&&""==B&&""==Z)break;for(c=0;c<a.options.length;c++)if(""!=a.options[c].value&&(a.options[c].value.toLowerCase()==b||a.options[c].value.toLowerCase()==m||a.options[c].value.toLowerCase()==B||a.options[c].value.toLowerCase()==v||a.options[c].value.toLowerCase()==Z||a.options[c].text.toLowerCase()==b||a.options[c].text.toLowerCase()==m||a.options[c].text.toLowerCase()==B||a.options[c].text.toLowerCase()==v||a.options[c].text.toLowerCase()==Z)){a.selectedIndex=c;break}}else 3==h?lpSetValue(d,
a,lpdec(e.country_cc3l)):2==h?lpSetValue(d,a,lpdec(e.country)):lpSetValue(d,a,b);break;case "cctype":b=lpGetCCType(lpdec(e.ccnum));if("UNK"!=b)if("select-one"==a.type){d=-1;for(c=0;c<a.options.length;c++){var Y=a.options[c].value.toUpperCase(),w=a.options[c].text.toUpperCase();if(Y==b||w==b){a.selectedIndex=c;break}if(CCTypeMatch(b,Y)||CCTypeMatch(b,w))d=c}c==a.options.length&&-1!=d&&(a.selectedIndex=d)}else if("radio"==a.type){Y=a.value.toUpperCase();w=a.id.toUpperCase();d=!1;if(CCTypeMatch(b,Y)||
CCTypeMatch(b,w))d=!0;if(!d){var I=a.parentNode;if(I&&I.childNodes){for(c=0;c<I.childNodes.length&&I.childNodes[c]!=a;c++);if(c<I.childNodes.length-1){var j=I.childNodes[c+1];if(3==j.nodeType&&CCTypeMatch(b,j.nodeValue))d=!0;else if(3==j.nodeType&&c<I.childNodes.length-2||1==j.nodeType){var M=1==j.nodeType?I.childNodes[c+1]:I.childNodes[c+2];if(1==M.nodeType&&"LABEL"==M.tagName&&M.htmlFor==a.id){var z=lpGetText(M,a);CCTypeMatch(b,z)&&(d=!0)}else 1==M.nodeType&&("IMG"==M.tagName&&"string"==typeof M.alt)&&
(z=M.alt,CCTypeMatch(b,z)&&(d=!0))}}}}d&&(a.checked=!0,a.click())}else lpSetValue(d,a,b);break;case "ccexpmonth":if(""==e.ccexp)break;b=lpdec(e.ccexp).substring(5,7);if("select-one"==a.type){m=b;"0"==m.charAt(0)&&(m=m.substring(1));B=lpgs("month"+m,p).toLowerCase();v=lpgs("mon"+m,p).toLowerCase();for(c=0;c<a.options.length;c++)if(-1!=a.options[c].value.toLowerCase().indexOf(B)||-1!=a.options[c].value.toLowerCase().indexOf(v)||-1!=a.options[c].text.toLowerCase().indexOf(B)||-1!=a.options[c].text.toLowerCase().indexOf(v)){a.selectedIndex=
c;break}if(c==a.options.length)for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].text==b||a.options[c].text==m){a.selectedIndex=c;break}}else lpSetValue(d,a,b);break;case "ccexpyear":if(""==e.ccexp)break;var x=lpdec(e.ccexp),b=x.substring(0,4);if("select-one"==a.type){m=x.substring(2,4);for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].text==b||a.options[c].text==m){a.selectedIndex=c;break}}else lpSetValue(d,a,b,
!1,!0);break;case "ccexp":x=lpdec(e.ccexp);b=10==x.length?x.substring(5,7)+"/"+x.substring(2,4):"";if("select-one"==a.type){if(""==b)break;m=10==x.length?x.substring(5,7)+"/"+x.substring(0,4):"";B=10==x.length?x.substring(5,7)+x.substring(2,4):"";v=10==x.length?x.substring(5,7)+x.substring(0,4):"";for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].value==B||a.options[c].value==v||a.options[c].text==b||a.options[c].text==m||a.options[c].text==B||a.options[c].text==
v){a.selectedIndex=c;break}}else 10==x.length&&4==h&&(b=x.substring(5,7)+x.substring(2,4)),lpSetValue(d,a,b);break;case "ccstartmonth":if(""==e.ccstart)break;b=lpdec(e.ccstart).substring(5,7);if("select-one"==a.type){m=b;"0"==m.charAt(0)&&(m=m.substring(1));B=lpgs("month"+m,p).toLowerCase();v=lpgs("mon"+m,p).toLowerCase();for(c=0;c<a.options.length;c++)if(-1!=a.options[c].value.toLowerCase().indexOf(B)||-1!=a.options[c].value.toLowerCase().indexOf(v)||-1!=a.options[c].text.toLowerCase().indexOf(B)||
-1!=a.options[c].text.toLowerCase().indexOf(v)){a.selectedIndex=c;break}if(c==a.options.length)for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].text==b||a.options[c].text==m){a.selectedIndex=c;break}}else lpSetValue(d,a,b);break;case "ccstartyear":if(""==e.ccstart)break;var s=lpdec(e.ccstart),b=s.substring(0,4);if("select-one"==a.type){m=s.substring(2,4);for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].text==b||
a.options[c].text==m){a.selectedIndex=c;break}}else lpSetValue(d,a,b,!1,!0);break;case "ccstart":s=lpdec(e.ccstart);b=10==s.length?s.substring(5,7)+"/"+s.substring(2,4):"";if("select-one"==a.type){if(""==b)break;m=10==s.length?s.substring(5,7)+"/"+s.substring(0,4):"";B=10==s.length?s.substring(5,7)+s.substring(2,4):"";v=10==s.length?s.substring(5,7)+s.substring(0,4):"";for(c=0;c<a.options.length;c++)if(a.options[c].value==b||a.options[c].value==m||a.options[c].value==B||a.options[c].value==v||a.options[c].text==
b||a.options[c].text==m||a.options[c].text==B||a.options[c].text==v){a.selectedIndex=c;break}}else 10==s.length&&4==h&&(b=s.substring(5,7)+s.substring(2,4)),lpSetValue(d,a,b);break;case "ccnum1":b=lpdec(e.ccnum).substring(0,4);lpSetValue(d,a,b);break;case "ccnum2":b=lpdec(e.ccnum).substring(4,8);lpSetValue(d,a,b);break;case "ccnum3":b=lpdec(e.ccnum).substring(8,12);lpSetValue(d,a,b);break;case "ccnum4":b=lpdec(e.ccnum).substring(12);lpSetValue(d,a,b);break;case "amexccnum2":b=lpdec(e.ccnum).substring(4,
10);lpSetValue(d,a,b);break;case "amexccnum3":b=lpdec(e.ccnum).substring(10,15);lpSetValue(d,a,b);break;case "middlename":var b=lpdec(e.middlename),O=b.substring(0,1);1==h||2==h?lpSetValue(d,a,O):lpSetValue(d,a,b);break;case "middleinitial":b=lpdec(e.middlename).substring(0,1);lpSetValue(d,a,b);break;case "mobilephone1":case "mobilephone2":case "mobilephone3":case "evephone1":case "evephone2":case "evephone3":case "phone1":case "phone2":case "phone3":case "fax1":case "fax2":case "fax3":var r=f.substring(0,
f.length-1),l=f.substring(f.length-1),g=e.phone;"evephone"==r&&(g=e.evephone);"mobilephone"==r&&(g=e.mobilephone);"fax"==r&&(g=e.fax);b=lpdec(g);3>=b.length&&(b="");k=b.replace(/\D/g,"");10==k.length&&("2"<=k.charAt(0)&&"2"<=k.charAt(3))&&(k="1"+k);if(11==k.length&&"1"==k.charAt(0)&&"2"<=k.charAt(1)&&"2"<=k.charAt(4))switch(l){case "1":lpSetValue(d,a,k.substring(1,4));break;case "2":lpSetValue(d,a,k.substring(4,7));break;case "3":lpSetValue(d,a,k.substring(7,11))}else lpSetValue(d,a,b,!0);break;case "mobilephone23":case "evephone23":case "phone23":case "fax23":r=
f.substring(0,f.length-2);g=e.phone;"evephone"==r&&(g=e.evephone);"fax"==r&&(g=e.fax);"mobilephone"==r&&(g=e.mobilephone);b=lpdec(g);3>=b.length&&(b="");k=b.replace(/\D/g,"");10==k.length&&("2"<=k.charAt(0)&&"2"<=k.charAt(3))&&(k="1"+k);11==k.length&&"1"==k.charAt(0)&&"2"<=k.charAt(1)&&"2"<=k.charAt(4)?(c=(0>=y||8<=y)&&(0>=h||8<=h)?!0:!1,lpSetValue(d,a,k.substring(4,7)+(c?"-":"")+k.substring(7,11))):lpSetValue(d,a,b,!0);break;case "mobilephone":case "evephone":case "phone":case "fax":var r=f,g=e.phone,
V="undefined"!=typeof e.countryphone?e.countryphone:"undefined"!=typeof e.phone3lcc?e.phone3lcc:"";"evephone"==r&&(g=e.evephone,V="undefined"!=typeof e.countryevephone?e.countryevephone:"undefined"!=typeof e.evephone3lcc?e.evephone3lcc:"");"fax"==r&&(g=e.fax,V="undefined"!=typeof e.countryfaxphone?e.countryfaxphone:"undefined"!=typeof e.fax3lcc?e.fax3lcc:"");"mobilephone"==r&&(g=e.mobilephone,V="undefined"!=typeof e.countrymobphone?e.countrymobphone:"undefined"!=typeof e.mobilephone3lcc?e.mobilephone3lcc:
"");b=lpdec(g);3>=b.length&&(b="");if(11==b.length&&b.match(/^\d+$/)&&"1"==b.charAt(0)&&"2"<=b.charAt(1)&&"2"<=b.charAt(4)){if(b=b.substring(1),0>=h||12<=h)b=b.substring(0,3)+"-"+b.substring(3,6)+"-"+b.substring(6,10)}else if(2<=b.length){var aa=lpdec(V),W=get_phone_code(aa);W&&(0==b.indexOf(W)&&"0"==b.charAt(W.length))&&(b=b.substring(W.length))}lpSetValue(d,a,b,!0);break;case "mobilephonecc":case "evephonecc":case "phonecc":case "faxcc":r=f.substring(0,f.length-2);g=e.phone;V="undefined"!=typeof e.countryphone?
e.countryphone:"undefined"!=typeof e.phone3lcc?e.phone3lcc:"";"evephone"==r&&(g=e.evephone,V="undefined"!=typeof e.countryevephone?e.countryevephone:"undefined"!=typeof e.evephone3lcc?e.evephone3lcc:"");"fax"==r&&(g=e.fax,V="undefined"!=typeof e.countryfaxphone?e.countryfaxphone:"undefined"!=typeof e.fax3lcc?e.fax3lcc:"");"mobilephone"==r&&(g=e.mobilephone,V="undefined"!=typeof e.countrymobphone?e.countrymobphone:"undefined"!=typeof e.mobilephone3lcc?e.mobilephone3lcc:"");b=lpdec(g);aa=lpdec(V);(W=
get_phone_code(aa))&&0==b.indexOf(W)&&lpSetValue(d,a,W,!0);break;case "zip1":b=lpdec(e.zip);k=b.replace(/\D/g,"");if(5==k.length||9==k.length)b=k.substring(0,5);else if("ja-JP"==p&&7==k.length)b=k.substring(0,3);else{var R=b.replace(/[^A-Za-z0-9]/g,"");R.match(/^(?:[A-Za-z]\d){3}$/)?b=R.substring(0,3):R.match(/^[A-Za-z]{1,2}\d[A-Za-z0-9]?\d[A-Za-z]{2}$/)?b=R.substring(0,R.length-3):R.length<b.length&&(Q=b.split(/[^A-Za-z0-9]+/),b=Q[0])}lpSetValue(d,a,b);break;case "zip2":b=lpdec(e.zip);k=b.replace(/\D/g,
"");c=!1;5==k.length?(b="",c=!0):9==k.length?b=k.substring(5,9):"ja-JP"==p&&7==k.length?b=k.substring(3,7):(R=b.replace(/[^A-Za-z0-9]/g,""),R.match(/^(?:[A-Za-z]\d){3}$/)?b=R.substring(3,6):R.match(/^[A-Za-z]{1,2}\d[A-Za-z0-9]?\d[A-Za-z]{2}$/)?b=R.substring(R.length-3):R.length<b.length&&(Q=b.split(/[^A-Za-z0-9]+/),b=Q[1]));lpSetValue(d,a,b,!1,!1,c);break;case "gender":b=lpdec(e.gender).toUpperCase();if(""!=b)if(m=b,"M"==b&&(m=lpgs("Male",p)),"F"==b&&(m=lpgs("Female",p)),m=m.toUpperCase(),"select-one"==
a.type)for(c=0;c<a.options.length;c++){var ba=lptrim(a.options[c].text).toUpperCase(),q=lptrim(a.options[c].value).toUpperCase();if(0==q.indexOf(b)||0==ba.indexOf(b)||0==q.indexOf(m)||0==ba.indexOf(m)){a.selectedIndex=c;break}}else if("radio"==a.type||"checkbox"==a.type)if(q="",q=null!=a.value?lptrim(a.value).toUpperCase():lpGetTextBeforeFormField(a).toUpperCase(),0==q.indexOf(b)||0==q.indexOf(m))a.checked=!0;else{if((I=a.parentNode)&&I.childNodes){for(c=0;c<I.childNodes.length&&I.childNodes[c]!=
a;c++);if(c<I.childNodes.length-1)if(j=I.childNodes[c+1],d="",null!=j.nodeValue&&(d=lptrim(j.nodeValue).toUpperCase()),3==j.nodeType&&0==d.indexOf(b)||0==d.indexOf(m))a.checked=!0;else if(3==j.nodeType&&c<I.childNodes.length-2||1==j.nodeType)if(M=1==j.nodeType?I.childNodes[c+1]:I.childNodes[c+2],1==M.nodeType&&"LABEL"==M.tagName&&M.htmlFor==a.id){var z=lpGetText(M,a),J=lptrim(z).toUpperCase();if(0==J.indexOf(b)||0==J.indexOf(m))a.checked=!0}else if(1==M.nodeType&&"IMG"==M.tagName&&"string"==typeof M.alt){var z=
M.alt,T=lptrim(z).toUpperCase();if(0==T.indexOf(b)||0==T.indexOf(m))a.checked=!0}}}else lpSetValue(d,a,b);break;case "age":var P=lpdec(e.birthday);if(""!=P){var S=parseInt(P.substring(0,4)),K=parseInt(P.substring(5,7)),n=parseInt(P.substring(8,10)),ca=new Date,da=ca.getFullYear(),ga=ca.getMonth()+1,fa=ca.getDate(),b=da-S;(ga<K||ga==K&&fa<n)&&b--;if("select-one"==a.type)for(c=0;c<a.options.length;c++){var ha=a.options[c].text;e=d=-1;if(E=ha.match(/(\d+)\D+(\d+)/))d=parseInt(E[1]),e=parseInt(E[2]);
else if(E=ha.match(/^\d+/)){var ea=parseInt(E[0]);c<a.options.length/2?(d=0,e=ea):(d=ea,e=99999)}else if(E=ha.match(/\d+$/))ea=parseInt(E[0]),c<a.options.length/2?(d=0,e=ea-1):(d=ea+1,e=99999);if(-1!=d&&-1!=e&&b>=d&&b<=e){a.selectedIndex=c;break}}else lpSetValue(d,a,b)}break;case "housenumber":b=lpdec(e.address1),"undefined"!=typeof e.housenumber&&""!=e.housenumber&&(b=lpdec(e.housenumber));case "housenumbername":if("undefined"==typeof b&&(b="undefined"!=typeof e.housenumbername&&""!=e.housenumbername?
lpdec(e.housenumbername):lpdec(e.address1)),E=b.match(/^\d+/),E||(b=lpdec(e.address2),E=b.match(/^\d+/)),E||(b=lpdec(e.address3),E=b.match(/^\d+/)),E){lpSetValue(d,a,E[0]);break}else if("housenumber"==f)break;case "housename":b=lpdec(e.address1),"undefined"!=typeof e.housename&&""!=e.housename&&(b=lpdec(e.housename)),b=b.replace(/^\d+\s*/,""),lpSetValue(d,a,b)}a.value!=L&&fire_onchange(a)}}catch(ia){lpReportError("Failure with filling form field: "+ia+" ln: "+ia.lineNumber)}}
function lpGetCCType(d){var a="UNK";if(("34"==d.substring(0,2)||"37"==d.substring(0,2))&&15==d.length)a="AMEX";else if(("6011"==d.substring(0,4)||"65"==d.substring(0,2))&&16==d.length)a="DISC";else if(("51"==d.substring(0,2)||"52"==d.substring(0,2)||"53"==d.substring(0,2)||"54"==d.substring(0,2)||"55"==d.substring(0,2))&&16==d.length)a="MC";else if(("417500"==d.substring(0,6)||"4917"==d.substring(0,4)||"4913"==d.substring(0,4)||"4508"==d.substring(0,4)||"4844"==d.substring(0,4))&&16==d.length)a="ELECTRON";
else if("4"==d.substring(0,1)&&16==d.length)a="VISA";else if(("5018"==d.substring(0,4)||"5020"==d.substring(0,4)||"5038"==d.substring(0,4)||"6304"==d.substring(0,4)||"6759"==d.substring(0,4)||"6761"==d.substring(0,4))&&12<=d.length&&19>=d.length)a="MAESTRO";else if(("6334"==d.substring(0,4)||"6767"==d.substring(0,4))&&(16==d.length||18==d.length||19==d.length))a="SOLO";return a}
function CCTypeMatch(d,a){d=d.toUpperCase();a=a.toUpperCase();if("AMEX"==d&&-1!=a.indexOf("BANAMEX"))return!1;if(-1!=a.indexOf(d))return!0;switch(d){case "AMEX":return-1!=a.indexOf("AMERICAN")||-1!=a.indexOf("AMX")||"AX"==a;case "DISC":return-1!=a.indexOf("DIS")||"DI"==a;case "MC":return-1!=a.indexOf("MASTER");case "VISA":return-1!=a.indexOf("VSA")||"VI"==a;default:return!1}}
function lpSetValue(d,a,f,h,e,p){if(""!=f||p){if("undefined"!=typeof a.maxLength&&g_allowtruncate&&(p=parseInt(a.maxLength),0<p&&f.length>p)){if(h)return;f=e?f.substring(f.length-p):f.substring(0,p)}if(d){if("undefined"==typeof d.formfillfields||null==d.formfillfields)d.formfillfields=[];d.formfillfields[getname(a)]=f}a.value=f}}var lpgettext_abort=!1;
function lpGetText(d,a,f,h){f||(lpgettext_abort=!1);if(d==a)return lpgettext_abort=!0,"";if(3==d.nodeType)return 2<strip(d.nodeValue).length?d.nodeValue:"";f=[];var e=0,p="string"==typeof d.tagName?d.tagName:"";if(d.lp_too_many)return"";var t=d&&d.style&&!lpIsVisible(d,!0);h=!1;"LABEL"==p&&(h=!0);e=0;if("OPTION"!=p&&"SCRIPT"!=p&&"TEXTAREA"!=p&&!t)for(;"undefined"!=typeof d.childNodes[e];){f[f.length]=lpGetText(d.childNodes[e],a,!0,h);if(lpgettext_abort)break;if(50<e++)return d.lp_too_many=1,""}d=
"|";"undefined"!=typeof h&&h&&(d="");return f.join(d)}
function get_phone_code(d){var a=[];a.AND=376;a.ARE=971;a.AFG=93;a.ATG=1;a.AIA=1;a.ALB=355;a.ARM=374;a.ANT=599;a.AGO=244;a.ATA=672;a.ARG=54;a.ASM=1;a.AUT=43;a.AUS=61;a.ABW=297;a.ALA=358;a.AZE=994;a.BIH=387;a.BRB=1;a.BGD=880;a.BEL=32;a.BFA=226;a.BGR=359;a.BHR=973;a.BDI=257;a.BEN=229;a.BLM=590;a.BMU=1;a.BRN=673;a.BOL=591;a.BRA=55;a.BHS=1;a.BTN=975;a.BVT=47;a.BWA=267;a.BLR=375;a.BLZ=501;a.CAN=1;a.CCK=61;a.COD=243;a.CAF=236;a.COG=242;a.CHE=41;a.CIV=225;a.COK=682;a.CHL=56;a.CMR=237;a.CHN=86;a.COL=57;a.CRI=
506;a.CUB=53;a.CPV=238;a.CXR=61;a.CYP=357;a.CZE=420;a.DEU=49;a.DJI=253;a.DNK=45;a.DMA=1;a.DOM=1;a.DZA=213;a.ECU=593;a.EST=372;a.EGY=20;a.ESH=212;a.ERI=291;a.ESP=34;a.ETH=251;a.FIN=358;a.FJI=679;a.FLK=500;a.FSM=691;a.FRO=298;a.FRA=33;a.GAB=241;a.GBR=44;a.GRD=1;a.GEO=995;a.GUF=594;a.GGY=44;a.GHA=233;a.GIB=350;a.GRL=299;a.GMB=220;a.GIN=224;a.GLP=590;a.GNQ=240;a.GRC=30;a.SGS=995;a.GTM=502;a.GUM=1;a.GNB=245;a.GUY=592;a.HKG=852;a.HMD=672;a.HND=504;a.HRV=385;a.HTI=509;a.HUN=36;a.ESC=34;a.IDN=62;a.IRL=353;
a.ISR=972;a.IMM=44;a.IND=91;a.IOT=246;a.IRQ=964;a.IRN=98;a.ISL=354;a.ITA=39;a.JEY=44;a.JAM=1;a.JOR=962;a.JPN=81;a.KEN=254;a.KGZ=996;a.KHM=855;a.KIR=686;a.COM=269;a.KNA=1;a.PRK=850;a.KOR=82;a.KWT=965;a.CYM=1;a.KAZ=7;a.LAO=856;a.LBN=961;a.LCA=1;a.LIE=423;a.LKA=94;a.LBR=231;a.LSO=266;a.LTU=370;a.LUX=352;a.LVA=371;a.LBY=218;a.MAR=212;a.MCO=377;a.MDA=373;a.MNE=382;a.MAF=590;a.MDG=261;a.MHL=692;a.MKD=389;a.MLI=223;a.MMR=95;a.MNG=976;a.MAC=853;a.MNP=1;a.MTQ=596;a.MRT=222;a.MSR=1;a.MLT=356;a.MUS=230;a.MDV=
960;a.MWI=265;a.MEX=52;a.MYS=60;a.MOZ=258;a.NAM=264;a.NCL=687;a.NER=227;a.NFK=672;a.NGA=234;a.NIC=505;a.NLD=31;a.NOR=47;a.NPL=977;a.NRU=674;a.NIU=683;a.NZL=64;a.OMN=968;a.PAN=507;a.PER=51;a.PYF=689;a.PNG=675;a.PHL=63;a.PAK=92;a.POL=48;a.SPM=508;a.PCN=872;a.PRI=1;a.PSE=970;a.PRT=351;a.PLW=680;a.PRY=595;a.QAT=974;a.REU=262;a.ROU=40;a.SRB=381;a.RUS=7;a.RWA=250;a.SAU=966;a.SLB=677;a.SYC=248;a.SDN=249;a.SWE=46;a.SGP=65;a.SHN=290;a.SVN=386;a.SJM=47;a.SVK=421;a.SLE=232;a.SMR=378;a.SEN=221;a.SOM=252;a.SUR=
597;a.STP=239;a.SLV=503;a.SYR=963;a.SWZ=268;a.TCA=1;a.TCD=235;a.ATF=596;a.TGO=228;a.THA=66;a.TJK=992;a.TKL=690;a.TLS=670;a.TKM=993;a.TUN=216;a.TON=676;a.TUR=90;a.TTO=1;a.TUV=688;a.TWN=886;a.TZA=255;a.UKR=380;a.UGA=256;a.UMI=1;a.USA=1;a.URY=598;a.UZB=998;a.VAT=379;a.VCT=1;a.VEN=58;a.VGB=1;a.VIR=1;a.VNM=84;a.VUT=678;a.WLF=681;a.WSM=685;a.YEM=967;a.MYT=262;a.YUG=381;a.ZAF=27;a.ZMB=260;a.ZWE=263;return"undefined"!=typeof a[d]?""+a[d]:null};function lpReportError(msg, url){console_log(msg);}

function lpgs(s, locale, silent, fallback){

  var cachelocale = (typeof(locale) == 'undefined' || locale == null ? '' : locale);
  if(typeof(lpgscache[cachelocale+s])!='undefined')
    return lpgscache[cachelocale+s];

  if(typeof(lpgslocales[cachelocale])=='undefined' && s.indexOf('ff_')==0){
    ApplyOverrides(cachelocale);

    if(typeof(lpgscache[cachelocale+s])!='undefined')
      return lpgscache[cachelocale+s];
  }

  if (typeof(translations) != 'undefined') { if (typeof(locale) != 'undefined' && locale && typeof(translations[locale]) != 'undefined' && typeof(translations[locale][s]) != 'undefined') { return translations[locale][s]; } if (typeof(translations['en-US']) != 'undefined' && typeof(translations['en-US'][s]) != 'undefined') { return translations['en-US'][s]; } }

  if (typeof(lpgscache['en-US' + s]) != 'undefined') {
    return lpgscache['en-US' + s];
  }

  return s;
}

function lpConfirmYesNo(msg, win){return confirm(msg);}function lpdec(s){return s;}function LP_form_fill() { LP_to_formfill.customfields = new Array(); for (var i = 0; typeof(LP_to_formfill['custom_field' + i]) != 'undefined'; i++) { LP_to_formfill.customfields[i] = LP_to_formfill['custom_field' + i]; } lpformfills = new Array(LP_to_formfill); lpCheckFormFill(null, document, true, false, LP_to_formfill.ffid, 1, window); }if (typeof(lpgenpassforms) == 'undefined') {
  lpgenpassforms = new Array();
}
if (typeof(lpgenpasscurrentpwfields) == 'undefined') {
  lpgenpasscurrentpwfields = new Array();
}

function get_username_val(doc)
{
  // this case is specific to google, where they sometimes already have the username filled in, and store it in a hidden input with name==id==Email
  var username_elt = doc.getElementById('Email');
  return username_elt != null && username_elt.type == 'hidden' && username_elt.name == 'Email' ? username_elt.value : '';
}

function lpCheckGeneratePassword(browser, doc, checkonly, win, recursion_counter)
{
  if (typeof(recursion_counter) == "undefined")
    recursion_counter = 1;
  if (recursion_counter > 10)
    return null;


  lpdbg("checkgenpw","START checkonly="+checkonly);
  var browser2 = typeof(LP) != 'undefined' && typeof(LP.getBrowser().getBrowserForDocument) == 'function' ? LP.getBrowser().getBrowserForDocument(doc) : null;
  if(browser2)
    browser = browser2;
  if(typeof(LP) != 'undefined' && !browser) return null;
  var currenturl = null;
  var singleform = null;

  try {
     // abort if an autologin or generate notification is already present
     if (!checkonly && typeof(lp_notification_exists) != 'undefined' && (lp_notification_exists(browser, 'autologin') || lp_notification_exists(browser, 'generate')))
     {
       lpdbg("checkgenpw","aborting since notification already shown");
       return null;
     }

     //currenturl = LP.lpgetcurrenturl(browser);
     currenturl = doc.location.href;
     if (typeof(punycode) != 'undefined' && typeof(punycode.URLToASCII) != 'undefined') {
       currenturl = punycode.URLToASCII(currenturl);
     }
     var urlparts = lpParseUri(currenturl);
     var canurl = lpcanonizeUrl(currenturl, urlparts);
     var tld = lp_gettld(urlparts.host, currenturl);
     lpdbg("checkgenpw","currenturl="+currenturl);

     //------------------------------------
     //Offer to generate passwords
     if((typeof(lploggedin) == 'undefined' || lploggedin) && (checkonly || ((typeof(lpOfferGeneratePasswd) == 'undefined' || lpOfferGeneratePasswd) && (typeof(never_gen) == 'undefined' || !never_gen(canurl, tld))))){
       // Look for a form with 2 visible contigious password fields
       var forms = doc.getElementsByTagName("form");
       for (var f = 0; f < forms.length; f++)
       {
         if ((typeof(f.offsetLeft)!="undefined" && f.offsetLeft<0) ||
             (typeof(f.offsetTop)!="undefined" && f.offsetTop<0))
           continue;
         
         var fields = lpCountInputFields(forms[f]);
         lpdbg("checkgenpw","checking form#"+f+" numpasswords="+fields["password"]+" numpasswordsvisible="+fields["passwordvisible"]+" passwordscontigious="+fields["passwordsContiguous"]);
         if ((2<=fields["password"]        && fields["password"]<=4) &&
             (2<=fields["passwordvisible"] && fields["passwordvisible"]<=4) &&
             fields["passwordsContiguous"]==true)
         {
           if (!checkonly) {
             var url = typeof(LP) != 'undefined' ? LP.lpgetcurrenturl(browser) : document.location.href;
             if (typeof(punycode) != 'undefined' && typeof(punycode.URLToASCII) != 'undefined') {
               url = punycode.URLToASCII(url);
             }
             lpdbg("genpw", "Adding url to lpgenpassforms: " + url);
             lpgenpassforms[url] = forms[f];

             var generateandfill = false;
             if (typeof(disable_check_form_fill) == 'undefined' || !disable_check_form_fill) {
               generateandfill = lpCheckFormFill(browser, doc, false, true, null, 1, win);
             }
             var fillcurrent = false;

             var currentpwfield = lpCheckCurrentPWField(forms[f]);
             var aids = new Array();
             if (currentpwfield) {
               var username_val = get_username_val(doc);

               fillcurrent = true;
               lpgenpasscurrentpwfields[url] = currentpwfield;
               var pathparts = typeof(urlparts.path) == 'string' ? urlparts.path.split('/') : new Array();
               var tldaccts = typeof(lptlds) != 'undefined' && typeof(lptlds[tld]) != 'undefined' ? lptlds[tld] : new Array();
               for (var i in tldaccts) {
                 if (typeof(lpaccts[i])=="undefined" || lpaccts[i].genpw || lpaccts[i].isbookmark)
                    continue;
                 if (LPAHasValue(lpaccts[i], 1)) {
                   var al = new lpautologininfo();
                   al.realmmatch = false;
                   al.id = lpaccts[i].id;
                   var al_urlparts = lpParseUri(lpaccts[i].url);
                   al.usernamematch = lpaccts[i].unencryptedUsername != '' && lpaccts[i].unencryptedUsername == username_val;
                   al.urlmatch = lpcanonizeUrl(lpaccts[i].url, al_urlparts) == canurl ? true : false;
                   al.servermatch = al_urlparts.host == urlparts.host ? true : false;
                   al.portmatch = compare_ports(al_urlparts, urlparts);
                   al.serverportmatch = al.servermatch && al.portmatch;
                   var al_pathparts = typeof(al_urlparts.path) == 'string' ? al_urlparts.path.split('/') : new Array();
                   var m;
                   for (m = 0; m < pathparts.length && m < al_pathparts.length; m++) {
                     if (al_pathparts[m] != pathparts[m]) {
                       break;
                     }
                   }
                   al.pathlevelmatch = m;
                   al.url = currenturl;
                   al.fieldmatchcount = 0;
                   aids[aids.length] = al;
                 }
               }
               if (typeof(lp_aids_sort_func) != 'undefined') {
                 aids.sort(lp_aids_sort_func);
                 var urlpath = typeof(urlparts.path) == 'string' ? urlparts.path : '';
                 aids = checkurlrules(lpurlrules, aids, tld, urlpath, urlparts.host, lpaccts, get_port(urlparts));
               }
             }

             if (typeof(LP) != 'undefined') {
               LP.lpshowHelpDlg("genpw");
             }
             lpdbg("checkgenpw",generateandfill?"showing generatepassword AND fillforms":"showing generatepassword");

             lp_showNotification("GeneratePassword", browser, aids, "generate", forms[f], null, generateandfill, fillcurrent);

             if(generateandfill) {
               if (browser) {
                 browser.contentDocument.ffidindex = -1;
               } else {
                 document.ffidindex = -1;
               }
             }
           }
           return forms[f];
         } else if (checkonly && fields['password'] >= 1) {
           singleform = forms[f];
         }
       }
     }
  }catch(e) {
    lpReportError("Failure with checking generate password: " + e+ " ln: " + e.lineNumber, currenturl);
  }

  if (typeof(win) == "undefined" || win == null) {
    win = browser.contentWindow;
  }
  if (win && win.frames) {
    for (var i = 0; i < win.frames.length; i++) {
      try {
        if (win.frames[i].document) {
          var frameform = lpCheckGeneratePassword(browser, win.frames[i].document, checkonly, win.frames[i].window, recursion_counter + 1);
          if (frameform) {
            return frameform;
          }
        }
      } catch (e) {
        // most likely permission denied due to cross-domain
      }
    }
  }

  return singleform;
}

function lpCheckCurrentPWField(form)
{
  var regexp = new RegExp(lpgs('ff_currpass_regexp'), 'i');
  for (var i = 0; i < form.elements.length; i++) {
    var elt = form.elements[i];
    if (elt.type == 'password') {
      if (lpIsVisible(elt)) {
        if (regexp.exec(getname(elt))) {
          return elt;
        } else {
          var text = lpGetTextBeforeFormField(elt);
          if (text != '' && regexp.exec(text)) {
            return elt;
          }
        }
      }
    }
  }
  return null;
}

// Returns an array with the number of each type of form field
function lpCountInputFields(f, skippasswordvisible)
{
  //prof: var profstart = LP.StartProf();
  var fields=new Array();
  fields["text"]=fields["password"]=fields["select-one"]=fields["textarea"]=fields["passwordValues"]=fields["passwordvisible"]=fields["uniquepasswords"]=0;
  fields["uname"]=fields["pname"]=fields["oname"]="";
  var el = f.elements;
  var lastFieldWasPassword=false;
  var passwordsContiguous=false;
  var passwordvalues = new Array();
  var numfields = typeof(el) != 'undefined' ? el.length : 0;
  for (var e = 0; e < numfields; e++){
    var t=el[e].type;
    var n=getname(el[e]);
    var v=el[e].value;
    if(t=='password' || t=='text' || t=='select-one' || t=='textarea' || 'email' == t || 'tel' == t || 'url' == t)
      fields[t]++;

    if(t=='password'){

      if(skippasswordvisible){
        //Avoid costl isvisible
      }else if (lpIsVisible(el[e]))
        ++fields["passwordvisible"];

      if(v!="")
        fields["passwordValues"]++;
      if(lastFieldWasPassword)
        passwordsContiguous=true;
      lastFieldWasPassword=true;

      if (!lp_in_array(v, passwordvalues))
        passwordvalues[passwordvalues.length] = v;
    }else if(t=='hidden' || (el[e].tagName != 'INPUT' && el[e].tagName != 'SELECT' && el[e].tagName != 'TEXTAREA')){
      //Dont reset bLastFieldPassword if hidden.
    }else{
      lastFieldWasPassword=false;
    }

    if ( ('text' == t || 'email' == t || 'tel' == t || 'url' == t) && n != 'openid_url' && (fields['uname'] == '' || fields['pname'] == ''))
      fields['uname'] = n;
    if (t == 'password')
      fields['pname'] = n;
    if (('text' == t || 'email'==t || 'tel'==t || 'url' == t) && n == 'openid_url')
      fields['oname'] = n;
  }
  fields["passwordsContiguous"]=passwordsContiguous;
  fields["uniquepasswords"]=passwordvalues.length;

  //prof: LP.EndProf("lpCountInputFields", profstart);
  return fields;
}

function setupFocusEvent(doc, bOnlyPassword, win, recursion_counter){

  if (typeof(recursion_counter) == "undefined")
    recursion_counter = 1;
  if (recursion_counter > 10)
    return null;


  var topdoc=typeof(LP) != 'undefined' ? (!LP.isFennec ? LP.getBrowser().selectedTab.linkedBrowser.contentDocument : LP.getBrowser().contentDocument) : document;

  //First make sure we only do this once.
  if(doc==topdoc && typeof(topdoc.LPlpm_setupFocusHandler)!="undefined" && topdoc.LPlpm_setupFocusHandler==true) 
     return;
  else if(doc==topdoc)
    topdoc.LPlpm_setupFocusHandler = true;


  var tagnames = new Array('input', 'select');
  for (var i = 0; i < tagnames.length; i++) {
    var elts = doc.getElementsByTagName(tagnames[i]);
    var count = 0;
    for (var j = 0; j < elts.length; j++) {
       //If we are only offering to gen pw, only setup for pw fields
      if(bOnlyPassword && elts[j].type!="password")
        continue;
      if (elts[j].type == 'text' || 'email' == elts[j].type || 'tel' == elts[j].type || 'url' == elts[j].type || elts[j].type == 'password' || elts[j].type == 'select-one' || elts[j].type == 'textarea' || elts[j].type == 'radio') {

        //make sure this isnt a search input box. we don't want to
        //show notifications for search focus events.
        if('text' == elts[j].type || 'email' == elts[j].type || 'url' == elts[j].type || 'tel' == elts[j].type){
          var regexp = new RegExp(lpgs('ff_search_regexp'), 'i');
          if(elts[j].name!="" && regexp.exec(elts[j].name)){
            continue;
          }
        }

        if(count> 20) break;
        else count++;
        elts[j].addEventListener('focus', function(event){if (typeof(LP) != 'undefined') { LP.FieldFocus(event); } else { FieldFocus(event); }}, false);
      }
    }
  }

  //now recurse through frames
  if (typeof(win) == "undefined" || win == null) {
    win = typeof(LP) != 'undefined' ? (!LP.isFennec ? LP.getBrowser().selectedTab.linkedBrowser.contentWindow : LP.getBrowser().contentWindow) : window;
  }
  if (win && win.frames) {
    for (var i = 0; i < win.frames.length; i++) {
      try {
        if (win.frames[i].document) {
          setupFocusEvent(win.frames[i].document, bOnlyPassword, win.frames[i].window, recursion_counter + 1);
        }
      } catch (e) {
        // most likely permission denied due to cross-domain
      }
    }
  }

}

//This is used to pop the notification bar when a field
//receives focus. Currently used for form fill, generate password,
//and some of the log into lastpass notifications.
this.FieldFocus=function(event){

  //Get top level doc
  var browser=typeof(LP) != 'undefined' ? LP.getBrowser().selectedTab.linkedBrowser : null;
  if(typeof(LP) == 'undefined' || browser){
    var doc = browser ? browser.contentDocument : document;
    if(!doc || (typeof(doc.FieldFocusDone)!="undefined" && doc.FieldFocusDone==true)) return;

    if(typeof(doc.LPlpUseLastPassLogin)!="undefined" && doc.LPlpUseLastPassLogin==true){
      if(lploggedin){
        doc.LPlpUseLastPassLogin=false;
        LP.FieldFocus(event);
        return;
      }

      //Show the Use LastPass Notification Bar
      lp_showNotification("UseLastPassLogin", browser, 0, "login", null);

      //We want to be able to show the notification bar after we login, so reset some values
      doc.LPlpUseLastPassLogin = false;
      doc.LPlpm_setupFocusHandler = false;
      doc.FieldFocusDone = false;
      return;
    }

    if(lpNotificationsAfterClick){
      lpCheckGenPwAndFF(browser, doc, false);
      doc.FieldFocusDone=true;
      return;
    }

    if(typeof(doc.LPlpgenerateandfill)=="undefined" && typeof(doc.LPlpfillforms)!="undefined"){
      //Show the Fill Forms Notification Bar
      lp_showNotification('FillableFormDetected', browser, 0,'formfill');
    }else if(typeof(doc.LPlpgenerateandfill)!="undefined"){
      //Show the Generate/Fill Forms Notification Bar
      var generateandfill = doc.LPlpgenerateandfill;
      var aids = doc.LPlpgenerateAids;
      var fillcurrent = doc.LPlpfillcurrent;
      var form = doc.LPlpgenerateForm;
      lp_showNotification("GeneratePassword", browser, aids, "generate", form, null, generateandfill, fillcurrent);
    }else{
      return;
    }

    doc.FieldFocusDone=true;
  }

}

function populategeneratedpassword(url, pass, nofill)
{
        // If the form was created after the page load we won't have the lpgenpassforms
        if (lpgenpassforms[url]) {
          try {
            lpgenpassforms[url].elements; // hopefully this never gets optimized away by the javascript shrinker
          } catch (e) {
            lpgenpassforms[url] = lpgenpasscurrentpwfields[url] = null;
          }
        }

        if (!lpgenpassforms[url]) {
          var browser;
          var doc;
          var win;
          if (typeof(LP) != 'undefined') {
            browser=LP.getBrowser().selectedTab.linkedBrowser;
            doc = browser.contentDocument;
            win = null;
          } else {
            browser = null;
            doc = document;
            win = window;
          }          
          lpgenpassforms[url] = lpCheckGeneratePassword(browser, doc, true, win);
        }

        if (lpgenpassforms[url]) {
          form = lpgenpassforms[url];
          var currentpwfield = null;
          if (lpgenpasscurrentpwfields[url])
            currentpwfield = lpgenpasscurrentpwfields[url];
          else {
            currentpwfield = lpCheckCurrentPWField(form);
          }
          var bLastFieldPassword = false;
          var pass1 = null, pass2 = null;
          for (var k = 1; k <= 2; k++) {
            bLastFieldPassword = false;
            pass1 = pass2 = null;

            var start = -1;
            if (k == 1) {
              if (currentpwfield) {
                for (var i = 0; i < form.elements.length; i++) {
                  if (form.elements[i] == currentpwfield) {
                    start = i + 1;
                    break;
                  }
                }
              }
            } else {
              start = 0;
            }
            if (start == -1) {
              continue;
            }

            for(var i=start; i < form.elements.length; i++){
              var elt = form.elements[i];
              if (elt.type == 'password'){
                  if(!bLastFieldPassword && pass1 && pass2){
                    //already have pw1&pw2 and this wasnt contiguous. so skip it.
                  }else{
                    pass2 = pass1;
                    pass1 = elt;
                    if (bLastFieldPassword && pass1 && pass2) // if we found two contiguous password fields, run with them
                      break;
                  }
                bLastFieldPassword = true;
              }else{
                bLastFieldPassword = false;
              }
            }

            if (pass1 && pass2) {
              break;
            }
          }
          if(pass1&&pass2){
            if ((pass2.value != '' || pass2 == currentpwfield) && pass1.value == '' && i < form.elements.length - 1) {
              // check to see if we have a third contiguous password field that's currently blank, and use the second and
              // third if so (the assumption being that if the first is filled in and the second and third aren't, the first
              // is the old password and the second and third are the new password and confirm)
              for (var j = i + 1; j < form.elements.length; j++) {
                var elt = form.elements[j];
                if (elt.type == 'password' && elt.value == '') {
                  pass2 = pass1;
                  pass1 = elt;
                  break;
                } else if (elt.type != 'hidden') {
                  break;
                }
              }
            }
            //Generate a onchange event. Required by dell.
            pass1.focus();
            pass1.value = pass;
            fire_onchange(pass1);
            pass2.focus();
            pass2.value = pass;
            fire_onchange(pass2);

            if (typeof(LP) != 'undefined') {
              var evt = new Object();
              evt.target = pass1;
              LP.lpfieldchange(evt);
              evt.target = pass2;
              LP.lpfieldchange(evt);
            }
          } else if (pass1) { // singleform case
            pass1.focus();
            pass1.value = pass;
            fire_onchange(pass1);
          }else{
            lpReportError("Couldn't find password fields after generating. form:"+form, null);
          }
        }else{
          if (nofill == '0') {
            lpReportError("Could not find lpgenpassforms when generating pw", null);
            lpdbg("error", "url " + url + " is not in lpgenpassforms[]");
          }
        }
}
// The input or image should be after the password field or else we shouldn't be doing this
// instead relying on the form submit.
function LP_InputClickToSubmit(formdoc, form, click_type)
{
  var is=formdoc.getElementsByTagName('input');
  var seenFilledPw=0;
  for(var i=0; i< is.length; i++){
     // submit with image if possible to get coordinates sent, some sites require this.
     if(is[i].form==form) {

       if('password'==is[i].type && is[i].value!='') {
         seenFilledPw=1;
       } else if(click_type==is[i].type){
         if(seenFilledPw && click_type != 'button') {
           is[i].click();
           return 1;
         }
       }

     }
  }
  if ('button' == click_type) {
    // A lot of forms have multiple buttons, if we can choose a 'submit' over a standard button, that's a better move
    var best_button = null;
    var is=formdoc.getElementsByTagName('button');
    for(var i=0; i< is.length; i++){
       if(is[i].form==form) {

         if('button'==is[i].type || 'submit'==is[i].type || 'image'==is[i].type){
           if(seenFilledPw) {
             if(!best_button) {
               best_button=is[i];
             } else {
               if('submit'==is[i].type)
                 best_button=is[i];
             }
           }
         }

       }
    }
    if(best_button) {
       best_button.click();
       return 1;
    }
  }

  return 0;
}
/*
    http://www.JSON.org/json2.js
    2009-08-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

    this.LPJSON = {};

if (typeof(ischrome) == 'undefined') {
  this.JSON = this.LPJSON;
  if (typeof(JSON) == 'undefined') {
    var JSON = this.JSON;
    var LPJSON = this.LPJSON;
  }
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof(ischrome) != 'undefined' && typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.
        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

/*
            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
*/

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof LPJSON.stringify !== 'function') {
        LPJSON.stringify = function (value, replacer, space) {


// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof LPJSON.parse !== 'function') {
        LPJSON.parse = function (text, reviver) {
             if (typeof(g_ischrome) != 'undefined' && g_ischrome) {
               return JSON.parse(text, reviver);
             }

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


function addStyle(){
  //Inject css. Using it in the manifest broke protopage.com.
  var style = document.createElement('style');
  style.type='text/css';
  var operahack = g_isopera ? 'float: left; min-width: 0px;' : 'float: none; width: 100%;' + g_webkit_selectable;
  var css = document.createTextNode(' \
\
#lastpass-notification { height: 13px;padding: 7px 10px !important;text-align: left;position: relative;font-weight:bold;font-family:Helvetica Neue,Helvetica,Arial,Sans-serif;font-size: 11px;z-index: 1000000099;color: black;vertical-align: top; float: none;} \
#lastpass-content {display: inline;  padding-left: 5px;vertical-align: top;text-align: left; ' + operahack + ' font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 11px;} \
.lppopup {position: absolute;-webkit-border-radius: 0px 0px 5px 5px;border-radius: 0px 0px 5px 5px;-webkit-box-shadow: 2px 3px 10px 2px #a6a6a6;box-shadow: 2px 3px 10px 2px #a6a6a6;z-index: 99999;background: #fff;overflow: auto;x: 0px;y: 0px;width: 300px;height: 200px;display: none;} \
.lppopup table {float:none; display:table; margin: 0px; padding: 0px; border-spacing: 1px;} \
.lppopup tr:hover {background: -webkit-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);background: -o-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);} \
.lppopup tr {' + g_webkit_selectable + 'background-color: #fff; height: 22px;} \
.lppopup td {' + g_webkit_selectable + 'font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;color: black;cursor: pointer;} \
.lppopupextended {position: absolute;-webkit-border-radius: 0px 0px 5px 5px;border-radius: 0px 0px 5px 5px;-webkit-box-shadow: 2px 3px 10px 2px #a6a6a6;box-shadow: 2px 3px 10px 2px #a6a6a6;z-index: 99999;background: #fff;x: 0px;y: 0px;width: 410px;height: 200px;display: none; overflow-x:hidden;} \
.lppopupextended table {float:none; display:table; margin: 0px; padding: 0px; border-spacing: 1px; overflow-x:hidden;} \
.lppopupextended tr {' + g_webkit_selectable + 'background-color: #fff; height: 22px; overflow-x:hidden;} \
.lppopupextended td {' + g_webkit_selectable + 'font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;color: black;cursor: pointer; white-space:normal; overflow-x:hidden; } \
.lppopupextended th {' + g_webkit_selectable + 'font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;color: black;background-color: #ececec;cursor: pointer; height: 16px;} \
.sortable tr:hover {background: -webkit-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);background: -o-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);} \
.lpopupsearchbox {' + g_webkit_selectable + 'background-color: #fff; height: 22px;} \
.lpopupsearchbox:hover {' + g_webkit_selectable + 'background-color: #fff; height: 22px;} \
.lpbutton,#lastpass-notification button[type="button"] {background-color: #eeeeee;background-image: -webkit-gradient(linear, left top, left bottom, from(#eeeeee), to(#cccccc));background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);background-image: -o-linear-gradient(top, #eeeeee, #cccccc);background-image: linear-gradient(top, #eeeeee, #cccccc);border: 1px solid #ccc;border-bottom: 1px solid #bbb;-webkit-border-radius: 3px;border-radius: 3px;color: #333;line-height: 1;font-weight:bold;text-align: center;text-shadow: 0 1px 0 #eee;width: auto;float: right; margin: -2px 5px 2px 2px; height:17px;padding:1px 6px !important;} \
.lpbutton:hover,#lastpass-notification button[type="button"]:hover {background-color: #dddddd; background-image: -webkit-gradient(linear, left top, left bottom, from(#dddddd), to(#bbbbbb)); background-image: -webkit-linear-gradient(top, #dddddd, #bbbbbb);-o-linear-gradient(top, #dddddd, #bbbbbb); border: 1px solid #bbb; border-bottom: 1px solid #999; cursor: pointer; text-shadow: 0 1px 0 #ddd;} \
#lastpass-notification img {margin: 0px 0px 0px 0px;padding: 0px 0px 3px 0px;} \
');
  style.appendChild(css);
  if(document.head)
    document.head.appendChild(style);
  else
    document.body.appendChild(style);
}

function get_notification_bg(){
  return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAJYCAYAAABIPDecAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIpJREFUWEftzcEKwjAQhOEIfUHfzJNHX07wYKuHkiDYbGJJMhZS8Ozh39PHzLI7nM6X2a0zeB9cwfR8VIzj/VAQQqtijDUxMyGqsgrTTtyqqGrpkj3Wy987XZJ00FJqSVKlJOfcwbXZMN2uRyUmLMJL8MIshN3OWyjvfz0FAAAAAAAAAAAAAAD8DT79ZmFeaJNdcgAAAABJRU5ErkJggg==')";
}

function get_notification_add_bg(){
  return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAJYCAYAAABIPDecAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALJJREFUWIXtzrttQ0EMRNG7AKt1G2pBLbgF9+BG7ECBoAcYFrxLjoIVIzXgYBgdEPxMnD++JSCO3wSJuB4TBsTlmIwxiPs9gUFUgihiVe2OBCAiMwGIaqgmEkStv32n1uyt1cNzI9fzKdV3tHaeXJMBBEokEVW5n6pqD6PuZCIgGDAkgh2REOwYn+9vp70Fs/HTuDUuja+Xzu1la99R/+JZhmEYhmEYhmEYhmEYhmH8QzwALjFuWzeeKlAAAAAASUVORK5CYII=')";
}

function get_notification_error_bg(){
  return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAJYCAYAAABIPDecAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAINJREFUWMPtz0EKAjEMheEIBW/h+byKF/QSLtSKzCBOok58HWTo3sWf1cdLSpNy3O7c3lXGCJtxsylxdU9UJQ/LKpPFZobHkiRcM75OwlYz7bn3Wg0R0W31kwbTPoeo+2+Sh30wCnfhIpyEs1CFQXj+bmjLpwAAAAAAAAAAAAAAgH/DC5OFQV7fXlzwAAAAAElFTkSuQmCC')";
}

//------------------------------------------------------
//This function inserts javascript on the page that will be used for notification bar purposes.
// only opera uses this now.
//
// the first encoded routine, lpshowmenudiv(), is
// given a string in the set of (autofill, autologin, ...)
// for autofill/autologin,  XXX
// relies on lppopupautofill, lpautofill, lppopupautologin, lpautologin, etc.
// brings up a div menu close to the corresponding notification bar button.
// the second encoded routine, closelpmenus,
//
// a copy of this lpshowmenudiv() is copied to menuscript.js, which is
// the version that is sourced and used by the overlay
//
function showMenuScript()
{
return "\
function lpshowmenudiv(id){ \
  closelpmenus(id); \
  var div = document.getElementById('lppopup'+id); \
  var btn = document.getElementById('lp'+id); \
  if(btn && div){ \
    var btnstyle = window.getComputedStyle(btn, null); \
    var divstyle = window.getComputedStyle(div, null); \
    var posx = btn.offsetLeft; \
    posx -= 80; \
    var divwidth = parseInt(divstyle.getPropertyValue('width')); \
    if(posx + divwidth > window.innerWidth - 25){ \
      posx -= ((posx + divwidth) - window.innerWidth + 25); \
    } \
    div.style.left = posx + \"px\"; \
    div.style.top = (btn.offsetTop + parseInt(btnstyle.getPropertyValue('height'))) + \"px\"; \
    \
    if(div.style.display=='block'){div.style.display = 'none'; if(typeof(slideup)=='function'){slideup();} }\
    else div.style.display = 'block'; \
    \
  } \
}\
function closelpmenus(id){ \
  if(typeof(lpgblmenus)!='undefined'){ \
    for(var i=0; i < lpgblmenus.length; i++){ \
      if((id==null || lpgblmenus[i]!='lppopup'+id) && document.getElementById(lpgblmenus[i])) \
        document.getElementById(lpgblmenus[i]).style.display = 'none'; \
    } \
  }\
} \
var lpcustomEvent = document.createEvent('Event'); \
lpcustomEvent.initEvent('lpCustomEventMenu', true, true); \
";
}

// modelled after showMenuScript()
// expected to be run only by Opera browsers, that cannot use
// the overlay in the iframe.  This adds some logic to make sure
// that the popup menu stays open if the user clicks on the table
// headers or the searchbox within the popup menu, for autofill
// and autologin only.
//
//
function showExtTableScript()
{
return "\
function lpshowmenudiv(id){ \
  closelpmenus(id); \
  var div = document.getElementById('lppopup'+id); \
  var btn = document.getElementById('lp'+id); \
  if(btn && div){ \
    var btnstyle = window.getComputedStyle(btn, null); \
    var divstyle = window.getComputedStyle(div, null); \
    var posx = btn.offsetLeft; \
    posx -= 80; \
    var divwidth = parseInt(divstyle.getPropertyValue('width')); \
    if(posx + divwidth > window.innerWidth - 25){ \
      posx -= ((posx + divwidth) - window.innerWidth + 25); \
    } \
    div.style.left = posx + \"px\"; \
    div.style.top = (btn.offsetTop + parseInt(btnstyle.getPropertyValue('height'))) + \"px\"; \
    \
    if(div.style.display=='block'){div.style.display = 'none'; if(typeof(slideup)=='function'){slideup();} }\
    else div.style.display = 'block'; \
    if(id == 'autofill' || id == 'autologin') { \
      var box = document.getElementById(id+'tabsearchbox'); \
      if (box != null && (typeof(box.focus) != 'undefined')) { box.focus(); } \
    } \
  } \
}\
function closelpmenus(id){ \
  if(typeof(lpgblmenus)!='undefined'){ \
    for(var i=0; i < lpgblmenus.length; i++){ \
      if((id==null || lpgblmenus[i]!='lppopup'+id) && document.getElementById(lpgblmenus[i])) \
        document.getElementById(lpgblmenus[i]).style.display = 'none'; \
    } \
  }\
} \
function chk_should_close_exttable(event) { \
  var dont_close_on_me=[ \
      'autologintab', 'autologintabfooter', 'autologintabheader', 'autologintabsearchlabel', \
      'autofilltab', 'autofilltabfooter', 'autofilltabheader', 'autofilltabsearchlabel', \
      'fillformtab', 'fillformtabfooter', 'fillformtabheader', 'fillformtabsearchlabel', \
      'sorttable_sortrevind', 'sorttable_sortfwdind']; \
  var tid=null; \
  var ptid=null; \
  if (typeof(event.target) != 'undefined') { \
    tid=event.target.id; \
    if (typeof(event.target.parentElement) != 'undefined' && event.target.parentElement != null) { \
      ptid=event.target.parentElement.id; \
    } \
  } \
  var foundit=false; \
  for (var x in dont_close_on_me) { \
    if ((tid != null) && (tid == dont_close_on_me[x])) { \
      foundit=true; \
      break; \
    } \
    if ((ptid != null) && (ptid == dont_close_on_me[x])) { \
      foundit=true; \
      break; \
    } \
  } \
  return !foundit; \
} \
var lpcustomEvent = document.createEvent('Event'); \
lpcustomEvent.initEvent('lpCustomEventMenu', true, true); \
";
}

function run_custom_js(doc, custom_js){
  //This is complicated by the fact that they don't allow direct access to functions
  //on the page, so we have to dynamically create a script tag and append it
  try{
    if(custom_js!=""){

      var tld = lp_gettld_url(doc.location.href);
      if((tld=="facebook.com" || tld=="live.com" || tld=="outlook.com") && doc.getElementsByTagName("form").length==0){
        return;
      }


      custom_js = custom_js.replace(/lpcurrpage./g, "");
      custom_js = "try{" + custom_js + "}catch(e){}";
      var script = doc.createElement('script');
      var code = doc.createTextNode(custom_js);
      script.appendChild(code);
      if(doc.body)
        doc.body.appendChild(script);
      }
   }catch(e){}
}

function lpPrepareCustomJS(custom_js, username, password, loc, onlyfill, doc)
{
  if (loc == "3") {
    if (custom_js.indexOf('lpcurruser') != -1) {
      if (!doc.getElementById('lpcurruserelt')) {
        if (doc.body) {
          var lpcurruser = doc.createElement('input');
          lpcurruser.setAttribute('style', 'display: none;');
          lpcurruser.setAttribute('type', 'text');
          lpcurruser.setAttribute('id', 'lpcurruserelt');
          lpcurruser.setAttribute('value', '');
          doc.body.appendChild(lpcurruser);
        }
      }
      if (doc.getElementById('lpcurruserelt'))
        doc.getElementById('lpcurruserelt').value = username;
    }
    if (custom_js.indexOf('lpcurrpass') != -1) {
      if (!doc.getElementById('lpcurrpasselt')) {
        if (doc.body) {
          var lpcurrpass = doc.createElement('input');
          lpcurrpass.setAttribute('style', 'display: none;');
          lpcurrpass.setAttribute('type', 'password');
          lpcurrpass.setAttribute('id', 'lpcurrpasselt');
          lpcurrpass.setAttribute('value', '');
          doc.body.appendChild(lpcurrpass);
        }
      }
      if (doc.getElementById('lpcurrpasselt'))
        doc.getElementById('lpcurrpasselt').value = password;
    }
  }
  var new_js = 'if (typeof(lpcurruser) == \'undefined\') lpcurruser = \'\'; if (document.getElementById(\'lpcurruserelt\') && document.getElementById(\'lpcurruserelt\').value != \'\') { lpcurruser = document.getElementById(\'lpcurruserelt\').value; document.getElementById(\'lpcurruserelt\').value = \'\'; } if (typeof(lpcurrpass) == \'undefined\') lpcurrpass=\'\'; if (document.getElementById(\'lpcurrpasselt\') && document.getElementById(\'lpcurrpasselt\').value != \'\') { lpcurrpass = document.getElementById(\'lpcurrpasselt\').value; document.getElementById(\'lpcurrpasselt\').value = \'\'; } var lploc=' + es(loc) + ';'+ (onlyfill==1 ? 'var lponlyfill=1;' : 'var lponlyfill=null;') + custom_js + 'lpcurruser = \'\'; lpcurrpass = \'\';';
  new_js = new_js.replace(/lpcurrpage\./g, '');
  new_js = new_js.replace(/lpframe1\./g, '');
  new_js = new_js.replace(/lpframe2\./g, '');
  new_js = new_js.replace(/lpframe3\./g, '');
  return new_js;
}

var LP_GETNAME_FAVOR_ID_OVER_NAME=true;   // logical arg to LP_getname
var LP_GETNAME_FAVOR_NAME_OVER_ID=false;  // logical arg to LP_getname
var g_popupfill_rows=0;
var g_popupfill_rows_FF=0;
var g_weasel_id=null;  // set with the timerid of weasel job.  null when job is off
var g_weaseled=false;
var g_autofillsites={};
var g_popupfill_widest=0;
var g_popupfill_max=1;  // max number of popup iframes to display
var g_popupfill_ctr=0;  // number of extant iframes
// var g_popupfill_shown=0;  // RETIRED.
var g_popupfill_parent=null;  // GROSSSSSSSSS
var g_popupfill_parent_last=null;
var g_isadmin=false;
var CLICKABLE_ICON_ZINDEX=100000000;  // to make it display correctly in case auto-selection is poor
var popup_show_sitename_suffix=false;  // if set to true, lists username(sitename) rather
                                       // than username in popup iframe
var popup_show_menu_expand_visual_cue = true;  // if set to true, add some sort of
   // button or hint for user to click to get additional options - right click/middle
   // click will do same, but that may not be obvious to novice users.
   // is minimalist about this, too large of an icon will clutter screen (IMO)
   //
var g_last_field_focused = null;
var g_minwidth_override =0;   // pass this from iframe to resize
var g_minheight_override =0;   // pass this from iframe to resize
var g_popupfill_iframe_width_save=0;  // use this to revert to original values
var g_popupfill_iframe_height_save=0;   // use this to revert to original values
var g_do_pwgen=false;
var g_hide_navbar=true;
var LPICON_HEIGHT= 16;
var LPICON_WIDTH = 16;

var g_popup_divs={};  // a list of divs that were created.  quicker to read this than iterating thru DOM to find them
//var g_popup_nums={};  // store hints too.  TBD
//var g_popup_eventhandlers={};  // record event handlers here so they can be removed easily later   TBD
var g_input_cnt=(-1);  // maybe should record all input name/id's but for starters just track the count.
                       // this is -1 until the first call to countInputs(), which will reset to 0 or more
var g_keyboardNav = false;

// tunable config variables
var create_onerow_iframe = true;  // if set to true then when one matching site is 
                      // present and when clickable icon is clicked, then a one row 
                      // popupiframe will be generated . otherwise field just autofills
var do_autofill_if_matched=false;   
      // TUNABLE : if true, then when typing text info input field for
      // auto-complete, if there is only 1 match, then the field
      // gets automatically filled.  if false, then the field does not
      // get auto-filled; still require user to click on dropdown and
      // click to fill.

var do_popup_actions=true;
var popup_actions_cfg = { sites : { str:'Sites', id: 'popupaction_sites' },
                    generate: { str:'Generate',id : 'popupaction_generate' },
                    savesite : { str:'Save Site', id: 'popupaction_savesite' },
                    formfill:{ str:'Form Fill Profile',id : 'popupaction_formfillprofile' },
                    never: { str:'Disable...',id  : 'popupaction_never' } };

var popup_actions_imgs = { 
                    'sites' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAYAAAB2+A+pAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYDEjgjVdtFiAAABSRJREFUSMelVltsVFUUXfveubdPopBUBQLxiUIa+6upmJD4ARLEqBETBYwE/PQD0ZioMeoPRjDyUgx/qInwoVWsWuVhRIMg0NCiPOzD1taCtGSmnblz7z1nLz86Uy4wM5S4k51z55x19j77rL33HKCMtLS0YHh4eOJ3Op2eDwAkr8IW50ZGRu4rzmUyGbS2tuK6haQLAJ2dnbOz2ewPqsqOjo6ny+Hb29sfUVVms9m9nZ2ds5M2JusQiVO/Z4whSaoqR0dHB640WPxOp9NdqiRJGmOYTqc3lbJZUc6dO7c4juNQVWmMVWMsjbFKkh0dJ14AgPXr12Pjxo0AgGPHjq0ad3gJq6qM4zg+f/7845OOevnyFYtzuYDjRowaYybGXC4Ipk2bWpeAV2WzuUwSU9QwjLh27YvLrofi6p07d+4iySiKNYpjjeKYURyrtcru7p73i8Curq711ioLmHGNYiXJtrbv9wOon5THxsZGkBQA8/r6+nLWWkZRxDCKNIwihmEYB0HAhxctvHHa1Kl1QRAwDMM4HMcwiiIaY3jx4kUCaC7Yuj5Zs+b5l4y1zAWByYch82Go+TBkFMfs6e3d1t3TvSmKYhbWmA9DBkHeWlVu2rR5O/6HTPlh776jxipzQZ65IK+Xj0FyjrkgzzCKefrM2REAMysZTgFAEASujAtIQkTg+z4BjDY0NLxy6vTp72pqahSAk9w8jteJqgEAVcjbb735Rl2NPziWC11jzITdonieZyZqkWSqhLoAajZs2Lgtig3HsjmOZbM6ls2yoJpQBvmQB3788TCAhsJ+v4R6ACAAkM5kAi+Vqi51JeIIRByEYURxRAqRSTLKIhQEHNeh57qiZVqrqqK+rk5SAJDNBba2tvaqq7xkcVxUr9mCSGPFGFuuK1oTx3aCY4w3RSYiSEZW9JYsC6LMHC99y1U4gkWuUwDguK6nSopcZkiuGFlirdRc2b0koEnHJIUkyl3klVlZ6apFRMqxVfSTjNh3XReQ0k0mCkOI4wDXci4CWgvHccDSJLuq6hYdp+bcecdT1tqbBNArDzo6mgk2b9ny2DPLVyyOoqgix77nye5dn323ZvXqT2pqaqpLHs1xLgBISeI/lVffsNhPP945c9GSpX1BPl+opkR4QCL3IEqytrpa2r795tYnly37i6RThjq9ZgPvHxjYl/L8BQVuJrJVVQUCOOIk6xoiAjXm4MwZ0+dXsutUWjx+/Pijnle1wBprVRVF9T1fvt6zZ/+3ra0HfM+X5Jo11rqp1APt7e1PVEyHcu8tEbGDQ0MZq5iSLEhSbRwb967bbn2wtq7WPXHy9/2pVMqKOC4ACiAE4DqSnXHLzfVFW9eMeNu2rRAR29Pb844SU1SVhacUSbKqqtr9vq3tS6X+PDY29tO+vfu+8auq3cKyaOF9pkRdd3fPBhGxW7dumVzEPx882HjHnLs78lEESfAqIpLJZOLGufc0AzhSSLH7T/5x5mBdfX2x3ordTqp9H11nz9zb3NzcMSmOz/7ZtXB4ZAS+56PYWEjC8zzs3rXrQwC/XaIFh1q++HyH73uXYX3Px78XLuDUqVMPXc/z9gYAS7fv2PFrd18/+weH2Pv3AH85fGQEwKwS224/fPRYpvfvAfYPDrH7r35+sP2jQwCWAJgy6edt4QAOgNlNTU0vt3zd2t83OMS169a9XQ7/6muvv9v/zzl+8dWevqamppcAzCpXx5MVH8C8FStXvgFgegXcrGefW/UWgLmFPRXlP7RQ8z2s1Zf0AAAAAElFTkSuQmCC',
                    'savesite' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAACGVBMVEUAAADi5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+ni5+kV6aSVAAAAsnRSTlMAAAQbSXeZpph2SBkDBTOHzu77+syFMiGL5f785IgfAUPH89B7aHyb0fT9xEBT365OGFCx3U9G4NRaDQ5g295EJ8U0PcrJJQjWNjrYkwZC7Ffw6j8HnBqdKztd6z7aKGT1tAxi+beWfVyAlPdYHEGMW/iz8fbyw2rGvVF+MbmicXSfo+deKjeyLn9ZE7oXtREUFp7jcKotrGwCCoLXINkJC9MsX9XoS8Lv6b9rwGkVjdxMbFO3IAAAAjBJREFUeF5t0ulXElEYBvD7UoKhZgxWAiVILs0EIklWLlGUWRYgamaUS4oiWZZBK5i02qLtq+22KC1Wz18YDtyk8n565v2d85x3zr2MH1IsWZqlVKmyl6lzcolPOeYtz1+hEQBAqylYuSqPMpFWF+r0AGAwAIB+zdoiIq5kNBUn0bxOWVJaWla+XgSkDRYjcbVWAKKt0q6g+R1yNlaJgGNTyomqNwNbttbwOqLaunpgm1Me0PYCYIcrhbxv5y6gYXeSqVEJ7NnLlRc07QP2u4mRxwuNleuCN/vQ0kqs7QCgdKeU2k0eezq2HQSy3azDgZZDfCm/93Azz0e86Oxi3T042su5Twj4Odf0Q6xjA0CQMniQM4WAY6wfQ8fnlU6YnMMnDUL+sNPTLg9OjeA0K4bPKXOfJuyLABFf2OuXWX0GZ1kDfB6Zz0lIH6Fb5uowzrMLEC/K7IqGolWSwRYNBWMyW3swyi5BP7b4anHgMotrcaVtMW5UITDGmq7C0cW5Wwhc43y9ArobrHYcUokx5RQLlt1MR+MtCbZeRoND6Iz9fyUuByK3idGdCcA2+S/bx4G795JMTh0M5ff/cnrwUMIjy3wn5T4WITzpMGY8zafPDDA/fyFPaOqlCP2reJGCZFS8znqjhzn6lv/Du3gLoH0/4G+dnrZ8yP6oBT6NTS205X2e0QIYmU0kZgMAAl/UchV3yvk6M6uHfCTNt++TxJWvM1f5Y+JnIlE/WvhrzsjxN5a5s8bBHOqKAAAAAElFTkSuQmCC',
                    'generate' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYDEjoOIjJ7fwAABA9JREFUSMe1V11oXUUQ/vYkKTX3em3+pNaq2FRf+iQURYpUrAhW+6BCBUWkoU8F0QoK/rz0yaIoImKLiqBFJLaogUIRH7Q+qS0qShvENqQFrYknzSHk56x3Zz4fnJNuDjfJzSUOLLszO+f75uzOzOE4LCEkEwAJAHHOEf+HqGpMCJLlINxS+y2TNgIiuZfkt6p6Z4O91SG3ANaSfERVNxr4D6pKkq/Y/h0k747JV0VIPkOSqvozyXdJ5kZ8QVXfIpmpKlV162rf88MkZw2cRkoLplieU9Uby3nRKmGcOF8ZyYSdwA6Sh/U/IckDjRKuFdLE5l0kj5GctTfbU7qGD81+keSbqro9KrmW7rXd5lO8ItMkbyj5DcRHT/JEXBGNsnyxaoE1BzXgQyS/AyAkKwC2l4h3OOdAMgNwjORBAEiSBM45AHA2XwFPkqXLrtiwCL+xZLpM8imS2yyjiwR72Xx3kjxD8kgJ6z2SZ1R1b9PJZ4k02SCT4/VJkltU9Y8o85+w5x8qXcf6ZolfikpmSFXrpqeqejQK6naSRyKCy6r6har+XRCr6slmOyRI1kjuU9V+008b8Kum30Nym60/il+t9KYk+XmEu7YovbGxMQCAKyJxzqGcHKr6LIA9AJ4EsAHAAICvAWwEsA9AFcAIgEHn3G8kNwN4FMAtAHIAbwOYtkQ9niTJG0t+nQoZHh4GAIhIp4ikIjLf0USEIjIkIgvuMYTQLSKDDXwnmrpvEYmDWicilwxAbf5FVa823+dF5LiIvGBHu0ZETplfMUZbajQhhOtDCJ8UQCGE54z09RLBIfN/OvL9LISwaaWEqNfrsX42hMAQwm7TR00vxojZHzT9vKpeZTYXQpjvXMsSd3R0AADq9foDJDdYN7rGjvVC3DJJjpl9nenrRWQXALS3tzN+iUXFew8AyPM88d6/471nNL40ny3e+5+895n3/lfv/VazD5X8Dzd9zHmeF/O1eZ4zz3POzc0xWh+Igry5WM/Nzb3YwN/H2Et+T6enp1GtVgEAs7OzgwB2W90SQL+5HQXwPoDfAWyyun/c9kYBiPme6Ozs3NkUcSmIXgCbVfXHJEm6AXwK4K7I5R8AayL9NID7VXUqSZLbAFysVquXis325QhnZmYAAJVKJQWQmvmvqamp8yXittKjo7VarfD/voSFpMmPxwI9y7LrVPVeVYWNjwHcqqofRLb7sizrXQxzWeJKpTJ/z1EgXlVHjGBSRPbXarUREdmvqn+a/RzJvIxVqVRW3r2yLJtfp2l6U5qmB9M0HYh90jR9LE3T19I07W/03IqTCwAmJydBEt3d3Qvs4+PjaGtrg6qir68vDgLOOSRJgq6urtaJY5mYmACANpLs7e3VyJ4Yrvb09Cz6q/Ev9XO9fBPKbB4AAAAASUVORK5CYII=',
                    'formfill' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYDEwwVIIlJ0QAAAyxJREFUSMfVV02rFEcUPbe6x+FlkjAwvESTVcCQhaCgCJqVgi5FSVwkQnBjcCkh7sRAAroQf4ALl4KEFxLeVoSsRBE3ghASszOJ4JuPFxBmemb6HBdWD2XT3VPPZOOFpqa7btW5595zq3uAN80kQdJrz/8n4BgfktEsUkktP9aCBHN7Sd6SNCT5r6Q/JJ2XZEsD9JFZLDNJDgBIHpY0UYWRvFH417IOou9IuiJpTdK5poUkt5N8XOAEV2hnY+v2YxCxSJ4PGZaAv/A+U5LBMobg9+qwXAn4s2JfMwOAkw1xdgrfYL0BMABFfXpRwGb2V+n54yo/71sEFwLBzEJd5LGpPizpqU/TfZIf1gmM5EFJuc9sXtT31Uzrekwb1ak6qQB1fu6HAGQqKZM09wE8IfleHWYqCT5lknRI0u6XGbMZgF/N7LeQtfel//2dpDmACwC2BXvdBXDGOfes6ArnXHUEJC95lYaqHkj6qqqnwxYjuYfkMZLHJR0h2Yk6uSR9X+7/0v2JUpDFaFmW1RFxjacWyY9JPvcMy5b75w8XMs3z5tOoZHmeV/qmkt73PTkHkPj2WHSHH3eTbDnnZos+dA4k3wFwTNJBM3tXEs0sl/Snmd12zj1IkmQRQPG7iPxAUdsllytl6huv3FmN/5jkOsmPijXz+XxByki+Jemime2TNPGqLGovAB0z+8k5d80Dvi3pFwBHylIpZamwMYDTSZKseXBIgm3lHZzn+YqkdQBHA7CqPVRRrs/TNP158dCLJTEzC/rwlfZJkmQOALPZ7CqAb0ugTeDme94BGAHY1Wq1nk6nU4tmnGXZpwDuVKR1GXA4f7Pdbp/KssylW/jU+TI4+JNSOpcu9+CHJpPJJ+12+/co4PF4DJJHK95UWlLX8v0OAPsBxAGTbEnaWbGpNai5jvUHAJDGnj4R6m1irPI3QCxjAsgArDQwjL2fVH5ZVFm3281JXiYJkuYvRF6h/yOSazF1webmJrrdLgCg3+9/DeCEZ80tqHobgL8lXVxdXf1nOBwuJzwajTAYDP63fyAbGxtRSlxYv9+Hmbmq8hQnXt0YCCzv9XoYDAZ4AaHTcCYdovnMAAAAAElFTkSuQmCC',
                    'never' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYDExwEAPt7cgAABOdJREFUSMfll0uIVnUYxn/PaONnF8vKzoU6BysrwqTraBedkhIyyIJKiGrRok2XlasWIUYUtIqIFl2hRUSLSpPEvDAqqWNBUFhSEOcU3zkn85KQzZjT0+KcsZmv+WamXdB/9X2c////nPd5n/d53wP/t6VuD7J2KQFJHBogK8rZQouMrwMtFIS2e0EnJArga5vPga/SOBgCyItKSRR42sBZUSltDmTtsiVpOfa9htskXQT0GiM3V9S3DAM/Ym9D+tB4WxqFw/864gb0SklPAauxz0Gntv8KHMUMG7eQzhHMwaduPAJ+1+blNA6/nRI4b1dK4jrSvKhuB56z3dc8Hpa0xfYO0NcSvwDDmJbFPMFC42WC20Gn2QDeI+npJAq2dzJ5CnhsPrJ2eYfQK4gFtpG0E3jN9vo0Dn/txlBelHMNq4QeMiwXyPiA4PEkCreOxekZPeT6FcmLapGkF4wX1JzoDcMjSRS8MxkoQBKFR9IofNv2OuAYBszloOfzdrkQwHgCqovqLNuvgB6WwOZN5DVpFB7ppKqrLoqqV7DZ0C/7KDDHqEfiLeCJJAqOA/SMPWSzEri/0dBWYF0ahUfyohLAVKDN2onpF+xAWom0qbnvAeDO0U09fyu4mit8n6SW4Sj4pTQOsprCaQGSt6vd2H2IvZgVSRTsBl7HHDOcAb4/L6qzOyL2EktLm1RvwHwyaiST0DqjMZdZWVHtsbxE0p4kCpYkcVDXsNkIfFynVstMXSVjqb5ZEAB/CrYmcXgSIG2cawIFz0ijYCRrly2hHbIXY+1NouDGcYKLgxOGLbVmHAG3jAOWtBAbiR8N+yeltKhmJlE4krWrlqQB4z6kQUR/lyP7DbkkMFd1Rhy5VkEpc3AyepMoOJm1y9nADkOfrEGgP42C4S4udRD8c/M36Mxxq6my44ihLhY6I42CkbxdtoAB4RuAfRb9SRQM5U3OJ0AewjreMDu7M+I/VJd1L3DaROfTOBzJi6plNIB0A2gfpj+NgqGGiZEuRM1E9Z2GP8YBGx1qfs4D5nbJ7SxgQHKfYNB4WRoHv+dFNTPtDgpwrmCeDYJDnRE3XcQX2lw60WnDAKYPNGi7P43Doaxdzkii4OQUJX6p7QslY/vAeFXDbuCY0OlqJD/eHMrd2IsRe20vGwVN43BkKmMxLJVogY6CPuuMeBd4X1O09+RFubgBbNXmwClzSOO6wU8GOmqzeVHeKFjVtIVBxK5xwEkU/ASsV91B5hsezIpqvmFzN3OYBLQniQJn7fJ00GOG1HUH3JBGQTFRk/gA2A4gazXwhdBSxC7ErdMBzYpSSRT82bjSk8Aj2Ag+lfig6+iTt6u7EG/YDhqnOQy+JonDfLoTZNaueiWetL1W4kxQYfNoGgeb/tGdRnOSxMFG288KDdWG4mHEU1lRXju9DlVej3jZ+HnBmTa/Ya8bBc0anM5BQEkUOC+qHszjFs+AzxeCugzeN9qJ+B77sGAYaZbhPGCB7KUW94Euq7XCQcFa26+mceix45WmEMm9ttcAN6np5saHgB+EDoJ/tzVb4gLwxaC5o2Ix2iXxYhIF66c93o59s7yoLgGvxrrb+GpJs8bOaJJoBkKAIcOXsj+y9F4aBT90G+w1WR2O3ZwX1QLDCsEtNldIhIZewQnbhaRvai9gSxIF3030cfCfWH8BwIeLNqIzOycAAAAASUVORK5CYII='
};

var icon_imgs = {
  'default' :  'data:image/gif;base64,R0lGODlhEAAQAMQAAHgAFq9RZp8BJfT09JkCJKUuSO/q6/n//vHh5YYBGvf6+tOyucB0hsuLmpUiOpIAHIgJJtzFy7pneuvT2fP49/Dw8L5/juS+x8Scpn4BHaMDJ3cAHHQAG6YDKHEAGv///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkZCN0YxMTc0MDcyMDY4MTFCRURDRjg2RUEzOUI0MjBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUyQjY0RUJGQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUyQjY0RUJFQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkE3RjExNzQwNzIwNjgxMTkyQjA4Nzg0MUEyMjBGMUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkI3RjExNzQwNzIwNjgxMUJFRENGODZFQTM5QjQyMEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAEAAQAAAFmGAnjmTZaSgqCCqbautKdMVaOEQsEDkRTAjN44IIyHi8R+DzYRSYjAcy+Ug0PojJZ/HoUh2BgGRwOCga4UK3uiwP3mSmJVFNBBQVQwWuVzASgAkQDmAVFIcShBCAGY0ZAAsHEZEREACOjgABBxQBDhUHFpeNG6UcDhgLHgCpBQClsKUeHBAeGxkctrAcvL2zub2+HsPExcYhADs=' ,
  'sites' :  'data:image/gif;base64,R0lGODlhEAAQAMQAAHgAFq9RZp8BJfT09JkCJKUuSO/q6/n//vHh5YYBGvf6+tOyucB0hsuLmpUiOpIAHIgJJtzFy7pneuvT2fP49/Dw8L5/juS+x8Scpn4BHaMDJ3cAHHQAG6YDKHEAGv///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkZCN0YxMTc0MDcyMDY4MTFCRURDRjg2RUEzOUI0MjBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUyQjY0RUJGQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUyQjY0RUJFQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkE3RjExNzQwNzIwNjgxMTkyQjA4Nzg0MUEyMjBGMUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkI3RjExNzQwNzIwNjgxMUJFRENGODZFQTM5QjQyMEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAEAAQAAAFmGAnjmTZaSgqCCqbautKdMVaOEQsEDkRTAjN44IIyHi8R+DzYRSYjAcy+Ug0PojJZ/HoUh2BgGRwOCga4UK3uiwP3mSmJVFNBBQVQwWuVzASgAkQDmAVFIcShBCAGY0ZAAsHEZEREACOjgABBxQBDhUHFpeNG6UcDhgLHgCpBQClsKUeHBAeGxkctrAcvL2zub2+HsPExcYhADs=' ,
//  'generate' :  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAepJREFUOBGlkd9LU2EYxz+nbWetbe4kE7qJNg+lac2EgSVIBUl3du1F1MUgogv1D+i6G8GbyAVRYEEQSe3aGARdRNImO8wr2zCX7IcOxRLcnKfX4V46je3G9+Z53uf5Pp/zfd6jPAeTY5wTx5itj7YFqHM3sL+63vYbTYDfM4Ooc7cYK7xH7x7ESG1x+etDvj8I1UHb01ag8v8bBBbus7qap1wu09mpsb8PqmpnKblGT68L9dE3iyMJGEo9weFwiuE02exPMpkShXwNn0+hW9ew2exUKjURt/FMLUmIXCEef0cs9pZ8viAAJQIBByOvDUJPU3i9B+j6WQHY4+OHKsqLcDPAPZlkeDhMLlekWKgJq4tSZEa+sL6eFfVdJqcuEA7fkT3p4ObKrLB7Br+/o763VBwlHo8Pf5eb5eUMi1cey7YERKNRZp/N43Q6hd2T2F6OSJEej7Czs0up+IdkokZXbEz25CMeVs5/jlCtKKTTK+JmiqEtNM2F262JR90gGDxNf38Q46r4d0fHAjispScG8Hid2G0mF/vOkUhkMc0qv3IH3L3Xw9rt+cZsPcoVGtWhax0i3aPvkh/DyAgHKuPjo4QG7Hxa+NGQydjkQHZE4nozyubmBqcmkv+WLXlbgEXZ4tK0Qgtdy/JfeTeg90UbNrgAAAAASUVORK5CYII=",
// based on:  http://www.favicon.cc/?action=icon&file_id=180708
// white on red looks too much like the last icon (IMO, but 
// red on white seems better
  'generate' :  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAMdJREFUOBGdU4kNwyAMtKtulJ3ITDBTM5ObIzl0jYAotYQwvvMHxiLCeuuTUmSzuqD3OLC97JTiHtu6Bs+jHRxwiTuiqGFJybZSiP/sV2yvy2sFACgjZ+CK0ecIkLPTwECzHdxl9wGntgBF28D5TpjQccMga3l3zoo7nkoNquOScJ5V155RHZ/of7fQ7gBzAJmV2auI7bUWGLFHvtqUWwNgPJ+8Argc+yOAjK5Gn2VuCfnL8Jz660a/EXblvZmFl8LzaOcIE/8ChHKngdwZr7MAAAAASUVORK5CYII=",
  'formfills' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAwNJREFUOBE9U0tIVFEY/s65d65XZxwfg4ZJiW16uEhN1OiBtBBCAxeBtmijhNCihB7k1h4QQQ+CgiCiB5hl1CLSFi1amZmFC13kCyuGfI2OjjYz93H67tW6w5nz+v7v//7HEQoQHY/zOp8PhE9bCjlCdwFNCQjwhsP7CPKHKxRsCQ1YPV6z+qBwJtal6b05p+6+i9y2XRF2BQxXEwYpDG+thLfe2DuKM4djS8O2ZPbIRFZd7QHMa/HdkRuxeKCUJhC6IjzF2YY0KcB0IDJ4rpFS2BRkc6Z/roQjsOgiKBVcHQQIjTpJklsQQVfLNbTWtRG3RoJ17K88jHsn76O4uBQiQCdemJ4zRqMLnYTexiQJPe4rq8SZahrzy8rXMLY8hlf1Pf5+Iv4dt/rvMEdUQQWC7rWiI9mtS6taiTApUVvHj/RX5OduQ2VBBSpzy3F0az2CZgifooM429cOZTEM5RFoiIStn7oQzLh0qUVHXXkTVO4yxuKjSP9JIxQIARwOyzM0N4RDu+qQhxL0fXmP9UQCkIxmo1SUohu4WtWJ7cFiJJ0kZhdmeb/xMWK0FDajraiVKwcV3wawZq94OfAzsAkDJqfHsaD9RtJN0Zi3/2/A/FswWRpDGnBsx79RCkr3G4Rg20rj4vAVWNnz2FtQhQuFHbCUVzqBAP08i3fjbfQNzPgWLCUWIDzfKg2plFDKkXBtF9HYOGKpGI4VNMI0TCzJZfziL2AYaIw0IJVSiMYnWIDNfmBnMkwKYZCKLaqQgeYdrTiYV4NQZgiP5p7i+sxNZJqZKA2V4NzO85Ru+FVQbFWQQFc2FzRGiuc87P7YjYX5FSylF/F56gNkSOJEoh21OdV4OdxDpYENfNrvRqVzshWbgslltBKOlOgfeU02JtEMQiWBqenvmFwbZdno3TXg411iqV02la2RlsoshmAJGjA5bpBsJlRKg7uucaZXyTPPmBgfS4cNe5K93PE5P8m79GIw3J52EeZT5gnHvybwC8Y//0l74TILAommmsTDwunY5b+wkECPQMbrbQAAAABJRU5ErkJggg==",
  // icon2_blue.png 18x18
  'offersave' : "data:image/png;base64,"+
                "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK"+
                "T2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AU"+
                "kSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXX"+
                "Pues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgAB"+
                "eNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAt"+
                "AGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3"+
                "AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dX"+
                "Lh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+"+
                "5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk"+
                "5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd"+
                "0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA"+
                "4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzA"+
                "BhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/ph"+
                "CJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5"+
                "h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+"+
                "Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhM"+
                "WE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQ"+
                "AkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+Io"+
                "UspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdp"+
                "r+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZ"+
                "D5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61Mb"+
                "U2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY"+
                "/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllir"+
                "SKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79u"+
                "p+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6Vh"+
                "lWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1"+
                "mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lO"+
                "k06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7Ry"+
                "FDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3I"+
                "veRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+B"+
                "Z7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/"+
                "0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5p"+
                "DoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5q"+
                "PNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIs"+
                "OpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5"+
                "hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQ"+
                "rAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9"+
                "rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1d"+
                "T1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aX"+
                "Dm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7"+
                "vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3S"+
                "PVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKa"+
                "RptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO"+
                "32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21"+
                "e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfV"+
                "P1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i"+
                "/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8"+
                "IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADq"+
                "YAAAOpgAABdvkl/FRgAAA5xJREFUeNpUlFuIlVUYhp9vrf/fh5k9zp4xK3NkbALZXRjSiTwgaCFY"+
                "N46CYUYURFFeGkUni24NukyTGLIStDNRChI2YAdtgoipmYjxNJrO6OwZ3Yd/z/r/tb4udhf2Xb88"+
                "8PLyPfK5VRlfNfbK8PKR56cazQU2RIgaAQsqgAEAAfAgAcWrilJv1ur9P/uhJ68+/oa8c//EM0Mr"+
                "j+07PdlEiAALRKhawGK0DVICiiLGAyngUQu0LrDuVO0127ti056TjQu3m8xisAgxwcXgDJHkgAJG"+
                "YwgWTQM4sJFBCBifQa6bavLdYtNspVZCaNcIFtKYZQtL7HvxAV7eNkA2o2TXS2xd28+ht1axcqCE"+
                "SQ34CNRACBBsFElQVBUUNFjyWA68uYq7Kn3Ua02Gvq5y8UoHux5bTuWOXtasuJnVTxzi/JxiChYN"+
                "HvVWjShCAILBaEyrlmf/F5OgnlJXB88ODrB9YzeVgR4APv5mgvNnPcbkwAsE0GAl0tQJPgUPvg7p"+
                "fJ53hxIevPcCmx/q46nBPlyaAYHR8RleevsMjdpNdMYOSg7wBOeI1Dto1shHBbZtrpDPl6leLTI2"+
                "kfDIuoRi0VLsiNHg+H28ypb1fSy6LSaOEj458gtTs3NIcBKhKmQp+TjlhUeXsuSWEqn3uFSZnbnK"+
                "jffwmgJbNhQxYgg+8P3wMFOXE1AlQr0SUoJmTJ77m/qMIQ3Qmg9Yo/8DZV7I5wzWgDVC6lqgGYIn"+
                "ElLAkSQNXt07BnRQnell7X1d7Nxq8R5EwBr47DgcPJLQ21MltnNMTs+BzUAdkUimaEKW5vjtD4Nz"+
                "lvwCZdOaAvkYpurQmIdltwobV8OBb6c5NeLoXJBAbMA4hJYaIVV8E0IdyTXJ5Wrs2tHBPZUSHZ0l"+
                "PjpaZ8+HVYqFIksWdbL76R7K5SkkriMk4BsI82ogU3wdfA1NqxTyV7izH7q6y/xTDXx1bJQTP51l"+
                "5K+E3oU9DCwtsbBrGk0uQXYNfAPDPBEmE3wCWQCT0mo5nnv9U3YM3k11dp65y2ewhV72HvqV0T/H"+
                "ee/gCWrNJhQsGhzg8D4hytIkIyTtn9EMxOFCjvc/GMZEgVy5BJJxcuQiPx6fxXYK5AyEBNSBeLJQ"+
                "J1p8rv8w5WsbkO62bzQFYkzpP6WEWnt7E7BlIDgIWTtLgPppVmaVo9H66pb9l9zxxT8UD+90FLuw"+
                "MaLShsgNYiOAKqCoeAgeE667StLz5fZkaPe/AwCT8sr4xR0fSwAAAABJRU5ErkJggg=="

};

     
// some perf counters
var g_ctr_getAbsPos=0;
var g_ctr_weasel=0;
var g_ctr_getzindex=0;
var g_ctr_getWW=0;
var g_ctr_nosetheight_A=0;
var g_ctr_setheight_A=0;
var g_ctr_setwidth_B=0;
var g_ctr_nosetwidth_B=0;
var g_ctr_setheight_C=0;
var g_ctr_nosetheight_C=0;
var g_ctr_setwidth_D=0;
var g_ctr_nosetwidth_D=0;
var g_ctr_settop_E=0;
var g_ctr_nosettop_E=0;
var g_ctr_settop_F=0;
var g_ctr_nosettop_F=0;
var g_ctr_setleft_G=0;
var g_ctr_nosetleft_G=0;
var g_ctr_recheck=0;
var g_ctr_setposition_H=0;
var g_ctr_nosetposition_H=0;
// no I ctr
var g_ctr_setzindex_J=0;
var g_ctr_nosetzindex_J=0;
var g_ctr_numspan_setzindex_K=0;
var g_ctr_numspan_nosetzindex_K=0;
var g_ctr_numspan_setzindex_L=0;
var g_ctr_numspan_nosetzindex_L=0;
var g_ctr_measureText=0;
var g_ctr_measureText_cachehits=0;
var g_ctr_measureText_cachemisses=0;
var g_ctr_formcache_hits=0;
var g_ctr_formcache_misses=0;
var g_ctr_form_get_username_M=0;
var g_ctr_form_get_password_N=0;
var g_ctr_orphan_get_username_P=0;
var g_ctr_orphan_get_password_Q=0;
var g_ctr_looksLikeUsername_R=0;

var g_ctr_mutation_observer=0;

var g_is_specialsite=null;  // can be set in receipt of setprefs
var g_nevers = {};  // pull from bg.g_nevers, which itself is derived from bg.g_neverurls

var g_last_recheck=null;    // last time recheck was issued by mutation observer.

var FORCE_OFFER_GENERATE = true;
var NO_FORCE_GENERATE = false;
var FORCE_SHOW_NOHITS=true;
var NO_FORCE_NOHITS=false;

//
// experimental features, suggested by 29thdrive
//
var g_icon_shading=false;
var g_do_icon_number_hint=true;
var g_icon_hover=true;
var g_icon_parent_hover=true;

var g_icon_number_overrides= { 'sites':(-1), 'formfills':(-1) } ;  // -1 as initial state - don't override, use default.
var g_icon_numbers = { 'sites':0 , 'formfills':0 };   // this is default
   // this is set inside createPopupFills
   // if there is a change from the BG, it should issue a
   // recheckpage BG->CS msg, which then eventually will
   // call createPopupFills() to update these values.

var g_visual_cue_on_hover=true;
var g_show_icon_only_on_focus=false;  // just can't make it work right
var g_show_save_success_msg=true;
var g_save_suggest_msg=false;
var g_creditcard_profile_annotate=true;  // when true, a string 'Credit Card' 
     // is appended to the name of a credit card formfill profile
     // in the popup iframe.  Tries to make it very explicit (per 29thdrive
     // it does seem like a source of confusion
var g_show_icon_number_for_formfills=false;  // when true, the number of
     // formfill profiles are displayed for input fields that are
     // not login forms.  when false, no number is listed.
var g_save_suggest_msg_seen=false;  // set to true when first seen,
     // so that the save suggestion message doesn't show up as much.
     // i.e. be less obnoxious.
var g_change_icon_on_input=true; // if set to true , check form/text inputs so
     // that the clickable icons may change depending on the contents of
     // text input fields.
var g_savesitesuperbox=true;
var g_dologin_clickable=true; // if true, then don't remove the clickable icons inside
                              // INPUT fields when user logs out; if the user is logged out,
                              // clickable icons will still be created.  however, when clicked,
                              // request lastpass BG to initiate login behavior

var g_use_grey_icons=true;

var FADE_MAXSTATES=100;  //used for  destroy_save_site_success_msg() and
                         // function destroy_save_suggest_msg()
var g_aspx_hack=true;  // handle ASP pages differently
var g_found_aspx=false;

var g_clickable_input=true;
var g_clickable_input_on_password =true;  //modifies g_clickable_input so
      // that clicking on input field on login forms only works when
      // clicking in password field
// next 2 vars are used if g_clickable_input_on_Password is true
var g_popup_active_username=null;  // for the current document, what is the likely username field
                                   // for use in adding the site
var g_popup_active_password=null;  // ditto
var g_extended_kbd_nav=false;

var g_iframe_scroll_hack=true;     // if the popup iframe is itself a child of a small iframe
                                   // [login dialog] on the website that the user is browsing,
var g_frame_scrollable_set=false;  // this diddles the parent website to turn on scrolling to allow
                                   // for the extra screen space reqd for LP popup.
                                   // many sites explicitly disable scroll on iframes.
          
var g_defensive = true;     // turn this on to intercept mousedown events and prevent
                            // them from being passed along - code already mostly 
                            // intercepts click events.   e.g. news.sina.com.cn

var NAV_BAR_HEIGHT_CSS = 42;

// given an input field element, 
// return true if this is a field that the popupfill should create
// and clickable icon for, and false if it should ignore
//
// cache this?  chk_form_has_password has its own cache
//
// now pass doc obj
//
// add arg#3 to determine whether to restrict to login type fields
//
var SHOULD_DO_LOGIN_ONLY=true;
var SHOULD_DO_ALWAYS=false;
function popupfill_shoulddofield(doc, elt, login_only) {
  var fieldname_blacklist=[];  // list of field names that we explicitly ignore.

  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  if (elt == null) {
    return false;
  }

  if (1) {
    if (elt.type == 'password' ||
        elt.type == 'text' ||
        elt.type == 'email'    ||
        (!login_only && elt.type == 'tel') ||
        (!login_only && elt.type == 'url') ||
        (!login_only && elt.type == 'textarea')
    ) {
      // put any other tests here
      var eltname = LP_getname(elt, LP_GETNAME_FAVOR_ID_OVER_NAME);
  
      // per Joe, cannot rely on rejecting orphan INPUT elements
      //if (elt.form == null) {
      //  return false;
      //}

      if (lp_in_array(eltname, fieldname_blacklist)) {
        verbose_log("fieldname "+eltname+" is blacklisted, skipping");
        return false;
      }

      // try to explicitly ignore form fields that appear to be search fields
      if (is_search_field(doc, elt)) {
        return false;
      }

      // if login_only boolean is set, then only proceed if this field and
      // the form it belongs to is a login form.
      //
      // otherwise, always proceed.
      if (login_only) {
        if (!chk_form_has_password(doc, elt.form) && !checkDocumentForLoginOrphans(doc) ) {
          if (verbose) {
            var fid;
            if (elt.form != null) {  // this logic is just for the log msg.  doesn't have to be precise
              if (elt.form.id == null) {
                fid = "(null)";
              } else {
                fid = elt.form.id;
              }
            }
            console_log('form '+fid+' has no password field?  Ignored');
          }
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }
  // should never get here
  return true;
}

// given DOM element field id (or name)
// create the clickable image that layers on top
// xxx restrict to top level document only?
// could have fields inside frames within doc  (not iframe)
//
// create a hidden iframe for each field?
//
// or just create an iframe when clicked?
//
// can be called from lphighlightField()
// and can be called from  doc_create_clickable_icons()
//
// add boolean 2nd argument - if okcreate is false, then just relocate/move
//
//   creates a <DIV><IMG></DIV> element 
//
var NO_CREATE=false;
var OK_CREATE=true;
// 
// NB: fid is expected to be the output of LP_getname(id)
// now pass document object
//
// fillhint optional; set to sites/formfills IFF g_do_icon_number_hint is true
// fillhintnumber optional .  if present, it is an object where sites=xx and formfills=yy.  
//
// sets attribute intrinsic on the iconcontainer to make it easier to figure
// out the functionality associated with each - sites/formfills
//  shouldOfferGenerate(doc,field) is called on the parent field; if yes then
// intrinsic is set to 'generate'
//
function create_or_move_overlay_icon(doc, fid, okcreate, fillhint, fillhintnumbers) {

  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  // check if fid and field are valid here
  if (fid == null || fid.length <= 0) {
    return;
  }

  // pass to LP_getElementByIdOrName() in case field.name is set but field.id is not
  var field = LP_getElementByIdOrName(doc, fid) ;
  if (field == null) {
    return;
  }

  // XXX this is destructive, cannot set this
  // must handle each case; absolute vs relative, vs other.
  // field.style.position = 'absolute';

  // this next bit is needed after changing to call this routine via setTimeout()
  if (typeof(field)=='function') {
    return;
  }

  var posy;  var posx;

  // icon is 16x16.
  // if the textfield is 16px high, then align against right edge.
  // if the textfield is less than 16px
  //   shrink this icon to fit?
  // if the textfield is higher than 16px, align against right edge
  //   and center against top v. bottom
  //   alignment of top of icon should be
  //         field.offsetTop +  (field.offsetHeigh-16)/2
  //     where (field.offsetHeight - 16)/2  + icon height (16)
  //           + (field.offsetHeight - 16)/2  + offsetHeight
  //

  // CASE: when the notification bar appears, and shifts everything down,
  // the absolutely-placed icon doens't shift with it.
  // so, must move with the form.

  // CASE: if you end up with an element placed at "left = -18px" then
  // what has likely happened is that the source INPUT field is
  // hidden with dimensions of 0 height/0 width.

  var body = doc.getElementsByTagName('body')[0];
  var icon;
  var icon_container;
  // LP_getname returns field.id, field.name, or ''
  var ii = LP_getElementByIdOrName(doc, MAGIC+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME));
  if (ii == null) {
    if (typeof(okcreate)!='undefined' && okcreate==true) {
      //######################################################################
      // begin create logic
      // 
      // need to put some ToC style comments here
      
      // check if this is associated with a PW field that needs the generate password
      // page to be shown when icon is clicked, and if a special icon should be shown
      var offergenerate;
      if (fillhint == 'generate') {
        // CASE: , if fillhint==generate, then override the shouldOfferGenerate()
        // call here, because it is likely that the loosened signup form detection
        // logic would have been triggered before hand.
        offergenerate = true;
      } else {
        offergenerate = shouldOfferGenerate(doc,field) ;
      }
      
      icon_container = doc.createElement('div');
      // the FORM INPUT may not have an ID, but the icon container
      // that is created here definitely will.  So, call out to LP_getname() to
      // check the parent INPUT's both NAME or ID properties
      icon_container.id = MAGIC+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME);

      // record what kind of iframe gets displayed.  It is a PITA to get at this info from BG or IFRAME
      // fillhint is set to true IFF g_do_icon_number_hint==true
      if (fillhint != null) {
        icon_container.setAttribute('intrinsic',fillhint);
      }

      // keep a history of what's been created
      //g_popup_divs.push(icon_container.id);
      g_popup_divs[icon_container.id]=icon_container.id;

      icon = doc.createElement('img');
      if (field.offsetHeight < LPICON_WIDTH ) {
        // case: login form fields exist but are not immediately visible;
        // each field has dimensions 0x0 . when the 'login' link is clicked
        // on the source webpage, the input field then grows to a normal size.
        // however, the icon will need to grow with it...
        //
        // chrome profiling: setheight/setwidth
        icon.height = field.offsetHeight;  // shrink to fit the text field
        icon.width = icon.height;   // and maintain 1:1 aspect ratio
      }
      // this is just a copy for now; shouldn't duplicate this next line, 
      // should just reference it 
      icon.id  = icon_container.id + '_icon';  // need this to spec it later

      // default 
      // red logo icon
      if (g_use_grey_icons) {
        // this is from lpchrome/icon_off.png
        icon.src = 'data:image/png;base64,' +
                   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ'+
                   'bWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp'+
                   'bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6'+
                   'eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0'+
                   'MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo'+
                   'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw'+
                   'dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv'+
                   'IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS'+
                   'ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD'+
                   'cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFu'+
                   'Y2VJRD0ieG1wLmlpZDpFRDZGOTI1QkIwQkIxMUUwQjU2NUE4OEVFNUM2NEI1NCIgeG1wTU06RG9j'+
                   'dW1lbnRJRD0ieG1wLmRpZDpFRDZGOTI1Q0IwQkIxMUUwQjU2NUE4OEVFNUM2NEI1NCI+IDx4bXBN'+
                   'TTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVENkY5MjU5QjBCQjExRTBC'+
                   'NTY1QTg4RUU1QzY0QjU0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVENkY5MjVBQjBCQjEx'+
                   'RTBCNTY1QTg4RUU1QzY0QjU0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4'+
                   'bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wVe9ZwAAAN5JREFUeNqkk9sKwjAMhrMDQ2UinkAZ'+
                   'OBF8/9cRvPFKhYEwUAYTqX8kg5C1N+6Hbw1dkmZpRtRXBg6ydkpkb2ydE2MXYA9GIAW1vNuBOVjJ'+
                   '/gs4fhGbhDNlL+TETGy9762AMzZgqfa4kqmsnS7i10vAasFEBWQm+AmuOiAVJ92w2nyK1gPk+sAI'+
                   'jy3Y0H+6xzRQgxNEnh6wjgH/k2n+rwfkCc4DCfgWzqE5IJmBtel6o0aYK33rOYg9o6x1E7QKfbBO'+
                   '8AGVrCR2K1QBH6+4zNLzo5WeZlPknBt0jV8BBgAGmSZOzxC+GwAAAABJRU5ErkJggg==';

      } else {
        icon.src = 'data:image/gif;base64,R0lGODlhEAAQAMQAAHgAFq9RZp8BJfT09JkCJKUuSO/q6/n//vHh5YYBGvf6+tOyucB0hsuLmpUiOpIAHIgJJtzFy7pneuvT2fP49/Dw8L5/juS+x8Scpn4BHaMDJ3cAHHQAG6YDKHEAGv///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkZCN0YxMTc0MDcyMDY4MTFCRURDRjg2RUEzOUI0MjBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUyQjY0RUJGQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUyQjY0RUJFQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkE3RjExNzQwNzIwNjgxMTkyQjA4Nzg0MUEyMjBGMUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkI3RjExNzQwNzIwNjgxMUJFRENGODZFQTM5QjQyMEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAEAAQAAAFmGAnjmTZaSgqCCqbautKdMVaOEQsEDkRTAjN44IIyHi8R+DzYRSYjAcy+Ug0PojJZ/HoUh2BgGRwOCga4UK3uiwP3mSmJVFNBBQVQwWuVzASgAkQDmAVFIcShBCAGY0ZAAsHEZEREACOjgABBxQBDhUHFpeNG6UcDhgLHgCpBQClsKUeHBAeGxkctrAcvL2zub2+HsPExcYhADs=' ;
      }
      if (fillhint != null) {
        if (fillhint == 'formfills') {
          icon.src = icon_imgs[fillhint];
        } else if (fillhint == 'generate') {
          if (g_use_grey_icons) {
            if (0) { // cog
              icon.src = 'data:image/png;base64,'+
                       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGF'+
                       'Vd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8'+
                       'AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWa'+
                       'GVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJP'+
                       'wG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzY'+
                       'Zi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0'+
                       'HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgj'+
                       'ONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyo'+
                       'Bc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrY'+
                       'BbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiE'+
                       'hcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrB'+
                       'DgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfS'+
                       'Pqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1c'+
                       'AdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0n'+
                       'fS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8e'+
                       'k6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWW'+
                       'ing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8O'+
                       'okmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/'+
                       'wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83'+
                       'Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAg1JREFUOBGNU0mPAWEQrW5tJ2In9hMOIi6Cv+B/Oklc'+
                       'hIijX+BAEJFIiCX2fTdezXQnM6eppPvTpd6r7X3C+9sI9nq9+Py46HK5EE6z2cy+1WpFer2etFot'+
                       'f+OlUqlEEUEAAvDjpPP5TLvdjiRJYp/s3263dL/fSRRFxtTr9YDwfD7fAF+vV7JarQrgPz+WyyVJ'+
                       'cvbRaESPx4OcTucv7PF4JI1GQ2q1+pd/MBhwPNcI4Ol0ok6noxCgqkqlQt1ulwlyuRxls1mFBLF+'+
                       'v58kzAAPyne5XEpAqVQiZEH2T5v06ZfjQARLJpOE6qTb7UZut5sfGY3eptMpRSIRslgsTABfu93m'+
                       'KgRBIJ/Px+HS4XAgo9EoY5UTAeFwmOx2OxOAECR/Tdrv9zSZTNgfi8VIp9MxKBQKkcfjUQgwbK/X'+
                       'S8gOA1m/3/+ewXA45H7H4zHl83kOSKVStNlslJ3bbDZlwAgoFAqsBclgMHAWCAezkA3Dw1AxQFQl'+
                       'K1L+PxAIEIQlfIDv2WxGaAVZ/2vyZkRo22QyQde8JhA0Gg0ql8uKvOFbLBZULBap1+vhk3WDuUjQ'+
                       'NR4IqVqt8tlsNrk/h8NBmUyGAbVajdfYarUokUgQ1o/WWIkgQCW4D2glGAxywHw+ZzBe6/Wa/fF4'+
                       'nGNQMebHlwnZcV2xGpCgNKgMs4GksTrchXQ6TdFolEkR90l8/gJp6kLsJGEluQAAAABJRU5ErkJg'+
                       'gg==';
            } else {
             // levi's honeycomb.
             icon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAMAAADjcdz2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMi1jMDAxIDYzLjEzOTQzOSwgMjAxMC8xMC8xMi0wODo0NTozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFODA0QTc2OUYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFODA0QTc2OEYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTEuMCBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5Q0MyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PodDNbwAAAAwUExURfX19czMzNDQ0M7Ozt/f3+Pj4+bm5uDg4Ovr6+jo6NXV1dnZ2e7u7vLy8srKyv///3OAui4AAAAQdFJOU////////////////////wDgI10ZAAAAj0lEQVR42lRQWxKEIAxLCxSFEu5/W4vorMtPaKbkAeZ93OzYN2xoIvolXEXEH2IUsx6zNDvrMYE1aHG3tdUcCFR/36WKmYV16xmlj9DofB2ZfLlkbv05qSOIU2lPOkqdGErROw0amTIsQNoBeBNSDbNIWksqVGVfoo4S1mQu5ni6IAWBb9vI3/7q//7jEmAA/oEKxUGBLjYAAAAASUVORK5CYII=";
            }
          } else {
            icon.src = icon_imgs[fillhint];
          }
        }
      }

      icon_container.appendChild(icon);

      if (g_do_icon_number_hint) {
        if ((fillhint == 'formfills' || fillhint == 'generate' || offergenerate) && g_show_icon_number_for_formfills===false) {
          // if this configurable is set, do not display numbers for
          // formfill fields.  this overrides any icon number that may be
          // present.
        } else {

          //var numspan = doc.createElement('span');
          var numspan = doc.createElement('div');  // only works as a DIV
          numspan.id = icon_container.id + '_numspan';
          if (fillhint != null && fillhintnumbers != null && fillhintnumbers[fillhint] != null && fillhintnumbers[fillhint] > 0) {
            if (fillhintnumbers[fillhint] < 9) {
              numspan.innerHTML =  ' ' + of(fillhintnumbers[fillhint], doc);
            } else {
              numspan.innerHTML =  of(fillhintnumbers[fillhint], doc);
            }
          } else {
            // leave it empty.
            numspan.innerText = "";
          } // fillhint != null
          //numspan.style.fontSize='9px';
          //numspan.style.fontWeight='bold';
          //numspan.style.padding='2px';
          // probably have to set these with !important via cssText to
          // avoid base website css rules overriding this

// compute initial location here ?

          //to overlay the img, appears this has to be outside of the
          //same div that the icon is in.  bah

          numspan.style.position='absolute';
          numspan.style.top="-1000px"; 
          numspan.style.left="-1000px";  // create off the viewport so that the
            // subsequent cssText placement below won't appear like a jump.
          body.appendChild(numspan);

          // store icon_container.id associated with the numspan?
          // or rely on g_popup_divs and cross-fingers?
          // g_popup_nums[icon_container.id]=icon_container.id;
          // g_popup_nums[icon_container.id]=numspan.id;

          // as this appears on top of the clickable icon,
          // and the numspan has to be outside of the iconcontainer,
          // catch click events on it too
          numspan.addEventListener('click', function(event) {

            // this is probably not the right way.
            set_active_username_password(doc, field.form);  //verify field, field.form is correct in the handler

	    popupfilltoggle(doc, icon_container.id, field, offergenerate , FORCE_SHOW_NOHITS); 
            event.preventDefault();
            event.stopPropagation();
	    return false; } );

          if (g_defensive) {
            numspan.addEventListener('mousedown', function(event) { 
              event.preventDefault();
              event.stopPropagation();
              return false; } );
          }

          // numspan.addEventListener('mouseover' ...
          //
        }

      }

      body.appendChild(icon_container);

      // case: source page CSS styling can grow the DIV and align the
      // DIV and IMG against the baseline of the corresponding input field, 
      // which skews the math.  I don't know why
      // this occurs as the placement of the icon_container is supposed to 
      // absolute, and thus independent of placement of the input field, but
      // both Chrome and IE was doing it.  dagnabbit
      icon_container.style.maxHeight = LPICON_WIDTH + 'px';
      icon_container.style.verticalAlign = 'top';
      icon.style.verticalAlign = 'top'; 
    
      // if user clicks on the icon, shift focus to the parent input field.
      // is it sufficient to specify field.focus here() ?
      // mousedown seems to work better,
      // no, click seems to work better than mousedown after all
      if(typeof(g_docnum)!="undefined") {
        verbose_log('['+g_docnum+'] setting up click listener on icon for '+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME));
      }


      // if this icon is associated with a password field in
      // a signup or non-login form, and fancier icons are enabled,
      // then show a generate-specific clickable icon (e.g. gear?)
      // 
      if (offergenerate && g_do_icon_number_hint) {
        icon_container.setAttribute('intrinsic','generate');
        // set fillhint='generate' here ???  or leave alone ?
        if (g_use_grey_icons) {
          if (0) {
            // cog
            icon.src = 'data:image/png;base64,'+
                       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGF'+
                       'Vd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8'+
                       'AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWa'+
                       'GVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJP'+
                       'wG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzY'+
                       'Zi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0'+
                       'HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgj'+
                       'ONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyo'+
                       'Bc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrY'+
                       'BbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiE'+
                       'hcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrB'+
                       'DgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfS'+
                       'Pqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1c'+
                       'AdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0n'+
                       'fS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8e'+
                       'k6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWW'+
                       'ing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8O'+
                       'okmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/'+
                       'wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83'+
                       'Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAg1JREFUOBGNU0mPAWEQrW5tJ2In9hMOIi6Cv+B/Oklc'+
                       'hIijX+BAEJFIiCX2fTdezXQnM6eppPvTpd6r7X3C+9sI9nq9+Py46HK5EE6z2cy+1WpFer2etFot'+
                       'f+OlUqlEEUEAAvDjpPP5TLvdjiRJYp/s3263dL/fSRRFxtTr9YDwfD7fAF+vV7JarQrgPz+WyyVJ'+
                       'cvbRaESPx4OcTucv7PF4JI1GQ2q1+pd/MBhwPNcI4Ol0ok6noxCgqkqlQt1ulwlyuRxls1mFBLF+'+
                       'v58kzAAPyne5XEpAqVQiZEH2T5v06ZfjQARLJpOE6qTb7UZut5sfGY3eptMpRSIRslgsTABfu93m'+
                       'KgRBIJ/Px+HS4XAgo9EoY5UTAeFwmOx2OxOAECR/Tdrv9zSZTNgfi8VIp9MxKBQKkcfjUQgwbK/X'+
                       'S8gOA1m/3/+ewXA45H7H4zHl83kOSKVStNlslJ3bbDZlwAgoFAqsBclgMHAWCAezkA3Dw1AxQFQl'+
                       'K1L+PxAIEIQlfIDv2WxGaAVZ/2vyZkRo22QyQde8JhA0Gg0ql8uKvOFbLBZULBap1+vhk3WDuUjQ'+
                       'NR4IqVqt8tlsNrk/h8NBmUyGAbVajdfYarUokUgQ1o/WWIkgQCW4D2glGAxywHw+ZzBe6/Wa/fF4'+
                       'nGNQMebHlwnZcV2xGpCgNKgMs4GksTrchXQ6TdFolEkR90l8/gJp6kLsJGEluQAAAABJRU5ErkJg'+
                       'gg==';
            } else {
             // levi's honeycomb.
             icon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAMAAADjcdz2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMi1jMDAxIDYzLjEzOTQzOSwgMjAxMC8xMC8xMi0wODo0NTozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFODA0QTc2OUYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFODA0QTc2OEYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTEuMCBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5Q0MyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PodDNbwAAAAwUExURfX19czMzNDQ0M7Ozt/f3+Pj4+bm5uDg4Ovr6+jo6NXV1dnZ2e7u7vLy8srKyv///3OAui4AAAAQdFJOU////////////////////wDgI10ZAAAAj0lEQVR42lRQWxKEIAxLCxSFEu5/W4vorMtPaKbkAeZ93OzYN2xoIvolXEXEH2IUsx6zNDvrMYE1aHG3tdUcCFR/36WKmYV16xmlj9DofB2ZfLlkbv05qSOIU2lPOkqdGErROw0amTIsQNoBeBNSDbNIWksqVGVfoo4S1mQu5ni6IAWBb9vI3/7q//7jEmAA/oEKxUGBLjYAAAAASUVORK5CYII=";
            }
          } else {
            icon.src = icon_imgs['generate'];
          }
      }

      icon_container.addEventListener('click', function(event) {   // dump mousedown.

          // this is probably not the right way.
          set_active_username_password(doc, field.form);  //verify field, field.form is correct in the handler

	  popupfilltoggle(doc, icon_container.id, field, offergenerate , FORCE_SHOW_NOHITS); 
          event.preventDefault();
          event.stopPropagation();
	  return false; } );

      if (g_defensive) {
        // intercept this event to prevent it from being passed along the base website,
        // which may intercept it and do terrible things, like close the website's login
        // dialog
        icon_container.addEventListener('mousedown', function(event) { 
          event.preventDefault();
          event.stopPropagation();
          return false; } );
      }

      // experimental
      if (g_icon_hover) {
        icon_container.addEventListener('mouseover', function(event) {   // dump mousedown.
          do_icon_mouseover(doc, icon_container.id, field);
          event.preventDefault();
          event.stopPropagation();
          return false; } );
        icon_container.addEventListener('mouseout', function(event) {   // dump mousedown.
          do_icon_mouseout(doc, icon_container.id, field);
          event.preventDefault();
          event.stopPropagation();
          return false; } );

      }
      // hover over the parent input field too.  this seems prone to conflict with base website.
      if (g_icon_parent_hover) {
        field.addEventListener('mouseover', function(event) {   // dump mousedown.
          do_icon_mouseover(doc, icon_container.id, field);
          event.preventDefault();
          event.stopPropagation();
          return false; } );
        field.addEventListener('mouseout', function(event) {   // dump mousedown.
          do_icon_mouseout(doc, icon_container.id, field);
          event.preventDefault();
          event.stopPropagation();
          return false; } );

        //if (g_defensive) {
        // too overzealous
        if (0) { 
          // intercept this event to prevent it from being passed along the base website,
          // which may intercept it and do terrible things, like close the website's login
          // dialog
          field.addEventListener('mousedown', function(event) { 
            event.preventDefault();
            event.stopPropagation();
            return false; } );
        }

      }
  
      // javascript 'onmove' supported by IE only
      // DOMsubtreemodified not supported by IE, but triggers on many events that don't matter

      body.addEventListener('DOMsubtreemodified', function() { popupfill_resize(); return false; }, false );
      body.addEventListener('resize', function() { popupfill_resize(); return false; } , false);
      body.onresize =  onresize_handler ;

      // Does relocate correctly for mac when zooming in/out of full page

      // trap on ESC
      doc.addEventListener('keydown', function(event) { 
        keypress_handler(event);  // name of function is too generic.
      }, false);

      // trap on ESC, TAB
      // harder to trap against arrows
      field.addEventListener('keydown', function(event) { 
        field_keypress_handler(event, field); 
      }, false);

      // 
      // end of create logic
      //######################################################################

    } else {
      // prior delete 
      // console_error('FAIL: trying to move icon_container for '+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME)+' but it does not exist');

      // now, just exit quietly
      // when this is executed, what has most likely happened is that the
      // parent field has been removed/hidden and the icon container
      // has been deleted.

      // delete g_popup_divs[fid] here.  I think it is safe but am not 100% confident
      // fid could be field.id or field.name.  bah
      delete g_popup_divs[fid];

      return;
    }
  } else {
    icon_container = ii;

    if (g_do_icon_number_hint) {
      // update the number
      // if the icon had to shrink due to the input field being smaller
      // than 16 pixels high, this needs to shrink too.
      //
      var numspan = doc.getElementById(icon_container.id + '_numspan');
      if (numspan != null) {
        if (fillhint != null && fillhintnumbers != null && fillhintnumbers[fillhint] != null && fillhintnumbers[fillhint] > 1) {
          if ((fillhint == 'formfills' || fillhint == 'generate') && g_show_icon_number_for_formfills===false) {
            // if this configurable is set, do not display numbers for
            // formfill fields.  this overrides any icon number that may be
            // present.  it shouldn't have been created in the first place
            // but check again here, just in case.
            numspan.innerText = "";
          } else {
            if (fillhintnumbers[fillhint] < 9) {
              // if one digit, show some more space
              numspan.innerText =  ' ' + fillhintnumbers[fillhint];
            } else {
              numspan.innerText =  fillhintnumbers[fillhint];
            }
          } // g_show_icon_number_for_formfills

        } else {
          // reset.  if iframe passes a (-1), it should have been 
          // converted to a number >=0 by now.
          numspan.innerText =  "";
        }
      }
    }
  }

  // now, place it.
  // only consider absolute vs relative? other values for $element.style.position ?
  //if (field.style.position=='absolute') {
  // appears this test is not reliable.
  // seen: field.style.position = absolute, but field offsetTop/offsetLeft is relative to offsetParent
  // so, compute location always
  if (0) {
    if (field.offsetHeight > 16) {
      posy=field.offsetTop + (field.offsetHeight-LPICON_WIDTH)/2;
    } else {
      posy=field.offsetTop;
    }
    // align to icon
    posx=field.offsetLeft + field.offsetWidth - LPICON_WIDTH-2;  // 16=width of icon
    // aligned against top right corner of text input form.
    // this should align as top left corner, but centered
    // against top and bottom
    // vs.    
    // align to left side of parent input field.
    // posx=field.offsetLeft;

    icon_container.style.position = "absolute";
    icon_container.style.left = posx + 'px';
    icon_container.style.top = posy + 'px';
    
  } else {

    if ( icon_container.style.position != 'absolute') {
      // now, set style only if necessary; perf tweak
      icon_container.style.position = "absolute";
      g_ctr_setposition_H++;
    } else {
      g_ctr_nosetposition_H++;
    }

    var icon_pos=getAbsolutePos(doc, field);  // returns numeric values
    if (icon_pos != null) {
        if (field.offsetHeight > LPICON_WIDTH ) {
          //  icon_container.style.top = icon_pos.top + (field.offsetHeight-LPICON_WIDTH)/2 + 'px';
          var newtop = icon_pos.top + (field.offsetHeight-LPICON_WIDTH)/2 + 'px';

          // now, set style only if necessary; perf tweak
          if ( icon_container.style.top != newtop) {
            g_ctr_settop_E++;
            icon_container.style.top = newtop;
          } else {
            g_ctr_nosettop_E++;
          }
        } else {
          // icon_container.style.top = icon_pos.top + 'px';
          if ( icon_container.style.top != icon_pos.top + 'px') {
            g_ctr_settop_F++;
            icon_container.style.top = icon_pos.top + 'px';
          } else {
            g_ctr_nosettop_F++;
          }
        }

        // align the clickable icon against the left side of icon (on right of
        // parent input field) 
        // icon_container.style.left = icon_pos.left + field.offsetWidth-LPICON_WIDTH-2 +'px';
       
        // now, set style only if necessary; perf tweak
        var newleft = icon_pos.left + field.offsetWidth-LPICON_WIDTH-2 +'px';

        if (icon_container.style.left != newleft) {
          g_ctr_setleft_G++;
          icon_container.style.left = newleft;
        } else {
          g_ctr_nosetleft_G++;
        }


        // or -2 for stand-off against right-side border
        // against the left side of parent field
        // icon_container.style.left = icon_pos.left +'px';


        // move the hint as well
        if (g_do_icon_number_hint) {
          var ns_style;
          if (icon == null) {
            // this var is set only when it has just been created
            icon = doc.getElementById(icon_container.id + '_icon');
          }
          var icleft = parseInt(icon_container.style.left );
          var ictop = parseInt(icon_container.style.top );
          //var numspan = doc.getElementById(icon_container.id + '_numspan');
          if (numspan != null) {

            if (fillhint != null && fillhintnumbers != null && fillhintnumbers[fillhint] != null && fillhintnumbers[fillhint] > 1) {
              // how wide is the number hint ?
              // unclear if this is right.
              // needs to mirror css styling for numspan 
              var stylefrag="font-size: 9px;font-family: Helvetica,Arial,sans-serif;font-weight:bold;line-height:11px;";  

              var measureTmp=fillhintnumbers[fillhint];
              if (fillhintnumbers[fillhint]>0 && fillhintnumbers[fillhint]<9) {
                measureTmp=' ' + fillhintnumbers[fillhint];  // if just 1 digit, show more space
              }
              
              //var hintdims =measureText(doc, of(fillhintnumbers[fillhint], doc), null, stylefrag);
              var hintdims =measureText(doc, of(measureTmp, doc), null, stylefrag);
              if (hintdims != null) {
                var icw, ich;
                // crap.  icon.height/icon.width is not necessarily set...
                if (typeof(icon.width) == 'undefined' || icon.width==0) {
                  icw = LPICON_WIDTH;
                } else {
                  icw=icon.width;
                }
                if (typeof(icon.height ) == 'undefined' || icon.height==0) {
                  ich = LPICON_HEIGHT;
                } else {
                  ich=icon.height;
                }

                var hintleft = icleft + icw - hintdims.width -2 + 'px';
                var hinttop = ictop + ich - hintdims.height + 6 + 'px';
                     // +6 to hinttop is desirable when padding on numspan =2px
                     // +2 to hinttop seems ok when padding on numspan =1px
                     // +0 when padding = 0px, and to place the number inside the 16x16 icon
                //numspan.style.left = hintleft;
                //numspan.style.top = hinttop;
                var ns_posy=hinttop;
                var ns_posx=hintleft;

                // use cssText to set !important and avoid
                // conflict with the base webpage
                //
                // when border=0px; looks ucky
                // using a color similar to the icon + white border looks ok
                // using a color similar to the icon + black border also not so good
                // using a red color distinct to the icon's red, then no border is necessary
                //
                // #ff2200 is a scarlet red; distinct from the lastpass icon red.
                // #992200 is a red closer to lastpass icon red.
                var number_hint_bg_color = "#ff2200";
                if (g_use_grey_icons) {
                  number_hint_bg_color = "#808080";
                }

                //var ns_css_str = 'position:absolute !important; visibility:visible !important; border-style:solid !important; border-width:1px !important; border-color:#ffffff !important; font-size:9px !important; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; top:'+ns_posy+' !important; left:'+ns_posx+' !important; background-color: #992200; padding: 2px !important; font-weight: bold; color:#ffffff !important; ';
                //var ns_css_str = 'position:absolute !important; visibility:visible !important; border-style:solid !important; border-width:1px !important; border-color:#000000 !important; font-size:9px !important; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; top:'+ns_posy+' !important; left:'+ns_posx+' !important; background-color: #992200; padding: 2px !important; font-weight: bold; color:#ffffff !important; ';
                var ns_css_str = 'position:absolute !important; visibility:visible !important; border:0px !important; font-size:9px !important; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; top:'+ns_posy+' !important; left:'+ns_posx+' !important; background-color: '+number_hint_bg_color+'; padding: 1px 2px !important; font-weight: bold !important; color:#ffffff !important; cursor: default; line-height:11px !important; ';

                //var cur_ns_zindex = numspan.style.zIndex;
                // seems this is more appropriate
                var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
                var ns_style = win.getComputedStyle(numspan);
                var cur_ns_zindex = ns_style.zIndex;

                if (cur_ns_zindex !== "" && cur_ns_zindex != "auto") {
                  ns_css_str = ns_css_str + 'z-index:'+ (cur_ns_zindex)+' !important;';
                }
                // check if this needs to change before doing it
                // because setting style is expensive
                // if (numspan.style) ...

                //numspan.style.cssText = ns_css_str;
                // place after zindex change below.

                //var tmps = numspan.style.cssText;
                //if (tmps !== ns_css_str) {
                // cannot compare this way, as numspan.style is processed
                // so test for the most important characteristics and
                // set it if anything has changed.  (if clickable icon
                // has moved, or if base website has diddled it)
                if ((ns_style.position != 'absolute') ||
                    (ns_style.visibility != 'visible') ||
                    (ns_style.fontSize != '9px') ||
                    (ns_style.padding != '1px 2px') ||
                    (ns_style.lineHeight != '11px') ||
                    (ns_style.top != ns_posy) ||
                    (ns_style.left != ns_posx)) {
                  numspan.style.cssText = ns_css_str;
                  g_ctr_numspan_setzindex_L++;
                } else {
                  // not changed, do not set
                  g_ctr_numspan_nosetzindex_L++;
                }

              }  else {
                // this should never happen.  in this case, hide it ?
                ns_css_str = "display:none;"
                numspan.style.cssText = ns_css_str;
              }
            } else {
              // this should not happen.  in this case, hide it.
              ns_css_str = "display:none;"
              numspan.style.cssText = ns_css_str;
            }

          }
        } // number hint

            
    } else {
        // also shouldn't happen, but occurs on error - too old browser 
        // that does not support getBoundingClientRect();
        // The source input element also could have been removed from
        // underneath us.
        verbose_log("ERROR: unable to relocate clickable icon");
    }
  }

  // put any stylings that occur regardless of $element.style.position
  // icon_container.style.zIndex=CLICKABLE_ICON_ZINDEX;

  if (1) {
    // try to compute the zIndex here instead.
    // sometimes the base webpage will change the zindex of the INPUT element;
    // seems to happen most often with extjs enabled sites
    var newz = getZIndex ( doc, field, 0, 0);
    if (newz != null) {
      newz ++;
    } else {
      newz  = CLICKABLE_ICON_ZINDEX;
    }
  
    if (icon_container.style.zIndex !=newz) {
      // now, set style only if necessary; perf tweak
      g_ctr_setzindex_J++;
      icon_container.style.zIndex=newz;

    } else {
      g_ctr_nosetzindex_J++;
    }

        if (g_do_icon_number_hint) {
          if (numspan != null) {
            // layers on top of icon_container.
            //  numspan.style.zIndex = newz + 1;

            ns_css_str = ns_css_str + 'z-index:'+ (newz+1)+' !important;';

            var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
            ns_style = win.getComputedStyle(numspan);

            //var tmps = numspan.style.cssText;
            // cannot check for this
            //if (tmps !== ns_css_str) {
            if ((ns_style.position != 'absolute') ||
                (ns_style.visibility != 'visible') ||
                (ns_style.fontSize != '9px') ||
                (ns_style.padding != '1px 2px') ||
                (ns_style.lineHeight != '11px') ||
                (ns_style.top != ns_posy) ||
                (ns_style.left != ns_posx) ||
                (ns_style.zIndex != (newz+1))) {
              numspan.style.cssText = ns_css_str;
              g_ctr_numspan_setzindex_K++;
            } else {
              // not changed, do not set
              g_ctr_numspan_nosetzindex_K++;
            }
          }
        }
  }
    
  if (1) {

    // CASE: if input field has been deleted from them webpage (say,
    // dynamically due to user clicking on a login to create/destroy login form)
    // then delete corresponding link and popups
    // now: this case is handled in relocate_popupfill_clickables()
    //if (lpIsVisible(field)) {
    // put expedia-specific logic into checkIsDisplayed()
    if (checkIsDisplayed(doc, field, 0 )) {
      // CASE: input field was dynamically hidden and now unhidden.
      // show it again.  is default ok?
      icon_container.style.display='';
    } else {
      // CASE: input field has been dynamically hidden.
      // just hide the icon, for now.  (no provision to recreate, at present)
      icon_container.style.display='none';
    }


    // NB: fragile, only one child node, an IMG, has been created, ATT.
    // would be a little safer to create id's for all IMG's and do Id lookup 
    var icon = icon_container.childNodes[0];
    if (parseInt(field.offsetHeight) < LPICON_WIDTH ) {
      // case: at initial page load time, login form fields existed but 
      // not immediately visible; each field has dimensions 0x0, and the
      // field dimensions then passed to icon a few lines earlier, in this 
      // function.
      // now, if the input field is now visible and has non-zero dimensions
      // on the source webpage, the input field then grows to a normal size.
      // however, the icon will need to become visible too.
      //
      // chrome profiling: setheight/setwidth
      //icon.height = parseInt(field.offsetHeight);  // shrink to fit the text field
      //icon.width = icon.height;   // and maintain 1:1 aspect ratio

      if (field.offsetHeight != icon.height) {
        g_ctr_setheight_A++;
        icon.height = parseInt(field.offsetHeight);  // shrink to fit the text field
      } else {
        g_ctr_nosetheight_A++;
      }
 
      if (field.offsetHeight != icon.height) {
        g_ctr_setwidth_B++;
        icon.width = icon.height;   // and maintain 1:1 aspect ratio
      } else {
        g_ctr_nosetwidth_B++;
      }
    } else {
      // NB: you cannot not have trailing 'px' string on these IMG attributes
      // chrome profiling: setheight/setwidth
      //icon.height = LPICON_WIDTH;
      //icon.width = LPICON_WIDTH;

      if (icon.height != LPICON_WIDTH) {
        g_ctr_setheight_C++;
        icon.height = LPICON_WIDTH;
      } else {
        g_ctr_nosetheight_C++;
      }
      if (icon.width != LPICON_WIDTH) {
        g_ctr_setwidth_D++;
        icon.width = LPICON_WIDTH;
      } else {
        g_ctr_nosetwidth_D++;
      }

    }
  }
}


//
// given an element, compute the z-index of it and return as integer.
// return null on error.  (perhaps it should be zero)
//
// the z-index must be relative to root, as this is used to assign to
// clikable icon.
//
function getZIndex(doc, elt, ctr, childZ) {
  g_ctr_getzindex++; // perf ctr
  var MAX_RECURSE = 50;
  if (doc == null) {
    // typeof (elt) != object  ??
    return null;
  }
  if (elt == doc.body || elt == null || ctr > MAX_RECURSE) {
    return null;
  }
  var zParent=0;  // should store index of the parent object relative to absolute
  var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
  var style = win.getComputedStyle(elt);
  //if (style.position == 'static' || style.zIndex == 'auto') {

  // if style.position == absolute or relative, then a new stacking context
  // is generated; child zIndex values are computed relative to this.
  // if style.position == fixed, then this is true to for Chrome 22+.
  // if opacity<1 (ignore for now)
  // developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
  //
  // so, recurse back as far back as possible.
  //
  // http://www.w3.org/TR/CSS21/zindex.html
  // this is way complicated

  if (style.position == 'absolute' || style.position == 'relative' || style.position == 'fixed') {
    // this current element has created a new stacking context relative
    // to itself.  add the child's zindex to this element's zindex.

    if (style.zIndex == 'auto' || style.zIndex === '' ) {
      // case: created a new stacking context but no zindex declared;
      // what to do ?  default at this point is 0, and childZ is ignored

      zParent = getZIndex(doc, elt.parentNode, ctr+1, childZ+1) ;
      if (zParent == null) {
        // top level, but CSS default is 0.
        return 0;
        //childZ+1;  // childZ is sum of zindex in child stacking contexts, up to
                   // parent Node (or as high up as recursion allows).
      } else {
        // crap, style.zIndex is returning a number of type STRING, not number.
        return parseInt(zParent) ;
      }
    } else {
      // case: current elt has a zindex declared.
      // continue to recurse?  or stop at first element that creates a
      // new stacking context?  to be correct, must continue to recurse.
      // validate that this is numeric ?  it could be some other unexpected value...
      zParent = getZIndex(doc, elt.parentNode, ctr+1, parseInt(style.zIndex)) ;
      if (zParent == null) {
        // cannot recurse any farther, return get the current zindex start from there.
        // ignore the childZ  because this is a new stacking context
        // and the passed childZ is relative inside the stacking context.
        return parseInt(style.zIndex) +1;
      } else {
        // ignore the childZ  because this is a new stacking context
        // and the passed childZ is relative inside the stacking context.
        return parseInt(zParent) +1;
      }

    }

  } else {

      // case: current elt is not in a new stacking context, has no zindex set.
      // if parent is null, then use default:0 as top-level value,
      // (verify that style.zIndex > childZ ???) relative to document root.
      //   and return the zIndex of child node +1
      // otherwise recurse to parent, and get back a value zIndex relative to root
      //   and return that +1

    if (style.zIndex == 'auto' || style.zIndex == '' ) {
      // this element has no explicitly set zindex,
      // so continue to recurse
      zParent = getZIndex(doc, elt.parentNode, ctr+1, childZ+1) ;
      if (zParent == null) {
        // cannot recurse any farther
        return (childZ)+1;
      } else {
        return parseInt(zParent) +1;
      }
      // here you no get, yoda says
    } else {
      // case: current elt is not in a new stacking context, has zindex set.
      // if parent is null, then use current zindex as top-level value
      // (verify that style.zIndex > childZ ???) relative to document root.
      //
      // otherwise recurse to parent, and get back zIndex relative to root

      // this is a number, but have to continue to recurse to see if this is
      // relative to the local stacking context...
      zParent = getZIndex(doc, elt.parentNode, ctr+1, parseInt(style.zIndex)) ;
      if (zParent == null) {
        // cannot recurse any farther, get the current zindex start from there.
        return parseInt(style.zIndex);
      } else {
        return parseInt(zParent) +1;
      }
      // here you no get, yoda says
    }
   
  }

  // should never get here.
  return null;

}

//
// given doc object, and input element
// consults global var g_nevers
// return true if sufficient cinditions to present the generate password option
//    - active form is a sign up form, active field is a password field, 
//      and no never rule applies to this webpage/website
// return false if not.
// return null on error
//
function shouldOfferGenerate(doc,field) {
  if (doc == null || field == null) {
    return null;
  }
  var offergenerate=false;
  if (1) {
    // unlikely to be the right place for this, but stick this block here to make it work.
    var form = field.form;
    var show_clickable_for_generate = true;
    var show_clickable= true;
    var nevers_rules = check_nevers(doc, g_nevers, doc.location.href);
    if (nevers_rules != null) {
      show_clickable_for_generate = nevers_rules.show_for_generate;
      show_clickable= nevers_rules.show_for_clickable_icon;
    }
    if (show_clickable_for_generate  && chk_form_ask_generate(doc, form) && isInputFieldPassword(doc, field) && show_clickable) {

       // special case
       if (chk_form_changepw(doc,form) && field == lpCheckCurrentPWField(form)) {
         offergenerate = false;
         if(typeof(g_docnum)!='undefined'){
           verbose_log('['+g_docnum+'] form='+LP_getname(form,LP_GETNAME_FAVOR_ID_OVER_NAME) +' field='+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME)   +' appears to be current PW field in a change password form, offergenerate=false');
         }
       } else {
         offergenerate = true;
         if(typeof(g_docnum)!='undefined'){
           verbose_log('['+g_docnum+'] form='+LP_getname(form,LP_GETNAME_FAVOR_ID_OVER_NAME) +' field='+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME)   +' setting up generate click listener on icon');
         }
       }
    }
  }
  return offergenerate;
}

//
// process nevers rules 
//
// pass the document object
// pass the g_nevers object, and current url
//
// return object with 4 values
//    show_for_formfill
//    show_save
//    show_for_autofill
//    show_for_generate
//   
// if url is empty, get from doc.location.href
// return null on error
//
function check_nevers(doc, nevers, url) {
  var retval={
    'show_for_formfill':true,
    'show_for_save':true,
    'show_for_autofill':true,
    'show_for_generate':true,
    'show_for_clickable_icon':true,
  };
  if (g_nevers == null) {
    return null;
  } else {
    if (url == null || url.length<=0) {
      url = doc.location.href;
    }
    var canonized_url = lpcanonizeUrl(url);
    var canonized_tld = lpcanonizeUrl(lp_gettld_url(url));

    for (var idx=0; idx < objectSize(g_nevers); idx++) {
      var never_rule = g_nevers[idx];
      if ((never_rule.domain==0 && lpcanonizeUrl(never_rule.url) != canonized_url) ||
          (never_rule.domain==1 && canonized_tld !=lpcanonizeUrl(lp_gettld_url(never_rule.url)))) {
        continue;
      }
      if (never_rule.type == 'neverformfills') {    // never rule TYPE2
        retval['show_for_formfill'] = false;
      } else if (never_rule.type == 'neveraccounts') {  // never rule TYPE0
        // neversave
        retval['show_for_save'] = false;
      } else if (never_rule.type == 'neverautofills') { // never rule TYPE4
        retval['show_for_autofill']=false;
      } else if (never_rule.type == 'neverautologins') { // never rule TYPE3
            // in this context, treat autologin as subset of autofill
        retval['show_for_autofill']=false;
      } else if (never_rule.type == 'nevergenerates') { // never rule TYPE1
        retval['show_for_generate']=false;
      } else if (never_rule.type == 'nevershowicons') { // never rule TYPE6
        retval['show_for_clickable_icon']=false;
      }
    }
  }

  return retval;
}

//
// given an object, return number of direct children.
// sort of like array.length() for non-arrays
// returns 0 if given an invalid object or on error
//
function objectSize(obj) {
  var x;
  var count=0;
  if (obj == null || typeof(obj) == 'undefined') {
    return 0;
  }
  if(typeof(obj.hasOwnProperty)!='function' && typeof(obj.length)!='undefined'){
    return obj.length;
  }
  for (x in obj) {
    if (obj.hasOwnProperty(x)) {
      count++;
    }
  }
  return count;
}

//
// function to check for account create or registration form
// criteria: 2 or more password fields, or 1 password fields and more than 3
//   inputs
//
// if ASP page then the 2nd criteria will match most everything.
// try changing it to require 1 pw field and 8 or more inputs.
//   why 8?  presume website w/o 2 PW fields will be presenting a typical personal
//   info registration form that has at least:
//   firstname, lastname, address1, address2, city, state, zip, username + password
//
// given doc element and form element
//
// return true if yes, return false if not, or on error
// could return null also on error
//
// maybe move all of these form detection/processing routines into a standalone object
//
// #3 arg, optional.  if true,
// "loosen up formfill identification if found a std login form (twitter)."
//
//
// special case:
//   if text input 'Create your' is found, it strongly suggests this is a signup form.
// special case:
//   if there is a submit button that contains the 'Create' or 'Register' strings,
//   it also suggests this.
//
// 
function chk_form_ask_generate(doc, form, loosen) {
  if (doc == null|| form==null) {
    return false;
  }

  // maybe should use pickFormName here...
  var formid= LP_getname(form,LP_GETNAME_FAVOR_ID_OVER_NAME);
  var cached = formcacheget(doc, formid, 'ask_generate');
  if (cached != null) { 
    g_ctr_formcache_hits++;
    return cached; 
  }
  g_ctr_formcache_misses++;

  var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));

  var pwcount = 0;     // fields of type 'password'
  var nonpwcount=0;   // input fields that of type text/textarea/login
  // behavior tunables
  var MIN_NONPW_FIELDS=3;
  if (loosen) {
    MIN_NONPW_FIELDS=2;  // if a loginform has been found already, consider when 1 pw field + 2 other input fields 
  }

  if (g_aspx_hack && g_found_aspx) {
    MIN_NONPW_FIELDS=7;  // if this is an ASP site, presume that a sign up page with 1 pw will have name/address/etc and differentiate from the ASP login form.
  }
  var MIN_PW_FIELDS_WITH_NONPW_FIELDS=1;
  var MAX_NONPW_FIELDS=100; // from populateToFillForFormFill()
  var MIN_PW_FIELDS=2;
  var MAX_PW_FIELDS=4;  // from lpCheckGenerate()

  // hand-wavy heuristics
  // smells like a sign up form.
  // if the form has a name that contains the 'signup' or 'register' strings,
  // or if the form has a CSS class with same strings, and if
  // form name/class does not have the string 'login' in it, guess
  // it is a sign-up form.
  //
  // sigh.  twitter uses classname of 'signup' for a login form.
  // maybe this test isn't sufficiently reliable.
  //    form.className != null &&
  //    (form.className.toLowerCase().indexOf('signup')>=0 ||
  //     form.className.toLowerCase().indexOf('register')>=0) &&
  //    (form.className.toLowerCase().indexOf('login')==(-1))) {
  //
  var formid_or_name= LP_getname(form,LP_GETNAME_FAVOR_ID_OVER_NAME);
  if (formid_or_name != null && 
      (formid_or_name.toLowerCase().indexOf('signup')>=0 ||
       formid_or_name.toLowerCase().indexOf('register')>=0)  &&
      (formid_or_name.toLowerCase().indexOf('login')==(-1))) {
    verbose_log('form '+formid_or_name+' smells like a sign up form: name/classname');
    formcacheset(doc, formid, 'ask_generate', true);
    return true;
  }

  var found_create_placeholder=false;  // for godaddy.  anyone else?

  // iterate thru form elements
  if (1) {
    var formElements = form.elements;
    for(var j=0;j< formElements.length;j++){
      var elt = formElements[j];

      if (elt.tagName == 'FIELDSET') {
        continue;   // really only care about INPUTs;
      }

      // skipped all disabled fields here
      if(elt.disabled==true)
        continue;

      // case: active INPUT fields but not displayed.  what do you?
      // sometimes, you want to ignore them,
      // sometimes not.  hopefully with the delayed recheck on click,
      // this won't be quite so important.

      // XXX try ignoring non-visible ones
      // turn off the test on expedia's pages
      if ((doctld != 'expedia.com') && (!lpIsVisible(elt))) {
        continue;
      }

      // from LP_setval
      if('text' == elt.type && is_watermark(elt.className) && is_watermark_password(elt)) {
        //I bet this is really a password field masquerading as a text field.
        //Treat it as a password field.
        // NB: this changes the base page
        elt.type = 'password';

      }

      // on disqus.com, potterybarn.com, llbean.com, and other sites, a submit button that 
      // says 'create' strongly suggests that this is a signup form...
      // NB: this test is english specific.
      if ((elt.tagName == 'BUTTON' && elt.type=='submit' && elt.innerText != null && elt.innerText.indexOf('Create')>=0) ||
          (elt.tagName == 'BUTTON' && elt.type=='submit' && elt.innerText != null && elt.innerText.indexOf('Register')>=0) ||
          (elt.tagName == 'INPUT' && elt.type=='submit' && elt.value != null && elt.value.indexOf('Create')>=0) ||
          (elt.tagName == 'INPUT' && elt.type=='submit' && elt.value != null && elt.value.indexOf('Register')>=0) ||
          (elt.tagName == 'INPUT' && elt.type=='submit' && elt.value != null && elt.value.indexOf('Sign me up')>=0) ||
          (elt.tagName == 'INPUT' && elt.type=='image' && elt.value != null && elt.value == 'create')) {
        // trigger loosen logic
        MIN_NONPW_FIELDS=2; 
        verbose_log('form '+formid+' has a signup button, loosening detection requirements');
      }

      if(elt.type=='password'){
        // if page has 'Create your' ... string in the username/password fields,
        //    it certainly suggests that this is a sign up form.  reverts to 2non/1pw form test
        // seen on godaddy registration page
        // NB: english specific
        var phtxt = elt.getAttribute('placeholder');
        if (phtxt != null && phtxt.indexOf('Create your')>=0) {
          found_create_placeholder=true;
          MIN_NONPW_FIELDS=2; 
        }

        // stupid hack for facebook because their pages sometimes have password fields intending you to enter your email password to find friends or whatever, and people hate seeing the autofill bar on every page
        if (doctld == 'facebook.com' && typeof(elt.id) == 'string' && elt.id.match(/^[a-z0-9]{6}_\d{1,2}_ci_password$/)) {
          continue;
        } else if (doctld == 'tdbank.com' && typeof(elt.name) == 'string' && elt.name=='user' ) {
          // tdbank.com has a login form with a type password.  hope this is
          // sufficiently selective.
          nonpwcount++;
          // if nonpwcount...
          continue;
        }
        pwcount ++;
      } else if ('email' == elt.type || elt.type == 'text' || elt.type == 'textarea' || elt.type == 'tel' || 'url' == elt.type) {
        if('text' == elt.type && (elt.name.indexOf('pass')==0 ||
                                  elt.name.toLowerCase().indexOf( gs('Password').toLowerCase())==0)) {
          pwcount++;   // for dslreports.org, and maybe other sites.  grumble.
                       // for many bulletin-board style websites, security is 
                       // acknowleged as a joke, so the password is a cleartext
                       // input field, and the website will likely email 
                       // this password back to the user right when
                       // they create an account on this sort of website

                       // also test against translated string for 'Password',
                       // to be complete.
        } else {
          nonpwcount++;
        }
      }

      if (pwcount >= MAX_PW_FIELDS || nonpwcount >= MAX_NONPW_FIELDS) {
        if (pwcount >= MAX_PW_FIELDS) {
          verbose_log('form '+formid+' is not a signup form, too many pw fields [PW:'+pwcount+'/NON:'+nonpwcount+']');
        }
        if (nonpwcount >= MAX_NONPW_FIELDS) {
          verbose_log('form '+formid+' is not a signup form, too many non-pw fields [PW:'+pwcount+'/NON:'+nonpwcount+']');
        }
        if (!loosen) {  // do not cache result when loosen hack flag is set
          formcacheset(doc, formid, 'ask_generate', false);
        }
        return false;
      }
      if (pwcount >= MIN_PW_FIELDS || (pwcount>=MIN_PW_FIELDS_WITH_NONPW_FIELDS && nonpwcount >= MIN_NONPW_FIELDS)) {
        if (pwcount >= MIN_PW_FIELDS) {
          verbose_log('form '+formid+' is a signup form, has enough pw fields [PW:'+pwcount+'/NON:'+nonpwcount+']');
        }
        if (pwcount>=MIN_PW_FIELDS_WITH_NONPW_FIELDS && nonpwcount >= MIN_NONPW_FIELDS) {
          verbose_log('form '+formid+' is a signup form, has enough pw fields and non-pw fields [PW:'+pwcount+'/NON:'+nonpwcount+']');
        }
        if (!loosen) {  // do not cache result when loosen hack flag is set
          formcacheset(doc, formid, 'ask_generate', true);
        }
        return true;
      }
    }

    // this form doesn't pass muster
    verbose_log('form '+formid+' does not smell like signup form, not enough fields [PW:'+pwcount+'/NON:'+nonpwcount+']');
    formcacheset(doc, formid, 'ask_generate', false);
    return false;
  }

  // empty form; might be an error, don't cache.
  return false;
}

// 
// given a form, check over it.
// return true if it appears to be a form with 3 or more input fields that
//   the formfill logic will work against.
// return false, otherwise.
// could return null on error
// tweaks: attempt to ignore forms that appear to be search forms.
//         cache results on per form basis.  unnamed forms are not cached
// nb: forms can be login form, non-login form, both, and neither
//   (criteria overlap)
//
function chk_form_is_nonlogin_form(doc, form) {
  if (doc == null|| form==null) {
    return false;
  }
  var inputs_threshold = 3;  // TUNABLE
  var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));
  // maybe should use pickFormName here...
  var formid= LP_getname(form,LP_GETNAME_FAVOR_ID_OVER_NAME);

  // case: form has no id.  do not cache it
  var cached = formcacheget(doc, formid, 'is_nonlogin');
  if (cached != null) { 
    g_ctr_formcache_hits++;
    return cached; 
  }
  g_ctr_formcache_misses++;


  // this form smells mostly like a search form.
  if (is_search_form(doc, form)) {
    verbose_log('form '+formid+' appears to be a search form based on name/action, do not try to fill');
    formcacheset(doc, formid, 'is_nonlogin', false);
    return false;

  }

  // this is selectively snipped from sso/firefox/content/fillforms.js:populateToFillForFormFill()
  // and input fields are winnowed out to those that are fillable, and those that aren't.
  // dumb it down for now.
  var totalcount = 0;
  var num_actual_inputs = 0;
  var formElements = form.elements;
  for(var j=0;j< formElements.length;j++){
    var elt = formElements[j];

    if (elt.tagName == 'FIELDSET') {
      continue;   // really only care about INPUTs;
    }
  
    if ('email' == elt.type || elt.type == 'text' || elt.type == 'password' || elt.type == 'select-one' /*|| elt.type == 'textarea' || elt.type == 'radio' || elt.type == 'tel' /*|| elt.type == 'checkbox'*/) {
      // if(elt.type=='select-one' && elt.disabled==true)
      // ignore all disabled fields now
      if(elt.disabled==true)
        continue;
      // ignore forms with more than 100 input elements
      if (++num_actual_inputs > 100) {
        formcacheset(doc, formid, 'is_nonlogin', false);
        return false;
      }
      // case: page has a form with 3 INPUTs of type text, of which
      // 2 are disabled.  perhaps just ignore disabled elements in general?
      if(elt.disabled==true)
        continue;

      // case: active INPUT fields but not displayed.  what do you?
      // sometimes, you want to ignore them,
      // sometimes not.
      // XXX try
      if (!lpIsVisible(elt)) {
        continue;
      }

      if (is_search_field(doc, elt)) {
        verbose_log('form '+formid+' appears to be a search form based on name/classname, do not try to fill');
        formcacheset(doc, formid, 'is_nonlogin', false);
        return false;
      }

      totalcount ++;
      if (totalcount >= 3) {
        verbose_log('form '+formid+' appears to be a non-login form');
        formcacheset(doc, formid, 'is_nonlogin', true);
        return true;
      }
    } // if elt.type
  }  //for

  formcacheset(doc, formid, 'is_nonlogin', false);
  return false;
}

// global cache var
// given #1 document, #2 formid , #3, name of attribute,
// and #4 value associated with this form/name
// return null on error, 
// return true on success.
// NB: value can be empty string or a boolean.  formid, name must be non-empty strings
// change cache variable name later.
function formcacheset(doc, formid, name, value) {
  if (doc == null || formid == null || name == null || formid.length===0 || name.length===0 || value == null ) {
    return null;
  }
  if(typeof(doc.g_form_attr_cache)=='undefined'){
    doc.g_form_attr_cache = [];
  }
  if (doc.g_form_attr_cache[formid]==null) {
    doc.g_form_attr_cache[formid]={};
  }
  doc.g_form_attr_cache[formid][name] = value;
  return true;
}

// global cache var
// given #1 document, #2 formid , #3, name of attribute,
// return a value associated with this form/name
// return null on error, or not found
// change cache variable name later.
function formcacheget(doc, formid, name) {
  if (doc == null || formid == null || name == null || formid.length===0 || name.length===0) {
    return null;
  }
  if(typeof(doc.g_form_attr_cache)=='undefined'){
    return null;
  }
  if (doc.g_form_attr_cache[formid] != null &&
      doc.g_form_attr_cache[formid][name] != null ) {
    return (doc.g_form_attr_cache[formid][name]);
  }
  return null;
}

function formcachereset(doc) {
  if (doc != null) {
    doc.g_form_attr_cache = [];
  }
  return true;
}

//
// expected to be called only on window resize event
//
// calls popupfill_resize() to move stuff around.
// then it resets document.body cached values used in getAbsolutePos()
//
// given no args, returns false
function onresize_handler(evt) {
  var doc = typeof(document) != 'undefined' ? document : evt.target.document;
  var body = doc.getElementsByTagName('body')[0];
  doc.g_posbodyrect_cache = body.getBoundingClientRect();
  var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
  doc.g_posbodystyle_cache = win.getComputedStyle(body, null);
  popupfill_resize();
  return false;
}

//
// given an element, check whether it and all of its parents are showing
// case: INPUT field has style.display==inline-block, computed style==inline-block
// but a parent element has computed style.display=='' but computed style=='hidden'
//    due to class assigment that sets display==none
//
// ack, this is mostly bur not fully duped by firefox/content/util.js:lpIsVisible()
// ref:  http://jsperf.com/recursive
//
// also case seen where input field is created but moved off the screen
//
// special case:
// expedia hides elements by setting a parent DIV's height to 1px, width to 1px, but margin=-1.
// special case:
// dropbox hides elements by placing them into a DIV whose height is set to 45 pixels, (but
//  can grow taller via animation if user navigates page), showing part of the div
//  but hiding all of the input fields within the DIV
//
// perf tweak: add arg#4 (optional) to pass doctld rather than compute each time.
// for expedia
//
// usps.com puts login/pass input fields into a parent div (several parents up) 
//   with height = 0px and overflow=hidden until user hovers over another element
// appears to be a trick to hide content except for screen readers (for visually impaired)
// http://css-tricks.com/the-css-overflow-property/
// http://stackoverflow.com/questions/16678558/css-hide-element-but-keep-width-and-not-height
// checking properties/style on the input or it's parent provides no clue it is not
//   visible, so have to check offsetHeight recursively.  if offsetHeight is set and
//   present then check if it is greater than 0, in case it isn't present
//
// ACK,  0 == ''.  javascript for the win.  Or something
// http://stackoverflow.com/questions/462663/implied-string-comparison-0-but-1-1
//
function checkIsDisplayed(doc, elt, ctr, doctld) {
  var MAX_RECURSE = 50;
  if (elt == doc.body || elt == null || ctr > MAX_RECURSE) {
    return true;
  }
  if (doctld == null) {
    doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));
  }

  try  {
    // try to re-use code
    //return lpIsVisible(elt);

    var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
    var style = win.getComputedStyle(elt);
    //ARGH. style.visibility==hidden
    //  if (style.display != 'hidden') {
    if (style != null && 
        style.display != 'none' && 
        style.visibility != 'hidden' && 
        (elt.offsetHeight == null || 
         elt.offsetHeight === '' || 
         (elt.offsetHeight > 0 || style.overflow != 'hidden')
        ) &&
        !(doctld == 'expedia.com' && style.marginTop=='-1px' && elt.offsetHeight==1) &&
        !(doctld == 'dropbox.com' && elt.id == 'register-partial-container' && elt.offsetHeight<50)
       ) {
      if (checkIsDisplayed(doc, elt.parentNode, ctr+1, doctld)) {
        return true;
      } else {
        // one of it's parents is hidden
        return false;
      }
    } else {
      // this element is hidden
      return false;
    } 
  } catch (e) { }
   
  return true;  // default/error case
  //return false;
}

//
// given document obj
// count how many INPUT fields are present and shown
//
function countInputs(doc) {
  var seen = 0;
  var inputs = doc.getElementsByTagName('INPUT');
  for (var i = 0; i < inputs.length; i++) {
    // only evaluate visible fields -- hope this is sufficient
    if (!checkIsDisplayed(doc, inputs[i], 0 )) {
      continue;
    }
    seen ++;
  }

  return seen;
}


// given a DOM element,
// compute its aboslute position
// return an object containing : left, top, width, height
//
// return a rectangle of 0,0,0,0 if the object is hidden
//
// http://stackoverflow.com/questions/5601659/how-do-you-calculate-the-page-position-of-a-dom-element-when-the-body-can-be-rel
//
function getAbsolutePos(doc, element) {
  g_ctr_getAbsPos++;  // perf ctr

  if (element != null) {
    if (typeof(element.getBoundingClientRect) != 'function') {
      // older browser, like IE8?
      return null;  // returns a null on error
    } else {
      var obj = element.getBoundingClientRect();
      
      // NB: Firefox prior to 3.5 and IE quirksmode returns
      // an ClientRect object with top/bottom/left/right defined
      // but not height/width
      // ref: http://developer.mozila.org/en-US/docs/DOM/element.getBoundingClientRect
      // 
      var width, height;
      if (typeof(obj.width) == 'undefined') {  
        width = obj.right-obj.left;
      } else {
        width = obj.width;
      }
      if (typeof(obj.height) == 'undefined') {
        height = obj.bottom - obj.top;
      } else {
        height = obj.height;
      }


      //Firefox doesn't have doc.body. Use a div we called main instead
      var reference = null;
      if(typeof(doc.body)!='undefined'){
        reference = doc.body;
      }else if(doc.getElementById('main')){
        reference = doc.getElementById('main');
      }

      // case: 
      // document.body itself could be offset and the bounding client
      // rectangle is not actually absolutely positioned like it
      // is expected to be.
      // I think this handles this case.
      // seen: https://vcspweb.virginiacollegesavingsplan.com/pls/prod/twbkwbis.P_wwwlogin
      // var bodyobj = reference.getBoundingClientRect();
      var bodyrect ;
      if (typeof(doc.g_posbodyrect_cache) == 'undefined') {
        bodyrect = reference.getBoundingClientRect();
        doc.g_posbodyrect_cache = bodyrect; 
      } else {
        bodyrect = doc.g_posbodyrect_cache;
      }
      var delta_left=0;
      var delta_top=0;
      var bodystyle ;

      if (typeof(doc.g_posbodystyle_cache) == 'undefined') {
        var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
        bodystyle = win.getComputedStyle(reference, null);
        doc.g_posbodystyle_cache = bodystyle;
      } else {
        bodystyle = doc.g_posbodystyle_cache ;
      }

      //if (reference.style.position == 'relative') {
      if (bodystyle.position == 'relative') {
        delta_left=bodyrect.left;

        // delta_top=bodyrect.top; // WTF, I don't understand. this 
                                  // breaks redstate.com.  No one else seems to
                                  // need this/use it
      }

      return {
        left: obj.left + reference.scrollLeft - delta_left,
        top: obj.top + reference.scrollTop - delta_top,
        width: width,
        height: height
      };
    }
  } else {
    return null;  // returns a null on error
  }
}



// create html fragment for insertion into tab.html
// and return it.
// return a null if there is no user info bits to pass along
//
// for login form, need to get data['sites']
// for just a regular form, need to get data['formfills']
//
// local variables used: autofillsites, autofillsitescount
// formfills, formfillscount, html, x
//
// I suspect this can/should be in the background.js;
//
function createPopupFill(doc, data) {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  var autofillsites;     // if called for login form
  var autofillsitescount;
  var formfills;         // if called for non-login form
  var formfillscount;
  var html="";
  var x;
  var widest=0;
  var MAX_WIDTH=300;  // 300px - if aligned against the parent input element
                      // then perhaps this should be the larger of 300px
                      // or the width of the parent element
  var WIDTH_FAVICON=20;  // size of the favicons (16x16) + padding
  var WIDTH_VISUAL_CUE = 0;
  if (popup_show_menu_expand_visual_cue) {
    WIDTH_VISUAL_CUE = 16;  // size of arrow.png + padding + &nbsp;
  }
         
  var favicons = {};
  if(typeof(data.favicons)!='undefined'){
    favicons = LPJSON.parse(data.favicons);
  }


  var stylefrag="font-size: 14px;font-family: Helvetica,Arial,sans-serif;font-weight:bold;";  
     // from popupfilltab.css, to pass to measureText()

  html = "<div id='popupcontainer'><table id='lptabpopup'>\n";

  // one of data[sites] or data[formfills] should be set.
  // if both are missing, what should be done?

  //////////////////////////////////////////////////
  // site/logins:
  if (typeof(data['sites'])=='undefined') {
    autofillsitescount=0;
  } else {
    // NB: no sort.
    autofillsites = getAutoFillArray(doc, LPJSON.parse(data['sites']), true);
    autofillsitescount = getcount(autofillsites);

    // sort by last touch to retain same order as 
    // the default in tabular display
    autofillsites.sort(function(a,b) { sort_popupfill_bylasttouch(a,b) } );  // XXX SORT ME

    //for(x=0;x<autofillsitescount;x++) {
    // case: on safari, autofillsites[0,3,4] are returned, while count==3
    //
    // ran into null here while testing
    for (x in autofillsites) {
      // use site.useusername rather than site.unecryptedUsername
      var textSource = autofillsites[x].useusername;

      if (autofillsites.hasOwnProperty(x) && autofillsites[x]!=null && autofillsites[x].useusername != null) {
        var text_source  = autofillsites[x].useusername;
        if ( text_source.length <=0) {
          text_source = autofillsites[x].name;  // use the sitename if username is empty
        } 
        var measure_source  = text_source;

        // set sitename, username attribute here... really should keep this internal to 
        // BG, maybe as message from iframe.  stick in TR as proof of concept
        html +="<tr id='trpopuprow"+ofa(x)+"' aid='"+ofa(autofillsites[x].aid)+"' sitename='"+ofa(autofillsites[x].name)+"' username='"+ofa(autofillsites[x].useusername)+"' >\n";

        html +="<td id='tdpopuprow"+ofa(x)+"' aid='"+ofa(autofillsites[x].aid)+"'>\n";

        if(do_experimental_popupfill && typeof(favicons[autofillsites[x].aid])!='undefined'){
          html += "<img src='"+favicons[autofillsites[x].aid]+"' style='padding:2px;'/>";
        }

        html += '<span id=\'spanpopuprow'+ofa(x)+'\' class="popcell shortenstr">';
//        html += '<span class="popcell">';
        html += of(text_source, doc);
        if (popup_show_sitename_suffix) {
          if (autofillsites[x].name != 'undefined' && autofillsites[x].name.length>0) {
            // append the sitename
            var suffix = ' (' +autofillsites[x].name+ ')';
            //html += of(suffix);
            //measure_source  += suffix;
            html += "<br/><p style='padding-left:40px; font-size: 10px; color: gray;'>"+of(suffix, doc)+"</p>";
          }
        } // if popup_show_sitename_suffix

        //html +="</a>\n";  // need the A element to focus properly?
        html += '</span>';

        if (popup_show_menu_expand_visual_cue) {
          html += visual_cue_frag('expand', x) ;  // arg#1 is prefix for objects to be created
        }

        html +="</td>\n";
        html +="</tr>\n";
      
        // measure longest string
        var size = measureText(doc, of(measure_source, doc), null, stylefrag)
        // if (size.width > widest ) {
        if (size.width + WIDTH_FAVICON + WIDTH_VISUAL_CUE > widest ) {
           widest=size.width + WIDTH_FAVICON + WIDTH_VISUAL_CUE;
        }
      } // != null
    }
  }

  //Turn off chrome autocomplete if we have data
  //It competes with our dropdown
  if(autofillsitescount){
    var inputs = doc.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++){
      if(inputs[i].type=='password' || inputs[i].type=='text' || inputs[i].type=='email'){
        inputs[i].setAttribute("autocomplete", "off");
      }
    }
  }

  html += "</table>\n";
  html += "</div>";

  html += "<div id='popupcontainerff'>";
  html += "<table id='lptabpopupformfills' style='display:none'>\n";

  //////////////////////////////////////////////////
  // non-login forms:
  // is this right?  
  if (typeof(data['formfills'])=='undefined') {
    formfillscount=0;
  } else {
    // NB: no sort.
    formfills = LPJSON.parse(data['formfills']);

    formfillscount = getcount(formfills);

    var formtype;
    // sort to put non-cc formfills ahead of formfills.  formtype==0 when non-CC formfill profile,
    // and formtype==1 when it is a credit card.  no other values exist or are expected at present.
    //
    for (formtype=0; formtype<=1; formtype++) {
      for (x in formfills) {
        if (formfills.hasOwnProperty(x) && formfills[x]!=null && formfills[x].decprofilename != null &&
            (formfills[x].profiletype != null && (parseInt(formfills[x].profiletype) === formtype))) {

          // replicate logic from menu.js
          // if this is a non-CC-specific profile but has a CC defined
          // then it should be considered as a cc too
          var hasccstr="";
          if (formfills[x].ccnum != '' && formfills[x].profiletype == 0) {
            hasccstr = "hascc='1' "; 
          }


          html +="<tr id='trpopupffrow"+ofa(x)+"' ffid='"+ofa(formfills[x].ffid)+"' profilename='"+ ofa(formfills[x].decprofilename) +"' formtype='"+ formtype  +"' "+hasccstr+">\n";
          html +="<td id='tdpopupffrow"+ofa(x)+"' ffid='"+ofa(formfills[x].ffid)+"'>\n";
  
          if(do_experimental_popupfill && typeof(favicons[formfills[x].ffid])!='undefined'){
            html += "<img src='"+favicons[formfills[x].ffid]+"' style='padding:2px;'/>";
          }
          var measure_source = of(formfills[x].decprofilename, doc);

          html += '<span id=\'spanpopupffrow'+ofa(x)+'\' class="popcell shortenstr">';
//          html += '<span class="popcell">';
          html +=of(formfills[x].decprofilename, doc) ;
          if (g_creditcard_profile_annotate && formtype==1) {
            // display profile name plus the string 'Credit Card'
            // to ensure it is clear.  formtype==1 for credit card profiles
            var annotate_str = '<span class="cc">('+gs('Credit Card')+')</span>';
            html += annotate_str;
            measure_source += annotate_str;
          }
          html += '</span>';

          if (popup_show_menu_expand_visual_cue) {
            html += visual_cue_frag('expandff', x) ;  // arg#1 is prefix for objects to be created
          }

          html +="</td>\n";
          html +="</tr>\n";
          //var size = measureText(doc, of(formfills[x].decprofilename, doc), null, stylefrag)
          var size = measureText(doc, measure_source, null, stylefrag)

          if (size.width + WIDTH_FAVICON + WIDTH_VISUAL_CUE > widest ) {
             widest=size.width + WIDTH_FAVICON + WIDTH_VISUAL_CUE;
          }
        } // formfills
      }
    } // formtype
  }
  //case: displaying formfills vs loginsites is fragile, as the behavior
  // relies on whether background thread sets sites or formfills in JSON object
  // to CS.  Should make it more robust.

  if (g_do_icon_number_hint) {
    g_icon_numbers['sites'] = autofillsitescount;
    g_icon_numbers['formfills'] = formfillscount;
  }  

  // similar popup actions for the formfill menu, but with modified id's to maintain uniq-ness
  if ( do_popup_actions ) {
    var size;
    var x;
    // may need key shortcut/accelerators for the popup actions ?
    if (formfillscount>0) {
      // display a horizontal line separator
      html += "<tr class='tablerow_sep'><td><hr/></td></tr>\n";
    }
    var first=true;
    for (x in popup_actions_cfg) {
      var class_override = "";
      var str;
      var str_id;
      str = lpgs(popup_actions_cfg[x]['str']);
      str_id = popup_actions_cfg[x]['id'];
      if (first) {
        //class_override = "class='tablerow_firstaction'";
        first=false;
      }
      // row id has 'formfills' appended to distinguish from first table
      html += "<tr id='"+str_id+"formfills' "+class_override+"><td>" + str + "</td></tr>\n";  // put inside HTML Anchor or not?
      size = measureText(doc, of(str, doc), null, stylefrag) ;
      if (size.width > widest) { widest=size.width; }
    }
  } else {
    if (autofillsitescount<=0 && formfillscount<=0) {
      return null;  // if no site info to display, return a null
    }
  }

  html += "</table>\n";  // be correct and close the table.
  html += "</div>";


  // display menu actions
  // if boolean is on, the iframe displays multiple actions
  //
  // case:
  // popup menu actions are being displayed, translate
  // and consider the length of the translated strings as well
  // tweak: compute once per browser start up and cache it, rather than recompute
  // everytime this function is called. 
  //
  if ( do_popup_actions ) {
 
    if(true){
      var navbarstyle = g_hide_navbar ? "display:none;" : "";

      if(g_hide_navbar){
        //By default, only show a small +/More option that will show the more complex navbar popup
        if (g_savesitesuperbox) {
          html += "<div id='lptabnavbarbtn' style='display:none'><center><img src='images/down.png'/><span>More</span></center></div>";
        } else {
          html += "<div id='lptabnavbarbtn'><center><img src='images/down.png'/><span>More</span></center></div>";
        }
      }


      html += "<table id='lptabpopupnavbar' style='background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAA5CAYAAAACwsr5AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYMFA0sO7v2SwAAAclJREFUSMfNllFr2zAUhb8arxuFuqy1TPK47Rfl/z/GpVgP7UsrTXLh7MEpcWLJjqEbs7gIZB+Sc+/ne3212+3Eiuvqx89fqwTlw0PNKkFV3SVv9O/vPL88c//9ni9leRR8u7lJCl6enri+/srr2xvb7fYoKEfq8bXZbLDW0jQN42fK3H+tqgpTG0IMeO+PAimdJOcczrnJeSGJGCNt2xJjRNJsFAi6rkMSXdeBmI1CEsYYxGFf+IVSaDBoDCGcGkwWTlLWYFKAVqE0eEhFiJF92xLOMldIkIrOdggN++i8EOnV1EPGmtqcnGcrfVtV1InM/Qs0ODV4UVrNweDHPo+G/joarEYjXekQDmiEeFbpjLkBieM+YiktaEwDQGOa6QuURuOW2tRTNHKevfN459OFCzGwb/eEGJbRkITtLAhsZy8QcNY1FlYpKWsw0wTyBrMsfVLXSGcuK7DWAmCtnWYptU5eqsu6RhYNZdBw+HTX4KwtMhvFxyAZ74tonLD/H6DBJ6ERw6Hfhjgdu6kYd43J2E1FbhRnPeT67fqBAtDHnsfHlj72y1lCx0k5GJyHqRCcdY3575MSwd3BYAwB738vV9p5j/OXofEHU2KI0D1utpsAAAAASUVORK5CYII=); background-repeat: repeat-x; width:100%; height:"+NAV_BAR_HEIGHT_CSS+"px; position:absolute; left:0px; bottom:0px; margin: 0px; border-spacing: 0;"+navbarstyle+"'><tr>";
      var MINBTNSIZE = 50;
      var NUMBTNS = 0;
      for (var x in popup_actions_cfg) {
        html += "<td align='center' title='"+lpgs(popup_actions_cfg[x]['str'])+"' id='"+popup_actions_cfg[x]['id']+"'><img src='"+popup_actions_imgs[x]+"'/></td>";
        NUMBTNS++;
      }
      html += "</tr></table>";

      if (MINBTNSIZE*NUMBTNS > widest) { widest=MINBTNSIZE*NUMBTNS; }
    }else{
      var size;
      var x;
      // may need key shortcut/accelerators for the popup actions ?
      if (autofillsitescount>0) {
        // display a horizontal line separator
        html += "<tr class='tablerow_sep'><td><hr/></td></tr>\n";
      }
      var first=true;
      for (x in popup_actions_cfg) {
        var class_override = "";
        var str;
        var str_id;
        str = lpgs(popup_actions_cfg[x]['str']);
        str_id = popup_actions_cfg[x]['id'];
        if (first) {
          //class_override = "class='tablerow_firstaction'";
          first=false;
        }
        html += "<tr id='"+str_id+"' "+class_override+"><td>" + str + "</td></tr>\n";  // put inside HTML Anchor or not?
        size = measureText(doc, of(str, doc), null, stylefrag);
        if (size.width > widest) { widest=size.width; }
      }
    }
  } else {
    if (autofillsitescount<=0 && formfillscount<=0) {
      return null;  // if no site info to display, return a null
    }
  }



  // if this sends the iframe off the right side of the browser tab,
  // shrink the tab?  currently the iframe gets shifted so that it
  // docks against the rightside of the browser tab.  don't know if
  // that looks good or not.
  if (widest > MAX_WIDTH) {
    widest=MAX_WIDTH;  // rely on horizontal scrollbar 
  }
  g_popupfill_widest=widest;  // stash as global for now.  for popupfill_create_iframe

  return html;
}

// based on msgpost from stackoverflow.com
//
// given these args:
// 1st arg is string to measure text on    REQUIRED
// 2nd arg is a number referring to font size in pixels.   may be NULL but 2nd or 3rd arg must be preset
// 3rd arg is a string to assign as CSS style for          may be NULL but 2nd or 3rd arg must be preset
//   text length computation
// 4th arg: pass node to add element to, rather than document.body   may be NULL, default to document.body
//
// return null on error, returns an object that contains width and height
//
//
// function measureTextCacheSet(doc, string, stylefrag, value) {
function measureText(doc, pText, pFontSize, pStyle, node) {
    g_ctr_measureText++;   // global

    // perf tweak: use cache results 
    // presume that pFontSize is never used and that pStyle is used.  (which is
    // how I use measureText)
    var cached = measureTextCacheGet(doc, pText, pStyle);
    if (cached != null) {
      g_ctr_measureText_cachehits++;
      return cached;
    }
    g_ctr_measureText_cachemisses++;


    var lDiv = doc.createElement('span'); // span seems more reliable than lDiv
    var lResult=null;  // return null on err
    if (pStyle == null && pFontSize == null) {
      return lResult;
    }
    if (node == null) {
      node = doc.body;
    }
    if (node == null) {
      //For firefox.
      node = doc.getElementById('hiddenel');
    }
    if (node) {
      node.appendChild(lDiv);
      if (pStyle != null) {
        //lDiv.style = pStyle;
        // looks like this does the right thing
        lDiv.style.cssText = pStyle;
      }
      if (pFontSize != null) { 
        lDiv.style.fontSize = "" + pFontSize + "px";
      }
      lDiv.style.position = "absolute";
      lDiv.style.left = "-1000px";
      lDiv.style.top = "-1000px";
      lDiv.innerHTML = pText;
      lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
      };

      // perf tweak: use cache results 
      measureTextCacheSet(doc, pText, pStyle, lResult);
      // check error return ?


      node.removeChild(lDiv);
      lDiv = null;
    }
    return lResult;
}

//------------------------------------------------------
function getAutoFillArray(doc, allsites, includegenpw){
  var autofill = new Array();
  var currenturl = punycode.URLToASCII(doc.location.href);
  var canurl = lpcanonizeUrl(currenturl);
  for(var i in allsites){
    if(allsites[i]['genpw'] && !includegenpw)
      continue;
      
    // Skip saveall sites unless canurl is identical (this is what we do in FF)
    if (false && canurl!="" && typeof(allsites[i]["save_all"])!="undefined" && allsites[i]["save_all"])
      if (canurl!=lpcanonizeUrl(allsites[i]["url"]))
      {
        //alert("Not showing save-all site in menu : canurl="+canurl+" url="+allsites[i]["url"]);
        continue;
      }
    
    autofill[i] = allsites[i];
  }
  return autofill;
}


//
// message handling is not synchronous and no lock on the counter variable
// so it's possible that g_popupfill_shown can get of sync.
// so, ditch the variable and just consult the document and check it instead
//
function is_your_popup_showing(doc) {
  if (doc == null) { return false; }

  var frames =  doc.getElementsByTagName('iframe');
  // this should not trigger cross-domain error as we just check id on the element,
  // not contents within.
  for(var i=0;i< frames.length;i++){
    if (typeof(frames.hasOwnProperty)!='function' || frames.hasOwnProperty(i)) {
      var iframeprefix = MAGICIFRAME;
      if (frames[i].id.indexOf(iframeprefix)==0 ) {
        return true;
        // terminate as soon as a popup is found.
      }
    }
  }
  return false;
}

//
// triggered by 'savesiteicon' IF->BG->CS message chain, initiated from
// popup iframe.  returns void
//
function dosavesiteicon(iframe){

  iframe = iframe ? 1 : 0;

  verbose_log('['+g_docnum+']: dosavesiteicon() iframe? '+iframe);
  verbose_log('['+g_docnum+']: current input form is '+g_popupfill_parent_last.form);

  // this assigns form to the FORM that the INPUT field that the user clicked on
  // belongs to, not necessarily the login form.  bah
  //
  var form = g_popupfill_parent_last!=null ? g_popupfill_parent_last.form : null;

  if(form==null){
    if(g_isfirefox){
      LP.lpOpenEditWindow(0, false, false, null, true)
    }else{
       // option #1: reject completely and switch to the add-site tab 
       // in the iframe with no input from the base website's input fields
       // verbose_log('['+g_docnum+']: reject, no form?');

       // option #2:
       // use new routine in onload.js to process only orphan input fields 
       verbose_log('['+g_docnum+']: looking for orphaned INPUT elements');
       var data = LP_get_form_save_orphans();
       var notificationdata = { url:punycode.URLToASCII(document.location.href), formdata2:data };
       sendBG({cmd:'savethesite',notificationdata:notificationdata,iframe:iframe});

       // don't initiate save-all
       // sendBG({cmd:'startsaveall',iframe:iframe});
       // saveall();
    }
    return;
  }

  //Count up text/password fields
  //
  // XXX: should use logic here to detect password fields
  // and username fields, and use checkIsDisplayed
  // to record fields that user sees
  //
  // CASE: user clicked on INPUT of a non-login form, then clicked to save password.
  // the form that is evaluated will be for the non-login form.  This may be unexpected
  // if there is a login form that is on the same page...
  // E.g. twitter or facebook
  // 
  //
  var inputs = form.elements;
  var text = 0, password = 0, other = 0;
  for(var i = 0; i < inputs.length; i++){
    if (inputs.tagName == 'FIELDSET') {
      continue;   // really only care about INPUTs;
    }
    var t = inputs[i].type;
    if(t=="password")
      password++;
    else if(t=="text" || t=="tel" || t=="email")
      text++;
    else if(t=="textarea")
     other++;
  }

  //Use standard save for very simplistic forms.
  // neimanmarcus.com 
  if(text==1&&password==1&&other==0){
    if(g_isfirefox){
      LP.lpOpenEditWindow(0);
    }else{


      var data = LP_get_form_save(g_popupfill_parent_last.form);
      var notificationdata = { url:punycode.URLToASCII(document.location.href), formdata2:data };
      sendBG({cmd:'savethesite',notificationdata:notificationdata,iframe:iframe});
    }
  }else{

    if(g_isfirefox){
      LP.lpOpenEditWindow(0, false, false, null, true)
    }else{

      // LP_get_form_save_all/LP_get_form_save()
      // does ignore input fields of type=='hidden' 
      // but does not dtect/distinguish hidden/non-visible input fields,
      //   of which there are many.

      // 
      // pass this along to the iframe to process.
      var data = LP_get_form_save(g_popupfill_parent_last.form);
      var notificationdata = { url:punycode.URLToASCII(document.location.href), formdata2:data };
      sendBG({cmd:'savethesite',notificationdata:notificationdata,iframe:iframe});

      // don't initiate save-all
      // sendBG({cmd:'startsaveall',iframe:iframe});

    }
  }
}

function setupIcons(doc, specialsite){
  // hook into new code here:
  // case: login input fields that are not fillable due to existing site info
  // should present clickable icons anyways.
  // relying on the fill MSG requires existing site info

  if (do_experimental_popupfill ) {
    // not sure where to put this, may need to run this earlier.
    // this populates g_nevers[]

    // need data['sites'] here ?  never referenced downstream so the answer is no.
    // the getpopupfillsites CS->BG msg will do the needful internally to BG thread
    // instead of having to get data['sites'] from the BG here.

    // this is for q/d hack to try to catch DOM&CSS changes on this page
    g_input_cnt = countInputs(doc);

    var loggedin = typeof(g_isloggedin)!='undefined' ? g_isloggedin : lploggedin;
    // what is lploggedin ? typo?

    var can_do_setup=false;
    if (g_dologin_clickable || (!g_dologin_clickable && loggedin)) {
      can_do_setup = true;
    }

    if (can_do_setup && (specialsite || checkForLoginForm(doc) || checkDocumentForLoginOrphans(doc) || checkForNonLoginForm(doc) || checkForSignupForm(doc))) {
      var tld = lp_gettld_url(punycode.URLToASCII(doc.location.href));
      if(g_isfirefox){
        //Anything to do here?
      }else{
        sendBG({cmd:"getpopupfillsites", tld:tld});
      }

      // defer to get g_popupfillrows
      //setTimeout(function() { sendBG({cmd:"getpopupfillsites", tld:tld}); },0);

      if (g_do_icon_number_hint) {
        // need to reset this here to forget the state prior to 
        // a recheck.
        g_icon_number_overrides= { 'sites':(-1), 'formfills':(-1) } ;
        // g_icon_numbers will be also be updated soon, after
        // doc_create_clickable_icons calls out to BG with getpopupfillsites
        // and response handler calls createPopupFills.

      }

        //doc_create_clickable_icons();
        // NB: might need to delay the doc_create_clickable_icons() call here by 10ms
        // to give the BG thread time to process the data that will be needed within.
        //doc_create_clickable_icons(null, '', SHOULD_DO_LOGIN_ONLY);
        //
        // create icons for all form fields
        //doc_create_clickable_icons(null, '', SHOULD_DO_ALWAYS);
        // ensure that the getpopupfillsites CS->BG has been processed, and
        // for the gotpopupfillsites BG->CS response to have handled.  ick
        var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
        win.setTimeout(function() { doc_create_clickable_icons(doc, '', SHOULD_DO_ALWAYS, specialsite); }, 50);

        // note: should be safe to call this again with the onload event handler that is
        // set below, as existence of elements are checked for before attempt to
        // create.  must double check.
    }
  }

  setupInputObserver() ;  // track dynamic webpage changes

}

//------------------------------------------------------
// checks all forms on the given document
//
// most of the logic has been carved out and put into chk_form_has_password()
function checkForLoginForm(doc)
{
  var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));

  //This is very rough.
  var forms =  doc.getElementsByTagName('form');
  var found=false;
  for(var i=0;i< forms.length;i++){
    found =  chk_form_has_password(doc, forms[i], true) ;
    if (found == null) {
      // edge case: this form has too many password fields.  abort immediate
      return false;
    }
    if (found) { return found; }  // abort as soon as a login form is found.
  }
  return false;
}

//------------------------------------------------------
// checks all forms on the given document
//
// need to duplicate behavior from sso/firefox/content/fillforms.js: populateToFillForFormFill
// but for now, is dumbed down
//
//
function checkForNonLoginForm(doc)
{
  var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));

  var forms =  doc.getElementsByTagName('form');
  var found=false;
  for(var i=0;i< forms.length;i++){
    found =  chk_form_is_nonlogin_form(doc, forms[i]) ;
 
    if (found) { return found; }  // terminate as soon as a non-login form is found.
  }
  return false;
}

//------------------------------------------------------
// checks all forms on the given document
// for signup forms.  signup forms were treated as a subset of
// non-login forms, but really needs to be handled separately
//
function checkForSignupForm(doc) {
  // var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));

  var forms =  doc.getElementsByTagName('form');
  var found=false;
  for(var i=0;i< forms.length;i++){
    found = chk_form_ask_generate(doc, forms[i]) ;
 
    if (found) { return found; }  // terminate as soon as a signup form is found.
  }
  return false;
}


//
// given a form
// iterate through it and see if something has a password in it
//
// can only have 1 password field;
//
// checkForLoginForm(doc) checks all forms on the page.
// most of this logic comes from checkForLoginForm
//
// return true if the form smells like a login form.
// returns false if the form does not.
// returns null if too many password fields are detected
//   or too many non-password text fields are found.
//   (for checkForLoginForm's benefit)
//
// e.g. forms that let you create a new account and enter your name and password at same time
//
// function misnamed; should be chk_form_is_login()
//
// case: capitalone has a very complicated login form, with subtabs for
// each of its subsidiary businesses. how to deal with this?
//
// add optional 3rd arg - from_checkForLoginForm - set this to be true IFF called
//   from checkForLoginForm() ; this retains the old g_fillaid behavior.
//
// www.telegraph.co.uk presents login/registration forms where the password fields
// that consist of 2 inputs placed on top of each other; the first is of type text, 
// and second is of type password, and has style.display=none.  As soon as you enter 
// text into the password field, the input fields switch, so that you type into
// the input of type=password while the input of type=text becomes hidden.  bah.
//
function chk_form_has_password(doc, form, from_checkForLoginForm) {
  if (doc == null|| form==null) {
    return false;
  }

  // maybe should use pickFormName here...
  var formid= LP_getname(form,LP_GETNAME_FAVOR_ID_OVER_NAME);
  // case: form has no id.  do not cache it
  var cached = formcacheget(doc, formid, 'is_login');
  if (cached != null) { 
    g_ctr_formcache_hits++;
    return cached; 
  }
  g_ctr_formcache_misses++;

  var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));

    //This is very rough.
    var pwcount = 0;     // fields of type 'password'
    var nonpwcount=0;   // input fields that of type text/textarea/login
    var MAX_NONPW_FIELDS=2;
    var MAX_NONPW_ASPX_FIELDS=5;  // to deal with assorted search fields that may be on the same page.

    // make it global.  i hate globals
    //var found_aspx=false;  // toggle to true if it seems like its an ASP/ASP.NET form
                           // in that case, relax number of non-pw fields allowable,
                           // because it seems that the entire page is one big form.

//    if (g_aspx_hack) {
// some asp.net sites are sane.  so maybe just check for the crazier asp sites
// that use the ctl00XX variable names
    if (0) {
      if (form.action != null && form.action.indexOf('.aspx')>0) {
        g_found_aspx=true;
        // formcacheset(doc, formid, 'is_aspx', true);
        verbose_log('detected ASP.NET form, relaxing login form detection');
      }
    } // g_aspx_hack
             

    var washidden = false;
    var formElements = form.elements;
    for(var j=0;j< formElements.length;j++){
      var elt = formElements[j];

      if (elt.tagName == 'FIELDSET') {
        continue;   // really only care about INPUTs;
      }

      if (g_aspx_hack) {
        if ((elt.name.indexOf('ctl00$')===0) || 
            (elt.name.indexOf('ctl00_')===0)) {
          if (!g_found_aspx) {
            g_found_aspx=true;
            // formcacheset(doc, formid, 'is_aspx', true);
            verbose_log('detected ASP.NET form, relaxing login form detection');
          }
        }
      } // g_aspx_hack

      // ignore disabled fields here
      if(elt.disabled==true)
        continue;

      // case: active INPUT fields but not displayed.  what do you do?
      // sometimes, you want to ignore them, (e.g. lankanmon.com)
      // sometimes not.  (e.g. target.com)
      //
      // maybe just ignore non-visible, non-password fields ???
      //
      // XXX try
      //
      // case: page has login form fields that are hidden when first loaded.
      // when user clicks on 'login' link on the page, the form fields un-hide.
      // would need constantly rescan webpage, but that's slow
//      if (!lpIsVisible(elt)) {
//        continue;
//      }
 

      // fold next bit into isInputFieldPassword(doc, elt) ...

      // from LP_setval
      if('text' == elt.type && is_watermark(elt.className) && is_watermark_password(elt)) {
        //I bet this is really a password field masquerading as a text field.
        //Treat it as a password field.
        elt.type = 'password';
        lpdbg('onload', 'switching field from text to password from chk_form_has_password');
      }

      if(elt.type=='password'){
        // stupid hack for facebook because their pages sometimes have password fields intending you to enter your email password to find friends or whatever, and people hate seeing the autofill bar on every page
        if (doctld == 'facebook.com' && typeof(elt.id) == 'string' && elt.id.match(/^[a-z0-9]{6}_\d{1,2}_ci_password$/)) {
          continue;
        }
        if (doctld == 'tdbank.com' && typeof(elt.name) == 'string' && elt.name=='user' ) {
          // tdbank.com has a login form with a type password.  hope this is
          // sufficiently selective.
          nonpwcount++;
          // if nonpwcount...
          continue;
        }

// case: page has 2 forms;  if prior call to fill form has filled in one form, g_fillaid
// will be set on this CS content.  However
// this routine may be later called against the 2nd form.
// allow this test to work only when called from checkForLoginForm() to
// keep old behavior.  turning this off for it may have unexpected
// consequences...
        if (g_fillaid && from_checkForLoginForm) {
          //formcacheset(doc, formid, 'is_login', true);  // cannot cache this because of from_checkForLoginForm 
          return true;
        } else {
          // try: ignore hidden password fields when evaluating.
          // some sites have big forms that contain many input fields and
          // turn on/off functionality by showing/hiding them.
          // hopefully this doesn't break other functionality.
          if (!lpIsVisible(elt)) {
            washidden=true;
            continue;
          }

          if (++pwcount >= 2) {
            formcacheset(doc, formid, 'is_login', false);
            verbose_log('Password Form detection: '+formid+' has too many password fields; do not treat as login form [PW:'+pwcount+'/NON:'+nonpwcount+']');
            // return false;
 
            // when called from checkForLoginForm,
            // this case aborts the outer loop. need to do
            // return null for this case.
            return null;
          }
 
        }
      } else if ('email' == elt.type || elt.type == 'text' || elt.type == 'textarea' || elt.type == 'tel' || 'url' == elt.type) {
        if (!lpIsVisible(elt)) {
          continue;
        }
        nonpwcount++;

        //if (nonpwcount > MAX_NONPW_FIELDS) {
        if ((g_aspx_hack  && nonpwcount > MAX_NONPW_ASPX_FIELDS) ||
            (!g_aspx_hack && nonpwcount > MAX_NONPW_FIELDS)) {
          formcacheset(doc, formid, 'is_login', false);
          verbose_log('Password Form detection: '+formid+' has too many non-password fields; do not treat as login form [PW:'+pwcount+'/NON:'+nonpwcount+']');
          return null; // XXX reminder tag
        }
      }

    }
    if (pwcount == 1) {
      verbose_log('Password Form detection: '+formid+' is a login form, has only one passwd field');
      formcacheset(doc, formid, 'is_login', true);
      return true;
    }
    if(!washidden){
      formcacheset(doc, formid, 'is_login', false);
    }
    // default case
    return false;
}


// given document object + string id (or name) of an input element,
// return the element.
// some pages use inputs with a name instead of id
// return null if nothing found, or on error
//
// NB: routine returns the first match, and favors ID over NAME.
//
// if a web doc has 2 INPUT elements with the same id/name
// (per spec, an element ID is unique per document, but NAME is not necessarily uniq),
// or one element has an ID value which is also the NAME of
// a different, distinct element) then things can go haywire.
// sample cases: redstate.com and walmart.com
//
// also, ID is supposed to be unique per page but it's turning out
// that some websites have multiple elements with the same ID.  bah
// some problem children: southwest.com, muslima.com, amegybank.com.
// Add optional 3rd arg here to restrict lookup to specific TAGNAME?
// This would solve issue with the first two-sites that have DIV, P,
// and INPUT elements with the same ID's, but doesn't solve the
// last one - multiple INPUTs in the same form with the same ID
// and NAME attributes.
//
// possible tweak here is to ignore elements that are hidden?
//
function LP_getElementByIdOrName(doc, id_or_name) {
  if (doc == null || id_or_name==null || id_or_name.length==0) {
    return null;
  }
  // if there are 2 elements with the same ID, browser
  // likely returns the first match.  a document should only have one
  // anyways.  If there are 2 elements with the same ID, browser should
  // return the first.
  // if there is one element with ID==id_or_name and another with NAME==id_or_name
  // then favor ID match over name.
  //
  var el =  doc.getElementById(id_or_name);
  if (el != null) {
    return el;
  }
  var inps = doc.getElementsByName(id_or_name);
  // found one element with the given id/name
  if (objectSize(inps)==1) {
    return inps[0]; 
  }
  // found no elements with the given id/name
  if (objectSize(inps)==0) {
    return null;
  }
  // found two or more elements with the given id/name
  // how do you choose?  try these weightings 
  // that I pulled out of my butt:
  // favor INPUTs over others   (+20)
  // favor non-hidden (+5)
  // favor visible  (+3) less than non-hidden
  // favor INPUT TYPE != hidden  (+10)
  // 
  var scores=[];
  var highest=0;
  var highestidx=(-1);
  for (var x in inps) {
    scores[x] = 0;
    // NB: spec says tagName returns uppercase 
    if (inps[x].tagName == 'INPUT') {
      scores[x] += 20;
      if (inps[x].type != 'hidden') {
        scores[x] += 10;
      }
    }
    if (inps[x].style != null && inps[x].style.display != 'none') {
      // Q/D: to deal with case where this element is displayed but is a
      //  member of another element that is not displayed.  GAAK
      if (checkIsDisplayed(doc, inps[x], 0)) {
        scores[x] += 5;
      }
    }
    if (inps[x].style != null && inps[x].style.visibility!= 'hidden') {
      scores[x] += 3;
    }
    if (scores[x]>highest) {
      highest=scores[x];
      highestidx=x;
    }
  }
  if (highestidx>=0) {
    return (inps[highestidx]);
  } else {
    // if you got here, you lost.
    return null;
  }
}

// return true if a given form input element smells like a password field
// return false if not.  
// return false on error
// expects that elt is an input field.  
function isInputFieldPassword(doc, elt) {
  if (doc == null || elt == null || elt.tagName != 'INPUT') {
    return false;
  }
  var doctld = lp_gettld_url(punycode.URLToASCII(doc.location.href));
  
  if('text' == elt.type && is_watermark(elt.className) && is_watermark_password(elt)) {
    //I bet this is really a password field masquerading as a text field.
    //Treat it as a password field.
    // NB: this changes the base page.  perhaps it shouldn't.
    elt.type = 'password';
  }

  if('text' == elt.type && (elt.name.indexOf('pass')==0 || elt.name.toLowerCase().indexOf( gs('Password').toLowerCase())==0)) {
    pwcount++;   // for dslreports.org, and maybe other sites.  grumble.
  }

  if(elt.type=='password'){
    // stupid hack for facebook because their pages sometimes have password fields intending you to enter your email password to find friends or whatever, and people hate seeing the autofill bar on every page
    if (doctld == 'facebook.com' && typeof(elt.id) == 'string' && elt.id.match(/^[a-z0-9]{6}_\d{1,2}_ci_password$/)) {
      return false;
    } else if (doctld == 'tdbank.com' && typeof(elt.name) == 'string' && elt.name=='user' ) {
      // tdbank.com has a login form with username that has type password.
      return false;
    }
    return true;
  } else {
    return false;
  }
}

//
// is it safe to assume that Object() is always available ?
// checks if the given object is empty aka {}
// utility routine
//
function isEmptyObject(object) {
  return Object.keys(object).length === 0;
}

function LP_getname(elt, reverse){
  if (reverse && typeof(elt.id) == 'string' && elt.id != '') {
    return elt.id;
  }
  if (typeof(elt) != 'undefined' && elt != null) {
    if (typeof(elt.name) == 'string' && elt.name != '') {
     return elt.name;
   } else if (typeof(elt.id) == 'string')
     return elt.id;
   }
   return '';
}


//
// given window as an argument, return its width
//
// window.innerWidth returns the width of the window but sometimes
//   includes the scrollbar, sometimes doesn't.
// creating an invisible element that is the size of this window
// appears to be the most reliable way of getting the width
// of the area inside the scrollbar
//
function getWindowWidth(w) {
  g_ctr_getWW++;
  var ret = w.innerWidth;  // default;
  var measure_window_width = true;  // configure behavior 
  var doc = w.document;

  if (measure_window_width) {
    var reference = null;
    if(typeof(doc.body)!='undefined'){
      reference = doc.body;
    }else if(doc.getElementById('main')){
      reference = doc.getElementById('main');
    }

    var invis = doc.getElementById('_lpinvis');
    if (invis == null) {
      invis = doc.createElement("div");
      invis.id.left='_lpinvis';
      invis.style.left='0px';
      invis.style.right='0px';
      invis.style.top='0px';
      invis.style.height='0px';
      invis.style.visibility='hidden';
      reference.appendChild(invis);
    }

    var win = typeof(window)!="undefined" && window ? window : doc.defaultView;
    var gcs = win.getComputedStyle(reference);
    var ml = parseInt(gcs.marginLeft);
    var mr = parseInt(gcs.marginRight);
    if (invis.offsetWidth>0) {
      if (ml>0 || mr>0) {
        // case: body has explicitly defined width with margins set or
        // margin:auto.
        // i hope this doesn't break other things...
        ret = invis.offsetWidth +  mr+ ml;
      } else {
        ret = invis.offsetWidth;
      }
    }
    // perf tweak: leave this alone rather than constantly create/remove ?
    reference.removeChild(invis);
  }
  return ret;
}

//
// case: check the document for input field elements that
// are not found within a form
//
// return true if a (one) orphaned password element was found
// return false if none were found, or more than one was found.
//
// based off of LP_get_form_save_all() logik
//
// ref: formtest2.html
//
function checkDocumentForLoginOrphans(doc)
{
  var fieldname_blacklist=[];  // list of field names that we explicitly ignore.
  
  // check for tagname==input, type==password
  // if more than 1 type password is found then reject and
  // ignore field names that appear more than once, to replicate behavior
  // seen elsewhere
  var seen_elt_names=[];
  var seen_elt_ids=[];
  var pwcount=0;

  var tagnames = new Array('input');
  for (var j = 0; j < tagnames.length; j++) {
    var inputs = doc.getElementsByTagName(tagnames[j]);
    for (var i = 0; i < inputs.length; i++) {

      // only evaluate visible fields -- hope this is sufficient
      if (!checkIsDisplayed(doc, inputs[i], 0 )) {
        continue;
      }

      if (inputs[i].id != null && inputs[i].id != '' ) {   // 2 or more fields with the same ID.  should be uniq per page
        var x = seen_elt_ids[inputs[i].id] ;
        if (x == null) {
          seen_elt_ids[inputs[i].id] = true;
        } else {
          continue;
          // duplicate field name.  do not consider as password field
        }
      }
      if (inputs[i].name != null && inputs[i].name != '' ) {   // 2 or more fields with the same name.  should be uniq per page
        var x = seen_elt_names[inputs[i].name] ;
        if (x == null) {
          seen_elt_names[inputs[i].name] = true;
        } else {
          continue;
          // duplicate field name.  do not consider as password field
        }
      }

      if (lp_in_array(LP_getname(inputs[i], LP_GETNAME_FAVOR_ID_OVER_NAME), fieldname_blacklist)) {
        verbose_log("fieldname "+fieldname_blacklist[x]+" is blacklisted, skipping");
        continue;
      }

      if(inputs[i].form == null && inputs[i].type == 'password') {
        pwcount++;
        if (pwcount>=2) {
          verbose_log('too many orphan password fields found');
        }
      }
    }
  }
  if (pwcount==1) {
    verbose_log('orphan login & password field found');
    return true;
  } else {
    return false;
  }
}



// 29thdrive experiment:
//      if (g_icon_hover) {
function do_icon_mouseover(doc, icon_container_id, field) {
  if (doc == null || icon_container_id == null ) {
    return false;
  }

  if (g_use_grey_icons && is_your_popup_showing(doc)) {
    // when using grey icons, don't do this as the clickable cancel override
    // has been put into place.
    return false;
  }

  // 1. get the clickable icon div.
  // 2. if found, change to something different.
  var iconid = icon_container_id + '_icon';
  var img = doc.getElementById(iconid);
  if (img != null) {
    // this is lpchrome/images/icon_gray16.png but passed through
    // base64
    //img.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAB3RJTUUH3QEQEBUe3pGjeQAAAAlwSFlzAAAewgAAHsIBbtB1PgAAAARnQU1BAACxjwv8YQUAAAFzSURBVHjaNVE9S0MxFD3Je1p91EHBTwRBnCriKn6AOji4qaNgwQ6Co27i4i8QF12d3BSsxSJuLrpUBRFEXUQoghQtVvv6+l7iSdomJNzcc+65J4ko4LM/vf7R5yghBATM0FwKfqU9k8qIfOfBzeuggaSFRR02+y96V52RhVxKETSwY6ckbAoUYnh2ZcGrHR2MYpO7iymswbM5qkiZ0MoKx7GBYQyRMo9xTKBabyiF1La/j0MmVjCDLnzjCs0NgiJXs1srHvCObizxdIomtFEr5HQhQjK3SAiYLlr3s5hjy31cM3Y1zCyQGVJLWgLYoIQyY8W8jlDBHoMWLKLD+rnAC+lGLTIlEcV/yO/BAKMnEsdo+Y+gMoSyDpkOqJCkj0ucE0rwTUpsWDUmH7W29/jCGSZxy+iOdfdUNG9JDwFvoazYMbKkOjjBkX2miGYDIadzvoWrXEbWp5+AGVPmI54XRewks8sxT+jGZ9e+W5NSedvd/gcoz5VCS1KSLwAAAABJRU5ErkJggg==";
    // this is from lpchrome/images/down.png
    //img.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MTI0QjIzNEI2NEMxMUUwQTA1REYyNjZEM0REQ0I5NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MTI0QjIzNUI2NEMxMUUwQTA1REYyNjZEM0REQ0I5NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxMjRCMjMyQjY0QzExRTBBMDVERjI2NkQzRERDQjk3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkxMjRCMjMzQjY0QzExRTBBMDVERjI2NkQzRERDQjk3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ODLALAAAAP1JREFUeNqckjFOAzEQRWccgiuUNuICuQASB8gJKHMeSrqINLSUKdIjUVLQJWVOQKpICOHdeNYevhV5BdYmSGvryau1n+drd1hVqc8w1HP0Fi/yAyJbLJaZ/8vO6Xgr7l19EzQ+XdlLa/h0EMNkjTHvrTgcmDfU2tZNuBtw7JSUk8g0VF2kiL+ZRNXPqN0zxKiVl/W3l3GZaYtLH5i6Jy71ODMHu7JiYgw2Wox4rPYCLKAuMTErxYOIc15uAbkz4gisstSEoJXIAlDmlJiYgq8k1tLsnPfXgDLnOucVPFfS4KPEezTGB6BM+x8lBCr7HfuPiHXA6yUq/Nn9EWAAtt8inYJri+wAAAAASUVORK5CYII=";
    //img.style.backgroundColor='#b2b2b2'; // needed because down.png FG is white, BG is transparent
    // this is from lpchrome/arrow.png rotated
    //img.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAABGdBTUEAALGPC/xhBQAACkFpQ0NQSUNDIFByb2ZpbGUAAHgBnZZ3VFPZFofPvTe90BIiICX0GnoJINI7SBUEUYlJgFAChoQmdkQFRhQRKVZkVMABR4ciY0UUC4OCYtcJ8hBQxsFRREXl3YxrCe+tNfPemv3HWd/Z57fX2Wfvfde6AFD8ggTCdFgBgDShWBTu68FcEhPLxPcCGBABDlgBwOFmZgRH+EQC1Py9PZmZqEjGs/buLoBku9ssv1Amc9b/f5EiN0MkBgAKRdU2PH4mF+UClFOzxRky/wTK9JUpMoYxMhahCaKsIuPEr2z2p+Yru8mYlybkoRpZzhm8NJ6Mu1DemiXho4wEoVyYJeBno3wHZb1USZoA5fco09P4nEwAMBSZX8znJqFsiTJFFBnuifICAAiUxDm8cg6L+TlongB4pmfkigSJSWKmEdeYaeXoyGb68bNT+WIxK5TDTeGIeEzP9LQMjjAXgK9vlkUBJVltmWiR7a0c7e1Z1uZo+b/Z3x5+U/09yHr7VfEm7M+eQYyeWd9s7KwvvRYA9iRamx2zvpVVALRtBkDl4axP7yAA8gUAtN6c8x6GbF6SxOIMJwuL7OxscwGfay4r6Df7n4Jvyr+GOfeZy+77VjumFz+BI0kVM2VF5aanpktEzMwMDpfPZP33EP/jwDlpzcnDLJyfwBfxhehVUeiUCYSJaLuFPIFYkC5kCoR/1eF/GDYnBxl+nWsUaHVfAH2FOVC4SQfIbz0AQyMDJG4/egJ961sQMQrIvrxorZGvc48yev7n+h8LXIpu4UxBIlPm9gyPZHIloiwZo9+EbMECEpAHdKAKNIEuMAIsYA0cgDNwA94gAISASBADlgMuSAJpQASyQT7YAApBMdgBdoNqcADUgXrQBE6CNnAGXARXwA1wCwyAR0AKhsFLMAHegWkIgvAQFaJBqpAWpA+ZQtYQG1oIeUNBUDgUA8VDiZAQkkD50CaoGCqDqqFDUD30I3Qaughdg/qgB9AgNAb9AX2EEZgC02EN2AC2gNmwOxwIR8LL4ER4FZwHF8Db4Uq4Fj4Ot8IX4RvwACyFX8KTCEDICAPRRlgIG/FEQpBYJAERIWuRIqQCqUWakA6kG7mNSJFx5AMGh6FhmBgWxhnjh1mM4WJWYdZiSjDVmGOYVkwX5jZmEDOB+YKlYtWxplgnrD92CTYRm40txFZgj2BbsJexA9hh7DscDsfAGeIccH64GFwybjWuBLcP14y7gOvDDeEm8Xi8Kt4U74IPwXPwYnwhvgp/HH8e348fxr8nkAlaBGuCDyGWICRsJFQQGgjnCP2EEcI0UYGoT3QihhB5xFxiKbGO2EG8SRwmTpMUSYYkF1IkKZm0gVRJaiJdJj0mvSGTyTpkR3IYWUBeT64knyBfJQ+SP1CUKCYUT0ocRULZTjlKuUB5QHlDpVINqG7UWKqYup1aT71EfUp9L0eTM5fzl+PJrZOrkWuV65d7JU+U15d3l18unydfIX9K/qb8uAJRwUDBU4GjsFahRuG0wj2FSUWaopViiGKaYolig+I1xVElvJKBkrcST6lA6bDSJaUhGkLTpXnSuLRNtDraZdowHUc3pPvTk+nF9B/ovfQJZSVlW+Uo5RzlGuWzylIGwjBg+DNSGaWMk4y7jI/zNOa5z+PP2zavaV7/vCmV+SpuKnyVIpVmlQGVj6pMVW/VFNWdqm2qT9QwaiZqYWrZavvVLquNz6fPd57PnV80/+T8h+qwuol6uPpq9cPqPeqTGpoavhoZGlUalzTGNRmabprJmuWa5zTHtGhaC7UEWuVa57VeMJWZ7sxUZiWzizmhra7tpy3RPqTdqz2tY6izWGejTrPOE12SLls3Qbdct1N3Qk9LL1gvX69R76E+UZ+tn6S/R79bf8rA0CDaYItBm8GooYqhv2GeYaPhYyOqkavRKqNaozvGOGO2cYrxPuNbJrCJnUmSSY3JTVPY1N5UYLrPtM8Ma+ZoJjSrNbvHorDcWVmsRtagOcM8yHyjeZv5Kws9i1iLnRbdFl8s7SxTLessH1kpWQVYbbTqsPrD2sSaa11jfceGauNjs86m3ea1rakt33a/7X07ml2w3Ra7TrvP9g72Ivsm+zEHPYd4h70O99h0dii7hH3VEevo4bjO8YzjByd7J7HTSaffnVnOKc4NzqMLDBfwF9QtGHLRceG4HHKRLmQujF94cKHUVduV41rr+sxN143ndsRtxN3YPdn9uPsrD0sPkUeLx5Snk+cazwteiJevV5FXr7eS92Lvau+nPjo+iT6NPhO+dr6rfS/4Yf0C/Xb63fPX8Of61/tPBDgErAnoCqQERgRWBz4LMgkSBXUEw8EBwbuCHy/SXyRc1BYCQvxDdoU8CTUMXRX6cxguLDSsJux5uFV4fnh3BC1iRURDxLtIj8jSyEeLjRZLFndGyUfFRdVHTUV7RZdFS5dYLFmz5EaMWowgpj0WHxsVeyR2cqn30t1Lh+Ps4grj7i4zXJaz7NpyteWpy8+ukF/BWXEqHhsfHd8Q/4kTwqnlTK70X7l35QTXk7uH+5LnxivnjfFd+GX8kQSXhLKE0USXxF2JY0muSRVJ4wJPQbXgdbJf8oHkqZSQlKMpM6nRqc1phLT4tNNCJWGKsCtdMz0nvS/DNKMwQ7rKadXuVROiQNGRTChzWWa7mI7+TPVIjCSbJYNZC7Nqst5nR2WfylHMEeb05JrkbssdyfPJ+341ZjV3dWe+dv6G/ME17msOrYXWrlzbuU53XcG64fW+649tIG1I2fDLRsuNZRvfbore1FGgUbC+YGiz7+bGQrlCUeG9Lc5bDmzFbBVs7d1ms61q25ciXtH1YsviiuJPJdyS699ZfVf53cz2hO29pfal+3fgdgh33N3puvNYmWJZXtnQruBdreXM8qLyt7tX7L5WYVtxYA9pj2SPtDKosr1Kr2pH1afqpOqBGo+a5r3qe7ftndrH29e/321/0wGNA8UHPh4UHLx/yPdQa61BbcVh3OGsw8/rouq6v2d/X39E7Ujxkc9HhUelx8KPddU71Nc3qDeUNsKNksax43HHb/3g9UN7E6vpUDOjufgEOCE58eLH+B/vngw82XmKfarpJ/2f9rbQWopaodbc1om2pDZpe0x73+mA050dzh0tP5v/fPSM9pmas8pnS8+RzhWcmzmfd37yQsaF8YuJF4c6V3Q+urTk0p2usK7ey4GXr17xuXKp2737/FWXq2euOV07fZ19ve2G/Y3WHruell/sfmnpte9tvelws/2W462OvgV95/pd+y/e9rp95Y7/nRsDiwb67i6+e/9e3D3pfd790QepD14/zHo4/Wj9Y+zjoicKTyqeqj+t/dX412apvfTsoNdgz7OIZ4+GuEMv/5X5r0/DBc+pzytGtEbqR61Hz4z5jN16sfTF8MuMl9Pjhb8p/rb3ldGrn353+71nYsnE8GvR65k/St6ovjn61vZt52To5NN3ae+mp4req74/9oH9oftj9MeR6exP+E+Vn40/d3wJ/PJ4Jm1m5t/3hPP7pfImIgAAAAlwSFlzAAALEwAACxMBAJqcGAAAACtJREFUCB1j1NDQ+M+AAzBdv36dEZscSJwJJIGuAM7///8/AwyDrICxQTQAFqce+qdQtUgAAAAASUVORK5CYII=";

    // from sso/img/down.png
    // img.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMiSURBVHjaYvz//z8DJQAggFhABKP+dCDBCBZgYmKoNdIUa5IW5fz7789fkCxQjJHh1cefzCevvJ7+79+/LLBCoL3/L2QwAAQQ2ACGX/8YGH7+ARvCys6s15xlwuBhLcf85fd/hn9//zHwcTAznL72isExer3m1+9/oVZDLAQIIIgLuJgZ/oNs+wcW+8nF/J/h+EsGhoVnGBi+f/nB4KXGzKDJAbKA4RfDf6j1bMxgxQABxARzDgMTI8xbf0ACbz4zMFx58p3hysNvDI9ef2cAOh2oH2QFyO3/IXqAACCAwC74/++/JMP3PyIMf/7//PnzD++v30B1//4yMP78zvD/13egkewMf4Bi37784mT49kcN6FU2Bk6Wj0CtjwECCGwAHy/7Nl0dMVmgou+MP/4Ii/CzMdz89pPhx9fvDD+B+PvX/ww8XKwMNkYSFl/+/NvLwcbMeePZ59dArZoAAQQ2gOM/o1BbkbWwrqogw6/ffxjEuBkZjh7+wvDr+08g/sHw/sM/BklBMYYZzdbsnGyMMm8//2EIKdoPDgSAAAKHwauXn5OnLb30W5CXjWHjtX8M0Us+MWy79IWBEeh8lj8/GQ5efsfg1XCJoXPlXQZhXhaG2atuMjx48DETpBcggCCByMZ8YM366/OWbbnJ4KjGCgy4Lwy3n35l+PfzB8PfXz8Z7j/9xHDy8huGYCtRhkPn3zIsWntrLQMz03qQVoAAYoKmnj9/GZkaCjuP32H/9YWhwYOb4fvn7wxfgPjrl28MH999YaiJlGMw1RBgKOo5+/T7rz+VDOxMP0FaAQIIEY1cLC9ePftcmN547JefCS9DohU3w7OXXxiePfvEEGYtzFASpsRQ3Hee4dbNNw0MnKy3YdEIEEAs8EQNEmBn2bJj74OOkp4zdX3FxgxvgTa/fcvBMKtQh6F3xS2GZZvuTmUQYJ/DgJR9AAIIYgAsDTEDGZws9RNnX5JiY2VKaYzXBEr9Z5i4+g5Dw8Rzaxk4WHIZ0PIeQACxYGQvUIrkYMrqnnP5xZGLr0rYWZlZDxx/NgVoSyVQDiPrAgQQI6XZGSDAAAEPO32oRnsoAAAAAElFTkSuQmCC";

    // spend some time inside xpaint
    // red/down
    //img.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAIJJREFUOBHFkVEOgDAIQ8HD6pk87ZaajBTGNpOZyI8OXmuHeooU2ahjQ/tIzeAu74MwawaXqvBglAwM2FZmgMbKJIqhcQYzk0zsDDh+TBLFzCr/xhHId46MM0CkCKDXKpt9t4P2FTxXO2C2uwIPERnFO+A53qcGEc7O3Q4yaNb736ACBWFHcQNd/LIAAAAASUVORK5CYII=";
    if (g_use_grey_icons) {
      // this is from lpchrome/icon_on.png
      img.src="data:image/png;base64," +
              "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ"+
              "bWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp"+
              "bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6"+
              "eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz"+
              "NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo"+
              "dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw"+
              "dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv"+
              "IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS"+
              "ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD"+
              "cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNl"+
              "SUQ9InhtcC5paWQ6REJBNTQwODI2QzFGMTFERjk4N0E5RjU1REE4MTU2NEQiIHhtcE1NOkRvY3Vt"+
              "ZW50SUQ9InhtcC5kaWQ6REJBNTQwODM2QzFGMTFERjk4N0E5RjU1REE4MTU2NEQiPiA8eG1wTU06"+
              "RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQkE1NDA4MDZDMUYxMURGOTg3"+
              "QTlGNTVEQTgxNTY0RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQkE1NDA4MTZDMUYxMURG"+
              "OTg3QTlGNTVEQTgxNTY0RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1w"+
              "bWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pnm5Gs8AAACzSURBVHjapFKBDcIwDMu4YCfkBPiAEzgB"+
              "PukJ/YCewAfsFE7YB2FFHgqmXTXVUrTKc9w0icg/dIkHvitGcEfZQBbFJQyR3L/k+Aht0eDlhIYb"+
              "lbi5ZpBxJvGE0j13kQY4gQ1/MKBEpSbeK+Y3PHPF5xw2bmxFOEgnug1KPch4VvQnN3Khfnwx7ZkC"+
              "40oJibbQoKmu8kxi3buJwZlEx0eXHFrPUJQ9UnWp0GwZzKxrjG8BBgC/TVZ9wpE2DQAAAABJRU5E"+
              "rkJggg==";
    } else {
      img.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAIpJREFUOBHFkdENgCAMRMEt9EtHczEdzT/X0JwJzbUUMMHE/gDt3aOUuM3jFTpi6PA+VgGsx/maxVoB7MsUuFCiQQNtCgEg0YJYMzwKUIN4ZgXg9m0n1szayN9YEvKbrUYB0JIVIJfCq303g3QL1tYMWJs9gYtoGcEz4Dr2VYAVe+dsBp6olvsfcAN/QUfiOuXV/wAAAABJRU5ErkJggg==";
    }
    
    // use a green/down if formfills icon is now green
    // use a blue/down if the blue 'to save' icon is there
    var ic = doc.getElementById(icon_container_id);
    if (ic != null) {
      var fillhint = ic.getAttribute('intrinsic');
      if (fillhint == 'formfills') {
        if (g_use_grey_icons) {
          // photoshopped glow: icon_green2_hover.png
          img.src="data:image/png;base64,"+
                  "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK"+
                  "T2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AU"+
                  "kSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXX"+
                  "Pues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgAB"+
                  "eNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAt"+
                  "AGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3"+
                  "AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dX"+
                  "Lh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+"+
                  "5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk"+
                  "5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd"+
                  "0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA"+
                  "4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzA"+
                  "BhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/ph"+
                  "CJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5"+
                  "h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+"+
                  "Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhM"+
                  "WE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQ"+
                  "AkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+Io"+
                  "UspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdp"+
                  "r+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZ"+
                  "D5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61Mb"+
                  "U2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY"+
                  "/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllir"+
                  "SKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79u"+
                  "p+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6Vh"+
                  "lWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1"+
                  "mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lO"+
                  "k06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7Ry"+
                  "FDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3I"+
                  "veRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+B"+
                  "Z7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/"+
                  "0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5p"+
                  "DoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5q"+
                  "PNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIs"+
                  "OpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5"+
                  "hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQ"+
                  "rAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9"+
                  "rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1d"+
                  "T1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aX"+
                  "Dm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7"+
                  "vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3S"+
                  "PVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKa"+
                  "RptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO"+
                  "32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21"+
                  "e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfV"+
                  "P1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i"+
                  "/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8"+
                  "IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADq"+
                  "YAAAOpgAABdvkl/FRgAAAsxJREFUeNqk1E+IlVUcxvHPe+65772OXi+jaaURiYhEhDCI5rQIaiG0"+
                  "ciP9QQgiCUQiwsjchLaKWkgtAsE2QSBEZJtwE4pS1ELHXGQJJZLmmBLjdJ0795573hbvNAhCm57d"+
                  "s3i+/Pid5/yKqorFed7efHbTHneWdkXEjFSIAVmtQMqIlf6CL+dmT205d2SSQ8XtKu5e8eX2I5qZ"+
                  "diZWNDIxLQAXlDM5MIhUgdygj/nojx0n9saXZjwvYFmmMaJMxB4GdJYQRoTa6i/A8zj9zFgksWfG"+
                  "zoComWpITLT6bBz33cRpBza8RbhK56pHNk4abjrL5ocpe4wlGomQqDRCQL2XxJI+YyPDpSds1nHQ"+
                  "Dtat4j4uOQyGvuKhDnmWsl5Fo1AFEWVVj7ws0PrTFm8uruZ9+zxq66L/1CmmL9KNlAPKJJSKICvI"+
                  "tBL5Ou2+c8PDfjcDXrfLj75YBL08+yLdOcppmkMa5KyIIShItEsTG3YZx3UnfeSo97zhbn3rgsc6"+
                  "a63sPGXcWsevfM3N2wRFLCKKTKv0vYP+S5MeN+WHRd9ceZJLtwiK4P9oPtXFpApVQoj0Bpp2aHpG"+
                  "0xpPeu6e3D4HNa3RtE3Ts1z+i9AiE3JWGUXmEj/9wrWLzLeccewe0AfewQqu/calX5EIbbIqCCoJ"+
                  "g5LcJXXsbu1XLIS3eEHTxCLstOMMV5CXk8uaRRUklVQwCAwD8ysd8Mpi8NzN89yYdsMIPGE96X5u"+
                  "ZVJkEOShKgyGCilQRe606bFuapvtPrTeXq7O0W9ba6fXfKY5tZXLs+jQCwwLowExZskw0B/Vf+V2"+
                  "m7HomzNHat99oA5MXfHxzCF0aXaYC+SFicjxk9WOrUrhaYNGfW9irKdrPEjI9P49JSWNLqPAPFJg"+
                  "2CBxeLXPi6qKxQX2T5xf/6q58eVirqsRqrqodx82gVH9WPoFsff3qcmfj07y7j8DAGqEEm3dEpzY"+
                  "AAAAAElFTkSuQmCC";
        } else {
          img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAIZJREFUOBHFkVEOgCAMQ8Er6Zn0TN7JO2FKAunqABNM3I9hbZ9jxLCvKUzUMpHN0QpI5/Waxd4KiMcWWGjR4IG3VAWgMYJoGBkD6EG8sAHw+DqJho2Xn7Fl5DurJzIAI6kBvVKe9t0Oyl/wHe3AePUKLGJkFO+A9az1AGr2zo8deKZe73/ADcgpR6QKcN6SAAAAAElFTkSuQmCC";
        }
      } else if (fillhint == 'offersave') {
        // this intrinsic is set in handle_form_text_change() when icon changes to blue
        img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAHtJREFUOBHFUEEOwCAIg/3/zy7dohTQ6eKScVAibaVVkVJko44N7kVtAm/2YGwTUF0zAzKwtZoAHmYikQyOE3gS6ZGdAPuKm0Syw7LzEZA9R0yKLgKwZq3e7LsM6i+4Zxk4LGfAA/RYGcUZ3C92pgxstNalDNZohvpf4AST5TYKpjUcWQAAAABJRU5ErkJggg==";
      } else if (fillhint == 'generate' && g_use_grey_icons) {
        if (0) {
           // a cog
           img.src = 'data:image/png;base64,'+
                   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGF'+
                   'Vd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8'+
                   'AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWa'+
                   'GVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJP'+
                   'wG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzY'+
                   'Zi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0'+
                   'HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgj'+
                   'ONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyo'+
                   'Bc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrY'+
                   'BbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiE'+
                   'hcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrB'+
                   'DgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfS'+
                   'Pqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1c'+
                   'AdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0n'+
                   'fS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8e'+
                   'k6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWW'+
                   'ing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8O'+
                   'okmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/'+
                   'wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83'+
                   'Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAmFJREFUOBGNU0tLclEUXfdmD7PQRAcFajURJQ1UDCWc'+
                   'RLPIYYMICrJp4Kg/0B9RaRIRBNLEmU505CvEgUHgQIie9H7ZXfvjXmz2Hbh377Nf5+y111H62vr4'+
                   '+ADX09OTSO7b7TYoV1dXxXZ0dASv1yufGLTf5OSkqjKIifV6Xex2ux2NRgPlchnU9TUxMYFisYhu'+
                   'twvqzFleXnYpj4+P/YuLC1xdXWFjY0OP/y+ZyWRgen5+xuXlJfL5PLRiSKVSf5JLpRLcbrd8g46D'+
                   'gwO8vLxApZGJDw8POD4+NmLYxtLSEnZ2dgSH9fV1w0eFhe/v7yEYfH9/w+VyYXd31wja3t7G7e0t'+
                   'hoaGoCgKWq0WBoskk0lMTU1B0YDpa2AYiVSy2SwODw9hsVgwPj4ObVBgq5SVSgUjIyNGvFqr1YzN'+
                   'oEKkZ2dnEYvFEIlEMDMzI8UGY6ibCODm5qbYCUwgEMDW1hZOT0+xuLiIlZUVGRnHTR7op5MXjFH2'+
                   '9/f7nPnd3R0cDoeAw2osXCgU5HT6Op0OiIteIBgMSksmXo1gvL29YXp6Wm7C3/z8PPb29gTIhYUF'+
                   'uYnh1BSr1YrX11eo4XAYfr8fPp/vzxj1YLJRP1W3UZ6dncFms0Gdm5uDx+PB8PCwcJ/OtbU1JBIJ'+
                   'NJtNbmXlcjnE43Gk02nZV6tV/Pz8QOn1en1WOz8/x83NDT4/P3F9fS1B7PPk5ET0aDQqxCEnnE4n'+
                   'vr6+5FBh4tjYmIyIye/v7/JYzGazUYgViBF5wUnwtmyLHDHRyHnTwUVgyEwSh1QNhUJiHx0d/dez'+
                   'qsor5QF88r82uw4o+Cxa/gAAAABJRU5ErkJggg==';
         } else {
           // levi's honeycomb, photoshopped
             img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAMAAADjcdz2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMi1jMDAxIDYzLjEzOTQzOSwgMjAxMC8xMC8xMi0wODo0NTozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNjA0Rjg4Mzc0MjE2ODExODIyQUZGNkY2QjZFRjUzOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDNUYwRTcyMUYzRDcxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDNUYwRTcyMEYzRDcxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTEuMCBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOTA0Rjg4Mzc0MjE2ODExODIyQUZGNkY2QjZFRjUzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxNjA0Rjg4Mzc0MjE2ODExODIyQUZGNkY2QjZFRjUzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtO3ZmsAAAAYUExURaenp21tbUlJSTs7O////4KCgpeXl729vX3hOOsAAAAFdFJOU/////8A+7YOUwAAAHlJREFUeNp8UFsOAyAMog/k/jcerWbZ1zRGgoVS0bsOeS7CvbIqfwmYqAcbJHOIJOM0FIYZALO8Ac3b+eoC7Yq4fvST0Mp6HWXFdInn310lEzbjSzdiaDJpFdeUG+FIuFm2y8I9OabOZtLVQejNMulK/6b9+Y+PAAMAF0ADvm9mwVkAAAAASUVORK5CYII=";
         }
      }
    } // if ic


  }
  if (g_do_icon_number_hint) {
    var nid = icon_container_id + '_numspan';
    var numspan = doc.getElementById(nid);
    if (numspan != null) {
      // change background of icon
      if (g_icon_shading) {
        numspan.style.backgroundColor="#CCFF99";
      } else {
        // change background of icon
        // numspan.style.display='none';
        // There was more code here that I never checked in.
        // This made more sense when playing around with the numeric hint
        // next to the clickable icon, rather than over it.
        //
      }
    }
  }
  return;
}
        
// 29thdrive experiment:
//      if (g_icon_hover) {
function do_icon_mouseout(doc, icon_container_id, field) {
  if (doc == null || icon_container_id == null ) {
    return false;
  }

  if (g_use_grey_icons && is_your_popup_showing(doc)) {
    // when using grey icons, don't do this as the clickable cancel override
    // has been put into place.
    return false;
  }

  // logic:
  // 1. get the clickable icon div.
  // 2. if found, determine intrinsic
  // 3. if instrinsic is set, revert to corresponding image
  // 4. if not, revert to default
  var iconid = icon_container_id + '_icon';
  var img = doc.getElementById(iconid);
  if (img != null) {
    var ic = doc.getElementById(icon_container_id);
    if (ic == null) {
      return false;
    }
    var fillhint = ic.getAttribute('intrinsic');
    if (fillhint == null || fillhint==='' || (fillhint !== "sites" && fillhint !== "formfills" && fillhint !== "generate" && fillhint !== "offersave" )) {
      fillhint='default';
    }
    if (g_use_grey_icons) {
      if (fillhint == 'default' || fillhint == 'sites') {
        // this is from lpchrome/icon_off.png
        //just stick this here for now to try it out, otherwise
        // should just change icon_imgs['default']
        img.src = 'data:image/png;base64,' +
                   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ'+
                   'bWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp'+
                   'bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6'+
                   'eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0'+
                   'MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo'+
                   'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw'+
                   'dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv'+
                   'IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS'+
                   'ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD'+
                   'cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFu'+
                   'Y2VJRD0ieG1wLmlpZDpFRDZGOTI1QkIwQkIxMUUwQjU2NUE4OEVFNUM2NEI1NCIgeG1wTU06RG9j'+
                   'dW1lbnRJRD0ieG1wLmRpZDpFRDZGOTI1Q0IwQkIxMUUwQjU2NUE4OEVFNUM2NEI1NCI+IDx4bXBN'+
                   'TTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVENkY5MjU5QjBCQjExRTBC'+
                   'NTY1QTg4RUU1QzY0QjU0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVENkY5MjVBQjBCQjEx'+
                   'RTBCNTY1QTg4RUU1QzY0QjU0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4'+
                   'bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wVe9ZwAAAN5JREFUeNqkk9sKwjAMhrMDQ2UinkAZ'+
                   'OBF8/9cRvPFKhYEwUAYTqX8kg5C1N+6Hbw1dkmZpRtRXBg6ydkpkb2ydE2MXYA9GIAW1vNuBOVjJ'+
                   '/gs4fhGbhDNlL+TETGy9762AMzZgqfa4kqmsnS7i10vAasFEBWQm+AmuOiAVJ92w2nyK1gPk+sAI'+
                   'jy3Y0H+6xzRQgxNEnh6wjgH/k2n+rwfkCc4DCfgWzqE5IJmBtel6o0aYK33rOYg9o6x1E7QKfbBO'+
                   '8AGVrCR2K1QBH6+4zNLzo5WeZlPknBt0jV8BBgAGmSZOzxC+GwAAAABJRU5ErkJggg==';

      } else if (fillhint == 'formfills') {
         img.src  = icon_imgs[fillhint];  // for now, retain green
      } else if (fillhint == 'offersave') {
         img.src  = icon_imgs[fillhint];  // for now, retain blue
      } else if (fillhint == 'generate') {
          // lcog.png
         if (0) {
           img.src = 'data:image/png;base64,'+
                   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGF'+
                   'Vd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8'+
                   'AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWa'+
                   'GVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJP'+
                   'wG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzY'+
                   'Zi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0'+
                   'HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgj'+
                   'ONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyo'+
                   'Bc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrY'+
                   'BbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiE'+
                   'hcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrB'+
                   'DgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfS'+
                   'Pqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1c'+
                   'AdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0n'+
                   'fS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8e'+
                   'k6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWW'+
                   'ing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8O'+
                   'okmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/'+
                   'wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83'+
                   'Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAg1JREFUOBGNU0mPAWEQrW5tJ2In9hMOIi6Cv+B/Oklc'+
                   'hIijX+BAEJFIiCX2fTdezXQnM6eppPvTpd6r7X3C+9sI9nq9+Py46HK5EE6z2cy+1WpFer2etFot'+
                   'f+OlUqlEEUEAAvDjpPP5TLvdjiRJYp/s3263dL/fSRRFxtTr9YDwfD7fAF+vV7JarQrgPz+WyyVJ'+
                   'cvbRaESPx4OcTucv7PF4JI1GQ2q1+pd/MBhwPNcI4Ol0ok6noxCgqkqlQt1ulwlyuRxls1mFBLF+'+
                   'v58kzAAPyne5XEpAqVQiZEH2T5v06ZfjQARLJpOE6qTb7UZut5sfGY3eptMpRSIRslgsTABfu93m'+
                   'KgRBIJ/Px+HS4XAgo9EoY5UTAeFwmOx2OxOAECR/Tdrv9zSZTNgfi8VIp9MxKBQKkcfjUQgwbK/X'+
                   'S8gOA1m/3/+ewXA45H7H4zHl83kOSKVStNlslJ3bbDZlwAgoFAqsBclgMHAWCAezkA3Dw1AxQFQl'+
                   'K1L+PxAIEIQlfIDv2WxGaAVZ/2vyZkRo22QyQde8JhA0Gg0ql8uKvOFbLBZULBap1+vhk3WDuUjQ'+
                   'NR4IqVqt8tlsNrk/h8NBmUyGAbVajdfYarUokUgQ1o/WWIkgQCW4D2glGAxywHw+ZzBe6/Wa/fF4'+
                   'nGNQMebHlwnZcV2xGpCgNKgMs4GksTrchXQ6TdFolEkR90l8/gJp6kLsJGEluQAAAABJRU5ErkJg'+
                   'gg==';
           } else {
             // levi's honeycomb.
             img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAMAAADjcdz2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMi1jMDAxIDYzLjEzOTQzOSwgMjAxMC8xMC8xMi0wODo0NTozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFODA0QTc2OUYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFODA0QTc2OEYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTEuMCBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5Q0MyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PodDNbwAAAAwUExURfX19czMzNDQ0M7Ozt/f3+Pj4+bm5uDg4Ovr6+jo6NXV1dnZ2e7u7vLy8srKyv///3OAui4AAAAQdFJOU////////////////////wDgI10ZAAAAj0lEQVR42lRQWxKEIAxLCxSFEu5/W4vorMtPaKbkAeZ93OzYN2xoIvolXEXEH2IUsx6zNDvrMYE1aHG3tdUcCFR/36WKmYV16xmlj9DofB2ZfLlkbv05qSOIU2lPOkqdGErROw0amTIsQNoBeBNSDbNIWksqVGVfoo4S1mQu5ni6IAWBb9vI3/7q//7jEmAA/oEKxUGBLjYAAAAASUVORK5CYII=";

           }



      }
    } else {
      img.src  = icon_imgs[fillhint];
    }
  }
  if (g_do_icon_number_hint) {
    var nid = icon_container_id + '_numspan';
    var numspan = doc.getElementById(nid);
    if (numspan != null) {
      if (g_icon_shading) {
        numspan.style.backgroundColor="#FFFFFF";  // default of white
      } else {
        numspan.style.display='';
      }
    }
  }
  return;
}
  

// 29thdrive experiment:
// if (g_do_icon_number_hint)
// sitenumber and formfillsnumber is -1 which means, use the default.
// if a number >=0 then use that
function do_icon_number_hint(sitenumber, formfillsnumber) {
  
  if (sitenumber == null || parseInt(sitenumber)<0) {
    g_icon_number_overrides['sites']=(-1);
  } else {
    g_icon_number_overrides['sites']=sitenumber;
  }
  
  if (formfillsnumber == null || parseInt(formfillsnumber)<0) {
    g_icon_number_overrides['formfills']=(-1);
  } else {
    g_icon_number_overrides['formfills']=formfillsnumber;
  }


  // the overrides will be picked up by weasel job shortly after

}

// 29thdrive experiment:
// try as discrete DIV first.
// if chrome, use chrome.notifications.create() ?
// would prefer a callout to growl or somesuch
function do_save_site_success_msg (doc) {

  //verbose_log('['+g_docnum+']: savesitemsg ');  // WTF

  if (g_show_save_success_msg) {

    // where should this go ?
    // how should it look ?
    var msgdiv = doc.createElement('div');

    msgdiv.id = '__lpsavemsgdiv';  // hard-code

    // should check if it exists before creating

    // check edge case if msgdiv width < window width
  
    var width='210px';  // hard-coded width of the div.  what number looks good here ??

if (1) {
    // place the savesite message in upper right corner or browser viewport.
    var base_width = getWindowWidth(window);
    var posx = (base_width - parseInt(width) - 30) +'px';  // 30 px for chrome scroll bar + padding
    var posy = '25px';
}

    // looks better when positioned next to the INPUT field in mockup

    // this message needs styling but have a basic look for now.
    //msgdiv.innerText = gs('You have saved your password to your LastPass Vault.');
    var htmlfrag = gs('You have saved your password to your LastPass Vault.');
    // help icon - let user click for more info ?
    // or maybe insert a lastpass icon here for branding ?
    //
    // hide it for now.
    // htmlfrag += "<IMG ALT='' SRC='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5RTZFOTIzNjIzMjA2ODExOTIzRkU2MDNCRjZFNzVENyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyRjczRENCNDU2RUYxMURGQUNGOUQ1RDAwQTc4OEQzOSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyRjczRENCMzU2RUYxMURGQUNGOUQ1RDAwQTc4OEQzOSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkExNkU5MjM2MjMyMDY4MTE5MjNGRTYwM0JGNkU3NUQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjlFNkU5MjM2MjMyMDY4MTE5MjNGRTYwM0JGNkU3NUQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+RQsXfAAAAk9JREFUeNpsU81rE1EQn81uDbbbfCFJS5MaCGltNZYaK15KRRTqQZCC9uTJP0DQm7cKguDJP8BDEU+eFKSHIogYpWkLirSxaalYWtMkEJJ0s/vefjTOe9nUbJIHv503M783M292njA89xy6rFOIm4ghWy8ilhFKO1HqcvgRYmE0Nij395/mBlWlsJk90HH7AvEUoTfJQksFLNubyUR0ZmoyBn5fnyMqITqk0llY+777E9W7iK3WCliqpSvJeCI5EeOGsz4ZEmE/3+erGqS28zB1aQTcbncitZL5iObLiEPRO3aDcZ6cG4nMnx+LAtUtuDDkhzvJKLglEVwuAWJBD3jcPZDeKYDPK4MgCJ58sXwGz71z2dkfhsMhqCiEIz7g5Zm/Zg9h8ROvFMaxmqY/HAkx031EgF0h6fXIAd04Bt2gnPz2yzZ8WP0NxSqB6fHBRiOpCUcKPelJMBgQC4XSLAswLGKpSu2/c8PeX78YgbmrjZ68X9l1cESRt2+Ufy3rGLtsdPzPe9NxLr9lcrC4vOHwGYbJhM4C7FGqA6W0I0DI19u40udMh58Qru+wAOuolNQaCYiiy0F6tfSDy71cGSjRHT5FqVlsOlkADfGyUqkuyH29DtKDWxNcrm7uw59c6cReU9kReI0oNedg3TDN29iLEP5j3hMGttZ+/YV0Zh/KRxq3qRpBaAfommeFdIxyjyjNSJIELgzUuur1OmASMCzTMcqtl2ZRryHhsUaJggCiUw62Vymx0PfMHuGtbo+p/TnPIgZsvWQ/50o78Z8AAwAsp/ufbJr+gAAAAABJRU5ErkJggg=='>";
    msgdiv.innerHTML = htmlfrag;

    // from: icon12x12reduced.psd
    var icon12 = 'url(data:image/png;base64,'+
	'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ'+
	'bWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp'+
	'bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6'+
	'eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMi1jMDAxIDYzLjEz'+
	'OTQzOSwgMjAxMC8xMC8xMi0wODo0NTozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo'+
	'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw'+
	'dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEu'+
	'MC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVz'+
	'b3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1N'+
	'Ok9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDQ0JFNTgxNzA4MjA2ODExOTJCMEZBNzdDQkU2'+
	'Qjg4RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RTA4N0Y4OEZCQUYxMUUyOTAyNEMwRUQy'+
	'N0ZDRTk1QyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RTA4N0Y4N0ZCQUYxMUUyOTAyNEMw'+
	'RUQyN0ZDRTk1QyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTEu'+
	'MCBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlp'+
	'ZDoyMEEzMzFENkUxMjA2ODExOTJCMEZBNzdDQkU2Qjg4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1w'+
	'LmRpZDpDQ0JFNTgxNzA4MjA2ODExOTJCMEZBNzdDQkU2Qjg4RiIvPiA8L3JkZjpEZXNjcmlwdGlv'+
	'bj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqEZ7U4AAAAwUExU'+
	'RfL6+uHMzaoWLIoDFKVJJ2oEFsQaK7cCHMtfaNWrEcFJOsg2PsqnqdWGi584RAAAAIK7gZ4AAAAQ'+
	'dFJOU////////////////////wDgI10ZAAAAWUlEQVR42jzMUQ4AMQQEUKpoFnX/2+403exEZN4H'+
	'1DHsZjQ9/kcOgsN4fVhURXVhxkRsBkxnPmCOg8xEzRyAuAOJEwVk0cIPAbbIriG5D6Zi31Fq/dOv'+
	'AAMADDMDTO9yI2MAAAAASUVORK5CYII=)';

    //var css_str = 'position:absolute !important; visibility:visible !important; z-index:'+CLICKABLE_ICON_ZINDEX+' !important; border-style:solid !important; border-width:1px !important; border-color:#000 !important; font-size:14px; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; width: '+width+' !important; top:'+posy+' !important; left:'+posx+' !important; background-color: #e0e0e0; margin: 4px !important; border-radius: 4px; padding: 5px !important;'; 
    // opacity: 0.8;

    var css_str = 'position:absolute !important; visibility:visible !important; z-index:'+CLICKABLE_ICON_ZINDEX+' !important; border-style:solid !important; border-width:1px !important; border-color:#000 !important; font-size:14px; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; width: '+width+' !important; top:'+posy+' !important; left:'+posx+' !important; background-color: #e0e0e0; margin: 4px !important; border-radius: 4px; padding: 10px !important; background-image:' + icon12+'; background-repeat:no-repeat; background-position: left top;background-attachment: scroll;'; 
    msgdiv.style.cssText = css_str;

    if(typeof(doc.body)!='undefined'){
      doc.body.appendChild(msgdiv);
    }else if(doc.getElementById('main')){
      doc.getElementById('main').appendChild(msgdiv);
    }

    setTimeout(function() { destroy_save_site_success_msg(doc, msgdiv.id, 0) ; return false; },1500);
  }
  return false;
}

// 29thdrive experiment:
// passed arg of element; will this work or have to pass field id ?
// if arg#3 is null, destroy immediate.
function destroy_save_site_success_msg(doc, id, state) {
  var msgdiv  = doc.getElementById(id);
  if (msgdiv != null) {
    if (state === null) {  //
      msgdiv.parentNode.removeChild(msgdiv);
      return false;
    }

    // simple fade.  reducing opacity
    if (state < FADE_MAXSTATES) {
      msgdiv.style.opacity = ((100-(100/FADE_MAXSTATES)*(state+1))/100.0);
      msgdiv.style.filter="alpha(opacity="+(100-20*(state+1))+")"; // for IE8 and earlier
// try setting/starting at a different opacity...
//      msgdiv.style.opacity = ((80-(80/FADE_MAXSTATES)*(state+1))/100.0);
      state++;
      setTimeout(function() { destroy_save_site_success_msg(doc, msgdiv.id, state) ; return false; },10);
    } else {
      msgdiv.parentNode.removeChild(msgdiv);
    }
  }
  return false;
}


//
// triggered from closepopupfills message from tab.html iframe
// close/destroy (hide as speed improvement later)
//
// is sent to the associated browser tab, so just close all
//
// argument 'data' could be passed but it is not used ATT.
//
// now pass document object
function closepopupfills(doc)  {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.
  // console_log('closepopupfills');  // DEBUG
  // console.trace();  // DEBUG

  var i;
  var iframes = doc.getElementsByTagName('iframe'); 
  var iframecopy=new Array();
  // the object that iframes points to was mutating after each removal 
  // of iframe and causing early termination,
  // so make a copy to be able to work against
  for (i in iframes) {
    if(typeof(iframes.hasOwnProperty)!='function' || iframes.hasOwnProperty(i)){
      iframecopy[i]=iframes[i];
    }
  }

  for (i in iframecopy) {
      var afr = iframecopy[i]; // short-hand
      // check that id is set ?
      if ((typeof(afr.id) != 'undefined') && (afr.id != null)) {
        var iframeprefix = MAGICIFRAME;
        if (afr.id.indexOf(iframeprefix)==0 ) {

          if (g_use_grey_icons) {
            var icon_container_id = afr.id.substr(iframeprefix.length);
            if (doc.getElementById(icon_container_id) != null) {
              revert_clickable_icon(doc, icon_container_id) ;
            }
          }


          // ... removeEventListener(... )  may be necessary
          if(afr.parentNode)
            afr.parentNode.removeChild(afr);
        }
      }
  }

  // 

  g_popupfill_parent_last=g_popupfill_parent;
  g_popupfill_parent=null;  // GROSSSSSSSSS
  g_popupfill_ctr=0;
  g_popupfill_iframe_width_save=0;
  g_popupfill_iframe_height_save=0;
  g_minwidth_override=0;
  g_minheight_override=0;
  return;
}


//
// event handler onresize to relocate the lastpass icon, and 
// opened popup fill
//
// when the page moves/resizes, the per-form icons need to move
//   with the underlying form.
// an open popup menu(iframe) needs to move as well
//
// 1. delete all icons that may exist, then recreate?  probably slow
// 2. find all icons; for each, find location of corresponding form item
//    then relocate
//
// what to do about open popups ?
// or maybe iterate through input forms again.
//
function popupfill_resize() {
  if (!do_experimental_popupfill) { return ; }  // abort if not in use.

  var doc = typeof(document)!='undefined' && document ? document : LP.getBrowser().contentDocument ;
  relocate_popupfill_clickables(doc);
  relocate_popupfill_iframes(doc);

  // folded into relocate_popupfill_clickables()
  //closeclickableorphans(doc);

  // perhaps check if webpage has changed here,in case new form/inputs have been 
  // added to the page.  otherwise, this requires user to click on recheck page
  // if new fields appear that should be fillable.
  // only seen on imo.im registration so far, but could happen elsewhere.

  // sometimes the job appears to be getting lost?  add this 
  // here just in case
  if (g_weaseled == false) {
    //weasel(200);  // every 200 ms ?
    weasel(100);    // 200ms is too slow
  }
  g_weaseled=true;

  return;
}

// 29thdrive experiment:
// add a cancel button?
// now, destroy itself quickly.
// maybe persist and require user to click to remove it?
//
// there should only be one pop-up message present on this page.
//
// why can't fid be passed correctly?  wtf.
    
var MSGDIVID  = '__lpsuggestmsgdiv';  // hard-code
//function do_save_suggest_msg (event, doc) {
function do_save_suggest_msg (target, doc) {
  if (doc == null) {
    return;
  }

  // case: timing issue, g_icon_numbers['sites'] might not be set
  // on the first call to setup event handler here.
  // so, test for #sites again here.  if 1 or more is set, do
  // not display msg.
  if (typeof(g_icon_numbers) != 'undefined' && 
      typeof(g_icon_numbers['sites']) != 'undefined' &&
      g_icon_numbers['sites']>=1) {
    return;
  }

  // case: record when the suggestion DIV is shown, and
  // only show this message once.
  if ( g_save_suggest_msg_seen ) {
    return;
  }
  g_save_suggest_msg_seen=true;

  if (is_your_popup_showing(doc)) {
    // if the popup-iframe is present, do not display
    return;
  }
  if (!g_isloggedin) {
    // if not logged in, do not prompt either.
    // this expects that g_isloggedin will have been updated when
    // a logout issues a BG->CS closeclickables msg.
    return;
  }

  if (g_save_suggest_msg) {
    // where should this go ?
    // how should it look ?

    //var field = event.target;
    var field = target;  // pass target instead of event
    if (field == null) {
      // ?  field=event.srcTarget ??
      return;
    }
    var fid = LP_getname(field, LP_GETNAME_FAVOR_ID_OVER_NAME)

    if (doc.getElementById(MSGDIVID)!= null) {
      return;
    }

    var msgdiv = doc.createElement('div');

    msgdiv.id = MSGDIVID;  // hard-code

    // should check if it exists before creating

    // check edge case if msgdiv width < window width
if (0) {  // this places in upper right
    var base_width = getWindowWidth(window);
    var posx = (base_width - parseInt(width) - 10) +'px';
    var posy = '40px';
}
if (1) {  // this aligns the msg against bottom left corner of input field.
    var width='200px';  // hard-coded width of the div

    //var field = LP_getElementByIdOrName(doc, fid) ;
    //if (field == null) {
    //  return;
    //}
    var fieldpos=getAbsolutePos(doc, field);  // returns numeric values
    if (fieldpos != null && fieldpos.left>0 && fieldpos.top>0) {
      posx = fieldpos.left + 20 + 'px';   
      posy = fieldpos.top + fieldpos.height + 20 + 'px';   
    } else {
      // otherwise stick in upper right?
      var base_width = getWindowWidth(window);
      posx = (base_width - parseInt(width) - 10) +'px';
      posy = '40px';
      // or maybe this should appear relative to the mouse location?
    }

}

    //
    // must have CSS rules that override website supplies CSS.
    //
    // <DIV ID= '__lpsuggestmsgdiv' >
    //   <DIV ID= '__lpsuggesttitle' style height=13px >
    //     <SPAN ID= '__lpsuggestcancel'  BG = images/xsmall.png>   <-- need click handler
    //   </DIV>
    //   <DIV ID= '__lpsuggestbody' >                               <-- need click handler
    //     gs('Save the password to your LastPass Vault?');   
    //   </DIV>
    // </DIV>
    //

    // this message needs styling but have a basic look for now.
    var css_str = 'position:absolute !important; visibility:visible !important; z-index:'+CLICKABLE_ICON_ZINDEX+' !important; border-style:solid !important; border-width:1px !important; border-color:#000 !important; font-size:14px; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; width: '+width+' !important; top:'+posy+' !important; left:'+posx+' !important; background-color: #22d222; margin: 2px !important; padding:3px !important;';
    msgdiv.style.cssText = css_str;

    var titlebar= doc.createElement('DIV');
    titlebar.id = '__lpsuggestitle';
    //titlebar.style.cssText = "visibility: visible !important; border: 0px !important; vertical-align:top !important;"
    msgdiv.appendChild(titlebar);

    var titlebarcancel = doc.createElement('SPAN');
    titlebarcancel.id  = '__lpsuggestcancel';
    //titlebarcancel.style.cssText = "visibility: visible !important; border-color:#000 !important; background:url('images/xsmall.png') no-repeat !important; float:right !important; vertical-align:top !important; background-position:center !important;"
    titlebarcancel.style.cssText = "visibility: visible !important; border:0px !important; float:right !important; vertical-align:top !important; "
    titlebar.appendChild(titlebarcancel);

    var imgcancel = doc.createElement('IMG');
    imgcancel.id  = '__lpsuggestimgcancel';
    imgcancel.setAttribute('alt', 'gs("Cancel")');
    imgcancel.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowQ0NBMTdFRjIwMjA2ODExOEYwMEFFMDM3RkVEMDZBRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGOTc5RjY0QUExQ0IxMUUwQTAzMEEwMzFBMEMyRkNFRSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGOTc5RjY0OUExQ0IxMUUwQTAzMEEwMzFBMEMyRkNFRSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEZDQTE3RUYyMDIwNjgxMThGMDBBRTAzN0ZFRDA2QUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MENDQTE3RUYyMDIwNjgxMThGMDBBRTAzN0ZFRDA2QUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6IFgekAAACC0lEQVR42rTVTUhUURjGcUejKDMDEUqxTS4MgrCPRUOLIJKEogwm+pCihS0ibZeBi1YtQnARlZJUiFLI5EaYFknpQmhTUBRJmR8EEu6CQg2t8X/wGXk7nTua4IHfDNy555nz3vNxY+l0Omc12hr3kUwmQ78VYB+OYxdK8ANf8QIpjIU6JhKJheBAK8N1nEQx8sxvu3EIF3ELPfjtB+QGQo/iFS5jixdqq3F/0I0OFC0VfAxdKP2Px3kOndgYFbwDj1C4grmqRnMoOIabpqQ5PEQLZgNBH3EDr821Whz+a1XQ4jhibnKTcQ9vMIrbZhAfcAIjqm6vrrtHcQEDbjC55tmuN8HrFOZWx1004A8+oUahp3HJq+Sg+iyOuCJQrqvisVuWCv+Jd/iCs7iPfK9PqYJHMyPeHDEpB9CLci2rtziPtkBophVHrWO/uQmd9h5TQZb70zb4e8RNQ1pKE/rejnZtntmIPpM2eChww3vN/mdN1FPttG1oxVX88vp8k8XglFfuDK4otFZregP24IkmqFXXbXuJcRs8iH5zw1pUaVTt3lKMa+SntFtzzKbqzBxI9nRrRCW26g+bskzQfrHNrZS+0FnhdlQ9plZwVjzDNW2i4OnWoxJHlhnoyn6gyZ1e6jxOmdNqPEvgc5xBnd4s/76aAm1Ypd3BTtmkUse0A4e1zYMttlov03kBBgDmGHIa6CiubAAAAABJRU5ErkJggg==';
    titlebarcancel.appendChild(imgcancel);

    var suggestbody= doc.createElement('DIV');
    suggestbody.id = '__lpsuggestbody';
    //suggestbody.style.cssText = "visibility: visible !important; border: 0px !important;";
    suggestbody.innerText = gs('Save your password to your LastPass Vault?');
    msgdiv.appendChild(suggestbody);
 
    // click handlers

    var icon_container_id = MAGIC+LP_getname(field,LP_GETNAME_FAVOR_ID_OVER_NAME);
    var offergenerate = false;  // this routine is only called on login forms
    suggestbody.addEventListener('click', function() { 
      setTimeout(function() { 
        popupfilltoggle(doc, icon_container_id, field, offergenerate , FORCE_SHOW_NOHITS, 1); 
        destroy_save_suggest_msg(doc, MSGDIVID, null) ;  // close this message immediately
// stop event propagation ?
        savesite_popupaction_iframe(doc, event);
        return false; 
      },0); 
      return false; 
    });

    titlebarcancel.addEventListener('click', function() { 
      setTimeout(function() { 
        destroy_save_suggest_msg(doc, MSGDIVID, null) ;  // close myself
// stop event propagation ?
        return false; 
      },0);   // destroy immediate
      return false; 
    });

    if(typeof(doc.body)!='undefined'){
      doc.body.appendChild(msgdiv);
    }else if(doc.getElementById('main')){
      doc.getElementById('main').appendChild(msgdiv);
    }
    setTimeout(function() { destroy_save_suggest_msg(doc, MSGDIVID, 0) ; return false; },5000);  /// 5 seconds
  }
  return false;
}

// 29thdrive experiment:
// passed arg of element; will this work or have to pass field id ?
// if state is null then destroy immediately.
function destroy_save_suggest_msg(doc, id, state) {
  var msgdiv  = doc.getElementById(id);
  if (msgdiv != null) {
    if (state === null) {
      msgdiv.parentNode.removeChild(msgdiv);
      return false;
    }

    // simple fade.  reducing opacity
    if (state < FADE_MAXSTATES) {
      msgdiv.style.opacity = ((100-(100/FADE_MAXSTATES)*(state+1))/100.0);
      msgdiv.style.filter="alpha(opacity="+(100-20*(state+1))+")"; // for IE8 and earlier
      state++;
      setTimeout(function() { destroy_save_suggest_msg(doc, msgdiv.id, state) ; return false; },10);
    } else {
      msgdiv.parentNode.removeChild(msgdiv);
    }
  }
  return false;
}

// global cache var for use by measureText
// given #1 document, #2 string, #3 stylefrag
// and #4 value is an object containing width/height that is
// associated with this string/stylefrag .  will this work
// or will it need to be stringified ?
//
// stylefrag is unlikely to change so make it 1st level key, and string 2nd level key
// return null on error
// return true on success.
function measureTextCacheSet(doc, string, stylefrag, value) {
  if (doc == null || string == null || stylefrag== null || string.length===0 || stylefrag.length===0 || value == null ) {
    return null;
  }
  if(typeof(doc.g_measureText_cache)=='undefined'){
    doc.g_measureText_cache = [];
  }
  if (doc.g_measureText_cache[stylefrag]==null) {
    doc.g_measureText_cache[stylefrag]={};
  }
  doc.g_measureText_cache[stylefrag][string] = value;
  return true;
}

// global cache var for use by measureText
// given #1 document, #2 string, #3 stylefrag
// return true on success.
// return null on error, or not found
function measureTextCacheGet(doc, string, stylefrag) {
  if (doc == null || string == null || stylefrag== null || string.length===0 || stylefrag.length===0 ) {
    return null;
  }
  if(typeof(doc.g_measureText_cache)=='undefined'){
    return null;
  }
  if (doc.g_measureText_cache[stylefrag] != null &&
      doc.g_measureText_cache[stylefrag][string] != null ) {
    return (doc.g_measureText_cache[stylefrag][string]);
    // this should be returning an object with properties width/height...
  }
  return null;
}


// checks to see if the given form is a password change form.
// this occurs when the form has 3 password fields.
// the last 2 must be contiguous.
//
// given document element & form element
// return true if yes, return false if no or on error.
//
// NB: calls
// sso/firefox/content/checkgenpw.js:lpCheckCurrentPWField()
// given form and it // returns an input field element that appears
// to be the current password field.
// it could return a null, if nothing could be determined.
//
// on twitter.com/settings/password, the password INPUT fields are
// placed inside <FIELDSET> elements.  Chrome is putting an array element
// into form.elements for the FIELDSET, followed by another entry
// for the INPUT field.  Bah Humbug
//
// 
// 
function chk_form_changepw(doc, form) {
  if (doc == null || form == null) {
    return false;
  }

  // formcacheget()

  // this bit is modelled against sso/firefox/content/checkgenpw.js:populategeneratedpassword()
  var currentpwfield = lpCheckCurrentPWField(form);
  var bLastFieldPassword = false;
  var pass1 = null, pass2 = null;
  for (var k = 1; k <= 2; k++) {
    bLastFieldPassword = false;
    pass1 = pass2 = null;
    var start = -1;
    if (k == 1) {
      if (currentpwfield) {
        for (var i = 0; i < form.elements.length; i++) {
          if (form.elements[i] == currentpwfield) {
            start = i + 1;
            break;
          }
        }
      }
    } else {
      start = 0;
    }
    if (start == -1) {
      continue;
    }

    for(var i=start; i < form.elements.length; i++){
      var elt = form.elements[i];

      if (elt.tagName == 'FIELDSET') {
        // might be good enough to just ignore the FIELDSET fields
        // and rely on Chrome to duplicate refs to all INPUT fields found within
        // the FIELDSETs 
        continue;
      }
      //if (elt.type == 'password'){
      if (isInputFieldPassword(doc, elt)) {

          if(!bLastFieldPassword && pass1 && pass2){
            //already have pw1&pw2 and this wasnt contiguous. so skip it.
          }else{
            pass2 = pass1;
            pass1 = elt;
            if (bLastFieldPassword && pass1 && pass2) // if we found two contiguous password fields, run with them
              break;
          }
        bLastFieldPassword = true;
      }else{
        bLastFieldPassword = false;
      }
    }

    if (pass1 && pass2) {
      break;
    }
  } // for


  if (pass1 != null && pass2 != null && currentpwfield != null) {
    // CASE:
    // found 2 contiguous fields that appear to be password fields
    // and there is a third earlier password field on this form
    // that apepars to be the "current password".
    //
    // Consider it a change-password form

    // Suspect this is fragile.
    
    // formcacheset(yes)
    return true;
  }
  // formcacheset(no)
  return false;

  
//  var elements = form.elements;
//  var x;
//  for (x in elements) {
//    if (elements.hasOwnProperty(x)) {
//      elements[x]
//    }
//  }

}

function change_clickable_icon_to_cancel(doc, icon_container_id) {
  if (doc == null) {
    return;
  }
  if (!g_use_grey_icons) { return; }

  var iconid = icon_container_id + '_icon';
  var img = doc.getElementById(iconid);
  if (img != null) {
    var ic = doc.getElementById(icon_container_id);
    if (ic == null) {
      return false;
    }
    // from clickable_cancel.png
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMi1jMDAxIDYzLjEzOTQzOSwgMjAxMC8xMC8xMi0wODo0NTozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5REMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFODA0QTc2REYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFODA0QTc2Q0YzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTEuMCBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5REMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5REMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PprgKkoAAAB1UExURd3d3fz8/PLy8tnZ2djY2Pr6+urq6tXV1evr69/f3+Dg4Nzc3NPT09HR0fv7++Hh4f///+zs7NTU1OLi4ubm5vj4+P7+/ufn5+jo6OPj4/n5+f39/dvb2+Tk5Pb29tbW1vf399fX18/Pz9DQ0M7Ozs3NzQAAANvKiWcAAAAndFJOU///////////////////////////////////////////////////AINWl9kAAACJSURBVHjabI+HDsMgDEQNAbJH071bwP7/TwyGKKpQT7Kle5KPAygTxL33uKqOYNw8OgYmeL8OA2MRrSqsf7eOQRU8lvLWqpcoAtg5Pu2qQeuT/AZQprBZTtOgfABPvsD+ehTibjrOOKcMPcInZhAd+BUA5x9Nn3pcsh5EddaUqNkIwP/f/mgRYABAnR7sqtNZgwAAAABJRU5ErkJggg==";
  }
  return;
}

function revert_clickable_icon(doc, icon_container_id) {
  if (doc == null) {
    return;
  }
  if (!g_use_grey_icons) { return; }

  var iconid = icon_container_id + '_icon';
  var img = doc.getElementById(iconid);
  if (img != null) {
    var ic = doc.getElementById(icon_container_id);
    if (ic == null) {
      return false;
    }
    // based on fillhint/intrinsic, revert to
    var fillhint = ic.getAttribute('intrinsic');
    if (fillhint == null || fillhint==='' || (fillhint !== "sites" && fillhint !== "formfills" && fillhint !== "generate" && fillhint !== "offersave" )) {
      fillhint='default';
    }
    if (g_use_grey_icons) {
      if (fillhint == 'default' || fillhint == 'sites') {
        // this is from lpchrome/icon_off.png
        //just stick this here for now to try it out, otherwise
        // should just change icon_imgs['default']
        img.src = 'data:image/png;base64,' +
                   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ'+
                   'bWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp'+
                   'bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6'+
                   'eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0'+
                   'MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo'+
                   'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw'+
                   'dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv'+
                   'IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS'+
                   'ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD'+
                   'cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFu'+
                   'Y2VJRD0ieG1wLmlpZDpFRDZGOTI1QkIwQkIxMUUwQjU2NUE4OEVFNUM2NEI1NCIgeG1wTU06RG9j'+
                   'dW1lbnRJRD0ieG1wLmRpZDpFRDZGOTI1Q0IwQkIxMUUwQjU2NUE4OEVFNUM2NEI1NCI+IDx4bXBN'+
                   'TTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVENkY5MjU5QjBCQjExRTBC'+
                   'NTY1QTg4RUU1QzY0QjU0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVENkY5MjVBQjBCQjEx'+
                   'RTBCNTY1QTg4RUU1QzY0QjU0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4'+
                   'bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wVe9ZwAAAN5JREFUeNqkk9sKwjAMhrMDQ2UinkAZ'+
                   'OBF8/9cRvPFKhYEwUAYTqX8kg5C1N+6Hbw1dkmZpRtRXBg6ydkpkb2ydE2MXYA9GIAW1vNuBOVjJ'+
                   '/gs4fhGbhDNlL+TETGy9762AMzZgqfa4kqmsnS7i10vAasFEBWQm+AmuOiAVJ92w2nyK1gPk+sAI'+
                   'jy3Y0H+6xzRQgxNEnh6wjgH/k2n+rwfkCc4DCfgWzqE5IJmBtel6o0aYK33rOYg9o6x1E7QKfbBO'+
                   '8AGVrCR2K1QBH6+4zNLzo5WeZlPknBt0jV8BBgAGmSZOzxC+GwAAAABJRU5ErkJggg==';

      } else if (fillhint == 'formfills') {
         img.src  = icon_imgs[fillhint];  // for now, retain green
      } else if (fillhint == 'offersave') {
         img.src  = icon_imgs[fillhint];  // for now, retain blue
      } else if (fillhint == 'generate') {
        if (0) {
          // lcog.png
          // replace this with array lookup later.
          img.src = 'data:image/png;base64,'+
                   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAeAGF'+
                   'Vd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8'+
                   'AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWa'+
                   'GVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJP'+
                   'wG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzY'+
                   'Zi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0'+
                   'HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgj'+
                   'ONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyo'+
                   'Bc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrY'+
                   'BbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiE'+
                   'hcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrB'+
                   'DgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfS'+
                   'Pqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1c'+
                   'AdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0n'+
                   'fS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8e'+
                   'k6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWW'+
                   'ing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8O'+
                   'okmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/'+
                   'wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83'+
                   'Gv+uNxo7XyL/FtFl8z9ZAHF4XM3iFgAAAg1JREFUOBGNU0mPAWEQrW5tJ2In9hMOIi6Cv+B/Oklc'+
                   'hIijX+BAEJFIiCX2fTdezXQnM6eppPvTpd6r7X3C+9sI9nq9+Py46HK5EE6z2cy+1WpFer2etFot'+
                   'f+OlUqlEEUEAAvDjpPP5TLvdjiRJYp/s3263dL/fSRRFxtTr9YDwfD7fAF+vV7JarQrgPz+WyyVJ'+
                   'cvbRaESPx4OcTucv7PF4JI1GQ2q1+pd/MBhwPNcI4Ol0ok6noxCgqkqlQt1ulwlyuRxls1mFBLF+'+
                   'v58kzAAPyne5XEpAqVQiZEH2T5v06ZfjQARLJpOE6qTb7UZut5sfGY3eptMpRSIRslgsTABfu93m'+
                   'KgRBIJ/Px+HS4XAgo9EoY5UTAeFwmOx2OxOAECR/Tdrv9zSZTNgfi8VIp9MxKBQKkcfjUQgwbK/X'+
                   'S8gOA1m/3/+ewXA45H7H4zHl83kOSKVStNlslJ3bbDZlwAgoFAqsBclgMHAWCAezkA3Dw1AxQFQl'+
                   'K1L+PxAIEIQlfIDv2WxGaAVZ/2vyZkRo22QyQde8JhA0Gg0ql8uKvOFbLBZULBap1+vhk3WDuUjQ'+
                   'NR4IqVqt8tlsNrk/h8NBmUyGAbVajdfYarUokUgQ1o/WWIkgQCW4D2glGAxywHw+ZzBe6/Wa/fF4'+
                   'nGNQMebHlwnZcV2xGpCgNKgMs4GksTrchXQ6TdFolEkR90l8/gJp6kLsJGEluQAAAABJRU5ErkJg'+
                   'gg==';
           } else {
             // levi's honeycomb.
             img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAMAAADjcdz2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMi1jMDAxIDYzLjEzOTQzOSwgMjAxMC8xMC8xMi0wODo0NTozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFODA0QTc2OUYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFODA0QTc2OEYzMTQxMUUyOEM5OTg3MEJEQ0FFRTIxRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTEuMCBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5Q0MyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QUMyMEYyOEM3MjA2ODExODIyQUZGNkY2QjZFRjUzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PodDNbwAAAAwUExURfX19czMzNDQ0M7Ozt/f3+Pj4+bm5uDg4Ovr6+jo6NXV1dnZ2e7u7vLy8srKyv///3OAui4AAAAQdFJOU////////////////////wDgI10ZAAAAj0lEQVR42lRQWxKEIAxLCxSFEu5/W4vorMtPaKbkAeZ93OzYN2xoIvolXEXEH2IUsx6zNDvrMYE1aHG3tdUcCFR/36WKmYV16xmlj9DofB2ZfLlkbv05qSOIU2lPOkqdGErROw0amTIsQNoBeBNSDbNIWksqVGVfoo4S1mQu5ni6IAWBb9vI3/7q//7jEmAA/oEKxUGBLjYAAAAASUVORK5CYII=";
           }
         }

    } else {
      img.src  = icon_imgs[fillhint];
    }

  }
  return;
}

// move into func, to eventually pull this out of the CS layer.
// given ID prefix string, return html frag to insert, and the numeric row identifier (needs to be
//   passed thru ofa(), just to be safe)
// expects 'expandff' or 'expand'
// if bad prefix, return nothing.
// relies on global toggle vars:
//    popup_show_menu_expand_visual_cue
//    g_visual_cue_on_hover
// set alt, style in iframe
function visual_cue_frag(PREFIX, x) {
  var html = "";
  if (PREFIX === null || PREFIX.length <= 0) {
    return html;
  }
  if (popup_show_menu_expand_visual_cue) {
    // assign id of expandXX or expandffXX to assign click handler
    // change attribute/classname to 'expander'
    //
    // hooking click handler onto the icon itself but not the 
    // surrounding span means too little screen real-estate for user 
    // to click on. 
    var stylefrag = "";
    if (g_visual_cue_on_hover) {
      stylefrag = " style='display:none;'";
    }
    html = "<span id='"+PREFIX+ ofa(x) +"' expander='true' class='expander' " + stylefrag+ ">"+
           "<img id='"+PREFIX+"img"+ofa(x)+"' src='arrow.png' />  </span>\n";
  }  // popup_show_menu_expand_visual_cue
  return html;
}



//
// summary: assign a click handler on all input fields with a clickable icon.
// when clicked, evaluate state of parent form and fields.
// if ok, then pass on to popupfilltoggle() to create.  return true
// if not, ignore it.  return false in this case
//
// logic:
// if this is a login form, and
// if user has clicked on password field, and 
// if user has typed in text into the userfield
// then popup the iframe, and copy userfield text into 
//   the savesite span at the bottom of the iframe
//   do not copy text typed into the field 
//
// if this is a login form,
// if user has clicked on userfield, and
// if user has text in the userfield + password field,
// then popup the iframe, and copy userfield text (if any) into 
//   the savesite span at the bottom of the iframe, and echo
//   text typed into the field.
//
// if a login form, and user clicked on password, and if there isn't
//   text in username and password, then do not create.
//
// if a login form, and user clicked on userfield , and if there isn't
//   text in username and password, then do not create.
//
// if a formfill form, and not an email or password field, then create popup 
// but don't copy inital or on-going text into box.
//
// if a formfill form, and a password field, then create popup 
//   set to generate pw, and do not copy initial or on-going
//   text to input box
//
// if a formfill form, and an email field or username field, then create popup 
//   and ask whether to fill with email address; do not copy initial 
//   or on-going   text to input box
//
// if a signup form, and clicked on a password field, then create popup 
//   set to generate pw, and do not copy anything to input box
//
// if a signup form, and not a password field, and if there
// is text in the username + password field, then
//  create popup and copy username to text box  - copy
//  from userfield;  if userfield then echo text, otherwise do not echo
//
// if a signup form, and not a password, and if there isn't
//   text in username and password, then do not create.
//
// case: input fields that are not inside a form
//   checkDocumentForLoginOrphans() checks input fields
//   if there is an input type==password that is not member of
//   a form, then return true
//
// need new clickhandler 
// need function to determine username field from active form
// need function to determine password field from active form
//
// existing code that isn't really applicable
//   sso/firefox/content/checkgenpw.js : lpCheckCurrentPWField(form)
//   lpchrome/lplib.js  : getusernamefromacct() returns 1st text field if Save-all
//   lpchrome/onload.js : LP_get_field_text()  for save-all, parses specified form
//
// given doc object & ai (active input) input element that was clicked
//


function conditional_create_popup(doc, ai) {
  if (doc == null || ai==null || !g_clickable_input) {
    return false;
  }

  var form = ai.form;
  var username = form_get_username(doc, form);
  var password = form_get_password(doc, form);
  if (form == null && checkDocumentForLoginOrphans(doc)) {
    // case: website has no forms at all, so form_get_username() and form_get_password()
    // will fail.  however, there is an INPUT field of type password that was one.
    // wtf should be done here?  check all inputs on the entire page?
    // todo.
    username = doc_get_orphan_username(doc) ;
    password  = doc_get_orphan_password(doc) ;
  }

  if (username == null || password == null) {
    // case: unable to determine a username or password from supplied form.
    // do not allow click on INPUT field to create the popup.
  } else {
    // xxx: verify form is ok.  clipped from doc_create_clickable...
    var hasLoginOrphans= checkDocumentForLoginOrphans(doc);
    var is_login_form = (chk_form_has_password(doc, form) || hasLoginOrphans);
    var is_non_login_form = chk_form_is_nonlogin_form(doc, form);
    var is_signup_form = chk_form_ask_generate(doc, form);  // skip loosen arg; KISS
    var icon_container_id = MAGIC+LP_getname(ai,LP_GETNAME_FAVOR_ID_OVER_NAME);
    var ic = doc.getElementById(icon_container_id) ;

    if ((typeof(username.value) != 'undefined' && username.value.length > 0 &&
         typeof(password.value) != 'undefined' && password.value.length > 0)  &&
         ((is_login_form || is_signup_form) && !is_non_login_form)) {
                           
      // if there is an associated icon container,
      // try to open it if the input field has been clicked.
      //
      if (ic != null) {
        // set fillhint ??
        g_popup_active_username = username;
        g_popup_active_password = password;
        popupfilltoggle(doc, icon_container_id, ai, NO_FORCE_GENERATE,  FORCE_SHOW_NOHITS);

        // maybe this ought to be cleared right away due to mult forms
        //g_popup_active_username = null;
        //g_popup_active_password = null;
        return true;
      }
    } else if (is_non_login_form || is_signup_form) {
      // tweak: if this is a signup form, popup the generate tab
      // if you start typing something into the password field.
      if (isInputFieldPassword(doc,ai)) {
        if (ic != null) {
          fillhint = 'generate';
          g_popup_active_username = username;
          g_popup_active_password = password;
          popupfilltoggle(doc, icon_container_id, ai, FORCE_OFFER_GENERATE,  FORCE_SHOW_NOHITS);
        }
      } else {
        // if email address or username field
        // PPP
        if (looksLikeUsername(ai) || looksLikeEmail(doc, ai) ) {
          fillhint = 'fillforms';
          g_popup_active_username = username;
          g_popup_active_password = password;
          popupfilltoggle(doc, icon_container_id, ai, NO_FORCE_GENERATE,  FORCE_SHOW_NOHITS);
        }
      
      }

    } else {
      // do not create.
    }
  }

  return false;
}

// logic:
// given a form
// find 1st visible password field, and return it
//   use checkIsDisplayed() to determine whether visible or not.
//   use isInputFieldPassword() to determine whether a field
//     is a password field or not
// return null if nothing found, or on error
//
// cache for perf?
function form_get_password(doc, form) {
  if (doc == null || form == null) {
    return null;
  }
  g_ctr_form_get_password_N++;
  var formElements = form.elements;
  for(var j=0;j< formElements.length;j++) {
    var field = formElements[j];
    if (field.tagName == 'FIELDSET') {
      continue;   // really only care about INPUTs;
    }
    if (checkIsDisplayed(doc, field, 0 ) && isInputFieldPassword(doc,field)) {
      return field;
    }
  }
  return null;
}


//
// draws on formHasUsernameField()
// return the 1st visible username field that looks like a username
//   use checkIsDisplayed() to determine whether visible or not.
//   use looksLikeUsername() to determine whether a field
//     is a username field or not
// return null if nothing found, or on error
//
// in save-all case, or where the username is not the 1st text input field,
// such as for twitter registration form, then this may result in confusing
// text being passed to iframe
//
// cache for perf?
function form_get_username(doc, form) {
  if (doc == null || form == null) {
    return null;
  }
  g_ctr_form_get_username_M++;
  var formElements = form.elements;
  for(var j=0;j< formElements.length;j++) {
    var field = formElements[j];
    if (field.tagName == 'FIELDSET') {
      continue;   // really only care about INPUTs;
    }
    // -- looksLikeUsername() is too restrictive.
    // if (checkIsDisplayed(doc, field, 0 ) && looksLikeUsername(field)) {
    //
    //
    if (checkIsDisplayed(doc, field, 0 ) && (field.type == 'text' || field.type == 'email' || looksLikeUsername(field))) {
      return field;
    }
  }
  return null;
}

// needed to deal with case where page has login fields that are not in a form.
// cache for perf?
function doc_get_orphan_username(doc) {
  if (doc == null) {
    return null;
  }
  g_ctr_orphan_get_username_P++;

  var tagnames = new Array('input') ;
  for (var j = 0; j < tagnames.length; j++) {
    var inputs = doc.getElementsByTagName(tagnames[j]);
    for (var i = 0; i < inputs.length; i++) {
      var field = inputs[i];
      if(field.form == null)  {
        if (checkIsDisplayed(doc, field, 0 ) && (field.type == 'text' || field.type == 'email' || looksLikeUsername(field))) {
          return field;
        }
      }
    }
  }

  return null;
}


// needed to deal with case where page has login fields that are not in a form.
// cache for perf?
function doc_get_orphan_password(doc) {
  if (doc == null) {
    return null;
  }
  g_ctr_orphan_get_password_Q++;

  var tagnames = new Array('input') ;
  for (var j = 0; j < tagnames.length; j++) {
    var inputs = doc.getElementsByTagName(tagnames[j]);
    for (var i = 0; i < inputs.length; i++) {
      var field = inputs[i];
      if(field.form == null)  {
        if (checkIsDisplayed(doc, field, 0 ) && isInputFieldPassword(doc,field)) {
          return field;
        }
      }
    }
  }

  return null;
}

// sets global vars g_popup_active_username/password
// for identifying and remembering an associated 
// username/password field
// when opening up an iframe in a username/password field.
// i tell no lies, this is not pretty, and globals are yucky.
// on error, clear the global vars to prevent cross-form pollution.
// returns void.
//
// pulled this bit out from conditional_create_popup()
// unclear if this is right or not...  PPP
function set_active_username_password(doc, form) {
  if (doc==null || form== null) {
                             
    g_popup_active_username = null;
    g_popup_active_password = null;
    return;
  }
                             
  var username = form_get_username(doc,form);
  var password = form_get_password(doc,form);
  if (form == null && checkDocumentForLoginOrphans(doc)) {
    username = doc_get_orphan_username(doc) ;
    password  = doc_get_orphan_password(doc) ;
  }
  g_popup_active_username = username;
  g_popup_active_password = password;
  return;
}

// given an INPUT element + document obj.
// return true if it seems like an email field
// return false on error, or input field doesn't seem like email address
function looksLikeEmail(doc, input) {
  if (doc == null || input == null || !(input.type =='text' || input.type == 'email')) {
    return false;
  }
 
  if (input.type == 'email') {
    return true;
  }

  var regexp = new RegExp(lpgs('ff_email_regexp'), 'i');
  if(regexp.exec(input.name)){
    return true;
  }
  return false;
}

//
// given an INPUT field, try to guess whether it's a search form
// or not.
// return true if the INPUT should be treated as a search field.
// return false if not.  return false on error.
//
// networksolutions sets username to have class 'srchInput'  BAH
// check that the input field's name or id fields doesn't
// look like a username.  login fields having similar same name/styles
// as search fields is a recurring problem.
// 
//      // found a form INPUT element that looks like a search box.
//      // Conclude that this form smells mostly like a search form?
//      // NB: bankofamerica.com uses CSS class of 'search-text-box' for its login field.  bah
//      //
//  NB: some ASP.NET sites are presenting an entire page as one form, and this
//  includes a search box into their forms.  so limit this test to forms with 4 elements or less
//
//
function is_search_field(doc, element) {
  if (doc == null || element == null || element.tagName != 'INPUT') {
    return false;
  }

  var form=element.form;  // could be null.
  var formElements=[];
  if (form != null) {
    formElements = form.elements;
  }
  var eltname = LP_getname(element, LP_GETNAME_FAVOR_ID_OVER_NAME)

  if (((element.className != null && 
        element.className.toLowerCase().indexOf('search')>=0 ||
        element.className.toLowerCase().indexOf('srch')>=0 || 
        element.id.toLowerCase().indexOf('search')>=0  ||
        element.id.toLowerCase().indexOf('srch')>=0 ||
        element.name.toLowerCase().indexOf('search')>=0  ||
        element.name.toLowerCase().indexOf('srch')>=0)) && 
      (element.name.toLowerCase().indexOf('user')<0) &&
      (element.name.toLowerCase().indexOf('login')<0) &&
      (element.id.toLowerCase().indexOf('user')<0) &&
      (element.id.toLowerCase().indexOf('login')<0)&&
         (formElements.length < 5))  {
    verbose_log('field '+eltname+' appears to be a search field based on name/class/id ');
    return true;
  }
  return false;
}

// similar to is_search_field()
// given FORM element.
// return true if it should be treated as a search form.
// return false if not.  return false on error.
//
// checking form action for the search/srch strings is not that reliable;
// no guarantee that this form really is a search form or not.
// e.g. southwest.com for airflight lookups is being interpreted
// as a search form due to form.action being /flight/search-flight.html.
//
// could iterate through INPUTs on the form to test.
//
function is_search_form(doc, form) {
  if (doc == null || form == null || form.tagName != 'FORM') {
    return false;
  }
  var formid= LP_getname(form,LP_GETNAME_FAVOR_ID_OVER_NAME);

  if ((form.id != null && form.id.length>0 &&
      (form.id.toLowerCase().indexOf('search')>=0 ||
       form.id.toLowerCase().indexOf('srch')>=0)) || 
      (form.name != null && form.name.length>0 &&
       (form.name.toLowerCase().indexOf('search')>=0  ||
       form.name.toLowerCase().indexOf('srch')>=0))) {
    verbose_log('form '+formid+' appears to be a search field based on name/id ');
    return true;
  }
  return false;
}

var g_doexttable=1;
var g_isdebug = false;
