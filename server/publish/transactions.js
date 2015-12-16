// Meteor.publish("transactions", function() {
// 	return Transactions.find({}, {});
// });

Meteor.publish("myTransaction", function() {
	return Transactions.find({ "_id": Users.findOne({ _id: this.userId }).secret.transactionsId });
});
