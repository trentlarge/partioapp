InventoryDetailController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready){
			this.render();
		}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			Meteor.subscribe("products"),
			// Meteor.subscribe("otherSubscription"),
			// ...
		];
	},

	data: function() {
		return {
			myProducts: Products.find({ownerId: Meteor.userId()})
		}
	},

	onAfterAction: function() {

	}
});
