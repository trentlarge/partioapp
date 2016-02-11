Products = new Meteor.Collection('products');

Products.userCanInsert = function(userId, doc) {
	return !!userId;
};

Products.userCanUpdate = function(userId, doc, fieldNames, modifier) {
	return !!userId && doc.ownerId == userId;
};

Products.userCanRemove = function(userId, doc) {
	return !!userId && doc.ownerId == userId;
};
