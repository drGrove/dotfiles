/**
 * @fileoverview Run script for widget.html
 */
var callWidget;
function showWidget() {
  if (callWidget) {
    callWidget.reloadWidget();
  } else {
    callWidget = new CallWidget('widget');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  showWidget();
});

document.addEventListener('hashchange', function () {
  showWidget();
});
