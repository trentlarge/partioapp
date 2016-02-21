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

	data: function() {
		return {
			user: Meteor.user(),        

            getPromotionalCode: function() {
                
                if(this.user.private.promotions && this.user.private.promotions.friendshare && this.user.private.promotions.friendshare.code) {
                    
                    
                    
                }
                else {
                    return 'XXXXXX';
                }
            }
            
		};
	},

	onAfterAction: function() {

	}
});
