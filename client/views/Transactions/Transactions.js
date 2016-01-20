Template.transactions.onCreated(function () {
  this.subscribe('myTransaction');
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