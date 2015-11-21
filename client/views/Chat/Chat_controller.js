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
				console.log(this.requestor)
				//console.log(this.connection);
				//console.log(this.requestor);
				//console.log(this.owner);
				//Connections.findOne(this.params._id).observe({
					//changed: function(newDoc, oldDoc) {
						// console.log(newDoc);
						// console.log(oldDoc);
						//setTimeout(function(){
							//$('.content').scrollTop($('.message-wrapper')[0].scrollHeight);
						//},0);
					//}
				//})
				return this.connection.chat;
			},

			direction: function() {
				//return (this.sender === Meteor.userId()) ? "right": "left";
			},

			avatar: function() {
				//return (this.sender === Meteor.userId()) ? Meteor.user().profile.avatar : Meteor.users.findOne(this.sender).profile.avatar;
			},

			chatWith: function() {
				console.log(this.requestor)
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
