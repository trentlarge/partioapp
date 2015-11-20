Meteor.publish("products", function() {
	return Products.find({}, {});
});

Meteor.publish("myProducts", function() {
	return Products.find({ ownerId: this.userId });
});


Meteor.publish("singleProduct", function(idProduct) {
	return Products.find({ _id: idProduct}, {limit: 1});
});

Meteor.publish("productsByTitle", function(_title) {
	return Products.find({ title: _title});
});
