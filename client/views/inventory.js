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
    var bookId = this.bookData._id;
    var searchCollectionId = Search.findOne({productUniqueId: bookId})._id;

    IonPopup.confirm({
      okText: 'Yes, Share!',
      cancelText: 'Decline',
      title: 'Respond To Request',
      template: '<div class="center">Do you want to share the item with the user?</div>',
      onOk: function() {
        IonPopup.close();
        console.log("proceeding with connection");
        IonLoading.show();
        Meteor.call('ownerAccept', connectionId, function(error, result) {
          if (!error) 
          {
            // var connectionObj = Connections.findOne({_id: connectionId});            
            // var jsonConnect = JSON.stringify(connectionObj);
            // console.log('book ID: ' + jsonConnect);

            // var seachResult = Search.findOne({productUniqueId: });
            // console.log('seachResult: ' + JSON.stringify(seachResult));

            //Once the book request is approved, decrease the count based on Book ID
            // var result = Search.update({_id: searchCollectionId}, {$inc: {qty: -1}})
            // console.log('Update result: ' + result);
            
            //Connections.find({"requestor": Meteor.userId(), "state": "PAYMENT"});
            // Connections.find(
            //   {'bookData._id': bookId, 'requestor': {$ne: requestor}}, 
            //   {$set: {state: "DENIED"}},
            //   {multi: true}
            //   );

            // Connections.find({'bookData._id': bookId, 'requestor': {$ne: requestor}})
            // .map(function(item) {
            //   console.log('connectionforBookID: ' + item);
            //   Connections.update({_id: item._id}, {$set: {"state": "DENIED"}});
            // });
            //console.log('connectionforBookID: ' + connectionforBookID);  

            // connectionforBookID.forEach(function(item) {
            //   console.log('connectionforBookID: ' + item);  
            // });         

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
        Connections.remove({"_id": connectionId});
        console.log('Request Declined!');
      }
    });
  }

})

Template.inventoryDetail.events({
  'click #editSave': function(e, template) {
    console.log("saving");

    var xPrice = parseInt(template.find('#editPrice').value, 10);
    console.log('Edit xPrice ' + xPrice);  
    
    if(xPrice < 0.5)
    {
      showInvalidPopUp('Invalid Inputs', 'Please enter a valid price.');
      return false;
    }

    if(xPrice > 1000)
    {
      showInvalidPopUp('Invalid Inputs', 'Please enter a Price < 1000.');
      return false;
    }

    var edited = template.find('#editPrice').value;
    Products.update({_id: this._id}, {$set: {customPrice: edited}});
    Session.set('editMode', false);
  }
});

function showInvalidPopUp(strTitle, strMessage)
{
  IonPopup.show({
          title: strTitle,
          template: '<div class="center">'+strMessage+'</div>',
          buttons: 
          [{
            text: 'OK',
            type: 'button-assertive',
            onTap: function() 
            {
              IonPopup.close();
            }
          }]
        });
}

var bookID;
Template.inventoryDetail.helpers({
  editMode: function() {

    var ConnectionObj = Connections.findOne({'bookData._id': this._id});
    
    if(ConnectionObj) 
    {
      var ConnectionStatus = ConnectionObj.state;

      if(ConnectionStatus != "DONE")
      {
        //Check if book is in RENTING mode and disable edit option
        return false;
      }
    }

    return Session.get('editMode') ? true : false;
  },
  manualEntry: function() {
    return (this.manualEntry) ? true : false;
  }
})