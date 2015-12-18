// Meteor.publish("transactions", function() {
// 	return Transactions.find({}, {});
// });

Meteor.publish("myTransaction", function() {
	//var _user = Users.findOne({ _id: this.userId });
	return Transactions.find({ "userId": this.userId });
});
