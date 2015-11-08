Template.lend.events({
  'click .submitProduct': function(e, template) {
    PartioLoad.show();

    Meteor.setTimeout(function(){

      //MANUAL INSERT BOOK ---------------------------------------------
      if (Session.get('lendTab') === 'manual') {
        var manualBook = {
          "title": $('#manualtitle').val(),
          //"authors": template.find('#manualauthor').value,
          //"publisher": template.find('#manualpublisher').value,
          "comments": $('#manualcomments').val(),
          "manualEntry": true,
          "ownerId": Meteor.userId(),
          "customPrice": Session.get('userPrice'),
          "image": Session.get('photoTaken')
        }
        console.log(manualBook);

        if(!ValidateInputs(manualBook)){
          PartioLoad.hide();
          return;
        }

        //TEST
        //GetRentingPercentages('ONE_WEEK');

        if (manualBook.title && manualBook.customPrice){
          Session.set('manualBook', manualBook);
          Session.set('BookAddType', 'MANUAL');

          //if(CheckStripeAccount())
          //{
          AddProductToInventoryManually();
          //}

        } else {
          PartioLoad.hide();
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

      //BAR CODE & CAMFIND ---------------------------------------------
      } else {
        if (Session.get('scanResult')) {
          // var lendingPeriod = (function() {
          //   return (template.find('#lendingPeriod').value) ? template.find('#lendingPeriod').value : 2;
          // }) ();

          //TEST
          //GetRentingPercentages('ONE_WEEK');

          var xPrice = parseFloat(Session.get('userPrice'), 10);
          console.log('xPrice ' + xPrice);
          if(xPrice < 0.5)
          {
            PartioLoad.hide();
            showInvalidPopUp('Invalid Inputs', 'Please valid rent price.');
            return;
          }

          if(xPrice > 1000)
          {
            PartioLoad.hide();
            showInvalidPopUp('Invalid Inputs', 'Please rent price < $1000.');
            return;
          }

          //if(CheckStripeAccount())
          //{
          Session.set('BookAddType', 'SCAN');
          AddProductToInventory();
          //}

        } else {
          PartioLoad.hide();
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

  'keyup .userPrice': function(e, template){
    Session.set('userPrice', e.target.value);
  },

  'keyup .fieldDescriptionLend': function(e, template){
    Session.set('description', e.target.value);
  },

  'click #reset': function() {
    ClearData();
    PartioLoad.hide();

    //TEST METHOD
    //testCamFindMethod();
  },

  'click #closeLend': function() {
    $('.modal-backdrop').slideUp();
    ClearData();
    //IonPopup.close();
    //ClearData();
  },

  'click #manualSubmit': function(e, template) {
    PartioLoad.show();
    var manualCode = $('#manualInput').val();
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
  // scanResult: function() {
  //   return Session.get('scanResult');
  // },
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
    //return Session.get('userPrice') ? "": "";
  },
  userPrice: function() {
    console.log('price rendered: ' + Session.get('userPrice'));
    return Session.get('userPrice');
  },
  bookResult: function() {
//    return (Session.get('scanResult').category === "Book") ? true : false;
      return Session.get('scanResult');
  },

  dynamicTemplate: function(){
    return (Session.get('lendTab')) ? Session.get('lendTab') : 'camfind' ;
  },
});

// Template.lend.destroyed = function() {
//   Session.set('scanResult', null);
//   Session.set('barcodeEntry', null);
//   Session.set('manualEntry', null);
//   Session.set('photoTaken', null)
// }

Template.lend.rendered = function() {
  // Session.set('viewFinder', true);
  // reseting results
  // Session.set('scanResult', null);
  // Session.set('allResults', null);
  // Session.set('lendTab', 'camfind')
  // $('.tab-item[data-id=camfind]').addClass('active');

  if(Session.set('lendTab') == 'resultsCamFind' && !Session.get('allResults')){
    Session.set('lendTab', 'camfind');
  }
}


function ClearData(){
  console.log('ClearData');

  if(Session.get('lendTab') == 'resultsCamFind') {
    Session.set('lendTab', 'camfind');
  }

  RentingFinalPrice = null;
  Session.set('scanResult', null);
  Session.set('priceValue', null);
  Session.set('userPrice', null);
  Session.set('priceValue', null);
  Session.set('barcodeEntry', null);
  Session.set('manualEntry', null);
  Session.set('photoTaken', null)
  Session.set('lastSearchCamFind', '')
  Session.set('allResults', null)
}


//
// var RentingTimeSpan; //ONE_DAY, ONE_WEEK, ONE_MONTH, FOUR_MONTHS
// var RentingOneDayPercentage;
// var RentingOneWeekPercentage;
// var RentingOneMonthPercentage;
// var RentingFourMonthsPercentage;
// var RentingPartioSharePercentage;
// var RentingStripeFeePercent;
// var RentingStripeAdditionalFee;
// var RentingAmazonPrice;
// var RentingAmazonRentalPrice;
// var RentingFinalPrice;
//
// function CalculateRentingCharges()
// {
//   if(this.RentingTimeSpan == 'ONE_DAY')
//   {
//       this.RentingFinalPrice = parseFloat((this.RentingOneDayPercentage/100) * this.RentingAmazonPrice);
//
//       if(this.RentingFinalPrice < 3.00)
//           this.RentingFinalPrice = 3.00;
//   }
//   else if(this.RentingTimeSpan == 'ONE_WEEK')
//   {
//       this.RentingFinalPrice = parseFloat((this.RentingOneWeekPercentage/100) * this.RentingAmazonPrice);
//       console.log('RentingOneWeekPercentage: ' + this.RentingFinalPrice);
//
//       this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 7);
//       console.log('Pricex7: ' + this.RentingFinalPrice);
//
//       if(this.RentingFinalPrice < 7.00) //$1.00 per day
//           this.RentingFinalPrice = 7.00;
//   }
//   else if(RentingTimeSpan == 'ONE_MONTH')
//   {
//       this.RentingFinalPrice = parseFloat((this.RentingOneMonthPercentage/100) * this.RentingAmazonPrice);
//       this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 30);
//
//       if(this.RentingFinalPrice < 15.00) //$0.50 per day
//           this.RentingFinalPrice = 15.00;
//   }
//   else if(this.RentingTimeSpan == 'FOUR_MONTHS')
//   {
//       this.RentingFinalPrice = parseFloat((this.RentingFourMonthsPercentage/100) * this.RentingAmazonPrice);
//       this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 30 * 4);
//
//       if(this.RentingFinalPrice < 30.00) //$0.25 per day
//           this.RentingFinalPrice = 30.00;
//   }
//
//   console.log('RentingTimeSpan: ' + RentingTimeSpan);
//   console.log('RentingAmazonPrice: ' + RentingAmazonPrice);
//   console.log('RentingAmazonRentalPrice: ' + RentingAmazonRentalPrice);
//
//   RentingFinalPrice += parseFloat((RentingStripeFeePercent/100) * RentingFinalPrice);
//   console.log('RentingStripeFeePercent: ' + RentingFinalPrice);
//   RentingFinalPrice += parseFloat(RentingStripeAdditionalFee);
//   console.log('RentingStripeAdditionalFee: ' + RentingFinalPrice);
//
//   RentingFinalPrice += parseFloat((RentingPartioSharePercentage/100) * RentingFinalPrice);
//   console.log('RentingPartioSharePercentage: ' + RentingFinalPrice);
//
//   RentingFinalPrice = Math.round(Number((RentingFinalPrice).toFixed(1))).toFixed(2);
//   console.log('RentingFinalPrice: ' + Math.round(RentingFinalPrice));
// }
//
// function GetRentingPercentages(strRentingTimeSpan)
// {
//   console.log(strRentingTimeSpan);
//   console.log('aqui -x-x-x-x-x-x-x-x-');
//
//   RentingAmazonPrice = parseFloat(Session.get('priceValue'));
//   RentingTimeSpan = strRentingTimeSpan;
//   RentingOneDayPercentage = 2;
//   RentingOneWeekPercentage = 1;
//   RentingOneMonthPercentage = 0.5;
//   RentingFourMonthsPercentage = 0.25;
//
//   RentingPartioSharePercentage = 10;
//
//   RentingStripeFeePercent = 2.9;
//   RentingStripeAdditionalFee = 0.3;
//
//
//   CalculateRentingCharges();
// }
//
// function ClearRentingValue()
// {
//   RentingFinalPrice = 0.0;
// }

function ValidateInputs(details)
{
  if(!details.title ||
    details.title < 1)
  {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Title.');
    return false;
  }

//  if(!BookDetails.authors ||
//    BookDetails.authors < 1)
//  {
//    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Author Name.');
//    return false;
//  }

  if(!details.customPrice ||
    details.customPrice < 0.5)
  {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Price.');
    return false;
  }

  var xPrice = parseInt(details.customPrice, 10);
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

function AddProductToInventoryManually() {
  Products.insert(Session.get('manualBook'));
  Session.set('userPrice', null);
  Session.set('priceValue', null);
  PartioLoad.hide();
  IonPopup.show({
    title: 'Your Product sucessfully submitted',
    template: '<div class="center">You can find this shared item in your Repository</div>',
    buttons:
    [{
      text: 'OK',
      type: 'button-energized',
      onTap: function() {
        $('#closeLend').click();
        IonPopup.close();
        Router.go('/inventory');
        IonModal.close();
      }
    }]
  });
}

function AddProductToInventory() {
  var submitProduct = Session.get('scanResult');

  if(submitProduct.asin) {
    var _uniqueId = submitProduct.asin;
  } else if(product.ean) {
    var _uniqueId = submitProduct.ean;
  }

  var insertData = _.extend(submitProduct,
  {
    // "lendingPeriod": lendingPeriod,
    "ownerId": Meteor.userId(),
    "uniqueId": _uniqueId,
    "customPrice": Session.get('userPrice'),
    "description": Session.get('description'),
  });

  Products.insert(insertData);

  Session.set('userPrice', null);
  RentingFinalPrice = 0.0;
  PartioLoad.hide();

  IonPopup.show({
    title: 'Your Product sucessfully submitted',
    template: '<div class="center">And saved to your Inventory</div>',
    buttons:
    [{
      text: 'OK',
      type: 'button-energized',
      onTap: function() {
        $('#closeLend').click();
        IonPopup.close();
        Router.go('/inventory');
        // IonModal.close();
        // Meteor.setTimeout(function() {
        //   //CheckStripeAccount();
        // }, 1500)

      }
    }]
  });
}

// function updateSearchCollection(product) {
//   console.log('adding to search collection');
//
//   //ASIN or EAN (if barcode)
//   if(product.data.asin) {
//     var uniqueId = product.data.asin;
//   } else if(product.data.ean) {
//     var uniqueId = product.data.ean;
//   }
//
//   var findUnique = Search.findOne({ uniqueCode: uniqueId });
//
//   //first product with this title
//   if(!findUnique) {
//     Search.insert({ uniqueCode: uniqueId,
//                     image: product.data.image,
//                     prodIds: [ product._id ] })
//   } else {
//     findUnique.prodIds.push(product._id);
//     Search.update(findUnique._id, findUnique);
//   }
// }
