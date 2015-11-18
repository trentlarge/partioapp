collegeEmails = {
	"Duke University": "duke.edu",
	"Rollins College": "rollins.edu",
	"Test Gmail IDs": "gmail.com"
}

emailCheck = function(college, email) {
	console.log(college, email);
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

Template.register.events({
	'click #registerButton': function(e, template) {
		e.preventDefault();
	    var email = template.find('[name=email]').value;
	    var password = template.find('[name=password]').value;
	    var profileDetails = {
	    	name: template.find('[name=name]').value,
				mobile: template.find('[name=mobile]').value,
				mobileValidated: false,
	    	college: template.find('#college').value,
	    	avatar: "notSet",
	    	location: Session.get('newLocation')
	    };

			PartioLoad.show('Thank you! Now we\'re creating your account.')

	  if (email && password && profileDetails.name && profileDetails.college) {
			if (emailCheck(profileDetails.college, email)) {
    		Accounts.createUser({email: email, password: password, telephone: profileDetails.telephone, profileDetails: profileDetails}, function(error) {
	    			if (error) {
	    				PartioLoad.hide();
	    				IonPopup.show({
	    					title: 'Error while Signing up. Please try again.',
	    					template: '<div class="center">'+error.reason+'</div>',
	    					buttons:
	    					[{
	    						text: 'OK',
	    						type: 'button-assertive',
	    						onTap: function() {
	    							IonPopup.close();
	    						}
	    					}]
	    				});
	    			} else {
	    				Meteor.call('createCustomer', Meteor.userId(), function(error, result) {
	    					if (!error) {
									PartioLoad.setMessage('Success! Your invitation will be send in few seconds, please check your inbox.')
	    						console.log("Stripe Customer creation in progress!");
	    						var userTransId = Transactions.insert({
	    							earning: [],
	    							spending: []
	    						});
    							Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.transactionsId": userTransId}}, function(){
										PartioLoad.hide();
										Router.go('/profile');
									});

	    					} else {
	    						PartioLoad.hide();
									IonPopup.show({
										title: 'Error while Signing up. Please try again.',
										template: '<div class="center">'+error.reason+'</div>',
										buttons:
										[{
											text: 'OK',
											type: 'button-assertive',
											onTap: function() {
												IonPopup.close();
											}
										}]
									});
	    					}
	    				})
	    			}
	    		});
	    	}
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
});
