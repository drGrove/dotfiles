var g_np_init=!1,namedpipeobserverfunction=null;
function lpnp_init(){g_np_init||(!g_is_win&&!g_is_mac&&!g_is_linux?g_np_init=!1:g_issafari&&g_is_win?g_np_init=!1:have_binary()?is_chrome_portable()?g_np_init=!1:(lpdbg("namedpipes","lpnp_init : initializing named pipe server"),namedpipeobserverfunction=function(b,e,a){try{if("lpxpcom"==e){b="";var d=a.match(/^<([^ \/]+)/);d&&(b=d[1]);if(!LPISLOC||!("refresh_local"!=b&&"local_pwchange"!=b))switch(lpdbg("namedpipes","received cmd="+b+" data="+a),b){case "pipeinitdone":call_binary_function("NamedPipeNumClients",function(a){1<
a?(lpnp_notify("internal_logincheck",[]),setTimeout(function(){lp_StartLogin()},500)):lp_StartLogin()});break;case "logout":console_log("LOGGING OFF : namedpipes : logoff");lplogoff(!0,"namedpipes1");break;case "login":var m=a.match(/data0=\"([^\"]*)\"/),f=a.match(/data1=\"([^\"]*)\"/);if(m&&f){var c=lpxmlunescape(m[1]),n=lpxmlunescape(f[1]);""!=c&&""!=n&&LP_do_login(c,n)}break;case "refresh":refresh_windows();break;case "switchidentity":if(f=a.match(/data0=\"([^\"]*)\"/)){var q=lpxmlunescape(f[1]);
switch_identity(q,!0,!1,!0)}break;case "launch":var f=a.match(/id=\"([^\"]*)\"/),r=a.match(/existing=\"([^\"]*)\"/);if(f){var k=lpxmlunescape(f[1]),g=[];g.data0=k;lpnp_notify("launchok",g);r?fillaid(k):launch(k)}break;case "internal_logincheck":lploggedin&&(g=[],g.data0=lp_phpsessid,g.data1=g_username,g.data2=g_identity,lpnp_notify("internal_logincheck_ack",g));break;case "internal_logincheck_ack":var h=a.match(/data0=\"([^\"]*)\"/),c=a.match(/data1=\"([^\"]*)\"/),j=a.match(/data2=\"([^\"]*)\"/);
if(!lploggedin&&h&&c){var l=opendb();createSavedLoginsTable(l);l&&l.transaction(function(a){var b=(new Date).getTime();a.executeSql("UPDATE LastPassSavedLogins2 SET last_login = ? WHERE username = ?",[b,lpxmlunescape(c[1])],function(a,s){0==s.rowsAffected&&a.executeSql("INSERT INTO LastPassSavedLogins2 (username, password, last_login) VALUES (?, '', ?)",[lpxmlunescape(c[1]),b])},function(a,b){console_log(b)})});a=g_username_hash;d=g_username;g_username=lpusername=lpxmlunescape(c[1]);g_username_hash=
SHA256(lpxmlunescape(c[1]));g_identity=""+(j?lpxmlunescape(j[1]):"");lpPutUserPref("identity",j?lpxmlunescape(j[1]):"");g_username=lpusername=d;g_username_hash=lpusername_hash=a;lpWriteAllPrefs();lp_phpsessid=lpxmlunescape(h[1]);rsa_setpendingsharests();have_binary_function("read_file")&&call_binary_function("read_file",db_prepend(SHA256(lpxmlunescape(c[1]))+"_lpall.slps"),function(a){var b=function(a){if("string"==typeof a&&""!=a){var b=opendb();createDataTable(b);b&&b.transaction(function(b){b.executeSql("REPLACE INTO LastPassData (username_hash, type, data) VALUES (?, 'key', ?)",
[db_prepend(SHA256(lpxmlunescape(c[1]))),a],function(){lp_StartLogin(!0)},function(a,b){console_log(b)})})}};"string"!=typeof a||""==a?call_binary_function("read_file",db_prepend(SHA256(lpxmlunescape(c[1]))+"_lpall.lps"),function(a){"string"==typeof a&&""!=a&&protect_data(a,!0,null,function(a){call_binary_function("write_file",db_prepend(SHA256(lpxmlunescape(c[1]))+"_lpall.slps"),a);call_binary_function("delete_file",db_prepend(SHA256(lpxmlunescape(c[1]))+"_lpall.lps"))});b(a)}):unprotect_data(a,
!0,b)})}else if(lploggedin&&(h&&c)&&(null!=lp_phpsessid&&""!=lp_phpsessid&&lp_phpsessid!=lpxmlunescape(h[1])||g_username!=lpxmlunescape(c[1])))console_log("LOGGING OFF : namedpipes : different username"),lplogoff(!1,"namedpipes2");break;case "refresh_local":var p=a.match(/data0=\"([^\"]*)\"/);p&&lpxmlunescape(p[1])==g_username_hash&&(console_log("named_pipes: refresh_local reparsing"),get_accts_local());break;case "local_pwchange":console_log("LOGGING OFF : namedpipes : local_pwchange");lplogoff(!1,
"namedpipes3");break;default:lpdbg("namedpipes","received unknown message. data="+a)}}}catch(t){}},call_binary_function("StartNamedPipeServer"),g_np_init=!0,setTimeout(function(){lpnp_notify("logincheck")},1E3),g_issafari&&g_is_mac&&lpnp_get_javascript_message()):lpdbg("namedpipes","named pipe server could not be started"))}
function lpnp_get_javascript_message(){have_binary_function("get_javascript_message")&&call_binary_function("get_javascript_message",function(b){0<b.length&&namedpipeobserverfunction(null,"lpxpcom",b);setTimeout(function(){lpnp_get_javascript_message()},0==b.length?2E3:0)})}
function lpnp_notify(b,e){if((!LPISLOC||!("refresh_local"!=b&&"local_pwchange"!=b))&&g_np_init&&have_binary_function("SendNamedPipeMessageToAll")){var a=lpnp_xml_msg(b,e);lpdbg("namedpipes","broadcasting "+a);call_binary_function("SendNamedPipeMessageToAll",a)}}function lpnp_xml_msg(b,e){var a="<"+b,d;if("undefined"!=typeof e)for(d in e)a+=" "+d+'="'+lpxmlescape(e[d])+'"';return a+"/>"};
