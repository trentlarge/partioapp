Meteor.methods({
	updateUserProfile: function(profile) {
		Meteor.users.update({
			_id: this.userId 
		}, 
		{
			$set: {
				"profile.mobile" : profile.mobile,
				"profile.college": profile.college
			}
		});
	}
});
