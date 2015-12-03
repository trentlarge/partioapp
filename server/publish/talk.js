Meteor.publish("talk", function(connectionId) {
	var connection = Connections.findOne({ _id: connectionId });
	if(!connection) {
		return this.ready();
	}

	var requestorId = connection.requestor;
	var ownerId = connection.productData.ownerId;

	return [
		Talk.find({ connectionId: connectionId }, {}),
		Users.find({ _id: { $in: [ requestorId, ownerId ] }}, {})
	];
});
