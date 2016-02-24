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

	filter: function() {
		return this.params._id;
	},

	data: function() {
		return {
      user: Meteor.user(),
      admins: Admins.find({}).fetch(),
			filter: this.filter(),

      isUserPermitted: function() {
        var userAdmin = Admins.findOne({email: this.user.emails[0].address});
        return userAdmin.admin;
      },

			allUsers: function(){
				var filterId = this.getFilterId();
				if(filterId){
					return Meteor.users.find({ 'profile.area': filterId }).fetch();
				} else {
					return Meteor.users.find({}).fetch();
				}
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
					return Transactions.findOne({ userId: userId });
				}
			},

			userChildren: function(userId){
				return Meteor.users.find({ 'private.promotions.friendShare.parent': userId }).fetch();
			},

			hasChildren: function(userId){
				var userChildren = this.userChildren(userId);
				if(userChildren.length > 0){
					return userChildren.length;
				}
				return false;
			},

			howManyChild : function(userId){
				var countChildren = this.hasChildren(userId);
				var _return = 'No friends';

				if(countChildren) {
					if(countChildren == 1){
						_return = '1 friend';
					} else {
						_return = countChildren+" friends";
					}
				}

				return _return;
			},

			isActiveClass: function(filterParam){
				if(this.filter == filterParam) {
					return true;
				}
				return;
			},

			getFilterId: function(filter){
				var _return = false;

				switch (this.filter) {
					case 'others':
						_return = 0;
					break;
					case 'duke':
						_return = 1;
					break;
					case 'yale':
						_return = 2;
					break;
				}

				return _return;
			},

			filterLabel: function(){
				var _return = 'No filter';

				switch (this.filter) {
					case 'others':
						_return = 'Filtering by other areas';
					break;
					case 'duke':
						_return = 'Filtering by Duke University';
					break;
					case 'yale':
						_return = 'Filtering by Yale University';
					break;
				}

				return _return;
			}
		};
	},

	onAfterAction: function() {

	}
});
