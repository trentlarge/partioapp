Template.sidemenu.events({
    'click #search-icon': function(e, template) {

        var searchText = $('#search').val();

        if(searchText != '') {

            Session.set('searchText', searchText);
            console.log(Session.get('listing'));

            if(Session.get('listing')){
                PackageSearch.search(searchText);
            }
            else {
                Router.go('listing');
            }
        }
    }
});

Template.listing.rendered = function() {
    Session.set('listing', true);
};

Template.listing.destroyed = function() {
    Session.set('listing', false);
};

Template.loadingTemplate.rendered = function() {
  PartioLoad.show();
};

Template.loadingTemplate.destroyed = function() {
  PartioLoad.hide();
};


var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['title', 'authors', 'uniqueId'];

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
});

Template.searchResult.rendered = function() {
  PackageSearch.search(Session.get('searchText'));
};

Template.searchBox.helpers({
  searchText: function() {
    return Session.get('searchText');
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

  }, 200)
});
