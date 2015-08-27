Template.bankAccount.events({
	'click #stripe-create': function(e, template) {
		IonLoading.show();
		console.log('creating a new stripe account');
		
		var firstname = template.find('#stripe-firstname').value;
		var lastname = template.find('#stripe-lastname').value;
		var ssn = template.find('#stripe-ssn').value;
		// var routingnumber = template.find('#stripe-routingnumber').value;
		var routingnumber = "110000000";
		// var bankaccount = template.find('#stripe-bankaccount').value;
		var bankaccount = "000123456789";

		console.log(firstname, lastname, ssn, routingnumber, bankaccount);
		Meteor.call('createStripeAccount', firstname, lastname, ssn, routingnumber, bankaccount, Meteor.userId(), function(error, result) {
			if (!error) {
				IonLoading.hide();
			} else {
				console.log(error);
			}
		})
	}
});

Template.bankAccount.helpers({
	noStripeYet: function() {
		if (Meteor.user() && ! Meteor.user().profile.stripeAccount) {
			return true; 
		}
	},
	stripeAccount: function() {
		return Meteor.user().profile.stripeAccount;
	}
})

Template.savedCards.events({
	'click #stripe-card': function(e) {
		IonLoading.show();
		
		stripeHandler.open({
			name: 'parti-O',
			description: 'Add Card',
			zipCode: false,
			panelLabel: 'Save Card',
			email: Meteor.user().profile.email,
			allowRememberMe: false,
			opened: function() {
				IonLoading.hide();
			}
		});
		e.preventDefault();
	},
	'click #list-cards': function() {
		Meteor.call('listCards', function(error, result) {
			console.log(error, result);
		});
	}
});

Template.savedCards.created = function() {
	stripeHandler = StripeCheckout.configure({
		key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
		token: function(token) {
			console.log(token);
			Meteor.call('addCard', token.id, Meteor.user().profile.customer.id, Meteor.userId(), function(error, result) {
				IonLoading.hide();
				console.log(error);
				console.log(result);
				if (Session.get('payRedirect')) {
					Router.go('/renting/connect/'+Session.get('payRedirect'));
				}
			})
		}
	});
}

Template.savedCards.helpers({
	addedCards: function() {
		if (!!Meteor.user().profile.cards) {
			return Meteor.user().profile.cards.data;
		}
	}
})


// Meteor.startup(function() {
// 	var handler = StripeCheckout.configure({
// 		key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
// 		image: '/img/documentation/checkout/marketplace.png',
// 		token: function(token) {
// 			console.log(token);
// 			console.log(token.id);
// 		}
// 	});    
// });



