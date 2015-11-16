Search.allow({
	insert: function (userId, doc) {
		return Search.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Search.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Search.userCanRemove(userId, doc);
	}
});

Search.before.insert(function(userId, doc) {

});

Search.before.update(function(userId, doc, fieldNames, modifier, options) {

});

Search.before.remove(function(userId, doc) {	

});

Search.after.insert(function(userId, doc) {

});

Search.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Search.after.remove(function(userId, doc) {
	
});
