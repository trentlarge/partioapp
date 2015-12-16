// !!!
// Temporary solution - publish all users until we setup correct pub/sub mechanism
//
Meteor.publish("all_users", function() {
	return Users.find({}, { fields: { profile: 1 }});
});

Meteor.publish("userData", function() {
	return Users.find({ _id: this.userId }, { fields: { profile: 1, emails: 1, private: 1 }});
});

Meteor.publish("singleUser", function(idUser) {
	return Users.find({ _id: idUser }, { fields: { profile: 1 }});
});
