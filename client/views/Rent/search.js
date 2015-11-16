Template.search.helpers({
  userThumbnail: function(userId) {
    return Meteor.users.findOne(userId).profile.avatar === "notSet" ? "/profile_image_placeholder.jpg" : Meteor.users.findOne(userId).profile.avatar;
  },
  userName: function(userId) {
    return Meteor.users.findOne(userId).profile.name;
  },
  peopleList: function() {
    var title = Search.findOne(this._id).title;
    return Products.find({"title": title});
  },
  isOwner: function() {
      return (this.ownerId === Meteor.userId()) ? true : false;
  },
  getCondition: function() {
      return Rating.getConditionByIndex(this.conditionId);
  },

  commonProductTitle: function() {
    var _title = Search.findOne(this._id).title;
    var products = Products.findOne({title: _title});
    if(!products) {
      console.log(' error products');
    } else {
      return products.title;
    }
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
  'click #requestProduct': function() {
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
