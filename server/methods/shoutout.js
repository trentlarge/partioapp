Meteor.methods({
    
    /* =================================
        Types: 
          'shout' -> a normal shout
          'share' -> a product shared
    ================================= */
    
    insertShoutOut: function(userId, message, type, sharedProducts) {
        
        //var user = Users.findOne({_id: userId});

        var shout = {
            'message': message,
            'type': type,
            'createdAt': new Date(),
            'userId': userId,
            'sharedProducts': (function() {
                return (sharedProducts) ? sharedProducts : [];
            })()
        }
        
		ShoutOut.insert(shout);
        
        return true;
	},
    
    updateShoutOut: function(shout, product, userId) {
		ShoutOut.update({ 
			_id: shout._id
		}, 
        {
			$push: { sharedProducts: product },   
		});
        
        var message = '"' + product.title + '" has pinned to your shout "' + shout.message + '".';
        
        sendPush(shout.userId, message);
		sendNotification(shout.userId, userId, message, "shout-share", shout._id);
        
        return true;
	},
    
    removeShoutOut: function(shoutId) {
		ShoutOut.remove(shoutId);
	},
    
    removeSharedProduct: function(shoutId, productId) {
		ShoutOut.update({ 
			_id: shoutId 
		}, 
        {
			$pull: { sharedProducts: { _id: productId } },   
		});
	}
    
});