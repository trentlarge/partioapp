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
				telephone: template.find('[name=telephone]').value,
	    	// mobile: template.find('[name=mobile]').value,
	    	college: template.find('#college').value,
	    	avatar: "notSet",
	    	location: Session.get('newLocation')
	    };

	    console.log(email, password, profileDetails);

	    if (email && password && profileDetails.name && profileDetails.college) {
	    	// IonLoading.show();
	    	if (emailCheck(profileDetails.college, email)) {
	    		Accounts.createUser({email: email, password: password, telephone: profileDetails.telephone, profileDetails: profileDetails}, function(error) {
	    			console.log(error);

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
	    						console.log("Stripe Customer creation in progress!");
	    						var userTransId = Transactions.insert({
	    							earning: [],
	    							spending: []
	    						});
	    						Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.transactionsId": userTransId}});
	    						PartioLoad.hide();
	    					} else {
	    						PartioLoad.hide();
	    						console.log(error);
	    					}
	    				})
	    				IonModal.close();
	    			}
	    		});
	    	}
	    } else {
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

Template.login.events({
	'click #triggerGPS': function() {
		Router.go('/register');
	//if (!Session.get('initialLoc')) {

			//CheckLocatioOn();
	//	}
	},
	'click #loginButton': function(e, template) {
		e.preventDefault();

		PartioLoad.show();

		var email = template.find('[name=email]').value;
		var password = template.find('[name=password]').value;
		console.log(email, password);

		Meteor.loginWithPassword(email, password, function(error) {

			PartioLoad.hide();

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
			} else {
				console.log('user: '+ email +' Logged-In successfully!');
				Router.go('/');
			}
		});

	},
	'click #forgot-password': function() {

		IonPopup.prompt({
			cancelText: 'Cancel',
			title: 'Reset Password',
			template: '<div class="center">Reset link will be sent to this Email<br><br></div>',
			okText: 'Submit',
			inputType: 'email',
			inputPlaceholder: 'Enter Email ID',
			onOk: function(event, response) {
				console.log(response);
				Accounts.forgotPassword({email: response}, function(error){
					if (!error) {
						IonLoading.show({
							duration: 2000,
							customTemplate: '<div class="center"><h5>Email with password reset link sent</h5></div>',
						});
					} else {
						IonLoading.show({
							duration: 2000,
							customTemplate: '<div class="center"><h5>No user found with this email</h5></div>',
						});
					}
				});
			},
			onCancel: function() {
				console.log('Cancelled')
			}
		})


	},
	'click #fblogin': function() {
		console.log("calling facebook");
		// IonLoading.show();
		Meteor.loginWithFacebook({}, function(err){
			if (err) {
				console.log(err);
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
			}
			else
			{
				//If Meteor.userId() exists
				// var UserExists = Meteor.users.find({_id: Meteor.userId()}, {$ne:{"profile.transactionsId": null}});
				if(Meteor.user().profile.transactionsId)
				{
					console.log('User Existed!');
				}
				else
				{
					Meteor.call('createCustomer', Meteor.userId(), function(error, result) {
						if (!error) {
							console.log("Stripe Customer creation in progress!");
							var userTransId = Transactions.insert({
								earning: [],
								spending: []
							});
							Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.transactionsId": userTransId}});
							PartioLoad.hide();

						} else {
							PartioLoad.hide();
							console.log(error);
						}
					})
				}
			}
		});
	}
})

//Template.register.helpers({
	// fetchedLocation: function() {
	// 	if (Session.get('newLocation')) {
	// 		return Session.get('newLocation').address
	// 	} else {
	// 		return "Location";
	// 	}
	// }
//})

// Template.register.created = function() {

// 	Session.set('newLocation', null);
// 	console.log(Geolocation.error());
// 	var locationCheck = Geolocation.error();
// 	if (locationCheck && locationCheck.code === 1) {
// 		IonPopup.show({
// 			title: locationCheck.message,
// 			template: '<div class="center">Please enable Location services for this app from Settings > Privacy > Location Services</div>',
// 			buttons: [{
// 				text: 'OK',
// 				type: 'button-calm',
// 				onTap: function() {
// 					IonPopup.close();
// 				}
// 			}]
// 		});
// 	}
// 	console.log(Geolocation.error());

// }


function CheckLocatioOn()
{
	var onSuccess = function(position) {
		Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
	};

	function onError(error) {
			// alert(error.code +", "+ error.message);
			IonPopup.show({
				title: "Location Services Unavailable.",
				template: '<div class="center">Please enable Location services for this app from Settings > Privacy > Location Services</div>',
				buttons: [{
					text: 'OK',
					type: 'button-calm',
					onTap: function() {
						IonPopup.close();
						IonModal.close();
					}
				}]
			});
		}

	// navigator.geolocation.getCurrentPosition(onSuccess, onError);
}



Template.login.rendered = function() {

    //$('.bar-header').hide();

	if(window.cordova && window.cordova.plugins.Keyboard) {
		// cordova.plugins.Keyboard.disableScroll(true);
		// cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}

	window.addEventListener('native.keyboardhide', function() {
		console.log('keyboard is closing');
		$(".content.dont-slice-screen").css("bottom", "0px");
	});

	// document.addEventListener("resume", function(){
	// 	console.log("RESUMED!!")
	// 		//CheckLocatioOn();
	// 	}, false);
}
