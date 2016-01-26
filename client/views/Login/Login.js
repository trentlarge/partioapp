Template.login.events({
	'click #triggerGPS': function() {
		Router.go('/register');
	},
	'click #loginButton': function(e, template) {
		e.preventDefault();

		PartioLoad.show();

		var email = template.find('[name=email]').value;
		var password = template.find('[name=password]').value;

		Meteor.loginWithPassword(email, password, function(error) {

			PartioLoad.hide();

			if (error) {
				IonPopup.show({
					title: 'Login failed!',
					template: error.reason + '. Please try again.',
					buttons: [{
						text: 'OK',
						type: 'button-calm',
						onTap: function() {
							IonPopup.close();
						}
					}]
				});
			} else {
				Router.go('/');
			}
		});

	},
	'click #forgot-password': function() {

		IonPopup.prompt({
			cancelText: 'Cancel',
			title: 'Reset Password',
			template: 'Reset link will be sent to this Email.',
			okText: 'Submit',
			inputType: 'email',
			inputPlaceholder: 'Enter your registered email',
			onOk: function(event, response) {
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
//				console.log('Cancelled')
			}
		})
	},

	'click #fblogin': function(e, template) {
		Meteor.loginWithFacebook({ requestPermissions: ['email', 'public_profile', 'user_birthday']}, function(err){
		 if (err) {
				 throw new Meteor.Error("Facebook login failed");
		 } else {

			if (user.hasOwnProperty('services') && user.services.hasOwnProperty('facebook')  ) {
				var result = Meteor.http.get('https://graph.facebook.com/v2.4/' + user.services.facebook.id + '?access_token=' + user.services.facebook.accessToken + '&fields=first_name, last_name, birthday, email, gender, location, link, friends');
			}

			 Router.go('/profile');
			 $('#name').val(Meteor.user().profile.name);
			 $('#email').val(Meteor.user().emails[0].address);
		 }
		});
	},
})

function CheckLocatioOn(){
	var onSuccess = function(position) {
		Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
	};

	function onError(error) {
			// alert(error.code +", "+ error.message);
			IonPopup.show({
				title: "Location Services Unavailable.",
				template: 'Please enable Location services for this app from Settings > Privacy > Location Services',
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
    
  $('.carousel').carousel()
    
//  $(".bar-header").hide();

	if(window.cordova && window.cordova.plugins.Keyboard) {
		// cordova.plugins.Keyboard.disableScroll(true);
		// cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}

	window.addEventListener('native.keyboardhide', function() {
		$(".content.dont-slice-screen").css("bottom", "0px");
	});
}
