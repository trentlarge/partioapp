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
			}
		};
	},

	onAfterAction: function() {

	}
});
