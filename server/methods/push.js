Push.debug = true; // Add verbosity

Push.allow({
	send: function(userId, notification) {
		return true; // Allow all users to send
	}
});

Meteor.methods({
	'sendMessage': function(message, sender, recipient, connectionId) {
		if(connectionId && message && sender && recipient) {
			var messageInsert = {
				message: message,
				timestamp: Date.now(),
				sender: sender,
				state: "new"
			}

			Connections.update({_id: connectionId}, {$push: {chat: messageInsert}});
			
			if(Meteor.isCordova) {
				var sender_name = Meteor.users.findOne(sender).profile.name;

				if(sender_name) {
					sendPush(recipient, sender_name + " says: " +  message);
				}
			}
		}
	}
 //	sendNotification(recipient, ratedBy, message, "info")
	// 'readMessage': function(msgsRead, connectionId) {
	// 	var msgsStamps = msgsRead;
	// 	msgsStamps.forEach(function(element){
	// 		Connections.findOne(connectionId).chat
	// 	})
	// }
});

sendPush = function(toId, message) {
	if(Meteor.isCordova) {
		if(toId && message) {
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
	}
	
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
