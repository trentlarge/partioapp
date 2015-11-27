Template.listing.rendered = function() {
    Session.set('listing', true);

    var inputBox = $('.search-header-input');
    var inputIcon = $('.search-header-icon');

    inputBox.css({
        'width':'100%',
        'padding-left': '40px'
    });

    inputIcon.css({
        'color': '#272727'
    });

    inputBox.focus();

}

Template.listing.destroyed = function() {
    Session.set('listing', false);
    Session.set('categoryIndex', -1);
    Session.set('selectedCategories', null);
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

Template.searchResult.rendered = function() {
    PackageSearch.search(Session.get('searchText'));
};

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
  },
  isCategorySelected: function() {
      
      var selectedCategories = Session.get('selectedCategories');
      var product = Products.findOne({ 'searchId':this._id });
      
      if(selectedCategories) {
         if(selectedCategories.indexOf(product.category) >= 0) {
             return '';
         }
         else {
             return 'disabled';
         }
      }
      else {
        return '';   
      }
  }
});

Template.searchResult.events({
  'click .qty-check': function() {
    Session.set('currentQty', Search.findOne(this._id).qty);
    console.log('CHECK currentQty: ' + Session.get('currentQty'));
  }
})

Template.searchBox.helpers({
  getCategory: function(index) {
      return Categories.getCategory(index);
  },
  isActivated: function(index) {
      if (Session.get('categoryIndex') === index) {
         var selectedCategories = [];
         selectedCategories.push(Categories.getCategory(index));
         Session.set('selectedCategories', selectedCategories);
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
      
      var categories = Categories.getCategories();
      var selectedCategories = [];

      if($('.categoryFilter').hasClass('active')) {
          $.each($('.categoryFilter.active'), function(index, categoryFilter) {  
                var categoryText = $(categoryFilter).find('span').text();
                selectedCategories.push(categoryText);    
          });
          
          Session.set('selectedCategories', selectedCategories);
      }
      else {
          Session.set('selectedCategories', null);
      }
      
  },
});


