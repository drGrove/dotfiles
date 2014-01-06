	var
	structure_cmenu,
	parent,
	contexts_arr		= ["all"],
	menu_default_json 	= "lib/menu.json",
	index_page 			= "../docs/index.html",
	me_ava 				= "../img/ava-me.png",
	me_name 			= "Titis Kaifa",
	me_notif_about		= "This app was made from my need. Hope you enjoy it. Don't hesitate to contact me at sutisna.kaifa@gmail.com"
	notif_icon			= "../img/icon-48.png",
	notif_title			= "Command Not Found",
	notif_body			= 'Write "bt help" in omnibox for command references.',
	contextmenu_title	= "Bootstrap Offline Docs",
	notif_time_out		= 5000;


	//For redirect to page when click contextmenu
	function redirect_page(info){
		
		$.each(structure_cmenu,function(e,obj){
			
			if(obj.id==info.menuItemId && obj.cmenu && obj.cmenu=="true"){
				chrome.tabs.create({
		 			url: obj.url
				});
			}
			
		});
			
	}


	//Load json data for contextmenu
	$.getJSON(menu_default_json, function(data) {
		   
		   structure_cmenu = data;

		    //Contextmenu create for parent
			parent = chrome.contextMenus.create({"title": contextmenu_title});
			
			//Create childrens
			$.each(data,function(e,obj){
				if(obj.cmenu && obj.cmenu=="true"){
					chrome.contextMenus.create({
							"title": obj.title, 
							"parentId": parent, 
							"id":obj.id, 
							"contexts":contexts_arr,  
							"onclick": redirect_page 
					});
				}
				
			});
	});


	//Browser action, icon in corner 
	chrome.browserAction.onClicked.addListener(function(tab) {
		 
		 chrome.tabs.create({
		 	url: index_page
		 });
		 
	});


	//When omniboc entered with key
	chrome.omnibox.onInputEntered.addListener(function(text) {
	    
	    $.getJSON(menu_default_json, function(data) {
	        
	        var
	        found=0,keyword,url,type_command;

	        $.each(data,function(index,object){
	            if(text==object.command || (localStorage[object.id] && text==localStorage[object.id])){
	        		found=1;
	        		if(object.url){
	        			url=object.url;
	        		}
	        		type_command=object.type;
	        	}
	        });

	        if(found){
	        	
	        	if(type_command=="NOTIF_ABOUT"){
	        		
	        		var notification_about = webkitNotifications.createNotification(
				  		me_ava,
				  		me_name,
				  		me_notif_about
					);
					notification_about.show();

	        	} else {

	        		chrome.tabs.update({
	            		url: url
	       			});

	        	}

	        } else {

	        	var notification = webkitNotifications.createNotification(
			  		notif_icon,
			  		notif_title,
			  		notif_body
				);

				notification.show();

				setTimeout(function(){
					notification.cancel();
				},notif_time_out);

	        }
			
			
	     });

	});