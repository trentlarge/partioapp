Template.listing.rendered = function() {
  if(!Session.get('searchText')) {
      Session.set('searchText', '');
  }

  Session.set("pageSize", 15);
  Session.set("pageNumber", 1);
  Session.set("pageNumberLoaded", 0);

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
};

Template.listing.events({
  "scroll .overflow-scroll": function(e, t) {
    var parent = t.$(e.currentTarget);
    var scrollingElement = parent.find(".list");
      
    var pageNumber = Session.get('pageNumber') || 1;
    var pageSize = Session.get('pageSize');
      
    if($('.product-box').length < pageNumber * pageSize) {
        return;
    }

    if(parent.scrollTop() + parent.height() >= scrollingElement.innerHeight() + 20) {
        $('.loadbox').fadeIn('slow',function(){
          var loadedPage = Session.get("pageNumberLoaded") || 0;
          Session.set("pageNumber", loadedPage + 1);
        });
      }
  }
});


Template.listing.destroyed = function() {
  Session.set('searchText', '');
  Session.set('listing', false);
  Session.set('categoryIndex', -1);
  Session.set('selectedCategories', null);
};

// Template.searchResult.helpers({

// });

// Template.searchResult.events({

// });

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
    } else {
      return "";
    }
  },

  getCategoryIcon: function(index) {
    return Categories.getCategoryIcon(index);
  }
});

Template.searchBox.events({
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

      Session.set("selectedCategories", selectedCategories);
      Session.set("pageNumber", 1);
    } else {

      Session.set("selectedCategories", null);
      Session.set("pageNumber", 1);
    }
  }
});
