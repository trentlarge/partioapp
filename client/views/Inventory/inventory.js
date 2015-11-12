
Template.inventory.helpers({
  myBooks: function() {
    return Products.find({"ownerId": Meteor.userId()})
  },
  newRequests: function() {
  	return Connections.find({"productData.ownerId": Meteor.userId(), "state": {$ne: "DONE"} })
  },
  dataExists: function() {
  	return (Products.find({"ownerId": Meteor.userId()}).count() || Connections.find({"productData.ownerId": Meteor.userId(), "state": {$ne: "IN USE"}}).count()) ? true : false;
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
    var bookId = this.productData._id;
    //var searchCollectionId = Products.findOne({productUniqueId: bookId})._id;
    var searchCollectionId = Products.findOne(bookId);

    if(!searchCollectionId._id) {
      console.log('error > product not found')
      return false;
    }

    IonPopup.confirm({
      okText: 'Yes, Share!',
      cancelText: 'Decline',
      title: 'Respond To Request',
      template: '<div class="center">Do you want to share the item with the user?</div>',
      onOk: function() {
        IonPopup.close();
        console.log("proceeding with connection");
        PartioLoad.show();
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
            //   {'productData._id': bookId, 'requestor': {$ne: requestor}},
            //   {$set: {state: "DENIED"}},
            //   {multi: true}
            //   );

            // Connections.find({'productData._id': bookId, 'requestor': {$ne: requestor}})
            // .map(function(item) {
            //   console.log('connectionforBookID: ' + item);
            //   Connections.update({_id: item._id}, {$set: {"state": "DENIED"}});
            // });
            //console.log('connectionforBookID: ' + connectionforBookID);

            // connectionforBookID.forEach(function(item) {
            //   console.log('connectionforBookID: ' + item);
            // });

            PartioLoad.hide();

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

      onCancel: function() {
        // Connections.remove({"_id": connectionId});
        // console.log('Request Declined!');

        Meteor.call('ownerDecline', connectionId, function(error, result) {
          if(!error){
            console.log('Request Declined!');
          } else{
            console.log('Declined Error: ' + error);
          }
        });
      }
    });
  }

});
