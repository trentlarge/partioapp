Meteor.publish("myNotificationsReceived", function() {
	return Notifications.find({toId: this.userId}, {sort: {timestamp: -1}});
});
