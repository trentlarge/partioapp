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
})

Template.chat.events({
	'click #chatSubmit': function(e, template) {
		var message = template.find('input').value;

		Meteor.call('sendMessage', message, Meteor.userId(), this._id, function(error, result) {
			if (!error) {
				$('.discussion').scrollTop($('.discussion')[0].scrollHeight);
				$('#messageInput').val('');
				console.log("posted message");
			}
		});
		$('#messageInput').focus();
	}
	// 'focus input#messageInput': function (evt) {
	// 	setTimeout(function(){
	// 		$('.discussion').scrollTop($('.discussion')[0].scrollHeight);
	// 	}, 500);
	// }
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



