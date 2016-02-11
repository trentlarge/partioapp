Notifications = new Meteor.Collection('notifications');

Notifications.userCanInsert = function(userId, doc) {
	return !!userId;
};

Notifications.userCanUpdate = function(userId, doc, fieldNames, modifier) {
	return !!userId && (doc.toId == userId || doc.fromId == userId);
};

Notifications.userCanRemove = function(userId, doc) {
	return !!userId && (doc.toId == userId || doc.fromId == userId);
};
