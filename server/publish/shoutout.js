Meteor.publish("shoutout", function() {
	return ShoutOut.find({}, {sort: {createdAt: -1}});
});

Meteor.publish("shoutoutDetails", function(shoutId) {
	return ShoutOut.find({_id: shoutId});
});