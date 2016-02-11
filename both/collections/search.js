Search = new Meteor.Collection('search');

Search.userCanInsert = function(userId, doc) {
	return !!userId;
};

Search.userCanUpdate = function(userId, doc, fieldNames, modifier) {
	return !!userId;
};

Search.userCanRemove = function(userId, doc) {
	return !!userId;
};
