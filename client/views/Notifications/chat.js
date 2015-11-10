
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


		// does exists number mobile ?
		if(Meteor.user().profile.mobile === ""){
			console.log('nao tem telefone');
			IonPopup.show({
				title: 'Ops',
				template: '<div class="center dark">Please update your mobile number.</div>',
				buttons:
				[{
					text: 'OK',
					type: 'button-energized',
					onTap: function() {
						Router.go('/profile');
						IonPopup.close();
					}
				}]
			});

			return false
		}


		console.log('validate '+Meteor.users.findOne(Meteor.userId()).profile.mobileValidated);
		// mobile  validated
		if (Meteor.users.findOne(Meteor.userId()).profile.mobileValidated) {

			Meteor.call('callTwilio', Meteor.user().profile.mobile, Meteor.user().profile.mobile, function(error, result) {

			})

		} else {

			console.log('nao validado');

			Meteor.call('twilioVerification', Meteor.user().profile.mobile, function(error, result) {

								if(error) {
									IonPopup.show({
										title: 'Ops',
										template: '<div class="center dark">You can\'t do this call now. Try again later.'+error.reason+'</div>',
										buttons:
										[{
											text: 'OK',
											type: 'button-energized',
											onTap: function() {
												IonPopup.close();
											}
										}]
									});
								} else {
									IonPopup.show({
										title: 'Verification',
										template: '<div class="center dark">Plase, digit '+result.data.validation_code+' to validate your phone.</div>',
										buttons:
										[{
											text: 'OK',
											type: 'button-energized',
											onTap: function() {
												IonPopup.close();
											}
										}]
									});
								}

			})


		}
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
