EmailVerificationController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		return [
		];
	},

	data: function() {
		return {
		};
	},

	onAfterAction: function() {
	}
});
