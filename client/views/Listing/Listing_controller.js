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
            
            testIsReady: function() {
                return false;
            }
		};
	},

	onAfterAction: function() {

	}
});
