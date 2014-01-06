/*
 * Preferences functions
 */  
function getPref(name){
    var value = localStorage[name];
    
    return value;
}
function setPref(name,value){
    localStorage[name] = value;
}
