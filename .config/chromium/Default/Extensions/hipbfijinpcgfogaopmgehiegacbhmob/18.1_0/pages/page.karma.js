"use strict";(function(){var b=devhd.pkg("pages");b.KarmaPage=function(f){this.guid=f};var e=b.KarmaPage.prototype=new b.BasePage();e.service=function(g,f){this.pageInfo=g;this.width=f.width;this.initBase(f);this.startRenderHTML()};e.destroy=function(){this.destroyBase()};e.allowsSideArea=function(){return false};e.allowsPageHeader=function(){return true
};e.startRenderHTML=function(){var f=this;this.twitter.askCurrentUserInfo(function(g){f.doRenderHTML(g==null?null:g.screen_name)})};e.doRenderHTML=function(h){this.twitterId=this.pageInfo.key;if(this.twitterId==null){this.twitterId=h}this.feedly.pushContext({uri:"karma",title:"Karma",pageNumber:0,level:1});this.feedly.setPageTitle("Karma");if(this.twitterId!=null){var g=this;
var f={q:"feedly.com/k",from:this.twitterId,rpp:25};this.twitter.askSearch(f,function(m){if(g.isDestroyed()){return}if(m.length==0){g.pageElem.innerHTML=templates.page.karma.none(g.twitterId);return}var l={};var j=[];for(var k=0;k<m.length&&j.length<=15;k++){if(m[k].bitly==null||l[m[k].bitly]!=null){continue}l[m[k].bitly]=true;j.push(m[k])}g.pageElem.innerHTML=templates.page.karma.tweets(j,g.twitterId);
a.call(g,j)})}else{this.pageElem.innerHTML=templates.page.karma.layout();var g=this;this.bind(this.element("karma"),"click",function(){g.feedly.redirect("karma/"+g.element("twitterId").value)})}};function a(l){var k=this;var h=[[],[],[],[]];for(var g=0;g<l.length;g++){h[g%4].push(l[g])}for(var f=0;f<h.length;f++){c.call(k,h[f],f)}}function c(h,g){var f=this;
devhd.utils.FlowUtils.forEach({},h,function(m,j,n,k,l){if(f.isDestroyed()){return}if(m.bitly==null){devhd.fn.callback(n)}d.call(f,m,n,k,g,j)})}function d(k,l,j,h,f){var g=this;this.tinyURL.askStats(k.bitly,function(i){try{if(g.isDestroyed()){return}if(i.user_clicks==null){g.element(k.bitly).style.display="none"}else{g.element(k.bitly+"_clicks").innerHTML="<b>"+i.user_clicks+"</b> clicks";
g.element(k.bitly+"_referrers").innerHTML=templates.page.karma.referrers(i)}}catch(m){}devhd.fn.callback(l)},function(i){try{if(g.isDestroyed()){return}g.element(k.bitly+"_clicks").innerHTML="?"}catch(m){}devhd.fn.callback(l)});g.twitter.askSearch({q:"http://bit.ly/"+k.bitly,rpp:50},function(o){try{if(g.isDestroyed()){return}var m=[];for(var n=o.length-1;
n>=0;n--){if(o[n].text.indexOf("http://bit.ly/"+k.bitly)>-1){m.push(o[n])}}if(m.length>1){g.element(k.bitly+"_tweets").innerHTML=m.length+" RT"}else{g.element(k.bitly+"_rt").style.display="none"}g.element(k.bitly+"_related").innerHTML=templates.page.base.tweetStream(m,10,m[0],g.twitterId)}catch(p){}})}})();