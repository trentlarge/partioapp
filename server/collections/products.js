Products.allow({
	insert: function (userId, doc) {
		return Products.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Products.userCanUpdate(userId, doc);
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

});

Products.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Products.after.remove(function(userId, doc) {
	
});
