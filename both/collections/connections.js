Connections = new Meteor.Collection('connections');

Connections.deny({
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

// Connections.userCanInsert = function(userId, doc) {
// 	return !!userId && doc.owner == userId;
// };
//
// Connections.userCanUpdate = function(userId, doc, fieldNames, modifier) {
// 	return !!userId && (doc.owner == userId || doc.requestor == userId);
// };
//
// Connections.userCanRemove = function(userId, doc) {
// 	return !!userId && (doc.owner == userId || doc.requestor == userId);
// };
