Template.emailverification.onRendered(function() {
	var token = (Iron.Location.get().path).split("/verify-email/")[1];

	if (token) {
		Accounts.verifyEmail(token, function(err) {
			if (err != null) {
				if (err.message == 'Verify email link expired [403]') {
					IonPopup.show({
						title: 'Error!',
						template: '<div class="center">Sorry this verification link has expired.</div>',
						buttons:
						[{
							text: 'OK',
							type: 'button-assertive',
							onTap: function() {
								IonPopup.close();
								window.location = "/login"
							}
						}]
					});
				}
			} else {

				//Creating transactionsId for new user;
				Meteor.call('createTransactions');

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
							window.location = "/"
						}
					}]
				});
			}
		});
	}
});
