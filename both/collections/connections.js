Connections = new Meteor.Collection('connections');

Connections.userCanInsert = function(userId, doc) {
	return true;
};

Connections.userCanUpdate = function(userId, doc) {
	return true;
};

Connections.userCanRemove = function(userId, doc) {
	return true;
};
