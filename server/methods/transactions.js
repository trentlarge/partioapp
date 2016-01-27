Meteor.methods({
	'checkTransaction': function(userId){

		var _trans = Transactions.find({ userId: userId }).fetch();

		if(_trans.length < 1) {
			//Creating Transactions Id
			var userTransId = Transactions.insert({
				earning: [],
				spending: [],
				userId: userId
			});

			console.log(' >>>>> creating new transactionId ', userTransId);
		} else {
			console.log(' >>>>> transactionOk ', _trans._id);
		}
	  //Meteor.users.update({"_id": Meteor.userId()}, {$set: {"secret.transactionsId": userTransId}});
	},
});
