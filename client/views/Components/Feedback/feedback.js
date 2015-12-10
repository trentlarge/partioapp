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
	requestorData: function() {
		if(!this.requestorData) {
			return null;
		}
		return this.requestorData.profile;
	},

	ownerData: function(){
		if(!this.productData || !this.productData.ownerData) {
			return null;
		}
		return this.productData.ownerData.profile;
	},

	requestorAvatar: function() {
		if( !this.requestorData ||
			!this.requestorData.profile ||
			!this.requestorData.profile.avatar ||
			 this.requestorData.profile.avatar == 'notSet')

		{
			return '/profile_image_placeholder.jpg'
		}

		return this.requestorData.profile.avatar;
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
	}
});

Template.feedbackborrower.events({
	'click #submitFeedback': function() {
		var personId = this.requestor;
		var connectionId = this._id;
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
				Meteor.call('removeConnection', connectionId, function(err, res) {
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}
				});
				Router.go('/inventory');
			});
		} else {
			IonLoading.show({
				duration: 1500,
				customTemplate: '<div class="center"><h5>Please enter your feedback</h5></div>',
			});
		}
	}
})
