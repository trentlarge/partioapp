Meteor.methods({
	insertAdmin: function(admin) {
		Admins.insert(admin);
	},
    
    removeAdmin: function(idAdmin) {
        Admins.remove(idAdmin);
    },
});