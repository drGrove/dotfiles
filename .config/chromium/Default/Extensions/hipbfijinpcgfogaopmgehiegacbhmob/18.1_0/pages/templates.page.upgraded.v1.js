templates=templates||{};templates.page=templates.page||{};templates.page.upgraded=templates.page.upgraded||{};templates.page.upgraded.v1=templates.page.upgraded.v1||{};(function(){var k=devhd.i18n.L,b=devhd.i18n.$L,g=[],h="",m=templates.page.upgraded.v1;function j(p){var o=arguments,n;for(n=1;n<o.length;n++){p.push(o[n])}}var l,e,d,c,f,a;try{l=function(n){return devhd.s3("images/"+n)
};a=function(n){return devhd.x2("images/"+n)};e=devhd.str.toSafeHTML;d=devhd.str.toSafeAttr;c=devhd.str.stripTags;f=devhd.str.toJsEsc}catch(i){}m.css=function(o){var n=[];j(n,g[0],l("feedly-pro-hero-2.png?final"),g[1]);return n.join(h)};m.layout=function(o,p){var n=[];j(n,g[2],l("search.png?final"),g[3],l("https.png?final"),g[4],l("evernote.png?final"),g[5],l("support.png?final"),g[6]);
return n.join(h)};m.button=function(q,r,p,n){var o=[];if(r==true){j(o,g[7])}else{if(q){j(o,g[8],n||"",g[9],p,g[10])}else{j(o,g[11])}}return o.join(h)};g=[' \n.pro \n{ \nmargin-left : -34px; \nmargin-right : -34px; \nmin-height : 480px; \nbackground-color : #FFFFFF; \nbackground-position : bottom center; \nbackground-repeat : no-repeat; \n-webkit-background-size : contain; \n-moz-background-size : contain; \nbackground-size : contain; \npadding-bottom : 20px; \nwidth : 927px; \nmargin-bottom : -103px; \n} \n.pro .row \n{ \nmargin-left : 13px; \n*zoom : 1; \nmargin-top : 20px; \n} \n.pro .row:before, .row:after { \ndisplay: table; \ncontent: ""; \n} \n.row:after { \nclear: both; \n} \n[class*="span"] { \nfloat: left; \nmargin-left: 20px; \n} \n.pro .span3 { \nwidth: 199px; \n} \n.pro .span6 { \nwidth: 416px; \n} \n.pro .span12 { \nwidth: 859px; \n} \n.pro h1, \n.pro h2, \n.pro h3 { \nfont-family: "Helvetica Neue", Helvetica, Arial, sans-serif; \nfont-weight: 700; \ncolor: #333; \n-webkit-font-smoothing: antialiased; \ntext-transform: none; \n} \n.pro h1 { \nmargin: 0px 0px 10px 0px; \nfont-size: 24px; \ntext-align: left; \nline-height: 1.6em; \ntext-transform: none; \n} \n.pro h2 { \nmargin: 14px 0px 10px 0px; \nfont-size: 18px; \nline-height: 1.5em; \ntext-transform: none; \n} \n.pro p { \nfont-size: 18px; \nline-height: 28px; \nmargin: 0px 0px 30px 0px; \ncolor: #777777; \n} \n.pro a { \ncolor: black; \nopacity: 1; \n-webkit-transition: color 0.2s ease 0s; \n-moz-transition: color 0.2s ease 0s; \n-o-transition: color 0.2s ease 0s; \ntransition: color 0.2s ease 0s; \ntext-decoration: none; \n} \n.pro a:hover { \nopacity: 0.7; \ntext-decoration: none; \n} \n.pro section { \npadding: 40px 0px 40px 0px; \n} \n.pro .already { \ndisplay : inline-block; \nposition : relative; \nmargin : 0px; \npadding : 14px 20px 14px 20px; \nfont-size : 16px; \nline-height : 17px; \nfont-weight : bold; \ntext-decoration : none; \nborder-radius : 3px; \ncolor : #888; \nbackground-color : #CCC; \nbox-shadow : 0px 1px 2px rgba(0, 0, 0, 0.2); \nz-index : 1000; \n-webkit-font-smoothing : antialiased; \n} \n.pro .button { \ndisplay: inline-block; \nposition: relative; \nmargin: 0px; \npadding: 14px 20px 14px 20px; \nfont-size: 16px; \nline-height: 17px; \nfont-weight: bold; \ntext-decoration: none; \nborder-radius: 3px; \ncolor: white; \n-webkit-appearance: none; \ncursor: pointer; \nbackground-image: linear-gradient(bottom, rgb(29,162,211) 23%, rgb(38,175,217) 62%); \nbackground-image: -o-linear-gradient(bottom, rgb(29,162,211) 23%, rgb(38,175,217) 62%); \nbackground-image: -moz-linear-gradient(bottom, rgb(29,162,211) 23%, rgb(38,175,217) 62%); \nbackground-image: -webkit-linear-gradient(bottom, rgb(29,162,211) 23%, rgb(38,175,217) 62%); \nbackground-image: -ms-linear-gradient(bottom, rgb(29,162,211) 23%, rgb(38,175,217) 62%); \nbackground-image: -webkit-gradient( \nlinear, \nleft bottom, \nleft top, \ncolor-stop(0.23, rgb(29,162,211)), \ncolor-stop(0.62, rgb(38,175,217)) \n); \nborder: 1px solid #0f77ae; \nbox-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2); \nz-index: 1000; \n-webkit-font-smoothing : antialiased; \ncursor : pointer; \n} \n.pro a.button:hover { \nopacity: 1; \nbackground-image: linear-gradient(bottom, rgb(31,171,222) 50%, rgb(40,185,229) 50%); \nbackground-image: -o-linear-gradient(bottom, rgb(31,171,222) 50%, rgb(40,185,229) 50%); \nbackground-image: -moz-linear-gradient(bottom, rgb(31,171,222) 50%, rgb(40,185,229) 50%); \nbackground-image: -webkit-linear-gradient(bottom, rgb(31,171,222) 50%, rgb(40,185,229) 50%); \nbackground-image: -ms-linear-gradient(bottom, rgb(31,171,222) 50%, rgb(40,185,229) 50%); \nbackground-image: -webkit-gradient( \nlinear, \nleft bottom, \nleft top, \ncolor-stop(0.23, rgb(31,171,222)), \ncolor-stop(0.62, rgb(40,185,229)) \n); \n} \n.pro .button:after \n{ \nclear: both; \n} \n.pro .container \n{ \nwidth : 940px; \nmargin-left : auto; \nmargin-right : auto; \n} \n.container:after \n{ \nclear :both; \n} \n.pro .hero \n{ \nwidth : 100%; \nheight : 470px; \nmargin-left : auto; \nmargin-right : auto; \nmargin-top : -1px; \npadding : 0px; \noverflow : hidden; \nopacity : 1; \nbackground-image : url( '," ); \nbackground-size : 1668px; \nbackground-color : white; \nbackground-repeat : no-repeat; \nbackground-position : center center; \ntext-align : center; \n} \n.pro .hero img \n{ \nmargin-top : 40px; \n} \n.pro .hero h1 \n{ \nmargin-bottom : 10px; \ncolor : #021025; \ntext-align : center; \n} \n.pro .hero p { \nmargin : 10px 0px 30px 0px; \nfont-size : 22px; \nline-height : 34px; \ncolor : #021025; \n} \n.pro .footer \n{ \npadding : 40px 0px 10px 0px; \nbackground-color : #021026; \ntext-align : center; \n} \n.pro .footer a \n{ \ncolor : white; \nmargin-left : 10px; \nmargin-right : 10px; \nline-height : 40px; \n} \n.pro .pro-features \n{ \ntext-align : center; \nbackground-color : #FFFFFF; \n} \n.pro .pro-features h1 \n{ \ntext-align : center; \n} \n.pro .pro-feature-description p \n{ \nfont-size : 14px; \nline-height : 22px; \n} \n.pro .kick-starter \n{ \npadding : 60px 160px 60px 160px; \nmargin : 0px auto 0px auto; \n} \n.pro .kick-starter h1 { \ntext-align : center; \nmargin-bottom : 20px; \n} \n.pro .kick-starter h2 \n{ \ntext-align : center; \nmargin : -14px 0px 30px 0px; \n} \n.pro .kick-starter p \n{ \nmargin-bottom : 46px; \n} \n.pro .qa \n{ \nbackground-color : #e6f6f9; \npadding-left : 160px; \npadding-right : 160px; \n} \n.pro .qa h1 \n{ \nmargin-top : 20px; \nmargin-bottom : 40px; \ntext-align : center; \n} \n.pro .qa h3 \n{ \nmargin-bottom : -10px; \nfont-size : 18px; \nline-height : 28px; \ncolor : #333; \ntext-transform : none; \n} \n.pro .note \n{ \ntext-align : center; \ncolor : #888888; \nfont-size : 12px; \nmargin-top : 14px; \nline-height : 3; \n} \n.pro .button span \n{ \nmargin-left : 30px; \nfont-weight : normal; \n} \n.pro .center \n{ \ntext-align : center; \n} \n.pro .count \n{ \ndisplay : inline-block;; \ntext-align : center; \nmargin-top : -4px; \npadding : 10px 65px 7px 65px; \nbackground-color : #EFEFEF; \nborder : 1px solid #DFDFDF; \nborder-radius : 3px; \nz-index : 50; \nline-height : 1.6em; \n} \n",' \n<div class="pro"> \n<section class="pro-features color-1"> \n<div class="row"> \n<div class="span12"> \n<h1>You have been successfully upgraded to feedly Pro</h1> \n<p>Your new features have been unlocked.</p> \n</div> \n</div> \n<div class="row"> \n<div class="pro-feature-description span3"> \n<img src="','" width="198"> \n<h2>Article search</h2> \n<p>Search within all of your<br/> feedly subscriptions.</p> \n</div> \n<div class="pro-feature-description span3"> \n<img src="','" width="198"> \n<h2>https</h2> \n<p> \nAdd a layer of security to<br/> \nyour feedly browsing. \n</p> \n</div> \n<div class="pro-feature-description span3"> \n<img src="','" width="198"> \n<h2>Evernote</h2> \n<p> \nOne-click save to any of <br> \nyour Evernote notebooks. \n</p> \n</div> \n<div class="pro-feature-description span3"> \n<img src="','" width="198"> \n<h2>Premium Support</h2> \n<p> \nGet bumped to the front <br> \nof the support line. \n</p> \n</div> \n</div> \n</section> \n<section class="qa"> \n<h1>feedly Pro Tips</h1> \n<h3>How do I use the article search feature?</h3><br> \n<p> \nGo to a section in your feedly (the all page, a category page or a feed page) and you will see at the top \nright a new search box. Enter the keyword you want to search for and press enter to get the list of article \nin that section which match the entered search term. \n</p> \n<h3>How do I take advantage of HTTPS</h3><br> \n<p> \nGo to https://cloud.feedly.com and all the interaction between the feedly app and the feedly cloud will be \nimplemented over HTTPS. \n</p> \n<h3>How do I post an article to one of my Evernote notebooks?</h3><br> \n<p> \nOpen the article you would like to share and you will see a new Evernote icon next to the other sharing options. \nClick on that icon and a drop down will appear with the list of Evernote notebooks. Simply pick the notebook and \nthe article will be automatically saved. \n</p> \n<h3>How do I take advantage of the Premium support?</h3><br> \n<p> \nIf you have an questions or need technical support, send an email to pro@feedly.com with the content of \nhttp://cloud.feedly.com/#console and a description of the problem you are running into and you will get \nautomatically moved to the top of the line. We are committed to answering every support requests within 24 hours. \n</p> \n<h3>More questions?</h3><br> \n<p> \nPlease send us an email at pro@feedly.com and we will be happy to help. \n</p> \n</section> \n<section class="kick-starter center"> \n<span class="button" data-uri="my">Go to the Today Section</span><br> \n<span class="note"> \nThank you for backing feedly! \n</span> \n</section> \n</div> \n</div> \n',' <span class="already">You are already a feedly Pro user!</span><br> \n<span class="note"> \nThank you for your support! \n</span> \n',' <span class="button" data-page-action="startCheckout">Kick-starter edition <span>$99</span></span><br> \n<span class="note ','"> \n'," \n</span> \n",' <a href="#" onclick="askLoginFeedly(); return false;" data-nextURI="pro" class="button">Login to upgrade</a><br> \n<span class="note"> \nLimited kick-starter Edition \n</span> \n']
})();