
var smartPopup = {
    show: function(html) {
        if ($('#smartPopupBackground').length == 0) {
            $('body').prepend($('<div>', {
                id: 'smartPopupBackground',
                style: 'position:absolute; width:100%; height:100%; background:black; opacity:0.3; z-index:10; display:none;',
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
                               .fadeIn(200);
        $('#smartPopupBackground').fadeIn(200);
    },

    hide: function() {
        $('#smartPopupContent, #smartPopupBackground').fadeOut(200);
    }
};
