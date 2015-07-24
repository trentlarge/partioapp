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
            // var format = result.format;
            // var cleanFormat = format.split('_')[0];
            Meteor.call('priceFromAmazon', barcode, function(error, result) {
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
          Meteor.call('priceFromAmazon', 9780439708180, function(error, result) {
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
  'click .submitProduct': function(e, template) {
    IonLoading.show();
    Meteor.setTimeout(function() {
      if (Session.get('manualEntry')) {
        var manualBook = {
          "title": template.find('#manualtitle').value,
          "authors": template.find('#manualauthor').value,
          "publisher": template.find('#manualpublisher').value,
          "comments": template.find('#manualcomments').value,
          "manualEntry": true,
          "ownerId": Meteor.userId(),
          "customPrice": Session.get('userPrice'),
          "image": Session.get('photoTaken')
        }
        console.log(manualBook);
        if (manualBook.title && manualBook.authors && manualBook.customPrice) {
          Products.insert(manualBook);
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
          title: 'Missing data!',
          template: '<div class="center">Please fill mandatory fields</div>',
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

      } else {
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
      }
    }, 500)  
  },
  'keyup .userPrice': function(e, template) {
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
  },
  'click #barcode-entry': function() {
    Session.set('barcodeEntry', true);
    Session.set('manualEntry', false);
    Session.set('viewFinder', false)
    $('#manualInput').focus();
  },
  'click #manual-entry': function() {
    Session.set('manualEntry', true);
    Session.set('barcodeEntry', false);
    Session.set('viewFinder', false)
  }
})

Template.lend.helpers({
  barcodeEntry: function() {
    return Session.get('barcodeEntry');
  },
  viewFinder: function() {
    return Session.get('viewFinder');
  },
  manualEntry: function() {
    return Session.get('manualEntry')
  },
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
  Session.set('scanResult', null);
  Session.set('barcodeEntry', null);
  Session.set('manualEntry', null);
  Session.set('photoTaken', null)
}


Template.lend.rendered = function() {
  Session.set('viewFinder', true);
}



Template.takePhoto.helpers({
  photoTaken: function() {
    return Session.get('photoTaken');
  }
})

Template.takePhoto.events({
  'click .scanResult-thumbnail': function(event, template) {
    IonActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Choose from Library' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
        console.log('Cancelled!');
      },
      buttonClicked: function(index) {
        if (index === 0) {
          navigator.camera.getPicture(onSuccess1, onFail1, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA
          });

          function onSuccess1(imageData) {
            console.log('camera working!');
            Session.set("photoTaken", "data:image/jpeg;base64," + imageData);
            return false;
          }

          function onFail1(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        if (index === 1) {
          navigator.camera.getPicture(onSuccess2, onFail2, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          });

          function onSuccess2(imageData) {
            console.log('photo library working!');
            Session.set("photoTaken", "data:image/jpeg;base64," + imageData);
            return false;
          }

          function onFail2(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        return true;
      }
    });
  }
});
