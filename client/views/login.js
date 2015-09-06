Template.register.events({
	'click #registerButton': function(e, template) {
		e.preventDefault();

	    var email = template.find('[name=email]').value;
	    var password = template.find('[name=password]').value;

	    var profileDetails = {
	    	name: template.find('[name=name]').value,
	    	mobile: template.find('[name=mobile]').value,
	    	college: template.find('#college').value,
	    	avatar: "notSet",
	    	location: Session.get('newLocation')
	    };

	    console.log(email, password, profileDetails);

	    if (email && password && profileDetails.name && profileDetails.mobile && profileDetails.college) {
	    	// IonLoading.show();
	    	Accounts.createUser({email: email, password: password, profileDetails: profileDetails}, function(error) {
	    		console.log(error);

	    		if (error) {
	    			IonLoading.hide();
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
	    					IonLoading.hide();
	    				} else {
	    					IonLoading.hide();
	    					console.log(error);
	    				}
	    			})
	    			IonModal.close();
	    		}
	    	});
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
		if (!Session.get('initialLoc')) {

			var onSuccess = function(position) {
				Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
			};

			function onError(error) {
				IonPopup.show({
					title: error.message,
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
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
		}
	},
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
		IonLoading.show();
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
				Meteor.call('createCustomer', Meteor.userId(), function(error, result) {
					if (!error) {
						console.log("Stripe Customer creation in progress!");
						var userTransId = Transactions.insert({
							earning: [],
							spending: []
						});
						Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.transactionsId": userTransId}});
						IonLoading.hide();

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

					} else {
						IonLoading.hide();
						console.log(error);
					}
				})

			}
		});
	}
})

Template.register.helpers({
	fetchedLocation: function() {
		if (Session.get('newLocation')) {
			return Session.get('newLocation').address
		} else {
			return "Location";
		}
	}
})

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




Template.login.rendered = function() {

	var onSuccess = function(position) {
		Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
	};

	function onError(error) {
			// alert(error.code +", "+ error.message);
			IonPopup.show({
				title: error.message,
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

		navigator.geolocation.getCurrentPosition(onSuccess, onError);

		document.addEventListener("resume", function(){
			console.log("RESUMED!!")
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
		}, false);
	}


