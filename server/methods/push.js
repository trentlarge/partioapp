Push.debug = true; // Add verbosity

Push.allow({
	send: function(userId, notification) {
		return true; // Allow all users to send
	}
});

Meteor.methods({
	'sendMessage': function(message, sender, recipient, connectionId) {
		var messageInsert = {
			message: message,
			timestamp: Date.now(),
			sender: sender,
			state: "new"
		}
		Connections.update({_id: connectionId}, {$push: {chat: messageInsert}});
//		console.log(Meteor.users.findOne(sender).profile.name + " says: " +  message);

		sendPush(recipient, Meteor.users.findOne(sender).profile.name + " says: " +  message)
		// sendNotification(personId, ratedBy, message, "info")
	}

	// 'readMessage': function(msgsRead, connectionId) {
	// 	var msgsStamps = msgsRead;
	// 	msgsStamps.forEach(function(element){
	// 		Connections.findOne(connectionId).chat
	// 	})
	// }
});

sendPush = function(toId, message) {
  Push.send({
    from: 'partiO chat message',
    title: 'partiO chat notification',
    text: message,
    badge: 1,
    sound: 'check',
    query: {
      userId: toId
    }
  });
}


// var sendPush = function(toId, message) {
//   Push.send({
//     from: 'partiO',
//     title: 'New activity on partiO',
//     text: message,
//     badge: 1,
//     sound: 'check',
//     query: {
//       userId: toId
//     }
//   });
// }
