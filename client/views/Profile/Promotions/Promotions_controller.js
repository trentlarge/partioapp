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
						var ids = [];

          	if(friends) {
							friends.map(function(_user){
								ids.push(_user.id);
							})

							if(ids.length > 0) {
								Meteor.subscribe('userFriends', ids);
								return Users.find({ _id: { $in: ids }}).fetch();
							} else {
								return;
							}
          	} else {
							return;
						}
        }
    },

	data: function() {
		return {
			user: Meteor.user(),
      parent: this.getParent(),
      children: this.getChildren(),
      bestFriend: this.getBestFriend(),

			getFriendStatus: function(userId){
				var user = Meteor.user();
				var _return = false;

				if(user && user.private && user.private.promotions) {
					var friends = user.private.promotions.friendShare.children;

					if(friends) {
						friends.map(function(_user){
							if(_user.id == userId) {
								_return = _user.status;
							}
						})

						if(_return){
							return _return;
						} else {
							return;
						}

					} else {
						return;
					}
				} else {
					return;
				}
			},

			isFriendWaiting: function(userId){
				var status = this.getFriendStatus(userId);

				if(status == 'waiting') {
					return true;
				} else {
					return false;
				}
			},

			parentInviteStatus: function(){
				Meteor.call('getParentStatus', this.parent._id, function(err, result){
					if(err || !result){
						Session.set('parentStatus', '');
						return;
					}

					Session.set('parentStatus', result);
					return;
				});
			},


			isParentAccepted: function(){
				var set = this.parentInviteStatus();

				if(Session.get('parentStatus') == 'accepted') {
					return true;
				} else {
					return false;
				}
			},

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
