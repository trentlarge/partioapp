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
})

Template.chat.events({
	'submit form': function(e, template) {
		e.preventDefault();
		var message = template.find('textarea').value.trim();

		if (message.length > 0) {
			Meteor.call('sendMessage', message, Meteor.userId(), this._id, function(error, result) {
				if (!error) {
					$('.discussion').scrollTop($('.discussion')[0].scrollHeight);
					$('#messageInput').val('');
					autosize.update($('textarea'));
					console.log("posted message");
					$("#chatSubmit").addClass("disabled");
				}
			});
		}
		$('#messageInput').focus();
	},
	'input textarea': function(e, template) {
		if (e.target.value.length > 0) {
			$("#chatSubmit").removeClass("disabled");
			// autosize($('textarea'));
		} else {
			$("#chatSubmit").addClass("disabled");
		}
	}
	// 'keypress #messageInput': function(e, template) {
	// 	if (e.which === 13) {
	// 		var message = template.find('input').value;
	// 		Meteor.call('sendMessage', message, Meteor.userId(), this._id, function(error, result) {
	// 			if (!error) {
	// 				$('.discussion').scrollTop($('.discussion')[0].scrollHeight);
	// 				$('#messageInput').val('');
	// 				console.log("posted message");
	// 			}
	// 		});
	// 		$('#messageInput').focus();
	// 	}
	// }
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
	// $('#messageInput').autosize().show().trigger('autosize.resize');
	// Keyboard.hideFormAccessoryBar(true);
	autosize($('textarea'));
	$('.discussion').scrollTop($('.discussion')[0].scrollHeight);
}



