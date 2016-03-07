Template.search.onCreated(function () {
  Meteor.subscribe("singleProduct", Router.current().params._id),
  Meteor.subscribe("singleUser", Router.current().params.query.ownerId),
  Meteor.subscribe("ownerConnections", Router.current().params.query.ownerId)
});

Template.search.rendered = function() {
  $('.range').datepicker({
    format: 'mm-dd-yyyy',
    startDate: 'd',
    todayHighlight: true,
    toggleActive: true,
    inputs: $('.range-start, .range-end'),
  });   
    
  var product = this.data.product;
  if(product) {
      if(product.images) {
        Session.set('slideElements', product.images);
      }
      else {
          var slideElements = [{'photo': product.image}];
          Session.set('slideElements', slideElements);
      }
  }
}

Template.search.destroyed = function() {
    Session.set('slideElements', null);
}

Template.slideImages.helpers({
   slideElements: function() {
        return Session.get('slideElements');   
   }
});

Template.search.events({
  'click .features': function(e, template) {
      var features = $('.features'),
          featureDetails = $('.features-details');

      if(!featureDetails.is(':visible')){
          featureDetails.slideDown('fast');
          features.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
      } else {
          featureDetails.slideUp('fast');
          features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
      }
  },

  'click #requestProduct': function() {
    var self = this;
      
    Meteor.call('userCanBorrow', function(error, result){
      if(!result) {
        IonPopup.show({
          title: 'Update profile',
          template: 'Please, update your cards to borrow this item.',
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
          
//        console.log(self.product);
        IonModal.open("requestRent", Products.findOne(self.product._id));
      }
    });
  },
    
  'click #buyProduct': function() {
      
    var ownerId = this.product.ownerId,
        productId = this.product._id,
        sellingDetails = {
              price : {
                total : this.product.selling.price,
              }
        };

    Meteor.call('userCanBorrow', function(error, result){
      if(!result) {
        IonPopup.show({
          title: 'Update profile',
          template: 'Please, update your cards to borrow this item.',
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
          
            IonPopup.confirm({
              okText: 'Proceed',
              cancelText: 'Cancel',
              title: 'Request to the product Owner',
              template: 'You\'ll receive a notification once the owner accepts your request',
              onOk: function() {
                PartioLoad.show();
                Meteor.call('requestOwnerPurchasing', Meteor.userId(), productId, ownerId, sellingDetails, function(err, res) {
                  PartioLoad.hide();
                  IonPopup.close();

                  if(err) {
                    var errorMessage = err.reason || err.message;
                    if(err.details) {
                      errorMessage = errorMessage + "\nDetails:\n" + err.details;
                    }
                    sAlert.error(errorMessage);
                    return;
                  }

                  setTimeout(function(){
                    IonPopup.show({
                      title: 'Request Sent',
                      template: 'Now you just need to wait for owner\'s approval',
                      buttons: [{
                        text: 'OK',
                        type: 'button-energized',
                        onTap: function() {
                          IonPopup.close();
                          $('.ion-ios-close-empty').click()
                          Router.go('/items');
                        }
                      }]
                    });
                  }, 500);
                });
              },
            onCancel: function() {
                return false;
            }
        });
    
      }
    });
  },
})
