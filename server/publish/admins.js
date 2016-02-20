Meteor.publish("admins", function() {
	return Admins.find({});
});

Meteor.publish("userAdmin", function(userEmail) {
	return Admins.find({email: userEmail});
});