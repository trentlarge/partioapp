Meteor.publish("products", function() {
	return Products.find({}, {});
});

Meteor.publish("myProducts", function() {
	return Products.find({ ownerId: this.userId });
});

Meteor.publish("productsListOwner", function(_ownerId) {
	console.log(_ownerId);
	return Products.find({ ownerId: _ownerId });
});

Meteor.publish("singleProduct", function(idProduct) {
	return Products.find({ _id: idProduct}, {limit: 1});
});

Meteor.publish("productsByTitle", function(_title) {
  var cursor = Products.find({ title: _title});
  return Products.publishJoinedCursors(cursor);
});
