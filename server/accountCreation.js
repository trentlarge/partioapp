Accounts.onCreateUser(function(options,user) {
	console.log("OPTIONS-->>" + JSON.stringify(options));
	console.log("USER-->>" + JSON.stringify(user))

	if (user.services.facebook) {
		var fbLink = user.services.facebook.link;
		"https://www.facebook.com/app_scoped_user_id/418093848371137/"
		var linkId = fbLink.split("https://www.facebook.com/app_scoped_user_id/")[1].split("/")[0];
		
		user.profile = options.profile;
		user.profile.email = user.services.facebook.email;
		user.profile.avatar = 'http://graph.facebook.com/'+linkId+'/picture';
		user.profile.college = '';
		user.profile.mobile = '';

		console.log('finished FACEBOOK user creation...')
		return user;

	} else {
		user.profile = options.profile || {};	
		user.profile.email = user.emails[0].address;
		user.profile.avatar = options.profileDetails.avatar;
		user.profile.college = options.profileDetails.college;
		user.profile.mobile = options.profileDetails.mobile;
		user.profile.name = options.profileDetails.name;

		console.log('finished MANUAL user creation...')
		return user;
	}
	
})