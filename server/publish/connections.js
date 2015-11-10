Meteor.publish("connections", function() {
	return Connections.find({}, {});
});
