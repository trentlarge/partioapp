Template.renting.rendered = function() {
    Session.set('isTapping', false);
}

Template.renting.helpers({
  toBeApproved: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": 'WAITING'}); //{$ne: "IN USE", $ne: "DONE"}})
  },
  toBePaid: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": 'PAYMENT'}); //{$ne: "IN USE", $ne: "DONE"}})
  },
  currentlyBorrowed: function() {
  	return Connections.find({"requestor": Meteor.userId(), "state": "DONE"});
  },
  dataExists: function() {
  	return (Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE"}}).count() || Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}).count()) ? true : false;
  },
  itemReturned: function() {
    return (Connections.find({"requestor": Meteor.userId(), "state": "DONE"})).count();
  },
  isTapping: function() {
      return Session.get('isTapping');
  }
});

Template.renting.events({
	'click .borrowedBookDetail': function() {
		Router.go('/listing/'+this.bookData._id);
	}
});