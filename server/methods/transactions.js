Meteor.methods({
	'createTransactions': function(){

	  //Creating Transactions Id
	  var userTransId = Transactions.insert({
	    earning: [],
	    spending: [],
      userId: this.userId
	  });

    console.log(' >>>>> creating new transactionsId ', userTransId);

	  //Meteor.users.update({"_id": Meteor.userId()}, {$set: {"secret.transactionsId": userTransId}});
	},
});
