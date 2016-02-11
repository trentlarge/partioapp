MainController = RouteController.extend({
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
		};
	},

	onAfterAction: function() {
		// if(Meteor.user() && Meteor.user().private) {
		// 	if(!Meteor.user().private.viewTutorial) {
		// 		Meteor.call('checkTutorial');
		// 		IonModal.open('tutorial');
		// 	}
		// }
	}
});
