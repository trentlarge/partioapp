(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/commonMethods.js                                                //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Push.debug = true; // Add verbosity                                    // 1
                                                                       //
Meteor.methods({                                                       // 3
		'sendMessage': function (message, sender, connectionId) {            // 4
				var messageInsert = {                                              // 5
						message: message,                                                // 6
						timestamp: Date.now(),                                           // 7
						sender: sender,                                                  // 8
						state: "new"                                                     // 9
				};                                                                 //
				Connections.update({ _id: connectionId }, { $push: { chat: messageInsert } });
                                                                       //
				sendPush(sender, message);                                         // 13
				// sendNotification(personId, ratedBy, message, "info")            //
		}                                                                    //
                                                                       //
		// 'readMessage': function(msgsRead, connectionId) {                 //
		// 	var msgsStamps = msgsRead;                                       //
		// 	msgsStamps.forEach(function(element){                            //
		// 		Connections.findOne(connectionId).chat                          //
		// 	})                                                               //
		// }                                                                 //
});                                                                    //
                                                                       //
var sendPush = function (toId, message) {                              // 25
		Push.send({                                                          // 26
				from: 'partiO',                                                    // 27
				title: 'partiO chat notification',                                 // 28
				text: message,                                                     // 29
				badge: 1,                                                          // 30
				sound: 'check',                                                    // 31
				query: {                                                           // 32
						userId: toId                                                     // 33
				}                                                                  //
		});                                                                  //
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=commonMethods.js.map
