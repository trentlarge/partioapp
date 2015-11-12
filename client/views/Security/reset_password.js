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
});
