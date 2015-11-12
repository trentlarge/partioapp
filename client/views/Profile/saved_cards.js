Template.savedCards.events({
	'click #add-credit-card': function(e) {

		PartioLoad.show();

		stripeHandlerCredit.open({
			name: 'partiO',
			description: 'Add Card',
			zipCode: false,
			panelLabel: 'Save Card',
			email: Meteor.user().profile.email,
			allowRememberMe: false,
			opened: function() { PartioLoad.hide() },
			closed: function() { PartioLoad.hide() }
		});
		e.preventDefault();
	},
	'click #list-cards': function() {
		Meteor.call('listCards', function(error, result) {
			console.log(error, result);
		});
	},
	'click #add-debit-card': function(e) {

		PartioLoad.show();


		Meteor.call('createDebitAccount', Meteor.userId(), function(error, result) {
			if (!error) {

				stripeHandlerDebit.open({
					email: Meteor.user().profile.email,
					allowRememberMe: false,
					opened: function() { PartioLoad.hide() },
					closed: function() { PartioLoad.hide() }
				});
			}
		});
		e.preventDefault();
	},
	'click #test-card-1': function() {
		IonPopup.show({
			title: 'Test DEBIT cards',
			template: 	'<div class="center dark">\
							5200 8282 8282 8210<br>\
							4000 0566 5566 5556<br>\
							<br>\
							Expiry: Future Date<br>\
							CVV: Any 3 digits<br>\
						</div>',
			buttons:
			[{
				text: 'OK',
				type: 'button-energized',
				onTap: function() {
					IonPopup.close();
				}
			}]
		});
	},
	'click #test-card-2': function() {
		IonPopup.show({
			title: 'Test cards',
			template: 	'<div class="center dark">\
							CREDIT CARDS<br>\
							4242 4242 4242 4242<br>\
							5555 5555 5555 4444<br>\
							6011 1111 1111 1117<br>\
							<br>\
							DEBIT CARDS<br>\
							5200 8282 8282 8210<br>\
							4000 0566 5566 5556<br>\
							<br>\
							Expiry: Future Date<br>\
							CVV: Any 3 digits<br>\
						</div>',
			buttons:
			[{
				text: 'OK',
				type: 'button-energized',
				onTap: function() {
					IonPopup.close();
				}
			}]
		});
	}
});

Template.savedCards.onRendered(function() {
	stripeHandlerCredit = StripeCheckout.configure({
		key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
		token: function(token) {
			PartioLoad.show();
			console.log(token);
			Meteor.call('addPaymentCard', token.id, Meteor.user().profile.customer.id, Meteor.userId(), function(error, result) {
				PartioLoad.hide();
				console.log(error);
				console.log(result);
				if (Session.get('payRedirect')) {
					Router.go('/renting/connect/'+Session.get('payRedirect'));
				}
			})
		}
	});

	stripeHandlerDebit = StripeCheckout.configure({
		key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
		currency: 'usd',
		name: 'partiO',
		description: 'Add DEBIT Card',
		zipCode: false,
		default_for_currency : true,
		panelLabel: 'Save Card',
		token: function(token) {
			PartioLoad.show();
			console.log(token);
			Meteor.call('addDebitCard', token.id, Meteor.user().profile.stripeAccount.id, Meteor.userId(), function(error, result) {
				PartioLoad.hide();
				if (!error) {
					console.log('On successfully completing the transaction, add the book to the inventory');

					if(Session.get('BookAddType') == 'MANUAL')
					{
						AddProductToInventoryManually();
					}
					else
					{
						if(Session.get('scanResult') != null)
						{
							AddProductToInventory();
						}
					}

					PartioLoad.hide();
				} else {
					console.log(error)
				}
			})
		}
	});
})

Template.savedCards.helpers({
	addedCards: function() {
		if (!!Meteor.user().profile.cards) {
			return Meteor.user().profile.cards.data;
		}
	},
	addedDebitCard: function() {
		if (Meteor.user().profile.payoutCard && Meteor.user().profile.payoutCard.external_accounts.data) {
			return Meteor.user().profile.payoutCard.external_accounts.data[0];
		}
	}
})


function AddProductToInventoryManually()
{
  Products.insert(Session.get('manualBook'));
  Session.set('userPrice', null);
          PartioLoad.hide();
          IonPopup.show({
            title: 'Your Product sucessfully submitted',
            template: '<div class="center">You can find this shared item in your Repository</div>',
            buttons:
            [{
              text: 'OK',
              type: 'button-energized',
              onTap: function() {
                IonPopup.close();
                Router.go('/inventory');
                IonModal.close();
              }
            }]
          });
}

function AddProductToInventory() {
	var submitProduct = Session.get('scanResult');
	var insertData = _.extend(submitProduct,
	{
		"ownerId": Meteor.userId(),
		"customPrice": Session.get('userPrice')
	});

	Products.insert(insertData);
	Session.set('userPrice', null);
	PartioLoad.hide();
	IonPopup.show({
		title: 'Your Product sucessfully submitted',
		template: '<div class="center">And saved to your Inventory</div>',
		buttons:
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				Session.set('scanResult', null);
				IonPopup.close();
				Router.go('/inventory');
				IonModal.close();

			}
		}]
	});
}
