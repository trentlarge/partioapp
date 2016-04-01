Products = new Meteor.Collection('products');

Products.deny({
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

// Products.userCanInsert = function(userId, doc) {
// 	return !!userId;
// };
//
// Products.userCanUpdate = function(userId, doc, fieldNames, modifier) {
// 	return !!userId && doc.ownerId == userId;
// };
//
// Products.userCanRemove = function(userId, doc) {
// 	return !!userId && doc.ownerId == userId;
// };
