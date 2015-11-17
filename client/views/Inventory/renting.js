Template.renting.rendered = function() {
    Session.set('isTapping', false);
}

Template.renting.helpers({
  toBeApproved: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": "WAITING"}); //{$ne: "IN USE", $ne: "DONE"}})
  },
  toBePaid: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": "PAYMENT"}); //{$ne: "IN USE", $ne: "DONE"}})
  },
  currentlyBorrowed: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}); //{$ne: "IN USE", $ne: "DONE"}})
  	//return Connections.find({"requestor": Meteor.userId(), "state": "DONE"});
  },
  dataExists: function() {
  	return (Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE"}}).count() || Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}).count()) ? true : false;
  },
  isReturned: function() {
    return (Connections.find({"requestor": Meteor.userId(), "state": "RETURNED"}));
  },
  itemReturned: function() {
    return (Connections.find({"requestor": Meteor.userId(), "state": "RETURNED"})).count();
  },
  isTapping: function() {
      return Session.get('isTapping');
  }
});

Template.renting.events({
	'click .borrowedBookDetail': function() {
		Router.go('/listing/'+this.productData._id);
	}
});
