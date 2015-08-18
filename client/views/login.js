Template.register.events({
	'click #registerButton': function(e, template) {
		e.preventDefault();

	    var email = template.find('[name=email]').value;
	    var password = template.find('[name=password]').value;

	    var profile = {
	    	name: template.find('[name=name]').value,
	    	mobile: template.find('[name=mobile]').value,
	    	college: template.find('#college').value,
	    	avatar: "notSet"
	    };
	    console.log(email, password, profile.name, profile.mobile, profile.college);

	    Accounts.createUser({email: email, password: password, profile: profile}, function(error) {
	    	console.log(error);

	    	if (error) {
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
	    		IonModal.close();
	    	}
	    });
	}
});

Template.login.events({
	'click #loginButton': function(e, template) {
		e.preventDefault();

		var email = template.find('[name=email]').value;
		var password = template.find('[name=password]').value;
		console.log(email, password);


		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				console.log(error);
				IonPopup.show({
					title: 'Won\'t you try again?',
					template: '<div class="center">'+error.reason+'</div>',
					buttons: [{
						text: 'OK',
						type: 'button-calm',
						onTap: function() {
							IonPopup.close();
						}
					}]
				});
			}
			else {
				console.log('user: '+ email +' Logged-In successfully!');
			}
		});

	},
	'click #fblogin': function() {
		console.log("calling facebook");
		Meteor.loginWithFacebook({}, function(err){
			if (err) {
				IonPopup.show({
					title: 'Error connecting to Facebook',
					template: '<div class="center">'+err+'</div>',
					buttons: [{
						text: 'OK',
						type: 'button-calm',
						onTap: function() {
							IonPopup.close();
						}
					}]
				});
			} else {
				IonPopup.show({
					title: 'Great!',
					template: '<div class="center">Logging in through your Facebook account...</div>',
					buttons: [{
						text: 'OK',
						type: 'button-calm',
						onTap: function() {
							IonPopup.close();
						}
					}]
				});
			}
		});
	}
})



// https://api.venmo.com/v1/oauth/authorize?client_id=017d7cc0c478a5d7b471ab10a507eae50a0c29ed2153936d9747e390408b9af1&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance



