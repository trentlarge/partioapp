Template.mybooks.helpers({
  myBooks: function() {
    return Products.find({"ownerId": Meteor.userId()})
  },
  newRequests: function() {
  	return Connections.find({"bookData.ownerId": Meteor.userId()}, {state: {$ne: "IN USE"}})
  },
  dataExists: function() {
  	return (Products.find({"ownerId": Meteor.userId()}).count() || Connections.find({"bookData.ownerId": Meteor.userId()}, {state: {$ne: "IN USE"}}).count()) ? true : false;
  },
  status: function() {
  	return Connections.findOne(this._id).approved ? "IN USE" : "WAITING" ;
  }
});

Template.mybookDetail.events({
  'click #editSave': function(e, template) {
    console.log("saving");

    var edited = template.find('#editPrice').value;
    Products.update({_id: this._id}, {$set: {customPrice: edited}});
    Session.set('editMode', false);
  }
});

Template.mybookDetail.helpers({
  editMode: function() {
    return Session.get('editMode') ? true : false;
  },
  manualEntry: function() {
    return (this.manualEntry) ? true : false;
  }
})