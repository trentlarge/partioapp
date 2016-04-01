Talk = new Meteor.Collection('talk');

Talk.deny({
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

// Talk.userCanInsert = function(userId, doc) {
// 	return !!userId;
// };
//
// Talk.userCanUpdate = function(userId, doc, fieldNames, modifier) {
// 	return false;
// };
//
// Talk.userCanRemove = function(userId, doc) {
// 	return false;
// };
