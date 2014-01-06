const Paginator=(function(){function b(d){return(typeof d=="function")?d:function(){}}function c(d,e){if(!(this instanceof c)){return new arguments.callee(d,e)}const f=this;this.container=d;this.options=$.extend(true,{},c.options,e||{});this.init()}c.options={limit:10,bottomPixels:200,scrollable:true,maxPage:20,jsselect:"entry",debug:chrome&&chrome.settings&&chrome.settings.get("debug")};c.prototype={index:0,computeLimit:function a(j){var i=$(this.container);var f=this.$entry;var d=f.eq(0).height();var g=f.eq(0).width();var e=Math.ceil(i.height()/f.height()+(j?1:0));var h=Math.floor(i.width()/f.width());this.options.debug&&console.debug("paginator.computeLimit",g,"lines:",e,"cols:",h,$elements.width(),f.width(),$elements.height()/f.height());return e*h},get $entry(){return $(this.container).find("[jsselect="+this.options.jsselect+"]")},get $navigation(){return $(this.container).parent().find("[name=navigation]")},init:function(){const k=this;var j=$(this.container);this.$template=this.$entry.eq(0).clone();var e=this.options.scroller||j.get(0);var d=j.get(0).ownerDocument;if(this.options.scrollable){var i=false;$(e).addClass("endless-scroll").css("overflow-y","auto").scroll(function(n){var m=$(this);var l=this==d?d.documentElement:this;var p=this==d?d.body.scrollTop:l.scrollTop;var o=(l.scrollHeight-(l.clientHeight+p))<=k.options.bottomPixels;if(o&&!i){i=true;k.showMore(function(){i=false;$(e)})}})}else{var h=false;var g=/Firefox/i.test(navigator.userAgent)?"DOMMouseScroll":"mousewheel";e.addEventListener(g,function(m){if(h){return}function l(){h=false}if(m.wheelDelta<0){h=true;k.next(l)}if(m.wheelDelta>0){h=true;k.prev(l)}},false);$(this.$navigation.get(0)).find("[rel=next]").live("click",function(){k.next();return false});$(this.$navigation.get(0)).find("[rel=prev]").live("click",function(){k.prev();return false});$(this.$navigation.get(0)).find("[rel=page]").live("click",function(){k.index=this.index;k.process();return false})}if(this.options.autolimit){var f=false;window.addEventListener("resize",function(){if(!f&&["loaded","complete"].indexOf(d.readyState)!=-1){f=true;k.options.limit=postsPaginator.computeLimit(true);$(k.container).scroll();f=false}},false)}this.options.debug&&console.debug("paginator.init",this);return this},showMore:function(d){if(this.index<this.options.maxPage){this.index++;this.process(true,d)}else{if(d){d()}}},clear:function(){var d={};d[this.options.jsselect]=[];this.$entry.jsTemplate(d)},refresh:function(d){this.options.debug&&console.debug("paginator.refresh",this);this.index=0;this.process(d);$(this.container).scroll()},process:function(d,f){this.options.debug&&console.debug("paginator.process",this);f=arguments[arguments.length-1];d=d===true;const e=this;if(!d){this.clear()}this.options.manager(this.index*this.options.limit,this.options.limit,function(g){if(g.length>0){var h=e.$entry.eq(0);if(d){h=h.clone().hide().appendTo(h.parent());h.removeAttr("jstcache").removeAttr("jsinstance").find("[jstcache],[jsinstance]").each(function(){$(this).removeAttr("jstcache").removeAttr("jsinstance")})}var j=e.container.scrollTop;var i={};i[e.options.jsselect]=g;h.jsTemplate(i).show().scroll();e.container.scrollTop=j}if(!e.options.scrollable){e.updateNavigation(function(){b(f)(g)})}else{b(f)(g)}});return this},updateNavigation:function(e){this.options.debug&&console.debug("paginator.updateNavigation",this);const d=this;this.options.counter(function(g){var f=(function(){var h=[];for(var j=0,k=Math.min(d.options.maxPage,Math.ceil(g/d.options.limit));j<k;j++){h.push({index:j,selected:j==d.index})}return h}).call(this);d.$navigation.jsTemplate({page:f,selected:this.index,prev:d.index>0,next:d.index<(d.options.maxPage-1)&&(d.index<f.length-1)});if(typeof e=="function"){e()}})},next:function(e){this.options.debug&&console.debug("paginator.next",this);const d=this;this.options.counter(function(f){if((d.index+1)*d.options.limit<f){d.index++;d.process(b(e))}else{b(e)()}});return this},prev:function(d){this.options.debug&&console.debug("paginator.prev",this);if(this.index>0){this.index--;this.process(b(d))}else{b(d)()}return this},add:function(d,g){this.options.debug&&console.debug("paginator.add",this,d,g);var f=this.$template.clone().removeClass("active");f[g?"prependTo":"appendTo"](this.$container);var e={};e[this.options.jsselect]="length" in d?d:[d];f.jsTemplate(e).show()},remove:function(d){this.options.debug&&console.debug("paginator.remove",this,d);this.$entry.filter(function(){var e=$(this).data("entry");if(e){return e.id==d.id}return false}).remove()},update:function(e){if(e){var g=this.$template.clone();var d=this.$entry.filter(function(h){return $(this).data("entry").id==post.id});d.replaceWith(g);var f={};f[this.options.jsselect]="length" in e?e:[e];g.jsTemplate(f)}}};return c})();const Carousel=(function(){const b=10000;function a(e,d){return e.contains?e!=d&&e.contains(d):!!(e.compareDocumentPosition(d)&16)}function c(d,e){if(!(this instanceof arguments.callee)){return new arguments.callee(d,e)}const f=this;this.container=d;this.options={};Object.keys(c.options).forEach(function(g){f.options[g]=c.options[g]});Object.keys(e||{}).forEach(function(g){f.options[g]=e[g]});this.init();return this}c.options={interval:10*1000};c.prototype={_index:0,get nextElement(){var e=this.container.nextElementSibling;var d=e&&e.getAttribute("rel")=="next"&&e;if(!d){d=document.createElement("a");d.setAttribute("rel","next");d.setAttribute("href","#");this.container.appendChild(d);if(this.container.nextSibling){this.container.parentNode.insertBefore(d,this.container.nextSibling)}else{this.container.parentNode.appendChild(d)}}return d},get prevElement(){var d=this.container.previousElementSibling;var e=d&&d.getAttribute("rel")=="previous"&&d;if(!e){e=document.createElement("a");e.setAttribute("rel","previous");e.setAttribute("href","#");this.container.parentNode.insertBefore(e,this.container)}return e},get elements(){return this.container.children;return Array.prototype.slice.call(this.container.querySelectorAll("*:not([rel])"),0).filter(function(d){return d.nodeType==document.ELEMENT_NODE})},get index(){return this._index},set index(d){this._index=d>0?(d%this.elements.length):0},init:function(){const d=this;this.wrapper=this.container.ownerDocument.createElement("div");this.wrapper.classList.add("carousel");this.container.parentNode.insertBefore(this.wrapper,this.container);this.wrapper.appendChild(this.container);this.prevElement.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();d.prev()},false);this.nextElement.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();d.next()},false);this.container.addEventListener("mouseover",function(e){if((!e.relatedTarget||!a(d.container,e.relatedTarget))&&(e.target==d.container||a(d.container,e.target))){d.pause()}},false);this.container.addEventListener("mouseout",function(e){if(!e.relatedTarget||(e.target==d.container||a(d.container,e.target))&&(e.relatedTarget==d.container&&!a(d.container,e.relatedTarget))){d.start()}},false);this.update();return this},prev:function(d){this.index--;this.update()},next:function(d){this.index++;this.update()},start:function(){const d=this;this.update();if(!this.intervalId){this.intervalId=setInterval(function(){d.next()},this.options.interval)}},update:function(){this.nextElement[this.elements.length>0&&this.index<this.elements.length-1?"removeAttribute":"setAttribute"]("disabled","true");this.prevElement[this.elements.length>0&&this.index>0?"removeAttribute":"setAttribute"]("disabled","true");this.container.style.marginLeft=this.index*-this.container.children[0].offsetWidth+"px"},pause:function(){clearInterval(this.intervalId);this.intervalId=null}};return c})();