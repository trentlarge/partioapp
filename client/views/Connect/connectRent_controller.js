ConnectRentController = RouteController.extend({
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
			Meteor.subscribe("connections"),
			// ...
		];
	},

	data: function() {
		return Connections.findOne({_id: this.params._id});
/*
		return {
			//
			// read data from database here like this:
			//   someData: SomeCollection.find(),
			//   moreData: OtherCollection.find()
			// ...
		};
*/
	},

	onAfterAction: function() {

	}
});
