google.load('visualization', '1', {
    packages: ['geochart']
});

bgPage = chrome.extension.getBackgroundPage();

function initAccountList(){
    $("#accountsList").selectbox("detach");
    if(bgPage.background.accounts){
        $("#accountsList").html("<option value=\"\">- Select account -</option> ");
        for(var a in bgPage.background.accounts){
            if(getPref("account") == a){
                $("#accountsList").append("<option value=\""+a+"\" selected=\"selected\">"+bgPage.background.accounts[a].label+"</option>");
            }else{
                $("#accountsList").append("<option value=\""+a+"\" >"+bgPage.background.accounts[a].label+"</option>");
            }
        }
    } 
    $("#accountsList").selectbox();
}
function initProfileList(){
    $("#profilesList").selectbox("detach");
    $("#profilesList").html("<option value=\"\">- Select profile -</option> ");
    if(bgPage.background.profiles){
        for(var p in bgPage.background.profiles){
            if(getPref("account") && bgPage.background.profiles[p].parent.substring(0,8) == getPref("account").substring(0,8)){
                if(getPref("profile") == p){
                    $("#profilesList").append("<option value=\""+p+"\" selected=\"selected\">"+bgPage.background.profiles[p].label+"</option>");
                }else{
                    $("#profilesList").append("<option value=\""+p+"\" >"+bgPage.background.profiles[p].label+"</option>");
                }
            }
        }
    }
    $("#profilesList").selectbox();
}

var intervals = [ [0, "Today"], [-1, "Yesterday"], [7, "7 days"], [14, "14 days"], [31, "1 month"], [31*3, "3 months"], [31*6, "6 months"], [365, "1 year"] ];
function initIntervalList(){
    if(intervals){
        if(getPref("interval")){
            for (var interval in intervals){
                if(getPref("interval") == intervals[interval][0]){
                    $("#intervalList").append("<option selected=\"seected\" value=\"" +intervals[interval][0]+ "\">" +intervals[interval][1]+ "</option>");
                }else{
                    $("#intervalList").append("<option value=\"" +intervals[interval][0]+ "\">" +intervals[interval][1]+ "</option>");
                }
            }
        }else{
            for (var interval in intervals){
                if(7 == intervals[interval][0]){
                    $("#intervalList").append("<option selected=\"seected\" value=\"" +intervals[interval][0]+ "\">" +intervals[interval][1]+ "</option>");
                }else{
                    $("#intervalList").append("<option value=\"" +intervals[interval][0]+ "\">" +intervals[interval][1]+ "</option>");
                }
            }
        }
    }
}

function updateGraphData(data, data2){    
    var graphData = [];
    
    $("#label1").html("");
    $("#label1").parent("span").hide();
    $("#label2").html("");
    $("#label2").parent("span").hide();
    
    if(data.length != 0){
        $("#label1").html(data.label);
        $("#label1").parent("span").show();
        var day = 0;
        graphData[0] = {
            "data":[], 
            "yaxis":1, 
            "type":data.type
        };
        for (var c = data.data.length-1; c>=0; c--) {
            var d = new Date();
            d.setDate(d.getDate()-day);
            graphData[0].data.push([d.getTime(), data.data[c]]);
            day++;
        }
    }
    if(data2.length != 0){
        $("#label2").html(data2.label);
        $("#label2").parent("span").show();
        var day = 0;    
        
        if(data.yaxis != data2.yaxis){
            graphData[1] = {
                "data":[], 
                "yaxis":2, 
                "type":data2.type
            };
        }else{
            graphData[1] = {
                "data":[], 
                "yaxis":1, 
                "type":data2.type
            };
        }
        
        for (var c = data2.data.length-1; c>=0; c--) {
            var d = new Date();
            d.setDate(d.getDate()-day);
            graphData[1].data.push([d.getTime(), data2.data[c]]);
            day++;
        }
    }
    
    if(data.data.length <= 32){
        graphOptions.points.show = true;
    }else{
        graphOptions.points.show = false;
    }
    
    if(data2.length != 0){
        $.plot("#graph",  graphData, graphOptions);
    }else{
        $.plot("#graph",  [graphData[0]] , graphOptions);
    }
    lineGraphLegend();
}
function updateValueData(values){
    
    $("#value_visits").html("");
    $("#value_unq_visits").html("");
    $("#value_pageviews").html("");
    $("#value_avg_pageviews").html("");
    $("#value_time_on_site").html("");
    $("#value_boundce_rate").html("");    
    $("#value_new_visits").html("");
    
    if(values){
        $("#value_visits").html(values[0]);
        $("#value_unq_visits").html(values[2]);
        $("#value_pageviews").html(values[1]);
        $("#value_avg_pageviews").html(values[3]);
        $("#value_time_on_site").html(values[4]);
        $("#value_boundce_rate").html(values[5]);
        $("#value_new_visits").html(values[6]);
    }
}
function updateTableData(placeholder,data){
    placeholder.find("tbody").html("");
    if(data.length != 0){
        for(var i in data){
            placeholder.find("tbody").append("<tr><td class=\"landing\" colspan=\""+data[i][1].length+"\">"+data[i][0].replace(/\//g," /")+"</td></tr>");
            
            var rows = "";
            for(var j in data[i][1]){
                rows += "<td class=\"acenter\">"+data[i][1][j]+"</td>";
            }
            
            
            placeholder.find("tbody").append("<tr>"+rows+"</tr>");           
        }
    }    
    
    placeholder.parent(".block").parent("div").niceScroll({
        styler:"fb",
        cursorcolor:"#999"
    });
    placeholder.parent(".block").parent("div").getNiceScroll().resize().show();
}
function updateMapData(placeholder,dataTable){
    placeholder.html("");
    
    if(dataTable.length != 0){
        
        data = new google.visualization.DataTable();
        data.addColumn("string", "State");
        data.addColumn("number", "Visits");
                        
        for(var i in dataTable){            
            data.addRows([
                [dataTable[i][0], parseInt(dataTable[i][1][0].replace(",", ""))]
                ]);       
        }
        var c = new google.visualization.GeoChart(document.getElementById("demographicsMap"));
        c.draw(data, {
            keepAspectRatio: false,
            backgroundColor: "none",
            colorAxis: {
                minValue: 0,
                colors: ["#fff", getPref("graphColor1")]
            }
        });
    }        
}

function getData(){
    
    if(!getPref("account") || !getPref("profile")){
        $("#center").hide();
        $("#center2").show();
        return;
    }else{
        $("#center").show();
        $("#center2").hide();
    }
        
    if($("#block_1").is(":visible")){
        $("#graph").html('<img class="center" src="/images/preloader.gif"/>');
        bgPage.background.getOverviewData();
    }else if($("#block_2").is(":visible")){
        
        $.each( $("#block_2 table"), function( key, value ) {
            if($(value).is(":visible")){
                $(value).find("tbody").html('<tr><td class="acenter" colspan="'+$(value).find("thead th").length+'"><img class="acenter" src="/images/preloader.gif"/></td></tr>');
                bgPage.background.getTableData($(value), $(value).data("id"), $(value).data("segment"));
            }
        });
    }else if($("#block_3").is(":visible")){
        $.each( $("#block_3 table"), function( key, value ) {
            if($(value).is(":visible")){
                $(value).find("tbody").html('<tr><td class="acenter" colspan="'+$(value).find("thead th").length+'"><img class="acenter" src="/images/preloader.gif"/></td></tr>');
                bgPage.background.getTableData($(value), $(value).data("id"), $(value).data("segment"));
            }
        });
    }else if($("#block_4").is(":visible")){
                
        $.each( $("#block_4 .map"), function( key, value ) {
            if($(value).is(":visible")){
                $(value).html('<img class="center" src="/images/preloader.gif"/>');
                bgPage.background.getMapData($(value), $(value).data("id"), $(value).data("segment"));
            }
        });
        
        $.each( $("#block_4 table"), function( key, value ) {
            if($(value).is(":visible")){
                $(value).find("tbody").html('<tr><td class="acenter" colspan="'+$(value).find("thead th").length+'"><img class="acenter" src="/images/preloader.gif"/></td></tr>');
                bgPage.background.getTableData($(value), $(value).data("id"), $(value).data("segment"));
            }
        });
    }
};

$(document).ready(function() { 
    
    if(bgPage.background.token == undefined){
        bgPage.background.getGoogleAnalyticsToken();
        document.location.href = "auth.html";
        return;
    }
    
    _gaq.push(['_trackEvent', 'Popup', 'Popup shown']);
            
    /**
     * Load accounts profiles
     */
    initAccountList();
    initProfileList();
    
    initIntervalList();
    
    
    $("#label1box").css("borderColor", getPref("graphColor1"));
    $("#label2box").css("borderColor", getPref("graphColor2"));
    graphOptions.colors = [getPref("graphColor1"), getPref("graphColor2")];
       
    
    
    if(getPref("graphType1")){
        $("#graphType1 option[value="+getPref("graphType1")+"]").attr("selected", "selected");
    }else{
        setPref("graphType1", 0)
    }
    
    $("#graphType1").live("change",function(){
        _gaq.push(['_trackEvent', 'Popup', 'Graph 1 type set '+$("#graphType1 option:selected").val()]);
        
        setPref("graphType1", $("#graphType1 option:selected").val())
        getData();
        
        chrome.browserAction.setBadgeText({
            text: ""
        });   
    });
    
    if(getPref("graphType2")){
        $("#graphType2 option[value="+getPref("graphType2")+"]").attr("selected", "selected");
    }else{
        setPref("graphType2", "")
    }
    
    $("#graphType2").live("change",function(){
        _gaq.push(['_trackEvent', 'Popup', 'Graph 2 type set '+$("#graphType2 option:selected").val()]);
        setPref("graphType2", $("#graphType2 option:selected").val())
        getData();
        
        chrome.browserAction.setBadgeText({
            text: ""
        });   
    });
    
    getData();
    
    $("#accountsList").live("change",function(){
        setPref("account", $("#accountsList option:selected").val());
        setPref("profile", "");
        initProfileList();
        getData();
        
        chrome.browserAction.setBadgeText({
            text: ""
        });   
    });
    
    $("#profilesList").live("change",function(){
        setPref("profile", $("#profilesList option:selected").val());
        getData();
        
        chrome.browserAction.setBadgeText({
            text: ""
        });   
    });
    
    $("#intervalList").live("change",function(){
        _gaq.push(['_trackEvent', 'Popup', 'Data interval set', $("#intervalList option:selected").val(), parseInt($("#intervalList option:selected").val())]);
        setPref("interval", $("#intervalList option:selected").val());
        getData();
    });
    
    $("select").selectbox();    
    
    $('.duration select').live("change",function(){
        $('.duration .sbSelector').each(function(){
            var me = $(this);
            me.html( me.text().replace(/(^\w+)/,'<strong>$1</strong>') );
        });
    });
    
    $('.duration .sbSelector').each(function(){
        var me = $(this);
        me.html( me.text().replace(/(^\w+)/,'<strong>$1</strong>') );
    });
    
    
    $('#block_2 .block').live("click",function(){                       
        if($(this).find("table").is(":visible")){
            $(this).find("img.right").attr("src", "images/select-icons.png");            
            $(this).find("table").hide();     
            $(this).attr("title", "");
            $('#block_2 .block').show();
            $('#block_2 .block table').hide();
        }else{        
            $(this).find("img.right").attr("src", "images/select-icons2.png");   
            $(this).attr("title", "Click to return");
            $(this).find("table").show();
            _gaq.push(['_trackEvent', 'Popup', 'Table data detail shown ('+$(this).find("table").attr("id")+')']);
            $('#block_2 .block').hide();
            $(this).show();
            getData();                
        }
    });
    
    $('#block_3 .block').live("click",function(){        
        if($(this).find("table").is(":visible")){
            $(this).find("img.right").attr("src", "images/select-icons.png");            
            $(this).find("table").hide();     
            $(this).attr("title", "");
            $('#block_3 .block').show();
            $('#block_3 .block table').hide();
        }else{               
            $(this).find("img.right").attr("src", "images/select-icons2.png");   
            $(this).attr("title", "Click to return");
            $(this).find("table").show();
            _gaq.push(['_trackEvent', 'Popup', 'Table data detail shown ('+$(this).find("table").attr("id")+')']);
            $('#block_3 .block').hide();
            $(this).show();
            getData();            
        }
    });
    
    $('#block_4 .block').live("click",function(){        
        if($(this).find("table").is(":visible")){
            $(this).find("img.right").attr("src", "images/select-icons.png");            
            $(this).find("table").hide();     
            $(this).attr("title", "");
            $('#block_4 .block').show();
            $('#block_4 .block table').hide();
            $('#block_4 .block .map').hide();
            
            $('#block_4').niceScroll({
                styler:"fb",
                cursorcolor:"#999"
            });
            $('#block_4').getNiceScroll().resize().show();
        }else{               
            $(this).find("img.right").attr("src", "images/select-icons2.png");   
            $(this).attr("title", "Click to return");
            $(this).find("table").show();
            $(this).find(".map").show();
            _gaq.push(['_trackEvent', 'Popup', 'Table data detail shown ('+$(this).find("table").attr("id")+')']);
            $('#block_4 .block').hide();
            $(this).show();
            getData();            
        }
    });
    
    $('#footer .button').live("click",function(){
        $("#block_1").hide();
        $("#block_2").hide();
        $("#block_3").hide();
        $("#block_4").hide();
        
        $("#footer .button").removeClass("active");
        
        $("#block_"+$(this).attr("rel")).show();
        $("#footer .button_"+$(this).attr("rel")).addClass("active");                
        
        $("#block_"+$(this).attr("rel")).niceScroll({
            styler:"fb",
            cursorcolor:"#999"
        });
        $("#block_"+$(this).attr("rel")).getNiceScroll().resize().show();
        _gaq.push(['_trackEvent', 'Popup', 'Section shown ('+$(this).attr("rel")+')']);
        getData();
    });

});

var graphOptions = {
    colors: ["#e1c140", "#3ac3f1"],
    series: {
        lines: {
            show: true,
            fill: 0.03
        },
        grow:{
            active:true,
            steps:75,
            stepDelay:10,
            stepMode:"maximum",
            stepDirection :"up"
        }
    },
    points: {
        show: false,
        radius: 2, 
        fill: true,
        fillColor: "#ffffff"
    },
    xaxis: {
        tickColor: 'transparent',
        mode: "time",
        minTickSize: [1, "day"]
    },
    yaxes: [{
        min: 0
    }, {
        alignTicksWithAxis: 1,
        position: "right"
    }
    ],
    grid: {
        color: "#ddd",
        hoverable: true,
        clickable: true
    },
    legend: {
        show: false
    }
}



function lineGraphLegend() {
    $("#graph").unbind("plothover");
    $("#graph").bind("plothover", function (d, f, c) {
                
        if (f.x == null) {
            return
        }
        if (f.y == null) {
            return
        }
                
        $("#x").text(f.x.toFixed(2));
        $("#y").text(f.y.toFixed(2));
                
        if (c) {                    
            if (previousPoint.series != c.seriesIndex || previousPoint.data != c.dataIndex) {
                previousPoint.series = c.seriesIndex;
                previousPoint.data = c.dataIndex;
                $("#tooltip").remove();
                var a = c.datapoint[0].toFixed(2),
                e = c.datapoint[1].toFixed(2);
                var b = new Date(Math.round(a));
                
                if(c.series.type == "int"){
                    showTooltip(c.pageX -45, c.pageY, "<span style=\"font-size:10px; color:#999; font-weight:normal;\">"+b.getDate() + "." + (b.getMonth() + 1) + "." + b.getFullYear() + "</span><br /><strong>" + parseInt(c.series.data[c.dataIndex][1]) + "</strong>", c.series.color)
                }else if(c.series.type == "float"){
                    showTooltip(c.pageX -45, c.pageY, "<span style=\"font-size:10px; color:#999; font-weight:normal;\">"+b.getDate() + "." + (b.getMonth() + 1) + "." + b.getFullYear() + "</span><br /><strong>" + (c.series.data[c.dataIndex][1]).toFixed(2) + "</strong>", c.series.color)
                }else if(c.series.type == "percents"){
                    showTooltip(c.pageX -45, c.pageY, "<span style=\"font-size:10px; color:#999; font-weight:normal;\">"+b.getDate() + "." + (b.getMonth() + 1) + "." + b.getFullYear() + "</span><br /><strong>" + parseInt(c.series.data[c.dataIndex][1]) + "%</strong>", c.series.color)
                }else if(c.series.type == "time"){
                    showTooltip(c.pageX -45, c.pageY, "<span style=\"font-size:10px; color:#999; font-weight:normal;\">"+b.getDate() + "." + (b.getMonth() + 1) + "." + b.getFullYear() + "</span><br /><strong>" + pad(parseInt((c.series.data[c.dataIndex][1]/(60*60)) % (60)), 2)+":"+pad(parseInt((c.series.data[c.dataIndex][1]/60) % (60)),2)+":"+pad(parseInt(c.series.data[c.dataIndex][1] % 60),2) + "</strong>", c.series.color)
                }else{
                    showTooltip(c.pageX -45, c.pageY, "<span style=\"font-size:10px; color:#999; font-weight:normal;\">"+b.getDate() + "." + (b.getMonth() + 1) + "." + b.getFullYear() + "</span><br /><strong>" + parseInt(c.series.data[c.dataIndex][1]) + "</strong>", c.series.color)
                }
                
            }
        } else {
            $("#tooltip").remove();
            previousPoint = {
                series: null,
                data: null
            }
        }
    })
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function showTooltip(a, d, c, b) {
    $('<div id="tooltip">' + c + "</div>").css({
        position: "absolute",
        "z-index": "9999999999",
        display: "none",
        top: d + 15,
        left: a + 15,
        border: "1px solid " + b,
        padding: "5px",
        "background-color": "#fff",
        "font-size": "12px",
        "line-height:": "13px",
        opacity: 1,
        "-moz-box-shadow": "0 0 5px #888",
        "-webkit-box-shadow": "0 0 5px#888",
        "box-shadow": "0 0 5px #888",
        "-webkit-border-radius": "3px",
        "-moz-border-radius": "3px",
        "border-radius": "3px"
    }).appendTo("body").fadeIn(200)
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40485848-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
