
function NaCl(listener) {

    var that = this;

    var ready = false;

    var module = listener.find('embed');

    // different callbacks based on what type of action I'm performing
    this.messageCallback = null;

    listener[0].addEventListener('load', function() {
        ready = true;
        background.initNaCl();
        // console.log('nacl module loaded');
    }, true);

    listener[0].addEventListener('message', function(msg) {
        if (that.messageCallback) {
            that.messageCallback(JSON.parse(msg.data));
        }
    }, true);

    this.sendMessage = function(action, jsonData) {
        module[0].postMessage(JSON.stringify({ 'action': action, 'data': jsonData}));
    };

    // if (ninja_module

}