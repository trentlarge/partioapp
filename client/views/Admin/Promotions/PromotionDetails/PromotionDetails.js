Template.adminPromotionsDetails.events({
    
    'click .add-earning': function(e, template) {
        
        var data = {
            userId: Meteor.userId(),
            value: parseFloat($('.input-earning').val()).toFixed(2),
            from: 'admin'
        }
        
        IonPopup.confirm({
          okText: 'Proceed',
          cancelText: 'Cancel',
          title: 'Add Earning',
          template: 'Are you sure you want add $' + data.value + '?',
          onOk: function() {
            Meteor.call('addEarningPromotionValue', data, function(err, res) {

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
                  title: 'Earning updated',
                  template: 'User earning were updated!',
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
        
    },
    
    'click .add-spending': function(e, template) {
        
        var data = {
            userId: Meteor.userId(),
            value: parseFloat($('.input-spending').val()).toFixed(2),
            from: 'admin'
        }
        
        if(this.private.promotions.earning && this.private.promotions.earning.total) {
            if(this.private.promotions.spending.total > this.private.promotions.earning.total) {
                IonPopup.alert({
                   title: "Sorry",
                   template:  "You can't add a spending value more than earning value",
                });
                return;
            }
        }
        else {
            IonPopup.alert({
               title: "Sorry",
               template:  "You can't add a spending value more than earning value",
            });
            return;
        }
        
        IonPopup.confirm({
          okText: 'Proceed',
          cancelText: 'Cancel',
          title: 'Add Spending',
          template: 'Are you sure you want add $' + data.value + '?',
          onOk: function() {
            Meteor.call('addSpendingPromotionValue', data, function(err, res) {

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
                  title: 'Spending updated',
                  template: 'User spending were updated!',
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
        
    },
    
})