Template.listing.rendered = function() {
    Session.set('listing', true);

    var inputBox = $('.search-header-input');
    var inputIcon = $('.search-header-icon');

    inputBox.css({
        'width':'70%',
        'padding-left': '35px'
    });

    inputIcon.css({
        'color': '#272727'
    });

    inputBox.focus();

}

Template.listing.destroyed = function() {
    Session.set('listing', false);
    Session.set('categoryIndex', -1);
}

Template.loadingTemplate.rendered = function() {
  PartioLoad.show();
}

Template.loadingTemplate.destroyed = function() {
  PartioLoad.hide();
}

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['title', 'category', 'authors'];

PackageSearch = new SearchSource('packages', fields, options);


Template.searchResult.helpers({
  getCategory: function() {
      var product = Products.findOne({ 'searchId':this._id });
      return product.category;
  },
  getPackages: function() {
    return PackageSearch.getData({ sort: {isoScore: -1} });
  },
  isLoading: function() {
    return PackageSearch.getStatus().loading;
  },
  qtyFormat: function(qty) {
    return qty === 0 ? "NA" : qty
  },
  qtyClass: function(qty) {
    return qty === 0 ? "badge-assertive" : "badge-energized"
  }
});

Template.searchResult.events({
  'click .qty-check': function() {
    Session.set('currentQty', Search.findOne(this._id).qty);
    console.log('CHECK currentQty: ' + Session.get('currentQty'));
  }
})

Template.searchResult.rendered = function() {
    PackageSearch.search(Session.get('searchText'));
    if(Session.get('categoryIndex') >= 0) {
        filterCategoriesByIndex(Session.get('categoryIndex')); 
    }
};

Template.searchBox.helpers({
  getCategory: function(index) {
      return Categories.getCategory(index);
  },
  isActivated: function(index) {
      if (Session.get('categoryIndex') === index) {
         return "active";
      }
      else {
        return "";
      }
  },
  getCategoryIcon: function(index) {
      return Categories.getCategoryIcon(index);
  }
});

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    console.log('Search Query: ' + text);
    if(text.length > 1)
    {
      PackageSearch.search(text);
    }
    else
    {
      IonLoading.hide();
    }

  }, 200),
  "click .categoryFilter": function(e, template) {
      
      var categoryFilterBox = $(e.currentTarget);
      categoryFilterBox.toggleClass('active');
      filterCategories();
      
  },
});

function filterCategories() {
    
      var categories = Categories.getCategories();
        $.each(categories, function(index, category) {
          $('.' + category.text).parent().hide();
      });

      if($('.categoryFilter').hasClass('active')) {
          $.each($('.categoryFilter.active'), function(index, categoryFilter) {  
                var categoryText = $(categoryFilter).find('span').text();
                $('.' + categoryText).parent().fadeIn();     
          });
      }
      else {
         $.each(categories, function(index, category) {
              $('.' + category.text).parent().fadeIn();
         });
      }
    
}

function filterCategoriesByIndex(index) {
    
      var categories = Categories.getCategories();
      $.each(categories, function(index, category) {
          $('.' + category.text).parent().hide();
      });
    
      var category = Categories.getCategory(index);
      $('.' + category).parent().fadeIn();
    
}
