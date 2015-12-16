Template.search.events({
    'click #requestProduct': function() {
      Meteor.call('userCanBorrow', function(error, result){
        if(!result) {
          IonPopup.show({
            title: 'Update profile',
            template: '<div class="center">Please, update your cards to borrow this item.</div>',
            buttons: [{
              text: 'OK',
              type: 'button-energized',
              onTap: function() {
                IonPopup.close();
                $('.ion-ios-close-empty').click()
                Router.go('/profile/savedcards/');
              }
            }]
          });
          return false;
        } else {
          var ownerId = this.ownerId;
          var productId = this._id;
          IonModal.open("requestRent", Products.findOne(this._id));
        }
      });
    },

    'click #moreInfo': function() {
        IonModal.open("productDetail", Products.findOne(this._id));
    }
})
