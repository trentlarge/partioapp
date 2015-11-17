Connections.allow({
	insert: function (userId, doc) {
		return Connections.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Connections.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Connections.userCanRemove(userId, doc);
	}
});

Connections.before.insert(function(userId, doc) {

});

Connections.before.update(function(userId, doc, fieldNames, modifier, options) {

});

Connections.before.remove(function(userId, doc) {	

});

Connections.after.insert(function(userId, doc) {

});

Connections.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Connections.after.remove(function(userId, doc) {
	
});