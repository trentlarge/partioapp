Meteor.publish("connections", function() {
	return Connections.find({}, {});
});

Meteor.publish("myConnectionsOwner", function() {
	return Connections.find({ "productData.ownerId": this.userId });
});

Meteor.publish("singleConnect", function(idConnect) {
	console.log(idConnect);
	return Connections.find({ _id: idConnect}, {limit: 1});
});
