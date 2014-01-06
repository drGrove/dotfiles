
var smartPopup = {
    show: function(html) {
        if ($('#smartPopupBackground').length == 0) {
            $('body').prepend($('<div>', {
                id: 'smartPopupBackground',
                style: 'position:absolute; width:100%; height:100%; background:black; opacity:0.5; z-index:10; display:none;',
                onClick: 'smartPopup.hide();'
            }));
            $('body').prepend($('<div>', {
                id: 'smartPopupContent',
                style: 'position:absolute; z-index:11; display:none;'
            }));
        }
        
        $('#smartPopupContent').html(html)
                               .css('top', document.height / 2 - $('#smartPopupContent').height() / 2)
                               .css('left', document.width / 2 - $('#smartPopupContent').width() / 2)
                               .fadeIn(100);
        $('#smartPopupBackground').fadeIn(100);
    },

    hide: function() {
        $('#smartPopupContent').fadeOut(100);
        $('#smartPopupBackground').fadeOut(100);
    }
};
