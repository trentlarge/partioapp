Template.venmoAuth.helpers({
	venmoDetails: function() {
		if (Meteor.user()) {
			return Meteor.user().profile;	
		}
	}
})