Template.talk.created = function() {

};

Template.talk.rendered = function() {
	var self = this;

	// Chat input textarea auto-resize when more than 1 line is entered
	autosize($('textarea'));

	// Scroll to bottom of the screen
	$('.content').scrollTop( $('.talk-content')[0].scrollHeight );

	// Adjust scroll when keyboard is fired up
	if(window.cordova && window.cordova.plugins.Keyboard) {
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

		window.addEventListener('native.keyboardshow', function() {
			$('.content').scrollTop( $('.talk-content')[0].scrollHeight );
		});
	}

//	$("textarea").focus();

	// mark message as read imediatelly as message arrives
	this.autorun(function() {
		if(self.data.connection && self.data.unreadMessages && self.data.unreadMessages.count()) {
			Meteor.call("markMessagesRead", self.data.connection._id, function(err, res) {
				if(err) {
					var errorMessage = err.reason || err.message;
					if(err.details) {
						errorMessage = errorMessage + "\nDetails:\n" + err.details;
					}
					sAlert.error(errorMessage);
					return;
				}
			});
		}
	});
};

Template.talk.helpers({
	"chatWith": function() {
		if(!this.connection) {
			return "";
		}
		var owner = this.connection.productData.ownerData;
		var requestor = this.connection.requestorData;

		return (requestor._id === Meteor.userId()) ? owner.profile.name : requestor.profile.name;
	}
});

Template.talk.events({
	'submit form': function(e, t) {
		e.preventDefault();

		if(!Meteor.userId()) {
			return false;
		}

		if(!this.connection || !this.connection.productData || !this.connection.productData || !this.connection.requestorData) {
			return false;
		}

		var message = t.find('#messageInput').value.trim();
		if(!message) {
			return false;
		}

		var owner = this.connection.productData.ownerData;
		var requestor = this.connection.requestorData;

		var fromId = Meteor.userId();
		var toId = (requestor._id === Meteor.userId()) ? owner._id : requestor._id;
		if(!fromId || !toId) {
			return false;
		}

		$("#chatSubmit").addClass("disabled");
		$('#messageInput').val('');
		autosize.update($('textarea'));

		Meteor.call('sendTalk', fromId, toId, this.connection._id, message, function(error, result) {
			if (error) {
				$('#messageInput').val(message);
				$("#chatSubmit").removeClass("disabled");
				autosize.update($('textarea'));
			} else {
				$('.content').scrollTop($('.talk-content')[0].scrollHeight);
			}
		});

		$('#messageInput').focus();
	},

	'keydown textarea': function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			$("#chatSubmit").click();
			return false;
		}
	},

	'input textarea': function(e, t) {
		if (e.target.value.length > 0) {
			$("#chatSubmit").removeClass("disabled");
		} else {
			$("#chatSubmit").addClass("disabled");
		}
	}
});

Template.message.helpers({
	"direction": function() { 
		return this.fromId == Meteor.userId() ? "right" : "left"; 
	},

	"avatar": function() { 
		return userAvatar(this.fromUser.profile.avatar);
	}
});