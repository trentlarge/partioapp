Accounts.onCreateUser(function(options,user) {
	console.log("OPTIONS-->>" + JSON.stringify(options));
	console.log("USER-->>" + JSON.stringify(user))
	var meteorUserId = user._id;

	if (user.services.facebook) {
		// var fbLink = user.services.facebook.link;
		// var linkId = fbLink.split("https://www.facebook.com/app_scoped_user_id/")[1].split("/")[0];
		
		user.profile = options.profile || {};
		user.profile.email = user.services.facebook.email;
		// user.profile.avatar = 'http://graph.facebook.com/'+linkId+'/picture';
		user.profile.name = user.services.facebook.name
		user.profile.avatar = options.profile.avatar;
		user.profile.college = '';
		user.profile.mobile = '';
		Notifications.insert({
			userId: meteorUserId,
			alerts: []
		})

		console.log('finished FACEBOOK user creation...');
		return user;

	} else {
		user.profile = options.profile || {};	
		user.profile.email = user.emails[0].address;
		user.profile.avatar = options.profileDetails.avatar;
		user.profile.college = options.profileDetails.college;
		user.profile.mobile = options.profileDetails.mobile;
		user.profile.name = options.profileDetails.name;
		user.profile.address = options.profileDetails.location ? options.profileDetails.location.address : "-" ;
		user.profile.latLong = options.profileDetails.location ? options.profileDetails.location.latLong : "-";

		Notifications.insert({
			userId: meteorUserId,
			alerts: []
		})
		console.log('finished MANUAL user creation...');
		return user;
	}
	
})

