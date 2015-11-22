Meteor.publish("notifications", function() {
	return Notifications.find({}, {});
});

Meteor.publish("myNotificationsReceived", function(userId) {
	return Notifications.find({toId: userId}, {sort: {timestamp: -1}});
});
