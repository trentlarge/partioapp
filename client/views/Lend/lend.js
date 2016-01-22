Template.lend.events({
  'click .submitProduct': function(e, template) {

    PartioLoad.show();

    //Meteor.setTimeout(function(){

      //MANUAL INSERT BOOK ---------------------------------------------
      if (Session.get('lendTab') === 'manual') {
          
        var images = (function() {
            var images = [];
            if(Session.get('slideElements')) {
                var slideElements = Session.get('slideElements');
                $.each(slideElements, function(index, slideElement) {
                    if(slideElement.photo !== '') {
                        images.push(slideElement);
                    }
                })
            }
            return images;
        })();  
          
        var manualProduct = {
          "title": $('.manualTitle').val().toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
          }),
          "price": '--',
          "conditionId": $('.manualCondition').val(),
          "manualEntry": true,
          "ownerId": Meteor.userId(),
          "ownerArea": Meteor.user().profile.area,
          "category": $('.manualCategory').val(),
          "amazonCategory": $('.manualCategory').val(),
          "image": (function() {
            if(images[0]) {
              return images[0].photo;
            } else {
              return '/image-not-available.png';
            }
          })(),
          "images": images,
          "rentPrice": {
            "day": Number(Session.get('dayPrice')).toFixed(2),
            "week": Number(Session.get('weekPrice')).toFixed(2),
            "month": Number(Session.get('monthPrice')).toFixed(2),
            "semester": Number(Session.get('semesterPrice')).toFixed(2)
          },
          "selling": {
              "price": Number(Session.get('sellingPrice')).toFixed(2),
              "status": $('.enablePurchasing').text() 
          }
        }

        Meteor.call('userCanShare', function(error, result){
          PartioLoad.hide();
          
          if(!result) {
            Session.set('cardManualEntry', manualProduct);
            
            IonPopup.show({
              title: 'Update profile',
              template: 'Please, update your debit card to share this item.',
              buttons: [{
                text: 'OK',
                type: 'button-energized',
                onTap: function() {
                  IonPopup.close();
                  Router.go('/profile/savedcards/');
                }
              }]
            });
            return false;

          } else {
            if(!validateInputs(manualProduct)){
              PartioLoad.hide();
              return;
            }

            Lend.addProductToInventoryManually(manualProduct);
            Lend.latestProduct = undefined;

          }
        });

      //BAR CODE & CAMFIND ---------------------------------------------
      } else {
        PartioLoad.hide();
        IonPopup.show({
          title: 'Nothing to add!',
          template: 'Scan or add a product to make it available on partiO for others to find.',
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
    //}, 500)
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

  if(Session.get('cardManualEntry')) {
    Session.set('lendTab', 'manual');
    Session.set('cardManualEntry', null)
  } else {
    Session.set('lendTab', 'camfind');
  }
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

  var lowerValue = 1,
      highestValue = 1000000;
    
  var sellingPrice = parseFloat(details.selling.price, 10);

  if(details.selling.status === 'ON' && (sellingPrice < lowerValue || sellingPrice >= highestValue)) {
    showInvalidPopUp('Invalid Inputs', 'Please add a valid purchasing price.');  
    return false;
  }

  return true;
}

function showInvalidPopUp(strTitle, strMessage) {
  IonPopup.show({
    title: strTitle,
    template: strMessage,
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
