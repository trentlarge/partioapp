Notifications.allow({
	insert: function (userId, doc) {
		return Notifications.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Notifications.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Notifications.userCanRemove(userId, doc);
	}
});

Notifications.before.insert(function(userId, doc) {

});

Notifications.before.update(function(userId, doc, fieldNames, modifier, options) {

});

Notifications.before.remove(function(userId, doc) {	

});

Notifications.after.insert(function(userId, doc) {

});

Notifications.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Notifications.after.remove(function(userId, doc) {
	
});
