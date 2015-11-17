Template.feedback.helpers({
	userInfo: function() {
		return Meteor.users.findOne({_id: this.productData.ownerId}).profile;
	},
	noProfileYet: function() {
		if (this.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	}
});

Template.feedback.events({
	'click #submitFeedback': function() {
		var personId = this.productData.ownerId;
		var rating = $('input[name=rating]:checked').val();

		if (rating) {
			Meteor.call('submitRating', rating, personId, Meteor.userId(), function(error, result) {
				if (!error) {
					IonModal.close();
					Router.go('/listing');
				}
			})
		} else {
			IonLoading.show({
				duration: 1500,
				customTemplate: '<div class="center"><h5>Please enter your feedback</h5></div>',
			});
		}
	}
});



Template.feedbackborrower.helpers({
	userInfo: function() {
		console.log(this);
		return Meteor.users.findOne({_id: this.requestor}).profile;
	},
	noProfileYet: function() {
		if (this.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	}
});

Template.feedbackborrower.events({
	'click #submitFeedback': function() {
		var personId = this.requestor;
		var connectionId = this._id;
		var rating = $('input[name=rating]:checked').val();

		if (rating) {
			Meteor.call('submitRating', rating, personId, Meteor.userId(), function(error, result) {
				if (!error) {
					IonModal.close();
					Router.go('/inventory');
					Connections.remove({_id: connectionId});
					Chat.remove({connectionId: connectionId})
				}
			})
		} else {
			IonLoading.show({
				duration: 1500,
				customTemplate: '<div class="center"><h5>Please enter your feedback</h5></div>',
			});
		}
	}
})
