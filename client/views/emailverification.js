Template.emailverification.onRendered(function() {
	var token = (Iron.Location.get().path).split("/verify-email/")[1];
	console.log(token);
	if (token) {
		Accounts.verifyEmail(token, function(err) {
			if (err != null) {
				if (err.message == 'Verify email link expired [403]') {
					console.log('Sorry this verification link has expired.');
					IonPopup.show({
						title: 'Error!',
						template: '<div class="center">Sorry this verification link has expired.</div>',
						buttons: 
						[{
							text: 'OK',
							type: 'button-assertive',
							onTap: function() {
								IonPopup.close();
								window.location = "http://partioapp.com"
							}
						}]
					});
				}
			} else {
				console.log('Thank you! Your email address has been confirmed.')
				IonPopup.show({
					title: 'Success!',
					template: '<div class="center">Your email address is successfully verified</div>',
					buttons: 
					[{
						text: 'OK',
						type: 'button-assertive',
						onTap: function() {
							IonPopup.close();
							// <a href="mycoolapp://">Open my app</a>
							window.location = "http://partio.xyz"
						}
					}]
				});
			}
		});
	}
});


Template.resetpassword.events({
	'click #new-password': function(e,template) {
		var password1 = template.find('[name=password1]').value;
		var password2 = template.find('[name=password2]').value;
		var token = (Iron.Location.get().path).split("/reset-password/")[1];

		if (password1 === password2) {
			Accounts.resetPassword(token, password1, function(error) {
				if (!error) {
					IonLoading.show({
						duration: 2000,
						customTemplate: '<div class="center"><h5>Successfully set!</h5></div>',
					});
					window.location = "http://partio.xyz"
				} else {
					IonPopup.show({
						title: 'Error!',
						template: '<div class="center">'+ error.message +'</div>',
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
		} else {
			IonPopup.show({
				title: 'Passwords do not match!',
				template: '',
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
	}
})
