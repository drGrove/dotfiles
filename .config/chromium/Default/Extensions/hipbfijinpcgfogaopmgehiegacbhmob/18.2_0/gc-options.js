// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
  var httpsSelect = document.getElementById("https");
  var https = httpsSelect.children[httpsSelect.selectedIndex].value;
  localStorage[ "https" ] = https;

  var betaSelect = document.getElementById("beta");
  var beta = betaSelect.children[betaSelect.selectedIndex].value;
  localStorage[ "beta" ] = beta;

  // Update status to let user know options were saved.
  var status = document.getElementById( "status" );
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var https = localStorage[ "https" ];
  if( https != null )
  {
	  var httpsSelect = document.getElementById( "https" );
	  for (var i = 0; i < httpsSelect.children.length; i++) 
	  {
	    var child = httpsSelect.children[i];
	    if( child.value == https ) 
	    {
	      child.selected = "true";
	      break;
	    }
	  }
  }

  var beta = localStorage[ "beta" ];
  if( beta != null )
  {
	  var betaSelect = document.getElementById( "beta" );
	  for (var i = 0; i < betaSelect.children.length; i++) 
	  {
	    var child = betaSelect.children[i];
	    if( child.value == beta ) 
	    {
	      child.selected = "true";
	      break;
	    }
	  }
  }
  
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
