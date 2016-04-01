Meteor.users.deny({
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

// Users.allow({
// 	insert: function (userId, doc) {
// 		return true;
// 	},
// 	update: function (userId, doc, fieldNames, modifier) {
// 		return doc._id === userId && !_.contains(fieldNames, 'roles');
// 	},
// 	remove: function (userId, doc) {
// 		return false;
// 	}
// });
