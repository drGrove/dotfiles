templates=templates||{};templates.page=templates.page||{};templates.page.my=templates.page.my||{};(function(){var k=devhd.i18n.L,b=devhd.i18n.$L,g=[],h="",m=templates.page.my;function j(p){var o=arguments,n;for(n=1;n<o.length;n++){p.push(o[n])}}var l,e,d,c,f,a;try{l=function(n){return devhd.s3("images/"+n)};a=function(n){return devhd.x2("images/"+n)
};e=devhd.str.toSafeHTML;d=devhd.str.toSafeAttr;c=devhd.str.stripTags;f=devhd.str.toJsEsc}catch(i){}m.prelayout=function(o){var n=[];j(n,g[0],l("loading.gif"),g[1],b(284),g[2]);return n.join(h)};m.layout=function(u,t,p,s){var n=[];var r=t==0;var q=s.isOptimized()?323:391;j(n,g[3],r?"condensed":"",g[4],templates.page.base.msar("#featured"),g[5],l("loading.gif"),g[1],b(285),g[6]);
for(var o=0;o<u.length;o++){j(n,g[7],t==5?"column column_"+(o%3)+"_2":"",g[8]);if(u[o].type=="subscription"){j(n,g[9],d(u[o].subscription.id),g[10],u[o].subscription.id,g[8],templates.page.base.feedH2(u[o].subscription.getFeedInfo(),{subscription:u[o].subscription},s),g[11])}else{j(n,g[9],u[o].label,g[12],u[o].label,g[13],u[o].label=="#others"?"Others":u[o].label,g[11])
}j(n,g[9],u[o].label,g[14],q,g[15],feedlyTheme.ma_meta,g[16],b(206),g[17],u[o].label,g[18]);if(t==4){j(n,g[19],u[o].label,g[20])}j(n,g[21])}j(n,g[7],t==5?"column column_"+(u.length%3)+"_2":"",g[22]);return n.join(h)};m.title=function(n){var o=[];if(devhd.utils.DateUtils.isWeekEnd()){j(o,g[23])}else{j(o,g[23])}j(o,g[24]);if(n==null){j(o,g[25])}else{j(o,g[26],n,g[27])
}j(o,g[28]);return o.join(h)};m.noRecentEntries=function(){var n=[];j(n,g[29]);return n.join(h)};m.pageTitleHint=function(p,n){var o=[];j(o,g[30],b(286,n),g[30]);return o.join(h)};m.comics=function(o){var n=[];j(n,g[31],b(287),g[32],o[0].getId(),g[33],o[0].getId(),g[34],o[0].getNavigation(),g[35],o[0].getContentOrSummary(),g[2]);return n.join(h)};m.loading=function(){var n=[];
j(n,g[36],l("loading.gif"),g[1],b(90),g[2]);return n.join(h)};g=[' \n<div style="min-height:1200px; color:#909090; font-size: 12px"> \n<img src="','" align="absmiddle" /> '," \n</div> \n",'\n<div id="mainArea" class="','"> \n<div id="main_#status"></div> \n<div id="main_#featured"> \n<h2> \nFeatured \n<span class="hhint"> \n',' \n</span> \n</h2> \n<div id="topArea"> \n<div style="min-height:1200px; color:#909090; font-size: 12px"> \n<img src="',' \n</div> \n</div> \n</div> \n<div id="categoriesArea"> \n',' <div class="','"> \n',' <div id="main_section_','_holder" style="cursor:pointer"> \n<h2 data-uri="subscription/'," \n</h2> \n",'_holder"> \n<h2 data-uri="category/','" style="cursor:pointer"> \n','_entries" class="entryList"> \n<div style="font-size: 12px; min-height:',"px; color:",'; margin-top:20px">','</div> \n</div> \n<div id="main_section_','_saved" class="entryList"> \n</div> \n',' <div class="action collapsable endOfSectionAction" data-page-action="markSectionAsRead" data-page-action-input="','"> \nMark above articles as read \n</div> \n'," </div> \n</div> \n",'"> \n<div id="main_section_feedly.promoted_holder" style="display:none" data-promoted="true"> \n<h2 style="cursor:pointer" data-uri="subscription/feed/http://feeds.feedburner.com/techpageone" data-promoted="true">Thank you <span id="feedly.promoted.top"></span></h2> \n<div id="main_section_feedly.promoted_entries" class="entryList"></div> \n<div id="main_section_feedly.promoted_saved" class="entryList"></div> \n</div> \n</div> \n</div> \n<div style="clear:both"></div> \n'," Home \n",' <span class="hhint" style="display:none"> \n'," The most recommended content in your feedly. \n"," "," featured articles \n"," </span> \n",' \n<div style="padding-top:115px; text-align:center" class="metadata"> \nNo recent updates<br> \n<span data-uri="contents/edit" class="action" style="color:inherit; text-decoration:underline">personalize</span> \n</div> \n'," \n"," \n<h2>",'</h2> \n<div id="','_main" data-inlineEntryId="','" data-navigation="','" style="padding-left:12px;cursor:pointer"> \n',' \n<div class="entriesLoadingMessage"> \n<img src="']
})();