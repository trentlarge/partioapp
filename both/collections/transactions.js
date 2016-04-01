Transactions = new Meteor.Collection('transactions');

Transactions.deny({
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

// Transactions.userCanInsert = function(userId, doc) {
// 	return true;
// };
//
// Transactions.userCanUpdate = function(userId, doc, fieldNames, modifier) {
// 	return true;
// };
//
// Transactions.userCanRemove = function(userId, doc) {
// 	return true;
// };
