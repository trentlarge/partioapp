Template.savedCards.onRendered(function() {
	//var stripeCostumer = Template.savedCards.getStripeCustomer();
	//var stripeManaged = Template.savedCards.getStripeManaged();
	//console.log(stripeCostumer);
	Cards.refresh();
})

Template.savedCards.helpers({
  cardsList: function() {
    //return Cards.list;
		//console.log(Session.get('cardsList'))
		return Session.get('cardsList');
  },
});

Template.savedCards.getStripeCustomer = function(done){
	Meteor.call('getStripeCustomer', function(err, result){
		if(err) {
			console.log('[stripe] User does not have stripe CUSTOMER account yet');
			done(false);
		}

		done(result);
	});
},

Template.savedCards.getStripeManaged = function(done){
	Meteor.call('getStripeManaged', function(err, result){
		if(err) {
			console.log('[stripe] User does not have stripe MANAGED account yet');
			done(false);
		}

		done(result);
	});
},

//Template.savedCards.getCreditCards = function(){
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
	// }listCards
	//
	// return result;
//}

//Template.savedCards.getDebitCards = function(){

//}

//Template.savedCards.getDebitCards = function(){
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
//}

//Template.savedCards.defaultReceive = function(){
	// if (Meteor.user().profile) {
	// 	return Meteor.user().profile.defaultReceive;
	// }
//}

//Template.savedCards.defaultPay = function(){
	// if (Meteor.user().profile) {
	// 	return Meteor.user().profile.defaultPay;
	// }
//}

Cards = {
	customer: false,
	managed: false,


	//refrshing this object
	refresh: function(){
		console.log('>>> refreshing cards on UI...')
		var promisse = new Promise(
      function(resolve, reject) {
				Template.savedCards.getStripeCustomer(function(dataCustomer){
					Cards.customer = dataCustomer;
					Template.savedCards.getStripeManaged(function(dataManaged){
						Cards.managed = dataManaged;
						resolve();
					});
				});
      }
		);

    promisse.then(
      function() {
        Cards.organize();
      })

		//this.customer = Template.savedCards.getStripeCustomer();
		//this.managed = Template.savedCards.getStripeManaged();
		// this.creditCards = Template.savedCards.getCreditCards();
		// this.debitCards = Template.savedCards.getDebitCards();
		// this.defaultPay = Template.savedCards.defaultPay();
		// this.defaultReceive = Template.savedCards.defaultReceive();
		// this.checkStatus();
	},


	organize: function(){
		console.log('>>>> [stripe] organizing cards on UI...')

		var _results = [];

		//console.log(this.customer, this.managed);
		if(Cards.customer) {

			//check Customer cards (could be Credit or Debit)
			if(Cards.customer.sources.data.length){
				Cards.customer.sources.data.map(function(card){
					var _thisObj = {};
					var _defaultPay = '';

					if(card.id == Cards.customer.default_source) {
						_defaultPay = 'default';
					}

					console.log(card.id+' pay: '+_defaultPay);

					_thisObj.id = card.metadata.idPartioCard;
					_thisObj.funding = card.funding;
					_thisObj.defaultPay = _defaultPay;
					_thisObj.brand = card.brand;
					_thisObj.last4 = card.last4;
					_thisObj.customerCardId = card.id;
					_results.push(_thisObj);
				})
			}
		}

		if(Cards.managed) {
			//check Customer cards (could be only Debit)
			if(Cards.managed.external_accounts.data.length){
				Cards.managed.external_accounts.data.map(function(card){
					var _exists = false;
					var _thisObj = {};
					var _defaultReceive = '';
					var i = 0;
					var index = false;

					if(card.default_for_currency) {
						_defaultReceive = 'default';
					}

					console.log(card.id+' receive: '+_defaultReceive);

					_results.map(function(__card){
						if(!_exists) {
							if(__card.id == card.metadata.idPartioCard){
								_exists = true;
								index = i;
							}
							i++;
						}
					})

					console.log('Exists This card (managed) ', index);

					if(!_exists) {
						_thisObj.id = card.metadata.idPartioCard;
						_thisObj.funding = card.funding;
						_thisObj.brand = card.brand;
						_thisObj.last4 = card.last4;
						_thisObj.defaultReceive = _defaultReceive;
						_thisObj.managedCardId.id = card.id;
						_results.push(_thisObj);
					} else {
						_results[index].managedCardId = card.id;
						_results[index].defaultReceive = _defaultReceive;
					}
				})
			}
		}

		Session.set('cardsList', _results);
		Cards.saveDefaultCards();
	},

	saveDefaultCards: function(){
		console.log('>>>> [stripe] cards save...');

		// Meteor.call('saveDefaultCards', Cards.defaultReceiveIdPartio, Cards.defaultPayIdPartio, function(){
		// 	console.log('ok')
		// });
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
