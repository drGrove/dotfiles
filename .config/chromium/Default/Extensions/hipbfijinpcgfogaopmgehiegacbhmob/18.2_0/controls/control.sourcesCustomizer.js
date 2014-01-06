"use strict";


(function () {

	var pkg = devhd.pkg("control");

	var BaseControl = devhd.control.BaseControl.prototype
	var SourcesCustomizerControl = pkg.createClass("SourcesCustomizerControl", pkg.BaseControl)

	SourcesCustomizerControl.setPreferences = function( p )
	{
		this.preferences = p;
	}

	SourcesCustomizerControl.setPageInfo = function( pi )
	{
		this.pageInfo = pi;
	}

	SourcesCustomizerControl.destroy = function()
	{
		this.preferences = null;

		BaseControl.destroy.call( this );
	}

	//////// CONTROL CONTRACT /////////////////////////////////////////////////
	SourcesCustomizerControl.display = function()
	{
		this.part.innerHTML = templates.control.sourcesCustomizer.layout( this.home );

		this.bind( 	this.element( "sourcesMustReadsOnlyToggle" ),
					"click",
					SourcesCustomizerControl.onToggleMustReadsOnlyFilter
					);

		var that = this;
		this.preferences.askPreference( "sourcesMustReadsOnlyFilter", function( sourcesMustReadsOnlyFilter ){
			that.element( "sourcesMustReadsOnlyCheck" ).src = sourcesMustReadsOnlyFilter == "on" 
																	? devhd.s3( "images/customizer-checkbox-checked.png" ) 
																	: devhd.s3( "images/customizer-checkbox-unchecked.png" );
		});
	}

	//////// INTERNAL IMPLEMENTATION //////////////////////////////////////////

	SourcesCustomizerControl.onToggleMustReadsOnlyFilter = function()
	{
		var that = this;
		this.preferences.askPreference( "sourcesMustReadsOnlyFilter", function( sourcesMustReadsOnlyFilter ){
			if( sourcesMustReadsOnlyFilter == "on" )
				that.preferences.askSetPreference( "sourcesMustReadsOnlyFilter", "off" );
			else
				that.preferences.askSetPreference( "sourcesMustReadsOnlyFilter", "on" );
		});
	}
}) ();


