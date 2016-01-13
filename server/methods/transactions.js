Meteor.methods({
	'createTransactions': function(userId){

	  //Creating Transactions Id
	  var userTransId = Transactions.insert({
	    earning: [],
	    spending: [],
      	userId: userId
	  });

    console.log(' >>>>> creating new transactionsId ', userTransId);

	  //Meteor.users.update({"_id": Meteor.userId()}, {$set: {"secret.transactionsId": userTransId}});
	},
});
