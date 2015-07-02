Template.booksLent.helpers({
  toBeApproved: function() {
    return Connections.find({"requestor": Meteor.userId(), "approved": false})
  },
  currentlyBorrowed: function() {
  	return Connections.find({"requestor": Meteor.userId(), "approved": true});
  },
  dataExists: function() {
  	return (Connections.find({"requestor": Meteor.userId(), "approved": false}).count() || Connections.find({"requestor": Meteor.userId(), "approved": true}).count()) ? true : false;
  },
  status: function() {
  	return Connections.findOne({"requestor": Meteor.userId()}).approved ? "ACCEPTED" : "WAITING" ;
  }
})