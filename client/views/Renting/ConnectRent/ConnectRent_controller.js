ConnectRentController = RouteController.extend({
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
			Meteor.subscribe("singleConnect", this.params._id),
		];
	},

	connection : function(){
		return Connections.findOne(this.params._id);
	},

	data: function() {
		return {
			connectData: this.connection(),
		}
	},

	onAfterAction: function() {

	}
});
