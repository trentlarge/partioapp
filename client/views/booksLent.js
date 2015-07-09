Template.booksLent.helpers({
  toBeApproved: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE"}})
  },
  currentlyBorrowed: function() {
  	return Connections.find({"requestor": Meteor.userId(), "state": "IN USE"});
  },
  dataExists: function() {
  	return (Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE"}}).count() || Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}).count()) ? true : false;
  }
});

Template.booksLent.events({
	'click .borrowedBookDetail': function() {
		Router.go('/listing/'+this.bookData._id);
	}
})