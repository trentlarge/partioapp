Meteor.publish("connections", function() {
	return Connections.find({}, {});
});

Meteor.publish("myConnectionsOwner", function() {
	return this.userId ? Connections.find({ "productData.ownerId": this.userId }) : this.ready();
});

Meteor.publish("myConnectionsRequestor", function() {
	return this.userId ? Connections.find({ "requestor": this.userId }) : this.ready();
});

Meteor.publish("singleConnect", function(idConnect) {
	var cursor = Connections.find({ _id: idConnect}, {limit: 1});
  return Connections.publishJoinedCursors(cursor);
});
