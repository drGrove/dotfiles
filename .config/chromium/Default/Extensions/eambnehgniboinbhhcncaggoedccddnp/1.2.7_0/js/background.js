
wips.firstStart = function(){ 
    if(config['thanks_url']){ 
        this.openUrl(config['thanks_url']); 
    } 
}

var background = {
    
    token: undefined,
    accounts: new Object(),
    profiles: new Object(),
    
    /**
     * Initialise parameters
     */
    init: function(){
        /**
         * Load cache
         */
        var accounts = getPref("accounts");
        if(accounts){             
            this.accounts = JSON.parse(accounts);   
        }
        var profiles = getPref("profiles");
        if(profiles){             
            this.profiles = JSON.parse(profiles);   
        }
        
        if(!getPref("interval")){
            setPref("interval", "7");
        }
        
        if(!getPref("notify_visits")){
            setPref("notify_visits", "1");
        }
        
        if(!getPref("graphColor1")){
            setPref("graphColor1", "#e1c140");
        }
        
        if(!getPref("graphColor2")){
            setPref("graphColor2", "#3ac3f1");
        }
        if(!getPref("badgeColor")){
            setPref("badgeColor", "#ff0000");
        }
        
        chrome.browserAction.setBadgeBackgroundColor(     {
            color:getPref("badgeColor")
        }); 
    },
    
    /**
     * Get Google Analytics ™ token
     */
    getGoogleAnalyticsToken: function(onCompleteFunction){
        background.token = undefined;
        $.ajax({
            url: "https://www.google.com/analytics/web/",
            data: '',
            method: 'get',
            error: function (XMLHttpRequest, textStatus, errorThrown) {   
                
                var popups = chrome.extension.getViews({
                    type: "popup"
                });
                if (popups.length != 0) {
                    var popup = popups[0];                             
                    popup.document.location.href = "auth.html";                                               
                }
                
                return false;
            },
            success: function (data) {
                if ((data.split('window.preload').length - 1) > 0) {
                    var account_options = $(data);
                    account_options.each(function () {
                        var script_contents = $(this).html();
                        if ((script_contents.split('"token":{"value":"').length - 1) > 0) {
                            background.token = script_contents.split('"token":{"value":"')[1].split('","valid"')[0];
                            
                            var popups = chrome.extension.getViews({
                                type: "popup"
                            });
                            if (popups.length != 0) {
                                var popup = popups[0];                             
                                popup.document.location.href = "popup.html";                                               
                            }
                            background.getProfiles();
                            
                            
                            return;
                        }

                    });
                }else{                            
                    chrome.browserAction.setBadgeText({
                        text: "?"
                    }); 
                }
            }
        });
    },    
    
    /**
     * Get all accounts and profiles
     */
    getProfiles:function() {          
        
        if(this.token === undefined){
            var popups = chrome.extension.getViews({
                type: "popup"
            });
            if (popups.length != 0) {
                var popup = popups[0];                             
                popup.document.location.href = "auth.html";                                               
            }
            
            background.getGoogleAnalyticsToken();
            return;
        }
                
        month = (new Date()).getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = (new Date()).getDate();
        if (day < 10) day = "0" + day;
        year = (new Date()).getFullYear();
                
        today = year + '' + month + '' + day;
        
        $.ajax({
            url: "https://www.google.com/analytics/web/getPage?_u.date00=" + today + "&_u.date01=" + today + "&homeAccountsTable-tableControl.searchTerm=&homeAccountsTable.viewType=FLAT&id=home-page&cid=homeAccountsTable%2CtimestampMessage&hl=en_US&authuser=0",
            data: {
                token: this.token
            },
            type: "POST",
            dataType: "json",
            statusCode: {
                /**
                 * Unauthorised
                 */
                403: function() {
                    background.token = undefined;                          
                    setPref("account", "");
                    setPref("profile", "");          
                    background.getGoogleAnalyticsToken();
                    return false;
                }
            },
            success: function (data) {
                
                background.accounts= new Object();
                background.profiles= new Object();
                for (var i in data.components[0].row) {
                                        
                    var element = data.components[0].row[i]
                    
                    if (element.entityName == "account") {
                        background.accounts[element.id]= {
                            "label": element.label
                        };
                    }
                                        
                    if (element.entityName == "profile") {
                        background.profiles[element.id] = {
                            "label": element.label, 
                            "parent" : element.parentId
                        };
                    }
                }      
                
                setPref("accounts", JSON.stringify(background.accounts));
                setPref("profiles", JSON.stringify(background.profiles));
                
                var popups = chrome.extension.getViews({
                    type: "popup"
                });
                if (popups.length != 0) {
                    var popup = popups[0];                             
                    popup.initAccountList();
                    popup.initProfileList();
                }
                            
                background.getOverviewData();
            }
        });

    },   
           
    iconXhr:null, 
    getIconData:function() {
        
        if(this.token === undefined){
            var popups = chrome.extension.getViews({
                type: "popup"
            });
            if (popups.length != 0) {
                var popup = popups[0];                             
                popup.document.location.href = "auth.html";                                               
            }
            
            background.getGoogleAnalyticsToken();
            return;
        }
        
        if(!getPref("profiles") && !getPref("accounts")){
            background.getProfiles();
            return;
        }
       
        var today = new Date();
       
        month = (today).getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = (today).getDate();
        if (day < 10) day = "0" + day;
        year = (today).getFullYear();
                
        today = year + '' + month + '' + day;
        
        if(getPref("profile")){
            var profile = getPref("profile");
        }else{            
            return;
        }

        var url = "https://www.google.com/analytics/web/getPage?_u.date00=" + today + "&_u.date01=" + today + "&id=visitors-overview&ds=" + profile + "&cid=overview%2CprofileExperiments%2CreportHeader%2CtimestampMessage&hl=en_US&authuser=0";        
        
        if(background.iconXhr != null){
            background.iconXhr.abort();
        }
        
        iconXhr = $.ajax({
            url: url,
            type: "POST",
            data: "token=" + this.token,
            cache: false,
            dataType: "json",
            statusCode: {
                /**
                 * Unauthorised
                 */
                403: function() {                    
                    background.token = undefined;                    
                    setPref("account", "");                 
                    setPref("accounts", "");
                    setPref("profile", "");  
                    setPref("profiles", "");  
                    background.accounts= new Object();   
                    background.profiles= new Object();          
                    background.getGoogleAnalyticsToken();
                    return false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {                
                background.token = undefined;                    
                setPref("account", "");                 
                setPref("accounts", "");
                setPref("profile", "");  
                setPref("profiles", "");  
                background.accounts= new Object();   
                background.profiles= new Object();          
                background.getGoogleAnalyticsToken();
                return false;
            },
            success: function (data) {
                
                if(data.error){
                    background.token = undefined;                    
                    setPref("account", "");                 
                    setPref("accounts", "");
                    setPref("profile", "");  
                    setPref("profiles", "");  
                    background.accounts= new Object();   
                    background.profiles= new Object();          
                    background.getGoogleAnalyticsToken();
                    return false;
                }
                
                var updateData = [];
                var updateValue = [];
                if(data.components){
                    for(var i in data.components){
                        if(data.components[i].id == "overview"){
                            for( var metric in data.components[i].sparkline.metricGroup){
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "Visits" ){
                                    
                                    for(var t in data.components[i].sparkline.metricGroup[metric].group[0].line[0].point){
                                        data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t] = parseInt(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t]);
                                    }
                                        
                                    /**
                                     * Update notification
                                     */   
                                    if(getPref("notify_visits") == "1"){                  
                                        if(parseInt(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[data.components[i].sparkline.metricGroup[metric].group[0].line[0].point.length-1]) <= 9999){
                                            chrome.browserAction.setBadgeText({
                                                text: ""+data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[data.components[i].sparkline.metricGroup[metric].group[0].line[0].point.length-1]
                                            });   
                                        }else if(parseInt(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[data.components[i].sparkline.metricGroup[metric].group[0].line[0].point.length-1]) <= 999999){
                                            chrome.browserAction.setBadgeText({
                                                text: ""+Math.floor(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[data.components[i].sparkline.metricGroup[metric].group[0].line[0].point.length-1]/1000)+"k"
                                            }); 
                                        }else{
                                            chrome.browserAction.setBadgeText({
                                                text: ""+Math.floor(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[data.components[i].sparkline.metricGroup[metric].group[0].line[0].point.length-1]/1000000)+"m"
                                            }); 
                                        } 
                                    }
                                        
                                    updateValue[0] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                    
                                }
                            }                            
                        }
                        
                    }
                    
                }
                    
            }
        });
    },
    overviewXhr:null, 
    getOverviewData:function() {
        
        if(this.token === undefined){
            var popups = chrome.extension.getViews({
                type: "popup"
            });
            if (popups.length != 0) {
                var popup = popups[0];                             
                popup.document.location.href = "auth.html";                                               
            }
            
            background.getGoogleAnalyticsToken();
            return;
        }
        
        if(!getPref("profiles") && !getPref("accounts")){
            background.getProfiles();
            return;
        }
       
        var today = new Date();
        
        if(parseInt(getPref("interval")) == -1){
            today.setDate(today.getDate()-1);
        }
       
        month = (today).getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = (today).getDate();
        if (day < 10) day = "0" + day;
        year = (today).getFullYear();
                
        today = year + '' + month + '' + day;
        
        
        var d = new Date();
        
        if(parseInt(getPref("interval")) == -1){
            d.setDate(d.getDate()-1);
        }else{
            d.setDate(d.getDate()-parseInt(getPref("interval")));
        }
        previousDate = d;
        month = previousDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = previousDate.getDate();
        if (day < 10) day = "0" + day;
        year = previousDate.getFullYear();
        
        previous = year + '' + month + '' + day;
        
        
        if(getPref("profile")){
            var profile = getPref("profile");
        }else{            
            return;
        }

        var url = "https://www.google.com/analytics/web/getPage?_u.date00=" + previous + "&_u.date01=" + today + "&id=visitors-overview&ds=" + profile + "&cid=overview%2CprofileExperiments%2CreportHeader%2CtimestampMessage&hl=en_US&authuser=0";        
        
        if(background.overviewXhr != null){
            background.overviewXhr.abort();
        }
        
        overviewXhr = $.ajax({
            url: url,
            type: "POST",
            data: "token=" + this.token,
            cache: false,
            dataType: "json",
            statusCode: {
                /**
                 * Unauthorised
                 */
                403: function() {                    
                    background.token = undefined;                    
                    setPref("account", "");                 
                    setPref("accounts", "");
                    setPref("profile", "");  
                    setPref("profiles", "");  
                    background.accounts= new Object();   
                    background.profiles= new Object();          
                    background.getGoogleAnalyticsToken();
                    return false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {                
                background.token = undefined;                    
                setPref("account", "");                 
                setPref("accounts", "");
                setPref("profile", "");  
                setPref("profiles", "");  
                background.accounts= new Object();   
                background.profiles= new Object();          
                background.getGoogleAnalyticsToken();
                return false;
            },
            success: function (data) {
                
                if(data.error){
                    background.token = undefined;                    
                    setPref("account", "");                 
                    setPref("accounts", "");
                    setPref("profile", "");  
                    setPref("profiles", "");  
                    background.accounts= new Object();   
                    background.profiles= new Object();          
                    background.getGoogleAnalyticsToken();
                    return false;
                }
                background.getIconData();
                
                var updateData = [];
                var updateValue = [];
                if(data.components){
                    for(var i in data.components){
                        if(data.components[i].id == "overview"){
                            for( var metric in data.components[i].sparkline.metricGroup){
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "Visits" ){
                                    
                                    for(var t in data.components[i].sparkline.metricGroup[metric].group[0].line[0].point){
                                        data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t] = parseInt(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t]);
                                    }
                                    
                                    updateData[0] = {
                                        "label":"Visits",  
                                        "data":data.components[i].sparkline.metricGroup[metric].group[0].line[0].point,
                                        "type":"int"
                                    };
                                        
                                    updateValue[0] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                    
                                }
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "Pageviews" ){
                                    
                                    for(var t in data.components[i].sparkline.metricGroup[metric].group[0].line[0].point){
                                        data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t] = parseInt(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t]);
                                    }
                                    updateData[1] = {
                                        "label":"Pageviews", 
                                        "data":data.components[i].sparkline.metricGroup[metric].group[0].line[0].point,
                                        "type":"int"
                                    };
                                    updateValue[1] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                }
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "Unique Visitors" ){
                                    
                                    for(var t in data.components[i].sparkline.metricGroup[metric].group[0].line[0].point){
                                        data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t] = parseInt(data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t]);
                                    }
                                    updateData[2] = {
                                        "label":"Unique Visitors", 
                                        "data":data.components[i].sparkline.metricGroup[metric].group[0].line[0].point,
                                        "type":"int"
                                    };
                                    updateValue[2] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                }
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "Pages / Visit" ){
                                    
                                    updateData[3] = {
                                        "label":"Pages / Visit", 
                                        "data":data.components[i].sparkline.metricGroup[metric].group[0].line[0].point,
                                        "yaxis" :2,
                                        "type":"float"
                                    };
                                    updateValue[3] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                }
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "Avg. Visit Duration" ){
                                    
                                                                       
                                    updateData[4] = {
                                        "label":"Avg. Visit Duration", 
                                        "data":data.components[i].sparkline.metricGroup[metric].group[0].line[0].point,
                                        "yaxis" :2,
                                        "type":"time"
                                    };
                                    updateValue[4] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                }
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "Bounce Rate" ){
                                    
                                    for(var t in data.components[i].sparkline.metricGroup[metric].group[0].line[0].point){
                                        data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t] = (data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t]*100).toFixed(2);
                                    }
                                    
                                    updateData[5] = {
                                        "label":"Bounce Rate", 
                                        "data":data.components[i].sparkline.metricGroup[metric].group[0].line[0].point,
                                        "yaxis" :2,
                                        "type":"percents"
                                    };
                                    updateValue[5] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                }
                                if(data.components[i].sparkline.metricGroup[metric].group[0].displayName == "% New Visits" ){
                                    
                                    
                                    for(var t in data.components[i].sparkline.metricGroup[metric].group[0].line[0].point){
                                        data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t] = (data.components[i].sparkline.metricGroup[metric].group[0].line[0].point[t]*100).toFixed(2);
                                    }
                                    
                                    updateData[6] = {
                                        "label":"% New Visits", 
                                        "data":data.components[i].sparkline.metricGroup[metric].group[0].line[0].point,
                                        "yaxis" :2,
                                        "type":"percents"
                                    };
                                    updateValue[6] = data.components[i].sparkline.metricGroup[metric].group[0].line[0].value;
                                }
                            }
                            
                            /**
                             * Append data to Popup page
                             */
                            var popups = chrome.extension.getViews({
                                type: "popup"
                            });
                            if (popups.length != 0) {
                                var popup = popups[0]; 
                    
                                if(getPref("graphType2") != "" && getPref("graphType1") != getPref("graphType2")){
                                    popup.updateGraphData(updateData[getPref("graphType1")], updateData[getPref("graphType2")]);
                                }else{
                                    popup.updateGraphData(updateData[getPref("graphType1")], []);
                                }
                                                
                                popup.updateValueData(updateValue);
                            }
                        }
                        
                    }
                    
                }
                    
            }
        });
        
    },
    
    /**
     * Get data for any table
     */
    getTableData:function(placeholder, id, segment){
        
        if(this.token === undefined){
            var popups = chrome.extension.getViews({
                type: "popup"
            });
            if (popups.length != 0) {
                var popup = popups[0];                             
                popup.document.location.href = "auth.html";                                               
            }
            
            background.getGoogleAnalyticsToken();
            return;
        }
        
        var today = new Date();
        
        if(parseInt(getPref("interval")) == -1){
            today.setDate(today.getDate()-1);
        }
       
        month = (today).getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = (today).getDate();
        if (day < 10) day = "0" + day;
        year = (today).getFullYear();
                
        today = year + '' + month + '' + day;
        
        
        var d = new Date();
        
        if(parseInt(getPref("interval")) == -1){
            d.setDate(d.getDate()-1);
        }else{
            d.setDate(d.getDate()-parseInt(getPref("interval")));
        }
        previousDate = d;
        month = previousDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = previousDate.getDate();
        if (day < 10) day = "0" + day;
        year = previousDate.getFullYear();
        
        previous = year + '' + month + '' + day;
        
        
        if(getPref("profile")){
            var profile = getPref("profile");
        }else{
            return;
        }
        
        /* Direct traffic */
        
        var url = "";
        if(!segment){
            url = "https://www.google.com/analytics/web/getPage?_u.date00=" + previous + "&_u.date01=" + today + "&id="+id+"&ds=" + profile + "&hl=en_US&authuser=0&explorer-table.rowCount=500";        
        }else{
            url = "https://www.google.com/analytics/web/getPage?_u.date00=" + previous + "&_u.date01=" + today + "&id="+id+"&explorer-segmentExplorer.segmentId="+segment+"&ds=" + profile + "&hl=en_US&authuser=0&explorer-table.rowCount=500";        
        }
        $.ajax({
            url: url,
            type: "POST",
            data: "token=" + this.token,
            cache: false,
            dataType: "json",
            statusCode: {
                /**
                 * Unauthorised
                 */
                403: function() {                    
                    background.token = undefined;                    
                    setPref("account", "");                 
                    setPref("accounts", "");
                    setPref("profile", "");  
                    setPref("profiles", "");  
                    background.accounts= new Object();   
                    background.profiles= new Object();          
                    background.getGoogleAnalyticsToken();
                    return false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {                
                background.token = undefined;                    
                setPref("account", "");                 
                setPref("accounts", "");
                setPref("profile", "");  
                setPref("profiles", "");  
                background.accounts= new Object();   
                background.profiles= new Object();          
                background.getGoogleAnalyticsToken();
                return false;
            },
            success: function (data) {
                if(data.components){
                    for(var i in data.components){
                        if(data.components[i].id == "explorer" || data.components[i].id == "geo"){
                            var outputData = [];
                            for(var e in data.components[i].table.dataTable.rowCluster){
                                var dataValues = [];
                                for(var v in data.components[i].table.dataTable.rowCluster[e].row[0].rowValue){
                                    dataValues.push(data.components[i].table.dataTable.rowCluster[e].row[0].rowValue[v].dataValue);
                                }
                                outputData.push([data.components[i].table.dataTable.rowCluster[e].rowKey[0].displayKey, dataValues]);
                            }
                            
                            /**
                             * Append data to Popup page
                             */
                            var popups = chrome.extension.getViews({
                                type: "popup"
                            });
                            if (popups.length != 0) {
                                var popup = popups[0];                                                 
                                popup.updateTableData(placeholder, outputData);
                            }
                        }
                    }
                }
            }
        });
    },
    
    getMapData:function(placeholder, id, segment){
        
        if(this.token === undefined){
            var popups = chrome.extension.getViews({
                type: "popup"
            });
            if (popups.length != 0) {
                var popup = popups[0];                             
                popup.document.location.href = "auth.html";                                               
            }
            
            background.getGoogleAnalyticsToken();
            return;
        }
        
        var today = new Date();
        
        if(parseInt(getPref("interval")) == -1){
            today.setDate(today.getDate()-1);
        }
       
        month = (today).getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = (today).getDate();
        if (day < 10) day = "0" + day;
        year = (today).getFullYear();
                
        today = year + '' + month + '' + day;
        
        
        var d = new Date();
        
        if(parseInt(getPref("interval")) == -1){
            d.setDate(d.getDate()-1);
        }else{
            d.setDate(d.getDate()-parseInt(getPref("interval")));
        }
        previousDate = d;
        month = previousDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        day = previousDate.getDate();
        if (day < 10) day = "0" + day;
        year = previousDate.getFullYear();
        
        previous = year + '' + month + '' + day;
        
        
        if(getPref("profile")){
            var profile = getPref("profile");
        }else{
            return;
        }
        
        /* Direct traffic */
        
        var url = "";
        if(!segment){
            url = "https://www.google.com/analytics/web/getPage?_u.date00=" + previous + "&_u.date01=" + today + "&id="+id+"&ds=" + profile + "&hl=en_US&authuser=0&geo-table.rowCount=5000";        
        }else{
            url = "https://www.google.com/analytics/web/getPage?_u.date00=" + previous + "&_u.date01=" + today + "&id="+id+"&explorer-segmentExplorer.segmentId="+segment+"&ds=" + profile + "&hl=en_US&authuser=0&geo-table.rowCount=5000";        
        }
        $.ajax({
            url: url,
            type: "POST",
            data: "token=" + this.token,
            cache: false,
            dataType: "json",
            statusCode: {
                /**
                 * Unauthorised
                 */
                403: function() {                    
                    background.token = undefined;                    
                    setPref("account", "");                 
                    setPref("accounts", "");
                    setPref("profile", "");  
                    setPref("profiles", "");  
                    background.accounts= new Object();   
                    background.profiles= new Object();          
                    background.getGoogleAnalyticsToken();
                    return false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {                
                background.token = undefined;                    
                setPref("account", "");                 
                setPref("accounts", "");
                setPref("profile", "");  
                setPref("profiles", "");  
                background.accounts= new Object();   
                background.profiles= new Object();          
                background.getGoogleAnalyticsToken();
                return false;
            },
            success: function (data) {
                                
                if(data.components){
                    for(var i in data.components){
                        if(data.components[i].id == "geo"){
                            
                            var outputData = [];
                            for(var e in data.components[i].table.dataTable.rowCluster){
                                var dataValues = [];
                                for(var v in data.components[i].table.dataTable.rowCluster[e].row[0].rowValue){
                                    dataValues.push(data.components[i].table.dataTable.rowCluster[e].row[0].rowValue[v].dataValue);
                                }
                                outputData.push([data.components[i].table.dataTable.rowCluster[e].rowKey[0].displayKey, dataValues]);
                            }
                            
                            /**
                             * Append data to Popup page
                             */
                            var popups = chrome.extension.getViews({
                                type: "popup"
                            });
                            if (popups.length != 0) {
                                var popup = popups[0];     
                                
                                
                                popup.updateMapData(placeholder, outputData);
                            }
                        }
                    }
                }
            }
        });
    }
    
}

$(document).ready(function() {
    background.init();
    background.getGoogleAnalyticsToken();
    setInterval(function() {
        
        
        var popups = chrome.extension.getViews({
            type: "popup"
        });
        if (popups.length == 0) {                         
            background.getGoogleAnalyticsToken();                                          
            background.getIconData();
        }
    },1000*60*5);
});