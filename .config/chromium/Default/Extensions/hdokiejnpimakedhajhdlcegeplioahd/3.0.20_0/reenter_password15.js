document.getElementById("createanaccount")&&(document.getElementById("createanaccount").innerText=gs("Create an Account"));document.getElementById("cancel")&&(document.getElementById("cancel").innerText=gs("Cancel"));function onLoad(a){a||get_data("reenter_password",function(){onLoad(!0)})}var dobeforeunload=!0,docleardata=!0,newdata;
function do_submit(){dobeforeunload=!1;var a=document.getElementById("reenterpassword").value,b=getBG().g_create_account_data.masterpassword;a!=b?(alert(gs("The LastPass master password you reentered does not match")),docleardata=!1,redirect_to_url("create_account.html")):(document.getElementById("createanaccount").disabled=!0,document.getElementById("cancel").disabled=!0,document.getElementById("creatingaccount").style.display="",setInterval(function(){move_password_meter()},10),createAccount())}
var currstrength=0;function move_password_meter(){100<++currstrength&&(currstrength=0);update_password_meter_manual(currstrength)}
function createAccount(a){if(getBG().LPISLOC)if(a){if("string"!=typeof newdata||4>newdata.length||"LPAV"!=newdata.substring(0,4)){showCreateErrorAndBackup(gs("An error occurred while re-encrypting your data"));return}}else{document.getElementById("creatingaccounttext").innerHTML=gs("Reencrypting Data...");a=fix_username(getBG().g_create_account_data.email);var b=getBG().g_create_account_data.masterpassword;getBG().change_master_password(a,b,!0,function(a){newdata=a;createAccount(!0)});return}document.getElementById("creatingaccounttext").innerHTML=
gs("Creating Account...");var c=getBG().g_create_account_data.email.toLowerCase().replace(/\s*/g,"");a=getBG().g_create_account_data.masterpassword;getBG().make_lp_key_hash_iterations(c,a,get_key_iterations(c),function(a,b){var d=getBG().g_create_account_data.improve,g=getBG().g_create_account_data.history,h=getBG().g_create_account_data.timezone,j=getBG().g_create_account_data.passwordreminder,d="username="+getBG().en(c)+"&email="+getBG().en(c)+"&hash="+getBG().en(b)+"&password_hint="+getBG().en(j)+
(d?"&improve=1":"")+(g?"&loglogins=1":"")+"&timezone2="+getBG().en(h)+"&iterations="+getBG().en(get_key_iterations(c))+"&xml=1&language2=en-US";getBG().LPISLOC&&getBG().LPISUPEK&&(d+="&singlefactortype=vtapi");getBG().lpMakeRequest(getBG().base_url+"create_account.php",d,lpCreateAccountResponse,lpcreateaccounterror)})}
function upload_data(){document.getElementById("creatingaccounttext").innerHTML=gs("Uploading Data...");var a=fix_username(getBG().g_create_account_data.email),b=getBG().g_create_account_data.masterpassword;getBG().make_lp_key_hash_iterations(a,b,get_key_iterations(a),function(b,e){var f="wxusername="+encodeURIComponent(a)+"&wxhash="+encodeURIComponent(e)+"&data="+encodeURIComponent(btoa(newdata));getBG().lpMakeRequest(getBG().base_url+"import_local.php",f,lpUploadDataResponse,lpuploaddataerror)})}
function lpCreateAccountResponse(a){if(4==a.readyState&&200==a.status&&a.responseText){a=a.responseText;var b="";0<=a.indexOf("ok")?getBG().LPISLOC?upload_data():(getBG().LP_do_login(getBG().g_create_account_data.email,getBG().g_create_account_data.masterpassword,!0,!1),redirect_to_url(g_ischrome&&getBG().have_binary()&&(getBG().g_is_win||getBG().g_is_mac||getBG().g_is_linux)?"import_your_data.html":"configure_formfill.html")):(b=0<=a.indexOf("usernametaken")?gs("Email already in use, have you forgotten your password?"):
0<=a.indexOf("usernameinvalid")||0<=a.indexOf("emailfailed")?gs("Invalid email address, try again"):gs("A server error occurred while processing your request."),""!=b&&showCreateErrorAndBackup(b))}}function showCreateErrorAndBackup(a){alert(a);docleardata=!1;redirect_to_url("create_account.html")}function lpcreateaccounterror(){showCreateErrorAndBackup(gs("A server error occurred while processing your request."))}
function lpUploadDataResponse(a){4==a.readyState&&(200==a.status&&a.responseText&&0<=a.responseText.indexOf("ok")?(getBG().LPISUPEK&&getBG().lpvt_store_data_and_setsinglefactortype(encodeURIComponent(fix_username(getBG().g_create_account_data.email))+"|"+encodeURIComponent(getBG().g_create_account_data.masterpassword)),getBG().delete_file("LPISLOC"),redirect_to_url("congratulations.html")):lpuploaddataerror())}
function lpuploaddataerror(){confirm(gs("An error occurred while uploading your data.  Would you like to retry?"))&&upload_data()}document.getElementById("reenterpassword").focus();
