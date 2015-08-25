Accounts.onCreateUser(function(options,user) {
	console.log("OPTIONS-->>" + JSON.stringify(options));
	console.log("USER-->>" + JSON.stringify(user))

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

		console.log('finished FACEBOOK user creation...')
		return user;

	} else {
		user.profile = options.profile || {};	
		user.profile.email = user.emails[0].address;
		user.profile.avatar = options.profileDetails.avatar;
		user.profile.college = options.profileDetails.college;
		user.profile.mobile = options.profileDetails.mobile;
		user.profile.name = options.profileDetails.name;
		user.profile.location = options.profileDetails.location.address;
		user.profile.latLong = options.profileDetails.location.latLong;

		console.log('finished MANUAL user creation...')
		return user;
	}
	
})

// OPTIONS-->>
// 	{"profile":
// 		{
// 		"avatar":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p50x50/11390321_418093705037818_7678229144882262488_n.jpg?oh=abce4294096fb06af6d86302b3db5453&oe=567795C1&__gda__=1451022327_b9325ec782d75248e5f75ffc061df7ed"
// 		}
// 	}

// USER-->>
// 	{
// 	"createdAt":"2015-08-24T20:29:54.893Z",
// 	"_id":"2CKfQ9FLgTpndfui8",
// 	"services":
// 		{
// 		"facebook":
// 			{
// 			"accessToken":"CAAGclrchSpgBAIc4OgudtvveXDAWazEEFVnws52R0pEKBKiTMIYnAaimEdEY0YZCq9VOdl2NE6IptuQuRouhv5GqrA13pZBlUAOfACghChaZBn9lNaiIDIgbHOumQXHcoKEPSyeDFW888iWHVFv9DH9NiYgsZBxzQ5FZAQCiYqs8XibF5ea3Ax5OXszYeFVb73ZBUHkDe8AbBR9i5lFIlhS2RwPVTfh4kZD",
// 			"expiresAt":1445608665881,
// 			"id":"418093848371137",
// 			"email":"ndroid.dev@gmail.com",
// 			"name":"Nish Snv",
// 			"first_name":"Nish",
// 			"last_name":"Snv",
// 			"link":"https://www.facebook.com/app_scoped_user_id/418093848371137/","gender":"male","locale":"en_US"
// 			}
// 		}
// 	}

// NEW ACCOUNT CREATION! iPHONE
// OPTIONS-->>{"profile":{"avatar":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p50x50/11390321_418093705037818_7678229144882262488_n.jpg?oh=abce4294096fb06af6d86302b3db5453&oe=567795C1&__gda__=1451022327_b9325ec782d75248e5f75ffc061df7ed"}}
// USER-->>{"createdAt":"2015-08-24T20:49:44.096Z","_id":"frxcBBRNGHvWF9wgy","services":{"facebook":{"accessToken":"CAAGclrchSpgBAIc4OgudtvveXDAWazEEFVnws52R0pEKBKiTMIYnAaimEdEY0YZCq9VOdl2NE6IptuQuRouhv5GqrA13pZBlUAOfACghChaZBn9lNaiIDIgbHOumQXHcoKEPSyeDFW888iWHVFv9DH9NiYgsZBxzQ5FZAQCiYqs8XibF5ea3Ax5OXszYeFVb73ZBUHkDe8AbBR9i5lFIlhS2RwPVTfh4kZD","expiresAt":1445608666083,"id":"418093848371137","email":"ndroid.dev@gmail.com","name":"Nish Snv","first_name":"Nish","last_name":"Snv","link":"https://www.facebook.com/app_scoped_user_id/418093848371137/","gender":"male","locale":"en_US"}}}

// NEW ACCOUNT CREATION! WEB
// OPTIONS-->>{"profile":{"name":"Nish Snv"}}

// USER-->>{"createdAt":"2015-08-24T20:51:58.699Z","_id":"eQ9qPGSCBrTkoRtbo","services":{"facebook":{"accessToken":"CAAGtPB00TqgBAPRwYyY0AVhCL3Wqhk2ZCMpwB0gWDRjo2kj3Si74vmsZAc0Nrus6zVhOC0oVhXXQq0IxShieZC3ICHR3baGLlqLKvdxHQd8n1ossfYEim23NAueZApRpPMxdjQrCZACYfrXl4UWFMF928U4M6l88eaYSbKUIJT0Hq06zMCmGvpZCZA81xqZBr7QZD","expiresAt":1445631681119,"id":"449952091851979","name":"Nish Snv"}}}
// finished FACEBOOK user creation...

