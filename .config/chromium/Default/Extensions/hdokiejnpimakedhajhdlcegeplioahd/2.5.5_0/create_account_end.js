document.title=gs("Create Account");document.getElementById("_docwrite_create_account1")&&(document.getElementById("_docwrite_create_account1").innerHTML=gs("Create an Account"));document.getElementById("_docwrite_create_account2")&&(document.getElementById("_docwrite_create_account2").innerHTML=gs("Email"));document.getElementById("_docwrite_create_account3")&&(document.getElementById("_docwrite_create_account3").innerHTML=gs("Master Password"));
document.getElementById("_docwrite_create_account5")&&(document.getElementById("_docwrite_create_account5").innerHTML=gs("Password Reminder"));document.getElementById("_docwrite_create_account6")&&(document.getElementById("_docwrite_create_account6").innerHTML=gs("Time Zone"));document.getElementById("_docwrite_create_account7")&&(document.getElementById("_docwrite_create_account7").innerHTML=gs("I have read and agree with the"));
document.getElementById("_docwrite_create_account8")&&(document.getElementById("_docwrite_create_account8").innerHTML=gs("terms of service"));document.getElementById("_docwrite_create_account9")&&(document.getElementById("_docwrite_create_account9").innerHTML=gs("and"));document.getElementById("_docwrite_create_account10")&&(document.getElementById("_docwrite_create_account10").innerHTML=gs("privacy statement"));
document.getElementById("_docwrite_create_account11")&&(document.getElementById("_docwrite_create_account11").innerHTML=gs("I understand that my encrypted data will be sent to LastPass"));document.getElementById("_docwrite_create_account12")&&(document.getElementById("_docwrite_create_account12").innerHTML=gs("Keep a history of my logins and form fills"));document.getElementById("_docwrite_create_account13")&&(document.getElementById("_docwrite_create_account13").innerHTML=gs("Send anonymous error reporting data to help improve LastPass"));
document.addEventListener("DOMContentLoaded",function(){window.addEventListener("load",function(){onLoad()});window.addEventListener("beforeunload",function(){if(dobeforeunload)return"Do you really want to quit?  You cannot use LastPass without creating an account."});document.getElementById("lpform").onsubmit=function(){return!1};document.getElementById("email").addEventListener("keyup",function(){update_password_meter(document.getElementById("email").value,document.getElementById("masterpassword").value)});
document.getElementById("email").addEventListener("change",function(){checkEmail()});document.getElementById("masterpassword").addEventListener("keyup",function(){update_password_meter(document.getElementById("email").value,document.getElementById("masterpassword").value)});document.getElementById("createanaccount").addEventListener("click",function(){do_submit()});document.getElementById("nothanks").addEventListener("click",function(){confirm(gs("Do you really want to quit?  You cannot use LastPass without creating an account."))&&
(alert(gs("Please visit https://lastpass.com to create an account at a later time.")),dobeforeunload=!1,getBG().closecurrenttab("create_account.html"))})});
