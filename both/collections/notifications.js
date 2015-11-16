Notifications = new Meteor.Collection('notifications');

Notifications.userCanInsert = function(userId, doc) {
	return true;
};

Notifications.userCanUpdate = function(userId, doc) {
	return true;
};

Notifications.userCanRemove = function(userId, doc) {
	return true;
};
