Meteor.methods({
	updateUserProfile: function(profile) {
		var updateProfile = {};

		for(var key in profile) {
			updateProfile["profile." + key] = profile[key];
		}

		if(!updateProfile) {
			return;
		}

		Meteor.users.update({
			_id: this.userId 
		}, 
		{
			$set: updateProfile
		});
	}
});
