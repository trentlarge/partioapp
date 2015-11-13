Template.lend.events({
  'click .submitProduct': function(e, template) {
    PartioLoad.show();

    Meteor.setTimeout(function(){

      //MANUAL INSERT BOOK ---------------------------------------------
      if (Session.get('lendTab') === 'manual') {
        var manualProduct = {
              "title": $('.manualTitle').val(),
              "price": '--',
              //"authors": template.find('#manualauthor').value,
              //"publisher": template.find('#manualpublisher').value,
              "description": $('.manualDescription').val(),
              "manualEntry": true,
              "ownerId": Meteor.userId(),
              "category": $('.manualCategory').val(),
              "amazonCategory": $('.manualCategory').val(),
              "image": Session.get('photoTaken'),
              "rentPrice": {
                      "day": Session.get('dayPrice'),
                      "week": Session.get('weekPrice'),
                      "month": Session.get('monthPrice'),
                      "semester": Session.get('semesterPrice')
              }
        }
        console.log(manualProduct);

        if(!ValidateInputs(manualProduct)){
          PartioLoad.hide();
          return;
        }

        if (manualProduct.title){
            
          Session.set('manualProduct', manualProduct);
          Session.set('BookAddType', 'MANUAL');
          Lend.addProductToInventoryManually(Session.get('manualProduct'));

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
          
            if(Lend.validatePrices()) {
                Session.set('BookAddType', 'SCAN');
                
                var submitProduct = Session.get('scanResult');
                
                if(submitProduct.asin) {
                    var _uniqueId = submitProduct.asin;
                } else if(product.ean) {
                    var _uniqueId = submitProduct.ean;
                }

                var product = _.extend(submitProduct,
                {
                    // "lendingPeriod": lendingPeriod,
                    "ownerId": Meteor.userId(),
                    "uniqueId": _uniqueId,
                    "description": Session.get('description'),
                    "rentPrice": {
                        "day": Session.get('dayPrice'),
                        "week": Session.get('weekPrice'),
                        "month": Session.get('monthPrice'),
                        "semester": Session.get('semesterPrice')
                    }
                });
                
                 Lend.addProductToInventory(product);   
            }

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

  'click #closeLend': function() {
    $('.modal-backdrop').slideUp();
    ClearData();
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
  },
    
  'click .back': function(e, template) {
        //temporary solution
        var inputBox = $('.search-share-header-input');
        var inputValue = inputBox.val();
        inputBox.val(Lend.latestProduct);
        inputBox.trigger({type: 'keypress', charCode: 13});
        inputBox.val(inputValue);
   },
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
  isScanResult: function() {
      console.log(Session.get('scanResult'));
    return Session.get('scanResult');
  }    
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
  Session.set('scanResult', null);
  Session.set('allResults', null);
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

function ValidateInputs(details)
{
  if(!details.title || details.title < 1) {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Title.');
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
