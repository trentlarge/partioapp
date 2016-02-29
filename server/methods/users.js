Meteor.methods({
	updateUserProfile: function(profile) {
		var updateProfile = {};

		for(var key in profile) {
			if(key == 'mobile'){
				updateProfile["private." + key] = profile[key];
			} else {
				updateProfile["profile." + key] = profile[key];
			}
		}

		if(!updateProfile) {
		 	return;
		}

		Meteor.users.update({_id: this.userId },{
			$set: updateProfile
		});
	},
    
    updateUser: function(userId, user) {
        Meteor.users.update({_id: userId },{
			$set: user
		});
    },
    
    removeUser: function(userId) {
		Meteor.users.remove(userId);
	},

	// 'updateOfficialEmail': function(college, email) {
	// 	Meteor.users.update({"_id": this.userId}, {$set: {"emails": [{"address": email, "verified": false}], "profile.college": college}}, function(error) {
	// 		if (!error) {
	// 			Accounts.sendVerificationEmail(userId);
	// 		}
	// 	});
	// },

	'resendValidation': function(email) {
		Accounts.sendVerificationEmail(email);
	},
	
	'sendEmail': function (subject, text) {
	  check([subject, text], [String]);

		var _user = Meteor.user();

		// Let other method calls from the same client start running,
		// without waiting for the email sending to complete.
		this.unblock();

		console.log('SEND FORM CONTACT');

		text+= '\n\n';
		text+= 'Name: '+_user.profile.name;
		text+= '\n';
		text+= 'From: '+_user.emails[0].address;

		Email.send({
			to: 'support@partioapp.com',
			from: 'support@partioapp.com',
			subject: subject,
			text: text
		});
	},
	'userCanShare': function(){
		return Meteor.user().secret.canShare
	},

	'userCanBorrow': function(){
		return Meteor.user().secret.canBorrow;
	},

	checkTutorial: function(){
		console.log('>>>>> check tutorial called');
		Meteor.users.update({"_id": this.userId }, {$set: { "private.viewTutorial": true }}, function(error) {
			if(error) {
				return false;
			}

			return true;
		});
	},
    
    checkProfileTutorial: function(){
		console.log('>>>>> check tutorial called');
		Meteor.users.update({"_id": this.userId }, {$set: { "private.viewProfileTutorial": true }}, function(error) {
			if(error) {
				return false;
			}

			return true;
		});
	},
    
    checkProfileFields: function(){
    	console.log('>>>>> check profile fields');

    	var user = Meteor.user();
    	var birthDate = false;
    	var mobile = false;

    	if(user.profile.birthDate) {
    		if(user.profile.birthDate != '') {
    			birthDate = true;
    		}
    	}

    	if(user.private.mobile) {
    		if(user.private.mobile != '') {
    			mobile = true;
    		}
    	}

    	//has not birthDate
    	if(!birthDate) {

    		//if there is facebook service, check birthdate from there
    		if(user.services.facebook) {
    			HTTP.get('https://graph.facebook.com/v2.1/'+user.services.facebook.id+'?fields=birthday&access_token='+user.services.facebook.accessToken, function(err, result){
					if(!err) {
						if(result.data.birthday) {
							Meteor.users.update({"_id": user._id }, {$set: { "profile.birthDate": result.data.birthday }}, function(error) {
								// has birthDate and mobile number -- pass on check
								if(mobile) {
									// if(!user.private.checkProfileFields) {
					    // 				Meteor.users.update({"_id": user._id }, {$set: { "private.checkProfileFields": true }});
					    // 			}
					    			return true;
					    		
					    		// miss mobile to check
					    		} else {
					    			return false;
					    		}
							});
						}
					}
				})
    		} else {
    			return false;
    		}

    	//has birthDate
    	} else {

    		// has birthDate and mobile number -- pass on check
    		if(mobile) {
    			return true;
    		} else {
    			return false;
    		}

    	}	
	},

	userAreaUpdate: function(area){
		console.log('>>>> userAreaUpdate called');
		Meteor.users.update({"_id": this.userId }, {$set: { "profile.area": area }}, function(error) {
			if(error) {
				return false;
			}

			return true;
		});
	},

	// userCheckBirthDay: function(){
	// 	var _user = Meteor.user();

	// 	var birthDate = false;

	// 	//if facebook
	// 	if(!_user.services.facebook) {
	// 		if()
		
	// 	} else {



	// 		HTTP.get('https://graph.facebook.com/v2.1/'+_user.services.facebook.id+'?fields=birthday&access_token='+_user.services.facebook.accessToken, function(err, result){
	// 			if(!err) {
	// 				if(result.data.birthday) {
	// 					Meteor.users.update({"_id": _user._id }, {$set: { "profile.birthDate": result.data.birthday }}, function(error) {
	// 						if(error) {
	// 							return false;
	// 						}

	// 						return true;
	// 					});
	// 				}
	// 			}
	// 		})

	// 	}

		
	// }
});
