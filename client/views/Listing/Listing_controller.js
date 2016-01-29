var pageSize = 15;
var firstTime = true;

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

    Meteor.setTimeout(function(){
      $('.loadbox').fadeOut();
    }, 1000);
   
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

          hasProducts: function(){
            if(this.searchProducts.count() > 0){
              $('.no-items').hide();
              return true;

            } else {
              if(firstTime) {
                Meteor.setTimeout(function(){
                  firstTime = false;
                }, 1000);

                Meteor.setTimeout(function(){
                  if($('.product-box').length > 0){
                    $('.no-items').hide();
                  } else {
                    $('.no-items').fadeIn();
                  }
                }, 1500);

                return true;
              } else {
                $('.no-items').fadeIn();
                return false;
              }


              //return Session.get('loadingItems');
            }
          },

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
