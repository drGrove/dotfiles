templates=templates||{};templates.page=templates.page||{};templates.page.filter=templates.page.filter||{};(function(){var k=devhd.i18n.L,b=devhd.i18n.$L,g=[],h="",m=templates.page.filter;function j(p){var o=arguments,n;for(n=1;n<o.length;n++){p.push(o[n])}}var l,e,d,c,f,a;try{l=function(n){return devhd.s3("images/"+n)};a=function(n){return devhd.x2("images/"+n)
};e=devhd.str.toSafeHTML;d=devhd.str.toSafeAttr;c=devhd.str.stripTags;f=devhd.str.toJsEsc}catch(i){}m.title=function(n,r,q,p,s){var o=[];if(n.scopeLabel!=null){j(o,g[0],b(268,n.term,n.scopeLabel),g[1])}else{j(o,g[0],b(269,n.term),g[1])}j(o,g[2]);return o.join(h)};m.layout=function(n,t,s,q,u){var p=[];j(p,g[3],b(270,"b",n.term,n.scopeLabel),g[4],b(271),g[5]);
for(var r=0;r<n.nbrZones;r++){var o="auto";if(r<=n.nbrZones-1&&n.zoneHeight!=-1){o=n.zoneHeight+"px"}if(r==n.nbrZones-1&&n.lastZoneHeight!=-1){o=n.lastZoneHeight+"px"}j(p,g[6],r,g[7],o,g[8])}j(p,g[9],b(272,"b",n.term),g[10],b(273),g[11]);if(n.pageNumber>0){j(p,g[12],b(274),g[13])}j(p,g[14],b(275),g[15]);return p.join(h)};m.loading=function(n){var o=[];
j(o,g[16],l("loading.gif"),g[17]);if(n.scopeLabel){j(o,g[0],b(276,"b",n.term,"i",n.scopeLabel),g[1])}else{j(o,g[0],b(277,"b",n.term),g[1])}j(o,g[18]);return o.join(h)};m.resultCount=function(o){var n=[];j(n,g[1],b(278,o),g[1]);return n.join(h)};m.options=function(o){var n=[];return n.join(h)};m.error=function(o){var n=[];j(n,g[19],b(279,"i",o),g[20]);
return n.join(h)};g=[" "," \n",' <span class="hhint"> \n<span id="searchResultsCount" ></span> \n</span> \n',' \n<div id="mainArea" style="margin-top:34px"> \n<div id="search_entries" class="entryList"> \n<div id="emptyListMessage" style="display:none"> \n<div class="infoBox"> \n'," \n<a href='#' data-app-action=\"refresh\">","</a> \n</div> \n</div> \n",'\n<div id="zone','" style="height:','"></div> \n',' </div> \n<div style="clear:both"></div> \n<div id="listNavigation"> \n<div style="float: right"> \n</div> \n<div id="listPageNumber"> \n',' \n<span id="range"></span> \n<span id="endOfListIndicator" style="display:none">(',')</span> \n<span id="listPagePagingControls"> \n',' <span id="listPagePagingControls_Previous" class="listPagePagingControl" \ndata-app-action="loadPreviousPage" \n>','</span> \n<span style="padding-left: 15px; padding-right: 15px">|</span> \n',' <span id="listPagePagingControls_Next" class="listPagePagingControl" \ndata-app-action="loadNextPage" \n>','</span> \n</span> \n</div> \n<div style="clear:both"></div> \n</div> \n</div> \n',' \n<div class="entriesLoadingMessage"> \n<img src="','" align="absmiddle" /> \n'," </div> \n",' \n<div class="errorMessage" style="margin-left:120px"> \n'," \n</div> \n"]
})();