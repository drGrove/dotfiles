(function(){
    
    //
    // i18n.
    //
    function translate(){
        var contents = document.querySelectorAll('*[i18n-content]');
        var len = contents.length;
        for( var i=0, key = null, msg=null; i<len; i++ ){
            var item = contents[i];
            key = item.getAttribute('i18n-content');
            msg = chrome.i18n.getMessage(key);
            if(!msg){continue;}
            item.innerHTML = msg;
        }
        var titles = document.querySelectorAll('*[i18n-title]');
        len = titles.length;
        for( var i=0, key = null, msg=null; i<len; i++ ){
            var item = titles[i];
            key = item.getAttribute('i18n-title');
            msg = chrome.i18n.getMessage('title'+key);
            if(!msg){continue;}
            item.setAttribute('title', msg);
        }
        var alts = document.querySelectorAll('*[i18n-alt]');
        len = alts.length;
        for( var i=0, key = null, msg=null; i<len; i++ ){
            var item = alts[i];
            key = item.getAttribute('i18n-alt');
            msg = chrome.i18n.getMessage('alt'+key);
            if(!msg){continue;}
            item.setAttribute('alt', msg);
        }
    }
    
    translate();
    
    //tabs
    function tabClick(e){
        e.preventDefault();
        if( this.classList.contains('current') ){
            return;
        }
        this.parentNode.querySelector('a.current').classList.remove('current');
        this.classList.add('current');
        var id = this.getAttribute('href').replace('#','');
        document.querySelector('div.results-tabs > div.content > div.current').classList.remove('current');
        document.querySelector('div.results-tabs > div.content > div.'+id).classList.add('current');
    }
    var tabs = document.querySelectorAll('div.results-tabs > div.tabs > a');
    for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        tab.addEventListener('click', tabClick, false);
    }

    
    function doTest(e){
        saveState();
        if( !e.skipTest && !isPatternValid() ){
            return;
        }
        var pattern = document.querySelector('textarea[name="pattern"]').value;
        var modifiers = '';
        var opts = document.querySelectorAll('input[name="opt"]:checked');
        for (var i = 0; i < opts.length; i++) {
            modifiers += opts[i].value;
        }
        var r = new RegExp('('+pattern+')',modifiers);
        var body = document.querySelector('textarea[name="body"]').value;
        var replace = document.querySelector('input[name="replace"]').value;

        var match = body.match(r);
        
        var matchCount = 0;
        if( match != null ){
            matchCount = match.length;
        }
        
        document.querySelector('#match-counter').innerHTML = matchCount;
        
        replace = replace.replace(/\$0/, match);
        
        var highlight = body.replace(r, "[rexp-highlight]$1[/rexp-highlight]");
        highlight = highlight.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
        highlight = highlight.replace(/\[rexp-highlight\](.*?)\[\/rexp-highlight\]/g, '<span class="highlight">$1</span>');

        var matchDiv = document.querySelector('div.results-tabs > div.content > div.match');
        matchDiv.innerHTML = highlight;
        
        var replacedMatch = body.replace(r,'[rexp-highlight]'+replace+'[/rexp-highlight]');
        replacedMatch = replacedMatch.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
        replacedMatch = replacedMatch.replace(/\[rexp-highlight\](.*?)\[\/rexp-highlight]/g, '<span class="replaceHighlight">$1</span>');
        var replaceDiv = document.querySelector('div.results-tabs > div.content > div.replace');
        replaceDiv.innerHTML = replacedMatch;
    }

    function testPattern(e){
        
        if( isPatternValid() ){
            doTest({skipTest:true})
        } else {
            saveState();
            resetResults();
        }
    }
    
    function resetResults(){
        document.querySelector('div.results-tabs > div.content > div.replace').innerHTML = '';
        document.querySelector('div.results-tabs > div.content > div.match').innerHTML = '';
        document.querySelector('#match-counter').innerHTML = 0;
    }
    
    function isPatternValid(){
        var input = document.querySelector('textarea[name="pattern"]');
        var pattern = input.value;
        if( pattern.length == 0 ){
            return false;
        }
        var valid = true;
        try{
        new RegExp(pattern);
        }catch(e){
            input.setCustomValidity("Pattern is invalid");
            valid = false;
        }
        if( valid ){
            input.setCustomValidity('');
        }
        return valid;
    }

    //observe inputs
    var inputs = document.querySelectorAll('input[type="checkbox"],input[type="text"],textarea');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if( input.name == 'pattern' ){
            input.addEventListener('keyup', testPattern, false);
        } else {
            var eventType = 'change';
            if(input.type != 'checkbox'){
                eventType = 'keyup';
            }
            input.addEventListener(eventType, doTest, false);
        }
    }


    function getFormData(){
        var form = document.querySelector('#regexp-form');
        var opts = form.querySelectorAll('input[name="opt"]:checked');
        var data = {};
        data.opts = [];
        for (var i = 0; i < opts.length; i++) {
            data.opts[data.opts.length] = opts[i].value;
        }
        data.pattern = form.querySelector('textarea[name="pattern"]').value;
        data.body = form.querySelector('textarea[name="body"]').value;
        data.replace = form.querySelector('input[name="replace"]').value;
        return data;
    }

    function saveState(){
        var data = getFormData();
        localStorage.setItem('state',JSON.stringify(data));
    }

    function restoreState(){
        //return;
        var data = localStorage.getItem('state');
        if( data == null ){
            return;
        }
        
        var formData = null;
        try{
            formData = JSON.parse(data);
        }catch(e){
            return;
        }
        
        var form = document.querySelector('#regexp-form');
        formData.pattern = formData.pattern || '';
        formData.body = formData.body || '';
        formData.replace = formData.replace || '';
        formData.opts = formData.opts || [];
        var opts = form.querySelectorAll('input[name="opt"]:checked');
        for (var i = 0; i < opts.length; i++) {
            opts[i].checked = false;
        }
        for (var i = 0; i < formData.opts.length; i++) {
            form.querySelector('input[value="'+formData.opts[i]+'"]').checked = true;
        }
        form.querySelector('textarea[name="pattern"]').value = formData.pattern;
        form.querySelector('textarea[name="body"]').value = formData.body;
        form.querySelector('input[name="replace"]').value = formData.replace;
    }

    function openHint(e){
        var overlay = document.querySelector('div.popupPanelGlass');
        overlay.classList.add('visible');
        var id = this.id.replace('#','');
        switch( id ){
            case 'patterns-help':
                document.querySelector('#patterns-dialog').style.display = 'block';
                break;
        }
    }

    //observe hint fields
    document.querySelector('#patterns-help').addEventListener('click', openHint, true);
    //observe dialogs buttons
    document.querySelector('#patterns-dialog button.cancel').addEventListener('click', function(){
        var overlay = document.querySelector('div.popupPanelGlass');
        overlay.classList.remove('visible');
        document.querySelector('#patterns-dialog').style.display = 'none';
    }, false);
    restoreState();
    testPattern({});
})();