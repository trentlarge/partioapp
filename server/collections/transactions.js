Transactions.allow({
	insert: function (userId, doc) {
		return Transactions.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Transactions.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Transactions.userCanRemove(userId, doc);
	}
});

Transactions.before.insert(function(userId, doc) {

});

Transactions.before.update(function(userId, doc, fieldNames, modifier, options) {

});

Transactions.before.remove(function(userId, doc) {	

});

Transactions.after.insert(function(userId, doc) {

});

Transactions.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Transactions.after.remove(function(userId, doc) {
	
});
