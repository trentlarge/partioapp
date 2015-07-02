Template.mybooks.helpers({
  myBooks: function() {
    return Products.find({"ownerId": Meteor.userId()})
  },
  newRequests: function() {
  	return Connections.find({"bookData.ownerId": Meteor.userId(), "approved": false})
  },
  dataExists: function() {
  	return (Products.find({"ownerId": Meteor.userId()}).count() || Connections.find({"bookData.ownerId": Meteor.userId(), "approved": false}).count()) ? true : false;
  }
})