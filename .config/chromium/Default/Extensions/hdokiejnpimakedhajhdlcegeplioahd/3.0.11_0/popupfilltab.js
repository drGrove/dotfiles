var g_reference_url=null,g_rowtypes=null,g_rowtypes_initial=null,g_inputtype=null,g_switchedtabs=!1,g_lastinput=null,g_lastactive=null,g_lastchoose=null,g_lastinputid=null,g_lastmoreopen=null,g_lastshownavbar=null,g_initial_searchtext=null,verbose=!1,popup_actions_cfg={sites:{str:gs("Sites"),id:"popupaction_sites"},savesite:{str:gs("Save Site"),id:"popupaction_savesite"},generate:{str:gs("Generate"),id:"popupaction_generate"},formfill:{str:gs("Form Fills"),id:"popupaction_formfillprofile"},never:{str:gs("Disable LastPass"),
id:"popupaction_never"},more:{str:gs("More"),id:"popupaction_more"}},g_ctr_dofilter=0,g_ctr_poll=0,g_ctr_pollresponse=0,g_icon_number_hint=!0,g_creditcard_profile_annotate=!0,g_nomatches_triggers_save=!0,g_selected_never_row=null,g_selected_more_row=null,g_more_submenu_aid=null,g_more_submenu_ffid=null,g_clickable_input_on_password=!0;document.addEventListener("DOMContentLoaded",function(){loadit()});
function loadit(){g_ischrome?(L("IF -> BG : cmd=getpopupfilldata"),chrome_runtime_sendMessage({cmd:"getpopupfilldata"},function(a){L("BG -> IF : response to getpopupfilldata");null==a||null==a.popuphtml||0==a.popuphtml.length?"function"==typeof closePopups&&closePopups():(translationInit(a.ff_firstname_regexp,a.ff_middlename_regexp,a.ff_lastname_regexp,a.ff_username_regexp,a.ff_email_regexp,a.ff_zip_regexp,a.ff_country_regexp,a.ff_bankacctnum_regexp,a.ff_currpass_regexp),doInit(a.url,a.rowtype,a.ask_generate,
a.popuphtml,a.can_copy_clipboard,a.ask_save,a.lastpass_username,a.inputtype))}),g_pollid=setInterval(function(){getInputPoll()},100)):"undefined"!=typeof safari&&(safari.self.removeEventListener("message",handleMessage,!1),safari.self.addEventListener("message",handleMessage,!1),safari.self.tab?safari.self.tab.dispatchMessage("getpopupfilldata",{}):safari.extension.globalPage.contentWindow&&safari.extension.globalPage.contentWindow.message_handler({name:"getpopupfilldata",message:{},target:window}),
g_pollid=setInterval(function(){getInputPoll()},100));notifybg_create_ack()}var KEY_UP=38,KEY_DOWN=40,KEY_ENTER=13,ELEMENT_NODE=1,KEY_ESCAPE=27;function keypress_handler(a){a.keyCode==KEY_ESCAPE&&closePopups();return!1}
function neverdomain_handler(){g_do_nevershowicons?sendRequest({cmd:"neverdomain",url:g_reference_url,fromshowicons:1,frompopupiframe:1}):"sites"==g_rowtypes?0<g_datarowcount?sendRequest({cmd:"neverdomain",url:g_reference_url,fromautofill:1,frompopupiframe:1}):sendRequest({cmd:"neverdomain",url:g_reference_url,fromsave:1,frompopupiframe:1}):"formfills"==g_rowtypes?sendRequest({cmd:"neverdomain",url:g_reference_url,fromformfill:1,frompopupiframe:1}):"ask_generate"==g_rowtypes&&sendRequest({cmd:"neverdomain",
url:g_reference_url,fromgenerate:1,frompopupiframe:1});closePopups()}
function neverpage_handler(){g_do_nevershowicons?sendRequest({cmd:"neverpage",url:g_reference_url,fromshowicons:1,frompopupiframe:1}):"sites"==g_rowtypes?0<g_datarowcount?sendRequest({cmd:"neverpage",url:g_reference_url,fromautofill:1,frompopupiframe:1}):sendRequest({cmd:"neverpage",url:g_reference_url,fromsave:1,frompopupiframe:1}):"formfills"==g_rowtypes?sendRequest({cmd:"neverpage",url:g_reference_url,fromformfill:1,frompopupiframe:1}):"ask_generate"==g_rowtypes&&sendRequest({cmd:"neverpage",url:g_reference_url,
fromgenerate:1,frompopupiframe:1});closePopups()}function neverautofill_handler(){sendRequest({cmd:"neverautofill",url:g_reference_url,frompopupiframe:1});closePopups()}function savesite_popupaction(){sendRequest({cmd:"savesiteicon"});closePopups()}function autofill(a){sendRequest({cmd:"autofillaid",aid:a});closePopups()}function autologin(a){sendRequest({cmd:"autologinaid",aid:a});closePopups()}function fillform(a){sendRequest({cmd:"fillformffid",ffid:a});closePopups()}
function notifybg_create_ack(){sendRequest({cmd:"popupfillscreateack"})}function sendRequest(a){if(null!=a)if(a.cmd&&"popupfillinputget"!=a.cmd&&"popupfilliconnumber"!=a.cmd&&L("IF -> BG : cmd="+a.cmd),g_ischrome)try{chrome_runtime_sendMessage(a,function(){})}catch(b){}else g_issafari&&(safari.self.tab?safari.self.tab.dispatchMessage(a.cmd,a):safari.extension.globalPage.contentWindow&&safari.extension.globalPage.contentWindow.message_handler({name:a.cmd,message:a,target:window}))}
function handleMessage(a){"message"==a.name&&"gotpopupfillinput"!=a.message.cmd&&L("BG -> IF : cmd="+a.message.cmd);if("gotpopupfilldata"==a.name||"gotpopupfilldata"==a.message.cmd)translationInit(a.message.ff_firstname_regexp,a.message.ff_middlename_regexp,a.message.ff_lastname_regexp,a.message.ff_username_regexp,a.message.ff_email_regexp,a.message.ff_zip_regexp,a.message.ff_country_regexp,a.message.ff_currpass_regexp),doInit(a.message.url,a.message.rowtype,a.message.ask_generate,a.message.html,
a.message.can_copy_clipboard,a.message.asksave,a.message.lastpass_username,a.message.inputtype);else if("gotpopupfillinput"==a.name||"gotpopupfillinput"==a.message.cmd)null==g_initial_searchtext&&(g_initial_searchtext=a.message.inputstr),g_ctr_pollresponse++,(g_switchedtabs||a.message.inputstr!=g_lastinput||g_lastactive!=a.message.active||a.message.inputid!=g_lastinputid||a.message.moreopen!=g_lastmoreopen||a.message.shownavbar!=g_lastshownavbar||a.message.choose!=g_lastchoose)&&dofilter(a.message.inputstr,
a.message.inputid,a.message.active,a.message.choose,a.message.moreopen,SEARCH_SITE_AND_USER,a.message.issaveall,a.message.inputtype,a.message.shownavbar),g_lastinput=a.message.inputstr,g_lastinputid=a.message.inputid,g_lastactive=a.message.active,g_lastchoose=a.message.choose,g_lastmoreopen=a.message.moreopen,g_lastshownavbar=a.message.shownavbar,g_switchedtabs=!1;else if("gotpopupfillgenerateprefs"==a.name||"gotpopupfillgenerateprefs"==a.message.cmd)null==a.message.prefstr||0>=a.message.prefstr.length?
verbose_log("unable to get prefs from BG"):handleGotGeneratePrefs(a.message.prefstr,a.message.genpwstr);else if("gotpopupfillsave"==a.name||"gotpopupfillsave"==a.message.cmd)null!=a.message.formdata2?populateSave(a.message):null!=a.message.close?closePopups():pollSaveSafari()}function pollSaveSafari(){g_pollSaveSafari_ctr<g_pollSave_max_retry?(g_pollSaveSafari_ctr++,setTimeout(function(){sendRequest({cmd:"popupfillsaveget"})},100)):verbose_log("failed to get form information from CS")}
var g_text_created_popup=!1;
function dofilter(a,b,c,h,k,j,p,d,q){function g(a){r&&verbose_log(a)}g_ctr_dofilter++;var r=!1;g("dofilter called with SEARCH string "+a);null==a&&(a="");if("savesite"==g_currenttab&&!p)d&&("text"==d||"email"==d||"tel"==d)?document.getElementById("u")&&(document.getElementById("u").value=a):d&&"password"==d&&document.getElementById("p")&&(document.getElementById("p").value=a);else{var l=document.getElementsByTagName("td"),m=[];d=[];g_switchedtabs&&(g_selected_row=-1,a="");if(0>g_selected_row&&0!=
c)if(g_do_searchbox?0!=c&&(a="",g_inputstr_freeze=!0):g_initial_searchtext!=a?(g_inputstr_initial_from_kbdnav="",g("F4")):g_text_created_popup?(g_inputstr_initial_from_kbdnav=a,a="",g("F1")):0!=c?(g_inputstr_initial_from_kbdnav=a,a="",g("F3")):g("F2"),"none"==document.getElementById("lptabpopupformfills").style.display)c=g_selected_row=0,g("F5");else{if("none"==document.getElementById("lptabpopup").style.display){c=g_selected_row=0;a="";for(b=0;b<l.length;b++)0==l[b].id.indexOf("tdpopuprow")&&g_selected_row++;
ROW_START=g_selected_row;g("F6")}}else 0>g_selected_row&&0==c?g_initial_searchtext!=a?(g_inputstr_initial_from_kbdnav="",g("F7")):(g_inputstr_initial_from_kbdnav=a,g_text_created_popup=!0,a="",g("F8")):g_inputstr_freeze?(a="",g("F9")):""!==g_inputstr_initial_from_kbdnav&&(g("F10"),a!==g_inputstr_initial_from_kbdnav?(g_inputstr_initial_from_kbdnav="",g("SEARCH TEXT CHANGED, FILTER initial")):(a="",g("F11")));g("SEARCH string is now "+a);for(var e=b=0;e<l.length;e++)if(l[e].id&&(0==l[e].id.indexOf("tdpopuprow")||
0==l[e].id.indexOf("tdpopupffrow"))){var n="tr"+l[e].id.substr(2),n=document.getElementById(n),s=n.getAttribute("sitename"),t=n.getAttribute("username"),u=n.getAttribute("profilename");null==s&&(s="");null==t&&(t="");null==u&&(u="");0>=a.length?"none"==document.getElementById("lptabpopupformfills").style.display&&0==l[e].id.indexOf("tdpopuprow")||"none"==document.getElementById("lptabpopup").style.display&&0==l[e].id.indexOf("tdpopupffrow")?(d.push(n),unhighlight_row(n),b++):m.push(n):!j&&0==l[e].innerText.trim().toLowerCase().indexOf(a.toLowerCase())||
j&&0<=s.trim().toLowerCase().indexOf(a.toLowerCase())&&"none"==document.getElementById("lptabpopupformfills").style.display||j&&0<=t.trim().toLowerCase().indexOf(a.toLowerCase())&&"none"==document.getElementById("lptabpopupformfills").style.display||j&&0<=l[e].innerText.trim().toLowerCase().indexOf(a.toLowerCase())&&"none"==document.getElementById("lptabpopup").style.display?"none"==document.getElementById("lptabpopupformfills").style.display&&0==l[e].id.indexOf("tdpopuprow")||"none"==document.getElementById("lptabpopup").style.display&&
0==l[e].id.indexOf("tdpopupffrow")?(highlight_row(n,a),d.push(n),b++):m.push(n):m.push(n)}for(var f in m)m[f].style.display="none",g_outline_hover?(a=m[f].children[0],a.className=a.className.replace(/ ?\bshowfocus\b/,"")):m[f].className=m[f].className.replace(/ ?\bshowfocus\b/,""),unhighlight_row(m[f]),g_visual_cue_on_hover&&(0==m[f].id.indexOf("trpopuprow")?(a="expand",a=m[f].id.replace("trpopuprow",a),a=document.getElementById(a),null!=a&&(a.style.display="none")):0==m[f].id.indexOf("trpopupffrow")&&
(a="expandff",a=m[f].id.replace("trpopupffrow",a),a=document.getElementById(a),null!=a&&(a.style.display="none")));for(f in d)d[f].style.display="",g_outline_hover?(a=d[f].children[0],a.className=a.className.replace(/ ?\bshowfocus\b/,"")):d[f].className=d[f].className.replace(/ ?\bshowfocus\b/,"");if(0<=g_selected_row){g_selected_row+=c;g_selected_row>=ROW_START+b?g_selected_row=ROW_START+b-1:g_selected_row<ROW_START&&(g_selected_row=ROW_START);c=ROW_START;for(e=0;e<d.length;e++)if(d[e].id&&"none"!=
d[e].style.display){if(g_selected_row==c){if(h)f=d[e],0==f.id.indexOf("trpopuprow")&&null!=f.getAttribute("aid")?autologin(f.getAttribute("aid")):f.click();else{if(k){f=d[e];g_currenttab="more";doTitleBar(document,popup_actions_cfg.more.str);more_popupaction(document,f);return}q?togglenavbar(document):(g_outline_hover?(a=d[e].children[0],a.className+=" showfocus"):d[e].className+=" showfocus",d[e].scrollIntoView(!1),g_visual_cue_on_hover&&(0==d[e].id.indexOf("trpopuprow")?(a="expand",a=d[e].id.replace("trpopuprow",
a),a=document.getElementById(a),null!=a&&(a.style.display="")):0==d[e].id.indexOf("trpopupffrow")&&(a="expandff",a=d[e].id.replace("trpopupffrow",a),a=document.getElementById(a),null!=a&&(a.style.display=""))))}if(!g_visual_cue_on_hover)break}else g_visual_cue_on_hover&&(0==d[e].id.indexOf("trpopuprow")?(a="expand",a=d[e].id.replace("trpopuprow",a),a=document.getElementById(a),null!=a&&(a.style.display="none")):0==d[e].id.indexOf("trpopupffrow")&&(a="expandff",a=d[e].id.replace("trpopupffrow",a),
a=document.getElementById(a),null!=a&&(a.style.display="none")));c++}}g_icon_number_hint&&("sites"==g_currenttab?(h=document.getElementById("lptabpopupformfills"),(k=document.getElementById("lptabpopup"))&&(h&&"none"==h.style.display&&"none"==k.style.display)&&(b=0),sendRequest({cmd:"popupfilliconnumber",sitenumber:b,formfillsnumber:-1})):"formfill"==g_currenttab?sendRequest({cmd:"popupfilliconnumber",formfillsnumber:b,sitenumber:-1}):sendRequest({cmd:"popupfilliconnumber",sitenumber:-1,formfillsnumbers:-1}));
g_nomatches_triggers_save&&"sites"==g_currenttab&&("sites"==g_rowtypes&&0==b&&0<countInputRows(document).sites)&&(p||savesite_popupaction_iframe(document,null,null))}}
function getInputPoll(){g_ctr_poll++;g_ischrome?chrome_runtime_sendMessage({cmd:"popupfillinputget"},function(a){g_ctr_pollresponse++;null==a||null==a.inputstr||(null==g_initial_searchtext&&(g_initial_searchtext=a.inputstr),(g_switchedtabs||a.inputstr!=g_lastinput||g_lastactive!=a.active||g_lastmoreopen!=a.moreopen||g_lastshownavbar!=a.shownavbar||a.inputid!=g_lastinputid||a.choose!=g_lastchoose)&&dofilter(a.inputstr,a.inputid,a.active,a.choose,a.moreopen,SEARCH_SITE_AND_USER,a.issaveall,a.inputtype,
a.shownavbar),g_lastinput=a.inputstr,g_lastinputid=a.inputid,g_lastactive=a.active,g_lastchoose=a.choose,g_lastmoreopen=a.moreopen,g_lastshownavbar=a.shownavbar,g_switchedtabs=!1)}):g_issafari&&sendRequest({cmd:"popupfillinputget"});return!1}
function getWindowWidth(a){a=a.innerWidth;var b=document.getElementById("_lpinvis");null==b&&(b=document.createElement("div"),b.id.left="_lpinvis",b.style.left="0px",b.style.right="0px",b.style.top="0px",b.style.height="0px",b.style.visibility="hidden",document.body.appendChild(b));0<b.offsetWidth&&(a=b.offsetWidth);document.body.removeChild(b);return a}function defaultFrameResize(){sendRequest({cmd:"popupfillresize",width:0,height:0})}function verbose_log(a){verbose&&console_log(a)}
function getAbsolutePos(a,b){if(null!=b){if("function"!=typeof b.getBoundingClientRect)return null;var c=b.getBoundingClientRect(),h,k;h="undefined"==typeof c.width?c.right-c.left:c.width;k="undefined"==typeof c.height?c.bottom-c.top:c.height;var j=a.body.getBoundingClientRect();return{left:c.left+a.body.scrollLeft-j.left,top:c.top+a.body.scrollTop-j.top,width:h,height:k}}return null}function initSliderPos(){}
function handleGotGeneratePrefs(a,b){g_myprefs=LPJSON.parse(a);var c=LPJSON.parse(b);if(null!=c&&!isEmptyObject(c)){g_genpws=[];for(var h in c)c.hasOwnProperty(h)&&g_genpws.push(c[h])}}
function doInit(a,b,c,h,k,j,p,d){document.body.innerHTML=h;getGeneratePrefs();sizeTables(window);g_reference_url=a;g_can_copy_clipboard=k;"undefined"!=typeof c&&(g_ask_generate=0==g_ask_generate.length?0:c);"undefined"!=typeof j&&(g_ask_save=0==g_ask_save.length?0:j);"undefined"!=typeof p&&(g_username=p);"undefined"!=typeof d&&(g_inputtype=d);g_rowtypes_initial=g_rowtypes=b;if(null==g_rowtypes||0>=g_rowtypes.length)g_rowtypes="sites";g_initial_searchtext=null;setTimeout(function(){setup_event_handlers(document,
window)},0);"ask_generate"==g_rowtypes||1==g_ask_generate?(setTimeout(function(){askGenerate()},0),g_currenttab="generate",doSuperBox(document),doTitleBar(document,popup_actions_cfg[g_currenttab].str)):1==g_ask_save?(g_currenttab="savesite",doSuperBox(document),savesite_popupaction_iframe(document),doTitleBar(document,popup_actions_cfg[g_currenttab].str)):"formfills"==g_rowtypes?(g_currenttab="formfill",doSuperBox(document),doTitleBar(document,popup_actions_cfg[g_currenttab].str),formfillprofile_popupaction()):
"sites"==g_rowtypes&&(g_currenttab="sites",hideElement(document,"popupcontainerff"),doSuperBox(document),0===countInputRows(document).sites?(null!=d&&"password"==d?(g_empty_in_super||doTitleBar(document,gs("")),emptyAskSave(document)):(g_empty_in_super||doTitleBar(document,gs("")),emptyAskFill(document)),siteResize(document,EMPTY_RESIZE)):(doTitleBar(document,popup_actions_cfg[g_currenttab].str),g_do_searchbox&&countInputRows(document).sites>SEARCH_BOX_ROW_THRES?doSearchBox(document,gs("Sites")):
hideElement(document,"searchtab"),siteResize(document)));popup_show_menu_expand_visual_cue&&do_inject_visual_cues(document);setActiveTab(document);g_switchedtabs=!1;document.addEventListener("keydown",function(a){keypress_handler(a)},!1)}function pollSaveChrome(a){chrome_runtime_sendMessage({cmd:"popupfillsaveget"},function(b){null!=b&&(null!=b.formdata2?populateSave(b):null!=b.close?closePopups():5>a&&(a++,setTimeout(function(){pollSaveChrome(a)},100)))})}
function do_never_kbd_event(a,b,c,h,k){if(null==b||""===b)b=0;0<b&&0===g_selected_never_row&&(g_selected_never_row=1);0>b&&1===g_selected_never_row&&(g_selected_never_row=0);k&&g_hide_navbar&&togglenavbar(a);0===g_selected_never_row&&c&&neverpage_handler();1===g_selected_never_row&&c&&neverdomain_handler()}
function do_more_kbd_event(a,b,c,h,k){var j=1,p=2,d=3,q=4,g=-99,r=-98;g_more_close_on_cancel&&g_more_enable_return?(g=5,q=r=6):g_more_close_on_cancel&&!g_more_enable_return?q=g=5:!g_more_close_on_cancel&&g_more_enable_return&&(q=r=5);if(null!=g_more_submenu_ffid||null!=g_more_submenu_aid&&!g_can_copy_clipboard)j=-97,p=-96,d=-95,q-=3,g-=3,r-=3;if(null==b||""===b)b=0;-1==g_selected_more_row&&h&&(g_selected_more_row=0);k&&g_hide_navbar&&togglenavbar(a);g_selected_more_row+=b;0>g_selected_more_row?g_selected_more_row=
0:g_selected_more_row>q&&(g_selected_more_row=q);if(c)switch(g_selected_more_row){case 0:edit_popupaction(g_more_submenu_aid,g_more_submenu_ffid);break;case j:copyusername_popupaction(g_more_submenu_aid);break;case p:copypassword_popupaction(g_more_submenu_aid);break;case d:copyurl_popupaction(g_more_submenu_aid);break;case 4:delete_popupaction(g_more_submenu_aid,g_more_submenu_ffid);break;case r:g_more_enable_return&&(null!=g_more_submenu_aid?sites_popupaction():null!=g_more_submenu_ffid?formfillprofile_popupaction():
closePopups());break;case g:g_more_close_on_cancel&&closePopups()}}
function translationInit(a,b,c,h,k,j,p,d){try{"undefined"==typeof translations&&(translations={}),"undefined"==typeof translations["en-US"]&&(translations["en-US"]={}),translations["en-US"].ff_username_regexp=h,translations["en-US"].ff_firstname_regexp=a,translations["en-US"].ff_middlename_regexp=b,translations["en-US"].ff_lastname_regexp=c,translations["en-US"].ff_email_regexp=k,translations["en-US"].ff_zip_regexp=j,translations["en-US"].ff_country_regexp=p,translations["en-US"].ff_currpass_regexp=
d}catch(q){}}
function lpgs(a,b){var c="undefined"==typeof b||null==b?"":b;if("undefined"!=typeof lpgscache[c+a]||"undefined"==typeof lpgslocales[c]&&0==a.indexOf("ff_")&&(ApplyOverrides(c),"undefined"!=typeof lpgscache[c+a]))return lpgscache[c+a];if("undefined"!=typeof translations){if("undefined"!=typeof b&&b&&"undefined"!=typeof translations[b]&&"undefined"!=typeof translations[b][a])return translations[b][a];if("undefined"!=typeof translations["en-US"]&&"undefined"!=typeof translations["en-US"][a])return translations["en-US"][a]}return"undefined"!=typeof lpgscache["en-US"+
a]?lpgscache["en-US"+a]:a};
