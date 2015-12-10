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
    var productId = this.productData._id;
    var searchCollectionId = Products.findOne(productId);

    //if product not found
    if(!searchCollectionId._id) {
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
        Meteor.call('ownerDecline', connectionId, function(err, res) {
          if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
          }
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
