Template.adminConfigurations.rendered = function() {
    Session.set('editMode', false);
};

Template.adminConfigurations.helpers({
    
    isEditMode: function() {
        return (Session.get('editMode')) ? '' : 'disabled';
    },
    
});

Template.adminConfigurations.events({
    
    'change .new-email': function(e, template) {
        
        var text = $(e.target).val();

        if(text.length > 0) {
            Session.set('editMode', true);
        }
        else {
            Session.set('editMode', false);
        }
    },
    
    'keypress .new-email': function(e, template) {
        
        var text = $(e.target).val();

        if(text.length > 0) {
            Session.set('editMode', true);
        }
        else {
            Session.set('editMode', false);
        }
    },
    
    'click .save-new-admin': function(e, template) {
        
        var admin = {
            email: $('.new-email').val(),
            admin: false,
            permissions: {
                view: $('.new-view').prop('checked'),
                update: $('.new-update').prop('checked'),
                delete: $('.new-delete').prop('checked'),
            }
        }
        
        Meteor.call('insertAdmin', admin, function(err, res) {
           
            if(err) {
                var errorMessage = err.reason || err.message;
                if(err.details) {
                    errorMessage = errorMessage + "\nDetails:\n" + err.details;
                }
                sAlert.error(errorMessage);
                return;
            }
            
            $('.new-email').val('');
            $('.new-view').prop('checked', false);
            $('.new-update').prop('checked', false);
            $('.new-delete').prop('checked', false);

            Session.set('editMode', false);

        });
    },
    
    'click .delete-admin': function(e, template) {
      
        var adminId = $(e.target).attr('id');
        
        IonPopup.confirm({
          okText: 'Proceed',
          cancelText: 'Cancel',
          title: 'Delete user',
          template: 'Are you sure you want delete this user?',
          onOk: function() {
            Meteor.call('removeAdmin', adminId, function(err, res) {
              IonPopup.close();

              if(err) {
                var errorMessage = err.reason || err.message;
                if(err.details) {
                  errorMessage = errorMessage + "\nDetails:\n" + err.details;
                }
                sAlert.error(errorMessage);
                return;
              }
            });
          },

          onCancel: function() {
            return false;
          }
        });
        
    },    
    
});