Template.loadingTemplate.rendered = function() {
  IonLoading.show();
}

Template.loadingTemplate.destroyed = function() {
  IonLoading.hide();
}


var clientOptions = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};
var fields = ['title', 'authors', 'category'];

ProductSearch = new SearchSource('products', fields, clientOptions);

Template.searchResult.helpers({
  getPackages: function() {
    if (Session.get('checkBooks') && Session.get('checkElectronics') && Session.get('checkSports') && Session.get('checkOthers')) {
      return ProductSearch.getData({sort: {isoScore: -1}});
    } else {
      var allData = ProductSearch.getData({sort: {isoScore: -1}});
      var filteredData = [];
      allData.forEach(function(eachItem) {
        if (
          ((Session.get('checkOthers'))&&( !( (eachItem.category === 'Books')||(eachItem.category === 'Electronics')||(eachItem.category === 'Sports') ) )) 
          || (eachItem.category === Session.get('checkBooks')) 
          || (eachItem.category === Session.get('checkSports')) 
          || (eachItem.category === Session.get('checkElectronics'))
          ) {
          filteredData.push(eachItem)
        } else {
          return;
        }
      });
      return filteredData;
    }
  },
  
  isLoading: function() {
    return ProductSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  ProductSearch.search('');
  Session.setDefault('checkBooks', true);
  Session.setDefault('checkElectronics', true);
  Session.setDefault('checkSports', true);
  Session.setDefault('checkOthers', true);
};



Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    ProductSearch.search(text);
  }, 200)
});

Template.filter.events({
  'change #checkBooks': function(event) {
    return event.target.checked ? Session.set('checkBooks', 'Book') : Session.set('checkBooks', false)
  },
  'change #checkElectronics': function(event) {
    return event.target.checked ? Session.set('checkElectronics', 'Electronics') : Session.set('checkElectronics', false)
  },
  'change #checkSports': function(event) {
    return event.target.checked ? Session.set('checkSports', 'Sports') : Session.set('checkSports', false)
  },
  'change #checkOthers': function(event) {
    return event.target.checked ? Session.set('checkOthers', 'Others') : Session.set('checkOthers', false)
  }
});

Template.filter.helpers({
  checkBooks: function() {
    return Session.get('checkBooks') ? true : false;
  },
  checkElectronics: function() {
    return Session.get('checkElectronics') ? true : false;
  },
  checkSports: function() {
    return Session.get('checkSports') ? true : false;
  },
  checkOthers: function() {
    return Session.get('checkOthers') ? true : false;
  }
})
