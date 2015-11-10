Search = new Meteor.Collection('search');

Search.userCanInsert = function(userId, doc) {
	return true;
};

Search.userCanUpdate = function(userId, doc) {
	return true;
};

Search.userCanRemove = function(userId, doc) {
	return true;
};
