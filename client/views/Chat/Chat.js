Template.chat.events({
	// 'click .end-call': function(e,t) {
	// 	PartioCaller.endCall();
	// },
	'submit form': function(e, template) {
		e.preventDefault();
		var message = template.find('#messageInput').value.trim();

		var cRequestor = this.requestor._id;
		var cOwner =  this.owner._id;

		var recipient = (function() {
			return (cRequestor === Meteor.userId()) ? cOwner : cRequestor;
		}) ();

		if (message.length > 0) {
			$('#messageInput').val('');

			Meteor.call('sendMessage', message, Meteor.userId(), recipient, this.connection._id, function(error, result) {
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
	//var dataContext = this.data;

	//console.log(this.data)

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

	//Session.set("_requestor", dataContext.requestor);
	//Session.set("_owner", dataContext.productData.ownerId);

	var _connectionId = this.data.connection._id;

	//Make messages as READ
	// this.autorun(function() {
	// 	if (Chat.find({connectionId: _connectionId, state: "new"}).count()) {
	// 		console.log("Messages are now Read: " + Chat.find({connectionId: _connectionId, state: "new"}).count());
	// 		Chat.update({connectionId: _connectionId, state: "new"}, {$set: {state: "read"}}, {multi: true})
	// 	}
	// })
}
