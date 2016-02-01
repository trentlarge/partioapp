Template.register.rendered = function() {
    $('#birthDate').inputmask({"mask": "99/99/9999"});
    $('#birthDate').datepicker({
      startView: 'decade',
      endDate: '-16y',
    });
    
    if(window.plugins && window.plugins.sim) {
        window.plugins.sim.getSimInfo(successCallback, errorCallback);
    }
    
}
 
function successCallback(result) {
  console.log(result);
  if(result.phoneNumber) {
      $('#input-mobile').val(result.phoneNumber);
  }
    //alert(JSON.stringify(result));
}
 
function errorCallback(error) {
  console.log(error);
}

// devEmails = [
//   "petar.korponaic@gmail.com",
//   "korponaic@gmail.com",
//   "claytonmarinho@gmail.com",
//   "breno.wd@gmail.com",
//   "lucasbr.dafonseca@gmail.com"
// ];

// emailCheck = function(college, email) {
// 	if (email.split("@")[1] !== collegeEmails[college] && devEmails.indexOf(email) < 0) {
// 		IonPopup.show({
// 			title: 'Please enter a valid college email ID',
// 			template: 'Your email address has to match the official College email ID',
// 			buttons:
// 			[{
// 				text: 'OK',
// 				type: 'button-assertive',
// 				onTap: function() {
// 					IonPopup.close();
// 				}
// 			}]
// 		});
// 		return false;
// 	} else {
// 		return true;
// 	}
// }

Template.register.events({
  'change #birthDate': function(e, template) {
    $('.datepicker').hide();
  },

  'keypress #input-mobile': function(e, template) {
    $('#input-mobile').inputmask("+1 (999) 999-9999", {placeholder:" " });
  },

	'click #registerButton': function(e, template) {
		e.preventDefault();
        var email = template.find('[name=email]').value;
        var password = template.find('[name=password]').value;
        var profileDetails = {
            name: template.find('[name=name]').value,
            //mobile: template.find('[name=mobile]').value,
            mobile: '',
            area: template.find('#college').value,
            birthDate: template.find('[name=birthDate]').value,
            avatar: base64imgs('profile-image-placeholder')
//            location: Session.get('newLocation')
    };

    if(email && password && profileDetails.name && profileDetails.area && profileDetails.area !== 'Select') {
      //if (emailCheck(profileDetails.college, email)) {

      PartioLoad.show('Please wait, we\'re creating your account....');
      
      Accounts.createUser({email: email, password: password, telephone: profileDetails.telephone, profileDetails: profileDetails}, function(error) {
        if (error) {
          PartioLoad.hide();
          IonPopup.show({
            title: 'Signing up failed.',
            template: error.reason + '. Please try again.',
            buttons: [{
              text: 'OK',
              type: 'button-assertive',
              onTap: function() {
                IonPopup.close();
              }
            }]
          });
        } else {
          PartioLoad.hide();
          Router.go('/profile');
        }
      })
    } else {
      IonPopup.show({
        title: 'Missing fields',
        template: 'Please make sure all mandatory fields are entered to proceed further',
        buttons: [{
            text: 'OK',
            type: 'button-calm',
            onTap: function() {
                IonPopup.close();
            }
        }]
      });
    }
  }
});

Template.modalPrivacyPolicy.events({
  'click #accept': function(e, template) {
    e.preventDefault();
    Router.go('/register');

    //closemodal
    $('.modal .bar button').trigger('click');
  },

  'click #decline': function(e, template) {
    e.preventDefault();
  },

});

