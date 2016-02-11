Meteor.publish("talk", function(connectionId) {
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
		Talk.find({ connectionId: connectionId }, {}),
		Users.find({ _id: _idGuest }, { fields: { profile: 1 }})
	];
});
