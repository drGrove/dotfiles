var
save_btn_text	= "Save Changes",
notif_icon		= "../img/icon-48.png",
notif_title		= "Options Saved",
notif_msg		= "Your options data saved. Now, you can use your own command in omnibox.",
notif_time_out	= 4000,
menu_json 		= "lib/menu.json",
append_target	= "#table_option tbody",
save_btn_id		= "#save"
saving_text		= "Saving..";

function save(menu_param){

	$save = $(save_btn_id);
	$save.attr('disabled','disabled');
	$save.attr('value',saving_text);
	
	$.each(menu_param,function(key,obj){
		localStorage[obj.id] = $('#'+obj.id).val();
	});

	$save.removeAttr('disabled');
	$save.attr('value',save_btn_text);
	
	var notification = webkitNotifications.createNotification(
  		notif_icon, 
  		notif_title,
  		notif_msg
	);
	notification.show();

	setTimeout(function(){
		notification.cancel();
	},notif_time_out);

}


$(document).ready(function(){
	
	$.getJSON(menu_json, function(menu) {

		$(append_target).html('');

		$.each(menu,function(key,obj){
			
			var
			value_opt="";

			if(localStorage[obj.id]){
				value_opt=localStorage[obj.id];
			}

			$("<tr><td><input value='"+value_opt+"' style='margin:0px;' type='text' id='"+obj.id+"' class='span2'/></td><td><code>"+obj.command+"</code></td><td>"+obj.title+"</td><td><code><a href='"+obj.url+"'>"+obj.url+"</a></code></td></tr>")
			.appendTo(append_target);
		});

	 	$(save_btn_id).click(function(){
			save(menu);
	 	});

	});	 

});

