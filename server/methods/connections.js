Meteor.methods({
	updateMeetupLocation: function(connectionId, address, latLng) {
		Connections.update({
			_id: connectionId
		}, {
			$set: {
				meetupLocation: address,
				meetupLatLong: latLng 
			}
		});
	},

	removeConnection: function(idConnection) {
		Connections.remove({_id: idConnection});
	}
});
