Template.loadingTemplate.rendered = function() {
  IonLoading.show();
}

Template.loadingTemplate.destroyed = function() {
  IonLoading.hide();
}

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title', 'authors', 'ean'];

PackageSearch = new SearchSource('packages', fields, options);

Template.searchResult.helpers({
  getPackages: function() {
    return PackageSearch.getData({ sort: {isoScore: -1} });
  },
  
  isLoading: function() {
    return PackageSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  PackageSearch.search('');
};

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PackageSearch.search(text);
  }, 200)
});


Template.search.helpers({
  userThumbnail: function(userId) {
    return Meteor.users.findOne(userId).profile.avatar === "notSet" ? "/profile_image_placeholder.jpg" : Meteor.users.findOne(userId).profile.avatar;
  },
  userName: function(userId) {
    return Meteor.users.findOne(userId).profile.name;
  },
  peopleList: function() {
    var ean = Search.findOne(this._id).ean;
    console.log(ean);
    return Products.find({"ean": ean});
  },
  commonBookTitle: function() {
    var ean = Search.findOne(this._id).ean;
    return Products.findOne({"ean": ean}).title;
  },
  requestSent: function() {
    console.log(this);
    return Connections.findOne({"requestor": Meteor.userId(), "bookData.ownerId": this.ownerId, "bookData._id": this._id}) ? true: false;
  }
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
          type: 'button-positive',
          onTap: function() {
            IonPopup.close();
          }
        }]
      });
    } else if ( Connections.findOne({"bookData._id": this._id}) && (Meteor.userId() === Connections.findOne({"bookData._id": this._id}).requestor)) {
      IonPopup.show({
        title: 'You already borrowed this item!',
        template: '',
        buttons: 
        [{
          text: 'OK',
          type: 'button-positive',
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
          IonLoading.show();
          Meteor.call('requestOwner', Meteor.userId(), productId, ownerId, function(error, result) {
            if (!error) {
              IonLoading.hide();
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
              IonLoading.hide();
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