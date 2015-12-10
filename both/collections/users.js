Users.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fieldNames, modifier) {
		return doc._id === userId && !_.contains(fieldNames, 'roles');
	},
	remove: function (userId, doc) {
		return false;
	}
});
