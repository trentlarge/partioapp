Meteor.publish("connections", function() {
	return Connections.find({}, {});
});

Meteor.publish("myConnectionsOwner", function() {
	return Connections.find({ "productData.ownerId": this.userId });
});

Meteor.publish("myConnectionsRequestor", function() {
	return Connections.find({ "requestor": this.userId });
});

Meteor.publish("singleConnect", function(idConnect) {
	var cursor = Connections.find({ _id: idConnect}, {limit: 1});
  return Connections.publishJoinedCursors(cursor);
});
