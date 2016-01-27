Accounts.onCreateUser(function(options,user) {
	console.log("OPTIONS -->>", options);
	console.log("USER-->>", user);
	var meteorUserId = user._id;

	if(user.services) {
		var service = _.keys(user.services)[0];

		//facebooklogin
        if (service == 'facebook') {
        	var email = user.services[service].email;
        
		//manualregister
        } else {
        	var email = user.emails[0].address;
        }

     	// see if any existing user has this email address, otherwise create new
        var existingUser = Meteor.users.findOne({'emails.address': email});
        
        if (existingUser) {
        	console.log('existing user <><><><><><><><><><><><><><><><><><', email);

        	// if(!existingUser.services) {
         //        existingUser.services = { resume: { loginTokens: [] }};
        	// }
            
         //    if(!existingUser.services.resume) {
         //        existingUser.services.resume = { loginTokens: [] };
         //    }

         	console.log(existingUser, user.services);
 
            // copy across new service info
            existingUser.services[service] = user.services[service];

            //console.log(user);

            // existingUser.services.resume.loginTokens.push(
            //     user.services.resume.loginTokens[0]
            // );
 
            // even worse hackery
            Meteor.users.remove({_id: existingUser._id}); // remove existing record
            return existingUser;                          // record is re-inserted
        
        } else {

        	console.log('new user <><><><><><><><><><><><><><><><><><', email);

        	user.profile = {};
			user.private = {};
			user.private.viewTutorial = false;

			user.secret = {};
			user.secret.canBorrow = false;
			user.secret.canShare = false;

			//facebook
        	if (service == 'facebook') {
        		var fbLink = user.services.facebook.link;
				var linkId = fbLink.split("https://www.facebook.com/app_scoped_user_id/")[1].split("/")[0];

				user.profile = options.profile || {};
				user.profile.avatar = 'http://graph.facebook.com/'+linkId+'/picture?type=normal';
				user.profile.name = user.services.facebook.name
				//user.profile.birthDate = user.services.facebook.birthday
				//FOR NO APPARENT REASON FACEBOOK REFUSED TO SEND AVATAR AFTER LOGIN
				// user.profile.avatar = options.profile.avatar;
				user.profile.area = 0;
				user.private.mobile = '';
				
				if (email.split("@")[1] === "duke.edu") {
					user.profile.area = 1;
				} 
				
				if (email.split("@")[1] === "yale.edu") {
					user.profile.area = 2;
				}
				
				user.emails = [{"address": email, "verified": false}]
	        
	        //manual creating
	        } else {
	        	user.profile.name = options.profileDetails.name;
				user.profile.avatar = options.profileDetails.avatar;
				user.profile.area = options.profileDetails.area;
				user.profile.birthDate = options.profileDetails.birthDate;
				user.private.mobile = options.profileDetails.mobile;
	        }

	        Meteor.setTimeout(function() {
				Accounts.sendVerificationEmail(user._id);
			}, 4 * 1000);

			return user;
        }
	} else {
		console.log('some error');
	}
});

// Accounts.validateLoginAttempt(function(attempt){
//   if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
//     console.log('email not verified');

//     return false; // the login is aborted
//   }
//   return true;
// });
