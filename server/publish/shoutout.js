Meteor.publish("shoutout", function() {
	return ShoutOut.find({}, {sort: {createdAt: -1}});
});