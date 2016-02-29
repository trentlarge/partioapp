Template.adminSearchDetails.destroyed = function() {
    Session.set('selectedCategory', null);
    Session.set('selectedCondition', null);
    Session.set('updateMode', null);
}

Template.adminSearchDetails.helpers({
    
    selectedCategory: function(category) {
        return (Session.get('selectedCategory') == category) ? 'selected' : '';
    },
    
    selectedCondition: function(index) {
        return (Session.get('selectedCondition') == index) ? 'selected' : '';
    },
    
    isLocationSelected: function(area) {
        return (this.profile.area == area) ? 'selected' : '';
    },
    
    updateMode: function() {
        return (Session.get('updateMode')) ? '' : 'disabled';
    }
    
});

Template.adminSearchDetails.events({
    
    'change #college': function(e, template) {
        Session.set('updateMode', true);
    },
    
    'click .update-user': function(e, template) {
        
         var user = this;
         user.profile.area = $('#college').val();
        
         IonPopup.confirm({
            okText: 'Proceed',
            cancelText: 'Cancel',
            title: 'Update user',
            template: 'Are you sure you want update this user?',
            onOk: function() {
                Meteor.call('updateUser', user._id, user, function(err, res) {

                  if(err) {
                    var errorMessage = err.reason || err.message;
                    if(err.details) {
                      errorMessage = errorMessage + "\nDetails:\n" + err.details;
                    }
                    sAlert.error(errorMessage);
                    return;
                  }

                  Session.set('updateMode', false);

                  setTimeout(function(){
                    IonPopup.show({
                      title: 'User updated',
                      template: 'User updated successfully!',
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
         });
    },
    
    'click .delete-user': function(e, template) {
        
        var user = this;
        
        IonPopup.confirm({
            okText: 'Proceed',
            cancelText: 'Cancel',
            title: 'Delete user',
            template: 'Are you sure you want delete this user?',
            onOk: function() {
                Meteor.call('removeUser', user._id, function(err, res) {

                    if(err) {
                        var errorMessage = err.reason || err.message;
                        if(err.details) {
                          errorMessage = errorMessage + "\nDetails:\n" + err.details;
                        }
                        sAlert.error(errorMessage);
                        return;
                    }

                    Router.go('/admin/search/users');

                    setTimeout(function(){
                        IonPopup.show({
                          title: 'User deleted',
                          template: 'User deleted successfully!',
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
        });     
    },
    
});