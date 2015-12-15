Meteor.publish("transactions", function() {
	return Transactions.find({}, {});
});

Meteor.publish("myTransactions", function() {
	return Transactions.find({ "_id": Meteor.user().profile.transactionsId });
});
