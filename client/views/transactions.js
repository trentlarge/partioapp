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
		if (Meteor.user() && Transactions.findOne(Meteor.user().profile.transactionsId)) {
			return Transactions.findOne(Meteor.user().profile.transactionsId).earning;	
		}
	},
	totalEarning: function() {
		if (Meteor.user() && Transactions.findOne(Meteor.user().profile.transactionsId)) {
			var total = 0;
			var earningArray = Transactions.findOne(Meteor.user().profile.transactionsId).earning;
			earningArray.forEach(function(item) {
				total += item.receivedAmount
			});
			return Number(total).toFixed(2);	
		} else {
			return Number(0).toFixed(2);
		}
	},
	earningAvailable: function() {
		if (Meteor.user() && Transactions.findOne(Meteor.user().profile.transactionsId)) {
			return Transactions.findOne(Meteor.user().profile.transactionsId).earning.length;
		}
	}
});

Template.spendingList.helpers({
	spending: function() {
		if (Meteor.user() && Transactions.findOne(Meteor.user().profile.transactionsId)) {
			return Transactions.findOne(Meteor.user().profile.transactionsId).spending;	
		}
	},
	totalSpending: function() {
		if (Meteor.user() && Transactions.findOne(Meteor.user().profile.transactionsId)) {
			var total = 0;
			var earningArray = Transactions.findOne(Meteor.user().profile.transactionsId).spending;
			earningArray.forEach(function(item) {
				total += item.paidAmount
			});
			return Number(total).toFixed(2);
		} else {
			return Number(0).toFixed(2);
		}

	},
	spendingAvailable: function() {
		if (Meteor.user() && Transactions.findOne(Meteor.user().profile.transactionsId)) {
			return Transactions.findOne(Meteor.user().profile.transactionsId).spending.length;
		}
	}
})