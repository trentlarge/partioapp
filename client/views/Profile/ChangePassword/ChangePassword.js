Template.changePassword.events({
  'click #save-password': function() {
    var new_password = $('#new_password').val() || '';
    var new_repeat_password = $('#new_repeat_password').val() || '';
    var old_password = $('#old_password').val() || '';

     new_password = new_password.replace(/^\s*|\s*$/g, '');
     new_repeat_password = new_repeat_password.replace(/^\s*|\s*$/g, '');

     checkPasswordIsValid = function (aString) {
       aString = aString || '';
       return aString.length > 5;
     }

    if (new_password === new_repeat_password) {

        var isValidPassword = checkPasswordIsValid(new_password);

            if (!isValidPassword) {
              IonPopup.alert({
                okText: 'Retype',
                title: 'Change Password',
                template: '<div class="center">Your password must be at least 6 characters long.</div>',
                onOk: function() {
                  IonPopup.close();
                  $('#new_password').val('');
                  $('#new_repeat_password').val('');

                }
              });
            } else {

              Accounts.changePassword(old_password, new_password, function(err, res) {
                if(err) {
                    var errorMessage = err.reason || err.message;
                    if(err.details) {
                      errorMessage = errorMessage + "\nDetails:\n" + err.details;
                    }
                    sAlert.error(errorMessage);
                    return;
                }
                IonPopup.alert({
                  okText: 'Ok',
                  title: 'Change Password',
                  template: '<div class="center">Succesfully changed!</div>',
                  onOk: function() {
                    IonPopup.close();
                    $('#new_password').val('');
                    $('#new_repeat_password').val('');
                    Router.go('/profile');
                  }
                });
              });
            }

    } else {
      IonPopup.alert({
        okText: 'Retype',
        title: 'Change Password',
        template: '<div class="center">Passwords do not match.</div>',
        onOk: function() {
          IonPopup.close();
          $('#new_password').val('');
          $('#new_repeat_password').val('');
        }
      });
    }
  }
});
