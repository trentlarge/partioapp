Template.inventory.helpers({
  myBooks: function() {
    return Products.find({"ownerId": Meteor.userId()})
  },
  newRequests: function() {
  	return Connections.find({"bookData.ownerId": Meteor.userId(), "state": {$ne: "DONE"} })
  },
  dataExists: function() {
  	return (Products.find({"ownerId": Meteor.userId()}).count() || Connections.find({"bookData.ownerId": Meteor.userId(), "state": {$ne: "IN USE"}}).count()) ? true : false;
  },
  status: function() {
  	return Connections.findOne(this._id).approved ? "IN USE" : "WAITING" ;
  },
  statusWaiting: function() {
    return Connections.findOne(this._id).state === "WAITING" ? true: false;
  }
});

Template.inventory.events({
  'click #respondToReq': function() 
  {
    var requestor = this.requestor;
    var connectionId = this._id;

    IonPopup.confirm({
      okText: 'Yes, Share!',
      cancelText: 'Decline',
      title: 'Respond To Request',
      template: '<div class="center">Do you want to share the item with the user?</div>',
      onOk: function() {
        IonPopup.close();
        console.log("proceeding with connection");
        IonLoading.show();
        Meteor.call('ownerAccept', connectionId, requestor, function(error, result) {
          if (!error) {
            IonLoading.hide();
            IonPopup.show({
              title: 'Great!',
              template: '<div class="center">Make sure you setup a meeting location and pass on the item to <strong>'+ Meteor.users.findOne(requestor).profile.name+'</strong> once you receive the payment. </div>',
              buttons: 
              [{
                text: 'OK',
                type: 'button-assertive',
                onTap: function() 
                {
                  Router.go('/inventory/connect/'+connectionId);
                  IonPopup.close();
                }
              }]
            });
          }
        });
      },
      onCancel: function() 
      {
        Connections.remove({"connectionId": this._id});
        console.log('Request Declined!');
      }
    });
  },

  'click .respondToReq': function() {
    console.log('respondToReq');
    console.log(this);
  }

})

Template.inventoryDetail.events({
  'click #editSave': function(e, template) {
    console.log("saving");

    var edited = template.find('#editPrice').value;
    Products.update({_id: this._id}, {$set: {customPrice: edited}});
    Session.set('editMode', false);
  }
});

Template.inventoryDetail.helpers({
  editMode: function() {
    return Session.get('editMode') ? true : false;
  },
  manualEntry: function() {
    return (this.manualEntry) ? true : false;
  }
})