Template.transactions.helpers({
	spendingClicked: function() {
		return Session.get('spendClicked');
	}
});

Template.transactions.events({
	'click #earningButton': function(e) {
		// $(e.target).addClass('tab-bg');
		Session.set('spendClicked', false);
	},
	'click #spendingButton': function() {
		Session.set('spendClicked', true);
	}
});

Session.setDefault('spendClicked', false);

// Template.transactions.rendered = function() {
// 	Session.set('spendClicked', false);
// }

Template.earningList.helpers({
	earning: function() {
		if(!Meteor.user()) {
			return 0;
		}

		var transaction = Transactions.findOne(Meteor.user().profile.transactionsId);
		if(!transaction) {
			return 0;
		}

		return transaction.earning;
	},
	totalEarning: function() {
		if(!Meteor.user()) {
			return Number(0).toFixed(2);
		}

		var transaction = Transactions.findOne(Meteor.user().profile.transactionsId);

		if(transaction) {
			var total = 0;
			var earningArray = transaction.earning;
			earningArray.forEach(function(item) {
				total += (item.receivedAmount || 0);
			});
			return Number(total).toFixed(2);
		}
		return Number(0).toFixed(2);
	},
	earningAvailable: function() {
		if(!Meteor.user()) {
			return 0;
		}

		var transaction = Transactions.findOne(Meteor.user().profile.transactionsId);
		if(transaction) {
			return transaction.earning.length;
		}
		return 0;
	},
    
    getDate: function() {
        return formatDate(this.date);
    },
    
    getAmount: function() {
        return Number(this.receivedAmount).toFixed(2);  
    },
});

Template.spendingList.helpers({
	spending: function() {
		if(!Meteor.user()) {
			return 0;
		}

		var transaction = Transactions.findOne(Meteor.user().profile.transactionsId);
		if(!transaction) {
			return 0;
		}

		return transaction.spending;
	},

	totalSpending: function() {
		if(!Meteor.user()) {
			return Number(0).toFixed(2);
		}

		var transaction = Transactions.findOne(Meteor.user().profile.transactionsId);

		if(transaction) {
			var total = 0;
			var spendingArray = transaction.spending;
			spendingArray.forEach(function(item) {
				total += (item.paidAmount || 0);
			});
			return Number(total).toFixed(2);
		}
		return Number(0).toFixed(2);
	},

	spendingAvailable: function() {
		if(!Meteor.user()) {
			return 0;
		}

		var transaction = Transactions.findOne(Meteor.user().profile.transactionsId);
		if(transaction) {
			return transaction.spending.length;
		}
		return 0;
	},
    
    getDate: function() {
        return formatDate(this.date);
    },
    
    getAmount: function() {
        return Number(this.paidAmount).toFixed(2);  
    },
});
