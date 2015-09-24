Template.savedCards.events({
	'click #add-credit-card': function(e) {
		IonLoading.show();
		
		stripeHandlerCredit.open({
			name: 'partiO',
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
	},
	'click #add-debit-card': function(e) {
		IonLoading.show();
		Meteor.call('createDebitAccount', Meteor.userId(), function(error, result) {
			if (!error) {

				stripeHandlerDebit.open({
					email: Meteor.user().profile.email,
					allowRememberMe: false,
					opened: function() {
						IonLoading.hide();
					}
				});
			}
		});
		e.preventDefault();
	}
});

Template.savedCards.onRendered(function() {
	stripeHandlerCredit = StripeCheckout.configure({
		key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
		token: function(token) {
			console.log(token);
			Meteor.call('addCreditCard', token.id, Meteor.user().profile.customer.id, Meteor.userId(), function(error, result) {
				IonLoading.hide();
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
			console.log(token);
			Meteor.call('addDebitCard', token.id, Meteor.user().profile.stripeAccount.id, Meteor.userId(), function(error, result) {
				IonLoading.hide();
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

					IonLoading.hide();
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
		if (!!Meteor.user().profile.payoutCard.external_accounts.data) {
			return Meteor.user().profile.payoutCard.external_accounts.data[0];
		}	
	}
})

// Template.bankAccount.events({
// 	'click #stripe-create': function(e, template) {
		
// 		console.log('creating a new stripe account');
		
// 		var firstname = template.find('#stripe-firstname').value;
// 		var lastname = template.find('#stripe-lastname').value;
// 		var ssn = template.find('#stripe-ssn').value;
// 		// var routingnumber = template.find('#stripe-routingnumber').value;
// 		var routingnumber = "110000000";
// 		// var bankaccount = template.find('#stripe-bankaccount').value;
// 		var bankaccount = "000123456789";

// 		if(ValidateInputs(firstname, lastname, ssn, routingnumber, bankaccount))
// 		{
// 			IonLoading.show();
// 			console.log(firstname, lastname, ssn, routingnumber, bankaccount);
// 			Meteor.call('createStripeAccount', firstname, lastname, ssn, routingnumber, bankaccount, Meteor.userId(), function(error, result) {
// 				if (!error) 
// 				{
// 					console.log('On successfully completing the transaction, add the book to the inventory');
					
// 					if(Session.get('BookAddType') == 'MANUAL')
// 					{
// 						AddProductToInventoryManually();
// 					}
// 					else
// 					{
// 						if(Session.get('scanResult') != null)
// 						{
// 							AddProductToInventory();								
// 						}
// 					}
									
// 					IonLoading.hide();
// 				} 
// 				else 
// 				{
// 					console.log(error);
// 				}
// 			})
// 		}		
// 	}
// });

// function ValidateInputs(strfirstname, strlastname, strssn, strroutingnumber, strbankaccount)
// {
// 	if(!strfirstname ||
// 		strfirstname.length < 1)
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter a valid First Name.');
// 		return false;
// 	}

// 	if(!strlastname ||
// 		strlastname.length < 1)
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter a valid Last Name.');
// 		return false;
// 	}

// 	if(!strssn ||
// 		strssn.length < 1)
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter a valid SSN.');
// 		return false;
// 	}

// 	if(strssn &&
// 		(strssn.length < 4 || strssn.length > 4))
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter last 4 digits of your SSN.');
// 		return false;
// 	}

// 	return true;
// }

// function showInvalidPopUp(strTitle, strMessage)
// {
// 	IonPopup.show({
//           title: strTitle,
//           template: '<div class="center">'+strMessage+'</div>',
//           buttons: 
//           [{
//             text: 'OK',
//             type: 'button-assertive',
//             onTap: function() 
//             {
//             	IonPopup.close();
//             }
//           }]
//         });
// }

function AddProductToInventoryManually()
{
  Products.insert(Session.get('manualBook'));
  Session.set('userPrice', null);
          IonLoading.hide();
          IonPopup.show({
            title: 'Your Product sucessfully submitted',
            template: '<div class="center">You can find this shared item in your Repository</div>',
            buttons: 
            [{
              text: 'OK',
              type: 'button-assertive',
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
	IonLoading.hide();
	IonPopup.show({
		title: 'Your Product sucessfully submitted',
		template: '<div class="center">And saved to your Inventory</div>',
		buttons: 
		[{
			text: 'OK',
			type: 'button-assertive',
			onTap: function() {
				Session.set('scanResult', null);
				IonPopup.close();
				Router.go('/inventory');
				IonModal.close();

			}
		}]
	});
}

// Template.bankAccount.helpers({
// 	noStripeYet: function() {
// 		if (Meteor.user() && ! Meteor.user().profile.stripeAccount) {
// 			return true; 
// 		}
// 	},
// 	stripeAccount: function() {
// 		return Meteor.user().profile.stripeAccount;
// 	}
// })




