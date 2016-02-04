Meteor.methods({
	"sendTalk": function(fromId, toId, connectionId, message) {
		if(fromId != this.userId && toId != this.userId) {
			throw new Meteor.Error(404, "Access denied");
		}

		var talkDoc = {
			fromId: fromId,
			toId: toId,
			connectionId: connectionId,
			message: message,
			timestamp: Date.now(),
			state: "new"
		};

		var docId = Talk.insert(talkDoc);

		// ugly trick but...
		// check if message is read by other user after 3 seconds
		// if it's not - user is not in chat window and then we need to send him notification
		Meteor.setTimeout(function() {
			var doc = Talk.findOne({ _id: docId });
			if(doc && doc.state == "new") {
				// calculate how many unread messages has sent
				var unreadCount = Talk.find({ fromId: fromId, toId: toId, connectionId: connectionId, state: "new" }).count();
				if(unreadCount) {
					// read sender's name
					var fromUser = Users.findOne({ _id: fromId });
					if(fromUser) {
						var notifyMessage = "You have " + unreadCount + " unread messages from " + fromUser.profile.name;
						var pushMessage = "You have a new message from " + fromUser.profile.name;
						sendNotification(toId, fromId, notifyMessage, "chat", connectionId);
						sendPush(toId, pushMessage);
					}
				}
			}
		}, 3000);


		return docId;
	},

	"markMessagesRead": function(connectionId) {
		Talk.update({
			connectionId: connectionId,
			toId: this.userId
		},
		{
			$set: { state: "read" }
		},
		{
			multi: true
		});

		Notifications.update({
			connectionId: connectionId,
			type: "chat"
		},
		{
			$set: { read: true }
		});
	}
});
