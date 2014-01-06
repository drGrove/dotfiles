$(document).ready(function(){

	var
	menu_default_json 	= "lib/menu.json";

	$.getJSON(menu_default_json, function(menu) {

		$('#table_help tbody').html('');

		$.each(menu,function(key,obj){
			$("<tr><td><code>"+obj.command+"</code></td><td>"+obj.title+"</td><td><code><a href='"+obj.url+"'>"+obj.url+"</a></code></td></tr>").appendTo('#table_help tbody');
		});

	});

});