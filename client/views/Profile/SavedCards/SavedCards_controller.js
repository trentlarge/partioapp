SavedCardsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()){
			this.render();
		}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			// Meteor.subscribe("someSubscription"),
			// Meteor.subscribe("otherSubscription"),
			Meteor.subscribe("current_user_data"),
		];
	},

	data: function() {
		return {
			listCards: function(){
				Meteor.call('listCards', function(err, result){
					console.log(err, result)
					if(result){
						return result;
					}
				})
				// if(Meteor.user().profile.stripeAccount) {
				// 	return Meteor.user().profile.stripeAccount.id;
				// }
			},

			cards: function() {
				//this.listCards();

				//Stripe.accounts.listExternalAccounts(this.getStripeAccount(), {object: "card"},
				//function(err, cards) {
					//console.log(err, cards);
					// asynchronously called
				//});

				//
				//
				// if (Meteor.user().profile.cards) {
				// 	return Meteor.user().profile.cards;
				// }
			},

			getCardById: function(idCard) {
				if(!cardId)
					return false;

				var cards = this.cards();
				var result = []

				if(cards.length > 0) {
					for (var i = 0; i < cards.length; i++) {
						var _card = cards[i];

						if(_card.id == idCard)
							return result;
					}

					return false;
				}
			},

			getReceiveCard: function() {
				if (Meteor.user().profile) {
					return Meteor.user().profile.defaultReceive;
				}
			},

			getPayCard: function(){
				if (Meteor.user().profile) {
					return Meteor.user().profile.defaultPay;
				}
			},

			checkPayDefault: function(cardId) {
				if(!cardId) return '';

				if(this.getPayCard()) {
					if(cardId == this.getPayCard().id) {
					  return 'default';
					}
				}

				return '';
			},

			checkReceiveDefault: function(cardId) {
				if(!cardId) return '';

				if(this.getReceiveCard()) {
					if(cardId == this.getReceiveCard().id) {
						return 'default';
					}
				}

				return '';
			},

			checkIsDefault: function(cardId) {
				if(!cardId)
					return false;

				var toPay = false;
				var toReceive = false;

				if(this.getPayCard()) {
					if(cardId == this.getPayCard().id)
						toPay = true;
				}

				if(this.getReceiveCard()) {
					if(cardId == this.getReceiveCard().id)
						toReceive = true;
				}

				if(toPay && toReceive){
					return 'both';
				} else {
					if(toPay) {
						return 'pay';
					} else if(toReceive) {
						return 'receive';
					}
				}
			},

      isDebit: function(funding) {
        if(funding === 'debit') {
            return 'RECEIVE';
        }

        return '';
      },

      getBrandIcon: function(brand) {
        if(brand === 'Visa') {
            return 'fa fa-cc-visa';
        }
        else if(brand === 'MasterCard') {
            return 'fa fa-cc-mastercard';
        }

        return 'fa fa-credit-card-alt';
      },

			getInfo: function(cardId) {
				var result = this.checkIsDefault(cardId);

				switch (result) {
					case 'both':
						return ' using to pay and receive';
						break;
					case 'pay':
						return ' using to pay';
						break;
					case 'receive':
						return ' using to receive';
						break;
				}
			}
		};
	},

	onAfterAction: function() {

	}
});
