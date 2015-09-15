Template.feedback.helpers({
	userInfo: function() {
		return Meteor.users.findOne({_id: this.bookData.ownerId}).profile;
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
		var personId = this.bookData.ownerId;
		var rating = $('input[name=rating]:checked').val();

		Meteor.call('submitRating', rating, personId, function(error, result) {
			if (!error) {
				IonModal.close();
				Router.go('/listing');
			}
		})
	}
})
