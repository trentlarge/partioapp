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

      cardNotAdded: function(numberOfCards) {
          if(numberOfCards > 0){
              return false;
          }
          else {
              return true;
          }
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
