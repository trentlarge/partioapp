Accounts.onCreateUser(function(options,user) {
	console.log("OPTIONS-->>" + JSON.stringify(options));
	console.log("USER-->>" + JSON.stringify(user))
	var meteorUserId = user._id;

	if (user.services.facebook) {
		var fbLink = user.services.facebook.link;
		var linkId = fbLink.split("https://www.facebook.com/app_scoped_user_id/")[1].split("/")[0];

		user.profile = options.profile || {};
		user.profile.email = user.services.facebook.email;
		user.profile.avatar = 'http://graph.facebook.com/'+linkId+'/picture?type=large';
		user.profile.name = user.services.facebook.name
		//FOR NO APPARENT REASON FACEBOOK REFUSED TO SEND AVATAR AFTER LOGIN
		// user.profile.avatar = options.profile.avatar;
		user.profile.college = '';
		user.profile.mobile = '';

		var currentEmail = user.services.facebook.email;
		if (currentEmail.split("@")[1] === "duke.edu" || currentEmail.split("@")[1] === "rollins.edu") {
			user.emails = [{"address": currentEmail, "verified": false}]
			Meteor.setTimeout(function() {
				Accounts.sendVerificationEmail(user._id);
			}, 4 * 1000);
		}

		console.log('finished FACEBOOK user creation...');
		return user;

	} else {
		user.profile = options.profile || {};
		user.profile.email = user.emails[0].address;
		user.profile.avatar = options.profileDetails.avatar;
		user.profile.college = options.profileDetails.college;
		user.profile.mobile = options.profileDetails.mobile;
		user.profile.mobileValidated = options.profileDetails.mobileValidated;
		user.profile.name = options.profileDetails.name;
		user.profile.defaultPay = false;
		user.profile.defaultReceive = false;

		//NOT TAKING LOCATION DETAILS ON REGISTRATION ANYMORE
		// user.profile.address = options.profileDetails.location ? options.profileDetails.location.address : "-" ;
		// user.profile.latLong = options.profileDetails.location ? options.profileDetails.location.latLong : "-";

		// Notifications.insert({
		// 	userId: meteorUserId,
		// 	alerts: []
		// })
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
