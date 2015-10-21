(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/accountCreation.js                                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Accounts.onCreateUser(function (options, user) {                       // 1
	console.log("OPTIONS-->>" + JSON.stringify(options));                 // 2
	console.log("USER-->>" + JSON.stringify(user));                       // 3
	var meteorUserId = user._id;                                          // 4
                                                                       //
	if (user.services.facebook) {                                         // 6
		var fbLink = user.services.facebook.link;                            // 7
		var linkId = fbLink.split("https://www.facebook.com/app_scoped_user_id/")[1].split("/")[0];
                                                                       //
		user.profile = options.profile || {};                                // 10
		user.profile.email = user.services.facebook.email;                   // 11
		user.profile.avatar = 'http://graph.facebook.com/' + linkId + '/picture?type=large';
		user.profile.name = user.services.facebook.name;                     // 13
		//FOR NO APPARENT REASON FACEBOOK REFUSED TO SEND AVATAR AFTER LOGIN
		// user.profile.avatar = options.profile.avatar;                     //
		user.profile.college = '';                                           // 16
		user.profile.mobile = '';                                            // 17
                                                                       //
		var currentEmail = user.services.facebook.email;                     // 19
		if (currentEmail.split("@")[1] === "duke.edu" || currentEmail.split("@")[1] === "rollins.edu") {
			user.emails = [{ "address": currentEmail, "verified": false }];     // 21
			Meteor.setTimeout(function () {                                     // 22
				Accounts.sendVerificationEmail(user._id);                          // 23
			}, 4 * 1000);                                                       //
		}                                                                    //
                                                                       //
		console.log('finished FACEBOOK user creation...');                   // 27
		return user;                                                         // 28
	} else {                                                              //
		user.profile = options.profile || {};                                // 31
		user.profile.email = user.emails[0].address;                         // 32
		user.profile.avatar = options.profileDetails.avatar;                 // 33
		user.profile.college = options.profileDetails.college;               // 34
		// user.profile.mobile = options.profileDetails.mobile;              //
		user.profile.name = options.profileDetails.name;                     // 36
		//NOT TAKING LOCATION DETAILS ON REGISTRATION ANYMORE                //
		// user.profile.address = options.profileDetails.location ? options.profileDetails.location.address : "-" ;
		// user.profile.latLong = options.profileDetails.location ? options.profileDetails.location.latLong : "-";
                                                                       //
		// Notifications.insert({                                            //
		// 	userId: meteorUserId,                                            //
		// 	alerts: []                                                       //
		// })                                                                //
		console.log('finished MANUAL user creation...');                     // 45
                                                                       //
		Meteor.setTimeout(function () {                                      // 47
			Accounts.sendVerificationEmail(user._id);                           // 48
		}, 4 * 1000);                                                        //
                                                                       //
		return user;                                                         // 51
	}                                                                     //
});                                                                    //
                                                                       //
// Accounts.validateLoginAttempt(function(attempt){                    //
//   if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
//     console.log('email not verified');                              //
                                                                       //
//     return false; // the login is aborted                           //
//   }                                                                 //
//   return true;                                                      //
// });                                                                 //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=accountCreation.js.map
