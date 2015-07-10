(function(){Meteor.methods({
	'sendMessage': function(message, sender, connectionId) {
		var messageInsert = {
			message: message,
			timestamp: Date.now(),
			sender: sender,
			state: "new"
		}
		Connections.update({_id: connectionId}, {$push: {chat: messageInsert}});
	}

	// 'readMessage': function(msgsRead, connectionId) {
	// 	var msgsStamps = msgsRead;
	// 	msgsStamps.forEach(function(element){
	// 		Connections.findOne(connectionId).chat
	// 	})
	// }
})

})();
