function lpPutUserPref(b,c){g_userprefs[b]=c}function lpPutGblPref(b,c){g_gblprefs[b]=c}function lpGetPref(b,c){return"undefined"!=typeof g_userprefs[b]?g_userprefs[b]:"undefined"!=typeof g_gblprefs[b]?g_gblprefs[b]:c}
function lpReadAllPrefs(b){var c=g_username_hash&&""!=g_username_hash?g_username_hash:"";g_userprefs=[];g_identity="";var d=opendb();createPrefsTable(d);d?d.transaction(function(a){a.executeSql("SELECT * FROM LastPassPreferences where username_hash=? or username_hash=?",[c,""],function(a,c){g_gblprefs=[];for(var d=0;d<c.rows.length;d++){var g=c.rows.item(d).username_hash,h=c.rows.item(d).prefname,j=c.rows.item(d).prefvalue;""!=g?"language"!=h&&(g_userprefs[h]=j,"identity"==h&&(g_identity=j)):g_gblprefs[h]=
j}if(g_issafari||g_isopera||g_ismaxthon)d=lpGetPref("language",""),include_language(d);start_idle_checker();"undefined"==typeof g_gblprefs.generateHkKeyCode&&setup_default_hotkeys();g_prefs_read=!0;console_log("read: "+c.rows.length+" preferences");b&&b(c.rows.length)},function(a,c){console_log(c)})}):b&&b()}
function setup_default_hotkeys(){g_is_mac?(lpPutGblPref("generateHkKeyCode",0),lpPutGblPref("generateHkMods",""),lpPutGblPref("recheckHkKeyCode",0),lpPutGblPref("recheckHkMods",""),lpPutGblPref("searchHkKeyCode",0),lpPutGblPref("searchHkMods",""),lpPutGblPref("nextHkKeyCode",33),lpPutGblPref("nextHkMods","meta"),lpPutGblPref("prevHkKeyCode",34),lpPutGblPref("prevHkMods","meta"),lpPutGblPref("homeHkKeyCode",0),lpPutGblPref("homeHkMods",""),lpPutGblPref("popoverHkKeyCode",220),lpPutGblPref("popoverHkMods",
"meta")):(lpPutGblPref("generateHkKeyCode",71),lpPutGblPref("generateHkMods","alt"),lpPutGblPref("recheckHkKeyCode",73),lpPutGblPref("recheckHkMods","alt"),lpPutGblPref("searchHkKeyCode",87),lpPutGblPref("searchHkMods","alt"),lpPutGblPref("nextHkKeyCode",33),lpPutGblPref("nextHkMods","alt"),lpPutGblPref("prevHkKeyCode",34),lpPutGblPref("prevHkMods","alt"),lpPutGblPref("homeHkKeyCode",72),lpPutGblPref("homeHkMods","control alt"),lpPutGblPref("popoverHkKeyCode",220),lpPutGblPref("popoverHkMods","alt"));
lpPutGblPref("submitHkKeyCode",0);lpPutGblPref("submitHkMods","");lpPutGblPref("saveallHkKeyCode",0);lpPutGblPref("saveallHkMods","");lpPutGblPref("logoffHkKeyCode",0);lpPutGblPref("logoffHkMods","");lpWriteAllPrefs()}
function lpWriteAllPrefs(){var b=opendb();createPrefsTable(b);b&&b.transaction(function(c){if(null!=g_username_hash&&""!=g_username_hash)for(var b in g_userprefs)c.executeSql("REPLACE INTO LastPassPreferences (username_hash, prefname, prefvalue) VALUES (?, ?, ?)",[g_username_hash,b,g_userprefs[b]],function(){},function(a,b){console_log(b)});for(b in g_gblprefs)c.executeSql("REPLACE INTO LastPassPreferences (username_hash, prefname, prefvalue) VALUES (?, ?, ?)",["",b,g_gblprefs[b]],function(){},function(a,
b){console_log(b)})})}optionsData=[];optionsData.HotKeys=[];
function capturehk(b,c){var d;d=""+(c.ctrlKey?"control":"");d+=c.metaKey?(""!=d?" ":"")+"meta":"";d+=c.altKey?(""!=d?" ":"")+"alt":"";d+=c.shiftKey?(""!=d?" ":"")+"shift":"";if(""==d||"shift"==d)d=getBG().g_is_mac?"meta":"alt";if(8==c.keyCode||127==c.keyCode||46==c.keyCode)optionsData.HotKeys[b+"KeyCode"]=0;else{if(32>=c.keyCode||91==c.keyCode)return;optionsData.HotKeys[b+"KeyCode"]=0!=c.keyCode?c.keyCode:c.charCode}optionsData.HotKeys[b+"Mods"]=d;writeHotKeyValue(b)}
function writeHotKeyValue(b){var c=optionsData.HotKeys[b+"KeyCode"],d=document.getElementById(b),a="";if(0!=c){b=optionsData.HotKeys[b+"Mods"];"string"!=typeof b&&(b="");b=b.split(" ");for(var e in b)"control"==b[e]&&(a+=gs("Ctrl")+"+"),"meta"==b[e]&&(a+=gs("Meta")+"+"),"alt"==b[e]&&(a+=gs("Alt")+"+"),"shift"==b[e]&&(a+=gs("Shift")+"+")}if(0!=c){c=parseInt(c);switch(c){case 33:a+=gs("Page Up");break;case 34:a+=gs("Page Down");break;case 35:a+=gs("End");break;case 36:a+=gs("Home");break;case 37:a+=
gs("Left");break;case 38:a+=gs("Up");break;case 39:a+=gs("Right");break;case 40:a+=gs("Down");break;case 189:a+="-";break;case 219:a+="[";break;case 220:a+="\\";break;case 221:a+="]";break;case 186:a+=";";break;case 222:a+="'";break;case 188:a+=",";break;case 187:a+="+";break;case 190:a+=".";break;case 191:a+="/";break;case 106:a+="*";break;case 192:a+="~";break;case 124:a+=gs("Print Screen");break;default:a+=String.fromCharCode(c).toUpperCase()}d.value=a}else d.value=""}
function fixhk(b,c){32>optionsData.HotKeys[b+"KeyCode"]&&(optionsData.HotKeys[b+"Mods"]="",writeHotKeyValue(b));c.cancelBubble=!0;c.stopPropagation()}var last_idle_check=0,idle_checker_started=!1;function start_idle_checker(){0==last_idle_check&&!idle_checker_started&&0<parseInt(lpGetPref("idleLogoffVal",0))&&(last_idle_check=lp_get_gmt_timestamp(),idle_checker_started=!0,setTimeout(function(){idle_checker()},1E4))}var last_active_time=0,enable_native_idle=!0;
function idle_checker(){var b=parseInt(lpGetPref("idleLogoffVal",0));if(0<b){var c=60*b,d=function(a){var d=!1,f=lp_get_gmt_timestamp();"active"==a?last_active_time=lp_get_gmt_timestamp():"locked"==a?d=c<f-last_active_time:"idle"==a&&(d=!0);var g=!0;if(0!=last_idle_check&&0!=c&&(d||c<f-last_idle_check))console_log("IDLE CHECKER ISSUING LOGOFF: idleLogoffVal="+b+" isidle="+d+" limit="+c+" currtime="+f+" last_idle_check="+last_idle_check+" state="+a+" last_active_time="+last_active_time),lplogoff_if(),
g=!1;g&&(last_idle_check=f)},a=function(a){a?call_binary_function("get_idle_ms",function(a){a=parseInt(a/1E3);d(c<a?"idle":"active")}):enable_native_idle&&("undefined"!=typeof chrome&&"undefined"!=typeof chrome.idle)&&chrome.idle.queryState(c,d)};have_binary_function("get_idle_ms")?have_binary_function("can_check_idle")?call_binary_function("can_check_idle",a):a(!0):a(!1)}setTimeout(function(){idle_checker()},1E4)};
