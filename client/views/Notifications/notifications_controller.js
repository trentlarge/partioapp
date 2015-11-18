NotificationsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()) {
			PartioLoad.hide();
			this.render();
		}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			Meteor.subscribe("notifications"),
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
