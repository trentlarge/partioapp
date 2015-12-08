Template.appLayout.events({
    
    'click #cancelProfile': function() {
        Router.go('/');
    },

  'click #saveProfile': function() {
    PartioLoad.show();

    var updatedProfile = {
      college: $('#profileuniversity').val(),
      mobile: $('#profilemobile').val()
    };

    Meteor.call("updateUserProfile", updatedProfile, function(err, res) {
      PartioLoad.hide();
      if(err) {
        var errorMessage = err.reason || err.message;
        if(err.details) {
          errorMessage = errorMessage + "\nDetails:\n" + err.details;
        }
        sAlert.error(errorMessage);
        return;
      }

      Session.set('profileEdit', false);        
    });
  }
});

Template.profile.rendered = function() {
    $('#profilemobile').inputmask({"mask": "+9 (999) 999-9999"});   
}

Session.setDefault('profileEdit', false);

Template.profile.helpers({
  profileEdit: function() {
    return Session.get('profileEdit');
  },
  alreadyStriped: function() {
    if (!! Meteor.user().profile.stripeAccount) {
      return true;
    }
  },
  emailSet: function() {
    return Meteor.user().emails[0].address;
  }
})

Template.profile.destroyed = function() {
  Session.set('profileEdit', false);
}

Template.profile.events({
  'keyup #profileEdit': function(e, template) {
    e.preventDefault();
    Session.set('profileEdit', true);
  },
  'click #changePassword': function() {
    console.log('changePassword');
    IonPopup.alert({
      title: 'Changing Password',
      template: '<div class="center">Work in progress</div>',
      okText: 'Got It!'
    });
  },
  'click #save-college-email': function() {

    var college = $('#profileuniversity').val();
    var email = $('#profileemail').val();

    if (college && email) {
      if (emailCheck(college, email)) {
        Meteor.call('updateOfficialEmail', college, email, function(err, res) {
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
    }
  },
  'click #logout': function() {
      logout();
  }
});

Template.settingsProfileImage.helpers({
  'noProfileYet': function() {
    if (Meteor.user().profile.avatar === "notSet") {
      return true;
    } else {
      return false;
    }
  },
  'profileImage': function() {
    return Meteor.user().profile.avatar;
  }
});


Template.settingsProfileImage.events({
  'click .profile-avatar': function(event, template) {
    if (Meteor.isCordova) {
      IonActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Choose from Library' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
        console.log('Cancelled!');
      },
      buttonClicked: function(index)
      {
        if (index === 0)
        {
          navigator.camera.getPicture(onSuccess1, onFail1,
          {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA
          });

          function onSuccess1(imageData)
          {
            console.log('camera working!');
            // Session.set("imageAdded", "data:image/jpeg;base64," + imageData);

            IonPopup.confirm({
              cancelText: 'No',
              okText: 'Apply',
              title: 'Profile Image',
              template: '<div class="center"><p> Do you wish to apply this pic as your profile image? </p></div>',
              onCancel: function()
              {
                console.log('Cancelled')
              },
              onOk: function()
              {

                Meteor.call("updateUserProfile", { avatar: "data:image/jpeg;base64," + imageData }, function(err, res) {
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

            return false;
          }

          function onFail1(message)
          {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        if (index === 1)
        {
          navigator.camera.getPicture(onSuccess2, onFail2,
          {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          });

          function onSuccess2(imageData)
          {
            console.log('photo library working!');
            // Session.set("imageAdded", "data:image/jpeg;base64," + imageData);

            IonPopup.confirm({
              cancelText: 'No',
              okText: 'Apply',
              title: 'Profile Image',
              template: '<div class="center"><p> Do you wish to apply this pic as your profile image? </p></div>',
              onCancel: function()
              {
                console.log('Cancelled')
              },
              onOk: function()
              {
                Meteor.call("updateUserProfile", { avatar: "data:image/jpeg;base64," + imageData }, function(err, res) {
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

            return false;
          }

          function onFail2(message)
          {
            IonPopup.alert(
            {
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        return true;
      }
    });
} else {
    console.log('file upload click');
    $('#browser-file-upload').click();
  }
},
'change #browser-file-upload': function(input) {

    console.log(input.target.files[0]);
    var FR = new FileReader();
    FR.onload = function(e) {
     var newImage = e.target.result;
     Meteor.call("updateUserProfile", { avatar: newImage }, function(err, res) {
      if(err) {
        var errorMessage = err.reason || err.message;
        if(err.details) {
          errorMessage = errorMessage + "\nDetails:\n" + err.details;
        }
        sAlert.error(errorMessage);
        return;
      }
     });
   };
   FR.readAsDataURL( input.target.files[0] );
}
})
