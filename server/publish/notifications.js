Meteor.publish("notifications", function() {
	return Notifications.find({}, {});
});


Meteor.publish("myNotifications", function(userId) {
	return Notifications.find({toId: userId}, {sort: {timestamp: -1}});
});
