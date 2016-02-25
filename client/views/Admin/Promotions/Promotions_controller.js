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

	getFilterId: function(){
		var _return = false;

		switch (this.params._id) {
			case 'others':
				_return = "0";
			break;
			case 'duke':
				_return = "1";
			break;
			case 'yale':
				_return = "2";
			break;
		}

		return _return;
	},

	filter: function() {
		return this.params._id;
	},

	userChildren: function(userId){
		 Meteor.call('getUserChildren', userId, function(error, result){
		 	if(result){
		 		return result;
		 	}
		 });
	},

	data: function() {
		return {
      		user: Meteor.user(),
      		admins: Admins.find({}).fetch(),
			filter: this.filter(),
			getFilterId: this.getFilterId(),
			
			usersByArea: function(){
				return Meteor.users.find({ 'profile.area': this.getFilterId });
			},

			countUsersByArea: function(){
				var _usersByArea = this.usersByArea();
				_usersByArea = _usersByArea.fetch();

				if(_usersByArea){
					return _usersByArea.length;	
				} else {
					return '0';
				}
			},

			isUserPermitted: function() {
				var userAdmin = Admins.findOne({email: this.user.emails[0].address});
				return userAdmin.admin;
			},

			allUsersId: function(){
				var _usersByArea = this.usersByArea();
				_usersByArea = _usersByArea.fetch();
				
				var _userIds = [];

				if(_usersByArea) {
					_usersByArea.map(function(user){
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
				// return Meteor.call('getUserChildren', userId, function(){

				// });
				// var _children = Meteor.users.find({ 'private.promotions.friendShare.parent': userId }).fetch();
				// return _children;
			},

			hasChildren: function(userId){
				// var userChildren = this.userChildren(userId);
				// if(userChildren.length > 0){
				// 	return userChildren.length;
				// }
				return false;
			},

			childrenCount : function(userId){

				 // Meteor.call('getUserChildren', userId, function(error, result){
				 // 	console.log(error,result);
				 // });

				// var countChildren = this.hasChildren(userId);
				// var _return = 'no friends';

				// if(countChildren) {
				// 	if(countChildren == 1){
				// 		_return = '1 friend';
				// 	} else {
				// 		_return = countChildren+" friends";
				// 	}
				// }

				// return _return;

				return '0';
			},

			isActiveClass: function(filterParam){
				if(this.filter == filterParam) {
					return true;
				}
				return;
			},

			filterLabel: function(filterId){
				var _return = 'General Users';

				if(!filterId) {
					filterId = this.getFilterId;
				}

				switch (filterId) {
					case '0':
						_return = 'Other areas';
					break;
					case '1':
						_return = 'Duke University';
					break;
					case '2':
						_return = 'Yale University';
					break;
				}

				return _return;
			}
		};
	},

	onAfterAction: function() {

	}
});
