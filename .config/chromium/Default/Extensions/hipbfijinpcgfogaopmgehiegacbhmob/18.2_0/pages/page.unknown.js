"use strict";(function(){var a=devhd.pkg("pages");a.UnknownPage=function(){};var b=a.UnknownPage.prototype=new a.BasePage();b.service=function(d,c){this.pageInfo=d;this.width=c.width;this.initBase(c);this.startRenderHTML()};b.destroy=function(){this.destroyBase()};b.startRenderHTML=function(){this.pageElem.innerHTML=templates.page.base.pageNotFound(this.pageInfo.uri,this.home)
}})();