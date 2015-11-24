Meteor.methods({
	'sendTalk': function(fromId, toId, connectionId, message) {
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
				// !!!
				// Send notification to user "toId"
				// !!!
				console.log("Message is unread");
			}
		}, 3000);


		return docId;
	},

	'markMessagesRead': function(connectionId) {
		console.log("Marking messages read: ", connectionId, this.userId);
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
	}
});

