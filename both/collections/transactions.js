Transactions = new Meteor.Collection('transactions');

Transactions.userCanInsert = function(userId, doc) {
	return true;
};

Transactions.userCanUpdate = function(userId, doc) {
	return true;
};

Transactions.userCanRemove = function(userId, doc) {
	return true;
};
