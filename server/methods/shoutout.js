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
            },
            'sharedProducts': []
        }
        
		ShoutOut.insert(shout);
        
        return true;
	},
    
    updateShoutOut: function(shoutId, product) {
		ShoutOut.update({ 
			_id: shoutId 
		}, 
        {
			$push: { sharedProducts: product },   
		});
	}
    
});