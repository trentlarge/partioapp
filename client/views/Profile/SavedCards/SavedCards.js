Template.addnewCard.events({

	'submit .newCardForm': function(e) {
		e.preventDefault();
		console.log('> Form submit add new card');

		var nameOut = e.target.name.value;
		var numberOut = e.target.number.value;
		var exp = e.target.expiry.value;
				exp = exp.trim();
				exp = exp.split('/');
		var exp1 = parseInt(exp[0]);
		var exp2 = parseInt(exp[1]);
		var cvcOut = e.target.cvc.value;

		console.log(nameOut, numberOut, exp1, exp2, cvcOut);

		if(!nameOut || !numberOut || !exp1 || !exp2 || !cvcOut){
			alert('Please fill all fields');
			return false;
		}

		PartioLoad.show('Adding a new card');

		//Creating first token (tokens only can be used once)
		Stripe.card.createToken({
			number: numberOut,
			cvc: cvcOut,
			exp_month: exp1,
			exp_year: exp2,
			currency: 'usd',
			name: nameOut,
		}, function(status, firstResponse) {

			if(!firstResponse.id) {
				PartioLoad.hide();
				console.log('some error', status);
				return false;
			}

			//If card is credit, check if there is stripeCustomer and add card only on it.
			if(firstResponse.card.funding == 'credit') {

				Meteor.call('checkStripeCustomer', function(error, result) {
					console.log('>>>>>> [stripe] return checkStripeCustomer');

					//Adding card to customer account
					Meteor.call('addCustomerCard', firstResponse.id, function(error, result){
						console.log('>>>>>> [stripe] return addCustomerCard');
						PartioLoad.hide();

						if(error) {
							alert(error.message);
							return false;
						}

						//closemodal
						$('.modal .bar button').trigger('click');
					})
				});

			//If card is debit, check if there is stripeManaged and stripeCustomer and add card only both accounts.
			} else if(firstResponse.card.funding == 'debit') {

				//check if there is stripe Managed account
				Meteor.call('checkStripeManaged', function(error, resultManaged) {
					console.log('>>>>>> [stripe] return checkStripeManaged');

					if(error) {
						PartioLoad.hide();
						alert(error.message);
						return false;
					}

					if(resultManaged) {
						Meteor.call('checkStripeCustomer', function(error, resultCustomer) {
							console.log('>>>>>> [stripe] return checkStripeCustomer');
							if(error) {
								PartioLoad.hide();
								alert(error.message);
								return false;
							}

							if(resultCustomer) {

								//Creating second token (tokens only can be used once)
								Stripe.card.createToken({
									number: numberOut,
									cvc: cvcOut,
									exp_month: exp1,
									exp_year: exp2,
									currency: 'usd',
									name: nameOut,
								}, function(status, secondResponse) {

									if(!secondResponse.id) {
										PartioLoad.hide();
										console.log('some error', status);
										return false;
									}

									//On this method we gonna create the same card to Customer and Manager
									//That's why because we have 2 tokens (each token could be used once time)
									Meteor.call('addManagedCard', firstResponse.id, secondResponse.id, function(error, result){
										console.log('>>>>>> [stripe] return addCustomerCard');
										PartioLoad.hide();

										if(error) {
											alert(error.message);
											return false;
										}

										//closemodal
										$('.modal .bar button').trigger('click');
									})
								});
							}
						})
					}
				});
			}
		});

		//
		// Meteor.call('checkAccount', function(error, result) {
		// 	console.log('>>>>>> return checkaccount <<<<<');
		//
		// 	if(error) {
		// 		PartioLoad.hide();
		// 		console.log(error);
		// 		return false;
		// 	}
		//
		// 	if(result){
		// 		Stripe.card.createToken({
		// 			number: numberOut,
		// 			cvc: cvcOut,
		// 			exp_month: exp1,
		// 			exp_year: exp2,
		// 			currency: 'usd',
		// 			name: nameOut,
		// 		}, function(status, response) {
		//
		// 			if(response.error) {
		// 				PartioLoad.hide();
		// 				alert(response.error.message);
		// 				return false;
		// 			}
		//
		// 			if(response.card.funding == 'credit') {
		// 				PartioLoad.hide();
		// 				alert('Sorry, for now only with debit cards.');
		// 				return false;
		// 			}
		//
		// 			if(response.id) {
		// 				Meteor.call('addCard', response.id, function(error, result){
		// 					console.log('>>>>>> return addCard');
		//
		// 					if(error) {
		// 						alert(error.message);
		// 						return false;
		// 					}
		//
		// 					Cards.refresh();
		//
		// 					//closemodal
		// 					$('.modal .bar button').trigger('click');
		// 					PartioLoad.hide();
		//
		// 				});
		// 			} else {
		// 				PartioLoad.hide();
		// 				console.log('some error');
		// 				console.log(response);
		// 			}
		// 		});
		// 	}
		// });
	}
});

Template.savedCards.getCreditCards = function(){
	// var result = []
	//
	// if (Meteor.user().profile.cards) {
	// 	var cards = Meteor.user().profile.cards;
	//
	// 	if(cards.length > 0) {
	// 		for (var i = 0; i < cards.length; i++) {
	// 			var _card = cards[i];
	// 			if(_card.funding == 'credit') {
	// 				result.push(_card);
	// 			}
	// 		}
	// 	}
	// }
	//
	// return result;
}

Template.savedCards.getDebitCards = function(){
	// var result = []
	//
	// if (Meteor.user().profile.cards) {
	// 	var cards = Meteor.user().profile.cards;
	//
	// 	if(cards.length > 0) {
	// 		for (var i = 0; i < cards.length; i++) {
	// 			var _card = cards[i];
	// 			if(_card.funding == 'debit') {
	// 				result.push(_card);
	// 			}
	// 		}
	// 	}
	// }
	//
	// return result;
}

Template.savedCards.defaultReceive = function(){
	// if (Meteor.user().profile) {
	// 	return Meteor.user().profile.defaultReceive;
	// }
}

Template.savedCards.defaultPay = function(){
	// if (Meteor.user().profile) {
	// 	return Meteor.user().profile.defaultPay;
	// }
}

Cards = {
	// defaultReceive: false,
	// defaultPay: false,
	// creditCards: false,
	// debitCards: false,

	//refrshing this object
	refresh: function(){
		// this.creditCards = Template.savedCards.getCreditCards();
		// this.debitCards = Template.savedCards.getDebitCards();
		// this.defaultPay = Template.savedCards.defaultPay();
		// this.defaultReceive = Template.savedCards.defaultReceive();
		// this.checkStatus();
	},

	//check user situation with the cards
	checkStatus: function(){

		// //if there are cards
		// if(this.debitCards.length > 0 || this.creditCards.length > 0) {
		//
		// 	//there are debit card(s)
		// 	if(this.debitCards.length > 0) {
		//
		// 		//there ins't default receive or pay card
		// 		if(!this.defaultReceive || !this.defaultPay) {
		// 			var payCard = false;
		// 			var receiveCard = false;
		//
		// 			if(!this.defaultReceive) {
		// 				receiveCard = this.debitCards[0];
		// 			}
		//
		// 			if(!this.defaultPay) {
		// 				payCard = this.debitCards[0];
		// 			}
		//
		// 			//this.defaultReceive = this.debitCards[0];
		// 			this.setDefaultCards(receiveCard, payCard);
		// 			//saveDefaultCards = true;
		// 		}
		//
		// 		this.setStatus('ok');
		//
		// 	//no debit card(s)
		// 	} else {
		//
		// 		//there are credit card(s)
		// 		if(this.creditCards.length > 0){
		// 			if(!this.defaultPay) {
		// 				var receiveCard = false;
		// 				var payCard = this.creditCards[0];
		// 				this.setDefaultCards(receiveCard, payCard);
		// 			}
		// 		}
		//
		// 		this.setStatus('no_receive');
		// 	}
		//
		// //no cards
		// } else {
		// 	this.setStatus('no_cards');
		// }
	},

	//showing user 'alerts'
	setStatus: function(param){
		// $('.alerts').addClass('hidden');
		//
		// switch (param) {
		// 	case 'ok':
		// 		$('.alerts').addClass('hidden');
		// 	break;
		// 	case 'no_receive':
		// 		$('.only-credit').removeClass('hidden');
		// 	break;
		// 	case 'no_cards':
		// 		$('.no-cards').removeClass('hidden');
		// 	break;
		// 	default:
		// }
	},

	//setting default cards
	setDefaultCards: function(receiveCard, payCard){
		// console.log('setDefaultCards', receiveCard, payCard);
		// if(!receiveCard && !payCard) {
		// 	return false;
		// }
		// //var cardData = this.getCardById(cardId);
		// PartioLoad.show('Setting your default card...');
		//
		// Meteor.call('saveDefaultCards', receiveCard, payCard, function (err, result){
		// 	if(err) {
		// 		//console.log(err);
		// 		return false;
		// 	}
		//
		// 	if(result) {
		// 		this.defaultReceive = receiveCard;
		// 		this.defaultPay = payCard;
		// 	}
		// });
	},

	//removing a card
	remove: function(cardId){
		// if(!cardId){
		// 	return false;
		// }
		//
		// if(this.defaultReceive.id == cardId) {
		// 	alert('Sorry, you can\'t remove you default card.')
		// 	return false;
		// }
		//
		// PartioLoad.show();
		//
		// Meteor.call('removeCard', cardId, function(error, result) {
		// 	PartioLoad.hide();
		//
		// 	if(error) {
		// 		console.log('removeCard > some error');
		// 		return false;
		// 	}
		//
		// 	if(result) {
		// 		console.log('removeCard > ok');
		// 	} else {
		// 		Cards.refresh();
		// 	}
		// });
	},
}

Template.savedCards.events({
	// 'click #add-card': function(e) {
	// 	// PartioLoad.show();
	// 	// stripeHandler.open({
	// 	// 	name: 'partiO',
	// 	// 	description: 'Add Card',
	// 	// 	zipCode: false,
	// 	// 	currency: 'USD',
	// 	// 	panelLabel: 'Save Card',
	// 	// 	email: Meteor.user().profile.email,
	// 	// 	allowRememberMe: false,
	// 	// 	opened: function() { PartioLoad.hide() },
	// 	// 	closed: function() { PartioLoad.hide() }
	// 	// });
	// 	PartioLoad.show('adding a default debit card just to test. We need to new card form. Soon more news...')
	//
	// 	Meteor.call('checkAccount', function(error, result) {
	// 		console.log('>>>>>> return checkaccount <<<<<');
	// 		if(result){
	// 			Stripe.card.createToken({
	// 		    number: '4242424242424242',
	// 		    cvc: '666',
	// 		    exp_month: '12',
	// 		    exp_year: '2021',
	// 				currency: 'usd',
	// 			}, function(status, response) {
	// 				if(response.id) {
	// 		    	Meteor.call('addCard', response.id, function(error, result){
	// 						console.log(error, result);
	// 						PartioLoad.hide();
	// 					});
	// 				}
	// 			});
	// 		}
	// 	});

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

  'click .set-pay-default': function(e) {
    // var cardData = this;
		// var cardId = cardData.id;
		// var funding = cardData.funding;
		//
		// if(!cardId || !funding) {
		// 	return false;
		// }
		//
		// IonPopup.confirm({
		// 	title: 'Set default card',
		// 	template: '<div class="center">Do you want set this card as pay default?</div>',
		// 	onCancel: function(){
		//
		// 	},
		//
		// 	onOk: function(){
		// 		var receiveCard = cardData;
		// 		//var receiveCard = false;
		// 		var payCard = cardData;
		//
		// 		Cards.setDefaultCards(receiveCard, payCard);
		// 	}
		// });
  },

  'click .set-receive-default': function(e) {
    // var cardData = this;
		// var cardId = cardData.id;
		// var funding = cardData.funding;
		//
		// if(!cardId || !funding) {
		// 	return false;
		// }
		//
		// IonPopup.confirm({
		// 	title: 'Set default card',
		// 	template: '<div class="center">Do you want set this card as receive default?</div>',
		// 	onCancel: function(){
		//
		// 	},
		//
		// 	onOk: function(){
		// 		var receiveCard = cardData;
		// 		//var payCard = false;
		// 		var payCard = cardData;
		//
		// 		Cards.setDefaultCards(receiveCard, payCard);
		// 	}
		// });

  },

	'click .delete-card': function(e){
		// var cardId = this.id;
		//
		// if(!cardId){
		// 	return false;
		// }
		//
		// IonPopup.confirm({
		// 	title: 'Set default card',
		// 	template: '<div class="center">Do you want remove this card?</div>',
		// 	onCancel: function(){
		//
		// 	},
		// 	onOk: function(){
		// 		Cards.remove(cardId);
		// 	}
		// });
	}
});

Template.savedCards.onRendered(function() {
	//Cards.refresh();

	// stripeHandler = StripeCheckout.configure({
	//
	// 	key: Meteor.settings.public.STRIPE_PUBKEY,
	// 	currency: 'usd',
	//
	// 	token: function(token) {
	// 		console.log('new card token >', token);
	// 		PartioLoad.show();
	//
	// 		Meteor.call('checkAccount', function(error, result) {
	// 			console.log(' return checkaccount');
	// 			console.log(result);
	// 			console.log(error)
	//
	// 			if(error) {
	// 				console.log('some error on checkAccount', error)
	// 				return false;
	//
	// 			} else {
	// 				Meteor.call('addCard', token, function(error, result) {
	// 					PartioLoad.hide();
	//
	// 					if(error) {
	// 						console.log('some error on addCard', error)
	// 						return false;
	//
	// 					} else {
	// 						Cards.refresh();
	// 					}
	// 				})
	// 			}
	// 		});
	// 	}
	// });
})
