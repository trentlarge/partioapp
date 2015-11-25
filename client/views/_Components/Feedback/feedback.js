Template.feedback.helpers({
	userInfo: function() {

		console.log('--------------------------')
		console.log(this);
		console.log('--------------------------')

		return this.productData.ownerData.profile;
	},
	ownerAvatar: function() {
		if(this.productData.ownerData.profile.avatar == 'notSet' ||
			 this.productData.ownerData.profile.avatar == ''
		 ){
			return '/profile_image_placeholder.jpg'
		} else {
			return this.productData.ownerData.profile.avatar;
		}
	},
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
	requestorData: function() {
		//console.log(this.requestorData);
		return this.requestorData.profile;
	},
	requestorAvatar: function() {
		if(this.requestorData.profile.avatar == 'notSet' ||
			 this.requestorData.profile.avatar == ''
		 ){
			return '/profile_image_placeholder.jpg'
		} else {
			return this.requestorData.profile.avatar;
		}
	},
	ownerAvatar: function() {
		if(this.productData.ownerData.profile.avatar == 'notSet' ||
			 this.productData.ownerData.profile.avatar == ''
		 ){
			return '/profile_image_placeholder.jpg'
		} else {
			return this.productData.ownerData.profile.avatar;
		}
	},
	ownerData: function(){
		return this.productData.ownerData.profile;
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
					Meteor.call('removeConnection', connectionId);
					Router.go('/inventory');
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
