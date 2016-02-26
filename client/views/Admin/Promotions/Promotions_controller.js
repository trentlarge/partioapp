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

				//console.log(_userByArea);

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

			transactionsTotalByArea: function(){
				var _usersByArea = this.usersByArea();

				//console.log(_usersByArea);

				if(_usersByArea){
					var thiz = this;
					var total = 0;

					_usersByArea.map(function(user){
						//console.log(thiz.transactionEarnByUserId(user._id));
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
					
				return 0;
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

				return 0;
			},

			childSince: function(parentId, childId){
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

				return formatDate(_return);
			},

			isActiveClass: function(filterParam){
				if(this.filter == filterParam) {
					return true;
				}
				return;
			},

			filterLabel: function(filterId){
				var _return = 'General users';

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
