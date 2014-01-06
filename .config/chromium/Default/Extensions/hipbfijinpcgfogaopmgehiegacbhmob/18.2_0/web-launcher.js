// LAZY LOADER
var BACKEND = "//feedly.com";
if( new String( document.location ).indexOf( "sandbox.feedly.com" ) > -1 )
	BACKEND = "//sandbox.feedly.com";

function bindEvent(el, eventName, eventHandler, b) {
  if (el.addEventListener){
    el.addEventListener(eventName, eventHandler, b); 
  } else if (el.attachEvent){
    el.attachEvent('on'+eventName, eventHandler);
  }
}

function createCustomEvent( type, payload )
{
	var evt = document.createEvent( "CustomEvent" );
    evt.initCustomEvent( type, false, false, payload );
    return evt;
}

var streets = null;
var _gaq = _gaq || [];
var boxElem;

window.onload = function()
{
	boxElem = document.getElementById( "box" );
	
	bindEvent( boxElem, "gaEvent", 					processAnalyticsData, 				false );	
	bindEvent( boxElem, "googleDecorateEvent", 		processGoogleDecorateEvent, 		false );	
	bindEvent( boxElem, "googlePlusDecorateEvent", 	processGooglePlusDecorateEvent, 	false );	

	// IE does not seem to have support for default view
	if( document.defaultView == null )
		document.defaultView = window;

	// load and initialize the streets bus
	streets = devhd.streets.create();
	streets.attachDocument( document );
	streets.setMode( "cloud" );
	streets.setEnvironment( "web" );
	streets.load( coreStreets );
	streets.load( feedlyStreets );

	streets.onAfterIdentitySync = function(){
		streets.service( "feedly" ).loadStartPage();
	};

	streets.askSyncIdentity( "initial boot" ); // non-i18n
	
	
	// Delaying the loading of Google Analytics and Twitter to make sure that those two scripts do not impact the feedly load experience.
	// Specially the twitter experience!

	window.setTimeout( function(){
		// GOOGLLE ANALYTICS BRIDGE
	  	(function() {
	    	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  	})();
	
		// GOOGLE PLUS BRIDGE
	  	(function() {
	    	var po = document.createElement('script'); 
			po.type = 'text/javascript'; 
			po.async = true; 
	    	po.src = 'https://apis.google.com/js/plusone.js';

	    	var s = document.getElementsByTagName('script')[0]; 
			s.parentNode.insertBefore(po, s);
	  	})();		
	},
	100
	);	
};

window.onbeforeunload = function()
{
	// load and initialize the streets bus
	streets.askShutdown();
};

function reloadFeedly( message )
{
};

var oauthWindow = null;
var oauthReason = "n/a";

bindEvent( window, "message", function( e ) {
		
	if( e.origin != "http://feedly.com" && e.origin != "https://feedly.com" && e.origin != "http://cloud.feedly.com" && e.origin != "http://sandbox.feedly.com" && e.origin != "https://cloud.feedly.com" && e.origin != "https://sandbox.feedly.com" )
		return;
				
	var response = e.data;
		
	if( response.indexOf( "eventType=feedly" ) > -1 )
	{
		var index = response.indexOf( "code=" );

		if( index > -1 )
		{
			var code = response.slice( index + "code=".length );
			var end = code.indexOf( "&" );
			
			if( end > -1 )
				code = code.slice( 0, end );
			
			streets.service( "analytics" ).trackPageview( oauthReason + ".done" ); 
		
			streets.service( "feedly" ).askLogin( code );
		}
		
		if( oauthWindow != null )
		{
			oauthWindow.close();
			oauthWindow = null;
		}
	}
	else if( response.indexOf( "eventType=evernote" ) > -1 )
	{
		var index = response.indexOf( "error=" );

		if( index == -1 )
		{
			// we need to ask the evernote popup to refresh itself
			
		}
		
		if( oauthWindow != null )
		{
			oauthWindow.close();
			oauthWindow = null;
		}
	}
	else if( response.indexOf( "eventType=pocket" ) > -1 )
	{
		var index = response.indexOf( "error=" );

		if( index == -1 )
			streets.service( "feedly" ).doPocketTargetEntry();
		
		if( oauthWindow != null )
		{
			oauthWindow.close();
			oauthWindow = null;
		}
	}
}, 
false
);

function askLoginEvernote()
{	
	var redirect = "http://feedly.com/evernote.html";
	var currentLocation = new String( document.location );
	
	if( currentLocation.indexOf( "https" ) == 0 )
		redirect = "https://feedly.com/evernote.html";
	
	if( currentLocation.indexOf( "http://sandbox.feedly.com" ) == 0 )
	{
		redirect = "http://sandbox.feedly.com/evernote.html";
	}
	else if( currentLocation.indexOf( "https://sandbox.feedly.com" ) == 0 )
	{
		redirect = "https://sandbox.feedly.com/evernote.html";
	};
	
	var oauthURL = 	BACKEND + "/v3/evernote/auth?"
		  			+ "redirectUri=" + encodeURIComponent( redirect )
		  			+ "&feedlyToken=" + devhd.utils.SessionUtils.load().feedlyToken;
	
	var DD=850, AA=680, CC=screen.height, BB=screen.width, HH=Math.round((BB/2)-(DD/2)), GG=100;
	if( CC/2>AA )
		GG=Math.round(CC/2-AA);
	
	oauthWindow = window.open( oauthURL, "Evernote", 'left=' + HH + ',top=' + GG + ',width=850,height=680,personalbar=0,toolbar=0,scrollbars=1,resizable=1' );

	if( oauthWindow == null )
	{
		showBlockerSign();
		return;
	}

	if( oauthWindow.focus )
		oauthWindow.focus();
}

function showBlockerSign()
{
	try
	{
		streets.service( "signs" ).setNextAutoHideDelay ( 5000 );
		streets.service( "signs" ).setMessage( "Please disable popup blocker and retry." );
	}
	catch( e )
	{
		window.alert( "Please disable popup blocker" );
	}
}

function askLoginPocket()
{	
	var redirect = "http://feedly.com/pocket.html";
	var currentLocation = new String( document.location );
	
	if( currentLocation.indexOf( "https" ) == 0 )
		redirect = "https://feedly.com/pocket.html";
	
	if( currentLocation.indexOf( "http://sandbox.feedly.com" ) == 0 )
	{
		redirect = "http://sandbox.feedly.com/pocket.html";
	}
	else if( currentLocation.indexOf( "https://sandbox.feedly.com" ) == 0 )
	{
		redirect = "https://sandbox.feedly.com/pocket.html";
	};
	
	var oauthURL = 	BACKEND + "/v3/pocket/auth?"
		  			+ "redirectUri=" + encodeURIComponent( redirect )
		  			+ "&feedlyToken=" + devhd.utils.SessionUtils.load().feedlyToken;
	
	var DD=960, AA=600, CC=screen.height, BB=screen.width, HH=Math.round((BB/2)-(DD/2)), GG=100;
	if( CC/2>AA )
		GG=Math.round(CC/2-AA);
	
	oauthWindow = window.open( oauthURL, "Pocket", 'left=' + HH + ',top=' + GG + ',width=960,height=600,personalbar=0,toolbar=0,scrollbars=1,resizable=1' );

	if( oauthWindow == null )
	{
		showBlockerSign();
		return;
	}

	if( oauthWindow.focus )
		oauthWindow.focus();
}

function askLoginFeedly()
{
	try
	{
		streets.service( "analytics" ).trackPageview( "login" ); 
		oauthReason = "login";
		startOAuth();
	}
	catch( e )
	{
		$feedly( "FAILED TO ASK LOGIN:" + e.name + " -- " + e.message );
	}
}

function askSignupFeedly()
{
	try
	{
		streets.service( "analytics" ).trackPageview( "signup" ); 
		oauthReason = "signup";
		startOAuth();
	}
	catch( e )
	{
		$feedly( "FAILED TO ASK SIGNUP:" + e.name + " -- " + e.message );
	}
}

function startOAuth()
{	
	var redirect = "http://feedly.com/feedly.html";
	var currentLocation = new String( document.location );
	
	if( currentLocation.indexOf( "https" ) == 0 )
		redirect = "https://feedly.com/feedly.html";
	
	if( currentLocation.indexOf( "http://sandbox.feedly.com" ) == 0 )
	{
		redirect = "http://sandbox.feedly.com/feedly.html";
	}
	else if( currentLocation.indexOf( "https://sandbox.feedly.com" ) == 0 )
	{
		redirect = "https://sandbox.feedly.com/feedly.html";
	};
	
	var oauthURL = 	BACKEND + "/v3/auth/auth"
		  			+ "?client_id=feedly"
		  			+ "&redirect_uri=" + encodeURIComponent( redirect )
		  			+ "&scope=" + encodeURIComponent( "https://cloud.feedly.com/subscriptions" )
		  			+ "&response_type=code"
		  			+ "&provider=google"
		  			+ "&migrate=false"
		  			+ "&ck=" + new Date().getTime() 
		  			+ "&ct=feedly.desktop" 
		  			+ "&cv=" + feedlyApplicationVersion;

	var DD=480, AA=680, CC=screen.height, BB=screen.width, HH=Math.round((BB/2)-(DD/2)), GG=100;
	if( CC/2>AA )
		GG=Math.round(CC/2-AA);
	
	oauthWindow = window.open( oauthURL, "Feedly Cloud", 'left=' + HH + ',top=' + GG + ',width=480,height=680,personalbar=0,toolbar=0,scrollbars=1,resizable=1' );

	if( oauthWindow == null )
	{
		showBlockerSign();
		return;
	}

	if( oauthWindow.focus )
		oauthWindow.focus();
}

function askLoginFeedlyForOPML()
{	
	streets.service( "analytics" ).trackPageview( "signup.opml" ); 
	oauthReason = "signup.opml";

	var redirect = "http://feedly.com/feedly.html";
	var currentLocation = new String( document.location );
	
	if( currentLocation.indexOf( "https" ) == 0 )
		redirect = "https://feedly.com/feedly.html";
	
	if( currentLocation.indexOf( "http://sandbox.feedly.com" ) == 0 )
	{
		redirect = "http://sandbox.feedly.com/feedly.html";
	}
	else if( currentLocation.indexOf( "https://sandbox.feedly.com" ) == 0 )
	{
		redirect = "https://sandbox.feedly.com/feedly.html";
	};
	
	var oauthURL = 	BACKEND + "/v3/auth/auth"
		  			+ "?client_id=feedly"
		  			+ "&redirect_uri=" + encodeURIComponent( redirect )
		  			+ "&scope=" + encodeURIComponent( "https://cloud.feedly.com/subscriptions" )
		  			+ "&response_type=code"
		  			+ "&migrate=false"
					+ "&ck=" + new Date().getTime() 
		  			+ "&ct=feedly.desktop" 
					+ "&cv=" + feedlyApplicationVersion;

	var DD=480, AA=680, CC=screen.height, BB=screen.width, HH=Math.round((BB/2)-(DD/2)), GG=100;
	if( CC/2>AA )
		GG=Math.round(CC/2-AA);
	
	var oauthWindow = window.open( oauthURL, "Feedly Cloud", 'left=' + HH + ',top=' + GG + ',width=480,height=680,personalbar=0,toolbar=0,scrollbars=1,resizable=1' );

	if( oauthWindow == null )
	{
		showBlockerSign();
		return;
	}

	if( oauthWindow.focus )
		oauthWindow.focus();
}

function askGmailPopup( event )
{
	try
	{
		devhd.events.cancelEvent( event );

		var id = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-id" );
		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var postfix = event.target.getAttribute( "data-postfix" ) || event.target.parentNode.getAttribute( "data-postfix" ) || "";
		var longURL = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";

		if( id == null )
			return;
		
		var DD=700,AA=500,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open( "about:blank",
							  		"",
							  		"left=" + HH + ",top=" + GG + ",width=700,height=500,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
							  		);

		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();

		streets.service( "reader" ).askEntryShortLink( 	id, 
														function( info )
														{
															var url = ( info == null || info.shortUrl == null ) ? longURL : info.shortUrl;
															shareWin.location = "http://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=" + encodeURIComponent( title + " [feedly]" ) + "&body=\n\n" + encodeURIComponent( title + "\n" + url + "\n\n--\n via my feedly.com reader" );
														},
														function( code, message )
														{
															shareWin.location = "http://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=" + encodeURIComponent( title + " [feedly]" ) + "&body=" + encodeURIComponent( title + "\n" + longURL + "\n\nvia http://www.feedly.com" );
														}
														);
		
		streets.service( "analytics" ).trackEvent( "sharing", "gmail" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup gmail:" + e.name + " -- " + e.message );
	}
}

function askGooglePlusPopup( event )
{
	try
	{
		devhd.events.cancelEvent( event );

		var id = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-id" );
		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var postfix = event.target.getAttribute( "data-postfix" ) || event.target.parentNode.getAttribute( "data-postfix" ) || "";
		var longURL = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";

		if( id == null )
			return;
		
		var DD=600,AA=600,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open( "about:blank",
							  		"",
							  		"left=" + HH + ",top=" + GG + ",width=600,height=600,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
							  		);

		if( shareWin == null )
			return showBlockerSign();

		shareWin.focus();

		streets.service( "reader" ).askEntryShortLink( 	id, 
														function( info )
														{
															var url = ( info == null || info.shortUrl == null ) ? longURL : info.shortUrl;
															shareWin.location = "https://plus.google.com/share?url=" + encodeURIComponent( url );
														},
														function( code, message )
														{
															shareWin.location = "https://plus.google.com/share?url=" + encodeURIComponent( longURL );
														}
														);
		
		streets.service( "analytics" ).trackEvent( "sharing", "gplus" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup gplus:" + e.name + " -- " + e.message );
	}
}

function askTweetPopup( event )
{
	try
	{
		devhd.events.cancelEvent( event );

		var id = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-id" );
		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var postfix = event.target.getAttribute( "data-postfix" ) || event.target.parentNode.getAttribute( "data-postfix" ) || "";
		var longURL = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";

		if( id == null )
			return;
		
		var DD=550,AA=286,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open( "about:blank",
							  		"",
							  		"left=" + HH + ",top=" + GG + ",width=550,height=286,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
							  		);

		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();

		streets.service( "reader" ).askEntryShortLink( 	id, 
														function( info )
														{
															var url = ( info == null || info.shortUrl == null ) ? longURL : info.shortUrl;
															shareWin.location = "http://twitter.com/share?via=feedly&related=feedly&text="+ encodeURIComponent( title + postfix ) + "&url=" + encodeURIComponent( url ) + "&_=" + new Date().getTime();
														},
														function( code, message )
														{
															shareWin.location = "http://twitter.com/share?via=feedly&related=feedly&text="+ encodeURIComponent( title + postfix ) + "&url=" + encodeURIComponent( longURL ) + "&_=" + new Date().getTime();
														}
														);
		
		streets.service( "analytics" ).trackEvent( "sharing", "tweet" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup tweetsheet:" + e.name + " -- " + e.message );
	}
}



function askFacebookPopup( event )
{
	try
	{
		devhd.events.cancelEvent( event );

		var id = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-id" );
		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var postfix = event.target.getAttribute( "data-postfix" ) || event.target.parentNode.getAttribute( "data-postfix" ) || "";
		var longURL = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";

		if( id == null )
			return;
		
		var DD=550,AA=286,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));
		
		var DD=550,AA=450,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open(	"about:blank",
									"",
									"left=" + HH + ",top=" + GG + ",width=550,height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
									);
		
		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();

		streets.service( "reader" ).askEntryShortLink( 	id, 
														function( info )
														{
															var url = ( info == null || info.shortUrl == null ) ? longURL : info.shortUrl;
															shareWin.location = "http://www.facebook.com/share.php?src=bm&v=4&i=1289025326&et="+ encodeURIComponent( title + postfix ) + "&u=" + encodeURIComponent( url ) + "&_=" + new Date().getTime();
														},
														function( code, message )
														{
															shareWin.location = "http://www.facebook.com/share.php?src=bm&v=4&i=1289025326&et="+ encodeURIComponent( title + postfix ) + "&u=" + encodeURIComponent( longURL ) + "&_=" + new Date().getTime();
														}
														);

		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();
				
		streets.service( "analytics" ).trackEvent( "sharing", "facebook" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup tweetsheet:" + e.name + " -- " + e.message );
	}
}

function askCustomSharingPopupWithFeedlyShortener( event )
{
	try
	{
		devhd.events.cancelEvent( event );
		
		var pro = streets.isProPlan();
		
		if( pro != true )
		{
			streets.service( "feedly" ).redirect( "pro/sharing" );
			return;
		};
		
		var customSharing = streets.service( "preferences" ).getPreference( "customSharing" );
		if( customSharing == null || customSharing == "" )
		{
			streets.service( "feedly" ).loadPage( "preferences/sharing" );
			return;
		}	
		
		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var id = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-id" ) || "";
		var source = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-source" ) || "";
		var postfix = event.target.getAttribute( "data-postfix" ) || event.target.parentNode.getAttribute( "data-postfix" ) || "";
		var longURL = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";
						
		var DD=550,AA=750,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open(	"about:blank",
									"",
									"left=" + HH + ",top=" + GG + ",width=550,height=750,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
									);
						
		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();

		shareWin.location = customSharing.replace( "${id}", encodeURIComponent( id ), "gi" )
										 .replace( "${url}", encodeURIComponent( longURL ), "gi" )
										 .replace( "${source}", encodeURIComponent( source ), "gi" )
										 .replace( "${title}", encodeURIComponent( title ), "gi" )
										 .replace( "${userId}", encodeURIComponent( streets.getUserId() ), "gi" );;
		
										 
		streets.service( "analytics" ).trackEvent( "sharing", "custom" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup tweetsheet:" + e.name + " -- " + e.message );
	}
}


function askCustomSharingPopup( event )
{
	try
	{
		devhd.events.cancelEvent( event );
		
		var pro = streets.isProPlan();
		
		if( pro != true )
		{
			streets.service( "feedly" ).redirect( "pro/sharing" );
			return;
		};
		
		var customSharing = streets.service( "preferences" ).getPreference( "customSharing" );
		if( customSharing == null || customSharing == "" )
		{
			streets.service( "feedly" ).loadPage( "preferences/sharing" );
			return;
		}	
		
		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var id = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-id" ) || "";
		var source = event.target.getAttribute( "data-id" ) || event.target.parentNode.getAttribute( "data-source" ) || "";
		var postfix = event.target.getAttribute( "data-postfix" ) || event.target.parentNode.getAttribute( "data-postfix" ) || "";
		var longURL = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";
						
		var DD=550,AA=750,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open(	"about:blank",
									"",
									"left=" + HH + ",top=" + GG + ",width=550,height=750,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
									);
						
		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();

		var popupURL = customSharing.replace( "${id}", encodeURIComponent( id ), "gi" )
									.replace( "${url}", encodeURIComponent( longURL ), "gi" )
									.replace( "${source}", encodeURIComponent( source ), "gi" )
									.replace( "${title}", encodeURIComponent( title ), "gi" );

		shareWin.location = popupURL;
		
		streets.service( "analytics" ).trackEvent( "sharing", "custom" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup tweetsheet:" + e.name + " -- " + e.message );
	}
}

function askPocketPopup( event )
{
	try
	{
		devhd.events.cancelEvent( event );

		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var url = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";
		
		var DD=550,AA=320,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open( "https://getpocket.com/save?url=" + encodeURIComponent( url ) + "&title="+ encodeURIComponent( title ) + "&_=" + new Date().getTime(),
									"",
									"left=" + HH + ",top=" + GG + ",width=550,height=320,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
									);
		
		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();
		
		streets.service( "analytics" ).trackEvent( "sharing", "pocket" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup pocketsheet:" + e.name + " -- " + e.message );
	}
}

function askInstapaperPopup( event )
{
	try
	{
		devhd.events.cancelEvent( event );

		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var url = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";
		
		var DD=550,AA=320,CC=screen.height,BB=screen.width,HH=Math.round((BB/2)-(DD/2)),GG=0;
		if( CC>AA )
			 GG=Math.round((CC/2)-(AA/2));

		var shareWin = window.open( "http://www.instapaper.com/edit?url=" + encodeURIComponent( url ) + "&title="+ encodeURIComponent( title ) + "&_=" + new Date().getTime(),
									"",
									"left=" + HH + ",top=" + GG + ",width=550,height=320,personalbar=0,toolbar=0,scrollbars=1,resizable=1"
									);
		
		if( shareWin == null )
		{
			return showBlockerSign();
		}

		shareWin.focus();
		
		streets.service( "analytics" ).trackEvent( "sharing", "instapaper" );
	}
	catch( e )
	{
		$feedly( "[web] failed to popup pocketsheet:" + e.name + " -- " + e.message );
	}
}

function askRedefShare( event )
{
	try
	{
		devhd.events.cancelEvent( event );

		var title = event.target.getAttribute( "data-title" ) || event.target.parentNode.getAttribute( "data-title" ) || "";
		var url = event.target.getAttribute( "data-url" ) || event.target.parentNode.getAttribute( "data-url" ) || "";
		var id = event.target.getAttribute( "data-entryId" ) || event.target.parentNode.getAttribute( "data-entryId" ) || "";
		
		if( preferences.getPreference( "customizationKey" ) == "REDEFSTAGE" )
		{
			streets.service( "io" ).post( "http://stage.redef.co/add/feedly/?id=" + encodeURIComponent( id ) + "&url=" + encodeURIComponent( url ) + "&title=" + encodeURIComponent( title ) + "&userId=" + encodeURIComponent( streets.getUserId() ) );
		}
		else
		{
			streets.service( "io" ).post( "http://redef.co/add/feedly/?id=" + encodeURIComponent( id ) + "&url=" + encodeURIComponent( url ) + "&title=" + encodeURIComponent( title ) + "&userId=" + encodeURIComponent( streets.getUserId() ) );
		}
		
		streets.service( "analytics" ).trackEvent( "sharing", "redef" );
		
		event.target.style.opacity = 1;
	}
	catch( e )
	{
		$feedly( "[web] failed to share with REDEF:" + e.name + " -- " + e.message );
	}

}


///////////////////
// GOOGLE        // 
///////////////////
function processGoogleDecorateEvent()
{
	var loginWithGoogleElem = document.getElementById( "loginWithGoogle" );
	if( loginWithGoogleElem != null )
	{
		var decorated = loginWithGoogleElem.getAttribute( "data-decorated" );
		
		if( decorated == "yes" )
			return;
		
		loginWithGoogleElem.setAttribute( "data-decorated", "yes" );
		
		loginWithGoogle.onclick = function(){
			try
			{
				askLoginWithGoogle();
			}
			catch( e )
			{
				// ignore
			}
			return false;
		};
	};
}

///////////////////
// GOOGLE PLUS   //
///////////////////
		
function processGooglePlusDecorateEvent()
{
	window.setTimeout( doDecorateGooglePlusButtons, 750 );
}

function doDecorateGooglePlusButtons()	
{
	var pluses = document.getElementsByClassName( "gplus" );
	for( var i = 0; i < pluses.length; i++ )
		decorateGooglePlusButton( pluses[ i ] );
}		

function decorateGooglePlusButton( elem )
{
	if( elem.getAttribute( "data-google-plus-decorated" ) == "yes" )
		return;
	
	try
	{
		elem.setAttribute( "data-google-plus-decorated", "yes" );
		
		gapi.plusone.render(elem, 
						{ 	
							annotation: "none", 
							size: "tall", 
							source: "feedly",
							recommendations: false,
							href: elem.getAttribute( "data-href" ), 
							callback: function( info ){
								
								boxElem.setAttribute( "googlePlusLikeEventOptions", JSON.stringify( { "data-entryId": elem.getAttribute( "data-entryId" ), "data-state" : info.state } ) );

								var googlePlusEvent = document.createEvent( "Event" );
								googlePlusEvent.initEvent( "googlePlusLikeEvent", true, true );
								boxElem.dispatchEvent( googlePlusEvent );
							} 
						} 
						);
										
		elem.parentNode.parentNode.style.visibility = "visible";
	}
	catch( e )
	{
		$feedly( "failed to decorate:" + elem.getAttribute( "data-entryId" ) );
	}
}		

///////////////////
//GOOGLE PLUS   //
///////////////////

function processAnalyticsData()
{
	try
	{
		try
		{
			// Singleton events
			var gaOnce = boxElem.getAttribute( "data-ga-once" );
			
			// The client only want to send this event once in the lifetime of this browser
			if( gaOnce != null )
			{
				var val = window.localStorage.getItem( gaOnce );
				
				// there is a marker - this event has already been fired. cancel.
				if( val == "fired" )
					return;
				
				// assign marker so that this even it no longer fired in the future.
				window.localStorage.setItem( gaOnce, "fired" );
			}
		}
		catch( ignore )
		{
			
		}
		
		var gaData = boxElem.getAttribute( "data-ga" );

		if( gaData == null )
			return;

  		var gaCommand = JSON.parse( gaData );
		_gaq.push( gaCommand );

		boxElem.removeAttribute( "data-ga" );	
	}
	catch( err )
	{
		
	}
}

// Polyfill for the request animation frame.
//
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
