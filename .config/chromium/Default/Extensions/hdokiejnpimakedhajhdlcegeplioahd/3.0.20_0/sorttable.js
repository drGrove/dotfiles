var stIsIE=false;
sorttable={search_array:{},init:function(){_timer&&clearInterval(_timer);if(document.createElement&&document.getElementsByTagName){sorttable.DATE_RE=/^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/;sorttable.search_array={};forEach(document.getElementsByTagName("table"),function(a){if(a.className.search(/\bsortable\b/)!=-1){sorttable.makeSortable(a);var b;a=sorttable.tokenize_popup_rows(a);for(b in a)sorttable.search_array[b]=a[b]}})}},makeSortable:function(a){if(a.getElementsByTagName("thead").length==0){the=
document.createElement("thead");the.appendChild(a.rows[0]);a.insertBefore(the,a.firstChild)}if(a.tHead==null)a.tHead=a.getElementsByTagName("thead")[0];if(a.tHead.rows.length==1){sortbottomrows=[];for(var b=0;b<a.rows.length;b++)if(a.rows[b].className.search(/\bsortbottom\b/)!=-1)sortbottomrows[sortbottomrows.length]=a.rows[b];if(sortbottomrows){if(a.tFoot==null){tfo=document.createElement("tfoot");a.appendChild(tfo)}for(b=0;b<sortbottomrows.length;b++)tfo.appendChild(sortbottomrows[b]);delete sortbottomrows}var c=
a.tHead.rows[0].cells;for(b=0;b<c.length;b++)if(!c[b].className.match(/\bsorttable_nosort\b/)){var d=c[b].className.match(/\bsorttable_([a-z0-9]+)\b/),f="";if(d)f=d[1];c[b].sorttable_sortfunction=d&&typeof sorttable["sort_"+f]=="function"?sorttable["sort_"+f]:sorttable.guessType(a,b);c[b].sorttable_columnindex=b;c[b].sorttable_tbody=a.tBodies[0];c[b].addEventListener("click",function(){if(this.className.search(/\bsorttable_sorted\b/)!=-1){sorttable.reverse(this.sorttable_tbody);this.className=this.className.replace("sorttable_sorted",
"sorttable_sorted_reverse");var e=document.getElementById("sorttable_sortfwdind");e&&e.parentNode.removeChild(e);e=document.createElement("span");e.id="sorttable_sortrevind";e.innerHTML=stIsIE?'&nbsp<font face="webdings">5</font>':"&nbsp;&#x25B4;";this.appendChild(e)}else if(this.className.search(/\bsorttable_sorted_reverse\b/)!=-1){sorttable.reverse(this.sorttable_tbody);this.className=this.className.replace("sorttable_sorted_reverse","sorttable_sorted");(e=document.getElementById("sorttable_sortrevind"))&&
e.parentNode.removeChild(e);e=document.createElement("span");e.id="sorttable_sortfwdind";e.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':"&nbsp;&#x25BE;";this.appendChild(e)}else{forEach(this.parentNode.childNodes,function(i){if(i.nodeType==1){i.className=i.className.replace("sorttable_sorted_reverse","");i.className=i.className.replace("sorttable_sorted","")}});(e=document.getElementById("sorttable_sortfwdind"))&&e.parentNode.removeChild(e);(e=document.getElementById("sorttable_sortrevind"))&&
e.parentNode.removeChild(e);this.className+=" sorttable_sorted";e=document.createElement("span");e.id="sorttable_sortfwdind";e.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':"&nbsp;&#x25BE;";this.appendChild(e);e=[];for(var h=this.sorttable_columnindex,j=this.sorttable_tbody.rows,g=0;g<j.length;g++)e[e.length]=[sorttable.getInnerText(j[g].cells[h]),j[g]];e.sort(this.sorttable_sortfunction);h=this.sorttable_tbody;for(g=0;g<e.length;g++)h.appendChild(e[g][1]);delete e}},false)}}},guessType:function(a,
b){var c=sorttable.sort_alpha;if(b==0||b==1)return c;if(b==2)return sorttable.sort_reverse_numeric;for(var d=0;d<a.tBodies[0].rows.length;d++){var f=sorttable.getInnerText(a.tBodies[0].rows[d].cells[b]);if(f!=""){if(f.match(/^-?[\xA3$\xA4]?[\d,.]+%?$/))return sorttable.sort_numeric;if(f=f.match(sorttable.DATE_RE)){c=parseInt(f[1]);f=parseInt(f[2]);if(c>12)return sorttable.sort_ddmm;else if(f>12)return sorttable.sort_mmdd;else c=sorttable.sort_ddmm}}}return c},getInnerText:function(a){if(!a)return"";
hasInputs=typeof a.getElementsByTagName=="function"&&a.getElementsByTagName("input").length;if(a.getAttribute("sorttable_customkey")!=null)return a.getAttribute("sorttable_customkey");else if(typeof a.textContent!="undefined"&&!hasInputs)return a.textContent.replace(/^\s+|\s+$/g,"");else if(typeof a.innerText!="undefined"&&!hasInputs)return a.innerText.replace(/^\s+|\s+$/g,"");else if(typeof a.text!="undefined"&&!hasInputs)return a.text.replace(/^\s+|\s+$/g,"");else switch(a.nodeType){case 3:if(a.nodeName.toLowerCase()==
"input")return a.value.replace(/^\s+|\s+$/g,"");case 4:return a.nodeValue.replace(/^\s+|\s+$/g,"");case 1:case 11:for(var b="",c=0;c<a.childNodes.length;c++)b+=sorttable.getInnerText(a.childNodes[c]);return b.replace(/^\s+|\s+$/g,"");default:return""}},reverse:function(a){newrows=[];for(var b=0;b<a.rows.length;b++)newrows[newrows.length]=a.rows[b];for(b=newrows.length-1;b>=0;b--)a.appendChild(newrows[b]);delete newrows},sort_numeric:function(a,b){aa=parseFloat(a[0].replace(/[^0-9.-]/g,""));if(isNaN(aa))aa=
0;bb=parseFloat(b[0].replace(/[^0-9.-]/g,""));if(isNaN(bb))bb=0;return aa-bb},sort_reverse_numeric:function(a,b){aa=parseFloat(a[0].replace(/[^0-9.-]/g,""));if(isNaN(aa))aa=0;bb=parseFloat(b[0].replace(/[^0-9.-]/g,""));if(isNaN(bb))bb=0;return bb-aa},sort_alpha:function(a,b){var c,d;c=typeof a[0].toLowerCase!="undefined"?a[0].toLowerCase():a;d=typeof b[0].toLowerCase!="undefined"?b[0].toLowerCase():b;if(c==d)return 0;if(c<d)return-1;return 1},sort_ddmm:function(a,b){var c,d,f,e;c=a[0].match(sorttable.DATE_RE);
d=c[3];f=c[2];c=c[1];if(f.length==1)f="0"+f;if(c.length==1)c="0"+c;e=d+f+c;c=b[0].match(sorttable.DATE_RE);d=c[3];f=c[2];c=c[1];if(f.length==1)f="0"+f;if(c.length==1)c="0"+c;d=d+f+c;if(e==d)return 0;if(e<d)return-1;return 1},sort_mmdd:function(a,b){var c,d,f,e;c=a[0].match(sorttable.DATE_RE);d=c[3];f=c[2];c=c[1];if(c.length==1)c="0"+c;if(f.length==1)f="0"+f;e=d+c+f;c=b[0].match(sorttable.DATE_RE);d=c[3];f=c[2];c=c[1];if(c.length==1)c="0"+c;if(f.length==1)f="0"+f;d=d+c+f;if(e==d)return 0;if(e<d)return-1;
return 1},shaker_sort:function(a,b){for(var c=0,d=a.length-1,f=true;f;){f=false;for(var e=c;e<d;++e)if(b(a[e],a[e+1])>0){f=a[e];a[e]=a[e+1];a[e+1]=f;f=true}d--;if(!f)break;for(e=d;e>c;--e)if(b(a[e],a[e-1])<0){f=a[e];a[e]=a[e-1];a[e-1]=f;f=true}c++}},filter:function(a,b){b=b.toLowerCase();b=b.replace(/^\s+/,"");b=b.replace(/\s+$/,"");for(var c=0;c<a.rows.length;c++){var d=a.rows[c].id;if(!(d=="autofilltabfooter"||d=="autologintabfooter"||d=="autologintabheader"||d=="autofilltabheader"))if(d.indexOf("lpautofill")==
0||d.indexOf("lpautologin")==0)document.getElementById(d).style.display=b.length==0?"table-row":typeof sorttable.search_array[d]!="undefined"&&sorttable.search_array[d].indexOf(b)>=0?"table-row":"none"}},tokenize_popup_rows:function(a){for(var b={},c=0;c<a.rows.length;c++){var d=[],f=a.rows[c].id;if(!(f=="autofilltabfooter"||f=="autologintabfooter"||f=="autologintabheader"||f=="autofilltabheader"))if(f.indexOf("lpautofill")==0||f.indexOf("lpautologin")==0){var e=a.rows[c];if(typeof e.childNodes!=
"undefined"&&typeof e.childNodes.length!="undefined")for(var h=0;h<e.childNodes.length;h++)d.push(e.childNodes[h].innerText);d=d.join(" ");d=d.toLowerCase();b[f]=d}}return b},initial_sort:function(a){forEach(a.parentNode.childNodes,function(e){if(e.nodeType==1){e.className=e.className.replace("sorttable_sorted_reverse","");e.className=e.className.replace("sorttable_sorted","")}});var b=document.getElementById("sorttable_sortfwdind");b&&b.parentNode.removeChild(b);(b=document.getElementById("sorttable_sortrevind"))&&
b.parentNode.removeChild(b);a.className+=" sorttable_sorted";b=document.createElement("span");b.id="sorttable_sortfwdind";b.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':"&nbsp;&#x25BE;";a.appendChild(b);b=[];for(var c=a.sorttable_columnindex,d=a.sorttable_tbody.rows,f=0;f<d.length;f++)b[b.length]=[sorttable.getInnerText(d[f].cells[c]),d[f]];b.sort(a.sorttable_sortfunction);a=a.sorttable_tbody;for(f=0;f<b.length;f++)a.appendChild(b[f][1]);delete b}};
if(typeof navigator!="undefined")if(/WebKit/i.test(navigator.userAgent))var _timer=setInterval(function(){/loaded|complete/.test(document.readyState)&&sorttable.init()},10);if(!Array.forEach)Array.forEach=function(a,b,c){for(var d=0;d<a.length;d++)b.call(c,a[d],d,a)};Function.prototype.forEach=function(a,b,c){for(var d in a)typeof this.prototype[d]=="undefined"&&b.call(c,a[d],d,a)};String.forEach=function(a,b,c){Array.forEach(a.split(""),function(d,f){b.call(c,d,f,a)})};
var forEach=function(a,b,c){if(a){var d=Object;if(a instanceof Function)d=Function;else if(a.forEach instanceof Function){a.forEach(b,c);return}else if(typeof a=="string")d=String;else if(typeof a.length=="number")d=Array;d.forEach(a,b,c)}};
