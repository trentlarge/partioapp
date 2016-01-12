Template.register.rendered = function() {
  $('#birthDate').inputmask({"mask": "99/99/9999"});
  $('#birthDate').datepicker({
      startView: 'decade',
      endDate: '-16y',
  });
}

collegeEmails = {
	"Duke University": "duke.edu",
	"Yale University": "yale.edu",
	//"Test Gmail IDs": "gmail.com"
}

// emailCheck = function(college, email) {
// 	if (email.split("@")[1] !== collegeEmails[college]) {
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
      $('#input-mobile').inputmask("+9 (999) 999-9999", {placeholder:" " });
  },

	'click #registerButton': function(e, template) {
		e.preventDefault();
	    var email = template.find('[name=email]').value;
	    var password = template.find('[name=password]').value;
			var mobile = template.find('[name=mobile]').value;
	    var profileDetails = {
	    	name: template.find('[name=name]').value,
				mobile: template.find('[name=mobile]').value,
	    	college: template.find('#college').value,
        birthDate: template.find('[name=birthDate]').value,
	    	avatar: base64imgs('profile-image-placeholder'),
	    	location: Session.get('newLocation')
	    };

    if(email && password && profileDetails.name && profileDetails.college) {
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

      // } else {
      //       PartioLoad.hide();

	    	// IonPopup.show({
	    	// 	title: 'Missing fields',
	    	// 	template: 'Please make sure all mandatory fields are entered to proceed further.',
	    	// 	buttons: [{
	    	// 		text: 'OK',
	    	// 		type: 'button-calm',
	    	// 		onTap: function() {
	    	// 			IonPopup.close();
	    	// 		}
	    	// 	}]
	    	// });
      // }
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