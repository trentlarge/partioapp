Meteor.publish("adminSearchUserTransactions", function(userId) {
	return Transactions.find({ "userId": userId })	
});

Meteor.publish("transactions", function() {
	return Transactions.find({})
});

Meteor.publish("myTransaction", function() {
	return Transactions.find({ "userId": this.userId })	
});
