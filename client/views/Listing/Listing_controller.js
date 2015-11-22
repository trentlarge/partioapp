ListingController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
			if(this.ready()) {
				this.render();
			}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			// Meteor.subscribe("someSubscription"),
			Meteor.subscribe("search"),
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