Meteor.publish("transactions", function() {
	return Transactions.find({}, {});
});

Meteor.publish("myTransaction", function() {
	return this.userId ? Transactions.find({ "_id": Users.findOne({ _id: this.userId }).profile.transactionsId }) : this.ready();
});
