AdminConfigurationsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		var user = Users.findOne({_id: Meteor.userId()});
        
		return [
            Meteor.subscribe("admins"),
		];
	},

	data: function() {
        
		return {
            
            user: Users.findOne({_id: Meteor.userId()}),
            admins: Admins.find({}).fetch(),
          
            isUserPermited: function() {
                var userAdmin = Admins.findOne({email: this.user.emails[0].address});
                return userAdmin.admin;
            },
            
            isAdmin: function(admin) {
                return 'disabled';
//                return (admin) ? 'disabled' : '';
            },
            
            isViewChecked: function(box) {
                return (box) ? 'checked' : '';
            },
            
            isUpdateChecked: function(box) {
                return (box) ? 'checked' : '';
            },
            
            isDeleteChecked: function(box) {
                return (box) ? 'checked' : '';
            },
                
		};
	},

	onAfterAction: function() {

	}
});
