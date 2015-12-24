Template.lend.events({
  'click .submitProduct': function(e, template) {

        PartioLoad.show();

        Meteor.setTimeout(function(){

          //MANUAL INSERT BOOK ---------------------------------------------
          if (Session.get('lendTab') === 'manual') {
            var manualProduct = {
              "title": $('.manualTitle').val().toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
              }),
              "price": '--',
              "conditionId": $('.manualCondition').val(),
              "manualEntry": true,
              "ownerId": Meteor.userId(),
              "category": $('.manualCategory').val(),
              "amazonCategory": $('.manualCategory').val(),
              "image": (function() {
                if(Session.get('photoTaken')) {
                  return Session.get('photoTaken');
                } else {
                  return '';
                }
              })(),
              "rentPrice": {
                "day": Number(Session.get('dayPrice')).toFixed(2),
                "week": Number(Session.get('weekPrice')).toFixed(2),
                "month": Number(Session.get('monthPrice')).toFixed(2),
                "semester": Number(Session.get('semesterPrice')).toFixed(2)
              }
            }
            
            Meteor.call('userCanShare', function(error, result){
                PartioLoad.hide();
                if(!result) {
                    
                    Session.set('cardManualEntry', manualProduct);
                    console.log(Session.get('cardManualEntry'));
                    
                    IonPopup.show({
                      title: 'Update profile',
                      template: '<div class="center">Please, update your debit card to share this item.</div>',
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
                }
                else {

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
    
    if(Session.get('cardManualEntry')) {
        Session.set('lendTab', 'manual');
        Session.set('cardManualEntry', null)
    }
    else {
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
