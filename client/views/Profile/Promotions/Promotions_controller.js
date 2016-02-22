PromotionsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()) {
			this.render();
		}
	},

	waitOn: function() {
		return [
		];
	},
    
    getBestFriend: function() {
        if(Session.get('isAddPromoCode')) {
            Meteor.subscribe('userBestFriend', Session.get('promoCode'));
            return Users.findOne({ 'private.promotions.friendShare.code': Session.get('promoCode') });
        }
    },
    
    getParent: function() {
        var user = Meteor.user();
        
        if(user && user.private && user.private.promotions) {
            var parentId = user.private.promotions.friendShare.parent;
            if(parentId) {
                Meteor.subscribe('singleUser', parentId);
                return Users.findOne(parentId);       
            }
        }
    },
    
    getChildren: function() {
        var user = Meteor.user();
        
        if(user && user.private && user.private.promotions) {
            var friends = user.private.promotions.friendShare.children;
            if(friends) {
                Meteor.subscribe('userFriends', friends);
                return Users.find({ _id: { $in: friends }}).fetch();       
            }
        }
    },

	data: function() {
		return {
			user: Meteor.user(),        
            parent: this.getParent(),
            children: this.getChildren(),
            bestFriend: this.getBestFriend(),
            
            getPromotionalCode: function() {
                if(this.user.private.promotions && this.user.private.promotions.friendShare && this.user.private.promotions.friendShare.code) {
                    return this.user.private.promotions.friendShare.code
                }
            },
            
            hasParent: function() {
                if(this.user.private.promotions && this.user.private.promotions.friendShare && this.user.private.promotions.friendShare.parent) {
                    return true;
                }
                return false;
            },
            
            hasChildren: function() {
                if(this.user.private.promotions && this.user.private.promotions.friendShare && this.user.private.promotions.friendShare.children) {
                    return true;
                }
                return false;  
            },
            
            getParent: function() {
                return this.parent;
            },
            
            getChildren: function() {
                return this.children;
            },
            
            getBestFriend: function() {
                return this.bestFriend;
            },
            
            isUserHimself: function() {
                return (this.bestFriend.private.promotions.friendShare.code === this.user.private.promotions.friendShare.code) ? true : false;
            },
            
            isUserChild: function() {
                return (this.bestFriend._id.indexOf(this.user.private.promotions.friendShare.children) >= 0) ? true : false;
            }
            
		};
	},

	onAfterAction: function() {

	}
});
