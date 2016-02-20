Meteor.methods({
	insertAdmin: function(admin) {
		Admins.insert(admin);
	},
    
    removeAdmin: function(adminId) {
        Admins.remove(adminId);
    },
    
    updateAdmin: function(adminId, admin) {
        Admins.update({_id: adminId },{
			$set: admin
		});
    }
});