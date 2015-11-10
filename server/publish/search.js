Meteor.publish("search", function() {
	return Search.find({}, {});
});
