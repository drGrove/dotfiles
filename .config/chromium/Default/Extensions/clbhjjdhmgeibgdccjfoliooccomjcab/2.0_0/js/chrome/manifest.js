/**
 * manifest: loads manifest.json objects and puts it among other chrome.* apis
 * example  in: chrome.manifest.version
 *         out: "0.1.0"
 *          in: chrome.manifest.default_locale
 *         out: "en"
 * 
 * author: Martin Sikora (http://www.martinsikora.com)
 * licence: MIT
 * 
 */

chrome.manifest = (function() {
    
    var manifestObject = false;
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            manifestObject = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", chrome.extension.getURL('/manifest.json'), false);
    
    try {
        xhr.send();
    } catch(e) {
        console.log('Couldn\'t load manifest.json');
    }
    
    return manifestObject;
    
})();
