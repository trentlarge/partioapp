NotificationsController = RouteController.extend({
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
			Meteor.subscribe("myNotifications", Meteor.userId()),
			// Meteor.subscribe("otherSubscription"),
			// ...
		];
	},

	data: function() {
		return {
			teste: function() {
				console.log('metodo teste - notifications');
				return Meteor.userId();
			},
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
