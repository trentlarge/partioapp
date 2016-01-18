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

    Meteor.subscribe("productsData", Meteor.userId(), _userArea, pageNumber, text, categories);

    var products = Products.find({
      ownerId: { $ne: Meteor.userId() },
      ownerArea: _userArea,
      title: { $regex: ".*"+text+".*", $options: 'i' },
      category: { $in: categories }
    }, {
      limit: pageNumber * pageSize
    });

    Session.set("pageNumberLoaded", Math.ceil(products.count() / pageSize));

    $('.loadbox').fadeOut();
    // Session.set('loadingItems', false);

//    $('.new').slowEach(70, function() {
//        $(this).fadeIn(function(){
//          $(this).removeClass('new');
//        });
//    });
    
    return products;
  },

	data: function() {
		return {
          searchProducts: this.searchProducts(),
    //      loadingItems : Session.get('loadingItems'),

          hasProducts: function(){
            if(this.searchProducts.count() > 0){
              return true;
            } else {
              return Session.get('loadingItems');
            }
          },

          testIsReady: function() {
              return false;
          }
		};
	},

	onAfterAction: function() {

	}
});
