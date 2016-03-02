Template.adminPromotionsDetails.destroyed = function() {
    Session.set('earningTimeline', null);
    Session.set('spendingTimeline', null);
}

Template.adminPromotionsDetails.helpers({
    
    earningTimeline: function() {
        return Session.get('earningTimeline');
    },
    
    spendingTimeline: function() {
        return Session.get('spendingTimeline');
    }
    
});

Template.adminPromotionsDetails.events({
    
    'click .earning-timeline': function(e, template) {
      
        var button = $(e.target);
        
        if(Session.get('earningTimeline')) {
            button.text('SHOW TIMELINE');
            Session.set('earningTimeline', false);
        }
        else {
            button.text('HIDE TIMELINE');
            Session.set('earningTimeline', true);
        }
        
    },
    
    'click .spending-timeline': function(e, template) {
      
        var button = $(e.target);
        
        if(Session.get('spendingTimeline')) {
            button.text('SHOW TIMELINE');
            Session.set('spendingTimeline', false);
        }
        else {
            button.text('HIDE TIMELINE');
            Session.set('spendingTimeline', true);
        }
        
    },
    
    'click .add-earning': function(e, template) {
        
        if($('.input-earning').val() == '') return;
        
        var self = this;
        console.log(self);
        
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
            Meteor.call('addEarningPromotionValue', self._id, data, function(err, res) {

              if(err) {
                var errorMessage = err.reason || err.message;
                if(err.details) {
                  errorMessage = errorMessage + "\nDetails:\n" + err.details;
                }
                sAlert.error(errorMessage);
                return;
              }
              
              $('.input-earning').val('');
                
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
        
        if($('.input-spending').val() == '') return;
        
        var self = this;
        console.log(self);
        
        var data = {
            userId: Meteor.userId(),
            value: parseFloat($('.input-spending').val()).toFixed(2),
            from: 'admin'
        }
        
        if(this.private.promotions.earning && this.private.promotions.earning.total) {
            if(this.private.promotions.spending && this.private.promotions.spending.total) {
                
                var spending = Number(this.private.promotions.spending.total) + Number(data.value);
                var earning = Number(this.private.promotions.earning.total);
                
                if(spending > earning) {
                    IonPopup.alert({
                       title: "Sorry",
                       template:  "You can't add a spending value more than earning value",
                    });
                    return;
                }
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
            Meteor.call('addSpendingPromotionValue', self._id, data, function(err, res) {

              if(err) {
                var errorMessage = err.reason || err.message;
                if(err.details) {
                  errorMessage = errorMessage + "\nDetails:\n" + err.details;
                }
                sAlert.error(errorMessage);
                return;
              }
              
              $('.input-spending').val('');
                
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