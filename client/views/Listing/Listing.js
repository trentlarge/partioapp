Template.listing.rendered = function() {

    if(!Session.get('searchText')) {
        Session.set('searchText', '');
    }

    //start with 10 items per page with 2 pages (1 page hidden)
    Session.set("pageSize", 15);
    Session.set("pageNumber", 1);

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

}

Template.listing.destroyed = function() {
    Session.set('searchText', '');
    Session.set('listing', false);
    Session.set('categoryIndex', -1);
    Session.set('selectedCategories', null);
}

Template.searchResult.helpers({

  // show/hide "SHOW MORE" button.
  isFinished: function(size) {

      var maxSize = Session.get("pageSize") * Session.get("pageNumber");

      if(size < maxSize) {
          return false;
      }
      return true;
  },

});

Template.searchResult.events({

    'click #showMore': function(e, template){
        Session.set('pageNumber', Session.get('pageNumber') + 1);
    },

});

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
