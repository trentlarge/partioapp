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
        return [];
	},

  searchProducts: function() {
    var pageNumber = Session.get('pageNumber') || 1,
        text = Session.get('searchText'),
        categories = Session.get('selectedCategories');
    
    if(!categories) {
      categories = Categories.getAllCategoriesText();
    }

    var _user = Meteor.user();
    
    if(!_user) {
      return;
    }

    var _userArea = _user.profile.area;

    Meteor.subscribe("productsData", Meteor.userId(), _userArea, pageNumber, text, categories, function() {
        setTimeout(function(){
            $('.loadbox').fadeOut();
        }, 100);

        if(products.count() > 0) {
          $('.no-items').hide();
        } else {
          $('.no-items').fadeIn();
        }

    });
      
     var filter = {
        ownerId: { $ne: Meteor.userId() },
        ownerArea: _userArea,
        title: { $regex: ".*"+text+".*", $options: 'i' },
        category: { $in: categories },
        sold: { $ne: true },
        borrow: { $ne: true },
        purchasing: { $ne: true },
    }
    
    if(Session.get("borrowFilter")) {
        delete filter.borrow;
    }
      
    if(Session.get("purchasingFilter")) {
        delete filter.purchasing;
    }
      
    var products = Products.find(filter, {
      limit: pageNumber * pageSize
    });

    Session.set("pageNumberLoaded", Math.ceil(products.count() / pageSize));

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
