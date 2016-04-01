ShoutOut = new Meteor.Collection('shoutout');

ShoutOut.deny({
	insert: function() {
		return true;
	},
	update: function() {
		return true;
	},
	remove: function() {
		return true;
	}
});

// ShoutOut.userCanInsert = function(userId, doc) {
// 	return !!userId;
// };
//
// ShoutOut.userCanUpdate = function(userId, doc, fieldNames, modifier) {
// 	return false;
// };
//
// ShoutOut.userCanRemove = function(userId, doc) {
// 	return false;
// };
