// You'll usually only ever have to create one service instance.
var service = analytics.getService('space_game');

// You can create as many trackers as you want. Each tracker has its own state
// independent of other tracker instances.
var tracker = service.getTracker('UA-76519243-1');  // Supply your GA Tracking ID.
tracker.sendAppView("Index");