AdminPromotionsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
    return [
      Meteor.subscribe("admins"),
    ];
	},

	data: function() {
		return {
      user: Meteor.user(),
      admins: Admins.find({}).fetch(),

      isUserPermited: function() {
        var userAdmin = Admins.findOne({email: this.user.emails[0].address});
        return userAdmin.admin;
      },

			allUsers: function(){
				return Meteor.users.find({}).fetch();
			},

			allUsersId: function(){
				var _users = this.allUsers();
				var _userIds = [];

				if(_users) {
					_users.map(function(user){
						_userIds.push(user._id);
					});
				}

				if(!_userIds.length < 1) {
					return _userIds;
				}
			},

			transactionByUserId: function(userId){
				if(userId){
					Transactions.findOne({ userId: userId });
				}
			},

			userChildren: function(userId){
				return Meteor.users.find({ 'private.promotions.friendShare.parent': userId })
			}
		};
	},

	onAfterAction: function() {

	}
});
