Meteor.methods({
	'sendMessage': function(message, sender, connectionId) {
		var messageInsert = {
			message: message,
			timestamp: Date.now(),
			sender: sender,
			state: "new"
		}
		Connections.update({_id: connectionId}, {$push: {chat: messageInsert}});

		sendPush(sender, message)
		// sendNotification(personId, ratedBy, message, "info")
	}

	// 'readMessage': function(msgsRead, connectionId) {
	// 	var msgsStamps = msgsRead;
	// 	msgsStamps.forEach(function(element){
	// 		Connections.findOne(connectionId).chat
	// 	})
	// }
});

var sendPush = function(toId, message) {
  Push.send({
    from: 'partiO',
    title: 'partiO chat notification',
    text: message,
    badge: 1,
    sound: 'check',
    query: {
      userId: toId
    }
  });
}