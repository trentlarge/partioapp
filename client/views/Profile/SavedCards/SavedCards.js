Template.savedCards.getCreditCards = function(){
	var result = []

	if (Meteor.user().profile.cards) {
		var cards = Meteor.user().profile.cards;

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
		var cards = Meteor.user().profile.cards;

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
		stripeHandler.open({
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

  'click .set-pay-default': function(e) {
    var cardData = this;
		var cardId = cardData.id;
		var funding = cardData.funding;

		if(!cardId || !funding) {
			console.log('event set-default > missing data')
			return false;
		}

		IonPopup.confirm({
			title: 'Set default card',
			template: '<div class="center">Do you want set this card as pay default?</div>',
			onCancel: function(){
				console.log('Cancelled')
			},

			onOk: function(){
				var receiveCard = false;
				var payCard = cardData;

				Cards.setDefaultCards(receiveCard, payCard);
			}
		});
  },

  'click .set-receive-default': function(e) {
    var cardData = this;
		var cardId = cardData.id;
		var funding = cardData.funding;

		if(!cardId || !funding) {
			console.log('event set-default > missing data')
			return false;
		}

		IonPopup.confirm({
			title: 'Set default card',
			template: '<div class="center">Do you want set this card as receive default?</div>',
			onCancel: function(){
				console.log('Cancelled')
			},

			onOk: function(){
				var receiveCard = cardData;
				var payCard = false;

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

	stripeHandler = StripeCheckout.configure({
		key: Meteor.settings.public.STRIPE_PUBKEY,

		token: function(token) {
			console.log('new card token > '+token)
			PartioLoad.show();

			Meteor.call('checkAccount', function(error, result) {
				if(error) {
					console.log('some error on checkAccount', error)
					return false;

				} else {
					Meteor.call('addCard', token, function(error, result) {
						PartioLoad.hide();

						if(error) {
							console.log('some error on addCard', error)
							return false;

						} else {
							Cards.refresh();
						}
					})
				}
			});
		}
	});
})
