function hasNeverAutologin(b,a){var e=lpcanonizeUrl(b);if(g_neverurls.onlyautologins&&0<g_neverurls.onlyautologins.length){for(var d=!1,c=0;g_neverurls.onlyautologins&&c<g_neverurls.onlyautologins.length;c++){var f=g_neverurls.onlyautologins[c];if(f==a||f==e){d=!0;break}}if(!d)return!0}for(c=0;g_neverurls.neverautologins&&c<g_neverurls.neverautologins.length;c++)if(f=g_neverurls.neverautologins[c],f==a||f==e)return!0;return!1}
function hasNeverGenerate(b,a){var e=lpcanonizeUrl(b);if(g_neverurls.onlygenerates&&0<g_neverurls.onlygenerates.length){for(var d=!1,c=0;g_neverurls.onlygenerates&&c<g_neverurls.onlygenerates.length;c++){var f=g_neverurls.onlygenerates[c];if(f==a||f==e){d=!0;break}}if(!d)return!0}for(c=0;g_neverurls.nevergenerates&&c<g_neverurls.nevergenerates.length;c++)if(f=g_neverurls.nevergenerates[c],f==a||f==e)return!0;return!1}
function hasNeverFormFill(b,a){var e=lpcanonizeUrl(b);if(g_neverurls.onlyformfills&&0<g_neverurls.onlyformfills.length){for(var d=!1,c=0;g_neverurls.onlyformfills&&c<g_neverurls.onlyformfills.length;c++){var f=g_neverurls.onlyformfills[c];if(f==a||f==e){d=!0;break}}if(!d)return!0}for(c=0;g_neverurls.neverformfills&&c<g_neverurls.neverformfills.length;c++)if(f=g_neverurls.neverformfills[c],f==a||f==e)return!0;return!1}var g_accessibility_enabled=-1;
function handleFill(b,a){var e=!1;if(lploggedin&&null==grid_getdata("active")||skiplogin())if("autofillaid"==a.cmd||"autologinaid"==a.cmd){var d=a.aid;g_last_launch[d]=(new Date).getTime();"undefined"!=typeof g_sites[d]&&(e="autologinaid"==a.cmd,fill(b,g_sites[d],null,e,!e,"all",!0,!1,!0))}else if(!("undefined"==typeof a||!a||"undefined"==typeof a.url)){var c=a.url,f=lp_gettld_url(c);if(!lp_url_is_lastpass(c)){if("undefined"!=typeof g_launches[b]&&g_launches[b]&&(d=g_launches[b],check_ident_aid(d)&&
compare_tlds(f,lp_gettld_url(g_sites[d].url)))){if("undefined"!=typeof a.numpass&&0<a.numpass||""==g_sites[d].password)g_launches[b]=null;"undefined"!=typeof g_sites[d]&&(is_guiless()?fill(b,g_sites[d],null,!1,!1,"all",!0,!1,!1,!1):fill(b,g_sites[d],null,!0,!1,a.docnum,!1,!0),g_launches[b]=null)}var g=getsites(f),g=reorderOnURL(g,c,!0);hasNeverAutologin(c,f)&&(g=[]);d=0==a.force&&a.topurl!=c?lp_gettld_url(a.topurl):"";""!=d&&hasNeverAutologin(a.topurl,d)&&(g=[]);for(var j in g){try{if(islastpass&&
g_ischrome&&1==g[j].basic_auth&&0>=g_accessibility_enabled&&0==lpGetPref("basicauthnever",0))if(g_is_mac&&have_binary_function("accessibility_enabled"))call_binary_function("accessibility_enabled",function(a){g_accessibility_enabled=a?1:0;0==g_accessibility_enabled&&setTimeout(function(){get_selected_tab(null,function(a){sendCS(gettabid(a),{cmd:"showbasicauthnotification",needbinary:0,text:gs("In order for LastPass to fill into basic authentication dialogs, you need to enable access for assistive devices.")})})},
100)});else if((g_is_win||g_is_mac)&&!have_binary())g_accessibility_enabled=0,setTimeout(function(){get_selected_tab(null,function(a){sendCS(gettabid(a),{cmd:"showbasicauthnotification",needbinary:1,text:gs("In order for LastPass to fill into basic authentication dialogs, you need to install the binary version of LastPass for Chrome.")})})},100)}catch(k){}f=!1;d=g[j].aid;if(check_ident_aid(d)&&"undefined"!=typeof g_sites[d]){d=g_sites[d];d.never_autofill&&(f=!0);if(d.pwprotect||g_prompts.login_site_prompt)f=
!0;if(!d.genpw&&!(0==d.fields.length&&""==d.username)){0==d.url.indexOf("https://")&&0!=c.indexOf("https://")&&(f=!0);0==parseInt(lpGetPref("automaticallyFill",1))&&0==parseInt(lpGetPref("highlightFields",1))&&(f=!0);if(!f){if(j=!d.save_all)"undefined"==typeof g_fillfieldsmatches[c]&&(g_fillfieldsmatches[c]=[]),g_fillfieldsmatches[c][g_fillfieldsmatches[c].length]=d,g_fillfieldsmatchescurridx[c]=0;f=parseInt(lpGetPref("automaticallyFill",1));fill(b,d,a.docid,null,j,a.docnum,null,!0,null,f)}0!=lpGetPref("showFillNotificationBar",
1)&&(get_selected_tab(null,function(){sendCS(b,{cmd:"showfillnotification",text:gs("LastPass has filled your login information into the form on this page."),sites:cache_usernames(g),docnum:a.docnum})}),e=!0);break}}}!e&&0==lpGetPref("showNotificationsAfterClick",1)&&checkgenpwfillforms(b,c)}}}
function checkWeakAndDuplicate(b,a,e){if(g_showweakdupalerts&&qualifyForWeakCheck(getpasswordfromacct(b))&&(g_ischrome||g_issafari))!g_disablepwalerts&&("undefined"==typeof b.noalert||"1"!=b.noalert)&&getWeakAndDuplicateIds(g_username_hash,g_username,function(d){isDuplicateSite(d[0],b.aid)?(g_notification_type="alert",g_notification_data={cmd:"notification",type:"alert",aid:b.aid,name:b.name,username:getusernamefromacct(b),alerttype:"duplicate",tld:e,tabid:a},set_badge(g_notification_data,a),drawIconAtRotation(0)):
isWeakPassword(d[1],b.aid)&&(g_notification_type="alert",g_notification_data={cmd:"notification",type:"alert",aid:b.aid,name:b.name,username:getusernamefromacct(b),alerttype:"weak",tld:e,tabid:a},set_badge(g_notification_data,a),drawIconAtRotation(0))})}
function checkgenpwfillforms(b,a){var e=lp_gettld_url(a),d=1!=lpGetPref("showGenerateNotifications",1)||hasNeverGenerate(a,e),c=1!=lpGetPref("showFormFillNotifications",1)||hasNeverFormFill(a,e),f=[];if(do_experimental_popupfill){for(var g=0;g<g_formfills.length;g++)check_ident_ffid(g_formfills[g].ffid)&&(f[f.length]=g_formfills[g]);0==f.length&&(c=!0);sendCS(b,{cmd:"checkgenpwfillforms",nevergenerate:d,neverformfill:c,sites:cache_usernames(reorderOnURL(getsites(e),a,!0,!0)),formfills:LPJSON.stringify(f),
ff:g_cachedffdat,active:g_popupfill_last_active[b],activefieldid:g_popupfill_last_active_fieldid[b]},"all")}else{if(!c){for(g=0;g<g_formfills.length;g++)check_ident_ffid(g_formfills[g].ffid)&&(f[f.length]=g_formfills[g]);0==f.length&&(c=!0)}(!d||!c)&&sendCS(b,{cmd:"checkgenpwfillforms",nevergenerate:d,neverformfill:c,sites:cache_usernames(reorderOnURL(getsites(e),a,!0,!0)),formfills:LPJSON.stringify(f),ff:g_cachedffdat},"all")}}
function cache_usernames(b){for(var a in b)b[a].useusername=getusernamefromacct(b[a]);return LPJSON.stringify(b)}
function hasNeverSave(b,a){var e=lpcanonizeUrl(b);if(g_neverurls.onlyaccounts&&0<g_neverurls.onlyaccounts.length){for(var d=!1,c=0;g_neverurls.onlyaccounts&&c<g_neverurls.onlyaccounts.length;c++){var f=g_neverurls.onlyaccounts[c];if(f==a||f==e){d=!0;break}}if(!d)return!0}for(c=0;g_neverurls.neveraccounts&&c<g_neverurls.neveraccounts.length;c++)if(f=g_neverurls.neveraccounts[c],f==a||f==e)return!0;return!1}
function handleNever(b,a){if("neverautofill"==a.cmd){var e=a.aid;if("undefined"==typeof g_sites[e])return;g_sites[e].never_autofill=!0;g_sites[e].autologin=!1;e="aid="+en(e);lpMakeRequest(base_url+"set_never_autofill.php",e,null,null)}else if("neverdomain"==a.cmd||"neverpage"==a.cmd){var d="neverdomain"==a.cmd?lp_gettld_url(a.url):lpcanonizeUrl(a.url),e="url="+en(AES.url2hex(d));"undefined"!=typeof a.fromsave&&a.fromsave?g_neverurls.neveraccounts.push(d):"undefined"!=typeof a.fromgenerate&&a.fromgenerate?
(e+="&type=1",g_neverurls.nevergenerates.push(d)):"undefined"!=typeof a.fromformfill&&a.fromformfill?(e+="&type=2",g_neverurls.neverformfills.push(d)):"undefined"!=typeof a.fromshowicons&&a.fromshowicons?(e+="&type=6",g_neverurls.nevershowicons.push(d)):(e+="&type=3",g_neverurls.neverautologins.push(d));lpMakeRequest(base_url+"add_never.php",e,null,null)}g_local_accts_version++;rewritelocalfile()}
function handleSave(b,a){if(!("undefined"==typeof SAVEALLFORMSUBMITS&&(!lploggedin||lp_url_is_lastpass(a.url)))){for(var e=a.formdata.split("\n"),d=!1,c=!1,f="",g="",j=[],k=0;k<e.length;k++){var h=e[k],h=h.split("\t");if(!(4!=h.length&&5!=h.length)){var p=decodeURIComponent(h[2]),l=h[3];if((!d||!c)&&("text"==l||"email"==l||"tel"==l||"url"==l)&&p.length)f=p,d=!0,!1==c&&"undefined"!=typeof SpecialSites[lpcanonizeUrl(a.url)]&&(c=!0);"password"==l&&(j[j.length]=p,!c&&p.length&&(g=p,c=!0))}}if(c){a.username=
f;a.password=g;!d&&1<j.length&&j[0]!=j[1]&&(a.username=j[0],a.password=j[1]);c=lp_gettld_url(a.url);a.tld=c;var p=!1,r="";1<j.length&&j[j.length-1]==j[j.length-2]&&""!=j[j.length-1]?(p=!0,r=j[j.length-1]):1<j.length&&(j[0]==j[1]&&""!=j[0])&&(p=!0,r=j[0]);var m=[];if(p&&(m=getsites(c,!0),a.createacct=2==j.length||0<array_length(m),a.createacct)){for(var s=j="",n="",u="",k=0;k<e.length;k++)if(h=e[k],h=h.split("\t"),!(4!=h.length&&5!=h.length)){l=h[3];if(""==j&&("email"==l||"tel"==l||"text"==l||"url"==
l)&&""!=h[1]&&""!=h[2]){var q=decodeURIComponent(h[1]),t=get_ff_translation("ff_username_regexp");""!=t&&(t=RegExp(t,"i"),t.exec(q)&&(j=q,s=decodeURIComponent(h[2])))}if(""==n&&("email"==l||"tel"==l||"text"==l||"url"==l)&&""!=h[1]&&""!=h[2])q=decodeURIComponent(h[1]),l=get_ff_translation("ff_email_regexp"),""!=l&&(t=RegExp(l,"i"),t.exec(q)&&(n=q,u=decodeURIComponent(h[2])));if(""!=j&&""!=n)break}""==j&&(j=n,s=u);a.username_field=j;""!=s&&(a.username=s)}if(p&&0<array_length(m)){if(!("undefined"!=typeof g_didchangepw[SHA256(r+
c)]&&g_didchangepw[SHA256(r+c)]>(new Date).getTime()-6E5)&&(g_notification_type="change",a.newpw=r,g_notification_data=a,sendTS({cmd:"notification",type:"change"}),0!=lpGetPref("showChangeNotificationBar",1))){var e=m,v;a.sitecount=array_length(e);if(1==array_length(e))for(k in e){a.singleaid=k;v=gs("LastPass detected a password change for user:")+" "+getusernamefromacct(g_sites[k]);break}else v=gs("LastPass detected a password change for domain:")+" "+c;sendCS(b,{cmd:"showchangenotification",text:v,
notificationdata:a});g_persistent_notifications[b]={cmd:"showchangenotification",text:v,notificationdata:a}}}else if(!hasNeverSave(a.url,c)){var e=getsites(c),w;for(w in e)if(check_ident_aid(w)&&"undefined"!=typeof g_sites[w]&&(k=g_sites[w],(!d||f==lpmdec_acct(k.username,!0,k,g_shares)||0==f.indexOf("****"))&&g==lpmdec_acct(k.password,!0,k,g_shares)||k.save_all&&isMatch(k,d,f,g)||f==lpmdec_acct(k.username,!0,k,g_shares)&&""==g))return;g_notification_type="save";g_notification_data=a;"function"==typeof ManSubmitCallback?
(d=[],d.postdata=g_notification_data.formdata,d.tld=c,ManSubmitCallback(d)):(0!=lpGetPref("showSaveSiteNotifications",0)&&sendTS({cmd:"notification",type:"save"}),0!=lpGetPref("showSaveNotificationBar",1)&&lpCheckAddSite(a.username,a.password,c)&&(sendCS(b,{cmd:"showaddnotification",text:gs("Should LastPass remember this password?"),notificationdata:LPJSON.stringify(a)}),g_persistent_notifications[b]={cmd:"showaddnotification",text:gs("Should LastPass remember this password?"),notificationdata:LPJSON.stringify(a)}))}}}}
function lpCheckAddSite(b,a,e){var d=lp_get_gmt_timestamp(),c=[],f;for(f in g_rejectedaddsites){var g=g_rejectedaddsites[f];d>g.rejectedTime+600&&(c[c.length]=f)}for(f=c.length-1;0<=f;f--)g_rejectedaddsites.splice(c[f],1);for(f in g_rejectedaddsites)if(g=g_rejectedaddsites[f],g.username==b&&lpdec(g.encryptedPassword)==a&&compare_tlds(g.tld,e))return!1;return!0}
function handleUpdateFields(b,a){var e=a.aid,d=g_sites[e],c=issharedfolder(g_shares,d.group);if(checkreadonly(c,!0)){var f=[],g=[],j=updateAndEncryptData(a.formdata,f,g,d);update_username_from_fields_if(d,f);for(var k=d.fields.length-1;0<=k;k--)!d.fields[k].otherfield&&"1"!=d.fields[k].otherlogin&&d.fields.splice(k,1);for(k=0;k<f.length;k++)d.fields[d.fields.length]=f[k];g_local_accts_version++;rewritelocalfile();e="data="+en(bin2hex(j))+"&ref="+en(url2hex(a.url))+"&updatefields=1&aid="+en(e);e+=
!1==c?"":"&sharedfolderid="+en(c.id);d.postdata=e;d.posturl=base_url+"gm_deliver.php";d.newvalues=g;updateFieldsFromSubmit(e,d)}}
function handleAddUrid(b,a){var e=a.aid,d=g_sites[e],c=issharedfolder(g_shares,d.group);if(checkreadonly(c,!0)){for(var f=[],g=0;g<d.fields.length;g++)"1"==d.fields[g].otherlogin&&!lp_in_array(d.fields[g].urid,f)&&(f[f.length]=d.fields[g].urid);if(!(10<=f.length)){var j=[],f=[],k=updateAndEncryptData(a.formdata,j,f,d);update_username_from_fields_if(d,j);for(g=0;g<j.length;g++)j[g].otherlogin="1",j[g].url=url2hex(a.url),d.fields[d.fields.length]=j[g];g_local_accts_version++;rewritelocalfile();e="data="+
en(bin2hex(k))+"&ref="+en(url2hex(a.url))+"&addurid=1&aid="+en(e);e+=!1==c?"":"&sharedfolderid="+en(c.id);d.postdata=e;d.posturl=base_url+"gm_deliver.php";d.newvalues=f;updateFieldsFromSubmit(e,d)}}}
function update_username_from_fields_if(b,a){for(var e=0,d="",c=0;c<a.length;c++)if("text"==a[c].type||"email"==a[c].type||"tel"==a[c].type||"url"==a[c].type)if(d=a[c].value,2<=++e)break;if(1==e&&""!=d){for(c=e=0;c<b.fields.length;c++)if(!b.fields[c].otherfield&&("text"==b.fields[c].type||"email"==b.fields[c].type||"tel"==b.fields[c].type||"url"==b.fields[c].type)){e++;break}0==e&&(b.username=d,b.unencryptedUsername=lpdec_acct(crypto_btoa(b.username),b,g_shares))}}
function handleSaveAll(b,a){a.save_all=1;g_site_data=a;openURL(getchromeurl("site.html"))}
function isMatch(b,a,e,d){a=a?!1:!0;for(var c=!1,f=0;f<b.fields.length;f++)if(!("text"!=b.fields[f].type&&"password"!=b.fields[f].type&&"email"!=b.fields[f].type&&"tel"!=b.fields[f].type&&"url"!=b.fields[f].type)){var g=lpmdec_acct(b.fields[f].value,!0,b,g_shares);if(("text"==b.fields[f].type||"email"==b.fields[f].type||"tel"==b.fields[f].type||"url"==b.fields[f].type)&&e==g)a=!0;"password"==b.fields[f].type&&d==g&&(c=!0)}return a&&c?!0:!1}
function fill(b,a,e,d,c,f,g,j,k,h,p){verbose_log("tabid="+b+"\nacct="+a+"\ndocid="+e+"\nsubmit="+d+"\ndoconfirm="+c+"\ndocnum="+f+"\nallowforce="+g+"\nskip_pwprotect="+j);if("undefined"==typeof h||null==h)h=1;k||(k=!1);!j&&(a.pwprotect||g_prompts.login_site_prompt)?(console_log("FILL : Showing Security Prompt"),security_prompt(function(){setTimeout(function(){fill(b,a,e,d,c,f,g,!0,k)},100)})):get_selected_tab(null,function(l){if(!p&&h&&(g||1==a.basic_auth)&&gettabid(l)==b&&g_ischrome&&have_binary_function("fill_basicauth")){l=
getusernamefromacct(a);var r=getpasswordfromacct(a);if(""!=l||""!=r){var m=check_autologin(d,a),s=lp_gettld_url(a.url),n=lp_gettld_url(g_basicauth_origurl);compare_tlds(s,n)&&(s=n);call_binary_function("fill_basicauth",l,r,g?!0:!1,s,m?!0:!1,function(l){l?g_basicauth_found=!1:fill(b,a,e,d,c,f,g,j,k,h,!0)});return}}is_guiless()&&(h=1);l=a.fields;m=l.length;c=1==c?1:0;g=g?1:0;r=null!=a.sharedfromaid&&""!=a.sharedfromaid&&"0"!=a.sharedfromaid&&"null"!=a.sharedfromaid?1:0;if(0!=m){for(m=s=0;m<l.length;m++)"password"==
l[m].type&&s++;s=!a.save_all&&0==s;for(m=0;m<l.length;m++)if(a.save_all||!(1==c&&"password"!=l[m].type&&!g&&!s)){var n=l[m],u=n.value,q=n.type;if(!("undefined"!=typeof a.captcha_id&&""!=a.captcha_id&&a.captcha_id==n.name&&"text"==q)){if("text"==q||"password"==q||"email"==q||"tel"==q||"textarea"==q||"url"==q)u=lpmdec_acct(u,!0,a,g_shares);if(""!=u){verbose_log("Sending FillRequest: "+m+"\ntype="+q+"\nname="+n.name+"\nvalue=<hidden>");verbose_log("am sending fill request "+n.name);var t="undefined"!=
typeof g_last_launch&&"undefined"!=typeof g_last_launch[a.aid]&&25E3>=(new Date).getTime()-g_last_launch[a.aid],n={cmd:"fillfield",manualfill:k,name:n.name,value:u,formname:n.formname,type:q,docid:e,aid:a.aid,checked:n.checked,doconfirm:c||a.save_all&&"password"==q?1:2,tabid:b,allowforce:g,custom_js:a.custom_js,sharedsite:r,otherfield:n.otherfield,domains:getacceptabletlds(a.url),automaticallyFill:h,is_launch:t,clearfilledfieldsonlogoff:lpGetPref("clearfilledfieldsonlogoff",0)};""!=a.custom_js&&(n.username=
getusernamefromacct(a),n.password=getpasswordfromacct(a),n.onlyfill=d?0:1);sendCS(b,n,f)}}}}else g&&(console_log("no fields. finding best match "+getusernamefromacct(a)+" and <hidden>"),t="undefined"!=typeof g_last_launch&&"undefined"!=typeof g_last_launch[a.aid]&&25E3>=(new Date).getTime()-g_last_launch[a.aid],sendCS(b,{cmd:"fillbest",username:getusernamefromacct(a),password:getpasswordfromacct(a),docid:e,aid:a.aid,custom_js:a.custom_js,updatefields:1,addurid:0,sharedsite:r,domains:getacceptabletlds(a.url),
automaticallyFill:h,is_launch:t,clearfilledfieldsonlogoff:lpGetPref("clearfilledfieldsonlogoff",0)},f));g&&logLoginAndCheckWeakPassword(b,a);if(1!=c&&(m=check_autologin(d,a),"undefined"!=typeof AUTOSUBMIT&&(m=!0),"string"==typeof a.custom_js&&""!=a.custom_js&&sendCS(b,{cmd:"run_custom_js",docid:e,custom_js:a.custom_js,username:getusernamefromacct(a),password:lpmdec_acct(a.password,!0,a,g_shares),onlyfill:m?0:1,loc:3},f),("string"!=typeof a.custom_js||-1==a.custom_js.indexOf("lpdontsubmit"))&&m))l=
"undefined"!=typeof a.submit_id?a.submit_id:"",r="undefined"!=typeof a.submit_html?a.submit_html:"",m="undefined"!=typeof a.submit_js?a.submit_js:"",is_guiless()&&"bankofamerica.com"==lp_gettld_url(a.url)||sendCS(b,{cmd:"submit",docid:e,submit_id:l,submit_html:r,submit_js:m},f)})}
function logLoginAndCheckWeakPassword(b,a){get_all_windows({populate:!0},function(e){for(var d=0;d<e.length;d++)for(var c=0;c<get_tabs_length(e[d]);c++){var f=get_tabs(e[d])[c];if(gettabid(f)==b&&(checkWeakAndDuplicate(a,b,lp_gettld_url(gettaburl(f))),(g_loglogins||LPISLOC)&&"undefined"==typeof g_loggedLogins[a.aid]))g_loggedLogins[a.aid]="1",loglogintab(a.aid,f)}})}function showpageoverlay(b){sendCS(b,{cmd:"showoverlay",urlprefix:getchromeurl("",!0)})}
function check_autologin(b,a){var e=!1;if(b)e=!0;else if(a.autologin){var d=(new Date).getTime(),c=parseInt(lpGetPref("autoautoVal",25));if(isNaN(c)||""==c||0>=c)c=25;c=d-1E3*c;if("undefined"==typeof a.last_auto_login||isNaN(a.last_auto_login)||a.last_auto_login<c)console_log("Launching autologin"),a.last_auto_login=d,e=!0}return e}
function fillfieldsconfirm(b){var a=b.url,e=b.result,d=b.aid,c=b.docid,f=b.tabid,g=b.doconfirm,j=b.manualfill,k="undefined"!=typeof b.automaticallyFill?b.automaticallyFill:1,h=g_sites[d];if("undefined"!=typeof g_sites[d]){if(e&&(logLoginAndCheckWeakPassword(f,h),2==g))return;g=null!=h.sharedfromaid&&""!=h.sharedfromaid&&"0"!=h.sharedfromaid&&"null"!=h.sharedfromaid?1:0;if(h.save_all){if(!e||j)a="undefined"!=typeof g_last_launch&&"undefined"!=typeof g_last_launch[h.aid]&&25E3>=(new Date).getTime()-
g_last_launch[h.aid],sendCS(f,{cmd:"fillbest",username:getusernamefromacct(h),password:getpasswordfromacct(h),docid:c,aid:h.aid,updatefields:0,addurid:0,sharedsite:g,domains:getacceptabletlds(h.url),automaticallyFill:k,is_launch:a,clearfilledfieldsonlogoff:lpGetPref("clearfilledfieldsonlogoff",0)},b.docnum)}else if(e)(h=g_sites[d])&&fill(f,h,c,null,!1,b.docnum,null,!0,null,k),delete g_fillfieldsmatches[a],delete g_fillfieldsmatchescurridx[a];else if(b.allowforce)a="undefined"!=typeof g_last_launch&&
"undefined"!=typeof g_last_launch[h.aid]&&25E3>=(new Date).getTime()-g_last_launch[h.aid],sendCS(f,{cmd:"fillbest",username:getusernamefromacct(h),password:getpasswordfromacct(h),docid:c,aid:h.aid,updatefields:0,addurid:1,sharedsite:g,domains:getacceptabletlds(h.url),automaticallyFill:k,is_launch:a,clearfilledfieldsonlogoff:lpGetPref("clearfilledfieldsonlogoff",0)},b.docnum);else{if(h=g_fillfieldsmatches[a]){e=!1;for(d=0;d<h.length;d++){j=h[d].aid;if(e){(h=g_sites[j])&&fill(f,h,c,null,!0,b.docnum,
null,!0,null,k);return}d==g_fillfieldsmatchescurridx[a]&&(g_fillfieldsmatchescurridx[a]++,e=!0)}}delete g_fillfieldsmatches[a];delete g_fillfieldsmatchescurridx[a]}}}
function web2plug(b){"2"==b.rsa?(g_local_key=AES.hex2bin(b.key),g_local_key_hex=b.key,g_local_key_hash=SHA256(g_local_key),rsa_userchangedpassword(),b=opendb(),createDataTable(b),b&&!LPISLOC&&b.transaction(function(a){a.executeSql("DELETE FROM LastPassData WHERE username_hash=? AND type=?",[db_prepend(g_username_hash),"accts"],function(){},function(a,b){console_log(b)})}),lpWriteKeyFile()):""!=g_username&&g_username!=b.username?loggedOut(!1,"web2plug"):(g_local_key=AES.hex2bin(b.key),g_local_key_hex=
b.key,g_local_key_hash=SHA256(g_local_key),lpWriteKeyFile())}function recover(b,a,e,d){var c=lpParseUri(a);a=c.directory;c=c.file;a=a.replace(/^\/~[^/]*/,"");""!=a&&"/"!=a&&"/sso/"!=a||"recover.php"==c&&GetOTPHash(null,b,e,d)}
function loginfromwebsite(b){if(""!=b.wxusername&&""!=b.keyhex){var a=opendb();createSavedLoginsTable(a);a&&a.transaction(function(c){var d=(new Date).getTime();c.executeSql("UPDATE LastPassSavedLogins2 SET last_login = ? WHERE username = ?",[d,b.wxusername],function(a,c){0==c.rowsAffected&&a.executeSql("INSERT INTO LastPassSavedLogins2 (username, password, last_login) VALUES (?, '', ?)",[b.wxusername,d])},function(a,b){console_log(b)});c.executeSql("SELECT * FROM LastPassSavedLogins2 WHERE username = ? AND password != ''",
[b.wxusername],function(c,d){if(0<d.rows.length){var e=d.rows.item(0).password,f=function(c){var d=get_key_iterations(b.wxusername);make_lp_key_iterations(b.wxusername,c,d,function(c){AES.bin2hex(c)!=b.keyhex&&a.transaction(function(a){a.executeSql("UPDATE LastPassSavedLogins2 SET password = '' WHERE username = ?",[b.wxusername],function(){},function(a,b){console_log(b)})})})};1==d.rows.item(0)["protected"]?unprotect_data(e,!1,f):2==d.rows.item(0)["protected"]&&f(lpdec(e,AES.hex2bin(SHA256(b.wxusername))))}},
function(){})});var e=AES.hex2bin(b.keyhex),d=null!=g_local_key?AES.bin2hex(g_local_key):"";if(!lploggedin||!(g_username==b.wxusername&&d==b.keyhex))lploggedin&&g_username==b.wxusername?(g_local_key=e,g_local_key_hex=b.keyhex,g_local_key_hash=SHA256(g_local_key)):(lploggedin&&""!=g_username&&loggedOut(!1,"differentuser"),""!=b.wxsessid&&(lp_phpsessid=b.wxsessid),g_local_key=e,g_local_key_hex=b.keyhex,g_local_key_hash=SHA256(g_local_key),lpWriteKeyFile(),LP.lplogincheck(!0,null,b.wxusername,b.wxhash))}else lploggedin||
LP.lplogincheck(!0)}
function reorderOnURL(b,a,e,d){var c=lpParseUri(a),f=lpcanonizeUrl(a,c),g="string"==typeof c.path?c.path.split("/"):[],j=lp_gettld_url(a),k=[],h;for(h in b)if(check_ident_aid(h)&&(b=g_sites[h],!("undefined"==typeof b||"undefined"==typeof b.url)))if(b.save_all||!e||!(""==b.unencryptedUsername&&""==b.password))if(!d||accthaspassword(b)){var p=lpParseUri(b.url);b.realmmatch=(a==g_basicauth_url||a==g_basicauth_origurl)&&(lpmdec_acct(b.realm_data,!0,b,g_shares)==g_basicauth_realm||g_basicauth_found&&""==
g_basicauth_realm&&1==b.basic_auth);b.servermatch=c.host==p.host;b.portmatch=compare_ports(c,p);b.serverportmatch=b.servermatch&&b.portmatch?1:0;b.usernamematch="undefined"!=typeof g_username_vals[a]&&""!=g_username_vals[a]&&g_username_vals[a]==b.unencryptedUsername;b.urlmatch=lpcanonizeUrl(b.url)==f?!0:!1;var p="string"==typeof p.path?p.path.split("/"):[],l;for(l=0;l<g.length&&l<p.length&&p[l]==g[l];l++);b.pathlevelmatch=l;b.fieldmatchcount=0;k.push(b)}k.sort(lp_aids_sort_func);return k=checkurlrules(g_urlrules,
k,j,"string"==typeof c.path?c.path:"",c.host,g_sites,get_port(c))}
function lp_aids_sort_func(b,a){return b.realmmatch!=a.realmmatch?b.realmmatch?-1:1:b.usernamematch!=a.usernamematch?b.usernamematch?-1:1:b.fav!=a.fav?"1"==b.fav?-1:1:b.urlmatch!=a.urlmatch?b.urlmatch?-1:1:b.serverportmatch&&a.serverportmatch&&b.pathlevelmatch!=a.pathlevelmatch?b.pathlevelmatch>a.pathlevelmatch?-1:1:b.serverportmatch!=a.serverportmatch?b.serverportmatch?-1:1:b.servermatch!=a.servermatch?b.servermatch?-1:1:b.fieldmatchcount!=a.fieldmatchcount?b.fieldmatchcount>a.fieldmatchcount?-1:
1:b.last_touch!=a.last_touch?b.last_touch>a.last_touch?-1:1:b.name!=a.name?b.name<a.name?-1:1:0}function lp_sort_case_insensitive_name(b,a){b=b.name.toLowerCase();a=a.name.toLowerCase();return b<a?-1:1}function launchautologin(b,a){if(check_ident_aid(b)){var e=g_sites[b];e&&(!a&&(e.pwprotect||g_prompts.login_site_prompt)?security_prompt(function(){launchautologin(b,!0)}):(g_last_launch[e.aid]=(new Date).getTime(),openURL(e.url,function(a,b){g_launches[gettabid(a)]=b},e.aid)))}}
function hasNeverShowIcon(b,a){var e=lpcanonizeUrl(b);if(g_neverurls.onlyshowicons&&0<g_neverurls.onlyshowicons.length){for(var d=!1,c=0;g_neverurls.onlyshowicons&&c<g_neverurls.onlyshowicons.length;c++){var f=g_neverurls.onlyshowicons[c];if(f==a||f==e){d=!0;break}}if(!d)return!0}for(c=0;g_neverurls.nevershowicons&&c<g_neverurls.nevershowicons.length;c++)if(f=g_neverurls.nevershowicons[c],f==a||f==e)return!0;return!1};
