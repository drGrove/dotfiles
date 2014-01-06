"use strict";(function(){var c=devhd.pkg("pages");var i=devhd.log.get("page.filter");var f=devhd.i18n.L;c.FilterPage=function(){};var h=c.FilterPage.prototype=new c.BasePage();h.service=function(l,k){this.pageInfo=l;this.width=k.width;this.term=this.pageInfo.term;this.scope=null;this.scopeLabel=null;this.initBase(k);if(isNaN(this.pageInfo.pageNumber)||this.pageInfo.pageNumber<=0){this.pageInfo.pageNumber=0
}this.startRenderHTML()};var e=1000;h.destroy=function(){this.destroyBase()};h.startRenderHTML=function(){this._cancelAllVisualFinders();this.entryIndex={};this.endOfList=null;this.state="loading";this._updateContext();this._buildPageModel();this.feedly.clearNbrPages();this.feedly.setPageTitle(templates.page.filter.title(this.pageModel));this.pageElem.innerHTML=templates.page.filter.layout(this.pageModel,this.width,this.home);
this.createZoneLocationIndex();this.displayedZoneCount=0;this.coreZoneStart=0;this.coreZoneEnd=0;if(this.requestedScrollTop==null){this.lazyDisplay(0)}};h._updateContext=function(){switch(this.pageInfo.scopeType){case"my":this.feedly.pushContext({uri:this.pageInfo.uri,pageNumber:this.pageInfo.pageNumber,title:devhd.utils.TermUtils.formatTitle("#my"),level:1,searchTerm:this.term});
break;case"latest":this.feedly.pushContext({uri:this.pageInfo.uri,pageNumber:this.pageInfo.pageNumber,title:devhd.utils.TermUtils.formatTitle("#latest"),level:1,category:"#latest",searchTerm:this.term,searchScope:this.scope});break;case"category":var k=this.pageInfo.key;this.scope=devhd.utils.TermUtils.formatTerm(k,this.home.getUserId());this.scopeLabel=k;
this.feedly.pushContext({uri:this.pageInfo.uri,pageNumber:this.pageInfo.pageNumber,title:devhd.utils.TermUtils.formatTitle(k),level:1,category:k,searchTerm:this.term,searchScope:this.scope});break;case"label":var m=this.pageInfo.key;this.scope=devhd.utils.TermUtils.formatTerm(m,this.home.getUserId());this.scopeLabel=devhd.utils.TermUtils.formatTitle(m);
this.feedly.pushContext({uri:this.pageInfo.uri,pageNumber:this.pageInfo.pageNumber,title:this.scopeLabel,level:1,queryInfo:{flsId:this.scope,excludeLabel:null},category:m,searchTerm:this.term,searchScope:this.scope});break;case"preview":case"subscription":var l=devhd.utils.FeedIdUtils.create(this.pageInfo.key);this.scope=l;var o="this feed";var n=this;
this.reader.askSubscription(l,function(p){if(p!=null){o=p.title}n.scopeLabel=o;n.feedly.pushContext({uri:n.pageInfo.uri,pageNumber:n.pageInfo.pageNumber,title:o,level:2,queryInfo:{flsId:l,excludeLabel:null},feedId:l,searchTerm:n.term,searchScope:n.scope})});break;default:}};var g=8;var a=2;var b=4;h._buildPageModel=function(){var n=b;var l=1;var m=Math.floor(e/(devhd.utils.PageConstants.U_HEIGHT(n)));
var t=l*m*a;var o=m*devhd.utils.PageConstants.U_HEIGHT(n)*a;var p=l*m*g;var u=p;var k=this.pageInfo.pageNumber*u;var r=k+p;var s=Math.ceil(p/t);var q=-1;this.pageModel={term:this.term,scope:this.scope,scopeLabel:this.scopeLabel,pageNumber:this.pageInfo.pageNumber,start:k,end:r,nbrEntriesPerZone:t,nbrZones:s,zoneHeight:o,lastZoneHeight:q}};h.computeZoneHeight=function(k){return k*devhd.utils.PageConstants.U_HEIGHT(b)
};h.createZoneLocationIndex=function(){this.zoneLocationIndex=[];for(var k=0;k<this.pageModel.nbrZones;k++){var l=this.element("zone"+k);this.zoneLocationIndex.push({start:l.offsetTop,end:l.offsetTop+l.offsetHeight,element:l})}};h.isFullyLoaded=function(){if(this.zoneLocationIndex==null){return true}return this.displayedZoneCount==this.zoneLocationIndex.length
};h.askLazyDisplay=function(k){if(this.isDestroyed()){return}if(this.isFullyLoaded()==true){return}if(this.coreZoneStart<k&&k<this.coreZoneEnd*0.3){return}this.lazyDisplay(k)};var j=250;h.lazyDisplay=function(m){this.coreZoneStart=m;this.coreZoneEnd=m+e+0.8*e;for(var l=this.zoneLocationIndex.length-1;l>=0;l--){var k=this.zoneLocationIndex[l];if(d(k,this.coreZoneStart,this.coreZoneEnd)){this.askDisplayEntries(l)
}}};function d(k,l,m){return k.start>=l&&k.start<=m||k.end>=l&&k.end<=m||k.start<=l&&k.end>=m}h.askDisplayEntries=function(k){if(this.isDestroyed()){return}if(this.zoneLocationIndex[k].displayed==true){return}this.zoneLocationIndex[k].element.innerHTML=templates.page.filter.loading(this.pageModel,this.home);var m=this;var l=this.pageModel.start+(k+1)*this.pageModel.nbrEntriesPerZone;
this.reader.askSearchEntries(this.term,this.scope,this.pageModel.end,function(n){m.onEntriesReady(n,l,k)},function(o,n){m.onEntriesError(o,n)})};h.onPageScrollChanged=function(k){this.askLazyDisplay(k)};h.onEntriesReady=function(p,s,l){if(this.isDestroyed()){return}try{for(var o=0;o<=l;o++){if(this.zoneLocationIndex[o].displayed==true){continue}var m=p.slice(this.pageModel.start+o*this.pageModel.nbrEntriesPerZone,this.pageModel.start+(o+1)*this.pageModel.nbrEntriesPerZone);
this.displayEntries(m,o);this.zoneLocationIndex[o].entries=m;this.zoneLocationIndex[o].displayed=true;this.zoneLocationIndex[o].element.style.height="auto";if(m.length==0&&o==0){this.element("emptyListMessage").style.display="block"}if(m.length<this.pageModel.nbrEntriesPerZone){var r=this.computeZoneHeight(m.length);this.zoneLocationIndex[o].element.style.height="auto";
this.zoneLocationIndex[o].element.style.partial="true";for(var n=o+1;n<this.pageModel.nbrZones;n++){this.zoneLocationIndex[n].entries=[];this.zoneLocationIndex[n].displayed=true;this.zoneLocationIndex[n].element.style.height="auto";this.zoneLocationIndex[n].element.style.display="none"}var t=this.element("listPagePagingControls_Next");t.className=t.className+" listPagePagingControlInactif";
t.onclick="";if(this.pageModel.pageNumber==0){t.style.display="none"}this.element("endOfListIndicator").style.display="inline";this.endOfList=true;this.onEndOfListDetected();break}this.displayedZoneCount=Math.max(this.displayedZoneCount,l+1)}this.element("range").innerHTML=templates.page.base.range(this.pageModel.start+1,p.length,this.home);if(this.requestedSelectedEntryId!=null&&this.selectedEntryId==null){for(var o=0;
o<p.length;o++){if(p[o].getId()==this.requestedSelectedEntryId){this.selectEntry(this.requestedSelectedEntryId,false)}}}}catch(q){i.error(409,"display search results ",q);var k=devhd.utils.ExceptionUtils.formatError("display search results",q);this.element("zone0").innerHTML=k}};h.onEntriesError=function(l,k){this.element("search_entries").innerHTML=templates.page.base.errorBox(l+" -- "+k,this.pageInfo,this.home)
};h.onEndOfListDetected=function(){this.feedly.setNbrPages(this.pageModel.pageNumber+1)};h.displayEntries=function(l,k){var m=this["displayU"+b+"Entries"];if(m==null){m=displayU4Entries}m.call(this,l,k);this.askAdjustEntries(l)};h.displayU1Entries=function(l,k){var p=1;var o=[];for(var n=0;n<l.length;n++){var m=l[n];o.push({entry:m,type:p});this.entryIndex[m.getId()]=m
}var q=this.element("zone"+k);q.innerHTML=templates.page.base.parts(o,this.width,{term:this.term,includeSourceTitle:this.pageInfo.scopeType!="subscription"},this.home);this.state="loaded"};h.displayU4Entries=function(p,l){var m=4;var n=[];for(var o=0;o<p.length;o++){var t=p[o];n.push({entry:t,type:m});this.entryIndex[t.getId()]=t}var r=false;if(this.subscription==null){r=true
}var s=this.element("zone"+l);s.innerHTML=templates.page.base.parts(n,this.width,{term:this.term,includeSourceTitle:this.pageInfo.scopeType!="subscription"},this.home);for(var o=0;o<n.length;o++){var k=this._createAndEnlistVisualFinder(n[o].entry,devhd.utils.PageConstants.U4_IMAGE_WIDTH,devhd.utils.PageConstants.U4_IMAGE_HEIGHT);var q=this;k.onVisualReady=function(v,u){q.askDisplayU4Visual(v,u,n[o].entry.embedsVideo())
};k.onNoVisual=function(u){q.askHandleNoU4Visual(u)};k.start()}};h.askDisplayU4Visual=function(l,k,m){if(this.isDestroyed()){return}this.postWork(h.doDisplayU4Visual,arguments)};h.doDisplayU4Visual=function(l,k,m){this._delistVisualFinder(l);this._displayVisual(l,k,m)};h.askHandleNoU4Visual=function(l,k){if(this.isDestroyed()){return}this.postWork(h.doHandleNoU4Visual,arguments)
};h.doHandleNoU4Visual=function(l,k){this._delistVisualFinder(l)};h._displayVisual=function(l,k,m){var n=this.element(l+"_main_visual");if(n==null){return}n.innerHTML=templates.page.base.visual(l,k,devhd.utils.PageConstants.U4_IMAGE_WIDTH,devhd.utils.PageConstants.U4_IMAGE_HEIGHT,null,m);n.style.display="block"};h.markPageAsRead=function(){this.signs.setMessage(f(91),100);
var n=[];for(var m=0;m<o.zoneLocationIndex.length;m++){var k=o.zoneLocationIndex[m];if(k.entries!=null&&k.entries.length>0){for(var l=0;l<k.entries.length;l++){n.push(k.entries[l].getId())}}}var o=this;this.reader.askMarkEntriesAsRead(n,function(){},function(p){o.signs.setMessage("Error:"+p)})};h.findNextEntryId=function(q){var p=false;if(this.selectedEntryId==null){p=true
}for(var o=0;o<this.zoneLocationIndex.length;o++){var k=this.zoneLocationIndex[o];if(k.entries!=null&&k.entries.length>0){for(var m=0;m<k.entries.length;m++){if(p==true){if(q==true){var l=k.entries[m];var n=l.getId();if(l.isRead()==false){return n}else{continue}}else{return k.entries[m].getId()}}if(k.entries[m].getId()==this.selectedEntryId){p=true}}}}return null
};h.findPreviousEntryId=function(q){var p=false;if(this.selectedEntryId==null){p=true}for(var o=this.zoneLocationIndex.length-1;o>=0;o--){var k=this.zoneLocationIndex[o];if(k.entries!=null&&k.entries.length>0){for(var m=k.entries.length-1;m>=0;m--){if(p==true){if(q==true){var l=k.entries[m];var n=l.getId();if(l.isRead()==false){return n}else{continue
}}else{return k.entries[m].getId()}}if(k.entries[m].getId()==this.selectedEntryId){p=true}}}}};h.onPreviousEntry=function(m,k){var l=this.findPreviousEntryId(m);if(l!=null){if(k==true){this.selectEntry(l,"toview")}else{this.inlineEntry(l,true,true)}}else{this.feedly.loadPreviousPage({selectEntry:true,navigationMode:"keyboard"})}};h.onNextEntry=function(m,k){var l=this.findNextEntryId(m);
if(l!=null){if(k==true){this.selectEntry(l,"toview")}else{this.inlineEntry(l,true,true)}}else{if(this.isFullyLoaded()==true||this.endOfList==true){this.feedly.loadNextPage({selectEntry:true,navigationMode:"keyboard"})}else{this.signs.setMessage(f(94))}}}})();