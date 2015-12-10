Template.inventory.events({
    'click .start-share': function() {
        if(CheckStripeAccount()) {
            Router.go('/lend');
        }
    },
    'click .final-requests': function() {

        var requests = $('.final-requests');
        var requestsItem = $('.final-request-item');

        if(!requestsItem.is(':visible')){
            requestsItem.slideDown('fast');
            requests.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
        }
        else {
            requestsItem.slideUp('fast');
            requests.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
        }

    },
    'click .requests': function() {

        var requests = $('.requests');
        var requestsItem = $('.request-item');

        if(!requestsItem.is(':visible')){
            requestsItem.slideDown('fast');
            requests.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
        }
        else {
            requestsItem.slideUp('fast');
            requests.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
        }

    },
    'click .products': function() {

        var products = $('.products');
        var productsItem = $('.product-item');

        if(!productsItem.is(':visible')){
            productsItem.slideDown('fast');
            products.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
        }
        else {
            productsItem.slideUp('fast');
            products.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
        }

    },
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
        Meteor.call('ownerAccept', connectionId, function(err, res) {
          PartioLoad.hide();
          if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
          }

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
          var requestorUser = Meteor.users.findOne(requestor);
          IonPopup.show({
            title: 'Great!',
            template: '<div class="center">Make sure you setup a meeting location and pass on the item to <strong>'+ requestorUser.profile.name+'</strong> once you receive the payment. </div>',
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
        });
      },

      onCancel: function() {
        // Connections.remove({"_id": connectionId});
        // console.log('Request Declined!');
        Meteor.call('ownerDecline', connectionId, function(err, res) {
          if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
          }

          console.log('Request Declined!');
        });
      }
    });
  }

})

function CheckStripeAccount () {
    var currentUser = Meteor.user();
    if (currentUser && currentUser.profile && currentUser.profile.cards && currentUser.profile.cards.length > 0) {
      return true;
    } else {
      PartioLoad.hide();
      IonPopup.show({
          title: 'ATTENTION!',
          template: '<div class="center">First, you need update you card information!</div>',
          buttons:
            [{
              text: 'Add Card',
              type: 'button-energized',
              onTap: function()
              {
                  IonPopup.close();
                  $('#closeLend').click();
                  Router.go('/profile/savedcards');
                  IonModal.close();
              }
            }]
      });

      return false;
    }
}

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
