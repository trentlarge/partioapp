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
Template.rating.rendered = function () {
  // this.$('.rateit').rateit();  ---> need to fix it
}
Template.rating.helpers({
  avgRating: function(userId) {
    if (Meteor.users.findOne(userId).profile.rating) {
      if (Meteor.users.findOne(userId).profile.rating.length > 1) {
        var ratingArray = Meteor.users.findOne(userId).profile.rating;
        var totalCount = ratingArray.length;
        var sum = _.reduce(ratingArray, function(memo, num) {
          return (Number(memo) + Number(num))/totalCount;
        });
        return parseFloat(sum).toFixed(1);
      }
    } else {
      return "1.0";
    }
  },
});


var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['title', 'category', 'uniqueId'];

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


Template.search.helpers({
  userThumbnail: function(userId) {
    return Meteor.users.findOne(userId).profile.avatar === "notSet" ? "/profile_image_placeholder.jpg" : Meteor.users.findOne(userId).profile.avatar;
  },
  userName: function(userId) {
    return Meteor.users.findOne(userId).profile.name;
  },
  peopleList: function() {
    var uniqueId = Search.findOne(this._id).uniqueId;
    console.log(uniqueId);
    return Products.find({"uniqueId": uniqueId});
  },
  commonBookTitle: function() {
    var uniqueId = Search.findOne(this._id).uniqueId;
    return Products.findOne({"uniqueId": uniqueId}).title;
  },
  requestSent: function() {
    return Connections.findOne({"requestor": Meteor.userId(), "productData.ownerId": this.ownerId, "productData._id": this._id}) ? true: false;
  },
  qtynotZero: function() {

    console.log('ID: ' + this._id);
    console.log('qtynotZero: ' + Session.get('currentQty'));
    if(parseFloat(Session.get('currentQty')) < 1)
    {
      return false;
    }
    else
    {
      return true;
    }
    // return Session.get('currentQty');
  },
  avgRating: function(userId) {
    // var ratingObj = Meteor.users.findOne(userId).profile.rating;

    // if (ratingObj && ratingObj.length > 1) {
    //   var ratingArray = Meteor.users.findOne(userId).profile.rating;
    //   var totalCount = ratingArray.length;

    //   var sum = _.reduce(ratingArray, function(memo, num) {
    //     return (Number(memo) + Number(num))/totalCount;
    //   });
    //   return parseFloat(sum).toFixed(1);
    // } else {
    //   return '1.0';
    // }

    if (Meteor.users.findOne(userId).profile.rating) {
      if (Meteor.users.findOne(userId).profile.rating.length > 1) {
        var ratingArray = Meteor.users.findOne(userId).profile.rating;
        var totalCount = ratingArray.length;
        var sum = _.reduce(ratingArray, function(memo, num) {
          return (Number(memo) + Number(num))/totalCount;
        });
        return parseFloat(sum).toFixed(1);
      }
    } else {
      return "1.0";
    }

  }
  //NOT NEEDED ANYMORE SINCE DEFAULT RATING IS 1
  // ratingExists: function(userId){
  //   return Meteor.users.findOne(userId).profile.rating
  // }
});

Template.search.events({
  'click #requestBook': function() {
    console.log('requesting book...');
    var ownerId = this.ownerId;
    var productId = this._id;

    if (this.ownerId === Meteor.userId()) {
      IonPopup.show({
        title: 'You own this item! :)',
        template: '',
        buttons:
        [{
          text: 'OK',
          type: 'button-energized',
          onTap: function() {
            IonPopup.close();
          }
        }]
      });
    } else if ( Connections.findOne({"productData._id": this._id}) && (Meteor.userId() === Connections.findOne({"productData._id": this._id}).requestor)) {
      IonPopup.show({
        title: 'You already borrowed this item!',
        template: '',
        buttons:
        [{
          text: 'OK',
          type: 'button-energized',
          onTap: function() {
            IonPopup.close();
          }
        }]
      });
    } else {
      IonPopup.confirm({
        okText: 'Proceed',
        cancelText: 'Cancel',
        title: 'Continuing will send a request to the book Owner',
        template: '<div class="center">You\'ll receive a notification once the owner accepts your request</div>',
        onOk: function() {
          console.log("proceeding with connection");
          PartioLoad.show();
          Meteor.call('requestOwner', Meteor.userId(), productId, ownerId, function(error, result) {
            if (!error) {
              PartioLoad.hide();
              console.log(result);
              IonLoading.show({
                duration: 2000,
                delay: 400,
                customTemplate: '<div class="center"><h5>Request Sent</h5></div>',
              });
              // Meteor.setTimeout(function() {
              //   Router.go('/booksLent');
              // }, 2500)
            } else {
              PartioLoad.hide();
              console.log(error);
            }
          })
        },
        onCancel: function() {
          console.log('Cancelled');
        }
      });
    }


  }
})
