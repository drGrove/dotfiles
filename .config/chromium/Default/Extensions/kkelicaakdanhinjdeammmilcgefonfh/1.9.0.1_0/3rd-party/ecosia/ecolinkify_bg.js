if (!parseInt(window.localStorage['disableEcoLinks'], 10)) {
  enableEcoLinks();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.enableEcoLinks) {
    enableEcoLinks();
  }
  
  if (request.disableEcoLinks) {
    disableEcoLinks();
  }
});


// Requests that are pending to update its referer
var pending = [];

function enableEcoLinks() {
  chrome.webRequest.onHeadersReceived.addListener(_onHeadersReceived,
  {
    // Ecosia URLs
    urls: [ '*://jgy3.ggclk.com/url?*', '*://www.ecosia.org/url?*' ],
    types: [ 'main_frame' ]
  },
  ['blocking', 'responseHeaders']);

  chrome.webRequest.onBeforeSendHeaders.addListener(_onBeforeSendHeaders,
  {
    urls: [ '*://*/*' ],
    types: [ 'main_frame' ]
  },
  ['blocking', 'requestHeaders']);
}

function disableEcoLinks() {
  chrome.webRequest.onHeadersReceived.removeListener(_onHeadersReceived);
  chrome.webRequest.onBeforeSendHeaders.removeListener(_onBeforeSendHeaders);
}

function _onHeadersReceived(details) {
  var headers = details.responseHeaders;
  var ecoUR = getHeader(headers, "Eco-UR");

  if (ecoUR) {
    setPending(details.requestId, ecoUR);
  }
}

function _onBeforeSendHeaders(details) {
var headers = details.requestHeaders;
var referer = getPending(details.requestId);

  if (referer) {
    setHeader(headers, "Referer", referer);
  }

  return { requestHeaders:headers };
}

function getPending(requestId) {
  for (var i = 0; i < pending.length; i++) {
    if (pending[i].id == requestId) {
      return pending[i].url;
    }
  }

  return null;
}

function setPending(requestId, refererUrl) {
  var found = false;

  for (var i = 0; i < pending.length; i++) {
    if (pending[i].id == requestId) {
      pending[i].url = refererUrl;
      found = true;
      break;
    }
  }

  if (!found) {
    pending.push({ id:requestId, url:refererUrl });
  }
}

function getHeader(headers, headerName) {
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].name == headerName) {
      return headers[i].value;
    }
  }

  return null;
}

function setHeader(headers, headerName, headerValue) {
  var found = false;

  for (var i = 0; i < headers.length; i++) {
    if (headers[i].name == headerName) {
      headers[i].value = headerValue;
      found = true;
      break;
    }
  }

  if (!found) {
    headers.push({ name:headerName, value:headerValue });
  }
}
