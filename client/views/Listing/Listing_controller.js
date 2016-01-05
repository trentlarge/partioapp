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
	    var pageSize = 15;
        var pageNumber = Session.get('pageNumber') || 1;
        var text = Session.get('searchText');
        var categories = Session.get('selectedCategories');
        if(!categories) {
            categories = Categories.getAllCategoriesText();
        }

        Meteor.subscribe("productsData",
                         Meteor.userId(),
                         pageNumber,
                         text,
                         categories);

	    var products = Products.find({
            ownerId: { $ne: Meteor.userId() },
            title: { $regex: ".*"+text+".*", $options: 'i' },
            category: { $in: categories }
        }, {
            limit: pageNumber * pageSize
        });

        Session.set("pageNumberLoaded", Math.ceil(products.count() / pageSize));

        return products;
    },

	data: function() {

		return {
            searchProducts: this.searchProducts()
		};
	},

	onAfterAction: function() {

	}
});
