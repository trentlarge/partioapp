Talk.allow({
	insert: function (userId, doc) {
		return Talk.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Talk.userCanUpdate(userId, doc, fields, modifier);
	},

	remove: function (userId, doc) {
		return Talk.userCanRemove(userId, doc);
	}
});

Talk.before.insert(function(userId, doc) {

});

Talk.before.update(function(userId, doc, fieldNames, modifier, options) {

});

Talk.before.remove(function(userId, doc) {	

});

Talk.after.insert(function(userId, doc) {

});

Talk.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Talk.after.remove(function(userId, doc) {
	
});
