SavedCardsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		return [
			// subscribe to data here
			// Meteor.subscribe("someSubscription"),
			// Meteor.subscribe("otherSubscription"),
			//Meteor.subscribe("current_user_data"),


		];
	},

	data: function() {
		return {

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
			//
			// read data from database here like this:
			//   someData: SomeCollection.find(),
			//   moreData: OtherCollection.find()
			// ...
		};
	},

	onAfterAction: function() {

	}
});
