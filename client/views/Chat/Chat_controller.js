ChatController = RouteController.extend({
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
			Meteor.subscribe("singleConnect", this.params._id),
		];
	},

 connection: function(){
	 return Connections.findOne({_id: this.params._id})
	},

	owner: function(){
		if(this.connection()){
			return this.connection().productData.ownerData
		}
	},

	requestor: function(){
		if(this.connection()){
			return this.connection().requestorData;
		}
	},

	data: function() {
		return {
			connection: this.connection(),
			requestor: this.requestor(),
			owner: this.owner(),

			messages: function() {
				return this.connection.chat;
			},

			getDirection: function(senderId) {
				if(senderId == Meteor.userId()){
					return "right";
				} else {
					return "left";
				}
			},

			getAvatar: function(senderId) {
				if(senderId == this.requestor._id){
					return userAvatar(this.requestor.profile.avatar);
				} else {
					return userAvatar(this.owner.profile.avatar);
				}
			},

			chatWith: function() {
				if(this.connection) {
					if(this.requestor._id === Meteor.userId()) {
						return this.owner.profile.name;
					} else {
						return this.requestor.profile.name;
					}
				}
			}
		}
	},

	onAfterAction: function() {

	}
});
