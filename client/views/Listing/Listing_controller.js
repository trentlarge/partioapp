var pageSize = 15;

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
    // wait for subscription only if page number is 1 
    // (to avoid flickering on each subsequent page but still show loading wheel for the first page)
    if(typeof this.firstLoad == "undefined" || this.firstLoad) {
      this.firstLoad = false;

      var pageNumber = Session.get('pageNumber') || 1;
      var text = Session.get('searchText') || "";
      var categories = Session.get('selectedCategories') || Categories.getAllCategoriesText();
      var userArea = Meteor.user().profile.area;

      return [
        Meteor.subscribe("productsData", Meteor.userId(), userArea, pageNumber, text, categories)
      ];
    } else {
      return [];
    }
	},

  searchProducts: function() {
    var pageNumber = Session.get('pageNumber') || 1;
    var text = Session.get('searchText');
    var categories = Session.get('selectedCategories');
    
    if(!categories) {
      categories = Categories.getAllCategoriesText();
    }

    var userArea = Meteor.user().profile.area;

    Meteor.subscribe("productsData", Meteor.userId(), userArea, pageNumber, text, categories);

    var products = Products.find({
      ownerId: { $ne: Meteor.userId() },
      ownerArea: userArea,
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
