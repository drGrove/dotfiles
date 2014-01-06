// declare package:templates.control.entry
templates=templates || {};
templates.control=templates.control || {};
templates.control.entry=templates.control.entry || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.entry;
function $A(_){var a=arguments,x;for(x=1;x<a.length;x++)_.push(a[x])}


// local function to each template class (short versions that refer to full package names)
var s3, $1, $2, $3, jsesc, x2;

try
{
	s3 = function (a) {return devhd.s3( "images/" + a )};         // img resolve
	x2 = function (a) {return devhd.x2( "images/" + a )};         // img resolve
    $1 = devhd.str.toSafeHTML;                                    // called by $( ... )
    $2 = devhd.str.toSafeAttr;                                    // called by $[ ... ]
	$3 = devhd.str.stripTags;                       			  // called by $< ... >
	jsesc = devhd.str.toJsEsc;                                    // jsesc ... needs to be killed
}
catch( ignore )
{
}


"use strict";

// common template function (private to templates)
function href (p,a) {
	return ['a ', 'href="', devhd.utils.FeedlyUtils.homeURL,'#',p ,'/',encodeURIComponent( a ),'" ',
    	          '" data-uri="', p, '/',devhd.str.toSafeAttr(a)+'"' ].join("")
}
$P.charlieRoseFrame=function(anEntry){var _=[];
$A(_,$[0],anEntry.getId(),$[1],$L(206),$[2]);
return _.join($E);
}
$P.charlieRoseVideo=function(anEntry){var _=[];
$A(_,$[3],anEntry.charlieRose.playerURL,$[4],anEntry.charlieRose.videoId,$[5]);
return _.join($E);
}
$P.huluFrame=function(anEntry){var _=[];
$A(_,$[0],anEntry.getId(),$[6],$L(206),$[2]);
return _.join($E);
}
$P.huluVideo=function(anEntry){var _=[];
$A(_,$[7],anEntry.hulu,$[8],anEntry.hulu,$[9]);
return _.join($E);
}
$P.tedFrame=function(anEntry){var _=[];
$A(_,$[10],anEntry.getId(),$[11],$L(206),$[12],$3(anEntry.getContentOrSummary()),$[13],anEntry.getId(),$[14]);
return _.join($E);
}
$P.tedVideo=function(anEntry){var _=[];
$A(_,$[15],anEntry.ted.hs,$[16],anEntry.ted.ls,$[17],anEntry.ted.vw,$[18],anEntry.ted.vh,$[19],anEntry.ted.ti,$[20],anEntry.ted.fd,$[21],anEntry.ted.pd,$[22]);
return _.join($E);
}
$P.embeddedTedVideo=function(embed, anEntry){var _=[];
$A(_,$[23],embed,$[23]);
return _.join($E);
}
$P.tedComments=function(comments){var _=[];
for( var i = 0 ; i < comments.length; i++ ){
    $A(_,$[24],$L(207,['b','a style="font-size:13px;text-decoration:none" href="http://www.ted.com/'+comments[i].profileLink+'"'],
						comments[i].userName),$[25],devhd.str.stripTags( comments[i].text ).replace("\n","<br/>"),$[26],comments[i].date,$[27]);
}
return _.join($E);
}
$P.dailyShow=function(anEntry){var _=[];
$A(_,$[0],anEntry.getId(),$[28],anEntry.dailyShow,$[29]);
return _.join($E);
}
$P.youtube=function(anEntry){var _=[];
$A(_,$[30],anEntry.metadata.youtube,$[31]);
return _.join($E);
}
$P.vimeo=function(anEntry){var _=[];
$A(_,$[32],anEntry.metadata.vimeo,$[33]);
return _.join($E);
}
$P.collegeHumor=function(anEntry){var _=[];
$A(_,$[34],anEntry.collegeHumor,$[35]);
return _.join($E);
}
$P.toolsPopup=function(entryId, selection, home){var _=[];
$A(_,$[36]);
if( selection.length > 0 ){
    $A(_,$[37],$L(208,selection.length),$[38]);
}else{
    $A(_,$[37],$L(209),$[38]);
}
$A(_,$[39],encodeURIComponent( selection ),$[40],$L(210),$[41],$L(211),$[42]);
return _.join($E);
}
$=[
" \n<center> \n<table id=\"","_cr\" width=\"460\" height=\"360\" cellpadding=0 cellspacing=0 style=\"border: 1px solid #DFDFDF; color: #909090\"> \n<tr> \n<td valign=\"middle\"> \n<center style=\"color:#909090\">","</center> \n</td> \n</tr> \n</table> \n</center> \n"," \n<embed width=\"460\" height=\"360\" type=\"application/x-shockwave-flash\" \nwmode=\"transparent\" src=\"","\" \nbgcolor=\"#000000\" quality=\"high\" flashvars=\"","&amp;preRollPath=\"/> \n","_hu\" width=\"577\" height=\"293\" cellpadding=0 cellspacing=0 style=\"border: 1px solid #DFDFDF; color: #909090\"> \n<tr> \n<td valign=\"middle\"> \n<center style=\"color:#909090\">"," \n<object width=\"577\" height=\"293\"> \n<param name=\"movie\" value=\"",
"\"></param> \n<param name=\"allowFullScreen\" value=\"true\"></param> \n<param name=\"wmode\" value=\"transparent\"> \n<embed src=\"","\" type=\"application/x-shockwave-flash\" allowFullScreen=\"true\" width=\"700\" height=\"350\"> \n</embed> \n</object> \n"," \n<center id=\"","_ted\"> \n<table width=\"100%\" height=\"490\" cellpadding=0 cellspacing=0 style=\"border: 1px solid #DFDFDF; color: #909090\"> \n<tr> \n<td valign=\"middle\"> \n<center style=\"color:#909090\">","</center> \n</td> \n</tr> \n</table> \n</center> \n<br/> \n"," \n<div id=\"","_ted_comments\"></div> \n"," \n<embed width=\"100%\" height=\"490\" align=\"left\" \nflashvars=\"fms=streaming.ted.com&amp;hs=",
"&amp;ls=","&amp;vw=","&amp;vh=","&amp;ti=","&amp;sh=http://www.ted.com&amp;fd=","&amp;pd=","\" \nallowscriptaccess=\"always\" \nallowfullscreen=\"true\" \nscale=\"noscale\" \nwmode=\"opaque\" \nquality=\"high\" \nbgcolor=\"#ffffff\" \nname=\"streamingPlayerSWF\" \nid=\"streamingPlayerSWF\" \nstyle=\"\" \nsrc=\"http://video.ted.com/assets/player/swf/StreamingPlayer.swf\" \ntype=\"application/x-shockwave-flash\" \n/> \n"," \n",
" <div style=\"margin-top: 17px; font-size: 13px; line-height:17px\"> \n<b class=\"commenterName\"> \n"," <br/> \n<div class=\"rss2comment\"> \n"," \n</div> \n<span style=\"color:#909090; font-size: 12px\">","</span> \n</div> \n","_cr\" width=\"488\" height=\"389\" cellpadding=0 cellspacing=0 style=\"border: 1px solid #DFDFDF; color: #909090\"> \n<tr> \n<td valign=\"middle\"> \n<object width=\"488\" \nheight=\"389\" \ndata=\"http://entertainment.mtvnservices.com/media/mgid:cms:video:thedailyshow.com:","\" \ntype=\"application/x-shockwave-flash\"> \n<param name=\"wmode\" value=\"transparent\"> \n<param value=\"#FFFFFF\" name=\"bgcolor\" /> \n<param value=\"true\" name=\"seamlesstabbing\" /> \n<param value=\"true\" name=\"swfliveconnect\" /> \n<param value=\"always\" name=\"allowscriptaccess\"/> \n<param value=\"all\" name=\"allownetworking\" /> \n<param value=\"true\" name=\"allowfullscreen\" /> \n<param value=\"autoplay=true&amp;\" name=\"flashvars\" /> \n</object> \n</td> \n</tr> \n</table> \n</center> \n"," \n<iframe data-clean=\"yes\" style=\"margin-left:-33px; margin-right:-33px\" width=\"644\" height=\"362\" src=\"//www.youtube.com/embed/","?hd=1&showinfo=0&autoplay=0\" frameborder=\"0\" allowfullscreen></iframe> \n",
" \n<iframe data-clean=\"yes\" style=\"margin-left:-33px; margin-right:-33px\" width=\"644\" height=\"362\" src=\"//player.vimeo.com/video/","?hd=1&showinfo=0&autoplay=0\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe> \n"," \n<center> \n<iframe src=\"http://www.collegehumor.com/e/","\" width=\"600\" height=\"369\" frameborder=\"0\" webkitAllowFullScreen allowFullScreen></iframe> \n</center> \n"," \n<div class=\"popup\" alt=\"Annotate with this selection\" style=\"line-height:19px; width: 150px\"> \n"," <div id=\"tp_tweet\" class=\"action\">","</div> \n"," <a class=\"action\" style=\"display:block\" href=\"http://www.google.com/search?q=",
"\" target=\"new\">","</a> \n<div id=\"tp_translate\" class=\"action\">","</div> \n</div> \n"]
})();
// strings=43 characters=3413
