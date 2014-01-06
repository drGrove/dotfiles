//##############################
// jQuery Custom Radio-buttons and Checkbox; basically it's styling/theming for Checkbox and Radiobutton elements in forms
// By Dharmavirsinh Jhala - dharmavir@gmail.com
// Date of Release: 13th March 10
// Version: 0.8
/*
 USAGE:
	$(document).ready(function(){
		$(":radio").behaveLikeCheckbox();
	}
*/
var elmHeight="25";jQuery.fn.extend({dgStyle:function(){$.each($(this),function(){var a=$(this).children().get(0);elmType=$(a).attr("type");$(this).data("type",elmType);$(this).data("checked",$(a).is(":checked"));$(this).dgClear()});$(this).mousedown(function(){$(this).dgEffect()});$(this).mouseup(function(){$(this).dgHandle()})},dgClear:function(){if($(this).data("checked")==true){$(this).css("backgroundPosition","0 -"+(elmHeight*2)+"px")}else{$(this).css("backgroundPosition","0 0")}},dgEffect:function(){if($(this).data("checked")==true){$(this).css({backgroundPosition:"0 -"+(elmHeight*3)+"px"})}else{$(this).css({backgroundPosition:"0 -"+(elmHeight)+"px"})}},dgHandle:function(){var a=$(this).children().get(0);if($(this).data("checked")==true){$(a).dgUncheck(this)}else{$(a).dgCheck(this)}if($(this).data("type")=="radio"){$.each($("input[name='"+$(a).attr("name")+"']"),function(){if(a!=this){$(this).dgUncheck(-1)}})}},dgCheck:function(a){$(this).attr("checked",true);$(a).data("checked",true).css({backgroundPosition:"0 -"+(elmHeight*2)+"px"})},dgUncheck:function(a){$(this).attr("checked",false);if(a!=-1){$(a).data("checked",false).css({backgroundPosition:"0 0"})}else{$(this).parent().data("checked",false).css({backgroundPosition:"0 0"})}}});