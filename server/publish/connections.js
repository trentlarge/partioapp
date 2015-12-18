Meteor.publish("connections", function() {
	return Connections.find({}, {});
});

Meteor.publish("myConnections", function() {
	return Connections.find({ $or: [ { "owner": this.userId }, { "requestor": this.userId } ] })
});

Meteor.publish("singleConnect", function(connectionId) {
	var connection = Connections.findOne({ _id: connectionId });
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
		Connections.find({ connectionId: connectionId }, {}),
		Users.find({ _id: _idGuest }, { fields: { profile: 1 }})
	];
});
