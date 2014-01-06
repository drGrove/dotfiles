/**
 * @fileoverview Utils for E2E test.
 * @author haibinlu@google.com (Haibin Lu)
 */

/**
 * @param {angular.Scope} $scope The Angular scope object.
 * @constructor
 */
E2eTestUtilsCtrl = function($scope) {
  var backgroundSetup =
      chrome.extension.getBackgroundPage()['backgroundSetup'];

  $scope['getWebRtcStats'] = function() {
    $scope['webrtcStats'] = backgroundSetup.getWebRtcStats();
  };

  $scope['getMirrorId'] = function() {
    $scope['mirrorId'] = String(backgroundSetup.getMirrorId());
  };

  $scope['stopAllActivities'] = function() {
    backgroundSetup.stopAllActivities();
  };

  $scope['stopActivityById'] = function() {
    if (!$scope['activityIdToStop']) {
      return;
    }
    backgroundSetup.stopActivityById($scope['activityIdToStop']);
  };

  $scope['openTabThenMirror'] = function() {
    if (!$scope['url'] || !$scope['receiverIp']) {
      return;
    }
    backgroundSetup.openUrlThenMirror($scope['receiverIp'], $scope['url']);
  };

  $scope['desktopMirror'] = function() {
    if (!$scope['receiverIp']) {
      return;
    }
    backgroundSetup.desktopMirror($scope['receiverIp']);
  };
};
