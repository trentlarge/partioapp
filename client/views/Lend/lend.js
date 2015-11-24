Template.lend.events({
  'click .submitProduct': function(e, template) {
    PartioLoad.show();

    Meteor.setTimeout(function(){

      //MANUAL INSERT BOOK ---------------------------------------------
      if (Session.get('lendTab') === 'manual') {
        var manualProduct = {
              "title": $('.manualTitle').val(),
              "price": '--',
              'searchId': null,
              //"authors": template.find('#manualauthor').value,
              //"publisher": template.find('#manualpublisher').value,
              "conditionId": $('.manualCondition').val(),
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

        if(!validateInputs(manualProduct)){
            PartioLoad.hide();
            return;
        }

        Lend.addProductToInventoryManually(manualProduct);
        Lend.latestProduct = undefined;
        
      //BAR CODE & CAMFIND ---------------------------------------------
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
      }, 500)
  },

})

Template.lend.helpers({
    dynamicTemplate: function(){
        return (Session.get('lendTab')) ? Session.get('lendTab') : 'camfind' ;
    }
});

Template.lend.rendered = function() {
     
    //Session.set('scanResult', null);
    //Session.set('allResults', null);
    
    Session.set('lendTab', 'camfind');
}

    

function validateInputs(details) {
    
    if(!details.title || details.title.length < 1) {
        showInvalidPopUp('Invalid Inputs', 'Please enter a valid Title.');
        return false;
    }

    if(!details.conditionId || details.conditionId < 1) {
        showInvalidPopUp('Invalid Inputs', 'Please enter a valid Condition of the item.');
        return false;
    }

    return true;
}

function showInvalidPopUp(strTitle, strMessage) {
    
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

//function ClearData(){
//    console.log('ClearData');
//
//    if(Session.get('lendTab') == 'results') {
//    Session.set('lendTab', 'camfind');
//    }
//
//    Session.set('scanResult', null);
//    Session.set('priceValue', null);
//    Session.set('priceValue', null);
//    Session.set('barcodeEntry', null);
//    Session.set('manualEntry', null);
//    Session.set('photoTaken', null)
//    Session.set('lastSearch', null);
//    Session.set('allResults', null)
//  
//    //reset prices;
//    Session.set('dayPrice', null);
//    Session.set('weekPrice', null);
//    Session.set('monthPrice', null);
//    Session.set('semesterPrice', null);
//}

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
