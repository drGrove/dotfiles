templates=templates||{};templates.page=templates.page||{};templates.page.search=templates.page.search||{};(function(){var k=devhd.i18n.L,b=devhd.i18n.$L,g=[],h="",m=templates.page.search;function j(p){var o=arguments,n;for(n=1;n<o.length;n++){p.push(o[n])}}var l,e,d,c,f,a;try{l=function(n){return devhd.s3("images/"+n)};a=function(n){return devhd.x2("images/"+n)
};e=devhd.str.toSafeHTML;d=devhd.str.toSafeAttr;c=devhd.str.stripTags;f=devhd.str.toJsEsc}catch(i){}m.title=function(n){var o=[];j(o,g[0]);return o.join(h)};m.empty=function(o){var n=[];j(n,g[1],b(289,"b",o),g[1]);return n.join(h)};m.layout=function(o){var n=[];j(n,g[2],templates.page.base.msar("#latest"),g[3],l("loading.gif"),g[4],b(206),g[5]);return n.join(h)
};m.loading=function(){var n=[];j(n,g[6],l("loading.gif"),g[4],b(290),g[7]);return n.join(h)};g=[" \nSearch for Apple \n"," \n",' \n<div id="mainArea"> \n<div id="main_#status"></div> \n<div id="latestArea"> \n<h2 id="latestAreaHeader"> \nIn your sources \n<span class="hhint"> \n',' \n</span> \n</h2> \n<div id="latest_entries"> \n<div class="entriesLoadingMessage" style="min-height:450px"> \n<img src="','" align="absmiddle" /> '," \n</div> \n</div> \n</div> \n</div> \n",' \n<div class="entriesLoadingMessage"> \n<img src="'," \n</div> \n"]
})();