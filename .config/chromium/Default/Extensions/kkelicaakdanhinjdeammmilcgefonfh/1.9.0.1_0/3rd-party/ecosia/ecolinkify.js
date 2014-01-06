/*
 * ecolinkify.js
 *
 * Make sure that you change the v query string parameter to whatever partner
 * ID was assigned to you
*/

var ecoPartnerId = "2";
var ecoURLRedirector = "www.ecosia.org";

/*
 * Change all search result anchor tags
 */
function changeAnchors() {
  "use strict";
  var selector = "#search ol#rso li.g .rc h3.r a, #newsbox li.w0 a",
    anchors = document.querySelectorAll(selector),
    i,
    anchor;

  for(i = 0; i < anchors.length; i++) {
    anchor = anchors[i];
    anchor.removeEventListener("click");
    anchor.removeEventListener("mousedown");
    anchor.removeAttribute("onmousedown");
    anchor.addEventListener("mousedown", changeUrl);

    try{
      ecoTree(anchor);

      var liParent = getLiParentNode(anchor);
      if (hasSublinks(liParent)) {
        var liIndex = getIndex(liParent),
          subLinks = getSublinks(liParent),
          subLink,
          subLinkIndex;
        for(subLinkIndex = 0; subLinkIndex < subLinks.length; subLinkIndex++) {
          subLink = subLinks[subLinkIndex];
          subLink.removeEventListener("click");
          subLink.removeEventListener("mousedown");
          subLink.removeAttribute("onmousedown");
          subLink.addEventListener("mousedown", makeChangeUrlHandler(liIndex));
        }
      }
    }
    catch (e) {}
  }
}


/*
 * Make an anchor tag colorful if affiliate link
 */
var promotedUrls = {};
function ecoTree(anchor) {
  var ecoHostname = getHostname(anchor.href);
  if(ecoHostname in ecopartners && !anchor.hasAttribute("data-partner")) {
    anchor.setAttribute("data-partner", "true");
    // hack!
    // get li parent of anchor tag
    var parent = anchor.parentNode.parentNode.parentNode;
    //console.log("Promoting: " + ecoHostname);
    //console.log("Index before: " + getIndex(parent));

    if(!(ecoHostname in promotedUrls) && getIndex(parent)>1) {
      promotedUrls[ecoHostname] = 0;
      //console.log("promoting");
      // push li node two positions up or one in case there is only one over li
      // node
      try{
        var twoUp = parent.previousSibling.previousSibling || parent.previousSibling;
        //if trying to push two up && there already is a promoted link, try
        //promoting it only one position
        if (twoUp  && twoUp.querySelector("a").hasAttribute( "data-partner" )) {
          twoUp = parent.previousSibling;
        }
        // or don't push at all, if nothing is above, or if selected only one
        // position above && position above also is a promoted link
        if (twoUp && !twoUp.querySelector("a").hasAttribute( "data-partner" )) {
          parent.parentNode.insertBefore(parent, twoUp);
        }
      }
      catch(e){}
    }
    //console.log("Index after: " + getIndex(parent));

    //highlight li element
    parent.className = parent.className + " eco-li";

    // the EcoLink favicon
    var favIcon = document.createElement('img');
    favIcon.src = "https://getfavicon.appspot.com/" + anchor.href;
    favIcon.alt = ecoHostname;
    favIcon.className = "eco-favicon";

    // the EcoLink text
    var ecoHint = document.createElement('span');
    ecoHint.innerHTML = "<span>EcoLink</span>";
    ecoHint.className = "eco-hint";

    // the tooltip
    var ecoTooltip = document.createElement('div');
    ecoTooltip.innerHTML = getTooltipText();
    ecoTooltip.className = "tooltip";
    var toolTipTimer;
    ecoHint.addEventListener("mouseenter", function(event) {
      var target = event.currentTarget;
      toolTipTimer = setTimeout(function() {
        target.querySelector(".tooltip").className = "tooltip tooltip-hover";
        target.querySelector(".tooltip-spacer").className = "tooltip-spacer tooltip-spacer-visible";
       }, 500);
    }, false);
    ecoHint.addEventListener("mouseleave", function(event) {
      clearTimeout(toolTipTimer);
      event.currentTarget.querySelector(".tooltip").className = "tooltip";
      event.currentTarget.querySelector(".tooltip-spacer").className = "tooltip-spacer";
    }, false);

    var ecoTooltipSpacer = document.createElement('div');
    ecoTooltipSpacer.className = "tooltip-spacer";

    // find parent to append everything to
    var ecoHintParent = parent.querySelector(".f.kv");

    //tree image
    var img = document.createElement('img');
    img.src = chrome.extension.getURL('3rd-party/ecosia/ecotree.png');
    img.className = "eco-tree";

    //insert everything
    var anchorParent = parent.querySelector(".g .rc");
    anchorParent.insertBefore(favIcon, anchorParent.firstChild);
    ecoHintParent.insertBefore(ecoHint, null);
    ecoHint.insertBefore(img, ecoHint.firstChild);
    ecoHint.insertBefore(ecoTooltip, null);
    ecoHint.insertBefore(ecoTooltipSpacer, null);
  }
}

/*
 * Creates a changeUrl handler for a custom li index
 */
function makeChangeUrlHandler(index) {
  "use strict";
  return function(event) {
    changeUrl(event, index);
  };
}

/*
 * Change URL of an anchor tag
 */
function changeUrl(event, customIndex){
  "use strict";
  var dataEcoAttribute = "data-eco",
    liNode,
    index,
    target = event.currentTarget;
  try {
    if(!target.hasAttribute(dataEcoAttribute)) {
      // this could potentially break in case google decides to change li
      // structure
      if(typeof customIndex === 'undefined') {
        // this is for toplevel search results
        liNode = getLiParentNode(target);
        index = getIndex(liNode);
      }
      else{
        // in case we are looking at a sublink
        index = customIndex;
      }
      target.setAttribute(dataEcoAttribute,"true");
      target.href="http://" +
        ecoURLRedirector +
        "/url?url=" +
        encodeURIComponent(target.href) +
        "&v=" +
        ecoPartnerId +
        "&i=" +
        index + //Result position (integer)
        "&q=" +
        encodeURIComponent(getQueryString()) +
        "&p=" +
        getStart()+  //Result page (integer) (&start)
        "&tr=" +
        getResultCount() + //Total number of results (17.000.000)
        "&at=" +
        getTopAdCount() +
        "&ar=" +
        getRightAdCount() +
        "&ab=" +
        getBottomAdCount() +
        "&mr=" +
        getMapResultType() +
        "&ir=" +
        getImageResultType() +
        "&kgr=" +
        getKnowledgeGraph() +
        "&nr=" +
        getNewsResultType() +
        "&iar=" +
        getInstantAnswerResultType() +
        "&sr=" +
        getShoppingResultType();
    }
  }
  catch (e) {}
}

/*
 * Get li node parent of anchor tag
 */
function getLiParentNode(anchor) {
  "use strict";
  var liNode = anchor.parentNode.parentNode.parentNode;
  if (liNode.nodeName == 'LI') {
    return liNode;
  }
  else {
    return null;
  }
}

/*
 * Return appropriate text for tooltip depending on browser language
 */
function getTooltipText() {
  var text;
  text = "<h4>This is an EcoLink and it helps the environment</h4> If you buy something on this website after using this link, a percentage of your purchase will automatically be donated to a tree planting program in Brazil -- at no extra cost to you! <a target='_blank' href='http://blog.ecosia.org/private/68462872760/tumblr_mx16gzeb711surx8u'> Learn more</a>";
  return text;
}

/*
 * Check for Sublinks
 */
var tableLinkSelector = "table.nrgt a";
var citeLinkSelector = "cite.vurls a";
function hasSublinks(liNode) {
  "use strict";
  try {
    var links = liNode.querySelector(tableLinkSelector + ", " +  citeLinkSelector)!==null;
    return links;
  }
  catch (e) {
    return false;
  }
}


/*
 * Get sublinks in table for every Google search result
 */
function getSublinks(liNode) {
  "use strict";
  try {
    var links = liNode.querySelectorAll(tableLinkSelector+","+citeLinkSelector);
    return links;
  }
  catch (e) {
    return [];
  }
}

/*
 * STATISTIC FUNCTIONS
 */
/*
 * Get query string
 */
function getQueryString() {
  "use strict";
  try {
    return  document.querySelector("#ires").getAttribute("data-async-context").match(/query:(.*)/)[1];
  }
  catch (e) {
    return "";
  }
}

/*
 * Get index of li tag in ol parent
 */
function getIndex(node) {
  "use strict";
  // should be safe without try/except
  var children = node.parentNode.childNodes,
    index = 0,
    i;
  for (i = 0; i < children.length; i++) {
    index = i;
    if (node == children[i])
      break;
  }
  return index;
}

/*
 * Get &start attribute of page
 */
function getStart() {
  "use strict";
  try {
    var match = document.location.hash.match(/&start=([0-9]*)/);
    return match[1];
  }
  catch(e) {
    return 0;
  }
}

/*
 * Get result number
 */
function getResultCount() {
  "use strict";
  try {
    var match = document.querySelector("#resultStats:not(nobr)").
      innerHTML.match(/(?:\d{1,3}[,\.]){0,}\d{1,3}(?=\s(results|Ergebnisse))/);
    return match[0].replace(/[\.,]/g,"");
  }
  catch (e) {
    return 0;
  }
}

/*
 * Get number of ads in top ads-container-list
 */
function getTopAdCount() {
  "use strict";
  // fine without trycatch, since it only looks at array length
  var adContainer = document.querySelectorAll(".ads-container#tads ol li.ads-ad");
  return adContainer.length;
}

/*
 * Get number of ads in right ads-container-list
 */
function getRightAdCount() {
  "use strict";
  var adContainer = document.querySelectorAll(".ads-container#mbEnd ol li.ads-ad");
  return adContainer.length;
}

/*
 * Get number of ads on bottom
 */
function getBottomAdCount() {
  "use strict";
  var adContainer = document.querySelectorAll(".ads-container#tadsb ol li.ads-ad");
  return adContainer.length;
}

/*
 * Return what type of map is on search results
 * 0: No Map
 * 1: Minimal
 * 2: Featured
 */
function getMapResultType() {
  "use strict";
  // Covers map with directions
  var featuredMap = (document.querySelector(".g.no-sep .dirs") !== null) * 2,
  // Covers knowledge result maps on the right
    minimalMap = (document.querySelector(".kno-mrg-m, .rhsmap3col, .rhsmap4col") !== null) * 1;
  return Math.max(featuredMap, minimalMap);
}

/* Find out whether knowledge graph exists or not
 * 0: No knowledge Graph
 * 1: Knowledge Graph exists
 */
function getKnowledgeGraph() {
  "use strict";
  var knowledgeGraph = (document.querySelector("li#kno-result") !== null) * 1;
  return knowledgeGraph;
}

/* Get what type of image results are being shown on site
 * 0: No images
 * 1: Minimal images
 * 2: Featured images
 */
function getImageResultType() {
  "use strict";
  //Featured big images
  var featuredImage = (document.querySelector("#imagebox_bigimages:first-child") !== null) * 2,
  //minimal images, same ID but not first result in ol, should make sure that
  //it's not the first element, but since we're using Math.max it should be
  //fine.
    minimalImage = (document.querySelector("#imagebox_bigimages") !== null) * 1;
  return Math.max(featuredImage, minimalImage);
}

/* Get what type of news results are being shown on site
 * 0: None
 * 1: Minimal
 * 2: Featured
 */
function getNewsResultType() {
  "use strict";
  //Featured Instant Answer
  var featuredNewsResult = (document.querySelector("li#newsbox:first-child") !== null) * 2,
  // Minimal News Result, so far none known!
    minimalNewsResult = (document.querySelector("li#newsbox") !== null) * 1;
  return Math.max(featuredNewsResult, minimalNewsResult);
}

/* Get what type of instant answer results are being shown on site
 * 0: None
 * 1: Minimal
 * 2: Featured
 */
function getInstantAnswerResultType() {
  "use strict";
  //Featured Instant Answer
  var featuredInstantAnswer = (document.querySelector("#rso .g.tpo") !== null) * 2;
  // Minimal Featured Instand Answer, so far none known!
  return featuredInstantAnswer;
}

/* Get what type of shopping results are being shown on site
 * 0: None
 * 1: Minimal
 * 2: Featured
 */
function getShoppingResultType(){
  "use strict";
  //Featured Shopping result
  var featuredShoppingResult = (document.querySelector(".commercial-unit") !== null) * 2;
  // Yet to find minimal results
  return featuredShoppingResult;
}

// Little helpers
/*
 * Get root hostname for an url, keep every sub domain except for www.
 * www.google.com -> google.com
 * mail.google.com -> mail.google.com
 */
function getHostname(ecoUrl) {
  var matches = ecoUrl.match(/(?:https?:\/\/)?(?:www\.)?(.*?)\//);
  var domain = matches && matches[1];
  return domain;
}

function loadCSS() {
  //insert CSS, ugly!
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = chrome.extension.getURL('3rd-party/ecosia/ecolinkify.css');
  (document.head||document.documentElement).appendChild(style);
}

/*
 * Add the event listener + mutationobserver
 */
function initObserver() {
  var target = document,
    observer = new MutationObserver(changeAnchors),
    config = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    };
  observer.observe(target, config);
}

chrome.extension.sendMessage({ecoLinks : true}, function(response) {
  if (response.ecoLinks) {
    loadCSS();
    initObserver();
  }
});