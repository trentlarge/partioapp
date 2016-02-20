Meteor.publish("shoutout", function(limit) {
	return ShoutOut.find({}, { limit: limit, sort: {createdAt: -1} });
});

Meteor.publish("myShoutout", function(userId, limit) {
	return ShoutOut.find({ 'user.id': userId }, { limit: limit, sort: { createdAt: -1 }});
});

Meteor.publish("shoutoutDetails", function(shoutId) {
	return ShoutOut.find({ _id: shoutId });
});