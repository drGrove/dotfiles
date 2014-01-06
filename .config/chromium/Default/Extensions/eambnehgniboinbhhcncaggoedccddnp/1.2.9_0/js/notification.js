function init(){
    var data = location.href.split('notification.html?data=')[1];
    document.getElementById('notification').innerHTML = unescape(data);
}
window.addEventListener("load",function(){  
    init();  
},false);