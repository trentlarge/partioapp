// !!!
// Temporary solution - publish all users until we setup correct pub/sub mechanism
//

Meteor.publish("adminSearchUsers", function(text, limit) {
	return Users.find({
        'profile.name': { $regex: ".*"+text+".*", $options: 'i' },
    }, {
        limit: limit,
        sort: { 'profile.name': 1 },
        fields: { emails: 1, profile: 1, createdAt: 1 }
    });
});

Meteor.publish("userBestFriend", function(promoCode) {
	return Users.find({ 'private.promotions.friendShare.code': promoCode }, { fields: { profile: 1, 'private.promotions': 1 }});
});

Meteor.publish("userFriends", function(friends) {
	return Users.find({ _id: { $in: friends }}, { fields: { profile: 1 }});
});

Meteor.publish("searchSingleUser", function(idUser) {
	return Users.find({ _id: idUser }, { fields: { emails: 1, profile: 1, private: 1, createdAt: 1 }});
});

Meteor.publish("users", function() {
	return Users.find({}, { fields: { emails: 1, profile: 1, createdAt: 1 }});
//    return Users.find({});
});

Meteor.publish("all_users", function() {
	return Users.find({}, { fields: { profile: 1 }});
});

Meteor.publish("usersInArray", function(usersId) {
	return Users.find({ _id: { $in: usersId }}, { fields: { profile: 1 }});
});

Meteor.publish("userData", function() {
	return Users.find({ _id: this.userId }, { fields: { profile: 1, emails: 1, private: 1 }});
});

Meteor.publish("singleUser", function(idUser) {
	return Users.find({ _id: idUser }, { fields: { profile: 1 }});
});

Meteor.publish("adminUsers", function() {
	return Users.find({}, { sort: { 'profile.name': 1 }, fields: { emails: 1, profile: 1, private: 1 }});
});

Meteor.publish("adminUsersInArray", function(usersId) {
	return Users.find({ _id: { $in: usersId }}, { fields: { emails: 1, profile: 1, private: 1 }});
});