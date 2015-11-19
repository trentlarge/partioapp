Meteor.publish("products", function() {
	return Products.find({}, {});
});

Meteor.publish("myProducts", function() {
	return Products.find({ ownerId: this.userId });
});
