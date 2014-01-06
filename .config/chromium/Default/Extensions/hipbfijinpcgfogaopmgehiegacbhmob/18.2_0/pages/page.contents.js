"use strict";(function(){var d=devhd.pkg("pages");var b=d.BasePage.prototype;var h=d.createClass("ContentsPage",d.BasePage);var m=devhd.log.get("page.contents");var e=devhd.i18n.L;h.initialize=function(p){b.initialize.call(this);this.guid=p};h.service=function(q,p){this.pageInfo=q;this.width=p.width;this.initBase(p);this.edit=this.pageInfo.uri.indexOf("edit")>-1;
this.setup=this.pageInfo.uri.indexOf("setup")>-1;this.first=this.pageInfo.uri.indexOf("first")>-1;this.startRenderHTML()};h.destroy=function(){this.pageElem.className=this.pageElem.className.replace(" editMode","");this.destroyBase()};h.allowsSideArea=function(){return false};h.allowsPageHeader=function(){return true};h.allowsRefresh=function(){return false
};h.switchToEditMode=function(){this.pageElem.className+=" editMode"};h.startRenderHTML=function(){this.feedly.clearNbrPages();this.feedly.pushContext({uri:"contents",pageNumber:this.pageInfo.pageNumber,title:"Contents",level:1,category:"#contents"});k.call(this)};h.onUnreadCountsAvailable=function(){k.call(this)};function k(){this.unbindAll();var p=this;
o.call(this,function(q){i.call(p,q)})}function o(r){var p={mustReadsOnly:this.getPreference("mustReadsOnlyFilter")=="on",term:this.pageInfo.term};var q=this;this.reader.askSourcesModel(p,r)}function i(s){var w=0;for(var u=0;u<s.categories.length;u++){var r=s.categories[u];var t=s.subs[r];var q=[];for(var p=0;p<t.length;p++){if(this.edit==false&&t[p].unreadCount==0){continue
}w++;t[p].crank=(t[p].unreadCount>0?10000:0)+(t[p].isMustRead()?1000:0);q.push(t[p])}s.subs[r]=q.sort(function(y,x){if(y.crank!=x.crank){return x.crank-y.crank}else{return x.updated-y.updated}})}this.pageModel=s;this.feedly.setPageTitle(templates.page.contents.title(this.pageModel,this.pageInfo.key));if(this.edit||this.setup){this.switchToEditMode()
}if(this.setup){this.pageElem.innerHTML=templates.page.contents.setup()}else{this.pageElem.innerHTML=templates.page.contents.layout(this.pageModel,this.width,this.pageInfo.term,this.first,this.edit,w==0)}var v=new devhd.behaviors.Dragable();v.setDndHandler({$this:this,$fn:h.dndHandler});this.bind(this.pageElem,v)}function f(p){this.signs.setNextAutoHideDelay(10000);
this.signs.setMessage(templates.unoMomento());var q=p.origValue;var r=p.value;if(q==null){m.warn(195,"category rename, old category is null?");p.undo();return}m.trace(199,"new-category name : ",r," changed category name ",q);j.call(this,q,r)}h.dndHandler=function(s,p){var r=this;if(s=="dragStart"){p.data={};switch(p.dragId){case 1:p.data.feedId=p.src.getAttribute("data-feedId");
var q=devhd.utils.HTMLUtils.findParentElementByTagAndAttribute(p.src,"*","data-category","*");p.data.oldCat=q?q.getAttribute("data-category"):null;if(p.data.feedId==null){p.cancel=true;return}p.dragable.innerHTML=devhd.utils.HTMLUtils.outerHTML(p.src);p.dragableSet=true;p.type="move";break;case 2:var q=devhd.utils.HTMLUtils.findParentElementByTagAndAttribute(p.src,"*","data-category","*");
p.data.category=q?q.getAttribute("data-category"):null;if(p.data.category==null){p.cancel=true;return}p.dragable.innerHTML=devhd.utils.HTMLUtils.outerHTML(p.src);p.dragableSet=true;p.type="move";break;default:p.cancel=true;return}}else{if(s=="dragOver"){}else{if(s=="dragOut"){}else{if(s=="dragDrop"){switch(p.dragId){case 1:p.data.newCat=p.target.getAttribute("data-category");
if(p.data.newCat==null||p.data.oldCat==p.data.newCat){p.cancel=true;return}l.call(r,p.data.feedId,p.data.oldCat,p.data.newCat);this.analytics.trackEvent("organize.v7","reorder_feed");break;case 2:p.data.before=p.target.getAttribute("data-category");if(p.data.before==null||p.data.before==p.data.category){p.cancel=true;return}g.call(r,p.data.category,p.data.before);
this.analytics.trackEvent("organize.v7","reorder_category");break;default:p.cancel=true;return}}else{if(s=="dragEnd"){}}}}}};function g(r,q){var p=[];for(var s=0;s<this.pageModel.categories.length;s++){if(this.pageModel.categories[s]==q){p.push(r)}if(this.pageModel.categories[s]==r){continue}p.push(this.pageModel.categories[s])}this.pageModel.categories=p;
this.pageElem.innerHTML=templates.page.contents.layout(this.pageModel,this.width,this.pageInfo.term,this.first,this.edit,false);this.preferences.askSetPreference("categoriesOrdering",devhd.utils.JSONUtils.encode(p))}function l(q,p,s){if(s=="##tag##"){this.analytics.trackEvent("organize.v7","create_category");this.dialog.show(templates.forms.newCategory(""),550);
var r=this;this.bind(this.element("create"),"click",function(){var t=devhd.str.trim(r.element("categoryLabel").value);r.dialog.hide();l.call(r,q,p,t)});this.bind(this.element("cancel"),"click",function(){r.dialog.hide();k.call(r)});return}if(p==s){return}this.analytics.trackEvent("organize.v7","reorder_feed");a.call(this,[q],p,s)}h.removeCategory=function(p){var q=true;
if(q==true){this.signs.setMessage(templates.page.base.confirmUnsubscribeCategory(p,this.home),0.8,true,this);this.signs.setNextAutoHideDelay(45*1000)}else{this.doRemoveCategory(p)}this.analytics.trackEvent("organize.v7","delete_category")};h.doRemoveCategory=function(r){this.signs.hide();var p=this.element(r+"_progress");var u=this.element(r+"_pi");
var q=0;var s={categoryLabel:r};var t=this;this.reader.askSubscriptions(s,function(v){if(v==null||v.length==0){k.call(t);return}t.processing=true;devhd.utils.FlowUtils.forEach({},v,function(y,w,A,x,z){if(t.isDestroyed()){return}devhd.fn.callback(z,y.id);if(y.listCategoryLabels().length>1){n.call(t,y.id,r,null,function(){devhd.fn.callback(A)},x)}else{t.reader.askRemoveSubscription(y.id,function(){devhd.fn.callback(A)
},x)}},{onStart:function(){if(p!=null){p.style.display="inline"}if(u!=null){u.style.width="0px"}},onSuccess:function(){t.processing=false;if(p!=null){p.style.display="none"}if(u!=null){u.style.width="0px"}var w=[];for(var x=0;x<t.pageModel.categories.length;x++){if(t.pageModel.categories[x]==r){continue}w.push(t.pageModel.categories[x])}t.preferences.askSetPreference("categoriesOrdering",devhd.utils.JSONUtils.encode(w));
k.call(t)},onError:function(w){t.processing=false;if(p!=null){p.style.display="none"}if(u!=null){u.style.width="0px"}t.signs.setMessage(e(e(89),w))},onProgress:function(w){if(u!=null&&v.length>1){q++;u.style.width=Math.floor(191*q/v.length)+"px"}}})})};h.renameCategory=function(p){this.dialog.show(templates.forms.editCategory(p),550);var q=this;this.bind("rename","click",function(){var r=q.element("categoryLabel").value;
q.dialog.hide();j.call(q,p,r)});this.bind("cancel","click",function(){q.dialog.hide()});this.analytics.trackEvent("organize.v7","rename_category")};function j(p,r){var q={categoryLabel:p,searchTerm:null,nonEmptyOnly:false,mustReadOnly:this.getPreference("sourcesMustReadsOnlyFilter")=="on"};var s=this;this.reader.askSubscriptions(q,function(v){var t=[];
for(var u=0;u<v.length;u++){t.push(v[u].id)}a.call(s,t,p,r,true)})}function a(r,s,t,w){if(w!=true){w=false}this.processing=true;var p=this.element(t+"_progress")||this.element(s+"_progress");var v=this.element(t+"_pi")||this.element(s+"_pi");var q=0;var u=this;devhd.utils.FlowUtils.forEach({},r,function(x,y,B,z,A){if(u.isDestroyed()){return}devhd.fn.callback(A,x);
n.call(u,x,s,t,function(){devhd.fn.callback(B)},z)},{onStart:function(){if(p!=null){p.style.display="inline"}if(v!=null){v.style.width="0px"}},onSuccess:function(){u.processing=false;if(p!=null){p.style.display="none"}if(v!=null){v.style.width="0px"}if(w==true){var x=[];for(var y=0;y<u.pageModel.categories.length;y++){if(u.pageModel.categories[y]==s){x.push(t)
}else{x.push(u.pageModel.categories[y])}}u.preferences.askSetPreference("categoriesOrdering",devhd.utils.JSONUtils.encode(x))}k.call(u)},onError:function(x){u.processing=false;if(v!=null){v.style.width="0px"}if(p!=null){p.style.display="none"}u.signs.setMessage(e(e(89),x))},onProgress:function(x){if(v!=null&&r.length>1){q++;v.style.width=Math.floor(191*q/r.length)+"px"
}}})}function n(q,r,s,w,u){var t=this;var p=s;if(p){if(typeof p=="string"){p=[s]}}var v=r;if(v){if(typeof v=="string"){v=[v]}}this.reader.askUpdateSubscription(q,null,p,v,{},false,w,u)}h.onSubscriptionRemoved=function(p,q){if(q||this.processing==true){return}k.call(this)};h.onSubscriptionTitleChanged=function(p){if(this.processing==true){return}k.call(this)
};h.onSubscriptionMustReadStatusChanged=function(p){if(this.processing==true){return}k.call(this)};h.onSubscriptionUnreadCountChanged=function(q,p){if(this.processing==true){return}k.call(this)};h.onSubscriptionFullyAdded=function(p,r,q){if(q||this.processing==true){return}k.call(this)};h.onSubscriptionRemovedFromCategory=function(q,p,r){if(r||this.processing==true){return
}k.call(this)};function c(p){this.effects.fade(p,{delay:0.4,from:1,to:0,onComplete:function(q){devhd.utils.HTMLUtils.remove(q)}},"feedly")}})();