Meteor.methods({
	'checkTransaction': function(){
		var userId = Meteor.userId();

		var _trans = Transactions.findOne({ userId: userId });

		if(!_trans) {
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
    
    /* ================================
        UPDATE -> Look 'stripe.js'
    ================================== */
    
});
