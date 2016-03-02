AdminPromotionsDetailsController = RouteController.extend({
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

    getUser: function(userId) {
        Meteor.subscribe("searchSingleUser", userId);  
        Meteor.subscribe("adminSearchUserTransactions", userId);
        return Users.findOne(userId);
    },
    
    getUserAdmin: function() {
        var user = Meteor.user();
        return Admins.find({email: user.emails[0].address}).fetch();
    },
    
	data: function() {
		return {
            userAdmin: this.getUserAdmin(),
            user: this.getUser(this.params._id),
          
            isUserPermited: function() {
                return (this.userAdmin.length > 0) ? true : false;
            },
            
            isUserAdmin: function() {
                if(!this.userAdmin) return;
                return this.userAdmin[0].admin;
            },
            
            userCanUpdate: function() {
                if(!this.userAdmin) return;
                return this.userAdmin[0].permissions.update;
            },
            
            getTotalChildren: function() {
            	if(	this.user.private.promotions &&
					this.user.private.promotions.friendShare){
            		return (this.user.private.promotions.friendShare.children) ? this.user.private.promotions.friendShare.children.length : 0;
            	} else {
            		return 0;
            	}
            },
            
            getEarningTimeline: function() {
                if(	this.user.private.promotions &&
					this.user.private.promotions.earning){
            		return (this.user.private.promotions.earning.timeline) ? this.user.private.promotions.earning.timeline.reverse() : false;
            	} else {
                    return false;
                }
            },
            
            getSpendingTimeline: function() {
                if(	this.user.private.promotions &&
					this.user.private.promotions.spending){
            		return (this.user.private.promotions.spending.timeline) ? this.user.private.promotions.spending.timeline.reverse() : false;
            	} else {
                    return false;
                }
            },
            
            getUserTimeline: function(userId) {
                Meteor.subscribe("searchSingleUser", userId);  
                var user = Users.findOne(userId); 
                if(user) {
                    return user;
                }
            },
            
            getFormatedDate: function(timestamp) {
                return formatDate(timestamp);
            },
            
            getValueColor: function(value) {
                return (Number(value) >= 0) ? 'positive' : 'negative';
            },
            
            getEarningTotal: function() {
                return (this.user.private.promotions && this.user.private.promotions.earning && this.user.private.promotions.earning.total) ? this.user.private.promotions.earning.total : '0.00';
            },
            
            getSpendingTotal: function() {
                return (this.user.private.promotions && this.user.private.promotions.spending && this.user.private.promotions.spending.total) ? this.user.private.promotions.spending.total : '0.00';
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

                    Meteor.subscribe("adminUsersInArray", ids);  
                    Meteor.subscribe("transactionsByUserId", ids);
					return Meteor.users.find({ '_id': { $in: ids }}).fetch();
				}
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
                
		};
	},

	onAfterAction: function() {

	}
});
