Meteor.publish("connections", function() {
	return Connections.find({}, {});
});

Meteor.publish("myConnectionsOwner", function() {
	return Connections.find({ "productData.ownerId": this.userId });
});
