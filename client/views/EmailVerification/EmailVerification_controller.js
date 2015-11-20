EmailVerificationController = RouteController.extend({
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
			// ...
		];
	},

	data: function() {
		return {
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
