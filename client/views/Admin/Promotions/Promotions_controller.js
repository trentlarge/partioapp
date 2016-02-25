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

	data: function() {
		return {
      		user: Meteor.user(),
      		admins: Admins.find({}).fetch(),
			filter: this.filter(),
			getFilterId: this.getFilterId(),

			usersByArea: function(){
				if(this.getFilterId) {
					var _userByArea = Meteor.users.find({ 'profile.area': this.getFilterId }).fetch();	
				} else {
					var _userByArea = Meteor.users.find({}).fetch();
				}

				return _userByArea;
			},

			countUsersByArea: function(){
				var _usersByArea = this.usersByArea();

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

			transactionEarnByUserId: function(userId){
				if(userId){
					var transactions = Transactions.findOne({ userId: userId });

					if(transactions){
						var total = 0;
						var earningArray = transactions.earning;
						earningArray.forEach(function(item) {
							total += (item.receivedAmount || 0);
						});
						return Number(total);
					}
					
					return Number(0);				
				}
			},

			transactionSpentByUserId: function(userId){
				if(userId){
					var transactions = Transactions.findOne({ userId: userId });

					if(transactions){
						var total = 0;
						var spendingArray = transactions.spending;
						spendingArray.forEach(function(item) {
							total += (item.paidAmount || 0);
						});
						return Number(total);
						//return Number(total).toFixed(2);
					}
					
					//return Number(0).toFixed(2);				
					return Number(0);				
				}
			},

			transactionsTotalByArea: function(){
				var _usersByArea = this.usersByArea();

				if(_usersByArea){
					var thiz = this;
					var total = 0;

					_usersByArea.map(function(user){
						total += (thiz.transactionEarnByUserId(user._id) || 0);
				    });

				    return Number(total);
				}
				
			},

			userChildren: function(userId){
				var _children = Meteor.users.find({ 'private.promotions.friendShare.parent': userId }).fetch();
				return _children;
			},

			childrenEarnTotal: function(userId){
				var _userChildren = this.userChildren(userId);

				if(_userChildren) {
					var thiz = this;
					var total = 0;

					_userChildren.map(function(user){
						total += (thiz.transactionEarnByUserId(user._id) || 0);
				    });

				    return Number(total);
				}
			},

			childrenSpentTotal: function(userId){
				var _userChildren = this.userChildren(userId);

				if(_userChildren) {
					var thiz = this;
					var total = 0;

					_userChildren.map(function(user){
						total += (thiz.transactionSpentByUserId(user._id) || 0);
				    });

				    return Number(total);
				}
			},

			childrenCount : function(userId){
				var _user = Meteor.users.findOne({ '_id': userId});
				var _return = '0';

				if(_user) {
					if(_user.private.promotions) {
						if(_user.private.promotions.friendShare){
							if(_user.private.promotions.friendShare.children){
								_return = _user.private.promotions.friendShare.children.length;
							}
						}
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
