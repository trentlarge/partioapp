ShoutOut = new Meteor.Collection('shoutout');

ShoutOut.userCanInsert = function(userId, doc) {
	return !!userId;
};

ShoutOut.userCanUpdate = function(userId, doc, fieldNames, modifier) {
	return false;
};

ShoutOut.userCanRemove = function(userId, doc) {
	return false;
};
