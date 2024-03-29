// !!!
// Temporary solution - publish all users until we setup correct pub/sub mechanism
//

Meteor.publish("users", function() {
	return Users.find({}, { fields: { emails: 1, profile: 1, createdAt: 1 }});
//    return Users.find({});
});

Meteor.publish("all_users", function() {
	return Users.find({}, { fields: { profile: 1 }});
});

Meteor.publish("userData", function() {
	return Users.find({ _id: this.userId }, { fields: { profile: 1, emails: 1, private: 1 }});
});

Meteor.publish("singleUser", function(idUser) {
	return Users.find({ _id: idUser }, { fields: { profile: 1 }});
});
