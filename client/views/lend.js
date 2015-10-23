Template.lend.events({
  'click .viewfinder': function() {
    IonLoading.show();
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
                      type: 'button-energized',
                      onTap: function() {
                        IonPopup.close();
                      }
                    }]
                  });
              }
            });
          } else {
            IonLoading.hide();
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

function testCamFindMethod()
{
  if (Meteor.isCordova)
  {
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
            template.imageData.set(imageData);

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

          function onSuccess2(imageData)
          {
            console.log('photo library working!');

            Meteor.call('camFindCall', imageData, function(error, result) {
              console.log(error);
              console.log(result);
            });

            // var imageBlob = b64toBlob("data:image/jpeg;base64," + imageData);

            // window.resolveLocalFileSystemURL(imagePath, function(fileEntry) {

            //     fileEntry.file(function(file) {

            //       var reader = new FileReader();
            //       reader.onloadend = function (evt) {
            //         console.log("read success");
            //         console.log(evt.target.result);

            //         //Test Code
            //         Meteor.call('camFindCall', evt.target.result, function(error, result) {
            //           console.log(error);
            //           console.log(result);
            //         });
            //       };
            //       reader.readAsBinaryString(file);

            //     })

            //   }, function(errorMessage)
            //   {
            //     console.log(errorMessage);
            //   });

            //template.imageData.set(imageData);



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
  else
  {
    console.log('file upload click');
    $('#myFile3').click();
  }
}

var b64toBlob = function(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/jpeg' });
}


var RentingTimeSpan; //ONE_DAY, ONE_WEEK, ONE_MONTH, FOUR_MONTHS
var RentingOneDayPercentage;
var RentingOneWeekPercentage;
var RentingOneMonthPercentage;
var RentingFourMonthsPercentage;
var RentingPartioSharePercentage;
var RentingStripeFeePercent;
var RentingStripeAdditionalFee;
var RentingAmazonPrice;
var RentingAmazonRentalPrice;
var RentingFinalPrice;

function CalculateRentingCharges()
{
  if(RentingTimeSpan == 'ONE_DAY')
  {
    RentingFinalPrice = parseFloat((RentingOneDayPercentage/100) * RentingAmazonPrice);
  }
  else if(RentingTimeSpan == 'ONE_WEEK')
  {
    RentingFinalPrice = parseFloat((RentingOneWeekPercentage/100) * RentingAmazonPrice);
    console.log('RentingOneWeekPercentage: ' + RentingFinalPrice);

    RentingFinalPrice = parseFloat(RentingFinalPrice * 7);
    console.log('Pricex7: ' + RentingFinalPrice);
  }
  else if(RentingTimeSpan == 'ONE_MONTH')
  {
    RentingFinalPrice = parseFloat((RentingOneMonthPercentage/100) * RentingAmazonPrice);
    RentingFinalPrice = parseFloat(RentingFinalPrice * 30);
  }
  else if(RentingTimeSpan == 'FOUR_MONTHS')
  {
    RentingFinalPrice = parseFloat((RentingFourMonthsPercentage/100) * RentingAmazonPrice);
    RentingFinalPrice = parseFloat(RentingFinalPrice * 30 * 4);
  }

  console.log('RentingTimeSpan: ' + RentingTimeSpan);
  console.log('RentingAmazonPrice: ' + RentingAmazonPrice);
  console.log('RentingAmazonRentalPrice: ' + RentingAmazonRentalPrice);

  RentingFinalPrice += parseFloat((RentingStripeFeePercent/100) * RentingFinalPrice);
  console.log('RentingStripeFeePercent: ' + RentingFinalPrice);
  RentingFinalPrice += parseFloat(RentingStripeAdditionalFee);
  console.log('RentingStripeAdditionalFee: ' + RentingFinalPrice);

  RentingFinalPrice += parseFloat((RentingPartioSharePercentage/100) * RentingFinalPrice);
  console.log('RentingPartioSharePercentage: ' + RentingFinalPrice);

  if(RentingFinalPrice > RentingAmazonRentalPrice)
  {
    RentingFinalPrice =  parseFloat(RentingAmazonRentalPrice - (RentingAmazonRentalPrice * 0.1));
  }

  RentingFinalPrice = Math.round(Number((RentingFinalPrice).toFixed(1))).toFixed(2);
  console.log('RentingFinalPrice: ' + Math.round(RentingFinalPrice));


}

function GetRentingPercentages(strRentingTimeSpan)
{
  RentingAmazonPrice = parseFloat(Session.get('priceValue'));
  RentingTimeSpan = strRentingTimeSpan;
  RentingOneDayPercentage = 2;
  RentingOneWeekPercentage = 1;
  RentingOneMonthPercentage = 0.5;
  RentingFourMonthsPercentage = 0.25;

  RentingPartioSharePercentage = 10;

  RentingStripeFeePercent = 2.9;
  RentingStripeAdditionalFee = 0.3;

  //test value
  RentingAmazonRentalPrice = 100.0;

  CalculateRentingCharges();
}

function ClearRentingValue()
{
  RentingFinalPrice = 0.0;
}


Template.lend.events({
  'click .submitProduct': function(e, template) {
    IonLoading.show();
    Meteor.setTimeout(function()
    {
      if (Session.get('manualEntry'))
      {
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

        if(!ValidateInputs(manualBook))
        {
          IonLoading.hide();
          return;
        }

        //TEST
        //GetRentingPercentages('ONE_WEEK');

        if (manualBook.title && manualBook.authors && manualBook.customPrice)
        {
          Session.set('manualBook', manualBook);
          Session.set('BookAddType', 'MANUAL');

          if(CheckStripeAccount())
          {
            AddProductToInventoryManually();
          }
        }
        else {
          IonLoading.hide();
          IonPopup.show({
            title: 'Missing data!',
            template: '<div class="center">Please fill mandatory fields</div>',
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

      }
      else
      {
        if (Session.get('scanResult'))
        {
          // var lendingPeriod = (function() {
          //   return (template.find('#lendingPeriod').value) ? template.find('#lendingPeriod').value : 2;
          // }) ();

          //TEST
          //GetRentingPercentages('ONE_WEEK');

          var xPrice = parseFloat(Session.get('userPrice'), 10);
          console.log('xPrice ' + xPrice);
          if(xPrice < 0.5)
          {
            IonLoading.hide();
            showInvalidPopUp('Invalid Inputs', 'Please valid rent price.');
            return;
          }

          if(xPrice > 1000)
          {
            IonLoading.hide();
            showInvalidPopUp('Invalid Inputs', 'Please rent price < $1000.');
            return;
          }

          if(CheckStripeAccount())
          {
            Session.set('BookAddType', 'SCAN');
            AddProductToInventory();
          }

        }
        else
        {
          IonLoading.hide();
          IonPopup.show({
            title: 'Nothing to add!',
            template: '<div class="center">Scan or add a product to make it available on partiO for others to find</div>',
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
      }
    }, 500)
  },
  'keyup .userPrice': function(e, template)
  {
    Session.set('userPrice', e.target.value);
  },
  'click #cancelScan': function() {
    ClearData();
    IonLoading.hide();

    //TEST METHOD
    testCamFindMethod();

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
      if (!error)
      {
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
              type: 'button-energized',
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

function ValidateInputs(BookDetails)
{
  if(!BookDetails.title ||
    BookDetails.title < 1)
  {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Title.');
    return false;
  }

  if(!BookDetails.authors ||
    BookDetails.authors < 1)
  {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Author Name.');
    return false;
  }

  if(!BookDetails.customPrice ||
    BookDetails.customPrice < 0.5)
  {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Price.');
    return false;
  }

  var xPrice = parseInt(BookDetails.customPrice, 10);
  console.log('xPrice ' + xPrice);
  if(xPrice > 1000)
  {
    showInvalidPopUp('Invalid Inputs', 'Please enter a Price < 1000.');
    return false;
  }

  return true;
}

function showInvalidPopUp(strTitle, strMessage)
{
  IonPopup.show({
          title: strTitle,
          template: '<div class="center">'+strMessage+'</div>',
          buttons:
          [{
            text: 'OK',
            type: 'button-energized',
            onTap: function()
            {
              IonPopup.close();
            }
          }]
        });
}


function AddProductToInventoryManually()
{
  Products.insert(Session.get('manualBook'));
  Session.set('userPrice', null);
  Session.set('priceValue', null);
          IonLoading.hide();
          IonPopup.show({
            title: 'Your Product sucessfully submitted',
            template: '<div class="center">You can find this shared item in your Repository</div>',
            buttons:
            [{
              text: 'OK',
              type: 'button-energized',
              onTap: function() {
                IonPopup.close();
                Router.go('/inventory');
                IonModal.close();
              }
            }]
          });
}

function AddProductToInventory()
{
  var submitProduct = Session.get('scanResult');
  var insertData = _.extend(submitProduct,
  {
          // "lendingPeriod": lendingPeriod,
          "ownerId": Meteor.userId(),
          "customPrice": Session.get('userPrice')
  });

  Products.insert(insertData);
  Session.set('userPrice', null);
  RentingFinalPrice = 0.0;
        IonLoading.hide();
        IonPopup.show({
          title: 'Your Product sucessfully submitted',
          template: '<div class="center">And saved to your Inventory</div>',
          buttons:
          [{
            text: 'OK',
            type: 'button-energized',
            onTap: function() {
              Session.set('scanResult', null);
              IonPopup.close();
              Router.go('/inventory');
              IonModal.close();

              // Meteor.setTimeout(function() {
              //   //CheckStripeAccount();
              // }, 1500)

            }
          }]
        });
}

function CheckStripeAccount () {
  if (! Meteor.user().profile.stripeAccount)
  {
    IonLoading.hide();
    IonPopup.show({
      title: 'ATTENTION!',
      template: '<div class="center">A Debit Card should be linked to receive payments for your shared goods!</div>',
      buttons:
      [{
        text: 'Add Card',
        type: 'button-energized',
        onTap: function()
        {
          IonPopup.close();
          Router.go('/profile/savedcards');
          IonModal.close();
        }
      }]
    });

    return false;
  }
  else
  {
    return true;
  }
}

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
    if (Session.get('scanResult') &&
        Session.get('BookAddType') != 'MANUAL') {
      if (Session.get('scanResult').price === "--") {
        return false;
      }
      else
      {
        if(RentingFinalPrice == null ||
          RentingFinalPrice == 0)
        {
          var priceValue = (Session.get('scanResult').price).split("$")[1];
          console.log('priceValue: ' + priceValue);
          Session.set('priceValue', priceValue);

          Session.set('userPrice', (Number(priceValue)/5).toFixed(2));

          GetRentingPercentages('ONE_WEEK');
          Session.set('userPrice', RentingFinalPrice);

          // return (Number(priceValue)/5).toFixed(2);
          return RentingFinalPrice;
        }

        return RentingFinalPrice;
      }
    }
  },
  waitingForPrice: function() {
    return Session.get('userPrice') ? "": "disabled";
  },
  userPrice: function() {
    console.log('price rendered: ' + Session.get('userPrice'));
    return Session.get('userPrice');
  },
  bookResult: function() {
    return (Session.get('scanResult').category === "Book") ? true : false;
  },

});

Template.lend.destroyed = function() {
  Session.set('scanResult', null);
  Session.set('barcodeEntry', null);
  Session.set('manualEntry', null);
  Session.set('photoTaken', null)
}

function ClearData()
{
  console.log('ClearData');
  RentingFinalPrice = null;
  Session.set('scanResult', null);
  Session.set('priceValue', null);
  Session.set('userPrice', null);
  Session.set('priceValue', null);
  Session.set('barcodeEntry', null);
  Session.set('manualEntry', null);
  Session.set('photoTaken', null)
}

Template.lend.rendered = function() {
  Session.set('viewFinder', true);
  Session.set('lendTab', 'camfind')
  //reseting results
  Session.set('scanResult', null);

  Session.set('lendTab', 'camfind')
  $('.tab-item[data-id=camfind]').addClass('active');
}

Template.lend.helpers({
  dynamicTemplate: function(){
    return Session.get('lendTab');
  }
})


Template.takePhoto.helpers({
  photoTaken: function() {
    return Session.get('photoTaken');
  }
})

Template.takePhoto.events({
  'click .scanResult-thumbnail2': function(event, template) {
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

Template.results.helpers({
  scanResult: function() {
    return Session.get('scanResult');
  },
});
