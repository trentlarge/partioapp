
Template.inventory.helpers({
  'iconRandom': function() {
      return Random.choice(['ion-ios-book',
                              'ion-ios-game-controller-b',
                              'ion-headphone',
                              'ion-android-restaurant',
                              'ion-ios-americanfootball',
                              'ion-cube']);
  }

});


Template.inventory.events({
  'click .start-share': function() {
    Router.go('/lend');
  },

  'click .final-requests': function() {
    Animations.accordion($('.final-requests'), $('.final-request-item'));
  },

  'click .requests': function() {
    Animations.accordion($('.requests'), $('.request-item'));
  },

  'click .products': function() {
    Animations.accordion($('.products'), $('.product-item'));
  },

  'click #respondToReq': function(){
    var requestor = this.requestor;
    var connectionId = this._id;
    var productId = this.productData._id;
    var searchCollectionId = Products.findOne(productId);

    //if product not found
    if(!searchCollectionId._id) {
        return false;
    }

    IonPopup.confirm({
      okText: 'Yes, Share!',
      cancelText: 'Decline',
      title: 'Respond To Request',
      template: '<div class="center">Do you want to share the item with the user?</div>',
      onOk: function() {
        IonPopup.close();
  
        PartioLoad.show();

        Meteor.call('ownerAccept', connectionId, function(err, res) {
          PartioLoad.hide();
          if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
          }

          var requestorUser = Meteor.users.findOne(requestor);
          IonPopup.show({
            title: 'Great!',
            template: '<div class="center">Make sure you setup a meeting location and pass on the item to <strong>'+ requestorUser.profile.name+'</strong> once you receive the payment. </div>',
            buttons:
              [{
                text: 'OK',
                type: 'button-assertive',
                onTap: function(){
                  Router.go('/inventory/connect/'+connectionId);
                  IonPopup.close();
                }
              }]
          });
        });
      },

      onCancel: function() {
        Meteor.call('ownerDecline', connectionId, function(err, res) {
          if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
          }
        });
      }
    });
  }
})
