Template.register.rendered = function() {
  $('.input-mobile').inputmask({"mask": "+9 (999) 999-9999"});
  $('#birthDate').inputmask({"mask": "99/99/9999"});
  $('#birthDate').datepicker({
      startView: 'decade',
      endDate: '-16y',
  });

}

collegeEmails = {
	"Duke University": "duke.edu",
	"Rollins College": "rollins.edu",
	"Test Gmail IDs": "gmail.com"
}

emailCheck = function(college, email) {
	if (email.split("@")[1] !== collegeEmails[college]) {
		IonPopup.show({
			title: 'Please enter a valid college email ID',
			template: '<div class="center">Your email address has to match the official College email ID</div>',
			buttons:
			[{
				text: 'OK',
				type: 'button-assertive',
				onTap: function() {
					IonPopup.close();
				}
			}]
		});
		return false;
	} else {
		return true;
	}
}


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

Template.register.events({

    'change #birthDate': function(e, template) {
        $('.datepicker').hide();
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
	    	avatar: "notSet",
	    	location: Session.get('newLocation')
	    };

    if(email && password && profileDetails.name && profileDetails.college) {
      if (emailCheck(profileDetails.college, email)) {
        PartioLoad.show('Please wait, we\'re creating your account....')
        Accounts.createUser({email: email, password: password, telephone: profileDetails.telephone, profileDetails: profileDetails}, function(error) {
          if (error) {
            PartioLoad.hide();
            IonPopup.show({
              title: 'Error while Signing up. Please try again.',
              template: '<div class="center">'+error.reason+'</div>',
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
            console.log('meteor user created');
            Router.go('/profile');
          }
        })
      } else {
				PartioLoad.hide();

	    	IonPopup.show({
	    		title: 'Missing fields',
	    		template: '<div class="center">Please make sure all mandatory fields are entered to proceed further</div>',
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
  }
});
