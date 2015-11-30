Template.savedCards.getCreditCards = function(){
	var result = []

	if (Meteor.user().profile.cards) {
		var cards = Meteor.user().profile.cards.data;

		if(cards.length > 0) {
			for (var i = 0; i < cards.length; i++) {
				var _card = cards[i];
				if(_card.funding == 'credit') {
					result.push(_card);
				}
			}
		}
	}

	return result;
}

Template.savedCards.getDebitCards = function(){
	var result = []

	if (Meteor.user().profile.cards) {
		var cards = Meteor.user().profile.cards.data;

		if(cards.length > 0) {
			for (var i = 0; i < cards.length; i++) {
				var _card = cards[i];
				if(_card.funding == 'debit') {
					result.push(_card);
				}
			}
		}
	}

	return result;
}

Template.savedCards.defaultReceive = function(){
	if (Meteor.user().profile) {
		return Meteor.user().profile.defaultReceive;
	}
}

Template.savedCards.defaultPay = function(){
	if (Meteor.user().profile) {
		return Meteor.user().profile.defaultPay;
	}
}

Cards = {
	defaultReceive: false,
	defaultPay: false,
	creditCards: false,
	debitCards: false,

	//refrshing this object
	refresh: function(){
		this.creditCards = Template.savedCards.getCreditCards();
		this.debitCards = Template.savedCards.getDebitCards();
		this.defaultPay = Template.savedCards.defaultPay();
		this.defaultReceive = Template.savedCards.defaultReceive();
		this.checkStatus();
	},

	//check user situation with the cards
	checkStatus: function(){
		console.log(this.creditCards.length, this.debitCards.length)

		//if there are cards
		if(this.debitCards.length > 0 || this.creditCards.length > 0) {

			//there are debit card(s)
			if(this.debitCards.length > 0) {

				//there ins't default receive or pay card
				if(!this.defaultReceive || !this.defaultPay) {
					var payCard = false;
					var receiveCard = false;

					if(!this.defaultReceive) {
						receiveCard = this.debitCards[0];
					}

					if(!this.defaultPay) {
						payCard = this.debitCards[0];
					}

					//this.defaultReceive = this.debitCards[0];
					this.setDefaultCards(receiveCard, payCard);
					//saveDefaultCards = true;
				}

				this.setStatus('ok');

			//no debit card(s)
			} else {

				//there are credit card(s)
				if(this.creditCards.length > 0){
					if(!this.defaultPay) {
						var receiveCard = false;
						var payCard = this.creditCards[0];
						this.setDefaultCards(receiveCard, payCard);
					}
				}

				this.setStatus('no_receive');
			}

		//no cards
		} else {
			this.setStatus('no_cards');
		}
	},

	//showing user 'alerts'
	setStatus: function(param){
		$('.alerts').addClass('hidden');

		switch (param) {
			case 'ok':
				$('.alerts').addClass('hidden');
				console.log('cards ok')
			break;
			case 'no_receive':
				console.log('only credit');
				$('.only-credit').removeClass('hidden');
			break;
			case 'no_cards':
				console.log('no cards');
				$('.no-cards').removeClass('hidden');
			break;
			default:
		}
	},

	//setting default cards
	setDefaultCards: function(receiveCard, payCard){
		if(!receiveCard && !payCard) {
			return false;
		}
		//var cardData = this.getCardById(cardId);

		Meteor.call('saveDefaultCards', receiveCard, payCard, function (err, result){
			console.log('saveDefaultCards > saving default cards')

			if(err) {
				console.log(err);
				return false;
			}

			if(result) {
				this.defaultReceive = receiveCard;
				this.defaultPay = payCard;

				console.log('saveDefaultCards > setting default cards ok');
			}
		});
	},

	//removing a card
	remove: function(cardId){
		if(!cardId){
			console.log('need a cardId')
			return false;
		}

		PartioLoad.show();

		Meteor.call('removeCard', cardId, function(error, result) {
			if(error) {
				console.log('removeCard > some error');
			} else {
				console.log('removeCard > ok');
				Cards.refresh();
				PartioLoad.hide();
			}
		});
	},
}

Template.savedCards.events({
	'click #add-card': function(e) {
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

	'click #test-card': function() {
		IonPopup.show({
			title: 'Test cards',
			template: '<div class="center dark">\
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
			buttons: [{
				text: 'OK',
				type: 'button-energized',
				onTap: function() {
					IonPopup.close();
				}
			}]
		});
	},

	'click .set-default': function(e){
		var cardData = this;
		var cardId = cardData.id;
		var funding = cardData.funding;

		if(!cardId || !funding) {
			console.log('event set-default > missing data')
			return false;
		}

		IonPopup.confirm({
			title: 'Set default card',
			template: '<div class="center">Do you want set this card how default?</div>',
			onCancel: function(){
				console.log('Cancelled')
			},

			onOk: function(){
				var receiveCard = false;
				var payCard = false;
				var _pay = false;
				var _receive = false;

				if(funding == 'credit') {
					_pay = true;
				} else if(funding == 'debit') {
					_pay = true;
					_receive = true;
				}

				if(_pay) {
					payCard = cardData;
				}

				if(_receive) {
					receiveCard = cardData;
				}

				Cards.setDefaultCards(receiveCard, payCard);
			}
		});
	},

	'click .delete-card': function(e){
		var cardId = this.id;

		if(!cardId){
			console.log('setCard > need a card ID')
			return false;
		}

		IonPopup.confirm({
			title: 'Set default card',
			template: '<div class="center">Do you want remove this card?</div>',
			onCancel: function(){
				console.log('Cancelled')
			},
			onOk: function(){
				Cards.remove(cardId);
			}
		});
	}
});

Template.savedCards.onRendered(function() {
	Cards.refresh();

	stripeHandlerCredit = StripeCheckout.configure({
		key: Meteor.settings.public.STRIPE_PUBKEY,

		token: function(token) {
			PartioLoad.show();
			console.log(token);

			Meteor.call('addCard', token.id, function(error, result) {
				PartioLoad.hide();

				if(error) {
					console.log('some error', error)
					return false;

				} else {
					Cards.refresh();
				}

				//if(result) {


					// if (Session.get('payRedirect')) {
					// 	Router.go('/renting/connect/'+Session.get('payRedirect'));
					// }
				//}
			})
		}
	});
})


// set: function(cardId){
// 	if(!cardId)
// 		console.log('set > need a card ID')
// 		return false;
//
//
// 	Meteor.call('set', cardId, function (err, result){
// 		console.log('set '+cardId)
//
// 		if(err)
// 			console.log(err);
// 			return false;
//
// 		if(result)
// 			console.log('set > ok')
// 			this.checkStatus();
// 	});
// },
		// console.log('set card'+cardId);
		//
		// 	var _pay = false;
		// 	var _receive = false;
		// 	var _card = false;
		//
		// 	this.list.data.map(function(card){
		// 		if(card.id == cardId){
		// 			if(funding == 'credit') {
		// 				_pay = true;
		// 				_card = card;
		// 			} else if(funding == 'debit') {
		// 				_pay = true;
		// 				_receive = true;
		// 				_card = card;
		// 			}
		// 		}
		// 	})
		//
		// 	if(_pay)
		// 		this.defaultPay = _card;
		//
		// 	if(_receive)
		// 		this.defaultReceive = _card;
		//
		// 	this.saveDefaults();


// METHODS --------------------------------------------
// setCard = function(cardId) {
// 	if(!cardId)
// 		console.log('setCard > need a card ID')
// 		return false;
//
// 	IonPopup.confirm({
// 		title: 'Set default card',
// 		template: '<div class="center">Do you want set this card how default?</div>',
// 		onCancel: function(){
// 			console.log('Cancelled')
// 		},
// 		onOk: function(){
// 			Cards.set(cardId);
// 		}
// 	});
// },
//
// deleteCard = function(cardId) {
// 	// 	if(!cardId)
// 		console.log('setCard > need a card ID')
// 		return false;
//
// 	IonPopup.confirm({
// 		title: 'Set default card',
// 		template: '<div class="center">Do you want set this card how default?</div>',
// 		onCancel: function(){
// 			console.log('Cancelled')
// 		},
// 		onOk: function(){
// 			Cards.set(cardId);
// 		}
// 	});
// },
// },

// console.log('RESULTADO STRIPE');
// if(token.card.funding === 'debit'){
//
// 			IonPopup.confirm({
// 				title: 'Card Debit Add Receive ',
// 				template: '<div class="center">Want to add this card to receipts?</div>',
// 				onCancel: function()
// 				{
// 					console.log('Cancelled')
// 				},
// 				onOk: function()
// 				{
// 					console.log('Ok adicionado');
//
// 							// add Receive funds debit
// 							Meteor.call('createDebitAccount', Meteor.userId(), function(error, result) {
// 									console.log('STRIPE ACOUNT GERADO');
// 									console.log('token.id: '+token.id);
// 									console.log('Meteor.user().profile.customer.id: '+Meteor.user().profile.stripeAccount.id);
// 									console.log('Meteor.userId(): '+Meteor.userId());
//
// 									stripeHandlerCredit = StripeCheckout.configure({
// 										key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
// 										token: function(token) {
// 											PartioLoad.show();
// 											console.log(token);
// 											Meteor.call('addDebitCard', token.id, Meteor.user().profile.stripeAccount.id, Meteor.userId(), function(error, result) {
// 												PartioLoad.hide();
// 												if (!error) {
// 													console.log('On successfully completing the transaction, add the book to the inventory');
// 													PartioLoad.hide();
// 												} else {
// 													console.log(error)
// 												}
// 											})
// 										}
//
// 									});
//
// 							});
// 				}
// 			});
//
// }

// stripeHandlerDebit = StripeCheckout.configure({
// 	key: 'pk_test_OYfO9mHIQFha7How6lNpwUiQ',
// 	currency: 'usd',
// 	name: 'partiO',
// 	description: 'Add DEBIT Card',
// 	zipCode: false,
// 	default_for_currency : true,
// 	panelLabel: 'Save Card',
// 	token: function(token) {
// 		PartioLoad.show();
//
//
// 		Meteor.call('addDebitCard', token.id, Meteor.user().profile.stripeAccount.id, Meteor.userId(), function(error, result) {
// 			PartioLoad.hide();
// 			if (!error) {
// 				console.log('On successfully completing the transaction, add the book to the inventory');
//
//
//
// 				// if(Session.get('BookAddType') == 'MANUAL')
// 				// {
// 				// 	AddProductToInventoryManually();
// 				// }
// 				// else
// 				// {
// 				// 	if(Session.get('scanResult') != null)
// 				// 	{
// 				// 		AddProductToInventory();
// 				// 	}
// 				// }
//
// 				PartioLoad.hide();
// 			} else {
// 				console.log(error)
// 			}
// 		})
// 	}
// });

//Template.savedCards.helpers({
	// teste : function(){
	// 	return 'opa';
	// }
	// addedCards: function() {
	// 	if (!!Meteor.user().profile.cards) {
	// 		return Meteor.user().profile.cards.data;
	// 	}
	// },
	// addedDebitCard: function() {
	// 	if (Meteor.user().profile.payoutCard && Meteor.user().profile.payoutCard.external_accounts.data) {
	// 		return Meteor.user().profile.payoutCard.external_accounts.data[0];
	// 	}
	// }
//})

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
// 			PartioLoad.show();
// 			console.log(firstname, lastname, ssn, routingnumber, bankaccount);
// 			Meteor.call('createStripeAccount', firstname, lastname, ssn, routingnumber, bankaccount, Meteor.userId(), function(error, result) {
// 				if (!error)
// 				{
// 					console.log('On successfully completing the transaction, add the book to the inventory');

// 					if(SlistdProductToInventoryManually();
// 					}
// 					else
// 					{
// 						if(Session.get('scanResult') != null)
// 						{
// 							AddProductToInventory();
// 						}
// 					}

// 					PartioLoad.hide();
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
//             type: 'button-energized',
//             onTap: function()
//             {
//             	IonPopup.close();
//             }
//           }]
//         });
// }

// function AddProductToInventoryManually(){
//   Products.insert(Session.get('manualBook'));
//   Session.set('userPrice', null);
//           PartioLoad.hide();
//           IonPopup.show({
//             title: 'Your Product sucessfully submitted',
//             template: '<div class="center">You can find this shared item in your Repository</div>',
//             buttons:
//             [{
//               text: 'OK',
//               type: 'button-energized',
//               onTap: function() {
//                 IonPopup.close();
//                 Router.go('/inventory');
//                 IonModal.close();
//               }
//             }]
//           });
// }
//
// function AddProductToInventory() {
// 	var submitProduct = Session.get('scanResult');
// 	var insertData = _.extend(submitProduct,
// 	{
// 		"ownerId": Meteor.userId(),
// 		"customPrice": Session.get('userPrice')
// 	});
//
// 	Products.insert(insertData);
// 	Session.set('userPrice', null);
// 	PartioLoad.hide();
// 	IonPopup.show({
// 		title: 'Your Product sucessfully submitted',
// 		template: '<div class="center">And saved to your Inventory</div>',
// 		buttons:
// 		[{
// 			text: 'OK',
// 			type: 'button-energized',
// 			onTap: function() {
// 				Session.set('scanResult', null);
// 				IonPopup.close();
// 				Router.go('/inventory');
// 				IonModal.close();
//
// 			}
// 		}]
// 	});
// }

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


	// init: function(){
	// 	this.updateList();
	// },

	// updateList: function(){
	// 	var _creditCards = [];
	// 	var _debitCards = [];
	//
	// 	$('.item-card').each(function(index, item){
	// 		switch ($(item).data('funding')) {
	// 			case 'credit':
	// 				_creditCards.push($(item).data('id'));
	// 			break;
	// 			case 'debit':
	// 				_debitCards.push($(item).data('id'));
	// 			break;
	// 		}
	// 	});
	//
	// 	this.creditCards = _creditCards;
	// 	this.debitCards = _debitCards;
	//
	// 	//this.checkDefaults();
	// },

	// 	var _pay = false;
		// 	var _receive = false;
		// 	var _card = false;
		//
		// 	this.list.data.map(function(card){
		// 		if(card.id == cardId){
		// 			if(funding == 'credit') {
		// 				_pay = true;
		// 				_card = card;
		// 			} else if(funding == 'debit') {
		// 				_pay = true;
		// 				_receive = true;
		// 				_card = card;
		// 			}
		// 		}
		// 	})
		//
		// 	if(_pay)
		// 		this.defaultPay = _card;
		//
		// 	if(_receive)
		// 		this.defaultReceive = _card;

	// setCard: function(cardId){
	// 	if(!cardId){
	// 		return false;
	// 	}
	//
	// 	console.log('set card'+cardId);

			// var _pay = false;
			// var _receive = false;
			// var _card = false;
			//
			// this.list.data.map(function(card){
			// 	if(card.id == cardId){
			// 		if(funding == 'credit') {
			// 			_pay = true;
			// 			_card = card;
			// 		} else if(funding == 'debit') {
			// 			_pay = true;
			// 			_receive = true;
			// 			_card = card;
			// 		}
			// 	}
			// })
			//
			// if(_pay)
			// 	this.defaultPay = _card;
			//
			// if(_receive)
			// 	this.defaultReceive = _card;
			//
			// this.saveDefaults();
	//	},


	// check: function(){
	// 	if(!this.list) {
	// 		return false;
	// 	}
	//
	// 	var saveDefaultCards = false;
	//
	// 	//there is cards
	// 	if(this.list.data.length > 0) {
	//
	//g
	//etCreditCards 		var // check: function(){
	// 	if(!this.list) {
	// 		return false;
	// 	}
	//
	// 	var saveDefaultCards = false;
	//
	// 	//there is cards
	// 	if(this.list.data.length > 0) {
	//
	// 		var _debitCards = [];
	// 		var _creditCards = [];
	//
	// 		this.list.data.map(function(card){
	// 			if(card.funding == 'debit') {
	// 				//_debitCards[card.id] = card
	// 				_debitCards.push(card);
	// 			} else if(card.funding == 'credit'){
	// 				//_creditCards[card.id] = card
	// 				_creditCards.push(card);
	// 			}
	// 		})
	//
	// 		this.debitCards = _debitCards;
	// 		this.creditCards = _creditCards;
	//
	// 		console.log(_debitCards.length)
	//
	// 		//there are debit card(s)
	// 		if(_debitCards.length > 0) {
	//
	// 			//there ins't default receive card
	// 			if(!this.defaultReceive) {
	// 				this.defaultReceive = _debitCards[0];
	// 				//this.setDefaultReceive(_debitCards[0]);
	// 				saveDefaultCards = true;
	// 			}
	//
	// 			//there isn't default pay card
	// 			if(!this.defaultPay) {
	// 				this.defaultPay = _debitCards[0];
	// 				//this.setDefaultPay(_debitCards[0]);
	// 				saveDefaultCards = true;
	// 			}
	//
	// 			this.setStatus('okCards');
	//
	// 		//no debit card(s)
	// 		} else {
	//
	// 			//there are credit card(s)
	// 			if(_creditCards.length > 0){
	// 				if(!this.defaultPay) {
	// 					this.defaultPay = _creditCards[0];
	// 					saveDefaultCards = true;
	// 				}
	//
	// 				this.setStatus('no_debits');
	// 			}
	// 		}
	// 	//no cards
	// 	} else {
	// 		this.setStatus('noCards');
	// 	}
	//
	//
	// 	if(saveDefaultCards)
	// 		this.saveDefaults();
	// },_debitCards = [];
	// 		var _creditCards = [];
	//
	// 		this.list.data.map(function(card){
	// 			if(card.funding == 'debit') {
	// 				//_debitCards[card.id] = card
	// 				_debitCards.push(card);
	// 			} else if(card.funding == 'credit'){
	// 				//_creditCards[card.id] = card
	// 				_creditCards.push(card);
	// 			}
	// 		})
	//
	// 		this.debitCards = _debitCards;
	// 		this.creditCards = _creditCards;
	//
	// 		console.log(_debitCards.length)
	//
	// 		//there are debit card(s)
	// 		if(_debitCards.length > 0) {
	//
	// 			//there ins't default receive card
	// 			if(!this.defaultReceive) {
	// 				this.defaultReceive = _debitCards[0];
	// 				//this.setDefaultReceive(_debitCards[0]);
	// 				saveDefaultCards = true;
	// 			}
	//
	// 			//there isn't default pay card
	// 			if(!this.defaultPay) {
	// 				this.defaultPay = _debitCards[0];
	// 				//this.setDefaultPay(_debitCards[0]);
	// 				saveDefaultCards = true;
	// 			}
	//
	// 			this.setStatus('okCards');
	//
	// 		//no debit card(s)
	// 		} else {
	//
	// 			//there are credit card(s)
	// 			if(_creditCards.length > 0){
	// 				if(!this.defaultPay) {
	// 					this.defaultPay = _creditCards[0];
	// 					saveDefaultCards = true;
	// 				}
	//
	// 				this.setStatus('no_debits');
	// 			}
	// 		}
	// 	//no cards
	// 	} else {
	// 		this.setStatus('noCards');
	// 	}
	//
	//
	// 	if(saveDefaultCards)
	// 		this.saveDefaults();
	// },

	// setCard: function(cardId){
	// 	if(!cardId){
	// 		return false;
	// 	}
	//
	// 	var _pay = false;
	// 	var _receive = false;
	// 	var _card = false;
	//
	// 	this.list.data.map(function(card){
	// 		if(card.id == cardId){
	// 			if(funding == 'credit') {
	// 				_pay = true;
	// 				_card = card;
	// 			} else if(funding == 'debit') {
	// 				_pay = true;
	// 				_receive = true;
	// 				_card = card;
	// 			}
	// 		}
	// 	})
	//
	// 	if(_pay)
	// 		this.defaultPay = _card;
	//
	// 	if(_receive)
	// 		this.defaultReceive = _card;
	//
	// 	this.saveDefaults();
	// },

	// setDefaultReceive: function(card){
	// 	this.defaultReceive = card;
	// },
	//
	// setDefaultPay: function(card){
	// 	this.defaultPay = card;
	// },

	// saveDefaults: function(){
	// 	Meteor.call('saveDefaultCards', this.defaultReceive, this.defaultPay, function (err, result){
	// 		console.log('save default cards')
	// 		console.log(err)
	// 		console.log(result)
	// 		this.check();
	// 	});
	// },

	// setStatus: function(param){
	// 	switch (param) {
	// 		case 'okCards':
	// 			console.log('alert: ok')
	// 		break;
	// 		case 'no_debits':
	// 			console.log('alert: nao tem cartao de débito')
	// 		break;
	// 		case 'noCards':
	// 			console.log('alert: nao tem cartao')
	// 		break;
	// 		default:
	// 	}
	// },
