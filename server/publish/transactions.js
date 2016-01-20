Meteor.publish("myTransaction", function() {
	return Transactions.find({ "userId": this.userId })	
});
