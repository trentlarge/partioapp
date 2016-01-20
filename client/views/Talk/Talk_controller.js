TalkController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()){
			this.render();
		}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			//Meteor.subscribe("singleConnect", this.params._id),
			//Meteor.subscribe("talk", this.params._id)
		];
	},

	data: function() {
		var currentUserId = Meteor.userId();

		return {

			connection: Connections.findOne({ _id: this.params._id, finished: { $ne: true } }),

			requestorData: function(){
				if(!this.connection){
					return;
				}	
				return Meteor.users.findOne({ _id: this.connection().requestor});
			},

			messages: Talk.find({ connectionId: this.params._id }),
			unreadMessages: Talk.find({ connectionId: this.params._id,
										toId: currentUserId,
										state: "new"
									})
		}
	},

	onAfterAction: function() {

	}
});
