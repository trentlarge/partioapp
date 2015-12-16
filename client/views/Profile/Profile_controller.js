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
			// subscribe to data here
			//Meteor.subscribe("userData"),
			// Meteor.subscribe("otherSubscription"),
			// ...
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
			//
			// read data from database here like this:
			//   someData: SomeCollection.find(),
			//   moreData: OtherCollection.find()
			// ...
		};
	},

	onAfterAction: function() {

	}
});
