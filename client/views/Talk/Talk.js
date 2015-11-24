Template.talk.created = function() {

};

Template.talk.rendered = function() {
	var self = this;
	// mark message as read imediatelly as message arrives
	this.autorun(function() {
		if(self.data.connection && self.data.unreadMessages && self.data.unreadMessages.count()) {
console.log(self.data.unreadMessages.count());
			Meteor.call("markMessagesRead", self.data.connection._id, function(e, r) {
				if(e) {
					console.log(e.message);
				}
			});
		}
	});
};

Template.talk.helpers({
	"chatWith": function() {
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
				$('.content').scrollTop($('.message-wrapper')[0].scrollHeight);
			}
		});

		$('#messageInput').focus();
	},

	'input textarea': function(e, t) {
		if (e.target.value.length > 0) {
			$("#chatSubmit").removeClass("disabled");
		} else {
			$("#chatSubmit").addClass("disabled");
		}
	}
});
