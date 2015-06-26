Template.bookDetail.helpers({
	owner: function() {
		return Meteor.users.findOne(this.userId).profile.name;
	}
})