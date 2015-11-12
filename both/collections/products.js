Products = new Meteor.Collection('products');

Products.userCanInsert = function(userId, doc) {
	return true;
};

Products.userCanUpdate = function(userId, doc) {
	return true;
};

Products.userCanRemove = function(userId, doc) {
	return true;
};
