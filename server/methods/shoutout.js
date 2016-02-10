Meteor.methods({
    insertShoutOut: function(userId, message) {
        
        var user = Users.findOne({_id: userId});

        var shout = {
            'message': message,
            'createdAt': new Date(),
            'user': {
                'id': userId,
                'name': user.profile.name,
                'avatar': user.profile.avatar
            }
        }
        
		ShoutOut.insert(shout);
        
        return true;
	}
});