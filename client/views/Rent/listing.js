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
};

Template.searchBox.helpers({
  getCategory: function(index) {
      return Categories.getCategory(index);
  },
  isActivated: function(index) {
      if (Session.get('categoryIndex') === index) {
         return "active";
      }
      return "";
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
      var category = e.currentTarget;
      $(category).toggleClass('active');
  }
});
