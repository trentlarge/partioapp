// !!!
// Temporary solution - publish all users until we setup correct pub/sub mechanism
//
Meteor.publish("all_users", function() {
	return Users.find({}, { fields: { profile: 1, emails: 1, roles: 1 } });
});
//
// !!!