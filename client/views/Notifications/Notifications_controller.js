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
			// subscribe to data here
			//Meteor.subscribe("myNotifications", Meteor.userId()),
			// ...
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
