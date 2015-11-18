SearchController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()){
			PartioLoad.hide();
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
