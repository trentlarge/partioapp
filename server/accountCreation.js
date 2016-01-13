Accounts.onCreateUser(function(options,user) {
	console.log("OPTIONS -->>", options);
	console.log("USER-->>", user);
	var meteorUserId = user._id;

	user.profile = {};
	user.private = {};
	user.private.viewTutorial = false;

	user.secret = {};
	user.secret.canBorrow = false;
	user.secret.canShare = false;

	if (user.services.facebook) {

		console.log(user.services.facebook);

		var fbLink = user.services.facebook.link;
		var linkId = fbLink.split("https://www.facebook.com/app_scoped_user_id/")[1].split("/")[0];

		user.profile = options.profile || {};
		//user.profile.email = user.services.facebook.email;
		user.profile.avatar = 'http://graph.facebook.com/'+linkId+'/picture?type=large';
		user.profile.name = user.services.facebook.name
		user.profile.birthDate = user.services.facebook.birthday
		//FOR NO APPARENT REASON FACEBOOK REFUSED TO SEND AVATAR AFTER LOGIN
		// user.profile.avatar = options.profile.avatar;
		user.profile.area = '';
		user.private.mobile = '';

		var currentEmail = user.services.facebook.email;

		// if (currentEmail.split("@")[1] === "duke.edu" || currentEmail.split("@")[1] === "rollins.edu") {
		// 	user.emails = [{"address": currentEmail, "verified": false}]

			// Meteor.setTimeout(function() {
			// 	Accounts.sendVerificationEmail(user._id);
			// }, 4 * 1000);

//		} else {

			//Creating transactionsId for new user;
			Meteor.call('createTransactions', user._id);
//		}

		console.log('finished FACEBOOK user creation...');

		return user;

	} else {
		//user.profile = options.profile || {};
		//user.profile.email = user.emails[0].address;

		user.profile.name = options.profileDetails.name;
		user.profile.avatar = options.profileDetails.avatar;
		user.profile.area = options.profileDetails.area;
		user.profile.birthDate = options.profileDetails.birthDate;

		user.private.mobile = options.profileDetails.mobile;

		//NOT TAKING LOCATION DETAILS ON REGISTRATION ANYMORE
		// user.profile.address = options.profileDetails.location ? options.profileDetails.location.address : "-" ;
		// user.profile.latLong = options.profileDetails.location ? options.profileDetails.location.latLong : "-";

		// Notifications.insert({
		// 	userId: meteorUserId,
		// 	alerts: []
		// })
		
		//Creating transactionsId for new user;
		Meteor.call('createTransactions', user._id);

		console.log('finished MANUAL user creation...');

		Meteor.setTimeout(function() {
			Accounts.sendVerificationEmail(user._id);
		}, 4 * 1000);

		return user;
	}

});

// Accounts.validateLoginAttempt(function(attempt){
//   if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
//     console.log('email not verified');

//     return false; // the login is aborted
//   }
//   return true;
// });
