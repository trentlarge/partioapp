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

			allUsers: function(){
				var _userByArea = Meteor.users.find({}).fetch();
				return _userByArea;
			},

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

			//catch user total earn transactions
			transactionEarnByUserId: function(userId){
				if(userId){
					var transaction = Transactions.findOne({ userId: userId });

					if(transaction){
						var total = 0;
						var earningArray = transaction.earning;
						earningArray.forEach(function(item) {
							total += (item.receivedAmount || 0);
						});
						return Number(total);
					}
					
					return Number(0);				
				}
			},

			//catch user total spent transactions
			transactionSpentByUserId: function(userId){
				if(userId){
					var transaction = Transactions.findOne({ userId: userId });

					if(transaction){
						var total = 0;
						var spendingArray = transaction.spending;
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

			//catch user total earn transactions after timestamp
			transacTimeEarnByUserId: function(parentId, childId){
				if(childId && parentId){
					var timestamp = this.childSinceTimestamp(parentId, childId);
					var transaction = Transactions.findOne({ userId: childId });

					if(transaction){
						var total = 0;
						var earningArray = transaction.earning;
						earningArray.forEach(function(item) {
							if(item.date >= timestamp){
								total += (item.receivedAmount || 0);	
							}
						});
						return Number(total);
					}
					
					return Number(0);				
				}
			},

			//catch user total spent transactions
			transacTimeSpentByUserId: function(parentId, childId){
				if(childId && parentId){
					var timestamp = this.childSinceTimestamp(parentId, childId);
					var transaction = Transactions.findOne({ userId: childId });

					if(transaction){
						var total = 0;
						var spendingArray = transaction.spending;
						spendingArray.forEach(function(item) {
							if(item.date >= timestamp){
								total += (item.paidAmount || 0);
							}
						});
						return Number(total);
					}
							
					return Number(0);				
				}
			},


			transactionsTotalByArea: function(){
				var _usersByArea = this.usersByArea();

				if(_usersByArea){
					var thiz = this;
					var total = 0;

					_usersByArea.map(function(user){
						console.log(user);
						total += (thiz.transactionEarnByUserId(user._id) || 0);
				    });

				    return Number(total);
				}
				
			},

			//accepted children
			userChildren: function(userId){
				var _parent = Meteor.users.findOne({ '_id': userId });

				if(	_parent.private.promotions &&
					_parent.private.promotions.friendShare &&
					_parent.private.promotions.friendShare.children){

					var ids = [];
					
					_parent.private.promotions.friendShare.children.map(function(child){
						if(child.status == 'accepted'){
							ids.push(child.id);
						}
					})

					return Meteor.users.find({ '_id': { $in: ids }}).fetch();
				}
			},


			//waiting children
			userChildrenWaiting: function(userId){
				var _parent = Meteor.users.findOne({ '_id': userId });

				if(	_parent.private.promotions &&
					_parent.private.promotions.friendShare &&
					_parent.private.promotions.friendShare.children){

					var ids = [];
					
					_parent.private.promotions.friendShare.children.map(function(child){
						if(child.status == 'waiting'){
							ids.push(child.id);
						}
					})

					return Meteor.users.find({ '_id': { $in: ids }}).fetch();
				}
			},


			childrenCount : function(userId){
				var _children = this.userChildren(userId)
				if(_children) {
					return _children.length;	
				}

				return '0';
			},

			childrenEarnTotal: function(parentId){
				var _userChildren = this.userChildren(parentId);

				if(_userChildren) {
					var thiz = this;
					var total = 0;

					_userChildren.map(function(user){
						total += (thiz.transacTimeEarnByUserId(parentId, user._id) || 0);
				    });

				    return Number(total);
				}
					
				return 0;
			},

			childrenSpentTotal: function(parentId){
				var _userChildren = this.userChildren(parentId);

				if(_userChildren) {
					var thiz = this;
					var total = 0;

					_userChildren.map(function(user){
						total += (thiz.transacTimeSpentByUserId(parentId, user._id) || 0);
				    });

				    return Number(total);
				}

				return 0;
			},

			childSinceTimestamp: function(parentId, childId){
				var _parent = Meteor.users.findOne({ '_id': parentId });

				var _return = '';

				if(	_parent.private.promotions &&
					_parent.private.promotions.friendShare &&
					_parent.private.promotions.friendShare.children){
					_parent.private.promotions.friendShare.children.map(function(child){
						if(child.id == childId){
							_return = child.timestamp;
						}
					})
				}

				return _return;
			},

			//formated to template
			childSince: function(parentId, childId){
				return formatDate(this.childSinceTimestamp(parentId, childId));
			},

			isActiveClass: function(filterParam){
				if(this.filter == filterParam) {
					return true;
				}
				return;
			},

			filterLabel: function(filterId){
				var _filter = filterId.toString();

				var _return;

				switch (_filter) {
					case '-1':
						_return = 'not set';
					break;
					case '0':
						_return = 'Other areas';
					break;
					case '1':
						_return = 'Duke University';
					break;
					case '2':
						_return = 'Yale University';
					break;
					default:
						_return = 'some error';
				}

				return _return;
			},

			userVerified: function(userId){

				var _user = Meteor.users.findOne({ '_id': userId });

				console.log(_user.emails[0].verified, userId);
				if(_user.emails[0].verified){
					return true;
				}

				return false;
			}

		};
	},

	onAfterAction: function() {

	}
});
