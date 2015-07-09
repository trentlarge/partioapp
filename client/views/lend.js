Template.lend.events({
  'click .viewfinder': function() {
    IonLoading.show();
    console.log('the new Amazon call in progress');

    if (Meteor.isCordova) {
      cordova.plugins.barcodeScanner.scan(
        function(result) {

          if (result.cancelled === 0) {
            console.log(result.text, result.format);

            var barcode = result.text;
            var format = result.format;
            var cleanFormat = format.split('_')[0];
            Meteor.call('priceFromAmazon', barcode, cleanFormat, function(error, result) {
              console.log(result);
              var resultFromAmazon = {};
              if (!error) {
                Session.set('scanResult', result);
                IonLoading.hide();
              } else {
                IonLoading.hide();
                console.log(error);
                IonPopup.show({
                  title: 'No match found :( ',
                    template: '<div class="center">You can manually checkin your product</div>',
                    buttons: 
                    [{
                      text: 'OK',
                      type: 'button-assertive',
                      onTap: function() {
                        IonPopup.close();
                      }
                    }]
                  });
              }
            });
          }
        },
        function(error) {
          alert("Scanning failed: " + error);
        })
        } else {
          Meteor.call('priceFromAmazon', 9780439708180, "UPC", function(error, result) {
            console.log(result);
            var resultFromAmazon = {};
            if (!error) {
              Session.set('scanResult', result);
              IonLoading.hide();
            } else {
              console.log(error);
              IonLoading.hide();
              IonPopup.show({
                title: 'Please try again or manually enter your product :( ',
                  template: '<div class="center">'+ error.message + '</div>',
                  buttons: 
                  [{
                    text: 'OK',
                    type: 'button-assertive',
                    onTap: function() {
                      IonPopup.close();
                    }
                  }]
                });
            }
          });
        }
}
})


Template.lend.events({
  'click #submitProduct': function(e, template) {
    IonLoading.show();
    Meteor.setTimeout(function() {
      if (Session.get('scanResult')) {
        var submitProduct = Session.get('scanResult');
        // var lendingPeriod = (function() {
        //   return (template.find('#lendingPeriod').value) ? template.find('#lendingPeriod').value : 2; 
        // }) ();

        var insertData = _.extend(submitProduct, {
          // "lendingPeriod": lendingPeriod,
          "ownerId": Meteor.userId(),
          "customPrice": Session.get('userPrice')
        })
        Products.insert(insertData);
        IonLoading.hide();
        IonPopup.show({
          title: 'Your Product sucessfully submitted',
          template: '<div class="center">You can find this shared product under "Owned" in the left menu</div>',
          buttons: 
          [{
            text: 'OK',
            type: 'button-assertive',
            onTap: function() {
              IonPopup.close();
              Router.go('/mybooks');
              IonModal.close();
            }
          }]
        });
      } else {
        IonLoading.hide();
        IonPopup.show({
          title: 'Nothing to add!',
          template: '<div class="center">Scan or add a product to make it available on parti-O for others to find</div>',
          buttons: 
          [{
            text: 'OK',
            type: 'button-assertive',
            onTap: function() {
              IonPopup.close();
            }
          }]
        });
      }
    }, 500)  
  },
  'keyup #userPrice': function(e, template) {
    Session.set('userPrice', e.target.value);
  },
  'click #cancelScan': function() {
    IonLoading.hide();
  },
  'click #manualSubmit': function(e, template) {
    IonLoading.show();
    var manualCode = template.find('#manualInput').value;
    var codeFormat = (function() {
      return (manualCode.length === 12) ? "UPC" : "EAN"; 
    })();
    console.log(manualCode, codeFormat);
    
    Meteor.call('priceFromAmazon', manualCode, codeFormat, function(error, result) {
      console.log(result);
      var resultFromAmazon = {};
      if (!error) {
        Session.set('scanResult', result);
        IonLoading.hide();
      } else {
        console.log(error);
        IonLoading.hide();
        IonPopup.show({
          title: 'Please try again or manually enter your product :( ',
            template: '<div class="center">'+ error.message + '</div>',
            buttons: 
            [{
              text: 'OK',
              type: 'button-assertive',
              onTap: function() {
                IonPopup.close();
              }
            }]
          });
      }
    });
  }
})

Template.lend.helpers({
  scanResult: function() {
    return Session.get('scanResult');
  },
  calculatedPrice: function() {
    if (Session.get('scanResult')) {
      if (Session.get('scanResult').price === "--") {
        return false;
      } else {
        var priceValue = (Session.get('scanResult').price).split("$")[1];
        Session.set('userPrice', (Number(priceValue)/5).toFixed(2));
        return (Number(priceValue)/5).toFixed(2);
      }
    }
  },
  waitingForPrice: function() {
    return Session.get('userPrice') ? "": "disabled";
  },
  userPrice: function() {
    return Session.get('userPrice');
  },
  bookResult: function() {
    return (Session.get('scanResult').category === "Book") ? true : false;
  }
});

Template.lend.destroyed = function() {
  Session.set('scanResult', null)
}




