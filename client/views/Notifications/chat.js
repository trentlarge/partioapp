
Template.chat.helpers({
	inCall: function() {
		return Session.get("_inCall");
	},
	incomingCaller: function() {
		return Session.get("_incomingCaller");
	},
	callStatus: function() {
		return Session.get("_callStatus");
	},
	messages: function() {
		var chatCursor = Connections.find({_id: this._id});
		chatCursor.observe({
			changed: function(newDoc, oldDoc) {
				// console.log(newDoc);
				// console.log(oldDoc);
				setTimeout(function(){
					$('.content').scrollTop($('.message-wrapper')[0].scrollHeight);
				},0);
			}
		})
		return Connections.findOne({_id: this._id}).chat;
	},
	direction: function() {
		return (this.sender === Meteor.userId()) ? "right": "left";
	},
	avatar: function() {
		return (this.sender === Meteor.userId()) ? Meteor.user().profile.avatar : Meteor.users.findOne(this.sender).profile.avatar;
	},
	chatWith: function() {
		return (this.requestor === Meteor.userId()) ?
		Meteor.users.findOne(this.bookData.ownerId).profile.name :
		Meteor.users.findOne(this.requestor).profile.name
	}
});

Template.appLayout.events({
	'click #btnCallUser': function(err, template) {



		Meteor.call('twilioVerification', function(error, result) {
			//console.log(error, result);

				IonPopup.show({
					title: 'Verification',
					template: 	'<div class="center dark">'+result+'The other party did not answer in time.</div>',
					buttons:
					[{
						text: 'OK',
						type: 'button-energized',
						onTap: function() {
							IonPopup.close();
						}
					}]
				});

		})


		Meteor.call('callTwilio', function(error, result) {
			//console.log(error, result);
		})



		// var cRequestor = Session.get("_requestor");
		// var cOwner = Session.get("_owner");
		//
		// $("#btnCallUser").prop("disabled",true);
		//
		// var recipient = (cRequestor === Meteor.userId()) ? cOwner : cRequestor;
		//
		// console.log('USER ID '+recipient);
		//
		// var remoteCallerId = Meteor.users.findOne(recipient).profile.name;
		//
		// Session.set("_incomingCaller", remoteCallerId);
		// Session.set("_inCall", true);
		//
		// Session.set("_callStatus", "Ringing...");
		//
		// PartioCaller.call(recipient, {
		// 	onCallProgressing: function(call) {
		// 		$('audio#ringback').prop("currentTime", 0);
		// 		$('audio#ringback').trigger("play");
		//     console.log("[PartioCaller] ringing...");
		// 		Session.set("_callStatus", "Ringing...");
		// 	},
		// 	onCallEstablished: function(call) {
		// 		$('audio#incoming').attr('src', call.incomingStreamURL);
		// 		$('audio#ringback').trigger("pause");
		// 		$('audio#ringtone').trigger("pause");
		//
		//     console.log("[PartioCaller] Call answered...");
		//
		// 		Session.set("_callStatus", "Call Active");
		//
		// 		//Report call stats
		// 		var callDetails = call.getDetails();
		// 		console.log(callDetails);
		// 	},
		// 	onCallEnded: function(call) {
		// 		$('audio#ringback').trigger("pause");
		// 		$('audio#ringtone').trigger("pause");
		// 		$('audio#incoming').attr('src', '');
		//
		// 		Session.set("_callStatus", "Disconnected");
		//
		// 		$("#btnCallUser").prop("disabled",false);
		//
		// 		Meteor.setTimeout(function() { Session.set("_inCall", false); }, 2500);
		//
		//     console.log(call);
		//     console.log(call.getEndCause());
		//
		// 		if (call.getEndCause() === "TIMEOUT") {
		// 			IonPopup.show({
		// 				title: 'Call Not Answered',
		// 				template: 	'<div class="center dark">The other party did not answer in time.</div>',
		// 				buttons:
		// 				[{
		// 					text: 'OK',
		// 					type: 'button-energized',
		// 					onTap: function() {
		// 						IonPopup.close();
		// 					}
		// 				}]
		// 			});
		// 		}
		//
		//     console.log("[PartioCaller] Call ended...");
		// 		if(call.error || call.getEndCause() === "FAILURE") {
		// 			console.error("[PartioCaller] Call error");
		// 			console.error(call.error.message);
		//
		// 			IonPopup.show({
		// 				title: 'Call Error',
		// 				template: 	'<div class="center dark">'+call.error.message+'</div>',
		// 				buttons:
		// 				[{
		// 					text: 'OK',
		// 					type: 'button-energized',
		// 					onTap: function() {
		// 						IonPopup.close();
		// 					}
		// 				}]
		// 			});
		//
		// 		}
		// 	}
		// });
	}
});

Template.chat.events({
	'click .end-call': function(e,t) {
		PartioCaller.endCall();
	},
	'submit form': function(e, template) {
		e.preventDefault();
		var message = template.find('#messageInput').value.trim();

		var cRequestor = this.requestor;
		var cOwner = this.bookData.ownerId;

		var recipient = (function() {
					return (cRequestor === Meteor.userId()) ? cOwner : cRequestor;
				}) ();

		if (message.length > 0) {
			$('#messageInput').val('');
			Meteor.call('sendMessage', message, Meteor.userId(), recipient, this._id, function(error, result) {
				if (!error) {
					$('.content').scrollTop($('.message-wrapper')[0].scrollHeight);
					$('#messageInput').val('');
					autosize.update($('textarea'));
					console.log("posted message");
					$("#chatSubmit").addClass("disabled");
				} else {
					$('#messageInput').val(message);
				}
			});
		}
		$('#messageInput').focus();
	},
	'input textarea': function(e, template) {
		if (e.target.value.length > 0) {
			$("#chatSubmit").removeClass("disabled");
		} else {
			$("#chatSubmit").addClass("disabled");
		}
	}
});

Template.chat.rendered = function() {
	var dataContext = this.data;
	//Chat input textarea auto-resize when more than 1 line is entered
	autosize($('textarea'));

	//Scroll to bottom of the screen
	$('.content').scrollTop( $('.message-wrapper')[0].scrollHeight );

	//Adjust scroll when keyboard is fired up
	if (window.cordova && window.cordova.plugins.Keyboard) {
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

		window.addEventListener('native.keyboardshow', function() {
			console.log('keyboard is closing');
			$('.content').scrollTop( $('.message-wrapper')[0].scrollHeight );
		});
	}

	Session.set("_requestor", dataContext.requestor);
	Session.set("_owner", dataContext.bookData.ownerId);

	//Make messages as READ
	this.autorun(function() {
		if (Chat.find({connectionId: dataContext._id, state: "new"}).count()) {
			console.log("Messages are now Read: " + Chat.find({connectionId: dataContext._id, state: "new"}).count());
			Chat.update({connectionId: dataContext._id, state: "new"}, {$set: {state: "read"}}, {multi: true})
		}
	})
}
