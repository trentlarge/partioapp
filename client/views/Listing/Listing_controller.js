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
			// Meteor.subscribe("search"),
            // Meteor.subscribe("products"),
            // Meteor.subscribe("searchData", parseInt(this.params.query.page))
			// ...
		];
	},
    
    searchProducts: function() {
        Meteor.subscribe("productsData", Meteor.userId(), Session.get('pageNumber'), Session.get('searchText'));
        return Products.find();
    },
    
	data: function() {
        
		return {
            searchProducts: this.searchProducts(),
		};
	},

	onAfterAction: function() {

	}
});
