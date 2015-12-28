Template.search.rendered = function() {
 
    $('.range').datepicker({
        format: 'mm-dd-yyyy',
        startDate: 'd',
        todayHighlight: true,
        toggleActive: true,
        inputs: $('.range-start, .range-end'),
    });
    
}

Template.search.events({
    
    'click .features': function(e, template) {
        var features = $('.features');
        var featureDetails = $('.features-details');

        if(!featureDetails.is(':visible')){
            featureDetails.slideDown('fast');
            features.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
        } else {
            featureDetails.slideUp('fast');
            features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
        }
    },
    
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

//    'click #moreInfo': function() {
//        IonModal.open("productDetail", Products.findOne(this._id));
//    }
})
