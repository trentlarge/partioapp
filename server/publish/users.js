// !!!
// Temporary solution - publish all users until we setup correct pub/sub mechanism
//
Meteor.publish("all_users", function() {
	return Users.find({}, { fields: { profile: 1, emails: 1, roles: 1 } });
});

//Meteor.publish("productOwner", function(productId) {
//    return Users.findOne(Products.findOne(productId).ownerId);
//});

Meteor.publish("singleUser", function(idUser) {
	return Users.find({ _id: idUser }, { fields: { profile: 1, emails: 1, roles: 1 }}, { limit: 1 });
});

Meteor.publish("manyUsersById", function(idUsers) {
	console.log(idUsers);
	//return Users.find({ _id: idUser }, { fields: { profile: 1, emails: 1, roles: 1 }}, { limit: 1 });
});

// Meteor.publish("myAddedCards", function(idUsers) {
// 	return Meteor.user().profile.cards.data;
// 	//return Users.find({ _id: idUser }, { fields: { profile: 1, emails: 1, roles: 1 }}, { limit: 1 });
// });
//
// Meteor.publish("myAddedDebitCard", function(idUsers) {
// 	return Meteor.user().profile.payoutCard.external_accounts.data[0];
// 	//return Users.find({ _id: idUser }, { fields: { profile: 1, emails: 1, roles: 1 }}, { limit: 1 });
// });
//




//
// !!!
