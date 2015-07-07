Template.chat.helpers({
	messages: function() {
		var chatCursor = Connections.find({_id: this._id});
		chatCursor.observe({
			changed: function(newDoc, oldDoc) {
				setTimeout(function(){
					$('.discussion').scrollTop($('.discussion')[0].scrollHeight);
				},0);
			}
		})
		return Connections.findOne({_id: this._id}).chat;
	},
	bubble: function(sender) {
		return (sender === Meteor.userId()) ? "bubble-right": "bubble-left";
	}
	// readMessage: function() {
		// var msgs = Connections.findOne({_id: this._id}).chat;
		// var msgsRead = [];
		// msgs.forEach(function(element) {
		// 	if (element.state === "new") {
		// 		msgsRead.push(element.timestamp);
		// 	}
		// })

		// //read message only if window has focus
		// if (msgs.length && Session.get('window_focus')) {
		// 	// $('.discussion').scrollTop($('.discussion')[0].scrollHeight);
		// 	Meteor.call('readMessage', msgsRead, this._id, function(error, result) {
		// 		if (!error) {$('.discussion').scrollTop($('.discussion')[0].scrollHeight);}
		// 		console.log(msgsRead);
		// 	});
		// }
	// }
})

Template.chat.events({
	'click #chatSubmit': function(e, template) {
		var message = template.find('input').value;
		$('#messageInput').val('');
		Meteor.call('sendMessage', message, Meteor.userId(), this._id, function(error, result) {
			if (!error) {
				$('.discussion').scrollTop($('.discussion')[0].scrollHeight);
				console.log("posted message");

			}
		});
		$('#messageInput').focus();
	}
});

Template.chat.rendered = function() {
	// Session.set('window_focus', document.hasFocus());
	// $(window).focus(function() {
	// 	Session.set('window_focus', true);
	// }).blur(function() {
	// 	Session.set('window_focus', false);
	// });

	$('.discussion').scrollTop($('.discussion')[0].scrollHeight);	
}



