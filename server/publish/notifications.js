Meteor.publish("myNotificationsReceived", function() {
	return this.userId ? Notifications.find({ toId: this.userId }, { sort: {timestamp: -1} }) : this.ready();
});
