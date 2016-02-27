Template.feedback.helpers({
	userInfo: function() {
		return this.productData.ownerData.profile;
	},
	ownerAvatar: function() {
		if( !this.productData ||
			!this.productData.ownerData ||
			!this.productData.ownerData.profile ||
			!this.productData.ownerData.profile.avatar ||
			 this.productData.ownerData.profile.avatar == 'notSet')
		{
			return '/profile_image_placeholder.jpg'
		}

		return this.productData.ownerData.profile.avatar;
	},

	getAreaName: function() {
		return areaName(this.productData.ownerArea);
	}
});

Template.feedback.events({
	'click #submitFeedback': function() {
		var personId = this.productData.ownerId;
		var rating = $('input[name=rating]:checked').val();

		if (rating) {
			Meteor.call('submitRating', rating, personId, Meteor.userId(), function(err, res) {
				if(err) {
					var errorMessage = err.reason || err.message;
					if(err.details) {
						errorMessage = errorMessage + "\nDetails:\n" + err.details;
					}
					sAlert.error(errorMessage);
					return;
				}

				IonModal.close();
				Router.go('/listing');
			});
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
		return this.profile;
	},

	requestorAvatar: function() {
		return this.profile.avatar;
	},

	// ownerAvatar: function() {
	// 	return this.ownerData.profile.avatar;
	// },

	getAreaName: function() {
		return areaName(this.profile.area);
	}
});

Template.feedbackborrower.events({
	'click #submitFeedback': function() {
		var personId = this._id;
		var connectionId = Router.current().params._id;
		var rating = $('input[name=rating]:checked').val();

		if (rating) {
			Meteor.call('submitRating', rating, personId, Meteor.userId(), function(err, res) {
				IonModal.close();
				if(err) {
					var errorMessage = err.reason || err.message;
					if(err.details) {
						errorMessage = errorMessage + "\nDetails:\n" + err.details;
					}
					sAlert.error(errorMessage);
					return;
				}
				Meteor.call('updateConnection', connectionId, function(err, res) {
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}
				});
				Router.go('/items');
			});
		} else {
			IonLoading.show({
				duration: 1500,
				customTemplate: '<div class="center"><h5>Please enter your feedback</h5></div>',
			});
		}
	}
})
