Template.promotions.rendered = function() {
    
    Session.set('promoCode', '');
    Session.set('isAddPromoCode', false)
    
}

Template.promotions.helpers({
    
    isAddPromoCode: function() {
        return Session.get('isAddPromoCode');
    }
    
})

Template.promotions.events({
    
    'keyup #promoCode': function(e, template) {
        
        var promoCode = $(e.target).val();
        
        if(promoCode.length == 6) {
            Session.set('promoCode', promoCode);
            Session.set('isAddPromoCode', true);
        }
        else {
            Session.set('isAddPromoCode', false);
            Session.set('promoCode', '');
        }
    },
    
    'click #addBestFriend': function(e, template) {
        
        var bestFriendName = $('.best-friend-name').text();
        var promoCode = $('#promoCode').val();
        console.log(promoCode);
        
        IonPopup.confirm({
          okText: 'Proceed',
          cancelText: 'Cancel',
          title: 'Update user',
          template: ['Are you sure you want add ' + bestFriendName + ' as your Best Friend?\
                      <span class="alert-promo-submessage"> Note: You will not be able to change anymore.</span>'].join(''),
          onOk: function() {
            Meteor.call('insertBestFriendCode', promoCode, function(err, res) {

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
                  title: 'Best Friend added',
                  template: 'Best Friend ' + bestFriendName + ' added successfully!',
                  buttons: [{
                    text: 'OK',
                    type: 'button-energized',
                    onTap: function() {
                      IonPopup.close();
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
    
})
