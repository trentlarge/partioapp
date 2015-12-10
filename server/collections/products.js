Products.allow({
	insert: function (userId, doc) {
		return Products.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Products.userCanUpdate(userId, doc, fields, modifier);
	},

	remove: function (userId, doc) {
		return Products.userCanRemove(userId, doc);
	}
});


Products.before.insert(function(userId, doc) {

});

Products.before.update(function(userId, doc, fieldNames, modifier, options) {

});

Products.before.remove(function(userId, doc) {

});

Products.after.insert(function(userId, doc) {
	refreshSearch(userId, doc);
});

Products.after.update(function(userId, doc, fieldNames, modifier, options) {
	refreshSearch(userId, doc);
});

Products.after.remove(function(userId, doc) {
    refreshSearch(userId, doc);
});
