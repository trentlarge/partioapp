Template.renting.helpers({
  toBeApproved: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE", $ne: "DONE"}})
  },
  currentlyBorrowed: function() {
  	return Connections.find({"requestor": Meteor.userId(), "state": "DONE"});
  },
  dataExists: function() {
  	return (Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE"}}).count() || Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}).count()) ? true : false;
  },
  itemReturned: function() {
    return (Connections.find({"requestor": Meteor.userId(), "state": "DONE"})).count();
  }
});

Template.renting.events({
	'click .borrowedBookDetail': function() {
		Router.go('/listing/'+this.bookData._id);
	}
})