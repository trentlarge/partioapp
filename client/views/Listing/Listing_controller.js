var pageSize = 25;

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
        return [];
	},

  searchProducts: function() {
    var pageNumber = Session.get('pageNumber') || 1;
    var text = Session.get('searchText');
    var categories = Session.get('selectedCategories');
    
    if(!categories) {
      categories = Categories.getAllCategoriesText();
    }

    var _user = Meteor.user();
    
    if(!_user) {
      return;
    }

    var _userArea = _user.profile.area;


    var products = Products.find({
      ownerId: { $ne: Meteor.userId() },
      ownerArea: _userArea,
      title: { $regex: ".*"+text+".*", $options: 'i' },
      category: { $in: categories }
    }, {
      limit: pageNumber * pageSize
    });

    Session.set("pageNumberLoaded", Math.ceil(products.count() / pageSize));
    Meteor.subscribe("productsData", Meteor.userId(), _userArea, pageNumber, text, categories, function() {
        $('.loadbox').fadeOut();

        if(products.count() > 0) {
          $('.no-items').hide();
        } else {
          $('.no-items').fadeIn();
        }

    });

    return products;
  },

	data: function() {
    var prod = this.searchProducts();
		return {
          searchProducts: prod,

          hasProducts: prod ? !!prod.count() : false,

          isSellingStatusOn: function(sellingStatus) {
            return (sellingStatus === 'ON') ? true : false;
          },

          testIsReady: function() {
              return false;
          }
		};
	},

	onAfterAction: function() {

	}
});
