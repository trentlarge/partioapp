Session.setDefault('profileEdit', false);

Template.profile.helpers({
  profileEdit: function() {
    return Session.get('profileEdit');
  },
  venmoUser: function() {
    return Meteor.userId();
  },
  venmoExists: function() {
    if (Meteor.user().profile.venmo) {
      return true;
    }
  },
  alreadyStriped: function() {
    if (!! Meteor.user().profile.stripeAccount) {
      return true; 
    }
  },
  emailSet: function() {
    // if (Meteor.user.emails) {
    //   var email = Meteor.user.emails[0].address;
    //   if (email.split("@")[1].split(".")[1] == "edu") {
    //     return true;
    //   }
    // }
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
        Meteor.call('updateOfficialEmail', Meteor.userId(), college, email, function(error, result){
          if (!error) {
            console.log(result);
            console.log(error);
          }
        })
        // Meteor.users.update({"_id": Meteor.userId()}, {$set: {"emails[0].address": email, "emails[0].verified": false, "profile.college": college}}
        // Meteor.users.update({"_id": Meteor.userId()}, {
        //     $addToSet: { "emails": {
        //       'address': email,
        //       'verified': false
        //     }}
        //   }, function(error) {
        //   if (!error) {
        //     Meteor.call('sendVerificationEmail', Meteor.userId(), function(error, result) {
        //       if (!error) {
        //         console.log(result);
        //         console.log(error);
        //       }
        //     });
        //     IonLoading.hide();
        //     console.log("success!");
        //   }
        // });        
      }
    }
  },
  'click #logout': function() {
    IonPopup.confirm({
      okText: 'Logout',
      cancelText: 'Cancel',
      title: 'Logging out',
      template: '<div class="center">Are you sure you want to logout?</div>',
      onOk: function() {
        Router.go('/')
        Meteor.logout();
        IonPopup.close();
      },
      onCancel: function() {
        console.log('Cancelled');
        IonPopup.close();
      }
    });
  }
});

Template.appLayout.events({
  'click #cancelProfile': function() {
    console.log("yayayaya");
    Router.go('/');
  },
  'click #saveProfile': function() {
    IonLoading.show();
    var updatedProfile = {
      "name": $('#profilename').val(),
      "college": $('#profileuniversity').val()
      // "mobile": $('#profilemobile').val()
    }
    console.log(updatedProfile);
    Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.name": updatedProfile.name, "profile.college": updatedProfile.college}}, function(error) {
      if (!error) {
        IonLoading.hide();
        console.log("success!");
        Session.set('profileEdit', false);
      }
    });
  }
})

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
                Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.avatar": "data:image/jpeg;base64," + imageData}});                
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
                Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.avatar": "data:image/jpeg;base64," + imageData}});                
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
  }
})

