Meteor.publish("connections", function() {
	return Connections.find({finished: { $ne: true }}, {});
});

Meteor.publish("myConnections", function() {
	return Connections.find({ $or: [ { "owner": this.userId, finished: { $ne: true } }, { "requestor": this.userId } ] })
});

Meteor.publish("singleConnect", function(connectionId) {
	var connection = Connections.findOne({ _id: connectionId, finished: { $ne: true } });
	if(!connection) {
		return this.ready();
	}

	var requestorId = connection.requestor;
	var ownerId = connection.productData.ownerId;

	if(this.userId == requestorId) {
		var _idGuest = ownerId;
	} else {
		var _idGuest = requestorId;
	}

	return [
		Connections.find({ connectionId: connectionId, finished: { $ne: true } }, {}),
		Users.find({ _id: _idGuest }, { fields: { profile: 1 }})
	];
});
