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

		Meteor.loginWithPassword(email, password, function(error) {

			PartioLoad.hide();

			if (error) {
//				console.log(error);
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
		// IonLoading.show();
		// var authOptions = {};
		//
		// if(Meteor.isCordova) {
		// 	authOptions.loginStyle = "redirect";
		// 	//authOptions.redirectUrl = "/profile"
		// }

		Meteor.loginWithFacebook({ requestPermissions: ['email', 'public_profile', 'user_birthday']}, function(err){
					 if (err) {
							 throw new Meteor.Error("Facebook login failed");
					 } else {

						 if (user.hasOwnProperty('services') && user.services.hasOwnProperty('facebook')  ) {
        var result = Meteor.http.get('https://graph.facebook.com/v2.4/' + user.services.facebook.id + '?access_token=' + user.services.facebook.accessToken + '&fields=first_name, last_name, birthday, email, gender, location, link, friends');

        console.log(result.data.first_name);
        console.log(result.data.last_name);
        console.log(result.data.birthday);
        console.log(result.data.email);
        console.log(result.data.gender);
        console.log(result.data.location);
        console.log(result.data.link);
        console.log(result.data.friends);
}


						 console.log(Meteor.user().services.facebook.email);
						 //console.log('logado');
						 Router.go('/profile');
						 //console.log(Meteor.user());
						 $('#name').val(Meteor.user().profile.name);
						 $('#email').val(Meteor.user().emails[0].address);
					 }
			 });


			// Meteor.loginWithFacebook(authOptions, function(err) {
			// if (err) {
//				console.log(err);
			// 	IonPopup.show({
			// 		title: 'Error connecting to Facebook',
			// 		template: '<div class="center">'+err+'</div>',
			// 		buttons: [{
			// 			text: 'OK',
			// 			type: 'button-calm',
			// 			onTap: function() {
			// 				IonPopup.close();
			// 			}
			// 		}]
			// 	});
			// } else {
				//If Meteor.userId() exists
				// var UserExists = Meteor.users.find({_id: Meteor.userId()}, {$ne:{"profile.transactionsId": null}});
				//if(Meteor.user().profile.transactionsId)
				//{
					//user exist
				//}
				// else
				// {
				// 	Meteor.call('createCustomer', Meteor.userId(), function(error, result) {
				// 		if (!error) {
				// 			var userTransId = Transactions.insert({
				// 				earning: [],
				// 				spending: []
				// 			});
				// 			Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.transactionsId": userTransId}});
				// 			PartioLoad.hide();
				//
				// 		} else {
				// 			PartioLoad.hide();
				// 		}
				// 	})
				// }
			//}
		//});
	},

})

function CheckLocatioOn()
{
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

    $(".bar-header").hide();

	if(window.cordova && window.cordova.plugins.Keyboard) {
		// cordova.plugins.Keyboard.disableScroll(true);
		// cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}

	window.addEventListener('native.keyboardhide', function() {
		$(".content.dont-slice-screen").css("bottom", "0px");
	});

}
