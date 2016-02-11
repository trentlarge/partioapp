NotificationsController = RouteController.extend({
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
			'notifications': function() {
				return Notifications.find({toId: Meteor.userId()}, {sort: {timestamp: -1}});
			},
            
            hasRouter: function(connectionId) {
                if(!connectionId) {
                    return false;
                }
                var connection = Connections.findOne({ _id: connectionId, finished: { $ne: true } });
                if(!connection) {
                    return false;
                }
                return true;
            }
		};
	},

	onAfterAction: function() {

	}
});
