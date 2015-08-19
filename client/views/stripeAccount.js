Template.stripeAccount.events({
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
				var userTransId = Transactions.insert({
					earning: [],
					spending: []
				});
				Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.transactionsId": userTransId}});
				Meteor.call('createCustomer', Meteor.userId(), function(erorr, result) {
					IonLoading.hide();
					if (!error) {
						IonLoading.show({
							duration: 1500,
							delay: 400,
							customTemplate: '<div class="center"><h5>Payment profile created!</h5></div>',
						});
					}
				})
			}
		})
	},
	'click #stripe-card': function(e) {
		e.preventDefault();
		IonLoading.show();
		var handler = StripeCheckout.configure({
			key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
			token: function(token) {
				console.log(token);
				Meteor.call('addCard', token.id, Meteor.user().profile.customer.id, Meteor.userId(), function(error, result) {
					IonLoading.hide();
					console.log(error);
					console.log(result);
				})
			}
		});
		handler.open({
			name: 'parti-O',
			description: 'Add Card',
			zipCode: false,
			panelLabel: 'Save Card',
			email: Meteor.user().emails[0].address,
			allowRememberMe: false
		});
	},
	'click #list-cards': function() {
		Meteor.call('listCards', function(error, result) {
			console.log(error, result);
		});
	}
});

Template.stripeAccount.helpers({
	noStripeYet: function() {
		if (Meteor.user() && ! Meteor.user().profile.stripeAccount) {
			return true; 
		}
	},
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



