Meteor.publish("adminSearchConnections", function(text, limit) {
	return Connections.find({ 
        'productData.title': { $regex: ".*" + text + ".*", $options: 'i' }, 
    }, { 
        limit: limit, 
        sort: { 'requestDate': -1, 'productData.title': 1 }
    });
});

Meteor.publish("adminSingleConnection", function(connectionId) {
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
		Connections.find({ connectionId: connectionId }),
		Users.find({ _id: _idGuest }, { fields: { profile: 1 }})
	];
});

Meteor.publish("adminSearchUserConnections", function(userId) {
	return Connections.find({ $or: [ { "owner": userId }, { "requestor": userId } ] })
});

Meteor.publish("allConnections", function() {
	return Connections.find({});
});

Meteor.publish("connections", function() {
	return Connections.find({finished: { $ne: true }}, {});
});

Meteor.publish("myConnections", function() {
	return Connections.find({ $or: [ { "owner": this.userId, finished: { $ne: true } }, { "requestor": this.userId } ] })
});

Meteor.publish("ownerConnections", function(ownerId) {
	return Connections.find( { "owner": ownerId, finished: { $ne: true } } )
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
