Talk = new Meteor.Collection('talk');

Talk.userCanInsert = function(userId, doc) {
	return !!userId;
};

Talk.userCanUpdate = function(userId, doc) {
	return false;
};

Talk.userCanRemove = function(userId, doc) {
	return false;
};
