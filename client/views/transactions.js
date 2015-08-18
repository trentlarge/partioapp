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

Template.transactions.rendered = function() {
	Session.set('spendClicked', false);

}

Template.earningList.helpers({
	earning: function() {
		return Transactions.findOne(Meteor.user().profile.transactionsId).earning;
	},
	totalEarning: function() {
		var total = 0;
		var earningArray = Transactions.findOne(Meteor.user().profile.transactionsId).earning;
		earningArray.forEach(function(item) {
			total += item.receivedAmount
		});
		return Number(total).toFixed(2);
	}
});

Template.spendingList.helpers({
	spending: function() {
		return Transactions.findOne(Meteor.user().profile.transactionsId).spending;
	},
	totalSpending: function() {
		var total = 0;
		var earningArray = Transactions.findOne(Meteor.user().profile.transactionsId).spending;
		earningArray.forEach(function(item) {
			total += item.paidAmount
		});
		return Number(total).toFixed(2);
	}
})