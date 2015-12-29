ProfileController = RouteController.extend({
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
			_user: Meteor.user(),

			profileEdit: function() {
				return Session.get('profileEdit');
			},

			emailSet: function() {
				return this._user.emails[0].address;
			}
		};
	},

	onAfterAction: function() {

	}
});
