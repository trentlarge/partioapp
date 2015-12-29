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

        var categories = Session.get('selectedCategories');
        if(!categories) {
            categories = Categories.getAllCategoriesText();
        }

        Meteor.subscribe("productsData",
                         Meteor.userId(),
                         Session.get('pageNumber'),
                         Session.get('searchText'),
                         categories );
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
