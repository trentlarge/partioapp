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
			//Meteor.subscribe("userData"),
		];
	},

	data: function() {
		return {
			cardsList: function() {
				return Session.get('cardsList');
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
		};
	},

	onAfterAction: function() {

	}
});
