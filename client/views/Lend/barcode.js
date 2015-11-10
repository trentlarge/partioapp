Template.barcode.rendered = function(){
    Session.set('placeholder', "Enter barcode number..");   
};

Template.barcode.destroyed = function(){
    Session.set('placeholder', "Search product..");   
};

Template.barcode.events({

  // BARCODE
  'click #barcode': function() {
    PartioLoad.show();
    console.log('the new Amazon call in progress');

    // Cordova
    if (Meteor.isCordova) {
      cordova.plugins.barcodeScanner.scan(
        function(result) {

          if (result.cancelled === 0) {
            console.log(result.text, result.format);

            var barcode = result.text;
            console.log('barcode: ' + barcode);
            // var format = result.format;
            // var cleanFormat = format.split('_')[0];
            Meteor.call('priceFromAmazon', barcode, function(error, result) {
              //console.log(result);
              var resultFromAmazon = {};
              console.log('error: '+ error);
              if (!error)
              {
                console.log('result: '+ result);
                Session.set('scanResult', result);
                Session.set('lendTab', 'results');
                PartioLoad.hide();

              } else {

                PartioLoad.hide();
                console.log(error);
                IonPopup.show({
                  title: 'No match found :( ',
                    template: '<div class="center">You can manually checkin your product</div>',
                    buttons:
                    [{
                      text: 'OK',
                      type: 'button-energized',
                      onTap: function() {
                        IonPopup.close();
                      }
                    }]
                  });
              }
            });
          } else {
            PartioLoad.hide();
          }
        },

        function(error) {
          alert("Scanning failed: " + error);
        })

    // not cordova
    } else {

      Meteor.call('priceFromAmazon', 9780439708180, function(error, result) {
        console.log(result);
        var resultFromAmazon = {};
        if (!error) {
          Session.set('scanResult', result);
          Session.set('lendTab', 'results');
          PartioLoad.hide();
        } else {
          console.log(error);
          PartioLoad.hide();
          IonPopup.show({
            title: 'Please try again or manually enter your product :( ',
              template: '<div class="center">'+ error.message + '</div>',
              buttons:
              [{
                text: 'OK',
                type: 'button-energized',
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
