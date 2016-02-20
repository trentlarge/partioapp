Meteor.methods({
    
    /* =================================
        Types: 
          'shout' -> a normal shout
          'share' -> a product shared
    ================================= */
    
    insertShoutOut: function(userId, message, type, sharedProducts) {
        
        var user = Users.findOne({_id: userId});

        var shout = {
            'message': message,
            'type': type,
            'createdAt': new Date(),
            'user': {
                'id': userId,
                'name': user.profile.name,
                'avatar': user.profile.avatar
            },
            'sharedProducts': (function() {
                return (sharedProducts) ? sharedProducts : [];
            })()
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