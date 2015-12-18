// Meteor.publish("transactions", function() {
// 	return Transactions.find({}, {});
// });

Meteor.publish("myTransaction", function() {

	var _user = Users.findOne({ _id: this.userId });
	return this.userId ? Transactions.find({ "_id": _user.secret.transactionsId }) : this.ready();

});
