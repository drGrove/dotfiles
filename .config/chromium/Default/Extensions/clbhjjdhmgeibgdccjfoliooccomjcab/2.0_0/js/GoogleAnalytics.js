
function GoogleAnalytics()
{

    _gaq.push(['_setCustomVar', 1, 'Version', chrome.manifest.version, 1]);

    var that = this;
    
    var timer;
    
    var lastTrackedSearchTerm;
    
    var enabled = true;
    
    this.trackSearchTerm = function(searchTerm) {
        if (!enabled) {
            return;
        }

        clearTimeout(timer);
        if (lastTrackedSearchTerm === searchTerm.toString()) {
          return;
        }

        timer = setTimeout(function() {
            that.trackPageview('/search/' + searchTerm.toString());
            lastTrackedSearchTerm = searchTerm;
        }, 2000);
    };
    
    this.trackEvent = function(category, event, label, value) {
        if (!enabled) {
            return;
        }
        
        try {
            var data = [ '_trackEvent', category, event ];
            if (typeof label !== 'undefined') {
                data.push(label);
            }
            if (typeof value !== 'undefined') {
                data.push(value);
            }
            background.log('GA track event', data);
            _gaq.push(data);
        } catch (error) {
            console.log('GA Error:', error);
        }
    };
        
    this.trackPageview = function(page) {
        if (!enabled) {
            return;
        }

        background.log('GA track pageview', page);
        _gaq.push(['_trackPageview', page]);
    };
    
    this.setEnabled = function(val) {
        enabled = val;
    }

}
