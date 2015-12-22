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

	'updateOfficialEmail': function(college, email) {
		Meteor.users.update({"_id": this.userId}, {$set: {"emails": [{"address": email, "verified": false}], "profile.college": college}}, function(error) {
			if (!error) {
				Accounts.sendVerificationEmail(userId);
			}
		});
	},
	'updatePassword': function(password) {
		console.log('chamou updatePassword');
		Meteor.bindEnvironment(function() {
			Accounts.setPassword(this.userId, password, { logout: false });
		},
		function (err) {
			console.log('failed to bind env: ', err);
		});
	},

	'userCanShare': function(){
		return Meteor.user().secret.canShare
	},

	'userCanBorrow': function(){
		return Meteor.user().secret.canBorrow;
	}
});
