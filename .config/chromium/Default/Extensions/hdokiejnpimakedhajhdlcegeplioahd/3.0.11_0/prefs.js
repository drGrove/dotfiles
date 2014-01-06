function lpPutUserPref(a,b){g_userprefs[a]=b}function lpPutGblPref(a,b){g_gblprefs[a]=b}function lpGetPref(a,b){if(typeof g_userprefs[a]!="undefined")return g_userprefs[a];if(typeof g_gblprefs[a]!="undefined")return g_gblprefs[a];return b}
function lpReadAllPrefs(a){var b=g_username_hash&&g_username_hash!=""?g_username_hash:"";g_userprefs=[];g_identity="";var d=opendb();createPrefsTable(d);if(d)d.transaction(function(c){c.executeSql("SELECT * FROM LastPassPreferences where username_hash=? or username_hash=?",[b,""],function(e,f){g_gblprefs=[];for(var g=0;g<f.rows.length;g++){var h=f.rows.item(g).username_hash,i=f.rows.item(g).prefname,j=f.rows.item(g).prefvalue;if(h!=""){if(i!="language"){g_userprefs[i]=j;if(i=="identity")g_identity=
j}}else g_gblprefs[i]=j}if(g_issafari||g_isopera||g_ismaxthon){g=lpGetPref("language","");include_language(g)}start_idle_checker();typeof g_gblprefs.generateHkKeyCode=="undefined"&&setup_default_hotkeys();g_prefs_read=true;console_log("read: "+f.rows.length+" preferences");a&&a(f.rows.length)},function(e,f){console_log(f)})});else a&&a()}
function setup_default_hotkeys(){if(g_is_mac){lpPutGblPref("generateHkKeyCode",0);lpPutGblPref("generateHkMods","");lpPutGblPref("recheckHkKeyCode",0);lpPutGblPref("recheckHkMods","");lpPutGblPref("searchHkKeyCode",0);lpPutGblPref("searchHkMods","");lpPutGblPref("nextHkKeyCode",33);lpPutGblPref("nextHkMods","meta");lpPutGblPref("prevHkKeyCode",34);lpPutGblPref("prevHkMods","meta");lpPutGblPref("homeHkKeyCode",0);lpPutGblPref("homeHkMods","");lpPutGblPref("popoverHkKeyCode",220);lpPutGblPref("popoverHkMods",
"meta")}else{lpPutGblPref("generateHkKeyCode",71);lpPutGblPref("generateHkMods","alt");lpPutGblPref("recheckHkKeyCode",73);lpPutGblPref("recheckHkMods","alt");lpPutGblPref("searchHkKeyCode",87);lpPutGblPref("searchHkMods","alt");lpPutGblPref("nextHkKeyCode",33);lpPutGblPref("nextHkMods","alt");lpPutGblPref("prevHkKeyCode",34);lpPutGblPref("prevHkMods","alt");lpPutGblPref("homeHkKeyCode",72);lpPutGblPref("homeHkMods","control alt");lpPutGblPref("popoverHkKeyCode",220);lpPutGblPref("popoverHkMods",
"alt")}lpPutGblPref("submitHkKeyCode",0);lpPutGblPref("submitHkMods","");lpPutGblPref("saveallHkKeyCode",0);lpPutGblPref("saveallHkMods","");lpPutGblPref("logoffHkKeyCode",0);lpPutGblPref("logoffHkMods","");lpWriteAllPrefs()}
function lpWriteAllPrefs(){var a=opendb();createPrefsTable(a);a&&a.transaction(function(b){if(g_username_hash!=null&&g_username_hash!="")for(var d in g_userprefs)b.executeSql("REPLACE INTO LastPassPreferences (username_hash, prefname, prefvalue) VALUES (?, ?, ?)",[g_username_hash,d,g_userprefs[d]],function(){},function(c,e){console_log(e)});for(d in g_gblprefs)b.executeSql("REPLACE INTO LastPassPreferences (username_hash, prefname, prefvalue) VALUES (?, ?, ?)",["",d,g_gblprefs[d]],function(){},function(c,
e){console_log(e)})})}optionsData=[];optionsData.HotKeys=[];
function capturehk(a,b){var d="";d+=b.ctrlKey?"control":"";d+=b.metaKey?(d!=""?" ":"")+"meta":"";d+=b.altKey?(d!=""?" ":"")+"alt":"";d+=b.shiftKey?(d!=""?" ":"")+"shift":"";if(d==""||d=="shift")d=getBG().g_is_mac?"meta":"alt";if(b.keyCode==8||b.keyCode==127||b.keyCode==46)optionsData.HotKeys[a+"KeyCode"]=0;else if(b.keyCode<=32||b.keyCode==91)return;else optionsData.HotKeys[a+"KeyCode"]=b.keyCode!=0?b.keyCode:b.charCode;optionsData.HotKeys[a+"Mods"]=d;writeHotKeyValue(a)}
function writeHotKeyValue(a){var b=optionsData.HotKeys[a+"KeyCode"],d=document.getElementById(a),c="";if(b!=0){a=optionsData.HotKeys[a+"Mods"];if(typeof a!="string")a="";a=a.split(" ");for(var e in a){if(a[e]=="control")c+=gs("Ctrl")+"+";if(a[e]=="meta")c+=gs("Meta")+"+";if(a[e]=="alt")c+=gs("Alt")+"+";if(a[e]=="shift")c+=gs("Shift")+"+"}}if(b!=0){b=parseInt(b);switch(b){case 33:c+=gs("Page Up");break;case 34:c+=gs("Page Down");break;case 35:c+=gs("End");break;case 36:c+=gs("Home");break;case 37:c+=
gs("Left");break;case 38:c+=gs("Up");break;case 39:c+=gs("Right");break;case 40:c+=gs("Down");break;case 189:c+="-";break;case 219:c+="[";break;case 220:c+="\\";break;case 221:c+="]";break;case 186:c+=";";break;case 222:c+="'";break;case 188:c+=",";break;case 187:c+="+";break;case 190:c+=".";break;case 191:c+="/";break;case 106:c+="*";break;case 192:c+="~";break;case 124:c+=gs("Print Screen");break;default:c+=String.fromCharCode(b).toUpperCase()}d.value=c}else d.value=""}
function fixhk(a,b){if(optionsData.HotKeys[a+"KeyCode"]<32){optionsData.HotKeys[a+"Mods"]="";writeHotKeyValue(a)}b.cancelBubble=true;b.stopPropagation()}var last_idle_check=0,idle_checker_started=false;function start_idle_checker(){if(last_idle_check==0&&!idle_checker_started)if(parseInt(lpGetPref("idleLogoffVal",0))>0){last_idle_check=lp_get_gmt_timestamp();idle_checker_started=true;setTimeout(function(){idle_checker()},1E4)}}var last_active_time=0,enable_native_idle=true;
function idle_checker(){var a=parseInt(lpGetPref("idleLogoffVal",0));if(a>0){var b=a*60,d=function(e){var f=false,g=lp_get_gmt_timestamp();if(e=="active")last_active_time=lp_get_gmt_timestamp();else if(e=="locked")f=b<g-last_active_time;else if(e=="idle")f=true;var h=true;if(last_idle_check!=0&&b!=0&&(f||b<g-last_idle_check)){console_log("IDLE CHECKER ISSUING LOGOFF: idleLogoffVal="+a+" isidle="+f+" limit="+b+" currtime="+g+" last_idle_check="+last_idle_check+" state="+e+" last_active_time="+last_active_time);
lplogoff_if();h=false}if(h)last_idle_check=g};if(have_nplastpass()&&typeof g_nplastpass.get_idle_ms=="function"&&(typeof g_nplastpass.can_check_idle!="function"||g_nplastpass.can_check_idle())){var c=g_nplastpass.get_idle_ms();c=parseInt(c/1E3);d(b<c?"idle":"active")}else enable_native_idle&&typeof chrome!="undefined"&&typeof chrome.idle!="undefined"&&chrome.idle.queryState(b,d)}setTimeout(function(){idle_checker()},1E4)};
