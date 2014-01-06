
(function($){
    
    $.fn.simpleProgressBar = function(options) {
        
        if (!options) {
            options = {
                max: 100
            };
        }
        
        var counterElm;
        
        var elm = $(this);
        elm.append($('<div>'));
        var bar = elm.find('div');
        if (options.counterElm) {
            counterElm = options.counterElm;
        }
        
        var maxWidth = elm.width() - parseInt(elm.css('border-left-width')) - parseInt(elm.css('border-right-width'));
        var minWidth = elm.find('div').width();
        
        this.progress = function(value) {
            this.progressPerc(value ? Math.round(value / options.max * 100) : 0);
        };
        
        this.progressPerc = function(percentage) {
            
            if (percentage > 100) {
                percentage = 100;
            }
            
            var width = Math.round(percentage / 100 * maxWidth);
            if (width < minWidth) {
                width = minWidth;
            }
            
            bar.width(width);
            
            if (counterElm) {
                counterElm.text(percentage);
            }
        };
    };
    
})(jQuery);