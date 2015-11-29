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
			cards: function() {
				if (Meteor.user().profile.cards) {
					return Meteor.user().profile.cards;
				}
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
		};
	},

	onAfterAction: function() {

	}
});
