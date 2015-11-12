SearchController = RouteController.extend({
	yieldTemplates: {
	},

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
		return this.params;
		// var ean = Search.findOne(this.params._id).ean;
		//return Products.findOne(this.params._id);
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
